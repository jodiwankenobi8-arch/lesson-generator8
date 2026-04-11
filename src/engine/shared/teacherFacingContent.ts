import type { LessonBlueprint } from "../types"

export type TeacherFacingValueKind =
  | "standard"
  | "vocabulary"
  | "wordList"
  | "text"
  | "practice"
  | "segment"

export function normalizeTeacherFacingValues(
  values: string[],
  options: {
    kind: TeacherFacingValueKind
    primaryTarget?: string | null
  }
): string[] {
  const { kind, primaryTarget } = options
  const seen = new Set<string>()
  const results: string[] = []

  for (const rawValue of values ?? []) {
    for (const candidate of splitTeacherFacingCandidates(rawValue, kind)) {
      const value = normalizeTeacherFacingValue(candidate)
      if (!value) continue

      const lower = value.toLowerCase()
      if (seen.has(lower)) continue
      if (isWeakFallbackValue(lower)) continue
      if (isClearlyNoisyValue(value, lower, kind)) continue
      if (isWeakTeacherFacingValue(value, lower, kind, primaryTarget ?? undefined)) continue

      seen.add(lower)
      results.push(value)
    }
  }

  return kind === "standard"
    ? filterStandardsForPrimaryTarget(results, primaryTarget)
    : results
}

export function getNormalizedBlueprintValues(
  blueprint: LessonBlueprint,
  kind: TeacherFacingValueKind
): string[] {
  const coverage = blueprint.content.coverage
  const primaryTarget = blueprint.content.target.primary

  if (kind === "standard") {
    return normalizeTeacherFacingValues(
      [...(coverage?.standards ?? []), ...blueprint.content.standards],
      { kind, primaryTarget }
    )
  }

  if (kind === "vocabulary") {
    return normalizeTeacherFacingValues(
      [...(coverage?.vocabulary ?? []), ...blueprint.content.vocabulary],
      { kind, primaryTarget }
    )
  }

  if (kind === "wordList") {
    return normalizeTeacherFacingValues(
      [
        ...(coverage?.wordLists ?? []),
        ...(coverage?.sightWords ?? []),
        ...blueprint.content.wordLists,
      ],
      { kind, primaryTarget }
    )
  }

  if (kind === "text") {
    return normalizeTeacherFacingValues(
      [...(coverage?.texts ?? []), ...blueprint.content.texts],
      { kind, primaryTarget }
    )
  }

  if (kind === "practice") {
    return normalizeTeacherFacingValues(
      [...(coverage?.practiceIdeas ?? []), ...blueprint.content.practiceIdeas],
      { kind, primaryTarget }
    )
  }

  return normalizeTeacherFacingValues(
    [...(coverage?.lessonSegments ?? []), ...blueprint.structure.lessonSegments],
    { kind, primaryTarget }
  )
}

export function filterStandardsForPrimaryTarget(
  standards: string[],
  primaryTarget?: string | null
): string[] {
  const normalizedTarget = normalizeTeacherFacingTarget(primaryTarget)
  if (!normalizedTarget || standards.length <= 1) {
    return standards
  }

  const filtered = standards.filter((standard) =>
    isRelevantStandardForTarget(standard, normalizedTarget)
  )

  return filtered.length > 0 ? filtered : standards
}

export function getBlueprintContentGroundingItems(
  blueprint: LessonBlueprint
): string[] {
  const primaryTarget = blueprint.content.target.primary
  const coverage = blueprint.content.coverage

  return uniqueCaseInsensitive([
    ...normalizeTeacherFacingValues(coverage?.instructionalTargets ?? [], {
      kind: "practice",
      primaryTarget,
    }).slice(0, 2),
    ...getNormalizedBlueprintValues(blueprint, "standard").slice(0, 2),
    ...getNormalizedBlueprintValues(blueprint, "vocabulary").slice(0, 3),
    ...getNormalizedBlueprintValues(blueprint, "wordList").slice(0, 3),
    ...getNormalizedBlueprintValues(blueprint, "text").slice(0, 2),
    ...getNormalizedBlueprintValues(blueprint, "practice").slice(0, 3),
  ])
}

function splitTeacherFacingCandidates(
  value: string,
  kind: TeacherFacingValueKind
): string[] {
  const source = String(value ?? "").trim()
  if (!source) return []

  if (kind !== "standard") {
    return [source]
  }

  return source
    .split(/[;\n|]+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function normalizeTeacherFacingValue(value: string): string {
  return value
    .replace(/^[\s*•\-–—]+/, "")
    .replace(/^\[/, "")
    .replace(/^[a-z]\s+(?=[A-Z]{2,}(?:\.[A-Za-z0-9]+){2,}\s*:)/, "")
    .replace(/^part\s+[a-z0-9]+\s*:\s*/i, "")
    .replace(/^next\s*:\s*/i, "")
    .replace(/^word list\s*:\s*/i, "Word List: ")
    .replace(/^vocabulary\s*:\s*/i, "")
    .replace(/^texts?\s*:\s*/i, "")
    .replace(/^practice ideas?\s*:\s*/i, "")
    .replace(/^["“”']+|["“”']+$/g, "")
    .replace(/\s+/g, " ")
    .replace(/[;:]+$/g, "")
    .trim()
}

function isWeakFallbackValue(lower: string): boolean {
  return [
    "teacher-selected standard",
    "key vocabulary",
    "teacher-selected word list",
    "teacher-provided lesson text",
    "curriculum-aligned practice task",
    "lesson target",
    "modeled example",
    "teacher-provided practice items",
  ].includes(lower)
}

function isClearlyNoisyValue(
  value: string,
  lower: string,
  kind: TeacherFacingValueKind
): boolean {
  const wordCount = value.split(/\s+/).length
  const commaCount = (value.match(/,/g) || []).length

  if (/\.(pdf|pptx|docx|html|htm|png|jpg|jpeg|webp)\b/i.test(lower)) return true
  if (lower.includes("|")) return true
  if (lower.includes("http://") || lower.includes("https://") || lower.includes("www.")) return true
  if (/students?\s*:\s*\d+/i.test(value)) return true
  if (/time\s*[:=]/i.test(lower)) return true
  if (/\b\d+\s*(min|mins|minutes)\b/i.test(lower)) return true

  if (
    lower.includes("smartboard") ||
    lower.includes("projector") ||
    lower.includes("desks") ||
    lower.includes("carpet") ||
    lower.includes("lesson flow overview") ||
    lower.includes("block 1") ||
    lower.includes("block 2") ||
    lower.includes("slideslink") ||
    lower.includes("whiteboards") ||
    lower.includes("ed tech") ||
    lower.includes("resource") ||
    lower.includes("learning targets") ||
    lower.includes("ses tpe") ||
    lower.includes("edition)") ||
    lower.includes("letter-sound motions") ||
    lower.includes("up/down") ||
    lower.includes("savvas story slides") ||
    lower.includes("materials, educational technology, and sources") ||
    lower.includes("educational technology, and sources") ||
    lower.includes("digital blending board") ||
    lower.includes("unit: unit") ||
    lower.includes("programs:") ||
    lower.includes("ufli + savvas") ||
    (lower.includes("week ") && lower.includes("day ")) ||
    /,\s*and\.?$/i.test(value)
  ) {
    return true
  }

  if (commaCount >= 4) return true
  if (kind !== "standard" && wordCount > 18) return true

  return false
}

function isWeakTeacherFacingValue(
  value: string,
  lower: string,
  kind: TeacherFacingValueKind,
  primaryTarget?: string
): boolean {
  const wordCount = value.split(/\s+/).length

  if (
    lower.includes("without sounding them out") ||
    lower.includes("read sight words fast") ||
    lower.includes("sight words fast")
  ) {
    return true
  }

  if (kind === "standard") {
    return (
      lower === "standard" ||
      lower === "standards" ||
      lower === "hb florida b.e.s.t. standards" ||
      (/\bstandards?\b/.test(lower) && !/[A-Z]{2,}(?:\.[A-Za-z0-9]+){2,}/.test(value))
    )
  }

  if (kind === "vocabulary") {
    return (
      lower.startsWith("i can ") ||
      lower.startsWith("read ") ||
      lower.includes("main topic") ||
      lower.includes("key details") ||
      lower.includes("author's purpose") ||
      lower.includes("students have been taught") ||
      lower.includes("students respond") ||
      lower.includes("blending and reading") ||
      lower.includes("review letter names") ||
      lower.includes("review short a sound") ||
      lower.includes("introduce long a sound") ||
      lower.includes("letter names and letter sounds") ||
      lower.includes("prior knowledge") ||
      lower.includes("focus on long") ||
      lower.includes("focus on short") ||
      wordCount > 10
    )
  }

  if (kind === "wordList") {
    return (
      lower.startsWith("i can ") ||
      lower.startsWith("read ") ||
      lower.startsWith("identify ") ||
      lower.startsWith("students ") ||
      lower.startsWith("teacher ") ||
      lower.includes("guided practice") ||
      lower.includes("pacing") ||
      lower.includes("modeling") ||
      lower.includes("story/skill") ||
      lower.includes("phonological awareness") ||
      lower.includes("prior knowledge") ||
      lower.includes("letter names") ||
      lower.includes("letter sounds") ||
      lower.includes("vowel sounds") ||
      lower.includes("review short a sound") ||
      lower.includes("introduce long a sound") ||
      lower.includes("alphabet song") ||
      lower.includes("short a song") ||
      lower.includes("long a song") ||
      lower.includes("focus on long") ||
      lower.includes("focus on short") ||
      wordCount > 6
    )
  }

  if (kind === "text") {
    return (
      lower.startsWith("i can ") ||
      lower.startsWith("read ") ||
      lower.includes("main topic") ||
      lower.includes("key details") ||
      lower.includes("author's purpose") ||
      lower.includes("phonological awareness") ||
      lower.includes("story/skill") ||
      lower.includes("lesson flow") ||
      lower.includes("prior knowledge")
    )
  }

  if (kind === "practice") {
    if (
      lower.startsWith("i can ") ||
      lower.startsWith("students ") ||
      lower.startsWith("teacher ") ||
      lower.includes("students have been taught") ||
      lower.includes("today's instruction is focused") ||
      lower.includes("students are not") ||
      lower.includes("students see the letter") ||
      lower.includes("students respond") ||
      lower.includes("teacher says") ||
      lower.includes("teacher prompts") ||
      lower.includes("routine:") ||
      lower.includes("lesson flow") ||
      lower.includes("pacing, modeling") ||
      lower.includes("guided practice, and")
    ) {
      return true
    }

    if (primaryTarget === "phonics" && lower.includes("sight word")) {
      return true
    }

    return wordCount > 14
  }

  return ![
    "opening",
    "launch",
    "teach",
    "model",
    "guided practice",
    "guided",
    "independent practice",
    "independent",
    "centers",
    "center",
    "closure",
    "close",
  ].includes(lower)
}

function normalizeTeacherFacingTarget(primaryTarget?: string | null): string | null {
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

  return null
}

function isRelevantStandardForTarget(value: string, normalizedTarget: string): boolean {
  const lower = value.toLowerCase()

  if (normalizedTarget === "foundational") {
    return (
      /(?:^|\.)f(?:\.|$)/i.test(value) ||
      /\bRF\./i.test(value) ||
      containsAnyTerm(lower, [
        "phonological awareness",
        "phonemic awareness",
        "phonics",
        "foundational",
        "word-analysis",
        "word analysis",
        "high-frequency words",
        "high frequency words",
        "decoding",
        "encode",
        "encoding",
        "letter-sound",
        "segment",
        "blend",
        "cvce",
        "cvc",
        "sight word",
        "print concepts",
      ])
    )
  }

  if (normalizedTarget === "comprehension") {
    return (
      /(?:^|\.)r(?:\.|$)/i.test(value) ||
      /\bR[IL]?\./i.test(value) ||
      containsAnyTerm(lower, [
        "main topic",
        "key details",
        "author's purpose",
        "author purpose",
        "theme",
        "character",
        "retell",
        "comprehension",
        "text evidence",
      ])
    )
  }

  if (normalizedTarget === "vocabulary") {
    return (
      /(?:^|\.)v(?:\.|$)/i.test(value) ||
      /\b(?:L|SL)\./i.test(value) ||
      containsAnyTerm(lower, [
        "vocabulary",
        "oral language",
        "speaking",
        "listening",
        "academic language",
      ])
    )
  }

  if (normalizedTarget === "fluency") {
    return containsAnyTerm(lower, ["fluency", "rate", "accuracy", "expression"])
  }

  if (normalizedTarget === "writing") {
    return /(?:^|\.)w(?:\.|$)/i.test(value) || containsAnyTerm(lower, ["write", "writing", "sentence", "compose"])
  }

  if (normalizedTarget === "grammar") {
    return /(?:^|\.)l(?:\.|$)/i.test(value) || containsAnyTerm(lower, ["grammar", "conventions", "language"])
  }

  return true
}

function containsAnyTerm(value: string, terms: string[]): boolean {
  return terms.some((term) => value.includes(term))
}

function uniqueCaseInsensitive(values: string[]): string[] {
  const seen = new Set<string>()
  const results: string[] = []

  for (const value of values) {
    const trimmed = value.trim()
    if (!trimmed) continue

    const lower = trimmed.toLowerCase()
    if (seen.has(lower)) continue

    seen.add(lower)
    results.push(trimmed)
  }

  return results
}
