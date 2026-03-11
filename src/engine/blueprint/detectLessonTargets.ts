import { LessonInputs, LessonMode } from "../types"

type DetectedTarget = "phonics" | "comprehension" | "mixed" | "general"

export interface DetectedLessonTargets {
  primary: DetectedTarget
  secondary: Exclude<DetectedTarget, "mixed" | "general"> | null
  isMixedTarget: boolean
  recommendedMode: LessonMode
}

function flattenInputs(inputs: LessonInputs): string {
  return Object.values(inputs as Record<string, unknown>)
    .filter((value) => value !== null && value !== undefined)
    .map((value) => String(value))
    .join(" ")
    .toLowerCase()
}

function countMatches(text: string, terms: string[]): number {
  return terms.filter((term) => text.includes(term)).length
}

export function detectLessonTargets(
  inputs: LessonInputs,
  selectedMode: LessonMode = "single"
): DetectedLessonTargets {
  if (selectedMode === "phonics_only") {
    return {
      primary: "phonics",
      secondary: null,
      isMixedTarget: false,
      recommendedMode: "phonics_only",
    }
  }

  if (selectedMode === "comprehension_only") {
    return {
      primary: "comprehension",
      secondary: null,
      isMixedTarget: false,
      recommendedMode: "comprehension_only",
    }
  }

  if (selectedMode === "full") {
    return {
      primary: "mixed",
      secondary: null,
      isMixedTarget: true,
      recommendedMode: "full",
    }
  }

  const combined = flattenInputs(inputs)

  const phonicsStrongTerms = [
    "phonics",
    "long a",
    "short a",
    "cvc",
    "cvce",
    "vowel",
    "blend",
    "digraph",
    "decode",
    "decodable",
    "word list",
    "spelling pattern",
    "sound",
    "syllable",
    "foundational",
    "rf.",
  ]

  const phonicsSupportTerms = [
    "segment",
    "encoding",
    "word work",
    "letter sound",
    "phoneme",
    "high frequency word",
  ]

  const comprehensionStrongTerms = [
    "comprehension",
    "main idea",
    "theme",
    "infer",
    "inference",
    "summarize",
    "summary",
    "text evidence",
    "character",
    "plot",
    "setting",
    "retell",
    "literature",
    "informational",
    "rl.",
    "ri.",
  ]

  const comprehensionSupportTerms = [
    "details",
    "passage",
    "story",
    "article",
    "respond to text",
    "constructed response",
    "cite evidence",
    "compare texts",
  ]

  const phonicsStrongCount = countMatches(combined, phonicsStrongTerms)
  const phonicsSupportCount = countMatches(combined, phonicsSupportTerms)
  const comprehensionStrongCount = countMatches(combined, comprehensionStrongTerms)
  const comprehensionSupportCount = countMatches(combined, comprehensionSupportTerms)

  const phonicsScore = phonicsStrongCount * 2 + phonicsSupportCount
  const comprehensionScore = comprehensionStrongCount * 2 + comprehensionSupportCount

  const hasStrongPhonics = phonicsStrongCount > 0
  const hasStrongComprehension = comprehensionStrongCount > 0

  if (hasStrongPhonics && !hasStrongComprehension && comprehensionScore <= 1) {
    return {
      primary: "phonics",
      secondary: null,
      isMixedTarget: false,
      recommendedMode: "phonics_only",
    }
  }

  if (hasStrongComprehension && !hasStrongPhonics && phonicsScore <= 1) {
    return {
      primary: "comprehension",
      secondary: null,
      isMixedTarget: false,
      recommendedMode: "comprehension_only",
    }
  }

  if (phonicsScore >= comprehensionScore + 3 && hasStrongPhonics) {
    return {
      primary: "phonics",
      secondary: hasStrongComprehension ? "comprehension" : null,
      isMixedTarget: false,
      recommendedMode: "phonics_only",
    }
  }

  if (comprehensionScore >= phonicsScore + 3 && hasStrongComprehension) {
    return {
      primary: "comprehension",
      secondary: hasStrongPhonics ? "phonics" : null,
      isMixedTarget: false,
      recommendedMode: "comprehension_only",
    }
  }

  if (
    hasStrongPhonics &&
    hasStrongComprehension &&
    phonicsScore >= 2 &&
    comprehensionScore >= 2
  ) {
    return {
      primary: "phonics",
      secondary: "comprehension",
      isMixedTarget: true,
      recommendedMode: "full",
    }
  }

  if (phonicsScore > 0 && comprehensionScore === 0) {
    return {
      primary: "phonics",
      secondary: null,
      isMixedTarget: false,
      recommendedMode: "phonics_only",
    }
  }

  if (comprehensionScore > 0 && phonicsScore === 0) {
    return {
      primary: "comprehension",
      secondary: null,
      isMixedTarget: false,
      recommendedMode: "comprehension_only",
    }
  }

  return {
    primary: "general",
    secondary: null,
    isMixedTarget: false,
    recommendedMode: "single",
  }
}

export function resolveLessonMode(
  first?: LessonMode | { recommendedMode?: LessonMode } | null,
  second?: LessonMode | { recommendedMode?: LessonMode } | null
): LessonMode {
  const candidates = [first, second]

  for (const candidate of candidates) {
    if (
      candidate === "single" ||
      candidate === "full" ||
      candidate === "phonics_only" ||
      candidate === "comprehension_only"
    ) {
      return candidate
    }
  }

  for (const candidate of candidates) {
    if (
      candidate &&
      typeof candidate === "object" &&
      candidate.recommendedMode &&
      (candidate.recommendedMode === "single" ||
        candidate.recommendedMode === "full" ||
        candidate.recommendedMode === "phonics_only" ||
        candidate.recommendedMode === "comprehension_only")
    ) {
      return candidate.recommendedMode
    }
  }

  return "single"
}
