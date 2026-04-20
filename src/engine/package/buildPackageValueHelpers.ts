import type { LessonBlueprint, LessonSpec } from "../types"
import { getNormalizedBlueprintValues } from "../shared/teacherFacingContent"
import {
  REVIEW_PRACTICE_REFERENCE,
  REVIEW_TEXT_REFERENCE,
  REVIEW_VOCABULARY_REFERENCE,
  REVIEW_WORD_EXAMPLES_REFERENCE,
  isReviewGuidanceValue,
} from "../shared/reviewGuidance"

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


export type PackageValueKind = "standard" | "vocabulary" | "wordList" | "text" | "practice"

export function getPackageDisplayValues(
  blueprint: LessonBlueprint,
  kind: PackageValueKind,
  count = Number.POSITIVE_INFINITY
): string[] {
  return takeClean(getNormalizedBlueprintValues(blueprint, kind), count)
}

export function selectWordListFocus(blueprint: LessonBlueprint, fallback: string): string {
  return focusList(getPackageDisplayValues(blueprint, "wordList", 2), 2, normalizeFocusFallback("wordList", fallback))
}

export function selectTextFocus(blueprint: LessonBlueprint, fallback: string): string {
  return focusList(getPackageDisplayValues(blueprint, "text", 1), 1, normalizeFocusFallback("text", fallback))
}

export function selectPracticeFocus(blueprint: LessonBlueprint, fallback: string): string {
  return focusList(getPackageDisplayValues(blueprint, "practice", 1), 1, normalizeFocusFallback("practice", fallback))
}

export function selectVocabularyFocus(blueprint: LessonBlueprint, fallback: string): string {
  return focusList(getPackageDisplayValues(blueprint, "vocabulary", 3), 3, normalizeFocusFallback("vocabulary", fallback))
}

function focusList(items: string[], count: number, fallback: string): string {
  const cleaned = takeClean(items, count)
  return cleaned.length > 0 ? cleaned.join(", ") : fallback
}

function normalizeFocusFallback(kind: PackageValueKind, fallback: string): string {
  const normalized = fallback.trim()
  const lower = normalized.toLowerCase()

  if (!normalized || isReviewGuidanceValue(normalized)) {
    return normalized
  }

  if (kind === "vocabulary") {
    if ([
      "grounded lesson vocabulary",
      "no grounded vocabulary surfaced yet",
      "key vocabulary",
      "key skill vocabulary",
    ].includes(lower)) {
      return REVIEW_VOCABULARY_REFERENCE
    }
  }

  if (kind === "wordList") {
    if ([
      "teacher-selected examples",
      "teacher-selected word examples",
      "target word examples",
      "target words for student transfer",
      "grounded word examples from the selected lesson materials",
      "grounded examples for student transfer",
      "grounded review examples",
      "grounded lesson words",
      "target words",
      "strong word examples",
      "no grounded word examples surfaced yet",
    ].includes(lower)) {
      return REVIEW_WORD_EXAMPLES_REFERENCE
    }
  }

  if (kind === "text") {
    if ([
      "teacher-provided text",
      "teacher-provided lesson text",
      "lesson text",
      "lesson text for student response",
      "grounded text or topic from the selected lesson materials",
      "no grounded text or topic surfaced yet",
    ].includes(lower)) {
      return REVIEW_TEXT_REFERENCE
    }
  }

  if (kind === "practice") {
    if ([
      "guided practice",
      "guided foundational-skill practice",
      "guided response work",
      "curriculum-aligned guided practice",
      "curriculum-aligned foundational-skill practice",
      "curriculum practice task",
      "curriculum-aligned practice task",
      "a grounded guided-practice task from the selected lesson materials",
      "a grounded practice task from the selected lesson materials",
      "no grounded practice task surfaced yet",
    ].includes(lower)) {
      return REVIEW_PRACTICE_REFERENCE
    }
  }

  return normalized
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
      .replace(/^(hb\s+)?florida\s+b\.?e\.?s\.?t\.?\s+standards?:?\s*/i, "")
      .replace(/^standards?:?\s*/i, "")
      .replace(/^benchmarks?:?\s*/i, "")
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

  if (
    /teacher edition|student edition|copyright|all rights reserved|printed in/i.test(lower) ||
    /phonics\)\s*edition\)/i.test(lower) ||
    /ses tpe|metic parses|letter-sound motions\)/i.test(lower)
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

