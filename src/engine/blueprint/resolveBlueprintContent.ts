import {
  BlueprintContentCoverage,
  CurriculumAnalysis,
  LessonBlueprint,
  MaterialFile,
} from "../types"

export function resolveBlueprintContent(args: {
  curriculumMaterials: MaterialFile[]
  curriculumAnalyses: CurriculumAnalysis[]
  inputs: {
    standard: string
    grade: string
    subject: string
    skill: string
    topic: string
  }
  target: LessonBlueprint["content"]["target"]
}): Omit<LessonBlueprint["content"], "target"> {
  const { curriculumMaterials, curriculumAnalyses, inputs, target } = args

  const standards = resolveStandards(curriculumMaterials, curriculumAnalyses, inputs)
  const vocabulary = resolveVocabulary(curriculumMaterials, curriculumAnalyses, target.primary)
  const wordLists = resolveWordLists(curriculumMaterials, curriculumAnalyses, target.primary)
  const texts = resolveTexts(curriculumMaterials, curriculumAnalyses, inputs.topic)
  const practiceIdeas = resolvePracticeIdeas(curriculumMaterials, curriculumAnalyses, target.primary)
  const coverage = resolveBlueprintContentCoverage(curriculumAnalyses)

  return {
    standards,
    vocabulary,
    wordLists,
    texts,
    practiceIdeas,
    coverage,
  }
}

function resolveBlueprintContentCoverage(
  curriculumAnalyses: CurriculumAnalysis[]
): BlueprintContentCoverage {
  return {
    standards: cleanUnique(
      curriculumAnalyses.flatMap((analysis) => {
        const coverage = getCoverage(analysis)
        return [...coverage.standards, ...analysis.standards]
      })
    ).filter((value) => !isWeakFallbackValue(value)),
    vocabulary: cleanUnique(
      curriculumAnalyses.flatMap((analysis) => {
        const coverage = getCoverage(analysis)
        return [...coverage.vocabulary, ...analysis.vocabulary]
      })
    ).filter((value) => !isWeakFallbackValue(value)),
    wordLists: cleanUnique(
      curriculumAnalyses.flatMap((analysis) => {
        const coverage = getCoverage(analysis)
        return [...coverage.wordLists, ...analysis.wordLists]
      })
    ).filter((value) => !isWeakFallbackValue(value)),
    texts: cleanUnique(
      curriculumAnalyses.flatMap((analysis) => {
        const coverage = getCoverage(analysis)
        return [...coverage.texts, ...analysis.texts]
      })
    ).filter((value) => !isWeakFallbackValue(value)),
    practiceIdeas: cleanUnique(
      curriculumAnalyses.flatMap((analysis) => {
        const coverage = getCoverage(analysis)
        return [...coverage.practiceTasks, ...analysis.practiceTasks]
      })
    ).filter((value) => !isWeakFallbackValue(value)),
    instructionalTargets: cleanUnique(
      curriculumAnalyses.flatMap((analysis) => {
        const coverage = getCoverage(analysis)
        return [...coverage.instructionalTargets, ...analysis.instructionalTargets]
      })
    ).filter((value) => !isWeakFallbackValue(value)),
    sightWords: cleanUnique(
      curriculumAnalyses.flatMap((analysis) => {
        const coverage = getCoverage(analysis)
        return coverage.sightWords
      })
    ).filter((value) => !isWeakFallbackValue(value)),
    foundationalSkills: cleanUnique(
      curriculumAnalyses.flatMap((analysis) => {
        const coverage = getCoverage(analysis)
        return coverage.foundationalSkills
      })
    ).filter((value) => !isWeakFallbackValue(value)),
    lessonSegments: cleanUnique(
      curriculumAnalyses.flatMap((analysis) => {
        const coverage = getCoverage(analysis)
        return coverage.lessonSegments
      })
    ).filter((value) => !isWeakFallbackValue(value)),
  }
}

type StandardResolutionInputs = {
  standard: string
  grade: string
  subject: string
  skill: string
  topic: string
}

function resolveStandards(
  curriculumMaterials: MaterialFile[],
  curriculumAnalyses: CurriculumAnalysis[],
  inputs: StandardResolutionInputs
): string[] {
  const explicitStandard = inputs.standard.trim()
  if (explicitStandard.length > 0) {
    return [explicitStandard]
  }

  const analyzedStandards = sanitizeTeacherFacingItems(
    cleanUnique(
      curriculumAnalyses.flatMap((analysis) => {
        const coverage = getCoverage(analysis)
        return [...coverage.standards, ...analysis.standards]
      })
    ).filter((value) => !isWeakFallbackValue(value)),
    "standard"
  )

  const extractedStandards = sanitizeTeacherFacingItems(
    uniqueLines(
      curriculumMaterials.flatMap((material) => material.analysis?.extractedText ?? []),
      (line) => looksLikeExtractedStandard(line, inputs)
    ),
    "standard"
  )

  const candidateStandards =
    analyzedStandards.length > 0 ? analyzedStandards : extractedStandards

  if (candidateStandards.length === 0) {
    return ["teacher-selected standard"]
  }

  const hintTerms = buildStandardHintTerms(inputs)
  if (hintTerms.length === 0) {
    return candidateStandards.slice(0, 6)
  }

  const standardScores = new Map<string, number>()
  candidateStandards.forEach((standard) => standardScores.set(standard, 0))

  curriculumAnalyses.forEach((analysis) => {
    const coverage = getCoverage(analysis)
    const analysisStandards = cleanUnique([...coverage.standards, ...analysis.standards]).filter(
      (value) => !isWeakFallbackValue(value)
    )

    if (analysisStandards.length === 0) {
      return
    }

    const evidence = cleanUnique([
      ...coverage.instructionalTargets,
      ...analysis.instructionalTargets,
      ...coverage.foundationalSkills,
      ...coverage.sightWords,
      ...coverage.vocabulary,
      ...analysis.vocabulary,
      ...coverage.wordLists,
      ...analysis.wordLists,
      ...coverage.texts,
      ...analysis.texts,
      ...coverage.practiceTasks,
      ...analysis.practiceTasks,
      ...coverage.lessonSegments,
    ])
      .join(" ")
      .toLowerCase()

    const score = scoreStandardHintAlignment(evidence, hintTerms)
    if (score <= 0) {
      return
    }

    analysisStandards.forEach((standard) => {
      standardScores.set(standard, (standardScores.get(standard) ?? 0) + score)
    })
  })

  return candidateStandards
    .slice()
    .sort((left, right) => (standardScores.get(right) ?? 0) - (standardScores.get(left) ?? 0))
    .slice(0, 6)
}

function buildStandardHintTerms(inputs: StandardResolutionInputs): string[] {
  const phrases = [
    inputs.grade,
    inputs.subject,
    inputs.skill,
    inputs.topic,
    ...buildHintWindows(inputs.skill),
    ...buildHintWindows(inputs.topic),
  ]

  return cleanUnique(
    phrases
      .map((value) => value.trim().toLowerCase())
      .map((value) => value.replace(/[^a-z0-9\s]/g, " "))
      .map((value) => value.replace(/\s+/g, " ").trim())
      .filter((value) => value.length >= 2)
      .filter((value) => !STANDARD_HINT_STOPWORDS.has(value))
  )
}

function buildHintWindows(value: string): string[] {
  const terms = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length >= 2)
    .filter((term) => !STANDARD_HINT_STOPWORDS.has(term))

  const windows: string[] = []
  for (let index = 0; index < terms.length; index += 1) {
    windows.push(terms[index])
    if (index < terms.length - 1) {
      windows.push(`${terms[index]} ${terms[index + 1]}`)
    }
  }

  return windows
}

function scoreStandardHintAlignment(evidence: string, hintTerms: string[]): number {
  return hintTerms.reduce((score, term) => {
    if (!evidence.includes(term)) {
      return score
    }

    return score + (term.includes(" ") ? 3 : 1)
  }, 0)
}

const STANDARD_HINT_STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "into",
  "your",
  "lesson",
  "lessons",
  "topic",
  "focus",
  "grade",
  "subject",
  "student",
  "students",
  "teacher",
  "ready",
  "materials",
  "material",
  "text",
  "texts",
  "words",
])

function resolveVocabulary(
  curriculumMaterials: MaterialFile[],
  curriculumAnalyses: CurriculumAnalysis[],
  primaryTarget: string
): string[] {
  const analyzedVocabulary = sanitizeTeacherFacingItems(
    cleanUnique(
      curriculumAnalyses.flatMap((analysis) => {
        const coverage = getCoverage(analysis)
        return [...coverage.vocabulary, ...analysis.vocabulary]
      })
    ).filter((value) => !isWeakFallbackValue(value)),
    "vocabulary"
  )

  if (analyzedVocabulary.length > 0) {
    return analyzedVocabulary.slice(0, 8)
  }

  const extractedVocabulary = sanitizeTeacherFacingItems(
    uniqueLines(
      curriculumMaterials.flatMap((material) => material.analysis?.extractedText ?? []),
      (line) =>
        primaryTarget === "phonics"
          ? containsAny(line, [
              "pattern",
              "sound",
              "vowel",
              "blend",
              "digraph",
              "syllable",
              "phoneme",
              "sight word",
              "heart word",
            ])
          : containsAny(line, [
              "vocabulary",
              "define",
              "meaning",
              "character",
              "theme",
              "detail",
              "question",
              "story",
            ])
    ),
    "vocabulary"
  )

  if (extractedVocabulary.length > 0) {
    return extractedVocabulary.slice(0, 8)
  }

  return primaryTarget === "phonics"
    ? ["phonics pattern", "target words"]
    : ["key vocabulary", "comprehension language"]
}

function resolveWordLists(
  curriculumMaterials: MaterialFile[],
  curriculumAnalyses: CurriculumAnalysis[],
  primaryTarget: string
): string[] {
  const analyzedWordLists = sanitizeTeacherFacingItems(
    cleanUnique(
      curriculumAnalyses.flatMap((analysis) => {
        const coverage = getCoverage(analysis)
        return [...coverage.wordLists, ...analysis.wordLists, ...coverage.sightWords]
      })
    ).filter((value) => !isWeakFallbackValue(value)),
    "wordList"
  )

  if (analyzedWordLists.length > 0) {
    return analyzedWordLists.slice(0, 8)
  }

  const extractedWordLists = sanitizeTeacherFacingItems(
    uniqueLines(
      curriculumMaterials.flatMap((material) => material.analysis?.extractedText ?? []),
      (line) =>
        primaryTarget === "phonics"
          ? containsAny(line, [
              "word list",
              "target words",
              "heart words",
              "heart word",
              "sight words",
              "sight word",
              "high frequency word",
              "high-frequency word",
              "decodable words",
              "sound",
              "pattern",
              "decode",
              "blend",
              "phonics",
              "cvce",
              "cvc",
              "digraph",
              "vowel team",
              "long a",
              "short a",
            ])
          : containsAny(line, [
              "question",
              "detail",
              "character",
              "event",
              "retell",
              "evidence",
            ])
    ),
    "wordList"
  )

  if (extractedWordLists.length > 0) {
    return extractedWordLists.slice(0, 8)
  }

  return ["Teacher-provided practice items"]
}

function resolveTexts(
  curriculumMaterials: MaterialFile[],
  curriculumAnalyses: CurriculumAnalysis[],
  topic: string
): string[] {
  const analyzedTexts = sanitizeTeacherFacingItems(
    cleanUnique(
      curriculumAnalyses.flatMap((analysis) => {
        const coverage = getCoverage(analysis)
        return [...coverage.texts, ...analysis.texts]
      })
    ).filter((value) => !isWeakFallbackValue(value)),
    "text"
  )

  if (analyzedTexts.length > 0) {
    return analyzedTexts.slice(0, 6)
  }

  const extractedTexts = sanitizeTeacherFacingItems(
    uniqueLines(
      curriculumMaterials.flatMap((material) => material.analysis?.extractedText ?? []),
      (line) =>
        containsAny(line, [
          "passage",
          "story",
          "text",
          "article",
          "selection",
          "read aloud",
          "decodable",
          "anchor text",
        ])
    ),
    "text"
  )

  if (extractedTexts.length > 0) {
    return extractedTexts.slice(0, 6)
  }

  const trimmedTopic = topic.trim()
  if (trimmedTopic.length > 0) {
    return [trimmedTopic]
  }

  return ["Teacher-provided lesson text"]
}

function resolvePracticeIdeas(
  curriculumMaterials: MaterialFile[],
  curriculumAnalyses: CurriculumAnalysis[],
  primaryTarget: string
): string[] {
  const analyzedPracticeTasks = sanitizeTeacherFacingItems(
    cleanUnique(
      curriculumAnalyses.flatMap((analysis) => {
        const coverage = getCoverage(analysis)
        return [...coverage.practiceTasks, ...analysis.practiceTasks]
      })
    ).filter((value) => !isWeakFallbackValue(value)),
    "practice"
  )

  if (analyzedPracticeTasks.length > 0) {
    return analyzedPracticeTasks.slice(0, 8)
  }

  const extractedPracticeIdeas = sanitizeTeacherFacingItems(
    uniqueLines(
      curriculumMaterials.flatMap((material) => material.analysis?.extractedText ?? []),
      (line) =>
        primaryTarget === "phonics"
          ? containsAny(line, [
              "practice",
              "read",
              "sort",
              "blend",
              "decode",
              "word list",
              "dictation",
              "map the sounds",
              "sight word",
              "heart word",
            ])
          : containsAny(line, [
              "practice",
              "discuss",
              "retell",
              "answer",
              "evidence",
              "partner",
              "respond",
              "question",
            ])
    ),
    "practice"
  )

  if (extractedPracticeIdeas.length > 0) {
    return extractedPracticeIdeas.slice(0, 8)
  }

  const analyzedTargets = cleanUnique(
    curriculumAnalyses.flatMap((analysis) => {
      const coverage = getCoverage(analysis)
      return [...coverage.instructionalTargets, ...analysis.instructionalTargets]
    })
  ).filter((value) => !isWeakFallbackValue(value))

  if (analyzedTargets.length > 0) {
    return analyzedTargets.slice(0, 6)
  }

  return primaryTarget === "phonics"
    ? ["Word reading", "Sound sort", "Partner decoding"]
    : ["Guided reading", "Partner discussion", "Question practice"]
}

function getCoverage(analysis: CurriculumAnalysis) {
  return (
    analysis.coverage ?? {
      standards: [],
      instructionalTargets: [],
      foundationalSkills: [],
      sightWords: [],
      vocabulary: [],
      wordLists: [],
      texts: [],
      practiceTasks: [],
      lessonSegments: [],
    }
  )
}

function uniqueLines(lines: string[], predicate: (line: string) => boolean): string[] {
  return cleanUnique(
    lines
      .map((line) => normalizeTeacherFacingValue(line))
      .filter((line) => line.length >= 3)
      .filter((line) => line.length <= 120)
      .filter((line) => !isObviouslyNoisyTeacherFacingItem(line))
      .filter(predicate)
  )
}

type TeacherFacingContentKind = "standard" | "vocabulary" | "wordList" | "text" | "practice"

function sanitizeTeacherFacingItems(
  values: string[],
  kind: TeacherFacingContentKind
): string[] {
  return cleanUnique(
    values
      .map((value) => normalizeTeacherFacingValue(value))
      .filter((value) => value.length > 0)
      .filter((value) => !isWeakFallbackValue(value))
      .filter((value) => kind === "wordList" || !isObviouslyNoisyTeacherFacingItem(value))
      .filter((value) => !isWeakTeacherFacingValueForKind(value, kind))
  )
}

function normalizeTeacherFacingValue(value: string): string {
  return value
    .replace(/^[\s*â€¢\-â€“â€”]+/, "")
    .replace(/^\[/, "")
    .replace(/^[a-z]\s+(?=[A-Z]{2,}(?:\.[A-Za-z0-9]+){2,}\s*:)/, "")
    .replace(/^[A-Z]{2,}(?:\.[A-Za-z0-9]+){2,}\s*:\s*/, "")
    .replace(/^part\s+[a-z0-9]+\s*:\s*/i, "")
    .replace(/^next\s*:\s*/i, "")
    .replace(/\s+/g, " ")
    .replace(/[;:]+$/g, "")
    .trim()
}

function isObviouslyNoisyTeacherFacingItem(value: string): boolean {
  const lower = value.toLowerCase()
  const wordCount = value.split(/\s+/).length
  const commaCount = (value.match(/,/g) || []).length

  if (/\.(pdf|pptx|docx|html|htm|png|jpg|jpeg|webp)\b/i.test(lower)) {
    return true
  }

  if (lower.includes("|")) {
    return true
  }

  if (lower.includes("http://") || lower.includes("https://") || lower.includes("www.")) {
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

  if (/\(=|\(x/i.test(value)) {
    return true
  }

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
    lower.includes("students have been taught") ||
    lower.includes("today's instruction is focused") ||
    lower.includes("students respond") ||
    lower.includes("teacher says") ||
    lower.includes("teacher prompts") ||
    lower.includes("story/skill") ||
    lower.includes("phonological awareness")
  ) {
    return true
  }

  if (commaCount >= 3) {
    return true
  }

  if (wordCount > 12) {
    return true
  }

  return false
}

function isWeakTeacherFacingValueForKind(
  value: string,
  kind: TeacherFacingContentKind
): boolean {
  const lower = value.toLowerCase()

  if (kind === "standard") {
    return (
      lower === "standard" ||
      lower === "standards" ||
      (/\bstandards?\b/.test(lower) && !/\d/.test(lower))
    )
  }

  if (kind === "vocabulary") {
    return (
      lower === "identify and use new vocabulary" ||
      lower.startsWith("i can ") ||
      lower.startsWith("read ") ||
      lower.includes("main topic") ||
      lower.includes("key details") ||
      lower.includes("author's purpose") ||
      lower.includes("students have been taught") ||
      lower.includes("students respond") ||
      lower.includes("blending and reading")
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
      lower.includes("students have been taught") ||
      lower.includes("story/skill") ||
      lower.includes("phonological awareness") ||
      lower.includes("sight words")
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
      lower.includes("lesson flow")
    )
  }

  if (kind === "practice") {
    return (
      lower.includes("students have been taught") ||
      lower.includes("today's instruction is focused") ||
      lower.includes("students are not") ||
      lower.includes("students see the letter") ||
      lower.includes("students respond") ||
      lower.includes("routine:") ||
      lower.includes("lesson flow")
    )
  }

  return false
}

function isWeakFallbackValue(value: string): boolean {
  const lower = value.trim().toLowerCase()

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

function cleanUnique(values: string[]): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter((value) => value.length > 0)
        .filter((value, index, items) => items.findIndex((other) => other.toLowerCase() == value.toLowerCase()) === index)
    )
  )
}

function looksLikeExtractedStandard(
  line: string,
  inputs: StandardResolutionInputs
): boolean {
  const lower = line.toLowerCase()
  const hasCodeLikeShape = /[a-z]\.[a-z0-9]+\.[a-z0-9]+/i.test(line)
  const hintTerms = [...buildHintWindows(inputs.skill), ...buildHintWindows(inputs.topic)]
  const hasHintTerm = hintTerms.some((term) => term.length >= 3 && lower.includes(term))

  const hasStandardLikeLanguage =
    lower.includes("standard") ||
    lower.includes("identify") ||
    lower.includes("determine") ||
    lower.includes("decode") ||
    lower.includes("author") ||
    lower.includes("main topic") ||
    lower.includes("key details") ||
    lower.includes("long a") ||
    lower.includes("cvce")

  return hasStandardLikeLanguage && (hasHintTerm || hasCodeLikeShape)
}

function containsAny(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase()
  return terms.some((term) => lower.includes(term))
}



