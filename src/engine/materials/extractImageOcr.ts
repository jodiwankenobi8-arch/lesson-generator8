export type ImageOcrResult = {
  lines: string[]
  averageConfidence: number
  notes: string[]
}

type ImageOcrWorker = {
  recognize: (image: string) => Promise<{ data: { text: string; confidence?: number | null } }>
  terminate: () => Promise<unknown> | unknown
}

let queuedImageOcrWork: Promise<void> = Promise.resolve()

export async function extractImageTextWithOcr(
  fileBuffer: ArrayBuffer,
  options?: {
    language?: string
    mimeType?: string
  }
): Promise<ImageOcrResult> {
  const language = options?.language ?? "eng"
  const mimeType = options?.mimeType ?? "image/png"

  if (!hasBrowserImageOcrRuntime()) {
    return {
      lines: [],
      averageConfidence: 0,
      notes: ["Image OCR is only available in a browser environment."],
    }
  }

  return enqueueImageOcrJob(async () => {
    const blob = new Blob([fileBuffer], { type: mimeType })
    let objectUrl: string | null = null
    let worker: ImageOcrWorker | null = null

    try {
      objectUrl = URL.createObjectURL(blob)

      const tesseractModule = await import("tesseract.js")
      worker = await tesseractModule.createWorker(language)

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
      await cleanupImageOcrResources({
        objectUrl,
        worker,
      })
    }
  })
}

function hasBrowserImageOcrRuntime(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof URL !== "undefined" &&
    typeof URL.createObjectURL === "function" &&
    typeof URL.revokeObjectURL === "function"
  )
}

function enqueueImageOcrJob<T>(job: () => Promise<T>): Promise<T> {
  const previousJob = queuedImageOcrWork.catch(() => undefined)
  const nextJob = previousJob.then(job)

  queuedImageOcrWork = nextJob.then(
    () => undefined,
    () => undefined
  )

  return nextJob
}

async function cleanupImageOcrResources({
  objectUrl,
  worker,
}: {
  objectUrl: string | null
  worker: ImageOcrWorker | null
}): Promise<void> {
  if (objectUrl) {
    try {
      URL.revokeObjectURL(objectUrl)
    } catch {
      // Keep cleanup best-effort. OCR runtime failures should not be replaced by URL cleanup noise.
    }
  }

  if (!worker) {
    return
  }

  await Promise.allSettled([
    Promise.resolve(worker.terminate()).catch(() => undefined),
  ])
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
