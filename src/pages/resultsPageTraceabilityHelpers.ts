import type { LessonBlueprint } from "../engine/types"
import { getBlueprintContentGroundingItems } from "../engine/shared/teacherFacingContent"

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
    "Standards, vocabulary, examples, texts, and practice are using default lesson grounding."
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
