export type ImageOcrResult = {
  lines: string[]
  averageConfidence: number
  notes: string[]
}

export async function extractImageTextWithOcr(
  fileBuffer: ArrayBuffer,
  options?: {
    language?: string
    mimeType?: string
  }
): Promise<ImageOcrResult> {
  const language = options?.language ?? "eng"
  const mimeType = options?.mimeType ?? "image/png"

  if (typeof window === "undefined" || typeof URL === "undefined") {
    return {
      lines: [],
      averageConfidence: 0,
      notes: ["Image OCR is only available in a browser environment."],
    }
  }

  const blob = new Blob([fileBuffer], { type: mimeType })
  const objectUrl = URL.createObjectURL(blob)

  const tesseractModule = await import("tesseract.js")
  const worker = await tesseractModule.createWorker(language)

  try {
    const result = await worker.recognize(objectUrl)
    const lines = normalizeOcrText(result.data.text)
    const averageConfidence = clampConfidence((result.data.confidence ?? 0) / 100)

    return {
      lines,
      averageConfidence,
      notes: [
        "OCR processed 1 image source.",
        `Average OCR confidence: ${Math.round(averageConfidence * 100)}%.`,
      ],
    }
  } finally {
    await worker.terminate()
    URL.revokeObjectURL(objectUrl)
  }
}

function normalizeOcrText(text: string): string[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 0)

  return Array.from(new Set(lines)).slice(0, 400)
}

function clampConfidence(value: number): number {
  return Math.max(0, Math.min(0.99, Number(value.toFixed(2))))
}
