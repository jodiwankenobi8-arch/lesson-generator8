import { describe, expect, it } from "vitest"
import { runLessonPipeline } from "./pipeline/runLessonPipeline"
import { LessonInputs, LessonMode, MaterialAnalysis, MaterialFile, MaterialRole } from "./types"

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
    fileBuffer: null,
    fileContent: null,
  }
}

function makeCurriculumMaterial(lines: string[]): MaterialFile {
  return makeMaterial({
    id: "curriculum-1",
    name: "curriculum.txt",
    role: "curriculum",
    analysis: {
      summary: "Curriculum test material",
      extractedText: lines,
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

function makeExemplarMaterial(lines: string[]): MaterialFile {
  return makeMaterial({
    id: "exemplar-1",
    name: "exemplar.txt",
    role: "exemplar",
    analysis: {
      summary: "Exemplar test material",
      extractedText: lines,
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

describe("runLessonPipeline", () => {
  it("builds blueprint, planning, lesson spec, and package end to end", () => {
    const inputs = makeInputs()
    const materials = [
      makeCurriculumMaterial([
        "Long A patterns ai and ay",
        "Word list rain train play day",
        "Practice word sort and partner decoding",
      ]),
      makeExemplarMaterial([
        "Slide 1 objective",
        "Slide 2 teach",
        "Slide 3 guided practice",
        "Slide 4 closure",
      ]),
    ]

    const result = runLessonPipeline(inputs, materials, "single")

    expect(result.blueprint).toBeTruthy()
    expect(result.planningIdeas).toBeTruthy()
    expect(result.lessonSpec).toBeTruthy()
    expect(result.lessonPackage).toBeTruthy()
    expect(result.lessonPackage.slides.length).toBeGreaterThan(0)
    expect(result.lessonPackage.lessonPlan.length).toBeGreaterThan(0)
  })

  it("does not expose a duplicate spec alias on the pipeline result", () => {
    const result = runLessonPipeline(
      makeInputs(),
      [makeCurriculumMaterial(["Long A patterns ai and ay"])],
      "single"
    )

    expect("spec" in result).toBe(false)
    expect(result.lessonSpec).toBeTruthy()
  })

  it("keeps a clear phonics lesson single-target instead of overfiring mixed mode", () => {
    const inputs = makeInputs({
      skill: "Long A phonics",
      topic: "Long A vowel patterns",
      standard: "RF.1.3",
    })

    const materials = [
      makeCurriculumMaterial([
        "Long A patterns ai and ay",
        "Word list rain train play day",
        "Practice word sort and partner decoding",
      ]),
    ]

    const result = runLessonPipeline(inputs, materials, "single")

    expect(result.blueprint.content.target.primary.toLowerCase()).toContain("phonics")
    expect(result.blueprint.content.target.isMixedTarget).toBe(false)
    expect(result.lessonPackage.readiness.lessonShape).toBe("single-focus")
  })

  it("marks a clearly mixed lesson as mixed when both targets are present", () => {
    const inputs = makeInputs({
      standard: "RF.1.3 + RL.1.2",
      skill: "Phonics and comprehension",
      topic: "Read long a words and retell the story",
    })

    const materials = [
      makeCurriculumMaterial([
        "Long A patterns ai and ay",
        "Read the decodable passage",
        "Retell the story after reading",
        "Practice word sort and partner discussion",
      ]),
      makeExemplarMaterial([
        "Opening",
        "Teach",
        "Guided Practice",
        "Independent Practice",
        "Closure",
      ]),
    ]

    const result = runLessonPipeline(inputs, materials, "full")

    expect(result.blueprint.content.target.isMixedTarget).toBe(true)
    expect(result.lessonPackage.readiness.lessonShape).toBe("mixed")
  })

  it("uses curriculum for content and exemplar for structure", () => {
    const inputs = makeInputs()

    const curriculum = makeCurriculumMaterial([
      "Long A patterns ai and ay",
      "Word list rain train play day",
      "Long A decodable passage",
      "Practice word sort and read and write",
    ])

    const exemplar = makeExemplarMaterial([
      "Opening",
      "Teach",
      "Guided Practice",
      "Independent Practice",
      "Closure",
      "Turn and talk",
      "Think aloud",
    ])

    const result = runLessonPipeline(inputs, [curriculum, exemplar], "single")

    const joinedWordLists = result.blueprint.content.wordLists.join(" ").toLowerCase()
    const joinedSegments = result.blueprint.structure.lessonSegments.join(" ").toLowerCase()
    const joinedTeacherMoves = result.blueprint.structure.teacherMoves.join(" ").toLowerCase()

    expect(joinedWordLists).toContain("rain")
    expect(joinedWordLists).toContain("train")

    expect(
      joinedSegments.includes("teach") ||
      joinedSegments.includes("guided") ||
      joinedSegments.includes("closure")
    ).toBe(true)

    expect(
      joinedTeacherMoves.includes("think aloud") ||
      joinedTeacherMoves.includes("turn and talk") ||
      joinedTeacherMoves.includes("prompt students to explain")
    ).toBe(true)
  })
})
