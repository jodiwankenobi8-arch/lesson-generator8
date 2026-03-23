import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

function splitLines(text: string, maxLength = 92): string[] {
  const rawLines = text.split(/\r?\n/)
  const result: string[] = []

  for (const rawLine of rawLines) {
    const line = rawLine.trimEnd()
    if (!line) {
      result.push("")
      continue
    }

    if (line.length <= maxLength) {
      result.push(line)
      continue
    }

    let current = ""
    for (const word of line.split(/\s+/)) {
      const next = current ? `${current} ${word}` : word
      if (next.length > maxLength) {
        if (current) result.push(current)
        current = word
      } else {
        current = next
      }
    }

    if (current) result.push(current)
  }

  return result
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  return copy.buffer
}

export async function exportPrintablesPdf(title: string, content: string): Promise<Blob> {
  const pdf = await PDFDocument.create()
  let page = pdf.addPage([612, 792])
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)

  const margin = 48
  const width = page.getWidth() - margin * 2
  let y = page.getHeight() - margin

  const drawHeader = () => {
    page.drawText(title, {
      x: margin,
      y,
      size: 18,
      font: bold,
      color: rgb(0.24, 0.19, 0.15),
      maxWidth: width,
    })
    y -= 28
  }

  drawHeader()

  for (const line of splitLines(content)) {
    if (y < 56) {
      page = pdf.addPage([612, 792])
      y = page.getHeight() - margin
      drawHeader()
    }

    page.drawText(line || " ", {
      x: margin,
      y,
      size: 11,
      font,
      color: rgb(0.24, 0.19, 0.15),
      maxWidth: width,
      lineHeight: 14,
    })

    y -= 16
  }

  const bytes = await pdf.save()
  return new Blob([toArrayBuffer(bytes)], { type: "application/pdf" })
}