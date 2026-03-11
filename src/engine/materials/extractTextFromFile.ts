import { PDFParse } from "pdf-parse"

export type ExtractTextInput = {
  fileName: string
  fileContent?: string
  fileBuffer?: ArrayBuffer
}

export type ExtractTextResult = {
  fileName: string
  fileType: "txt" | "pdf" | "docx" | "pptx" | "unknown"
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
    case "pptx":
      return {
        fileName: input.fileName,
        fileType,
        extractedText: buildUnsupportedFormatNotice(fileType, input.fileName),
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
): "txt" | "pdf" | "docx" | "pptx" | "unknown" {
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

async function extractPdfText(input: ExtractTextInput): Promise<string[]> {
  if (!input.fileBuffer) {
    return [
      `PDF file ${input.fileName} was detected, but no fileBuffer was provided.`,
      "Provide the uploaded PDF as an ArrayBuffer so real extraction can run.",
    ]
  }

  let parser: PDFParse | null = null

  try {
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

function normalizeExtractedText(lines: string[]): string[] {
  return Array.from(
    new Set(lines.map((line) => line.trim()).filter((line) => line.length > 0))
  ).slice(0, 400)
}

function buildUnsupportedFormatNotice(
  fileType: "docx" | "pptx" | "unknown",
  fileName: string
): string[] {
  if (fileType === "unknown") {
    return [
      `Unsupported file type for ${fileName}.`,
      "Supported extraction targets are txt, pdf, docx, and pptx.",
    ]
  }

  return [
    `${fileType.toUpperCase()} extraction is not wired yet for ${fileName}.`,
    `This file passed through the real extraction entry point and now needs a ${fileType.toUpperCase()} parser implementation.`,
  ]
}
