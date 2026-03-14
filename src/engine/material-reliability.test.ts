import { describe, expect, it } from "vitest"
import { analyzeMaterial } from "./materials/analyzeMaterial"

function makeMetadata(overrides: Partial<{
  method: "parser" | "ocr" | "mixed" | "fallback_notice"
  quality: "high" | "medium" | "low"
  confidence: number
  notes: string[]
  ocrCandidate: boolean
  ocrReason: string | null
}> = {}) {
  return {
    method: "parser" as const,
    quality: "high" as const,
    confidence: 0.92,
    notes: [],
    ocrCandidate: false,
    ocrReason: null,
    ...overrides,
  }
}

describe("material reliability", () => {
  it("allows strong curriculum for content but not structure", async () => {
    const result = await analyzeMaterial({
      materialId: "curr-strong",
      role: "curriculum",
      name: "curriculum.txt",
      extractedText: [
        "Standard RF.1.3 decode regularly spelled one-syllable words.",
        "Objective: Students will read long a words with silent e.",
        "Vocabulary: long a, silent e, vowel pattern.",
        "Word list: cake, game, same, late, made.",
        "Text: Jake made a cake at the lake.",
        "Practice: Read the words and sort by pattern.",
        "Teacher model blending with silent e words.",
        "Example: cake changes from cap to cape.",
      ],
      extractionMetadata: makeMetadata(),
    })

    expect(result.analysis.reliability?.level).toBe("high")
    expect(result.analysis.reliability?.usableForContent).toBe(true)
    expect(result.analysis.reliability?.contentDecision).toBe("allow")
    expect(result.analysis.reliability?.usableForStructure).toBe(false)
    expect(result.analysis.reliability?.structureDecision).toBe("block")
  })

  it("downgrades sparse curriculum to caution instead of full trust", async () => {
    const result = await analyzeMaterial({
      materialId: "curr-sparse",
      role: "curriculum",
      name: "sparse-curriculum.txt",
      extractedText: [
        "Objective: Read long a words.",
        "Word list: cake, same, late.",
        "Practice: Read and write the words.",
      ],
      extractionMetadata: makeMetadata({
        quality: "medium",
        confidence: 0.62,
      }),
    })

    expect(result.analysis.reliability?.level).toBe("medium")
    expect(result.analysis.reliability?.usableForContent).toBe(true)
    expect(result.analysis.reliability?.contentDecision).toBe("caution")
    expect(result.analysis.reliability?.usableForStructure).toBe(false)
  })

  it("blocks fallback-notice curriculum from shaping content", async () => {
    const result = await analyzeMaterial({
      materialId: "curr-fallback",
      role: "curriculum",
      name: "scan.pdf",
      extractedText: [
        "PDF file scan.pdf was detected.",
        "ArrayBuffer is required for readable extraction.",
      ],
      extractionMetadata: makeMetadata({
        method: "fallback_notice",
        quality: "low",
        confidence: 0.2,
        ocrCandidate: true,
        ocrReason: "Parser did not recover usable text.",
        notes: ["Parser did not recover usable text."],
      }),
    })

    expect(result.analysis.reliability?.level).toBe("low")
    expect(result.analysis.reliability?.usableForContent).toBe(false)
    expect(result.analysis.reliability?.contentDecision).toBe("block")
    expect(result.analysis.reliability?.warnings).toContain(
      "Material may not have enough extracted text to shape the blueprint safely."
    )
  })

  it("allows strong exemplar for structure but not content", async () => {
    const result = await analyzeMaterial({
      materialId: "ex-strong",
      role: "exemplar",
      name: "exemplar.txt",
      extractedText: [
        "Opening: review yesterday's learning.",
        "Teach: model the new pattern.",
        "Guided practice: students respond with teacher support.",
        "Closure: quick exit check and recap.",
        "Teacher prompt: What do you notice?",
        "Turn and talk with your partner before sharing.",
        "Timing: 5 minute launch, 10 minute model, 10 minute practice.",
        "Layout cue: large word display with clear headers.",
      ],
      extractionMetadata: makeMetadata(),
    })

    expect(result.analysis.reliability?.level).toBe("high")
    expect(result.analysis.reliability?.usableForStructure).toBe(true)
    expect(result.analysis.reliability?.structureDecision).toBe("allow")
    expect(result.analysis.reliability?.usableForContent).toBe(false)
    expect(result.analysis.reliability?.contentDecision).toBe("block")
  })

  it("blocks noisy OCR-heavy exemplar structure", async () => {
    const result = await analyzeMaterial({
      materialId: "ex-noisy",
      role: "exemplar",
      name: "noisy-slides.pdf",
      extractedText: [
        "###",
        "1",
        "!! ?? %% //",
        "scan",
        "2",
        "***",
      ],
      extractionMetadata: makeMetadata({
        method: "ocr",
        quality: "low",
        confidence: 0.41,
        ocrCandidate: true,
        ocrReason: "OCR recovery was needed.",
        notes: ["OCR text was noisy."],
      }),
    })

    expect(result.analysis.reliability?.level).toBe("low")
    expect(result.analysis.reliability?.usableForStructure).toBe(false)
    expect(result.analysis.reliability?.structureDecision).toBe("block")
    expect(result.analysis.reliability?.reasons.join(" ")).toMatch(/OCR|noise|low/i)
  })
})
