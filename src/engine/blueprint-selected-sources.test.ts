import { describe, expect, it } from "vitest"
import { analyzeMaterial } from "./materials/analyzeMaterial"
import { buildBlueprint } from "./blueprint/buildBlueprint"
import { ExtractionMetadata, LessonInputs, MaterialFile, MaterialRole } from "./types"

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

async function makeMaterial(args: {
  id: string
  name: string
  role: MaterialRole
  lines: string[]
  extractionMetadata?: ExtractionMetadata
}): Promise<MaterialFile> {
  const result = await analyzeMaterial({
    materialId: args.id,
    role: args.role,
    name: args.name,
    extractedText: args.lines,
    extractionMetadata: args.extractionMetadata,
  })

  return {
    id: args.id,
    name: args.name,
    role: args.role,
    status: "ready",
    analysis: result.analysis,
    errorMessage: null,
    styleSettings: null,
    transformationRequest: null,
    fileBuffer: null,
    fileContent: null,
  }
}

describe("blueprint selected source ids", () => {
  it("reports the strongest selected curriculum material id", async () => {
    const noisyCurriculum = await makeMaterial({
      id: "curr-noisy",
      name: "noisy-curriculum.pdf",
      role: "curriculum",
      lines: [
        "RF.1.3",
        "Objective: Students will read ai words.",
        "Vocabulary: ai pattern",
        "Word list: rain, train, sail, mail",
        "Text: The train was in the rain.",
        "Practice: sort ai words and read them aloud.",
        "Example: rain",
        "Teacher note: say the pattern clearly.",
      ],
      extractionMetadata: makeExtractionMetadata({
        method: "ocr",
        quality: "low",
        confidence: 0.34,
        ocrCandidate: true,
        ocrReason: "OCR recovery was needed.",
        notes: ["OCR text was noisy."],
      }),
    })

    const cleanCurriculum = await makeMaterial({
      id: "curr-clean",
      name: "clean-curriculum.txt",
      role: "curriculum",
      lines: [
        "RF.1.3",
        "Objective: Students will read long a words with silent e.",
        "Word list: cake, game, same, late",
        "Text: Jake made a cake at the lake.",
        "Practice: read the words and sort by pattern.",
      ],
      extractionMetadata: makeExtractionMetadata(),
    })

    const blueprint = buildBlueprint(
      makeInputs(),
      [noisyCurriculum, cleanCurriculum],
      "single"
    )

    expect(blueprint.sourceReadiness.selectedCurriculumMaterialIds).toEqual(["curr-clean"])
  })

  it("reports the strongest selected exemplar material id", async () => {
    const noisyExemplar = await makeMaterial({
      id: "ex-noisy",
      name: "noisy-exemplar.pdf",
      role: "exemplar",
      lines: [
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
      extractionMetadata: makeExtractionMetadata({
        method: "ocr",
        quality: "low",
        confidence: 0.39,
        ocrCandidate: true,
        ocrReason: "OCR recovery was needed.",
        notes: ["OCR text was noisy."],
      }),
    })

    const cleanExemplar = await makeMaterial({
      id: "ex-clean",
      name: "clean-exemplar.txt",
      role: "exemplar",
      lines: [
        "Opening",
        "Teach",
        "Guided Practice",
        "Closure",
        "Teacher prompt: What do you notice?",
        "5 minutes",
        "Layout cue: large word display",
      ],
      extractionMetadata: makeExtractionMetadata(),
    })

    const blueprint = buildBlueprint(
      makeInputs(),
      [noisyExemplar, cleanExemplar],
      "single"
    )

    expect(blueprint.sourceReadiness.selectedExemplarMaterialIds).toEqual(["ex-clean"])
  })

  it("prefers broader curriculum coverage when reliability is tied", async () => {
    const narrowCurriculum = await makeMaterial({
      id: "curr-narrow",
      name: "narrow-curriculum.txt",
      role: "curriculum",
      lines: [
        "RF.1.3",
        "Objective: Students will read long a words.",
        "Practice: Read the words aloud.",
        "Practice: Read the words aloud again.",
        "Practice: Read the words aloud with a partner.",
        "Example: cake",
        "Example: game",
        "Example: late",
      ],
      extractionMetadata: makeExtractionMetadata(),
    })

    const broadCurriculum = await makeMaterial({
      id: "curr-broad",
      name: "broad-curriculum.txt",
      role: "curriculum",
      lines: [
        "RF.1.3",
        "Objective: Students will read long a words and explain the pattern.",
        "Vocabulary: long a, silent e, vowel pattern.",
        "Word list: cake, game, same, late.",
        "Text: Jake made a cake at the lake.",
        "Practice: Read the words and sort by pattern.",
        "Sight words: said, they.",
        "Warm up: review yesterday's word pattern.",
      ],
      extractionMetadata: makeExtractionMetadata(),
    })

    const blueprint = buildBlueprint(
      makeInputs(),
      [narrowCurriculum, broadCurriculum],
      "single"
    )

    expect(blueprint.sourceReadiness.selectedCurriculumMaterialIds).toEqual(["curr-broad"])
    expect(blueprint.content.texts.join(" ").toLowerCase()).toContain("jake made a cake")
    expect(blueprint.content.vocabulary.join(" ").toLowerCase()).toContain("silent e")
  })
})
