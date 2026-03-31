import {
  CurriculumAnalysis,
  ElaAreaKey,
  LessonInputs,
  LessonMode,
  ResolvedElaArea,
  ResolvedLessonProfile,
} from "../types"

type DetectedTarget = "phonics" | "comprehension" | "mixed" | "general"

type ResolveLessonProfileArgs = {
  inputs: LessonInputs
  selectedMode?: LessonMode
  curriculumAnalyses?: CurriculumAnalysis[]
}

type AreaSignalConfig = {
  strong: string[]
  support: string[]
}

export interface DetectedLessonTargets {
  primary: DetectedTarget
  secondary: Exclude<DetectedTarget, "mixed" | "general"> | null
  isMixedTarget: boolean
  recommendedMode: LessonMode
}

const FOUNDATIONAL_AREAS = new Set<ElaAreaKey>([
  "letter_identification",
  "phonological_awareness",
  "phonemic_awareness",
  "phonics",
  "high_frequency_words",
  "word_building",
  "handwriting_fine_motor",
  "decodable_reading",
  "spelling_encoding",
])

const COMPREHENSION_AREAS = new Set<ElaAreaKey>([
  "reading_response",
  "comprehension",
  "fluency",
  "vocabulary_oral_language",
])

const COMPOSITION_AREAS = new Set<ElaAreaKey>([
  "writing_sentence_work",
  "grammar_language_conventions",
  "speaking_listening",
])

const AREA_SIGNAL_LIBRARY: Record<ElaAreaKey, AreaSignalConfig> = {
  letter_identification: {
    strong: ["letter identification", "identify letters", "name letters", "alphabet review"],
    support: ["letter names", "uppercase", "lowercase", "alphabet song"],
  },
  phonological_awareness: {
    strong: ["phonological awareness", "rhyme", "syllable awareness", "alliteration"],
    support: ["syllable", "rhyme", "oral language game"],
  },
  phonemic_awareness: {
    strong: ["phonemic awareness", "phoneme", "segment sounds", "blend sounds"],
    support: ["segment", "blend", "sound boxes", "isolate sounds"],
  },
  phonics: {
    strong: ["phonics", "cvce", "cvc", "digraph", "long a", "short a", "word work"],
    support: ["vowel pattern", "decode", "encoding", "sound spelling", "blend"],
  },
  high_frequency_words: {
    strong: ["high frequency words", "high-frequency words", "sight words", "heart words"],
    support: ["sight word", "automatic word reading", "read words fast"],
  },
  word_building: {
    strong: ["word building", "build words", "make words", "manipulate letters"],
    support: ["letter tiles", "magnetic letters", "word sort"],
  },
  vocabulary_oral_language: {
    strong: ["vocabulary", "oral language", "academic language", "story vocabulary"],
    support: ["discuss words", "use new vocabulary", "sentence stems"],
  },
  handwriting_fine_motor: {
    strong: ["handwriting", "fine motor", "letter formation", "pencil grip"],
    support: ["trace letters", "write letters", "formation practice"],
  },
  decodable_reading: {
    strong: ["decodable", "decodable reading", "read decodable text", "decodable passage"],
    support: ["read connected text", "decode words in text"],
  },
  fluency: {
    strong: ["fluency", "read smoothly", "oral reading fluency", "repeated reading"],
    support: ["phrasing", "accuracy", "rate", "expression"],
  },
  reading_response: {
    strong: ["reading response", "response to reading", "respond to text", "constructed response"],
    support: ["answer in writing", "text-based response", "response sheet"],
  },
  comprehension: {
    strong: ["comprehension", "main idea", "theme", "retell", "author's purpose", "key details"],
    support: ["story", "article", "text evidence", "character"],
  },
  writing_sentence_work: {
    strong: ["writing", "sentence writing", "write a sentence", "shared writing", "dictated sentence"],
    support: ["sentence", "write about", "compose", "respond in writing"],
  },
  spelling_encoding: {
    strong: ["spelling", "encoding", "dictation", "spell words", "spelling pattern"],
    support: ["encode", "word dictation", "spelling sort"],
  },
  grammar_language_conventions: {
    strong: ["grammar", "language conventions", "capitalization", "punctuation"],
    support: ["complete sentence", "edit sentence", "conventions"],
  },
  speaking_listening: {
    strong: ["speaking and listening", "turn and talk", "oral presentation", "discussion"],
    support: ["partner talk", "oral response", "listen and respond"],
  },
}

export function resolveLessonProfile(
  args: ResolveLessonProfileArgs
): ResolvedLessonProfile {
  const { inputs, selectedMode = "single", curriculumAnalyses = [] } = args

  const teacherSignalText = flattenInputs(inputs)
  const curriculumSignalText = flattenCurriculumAnalyses(curriculumAnalyses)
  const scoredAreas = scoreElaAreas(teacherSignalText, curriculumSignalText)

  const boostedAreas = applyModeBias(scoredAreas, selectedMode)
  const areas = boostedAreas.filter((area) => area.score > 0)
  const dominantAreaKeys = selectDominantAreaKeys(areas, selectedMode)

  return {
    areas,
    dominantAreaKeys,
    pinnedAreaKeys: resolvePinnedAreaKeys(selectedMode),
    excludedAreaKeys: [],
    lessonShape:
      selectedMode === "full" || dominantAreaKeys.length > 1 ? "combined" : "single",
  }
}

export function detectLessonTargets(
  inputs: LessonInputs,
  selectedMode: LessonMode = "single",
  curriculumAnalyses: CurriculumAnalysis[] = []
): DetectedLessonTargets {
  const profile = resolveLessonProfile({
    inputs,
    selectedMode,
    curriculumAnalyses,
  })

  return detectLessonTargetsFromProfile(profile, selectedMode)
}

export function detectLessonTargetsFromProfile(
  profile: ResolvedLessonProfile,
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

  const foundationalScore = scoreFamily(profile.areas, FOUNDATIONAL_AREAS)
  const comprehensionScore = scoreFamily(profile.areas, COMPREHENSION_AREAS)
  const compositionScore = scoreFamily(profile.areas, COMPOSITION_AREAS)

  const hasFoundationalDominant = profile.dominantAreaKeys.some((key) => FOUNDATIONAL_AREAS.has(key))
  const hasComprehensionDominant = profile.dominantAreaKeys.some((key) => COMPREHENSION_AREAS.has(key))
  const hasCompositionDominant = profile.dominantAreaKeys.some((key) => COMPOSITION_AREAS.has(key))

  if (hasFoundationalDominant && hasComprehensionDominant && compositionScore === 0) {
    return {
      primary: "phonics",
      secondary: "comprehension",
      isMixedTarget: true,
      recommendedMode: "full",
    }
  }

  if (hasCompositionDominant && (hasFoundationalDominant || hasComprehensionDominant)) {
    return {
      primary: "general",
      secondary: null,
      isMixedTarget: false,
      recommendedMode: selectedMode === "full" ? "full" : "single",
    }
  }

  if (foundationalScore > 0 && comprehensionScore === 0 && compositionScore === 0) {
    return {
      primary: "phonics",
      secondary: null,
      isMixedTarget: false,
      recommendedMode: "phonics_only",
    }
  }

  if (comprehensionScore > 0 && foundationalScore === 0 && compositionScore === 0) {
    return {
      primary: "comprehension",
      secondary: null,
      isMixedTarget: false,
      recommendedMode: "comprehension_only",
    }
  }

  if (foundationalScore > 0 && comprehensionScore > 0 && compositionScore === 0) {
    return {
      primary: foundationalScore >= comprehensionScore ? "phonics" : "comprehension",
      secondary: foundationalScore >= comprehensionScore ? "comprehension" : "phonics",
      isMixedTarget: true,
      recommendedMode: "full",
    }
  }

  return {
    primary: "general",
    secondary: null,
    isMixedTarget: false,
    recommendedMode: selectedMode === "full" ? "full" : "single",
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

function flattenInputs(inputs: LessonInputs): string {
  return Object.values(inputs as Record<string, unknown>)
    .filter((value) => value !== null && value !== undefined)
    .map((value) => String(value))
    .join(" ")
    .toLowerCase()
}

function flattenCurriculumAnalyses(curriculumAnalyses: CurriculumAnalysis[]): string {
  return curriculumAnalyses
    .flatMap((analysis) => [
      ...analysis.standards,
      ...analysis.vocabulary,
      ...analysis.wordLists,
      ...analysis.texts,
      ...analysis.practiceTasks,
      ...analysis.instructionalTargets,
      ...analysis.examples,
      ...(analysis.coverage?.standards ?? []),
      ...(analysis.coverage?.vocabulary ?? []),
      ...(analysis.coverage?.wordLists ?? []),
      ...(analysis.coverage?.texts ?? []),
      ...(analysis.coverage?.practiceTasks ?? []),
      ...(analysis.coverage?.instructionalTargets ?? []),
      ...(analysis.coverage?.foundationalSkills ?? []),
      ...(analysis.coverage?.sightWords ?? []),
      ...(analysis.coverage?.lessonSegments ?? []),
    ])
    .join(" ")
    .toLowerCase()
}

function scoreElaAreas(
  teacherSignalText: string,
  curriculumSignalText: string
): ResolvedElaArea[] {
  return (Object.keys(AREA_SIGNAL_LIBRARY) as ElaAreaKey[])
    .map((key) => {
      const config = AREA_SIGNAL_LIBRARY[key]

      const teacherStrongHits = countMatches(teacherSignalText, config.strong)
      const teacherSupportHits = countMatches(teacherSignalText, config.support)
      const curriculumStrongHits = countMatches(curriculumSignalText, config.strong)
      const curriculumSupportHits = countMatches(curriculumSignalText, config.support)

      const score =
        teacherStrongHits * 3 +
        teacherSupportHits * 2 +
        curriculumStrongHits * 4 +
        curriculumSupportHits * 2

      const evidence = uniqueStrings([
        ...collectEvidence(teacherSignalText, config.strong),
        ...collectEvidence(teacherSignalText, config.support),
        ...collectEvidence(curriculumSignalText, config.strong),
        ...collectEvidence(curriculumSignalText, config.support),
      ]).slice(0, 4)

      const sources = uniqueSources([
        teacherStrongHits > 0 || teacherSupportHits > 0 ? "teacher_input" : null,
        curriculumStrongHits > 0 || curriculumSupportHits > 0 ? "curriculum_analysis" : null,
      ])

      return {
        key,
        score,
        evidence,
        sources,
      }
    })
    .filter((area) => area.score > 0)
    .sort((left, right) => right.score - left.score)
}

function applyModeBias(
  areas: ResolvedElaArea[],
  selectedMode: LessonMode
): ResolvedElaArea[] {
  const pinnedAreaKeys = resolvePinnedAreaKeys(selectedMode)

  if (pinnedAreaKeys.length === 0) {
    return areas
  }

  return areas
    .map((area) => ({
      ...area,
      score: area.score + (pinnedAreaKeys.includes(area.key) ? 5 : 0),
    }))
    .sort((left, right) => right.score - left.score)
}

function resolvePinnedAreaKeys(selectedMode: LessonMode): ElaAreaKey[] {
  if (selectedMode === "phonics_only") {
    return [
      "phonics",
      "high_frequency_words",
      "phonemic_awareness",
      "phonological_awareness",
      "word_building",
      "decodable_reading",
      "spelling_encoding",
    ]
  }

  if (selectedMode === "comprehension_only") {
    return [
      "comprehension",
      "reading_response",
      "fluency",
      "vocabulary_oral_language",
    ]
  }

  return []
}

function selectDominantAreaKeys(
  areas: ResolvedElaArea[],
  selectedMode: LessonMode
): ElaAreaKey[] {
  if (areas.length === 0) {
    return []
  }

  if (selectedMode === "phonics_only") {
    return areas
      .filter((area) => FOUNDATIONAL_AREAS.has(area.key))
      .slice(0, 3)
      .map((area) => area.key)
  }

  if (selectedMode === "comprehension_only") {
    return areas
      .filter((area) => COMPREHENSION_AREAS.has(area.key))
      .slice(0, 3)
      .map((area) => area.key)
  }

  const topScore = areas[0]?.score ?? 0
  const threshold = Math.max(topScore - 3, 1)

  const selected = areas
    .filter((area) => area.score >= threshold)
    .slice(0, selectedMode === "full" ? 4 : 3)

  if (selectedMode === "single" && selected.length < 2) {
    const primaryFamily = getAreaFamily(selected[0]?.key ?? areas[0]?.key)

    const crossFamilyCandidate = areas.find((area) => {
      if (selected.some((chosen) => chosen.key === area.key)) {
        return false
      }

      const family = getAreaFamily(area.key)
      if (family === primaryFamily) {
        return false
      }

      return area.score >= Math.max(Math.floor(topScore * 0.45), 6)
    })

    if (crossFamilyCandidate) {
      selected.push(crossFamilyCandidate)
    }
  }

  return selected.map((area) => area.key)
}

function getAreaFamily(
  key: ElaAreaKey | undefined
): "foundational" | "comprehension" | "composition" | "other" {
  if (!key) {
    return "other"
  }

  if (FOUNDATIONAL_AREAS.has(key)) {
    return "foundational"
  }

  if (COMPREHENSION_AREAS.has(key)) {
    return "comprehension"
  }

  if (COMPOSITION_AREAS.has(key)) {
    return "composition"
  }

  return "other"
}

function countMatches(text: string, terms: string[]): number {
  return terms.filter((term) => text.includes(term)).length
}

function collectEvidence(text: string, terms: string[]): string[] {
  return terms.filter((term) => text.includes(term))
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter((value) => value.length > 0)))
}

function uniqueSources(
  sources: Array<ResolvedElaArea["sources"][number] | null>
): ResolvedElaArea["sources"] {
  return Array.from(new Set(sources.filter(Boolean))) as ResolvedElaArea["sources"]
}

function scoreFamily(
  areas: ResolvedElaArea[],
  family: Set<ElaAreaKey>
): number {
  return areas
    .filter((area) => family.has(area.key))
    .reduce((total, area) => total + area.score, 0)
}





