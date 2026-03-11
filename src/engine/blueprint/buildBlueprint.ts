import { detectLessonTargets, resolveLessonMode } from "./detectLessonTargets"
import {
  CurriculumAnalysis,
  ExemplarAnalysis,
  LessonBlueprint,
  LessonInputs,
  LessonMode,
  MaterialFile,
} from "../types"

export function buildBlueprint(
  inputs: LessonInputs,
  materials: MaterialFile[],
  selectedMode: LessonMode
): LessonBlueprint {
  const curriculumMaterials = materials.filter(
    (material) => material.role === "curriculum" && material.analysis?.curriculum
  )

  const exemplarMaterials = materials.filter(
    (material) => material.role === "exemplar" && material.analysis?.exemplar
  )

  const curriculumAnalyses = curriculumMaterials
    .map((material) => material.analysis?.curriculum)
    .filter((analysis): analysis is CurriculumAnalysis => Boolean(analysis))

  const exemplarAnalyses = exemplarMaterials
    .map((material) => material.analysis?.exemplar)
    .filter((analysis): analysis is ExemplarAnalysis => Boolean(analysis))

  const rawTarget = detectLessonTargets(inputs, selectedMode)
  const resolvedMode = resolveLessonMode(selectedMode, rawTarget)
  const target = buildResolvedTarget(rawTarget, resolvedMode)

  const standards = inputs.standard.trim()
    ? [inputs.standard.trim()]
    : preferCurriculumValues(
        curriculumAnalyses.flatMap((analysis) => analysis.standards),
        extractUniqueTags(curriculumMaterials, "content"),
        ["teacher-selected standard"]
      )

  const vocabulary = preferCurriculumValues(
    curriculumAnalyses.flatMap((analysis) => analysis.vocabulary),
    extractVocabularyFromText(curriculumMaterials, target.primary),
    primaryVocabularyFallback(target.primary)
  )

  const wordLists = preferCurriculumValues(
    [
      ...curriculumAnalyses.flatMap((analysis) => analysis.wordLists),
      ...curriculumAnalyses.flatMap((analysis) => analysis.examples),
    ],
    extractWordListsFromText(curriculumMaterials, target.primary),
    ["Teacher-provided practice items"]
  )

  const texts = preferCurriculumValues(
    curriculumAnalyses.flatMap((analysis) => analysis.texts),
    extractTextsFromText(curriculumMaterials, inputs.topic),
    inputs.topic.trim().length > 0 ? [inputs.topic.trim()] : ["Teacher-provided lesson text"]
  )

  const practiceIdeas = preferCurriculumValues(
    [
      ...curriculumAnalyses.flatMap((analysis) => analysis.practiceTasks),
      ...curriculumAnalyses.flatMap((analysis) => analysis.instructionalTargets),
    ],
    extractPracticeIdeasFromText(curriculumMaterials, target.primary),
    primaryPracticeFallback(target.primary)
  )

  const timing = buildTiming(exemplarAnalyses, target)
  const lessonSegments = buildLessonSegments(exemplarAnalyses, target)
  const teacherMoves = buildTeacherMoves(exemplarAnalyses, target)
  const promptStyle = buildPromptStyle(exemplarAnalyses, target)
  const tone = buildTone(exemplarAnalyses)

  return {
    content: {
      target,
      standards,
      vocabulary,
      wordLists,
      texts,
      practiceIdeas,
    },
    structure: {
      timing,
      lessonSegments,
      teacherMoves,
      promptStyle,
      tone,
      templateShell: {
        segmentOrder: lessonSegments,
        slideShell: buildSlideShell(lessonSegments),
        timingShell: timing,
        teacherMoveShell: teacherMoves,
        promptShell: promptStyle,
        toneShell: tone,
      },
    },
  }
}

function buildResolvedTarget(
  rawTarget: ReturnType<typeof detectLessonTargets>,
  resolvedMode: LessonMode
) {
  if (resolvedMode === "phonics_only") {
    return {
      primary: "phonics",
      secondary: rawTarget.primary === "comprehension" ? "comprehension" : null,
      isMixedTarget: false,
      recommendedMode: resolvedMode,
    }
  }

  if (resolvedMode === "comprehension_only") {
    return {
      primary: "comprehension",
      secondary: rawTarget.primary === "phonics" ? "phonics" : null,
      isMixedTarget: false,
      recommendedMode: resolvedMode,
    }
  }

  if (resolvedMode === "full") {
    return {
      primary: rawTarget.isMixedTarget ? "phonics" : rawTarget.primary,
      secondary: rawTarget.isMixedTarget
        ? rawTarget.secondary ?? "comprehension"
        : rawTarget.secondary,
      isMixedTarget: rawTarget.isMixedTarget,
      recommendedMode: resolvedMode,
    }
  }

  return {
    ...rawTarget,
    recommendedMode: resolvedMode,
  }
}

function buildTiming(
  exemplarAnalyses: ExemplarAnalysis[],
  target: LessonBlueprint["content"]["target"]
): string[] {
  const exemplarTiming = cleanUnique(
    exemplarAnalyses.flatMap((analysis) => analysis.pacing)
  )

  if (exemplarTiming.length > 0) {
    return exemplarTiming.slice(0, 6)
  }

  if (target.isMixedTarget && target.recommendedMode === "full") {
    return ["Part 1 - 10 min", "Part 2 - 10 min", "Closure - 5 min"]
  }

  return ["Mini-lesson", "Practice", "Closure"]
}

function buildLessonSegments(
  exemplarAnalyses: ExemplarAnalysis[],
  target: LessonBlueprint["content"]["target"]
): string[] {
  const structureDrivenSegments = cleanUnique([
    ...exemplarAnalyses.flatMap((analysis) => analysis.reusableStructure),
    ...exemplarAnalyses.flatMap((analysis) => analysis.slideFlow),
  ])
    .map(normalizeSegmentLabel)
    .filter((segment) => segment.length > 0)

  if (structureDrivenSegments.length > 0) {
    return structureDrivenSegments.slice(0, 8)
  }

  if (target.isMixedTarget && target.recommendedMode === "full") {
    return ["Part 1", "Part 2", "Closure"]
  }

  return ["Teach", "Practice", "Close"]
}

function buildTeacherMoves(
  exemplarAnalyses: ExemplarAnalysis[],
  target: LessonBlueprint["content"]["target"]
): string[] {
  const moves = cleanUnique(
    exemplarAnalyses.flatMap((analysis) => analysis.teacherMoves)
  )

  if (moves.length > 0) {
    return moves.slice(0, 6)
  }

  if (target.primary === "phonics") {
    return ["Teacher model", "Guided blending", "Prompt students to explain the pattern"]
  }

  if (target.primary === "comprehension") {
    return ["Teacher think-aloud", "Prompt for evidence", "Guide partner discussion"]
  }

  return ["Teacher model", "Guided support"]
}

function buildPromptStyle(
  exemplarAnalyses: ExemplarAnalysis[],
  target: LessonBlueprint["content"]["target"]
): string[] {
  const prompts = cleanUnique(
    exemplarAnalyses.flatMap((analysis) => analysis.promptStyle)
  )

  if (prompts.length > 0) {
    return prompts.slice(0, 6)
  }

  if (target.primary === "phonics") {
    return ["Say the sound", "Read the word", "Explain the pattern"]
  }

  if (target.primary === "comprehension") {
    return ["Turn and talk", "What evidence helps you know?", "Retell the important part"]
  }

  return ["Teacher prompt", "Partner response"]
}

function buildTone(exemplarAnalyses: ExemplarAnalysis[]): string[] {
  const tones = cleanUnique(
    exemplarAnalyses.flatMap((analysis) => analysis.tone)
  )

  if (tones.length > 0) {
    return tones.slice(0, 4)
  }

  return ["clear instructional tone"]
}

function buildSlideShell(lessonSegments: string[]): string[] {
  return lessonSegments.map((segment, index) => `Slide ${index + 1}: ${segment}`)
}

function preferCurriculumValues(
  primaryValues: string[],
  secondaryValues: string[],
  fallbackValues: string[]
): string[] {
  const primary = cleanUnique(primaryValues)
  if (primary.length > 0) {
    return primary
  }

  const secondary = cleanUnique(secondaryValues)
  if (secondary.length > 0) {
    return secondary
  }

  return cleanUnique(fallbackValues)
}

function extractVocabularyFromText(materials: MaterialFile[], primaryTarget: string): string[] {
  return uniqueLines(
    materials.flatMap((material) => material.analysis?.extractedText ?? []),
    (line) =>
      primaryTarget === "phonics"
        ? containsAny(line, ["pattern", "sound", "vowel", "blend", "digraph", "word"])
        : containsAny(line, ["vocabulary", "character", "theme", "detail", "question", "story"])
  )
}

function extractWordListsFromText(materials: MaterialFile[], primaryTarget: string): string[] {
  return uniqueLines(
    materials.flatMap((material) => material.analysis?.extractedText ?? []),
    (line) =>
      primaryTarget === "phonics"
        ? containsAny(line, ["word", "list", "sound", "pattern", "decode", "blend"])
        : containsAny(line, ["question", "detail", "character", "event", "retell"])
  )
}

function extractTextsFromText(materials: MaterialFile[], topic: string): string[] {
  const extracted = uniqueLines(
    materials.flatMap((material) => material.analysis?.extractedText ?? []),
    (line) =>
      containsAny(line, ["passage", "story", "text", "read", "article"]) &&
      line.trim().length > 0
  )

  if (extracted.length > 0) {
    return extracted
  }

  return topic.trim().length > 0 ? [topic.trim()] : []
}

function extractPracticeIdeasFromText(materials: MaterialFile[], primaryTarget: string): string[] {
  const tagIdeas = materials.flatMap((material) => material.analysis?.tags ?? [])

  const textIdeas = uniqueLines(
    materials.flatMap((material) => material.analysis?.extractedText ?? []),
    (line) =>
      primaryTarget === "phonics"
        ? containsAny(line, ["practice", "read", "sort", "blend", "decode", "word list"])
        : containsAny(line, ["practice", "discuss", "retell", "answer", "evidence", "partner"])
  )

  return cleanUnique([...tagIdeas, ...textIdeas])
}

function primaryVocabularyFallback(primaryTarget: string): string[] {
  return primaryTarget === "phonics"
    ? ["phonics pattern", "target words"]
    : ["key vocabulary", "comprehension language"]
}

function primaryPracticeFallback(primaryTarget: string): string[] {
  return primaryTarget === "phonics"
    ? ["Word reading", "Sound sort", "Partner decoding"]
    : ["Guided reading", "Partner discussion", "Question practice"]
}

function extractUniqueTags(materials: MaterialFile[], fallback: string): string[] {
  const tags = materials.flatMap((material) => material.analysis?.tags ?? [])
  return cleanUnique(tags).length ? cleanUnique(tags) : [fallback]
}

function uniqueLines(lines: string[], predicate: (line: string) => boolean): string[] {
  return cleanUnique(
    lines
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .filter(predicate)
  )
}

function cleanUnique(values: string[]): string[] {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter((value) => value.length > 0))
  )
}

function normalizeSegmentLabel(value: string): string {
  const lower = value.toLowerCase()

  if (lower.includes("opening") || lower.includes("objective") || lower.includes("warm")) {
    return "Opening"
  }

  if (lower.includes("i do") || lower.includes("mini-lesson") || lower.includes("teach")) {
    return "Teach"
  }

  if (lower.includes("we do") || lower.includes("guided")) {
    return "Guided Practice"
  }

  if (lower.includes("you do") || lower.includes("independent")) {
    return "Independent Practice"
  }

  if (lower.includes("center") || lower.includes("rotation")) {
    return "Centers"
  }

  if (lower.includes("closure") || lower.includes("close")) {
    return "Closure"
  }

  return toTitleCase(value)
}

function toTitleCase(value: string): string {
  return value
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ")
}

function containsAny(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase()
  return terms.some((term) => lower.includes(term))
}
