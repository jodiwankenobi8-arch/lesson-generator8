import type { ExemplarStyleAspect, ExemplarStyleSettings } from "../engine/types"

export const EXEMPLAR_ASPECT_OPTIONS: Array<{ value: ExemplarStyleAspect; label: string }> = [
  { value: "structure", label: "Structure" },
  { value: "slide_flow", label: "Slide flow" },
  { value: "teacher_prompts", label: "Teacher prompts" },
  { value: "pacing", label: "Pacing" },
  { value: "visual_layout", label: "Visual layout" },
  { value: "wording_tone", label: "Wording / tone" },
]

export const EXEMPLAR_INFLUENCE_MODE_OPTIONS: Array<{
  value: ExemplarStyleSettings["mode"]
  label: string
  help: string
}> = [
  {
    value: "inspiration",
    label: "Use as inspiration",
    help: "Borrow broad feel and direction without trying to mirror the source closely.",
  },
  {
    value: "copy_closely",
    label: "Copy closely",
    help: "Preserve as much structure, pacing, and teacher-facing style as possible.",
  },
  {
    value: "selected_aspects",
    label: "Choose specific aspects",
    help: "Apply only the exemplar features you explicitly select below.",
  },
  {
    value: "custom",
    label: "Custom instructions",
    help: "Write a teacher-facing note about how this exemplar should influence the lesson.",
  },
]

export function getDefaultExemplarStyleSettings(
  settings?: Partial<ExemplarStyleSettings> | null
): ExemplarStyleSettings {
  return {
    mode: settings?.mode ?? "inspiration",
    aspects: [...(settings?.aspects ?? [])],
    customInstructions: settings?.customInstructions ?? "",
  }
}
