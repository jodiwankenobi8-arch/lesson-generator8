export type ExtractTextInput = {
  fileName: string
  fileContent?: string
  fileBuffer?: ArrayBuffer
}

export type ExtractTextResult = {
  fileName: string
  fileType: "txt" | "pdf" | "docx" | "pptx" | "html" | "unknown"
  extractedText: string[]
}

export async function extractTextFromFile(
  input: ExtractTextInput
): Promise<ExtractTextResult> {
  const fileType = detectFileType(input.fileName)

  switch (fileType) {
    case "txt":
      return {
        fileName: input.fileName,
        fileType,
        extractedText: extractPlainText(input.fileContent ?? ""),
      }

    case "pdf":
      return {
        fileName: input.fileName,
        fileType,
        extractedText: await extractPdfText(input),
      }

    case "docx":
      return {
        fileName: input.fileName,
        fileType,
        extractedText: await extractDocxText(input),
      }

    case "html":
      return {
        fileName: input.fileName,
        fileType,
        extractedText: extractHtmlText(
          input.fileContent ?? decodeArrayBuffer(input.fileBuffer)
        ),
      }

    case "pptx":
      return {
        fileName: input.fileName,
        fileType,
        extractedText: await extractPptxText(input),
      }

    default:
      return {
        fileName: input.fileName,
        fileType: "unknown",
        extractedText: buildUnsupportedFormatNotice("unknown", input.fileName),
      }
  }
}

export function detectFileType(
  fileName: string
): "txt" | "pdf" | "docx" | "pptx" | "html" | "unknown" {
  const lower = fileName.toLowerCase()

  if (lower.endsWith(".txt")) {
    return "txt"
  }

  if (lower.endsWith(".pdf")) {
    return "pdf"
  }

  if (lower.endsWith(".docx")) {
    return "docx"
  }

  if (lower.endsWith(".pptx")) {
    return "pptx"
  }

  if (lower.endsWith(".html") || lower.endsWith(".htm")) {
    return "html"
  }

  return "unknown"
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

    return [
      `PDF extraction failed for ${input.fileName}.`,
      message,
    ]
  } finally {
    if (parser) {
      await parser.destroy()
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

    return [
      `DOCX extraction failed for ${input.fileName}.`,
      message,
    ]
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
    const parsed = await pptxModule.parsePptx(new Uint8Array(input.fileBuffer))
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

    return [
      `PPTX extraction failed for ${input.fileName}.`,
      message,
    ]
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
    "Supported extraction targets are txt, pdf, docx, pptx, html, and htm.",
  ]
}
