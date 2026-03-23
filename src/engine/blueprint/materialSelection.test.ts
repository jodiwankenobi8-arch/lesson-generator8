import { describe, expect, it } from "vitest"
import { analyzeMaterial } from "../materials/analyzeMaterial"
import { ExtractionMetadata, MaterialFile, MaterialRole } from "../types"
import { selectStrongestEligibleMaterials } from "./materialSelection"

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

describe("selectStrongestEligibleMaterials", () => {
  it("excludes curriculum blocked for content even when raw content looks rich", async () => {
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

    const selected = selectStrongestEligibleMaterials(
      [noisyCurriculum, cleanCurriculum],
      "curriculum",
      "content"
    )

    expect(selected.map((material) => material.id)).toEqual(["curr-clean"])
  })

  it("excludes exemplar blocked for structure even when structure cues look rich", async () => {
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

    const selected = selectStrongestEligibleMaterials(
      [noisyExemplar, cleanExemplar],
      "exemplar",
      "structure"
    )

    expect(selected.map((material) => material.id)).toEqual(["ex-clean"])
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

    const selected = selectStrongestEligibleMaterials(
      [narrowCurriculum, broadCurriculum],
      "curriculum",
      "content"
    )

    expect(selected.map((material) => material.id).slice(0, 2)).toEqual([
      "curr-broad",
      "curr-narrow",
    ])
  })

  it("prefers broader exemplar structure when reliability is tied", async () => {
    const narrowExemplar = await makeMaterial({
      id: "ex-narrow",
      name: "narrow-exemplar.txt",
      role: "exemplar",
      lines: [
        "Opening",
        "Teach",
        "Closure",
        "Teacher prompt: Echo the line.",
        "5 minutes",
      ],
      extractionMetadata: makeExtractionMetadata(),
    })

    const broadExemplar = await makeMaterial({
      id: "ex-broad",
      name: "broad-exemplar.txt",
      role: "exemplar",
      lines: [
        "Opening",
        "Teach",
        "Guided Practice",
        "Independent Practice",
        "Closure",
        "Teacher prompt: What do you notice?",
        "Turn and talk with your partner.",
        "5 minutes",
        "10 minutes",
        "Layout cue: large word display with clear headers.",
        "Supportive and clear tone.",
        "I do, we do, you do.",
      ],
      extractionMetadata: makeExtractionMetadata(),
    })

    const selected = selectStrongestEligibleMaterials(
      [narrowExemplar, broadExemplar],
      "exemplar",
      "structure"
    )

    expect(selected.map((material) => material.id).slice(0, 1)).toEqual(["ex-broad"])
  })
})
