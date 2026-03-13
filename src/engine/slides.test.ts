import { describe, expect, it } from "vitest"
import { runLessonPipeline } from "./pipeline/runLessonPipeline"
import { buildSlidePlan } from "./slides/buildSlidePlan"
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

function makeSlidePlan(mode: LessonMode = "single") {
  const inputs = makeInputs()
  const materials = [
    makeCurriculumMaterial([
      "Long A patterns ai and ay",
      "Word list rain train play day",
      "Long A decodable passage",
      "Practice word sort and partner decoding",
    ]),
    makeExemplarMaterial([
      "Opening",
      "Teach",
      "Guided Practice",
      "Independent Practice",
      "Closure",
      "Turn and talk",
      "Think aloud",
    ]),
  ]

  const result = runLessonPipeline(inputs, materials, mode)
  const plan = buildSlidePlan(result.blueprint, result.lessonSpec)

  return { result, plan }
}

describe("slide engine", () => {
  it("generates expected core slide sequence", () => {
    const { plan } = makeSlidePlan()
    const kinds = plan.map((slide) => slide.kind)

    expect(kinds).toContain("objective")
    expect(kinds).toContain("teach")
    expect(kinds).toContain("guided_practice")
    expect(kinds).toContain("closure")
    expect(kinds).toContain("teaching_notes")
  })

  it("keeps objective first", () => {
    const { plan } = makeSlidePlan()
    expect(plan[0].kind).toBe("objective")
    expect(plan[0].title).toBe("Objective")
  })

  it("includes guided and independent practice when exemplar flow supports them", () => {
    const { plan } = makeSlidePlan()
    const kinds = plan.map((slide) => slide.kind)

    expect(kinds).toContain("guided_practice")
    expect(kinds).toContain("independent_practice")
  })

  it("includes closure and teaching notes", () => {
  const { plan } = makeSlidePlan()
  const kinds = plan.map((slide) => slide.kind)

  expect(kinds).toContain("closure")
  expect(kinds).toContain("teaching_notes")

  const closureIndex = kinds.indexOf("closure")
  const teachingNotesIndex = kinds.indexOf("teaching_notes")

  expect(closureIndex).toBeGreaterThanOrEqual(0)
  expect(teachingNotesIndex).toBeGreaterThanOrEqual(0)
})

  it("pulls curriculum content into slide bodies", () => {
    const { plan } = makeSlidePlan()
    const joinedBodies = plan.flatMap((slide) => slide.body).join(" ").toLowerCase()

    expect(joinedBodies).toContain("rain")
    expect(joinedBodies).toContain("train")
  })

  it("pulls exemplar structure into teacher-facing metadata", () => {
    const { plan } = makeSlidePlan()
    const joinedMoves = plan.map((slide) => slide.teacherMove).join(" ").toLowerCase()
    const joinedPrompts = plan.map((slide) => slide.promptStyle).join(" ").toLowerCase()

    expect(
      joinedMoves.includes("think aloud") ||
      joinedMoves.includes("turn and talk") ||
      joinedMoves.includes("prompt students to explain")
    ).toBe(true)

    expect(
      joinedPrompts.includes("what do you notice") ||
      joinedPrompts.includes("explain your thinking")
    ).toBe(true)
  })
})

