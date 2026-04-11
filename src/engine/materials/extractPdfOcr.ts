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

type PdfJsTextItemLike = {
  str?: string
  transform?: unknown
}

type PdfJsTextContentLike = {
  items?: unknown[]
}

type PdfJsPageLike = {
  getTextContent: (params?: { disableNormalization?: boolean }) => Promise<PdfJsTextContentLike>
  getViewport: (params: { scale: number }) => { width: number; height: number }
  render: (params: {
    canvas: HTMLCanvasElement
    canvasContext: CanvasRenderingContext2D
    viewport: { width: number; height: number }
  }) => { promise: Promise<void> }
}

type PdfJsDocumentLike = {
  numPages: number
  getPage: (pageNumber: number) => Promise<PdfJsPageLike>
}

type PdfJsLoadingTaskLike = {
  promise: Promise<PdfJsDocumentLike>
  destroy: () => Promise<void>
}

type PdfJsModuleLike = {
  GlobalWorkerOptions: {
    workerSrc: string
  }
  getDocument: (src: { data: Uint8Array }) => PdfJsLoadingTaskLike
}

type PdfRenderedPageImage = {
  pageNumber: number
  dataUrl: string
}

export async function extractPdfTextWithPdfJs(
  fileBuffer: ArrayBuffer,
  options?: {
    maxPages?: number
  }
): Promise<string[]> {
  const { pdf, loadingTask } = await loadPdfDocument(fileBuffer)

  try {
    const pageCount = Math.min(pdf.numPages, Math.max(1, options?.maxPages ?? pdf.numPages))
    const extractedLines: string[] = []

    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber)
      const textContent = await page.getTextContent({
        disableNormalization: false,
      })

      extractedLines.push(...collectPageTextLines(textContent))
    }

    return extractedLines
  } finally {
    await safeDestroyLoadingTask(loadingTask)
  }
}

export async function extractPdfTextWithOcrFallback(
  fileBuffer: ArrayBuffer,
  options?: {
    maxPages?: number
    language?: string
    scale?: number
  }
): Promise<PdfOcrResult> {
  const maxPages = Math.max(1, Math.min(options?.maxPages ?? 6, 8))
  const language = options?.language ?? "eng"
  const scale = Math.max(1.5, Math.min(options?.scale ?? 2.4, 3))

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
      const normalizedPageLines = normalizeOcrText(result.data.text)
      const text = normalizedPageLines.join("\n")
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
        `OCR sampled pages: ${pageImages.map((page) => page.pageNumber).join(", ")}.`,
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
): Promise<PdfRenderedPageImage[]> {
  const { pdf, loadingTask } = await loadPdfDocument(fileBuffer)

  try {
    const pageNumbers = selectPdfPageNumbers(pdf.numPages, maxPages)
    const renderedPages: PdfRenderedPageImage[] = []

    for (const pageNumber of pageNumbers) {
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
  } finally {
    await safeDestroyLoadingTask(loadingTask)
  }
}

function selectPdfPageNumbers(totalPages: number, maxPages: number): number[] {
  const target = Math.max(1, Math.min(totalPages, maxPages))
  const selected: number[] = []

  const addPage = (pageNumber: number) => {
    if (
      pageNumber < 1 ||
      pageNumber > totalPages ||
      selected.includes(pageNumber) ||
      selected.length >= target
    ) {
      return
    }

    selected.push(pageNumber)
  }

  for (let pageNumber = 1; pageNumber <= Math.min(3, totalPages); pageNumber += 1) {
    addPage(pageNumber)
  }

  addPage(Math.ceil(totalPages / 2))

  for (let pageNumber = Math.max(1, totalPages - 1); pageNumber <= totalPages; pageNumber += 1) {
    addPage(pageNumber)
  }

  if (selected.length < target) {
    const step = (totalPages - 1) / Math.max(1, target - 1)

    for (let index = 0; index < target; index += 1) {
      addPage(Math.round(1 + index * step))
    }
  }

  return selected.sort((left, right) => left - right).slice(0, target)
}

async function loadPdfDocument(
  fileBuffer: ArrayBuffer
): Promise<{ pdf: PdfJsDocumentLike; loadingTask: PdfJsLoadingTaskLike }> {
  const pdfjsModule = (await import("pdfjs-dist")) as unknown as PdfJsModuleLike

  pdfjsModule.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString()

  const loadingTask = pdfjsModule.getDocument({
    data: new Uint8Array(fileBuffer),
  })

  const pdf = await loadingTask.promise

  return {
    pdf,
    loadingTask,
  }
}

async function safeDestroyLoadingTask(loadingTask: PdfJsLoadingTaskLike): Promise<void> {
  try {
    await loadingTask.destroy()
  } catch {
    // Ignore cleanup errors so extraction results remain usable.
  }
}

function collectPageTextLines(textContent: PdfJsTextContentLike): string[] {
  const positionedChunks = (textContent.items ?? [])
    .map(resolveTextItem)
    .filter((item): item is { text: string; x: number; y: number } => item !== null)

  if (positionedChunks.length === 0) {
    return []
  }

  const rows: Array<{ y: number; parts: Array<{ x: number; text: string }> }> = []
  const rowTolerance = 2.5

  for (const chunk of positionedChunks) {
    const existingRow = rows.find((row) => Math.abs(row.y - chunk.y) <= rowTolerance)

    if (existingRow) {
      existingRow.parts.push({ x: chunk.x, text: chunk.text })
      continue
    }

    rows.push({
      y: chunk.y,
      parts: [{ x: chunk.x, text: chunk.text }],
    })
  }

  return rows
    .sort((left, right) => right.y - left.y)
    .map((row) =>
      row.parts
        .sort((left, right) => left.x - right.x)
        .map((part) => part.text)
        .join(" ")
        .replace(/\s+([,.;:!?])/g, "$1")
        .replace(/-\s+/g, "-")
        .trim()
    )
    .filter((line) => line.length > 0)
}

function resolveTextItem(item: unknown): { text: string; x: number; y: number } | null {
  if (!item || typeof item !== "object") {
    return null
  }

  const candidate = item as PdfJsTextItemLike
  const text = candidate.str?.replace(/\s+/g, " ").trim()

  if (!text) {
    return null
  }

  const transform = Array.isArray(candidate.transform) ? candidate.transform : []
  const x = typeof transform[4] === "number" ? transform[4] : 0
  const y = typeof transform[5] === "number" ? transform[5] : 0

  return { text, x, y }
}

function normalizeOcrText(text: string): string[] {
  const seen = new Set<string>()
  const normalizedLines: string[] = []

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/\s+/g, " ").trim()

    if (!shouldKeepOcrLine(line)) {
      continue
    }

    const key = line.toLowerCase()
    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    normalizedLines.push(line)

    if (normalizedLines.length >= 400) {
      break
    }
  }

  return normalizedLines
}

function shouldKeepOcrLine(line: string): boolean {
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

function clampConfidence(value: number): number {
  return Math.max(0, Math.min(0.99, Number(value.toFixed(2))))
}
