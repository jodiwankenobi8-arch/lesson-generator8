import PptxGenJS from "pptxgenjs"

const PPTX_MIME = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
const SLIDE_MARKER_PATTERN = /slide\s+\d+\s*:/gi

function toBlobPart(value: unknown): BlobPart {
  if (value instanceof Blob) return value
  if (value instanceof ArrayBuffer) return value
  if (typeof value === "string") return value
  if (value instanceof Uint8Array) {
    const copy = new Uint8Array(value.byteLength)
    copy.set(value)
    return copy.buffer
  }

  return String(value ?? "")
}

function normalizeSlidesExportContent(content: string): string {
  return content
    .replace(/\r\n?/g, "\n")
    .replace(/^\s*slides export\b\s*/i, "")
    .trim()
}

export function parseSlidesExportContent(content: string): string[] {
  const normalized = normalizeSlidesExportContent(content)

  if (!normalized) {
    return []
  }

  const matches = Array.from(normalized.matchAll(SLIDE_MARKER_PATTERN))

  if (matches.length > 0) {
    return matches
      .map((match, index) => {
        const start = match.index ?? 0
        const end = matches[index + 1]?.index ?? normalized.length
        return normalized.slice(start, end).trim()
      })
      .filter(Boolean)
  }

  return normalized
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
}

export async function exportSlidesPptx(title: string, slides: string[]): Promise<Blob> {
  const pptx = new PptxGenJS()
  pptx.layout = "LAYOUT_WIDE"
  pptx.author = "Lesson Generator 8"
  pptx.company = "Lesson Generator 8"
  pptx.subject = title
  pptx.title = title

  slides.forEach((slideText, index) => {
    const slide = pptx.addSlide()
    const lines = slideText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)

    const heading = lines[0] ?? `Slide ${index + 1}`
    const body = lines.slice(1).join("\n") || " "

    slide.addText(heading, {
      x: 0.6,
      y: 0.4,
      w: 12.0,
      h: 0.7,
      fontSize: 24,
      bold: true,
      color: "3E3128",
      margin: 0,
    })

    slide.addText(body, {
      x: 0.8,
      y: 1.3,
      w: 11.5,
      h: 5.4,
      fontSize: 16,
      color: "3E3128",
      valign: "top",
      margin: 0.08,
      fit: "shrink",
      breakLine: false,
    })
  })

  const output = await pptx.write({ outputType: "arraybuffer" })
  return new Blob([toBlobPart(output)], { type: PPTX_MIME })
}
