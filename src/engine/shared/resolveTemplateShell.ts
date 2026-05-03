import { ExemplarInfluenceTarget, LessonBlueprint } from "../types"

export type ResolvedTemplateShell = {
  lessonSegments: string[]
  slideShell: string[]
  timing: string[]
  teacherMoves: string[]
  promptStyle: string[]
  tone: string[]
}

type InstructionalKind =
  | "opening"
  | "teach"
  | "guided_practice"
  | "independent_practice"
  | "centers"
  | "closure"
  | "layout"
  | "other"

type ResolvedShellRow = {
  kind: InstructionalKind
  segmentLabel: string
  shellLabel: string
}

const CORE_SEQUENCE: InstructionalKind[] = [
  "opening",
  "teach",
  "guided_practice",
  "independent_practice",
  "closure",
]

export function resolveTemplateShell(
  blueprint: LessonBlueprint,
  options?: {
    scope?: ExemplarInfluenceTarget
    lessonSegmentsCount?: number
    slideShellCount?: number
    timingCount?: number
    teacherMovesCount?: number
    promptStyleCount?: number
    toneCount?: number
  }
): ResolvedTemplateShell {
  const scopedTemplateShell = options?.scope
    ? blueprint.structure.scopedTemplateShells?.[options.scope]
    : undefined
  const templateShell = scopedTemplateShell ?? blueprint.structure.templateShell

  const lessonSegmentsCount = options?.lessonSegmentsCount ?? 6
  const slideShellCount = options?.slideShellCount ?? Math.max(lessonSegmentsCount, 3)
  const teacherMovesCount = options?.teacherMovesCount ?? 4
  const promptStyleCount = options?.promptStyleCount ?? 4
  const toneCount = options?.toneCount ?? 2

  const rawLessonSegments = take(
    templateShell?.segmentOrder ?? blueprint.structure.lessonSegments,
    lessonSegmentsCount,
    ["Opening", "Teach", "Guided Practice", "Independent Practice", "Closure"]
  )

  const rawSlideShell = take(
    templateShell?.slideShell ?? rawLessonSegments,
    slideShellCount,
    rawLessonSegments
  )

  const resolvedRows = resolveInstructionalShellRows(rawLessonSegments, rawSlideShell)

  const teacherMoves = take(
    templateShell?.teacherMoveShell ?? blueprint.structure.teacherMoves,
    teacherMovesCount,
    ["teacher model", "guided support"]
  )

  const promptStyle = take(
    templateShell?.promptShell ?? blueprint.structure.promptStyle,
    promptStyleCount,
    ["teacher prompt"]
  )

  const tone = take(
    templateShell?.toneShell ?? blueprint.structure.tone,
    toneCount,
    ["clear instructional tone"]
  )

  if (
    options?.scope &&
    (options.scope === "centers" ||
      options.scope === "small_group" ||
      options.scope === "intervention" ||
      options.scope === "printables") &&
    scopedTemplateShell &&
    templateShell.segmentOrder.length > 0
  ) {
    return {
      lessonSegments: take(templateShell.segmentOrder, lessonSegmentsCount, templateShell.segmentOrder),
      slideShell: take(
        templateShell.slideShell.length > 0 ? templateShell.slideShell : templateShell.segmentOrder,
        slideShellCount,
        templateShell.segmentOrder
      ),
      timing: take(templateShell.timingShell, options?.timingCount ?? lessonSegmentsCount, []),
      teacherMoves,
      promptStyle,
      tone,
    }
  }

  const resolvedLessonSegments = resolvedRows
    .map((item) => item.segmentLabel)
    .slice(0, lessonSegmentsCount)
  const resolvedSlideShell = mergeShellLabels(
    resolvedRows.map((item) => item.shellLabel),
    extractReusableShellSlots(rawSlideShell)
  ).slice(0, slideShellCount)

  return {
    lessonSegments: resolvedLessonSegments,
    slideShell: resolvedSlideShell,
    timing: resolvedRows.map((item) => inferTimingLabel(item.kind)).slice(0, lessonSegmentsCount),
    teacherMoves,
    promptStyle,
    tone,
  }
}

function resolveInstructionalShellRows(
  lessonSegments: string[],
  slideShell: string[]
): ResolvedShellRow[] {
  const candidates = buildCandidateRows(lessonSegments, slideShell)
  const representativeByKind = buildRepresentativeByKind(candidates)
  const hasStrongCoverage = hasStrongInstructionalCoverage(representativeByKind)
  const includeCenters = hasStrongCoverage && representativeByKind.has("centers")

  const sequenceKinds = [...CORE_SEQUENCE]
  if (includeCenters) {
    sequenceKinds.splice(sequenceKinds.length - 1, 0, "centers")
  }

  return sequenceKinds.map((kind) => ({
    kind,
    segmentLabel: getDefaultSegmentLabel(kind),
    shellLabel: getDefaultShellLabel(kind),
  }))
}

function buildCandidateRows(
  lessonSegments: string[],
  slideShell: string[]
): Array<{ kind: InstructionalKind; segmentLabel: string; shellLabel: string; index: number }> {
  const maxLength = Math.max(lessonSegments.length, slideShell.length)

  return Array.from({ length: maxLength }, (_, index) => {
    const segmentLabel = lessonSegments[index] ?? slideShell[index] ?? ""
    const shellLabel = slideShell[index] ?? segmentLabel
    const kind = normalizeInstructionalKind(`${segmentLabel} | ${shellLabel}`)

    return {
      kind,
      segmentLabel: segmentLabel.trim(),
      shellLabel: shellLabel.trim(),
      index,
    }
  }).filter((row) => row.segmentLabel.length > 0 || row.shellLabel.length > 0)
}

function buildRepresentativeByKind(
  rows: Array<{ kind: InstructionalKind; segmentLabel: string; shellLabel: string; index: number }>
): Map<InstructionalKind, { segmentLabel: string; shellLabel: string }> {
  const byKind = new Map<InstructionalKind, { segmentLabel: string; shellLabel: string }>()

  for (const row of rows) {
    if (row.kind === "layout" || row.kind === "other") {
      continue
    }

    if (!byKind.has(row.kind)) {
      byKind.set(row.kind, {
        segmentLabel: row.segmentLabel,
        shellLabel: row.shellLabel,
      })
    }
  }

  return byKind
}

function hasStrongInstructionalCoverage(
  representativeByKind: Map<InstructionalKind, { segmentLabel: string; shellLabel: string }>
): boolean {
  const coreSignalKinds: InstructionalKind[] = [
    "teach",
    "guided_practice",
    "independent_practice",
    "closure",
  ]

  const count = coreSignalKinds.filter((kind) => representativeByKind.has(kind)).length
  return count >= 2
}

function normalizeInstructionalKind(value: string): InstructionalKind {
  const lower = value.trim().toLowerCase()

  if (
    lower.includes("objective") ||
    lower.includes("opening") ||
    lower.includes("launch") ||
    lower.includes("warm")
  ) {
    return "opening"
  }

  if (
    lower.includes("teach") ||
    lower.includes("model") ||
    lower.includes("mini-lesson") ||
    lower.includes("i do")
  ) {
    return "teach"
  }

  if (
    lower.includes("guided practice") ||
    lower.includes("guided") ||
    lower.includes("we do") ||
    lower.includes("scaffold")
  ) {
    return "guided_practice"
  }

  if (
    lower.includes("independent practice") ||
    lower.includes("independent") ||
    lower.includes("you do")
  ) {
    return "independent_practice"
  }

  if (lower.includes("center") || lower.includes("rotation")) {
    return "centers"
  }

  if (
    lower.includes("closure") ||
    lower.includes("exit ticket") ||
    lower.includes("wrap up") ||
    lower.includes("recap")
  ) {
    return "closure"
  }

  if (
    lower.includes("visual") ||
    lower.includes("image") ||
    lower.includes("picture") ||
    lower.includes("table") ||
    lower.includes("sort") ||
    lower.includes("compare") ||
    lower.includes("split view") ||
    lower.includes("passage") ||
    lower.includes("text") ||
    lower.includes("word list") ||
    lower.includes("cards") ||
    lower.includes("practice task") ||
    lower.includes("example") ||
    lower.includes("non-example") ||
    lower.includes("anchor chart") ||
    lower.includes("teacher prompt") ||
    lower.includes("call and response") ||
    lower.includes("curriculum content") ||
    lower.includes("small group") ||
    lower.includes("teacher table")
  ) {
    return "layout"
  }

  return "other"
}

function cleanUnique(values: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const value of values) {
    const cleaned = value.trim()

    if (!cleaned) continue

    const key = cleaned.toLowerCase()
    if (seen.has(key)) continue

    seen.add(key)
    result.push(cleaned)
  }

  return result
}

function extractReusableShellSlots(slideShell: string[]): string[] {
  return cleanUnique(
    slideShell
      .map(normalizeReusableShellSlot)
      .filter((slot): slot is string => slot.length > 0)
  )
}

function normalizeReusableShellSlot(value: string): string {
  const lower = value.trim().toLowerCase()

  if (!lower) return ""
  if (lower.includes("word list") || lower.includes("target words") || lower.includes("heart words") || lower.includes("decodable words")) return "Word List / Practice"
  if (lower.includes("passage") || lower.includes("story") || lower.includes("article") || lower.includes("selection") || /\\btext\\b/.test(lower)) return "Passage / Text"
  if (lower.includes("practice task") || lower.includes("activity") || lower.includes("work time")) return "Practice Task"
  if (lower.includes("hero image") || lower.includes("visual") || lower.includes("image") || lower.includes("photo") || lower.includes("picture") || lower.includes("illustration")) return "Visual / Image"
  if (lower.includes("example / non-example") || lower.includes("example/non-example") || lower.includes("non-example") || lower.includes("non example")) return "Example / Non-Example"
  if (lower.includes("anchor chart")) return "Anchor Chart / Model"
  if (lower.includes("table") || lower.includes("chart") || lower.includes("grid") || lower.includes("sort")) return "Table / Sort"
  if (lower.includes("split view") || lower.includes("side by side") || lower.includes("two column") || lower.includes("compare")) return "Compare / Split View"
  if (lower.includes("teacher prompt") || lower.includes("prompt block") || lower.includes("question stem") || lower.includes("sentence stem")) return "Teacher Prompt Block"
  if (lower.includes("call and response") || lower.includes("choral response") || lower.includes("students echo") || lower.includes("echo response")) return "Call and Response"
  if (lower.includes("curriculum content slot") || lower.includes("curriculum slide") || lower.includes("content slot") || lower.includes("materials slot")) return "Curriculum Content Slot"
  if (lower.includes("small group") || lower.includes("teacher table") || lower.includes("reteach")) return "Small Group / Teacher Table"

  return ""
}

function mergeShellLabels(primary: string[], secondary: string[]): string[] {
  return cleanUnique([...primary, ...secondary])
}

function getDefaultSegmentLabel(kind: InstructionalKind): string {
  if (kind === "opening") return "Opening"
  if (kind === "teach") return "Teach"
  if (kind === "guided_practice") return "Guided Practice"
  if (kind === "independent_practice") return "Independent Practice"
  if (kind === "centers") return "Centers"
  if (kind === "closure") return "Closure"
  return "Guided Practice"
}

function getDefaultShellLabel(kind: InstructionalKind): string {
  if (kind === "opening") return "Objective / Opening"
  if (kind === "teach") return "Model / Teach"
  if (kind === "guided_practice") return "Guided Practice"
  if (kind === "independent_practice") return "Independent Practice"
  if (kind === "centers") return "Centers / Rotation"
  if (kind === "closure") return "Closure / Check"
  return "Guided Practice"
}

function inferTimingLabel(kind: InstructionalKind): string {
  if (kind === "opening") return "Opening"
  if (kind === "teach") return "Mini-lesson"
  if (kind === "guided_practice") return "Guided Practice"
  if (kind === "independent_practice") return "Independent Practice"
  if (kind === "centers") return "Centers"
  if (kind === "closure") return "Closure"
  return "Flexible timing"
}

function take(items: string[], count: number, fallback: string[]): string[] {
  const cleaned = Array.from(
    new Set((items ?? []).map((item) => item.trim()).filter((item) => item.length > 0))
  ).slice(0, count)

  return cleaned.length ? cleaned : fallback
}