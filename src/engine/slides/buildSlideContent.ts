import { SlideOutline } from "./slideTypes"

export function buildSlideContent(outline: SlideOutline): string {
  const bodyLines = outline.body
    .map((entry) => normalizeBodyLine(normalizeTeacherPhrase(entry)))
    .filter(isPreviewFriendlyBodyLine)
    .slice(0, 2)

  const teacherNote = normalizeTeacherPhrase(outline.teacherMove)
  const purpose = normalizeTeacherPhrase(outline.purpose)
  const meaningfulNote = isMeaningfulTeacherNote(teacherNote) ? teacherNote : ""

  const contentLines = bodyLines.length > 0 ? bodyLines : (purpose ? [purpose] : [])

  return [
    `Slide ${outline.slideNumber}: ${normalizeTeacherPhrase(outline.title)}`,
    ...contentLines,
    meaningfulNote ? `Teacher note: ${meaningfulNote}` : "",
  ]
    .filter(Boolean)
    .join("\n")
}

function normalizeBodyLine(value: string): string {
  const normalized = value
    .replace(/^Model Words:\s*/i, "Words: ")
    .replace(/^Model Text:\s*/i, "Text: ")
    .replace(/^Practice Anchor:\s*/i, "Practice: ")
    .replace(/^Word Support:\s*/i, "Words: ")
    .replace(/^Text Support:\s*/i, "Text: ")
    .replace(/^Independent Task:\s*/i, "Practice: ")
    .replace(/^Students Apply:\s*/i, "Words: ")
    .replace(/^Students Reference:\s*/i, "Text: ")
    .replace(/^Teacher Move Focus:\s*/i, "")
    .replace(/^Lesson Focus:\s*/i, "Focus: ")
    .replace(/^Review Words:\s*/i, "Review: ")
    .replace(/^Review Vocabulary:\s*/i, "Review: ")
    .trim()

  const colonIndex = normalized.indexOf(":")
  if (colonIndex < 0) {
    return normalized
  }

  const label = normalized.slice(0, colonIndex + 1)
  const remainder = normalized
    .slice(colonIndex + 1)
    .trim()
    .replace(/\s+/g, " ")

  return `${label} ${remainder}`.trim()
}

function isPreviewFriendlyBodyLine(line: string): boolean {
  if (!line) return false
  if (line.length > 120) return false

  return /^(Words|Text|Practice|Focus|Review|Target|Standards|Vocabulary|Key reminder):/i.test(line)
}

function isMeaningfulTeacherNote(note: string): boolean {
  if (!note) return false
  const lower = note.toLowerCase()
  const genericFallbacks = [
    "teacher guidance",
    "teacher prompt",
    "teacher model, guided support",
    "teacher model",
    "guided support",
    "teacher move",
    "isolate",
  ]
  return !genericFallbacks.some((f) => lower === f || lower.startsWith(f))
}

function normalizeTeacherPhrase(value: string): string {
  return String(value ?? "")
    .trim()
    .replace(/\b(\w+)\s+\1\b/gi, "$1")
    .replace(/\s+/g, " ")
}
