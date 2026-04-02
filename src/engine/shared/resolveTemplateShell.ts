import { LessonBlueprint } from "../types"

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
  | "other"

export function resolveTemplateShell(
  blueprint: LessonBlueprint,
  options?: {
    lessonSegmentsCount?: number
    slideShellCount?: number
    timingCount?: number
    teacherMovesCount?: number
    promptStyleCount?: number
    toneCount?: number
  }
): ResolvedTemplateShell {
  const templateShell = blueprint.structure.templateShell

  const lessonSegmentsCount = options?.lessonSegmentsCount ?? 6
  const slideShellCount = options?.slideShellCount ?? Math.max(lessonSegmentsCount, 3)
  const teacherMovesCount = options?.teacherMovesCount ?? 4
  const promptStyleCount = options?.promptStyleCount ?? 4
  const toneCount = options?.toneCount ?? 2

  const rawLessonSegments = take(
    templateShell?.segmentOrder ?? blueprint.structure.lessonSegments,
    lessonSegmentsCount,
    ["Teach", "Guided Practice", "Independent Practice", "Closure"]
  )

  const rawSlideShell = take(
    templateShell?.slideShell ?? rawLessonSegments,
    slideShellCount,
    rawLessonSegments
  )

  const ordered = normalizeInstructionalSequence(rawLessonSegments, rawSlideShell)

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

  return {
    lessonSegments: ordered.map((item) => item.segmentLabel),
    slideShell: ordered.map((item) => item.shellLabel),
    timing: ordered.map((item) => inferTimingLabel(item.kind)),
    teacherMoves,
    promptStyle,
    tone,
  }
}

function normalizeInstructionalSequence(
  lessonSegments: string[],
  slideShell: string[]
): Array<{ segmentLabel: string; shellLabel: string; kind: InstructionalKind }> {
  const maxLength = Math.max(lessonSegments.length, slideShell.length)

  const rows = Array.from({ length: maxLength }, (_, index) => {
    const segmentLabel = lessonSegments[index] ?? slideShell[index] ?? "Guided Practice"
    const shellLabel = slideShell[index] ?? segmentLabel
    const kind = normalizeInstructionalKind(segmentLabel)

    return {
      segmentLabel,
      shellLabel,
      kind,
      rank: getInstructionalRank(kind),
      index,
    }
  })

  rows.sort((a, b) => {
    if (a.rank !== b.rank) {
      return a.rank - b.rank
    }

    return a.index - b.index
  })

  return rows.map(({ segmentLabel, shellLabel, kind }) => ({
    segmentLabel,
    shellLabel,
    kind,
  }))
}

function normalizeInstructionalKind(value: string): InstructionalKind {
  const lower = value.trim().toLowerCase()

  if (lower.includes("objective") || lower.includes("opening") || lower.includes("launch")) {
    return "opening"
  }

  if (lower.includes("teach") || lower.includes("model") || lower.includes("mini-lesson")) {
    return "teach"
  }

  if (lower.includes("guided") || lower.includes("passage") || lower.includes("text")) {
    return "guided_practice"
  }

  if (lower.includes("independent") || lower.includes("you do")) {
    return "independent_practice"
  }

  if (lower.includes("center")) {
    return "centers"
  }

  if (lower.includes("closure") || lower.includes("exit")) {
    return "closure"
  }

  return "other"
}

function getInstructionalRank(kind: InstructionalKind): number {
  if (kind === "opening") return 0
  if (kind === "teach") return 1
  if (kind === "guided_practice") return 2
  if (kind === "independent_practice") return 3
  if (kind === "centers") return 4
  if (kind === "closure") return 5
  return 6
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
