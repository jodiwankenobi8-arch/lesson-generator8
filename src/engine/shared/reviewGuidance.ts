import type { LessonBlueprint } from "../types"
import { getNormalizedBlueprintValues } from "./teacherFacingContent"

export type GroundingReviewKind = "vocabulary" | "wordList" | "text" | "practice"

export const REVIEW_VOCABULARY_REFERENCE =
  "the vocabulary you confirm on Materials before teaching"
export const REVIEW_WORD_EXAMPLES_REFERENCE =
  "the examples you confirm on Materials before teaching"
export const REVIEW_TEXT_REFERENCE =
  "the text or topic you confirm on Materials before teaching"
export const REVIEW_PRACTICE_REFERENCE =
  "the practice task you confirm on Materials before teaching"

export const REVIEW_VOCABULARY_STATUS =
  "Review needed on Materials before vocabulary is classroom-ready"
export const REVIEW_WORD_EXAMPLES_STATUS =
  "Review needed on Materials before word examples are classroom-ready"
export const REVIEW_TEXT_STATUS =
  "Review needed on Materials before text or topic is classroom-ready"
export const REVIEW_PRACTICE_STATUS =
  "Review needed on Materials before practice is classroom-ready"
export const REVIEW_CONTENT_ANCHOR_STATUS =
  "Review needed on Materials before concrete lesson examples or a text/topic are classroom-ready"

export const REVIEW_CONTENT_SUMMARY =
  "Review the selected lesson materials on Materials before relying on generated vocabulary, examples, text or topic, or practice."

export function getReviewNeededStatus(kind: GroundingReviewKind): string {
  switch (kind) {
    case "vocabulary":
      return REVIEW_VOCABULARY_STATUS
    case "wordList":
      return REVIEW_WORD_EXAMPLES_STATUS
    case "text":
      return REVIEW_TEXT_STATUS
    case "practice":
      return REVIEW_PRACTICE_STATUS
  }
}

export function getReviewReference(kind: GroundingReviewKind): string {
  switch (kind) {
    case "vocabulary":
      return REVIEW_VOCABULARY_REFERENCE
    case "wordList":
      return REVIEW_WORD_EXAMPLES_REFERENCE
    case "text":
      return REVIEW_TEXT_REFERENCE
    case "practice":
      return REVIEW_PRACTICE_REFERENCE
  }
}

export function isReviewGuidanceValue(value: string): boolean {
  const lower = String(value ?? "").trim().toLowerCase()

  return [
    REVIEW_VOCABULARY_REFERENCE,
    REVIEW_WORD_EXAMPLES_REFERENCE,
    REVIEW_TEXT_REFERENCE,
    REVIEW_PRACTICE_REFERENCE,
    REVIEW_VOCABULARY_STATUS,
    REVIEW_WORD_EXAMPLES_STATUS,
    REVIEW_TEXT_STATUS,
    REVIEW_PRACTICE_STATUS,
    REVIEW_CONTENT_ANCHOR_STATUS,
    REVIEW_CONTENT_SUMMARY,
  ].some((item) => item.toLowerCase() === lower)
}

function normalizeTarget(primaryTarget?: string | null): string {
  const normalized = String(primaryTarget ?? "").trim().toLowerCase()

  if ([
    "phonics",
    "foundational",
    "foundational_skills",
    "phonological_awareness",
    "phonemic_awareness",
    "high_frequency_words",
    "letter_identification",
    "decoding",
    "encoding",
    "spelling",
    "spelling_encoding",
    "word_recognition",
    "word_building",
    "decodable_reading",
  ].includes(normalized)) {
    return "foundational"
  }

  if (["comprehension", "language_comprehension", "reading_response"].includes(normalized)) {
    return "comprehension"
  }

  if (["vocabulary", "oral_language", "vocabulary_oral_language", "speaking_listening"].includes(normalized)) {
    return "vocabulary"
  }

  if (["fluency"].includes(normalized)) {
    return "fluency"
  }

  if (["writing", "writing_about_reading", "writing_sentence_work"].includes(normalized)) {
    return "writing"
  }

  if (["grammar", "grammar_language_conventions"].includes(normalized)) {
    return "grammar"
  }

  return normalized || "general"
}

function getRequiredKindsForTarget(primaryTarget?: string | null, isMixedTarget = false): GroundingReviewKind[] {
  if (isMixedTarget) {
    return ["practice"]
  }

  switch (normalizeTarget(primaryTarget)) {
    case "foundational":
      return ["wordList", "practice"]
    case "comprehension":
      return ["text", "practice"]
    case "vocabulary":
      return ["vocabulary", "practice"]
    case "fluency":
      return ["text", "practice"]
    case "writing":
      return ["text", "practice"]
    case "grammar":
      return ["practice"]
    default:
      return ["practice"]
  }
}

function getRecommendedKindsForTarget(primaryTarget?: string | null, isMixedTarget = false): GroundingReviewKind[] {
  if (isMixedTarget) {
    return ["vocabulary", "wordList", "text"]
  }

  switch (normalizeTarget(primaryTarget)) {
    case "foundational":
      return ["vocabulary", "text"]
    case "comprehension":
      return ["vocabulary", "wordList"]
    case "vocabulary":
      return ["text", "wordList"]
    case "fluency":
      return ["vocabulary", "wordList"]
    case "writing":
      return ["vocabulary", "wordList"]
    case "grammar":
      return ["vocabulary", "text", "wordList"]
    default:
      return ["vocabulary", "wordList", "text"]
  }
}

export type GroundingReviewState = {
  values: Record<GroundingReviewKind, string[]>
  missingRequired: GroundingReviewKind[]
  missingRecommended: GroundingReviewKind[]
  needsContentAnchor: boolean
  blocksExports: boolean
}

export function evaluateGroundingReviewState(blueprint: LessonBlueprint): GroundingReviewState {
  const values: Record<GroundingReviewKind, string[]> = {
    vocabulary: getNormalizedBlueprintValues(blueprint, "vocabulary"),
    wordList: getNormalizedBlueprintValues(blueprint, "wordList"),
    text: getNormalizedBlueprintValues(blueprint, "text"),
    practice: getNormalizedBlueprintValues(blueprint, "practice"),
  }

  const required = getRequiredKindsForTarget(
    blueprint.content.target.primary,
    blueprint.content.target.isMixedTarget
  )
  const recommended = getRecommendedKindsForTarget(
    blueprint.content.target.primary,
    blueprint.content.target.isMixedTarget
  )

  const missingRequired = required.filter((kind) => values[kind].length === 0)
  const missingRecommended = recommended.filter((kind) => values[kind].length === 0)
  const needsContentAnchor = values.vocabulary.length === 0 && values.wordList.length === 0 && values.text.length === 0

  return {
    values,
    missingRequired,
    missingRecommended,
    needsContentAnchor,
    blocksExports: missingRequired.length > 0 || needsContentAnchor,
  }
}

export function formatGroundingReviewKinds(kinds: GroundingReviewKind[]): string {
  const labels = kinds.map((kind) => {
    switch (kind) {
      case "vocabulary":
        return "vocabulary"
      case "wordList":
        return "word examples"
      case "text":
        return "text or topic"
      case "practice":
        return "practice task"
    }
  })

  if (labels.length <= 1) {
    return labels[0] ?? ""
  }

  if (labels.length === 2) {
    return `${labels[0]} and ${labels[1]}`
  }

  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`
}
