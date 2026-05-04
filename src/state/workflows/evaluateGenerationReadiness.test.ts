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
  it("allows input-only generation when no materials are uploaded", () => {
    const result = evaluateGenerationReadiness({
      inputs: makeInputs(),
      materials: [],
      selectedLessonMode: "single",
    })

    expect(result.ready).toBe(true)
    expect(result.blockerMessage).toBeNull()
  })

  it("blocks generation when a curriculum source was added but no usable curriculum content is ready", () => {
    const result = evaluateGenerationReadiness({
      inputs: makeInputs(),
      materials: [
        makeCurriculumMaterial({
          status: "error",
          analysis: null,
          errorMessage: "No readable text was found.",
        }),
      ],
      selectedLessonMode: "single",
    })

    expect(result.ready).toBe(false)
    expect(result.blockerMessage).toContain("no usable curriculum content is ready")
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

  it("allows generation when teacher-confirmed math practice is present even if the extracted lane needed review", () => {
    const baseMaterial = makeCurriculumMaterial()
    const readyMaterial = makeCurriculumMaterial({
      analysis: {
        ...baseMaterial.analysis!,
        curriculum: {
          ...baseMaterial.analysis!.curriculum!,
          standards: ["2.NBT.B.5"],
          vocabulary: ["tens", "ones", "regroup", "sum", "equation"],
          wordLists: ["27 + 15", "38 + 24", "46 + 17"],
          texts: ["Use base-ten blocks to regroup ones into a ten."],
          practiceTasks: [],
          instructionalTargets: ["Add two-digit numbers with regrouping."],
          examples: ["27 + 15"],
        },
      },
      analysisReview: {
        standards: ["2.NBT.B.5"],
        vocabulary: ["tens", "ones", "regroup", "sum", "equation"],
        wordLists: ["27 + 15", "38 + 24", "46 + 17"],
        instructionalTargets: ["Add two-digit numbers with regrouping."],
        texts: ["Use base-ten blocks to regroup ones into a ten."],
        practiceIdeas: [
          "Students solve two-digit addition problems with base-ten blocks and explain when they regroup.",
        ],
        exemplarStructure: [],
        teacherSummary: "",
      },
    })

    const result = evaluateGenerationReadiness({
      inputs: makeInputs({
        grade: "2",
        subject: "Math",
        standard: "2.NBT.B.5",
        skill: "Two-digit addition with regrouping",
        topic: "Regrouping with base-ten blocks",
        duration: "35 minutes",
      }),
      materials: [readyMaterial],
      selectedLessonMode: "single",
    })

    expect(result.ready).toBe(true)
    expect(result.blockerMessage).toBeNull()
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
