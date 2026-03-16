import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx"

const SECTION_HEADINGS = new Set([
  "Blueprint Readiness",
  "Coverage Decisions",
  "Missing-Area Prompts",
  "Teach",
  "Guided Practice",
  "Independent Practice",
  "Centers",
  "Closure",
  "Planning Notes",
  "Formative Assessment Ideas",
  "Small Group Ideas",
  "Intervention Ideas",
])

export async function exportLessonPlanDocx(
  title: string,
  lessonPlanText: string
): Promise<Blob> {
  const resolvedTitle = title.trim() || "Lesson Plan Export"
  const lines = normalizeLines(lessonPlanText)

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: resolvedTitle, bold: true })],
          }),
          blankParagraph(),
          ...linesToParagraphs(lines),
        ],
      },
    ],
  })

  return Packer.toBlob(doc)
}

function normalizeLines(text: string): string[] {
  return text
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trimEnd())
}

function linesToParagraphs(lines: string[]): Paragraph[] {
  const paragraphs: Paragraph[] = []
  let previousWasBlank = true

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      if (!previousWasBlank) {
        paragraphs.push(blankParagraph())
      }
      previousWasBlank = true
      continue
    }

    previousWasBlank = false
    paragraphs.push(paragraphForLine(trimmed))
  }

  return paragraphs
}

function paragraphForLine(line: string): Paragraph {
  if (SECTION_HEADINGS.has(line)) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      children: [new TextRun({ text: line, bold: true })],
    })
  }

  return new Paragraph({
    children: [new TextRun(line)],
  })
}

function blankParagraph(): Paragraph {
  return new Paragraph({
    children: [new TextRun("")],
  })
}
