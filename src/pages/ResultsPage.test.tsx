import React from "react"
import { beforeEach, describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import {
  CoverageDecisionsSection,
  PipelineTraceSection,
  TraceabilitySection,
} from "./ResultsPage"
import { useLessonStore } from "../state/useLessonStore"
import type {
  LessonInputs,
  MaterialAnalysis,
  MaterialFile,
  MaterialRole,
  MissingAreaDecisionChoice,
  PlanningComponentKey,
} from "../engine/types"

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

function seedAndGenerate() {
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

  return useLessonStore.getState().generateLesson()
}

function renderCoverageSection(
  decisions: Partial<Record<PlanningComponentKey, MissingAreaDecisionChoice>> = {},
  isRegenerating = false
): string {
  const state = useLessonStore.getState()

  return renderToStaticMarkup(
    <CoverageDecisionsSection
      planningIdeas={state.planningIdeas!}
      decisions={decisions}
      onSetDecision={async () => {}}
      isRegenerating={isRegenerating}
    />
  )
}

describe("Results explainability rendering contracts", () => {
  beforeEach(async () => {
    await seedAndGenerate()
  })

  it("renders selected curriculum/exemplar names and IDs from generated state with blueprint/trace alignment", () => {
    const state = useLessonStore.getState()
    const blueprint = state.blueprint!
    const lessonPackage = state.lessonPackage!
    const lessonTrace = state.lessonTrace!

    expect(lessonTrace.selectedSources.curriculumMaterialIds).toEqual(
      blueprint.sourceReadiness.selectedCurriculumMaterialIds
    )
    expect(lessonTrace.selectedSources.exemplarMaterialIds).toEqual(
      blueprint.sourceReadiness.selectedExemplarMaterialIds
    )

    const traceabilityMarkup = renderToStaticMarkup(
      <TraceabilitySection
        blueprint={blueprint}
        lessonPackage={lessonPackage}
        materials={state.materials}
      />
    )
    const traceMarkup = renderToStaticMarkup(<PipelineTraceSection trace={lessonTrace} />)

    blueprint.sourceReadiness.selectedCurriculumMaterialIds.forEach((id) => {
      const material = state.materials.find((item) => item.id === id)
      expect(material).toBeTruthy()
      expect(traceabilityMarkup).toContain(material!.name)
      expect(traceMarkup).toContain(id)
    })

    blueprint.sourceReadiness.selectedExemplarMaterialIds.forEach((id) => {
      const material = state.materials.find((item) => item.id === id)
      expect(material).toBeTruthy()
      expect(traceabilityMarkup).toContain(material!.name)
      expect(traceMarkup).toContain(id)
    })
  })

  it("keeps support-vs-generated gap messaging visible in coverage rendering", () => {
    const coverageMarkup = renderCoverageSection()

    expect(coverageMarkup).toContain("Coverage and Missing-Area Decisions")
    expect(coverageMarkup).toContain("Source coverage:")
    expect(coverageMarkup).toContain("Generated support:")
  })

  it("keeps explainability rendering synchronized after regeneration decisions", async () => {
    useLessonStore.getState().setMissingAreaDecision("centers", "leave_out")
    await useLessonStore.getState().generateLesson()

    const state = useLessonStore.getState()
    const blueprint = state.blueprint!
    const lessonPackage = state.lessonPackage!
    const lessonTrace = state.lessonTrace!

    expect(lessonTrace.selectedSources.curriculumMaterialIds).toEqual(
      blueprint.sourceReadiness.selectedCurriculumMaterialIds
    )
    expect(lessonTrace.selectedSources.exemplarMaterialIds).toEqual(
      blueprint.sourceReadiness.selectedExemplarMaterialIds
    )

    const traceabilityMarkup = renderToStaticMarkup(
      <TraceabilitySection
        blueprint={blueprint}
        lessonPackage={lessonPackage}
        materials={state.materials}
      />
    )
    const traceMarkup = renderToStaticMarkup(<PipelineTraceSection trace={lessonTrace} />)

    lessonTrace.selectedSources.curriculumMaterialIds.forEach((id) => {
      const material = state.materials.find((item) => item.id === id)
      expect(material).toBeTruthy()
      expect(traceabilityMarkup).toContain(material!.name)
      expect(traceMarkup).toContain(id)
    })

    lessonTrace.selectedSources.exemplarMaterialIds.forEach((id) => {
      const material = state.materials.find((item) => item.id === id)
      expect(material).toBeTruthy()
      expect(traceabilityMarkup).toContain(material!.name)
      expect(traceMarkup).toContain(id)
    })

    const coverageMarkup = renderCoverageSection(state.missingAreaDecisions)
    expect(coverageMarkup).toContain("Source coverage:")
    expect(coverageMarkup).toContain("Generated support:")
  })
})