import { detectLessonTargets, resolveLessonMode } from "./detectLessonTargets"
import { LessonBlueprint, LessonInputs, LessonMode, MaterialFile } from "../types"

export function buildBlueprint(
  inputs: LessonInputs,
  materials: MaterialFile[],
  selectedMode: LessonMode
): LessonBlueprint {
  const curriculumMaterials = materials.filter(
    (material) => material.role === "curriculum" && material.analysis
  )

  const exemplarMaterials = materials.filter(
    (material) => material.role === "exemplar" && material.analysis
  )

  const rawTarget = detectLessonTargets(inputs, selectedMode)
  const resolvedMode = resolveLessonMode(selectedMode, rawTarget)
  const target = buildResolvedTarget(rawTarget, resolvedMode)

  const standards = inputs.standard.trim()
    ? [inputs.standard]
    : extractUniqueTags(curriculumMaterials, "content")

  const vocabulary = extractVocabulary(curriculumMaterials, target.primary)

  const wordLists = extractWordLists(curriculumMaterials, target.primary)

  const texts = extractTexts(curriculumMaterials, inputs.topic)

  const practiceIdeas = extractPracticeIdeas(curriculumMaterials, target.primary)

  const timing = exemplarMaterials.length
    ? ["Warm-up - 5 min", "Teach - 10 min", "Practice - 10 min"]
    : ["Mini-lesson", "Practice", "Closure"]

  const lessonSegments =
    target.isMixedTarget && target.recommendedMode === "full"
      ? ["Part 1", "Part 2", "Closure"]
      : exemplarMaterials.length
        ? ["Opening", "Teach", "Guided Practice", "Independent Practice", "Closure"]
        : ["Teach", "Practice", "Close"]

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

function extractVocabulary(materials: MaterialFile[], primaryTarget: string): string[] {
  const extracted = uniqueLines(
    materials.flatMap((material) => material.analysis?.extractedText ?? []),
    (line) =>
      primaryTarget === "phonics"
        ? containsAny(line, ["pattern", "sound", "vowel", "blend", "digraph", "word"])
        : containsAny(line, ["vocabulary", "character", "theme", "detail", "question", "story"])
  )

  return extracted.length
    ? extracted
    : primaryTarget === "phonics"
      ? ["phonics pattern", "target words"]
      : ["key vocabulary", "comprehension language"]
}

function extractWordLists(materials: MaterialFile[], primaryTarget: string): string[] {
  const extracted = uniqueLines(
    materials.flatMap((material) => material.analysis?.extractedText ?? []),
    (line) =>
      primaryTarget === "phonics"
        ? containsAny(line, ["word", "list", "sound", "pattern", "decode", "blend"])
        : containsAny(line, ["question", "detail", "character", "event", "retell"])
  )

  return extracted.length ? extracted : ["Teacher-provided practice items"]
}

function extractTexts(materials: MaterialFile[], topic: string): string[] {
  const extracted = uniqueLines(
    materials.flatMap((material) => material.analysis?.extractedText ?? []),
    (line) =>
      containsAny(line, ["passage", "story", "text", "read", "article"]) &&
      line.trim().length > 0
  )

  if (extracted.length) {
    return extracted
  }

  return topic.trim().length > 0 ? [topic] : ["Teacher-provided lesson text"]
}

function extractPracticeIdeas(materials: MaterialFile[], primaryTarget: string): string[] {
  const tagIdeas = materials.flatMap((material) => material.analysis?.tags ?? [])

  const textIdeas = uniqueLines(
    materials.flatMap((material) => material.analysis?.extractedText ?? []),
    (line) =>
      primaryTarget === "phonics"
        ? containsAny(line, ["practice", "read", "sort", "blend", "decode", "word list"])
        : containsAny(line, ["practice", "discuss", "retell", "answer", "evidence", "partner"])
  )

  const combined = Array.from(new Set([...tagIdeas, ...textIdeas]))

  return combined.length
    ? combined
    : primaryTarget === "phonics"
      ? ["Word reading", "Sound sort", "Partner decoding"]
      : ["Guided reading", "Partner discussion", "Question practice"]
}

function extractUniqueTags(materials: MaterialFile[], fallback: string): string[] {
  const tags = materials.flatMap((material) => material.analysis?.tags ?? [])
  return tags.length ? Array.from(new Set(tags)) : [fallback]
}

function uniqueLines(lines: string[], predicate: (line: string) => boolean): string[] {
  return Array.from(
    new Set(
      lines
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .filter(predicate)
    )
  )
}

function containsAny(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase()
  return terms.some((term) => lower.includes(term))
}
