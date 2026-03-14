import { beforeEach, describe, expect, it } from "vitest"
import { useLessonStore } from "./useLessonStore"
import type {
  LessonInputs,
  MaterialAnalysis,
  MaterialFile,
  MaterialRole,
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
