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

  const standards = resolveStandards(curriculumAnalyses, inputs)
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
  curriculumAnalyses: CurriculumAnalysis[],
  inputs: StandardResolutionInputs
): string[] {
  const explicitStandard = inputs.standard.trim()
  if (explicitStandard.length > 0) {
    return [explicitStandard]
  }

  const analyzedStandards = cleanUnique(
    curriculumAnalyses.flatMap((analysis) => {
      const coverage = getCoverage(analysis)
      return [...coverage.standards, ...analysis.standards]
    })
  ).filter((value) => !isWeakFallbackValue(value))

  if (analyzedStandards.length === 0) {
    return ["teacher-selected standard"]
  }

  const hintTerms = buildStandardHintTerms(inputs)
  if (hintTerms.length === 0) {
    return analyzedStandards.slice(0, 6)
  }

  const standardScores = new Map<string, number>()
  analyzedStandards.forEach((standard) => standardScores.set(standard, 0))

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

  return analyzedStandards
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
  const analyzedVocabulary = cleanUnique(
    curriculumAnalyses.flatMap((analysis) => {
      const coverage = getCoverage(analysis)
      return [...coverage.vocabulary, ...analysis.vocabulary]
    })
  ).filter((value) => !isWeakFallbackValue(value))

  if (analyzedVocabulary.length > 0) {
    return analyzedVocabulary.slice(0, 8)
  }

  const extractedVocabulary = uniqueLines(
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
  const analyzedWordLists = cleanUnique(
    curriculumAnalyses.flatMap((analysis) => {
      const coverage = getCoverage(analysis)
      return [...coverage.wordLists, ...analysis.wordLists, ...coverage.sightWords]
    })
  ).filter((value) => !isWeakFallbackValue(value))

  if (analyzedWordLists.length > 0) {
    return analyzedWordLists.slice(0, 8)
  }

  const extractedWordLists = uniqueLines(
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
  const analyzedTexts = cleanUnique(
    curriculumAnalyses.flatMap((analysis) => {
      const coverage = getCoverage(analysis)
      return [...coverage.texts, ...analysis.texts]
    })
  ).filter((value) => !isWeakFallbackValue(value))

  if (analyzedTexts.length > 0) {
    return analyzedTexts.slice(0, 6)
  }

  const extractedTexts = uniqueLines(
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
  const analyzedPracticeTasks = cleanUnique(
    curriculumAnalyses.flatMap((analysis) => {
      const coverage = getCoverage(analysis)
      return [...coverage.practiceTasks, ...analysis.practiceTasks, ...coverage.lessonSegments]
    })
  ).filter((value) => !isWeakFallbackValue(value))

  if (analyzedPracticeTasks.length > 0) {
    return analyzedPracticeTasks.slice(0, 8)
  }

  const extractedPracticeIdeas = uniqueLines(
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
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .filter((line) => line.length <= 160)
      .filter(predicate)
  )
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
    new Set(values.map((value) => value.trim()).filter((value) => value.length > 0))
  )
}

function containsAny(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase()
  return terms.some((term) => lower.includes(term))
}
