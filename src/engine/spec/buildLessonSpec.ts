import {
  LessonBlueprint,
  LessonPlanIdea,
  LessonPlanningIdeas,
  LessonSpec,
  LessonSpecSection,
} from "../types"
import { resolveTemplateShell } from "../shared/resolveTemplateShell"

type LessonSpecSectionKey =
  | "teach"
  | "guidedPractice"
  | "independentPractice"
  | "centers"
  | "closure"

type LessonSpecContext = {
  target: LessonBlueprint["content"]["target"]
  primary: string
  isFullMixed: boolean
  vocabulary: string[]
  wordList: string[]
  texts: string[]
  practiceIdeas: string[]
  standards: string[]
  shell: ReturnType<typeof resolveTemplateShell>
  openingLine: string
  modeledResources: string
  guidedTaskLine: string
  independentTaskLine: string
  closureLine: string
  flowLine: string
  slideShellLine: string
  timingLine: string
  teacherMoveLine: string
  promptLine: string
  toneLine: string
  teachPlanLines: string[]
  guidedPlanLines: string[]
  independentPlanLines: string[]
  closurePlanLines: string[]
  centerPlanLines: string[]
  smallGroupPlanLines: string[]
  interventionPlanLines: string[]
  formativePlanLines: string[]
}

export function buildLessonSpec(
  blueprint: LessonBlueprint,
  planningIdeas?: LessonPlanningIdeas
): LessonSpec {
  const context = buildLessonSpecContext(blueprint, planningIdeas)
  const { primary, isFullMixed } = context

  if (isFullMixed) {
    return {
      teach: createSection("Teach", buildMixedTeachSteps(context)),
      guidedPractice: createSection(
        "Guided Practice",
        buildMixedGuidedPracticeSteps(context)
      ),
      independentPractice: createSection(
        "Independent Practice",
        buildMixedIndependentPracticeSteps(context)
      ),
      centers: createSection("Centers", buildMixedCentersSteps(context)),
      closure: createSection("Closure", buildMixedClosureSteps(context)),
    }
  }

  if (primary === "phonics") {
    return {
      teach: createSection("Teach", buildPhonicsTeachSteps(context)),
      guidedPractice: createSection(
        "Guided Practice",
        buildPhonicsGuidedPracticeSteps(context)
      ),
      independentPractice: createSection(
        "Independent Practice",
        buildPhonicsIndependentPracticeSteps(context)
      ),
      centers: createSection("Centers", buildPhonicsCentersSteps(context)),
      closure: createSection("Closure", buildPhonicsClosureSteps(context)),
    }
  }

  if (primary === "comprehension") {
    return {
      teach: createSection("Teach", buildComprehensionTeachSteps(context)),
      guidedPractice: createSection(
        "Guided Practice",
        buildComprehensionGuidedPracticeSteps(context)
      ),
      independentPractice: createSection(
        "Independent Practice",
        buildComprehensionIndependentPracticeSteps(context)
      ),
      centers: createSection("Centers", buildComprehensionCentersSteps(context)),
      closure: createSection("Closure", buildComprehensionClosureSteps(context)),
    }
  }

  return {
    teach: createSection("Teach", buildGenericTeachSteps(context)),
    guidedPractice: createSection(
      "Guided Practice",
      buildGenericGuidedPracticeSteps(context)
    ),
    independentPractice: createSection(
      "Independent Practice",
      buildGenericIndependentPracticeSteps(context)
    ),
    centers: createSection("Centers", buildGenericCentersSteps(context)),
    closure: createSection("Closure", buildGenericClosureSteps(context)),
  }
}

function buildLessonSpecContext(
  blueprint: LessonBlueprint,
  planningIdeas?: LessonPlanningIdeas
): LessonSpecContext {
  const target = blueprint.content.target
  const primary = target.primary.toLowerCase()
  const isFullMixed = target.isMixedTarget && target.recommendedMode === "full"

  const vocabulary = take(blueprint.content.vocabulary, 4, ["key vocabulary"])
  const wordList = take(blueprint.content.wordLists, 5, ["teacher-selected examples"])
  const texts = take(blueprint.content.texts, 2, ["teacher-provided text"])
  const practiceIdeas = take(blueprint.content.practiceIdeas, 4, ["guided practice"])
  const standards = take(blueprint.content.standards, 2, ["teacher-selected standard"])

  const shell = resolveTemplateShell(blueprint, {
    lessonSegmentsCount: 6,
    teacherMovesCount: 4,
    promptStyleCount: 4,
    toneCount: 2,
  })

  const openingLine = buildOpeningLine(target.primary, target.secondary, standards, shell.tone)
  const modeledResources = buildModeledResources(primary, wordList, texts)
  const guidedTaskLine = buildGuidedTaskLine(primary, practiceIdeas, standards)
  const independentTaskLine = buildIndependentTaskLine(primary, practiceIdeas, wordList, texts)
  const closureLine = buildClosureLine(primary, vocabulary, wordList)
  const flowLine = `Follow the exemplar lesson flow: ${shell.lessonSegments.join(" -> ")}.`
  const slideShellLine = `Preserve the exemplar slide shell: ${shell.slideShell.join(" -> ")}.`
  const timingLine = `Keep pacing aligned to: ${shell.timing.join(" | ")}.`
  const teacherMoveLine = `Use exemplar-style teacher moves such as: ${shell.teacherMoves.join(", ")}.`
  const promptLine = `Use prompts and response frames such as: ${shell.promptStyle.join(", ")}.`
  const toneLine = `Keep the delivery tone aligned to: ${shell.tone.join(", ")}.`

  return {
    target,
    primary,
    isFullMixed,
    vocabulary,
    wordList,
    texts,
    practiceIdeas,
    standards,
    shell,
    openingLine,
    modeledResources,
    guidedTaskLine,
    independentTaskLine,
    closureLine,
    flowLine,
    slideShellLine,
    timingLine,
    teacherMoveLine,
    promptLine,
    toneLine,
    teachPlanLines: planningLines(planningIdeas, "teach"),
    guidedPlanLines: planningLines(planningIdeas, "guided_practice"),
    independentPlanLines: planningLines(planningIdeas, "independent_practice"),
    closurePlanLines: planningLines(planningIdeas, "closure"),
    centerPlanLines: ideaLines(planningIdeas?.centerIdeas),
    smallGroupPlanLines: ideaLines(planningIdeas?.smallGroupIdeas),
    interventionPlanLines: ideaLines(planningIdeas?.interventionIdeas),
    formativePlanLines: ideaLines(planningIdeas?.formativeAssessmentIdeas),
  }
}

function createSection(title: string, steps: string[]): LessonSpecSection {
  return {
    title,
    steps: compactSteps(steps),
  }
}

function buildMixedTeachSteps(context: LessonSpecContext): string[] {
  return [
    context.openingLine,
    `Model the foundational skill first using: ${context.wordList.join(", ")}.`,
    `Then connect students to meaning and text work using: ${context.texts.join(", ")}.`,
    `Preteach and revisit vocabulary across both parts: ${context.vocabulary.join(", ")}.`,
    ...context.teachPlanLines,
    context.teacherMoveLine,
    context.promptLine,
    context.flowLine,
    context.slideShellLine,
  ]
}

function buildMixedGuidedPracticeSteps(context: LessonSpecContext): string[] {
  return [
    `Guide students through two curriculum-aligned practice blocks: ${context.practiceIdeas.join(", ")}.`,
    `Use modeled examples and text support during teacher guidance: ${context.wordList.join(", ")}; ${context.texts.join(", ")}.`,
    `Keep support anchored to the standards: ${context.standards.join(", ")}.`,
    ...context.guidedPlanLines,
    ...takeLines(context.formativePlanLines, 1),
    context.promptLine,
    context.timingLine,
  ]
}

function buildMixedIndependentPracticeSteps(context: LessonSpecContext): string[] {
  return [
    `Students complete two aligned independent tasks using: ${context.practiceIdeas.slice(0, 2).join(", ")}.`,
    `Require students to apply both lesson resources and text support: ${context.wordList.join(", ")} / ${context.texts.join(", ")}.`,
    ...context.independentPlanLines,
    "Check for transfer from teacher-supported work to student-owned work in both lesson parts.",
    ...takeLines(context.formativePlanLines, 1, 1),
    context.toneLine,
  ]
}

function buildMixedCentersSteps(context: LessonSpecContext): string[] {
  return [
    ...context.centerPlanLines,
    ...takeLines(context.smallGroupPlanLines, 1),
    ...takeLines(context.interventionPlanLines, 1),
    "Phonics / word work center",
    "Reading or response center",
    "Teacher-led support / reteach center",
  ]
}

function buildMixedClosureSteps(context: LessonSpecContext): string[] {
  return [
    "Review what students learned in both parts of the lesson.",
    ...context.closurePlanLines,
    ...takeLines(context.formativePlanLines, 1),
    context.flowLine,
    context.timingLine,
    context.toneLine,
    "End with a quick check for understanding and identify students needing reteach.",
  ]
}

function buildPhonicsTeachSteps(context: LessonSpecContext): string[] {
  return [
    context.openingLine,
    `Model the phonics focus with these curriculum examples: ${context.wordList.join(", ")}.`,
    `Teach and reinforce the key language students will use: ${context.vocabulary.join(", ")}.`,
    "Think aloud while blending, reading, sorting, or encoding target words.",
    ...context.teachPlanLines,
    context.teacherMoveLine,
    context.flowLine,
    context.slideShellLine,
  ]
}

function buildPhonicsGuidedPracticeSteps(context: LessonSpecContext): string[] {
  return [
    context.guidedTaskLine,
    `Use the lesson word list during support: ${context.wordList.join(", ")}.`,
    "Require students to explain or show the target pattern with teacher guidance.",
    ...context.guidedPlanLines,
    ...takeLines(context.formativePlanLines, 1),
    context.promptLine,
    context.timingLine,
  ]
}

function buildPhonicsIndependentPracticeSteps(context: LessonSpecContext): string[] {
  return [
    context.independentTaskLine,
    `Use these words or examples during practice: ${context.wordList.join(", ")}.`,
    ...context.independentPlanLines,
    ...takeLines(context.formativePlanLines, 1, 1),
    "Check for accurate decoding, sorting, encoding, and pattern application.",
    context.toneLine,
  ]
}

function buildPhonicsCentersSteps(context: LessonSpecContext): string[] {
  return [
    ...context.centerPlanLines,
    ...takeLines(context.smallGroupPlanLines, 1),
    ...takeLines(context.interventionPlanLines, 1),
    "Word work / phonics center",
    "Partner reading or decoding center",
    "Teacher table for intervention or extension",
  ]
}

function buildPhonicsClosureSteps(context: LessonSpecContext): string[] {
  return [
    "Review the target sound, pattern, or decoding skill.",
    context.closureLine,
    ...context.closurePlanLines,
    context.promptLine,
    "End with a quick oral read, sort, or exit check.",
  ]
}

function buildComprehensionTeachSteps(context: LessonSpecContext): string[] {
  return [
    context.openingLine,
    `Model comprehension thinking with these lesson texts: ${context.texts.join(", ")}.`,
    `Preteach or revisit the lesson vocabulary: ${context.vocabulary.join(", ")}.`,
    "Demonstrate how students should discuss, answer, explain, or cite their thinking from the text.",
    ...context.teachPlanLines,
    context.teacherMoveLine,
    context.flowLine,
    context.slideShellLine,
  ]
}

function buildComprehensionGuidedPracticeSteps(context: LessonSpecContext): string[] {
  return [
    context.guidedTaskLine,
    `Use the lesson text and prompts during support: ${context.texts.join(", ")}.`,
    `Anchor the work to the lesson standard: ${context.standards.join(", ")}.`,
    ...context.guidedPlanLines,
    ...takeLines(context.formativePlanLines, 1),
    context.promptLine,
    context.timingLine,
  ]
}

function buildComprehensionIndependentPracticeSteps(
  context: LessonSpecContext
): string[] {
  return [
    context.independentTaskLine,
    `Use these texts or prompts during student work: ${context.texts.join(", ")}.`,
    ...context.independentPlanLines,
    ...takeLines(context.formativePlanLines, 1, 1),
    "Check for understanding, accuracy, and evidence of reasoning.",
    context.toneLine,
  ]
}

function buildComprehensionCentersSteps(context: LessonSpecContext): string[] {
  return [
    ...context.centerPlanLines,
    ...takeLines(context.smallGroupPlanLines, 1),
    ...takeLines(context.interventionPlanLines, 1),
    "Reading response center",
    "Partner discussion / retell center",
    "Teacher table for guided comprehension support",
  ]
}

function buildComprehensionClosureSteps(context: LessonSpecContext): string[] {
  return [
    "Review the comprehension objective and key takeaway from the text.",
    context.closureLine,
    ...context.closurePlanLines,
    context.promptLine,
    "Close with a brief discussion, written response, or oral recap.",
  ]
}

function buildGenericTeachSteps(context: LessonSpecContext): string[] {
  return [
    context.openingLine,
    `Model the lesson content using: ${context.modeledResources}.`,
    `Teach the lesson vocabulary and focus language: ${context.vocabulary.join(", ")}.`,
    ...context.teachPlanLines,
    context.teacherMoveLine,
    context.flowLine,
    context.slideShellLine,
  ]
}

function buildGenericGuidedPracticeSteps(context: LessonSpecContext): string[] {
  return [
    context.guidedTaskLine,
    `Reference standards during support: ${context.standards.join(", ")}.`,
    ...context.guidedPlanLines,
    ...takeLines(context.formativePlanLines, 1),
    context.promptLine,
    context.timingLine,
  ]
}

function buildGenericIndependentPracticeSteps(context: LessonSpecContext): string[] {
  return [
    context.independentTaskLine,
    `Use these lesson resources: ${context.wordList.join(", ")} / ${context.texts.join(", ")}.`,
    ...context.independentPlanLines,
    ...takeLines(context.formativePlanLines, 1, 1),
    context.toneLine,
  ]
}

function buildGenericCentersSteps(context: LessonSpecContext): string[] {
  return [
    ...context.centerPlanLines,
    ...takeLines(context.smallGroupPlanLines, 1),
    ...takeLines(context.interventionPlanLines, 1),
    "Independent practice center",
    "Partner application center",
    "Teacher support center",
  ]
}

function buildGenericClosureSteps(context: LessonSpecContext): string[] {
  return [
    "Review the lesson objective.",
    `Revisit the lesson flow: ${context.shell.lessonSegments.join(" -> ")}.`,
    context.closureLine,
    ...context.closurePlanLines,
    context.promptLine,
  ]
}

function planningLines(
  planningIdeas: LessonPlanningIdeas | undefined,
  section: "teach" | "guided_practice" | "independent_practice" | "closure"
): string[] {
  const match = planningIdeas?.lessonPlanSections.find((item) => item.section === section)

  if (!match) {
    return []
  }

  return match.ideas.map((idea) => formatPlanningIdea(idea))
}

function ideaLines(ideas: LessonPlanIdea[] | undefined): string[] {
  if (!ideas?.length) {
    return []
  }

  return ideas.map((idea) => formatPlanningIdea(idea))
}

function takeLines(lines: string[], count: number, start = 0): string[] {
  return lines.slice(start, start + count)
}

function formatPlanningIdea(idea: LessonPlanIdea): string {
  return `${idea.title}: ${idea.description}`
}

function compactSteps(steps: string[]): string[] {
  return Array.from(new Set(steps.map((step) => step.trim()).filter((step) => step.length > 0)))
}

function buildOpeningLine(
  primary: string,
  secondary: string | null,
  standards: string[],
  tone: string[]
): string {
  const targetLabel = formatTargetLabel(primary, secondary)
  return `Introduce the lesson target: ${targetLabel}. Connect the work to: ${standards.join(", ")}. Set the tone with: ${tone.join(", ")}.`
}

function buildModeledResources(primary: string, wordList: string[], texts: string[]): string {
  if (primary === "phonics") {
    return wordList.join(", ")
  }

  if (primary === "comprehension") {
    return texts.join(", ")
  }

  return `${wordList.join(", ")}; ${texts.join(", ")}`
}

function buildGuidedTaskLine(
  primary: string,
  practiceIdeas: string[],
  standards: string[]
): string {
  if (primary === "phonics") {
    return `Guide practice with these curriculum-aligned phonics tasks: ${practiceIdeas.join(", ")}. Keep practice aligned to: ${standards.join(", ")}.`
  }

  if (primary === "comprehension") {
    return `Guide students through these curriculum-based comprehension tasks: ${practiceIdeas.join(", ")}. Keep the work aligned to: ${standards.join(", ")}.`
  }

  return `Guide students through these lesson tasks: ${practiceIdeas.join(", ")}. Keep support aligned to: ${standards.join(", ")}.`
}

function buildIndependentTaskLine(
  primary: string,
  practiceIdeas: string[],
  wordList: string[],
  texts: string[]
): string {
  if (primary === "phonics") {
    return `Students complete independent phonics work using: ${practiceIdeas.slice(0, 2).join(", ")}.`
  }

  if (primary === "comprehension") {
    return `Students complete an independent response task using: ${practiceIdeas.slice(0, 2).join(", ")}.`
  }

  return `Students complete independent practice using: ${practiceIdeas.slice(0, 2).join(", ")}. Reference ${wordList.join(", ")} and ${texts.join(", ")} as needed.`
}

function buildClosureLine(primary: string, vocabulary: string[], wordList: string[]): string {
  if (primary === "phonics") {
    return `Revisit the strongest word examples: ${wordList.slice(0, 3).join(", ")}.`
  }

  return `Reinforce key lesson vocabulary: ${vocabulary.slice(0, 3).join(", ")}.`
}

function formatTargetLabel(primary: string, secondary: string | null): string {
  return secondary ? `${primary} + ${secondary}` : primary
}

function take(items: string[], count: number, fallback: string[]): string[] {
  const cleaned = Array.from(
    new Set(items.map((item) => item.trim()).filter((item) => item.length > 0))
  ).slice(0, count)

  return cleaned.length ? cleaned : fallback
}
