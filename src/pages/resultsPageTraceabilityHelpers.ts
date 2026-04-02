import type { LessonBlueprint } from "../engine/types"

function joinOrFallback(items: string[], fallback: string): string {
  return items.length > 0 ? items.join(", ") : fallback
}

export function summarizeContentGrounding(blueprint: LessonBlueprint): string {
  const coverage = blueprint.content.coverage

  return joinOrFallback(
    [
      ...(coverage?.instructionalTargets ?? []),
      ...(coverage?.standards ?? blueprint.content.standards),
      ...(coverage?.vocabulary ?? blueprint.content.vocabulary),
      ...(coverage?.wordLists ?? blueprint.content.wordLists),
      ...(coverage?.texts ?? blueprint.content.texts),
      ...(coverage?.practiceIdeas ?? blueprint.content.practiceIdeas),
    ],
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
    if (!settings || !settings.mode || settings.mode === "inspiration") {
      return "Use as inspiration"
    }

    if (settings.mode === "copy_closely") {
      return "Copy closely"
    }

    if (settings.mode === "selected_aspects") {
      const aspects = (settings.aspects ?? []).map(formatExemplarAspectLabel)
      return aspects.length > 0
        ? `Choose specific aspects: ${aspects.join(", ")}`
        : "Choose specific aspects"
    }

    if (settings.mode === "custom") {
      const custom = settings.customInstructions?.trim()
      return custom ? `Custom instructions: ${custom}` : "Custom instructions"
    }

    return "Default exemplar influence"
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
