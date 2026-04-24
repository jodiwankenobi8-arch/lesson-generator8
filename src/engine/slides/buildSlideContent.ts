import { SlideOutline } from "./slideTypes"

export function buildSlideContent(outline: SlideOutline): string {
  const cleanedBody = outline.body
    .map((entry) => stripFieldLabel(normalizeTeacherPhrase(entry)))
    .filter(Boolean)

  const studentContent = cleanedBody.slice(0, 2).join("; ")
  const examples = cleanedBody.slice(2, 4).join("; ")

  return [
    `Slide ${outline.slideNumber}: ${normalizeTeacherPhrase(outline.title)}`,
    normalizeTeacherPhrase(outline.purpose),
    `Teacher move: ${normalizeTeacherPhrase(outline.teacherMove)}`,
    studentContent ? `Student content: ${studentContent}` : "",
    examples ? `Examples and practice: ${examples}` : "",
    `Teacher language: ${normalizeTeacherPhrase(outline.promptStyle)}; ${normalizeTeacherPhrase(outline.tone)} approach.`,
  ]
    .filter(Boolean)
    .join("\n")
}

function stripFieldLabel(value: string): string {
  return value.replace(/^[A-Za-z][A-Za-z /-]{1,32}:\s*/, "").trim()
}

function normalizeTeacherPhrase(value: string): string {
  return String(value ?? "")
    .trim()
    .replace(/\b(\w+)\s+\1\b/gi, "$1")
    .replace(/\s+/g, " ")
}
