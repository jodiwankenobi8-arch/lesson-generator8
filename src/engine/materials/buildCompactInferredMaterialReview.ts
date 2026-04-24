import {
  normalizeTeacherFacingValues,
  type TeacherFacingValueKind,
} from "../shared/teacherFacingContent"
import type {
  CurriculumAnalysis,
  ExemplarAnalysis,
  LessonInputs,
  MaterialAnalysisReview,
  MaterialFile,
} from "../types"

type CompactFocus =
  | "foundational"
  | "comprehension"
  | "vocabulary"
  | "fluency"
  | "writing"
  | "grammar"
  | null

const EMPTY_INPUTS: LessonInputs = {
  grade: "",
  subject: "",
  standard: "",
  skill: "",
  topic: "",
  duration: "",
  notes: "",
}

export function buildCompactInferredMaterialReview(
  material: MaterialFile,
  inputs: LessonInputs = EMPTY_INPUTS
): MaterialAnalysisReview | null {
  if (!material.analysis) {
    return null
  }

  const focus = detectCompactFocus(inputs)
  const primaryTarget = focus ?? undefined

  if (material.role === "curriculum") {
    return buildCompactCurriculumReview(material.analysis.curriculum, inputs, primaryTarget)
  }

  return buildCompactExemplarReview(material.analysis.exemplar)
}

function buildCompactCurriculumReview(
  curriculum: CurriculumAnalysis | undefined,
  inputs: LessonInputs,
  primaryTarget?: CompactFocus extends null ? never : string
): MaterialAnalysisReview {
  if (!curriculum) {
    return emptyReview()
  }

  const focus = detectCompactFocus(inputs)
  const standards = normalizeTeacherFacingValues(curriculum.standards ?? [], {
    kind: "standard",
    primaryTarget,
  }).slice(0, 4)

  const instructionalTargets = compactTargets(curriculum.instructionalTargets ?? [], focus).slice(0, 2)
  const vocabulary = compactVocabulary(curriculum.vocabulary ?? [], focus, primaryTarget).slice(0, 4)
  const wordLists = compactWordExamples(
    [...(curriculum.wordLists ?? []), ...(curriculum.examples ?? [])],
    focus,
    primaryTarget
  ).slice(0, 6)
  const texts = compactTextAnchors(curriculum.texts ?? [], focus, inputs, primaryTarget).slice(0, 2)
  const practiceIdeas = compactPracticeIdeas(curriculum.practiceTasks ?? [], focus, primaryTarget).slice(0, 4)

  const hasContentAnchor = vocabulary.length > 0 || wordLists.length > 0 || texts.length > 0
  if (!hasContentAnchor) {
    const fallback = inferContentAnchorFromInputs(inputs, focus)
    return {
      standards,
      vocabulary: fallback.vocabulary,
      wordLists: fallback.wordLists,
      instructionalTargets,
      texts: fallback.texts,
      practiceIdeas: practiceIdeas.length > 0 ? practiceIdeas : fallback.practiceIdeas,
      exemplarStructure: [],
      teacherSummary: "",
    }
  }

  return {
    standards,
    vocabulary,
    wordLists,
    instructionalTargets,
    texts,
    practiceIdeas,
    exemplarStructure: [],
    teacherSummary: "",
  }
}

function buildCompactExemplarReview(
  exemplar: ExemplarAnalysis | undefined
): MaterialAnalysisReview {
  if (!exemplar) {
    return emptyReview()
  }

  return {
    ...emptyReview(),
    exemplarStructure: compactExemplarStructure(exemplar).slice(0, 6),
  }
}

function emptyReview(): MaterialAnalysisReview {
  return {
    standards: [],
    vocabulary: [],
    wordLists: [],
    instructionalTargets: [],
    texts: [],
    practiceIdeas: [],
    exemplarStructure: [],
    teacherSummary: "",
  }
}

function detectCompactFocus(inputs: LessonInputs): CompactFocus {
  const combined = `${inputs.subject} ${inputs.skill} ${inputs.topic} ${inputs.notes ?? ""}`.toLowerCase()

  if (containsAny(combined, [
    "phonics",
    "decode",
    "decodable",
    "silent e",
    "magic e",
    "cvc",
    "cvce",
    "long a",
    "short a",
    "vowel pattern",
    "vowel team",
    "phoneme",
    "phonemic",
    "phonological",
    "word building",
    "sight word",
    "high-frequency",
    "high frequency",
    "spelling",
    "encoding",
    "blend",
    "segment",
    "digraph",
  ])) {
    return "foundational"
  }

  if (containsAny(combined, [
    "main idea",
    "key details",
    "retell",
    "character",
    "setting",
    "author's purpose",
    "authors purpose",
    "theme",
    "plot",
    "inference",
    "comprehension",
    "story",
  ])) {
    return "comprehension"
  }

  if (containsAny(combined, ["vocabulary", "oral language", "speaking", "listening"])) {
    return "vocabulary"
  }

  if (containsAny(combined, ["fluency", "rate", "accuracy", "expression"])) {
    return "fluency"
  }

  if (containsAny(combined, ["sentence", "write", "writing", "dictation", "compose"])) {
    return "writing"
  }

  if (containsAny(combined, ["grammar", "conventions", "parts of speech", "punctuation"])) {
    return "grammar"
  }

  return null
}

function compactTargets(values: string[], focus: CompactFocus): string[] {
  return uniqueCaseInsensitive(
    values
      .map((value) => cleanCandidate(value, "practice"))
      .map((value) => value.replace(/^(objective|learning target)\s*:\s*/i, ""))
      .map((value) => value.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .filter((value) => !isMetadataNoise(value.toLowerCase()))
      .filter((value) => !isClearlyIrrelevantForFocus(value.toLowerCase(), focus, "practice"))
  )
}

function compactVocabulary(
  values: string[],
  focus: CompactFocus,
  primaryTarget?: string
): string[] {
  const normalized = normalizeTeacherFacingValues(values, {
    kind: "vocabulary",
    primaryTarget,
  })

  return uniqueCaseInsensitive(
    normalized
      .flatMap((value) => splitCompactVocabulary(value))
      .map((value) => cleanCandidate(value, "vocabulary"))
      .filter(Boolean)
      .filter((value) => !isMetadataNoise(value.toLowerCase()))
      .filter((value) => !isClearlyIrrelevantForFocus(value.toLowerCase(), focus, "vocabulary"))
      .filter((value) => value.split(/\s+/).length <= 4)
  )
}

function compactWordExamples(
  values: string[],
  focus: CompactFocus,
  primaryTarget?: string
): string[] {
  const normalized = normalizeTeacherFacingValues(values, {
    kind: "wordList",
    primaryTarget,
  })

  return uniqueCaseInsensitive(
    normalized
      .flatMap((value) => splitWordExamples(value))
      .map((value) => cleanCandidate(value, "wordList"))
      .filter(Boolean)
      .filter((value) => !isMetadataNoise(value.toLowerCase()))
      .filter((value) => !isClearlyIrrelevantForFocus(value.toLowerCase(), focus, "wordList"))
      .filter((value) => /^[a-z][a-z' -]*$/i.test(value))
      .filter((value) => value.split(/\s+/).length <= 3)
  )
}

function compactTextAnchors(
  values: string[],
  focus: CompactFocus,
  inputs: LessonInputs,
  primaryTarget?: string
): string[] {
  const normalized = normalizeTeacherFacingValues(values, {
    kind: "text",
    primaryTarget,
  })

  return uniqueCaseInsensitive(
    normalized
      .map((value) => normalizeTextAnchor(value, focus, inputs))
      .filter(Boolean)
  )
}

function compactPracticeIdeas(
  values: string[],
  focus: CompactFocus,
  primaryTarget?: string
): string[] {
  const normalized = normalizeTeacherFacingValues(values, {
    kind: "practice",
    primaryTarget,
  })

  return uniqueCaseInsensitive(
    normalized
      .map((value) => cleanPracticeIdea(value))
      .filter(Boolean)
      .filter((value) => !isMetadataNoise(value.toLowerCase()))
      .filter((value) => !isClearlyIrrelevantForFocus(value.toLowerCase(), focus, "practice"))
      .filter((value) => value.split(/\s+/).length <= 12)
  )
}

function compactExemplarStructure(exemplar: ExemplarAnalysis): string[] {
  const lowerValues = [
    ...(exemplar.reusableStructure ?? []),
    ...(exemplar.slideFlow ?? []),
    ...(exemplar.pacing ?? []),
    ...(exemplar.teacherMoves ?? []),
    ...(exemplar.promptStyle ?? []),
  ]
    .map((value) => cleanCandidate(value, "segment"))
    .filter(Boolean)
    .map((value) => value.toLowerCase())

  const structure: string[] = []
  const add = (value: string, when: boolean) => {
    if (!when) return
    if (!structure.some((item) => item.toLowerCase() === value.toLowerCase())) {
      structure.push(value)
    }
  }

  add("Opening", containsAnyValue(lowerValues, ["opening", "launch", "warm-up", "warm up", "hook"]))
  add(
    "Model",
    containsAnyValue(lowerValues, [
      "model",
      "teach",
      "i do",
      "mini lesson",
      "teacher modeling",
      "think aloud",
    ])
  )
  add(
    "Guided practice",
    containsAnyValue(lowerValues, ["guided practice", "we do", "guided", "guided work"])
  )
  add(
    "Independent practice",
    containsAnyValue(lowerValues, [
      "independent practice",
      "you do",
      "independent",
      "work time",
      "apply independently",
    ])
  )
  add("Closure", containsAnyValue(lowerValues, ["closure", "close", "debrief", "exit ticket", "wrap-up", "wrap up"]))
  add(
    "Turn and talk prompts",
    containsAnyValue(lowerValues, ["turn and talk", "partner talk", "question stem", "prompt", "discussion prompt"])
  )
  add(
    "Short timed sections",
    lowerValues.some((value) => /\b\d+\s*(min|mins|minutes)\b/.test(value))
  )

  if (structure.length > 0) {
    return structure
  }

  return uniqueCaseInsensitive(
    (exemplar.reusableStructure ?? [])
      .map((value) => cleanCandidate(value, "segment"))
      .filter(Boolean)
      .filter((value) => value.split(/\s+/).length <= 5)
      .filter((value) => !isMetadataNoise(value.toLowerCase()))
      .map(sentenceCase)
  )
}

function splitCompactVocabulary(value: string): string[] {
  const cleaned = value
    .replace(/^vocabulary\s*:\s*/i, "")
    .replace(/^word list\s*:\s*/i, "")
    .trim()

  if (/\s+-\s+/.test(cleaned)) {
    return [cleaned.split(/\s+-\s+/)[0].trim()]
  }

  if (cleaned.includes(",")) {
    return cleaned.split(",").map((item) => item.trim())
  }

  return [cleaned]
}

function splitWordExamples(value: string): string[] {
  const cleaned = value
    .replace(/^word list\s*:\s*/i, "")
    .replace(/^examples?\s*:\s*/i, "")
    .trim()

  return cleaned
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeTextAnchor(
  value: string,
  focus: CompactFocus,
  inputs: LessonInputs
): string {
  const cleaned = cleanCandidate(value, "text")
  if (!cleaned) {
    return ""
  }

  const lower = cleaned.toLowerCase()
  if (isMetadataNoise(lower)) {
    return ""
  }

  if (isClearlyIrrelevantForFocus(lower, focus, "text")) {
    return ""
  }

  if (focus === "foundational") {
    if (containsAny(lower, ["decodable", "passage", "connected text"])) {
      const anchor = inputs.skill.trim() || inputs.topic.trim()
      return anchor ? `Decodable passage for ${anchor}` : "Decodable passage"
    }

    if (containsAny(lower, ["story", "author's purpose", "main idea", "key details", "retell"])) {
      return ""
    }
  }

  if (cleaned.split(/\s+/).length > 8) {
    return ""
  }

  return sentenceCase(cleaned)
}

function cleanPracticeIdea(value: string): string {
  return sentenceCase(
    cleanCandidate(value, "practice")
      .replace(/^(guided|independent) practice\s*:\s*/i, "")
      .replace(/^practice\s*:\s*/i, "")
      .replace(/^activity\s*:\s*/i, "")
      .replace(/[.]+$/g, "")
      .trim()
  )
}

function cleanCandidate(value: string, kind: TeacherFacingValueKind): string {
  let cleaned = String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()

  cleaned = cleaned
    .replace(/^(notes?|teacher notes?)\s*:\s*/i, "")
    .replace(/^slide\s*\d+(?:\s*\/\s*\d+)?\s*:\s*/i, "")
    .replace(/^page\s*\d+(?:\s*of\s*\d+)?\s*:?\s*/i, "")
    .replace(/^part\s*[a-z0-9]+\s*:\s*/i, "")
    .replace(/^texts?\s*:\s*/i, kind === "text" ? "" : cleaned)
    .replace(/^read aloud\s*:\s*/i, "")
    .replace(/^passage\s*:\s*/i, "")
    .replace(/^word list\s*:\s*/i, kind === "wordList" ? "" : "Word List: ")
    .replace(/^vocabulary\s*:\s*/i, kind === "vocabulary" ? "" : cleaned)
    .replace(/\bpage\s+\d+\s+of\s+\d+\b/gi, "")
    .replace(/^[*•\-–—\s]+/, "")
    .replace(/\s+/g, " ")
    .trim()

  return cleaned
}

function isMetadataNoise(lower: string): boolean {
  return (
    !lower ||
    lower.includes("http://") ||
    lower.includes("https://") ||
    lower.includes("www.") ||
    /\.(pdf|pptx|docx|png|jpg|jpeg|webp|html|htm)\b/i.test(lower) ||
    lower.includes("password-protected") ||
    lower.includes("unsupported embedded text encoding") ||
    lower.includes("pdf extraction produced no readable text") ||
    lower.includes("docx extraction produced no readable text") ||
    lower.includes("pptx extraction produced no readable text") ||
    lower.includes("image-based") ||
    lower.includes("materials, educational technology, and sources") ||
    lower.includes("educational technology") ||
    lower.includes("resource") ||
    lower.includes("slideslink") ||
    lower.includes("ufli + savvas") ||
    lower.includes("programs:") ||
    lower.includes("unit: unit") ||
    lower.includes("edition)") ||
    lower.includes("ses tpe") ||
    lower.includes("lesson flow overview") ||
    lower.includes("block 1") ||
    lower.includes("block 2") ||
    /\bweek\s+\d+\b/.test(lower) ||
    /\bday\s+\d+\b/.test(lower)
  )
}

function isClearlyIrrelevantForFocus(
  lower: string,
  focus: CompactFocus,
  kind: Exclude<TeacherFacingValueKind, "standard" | "segment">
): boolean {
  if (focus !== "foundational") {
    return false
  }

  const comprehensionTerms = [
    "author's purpose",
    "authors purpose",
    "main idea",
    "key details",
    "character",
    "setting",
    "retell",
    "story events",
    "plot",
    "theme",
    "comprehension",
  ]
  const foundationalTerms = [
    "phonics",
    "decodable",
    "decode",
    "blend",
    "segment",
    "vowel",
    "silent e",
    "magic e",
    "cvc",
    "cvce",
    "phoneme",
    "phonological",
    "phonemic",
    "word",
    "sound",
    "spelling",
  ]

  if (containsAny(lower, comprehensionTerms) && !containsAny(lower, foundationalTerms)) {
    return true
  }

  if (kind === "text" && lower.includes("story") && !containsAny(lower, ["decodable", "phonics", "word", "sound"])) {
    return true
  }

  return false
}

function containsAny(source: string, terms: string[]): boolean {
  return terms.some((term) => source.includes(term))
}

function containsAnyValue(values: string[], terms: string[]): boolean {
  return values.some((value) => containsAny(value, terms))
}

function uniqueCaseInsensitive(values: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const value of values) {
    const normalized = value.trim()
    if (!normalized) continue

    const key = normalized.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(normalized)
  }

  return result
}

function sentenceCase(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ""
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}

const PHONICS_LONG_WORDS: Record<string, string[]> = {
  a: ["cake", "game", "lake", "name", "tape"],
  e: ["feet", "keep", "read", "seat", "tree"],
  i: ["bike", "fine", "pine", "ride", "time"],
  o: ["bone", "code", "home", "note", "rope"],
  u: ["cube", "cute", "mule", "tune", "use"],
}

const PHONICS_SHORT_WORDS: Record<string, string[]> = {
  a: ["cat", "hat", "map", "ran", "sat"],
  e: ["bed", "leg", "met", "pet", "red"],
  i: ["big", "dig", "hit", "lip", "pin"],
  o: ["box", "dog", "hot", "log", "pop"],
  u: ["bug", "cup", "fun", "mud", "run"],
}

type InputFallback = {
  vocabulary: string[]
  wordLists: string[]
  texts: string[]
  practiceIdeas: string[]
}

function inferContentAnchorFromInputs(
  inputs: LessonInputs,
  focus: CompactFocus
): InputFallback {
  const combined = `${inputs.skill} ${inputs.topic}`.toLowerCase()

  if (focus === "foundational") {
    const vowelMatch = combined.match(/\b(long|short)\s+([aeiou])\b/)
    if (vowelMatch) {
      const kind = vowelMatch[1] as "long" | "short"
      const vowel = vowelMatch[2]
      const hasSilentE = /\bsilent[\s-]?e\b|cvce\b/.test(combined)

      const vocab = [`${kind} ${vowel}`]
      if (kind === "long" && hasSilentE) vocab.push("silent e")
      if (/\bvowel[\s-]?pattern\b/.test(combined)) vocab.push("vowel pattern")
      if (/\bvowel[\s-]?team\b/.test(combined)) vocab.push("vowel team")

      const wordTable = kind === "long" ? PHONICS_LONG_WORDS : PHONICS_SHORT_WORDS
      const wordList = wordTable[vowel] ?? []
      const practiceIdeas = [`Blend and read ${kind} ${vowel} words`, `Sort ${kind} ${vowel} words`]
      const texts = [`Decodable text with ${kind} ${vowel} words`]

      return { vocabulary: vocab.slice(0, 4), wordLists: wordList.slice(0, 5), texts, practiceIdeas }
    }

    if (/\bsight[\s-]?word|high[\s-]?frequen/.test(combined)) {
      return {
        vocabulary: ["sight words", "high-frequency words"],
        wordLists: [],
        texts: [],
        practiceIdeas: ["Read and practice high-frequency words"],
      }
    }

    const texts = inputs.topic?.trim() ? [inputs.topic.trim()] : []
    return { vocabulary: [], wordLists: [], texts, practiceIdeas: [] }
  }

  if (focus === "comprehension") {
    const vocab: string[] = []
    if (/\bmain[\s-]?idea\b/.test(combined)) vocab.push("main idea", "key details")
    if (/\bcharacter\b/.test(combined)) vocab.push("character")
    if (/\bsetting\b/.test(combined)) vocab.push("setting")
    if (/\bretell\b/.test(combined)) vocab.push("retell")
    if (/\bauthor'?s?\s+purpose\b/.test(combined)) vocab.push("author's purpose")
    if (/\binfer/.test(combined)) vocab.push("inference")

    const texts = inputs.topic?.trim() ? [inputs.topic.trim()] : []
    return { vocabulary: vocab.slice(0, 4), wordLists: [], texts, practiceIdeas: [] }
  }

  const texts = inputs.topic?.trim() ? [inputs.topic.trim()] : []
  return { vocabulary: [], wordLists: [], texts, practiceIdeas: [] }
}