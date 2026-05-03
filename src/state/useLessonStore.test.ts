import type {
  LessonInputs,
  MaterialAnalysis,
  MaterialFile,
  MaterialRole,
  MaterialStatus,
} from "../engine/types"
import {
  createDefaultOutputContents,
  normalizeOutputContents,
} from "../engine/types"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useLessonStore } from "./useLessonStore"

beforeEach(() => {
  installTestLocalStorage()
})

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

function createMemoryLocalStorage(): Storage {
  const backing = new Map<string, string>()

  return {
    get length() {
      return backing.size
    },
    clear() {
      backing.clear()
    },
    getItem(key: string) {
      return backing.has(key) ? backing.get(key)! : null
    },
    key(index: number) {
      return Array.from(backing.keys())[index] ?? null
    },
    removeItem(key: string) {
      backing.delete(key)
    },
    setItem(key: string, value: string) {
      backing.set(key, String(value))
    },
  } as Storage
}

function installTestLocalStorage() {
  Object.defineProperty(globalThis, "localStorage", {
    value: createMemoryLocalStorage(),
    configurable: true,
    writable: true,
  })
}

async function loadFreshLessonStore() {
  vi.resetModules()
  const module = await import("./useLessonStore")
  return module.useLessonStore
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
    styleSettings:
      args.role === "exemplar"
        ? { mode: "inspiration", aspects: [], customInstructions: "", targets: ["shared"] }
        : null,
    fileBuffer: null,
    fileContent: "seeded content",
  }
}

describe("useLessonStore regeneration", () => {
  beforeEach(() => {
    globalThis.localStorage.clear()
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
      outputContents: createDefaultOutputContents(),
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

  it("addMaterial keeps burst-upload ids distinct even in the same clock tick", () => {
    vi.spyOn(Date, "now").mockReturnValue(1710000000000)
    vi.spyOn(Math, "random").mockReturnValue(0.123456789)

    try {
      const store = useLessonStore.getState()
      const firstId = store.addMaterial("curriculum", "first-source.txt")
      const secondId = store.addMaterial("curriculum", "second-source.txt")
      const thirdId = store.addMaterial("exemplar", "third-source.txt")

      expect(new Set([firstId, secondId, thirdId]).size).toBe(3)
    } finally {
      vi.restoreAllMocks()
    }
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

  it("keeps uploaded image provenance so bounded OCR recovery inputs remain traceable", () => {
    const store = useLessonStore.getState()
    const imageBytes = new Uint8Array([1, 2, 3, 4]).buffer
    const materialId = store.addMaterial("curriculum", "source-photo.png")

    store.setMaterialSource(materialId, {
      fileBuffer: imageBytes,
      fileContent: null,
    })

    const material = useLessonStore
      .getState()
      .materials.find((item) => item.id === materialId)

    expect(material).toBeTruthy()
    expect(material!.fileBuffer).toBe(imageBytes)
    expect(material!.fileContent).toBeNull()
  })
  it("processMaterial preserves pasted-text source provenance for non-file intake", async () => {
    const store = useLessonStore.getState()
    const materialId = store.addMaterial("curriculum", "Copied curriculum excerpt", {
      sourceKind: "pasted_text",
      sourceLabel: "Pasted text",
      sourceMimeType: "text/plain",
    })

    store.setMaterialSource(materialId, {
      fileBuffer: null,
      fileContent: [
        "RF.1.3",
        "Objective: Blend and read short a CVC words.",
        "Teacher says: Tap the sounds and read the word.",
      ].join("\n"),
      sourceKind: "pasted_text",
      sourceLabel: "Pasted text",
      sourceMimeType: "text/plain",
    })

    await useLessonStore.getState().processMaterial(materialId)

    const material = useLessonStore
      .getState()
      .materials.find((item) => item.id === materialId)

    expect(material).toBeTruthy()
    expect(material!.status).toBe("ready")
    expect(material!.sourceKind).toBe("pasted_text")
    expect(material!.sourceLabel).toBe("Pasted text")
    expect(material!.sourceMimeType).toBe("text/plain")
    expect(material!.analysis?.extractionMetadata?.provenance).toEqual({
      sourceKind: "pasted_text",
      sourceLabel: "Pasted text",
      originalType: "txt",
    })
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
    expect(material!.analysis!.reliability?.warnings.join(" ")).not.toContain(
      "No extraction metadata available."
    )
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
      outputContents: createDefaultOutputContents(),
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
  }, 10000)

  it("generateLesson creates a default-shell package when no materials are uploaded", async () => {
    useLessonStore.setState((state) => ({
      ...state,
      inputs: makeInputs({ standard: "" }),
      selectedLessonMode: "single",
      materials: [],
      blueprint: null,
      planningIdeas: null,
      lessonSpec: null,
      lessonPackage: null,
      lessonTrace: null,
      outputContents: createDefaultOutputContents(),
      missingAreaDecisions: {},
    }))

    expect(useLessonStore.getState().hasUsableMaterialsForGeneration()).toBe(true)
    expect(useLessonStore.getState().canGenerate()).toBe(true)

    await useLessonStore.getState().generateLesson()

    const state = useLessonStore.getState()

    expect(state.blueprint).toBeTruthy()
    expect(state.planningIdeas).toBeTruthy()
    expect(state.lessonSpec).toBeTruthy()
    expect(state.lessonPackage).toBeTruthy()
    expect(state.lessonTrace?.materialCounts.total).toBe(0)
    expect(state.lessonTrace?.selectedSources.curriculumMaterialIds).toEqual([])
    expect(state.lessonTrace?.selectedSources.exemplarMaterialIds).toEqual([])
    expect(state.blueprint?.sourceReadiness.warnings.join(" ")).toContain(
      "No usable curriculum materials"
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
      outputContents: createDefaultOutputContents(),
      missingAreaDecisions: {},
    }))

    await expect(useLessonStore.getState().generateLesson()).rejects.toThrow(
      "No usable materials are available for grounded generation. Add at least one usable curriculum or exemplar source material, or remove unusable sources to generate from teacher inputs only."
    )
  })
})


  it("persists lightweight workspace state for refresh-safe recovery", async () => {
    useLessonStore.setState((state) => ({
      ...state,
      inputs: makeInputs({ notes: "Persist me" }),
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
      outputContents: createDefaultOutputContents(),
      missingAreaDecisions: {},
    }))

    await useLessonStore.getState().generateLesson()
    const nextOutputContents = createDefaultOutputContents()
    nextOutputContents.lessonPlan.parts.teach = false
    nextOutputContents.assessments.types.formative_assessment = true
    nextOutputContents.groups.byTier.T2.small_group = true
    nextOutputContents.other.printables = true

    useLessonStore.getState().setOutputContents(nextOutputContents)
    useLessonStore.getState().setMaterialStyleSettings("exemplar-1", {
      mode: "selected_aspects",
      aspects: ["pacing", "teacher_prompts"],
      customInstructions: "Keep pacing and prompts.",
      targets: ["lesson_plan", "lesson_slides"],
    })

    const raw = globalThis.localStorage.getItem("lesson-generator8__workspace_v1")
    expect(raw).toBeTruthy()

    const snapshot = JSON.parse(raw!) as any

    expect(snapshot.inputs.notes).toBe("Persist me")
    expect(snapshot.outputContents).toEqual(normalizeOutputContents(nextOutputContents))
    expect(
      snapshot.materials.find((item: { id: string }) => item.id === "exemplar-1")?.styleSettings
    ).toEqual({
      mode: "selected_aspects",
      aspects: ["pacing", "teacher_prompts"],
      customInstructions: "Keep pacing and prompts.",
      targets: ["lesson_plan", "lesson_slides"],
    })
    expect(
      snapshot.materials.every((item: { fileBuffer: null }) => item.fileBuffer === null)
    ).toBe(true)
    expect(snapshot.blueprint).toBeNull()
    expect(snapshot.lessonPackage).toBeNull()
    expect(snapshot.lessonTrace).toBeNull()
  })

it("rehydrates persisted workspace state on fresh store load", async () => {
  globalThis.localStorage.clear()

  useLessonStore.setState((state) => ({
    ...state,
    inputs: makeInputs({ notes: "Persist me after refresh" }),
    materials: [
      makeMaterial({ id: "curriculum-refresh-1", name: "curriculum.txt", role: "curriculum" }),
      makeMaterial({ id: "exemplar-refresh-1", name: "exemplar.txt", role: "exemplar" }),
    ],
    blueprint: null,
    planningIdeas: null,
    lessonSpec: null,
    lessonPackage: null,
    lessonTrace: null,
    outputContents: createDefaultOutputContents(),
    missingAreaDecisions: {},
  }))

  const nextOutputContents = createDefaultOutputContents()
  nextOutputContents.lessonPlan.parts.opening = false
  nextOutputContents.lessonPlan.parts.differentiation = true
  nextOutputContents.assessments.types.formative_assessment = true
  nextOutputContents.groups.byTier.T2.small_group = true
  nextOutputContents.other.printables = true

  useLessonStore.getState().setOutputContents(nextOutputContents)
  useLessonStore.getState().setMaterialStyleSettings("exemplar-refresh-1", {
    mode: "selected_aspects",
    aspects: ["pacing", "teacher_prompts"],
    customInstructions: "Keep pacing and prompts after refresh.",
    targets: ["lesson_plan", "lesson_slides"],
  })

  await useLessonStore.getState().generateLesson()
  useLessonStore.getState().setMissingAreaDecision("centers", "leave_out")

  const expectedSelectedLessonMode = useLessonStore.getState().selectedLessonMode

  const freshStore = await loadFreshLessonStore()
  const state = freshStore.getState()

  expect(state.inputs.notes).toBe("Persist me after refresh")
  expect(state.selectedLessonMode).toBe(expectedSelectedLessonMode)
  expect(state.outputContents).toEqual(normalizeOutputContents(nextOutputContents))
  expect(state.missingAreaDecisions.centers).toBe("leave_out")
  expect(
    state.materials.find((item) => item.id === "exemplar-refresh-1")?.styleSettings
  ).toEqual({
    mode: "selected_aspects",
    aspects: ["pacing", "teacher_prompts"],
    customInstructions: "Keep pacing and prompts after refresh.",
    targets: ["lesson_plan", "lesson_slides"],
  })
  expect(state.blueprint).toBeTruthy()
  expect(state.planningIdeas).toBeTruthy()
  expect(state.lessonSpec).toBeTruthy()
  expect(state.lessonPackage).toBeTruthy()
  expect(state.lessonTrace).toBeTruthy()
})

describe("useLessonStore outputContents contract", () => {
  beforeEach(() => {
    globalThis.localStorage.clear()
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
      outputContents: createDefaultOutputContents(),
      missingAreaDecisions: {},
    }))
  })

  it("stores normalized outputContents and clears generated content when they change", async () => {
    await useLessonStore.getState().generateLesson()

    const nextOutputContents = createDefaultOutputContents()
    nextOutputContents.lessonPlan.parts.teach = false
    nextOutputContents.assessment.types.formative_assessment = true
    nextOutputContents.smallGroup.tiers.T2 = true
    nextOutputContents.other.printables = true

    useLessonStore.getState().setOutputContents(nextOutputContents)

    const state = useLessonStore.getState()

    expect(state.outputContents).toEqual(normalizeOutputContents(nextOutputContents))
    expect(state.blueprint).toBeNull()
    expect(state.planningIdeas).toBeNull()
    expect(state.lessonSpec).toBeNull()
    expect(state.lessonPackage).toBeNull()
    expect(state.lessonTrace).toBeNull()
    expect(state.missingAreaDecisions).toEqual({})
  })

  it("supports nested output toggle updates through the unified outputContents model", () => {
    const store = useLessonStore.getState()

    store.toggleOtherOutput("printables")
    store.toggleAssessmentType("formative_assessment")
    store.toggleGroupOutput("intervention")
    store.toggleLessonPlanPart("closure")
    store.toggleLessonPlanPart("closure")

    const state = useLessonStore.getState()

    expect(state.outputContents.lessonPlan.parts.closure).toBe(true)
    expect(state.outputContents.assessments.selected).toBe(true)
    expect(state.outputContents.assessments.types.formative_assessment).toBe(true)
    expect(state.outputContents.groups.selected).toBe(true)
    expect(state.outputContents.groups.byTier.T1.centers).toBe(false)
    expect(state.outputContents.groups.byTier.T2.small_group).toBe(true)
    expect(state.outputContents.groups.byTier.T3.intervention).toBe(true)
    expect(state.outputContents.other.printables).toBe(true)
  })
})
