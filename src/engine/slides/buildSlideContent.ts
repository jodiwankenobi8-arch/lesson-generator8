import { SlideOutline } from "./slideTypes"

export function buildSlideContent(outline: SlideOutline): string {
  const bodyLines = outline.body
    .map((entry) => normalizeBodyLine(normalizeTeacherPhrase(entry)))
    .filter(Boolean)
    .slice(0, 3)

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
  return value
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
}

function isMeaningfulTeacherNote(note: string): boolean {
  if (!note) return false
  const lower = note.toLowerCase()
  const genericFallbacks = [
    "teacher guidance",
    "teacher prompt",
    "teacher model, guided support",
    "teacher model",
  ]
  return !genericFallbacks.some((f) => lower === f || lower.startsWith(f + ","))
}

function normalizeTeacherPhrase(value: string): string {
  return String(value ?? "")
    .trim()
    .replace(/\b(\w+)\s+\1\b/gi, "$1")
    .replace(/\s+/g, " ")
}
