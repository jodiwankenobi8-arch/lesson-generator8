import { extractImageTextWithOcr } from "./extractImageOcr"
import { extractPdfTextWithOcrFallback } from "./extractPdfOcr"
import {
  getSupportedSourceUploadExtension,
  isSupportedImageMimeType,
  SUPPORTED_EXTRACTION_TARGETS_NOTICE,
} from "./sourceIntakeContract"
import { ExtractionMetadata, MaterialSourceKind } from "../types"

export type ExtractTextInput = {
  fileName: string
  fileContent?: string
  fileBuffer?: ArrayBuffer
  sourceKind?: MaterialSourceKind
  sourceLabel?: string
  sourceMimeType?: string | null
}

export type ExtractTextResult = {
  fileName: string
  fileType: "txt" | "pdf" | "docx" | "pptx" | "html" | "image" | "unknown"
  extractedText: string[]
  extractionMetadata: ExtractionMetadata
}

export async function extractTextFromFile(
  input: ExtractTextInput
): Promise<ExtractTextResult> {
  const fileType = detectFileType(input.fileName, {
    sourceKind: input.sourceKind,
    sourceMimeType: input.sourceMimeType,
  })

  switch (fileType) {
    case "txt": {
      const extractedText = extractPlainText(input.fileContent ?? "")

      return {
        fileName: input.fileName,
        fileType,
        extractedText,
        extractionMetadata: buildExtractionMetadata({
          method: "parser",
          fileType,
          extractedText,
          sourceKind: input.sourceKind,
          sourceLabel: input.sourceLabel,
        }),
      }
    }

    case "pdf": {
      const parserText = await extractPdfText(input)
      const parserMethod = isFallbackNoticeResult(parserText) ? "fallback_notice" : "parser"
      const parserMetadata = buildExtractionMetadata({
        method: parserMethod,
        fileType,
        extractedText: parserText,
        sourceKind: input.sourceKind,
        sourceLabel: input.sourceLabel,
      })

      const upgradedPdfResult = await maybeApplyPdfOcrFallback({
        input,
        parserText,
        parserMetadata,
      })

      return {
        fileName: input.fileName,
        fileType,
        extractedText: upgradedPdfResult.extractedText,
        extractionMetadata: upgradedPdfResult.extractionMetadata,
      }
    }

    case "docx": {
      const extractedText = await extractDocxText(input)
      const method = isFallbackNoticeResult(extractedText) ? "fallback_notice" : "parser"

      return {
        fileName: input.fileName,
        fileType,
        extractedText,
        extractionMetadata: buildExtractionMetadata({
          method,
          fileType,
          extractedText,
          sourceKind: input.sourceKind,
          sourceLabel: input.sourceLabel,
        }),
      }
    }

    case "html": {
      const extractedText = extractHtmlText(
        input.fileContent ?? decodeArrayBuffer(input.fileBuffer)
      )

      return {
        fileName: input.fileName,
        fileType,
        extractedText,
        extractionMetadata: buildExtractionMetadata({
          method: "parser",
          fileType,
          extractedText,
          sourceKind: input.sourceKind,
          sourceLabel: input.sourceLabel,
        }),
      }
    }

    case "pptx": {
      const extractedText = await extractPptxText(input)
      const method = isFallbackNoticeResult(extractedText) ? "fallback_notice" : "parser"

      return {
        fileName: input.fileName,
        fileType,
        extractedText,
        extractionMetadata: buildExtractionMetadata({
          method,
          fileType,
          extractedText,
          sourceKind: input.sourceKind,
          sourceLabel: input.sourceLabel,
        }),
      }
    }

    case "image": {
      return extractImageText(input)
    }

    default: {
      const extractedText = buildUnsupportedFormatNotice("unknown", input.fileName)

      return {
        fileName: input.fileName,
        fileType: "unknown",
        extractedText,
        extractionMetadata: buildExtractionMetadata({
          method: "fallback_notice",
          fileType: "unknown",
          extractedText,
          sourceKind: input.sourceKind,
          sourceLabel: input.sourceLabel,
        }),
      }
    }
  }
}

export function detectFileType(
  fileName: string,
  options?: {
    sourceKind?: MaterialSourceKind
    sourceMimeType?: string | null
  }
): "txt" | "pdf" | "docx" | "pptx" | "html" | "image" | "unknown" {
  if (options?.sourceKind === "pasted_text") {
    return "txt"
  }

  if (isSupportedImageMimeType(options?.sourceMimeType)) {
    return "image"
  }

  const extension = getSupportedSourceUploadExtension(fileName)

  switch (extension) {
    case ".txt":
      return "txt"
    case ".pdf":
      return "pdf"
    case ".docx":
      return "docx"
    case ".pptx":
      return "pptx"
    case ".html":
    case ".htm":
      return "html"
    case ".png":
    case ".jpg":
    case ".jpeg":
    case ".webp":
      return "image"
    default:
      return "unknown"
  }
}

export function extractPlainText(content: string): string[] {
  return normalizeExtractedText(
    content
      .split(/\r?\n/)
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
  )
}

function extractHtmlText(content: string): string[] {
  if (!content.trim()) {
    return ["HTML file was detected, but no HTML content was provided."]
  }

  const withoutScripts = content
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")

  const withLineBreaks = withoutScripts.replace(
    /<\/?(p|div|section|article|main|aside|header|footer|nav|li|ul|ol|h1|h2|h3|h4|h5|h6|br|tr|td|th)[^>]*>/gi,
    "\n"
  )

  const noTags = withLineBreaks.replace(/<[^>]+>/g, " ")
  const decoded = decodeHtmlEntities(noTags)

  return normalizeExtractedText(
    decoded
      .split(/\r?\n/)
      .map((line: string) => line.replace(/\s+/g, " ").trim())
      .filter((line: string) => line.length > 0)
  )
}

async function extractPdfText(input: ExtractTextInput): Promise<string[]> {
  if (!input.fileBuffer) {
    return [
      `PDF file ${input.fileName} was detected, but no fileBuffer was provided.`,
      "Provide the uploaded PDF as an ArrayBuffer so real extraction can run.",
    ]
  }

  let parser: { getText: () => Promise<{ text: string }>; destroy: () => Promise<void> } | null = null

  try {
    const pdfModule = await import("pdf-parse")
    const PDFParse = pdfModule.PDFParse

    parser = new PDFParse({
      data: new Uint8Array(input.fileBuffer),
    })

    const result = await parser.getText()

    return normalizeExtractedText(
      result.text
        .split(/\r?\n/)
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0)
    )
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown PDF extraction error"

    return [`PDF extraction failed for ${input.fileName}.`, message]
  } finally {
    if (parser) {
      await parser.destroy()
    }
  }
}

async function maybeApplyPdfOcrFallback({
  input,
  parserText,
  parserMetadata,
}: {
  input: ExtractTextInput
  parserText: string[]
  parserMetadata: ExtractionMetadata
}): Promise<{ extractedText: string[]; extractionMetadata: ExtractionMetadata }> {
  if (
    !input.fileBuffer ||
    (parserMetadata.method !== "parser" && parserMetadata.method !== "fallback_notice") ||
    !parserMetadata.ocrCandidate
  ) {
    return {
      extractedText: parserText,
      extractionMetadata: parserMetadata,
    }
  }

  try {
    const ocrResult = await extractPdfTextWithOcrFallback(input.fileBuffer, {
      maxPages: 3,
      language: "eng",
      scale: 2,
    })

    const baseText = parserMetadata.method === "parser" ? parserText : []

    const mergedText = normalizeExtractedText([
      ...baseText,
      ...ocrResult.combinedLines,
    ])

    const gainedEnoughText =
      ocrResult.combinedLines.length >= 3 &&
      (parserMetadata.method === "fallback_notice" || mergedText.length > parserText.length)

    if (!gainedEnoughText) {
      return {
        extractedText: parserText,
        extractionMetadata: {
          ...parserMetadata,
          notes: [
            ...parserMetadata.notes,
            ...ocrResult.notes,
            "OCR fallback did not add enough new readable text, so parser output was kept.",
          ],
          fallbackBehavior:
            "Parser output stays primary. OCR was tried but did not add enough trustworthy new text to change the teacher-visible source trace.",
        },
      }
    }

    const mixedMetadata = buildExtractionMetadata({
      method: "mixed",
      fileType: "pdf",
      extractedText: mergedText,
      sourceKind: input.sourceKind,
      sourceLabel: input.sourceLabel,
      notesToAppend: [
        ...ocrResult.notes,
        `OCR fallback added ${mergedText.length - parserText.length} additional normalized line(s).`,
      ],
    })

    return {
      extractedText: mergedText,
      extractionMetadata: mixedMetadata,
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown OCR fallback error"

    return {
      extractedText: parserText,
      extractionMetadata: {
        ...parserMetadata,
        notes: [
          ...parserMetadata.notes,
          `OCR fallback attempt failed: ${message}`,
        ],
        ocrDisposition: "unavailable",
        fallbackBehavior:
          "Parser output stays primary because OCR could not complete. Keep the source visible, but add a cleaner text source if trust remains thin.",
      },
    }
  }
}

async function extractImageText(input: ExtractTextInput): Promise<ExtractTextResult> {
  if (!input.fileBuffer) {
    const extractedText = [
      `Image source ${input.fileName} was detected, but no fileBuffer was provided.`,
      "Provide the uploaded screenshot or photo as an ArrayBuffer so OCR can run.",
    ]

    return {
      fileName: input.fileName,
      fileType: "image",
      extractedText,
      extractionMetadata: buildExtractionMetadata({
        method: "fallback_notice",
        fileType: "image",
        extractedText,
        sourceKind: input.sourceKind,
        sourceLabel: input.sourceLabel,
        fallbackBehaviorOverride:
          "This screenshot or photo stays visible for the teacher, but it should not steer lesson generation until OCR or a clearer text source recovers readable text.",
      }),
    }
  }

  try {
    const ocrResult = await extractImageTextWithOcr(input.fileBuffer, {
      language: "eng",
      mimeType: input.sourceMimeType ?? undefined,
    })

    if (ocrResult.lines.length === 0) {
      const extractedText = [
        `Image OCR produced no readable text for ${input.fileName}.`,
        "Try a clearer screenshot or photo, or add direct text from the source.",
      ]

      return {
        fileName: input.fileName,
        fileType: "image",
        extractedText,
        extractionMetadata: buildExtractionMetadata({
          method: "fallback_notice",
          fileType: "image",
          extractedText,
          sourceKind: input.sourceKind,
          sourceLabel: input.sourceLabel,
          confidenceOverride:
            ocrResult.averageConfidence > 0 ? ocrResult.averageConfidence : undefined,
          notesToAppend: ocrResult.notes,
          fallbackBehaviorOverride:
            "This screenshot or photo stays visible for the teacher, but it should not steer lesson generation until OCR or a clearer text source recovers readable text.",
        }),
      }
    }

    return {
      fileName: input.fileName,
      fileType: "image",
      extractedText: ocrResult.lines,
      extractionMetadata: buildExtractionMetadata({
        method: "ocr",
        fileType: "image",
        extractedText: ocrResult.lines,
        sourceKind: input.sourceKind,
        sourceLabel: input.sourceLabel,
        confidenceOverride:
          ocrResult.averageConfidence > 0 ? ocrResult.averageConfidence : undefined,
        notesToAppend: ocrResult.notes,
      }),
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown image OCR error"
    const extractedText = [
      `Image OCR failed for ${input.fileName}.`,
      message,
    ]

    return {
      fileName: input.fileName,
      fileType: "image",
      extractedText,
      extractionMetadata: buildExtractionMetadata({
        method: "fallback_notice",
        fileType: "image",
        extractedText,
        sourceKind: input.sourceKind,
        sourceLabel: input.sourceLabel,
        notesToAppend: [`Image OCR attempt failed: ${message}`],
        fallbackBehaviorOverride:
          "This screenshot or photo stays visible for the teacher, but it should not steer lesson generation until OCR or a clearer text source recovers readable text.",
      }),
    }
  }
}

async function extractDocxText(input: ExtractTextInput): Promise<string[]> {
  if (!input.fileBuffer) {
    return [
      `DOCX file ${input.fileName} was detected, but no fileBuffer was provided.`,
      "Provide the uploaded DOCX as an ArrayBuffer so real extraction can run.",
    ]
  }

  try {
    const mammothModule = await import("mammoth")

    const result = await mammothModule.extractRawText({
      arrayBuffer: input.fileBuffer,
    })

    const warningLines = result.messages
      .map((message: { message: string }) => message.message.trim())
      .filter((line: string) => line.length > 0)

    const contentLines = result.value
      .split(/\r?\n/)
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)

    return normalizeExtractedText([...contentLines, ...warningLines])
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown DOCX extraction error"

    return [`DOCX extraction failed for ${input.fileName}.`, message]
  }
}

async function extractPptxText(input: ExtractTextInput): Promise<string[]> {
  if (!input.fileBuffer) {
    return [
      `PPTX file ${input.fileName} was detected, but no fileBuffer was provided.`,
      "Provide the uploaded PPTX as an ArrayBuffer so real extraction can run.",
    ]
  }

  try {
    const pptxModule = await import("pptx-parser")
    const parsePptx = resolvePptxParser(pptxModule)

    if (!parsePptx) {
      throw new Error("pptx-parser did not expose a callable parser export.")
    }

    const pptxBlob = new Blob([input.fileBuffer], {
      type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    })

    const parsed = await parsePptx(pptxBlob)
    const slideLines = collectMeaningfulText(parsed)

    if (slideLines.length === 0) {
      return [
        `PPTX extraction produced no readable text for ${input.fileName}.`,
        "The slide deck may be image-based or use an unsupported internal structure.",
      ]
    }

    return normalizeExtractedText(slideLines)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown PPTX extraction error"

    return [`PPTX extraction failed for ${input.fileName}.`, message]
  }
}

function collectMeaningfulText(value: unknown): string[] {
  const collected: string[] = []
  const visited = new WeakSet<object>()

  function walk(current: unknown): void {
    if (typeof current === "string") {
      const normalized = current.replace(/\s+/g, " ").trim()

      if (normalized.length > 0) {
        collected.push(normalized)
      }

      return
    }

    if (typeof current === "number" || typeof current === "boolean" || current == null) {
      return
    }

    if (Array.isArray(current)) {
      for (const item of current) {
        walk(item)
      }

      return
    }

    if (typeof current === "object") {
      if (visited.has(current)) {
        return
      }

      visited.add(current)

      for (const value of Object.values(current as Record<string, unknown>)) {
        walk(value)
      }
    }
  }

  walk(value)

  return collected
}

function resolvePptxParser(
  moduleValue: unknown
): ((data: unknown) => Promise<unknown>) | null {
  if (typeof moduleValue === "function") {
    return moduleValue as (data: unknown) => Promise<unknown>
  }

  if (!moduleValue || typeof moduleValue !== "object") {
    return null
  }

  const moduleRecord = moduleValue as Record<string, unknown>

  if (typeof moduleRecord.parsePptx === "function") {
    return moduleRecord.parsePptx as (data: unknown) => Promise<unknown>
  }

  const defaultExport = moduleRecord.default

  if (typeof defaultExport === "function") {
    return defaultExport as (data: unknown) => Promise<unknown>
  }

  if (defaultExport && typeof defaultExport === "object") {
    const defaultRecord = defaultExport as Record<string, unknown>

    if (typeof defaultRecord.parsePptx === "function") {
      return defaultRecord.parsePptx as (data: unknown) => Promise<unknown>
    }
  }

  return null
}
function decodeArrayBuffer(buffer?: ArrayBuffer): string {
  if (!buffer) {
    return ""
  }

  return new TextDecoder("utf-8").decode(new Uint8Array(buffer))
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
}

function normalizeExtractedText(lines: string[]): string[] {
  const cleaned: string[] = []

  for (const rawLine of lines) {
    const line = rawLine.replace(/\s+/g, " ").trim()

    if (!shouldKeepExtractedLine(line)) {
      continue
    }

    cleaned.push(line)
  }

  return Array.from(new Set(cleaned)).slice(0, 400)
}

function shouldKeepExtractedLine(line: string): boolean {
  if (!line) {
    return false
  }

  if (/^\d+$/.test(line)) {
    return false
  }

  if (/^(page|slide)\s*\d+\b[:.-]*$/i.test(line)) {
    return false
  }

  if (/^(https?:\/\/|www\.)\S+$/i.test(line)) {
    return false
  }

  if (/^[\W_]+$/.test(line)) {
    return false
  }

  return true
}

function buildUnsupportedFormatNotice(
  fileType: "unknown",
  fileName: string
): string[] {
  return [
    `Unsupported file type for ${fileName}.`,
    SUPPORTED_EXTRACTION_TARGETS_NOTICE,
  ]
}

function isFallbackNoticeResult(lines: string[]): boolean {
  if (lines.length === 0) {
    return true
  }

  const joined = lines.join(" ").toLowerCase()

  return (
    joined.includes("no filebuffer was provided") ||
    joined.includes("unsupported file type") ||
    joined.includes("extraction failed") ||
    joined.includes("produced no readable text") ||
    joined.includes("no html content was provided") ||
    joined.includes("image ocr failed")
  )
}

function buildExtractionMetadata({
  method,
  fileType,
  extractedText,
  sourceKind,
  sourceLabel,
  confidenceOverride,
  notesToAppend = [],
  fallbackBehaviorOverride,
}: {
  method: ExtractionMetadata["method"]
  fileType: ExtractTextResult["fileType"]
  extractedText: string[]
  sourceKind?: MaterialSourceKind
  sourceLabel?: string
  confidenceOverride?: number
  notesToAppend?: string[]
  fallbackBehaviorOverride?: string
}): ExtractionMetadata {
  const resolvedSourceKind = resolveSourceKind(fileType, sourceKind)
  const provenance = {
    sourceKind: resolvedSourceKind,
    sourceLabel: sourceLabel?.trim() || defaultSourceLabel(resolvedSourceKind),
    originalType: fileType,
  }

  if (method === "fallback_notice") {
    const ocrCandidate = fileType === "pdf" || fileType === "pptx" || fileType === "image"

    return {
      method,
      quality: "low",
      confidence: clampConfidence(confidenceOverride ?? 0.2),
      notes: [
        `Extraction returned fallback notice output for ${fileType}.`,
        ...notesToAppend,
        "OCR or alternative recovery may be needed later.",
      ],
      ocrCandidate,
      ocrReason: ocrCandidate
        ? fileType === "image"
          ? "Screenshot and photo sources require OCR to recover readable text."
          : "Parser did not recover usable text from a file type that may contain image-based content."
        : null,
      provenance,
      ocrDisposition: ocrCandidate ? "unavailable" : "not_needed",
      fallbackBehavior:
        fallbackBehaviorOverride ??
        buildFallbackBehavior({
          method,
          fileType,
          sourceKind: resolvedSourceKind,
          ocrCandidate,
        }),
    }
  }

  const signals = computeExtractionSignals(extractedText)

  const quality =
    signals.lineCount >= 25 &&
    signals.averageLineLength >= 18 &&
    signals.alphaCharacterRatio >= 0.65
      ? "high"
      : signals.lineCount >= 8 &&
          signals.averageLineLength >= 10 &&
          signals.alphaCharacterRatio >= 0.45
        ? "medium"
        : "low"

  const confidence = clampConfidence(
    confidenceOverride ??
      (quality === "high"
        ? 0.82 + signals.alphaCharacterRatio * 0.12
        : quality === "medium"
          ? 0.56 + signals.alphaCharacterRatio * 0.18
          : 0.28 + signals.alphaCharacterRatio * 0.2)
  )

  const sourceRequiresOcr = fileType === "image"
  const ocrEligibleFileType = fileType === "pdf" || fileType === "pptx" || fileType === "image"
  const ocrCandidate =
    sourceRequiresOcr ||
    (ocrEligibleFileType &&
      quality === "low" &&
      (signals.lineCount <= 6 ||
        signals.averageLineLength < 14 ||
        signals.alphaCharacterRatio < 0.55 ||
        signals.longLineCount === 0))

  const ocrReason = sourceRequiresOcr
    ? "Screenshot and photo sources rely on OCR to recover readable text."
    : ocrCandidate
      ? method === "mixed"
        ? "OCR supplemented thin parser output for this source."
        : "Parser output looks thin or image-based, so OCR recovery is likely worth trying."
      : null

  const notes = [
    `Primary extraction used ${method} for ${fileType}.`,
    `Usable extracted lines: ${signals.lineCount}.`,
    `Average line length: ${signals.averageLineLength.toFixed(1)} characters.`,
    `Alpha character ratio: ${Math.round(signals.alphaCharacterRatio * 100)}%.`,
  ]

  if (signals.longLineCount === 0 && signals.lineCount > 0) {
    notes.push("No longer-form lines were detected, which may indicate thin extraction quality.")
  }

  if (ocrReason) {
    notes.push(ocrReason)
  }

  notes.push(...notesToAppend)

  return {
    method,
    quality,
    confidence,
    notes,
    ocrCandidate,
    ocrReason,
    provenance,
    ocrDisposition:
      method === "ocr" || method === "mixed"
        ? "applied"
        : ocrCandidate
          ? "suggested"
          : "not_needed",
    fallbackBehavior:
      fallbackBehaviorOverride ??
      buildFallbackBehavior({
        method,
        fileType,
        sourceKind: resolvedSourceKind,
        ocrCandidate,
      }),
  }
}

function resolveSourceKind(
  fileType: ExtractTextResult["fileType"],
  sourceKind?: MaterialSourceKind
): MaterialSourceKind {
  if (sourceKind) {
    return sourceKind
  }

  if (fileType === "image") {
    return "image_upload"
  }

  return "file_upload"
}

function defaultSourceLabel(sourceKind: MaterialSourceKind): string {
  if (sourceKind === "pasted_text") {
    return "Pasted text"
  }

  if (sourceKind === "image_upload") {
    return "Screenshot or photo"
  }

  return "Uploaded file"
}

function buildFallbackBehavior({
  method,
  fileType,
  sourceKind,
  ocrCandidate,
}: {
  method: ExtractionMetadata["method"]
  fileType: ExtractTextResult["fileType"]
  sourceKind: MaterialSourceKind
  ocrCandidate: boolean
}): string {
  if (method === "ocr") {
    return "OCR text is surfaced with confidence and provenance notes. Noisy OCR can still be caution-scored or blocked from lesson grounding."
  }

  if (method === "mixed") {
    return "Parser text stays primary and OCR only supplements missing readable text when the parser output is thin."
  }

  if (method === "fallback_notice" && fileType === "image") {
    return "This screenshot or photo stays visible for the teacher, but it should not steer lesson generation until OCR or a clearer text source recovers readable text."
  }

  if (sourceKind === "pasted_text") {
    return "Direct pasted text stays primary and OCR is ignored because the teacher already provided text instead of an image-based source."
  }

  if (ocrCandidate) {
    return "Parser output stays visible for teacher review, but OCR or a stronger source may still be needed before the source is trusted for lesson grounding."
  }

  return "Parser output stays primary and OCR is ignored unless the extracted text looks thin or image-based."
}

function computeExtractionSignals(lines: string[]) {
  const lineCount = lines.length

  if (lineCount === 0) {
    return {
      lineCount: 0,
      averageLineLength: 0,
      alphaCharacterRatio: 0,
      longLineCount: 0,
    }
  }

  const totalCharacters = lines.reduce((sum, line) => sum + line.length, 0)
  const averageLineLength = totalCharacters / lineCount
  const joined = lines.join(" ")
  const nonWhitespaceCharacters = joined.replace(/\s/g, "")
  const alphaCharacters = (nonWhitespaceCharacters.match(/[A-Za-z]/g) || []).length
  const alphaCharacterRatio =
    nonWhitespaceCharacters.length > 0
      ? alphaCharacters / nonWhitespaceCharacters.length
      : 0
  const longLineCount = lines.filter((line) => line.length >= 40).length

  return {
    lineCount,
    averageLineLength,
    alphaCharacterRatio,
    longLineCount,
  }
}

function clampConfidence(value: number): number {
  return Math.max(0.05, Math.min(0.98, Number(value.toFixed(2))))
}
