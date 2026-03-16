import React from "react"
import { beforeEach, describe, expect, it } from "vitest"
import { MemoryRouter } from "react-router-dom"
import { renderToStaticMarkup } from "react-dom/server"
import App from "./App"
import { useLessonStore } from "./state/useLessonStore"
import type { LessonInputs, MaterialAnalysis, MaterialFile, MaterialRole } from "./engine/types"

function makeInputs(overrides: Partial<LessonInputs> = {}): LessonInputs {
  return {
    grade: "1",
    subject: "ELA",
    standard: "RF.1.3",
    skill: "Short a CVC words",
    topic: "Blend and read short a CVC words",
    duration: "30 minutes",
    ...overrides,
  }
}

function makeMaterial(args: {
  id: string
  name: string
  role: MaterialRole
  analysis: MaterialAnalysis
}): MaterialFile {
  return {
    id: args.id,
    name: args.name,
    role: args.role,
    status: "ready",
    analysis: args.analysis,
    errorMessage: null,
    styleSettings: null,
    fileBuffer: null,
    fileContent: null,
  }
}

function makeCurriculumMaterial(): MaterialFile {
  return makeMaterial({
    id: "curriculum-1",
    name: "curriculum.txt",
    role: "curriculum",
    analysis: {
      sourceRole: "curriculum",
      summary: "Curriculum material with clear phonics content support.",
      extractedText: ["RF.1.3", "Objective", "Vocabulary", "Word list"],
      tags: ["curriculum", "phonics", "short a"],
      curriculum: {
        standards: ["RF.1.3"],
        vocabulary: ["short a"],
        wordLists: ["cat, map, sat, ram"],
        texts: ["Decodable passage about a cat and a map."],
        practiceTasks: ["Blend cat, map, sat, ram."],
        instructionalTargets: ["Students will blend and read short a CVC words."],
        examples: ["cat"],
      },
    },
  })
}

function makeExemplarMaterial(): MaterialFile {
  return makeMaterial({
    id: "exemplar-1",
    name: "exemplar.txt",
    role: "exemplar",
    analysis: {
      sourceRole: "exemplar",
      summary: "Exemplar material with lesson structure support.",
      extractedText: ["Opening", "Teach", "Guided Practice", "Closure"],
      tags: ["exemplar", "structure", "slides"],
      exemplar: {
        slideFlow: ["Opening", "Teach", "Guided Practice", "Closure"],
        pacing: ["5 min launch", "10 min model", "10 min practice"],
        teacherMoves: ["Model blending", "Guide student response"],
        promptStyle: ["What do you notice?", "Turn and talk"],
        layoutCues: ["Large word display"],
        tone: ["explicit", "supportive"],
        reusableStructure: ["I do, we do, you do", "Center rotation"],
      },
    },
  })
}

describe("App route integration: Results trust flow", () => {
  beforeEach(async () => {
    useLessonStore.setState((state) => ({
      ...state,
      inputs: makeInputs(),
      selectedLessonMode: "single",
      materials: [makeCurriculumMaterial(), makeExemplarMaterial()],
      blueprint: null,
      planningIdeas: null,
      lessonSpec: null,
      lessonPackage: null,
      lessonTrace: null,
      missingAreaDecisions: {},
    }))

    await useLessonStore.getState().generateLesson()

    Object.assign(useLessonStore.getInitialState(), useLessonStore.getState())
  })

  it("renders Results route with source labels/names, trace ids, and source-vs-generated messaging", () => {
    const state = useLessonStore.getState()
    expect(state.blueprint).toBeTruthy()
    expect(state.lessonTrace).toBeTruthy()

    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/results"]}>
        <App />
      </MemoryRouter>
    )

    expect(markup).toContain("Results")
    expect(markup).toContain("Selected Curriculum Source(s):")
    expect(markup).toContain("curriculum.txt")
    expect(markup).toContain("Selected Exemplar Source:")
    expect(markup).toContain("exemplar.txt")
    expect(markup).toContain("Selected Source IDs")
    expect(markup).toContain("curriculum-1")
    expect(markup).toContain("exemplar-1")
    expect(markup).toContain("Source coverage:")
    expect(markup).toContain("Generated support:")
  })
})

