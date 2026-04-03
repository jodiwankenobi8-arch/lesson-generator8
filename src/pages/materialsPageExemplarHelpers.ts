import type {
  ExemplarInfluenceTarget,
  ExemplarStyleAspect,
  ExemplarStyleSettings,
} from "../engine/types"

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
    label: "Keep structure, restyle details",
    help: "Keep the exemplar's layout, structure, and pacing, but add notes for style changes such as colors, theme, or wording.",
  },
]

export function getDefaultExemplarStyleSettings(
  settings?: Partial<ExemplarStyleSettings> | null
): ExemplarStyleSettings {
  return {
    mode: settings?.mode ?? "inspiration",
    aspects: [...(settings?.aspects ?? [])],
    customInstructions: settings?.customInstructions ?? "",
    targets: [...(settings?.targets ?? ["shared"])],
  }
}


export const EXEMPLAR_TARGET_OPTIONS: Array<{
  value: ExemplarInfluenceTarget
  label: string
  help: string
}> = [
  {
    value: "shared",
    label: "Whole package structure",
    help: "Use this exemplar as the main shared structure reference when you want it influencing the overall lesson shape.",
  },
  {
    value: "lesson_slides",
    label: "Slides",
    help: "Apply this exemplar directly to slide flow, pacing, and presentation cues for the slideshow.",
  },
  {
    value: "lesson_plan",
    label: "Lesson plan",
    help: "Apply this exemplar to the teacher-facing lesson plan structure and narrative flow.",
  },
  {
    value: "centers",
    label: "Centers / rotation",
    help: "Apply this exemplar to center flow, center prompts, or rotation structure when relevant.",
  },
  {
    value: "small_group",
    label: "Teacher-led support",
    help: "Apply this exemplar to small-group / teacher-table structure when relevant.",
  },
  {
    value: "intervention",
    label: "Intervention",
    help: "Apply this exemplar to intervention or reteach structure when relevant.",
  },
  {
    value: "printables",
    label: "Printables / student pages",
    help: "Use this exemplar when the printable side of the package should mirror a different structure or feel.",
  },
]
