import { beforeEach, describe, expect, it } from "vitest"
import { useLessonStore } from "./useLessonStore"
import type {
  LessonInputs,
  MaterialAnalysis,
  MaterialFile,
  MaterialRole,
  MaterialStatus,
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
      extractedText: [
        "RF.1.3",
        "Objective: Students will blend and read short a CVC words.",
        "Vocabulary: short a",
        "Word list: cat, map, sat, ram",
        "Guided practice: Blend cat, map, sat, ram.",
        "Independent practice: Read the short a list.",
        "Closure: Read one final short a word aloud.",
      ],
      tags: ["curriculum", "phonics", "short a"],
      curriculum: {
        standards: ["RF.1.3"],
        vocabulary: ["short a"],
        wordLists: ["cat, map, sat, ram"],
        texts: ["Decodable passage about a cat and a map."],
        practiceTasks: [
          "Guided practice: Blend cat, map, sat, ram.",
          "Independent practice: Read the short a list.",
        ],
        instructionalTargets: [
          "Students will blend and read short a CVC words.",
        ],
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
      extractedText: [
        "Opening",
        "Teach",
        "Guided Practice",
        "Independent Practice",
        "Closure",
        "Teacher prompt: What do you notice?",
        "Turn and talk to your partner.",
        "5 minutes",
        "Supportive and clear tone",
        "Center rotation",
        "Teacher table reteach",
      ],
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

function seedStore() {
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
}

describe("useLessonStore regeneration", () => {
  beforeEach(() => {
    seedStore()
  })

  it("rebuilds the lesson package when centers are left out, then restores them when set back to undecided", async () => {
    await useLessonStore.getState().generateLesson()

    const initialState = useLessonStore.getState()
    expect(initialState.lessonPackage).toBeTruthy()
    expect(initialState.lessonTrace).toBeTruthy()
    expect(initialState.lessonPackage!.centers.length).toBeGreaterThan(0)
    expect(initialState.lessonPackage!.rotationPlan).toContain("Rotation 1")

    useLessonStore.getState().setMissingAreaDecision("centers", "leave_out")
    await useLessonStore.getState().generateLesson()

    const afterLeaveOut = useLessonStore.getState()
    expect(afterLeaveOut.missingAreaDecisions.centers).toBe("leave_out")
    expect(afterLeaveOut.lessonPackage).toBeTruthy()
    expect(afterLeaveOut.lessonTrace).toBeTruthy()
    expect(afterLeaveOut.lessonPackage!.centers).toHaveLength(0)
    expect(afterLeaveOut.lessonPackage!.rotationPlan).toContain("No centers defined.")

    useLessonStore.getState().setMissingAreaDecision("centers", "undecided")
    await useLessonStore.getState().generateLesson()

    const afterUndecided = useLessonStore.getState()
    expect(afterUndecided.missingAreaDecisions.centers).toBe("undecided")
    expect(afterUndecided.lessonPackage).toBeTruthy()
    expect(afterUndecided.lessonTrace).toBeTruthy()
    expect(afterUndecided.lessonPackage!.centers.length).toBeGreaterThan(0)
    expect(afterUndecided.lessonPackage!.rotationPlan).toContain("Rotation 1")
  })

  it("rebuilds support outputs when small group and intervention are left out, then restores them when set back to undecided", async () => {
    await useLessonStore.getState().generateLesson()

    useLessonStore.getState().setMissingAreaDecision("small_group", "leave_out")
    useLessonStore.getState().setMissingAreaDecision("intervention", "leave_out")
    await useLessonStore.getState().generateLesson()

    const afterLeaveOut = useLessonStore.getState()
    expect(afterLeaveOut.missingAreaDecisions.small_group).toBe("leave_out")
    expect(afterLeaveOut.missingAreaDecisions.intervention).toBe("leave_out")
    expect(afterLeaveOut.lessonPackage).toBeTruthy()
    expect(afterLeaveOut.lessonTrace).toBeTruthy()
    expect(afterLeaveOut.lessonPackage!.rotationPlan).toContain(
      "Teacher Table Focus: No small-group block selected."
    )
    expect(afterLeaveOut.lessonPackage!.lessonPlan).not.toContain("Small Group Ideas")
    expect(afterLeaveOut.lessonPackage!.lessonPlan).not.toContain("Intervention Ideas")
    expect(afterLeaveOut.lessonPackage!.interventions).toHaveLength(0)

    useLessonStore.getState().setMissingAreaDecision("small_group", "undecided")
    useLessonStore.getState().setMissingAreaDecision("intervention", "undecided")
    await useLessonStore.getState().generateLesson()

    const afterUndecided = useLessonStore.getState()
    expect(afterUndecided.missingAreaDecisions.small_group).toBe("undecided")
    expect(afterUndecided.missingAreaDecisions.intervention).toBe("undecided")
    expect(afterUndecided.lessonPackage).toBeTruthy()
    expect(afterUndecided.lessonTrace).toBeTruthy()
    expect(afterUndecided.lessonPackage!.rotationPlan).not.toContain(
      "Teacher Table Focus: No small-group block selected."
    )
    expect(afterUndecided.lessonPackage!.lessonPlan).toContain("Small Group Ideas")
    expect(afterUndecided.lessonPackage!.lessonPlan).toContain("Intervention Ideas")
    expect(afterUndecided.lessonPackage!.interventions.length).toBeGreaterThan(0)
  })
})

describe("useLessonStore processMaterial and trace contracts", () => {
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

  it("hasReadyMaterials stays false for status-only ready materials without analysis", () => {
    useLessonStore.setState((state) => ({
      ...state,
      materials: [
        {
          id: "status-only-ready",
          name: "status-only-ready.txt",
          role: "curriculum",
          status: "ready",
          analysis: null,
          errorMessage: null,
          styleSettings: null,
          fileBuffer: null,
          fileContent: null,
        },
      ],
    }))

    expect(useLessonStore.getState().hasReadyMaterials()).toBe(false)
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
    seedStore()

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
})
