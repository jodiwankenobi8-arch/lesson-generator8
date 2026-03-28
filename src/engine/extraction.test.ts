import { beforeEach, describe, expect, it, vi } from "vitest"

const pdfGetTextMock = vi.fn()
const pdfDestroyMock = vi.fn()
const mammothExtractRawTextMock = vi.fn()
const parsePptxMock = vi.fn()
const extractPdfTextWithOcrFallbackMock = vi.fn()
const extractImageTextWithOcrMock = vi.fn()

vi.mock("pdf-parse", () => ({
  PDFParse: class {
    constructor(_options: unknown) {}

    getText() {
      return pdfGetTextMock()
    }

    destroy() {
      return pdfDestroyMock()
    }
  },
}))

vi.mock("mammoth", () => ({
  extractRawText: (...args: unknown[]) => mammothExtractRawTextMock(...args),
}))

vi.mock("pptx-parser", () => ({
  parsePptx: (...args: unknown[]) => parsePptxMock(...args),
}))

vi.mock("./materials/extractPdfOcr", () => ({
  extractPdfTextWithOcrFallback: (...args: unknown[]) =>
    extractPdfTextWithOcrFallbackMock(...args),
}))

vi.mock("./materials/extractImageOcr", () => ({
  extractImageTextWithOcr: (...args: unknown[]) =>
    extractImageTextWithOcrMock(...args),
}))

import {
  detectFileType,
  extractPlainText,
  extractTextFromFile,
} from "./materials/extractTextFromFile"
import {
  SUPPORTED_EXTRACTION_TARGETS_NOTICE,
} from "./materials/sourceIntakeContract"

describe("extraction contract", () => {
  beforeEach(() => {
    pdfGetTextMock.mockReset()
    pdfDestroyMock.mockReset()
    mammothExtractRawTextMock.mockReset()
    parsePptxMock.mockReset()
    extractPdfTextWithOcrFallbackMock.mockReset()
    extractImageTextWithOcrMock.mockReset()

    pdfDestroyMock.mockResolvedValue(undefined)
    mammothExtractRawTextMock.mockResolvedValue({
      value: "",
      messages: [],
    })
    extractPdfTextWithOcrFallbackMock.mockResolvedValue({
      pages: [],
      combinedLines: [],
      averageConfidence: 0,
      notes: ["OCR fallback mock returned no extra text."],
    })
    extractImageTextWithOcrMock.mockResolvedValue({
      lines: ["Teacher prompt from screenshot."],
      averageConfidence: 0.84,
      notes: ["OCR processed 1 image source.", "Average OCR confidence: 84%."],
    })
  })

  it("detectFileType recognizes supported formats", () => {
    expect(detectFileType("lesson.TXT")).toBe("txt")
    expect(detectFileType("curriculum.Pdf")).toBe("pdf")
    expect(detectFileType("guide.Docx")).toBe("docx")
    expect(detectFileType("slides.PPTX")).toBe("pptx")
    expect(detectFileType("page.html")).toBe("html")
    expect(detectFileType("page.htm")).toBe("html")
    expect(detectFileType("worksheet-photo.JPG")).toBe("image")
    expect(detectFileType("anchor-chart.webp")).toBe("image")
    expect(detectFileType("archive.zip")).toBe("unknown")
  })

  it("extractPlainText trims, deduplicates, and removes blank lines", () => {
    expect(
      extractPlainText("  Line one  \n\nLine two\nLine one\n   \nLine three  ")
    ).toEqual(["Line one", "Line two", "Line three"])
  })

  it("extractPlainText removes noisy low-value lines before analysis", () => {
    expect(
      extractPlainText(`
        1
        2
        https://example.com/resource
        www.example.com/unit1
        Slide 3
        ---
        ***
        Short a words
        Teacher model the blending
        12
      `)
    ).toEqual(["Short a words", "Teacher model the blending"])
  })

  it("extractTextFromFile extracts normalized txt content", async () => {
    const result = await extractTextFromFile({
      fileName: "notes.txt",
      fileContent: " Alpha  \n\nBeta\nAlpha\nGamma ",
    })

    expect(result.fileType).toBe("txt")
    expect(result.extractedText).toEqual(["Alpha", "Beta", "Gamma"])
    expect(result.extractionMetadata.quality).toBe("low")
    expect(result.extractionMetadata.ocrCandidate).toBe(false)
    expect(result.extractionMetadata.ocrReason).toBeNull()
  })

  it("extractTextFromFile treats pasted text as a first-class source even without a file extension", async () => {
    const result = await extractTextFromFile({
      fileName: "Copied standards and notes",
      fileContent: "RF.1.3\nBlend and read short a words.\nTeacher says: We will map the sounds.",
      sourceKind: "pasted_text",
      sourceLabel: "Pasted text",
    })

    expect(result.fileType).toBe("txt")
    expect(result.extractedText).toEqual([
      "RF.1.3",
      "Blend and read short a words.",
      "Teacher says: We will map the sounds.",
    ])
    expect(result.extractionMetadata.provenance).toEqual({
      sourceKind: "pasted_text",
      sourceLabel: "Pasted text",
      originalType: "txt",
    })
    expect(result.extractionMetadata.ocrDisposition).toBe("not_needed")
  })

  it("extractTextFromFile extracts readable html content and strips scripts/styles", async () => {
    const result = await extractTextFromFile({
      fileName: "page.html",
      fileContent: `
        <html>
          <head>
            <style>.hidden { display:none; }</style>
            <script>console.log("ignore me")</script>
          </head>
          <body>
            <h1>Lesson Focus</h1>
            <p>Short vowel a</p>
            <div>Teacher prompt &amp; modeling</div>
          </body>
        </html>
      `,
    })

    expect(result.fileType).toBe("html")
    expect(result.extractedText).toContain("Lesson Focus")
    expect(result.extractedText).toContain("Short vowel a")
    expect(result.extractedText).toContain("Teacher prompt & modeling")
    expect(result.extractedText.join(" ")).not.toMatch(/ignore me|display:none/)
    expect(result.extractionMetadata.ocrCandidate).toBe(false)
    expect(result.extractionMetadata.ocrReason).toBeNull()
  })

  it("extractTextFromFile normalizes noisy html into analysis-ready lines", async () => {
    const result = await extractTextFromFile({
      fileName: "lesson.html",
      fileContent: `
        <html>
          <body>
            <div>Slide 1</div>
            <div>https://district.example.org</div>
            <h1>Long A Lesson</h1>
            <p>Teacher says: Today we will read long a words.</p>
            <div>3</div>
          </body>
        </html>
      `,
    })

    expect(result.fileType).toBe("html")
    expect(result.extractedText).toEqual([
      "Long A Lesson",
      "Teacher says: Today we will read long a words.",
    ])
    expect(result.extractionMetadata.ocrCandidate).toBe(false)
    expect(result.extractionMetadata.ocrReason).toBeNull()
  })

  it("marks fallback pdf output as an OCR candidate", async () => {
    const result = await extractTextFromFile({
      fileName: "curriculum.pdf",
    })

    expect(result.fileType).toBe("pdf")
    expect(result.extractedText[0]).toContain("PDF file curriculum.pdf was detected")
    expect(result.extractedText[1]).toContain("ArrayBuffer")
    expect(result.extractionMetadata.method).toBe("fallback_notice")
    expect(result.extractionMetadata.quality).toBe("low")
    expect(result.extractionMetadata.ocrCandidate).toBe(true)
    expect(result.extractionMetadata.ocrReason).toContain("Parser did not recover usable text")
    expect(extractPdfTextWithOcrFallbackMock).not.toHaveBeenCalled()
  })

  it("does not mark fallback docx output as an OCR candidate", async () => {
    const result = await extractTextFromFile({
      fileName: "curriculum.docx",
    })

    expect(result.fileType).toBe("docx")
    expect(result.extractedText[0]).toContain("DOCX file curriculum.docx was detected")
    expect(result.extractedText[1]).toContain("ArrayBuffer")
    expect(result.extractionMetadata.method).toBe("fallback_notice")
    expect(result.extractionMetadata.quality).toBe("low")
    expect(result.extractionMetadata.ocrCandidate).toBe(false)
    expect(result.extractionMetadata.ocrReason).toBeNull()
  })

  it("marks fallback pptx output as an OCR candidate", async () => {
    const result = await extractTextFromFile({
      fileName: "slides.pptx",
    })

    expect(result.fileType).toBe("pptx")
    expect(result.extractedText[0]).toContain("PPTX file slides.pptx was detected")
    expect(result.extractedText[1]).toContain("ArrayBuffer")
    expect(result.extractionMetadata.method).toBe("fallback_notice")
    expect(result.extractionMetadata.quality).toBe("low")
    expect(result.extractionMetadata.ocrCandidate).toBe(true)
    expect(result.extractionMetadata.ocrReason).toContain("Parser did not recover usable text")
  })

  it("does not mark unknown fallback output as an OCR candidate", async () => {
    const result = await extractTextFromFile({
      fileName: "materials.csv",
      fileContent: "a,b,c",
    })

    expect(result.fileType).toBe("unknown")
    expect(result.extractedText).toEqual([
      "Unsupported file type for materials.csv.",
      SUPPORTED_EXTRACTION_TARGETS_NOTICE,
    ])
    expect(result.extractionMetadata.method).toBe("fallback_notice")
    expect(result.extractionMetadata.quality).toBe("low")
    expect(result.extractionMetadata.ocrCandidate).toBe(false)
    expect(result.extractionMetadata.ocrReason).toBeNull()
  })

  it("extractTextFromFile uses OCR for supported image sources", async () => {
    const result = await extractTextFromFile({
      fileName: "worksheet-photo.png",
      fileBuffer: new TextEncoder().encode("fake-image").buffer,
      sourceKind: "image_upload",
      sourceLabel: "Worksheet photo",
      sourceMimeType: "image/png",
    })

    expect(result.fileType).toBe("image")
    expect(result.extractedText).toEqual(["Teacher prompt from screenshot."])
    expect(result.extractionMetadata.method).toBe("ocr")
    expect(result.extractionMetadata.ocrDisposition).toBe("applied")
    expect(result.extractionMetadata.provenance).toEqual({
      sourceKind: "image_upload",
      sourceLabel: "Worksheet photo",
      originalType: "image",
    })
    expect(extractImageTextWithOcrMock).toHaveBeenCalledTimes(1)
  })

  it("marks image fallback output as unavailable OCR when no file buffer is provided", async () => {
    const result = await extractTextFromFile({
      fileName: "screenshot.jpeg",
      sourceKind: "image_upload",
      sourceLabel: "Screenshot or photo",
      sourceMimeType: "image/jpeg",
    })

    expect(result.fileType).toBe("image")
    expect(result.extractionMetadata.method).toBe("fallback_notice")
    expect(result.extractionMetadata.ocrCandidate).toBe(true)
    expect(result.extractionMetadata.ocrDisposition).toBe("unavailable")
    expect(result.extractionMetadata.fallbackBehavior).toContain("should not steer lesson generation")
    expect(extractImageTextWithOcrMock).not.toHaveBeenCalled()
  })

  it("marks thin parsed pdf text as an OCR candidate", async () => {
    pdfGetTextMock.mockResolvedValue({
      text: `
        Scan
        1
        2
      `,
    })

    const result = await extractTextFromFile({
      fileName: "scan.pdf",
      fileBuffer: new TextEncoder().encode("fake-pdf").buffer,
    })

    expect(result.fileType).toBe("pdf")
    expect(result.extractionMetadata.method).toBe("parser")
    expect(result.extractionMetadata.quality).toBe("low")
    expect(result.extractionMetadata.ocrCandidate).toBe(true)
    expect(result.extractionMetadata.ocrReason).toContain("OCR recovery is likely worth trying")
    expect(pdfDestroyMock).toHaveBeenCalledTimes(1)
    expect(extractPdfTextWithOcrFallbackMock).toHaveBeenCalledTimes(1)
  })

  it("does not mark strong parsed pdf text as an OCR candidate", async () => {
    pdfGetTextMock.mockResolvedValue({
      text: Array.from({ length: 25 }, (_, index) =>
        `This is a readable lesson line number ${index} with phonics practice and teacher guidance.`
      ).join("\n"),
    })

    const result = await extractTextFromFile({
      fileName: "readable.pdf",
      fileBuffer: new TextEncoder().encode("fake-pdf").buffer,
    })

    expect(result.fileType).toBe("pdf")
    expect(result.extractionMetadata.method).toBe("parser")
    expect(result.extractionMetadata.quality).toBe("high")
    expect(result.extractionMetadata.ocrCandidate).toBe(false)
    expect(result.extractionMetadata.ocrReason).toBeNull()
    expect(pdfDestroyMock).toHaveBeenCalledTimes(1)
    expect(extractPdfTextWithOcrFallbackMock).not.toHaveBeenCalled()
  })

  it("marks thin parsed pptx text as an OCR candidate", async () => {
    parsePptxMock.mockResolvedValue({
      slides: [{ text: "A" }, { text: "B" }],
    })

    const result = await extractTextFromFile({
      fileName: "thin-deck.pptx",
      fileBuffer: new TextEncoder().encode("fake-pptx").buffer,
    })

    expect(result.fileType).toBe("pptx")
    expect(result.extractionMetadata.method).toBe("parser")
    expect(result.extractionMetadata.quality).toBe("low")
    expect(result.extractionMetadata.ocrCandidate).toBe(true)
    expect(result.extractionMetadata.ocrReason).toContain("OCR recovery is likely worth trying")
  })

  it("keeps parser output when OCR adds too little new text", async () => {
    pdfGetTextMock.mockResolvedValue({
      text: `
        Scan
        1
        2
      `,
    })

    extractPdfTextWithOcrFallbackMock.mockResolvedValue({
      pages: [
        {
          pageNumber: 1,
          text: "Scan",
          confidence: 0.62,
        },
      ],
      combinedLines: ["Scan"],
      averageConfidence: 0.62,
      notes: ["OCR processed 1 page."],
    })

    const result = await extractTextFromFile({
      fileName: "thin-scan.pdf",
      fileBuffer: new TextEncoder().encode("fake-pdf").buffer,
    })

    expect(result.extractedText).toEqual(["Scan"])
    expect(result.extractionMetadata.method).toBe("parser")
    expect(result.extractionMetadata.notes.join(" ")).toContain(
      "OCR fallback did not add enough new readable text"
    )
  })

  it("upgrades pdf extraction to mixed when OCR adds enough useful text", async () => {
    pdfGetTextMock.mockResolvedValue({
      text: `
        Scan
        1
        2
      `,
    })

    extractPdfTextWithOcrFallbackMock.mockResolvedValue({
      pages: [
        {
          pageNumber: 1,
          text: "Teacher models blending the long a pattern.",
          confidence: 0.88,
        },
      ],
      combinedLines: [
        "Teacher models blending the long a pattern.",
        "Students read the word list aloud.",
        "Partners complete guided decoding practice.",
      ],
      averageConfidence: 0.88,
      notes: ["OCR processed 1 page.", "Average OCR confidence: 88%."],
    })

    const result = await extractTextFromFile({
      fileName: "rescued-scan.pdf",
      fileBuffer: new TextEncoder().encode("fake-pdf").buffer,
    })

    expect(result.extractionMetadata.method).toBe("mixed")
    expect(result.extractionMetadata.notes.join(" ")).toContain(
      "OCR fallback added"
    )
    expect(result.extractedText).toEqual([
      "Scan",
      "Teacher models blending the long a pattern.",
      "Students read the word list aloud.",
      "Partners complete guided decoding practice.",
    ])
  })

  it("falls back gracefully when OCR throws", async () => {
    pdfGetTextMock.mockResolvedValue({
      text: `
        Scan
        1
        2
      `,
    })

    extractPdfTextWithOcrFallbackMock.mockRejectedValue(
      new Error("OCR worker crashed")
    )

    const result = await extractTextFromFile({
      fileName: "ocr-failure.pdf",
      fileBuffer: new TextEncoder().encode("fake-pdf").buffer,
    })

    expect(result.extractedText).toEqual(["Scan"])
    expect(result.extractionMetadata.method).toBe("parser")
    expect(result.extractionMetadata.notes.join(" ")).toContain(
      "OCR fallback attempt failed: OCR worker crashed"
    )
  })
})
