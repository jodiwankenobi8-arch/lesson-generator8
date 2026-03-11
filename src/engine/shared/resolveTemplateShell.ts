import { LessonBlueprint } from "../types"

export type ResolvedTemplateShell = {
  lessonSegments: string[]
  slideShell: string[]
  timing: string[]
  teacherMoves: string[]
  promptStyle: string[]
  tone: string[]
}

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
  const teacherMovesCount = options?.teacherMovesCount ?? 4
  const promptStyleCount = options?.promptStyleCount ?? 4
  const toneCount = options?.toneCount ?? 2

  const lessonSegments = take(
    templateShell?.segmentOrder ?? blueprint.structure.lessonSegments,
    lessonSegmentsCount,
    ["Teach", "Practice", "Closure"]
  )

  const slideShell = take(
    templateShell?.slideShell ?? lessonSegments,
    options?.slideShellCount ?? Math.max(lessonSegments.length, 3),
    lessonSegments
  )

  const timing = take(
    templateShell?.timingShell ?? blueprint.structure.timing,
    options?.timingCount ?? Math.max(lessonSegments.length, 3),
    ["Mini-lesson", "Practice", "Closure"]
  )

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
    lessonSegments,
    slideShell,
    timing,
    teacherMoves,
    promptStyle,
    tone,
  }
}

function take(items: string[], count: number, fallback: string[]): string[] {
  const cleaned = Array.from(
    new Set((items ?? []).map((item) => item.trim()).filter((item) => item.length > 0))
  ).slice(0, count)

  return cleaned.length ? cleaned : fallback
}
