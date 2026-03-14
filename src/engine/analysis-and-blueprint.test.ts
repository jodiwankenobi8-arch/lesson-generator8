import { describe, expect, it } from "vitest"
import { analyzeMaterial } from "./materials/analyzeMaterial"
import { buildBlueprint } from "./blueprint/buildBlueprint"
import { ExtractionMetadata, LessonInputs, MaterialAnalysis, MaterialFile, MaterialRole } from "./types"

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

function makeExtractionMetadata(
  overrides: Partial<ExtractionMetadata> = {}
): ExtractionMetadata {
  return {
    method: "parser",
    quality: "high",
    confidence: 0.95,
    notes: [],
    ocrCandidate: false,
    ocrReason: null,
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

async function makeCurriculumFromLines(
  lines: string[],
  extractionMetadata?: ExtractionMetadata
): Promise<MaterialFile> {
  const result = await analyzeMaterial({
    materialId: "curriculum-1",
    role: "curriculum",
    name: "curriculum.txt",
    extractedText: lines,
    extractionMetadata,
  })

  return makeMaterial({
    id: "curriculum-1",
    name: "curriculum.txt",
    role: "curriculum",
    analysis: result.analysis,
  })
}

async function makeExemplarFromLines(
  lines: string[],
  extractionMetadata?: ExtractionMetadata
): Promise<MaterialFile> {
  const result = await analyzeMaterial({
    materialId: "exemplar-1",
    role: "exemplar",
    name: "exemplar.txt",
    extractedText: lines,
    extractionMetadata,
  })

  return makeMaterial({
    id: "exemplar-1",
    name: "exemplar.txt",
    role: "exemplar",
    analysis: result.analysis,
  })
}

describe("analyzeMaterial", () => {
  it("extracts curriculum phonics signals from usable lines", async () => {
    const result = await analyzeMaterial({
      materialId: "curriculum-1",
      role: "curriculum",
      name: "curriculum.txt",
      extractedText: [
        "RF.1.3",
        "Objective: Students will read long a words.",
        "Vocabulary: vowel team, long a",
        "Word list: rain, train, play, day",
        "Practice: word sort and partner decoding",
        "Decodable passage about a long a train ride",
      ],
    })

    expect(result.analysis.curriculum).toBeTruthy()

    const curriculum = result.analysis.curriculum!
    expect(curriculum.standards.join(" ").toLowerCase()).toContain("rf.1.3")
    expect(curriculum.vocabulary.join(" ").toLowerCase()).toContain("vocabulary")
    expect(curriculum.wordLists.join(" ").toLowerCase()).toContain("word list")
    expect(curriculum.practiceTasks.join(" ").toLowerCase()).toContain("practice")
  })

  it("extracts exemplar structure signals from usable lines", async () => {
    const result = await analyzeMaterial({
      materialId: "exemplar-1",
      role: "exemplar",
      name: "exemplar.txt",
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
      ],
    })

    expect(result.analysis.exemplar).toBeTruthy()

    const exemplar = result.analysis.exemplar!
    expect(exemplar.slideFlow.join(" ").toLowerCase()).toContain("opening")
    expect(exemplar.teacherMoves.join(" ").toLowerCase()).toContain("turn and talk")
    expect(exemplar.promptStyle.join(" ").toLowerCase()).toContain("what do you notice")
    expect(exemplar.pacing.join(" ").toLowerCase()).toContain("5 minutes")
  })

  it("filters obvious extraction noise", async () => {
    const result = await analyzeMaterial({
      materialId: "curriculum-1",
      role: "curriculum",
      name: "curriculum.txt",
      extractedText: [
        "123456",
        "!!!",
        "www.example.com",
        "slide 2",
        "RF.1.3",
        "Word list: rain, train, play, day",
      ],
    })

    const cleaned = result.analysis.extractedText.join(" ").toLowerCase()

    expect(cleaned).not.toContain("123456")
    expect(cleaned).not.toContain("www.example.com")
    expect(cleaned).not.toContain("slide 2")
    expect(cleaned).toContain("rf.1.3")
    expect(cleaned).toContain("word list")
  })
})

describe("buildBlueprint source readiness", () => {
  it("reports balanced when curriculum and exemplar are both strong", async () => {
    const curriculum = await makeCurriculumFromLines([
      "RF.1.3",
      "Vocabulary: vowel team, long a",
      "Word list: rain, train, play, day",
      "Decodable passage about a train ride",
      "Practice: word sort and partner decoding",
    ])

    const exemplar = await makeExemplarFromLines([
      "Opening",
      "Teach",
      "Guided Practice",
      "Closure",
      "Teacher prompt: What do you notice?",
      "Turn and talk",
      "5 minutes",
    ])

    const blueprint = buildBlueprint(makeInputs(), [curriculum, exemplar], "single")

    expect(blueprint.sourceReadiness.curriculumSupport).toBe("strong")
    expect(blueprint.sourceReadiness.exemplarSupport).toBe("strong")
    expect(blueprint.sourceReadiness.overall).toBe("balanced")
  })

  it("reports content-heavy when only curriculum is strong", async () => {
    const curriculum = await makeCurriculumFromLines([
      "RF.1.3",
      "Vocabulary: vowel team, long a",
      "Word list: rain, train, play, day",
      "Decodable passage about a train ride",
      "Practice: word sort and partner decoding",
    ])

    const blueprint = buildBlueprint(makeInputs(), [curriculum], "single")

    expect(blueprint.sourceReadiness.curriculumSupport).toBe("strong")
    expect(blueprint.sourceReadiness.exemplarSupport).toBe("limited")
    expect(blueprint.sourceReadiness.overall).toBe("content_heavy")
  })

  it("reports structure-heavy when only exemplar is strong", async () => {
    const exemplar = await makeExemplarFromLines([
      "Opening",
      "Teach",
      "Guided Practice",
      "Independent Practice",
      "Closure",
      "Teacher prompt: What do you notice?",
      "Turn and talk",
      "5 minutes",
    ])

    const blueprint = buildBlueprint(makeInputs(), [exemplar], "single")

    expect(blueprint.sourceReadiness.curriculumSupport).toBe("limited")
    expect(blueprint.sourceReadiness.exemplarSupport).toBe("strong")
    expect(blueprint.sourceReadiness.overall).toBe("structure_heavy")
  })

  it("prefers a cleaner curriculum source over a noisier OCR-heavy one for content", async () => {
    const noisyCurriculum = await makeCurriculumFromLines(
      [
        "RF.1.3",
        "Objective: Students will read ai words.",
        "Vocabulary: ai pattern",
        "Word list: rain, train, sail, mail",
        "Text: The train was in the rain.",
        "Practice: sort ai words and read them aloud.",
        "Example: rain",
        "Teacher note: say the pattern clearly.",
      ],
      makeExtractionMetadata({
        method: "ocr",
        quality: "low",
        confidence: 0.34,
        ocrCandidate: true,
        ocrReason: "OCR recovery was needed.",
        notes: ["OCR text was noisy."],
      })
    )

    const cleanCurriculum = await makeCurriculumFromLines(
      [
        "RF.1.3",
        "Objective: Students will read long a words with silent e.",
        "Word list: cake, game, same, late",
        "Text: Jake made a cake at the lake.",
        "Practice: read the words and sort by pattern.",
      ],
      makeExtractionMetadata()
    )

    const blueprint = buildBlueprint(
      makeInputs(),
      [noisyCurriculum, cleanCurriculum],
      "single"
    )

    const wordLists = blueprint.content.wordLists.join(" ").toLowerCase()
    const texts = blueprint.content.texts.join(" ").toLowerCase()

    expect(wordLists).toContain("cake")
    expect(wordLists).not.toContain("rain, train")
    expect(texts).toContain("jake made a cake")
  })

  it("prefers a cleaner exemplar source over a noisier OCR-heavy one for structure", async () => {
    const noisyExemplar = await makeExemplarFromLines(
      [
        "Opening",
        "Teach",
        "Guided Practice",
        "Independent Practice",
        "Closure",
        "Teacher prompt: Echo the line.",
        "Turn and talk",
        "12 minutes",
        "8 minutes",
        "Layout cue: title banner",
      ],
      makeExtractionMetadata({
        method: "ocr",
        quality: "low",
        confidence: 0.39,
        ocrCandidate: true,
        ocrReason: "OCR recovery was needed.",
        notes: ["OCR text was noisy."],
      })
    )

    const cleanExemplar = await makeExemplarFromLines(
      [
        "Opening",
        "Teach",
        "Guided Practice",
        "Closure",
        "Teacher prompt: What do you notice?",
        "5 minutes",
        "Layout cue: large word display",
      ],
      makeExtractionMetadata()
    )

    const blueprint = buildBlueprint(
      makeInputs(),
      [noisyExemplar, cleanExemplar],
      "single"
    )

    const prompts = blueprint.structure.promptStyle.join(" ").toLowerCase()
    const timing = blueprint.structure.timing.join(" ").toLowerCase()

    expect(prompts).toContain("what do you notice")
    expect(prompts).not.toContain("echo the line")
    expect(timing).toContain("5 minutes")
  })
})
