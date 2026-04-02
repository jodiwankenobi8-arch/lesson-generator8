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
import { beforeEach, describe, expect, it } from "vitest"
import { useLessonStore } from "./useLessonStore"

function makeInputs(overrides: Partial<LessonInputs> = {}): LessonInputs {
  return {
    grade: "1",
    subject: "ELA",
    standard: "RF.1.3",
    skill: "Long A phonics",
    topic: "Decode and read long A vowel pattern words in a decodable passage",
    duration: "30 minutes",
    ...overrides,
  }
}

function makeAnalysis(role: MaterialRole, overrides: Partial<MaterialAnalysis> = {}): MaterialAnalysis {
  if (role === "curriculum") {
    return {
      sourceRole: "curriculum",
      summary: "Curriculum material",
      extractedText: ["RF.1.3", "Word list: cake, game, same, late"],
      tags: ["curriculum"],
      curriculum: {
        standards: ["RF.1.3"],
        vocabulary: ["long a"],
        wordLists: ["cake, game, same, late"],
        texts: ["Students read long a words in context."],
        practiceTasks: ["Read and sort long a words."],
        instructionalTargets: ["Decode and read long a vowel pattern words."],
        examples: ["cake"],
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
      pacing: ["5 min launch", "10 min model", "10 min practice"],
      teacherMoves: ["Model the target skill", "Guide student response"],
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
        ? { mode: "inspiration", aspects: [], customInstructions: "" }
        : null,
    fileBuffer: null,
    fileContent: "seeded content",
  }
}

beforeEach(() => {
  installTestLocalStorage()
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

describe("useLessonStore finish pass scenarios", () => {
  it("keeps phonics generation and exports classroom-ready", async () => {
    useLessonStore.setState((state) => ({
      ...state,
      inputs: makeInputs({
        standard: "RF.1.3",
        skill: "Long A phonics",
        topic: "Decode and read long A vowel pattern words in a decodable passage",
      }),
      selectedLessonMode: "single",
      materials: [
        makeMaterial({
          id: "curriculum-phonics",
          name: "phonics-curriculum.txt",
          role: "curriculum",
        }),
        makeMaterial({
          id: "exemplar-phonics",
          name: "phonics-exemplar.txt",
          role: "exemplar",
        }),
      ],
    }))

    await useLessonStore.getState().generateLesson()
    const state = useLessonStore.getState()

    expect(state.blueprint).toBeTruthy()
    expect(state.lessonPackage).toBeTruthy()

    expect(state.blueprint!.content.target.primary).toBe("phonics")
    expect(state.blueprint!.content.target.secondary).toBeNull()
    expect(state.blueprint!.content.target.isMixedTarget).toBe(false)

    expect(state.lessonPackage!.slides.length).toBeGreaterThan(0)
    expect(state.lessonPackage!.lessonPlan).toContain("Direct Instruction / Modeling")
    expect(state.lessonPackage!.exports.map((artifact) => artifact.kind)).toEqual(
      expect.arrayContaining(["full_package", "slides", "lesson_plan"])
    )
  })

  it("keeps comprehension generation and exports classroom-ready", async () => {
    useLessonStore.setState((state) => ({
      ...state,
      inputs: makeInputs({
        standard: "RL.1.2",
        skill: "Comprehension",
        topic: "Retell key details, identify main idea, and use text evidence from the story",
      }),
      selectedLessonMode: "single",
      materials: [
        makeMaterial({
          id: "curriculum-comprehension",
          name: "comprehension-curriculum.txt",
          role: "curriculum",
          analysis: makeAnalysis("curriculum", {
            extractedText: ["RL.1.2", "Retell key details from the story."],
            curriculum: {
              standards: ["RL.1.2"],
              vocabulary: ["main idea", "key details"],
              wordLists: [],
              texts: ["A teacher-provided story about a class garden."],
              practiceTasks: ["Retell the story and answer text-based questions."],
              instructionalTargets: ["Retell key details and answer questions with text evidence."],
              examples: ["The class planted seeds in the garden."],
            },
          }),
        }),
        makeMaterial({
          id: "exemplar-comprehension",
          name: "comprehension-exemplar.txt",
          role: "exemplar",
        }),
      ],
    }))

    await useLessonStore.getState().generateLesson()
    const state = useLessonStore.getState()

    expect(state.blueprint).toBeTruthy()
    expect(state.lessonPackage).toBeTruthy()

    expect(state.blueprint!.content.target.primary).toBe("comprehension")
    expect(state.blueprint!.content.target.secondary).toBeNull()
    expect(state.blueprint!.content.target.isMixedTarget).toBe(false)

    expect(state.lessonPackage!.slides.length).toBeGreaterThan(0)
    expect(state.lessonPackage!.lessonPlan).toContain("Guided Practice")
    expect(state.lessonPackage!.exports.map((artifact) => artifact.kind)).toEqual(
      expect.arrayContaining(["full_package", "slides", "lesson_plan"])
    )
  })

  it("keeps true mixed phonics plus comprehension lessons mixed through generation", async () => {
    useLessonStore.setState((state) => ({
      ...state,
      inputs: makeInputs({
        standard: "RF.1.3 and RL.1.2",
        skill: "Long A phonics and comprehension",
        topic: "Decode long A words in a decodable passage, then retell key details and answer comprehension questions with text evidence",
      }),
      selectedLessonMode: "single",
      materials: [
        makeMaterial({
          id: "curriculum-mixed",
          name: "mixed-curriculum.txt",
          role: "curriculum",
          analysis: makeAnalysis("curriculum", {
            extractedText: [
              "RF.1.3 and RL.1.2",
              "Decode long A words and retell key details from the passage.",
            ],
            curriculum: {
              standards: ["RF.1.3", "RL.1.2"],
              vocabulary: ["long a", "key details"],
              wordLists: ["cake, game, same, late"],
              texts: ["Students read a decodable story and retell key details."],
              practiceTasks: ["Decode target words, then retell the story with text evidence."],
              instructionalTargets: [
                "Decode long A words in connected text and retell key details.",
              ],
              examples: ["cake"],
            },
          }),
        }),
        makeMaterial({
          id: "exemplar-mixed",
          name: "mixed-exemplar.txt",
          role: "exemplar",
        }),
      ],
    }))

    await useLessonStore.getState().generateLesson()
    const state = useLessonStore.getState()

    expect(state.blueprint).toBeTruthy()
    expect(state.lessonPackage).toBeTruthy()

    expect(state.blueprint!.content.target.primary).toBe("phonics")
    expect(state.blueprint!.content.target.secondary).toBe("comprehension")
    expect(state.blueprint!.content.target.isMixedTarget).toBe(true)

    expect(state.lessonPackage!.lessonPlan).toContain("Mixed Target: Yes")
    expect(state.lessonPackage!.slides.length).toBeGreaterThan(0)
  })

  it("keeps weak exemplar lessons generatable and exports sane", async () => {
    const outputContents = createDefaultOutputContents()
    outputContents.other.printables = true

    useLessonStore.setState((state) => ({
      ...state,
      inputs: makeInputs({
        standard: "RF.1.3",
        skill: "Long A phonics",
        topic: "Decode and read long A vowel pattern words",
      }),
      selectedLessonMode: "single",
      outputContents: normalizeOutputContents(outputContents),
      materials: [
        makeMaterial({
          id: "curriculum-strong",
          name: "strong-curriculum.txt",
          role: "curriculum",
        }),
        makeMaterial({
          id: "exemplar-weak",
          name: "weak-exemplar.txt",
          role: "exemplar",
          analysis: makeAnalysis("exemplar", {
            reliability: {
              level: "low",
              score: 18,
              usableForContent: false,
              usableForStructure: false,
              contentDecision: "block",
              structureDecision: "block",
              reasons: ["Weak extracted text."],
              warnings: ["Blocked for exemplar structure."],
            },
          }),
        }),
      ],
    }))

    await useLessonStore.getState().generateLesson()
    const state = useLessonStore.getState()

    expect(state.blueprint).toBeTruthy()
    expect(state.lessonPackage).toBeTruthy()

    expect(state.blueprint!.sourceReadiness.exemplarSupport).not.toBe("strong")
    expect(state.lessonPackage!.exports.map((artifact) => artifact.kind)).toEqual(
      expect.arrayContaining(["full_package", "slides", "lesson_plan", "printables"])
    )

    const printablesExport = state.lessonPackage!.exports.find(
      (artifact) => artifact.kind === "printables"
    )

    expect(printablesExport).toBeTruthy()
    expect(printablesExport!.content).toContain("Centers & Support Printables Export")
    expect(printablesExport!.content).not.toContain("Lesson Hub")
  })
})
