export type PdfOcrPageResult = {
  pageNumber: number
  text: string
  confidence: number
}

export type PdfOcrResult = {
  pages: PdfOcrPageResult[]
  combinedLines: string[]
  averageConfidence: number
  notes: string[]
}

export async function extractPdfTextWithOcrFallback(
  fileBuffer: ArrayBuffer,
  options?: {
    maxPages?: number
    language?: string
    scale?: number
  }
): Promise<PdfOcrResult> {
  const maxPages = options?.maxPages ?? 3
  const language = options?.language ?? "eng"
  const scale = options?.scale ?? 2

  if (typeof window === "undefined" || typeof document === "undefined") {
    return {
      pages: [],
      combinedLines: [],
      averageConfidence: 0,
      notes: ["OCR fallback is only available in a browser environment."],
    }
  }

  const pageImages = await renderPdfPagesToImages(fileBuffer, maxPages, scale)

  if (pageImages.length === 0) {
    return {
      pages: [],
      combinedLines: [],
      averageConfidence: 0,
      notes: ["PDF OCR fallback could not render any pages to images."],
    }
  }

  const tesseractModule = await import("tesseract.js")
  const worker = await tesseractModule.createWorker(language)

  try {
    const pages: PdfOcrPageResult[] = []

    for (const pageImage of pageImages) {
      const result = await worker.recognize(pageImage.dataUrl)
      const text = normalizeOcrText(result.data.text).join("\n")
      const confidence = clampConfidence((result.data.confidence ?? 0) / 100)

      pages.push({
        pageNumber: pageImage.pageNumber,
        text,
        confidence,
      })
    }

    const combinedLines = normalizeOcrText(
      pages
        .map((page) => page.text)
        .filter((text) => text.trim().length > 0)
        .join("\n")
    )

    const averageConfidence =
      pages.length > 0
        ? clampConfidence(
            pages.reduce((sum, page) => sum + page.confidence, 0) / pages.length
          )
        : 0

    return {
      pages,
      combinedLines,
      averageConfidence,
      notes: [
        `OCR processed ${pages.length} page(s).`,
        `Average OCR confidence: ${Math.round(averageConfidence * 100)}%.`,
      ],
    }
  } finally {
    await worker.terminate()
  }
}

async function renderPdfPagesToImages(
  fileBuffer: ArrayBuffer,
  maxPages: number,
  scale: number
): Promise<Array<{ pageNumber: number; dataUrl: string }>> {
  const pdfjsModule = await import("pdfjs-dist")

  pdfjsModule.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString()

  const loadingTask = pdfjsModule.getDocument({
    data: new Uint8Array(fileBuffer),
  })

  const pdf = await loadingTask.promise
  const pageCount = Math.min(pdf.numPages, Math.max(1, maxPages))
  const renderedPages: Array<{ pageNumber: number; dataUrl: string }> = []

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const viewport = page.getViewport({ scale })
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")

    if (!context) {
      continue
    }

    canvas.width = Math.ceil(viewport.width)
    canvas.height = Math.ceil(viewport.height)

    await page.render({
      canvas,
      canvasContext: context,
      viewport,
    }).promise

    renderedPages.push({
      pageNumber,
      dataUrl: canvas.toDataURL("image/png"),
    })
  }

  return renderedPages
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
