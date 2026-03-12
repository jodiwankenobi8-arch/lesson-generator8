import {
  LessonBlueprint,
  LessonInputs,
  LessonPackage,
  LessonSpec,
} from "../types"
import { assembleSlideDeck } from "../slides/assembleSlideDeck"
import { resolveTemplateShell } from "../shared/resolveTemplateShell"

export function buildLessonPackage(
  inputs: LessonInputs,
  blueprint: LessonBlueprint,
  spec: LessonSpec
): LessonPackage {
  const target = blueprint.content.target
  const primary = target.primary.toLowerCase()
  const isFullMixed = target.isMixedTarget && target.recommendedMode === "full"

  const targetLabel = formatTargetLabel(target.primary, target.secondary)
  const vocabulary = take(blueprint.content.vocabulary, 5, ["key vocabulary"])
  const texts = take(blueprint.content.texts, 3, ["teacher-provided text"])
  const wordLists = take(blueprint.content.wordLists, 6, ["teacher-selected examples"])

  const shell = resolveTemplateShell(blueprint, {
    lessonSegmentsCount: 8,
    timingCount: 8,
    teacherMovesCount: 5,
    promptStyleCount: 5,
    toneCount: 3,
  })

  return {
    slides: assembleSlideDeck(blueprint, spec),
    lessonPlan: buildLessonPlan(inputs, blueprint, spec, targetLabel, shell),
    centers: spec.centers.steps,
    rotationPlan: buildRotationPlan(shell.lessonSegments, shell.timing),
    interventions: buildInterventions(primary, isFullMixed, vocabulary, wordLists, texts),
    exports: buildExports(primary, isFullMixed),
  }
}

function buildLessonPlan(
  inputs: LessonInputs,
  blueprint: LessonBlueprint,
  spec: LessonSpec,
  targetLabel: string,
  shell: ReturnType<typeof resolveTemplateShell>
): string {
  const sections = [
    "LESSON OVERVIEW",
    `Grade: ${inputs.grade || "TBD"}`,
    `Subject: ${inputs.subject || "TBD"}`,
    `Standard(s): ${blueprint.content.standards.join(", ") || "TBD"}`,
    `Skill: ${inputs.skill || "TBD"}`,
    `Topic: ${inputs.topic || "TBD"}`,
    `Duration: ${inputs.duration || "TBD"}`,
    "",
    "TARGET SUMMARY",
    `Primary Target: ${blueprint.content.target.primary}`,
    `Secondary Target: ${blueprint.content.target.secondary || "None"}`,
    `Mixed Target: ${blueprint.content.target.isMixedTarget ? "Yes" : "No"}`,
    `Selected Mode: ${blueprint.content.target.recommendedMode}`,
    `Combined Target Label: ${targetLabel}`,
    "",
    "CONTENT RESOURCES",
    `Vocabulary: ${blueprint.content.vocabulary.join(", ") || "None"}`,
    `Word / Practice Items: ${blueprint.content.wordLists.join(", ") || "None"}`,
    `Texts: ${blueprint.content.texts.join(", ") || "None"}`,
    `Practice Ideas: ${blueprint.content.practiceIdeas.join(", ") || "None"}`,
    "",
    "EXEMPLAR PRESENTATION CUES",
    `Lesson Flow: ${shell.lessonSegments.join(" -> ")}`,
    `Slide Shell: ${shell.slideShell.join(" -> ")}`,
    `Timing: ${shell.timing.join(" | ")}`,
    `Teacher Moves: ${shell.teacherMoves.join(", ")}`,
    `Prompt Style: ${shell.promptStyle.join(", ")}`,
    `Tone: ${shell.tone.join(", ")}`,
    "",
    formatSection("TEACH", spec.teach.steps),
    "",
    formatSection("GUIDED PRACTICE", spec.guidedPractice.steps),
    "",
    formatSection("INDEPENDENT PRACTICE", spec.independentPractice.steps),
    "",
    formatSection("CENTERS", spec.centers.steps),
    "",
    formatSection("CLOSURE", spec.closure.steps),
  ]

  return sections.join("`n")
}

function buildRotationPlan(lessonSegments: string[], timing: string[]): string {
  if (lessonSegments.length === 0) {
    return "Opening -> Practice -> Closure"
  }

  return lessonSegments
    .map((segment, index) => {
      const timeBlock = timing[index] ?? "Flexible timing"
      return `${segment} (${timeBlock})`
    })
    .join(" -> ")
}

function buildInterventions(
  primary: string,
  isFullMixed: boolean,
  vocabulary: string[],
  wordLists: string[],
  texts: string[]
): string[] {
  if (isFullMixed) {
    return [
      "Reteach the foundational skill in a small group before returning to the full task.",
      `Use a reduced word set and guided text support: ${wordLists.slice(0, 3).join(", ")} / ${texts.slice(0, 1).join(", ")}.`,
      `Preteach critical vocabulary before independent work: ${vocabulary.slice(0, 3).join(", ")}.`,
    ]
  }

  if (primary === "phonics") {
    return [
      "Provide additional teacher modeling with a smaller set of target words.",
      `Use repeated decoding and sorting with: ${wordLists.slice(0, 4).join(", ")}.`,
      `Review the key language of the pattern or sound: ${vocabulary.slice(0, 3).join(", ")}.`,
    ]
  }

  if (primary === "comprehension") {
    return [
      "Provide guided rereading and teacher prompting before independent response.",
      `Use a shortened text chunk or supported passage: ${texts.slice(0, 2).join(", ")}.`,
      `Preteach and revisit comprehension vocabulary: ${vocabulary.slice(0, 3).join(", ")}.`,
    ]
  }

  return [
    "Provide reteach with teacher modeling.",
    "Reduce task complexity and increase guided support.",
    `Support key vocabulary during practice: ${vocabulary.slice(0, 2).join(", ")}.`,
  ]
}

function buildExports(primary: string, isFullMixed: boolean): string[] {
  if (isFullMixed) {
    return [
      "Slides PDF",
      "Two-part lesson plan",
      "Center directions",
      "Reteach support sheet",
    ]
  }

  if (primary === "phonics") {
    return [
      "Slides PDF",
      "Printable lesson plan",
      "Word work directions",
      "Phonics practice sheet",
    ]
  }

  if (primary === "comprehension") {
    return [
      "Slides PDF",
      "Printable lesson plan",
      "Response directions",
      "Comprehension task sheet",
    ]
  }

  return ["Slides PDF", "Printable lesson plan", "Center directions"]
}

function formatTargetLabel(primary: string, secondary: string | null): string {
  return secondary ? `${primary} + ${secondary}` : primary
}

function formatSection(title: string, steps: string[]): string {
  return [title, ...steps.map((step, index) => `${index + 1}. ${step}`)].join("`n")
}

function take(items: string[], count: number, fallback: string[]): string[] {
  const cleaned = Array.from(
    new Set(items.map((item) => item.trim()).filter((item) => item.length > 0))
  ).slice(0, count)

  return cleaned.length ? cleaned : fallback
}
