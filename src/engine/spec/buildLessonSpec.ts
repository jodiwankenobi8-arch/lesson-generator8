import {
  LessonBlueprint,
  LessonPlanIdea,
  LessonPlanningIdeas,
  LessonSpec,
  LessonSpecSection,
} from "../types"
import { resolveTemplateShell } from "../shared/resolveTemplateShell"
import { getNormalizedBlueprintValues } from "../shared/teacherFacingContent"
import {
  REVIEW_PRACTICE_REFERENCE,
  REVIEW_TEXT_REFERENCE,
  REVIEW_VOCABULARY_REFERENCE,
  REVIEW_WORD_EXAMPLES_REFERENCE,
} from "../shared/reviewGuidance"

type LessonSpecContext = {
  areaKeys: string[]
  primaryArea: string
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

type LessonPortion = {
  areaKey: string
  label: string
  teach: string
  guided: string
  independent: string
  closure: string
  center: string
}

export function buildLessonSpec(
  blueprint: LessonBlueprint,
  planningIdeas?: LessonPlanningIdeas
): LessonSpec {
  const context = buildLessonSpecContext(blueprint, planningIdeas)

  if (getOrderedAreaKeys(context.areaKeys).length > 1) {
    return buildMultiAreaSpec(context)
  }

  if (context.primaryArea === "foundational") {
    return buildFoundationalSpec(context)
  }

  if (context.primaryArea === "comprehension") {
    return buildComprehensionSpec(context)
  }

  return buildGenericSpec(context)
}

function buildLessonSpecContext(
  blueprint: LessonBlueprint,
  planningIdeas?: LessonPlanningIdeas
): LessonSpecContext {
  const areaKeys = resolveSpecAreaKeys(blueprint)
  const primaryArea = getOrderedAreaKeys(areaKeys)[0] ?? "general"

  const vocabulary = take(
    getNormalizedBlueprintValues(blueprint, "vocabulary"),
    4,
    [REVIEW_VOCABULARY_REFERENCE]
  )
  const wordList = take(
    getNormalizedBlueprintValues(blueprint, "wordList"),
    5,
    [REVIEW_WORD_EXAMPLES_REFERENCE]
  )
  const texts = take(
    getNormalizedBlueprintValues(blueprint, "text"),
    2,
    [REVIEW_TEXT_REFERENCE]
  )
  const practiceIdeas = take(
    getNormalizedBlueprintValues(blueprint, "practice"),
    4,
    [REVIEW_PRACTICE_REFERENCE]
  )
  const standards = take(
    getNormalizedBlueprintValues(blueprint, "standard"),
    2,
    ["teacher-selected standard"]
  )

  const shell = resolveTemplateShell(blueprint, {
    scope: "lesson_plan",
    lessonSegmentsCount: 6,
    slideShellCount: 6,
    teacherMovesCount: 4,
    promptStyleCount: 4,
    toneCount: 2,
  })

  return {
    areaKeys,
    primaryArea,
    vocabulary,
    wordList,
    texts,
    practiceIdeas,
    standards,
    shell,
    openingLine: buildOpeningLine(areaKeys, standards, shell.tone),
    modeledResources: buildModeledResources(primaryArea, wordList, texts),
    guidedTaskLine: buildGuidedTaskLine(primaryArea, practiceIdeas, standards),
    independentTaskLine: buildIndependentTaskLine(primaryArea, practiceIdeas, wordList, texts),
    closureLine: buildClosureLine(primaryArea, vocabulary, wordList),
    flowLine: "",
    slideShellLine: "",
    timingLine: `Keep pacing aligned to: ${shell.timing.join(" | ")}.`,
    teacherMoveLine: `Use these teacher moves where helpful: ${shell.teacherMoves.join(", ")}.`,
    promptLine: buildPromptLine(shell.promptStyle),
    toneLine: `Keep the delivery tone aligned to: ${shell.tone.join(", ")}.`,
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

function buildMultiAreaSpec(context: LessonSpecContext): LessonSpec {
  const portions = buildLessonPortions(context)

  return {
    teach: createSection("Teach", [
      context.openingLine,
      ...portions.map(
        (portion, index) =>
          `Lesson Portion ${index + 1} (${portion.label}) - Teach: ${portion.teach}`
      ),
      ...context.teachPlanLines,
      context.teacherMoveLine,
      context.flowLine,
      context.slideShellLine,
    ]),
    guidedPractice: createSection("Guided Practice", [
      "Keep each lesson area in its own guided-practice portion before moving on.",
      ...portions.map(
        (portion, index) =>
          `Lesson Portion ${index + 1} (${portion.label}) - Guided Practice: ${portion.guided}`
      ),
      `Keep support anchored to the standards: ${context.standards.join(", ")}.`,
      ...context.guidedPlanLines,
      ...takeLines(context.formativePlanLines, 1),
      context.promptLine,
      context.timingLine,
    ]),
    independentPractice: createSection("Independent Practice", [
      "Give each lesson area its own independent-practice moment instead of one vague mixed task.",
      ...portions.map(
        (portion, index) =>
          `Lesson Portion ${index + 1} (${portion.label}) - Independent Practice: ${portion.independent}`
      ),
      ...context.independentPlanLines,
      ...takeLines(context.formativePlanLines, 1, 1),
      context.toneLine,
    ]),
    centers: createSection("Centers", [
      ...context.centerPlanLines,
      ...takeLines(context.smallGroupPlanLines, 1),
      ...takeLines(context.interventionPlanLines, 1),
      ...portions.map(
        (portion, index) =>
          `Center / support for Lesson Portion ${index + 1} (${portion.label}): ${portion.center}`
      ),
      "Teacher-led support / reteach center",
    ]),
    closure: createSection("Closure", [
      "Close the lesson by reconnecting what students learned across the lesson portions.",
      ...portions.map(
        (portion, index) =>
          `Lesson Portion ${index + 1} (${portion.label}) - Closure / Check: ${portion.closure}`
      ),
      ...context.closurePlanLines,
      ...takeLines(context.formativePlanLines, 1),
      context.flowLine,
      context.timingLine,
      context.toneLine,
    ]),
  }
}

function buildFoundationalSpec(context: LessonSpecContext): LessonSpec {
  return {
    teach: createSection("Teach", [
      context.openingLine,
      `Model the foundational-skill focus with these curriculum examples: ${context.wordList.join(", ")}.`,
      `Teach and reinforce the key skill language students will use: ${context.vocabulary.join(", ")}.`,
      "Think aloud while reading, sorting, encoding, or applying the target examples.",
      ...context.teachPlanLines,
      context.teacherMoveLine,
      context.flowLine,
      context.slideShellLine,
    ]),
    guidedPractice: createSection("Guided Practice", [
      context.guidedTaskLine,
      `Use the lesson examples during support: ${context.wordList.join(", ")}.`,
      "Require students to explain or show the target skill with teacher guidance.",
      ...context.guidedPlanLines,
      ...takeLines(context.formativePlanLines, 1),
      context.promptLine,
      context.timingLine,
    ]),
    independentPractice: createSection("Independent Practice", [
      context.independentTaskLine,
      `Use these examples during practice: ${context.wordList.join(", ")}.`,
      ...context.independentPlanLines,
      ...takeLines(context.formativePlanLines, 1, 1),
      "Check for accurate reading, sorting, encoding, and skill application.",
      context.toneLine,
    ]),
    centers: createSection("Centers", [
      ...context.centerPlanLines,
      ...takeLines(context.smallGroupPlanLines, 1),
      ...takeLines(context.interventionPlanLines, 1),
      "Word work / foundational-skill center",
      "Partner reading or skill practice center",
      "Teacher table for intervention or extension",
    ]),
    closure: createSection("Closure", [
      "Review the target foundational skill or pattern.",
      context.closureLine,
      ...context.closurePlanLines,
      context.promptLine,
      "End with a quick oral read, sort, or exit check.",
    ]),
  }
}

function buildComprehensionSpec(context: LessonSpecContext): LessonSpec {
  return {
    teach: createSection("Teach", [
      context.openingLine,
      `Model meaning-making with these lesson texts: ${context.texts.join(", ")}.`,
      `Preteach or revisit the lesson vocabulary: ${context.vocabulary.join(", ")}.`,
      "Demonstrate how students should discuss, answer, explain, or cite their thinking from the text.",
      ...context.teachPlanLines,
      context.teacherMoveLine,
      context.flowLine,
      context.slideShellLine,
    ]),
    guidedPractice: createSection("Guided Practice", [
      context.guidedTaskLine,
      `Use the lesson text and prompts during support: ${context.texts.join(", ")}.`,
      `Anchor the work to the lesson standard: ${context.standards.join(", ")}.`,
      ...context.guidedPlanLines,
      ...takeLines(context.formativePlanLines, 1),
      context.promptLine,
      context.timingLine,
    ]),
    independentPractice: createSection("Independent Practice", [
      context.independentTaskLine,
      `Use these texts or prompts during student work: ${context.texts.join(", ")}.`,
      ...context.independentPlanLines,
      ...takeLines(context.formativePlanLines, 1, 1),
      "Check for understanding, accuracy, and evidence of reasoning.",
      context.toneLine,
    ]),
    centers: createSection("Centers", [
      ...context.centerPlanLines,
      ...takeLines(context.smallGroupPlanLines, 1),
      ...takeLines(context.interventionPlanLines, 1),
      "Reading response center",
      "Partner discussion / retell center",
      "Teacher table for guided meaning-making support",
    ]),
    closure: createSection("Closure", [
      "Review the meaning-making focus and key takeaway from the text.",
      context.closureLine,
      ...context.closurePlanLines,
      context.promptLine,
      "Close with a brief discussion, written response, or oral recap.",
    ]),
  }
}

function buildGenericSpec(context: LessonSpecContext): LessonSpec {
  return {
    teach: createSection("Teach", [
      context.openingLine,
      `Model the lesson content using: ${context.modeledResources}.`,
      `Teach the lesson vocabulary and focus language: ${context.vocabulary.join(", ")}.`,
      ...context.teachPlanLines,
      context.teacherMoveLine,
      context.flowLine,
      context.slideShellLine,
    ]),
    guidedPractice: createSection("Guided Practice", [
      context.guidedTaskLine,
      `Reference standards during support: ${context.standards.join(", ")}.`,
      ...context.guidedPlanLines,
      ...takeLines(context.formativePlanLines, 1),
      context.promptLine,
      context.timingLine,
    ]),
    independentPractice: createSection("Independent Practice", [
      context.independentTaskLine,
      `Use these lesson resources: ${context.wordList.join(", ")} / ${context.texts.join(", ")}.`,
      ...context.independentPlanLines,
      ...takeLines(context.formativePlanLines, 1, 1),
      context.toneLine,
    ]),
    centers: createSection("Centers", [
      ...context.centerPlanLines,
      ...takeLines(context.smallGroupPlanLines, 1),
      ...takeLines(context.interventionPlanLines, 1),
      "Independent practice center",
      "Partner application center",
      "Teacher support center",
    ]),
    closure: createSection("Closure", [
      "Review the lesson focus and what students learned.",
      `Reconnect the lesson sequence: ${context.shell.lessonSegments.join(" -> ")}.`,
      context.closureLine,
      ...context.closurePlanLines,
      context.promptLine,
    ]),
  }
}

function buildLessonPortions(context: LessonSpecContext): LessonPortion[] {
  return getOrderedAreaKeys(context.areaKeys).map((areaKey) => buildLessonPortion(areaKey, context))
}

function buildLessonPortion(areaKey: string, context: LessonSpecContext): LessonPortion {
  const label = formatAreaKey(areaKey)

  if (areaKey === "foundational") {
    return {
      areaKey,
      label,
      teach: `Model the foundational skill with curriculum examples such as ${context.wordList.join(", ")}.`,
      guided: `Guide students through supported skill practice using ${context.practiceIdeas.slice(0, 2).join(", ")} and keep the word work visible.`,
      independent: `Students apply the skill independently with ${context.practiceIdeas.slice(0, 2).join(", ")} and ${context.wordList.slice(0, 4).join(", ")}.`,
      closure: `Check the foundational skill quickly with ${context.wordList.slice(0, 3).join(", ")}.`,
      center: `Word work and transfer practice using ${context.wordList.slice(0, 4).join(", ")}.`,
    }
  }

  if (areaKey === "comprehension") {
    return {
      areaKey,
      label,
      teach: `Model the comprehension thinking with ${context.texts.join(", ")} and make the text purpose explicit.`,
      guided: `Guide students through discussion and support tied to ${context.practiceIdeas.slice(0, 2).join(", ")}.`,
      independent: `Students complete an independent response tied to ${context.texts.slice(0, 1).join(", ")} and ${context.practiceIdeas.slice(0, 2).join(", ")}.`,
      closure: `Revisit the text takeaway and key evidence using ${context.vocabulary.slice(0, 3).join(", ")}.`,
      center: `Reading response or evidence task using ${context.texts.slice(0, 1).join(", ")}.`,
    }
  }

  if (areaKey === "vocabulary_oral_language") {
    return {
      areaKey,
      label,
      teach: `Teach the target language and oral rehearsal moves using ${context.vocabulary.join(", ")}.`,
      guided: `Guide students through speaking, rehearsal, or vocabulary practice tied to ${context.practiceIdeas.slice(0, 2).join(", ")}.`,
      independent: "Students use the target language independently in speaking, sorting, or short written responses.",
      closure: `Listen for accurate use of the target language and revisit ${context.vocabulary.slice(0, 3).join(", ")}.`,
      center: `Vocabulary / oral language practice using ${context.vocabulary.slice(0, 4).join(", ")}.`,
    }
  }

  if (areaKey === "fluency") {
    return {
      areaKey,
      label,
      teach: `Model fluent reading, phrasing, and accuracy with ${context.texts.slice(0, 1).join(", ")}.`,
      guided: `Guide echo, choral, or partner reading tied to ${context.practiceIdeas.slice(0, 2).join(", ")}.`,
      independent: "Students reread or perform the text independently and monitor smoothness, pace, and accuracy.",
      closure: "End with a brief fluency check and reflection on the fluency focus.",
      center: `Fluency reread or partner performance using ${context.texts.slice(0, 1).join(", ")}.`,
    }
  }

  if (areaKey === "writing") {
    return {
      areaKey,
      label,
      teach: `Model planning and writing moves using ${context.texts.slice(0, 1).join(", ")} and ${context.vocabulary.slice(0, 3).join(", ")}.`,
      guided: `Guide students through shared or supported writing tied to ${context.practiceIdeas.slice(0, 2).join(", ")}.`,
      independent: "Students complete an independent writing task using the lesson language and source materials.",
      closure: "Close by sharing or revising writing connected to the lesson focus.",
      center: `Writing practice tied to ${context.practiceIdeas.slice(0, 2).join(", ")}.`,
    }
  }

  if (areaKey === "grammar_language_conventions") {
    return {
      areaKey,
      label,
      teach: `Model the target convention with sentence examples from ${context.texts.slice(0, 1).join(", ") || context.wordList.join(", ")}.`,
      guided: `Guide sentence-level practice tied to ${context.practiceIdeas.slice(0, 2).join(", ")}.`,
      independent: "Students apply the convention independently in speaking or writing.",
      closure: "Review the target convention and check whether students can apply it accurately.",
      center: `Sentence-level convention practice tied to ${context.practiceIdeas.slice(0, 2).join(", ")}.`,
    }
  }

  return {
    areaKey,
    label,
    teach: `Model the ${label} portion using ${context.modeledResources}.`,
    guided: `Guide students through ${label} practice with ${context.practiceIdeas.slice(0, 2).join(", ")}.`,
    independent: `Students complete independent ${label} work using the selected lesson materials.`,
    closure: `Revisit the key ${label} takeaway before moving on.`,
    center: `${label} follow-through tied to the selected lesson materials.`,
  }
}

function resolveSpecAreaKeys(blueprint: LessonBlueprint): string[] {
  const target = blueprint.content.target
  const explicitSingleArea =
    !target.isMixedTarget && !target.secondary
      ? uniqueStrings(normalizeAreaAliases(target.primary))
      : []

  if (explicitSingleArea.length > 0) {
    return explicitSingleArea
  }

  const profileKeys = (
    blueprint as LessonBlueprint & {
      content?: { profile?: { dominantAreaKeys?: string[] | null } | null }
    }
  ).content?.profile?.dominantAreaKeys ?? []

  if (profileKeys.length > 0) {
    return uniqueStrings(profileKeys.flatMap((key) => normalizeAreaAliases(key)))
  }

  const targetKeys = uniqueStrings([
    ...normalizeAreaAliases(target.primary),
    ...normalizeAreaAliases(target.secondary ?? undefined),
  ])

  if (targetKeys.length > 0) {
    return targetKeys
  }

  if (target.isMixedTarget) {
    return ["foundational", "comprehension"]
  }

  return ["general"]
}


function normalizeAreaAliases(value?: string | null): string[] {
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
    case "spelling_encoding":
    case "word_recognition":
    case "high_frequency_words":
    case "letter_identification":
    case "word_building":
    case "decodable_reading":
    case "foundational_skills":
    case "foundational":
      return ["foundational"]
    case "language_comprehension":
    case "comprehension":
    case "reading_response":
      return ["comprehension"]
    case "vocabulary":
    case "vocabulary_oral_language":
    case "oral_language":
    case "speaking_listening":
      return ["vocabulary_oral_language"]
    case "fluency":
      return ["fluency"]
    case "writing_about_reading":
    case "writing_sentence_work":
    case "writing":
      return ["writing"]
    case "grammar_language_conventions":
    case "grammar":
      return ["grammar_language_conventions"]
    case "knowledge_building":
      return ["knowledge_building"]
    default:
      return [normalized]
  }
}

function getOrderedAreaKeys(areaKeys: string[]): string[] {
  return uniqueStrings(areaKeys.filter((key) => key !== "general")).sort(
    (a, b) => getAreaRank(a) - getAreaRank(b)
  )
}

function getAreaRank(areaKey: string): number {
  switch (areaKey) {
    case "foundational":
      return 0
    case "vocabulary_oral_language":
      return 1
    case "fluency":
      return 2
    case "comprehension":
      return 3
    case "grammar_language_conventions":
      return 4
    case "writing":
      return 5
    case "knowledge_building":
      return 6
    default:
      return 7
  }
}

function formatAreaKey(areaKey: string): string {
  switch (areaKey) {
    case "foundational":
      return "foundational skill"
    case "vocabulary_oral_language":
      return "vocabulary / oral language"
    case "grammar_language_conventions":
      return "grammar / language conventions"
    case "knowledge_building":
      return "knowledge building"
    default:
      return areaKey.replace(/_/g, " ")
  }
}

function planningLines(
  planningIdeas: LessonPlanningIdeas | undefined,
  section: "teach" | "guided_practice" | "independent_practice" | "closure"
): string[] {
  const match = planningIdeas?.lessonPlanSections.find((item) => item.section === section)
  return match ? match.ideas.map((idea) => formatPlanningIdea(idea)) : []
}

function ideaLines(ideas: LessonPlanIdea[] | undefined): string[] {
  return ideas?.map((idea) => formatPlanningIdea(idea)) ?? []
}

function formatPlanningIdea(idea: LessonPlanIdea): string {
  return `${idea.title}: ${idea.description}`
}

function createSection(title: string, steps: string[]): LessonSpecSection {
  return {
    title,
    steps: compactSteps(steps),
  }
}

function takeLines(lines: string[], count: number, start = 0): string[] {
  return lines.slice(start, start + count)
}

function take(items: string[], count: number, fallback: string[]): string[] {
  const cleaned = uniqueStrings(items.map((item) => item.trim()).filter(Boolean)).slice(0, count)
  return cleaned.length > 0 ? cleaned : fallback
}

function compactSteps(steps: string[]): string[] {
  return uniqueStrings(steps.map((step) => step.trim()).filter(Boolean))
}

function uniqueStrings(items: string[]): string[] {
  return Array.from(new Set(items))
}

function buildOpeningLine(
  areaKeys: string[],
  standards: string[],
  tone: string[]
): string {
  const targetLabel = formatTargetLabel(areaKeys)
  return `Launch the lesson with a brief opening for ${targetLabel}. Connect students to ${standards.join(", ")} and set a ${tone.join(", ")} tone. Share the objective here if helpful, but treat the opening as the lesson start rather than the objective itself.`
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
    return `Review the strongest examples again: ${wordList.slice(0, 3).join(", ")}.`
  }

  return `Reconnect students to the key takeaway using ${vocabulary.slice(0, 3).join(", ")}.`
}

function buildPromptLine(promptStyle: string[]): string {
  const prompts = promptStyle
    .map((prompt) => prompt.trim())
    .filter(Boolean)
    .filter((prompt) => !/^teacher prompt$/i.test(prompt))

  if (prompts.length === 0) {
    return ""
  }

  return `Use prompts and response frames such as: ${prompts.join(", ")}.`
}

function formatTargetLabel(areaKeys: string[]): string {
  const meaningful = getOrderedAreaKeys(areaKeys)

  if (meaningful.length === 0) {
    return "the lesson focus"
  }

  if (meaningful.length === 1) {
    return formatAreaKey(meaningful[0])
  }

  return meaningful.map((key) => formatAreaKey(key)).join(" + ")
}





