import {
  BlueprintContentCoverage,
  BlueprintContentReviewStatus,
  CurriculumAnalysis,
  LessonBlueprint,
  MaterialFile,
} from "../types"
import { filterStandardsForPrimaryTarget, normalizeTeacherFacingValues } from "../shared/teacherFacingContent"
import { extractStandardCode, isKnownStandardDescription, normalizeAndDedupeStandards } from "../shared/standards"

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

  const standards = resolveStandards(curriculumMaterials, curriculumAnalyses, inputs, target.primary)
  const reviewedVocabulary = normalizeResolvedLane(
    resolveReviewedLane(curriculumMaterials, "vocabulary", "vocabulary"),
    "vocabulary",
    target.primary
  )
  const reviewedWordLists = normalizeResolvedLane(
    resolveReviewedLane(curriculumMaterials, "wordLists", "wordList"),
    "wordList",
    target.primary
  )
  const reviewedTexts = normalizeResolvedLane(
    resolveReviewedLane(curriculumMaterials, "texts", "text"),
    "text",
    target.primary
  )
  const reviewedPracticeIdeas = normalizeResolvedLane(
    resolveReviewedLane(curriculumMaterials, "practiceIdeas", "practice"),
    "practice",
    target.primary
  )
  const extractedVocabulary = normalizeResolvedLane(
    resolveVocabulary(curriculumMaterials, curriculumAnalyses, target.primary, inputs),
    "vocabulary",
    target.primary
  )
  const extractedWordLists = normalizeResolvedLane(
    resolveWordLists(curriculumMaterials, curriculumAnalyses, target.primary, inputs),
    "wordList",
    target.primary
  )
  const extractedTexts = normalizeResolvedLane(
    resolveTexts(curriculumMaterials, curriculumAnalyses, inputs.topic, target.primary, inputs),
    "text",
    target.primary
  )
  const extractedPracticeIdeas = normalizeResolvedLane(
    resolvePracticeIdeas(curriculumMaterials, curriculumAnalyses, target.primary, inputs),
    "practice",
    target.primary
  )
  const fallbackVocabulary = extractedVocabulary.length > 0
    ? []
    : normalizeResolvedLane(inferFallbackVocabulary(inputs, target.primary), "vocabulary", target.primary)
  const fallbackWordLists = extractedWordLists.length > 0
    ? []
    : normalizeResolvedLane(inferFallbackWordLists(inputs, target.primary), "wordList", target.primary)
  const fallbackTexts = extractedTexts.length > 0
    ? []
    : normalizeResolvedLane(inferFallbackTexts(inputs, target.primary), "text", target.primary)
  const fallbackPracticeIdeas = extractedPracticeIdeas.length > 0
    ? []
    : normalizeResolvedLane(inferFallbackPracticeIdeas(inputs, target.primary), "practice", target.primary)
  const vocabulary = reviewedVocabulary.length > 0
    ? reviewedVocabulary
    : extractedVocabulary.length > 0
      ? extractedVocabulary
      : fallbackVocabulary
  const wordLists = reviewedWordLists.length > 0
    ? reviewedWordLists
    : extractedWordLists.length > 0
      ? extractedWordLists
      : fallbackWordLists
  const texts = reviewedTexts.length > 0
    ? reviewedTexts
    : extractedTexts.length > 0
      ? extractedTexts
      : fallbackTexts
  const practiceIdeas = reviewedPracticeIdeas.length > 0
    ? reviewedPracticeIdeas
    : extractedPracticeIdeas.length > 0
      ? extractedPracticeIdeas
      : fallbackPracticeIdeas
  const coverage = resolveBlueprintContentCoverage(curriculumAnalyses)
  const hasContentUsableCurriculum = curriculumMaterials.some((material) => isContentUsableCurriculumMaterial(material))
  const reviewStatus: BlueprintContentReviewStatus = {
    vocabulary: resolveLaneStatus(reviewedVocabulary, extractedVocabulary, hasContentUsableCurriculum),
    wordLists: resolveLaneStatus(reviewedWordLists, extractedWordLists, hasContentUsableCurriculum),
    texts: resolveLaneStatus(reviewedTexts, extractedTexts, hasContentUsableCurriculum),
    practiceIdeas: resolveLaneStatus(reviewedPracticeIdeas, extractedPracticeIdeas, hasContentUsableCurriculum),
  }

  return {
    standards,
    vocabulary,
    wordLists,
    texts,
    practiceIdeas,
    coverage,
    reviewStatus,
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
  inputs: StandardResolutionInputs,
  primaryTarget: string
): string[] {
  const explicitStandards = normalizeAndDedupeStandards([inputs.standard])
  if (explicitStandards.length > 0) {
    return filterStandardsForPrimaryTarget(explicitStandards, primaryTarget)
  }

  const analyzedStandards = normalizeAndDedupeStandards(
    sanitizeTeacherFacingItems(
      cleanUnique(
        curriculumAnalyses.flatMap((analysis) => {
          const coverage = getCoverage(analysis)
          return [...coverage.standards, ...analysis.standards]
        })
      ).filter((value) => !isWeakFallbackValue(value)),
      "standard"
    ),
    { requireCode: true }
  )

  const extractedStandards = normalizeAndDedupeStandards(
    sanitizeTeacherFacingItems(
      uniqueLines(
        curriculumMaterials.flatMap((material) => material.analysis?.extractedText ?? []),
        (line) => looksLikeExtractedStandard(line, inputs)
      ),
      "standard"
    ),
    { requireCode: true }
  )

  const candidateStandards =
    analyzedStandards.length > 0 ? analyzedStandards : extractedStandards

  if (candidateStandards.length === 0) {
    return inferTeacherFacingStandards(inputs, primaryTarget)
  }

  const hintTerms = buildStandardHintTerms(inputs)
  if (hintTerms.length === 0) {
    return candidateStandards.slice(0, 6)
  }

  const standardScores = new Map<string, number>()
  candidateStandards.forEach((standard) => standardScores.set(standard, 0))

  curriculumAnalyses.forEach((analysis) => {
    const coverage = getCoverage(analysis)
    const analysisStandards = normalizeAndDedupeStandards(
      cleanUnique([...coverage.standards, ...analysis.standards]).filter(
        (value) => !isWeakFallbackValue(value)
      ),
      { requireCode: true }
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

  const rankedStandards = candidateStandards
    .slice()
    .sort((left, right) => (standardScores.get(right) ?? 0) - (standardScores.get(left) ?? 0))
    .slice(0, 6)

  return rankedStandards
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

type TeacherFallbackInputs = Pick<StandardResolutionInputs, "grade" | "subject" | "skill" | "topic">

const PHONICS_PATTERN_TERMS = [
  "long a",
  "short a",
  "long e",
  "short e",
  "long i",
  "short i",
  "long o",
  "short o",
  "long u",
  "short u",
  "silent e",
  "vowel team",
  "digraph",
  "blend",
  "segment",
  "decode",
  "encoding",
  "cvc",
  "cvce",
] as const

function isElaSubject(subject: string): boolean {
  return /\b(ela|reading|language arts|literacy)\b/i.test(subject)
}

function buildTeacherFocusLabel(inputs: TeacherFallbackInputs): string {
  const skill = inputs.skill.trim()
  if (skill.length > 0) {
    return skill
  }

  const topic = inputs.topic.trim()
  if (topic.length > 0) {
    return topic
  }

  const subject = inputs.subject.trim() || "lesson"
  return `${subject} focus`
}

function buildTeacherFocusSeed(inputs: TeacherFallbackInputs): string {
  return buildTeacherFocusLabel(inputs)
    .replace(/\b(phonics|skill|focus|lesson|unit)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function getNamedPhonicsPatterns(inputs: TeacherFallbackInputs): string[] {
  const combined = `${inputs.skill} ${inputs.topic}`.toLowerCase()
  return cleanUnique(
    PHONICS_PATTERN_TERMS.filter((term) => combined.includes(term))
  ).slice(0, 3)
}

function inferTeacherFacingStandards(
  inputs: StandardResolutionInputs,
  primaryTarget: string
): string[] {
  const focus = buildTeacherFocusLabel(inputs)
  const subject = inputs.subject.trim() || "lesson"
  const grade = inputs.grade.trim() ? `Grade ${inputs.grade.trim()} ` : ""

  if (primaryTarget === "phonics" && isElaSubject(subject)) {
    return [`${grade}ELA inferred foundational reading / phonics focus: ${focus}`]
  }

  if (primaryTarget === "comprehension" && isElaSubject(subject)) {
    return [`${grade}ELA inferred reading comprehension focus: ${focus}`]
  }

  return [`${grade}${subject} inferred standard focus: ${focus}`]
}

function inferTeacherFacingVocabulary(
  inputs: TeacherFallbackInputs,
  primaryTarget: string
): string[] {
  const patterns = getNamedPhonicsPatterns(inputs)
  const combined = `${inputs.skill} ${inputs.topic}`.toLowerCase()
  const vocabulary: string[] = []

  vocabulary.push(...patterns)

  if (combined.includes("vowel")) vocabulary.push("vowel pattern")
  if (combined.includes("syllable")) vocabulary.push("syllable")
  if (combined.includes("blend")) vocabulary.push("blend")
  if (combined.includes("segment")) vocabulary.push("segment")
  if (combined.includes("decode")) vocabulary.push("decode")
  if (combined.includes("comprehension")) vocabulary.push("comprehension")
  if (combined.includes("main idea")) vocabulary.push("main idea")
  if (combined.includes("key detail")) vocabulary.push("key details")

  const focusSeed = buildTeacherFocusSeed(inputs)
  if (vocabulary.length === 0 && focusSeed.length > 0) {
    vocabulary.push(focusSeed)
  }

  if (vocabulary.length === 0) {
    vocabulary.push(primaryTarget === "phonics" ? "target phonics language" : "target lesson vocabulary")
  }

  return cleanUnique(vocabulary).slice(0, 4)
}

function inferTeacherFacingWordLists(
  inputs: TeacherFallbackInputs,
  primaryTarget: string
): string[] {
  const patterns = getNamedPhonicsPatterns(inputs)
  const focusSeed = buildTeacherFocusSeed(inputs) || buildTeacherFocusLabel(inputs)

  if (primaryTarget === "phonics") {
    if (patterns.length > 0) {
      return cleanUnique([
        `${patterns[0]} words`,
        `${patterns[0]} examples`,
      ])
    }

    return cleanUnique([
      `${focusSeed} words`,
      `${focusSeed} examples`,
    ])
  }

  const topic = inputs.topic.trim()
  if (topic.length > 0) {
    return [`examples connected to ${topic}`]
  }

  return [`examples connected to ${focusSeed}`]
}

function inferTeacherFacingTexts(
  inputs: TeacherFallbackInputs,
  primaryTarget: string
): string[] {
  const topic = inputs.topic.trim()
  if (topic.length > 0) {
    return [topic]
  }

  const focus = buildTeacherFocusSeed(inputs) || buildTeacherFocusLabel(inputs)
  if (primaryTarget === "phonics") {
    return [`short decodable text using ${focus}`]
  }

  return [`teacher-created text for ${focus}`]
}

function inferTeacherFacingPracticeIdeas(
  inputs: TeacherFallbackInputs,
  primaryTarget: string
): string[] {
  const patterns = getNamedPhonicsPatterns(inputs)
  const focus = patterns[0] ?? buildTeacherFocusSeed(inputs) ?? buildTeacherFocusLabel(inputs)

  if (primaryTarget === "phonics") {
    return cleanUnique([
      `Read and decode ${focus} words`,
      `Sort and discuss ${focus} examples`,
      `Partner practice with ${focus} words`,
    ])
  }

  if (primaryTarget === "comprehension") {
    return cleanUnique([
      `Discuss and respond to ${focus}`,
      `Practice evidence-based thinking with ${focus}`,
      `Partner talk using ${focus}`,
    ])
  }

  return cleanUnique([
    `Guided practice with ${focus}`,
    `Partner practice using ${focus}`,
    `Independent application of ${focus}`,
  ])
}

function inferFallbackVocabulary(
  inputs: StandardResolutionInputs,
  primaryTarget: string
): string[] {
  const teacherInputVocabulary = inferTeacherInputVocabulary(primaryTarget, inputs)
  if (teacherInputVocabulary.length > 0) {
    return teacherInputVocabulary
  }

  return inferTeacherFacingVocabulary(inputs, primaryTarget)
}

function inferFallbackWordLists(
  inputs: StandardResolutionInputs,
  primaryTarget: string
): string[] {
  const teacherInputWordLists = inferTeacherInputWordLists(primaryTarget, inputs)
  if (teacherInputWordLists.length > 0) {
    return teacherInputWordLists
  }

  return inferTeacherFacingWordLists(inputs, primaryTarget)
}

function inferFallbackTexts(
  inputs: StandardResolutionInputs,
  primaryTarget: string
): string[] {
  const teacherInputTexts = inferTeacherInputTexts(primaryTarget, inputs)
  if (teacherInputTexts.length > 0 && inputs.topic.trim().length === 0) {
    return teacherInputTexts
  }

  return inferTeacherFacingTexts(inputs, primaryTarget)
}

function inferFallbackPracticeIdeas(
  inputs: StandardResolutionInputs,
  primaryTarget: string
): string[] {
  const teacherInputPracticeIdeas = inferTeacherInputPracticeIdeas(primaryTarget, inputs)
  if (teacherInputPracticeIdeas.length > 0) {
    return teacherInputPracticeIdeas
  }

  return inferTeacherFacingPracticeIdeas(inputs, primaryTarget)
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
  primaryTarget: string,
  inputs: StandardResolutionInputs
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

  return []
}

function resolveWordLists(
  curriculumMaterials: MaterialFile[],
  curriculumAnalyses: CurriculumAnalysis[],
  primaryTarget: string,
  inputs: StandardResolutionInputs
): string[] {
  const analyzedWordLists = sanitizeTeacherFacingItems(
    cleanUnique(
      curriculumAnalyses.flatMap((analysis) => {
        const coverage = getCoverage(analysis)
        return [...coverage.wordLists, ...analysis.wordLists, ...(analysis.examples ?? []), ...coverage.sightWords]
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

  return []
}

function resolveTexts(
  curriculumMaterials: MaterialFile[],
  curriculumAnalyses: CurriculumAnalysis[],
  topic: string,
  primaryTarget: string,
  inputs: StandardResolutionInputs
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

  return []
}

function resolvePracticeIdeas(
  curriculumMaterials: MaterialFile[],
  curriculumAnalyses: CurriculumAnalysis[],
  primaryTarget: string,
  inputs: StandardResolutionInputs
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

  return []
}

function resolveReviewedLane(
  curriculumMaterials: MaterialFile[],
  key: "vocabulary" | "wordLists" | "texts" | "practiceIdeas",
  kind: TeacherFacingContentKind
): string[] {
  return sanitizeTeacherFacingItems(
    cleanUnique(
      curriculumMaterials.flatMap((material) => {
        if (!material.analysisReview) {
          return []
        }

        const values = material.analysisReview[key]
        return Array.isArray(values) ? values : []
      })
    ),
    kind
  )
}

function resolveLaneStatus(
  reviewedValues: string[],
  resolvedValues: string[],
  hasContentUsableCurriculum: boolean
): "reviewed" | "extracted" | "review-needed" | "blocked" {
  if (reviewedValues.length > 0) {
    return "reviewed"
  }

  if (resolvedValues.length > 0) {
    return "extracted"
  }

  return hasContentUsableCurriculum ? "review-needed" : "blocked"
}

function isContentUsableCurriculumMaterial(material: MaterialFile): boolean {
  if (material.role !== "curriculum" || material.status !== "ready" || !material.analysis?.curriculum) {
    return false
  }

  const reliability = material.analysis.reliability
  if (!reliability) {
    return true
  }

  return reliability.usableForContent
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

function normalizeResolvedLane(
  values: string[],
  kind: TeacherFacingContentKind,
  primaryTarget: string
): string[] {
  return normalizeTeacherFacingValues(values, {
    kind,
    primaryTarget,
  })
}

function sanitizeTeacherFacingItems(
  values: string[],
  kind: TeacherFacingContentKind
): string[] {
  return cleanUnique(
    values
      .map((value) => normalizeTeacherFacingValue(value))
      .filter((value) => value.length > 0)
      .filter((value) => !isWeakFallbackValue(value))
      .filter((value) => !isObviouslyNoisyTeacherFacingItem(value))
      .filter((value) => !isWeakTeacherFacingValueForKind(value, kind))
  )
}

function hasSpecificStandardCode(value: string): boolean {
  return (
    /\b(?:[A-Za-z]{2,4}\.)?[A-Za-z0-9]+\.[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)+\b/.test(value) ||
    /\b(RF|RL|RI|W|L|SL)\.\d+(?:\.\d+)*\b/i.test(value)
  )
}

function looksLikeSimpleWordListCandidate(value: string): boolean {
  const parts = value
    .split(/[,:;]/)
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length < 3) {
    return false
  }

  return parts.every((part) => {
    const wordCount = part.split(/\s+/).filter(Boolean).length
    return wordCount <= 4 && /[a-z]/i.test(part)
  })
}

function normalizeTeacherFacingValue(value: string): string {
  return value
    .replace(/^[\s*•\-–—¥¢®©@]+/, "")
    .replace(/^[^A-Za-z0-9(]+(?=[A-Za-z0-9(])/, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/^\[/, "")
    .replace(/^[a-z]\s+(?=(read|write|sort|identify|use|blend|segment)\b)/i, "")
    .replace(/^[a-z]\s+(?=[A-Z]{2,}(?:\.[A-Za-z0-9]+){2,}\s*:)/, "")
    .replace(/^part\s+[a-z0-9]+\s*:\s*/i, "")
    .replace(/^next\s*:\s*/i, "")
    .replace(/\s+/g, " ")
    .replace(/[;:]+$/g, "")
    .trim()
}

function isObviouslyNoisyTeacherFacingItem(value: string): boolean {
  const lower = value.toLowerCase()
  const normalized = lower.replace(/^[^a-z0-9]+/, "")
  const wordCount = value.split(/\s+/).filter(Boolean).length
  const commaCount = (value.match(/,/g) || []).length
  const simpleWordList = looksLikeSimpleWordListCandidate(value)

  if (/\.(pdf|pptx|docx|html|htm|png|jpg|jpeg|webp)\b/i.test(lower)) {
    return true
  }

  if (lower.includes("|")) {
    return true
  }

  if (lower.includes("http://") || lower.includes("https://") || lower.includes("www.")) {
    return true
  }

  if (normalized === "standards" || normalized === "hb florida b.e.s.t. standards") {
    return true
  }

  if (/^unit:\s*unit\b/i.test(value)) {
    return true
  }

  if (/\bprograms?\s*:/i.test(value)) {
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
    lower.includes("materials, educational technology, and sources") ||
    lower.includes("educational technology") ||
    lower.includes("digital blending board") ||
    lower.includes("heidisongs") ||
    lower.includes("savvas story slides") ||
    lower.includes("ed tech") ||
    lower.includes("smartboard") ||
    lower.includes("projector") ||
    lower.includes("desks") ||
    lower.includes("carpet") ||
    lower.includes("lesson flow overview") ||
    lower.includes("block 1") ||
    lower.includes("block 2") ||
    lower.includes("slideslink") ||
    lower.includes("whiteboards") ||
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

  if (!simpleWordList && commaCount >= 3) {
    return true
  }

  if (!simpleWordList && wordCount > 12) {
    return true
  }

  if (/[@¥¢®]/.test(value) && wordCount > 5 && !hasSpecificStandardCode(value)) {
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
      lower === "hb florida b.e.s.t. standards" ||
      (/\bstandards?\b/.test(lower) && !hasSpecificStandardCode(value))
    )
  }

  if (hasSpecificStandardCode(value) || isKnownStandardDescription(value)) {
    return true
  }

  if (
    lower.startsWith("review needed on materials:") ||
    lower.startsWith("blocked until materials has usable curriculum support")
  ) {
    return true
  }

  if (kind === "vocabulary") {
    return (
      lower === "identify and use new vocabulary" ||
      lower === "read high-frequency words" ||
      lower === "demonstrate phonological awareness" ||
      lower.startsWith("i can ") ||
      lower.startsWith("read ") ||
      lower.includes("main topic") ||
      lower.includes("key details") ||
      lower.includes("author's purpose") ||
      lower.includes("students have been taught") ||
      lower.includes("students respond") ||
      lower.includes("blending and reading") ||
      lower.includes("materials, educational technology, and sources")
    )
  }

  if (kind === "wordList") {
    return (
      lower === "teacher-provided text" ||
      lower === "read high-frequency words" ||
      lower === "demonstrate phonological awareness" ||
      lower === "identify and use new vocabulary" ||
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
      lower.includes("sight words") ||
      lower.includes("educational technology") ||
      lower.includes("programs:") ||
      lower.includes("unit:") ||
      lower.includes("heidisongs") ||
      lower.includes("savvas")
    )
  }

  if (kind === "text") {
    return (
      lower === "teacher-provided text" ||
      lower === "read high-frequency words" ||
      lower === "identify and use new vocabulary" ||
      lower.startsWith("i can ") ||
      lower.startsWith("read ") ||
      lower.includes("main topic") ||
      lower.includes("key details") ||
      lower.includes("author's purpose") ||
      lower.includes("phonological awareness") ||
      lower.includes("story/skill") ||
      lower.includes("lesson flow") ||
      lower.includes("educational technology") ||
      lower.includes("savvas story slides")
    )
  }

  if (kind === "practice") {
    return (
      lower === "guided practice" ||
      lower === "curriculum-aligned guided practice" ||
      lower === "guided foundational-skill practice" ||
      lower === "guided response work" ||
      lower === "independent application" ||
      lower.includes("students have been taught") ||
      lower.includes("today's instruction is focused") ||
      lower.includes("students are not") ||
      lower.includes("students see the letter") ||
      lower.includes("students respond") ||
      lower.includes("routine:") ||
      lower.includes("lesson flow") ||
      lower.includes("materials, educational technology, and sources")
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
    "teacher-provided text",
    "curriculum-aligned practice task",
    "curriculum-aligned guided practice",
    "curriculum-aligned foundational-skill practice",
    "guided practice",
    "guided foundational-skill practice",
    "guided response work",
    "independent application",
    "lesson target",
    "modeled example",
    "teacher-provided practice items",
    "teacher-selected examples",
    "teacher-selected word examples",
    "teacher-selected example words",
    "teacher-confirmed vocabulary",
    "teacher-confirmed word examples",
    "teacher-confirmed examples",
    "teacher-confirmed text or topic",
    "teacher-confirmed practice",
    "teacher-confirmed lesson task",
    "teacher-confirmed foundational-skill practice",
    "target word examples",
    "target words for student transfer",
    "strong word examples",
    "key skill vocabulary",
    "tbd",
    "none",
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
  const hasCodeLikeShape = hasSpecificStandardCode(line)
  const hintTerms = [...buildHintWindows(inputs.skill), ...buildHintWindows(inputs.topic)]
  const hasHintTerm = hintTerms.some((term) => term.length >= 3 && lower.includes(term))

  if (/^(standards?|hb florida b\.e\.s\.t\. standards)$/i.test(line.trim())) {
    return false
  }

  const hasStandardLikeLanguage =
    lower.includes("standard") ||
    lower.includes("standards") ||
    lower.includes("b.e.s.t.") ||
    lower.includes("benchmark") ||
    lower.includes("identify") ||
    lower.includes("determine") ||
    lower.includes("decode") ||
    lower.includes("author") ||
    lower.includes("main topic") ||
    lower.includes("key details") ||
    lower.includes("long a") ||
    lower.includes("cvce")

  if (hasCodeLikeShape) {
    return true
  }

  return hasStandardLikeLanguage && hasHintTerm && /\d/.test(line)
}

function containsAny(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase()
  return terms.some((term) => lower.includes(term))
}

function inferTeacherInputVocabulary(
  primaryTarget: string,
  inputs: StandardResolutionInputs
): string[] {
  if (primaryTarget !== "phonics") {
    return []
  }

  const cues = detectTeacherPhonicsCues(inputs)
  const vocabulary = cleanUnique([
    ...cues.vocabulary,
    inputs.skill.trim(),
  ]).filter((value) => !isWeakFallbackValue(value))

  return vocabulary.slice(0, 8)
}

function inferTeacherInputWordLists(
  primaryTarget: string,
  inputs: StandardResolutionInputs
): string[] {
  if (primaryTarget !== "phonics") {
    return []
  }

  return detectTeacherPhonicsCues(inputs).examples.slice(0, 8)
}

function inferTeacherInputTexts(
  primaryTarget: string,
  inputs: StandardResolutionInputs
): string[] {
  if (primaryTarget !== "phonics") {
    return []
  }

  const cues = detectTeacherPhonicsCues(inputs)
  if (cues.focusLabel.length === 0) {
    return []
  }

  return [`Short decodable lines featuring ${cues.focusLabel}`]
}

function inferTeacherInputPracticeIdeas(
  primaryTarget: string,
  inputs: StandardResolutionInputs
): string[] {
  if (primaryTarget !== "phonics") {
    return []
  }

  const cues = detectTeacherPhonicsCues(inputs)
  if (cues.practiceIdeas.length > 0) {
    return cues.practiceIdeas.slice(0, 8)
  }

  return []
}

type TeacherPhonicsCueSet = {
  focusLabel: string
  vocabulary: string[]
  examples: string[]
  practiceIdeas: string[]
}

function detectTeacherPhonicsCues(inputs: StandardResolutionInputs): TeacherPhonicsCueSet {
  const source = `${inputs.skill} ${inputs.topic}`.toLowerCase()

  const definitions: Array<{
    terms: string[]
    result: TeacherPhonicsCueSet
  }> = [
    {
      terms: ["long a", "silent e", "magic e", "cvce"],
      result: {
        focusLabel: "long a CVCe words",
        vocabulary: ["long a", "silent e", "vowel-consonant-e"],
        examples: ["cake", "game", "lake", "name", "same", "gate"],
        practiceIdeas: [
          "Read and sort long a CVCe words",
          "Build and write long a words",
          "Partner read a short long a decodable",
        ],
      },
    },
    {
      terms: ["short a"],
      result: {
        focusLabel: "short a CVC words",
        vocabulary: ["short a", "middle vowel", "CVC words"],
        examples: ["cat", "map", "cap", "jam", "man", "sat"],
        practiceIdeas: [
          "Blend and read short a CVC words",
          "Sort short a words by onset and rime",
          "Write short a words with sound boxes",
        ],
      },
    },
    {
      terms: ["long i"],
      result: {
        focusLabel: "long i words",
        vocabulary: ["long i", "silent e", "vowel-consonant-e"],
        examples: ["bike", "time", "kite", "line", "five", "slide"],
        practiceIdeas: [
          "Read and sort long i words",
          "Build long i words with letter tiles",
          "Partner read a short long i decodable",
        ],
      },
    },
    {
      terms: ["long o"],
      result: {
        focusLabel: "long o words",
        vocabulary: ["long o", "silent e", "vowel-consonant-e"],
        examples: ["home", "rope", "bone", "nose", "stone", "joke"],
        practiceIdeas: [
          "Read and sort long o words",
          "Build long o words with letter tiles",
          "Partner read a short long o decodable",
        ],
      },
    },
    {
      terms: ["long e"],
      result: {
        focusLabel: "long e words",
        vocabulary: ["long e", "vowel team", "ee/ea patterns"],
        examples: ["seed", "team", "bead", "keep", "read", "clean"],
        practiceIdeas: [
          "Read and sort long e words",
          "Highlight ee and ea spellings",
          "Partner read a short long e decodable",
        ],
      },
    },
    {
      terms: ["digraph", "sh", "ch", "th", "wh"],
      result: {
        focusLabel: "consonant digraph words",
        vocabulary: ["digraph", "two letters one sound", "decode"],
        examples: ["ship", "chin", "thin", "whip", "shop", "chat"],
        practiceIdeas: [
          "Read and sort digraph words",
          "Highlight the digraph in each word",
          "Build digraph words with picture supports",
        ],
      },
    },
    {
      terms: ["blend", "blends"],
      result: {
        focusLabel: "consonant blend words",
        vocabulary: ["blend", "beginning blend", "final blend"],
        examples: ["stop", "flag", "trip", "mask", "frog", "plan"],
        practiceIdeas: [
          "Read and sort blend words",
          "Tap and blend each sound in blend words",
          "Write blend words with sound boxes",
        ],
      },
    },
  ]

  for (const definition of definitions) {
    if (definition.terms.some((term) => source.includes(term))) {
      return definition.result
    }
  }

  return {
    focusLabel: "",
    vocabulary: [],
    examples: [],
    practiceIdeas: [],
  }
}






