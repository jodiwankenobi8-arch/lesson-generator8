import {
  ExemplarAnalysis,
  ExemplarDetectedFeature,
  ExemplarDetectedFeatureKey,
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
  const exemplarTiming = sanitizeStructureValues(
    cleanUnique(exemplarAnalyses.flatMap((analysis) => analysis.pacing)),
    "timing"
  )
  const features = getDetectedFeatures(exemplarAnalyses)

  if (exemplarTiming.length > 0) {
    return exemplarTiming.slice(0, 6)
  }

  if (hasFeature(features, "timers") || hasFeature(features, "pacing_markers")) {
    return ["Launch - 5 min", "Teach - 10 min", "Practice - 10 min", "Closure - 5 min"]
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
  const structureDrivenSegments = sanitizeStructureValues(
    cleanUnique([
      ...exemplarAnalyses.flatMap((analysis) => analysis.reusableStructure),
      ...exemplarAnalyses.flatMap((analysis) => analysis.slideFlow),
      ...buildSegmentsFromDetectedFeatures(exemplarAnalyses),
    ])
      .map(normalizeSegmentLabel)
      .filter((segment) => segment.length > 0),
    "segment"
  )

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
  const features = getDetectedFeatures(exemplarAnalyses)
  const moves = sanitizeStructureValues(
    cleanUnique([
      ...exemplarAnalyses.flatMap((analysis) => analysis.teacherMoves),
      ...buildTeacherMovesFromFeatures(features),
    ]),
    "teacherMove"
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
  const features = getDetectedFeatures(exemplarAnalyses)
  const prompts = sanitizeStructureValues(
    cleanUnique([
      ...exemplarAnalyses.flatMap((analysis) => analysis.promptStyle),
      ...buildPromptStyleFromFeatures(features),
    ]),
    "prompt"
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
  const tones = sanitizeStructureValues(
    cleanUnique(exemplarAnalyses.flatMap((analysis) => analysis.tone)),
    "tone"
  )

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
    ...buildTemplateShellSignalsFromFeatures(exemplarAnalyses),
    ...lessonSegments,
  ])

  const slideShell = sanitizeStructureValues(
    rawSlideCandidates
      .map(normalizeSlideShellLabel)
      .filter((label) => label.length > 0),
    "slideShell"
  ).slice(0, Math.max(reusableSegments.length, 3))

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

function buildSegmentsFromDetectedFeatures(exemplarAnalyses: ExemplarAnalysis[]): string[] {
  const features = getDetectedFeatures(exemplarAnalyses)
  const segments: string[] = []

  if (hasFeature(features, "objective_slide") || hasFeature(features, "warm_up")) {
    segments.push("Opening")
  }

  if (hasFeature(features, "mini_lesson")) {
    segments.push("Teach")
  }

  if (hasFeature(features, "guided_practice")) {
    segments.push("Guided Practice")
  }

  if (hasFeature(features, "independent_practice")) {
    segments.push("Independent Practice")
  }

  if (hasFeature(features, "centers")) {
    segments.push("Centers")
  }

  if (hasFeature(features, "closure") || hasFeature(features, "exit_ticket")) {
    segments.push("Closure")
  }

  return cleanUnique(segments)
}

function buildTeacherMovesFromFeatures(features: ExemplarDetectedFeature[]): string[] {
  const moves: string[] = []

  if (hasFeature(features, "teacher_scripts")) {
    moves.push("Teacher scripting")
  }

  if (hasFeature(features, "teacher_prompt_blocks")) {
    moves.push("Teacher-led prompting")
  }

  if (hasFeature(features, "turn_and_talk")) {
    moves.push("Turn and talk facilitation")
  }

  if (hasFeature(features, "call_and_response")) {
    moves.push("Call and response")
  }

  if (hasFeature(features, "interactive_checkpoints")) {
    moves.push("Interactive checkpoint")
  }

  return cleanUnique(moves)
}

function buildPromptStyleFromFeatures(features: ExemplarDetectedFeature[]): string[] {
  const prompts: string[] = []

  if (hasFeature(features, "teacher_prompt_blocks")) {
    prompts.push("Teacher prompt block")
  }

  if (hasFeature(features, "turn_and_talk")) {
    prompts.push("Turn and talk")
  }

  if (hasFeature(features, "call_and_response")) {
    prompts.push("Call and response")
  }

  if (hasFeature(features, "interactive_checkpoints")) {
    prompts.push("Quick check")
  }

  return cleanUnique(prompts)
}

function buildTemplateShellSignalsFromFeatures(exemplarAnalyses: ExemplarAnalysis[]): string[] {
  const features = getDetectedFeatures(exemplarAnalyses)
  const shellSignals: string[] = []

  if (hasFeature(features, "objective_slide")) {
    shellSignals.push("Objective / Opening")
  }

  if (hasFeature(features, "word_list_slots")) {
    shellSignals.push("Word List / Practice")
  }

  if (hasFeature(features, "passage_slots")) {
    shellSignals.push("Passage / Text")
  }

  if (hasFeature(features, "practice_task_slots")) {
    shellSignals.push("Practice Task")
  }

  if (hasFeature(features, "image_slots")) {
    shellSignals.push("Visual / Image")
  }

  if (hasFeature(features, "table_layout")) {
    shellSignals.push("Table / Sort")
  }

  if (hasFeature(features, "split_layout")) {
    shellSignals.push("Compare / Split View")
  }

  if (hasFeature(features, "exit_ticket")) {
    shellSignals.push("Closure / Check")
  }

  return cleanUnique(shellSignals)
}

function getDetectedFeatures(exemplarAnalyses: ExemplarAnalysis[]): ExemplarDetectedFeature[] {
  const all = exemplarAnalyses.flatMap((analysis) => analysis.detectedFeatures?.items ?? [])
  const byKey = new Map<ExemplarDetectedFeatureKey, ExemplarDetectedFeature>()

  for (const feature of all) {
    const existing = byKey.get(feature.key)

    if (!existing || feature.confidence > existing.confidence) {
      byKey.set(feature.key, feature)
    }
  }

  return Array.from(byKey.values())
}

function hasFeature(
  features: ExemplarDetectedFeature[],
  key: ExemplarDetectedFeatureKey
): boolean {
  return features.some((feature) => feature.key === key)
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
    .replace(/^part\s+[a-z0-9]+\s*:\s*/i, "")
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

  if (lower.includes("closure") || lower.includes("close") || lower.includes("exit ticket")) {
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

type StructureValueKind = "timing" | "segment" | "teacherMove" | "prompt" | "tone" | "slideShell"

function sanitizeStructureValues(values: string[], kind: StructureValueKind): string[] {
  return cleanUnique(
    values
      .map((value) => normalizeStructureValue(value))
      .filter((value) => value.length > 0)
      .filter((value) => !isWeakStructureValue(value, kind))
  )
}

function normalizeStructureValue(value: string): string {
  return value
    .replace(/^[\s*•\-–—]+/, "")
    .replace(/^part\s+[a-z0-9]+\s*:\s*/i, "")
    .replace(/^next\s*:\s*/i, "")
    .replace(/\s+/g, " ")
    .trim()
}

function isWeakStructureValue(value: string, kind: StructureValueKind): boolean {
  const lower = value.toLowerCase()
  const wordCount = value.split(/\s+/).length
  const commaCount = (value.match(/,/g) || []).length

  if (/students?\s*:\s*\d+/i.test(value)) {
    return true
  }

  if (/time\s*[:=]/i.test(lower)) {
    return true
  }

  if (/\b\d+\s*(min|mins|minutes)\b/i.test(lower)) {
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
    lower.includes("students are not") ||
    lower.includes("teacher says") ||
    lower.includes("teacher prompts") ||
    lower.includes("slideslink") ||
    lower.includes("whiteboards") ||
    lower.includes("ed tech") ||
    lower.includes("resource")
  ) {
    return true
  }

  if (commaCount >= 3) {
    return true
  }

  if (wordCount > 12) {
    return true
  }

  if (kind === "teacherMove") {
    return !containsAnyStructureTerm(lower, [
      "model",
      "guided",
      "prompt",
      "check",
      "support",
      "conference",
      "reteach",
      "monitor",
      "facilitate",
      "explain",
      "script",
      "talk",
      "response",
    ])
  }

  if (kind === "prompt") {
    return !containsAnyStructureTerm(lower, [
      "prompt",
      "question",
      "turn and talk",
      "response",
      "frame",
      "discussion",
      "say the sound",
      "read the word",
      "explain the pattern",
      "quick check",
    ])
  }

  if (kind === "timing") {
    return !containsAnyStructureTerm(lower, [
      "launch",
      "opening",
      "mini-lesson",
      "teach",
      "practice",
      "guided",
      "independent",
      "closure",
      "transition",
      "flexible timing",
      "part 1",
      "part 2",
    ])
  }

  if (kind === "segment") {
    return !["opening", "teach", "guided practice", "independent practice", "centers", "closure", "close"].includes(lower)
  }

  if (kind === "slideShell") {
    return !["opening", "teach", "guided practice", "independent practice", "centers", "closure", "teaching notes"].includes(lower)
  }

  if (kind === "tone") {
    return !containsAnyStructureTerm(lower, [
      "clear",
      "instructional",
      "supportive",
      "calm",
      "warm",
      "direct",
    ])
  }

  return false
}

function containsAnyStructureTerm(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term))
}

function cleanUnique(values: string[]): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter((value) => value.length > 0)
        .filter((value, index, items) => items.findIndex((other) => other.toLowerCase() === value.toLowerCase()) === index)
    )
  )
}
