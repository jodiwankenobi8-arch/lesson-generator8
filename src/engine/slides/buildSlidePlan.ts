import { LessonBlueprint, LessonSpec } from "../types"
import { getNormalizedBlueprintValues } from "../shared/teacherFacingContent"
import { resolveTemplateShell } from "../shared/resolveTemplateShell"
import { SlideAction, SlideKind, SlideOutline } from "./slideTypes"

export function buildSlidePlan(
  blueprint: LessonBlueprint,
  spec: LessonSpec
): SlideOutline[] {
  const resolvedShell = resolveTemplateShell(blueprint, {
    scope: "lesson_slides",
    lessonSegmentsCount: 8,
    slideShellCount: 8,
    teacherMovesCount: 5,
    promptStyleCount: 5,
    toneCount: 3,
  })

  const segmentOrder = resolvedShell.lessonSegments
  const slideShell = resolvedShell.slideShell
  const timingShell = resolvedShell.timing
  const teacherMoveShell = resolvedShell.teacherMoves
  const promptShell = resolvedShell.promptStyle
  const toneShell = resolvedShell.tone
  const content = buildSlideContentView(blueprint)

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
        content,
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
        `Standards: ${content.standard.join(", ") || "TBD"}`,
        `Focus Vocabulary: ${content.vocabulary.slice(0, 3).join(", ") || "TBD"}`,
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
        `Vocabulary: ${content.vocabulary.join(", ") || "None"}`,
        `Teacher Moves: ${blueprint.structure.teacherMoves.join(", ") || "None"}`,
        `Prompts: ${blueprint.structure.promptStyle.join(", ") || "None"}`,
        `Source Balance: ${blueprint.sourceReadiness.overall}`,
      ]),
    },
  ]
}

type SlideValueKind =
  | "standard"
  | "vocabulary"
  | "wordList"
  | "text"
  | "practice"

type SlideContentView = Record<SlideValueKind, string[]>

function buildSlideContentView(blueprint: LessonBlueprint): SlideContentView {
  return {
    standard: getSlideValues(blueprint, "standard"),
    vocabulary: getSlideValues(blueprint, "vocabulary"),
    wordList: getSlideValues(blueprint, "wordList"),
    text: getSlideValues(blueprint, "text"),
    practice: getSlideValues(blueprint, "practice"),
  }
}

function getSlideValues(blueprint: LessonBlueprint, kind: SlideValueKind): string[] {
  return sanitizeSlideValues(getNormalizedBlueprintValues(blueprint, kind), kind)
}

function sanitizeSlideValues(values: string[], kind: SlideValueKind): string[] {
  return Array.from(
    new Set(
      (values ?? [])
        .map((value) => normalizeSlideValue(value))
        .filter((value) => value.length > 0)
        .filter((value) => !isWeakSlideValue(value, kind))
    )
  )
}

function normalizeSlideValue(value: string): string {
  return String(value ?? "")
    .replace(/^(hb\s+)?florida\s+b\.?e\.?s\.?t\.?\s+standards?:?\s*/i, "")
    .replace(/^standards?:?\s*/i, "")
    .replace(/^benchmarks?:?\s*/i, "")
    .replace(/^[a-z]\s+(?=[A-Z]{2,}(?:\.[A-Za-z0-9]+){2,}\s*:)/, "")
    .replace(/\s+/g, " ")
    .trim()
}

function isWeakSlideValue(value: string, kind: SlideValueKind): boolean {
  const lower = value.toLowerCase()
  const wordCount = value.split(/\s+/).length

  if (
    lower.includes("teacher edition") ||
    lower.includes("student edition") ||
    lower.includes("copyright") ||
    lower.includes("all rights reserved") ||
    lower.includes("printed in") ||
    lower.includes("phonics) edition)") ||
    lower.includes("ses tpe") ||
    lower.includes("metic parses") ||
    lower.includes("letter-sound motions)") ||
    lower.includes("story visuals, and")
  ) {
    return true
  }

  if (kind === "standard") {
    return lower === "standard" || lower === "standards"
  }

  if (kind === "vocabulary") {
    return wordCount > 10
  }

  if (kind === "wordList") {
    return wordCount > 8
  }

  return false
}

function buildSlideBody(args: {
  kind: SlideKind
  blueprint: LessonBlueprint
  spec: LessonSpec
  sectionSteps: string[]
  content: SlideContentView
}): string[] {
  const { kind, blueprint, spec, sectionSteps, content } = args
  const primary = blueprint.content.target.primary.toLowerCase()
  const isMixed = blueprint.content.target.isMixedTarget

  if (kind === "opening") {
    return compact([
      `Lesson Focus: ${formatTargetLabel(blueprint.content.target.primary, blueprint.content.target.secondary)}`,
      `Standards: ${content.standard.slice(0, 2).join(", ")}`,
      `Vocabulary: ${content.vocabulary.slice(0, 3).join(", ")}`,
      ...take(sectionSteps, 2, []),
    ])
  }

  if (kind === "teach") {
    return compact([
      primary === "phonics"
        ? `Model Words: ${content.wordList.slice(0, 4).join(", ")}`
        : `Model Text: ${content.text.slice(0, 1).join(", ")}`,
      `Teacher Move Focus: ${blueprint.structure.teacherMoves.slice(0, 2).join(", ")}`,
      ...take(sectionSteps, isMixed ? 3 : 2, []),
    ])
  }

  if (kind === "guided_practice") {
    return compact([
      `Practice Anchor: ${content.practice.slice(0, 2).join(", ")}`,
      primary === "phonics"
        ? `Word Support: ${content.wordList.slice(0, 3).join(", ")}`
        : `Text Support: ${content.text.slice(0, 1).join(", ")}`,
      ...take(sectionSteps, isMixed ? 3 : 2, []),
    ])
  }

  if (kind === "independent_practice") {
    return compact([
      `Independent Task: ${content.practice.slice(0, 2).join(", ")}`,
      primary === "phonics"
        ? `Students Apply: ${content.wordList.slice(0, 3).join(", ")}`
        : `Students Reference: ${content.text.slice(0, 1).join(", ")}`,
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
        ? `Review Words: ${content.wordList.slice(0, 3).join(", ")}`
        : `Review Vocabulary: ${content.vocabulary.slice(0, 3).join(", ")}`,
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

function take(items: string[], count: number, fallback: string[]): string[] {
  const cleaned = Array.from(
    new Set((items ?? []).map((item) => item.trim()).filter((item) => item.length > 0))
  ).slice(0, count)

  return cleaned.length ? cleaned : fallback
}

function compact(items: string[]): string[] {
  return Array.from(new Set(items.map((item) => item.trim()).filter((item) => item.length > 0)))
}



