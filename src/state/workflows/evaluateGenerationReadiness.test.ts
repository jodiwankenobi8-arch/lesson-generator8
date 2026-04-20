import { describe, expect, it } from "vitest"
import { evaluateGenerationReadiness } from "./evaluateGenerationReadiness"
import type { LessonInputs, MaterialFile } from "../../engine/types"

function makeInputs(overrides: Partial<LessonInputs> = {}): LessonInputs {
  return {
    grade: "K",
    subject: "ELA",
    standard: "ELA.K.F.1.3",
    skill: "Long a phonics",
    topic: "Long a CVCe words",
    duration: "30 minutes",
    notes: "",
    ...overrides,
  }
}

function makeCurriculumMaterial(overrides: Partial<MaterialFile> = {}): MaterialFile {
  return {
    id: "curr-1",
    name: "curriculum.pdf",
    role: "curriculum",
    status: "ready",
    analysis: {
      summary: "Curriculum analysis",
      extractedText: ["curriculum source"],
      tags: ["curriculum"],
      sourceRole: "curriculum",
      reliability: {
        level: "high",
        usableForContent: true,
        usableForStructure: false,
        warnings: [],
        reasons: [],
        score: 90,
        contentDecision: "allow",
        structureDecision: "block",
      },
      curriculum: {
        standards: ["ELA.K.F.1.3"],
        vocabulary: [],
        wordLists: [],
        texts: [],
        practiceTasks: [],
        instructionalTargets: [],
        examples: [],
      },
    },
    analysisReview: null,
    errorMessage: null,
    styleSettings: null,
    sourceKind: "file_upload",
    sourceLabel: "curriculum.pdf",
    sourceMimeType: "application/pdf",
    fileBuffer: null,
    fileContent: "seed",
    ...overrides,
  }
}

describe("evaluateGenerationReadiness", () => {
  it("blocks generation when no ready curriculum source is available", () => {
    const result = evaluateGenerationReadiness({
      inputs: makeInputs(),
      materials: [],
      selectedLessonMode: "single",
    })

    expect(result.ready).toBe(false)
    expect(result.blockerMessage).toContain("add at least one curriculum source")
  })

  it("blocks generation when required curriculum grounding is still missing", () => {
    const result = evaluateGenerationReadiness({
      inputs: makeInputs(),
      materials: [makeCurriculumMaterial()],
      selectedLessonMode: "single",
    })

    expect(result.ready).toBe(false)
    expect(result.blockerMessage).toContain("classroom-ready")
  })

  it("allows generation when confirmed curriculum word examples and practice are present", () => {
    const readyMaterial = makeCurriculumMaterial({
      analysisReview: {
        standards: ["ELA.K.F.1.3"],
        vocabulary: ["long a", "silent e"],
        wordLists: ["cake", "game", "lake"],
        instructionalTargets: ["Read and decode long a CVCe words"],
        texts: ["Short long a decodable"],
        practiceIdeas: ["Read and sort long a words"],
        exemplarStructure: [],
        teacherSummary: "Use only the phonics portion from this source.",
      },
    })

    const result = evaluateGenerationReadiness({
      inputs: makeInputs(),
      materials: [readyMaterial],
      selectedLessonMode: "single",
    })

    expect(result.ready).toBe(true)
    expect(result.blockerMessage).toBeNull()
  })
})
