import {
  ExemplarAnalysis,
  LessonBlueprint,
} from "../types"

export function resolveBlueprintStructure(args: {
  exemplarAnalyses: ExemplarAnalysis[]
  target: LessonBlueprint["content"]["target"]
}): LessonBlueprint["structure"] {
  const { exemplarAnalyses, target } = args

  const timing = buildTiming(exemplarAnalyses, target)
  const lessonSegments = buildLessonSegments(exemplarAnalyses, target)
  const teacherMoves = buildTeacherMoves(exemplarAnalyses, target)
  const promptStyle = buildPromptStyle(exemplarAnalyses, target)
  const tone = buildTone(exemplarAnalyses)
  const templateShell = buildTemplateShell(
    exemplarAnalyses,
    lessonSegments,
    timing,
    teacherMoves,
    promptStyle,
    tone
  )

  return {
    timing,
    lessonSegments,
    teacherMoves,
    promptStyle,
    tone,
    templateShell,
  }
}

function buildTiming(
  exemplarAnalyses: ExemplarAnalysis[],
  target: LessonBlueprint["content"]["target"]
): string[] {
  const exemplarTiming = cleanUnique(exemplarAnalyses.flatMap((analysis) => analysis.pacing))

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
  const moves = cleanUnique(exemplarAnalyses.flatMap((analysis) => analysis.teacherMoves))

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
  const prompts = cleanUnique(exemplarAnalyses.flatMap((analysis) => analysis.promptStyle))

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
  const tones = cleanUnique(exemplarAnalyses.flatMap((analysis) => analysis.tone))

  if (tones.length > 0) {
    return tones.slice(0, 4)
  }

  return ["clear instructional tone"]
}

function buildTemplateShell(
  exemplarAnalyses: ExemplarAnalysis[],
  lessonSegments: string[],
  timing: string[],
  teacherMoves: string[],
  promptStyle: string[],
  tone: string[]
) {
  const reusableSegments = lessonSegments
    .map(normalizeSegmentLabel)
    .filter((segment) => segment.length > 0)

  const rawSlideCandidates = cleanUnique([
    ...exemplarAnalyses.flatMap((analysis) => analysis.reusableStructure),
    ...exemplarAnalyses.flatMap((analysis) => analysis.slideFlow),
    ...lessonSegments,
  ])

  const slideShell = rawSlideCandidates
    .map(normalizeSlideShellLabel)
    .filter((label) => label.length > 0)
    .slice(0, Math.max(reusableSegments.length, 3))

  return {
    segmentOrder: reusableSegments.length > 0 ? reusableSegments : ["Teach", "Practice", "Closure"],
    slideShell: slideShell.length > 0 ? slideShell : buildDefaultSlideShell(reusableSegments),
    timingShell: alignShellArray(timing, reusableSegments.length, ["Mini-lesson", "Practice", "Closure"]),
    teacherMoveShell: cleanUnique(teacherMoves).slice(0, 6),
    promptShell: cleanUnique(promptStyle).slice(0, 6),
    toneShell: cleanUnique(tone).slice(0, 4),
  }
}

function buildDefaultSlideShell(lessonSegments: string[]): string[] {
  const usableSegments = lessonSegments.length > 0 ? lessonSegments : ["Teach", "Practice", "Closure"]

  return usableSegments.map((segment) => {
    const normalized = normalizeSegmentLabel(segment)

    if (normalized === "Opening") return "Objective / Opening"
    if (normalized === "Teach") return "Model / Teach"
    if (normalized === "Guided Practice") return "Guided Practice"
    if (normalized === "Independent Practice") return "Independent Practice"
    if (normalized === "Centers") return "Centers / Rotation"
    if (normalized === "Closure") return "Closure / Check"
    return normalized
  })
}

function alignShellArray(values: string[], targetLength: number, fallback: string[]): string[] {
  const cleaned = cleanUnique(values)
  const usableFallback = cleanUnique(fallback)
  const desiredLength = Math.max(targetLength, usableFallback.length, 1)

  if (cleaned.length >= desiredLength) {
    return cleaned.slice(0, desiredLength)
  }

  const result = [...cleaned]

  while (result.length < desiredLength) {
    result.push(usableFallback[result.length % usableFallback.length])
  }

  return result
}

function normalizeSlideShellLabel(value: string): string {
  const cleaned = value
    .replace(/^slide\s*\d+\s*[:\-]?\s*/i, "")
    .replace(/^\d+\s*[:\-]?\s*/, "")
    .trim()

  if (cleaned.length === 0) {
    return ""
  }

  return normalizeSegmentLabel(cleaned)
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

function cleanUnique(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter((value) => value.length > 0)))
}
