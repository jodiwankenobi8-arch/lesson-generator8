import { LessonBlueprint, LessonSpec } from "../types"
import { SlideAction, SlideKind, SlideOutline } from "./slideTypes"

export function buildSlidePlan(
  blueprint: LessonBlueprint,
  spec: LessonSpec
): SlideOutline[] {
  const shell = blueprint.structure.templateShell
  const rawSegmentOrder = take(
    shell.segmentOrder,
    8,
    ["Teach", "Guided Practice", "Independent Practice", "Closure"]
  )
  const rawSlideShell = take(shell.slideShell, Math.max(rawSegmentOrder.length, 3), rawSegmentOrder)

  const orderedSlides = buildOrderedInstructionalShell(rawSegmentOrder, rawSlideShell)
  const segmentOrder = orderedSlides.map((slide) => slide.segmentLabel)
  const slideShell = orderedSlides.map((slide) => slide.shellLabel)
  const timingShell = orderedSlides.map((slide) => inferTimingForKind(slide.kind))
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
      purpose: inferPurpose(kind, blueprint.content.target.primary, blueprint.content.target.isMixedTarget),
      timing: timingShell[index] ?? "Flexible timing",
      teacherMove: teacherMoveShell[index % teacherMoveShell.length] ?? "teacher guidance",
      promptStyle: promptShell[index % promptShell.length] ?? "teacher prompt",
      tone: toneShell[index % toneShell.length] ?? "clear instructional tone",
      body: buildSlideBody({
        kind,
        blueprint,
        spec,
        sectionSteps: section.steps,
      }),
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
      body: compact([
        `Target: ${formatTargetLabel(blueprint.content.target.primary, blueprint.content.target.secondary)}`,
        `Standards: ${blueprint.content.standards.join(", ") || "TBD"}`,
        `Focus Vocabulary: ${blueprint.content.vocabulary.slice(0, 3).join(", ") || "TBD"}`,
      ]),
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
      body: compact([
        `Vocabulary: ${blueprint.content.vocabulary.join(", ") || "None"}`,
        `Teacher Moves: ${blueprint.structure.teacherMoves.join(", ") || "None"}`,
        `Prompts: ${blueprint.structure.promptStyle.join(", ") || "None"}`,
        `Source Balance: ${blueprint.sourceReadiness.overall}`,
      ]),
    },
  ]
}

function buildSlideBody(args: {
  kind: SlideKind
  blueprint: LessonBlueprint
  spec: LessonSpec
  sectionSteps: string[]
}): string[] {
  const { kind, blueprint, spec, sectionSteps } = args
  const primary = blueprint.content.target.primary.toLowerCase()
  const isMixed = blueprint.content.target.isMixedTarget

  if (kind === "opening") {
    return compact([
      `Lesson Focus: ${formatTargetLabel(blueprint.content.target.primary, blueprint.content.target.secondary)}`,
      `Standards: ${blueprint.content.standards.slice(0, 2).join(", ")}`,
      `Vocabulary: ${blueprint.content.vocabulary.slice(0, 3).join(", ")}`,
      ...take(sectionSteps, 2, []),
    ])
  }

  if (kind === "teach") {
    return compact([
      primary === "phonics"
        ? `Model Words: ${blueprint.content.wordLists.slice(0, 4).join(", ")}`
        : `Model Text: ${blueprint.content.texts.slice(0, 1).join(", ")}`,
      `Teacher Move Focus: ${blueprint.structure.teacherMoves.slice(0, 2).join(", ")}`,
      ...take(sectionSteps, isMixed ? 3 : 2, []),
    ])
  }

  if (kind === "guided_practice") {
    return compact([
      `Practice Anchor: ${blueprint.content.practiceIdeas.slice(0, 2).join(", ")}`,
      primary === "phonics"
        ? `Word Support: ${blueprint.content.wordLists.slice(0, 3).join(", ")}`
        : `Text Support: ${blueprint.content.texts.slice(0, 1).join(", ")}`,
      ...take(sectionSteps, isMixed ? 3 : 2, []),
    ])
  }

  if (kind === "independent_practice") {
    return compact([
      `Independent Task: ${blueprint.content.practiceIdeas.slice(0, 2).join(", ")}`,
      primary === "phonics"
        ? `Students Apply: ${blueprint.content.wordLists.slice(0, 3).join(", ")}`
        : `Students Reference: ${blueprint.content.texts.slice(0, 1).join(", ")}`,
      ...take(sectionSteps, 2, []),
    ])
  }

  if (kind === "centers") {
    return compact([
      ...take(spec.centers.steps, 3, []),
    ])
  }

  if (kind === "closure") {
    return compact([
      primary === "phonics"
        ? `Review Words: ${blueprint.content.wordLists.slice(0, 3).join(", ")}`
        : `Review Vocabulary: ${blueprint.content.vocabulary.slice(0, 3).join(", ")}`,
      isMixed
        ? "Reconnect both lesson parts before the final check."
        : "Close with a short understanding check.",
      ...take(sectionSteps, 2, []),
    ])
  }

  return compact(take(sectionSteps, 3, []))
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

function inferPurpose(kind: SlideKind, primaryTarget: string, isMixedTarget: boolean): string {
  if (kind === "objective") {
    return "Introduce the lesson goal and frame the learning."
  }

  if (kind === "opening") {
    return isMixedTarget
      ? "Launch the two-part lesson and preview both focuses."
      : "Warmly launch the lesson and establish the target."
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
    return isMixedTarget
      ? "Wrap up both lesson parts and check whether students connected them."
      : "Wrap up the lesson and check understanding."
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

function buildOrderedInstructionalShell(
  segmentOrder: string[],
  slideShell: string[]
): Array<{ segmentLabel: string; shellLabel: string; kind: SlideKind }> {
  const maxLength = Math.max(segmentOrder.length, slideShell.length)
  const rows = Array.from({ length: maxLength }, (_, index) => {
    const segmentLabel = segmentOrder[index] ?? slideShell[index] ?? "Guided Practice"
    const shellLabel = slideShell[index] ?? segmentLabel
    const kind = normalizeSlideKind(segmentLabel)

    return {
      segmentLabel,
      shellLabel,
      kind,
      rank: getInstructionalRank(kind),
      index,
    }
  })

  rows.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank
    return a.index - b.index
  })

  return rows.map(({ segmentLabel, shellLabel, kind }) => ({
    segmentLabel,
    shellLabel,
    kind,
  }))
}

function getInstructionalRank(kind: SlideKind): number {
  if (kind === "opening") return 0
  if (kind === "teach") return 1
  if (kind === "guided_practice") return 2
  if (kind === "independent_practice") return 3
  if (kind === "centers") return 4
  if (kind === "closure") return 5
  return 6
}

function inferTimingForKind(kind: SlideKind): string {
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

function compact(items: string[]): string[] {
  return Array.from(new Set(items.map((item) => item.trim()).filter((item) => item.length > 0)))
}

