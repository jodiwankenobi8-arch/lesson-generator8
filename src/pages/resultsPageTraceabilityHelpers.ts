import type { LessonBlueprint } from "../engine/types"
import { getBlueprintContentGroundingItems } from "../engine/shared/teacherFacingContent"
import { REVIEW_CONTENT_SUMMARY } from "../engine/shared/reviewGuidance"

function joinOrFallback(items: string[], fallback: string): string {
  return items.length > 0 ? items.join(", ") : fallback
}

export function summarizeResolvedContentSource(
  selectedSourceNames: string[],
  blueprint: LessonBlueprint
): string {
  if (selectedSourceNames.length > 0) {
    return selectedSourceNames.join(", ")
  }

  return blueprint.sourceReadiness.curriculumSupport === "limited"
    ? "Teacher inputs and fallback lesson grounding"
    : "No selected curriculum source"
}

export function summarizeContentAuthorityLead(
  selectedSourceNames: string[],
  blueprint: LessonBlueprint
): string {
  if (selectedSourceNames.length > 0) {
    return blueprint.sourceReadiness.curriculumSupport === "strong"
      ? "Selected curriculum materials directly shaped the lesson content."
      : "Selected curriculum materials shaped the lesson content, but source coverage still looks limited."
  }

  return "No curriculum source is currently selected, so the lesson content is being assembled from teacher inputs and fallback lesson grounding."
}

export function summarizeContentGrounding(blueprint: LessonBlueprint): string {
  return joinOrFallback(
    getBlueprintContentGroundingItems(blueprint),
    REVIEW_CONTENT_SUMMARY
  )
}

export function summarizeStructureImpact(blueprint: LessonBlueprint): string {
  return joinOrFallback(
    [
      ...blueprint.structure.lessonSegments,
      ...blueprint.structure.timing,
      ...blueprint.structure.teacherMoves,
      ...blueprint.structure.promptStyle,
      ...blueprint.structure.templateShell.slideShell,
    ],
    "Flow, pacing, prompts, and slide shell are using default structure."
  )
}

export function summarizeSelectedExemplarInfluence(
  materials: Array<{
    id: string
    name: string
    role: string
    styleSettings?: {
      mode?: string | null
      aspects?: string[] | null
      customInstructions?: string | null
    } | null
  }>,
  selectedIds: string[]
): string {
  const selected = materials.filter(
    (material) => material.role === "exemplar" && selectedIds.includes(material.id)
  )

  if (selected.length === 0) {
    return "Default exemplar influence"
  }

  const summaries = selected.map((material) => {
    const settings = material.styleSettings
    const exemplarLabel = material.name.trim() || "Selected exemplar"

    if (!settings || !settings.mode || settings.mode === "inspiration") {
      return `${exemplarLabel}: Use as inspiration`
    }

    if (settings.mode === "selected_aspects") {
      const aspects = (settings.aspects ?? []).map(formatExemplarAspectLabel)
      return aspects.length > 0
        ? `${exemplarLabel}: Choose specific aspects: ${aspects.join(", ")}`
        : `${exemplarLabel}: Choose specific aspects`
    }

    if (settings.mode === "custom") {
      const custom = settings.customInstructions?.trim()
      return custom
        ? `${exemplarLabel}: Keep structure with style notes: ${custom}`
        : `${exemplarLabel}: Keep structure with style notes`
    }

    return `${exemplarLabel}: Default exemplar influence`
  })

  return summaries.join(" | ")
}

function formatExemplarAspectLabel(value: string): string {
  switch (value) {
    case "structure":
      return "structure"
    case "slide_flow":
      return "slide flow"
    case "teacher_prompts":
      return "teacher prompts"
    case "pacing":
      return "pacing"
    case "visual_layout":
      return "visual layout"
    case "wording_tone":
      return "wording / tone"
    default:
      return value.replace(/_/g, " ")
  }
}


export function summarizeSelectedExemplarTargets(
  materials: Array<{
    id: string
    name: string
    role: string
    styleSettings?: {
      targets?: string[] | null
    } | null
  }>,
  selectedIds: string[]
): string[] {
  return materials
    .filter((material) => material.role === "exemplar" && selectedIds.includes(material.id))
    .map((material) => {
      const targets = material.styleSettings?.targets ?? ["shared"]
      return `${material.name}: ${targets.map(formatExemplarTargetLabel).join(", ")}`
    })
}

function formatExemplarTargetLabel(value: string): string {
  switch (value) {
    case "shared":
      return "whole package structure"
    case "lesson_plan":
      return "lesson plan"
    case "lesson_slides":
      return "slides"
    case "centers":
      return "centers / rotation"
    case "small_group":
      return "teacher-led support"
    case "intervention":
      return "intervention"
    case "printables":
      return "printables / student pages"
    default:
      return value.replace(/_/g, " ")
  }
}

type ExemplarPayoffLine = {
  label: string
  value: string
}

export type ExemplarPayoffSummary = {
  title: string
  lines: ExemplarPayoffLine[]
  note?: string
}

export function summarizeExemplarPayoff(
  blueprint: LessonBlueprint
): ExemplarPayoffSummary | null {
  if (blueprint.sourceReadiness.selectedExemplarMaterialIds.length === 0) {
    return null
  }

  const scoped = blueprint.structure.scopedTemplateShells
  if (!scoped) {
    return null
  }

  const lines: ExemplarPayoffLine[] = []

  addStructureLine(lines, "Lesson plan structure", scoped.lesson_plan)
  addStructureLine(lines, "Slide structure", scoped.lesson_slides)
  addStructureLine(lines, "Center structure", scoped.centers)

  addLine(
    lines,
    "Pacing and routines carried forward",
    joinValues([
      ...take(scoped.lesson_plan?.timingShell, 2),
      ...take(scoped.lesson_slides?.timingShell, 2),
      ...take(scoped.centers?.timingShell, 1),
    ])
  )

  addLine(
    lines,
    "Teacher moves reflected from exemplar",
    joinValues([
      ...take(scoped.lesson_plan?.teacherMoveShell, 2),
      ...take(scoped.lesson_slides?.teacherMoveShell, 2),
      ...take(scoped.centers?.teacherMoveShell, 1),
    ])
  )

  addLine(
    lines,
    "Presentation moves from your exemplar",
    joinValues([
      ...take(scoped.lesson_plan?.promptShell, 2),
      ...take(scoped.lesson_slides?.promptShell, 2),
      ...take(scoped.centers?.promptShell, 1),
    ])
  )

  addLine(
    lines,
    "Exemplar patterns used",
    joinValues([
      ...take(scoped.lesson_slides?.slideShell, 2),
      ...take(scoped.lesson_plan?.slideShell, 2),
      ...take(scoped.centers?.slideShell, 1),
    ])
  )

  if (lines.length === 0) {
    return null
  }

  const note =
    blueprint.sourceReadiness.exemplarSupport === "strong"
      ? undefined
      : "Limited exemplar structure signals were detected. Use these cues as partial guidance."

  return {
    title: "How the exemplar shaped this lesson",
    lines,
    note,
  }
}

function addStructureLine(
  lines: ExemplarPayoffLine[],
  label: string,
  shell:
    | {
        segmentOrder: string[]
        slideShell: string[]
      }
    | undefined
) {
  if (!shell) {
    return
  }

  const value = joinValues([...take(shell.segmentOrder, 3), ...take(shell.slideShell, 2)])
  addLine(lines, label, value)
}

function addLine(lines: ExemplarPayoffLine[], label: string, value: string) {
  if (!value) {
    return
  }

  lines.push({ label, value })
}

function take(items: string[] | undefined, count: number): string[] {
  return (items ?? [])
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, count)
}

function joinValues(items: string[]): string {
  return Array.from(new Set(items)).join(", ")
}
