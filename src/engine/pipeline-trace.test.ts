import { describe, expect, it } from "vitest"
import { runLessonPipeline } from "./pipeline/runLessonPipeline"
import { LessonInputs, MaterialAnalysis, MaterialFile, MaterialRole } from "./types"

function makeInputs(overrides: Partial<LessonInputs> = {}): LessonInputs {
  return {
    grade: "1",
    subject: "ELA",
    standard: "RF.1.3",
    skill: "Long A phonics",
    topic: "Long A vowel patterns",
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
    transformationRequest: null,
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
      summary: "Curriculum test material",
      extractedText: [
        "Long A patterns ai and ay",
        "Word list rain train play day",
        "Practice word sort and partner decoding",
      ],
      tags: ["curriculum", "word work", "practice"],
      sourceRole: "curriculum",
      curriculum: {
        standards: ["RF.1.3"],
        vocabulary: ["vowel team", "long a"],
        wordLists: ["rain", "train", "play", "day"],
        texts: ["Long A decodable passage"],
        practiceTasks: ["word sort", "read and write", "partner decoding"],
        instructionalTargets: ["students will read long a words"],
        examples: ["rain", "play"],
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
      summary: "Exemplar test material",
      extractedText: [
        "Opening",
        "Teach",
        "Guided Practice",
        "Independent Practice",
        "Closure",
      ],
      tags: ["exemplar", "structure", "slide flow"],
      sourceRole: "exemplar",
      exemplar: {
        slideFlow: ["Opening", "Teach", "Guided Practice", "Independent Practice", "Closure"],
        pacing: ["5 minutes", "10 minutes", "10 minutes", "5 minutes"],
        teacherMoves: ["think aloud", "turn and talk", "prompt students to explain"],
        promptStyle: ["What do you notice?", "Explain your thinking."],
        layoutCues: ["header", "bullet", "image"],
        tone: ["clear", "supportive"],
        reusableStructure: ["I do", "We do", "You do", "Closure"],
      },
    },
  })
}

describe("lesson pipeline traceability", () => {
  it("returns a trace object with high-level pipeline metadata", () => {
    const result = runLessonPipeline(
      makeInputs(),
      [makeCurriculumMaterial(), makeExemplarMaterial()],
      "single"
    )

    expect(result.trace).toBeTruthy()
    expect(result.trace.selectedMode).toBe("single")
    expect(result.trace.materialCounts.total).toBe(2)
    expect(result.trace.materialCounts.curriculum).toBe(1)
    expect(result.trace.materialCounts.exemplar).toBe(1)
    expect(result.trace.target.primary.toLowerCase()).toContain("phonics")
    expect(Array.isArray(result.trace.blueprintWarnings)).toBe(true)
    expect(Array.isArray(result.trace.missingAreaPromptComponents)).toBe(true)
    expect(result.trace.package.lessonShape).toBe(result.lessonPackage.readiness.lessonShape)
    expect(result.trace.package.contentFit).toBe(result.lessonPackage.readiness.contentFit)
  })
})
