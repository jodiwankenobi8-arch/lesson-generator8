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
  areaKeys: string[]
  primaryArea: string
  hasFoundationalArea: boolean
  hasMeaningArea: boolean
  hasMultipleAreas: boolean
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
  const { primaryArea, hasMultipleAreas } = context

  if (hasMultipleAreas) {
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

  if (primaryArea === "foundational") {
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

  if (primaryArea === "comprehension") {
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
  const areaKeys = resolveSpecAreaKeys(blueprint)
  const hasFoundationalArea = specHasFoundationalArea(areaKeys)
  const hasMeaningArea = specHasMeaningArea(areaKeys)
  const hasMultipleAreas = specHasMultipleMeaningfulAreas(areaKeys)
  const primaryArea = selectPrimarySpecArea(areaKeys)

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

  const openingLine = buildOpeningLine(areaKeys, standards, shell.tone)
  const modeledResources = buildModeledResources(primaryArea, wordList, texts)
  const guidedTaskLine = buildGuidedTaskLine(primaryArea, practiceIdeas, standards)
  const independentTaskLine = buildIndependentTaskLine(
    primaryArea,
    practiceIdeas,
    wordList,
    texts
  )
  const closureLine = buildClosureLine(primaryArea, vocabulary, wordList)
  const flowLine = `Follow the exemplar lesson flow: ${shell.lessonSegments.join(" -> ")}.`
  const slideShellLine = `Preserve the exemplar slide shell: ${shell.slideShell.join(" -> ")}.`
  const timingLine = `Keep pacing aligned to: ${shell.timing.join(" | ")}.`
  const teacherMoveLine = `Use exemplar-style teacher moves such as: ${shell.teacherMoves.join(", ")}.`
  const promptLine = `Use prompts and response frames such as: ${shell.promptStyle.join(", ")}.`
  const toneLine = `Keep the delivery tone aligned to: ${shell.tone.join(", ")}.`

  return {
    target,
    areaKeys,
    primaryArea,
    hasFoundationalArea,
    hasMeaningArea,
    hasMultipleAreas,
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

function resolveSpecAreaKeys(blueprint: LessonBlueprint): string[] {
  const profileKeys = (
    blueprint as LessonBlueprint & {
      content?: { profile?: { dominantAreaKeys?: string[] | null } | null }
    }
  ).content?.profile?.dominantAreaKeys ?? []

  if (profileKeys.length > 0) {
    return uniqueStrings(profileKeys.flatMap((key) => normalizeSpecAreaAliases(key)))
  }

  const target = blueprint.content.target
  const targetKeys = uniqueStrings([
    ...normalizeSpecAreaAliases(target.primary),
    ...normalizeSpecAreaAliases(target.secondary ?? undefined),
  ])

  if (targetKeys.length > 0) {
    return targetKeys
  }

  if (target.isMixedTarget) {
    return ["foundational", "comprehension"]
  }

  return ["general"]
}

function normalizeSpecAreaAliases(value?: string | null): string[] {
  const normalized = (value ?? "").trim().toLowerCase()

  switch (normalized) {
    case "":
    case "mixed":
    case "general":
      return []
    case "phonological_awareness":
    case "phonemic_awareness":
    case "phonics":
    case "decoding":
    case "encoding":
    case "spelling":
    case "word_recognition":
    case "high_frequency_words":
    case "foundational_skills":
    case "foundational":
      return ["foundational"]
    case "language_comprehension":
    case "comprehension":
    case "vocabulary":
    case "oral_language":
    case "knowledge_building":
    case "writing_about_reading":
      return ["comprehension"]
    default:
      return [normalized]
  }
}

function specHasArea(areaKeys: string[], candidates: string[]): boolean {
  return areaKeys.some((key) => candidates.includes(key))
}

function specHasFoundationalArea(areaKeys: string[]): boolean {
  return specHasArea(areaKeys, ["foundational"])
}

function specHasMeaningArea(areaKeys: string[]): boolean {
  return specHasArea(areaKeys, ["comprehension", "fluency", "writing"])
}

function specHasMultipleMeaningfulAreas(areaKeys: string[]): boolean {
  return uniqueStrings(areaKeys.filter((key) => key !== "general")).length > 1
}

function selectPrimarySpecArea(areaKeys: string[]): string {
  const meaningful = uniqueStrings(areaKeys.filter((key) => key !== "general"))

  if (specHasFoundationalArea(meaningful) && !specHasMeaningArea(meaningful)) {
    return "foundational"
  }

  if (specHasMeaningArea(meaningful) && !specHasFoundationalArea(meaningful)) {
    return "comprehension"
  }

  return meaningful[0] ?? "general"
}

function formatSpecAreaKey(areaKey: string): string {
  switch (areaKey) {
    case "foundational":
      return "foundational skill"
    case "comprehension":
      return "meaning-making"
    default:
      return areaKey.replace(/_/g, " ")
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
    `Model the foundational-skill focus with these curriculum examples: ${context.wordList.join(", ")}.`,
    `Teach and reinforce the key skill language students will use: ${context.vocabulary.join(", ")}.`,
    "Think aloud while reading, sorting, encoding, or applying the target examples.",
    ...context.teachPlanLines,
    context.teacherMoveLine,
    context.flowLine,
    context.slideShellLine,
  ]
}

function buildPhonicsGuidedPracticeSteps(context: LessonSpecContext): string[] {
  return [
    context.guidedTaskLine,
    `Use the lesson examples during support: ${context.wordList.join(", ")}.`,
    "Require students to explain or show the target skill with teacher guidance.",
    ...context.guidedPlanLines,
    ...takeLines(context.formativePlanLines, 1),
    context.promptLine,
    context.timingLine,
  ]
}

function buildPhonicsIndependentPracticeSteps(context: LessonSpecContext): string[] {
  return [
    context.independentTaskLine,
    `Use these examples during practice: ${context.wordList.join(", ")}.`,
    ...context.independentPlanLines,
    ...takeLines(context.formativePlanLines, 1, 1),
    "Check for accurate reading, sorting, encoding, and skill application.",
    context.toneLine,
  ]
}

function buildPhonicsCentersSteps(context: LessonSpecContext): string[] {
  return [
    ...context.centerPlanLines,
    ...takeLines(context.smallGroupPlanLines, 1),
    ...takeLines(context.interventionPlanLines, 1),
    "Word work / foundational-skill center",
    "Partner reading or skill practice center",
    "Teacher table for intervention or extension",
  ]
}

function buildPhonicsClosureSteps(context: LessonSpecContext): string[] {
  return [
    "Review the target foundational skill or pattern.",
    context.closureLine,
    ...context.closurePlanLines,
    context.promptLine,
    "End with a quick oral read, sort, or exit check.",
  ]
}

function buildComprehensionTeachSteps(context: LessonSpecContext): string[] {
  return [
    context.openingLine,
    `Model meaning-making with these lesson texts: ${context.texts.join(", ")}.`,
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
    "Teacher table for guided meaning-making support",
  ]
}

function buildComprehensionClosureSteps(context: LessonSpecContext): string[] {
  return [
    "Review the meaning-making objective and key takeaway from the text.",
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
  areaKeys: string[],
  standards: string[],
  tone: string[]
): string {
  const targetLabel = formatTargetLabel(areaKeys)
  return `Introduce the lesson target: ${targetLabel}. Connect the work to: ${standards.join(", ")}. Set the tone with: ${tone.join(", ")}.`
}

function buildModeledResources(primaryArea: string, wordList: string[], texts: string[]): string {
  if (primaryArea === "foundational") {
    return wordList.join(", ")
  }

  if (primaryArea === "comprehension") {
    return texts.join(", ")
  }

  return `${wordList.join(", ")}; ${texts.join(", ")}`
}

function buildGuidedTaskLine(
  primaryArea: string,
  practiceIdeas: string[],
  standards: string[]
): string {
  if (primaryArea === "foundational") {
    return `Guide practice with these curriculum-aligned foundational-skill tasks: ${practiceIdeas.join(", ")}. Keep practice aligned to: ${standards.join(", ")}.`
  }

  if (primaryArea === "comprehension") {
    return `Guide students through these curriculum-based meaning-making tasks: ${practiceIdeas.join(", ")}. Keep the work aligned to: ${standards.join(", ")}.`
  }

  return `Guide students through these lesson tasks: ${practiceIdeas.join(", ")}. Keep support aligned to: ${standards.join(", ")}.`
}

function buildIndependentTaskLine(
  primaryArea: string,
  practiceIdeas: string[],
  wordList: string[],
  texts: string[]
): string {
  if (primaryArea === "foundational") {
    return `Students complete independent foundational-skill work using: ${practiceIdeas.slice(0, 2).join(", ")}.`
  }

  if (primaryArea === "comprehension") {
    return `Students complete an independent meaning-making response task using: ${practiceIdeas.slice(0, 2).join(", ")}.`
  }

  return `Students complete independent practice using: ${practiceIdeas.slice(0, 2).join(", ")}. Reference ${wordList.join(", ")} and ${texts.join(", ")} as needed.`
}

function buildClosureLine(primaryArea: string, vocabulary: string[], wordList: string[]): string {
  if (primaryArea === "foundational") {
    return `Revisit the strongest lesson examples: ${wordList.slice(0, 3).join(", ")}.`
  }

  return `Reinforce key lesson vocabulary: ${vocabulary.slice(0, 3).join(", ")}.`
}

function formatTargetLabel(areaKeys: string[]): string {
  const meaningful = uniqueStrings(areaKeys.filter((key) => key !== "general"))

  if (meaningful.length === 0) {
    return "lesson focus"
  }

  if (meaningful.length === 1) {
    return `${formatSpecAreaKey(meaningful[0])} focus`
  }

  if (meaningful.length === 2) {
    return `${formatSpecAreaKey(meaningful[0])} + ${formatSpecAreaKey(meaningful[1])}`
  }

  return meaningful.map((key) => formatSpecAreaKey(key)).join(" + ")
}

function take(items: string[], count: number, fallback: string[]): string[] {
  const cleaned = Array.from(
    new Set(items.map((item) => item.trim()).filter((item) => item.length > 0))
  ).slice(0, count)

  return cleaned.length ? cleaned : fallback
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter((value) => value.length > 0))
  )
}