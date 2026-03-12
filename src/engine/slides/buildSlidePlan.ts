import { LessonBlueprint, LessonSpec } from "../types"
import { SlideAction, SlideKind, SlideOutline } from "./slideTypes"

export function buildSlidePlan(
  blueprint: LessonBlueprint,
  spec: LessonSpec
): SlideOutline[] {
  const shell = blueprint.structure.templateShell
  const segmentOrder = take(shell.segmentOrder, 8, ["Teach", "Practice", "Closure"])
  const slideShell = take(shell.slideShell, Math.max(segmentOrder.length, 3), segmentOrder)
  const timingShell = take(shell.timingShell, Math.max(segmentOrder.length, 3), ["Mini-lesson", "Practice", "Closure"])
  const teacherMoveShell = take(shell.teacherMoveShell, 5, ["teacher model", "guided support"])
  const promptShell = take(shell.promptShell, 5, ["teacher prompt"])
  const toneShell = take(shell.toneShell, 3, ["clear instructional tone"])

  const contentSlides = slideShell.map((shellLabel, index) => {
    const segmentLabel = segmentOrder[index] ?? shellLabel
    const kind = normalizeSlideKind(segmentLabel)
    const section = getSectionForKind(kind, spec)

    return {
      slideNumber: index + 2,
      title: shellLabel,
      kind,
      action: inferSlideAction(shellLabel, kind),
      purpose: inferPurpose(kind, blueprint.content.target.primary),
      timing: timingShell[index] ?? "Flexible timing",
      teacherMove: teacherMoveShell[index % teacherMoveShell.length] ?? "teacher guidance",
      promptStyle: promptShell[index % promptShell.length] ?? "teacher prompt",
      tone: toneShell[index % toneShell.length] ?? "clear instructional tone",
      body: section.steps,
    }
  })

  return [
    {
      slideNumber: 1,
      title: "Objective",
      kind: "objective",
      action: "create_new",
      purpose: "Introduce the lesson objective and frame the learning.",
      timing: "Opening",
      teacherMove: blueprint.structure.teacherMoves[0] ?? "teacher guidance",
      promptStyle: blueprint.structure.promptStyle[0] ?? "teacher prompt",
      tone: blueprint.structure.tone[0] ?? "clear instructional tone",
      body: [
        `Target: ${formatTargetLabel(blueprint.content.target.primary, blueprint.content.target.secondary)}`,
        `Standards: ${blueprint.content.standards.join(", ") || "TBD"}`,
      ],
    },
    ...contentSlides,
    {
      slideNumber: contentSlides.length + 2,
      title: "Teaching Notes",
      kind: "teaching_notes",
      action: "create_new",
      purpose: "Summarize teacher-facing notes, moves, and reminders.",
      timing: "Flexible timing",
      teacherMove: blueprint.structure.teacherMoves.join(", "),
      promptStyle: blueprint.structure.promptStyle.join(", "),
      tone: blueprint.structure.tone.join(", "),
      body: [
        `Vocabulary: ${blueprint.content.vocabulary.join(", ") || "None"}`,
        `Teacher Moves: ${blueprint.structure.teacherMoves.join(", ") || "None"}`,
        `Prompts: ${blueprint.structure.promptStyle.join(", ") || "None"}`,
      ],
    },
  ]
}

function normalizeSlideKind(value: string): SlideKind {
  const lower = value.toLowerCase()

  if (lower.includes("objective")) return "objective"
  if (lower.includes("opening")) return "opening"
  if (lower.includes("teach")) return "teach"
  if (lower.includes("guided")) return "guided_practice"
  if (lower.includes("independent")) return "independent_practice"
  if (lower.includes("center")) return "centers"
  if (lower.includes("closure") || lower.includes("close")) return "closure"

  return "guided_practice"
}

function inferSlideAction(shellLabel: string, kind: SlideKind): SlideAction {
  const lower = shellLabel.toLowerCase()

  if (kind === "objective" || kind === "teaching_notes") {
    return "create_new"
  }

  if (lower.includes("formative") || lower.includes("check")) {
    return "create_new"
  }

  if (
    kind === "opening" ||
    kind === "teach" ||
    kind === "guided_practice" ||
    kind === "independent_practice" ||
    kind === "closure"
  ) {
    return "adapt"
  }

  return "reuse"
}

function inferPurpose(kind: SlideKind, primaryTarget: string): string {
  if (kind === "objective") {
    return "Introduce the lesson goal and frame the learning."
  }

  if (kind === "opening") {
    return "Warmly launch the lesson and establish the target."
  }

  if (kind === "teach") {
    return primaryTarget.toLowerCase() === "phonics"
      ? "Model the target phonics pattern or decoding move."
      : "Model the key comprehension or content thinking."
  }

  if (kind === "guided_practice") {
    return "Support students through scaffolded practice with teacher prompting."
  }

  if (kind === "independent_practice") {
    return "Move students into independent application of the target skill."
  }

  if (kind === "centers") {
    return "Set up rotations, expectations, and center tasks."
  }

  if (kind === "closure") {
    return "Wrap up the lesson and check understanding."
  }

  return "Support teacher delivery and implementation."
}

function getSectionForKind(kind: SlideKind, spec: LessonSpec) {
  if (kind === "opening" || kind === "teach") return spec.teach
  if (kind === "guided_practice") return spec.guidedPractice
  if (kind === "independent_practice") return spec.independentPractice
  if (kind === "centers") return spec.centers
  if (kind === "closure") return spec.closure

  return spec.guidedPractice
}

function formatTargetLabel(primary: string, secondary: string | null): string {
  return secondary ? `${primary} + ${secondary}` : primary
}

function take(items: string[], count: number, fallback: string[]): string[] {
  const cleaned = Array.from(
    new Set((items ?? []).map((item) => item.trim()).filter((item) => item.length > 0))
  ).slice(0, count)

  return cleaned.length ? cleaned : fallback
}
