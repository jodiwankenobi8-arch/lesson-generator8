import type { LessonBlueprint, LessonSpec } from "../types"
import { getNormalizedBlueprintValues } from "../shared/teacherFacingContent"

export function resolveCenterLabels(spec: LessonSpec, fallbackLabels: string[]): string[] {
  const rawLabels = takeClean(spec.centers.steps, 6)
    .filter(isStudentIndependentCenterLine)
    .map((item) => {
      const lower = item.toLowerCase()
      return lower.includes("center") ? item : ""
    })
    .filter(Boolean)
    .slice(0, 3)

  return fallbackLabels.map((defaultLabel, index) => rawLabels[index] || defaultLabel)
}

function resolveCenterNarrativeSteps(spec: LessonSpec): string[] {
  const studentIndependentSteps = takeClean(spec.centers.steps, spec.centers.steps.length)
    .filter(isStudentIndependentCenterLine)

  if (studentIndependentSteps.length > 0) {
    return studentIndependentSteps
  }

  return [
    "Set up student-independent center expectations.",
    "Rotate students through the selected center tasks.",
  ]
}

function isStudentIndependentCenterLine(line: string): boolean {
  const lower = line.toLowerCase()

  return !(
    lower.includes("teacher") ||
    lower.includes("small group") ||
    lower.includes("small-group") ||
    lower.includes("intervention") ||
    lower.includes("reteach") ||
    lower.includes("guided group") ||
    lower.includes("teacher-led") ||
    lower.includes("teacher led") ||
    lower.includes("support /") ||
    lower.includes("support center") ||
    lower.includes("teacher table")
  )
}

export function selectWordListFocus(blueprint: LessonBlueprint, fallback: string): string {
  return focusList(getNormalizedBlueprintValues(blueprint, "wordList"), 2, fallback)
}

export function selectTextFocus(blueprint: LessonBlueprint, fallback: string): string {
  return focusList(getNormalizedBlueprintValues(blueprint, "text"), 1, fallback)
}

export function selectPracticeFocus(blueprint: LessonBlueprint, fallback: string): string {
  return focusList(getNormalizedBlueprintValues(blueprint, "practice"), 1, fallback)
}

export function selectVocabularyFocus(blueprint: LessonBlueprint, fallback: string): string {
  return focusList(getNormalizedBlueprintValues(blueprint, "vocabulary"), 3, fallback)
}

function focusList(items: string[], count: number, fallback: string): string {
  const cleaned = takeClean(items, count)
  return cleaned.length > 0 ? cleaned.join(", ") : fallback
}

function takeClean(items: string[], count: number): string[] {
  return Array.from(
    new Set(
      (items ?? [])
        .map((item) => sanitizePackageValue(item))
        .filter((item) => item.length > 0)
        .filter((item) => !isWeakPackageValue(item))
    )
  ).slice(0, count)
}

function sanitizePackageValue(value: string): string {
  return stripTrailingPunctuation(
    value
      .replace(/^[\s*•\-–—]+/, "")
      .replace(/^[a-z]\s+(?=[A-Z]{2,}(?:\.[A-Za-z0-9]+){2,}\s*:)/, "")
      .replace(/^[A-Z]{2,}(?:\.[A-Za-z0-9]+){2,}\s*:\s*/, "")
      .replace(/\s+/g, " ")
      .trim()
  )
}

function isWeakPackageValue(value: string): boolean {
  const lower = value.toLowerCase()
  const wordCount = value.split(/\s+/).length
  const commaCount = (value.match(/,/g) || []).length

  if (/\.(pdf|pptx|docx|html|htm|png|jpg|jpeg|webp)\b/i.test(lower)) {
    return true
  }

  if (lower.includes("|")) {
    return true
  }

  if (/students?\s*:\s*\d+/i.test(value)) {
    return true
  }

  if (/time\s*[:=]/i.test(lower)) {
    return true
  }

  if (/\b\d+\s*(min|mins|minutes)\b/i.test(lower)) {
    return true
  }

  if (
    lower.includes("smartboard") ||
    lower.includes("projector") ||
    lower.includes("desks") ||
    lower.includes("carpet")
  ) {
    return true
  }

  if (commaCount >= 4) {
    return true
  }

  if (wordCount > 18) {
    return true
  }

  if (["standard", "standards", "slide", "visual / image"].includes(lower)) {
    return true
  }

  return false
}

function stripTrailingPunctuation(value: string): string {
  return value.replace(/[.!?]+$/g, "").trim()
}
