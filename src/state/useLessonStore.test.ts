import type {
  LessonInputs,
  MaterialAnalysis,
  MaterialFile,
  MaterialRole,
  MaterialStatus,
} from "../engine/types"
import { beforeEach, describe, expect, it } from "vitest"
import { useLessonStore } from "./useLessonStore"

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

function makeAnalysis(role: MaterialRole, overrides: Partial<MaterialAnalysis> = {}): MaterialAnalysis {
  if (role === "curriculum") {
    return {
      sourceRole: "curriculum",
      summary: "Curriculum material",
      extractedText: ["RF.1.3", "Word list: cat, map, sat, ram"],
      tags: ["curriculum"],
      curriculum: {
        standards: ["RF.1.3"],
        vocabulary: ["short a"],
        wordLists: ["cat, map, sat, ram"],
        texts: ["A short decodable text."],
        practiceTasks: ["Blend cat, map, sat, ram."],
        instructionalTargets: ["Blend and read short a CVC words."],
        examples: ["cat"],
      },
      ...overrides,
    }
  }

  return {
    sourceRole: "exemplar",
    summary: "Exemplar material",
    extractedText: ["Opening", "Teach", "Practice", "Closure"],
    tags: ["exemplar"],
    exemplar: {
      slideFlow: ["Opening", "Teach", "Practice", "Closure"],
      pacing: ["5 min launch", "10 min model"],
      teacherMoves: ["Model blending"],
      promptStyle: ["Turn and talk"],
      layoutCues: ["Large word display"],
      tone: ["supportive"],
      reusableStructure: ["I do, we do, you do"],
    },
    ...overrides,
  }
}

function makeMaterial(args: {
  id: string
  name: string
  role: MaterialRole
  status?: MaterialStatus
  analysis?: MaterialAnalysis | null
}): MaterialFile {
  return {
    id: args.id,
    name: args.name,
    role: args.role,
    status: args.status ?? "ready",
    analysis: args.analysis ?? makeAnalysis(args.role),
    errorMessage: null,
    styleSettings: args.role === "exemplar" ? { mode: "inspiration", aspects: [], customInstructions: "" } : null,
    fileBuffer: null,
    fileContent: "seeded content",
  }
}

describe("useLessonStore regeneration", () => {
  beforeEach(() => {
    useLessonStore.setState((state) => ({
      ...state,
      inputs: makeInputs(),
      selectedLessonMode: "single",
      materials: [],
      blueprint: null,
      planningIdeas: null,
      lessonSpec: null,
      lessonPackage: null,
      lessonTrace: null,
      lessonRequest: {
        requestedLessonParts: [],
        requestedOutputs: [],
      },
      missingAreaDecisions: {},
    }))
  })

  it("processMaterial no-ops safely when material id is missing", async () => {
    const before = useLessonStore.getState()

    await useLessonStore.getState().processMaterial("missing-id")

    const after = useLessonStore.getState()
    expect(after.materials).toEqual(before.materials)
    expect(after.blueprint).toBe(before.blueprint)
    expect(after.lessonTrace).toBe(before.lessonTrace)
  })

  it("processMaterial marks material as error when no usable source content is available", async () => {
    const store = useLessonStore.getState()
    const materialId = store.addMaterial("curriculum", "empty-curriculum.txt")

    await useLessonStore.getState().processMaterial(materialId)

    const material = useLessonStore
      .getState()
      .materials.find((item) => item.id === materialId)

    expect(material).toBeTruthy()
    expect(material!.status).toBe("error")
    expect(material!.errorMessage).toBe("No file content is available for processing.")
  })

  it("processMaterial drives extracting -> analyzing -> ready and preserves extraction metadata", async () => {
    const store = useLessonStore.getState()
    const materialId = store.addMaterial("curriculum", "contract-curriculum.txt")

    store.setMaterialSource(materialId, {
      fileBuffer: null,
      fileContent: [
        "RF.1.3",
        "Objective: Students will blend and read short a CVC words.",
        "Vocabulary: short a",
        "Word list: cat, map, sat, ram",
        "Practice: Blend cat, map, sat, ram.",
      ].join("\n"),
    })

    const statusHistory: MaterialStatus[] = []

    const unsubscribe = useLessonStore.subscribe((state) => {
      const material = state.materials.find((item) => item.id === materialId)

      if (!material) return

      const last = statusHistory[statusHistory.length - 1]
      if (last !== material.status) {
        statusHistory.push(material.status)
      }
    })

    try {
      await useLessonStore.getState().processMaterial(materialId)
    } finally {
      unsubscribe()
    }

    const material = useLessonStore
      .getState()
      .materials.find((item) => item.id === materialId)

    expect(material).toBeTruthy()
    expect(material!.status).toBe("ready")
    expect(material!.analysis).toBeTruthy()
    expect(material!.analysis!.extractionMetadata).toBeTruthy()
    expect(statusHistory).toEqual(
      expect.arrayContaining(["extracting", "analyzing", "ready"])
    )

    const extractingIndex = statusHistory.indexOf("extracting")
    const analyzingIndex = statusHistory.indexOf("analyzing")
    const readyIndex = statusHistory.indexOf("ready")

    expect(extractingIndex).toBeGreaterThanOrEqual(0)
    expect(analyzingIndex).toBeGreaterThan(extractingIndex)
    expect(readyIndex).toBeGreaterThan(analyzingIndex)
  })

  it("generateLesson stores full package chain and keeps selected-source trace aligned, including regeneration", async () => {
    useLessonStore.setState((state) => ({
      ...state,
      inputs: makeInputs(),
      selectedLessonMode: "single",
      materials: [
        makeMaterial({ id: "curriculum-1", name: "curriculum.txt", role: "curriculum" }),
        makeMaterial({ id: "exemplar-1", name: "exemplar.txt", role: "exemplar" }),
      ],
      blueprint: null,
      planningIdeas: null,
      lessonSpec: null,
      lessonPackage: null,
      lessonTrace: null,
      lessonRequest: {
        requestedLessonParts: [],
        requestedOutputs: [],
      },
      missingAreaDecisions: {},
    }))

    await useLessonStore.getState().generateLesson()

    let state = useLessonStore.getState()

    expect(state.blueprint).toBeTruthy()
    expect(state.planningIdeas).toBeTruthy()
    expect(state.lessonSpec).toBeTruthy()
    expect(state.lessonPackage).toBeTruthy()
    expect(state.lessonTrace).toBeTruthy()

    expect(state.lessonTrace!.selectedSources.curriculumMaterialIds).toEqual(
      state.blueprint!.sourceReadiness.selectedCurriculumMaterialIds
    )
    expect(state.lessonTrace!.selectedSources.exemplarMaterialIds).toEqual(
      state.blueprint!.sourceReadiness.selectedExemplarMaterialIds
    )

    useLessonStore.getState().setMissingAreaDecision("centers", "leave_out")
    await useLessonStore.getState().generateLesson()

    state = useLessonStore.getState()

    expect(state.lessonTrace).toBeTruthy()
    expect(state.blueprint).toBeTruthy()
    expect(state.lessonTrace!.selectedSources.curriculumMaterialIds).toEqual(
      state.blueprint!.sourceReadiness.selectedCurriculumMaterialIds
    )
    expect(state.lessonTrace!.selectedSources.exemplarMaterialIds).toEqual(
      state.blueprint!.sourceReadiness.selectedExemplarMaterialIds
    )
  })

  it("generateLesson rejects ready-but-blocked materials with an honest usable-material error", async () => {
    useLessonStore.setState((state) => ({
      ...state,
      inputs: makeInputs(),
      selectedLessonMode: "single",
      materials: [
        makeMaterial({
          id: "blocked-curriculum",
          name: "blocked-curriculum.txt",
          role: "curriculum",
          analysis: makeAnalysis("curriculum", {
            reliability: {
              level: "low",
              score: 18,
              usableForContent: false,
              usableForStructure: false,
              contentDecision: "block",
              structureDecision: "block",
              reasons: ["Weak extracted text."],
              warnings: ["Blocked for grounding."],
            },
          }),
        }),
      ],
      blueprint: null,
      planningIdeas: null,
      lessonSpec: null,
      lessonPackage: null,
      lessonTrace: null,
      lessonRequest: {
        requestedLessonParts: [],
        requestedOutputs: [],
      },
      missingAreaDecisions: {},
    }))

    await expect(useLessonStore.getState().generateLesson()).rejects.toThrow(
      "No usable materials are available for grounded generation. Add at least one usable curriculum or exemplar source file."
    )
  })
})
describe("useLessonStore lesson request contract", () => {
  beforeEach(() => {
    useLessonStore.setState((state) => ({
      ...state,
      inputs: makeInputs(),
      selectedLessonMode: "single",
      materials: [
        makeMaterial({ id: "curriculum-request-1", name: "curriculum.txt", role: "curriculum" }),
        makeMaterial({ id: "exemplar-request-1", name: "exemplar.txt", role: "exemplar" }),
      ],
      blueprint: null,
      planningIdeas: null,
      lessonSpec: null,
      lessonPackage: null,
      lessonTrace: null,
      lessonRequest: {
        requestedLessonParts: [],
        requestedOutputs: [],
      },
      missingAreaDecisions: {},
    }))
  })

  it("stores requested lesson parts and clears generated content when they change", async () => {
    await useLessonStore.getState().generateLesson()

    useLessonStore.getState().setRequestedLessonParts([
      "teach",
      "small_group",
      "teach",
    ])

    const state = useLessonStore.getState()

    expect(state.lessonRequest.requestedLessonParts).toEqual([
      "teach",
      "small_group",
    ])
    expect(state.blueprint).toBeNull()
    expect(state.planningIdeas).toBeNull()
    expect(state.lessonSpec).toBeNull()
    expect(state.lessonPackage).toBeNull()
    expect(state.lessonTrace).toBeNull()
    expect(state.missingAreaDecisions).toEqual({})
  })

  it("stores requested outputs independently and supports toggle updates", () => {
    const store = useLessonStore.getState()

    store.setRequestedOutputs([
      "slides",
      "printables",
      "slides",
      "assessment",
    ])
    store.toggleRequestedOutput("printables")
    store.toggleRequestedOutput("intervention")
    store.toggleRequestedLessonPart("closure")
    store.toggleRequestedLessonPart("small_group")
    store.toggleRequestedLessonPart("closure")

    const state = useLessonStore.getState()

    expect(state.lessonRequest.requestedLessonParts).toEqual([
      "small_group",
    ])
    expect(state.lessonRequest.requestedOutputs).toEqual([
      "slides",
      "assessment",
      "intervention",
    ])
  })
})
