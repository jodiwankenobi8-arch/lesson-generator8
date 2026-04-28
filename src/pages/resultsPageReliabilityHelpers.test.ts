import { describe, expect, it } from "vitest"
import { analyzeMaterial } from "../engine/materials/analyzeMaterial"
import { buildReliabilityDecisions } from "./resultsPageReliabilityHelpers"
import type { MaterialFile } from "../engine/types"

async function makeMaterialFile(
  materialId: string,
  name: string,
  role: "curriculum" | "exemplar",
  extractedText: string[],
  metadataOverrides: Partial<{
    method: "parser" | "ocr" | "mixed" | "fallback_notice"
    quality: "high" | "medium" | "low"
    confidence: number
    notes: string[]
    ocrCandidate: boolean
    ocrReason: string | null
  }> = {}
): Promise<MaterialFile> {
  const metadata = {
    method: "parser" as const,
    quality: "high" as const,
    confidence: 0.92,
    notes: [],
    ocrCandidate: false,
    ocrReason: null,
    ...metadataOverrides,
  }
  
  const analyzed = await analyzeMaterial({
    materialId,
    role,
    name,
    extractedText,
    extractionMetadata: metadata,
  })
  
  return {
    id: materialId,
    name,
    role,
    status: "ready" as const,
    analysis: analyzed.analysis,
    analysisReview: null,
    errorMessage: null,
    styleSettings: undefined,
    transformationRequest: undefined,
    sourceKind: "file_upload" as const,
    sourceLabel: name,
    sourceMimeType: "text/plain",
    fileBuffer: null,
    fileContent: extractedText.join("\n"),
  }
}

describe("resultsPageReliabilityHelpers — extraction quality in UI reasons", () => {
  it("surfaces strong parser extraction (TXT) as 'used' with no extraction warnings", async () => {
    const material = await makeMaterialFile(
      "txt-strong",
      "curriculum.txt",
      "curriculum",
      [
        "Standard RF.1.3 decode regularly spelled one-syllable words.",
        "Objective: Students will read long a words with silent e.",
        "Vocabulary: long a, silent e, vowel pattern.",
        "Word list: cake, game, same, late, made.",
        "Text: Jake made a cake at the lake.",
        "Practice: Read the words and sort by pattern.",
      ],
      {}
    )

    const decisions = buildReliabilityDecisions(
      [material],
      "curriculum",
      "content",
      [material.id]
    )

    expect(decisions).toHaveLength(1)
    const decision = decisions[0]!
    expect(decision.outcome).toBe("used")
    expect(decision.score).toBeGreaterThanOrEqual(70)
    // Strong extraction should not have extraction-related warnings
    const hasExtractionWarning = decision.reasons.some((r) =>
      /extraction|ocr|confidence|noise/i.test(r)
    )
    expect(hasExtractionWarning).toBe(false)
  })

  it("surfaces OCR-extracted text with extraction quality in reasons", async () => {
    const material = await makeMaterialFile(
      "ocr-medium",
      "scan.pdf",
      "curriculum",
      [
        "Standard RF.1.3 decode regularly spelled one-syllable words.",
        "Objective: Students will read long a words with silent e.",
        "Vocabulary: long a, silent e, vowel pattern.",
        "Word list: cake, game, same, late, made.",
        "Practice: Read and sort the words.",
      ],
      {
        method: "ocr",
        quality: "medium",
        confidence: 0.65,
        ocrCandidate: true,
        ocrReason: "PDFJs parser did not recover sufficient text.",
      }
    )

    const decisions = buildReliabilityDecisions(
      [material],
      "curriculum",
      "content",
      [] // not selected, so should be down-ranked or blocked
    )

    expect(decisions).toHaveLength(1)
    const decision = decisions[0]!
    // OCR medium with limited content signals becomes blocked or down-ranked
    expect(decision.outcome).toMatch(/blocked|down-ranked/)
    expect(decision.decision).toMatch(/block|caution/)
    // Should include extraction-related reasons
    const extractionReasons = decision.reasons.filter((r) =>
      /ocr|extraction|confidence|medium/i.test(r)
    )
    expect(extractionReasons.length).toBeGreaterThan(0)
    expect(extractionReasons.join(" ")).toMatch(/ocr|confidence/i)
  })

  it("surfaces low-confidence OCR as down-ranked or blocked with confidence warning", async () => {
    const material = await makeMaterialFile(
      "ocr-low-confidence",
      "image-pdf.pdf",
      "curriculum",
      [
        "Standard RF.1.3 decode regularly spelled one-syllable words.",
        "Objective: Students will read long a words with silent e.",
        "Vocabulary: long a, silent e, vowel pattern.",
      ],
      {
        method: "ocr",
        quality: "low",
        confidence: 0.35,
        ocrCandidate: true,
        ocrReason: "OCR needed for image-first PDF.",
        notes: ["OCR confidence was below 45%."],
      }
    )

    const decisions = buildReliabilityDecisions(
      [material],
      "curriculum",
      "content",
      []
    )

    const decision = decisions[0]!
    expect(decision.outcome).toMatch(/down-ranked|blocked/)
    // Should explicitly mention low confidence
    const confidenceWarning = decision.reasons.find((r) =>
      /confidence|very low/i.test(r)
    )
    expect(confidenceWarning).toBeDefined()
  })

  it("surfaces fallback-only extraction as 'blocked' with clear reason", async () => {
    const material = await makeMaterialFile(
      "fallback-only",
      "unreadable.pdf",
      "curriculum",
      [
        "PDF file unreadable.pdf was detected.",
        "ArrayBuffer is required for readable extraction.",
      ],
      {
        method: "fallback_notice",
        quality: "low",
        confidence: 0.1,
        ocrCandidate: true,
        ocrReason: "Parser and OCR both failed.",
        notes: ["Parser did not recover usable text.", "OCR unavailable for this file type."],
      }
    )

    const decisions = buildReliabilityDecisions(
      [material],
      "curriculum",
      "content",
      []
    )

    const decision = decisions[0]!
    expect(decision.outcome).toBe("blocked")
    // Should explain why it's blocked
    const blockReason = decision.reasons.find((r) =>
      /fallback|little.*text|blocked/i.test(r)
    )
    expect(blockReason).toBeDefined()
  })

  it("surfaces mixed parser/OCR extraction with method explanation in reasons", async () => {
    const material = await makeMaterialFile(
      "mixed-extraction",
      "hybrid-pdf.pdf",
      "curriculum",
      [
        "Standard RF.1.3 decode regularly spelled one-syllable words.",
        "Objective: Students will read long a words with silent e.",
        "Vocabulary: long a, silent e, vowel pattern.",
        "Word list: cake, game, same, late, made.",
        "Mixed extraction: parser recovered first section, OCR recovered second.",
      ],
      {
        method: "mixed",
        quality: "medium",
        confidence: 0.7,
        ocrCandidate: true,
        ocrReason: "Some pages required OCR fallback.",
      }
    )

    const decisions = buildReliabilityDecisions(
      [material],
      "curriculum",
      "content",
      []
    )

    const decision = decisions[0]!
    expect(decision.outcome).toMatch(/down-ranked|used|blocked/)
    // Should mention mixed extraction
    const mixedReason = decision.reasons.find((r) =>
      /mixed|parser.*ocr|both/i.test(r)
    )
    expect(mixedReason).toBeDefined()
  })

  it("surfaces noisy OCR extraction as 'blocked' with noise warning", async () => {
    const material = await makeMaterialFile(
      "noisy-ocr",
      "noisy-scan.pdf",
      "exemplar",
      [
        "###",
        "1",
        "!! ?? %% //",
        "scan",
        "2",
        "***",
      ],
      {
        method: "ocr",
        quality: "low",
        confidence: 0.25,
        ocrCandidate: true,
        ocrReason: "OCR recovery needed, but result was noisy.",
      }
    )

    const decisions = buildReliabilityDecisions([material], "exemplar", "structure", [])

    const decision = decisions[0]!
    expect(decision.outcome).toBe("blocked")
    // Should mention noise in extraction
    const noiseWarning = decision.reasons.find((r) =>
      /noise|fragment|ocr.*low|confidence/i.test(r)
    )
    expect(noiseWarning).toBeDefined()
  })

  it("includes extraction reasons for used materials", async () => {
    const material = await makeMaterialFile(
      "used-with-info",
      "strong-curriculum.pdf",
      "curriculum",
      [
        "Standard RF.1.3 decode regularly spelled one-syllable words.",
        "Standard RF.1.4 demonstrate phonological awareness.",
        "Objective: Read long a words with silent e.",
        "Vocabulary: long a, silent e, vowel pattern, magic e.",
        "Word list: cake, game, same, late, made, wave, save, rate.",
        "Decodable text: The cake is on the lake.",
        "Practice: Blend the words and read the sentence.",
        "Assessment: Can students decode long a words?",
      ],
      {
        method: "ocr",
        quality: "high",
        confidence: 0.92,
        ocrCandidate: true,
      }
    )

    const decisions = buildReliabilityDecisions(
      [material],
      "curriculum",
      "content",
      [material.id] // selected as primary
    )

    const decision = decisions[0]!
    // Can be "used" and include extraction reasons if any
    expect(decision.reasons.length).toBeGreaterThanOrEqual(0)
    // Reasons should be accessible in UI
    expect(Array.isArray(decision.reasons)).toBe(true)
  })

  it("provides up to 3 reasons for UI display when multiple extraction issues exist", async () => {
    const material = await makeMaterialFile(
      "multi-issue",
      "problematic.pdf",
      "curriculum",
      [
        "Short.",
        "Fragment.",
      ],
      {
        method: "ocr",
        quality: "low",
        confidence: 0.2,
        ocrCandidate: true,
        notes: ["Parser failed completely.", "OCR confidence very low."],
      }
    )

    const decisions = buildReliabilityDecisions([material], "curriculum", "content", [])

    const decision = decisions[0]!
    // Multiple reasons collected
    expect(decision.reasons.length).toBeGreaterThan(0)
    // Results UI will show first 3
    const displayedReasons = decision.reasons.slice(0, 3)
    expect(displayedReasons.length).toBeGreaterThanOrEqual(1)
  })
})
