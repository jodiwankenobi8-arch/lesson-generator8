import {
  BlueprintContentCoverage,
  LessonBlueprint,
  LessonPlanIdea,
  LessonPlanSectionIdeas,
  LessonPlanningIdeas,
  LessonOutputContents,
  MissingAreaPromptCandidate,
  PlanningComponentCoverage,
  PlanningComponentKey,
  PlanningCoverageDetail,
  PlanningCoverageStatus,
  createDefaultOutputContents,
  isPlanningComponentSelected,
} from "../types"
import { resolveTemplateShell } from "../shared/resolveTemplateShell"
import { getBlueprintCurriculumLaneStatus } from "../shared/curriculumReviewStatus"
import {
  getNormalizedBlueprintValues,
  normalizeTeacherFacingValues,
} from "../shared/teacherFacingContent"

export function buildLessonPlanningIdeas(
  blueprint: LessonBlueprint,
  outputContents: LessonOutputContents = createDefaultOutputContents()
): LessonPlanningIdeas {
  const shell = resolveTemplateShell(blueprint, {
    scope: "lesson_plan",
    lessonSegmentsCount: 8,
    timingCount: 8,
    teacherMovesCount: 5,
    promptStyleCount: 5,
    toneCount: 3,
  })

  const areaKeys = resolvePlanningAreaKeys(blueprint)
  const hasFoundationalArea = planningHasFoundationalArea(areaKeys)
  const hasMeaningArea = planningHasMeaningArea(areaKeys)

  const vocabulary = withFallback(
    getNormalizedBlueprintValues(blueprint, "vocabulary"),
    getReviewAwarePlanningFallback(
      blueprint,
      "vocabulary",
      hasFoundationalArea && !hasMeaningArea ? "key skill vocabulary" : "key lesson vocabulary"
    )
  )
  const texts = withFallback(
    getNormalizedBlueprintValues(blueprint, "text"),
    getReviewAwarePlanningFallback(blueprint, "texts", "teacher-confirmed text or topic")
  )
  const practiceIdeas = withFallback(
    getNormalizedBlueprintValues(blueprint, "practice"),
    getReviewAwarePlanningFallback(
      blueprint,
      "practiceIdeas",
      hasFoundationalArea && !hasMeaningArea
        ? "teacher-confirmed foundational-skill practice"
        : "teacher-confirmed lesson task"
    )
  )
  const wordLists = withFallback(
    getNormalizedBlueprintValues(blueprint, "wordList"),
    getReviewAwarePlanningFallback(
      blueprint,
      "wordLists",
      hasFoundationalArea ? "teacher-confirmed word examples" : "teacher-confirmed examples"
    )
  )
  const standards = withFallback(
    getNormalizedBlueprintValues(blueprint, "standard"),
    ["teacher-selected standard"]
  )
  const lessonSegments = withFallback(
    normalizeTeacherFacingValues(blueprint.structure.lessonSegments, {
      kind: "segment",
      primaryTarget: blueprint.content.target.primary,
    }),
    blueprint.structure.lessonSegments
  )
  const lessonPlanSections = buildLessonPlanSections(
    blueprint,
    standards,
    vocabulary,
    texts,
    practiceIdeas,
    wordLists
  ).filter((section) => isPlanningComponentSelected(outputContents, section.section))
  const formativeAssessmentIdeas = shouldIncludeOptionalComponent(
    "formative_assessment",
    outputContents
  )
    ? buildFormativeIdeas(
        blueprint,
        vocabulary,
        practiceIdeas,
        texts,
        wordLists
      )
    : []
  const centerIdeas = shouldIncludeOptionalComponent(
    "centers",
    outputContents
  )
    ? buildCenterIdeas(blueprint, practiceIdeas, texts, wordLists)
    : []
  const smallGroupIdeas = shouldIncludeOptionalComponent(
    "small_group",
    outputContents
  )
    ? buildSmallGroupIdeas(blueprint, vocabulary, texts, wordLists)
    : []
  const interventionIdeas = shouldIncludeOptionalComponent(
    "intervention",
    outputContents
  )
    ? buildInterventionIdeas(blueprint, vocabulary, texts, wordLists)
    : []

  const componentCoverage = buildComponentCoverage({
    blueprint,
    lessonPlanSections,
    formativeAssessmentIdeas,
    centerIdeas,
    smallGroupIdeas,
    interventionIdeas,
  }).filter((entry) => isPlanningComponentSelected(outputContents, entry.component))

  return {
    slidePlans: shell.slideShell.map((shellLabel, index) => {
      const segmentLabel =
        lessonSegments[index] ??
        blueprint.structure.templateShell?.segmentOrder?.[index] ??
        shellLabel

      return {
        shellLabel,
        action: inferSlideAction(shellLabel),
        purpose: inferSlidePurpose(segmentLabel, shellLabel, blueprint),
        notes: buildSlideNotes({
          index,
          shellLabel,
          segmentLabel,
          shell,
          blueprint,
        }),
      }
    }),
    lessonPlanSections,
    formativeAssessmentIdeas,
    centerIdeas,
    smallGroupIdeas,
    interventionIdeas,
    componentCoverage,
    missingAreaPrompts: buildMissingAreaPromptCandidates(
      blueprint,
      componentCoverage,
      outputContents
    ),
  }
}

function shouldIncludeOptionalComponent(
  component: "formative_assessment" | "centers" | "small_group" | "intervention",
  outputContents: LessonOutputContents
): boolean {
  return isPlanningComponentSelected(outputContents, component)
}

function resolvePlanningAreaKeys(blueprint: LessonBlueprint): string[] {
  const target = blueprint.content.target
  const explicitSingleArea =
    !target.isMixedTarget && !target.secondary
      ? uniqueStrings(normalizePlanningAreaAliases(target.primary))
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
    return uniqueStrings(profileKeys.flatMap((key) => normalizePlanningAreaAliases(key)))
  }

  const targetKeys = uniqueStrings([
    ...normalizePlanningAreaAliases(target.primary),
    ...normalizePlanningAreaAliases(target.secondary ?? undefined),
  ])

  if (targetKeys.length > 0) {
    return targetKeys
  }

  if (target.isMixedTarget) {
    return ["foundational", "comprehension"]
  }

  return ["general"]
}



function normalizePlanningAreaAliases(value?: string | null): string[] {
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

function planningHasArea(areaKeys: string[], candidates: string[]): boolean {
  return areaKeys.some((key) => candidates.includes(key))
}

function planningHasFoundationalArea(areaKeys: string[]): boolean {
  return planningHasArea(areaKeys, ["foundational"])
}

function planningHasMeaningArea(areaKeys: string[]): boolean {
  return planningHasArea(areaKeys, [
    "comprehension",
    "vocabulary_oral_language",
    "fluency",
    "writing",
    "grammar_language_conventions",
    "knowledge_building",
  ])
}

function planningHasMultipleMeaningfulAreas(areaKeys: string[]): boolean {
  return uniqueStrings(areaKeys.filter((key) => key !== "general")).length > 1
}

function formatPlanningAreaKey(areaKey: string): string {
  switch (areaKey) {
    case "foundational":
      return "foundational skill"
    case "comprehension":
      return "comprehension"
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

function formatPlanningFocus(areaKeys: string[]): string {
  const meaningful = uniqueStrings(areaKeys.filter((key) => key !== "general"))

  if (meaningful.length === 0) {
    return "lesson focus"
  }

  if (meaningful.length === 1) {
    return `${formatPlanningAreaKey(meaningful[0])} focus`
  }

  if (meaningful.length === 2) {
    return `${formatPlanningAreaKey(meaningful[0])} and ${formatPlanningAreaKey(meaningful[1])} focus`
  }

  return `${meaningful.slice(0, -1).map(formatPlanningAreaKey).join(", ")}, and ${formatPlanningAreaKey(meaningful[meaningful.length - 1])} focus`
}
function inferSlideAction(shellLabel: string): "reuse" | "adapt" | "create_new" {
  const lower = shellLabel.toLowerCase()

  if (lower.includes("opening") || lower.includes("objective") || lower.includes("closure")) {
    return "adapt"
  }

  if (lower.includes("formative") || lower.includes("check")) {
    return "create_new"
  }

  if (lower.includes("teach") || lower.includes("guided") || lower.includes("independent")) {
    return "adapt"
  }

  return "reuse"
}

function inferSlidePurpose(
  segmentLabel: string,
  shellLabel: string,
  blueprint: LessonBlueprint
): string {
  const areaKeys = resolvePlanningAreaKeys(blueprint)
  const hasFoundationalArea = planningHasFoundationalArea(areaKeys)
  const hasMeaningArea = planningHasMeaningArea(areaKeys)
  const hasMultipleAreas = planningHasMultipleMeaningfulAreas(areaKeys)
  const lowerSegment = segmentLabel.toLowerCase()
  const lowerShell = shellLabel.toLowerCase()

  if (lowerSegment.includes("opening") || lowerShell.includes("objective")) {
    return hasMultipleAreas
      ? `Introduce the combined ${formatPlanningFocus(areaKeys)} and preview how the lesson moves across the selected areas.`
      : "Introduce the lesson goal and frame the learning."
  }

  if (lowerSegment.includes("teach")) {
    if (hasMultipleAreas) {
      return "Model the first major lesson area clearly, then bridge into the next selected area with curriculum-aligned examples and text."
    }

    return hasFoundationalArea && !hasMeaningArea
      ? "Model the target foundational skill or decoding move with curriculum-aligned examples."
      : "Model the key meaning-making or content thinking with curriculum-aligned text."
  }

  if (lowerSegment.includes("guided")) {
    return "Support students through scaffolded practice using the exemplar's structure and prompts."
  }

  if (lowerSegment.includes("independent")) {
    return hasMultipleAreas
      ? "Move students into independent application that reflects the selected areas without collapsing them into one vague task."
      : "Move students into independent application of the target skill with curriculum-grounded tasks."
  }

  if (lowerSegment.includes("center")) {
    return hasMultipleAreas
      ? "Set up center or rotation tasks that continue the selected lesson areas with clear expectations."
      : "Set up center or rotation tasks that continue the lesson target with clear expectations."
  }

  if (lowerSegment.includes("closure")) {
    return hasMultipleAreas
      ? "Close the lesson by reconnecting the selected areas and checking what students retained."
      : "Wrap up the lesson and check understanding."
  }

  return "Carry the exemplar shell forward while swapping in curriculum-aligned content."
}
function buildSlideNotes(args: {
  index: number
  shellLabel: string
  segmentLabel: string
  shell: ReturnType<typeof resolveTemplateShell>
  blueprint: LessonBlueprint
}): string {
  const { index, shellLabel, segmentLabel, shell, blueprint } = args

  const timing = shell.timing[index] ?? "Flexible timing"
  const teacherMove = shell.teacherMoves[index % shell.teacherMoves.length] ?? "teacher guidance"
  const prompt = shell.promptStyle[index % shell.promptStyle.length] ?? "teacher prompt"
  const tone = shell.tone[index % shell.tone.length] ?? "clear instructional tone"
  const contentAnchor = selectSlideContentAnchor(segmentLabel, blueprint)

  return [
    `Segment: ${segmentLabel || shellLabel}`,
    `Timing: ${timing}`,
    `Teacher move: ${teacherMove}`,
    `Prompt style: ${prompt}`,
    `Content anchor: ${contentAnchor}`,
    `Tone: ${tone}`,
  ].join(" | ")
}

function selectSlideContentAnchor(
  segmentLabel: string,
  blueprint: LessonBlueprint
): string {
  const areaKeys = resolvePlanningAreaKeys(blueprint)
  const hasFoundationalArea = planningHasFoundationalArea(areaKeys)
  const hasMeaningArea = planningHasMeaningArea(areaKeys)
  const lower = segmentLabel.toLowerCase()

  const standards = getNormalizedBlueprintValues(blueprint, "standard")
  const wordLists = getNormalizedBlueprintValues(blueprint, "wordList")
  const texts = getNormalizedBlueprintValues(blueprint, "text")
  const practiceIdeas = getNormalizedBlueprintValues(blueprint, "practice")
  const vocabulary = getNormalizedBlueprintValues(blueprint, "vocabulary")

  if (lower.includes("teach")) {
    return hasFoundationalArea && !hasMeaningArea
      ? wordLists.slice(0, 3).join(", ") || "target word examples"
      : texts.slice(0, 1).join(", ") || "lesson text"
  }

  if (lower.includes("guided") || lower.includes("independent") || lower.includes("center")) {
    return practiceIdeas.slice(0, 2).join(", ") || "curriculum practice task"
  }

  if (lower.includes("closure")) {
    return hasFoundationalArea && !hasMeaningArea
      ? wordLists.slice(0, 2).join(", ") || "target words"
      : vocabulary.slice(0, 2).join(", ") || "key vocabulary"
  }

  return standards.slice(0, 1).join(", ") || "lesson objective"
}
function buildLessonPlanSections(
  blueprint: LessonBlueprint,
  standards: string[],
  vocabulary: string[],
  texts: string[],
  practiceIdeas: string[],
  wordLists: string[]
): LessonPlanSectionIdeas[] {
  return [
    {
      section: "teach",
      title: "Teach Plan Ideas",
      ideas: buildTeachIdeas(blueprint, standards, vocabulary, texts, wordLists),
    },
    {
      section: "guided_practice",
      title: "Guided Practice Plan Ideas",
      ideas: buildGuidedPracticeIdeas(blueprint, standards, practiceIdeas, texts, wordLists),
    },
    {
      section: "independent_practice",
      title: "Independent Practice Plan Ideas",
      ideas: buildIndependentPracticeIdeas(blueprint, practiceIdeas, texts, wordLists),
    },
    {
      section: "closure",
      title: "Closure Plan Ideas",
      ideas: buildClosureIdeas(blueprint, vocabulary, texts, wordLists),
    },
  ]
}
function buildTeachIdeas(
  blueprint: LessonBlueprint,
  standards: string[],
  vocabulary: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  const areaKeys = resolvePlanningAreaKeys(blueprint)
  const hasFoundationalArea = planningHasFoundationalArea(areaKeys)
  const hasMeaningArea = planningHasMeaningArea(areaKeys)
  const hasMultipleAreas = planningHasMultipleMeaningfulAreas(areaKeys)
  const focusLabel = formatPlanningFocus(areaKeys)

  if (hasMultipleAreas) {
    return [
      {
        title: "Teach the first major area explicitly",
        description: `Open with the first selected area and model it clearly using ${wordLists.slice(0, 3).join(", ") || texts.slice(0, 1).join(", ")}.`,
        rationale: `Multi-area lessons work better when ${focusLabel} is sequenced clearly instead of blended together immediately.`,
      },
      {
        title: "Bridge into the next selected area",
        description: `After the first model, transition into the next selected area using ${texts.slice(0, 1).join(", ") || vocabulary.slice(0, 3).join(", ")} so students feel the lesson connection.`,
        rationale: "Keeps the lesson coherent while still respecting more than one resolved area.",
      },
    ]
  }

  if (hasFoundationalArea && !hasMeaningArea) {
    return [
      {
        title: "Model the target foundational skill",
        description: `Explicitly model the foundational focus using examples such as ${wordLists.slice(0, 4).join(", ")}.`,
        rationale: `Keeps the lesson anchored to curriculum examples and standard(s): ${standards.slice(0, 2).join(", ")}.`,
      },
      {
        title: "Teach key skill language",
        description: `Introduce or revisit language such as ${vocabulary.slice(0, 3).join(", ")} before practice begins.`,
        rationale: "Supports students in naming and explaining what they are learning.",
      },
    ]
  }

  return [
    {
      title: "Model thinking with text",
      description: `Use ${texts.slice(0, 1).join(", ")} to model the target thinking and connect to ${standards.slice(0, 2).join(", ")}.`,
      rationale: "Turns curriculum text into the centerpiece of the teach phase.",
    },
    {
      title: "Preteach key vocabulary",
      description: `Frontload vocabulary such as ${vocabulary.slice(0, 3).join(", ")} before guided discussion.`,
      rationale: "Improves access to the text and task before independent work.",
    },
  ]
}
function buildGuidedPracticeIdeas(
  blueprint: LessonBlueprint,
  standards: string[],
  practiceIdeas: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  const areaKeys = resolvePlanningAreaKeys(blueprint)
  const hasFoundationalArea = planningHasFoundationalArea(areaKeys)
  const hasMeaningArea = planningHasMeaningArea(areaKeys)
  const hasMultipleAreas = planningHasMultipleMeaningfulAreas(areaKeys)

  if (hasMultipleAreas) {
    return [
      {
        title: "Guide practice for the first selected area",
        description: "Provide scaffolded support with the first selected area before asking students to integrate it with the next part of the lesson.",
        rationale: "Reduces overload in multi-area lessons.",
      },
      {
        title: "Then connect the selected areas",
        description: `Use tasks such as ${practiceIdeas.slice(0, 2).join(", ")} to help students move from one selected area into the next.`,
        rationale: "Keeps the lesson coherent while still respecting more than one resolved area.",
      },
    ]
  }

  if (hasFoundationalArea && !hasMeaningArea) {
    return [
      {
        title: "Guided skill practice",
        description: `Use structured support while students practice with ${wordLists.slice(0, 4).join(", ")}.`,
        rationale: `Bridges teacher modeling into student practice while staying aligned to ${standards.slice(0, 2).join(", ")}.`,
      },
      {
        title: "Supported foundational-skill task",
        description: `Guide students through curriculum tasks such as ${practiceIdeas.slice(0, 2).join(", ")}.`,
        rationale: "Keeps guided practice grounded in actual curriculum routines instead of generic drill.",
      },
    ]
  }

  return [
    {
      title: "Guided text discussion",
      description: `Use ${texts.slice(0, 1).join(", ")} and scaffolded prompts tied to ${practiceIdeas.slice(0, 2).join(", ")}.`,
      rationale: "Supports students before they are expected to respond independently.",
    },
    {
      title: "Standards-aligned support",
      description: `Keep teacher prompting tied explicitly to ${standards.slice(0, 2).join(", ")} during guided work.`,
      rationale: "Prevents guided practice from drifting away from the core lesson goal.",
    },
  ]
}
function buildIndependentPracticeIdeas(
  blueprint: LessonBlueprint,
  practiceIdeas: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  const areaKeys = resolvePlanningAreaKeys(blueprint)
  const hasFoundationalArea = planningHasFoundationalArea(areaKeys)
  const hasMeaningArea = planningHasMeaningArea(areaKeys)
  const hasMultipleAreas = planningHasMultipleMeaningfulAreas(areaKeys)

  if (hasMultipleAreas) {
    return [
      {
        title: "Independent application for the first selected area",
        description: "Let students first apply the first selected area with manageable support and materials.",
        rationale: "Builds independence without collapsing multiple areas into one unclear task.",
      },
      {
        title: "Integrated final application",
        description: `Then ask students to complete a second task tied to ${practiceIdeas.slice(0, 2).join(", ")} that reflects the selected areas together.`,
        rationale: "Allows the lesson to culminate in a fuller application once each area has been supported.",
      },
    ]
  }

  if (hasFoundationalArea && !hasMeaningArea) {
    return [
      {
        title: "Independent foundational-skill application",
        description: `Students complete practice such as ${practiceIdeas.slice(0, 2).join(", ")} using ${wordLists.slice(0, 4).join(", ")}.`,
        rationale: "Moves students from supported skill work to independent application.",
      },
      {
        title: "Transfer check",
        description: "Ask students to apply the skill in reading, sorting, or writing without immediate teacher support.",
        rationale: "Shows whether the skill transfers beyond the modeled examples.",
      },
    ]
  }

  return [
    {
      title: "Independent text response",
      description: `Students complete a response task tied to ${texts.slice(0, 1).join(", ")} using ${practiceIdeas.slice(0, 2).join(", ")}.`,
      rationale: "Creates a direct bridge from guided discussion to student-owned work.",
    },
    {
      title: "Reasoning and evidence application",
      description: "Require students to show understanding through a written, oral, or partner-based response.",
      rationale: "Checks whether students can independently apply the selected focus.",
    },
  ]
}
function buildClosureIdeas(
  blueprint: LessonBlueprint,
  vocabulary: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  const areaKeys = resolvePlanningAreaKeys(blueprint)
  const hasFoundationalArea = planningHasFoundationalArea(areaKeys)
  const hasMeaningArea = planningHasMeaningArea(areaKeys)
  const hasMultipleAreas = planningHasMultipleMeaningfulAreas(areaKeys)

  if (hasMultipleAreas) {
    return [
      {
        title: "Reconnect the selected lesson areas",
        description: "Close by naming what students learned across the selected areas and how those parts of the lesson connected.",
        rationale: "Prevents multi-area lessons from feeling like unrelated mini-lessons.",
      },
    ]
  }

  if (hasFoundationalArea && !hasMeaningArea) {
    return [
      {
        title: "Review the target skill",
        description: `Revisit a short set of examples such as ${wordLists.slice(0, 3).join(", ")} and restate the lesson focus.`,
        rationale: "Ends the lesson by reinforcing the exact skill students practiced.",
      },
    ]
  }

  return [
    {
      title: "Summarize the key understanding",
      description: `Use ${texts.slice(0, 1).join(", ")} to prompt a final recap with vocabulary such as ${vocabulary.slice(0, 3).join(", ")}.`,
      rationale: "Closes the lesson by reconnecting students to the text and main objective.",
    },
  ]
}
function buildFormativeIdeas(
  blueprint: LessonBlueprint,
  vocabulary: string[],
  practiceIdeas: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  const areaKeys = resolvePlanningAreaKeys(blueprint)
  const hasFoundationalArea = planningHasFoundationalArea(areaKeys)
  const hasMeaningArea = planningHasMeaningArea(areaKeys)
  const hasMultipleAreas = planningHasMultipleMeaningfulAreas(areaKeys)

  if (hasMultipleAreas) {
    return [
      {
        title: "Checkpoint after the first selected area",
        description: "Pause after the first lesson area and quickly check whether students can do that work before moving on.",
        rationale: "Prevents the next selected area from piling onto an unstable foundation.",
      },
      {
        title: "End-of-lesson integration check",
        description: `Use a short task tied to ${practiceIdeas.slice(0, 2).join(", ")} to see whether students can bring the selected areas together.`,
        rationale: "Shows whether the lesson held together instructionally across the resolved areas.",
      },
    ]
  }

  if (hasFoundationalArea && !hasMeaningArea) {
    return [
      {
        title: "Mid-lesson skill check",
        description: `Ask students to read or sort a short set of target examples such as ${wordLists.slice(0, 3).join(", ")}.`,
        rationale: "Provides a quick understanding check before releasing students to fuller practice.",
      },
      {
        title: "Skill explanation prompt",
        description: `Have students explain the skill using vocabulary like ${vocabulary.slice(0, 3).join(", ")}.`,
        rationale: "Checks whether students can verbalize the target concept, not just perform it.",
      },
    ]
  }

  return [
    {
      title: "Turn-and-talk meaning check",
      description: `Pause after modeled reading and ask students to answer a short prompt tied to ${texts.slice(0, 1).join(", ")}.`,
      rationale: "Checks understanding before independent response work begins.",
    },
    {
      title: "Evidence-based response check",
      description: `Use a brief prompt connected to ${practiceIdeas.slice(0, 2).join(", ")} and require students to cite evidence or reasoning.`,
      rationale: "Creates a fast formative checkpoint aligned to the lesson objective.",
    },
  ]
}
function buildCenterIdeas(
  blueprint: LessonBlueprint,
  practiceIdeas: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  const areaKeys = resolvePlanningAreaKeys(blueprint)
  const hasFoundationalArea = planningHasFoundationalArea(areaKeys)
  const hasMeaningArea = planningHasMeaningArea(areaKeys)
  const hasMultipleAreas = planningHasMultipleMeaningfulAreas(areaKeys)

  if (hasMultipleAreas) {
    return [
      {
        title: "First-area practice center",
        description: "Create one center that isolates the first selected area for repeated supported practice.",
        rationale: "Keeps center work focused instead of overloading students with multiple areas at once.",
      },
      {
        title: "Second-area application center",
        description: `Create a second center tied to ${texts.slice(0, 1).join(", ") || practiceIdeas.slice(0, 2).join(", ")} for applying the next selected area.`,
        rationale: "Preserves the multi-area lesson structure during rotation work.",
      },
    ]
  }

  if (hasFoundationalArea && !hasMeaningArea) {
    return [
      {
        title: "Word work center",
        description: `Students sort, read, or build target examples such as ${wordLists.slice(0, 4).join(", ")}.`,
        rationale: "Keeps students practicing the target skill with hands-on repetition.",
      },
      {
        title: "Partner skill center",
        description: "Students practice with a partner using the modeled routine and clear success criteria.",
        rationale: "Extends modeled foundational work into supported peer practice.",
      },
    ]
  }

  return [
    {
      title: "Reading response center",
      description: `Students respond to a prompt tied to ${texts.slice(0, 1).join(", ")}.`,
      rationale: "Extends meaning-making into independent written or oral response.",
    },
    {
      title: "Partner discussion center",
      description: `Students discuss prompts based on ${practiceIdeas.slice(0, 2).join(", ")}.`,
      rationale: "Supports oral rehearsal before independent written work or closure.",
    },
  ]
}
function buildSmallGroupIdeas(
  blueprint: LessonBlueprint,
  vocabulary: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  const areaKeys = resolvePlanningAreaKeys(blueprint)
  const hasFoundationalArea = planningHasFoundationalArea(areaKeys)
  const hasMeaningArea = planningHasMeaningArea(areaKeys)
  const hasMultipleAreas = planningHasMultipleMeaningfulAreas(areaKeys)

  if (hasMultipleAreas) {
    return [
      {
        title: "Area-specific reteach group",
        description: "Pull students for reteach on the exact selected area that broke down first rather than reteaching the entire lesson at once.",
        rationale: "Makes multi-area support more precise and manageable.",
      },
      {
        title: "Cross-area extension group",
        description: "Meet with students who are ready to connect the selected areas in a more complex way.",
        rationale: "Provides extension without making the whole class lesson more complicated.",
      },
    ]
  }

  if (hasFoundationalArea && !hasMeaningArea) {
    return [
      {
        title: "Targeted skill reteach group",
        description: `Pull a small group to reteach and practice with ${wordLists.slice(0, 3).join(", ")}.`,
        rationale: "Supports students who need more explicit modeling and guided rehearsal.",
      },
      {
        title: "Advanced transfer group",
        description: "Challenge students to apply the target skill in reading and writing beyond the modeled examples.",
        rationale: "Provides extension without changing the core lesson focus.",
      },
    ]
  }

  return [
    {
      title: "Supported text discussion group",
      description: `Reread and discuss ${texts.slice(0, 1).join(", ")} with added prompts and vocabulary support.`,
      rationale: "Helps students who need more teacher-supported meaning making.",
    },
    {
      title: "Response extension group",
      description: `Use vocabulary like ${vocabulary.slice(0, 3).join(", ")} to strengthen oral or written responses.`,
      rationale: "Builds richer explanation and reasoning during small-group support.",
    },
  ]
}
function buildInterventionIdeas(
  blueprint: LessonBlueprint,
  vocabulary: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  const areaKeys = resolvePlanningAreaKeys(blueprint)
  const hasFoundationalArea = planningHasFoundationalArea(areaKeys)
  const hasMeaningArea = planningHasMeaningArea(areaKeys)
  const hasMultipleAreas = planningHasMultipleMeaningfulAreas(areaKeys)

  if (hasMultipleAreas) {
    return [
      {
        title: "Intervene on the first unresolved area",
        description: "Identify which selected area caused difficulty first and intervene there before reteaching everything.",
        rationale: "Makes multi-area intervention cleaner and more targeted.",
      },
    ]
  }

  if (hasFoundationalArea && !hasMeaningArea) {
    return [
      {
        title: "Immediate foundational-skill reteach",
        description: `Reteach with a reduced set of examples such as ${wordLists.slice(0, 3).join(", ")}.`,
        rationale: "Makes the skill more manageable for students who are not yet secure.",
      },
    ]
  }

  return [
    {
      title: "Guided meaning-making support",
      description: `Use a shortened text chunk from ${texts.slice(0, 1).join(", ")} and revisit vocabulary such as ${vocabulary.slice(0, 3).join(", ")}.`,
      rationale: "Reduces complexity while preserving the lesson objective.",
    },
  ]
}
function buildComponentCoverage(args: {
  blueprint: LessonBlueprint
  lessonPlanSections: LessonPlanSectionIdeas[]
  formativeAssessmentIdeas: LessonPlanIdea[]
  centerIdeas: LessonPlanIdea[]
  smallGroupIdeas: LessonPlanIdea[]
  interventionIdeas: LessonPlanIdea[]
}): PlanningComponentCoverage[] {
  const {
    blueprint,
    lessonPlanSections,
    formativeAssessmentIdeas,
    centerIdeas,
    smallGroupIdeas,
    interventionIdeas,
  } = args

  const coverage = getBlueprintContentCoverage(blueprint)
  const isMixedFull =
    blueprint.content.target.isMixedTarget &&
    blueprint.content.target.recommendedMode === "full"

  const sectionMap = new Map(
    lessonPlanSections.map((section) => [section.section, section.ideas] as const)
  )

  return [
    buildCoverageEntry(
      "teach",
      sectionMap.get("teach") ?? [],
      collectCoverageSignals({
        coverage,
        lessonSegmentTerms: ["teach", "model", "mini-lesson", "instruction"],
        coverageKeys: [
          "instructionalTargets",
          "standards",
          "foundationalSkills",
          "sightWords",
          "vocabulary",
          "wordLists",
          "texts",
        ],
      }),
      "Core instruction should be clearly present so the system does not silently invent the lesson focus."
    ),
    buildCoverageEntry(
      "guided_practice",
      sectionMap.get("guided_practice") ?? [],
      collectCoverageSignals({
        coverage,
        lessonSegmentTerms: ["guided", "practice", "we do", "scaffold"],
        coverageKeys: ["practiceIdeas", "wordLists", "texts"],
      }),
      "Guided practice is a major instructional component and should be checked before adding more support."
    ),
    buildCoverageEntry(
      "independent_practice",
      sectionMap.get("independent_practice") ?? [],
      collectCoverageSignals({
        coverage,
        lessonSegmentTerms: ["independent", "practice", "you do", "application"],
        coverageKeys: ["practiceIdeas", "texts", "wordLists"],
      }),
      "Independent work should be identified explicitly so the engine can avoid duplicating student tasks."
    ),
    buildCoverageEntry(
      "closure",
      sectionMap.get("closure") ?? [],
      collectCoverageSignals({
        coverage,
        lessonSegmentTerms: ["closure", "wrap", "exit", "review", "recap"],
        coverageKeys: ["vocabulary", "wordLists", "texts"],
      }),
      "Closure is instructionally meaningful enough to ask about when it seems missing."
    ),
    buildCoverageEntry(
      "formative_assessment",
      formativeAssessmentIdeas,
      collectCoverageSignals({
        coverage,
        lessonSegmentTerms: ["check", "formative", "assessment", "exit", "monitor"],
      }),
      "A formative check helps determine whether the lesson should add or skip extra support."
    ),
    buildCoverageEntry(
      "centers",
      centerIdeas,
      collectCoverageSignals({
        coverage,
        lessonSegmentTerms: ["center", "rotation", "station"],
      }),
      "Centers are optional in some lessons, but they are important enough to flag when the lesson shape suggests them."
    ),
    buildCoverageEntry(
      "small_group",
      smallGroupIdeas,
      collectCoverageSignals({
        coverage,
        lessonSegmentTerms: ["small group", "teacher table", "guided group", "reteach group"],
      }),
      "Small-group support should be visible when the system is planning differentiated follow-through."
    ),
    buildCoverageEntry(
      "intervention",
      interventionIdeas,
      collectCoverageSignals({
        coverage,
        lessonSegmentTerms: ["intervention", "reteach", "support", "reteaching"],
      }),
      isMixedFull
        ? "Mixed lessons especially benefit from explicit intervention planning when one part breaks down."
        : "Intervention should be tracked separately from core instruction to keep support targeted."
    ),
  ]
}

function buildCoverageEntry(
  component: PlanningComponentKey,
  ideas: LessonPlanIdea[],
  sourceEvidence: string[],
  rationale: string
): PlanningComponentCoverage {
  const sourceCoverage = buildSourceCoverageDetail(component, sourceEvidence, rationale)
  const generatedCoverage = buildGeneratedCoverageDetail(component, ideas, rationale)

  return {
    component,
    status: combineCoverageStatus(sourceCoverage.status, generatedCoverage.status),
    evidence: uniqueStrings([
      ...sourceCoverage.evidence,
      ...generatedCoverage.evidence,
    ]).slice(0, 4),
    rationale,
    sourceCoverage,
    generatedCoverage,
  }
}

function buildSourceCoverageDetail(
  component: PlanningComponentKey,
  evidence: string[],
  rationale: string
): PlanningCoverageDetail {
  return {
    status: inferSourceCoverageStatus(component, evidence),
    evidence: evidence.slice(0, 4),
    rationale,
    source: "source_signals",
  }
}

function buildGeneratedCoverageDetail(
  component: PlanningComponentKey,
  ideas: LessonPlanIdea[],
  rationale: string
): PlanningCoverageDetail {
  return {
    status: inferGeneratedCoverageStatus(ideas),
    evidence: ideas.map((idea) => idea.title).slice(0, 4),
    rationale,
    source: "generated_support",
  }
}

function inferSourceCoverageStatus(
  component: PlanningComponentKey,
  evidence: string[]
): PlanningCoverageStatus {
  const count = evidence.length

  if (component === "teach") {
    if (count >= 2) return "covered"
    if (count >= 1) return "partial"
    return "missing"
  }

  if (component === "guided_practice" || component === "independent_practice") {
    if (count >= 3) return "covered"
    if (count >= 1) return "partial"
    return "missing"
  }

  if (component === "closure" || component === "formative_assessment") {
    if (count >= 2) return "covered"
    if (count >= 1) return "partial"
    return "missing"
  }

  if (component === "centers" || component === "small_group" || component === "intervention") {
    if (count >= 2) return "covered"
    if (count >= 1) return "partial"
    return "missing"
  }

  return "missing"
}

function inferGeneratedCoverageStatus(
  ideas: LessonPlanIdea[]
): PlanningCoverageStatus {
  if (ideas.length >= 2) {
    return "covered"
  }

  if (ideas.length >= 1) {
    return "partial"
  }

  return "missing"
}

function combineCoverageStatus(
  sourceStatus: PlanningCoverageStatus,
  generatedStatus: PlanningCoverageStatus
): PlanningCoverageStatus {
  if (sourceStatus === "covered" || generatedStatus === "covered") {
    return "covered"
  }

  if (sourceStatus === "partial" || generatedStatus === "partial") {
    return "partial"
  }

  return "missing"
}

function getBlueprintContentCoverage(
  blueprint: LessonBlueprint
): BlueprintContentCoverage {
  return (
    blueprint.content.coverage ?? {
      standards: blueprint.content.standards,
      vocabulary: blueprint.content.vocabulary,
      wordLists: blueprint.content.wordLists,
      texts: blueprint.content.texts,
      practiceIdeas: blueprint.content.practiceIdeas,
      instructionalTargets: [],
      sightWords: [],
      foundationalSkills: [],
      lessonSegments: blueprint.structure.lessonSegments,
    }
  )
}

function collectCoverageSignals(args: {
  coverage: BlueprintContentCoverage
  lessonSegmentTerms?: string[]
  coverageKeys?: Array<keyof BlueprintContentCoverage>
}): string[] {
  const { coverage, lessonSegmentTerms = [], coverageKeys = [] } = args

  const lessonSegmentSignals =
    lessonSegmentTerms.length === 0
      ? []
      : normalizeTeacherFacingValues(coverage.lessonSegments ?? [], {
          kind: "segment",
        }).filter((segment) =>
          lessonSegmentTerms.some((term) => segment.toLowerCase().includes(term))
        )

  const coverageSignals = coverageKeys.flatMap((key) =>
    normalizeTeacherFacingValues(coverage[key] ?? [], {
      kind: mapCoverageKeyToPlanningKind(key),
    })
      .filter(
        (value) =>
          !/^(HB Florida B\.E\.S\.T\. Standards|Standards)$/i.test(value.trim())
      )
      .slice(0, 2)
  )

  return uniqueStrings([...lessonSegmentSignals, ...coverageSignals]).slice(0, 4)
}

function buildMissingAreaPromptCandidates(
  blueprint: LessonBlueprint,
  componentCoverage: PlanningComponentCoverage[],
  outputContents: LessonOutputContents
): MissingAreaPromptCandidate[] {
  const target = blueprint.content.target
  const isMixedFull = target.isMixedTarget && target.recommendedMode === "full"
  const prompts: MissingAreaPromptCandidate[] = []
  const byComponent = new Map(
    componentCoverage.map((entry) => [entry.component, entry] as const)
  )
return prompts
}

function addPromptIfSourceCoverageMissing(
  prompts: MissingAreaPromptCandidate[],
  byComponent: Map<PlanningComponentKey, PlanningComponentCoverage>,
  outputContents: LessonOutputContents,
  component: PlanningComponentKey,
  candidate: Omit<MissingAreaPromptCandidate, "component">
): void {
  if (!isPlanningComponentSelected(outputContents, component)) {
    return
  }

  const coverage = byComponent.get(component)
  const sourceStatus = coverage?.sourceCoverage?.status ?? coverage?.status ?? "missing"

  if (sourceStatus === "missing") {
    prompts.push({
      component,
      ...candidate,
    })
  }
}

type PlanningValueKind =
  | "standard"
  | "vocabulary"
  | "wordList"
  | "text"
  | "practice"
  | "segment"

function withFallback(values: string[], fallback: string[]): string[] {
  return values.length > 0 ? values : fallback
}

function getReviewAwarePlanningFallback(
  blueprint: LessonBlueprint,
  lane: "vocabulary" | "wordLists" | "texts" | "practiceIdeas",
  fallback: string
): string[] {
  const status = getBlueprintCurriculumLaneStatus(blueprint, lane)
  if (status === "review-needed") {
    return [`Review needed on Materials: confirm ${lane === "wordLists" ? "word list or examples" : lane === "texts" ? "text or topic" : lane}.`]
  }

  if (status === "blocked") {
    return [`Blocked until Materials has usable curriculum support for ${lane === "wordLists" ? "word list or examples" : lane === "texts" ? "text or topic" : lane}.`]
  }

  return [fallback]
}

function mapCoverageKeyToPlanningKind(
  key: keyof BlueprintContentCoverage
): PlanningValueKind {
  if (key === "standards") return "standard"
  if (key === "vocabulary") return "vocabulary"
  if (key === "wordLists" || key === "sightWords" || key === "foundationalSkills") return "wordList"
  if (key === "texts") return "text"
  if (key === "lessonSegments") return "segment"
  return "practice"
}

function sanitizePlanningValues(
  values: string[],
  kind: PlanningValueKind
): string[] {
  return uniqueStrings(
    values
      .map((value) => normalizePlanningValue(value))
      .filter((value) => value.length > 0)
      .filter((value) => !isWeakPlanningValue(value, kind))
  )
}

function normalizePlanningValue(value: string): string {
  return value
    .replace(/^[\s*Ã¢â‚¬Â¢\-Ã¢â‚¬â€œÃ¢â‚¬â€]+/, "")
    .replace(/^\[/, "")
    .replace(/^(hb\s+)?florida\s+b\.?e\.?s\.?t\.?\s+standards?:?\s*/i, "")
    .replace(/^standards?:?\s*/i, "")
    .replace(/^benchmarks?:?\s*/i, "")
    .replace(/^[a-z]\s+(?=[A-Z]{2,}(?:\.[A-Za-z0-9]+){2,}\s*:)/, "")
    .replace(/\s+/g, " ")
    .replace(/[;:]+$/g, "")
    .trim()
}

function isWeakPlanningValue(
  value: string,
  kind: PlanningValueKind
): boolean {
  const lower = value.toLowerCase()
  const wordCount = value.split(/\s+/).length

  if (/students?\s*:\s*\d+/i.test(value)) {
    return true
  }

  if (/time\s*[:=]/i.test(lower)) {
    return true
  }

  if (/\(=|\(x/i.test(value)) {
    return true
  }

  if (
    lower.includes("students have been taught") ||
    lower.includes("today's instruction is focused") ||
    lower.includes("students are not") ||
    lower.includes("students respond") ||
    lower.includes("students see the letter") ||
    lower.includes("story/skill") ||
    lower.includes("phonological awareness") ||
    lower.includes("lesson flow") ||
    lower.includes("smartboard") ||
    lower.includes("projector") ||
    lower.includes("whiteboards") ||
    lower.includes("ed tech") ||
    lower.includes("resource") ||
    lower.includes("slideslink") ||
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

  if (kind === "segment") {
    return !["opening", "teach", "guided practice", "independent practice", "centers", "closure", "close"].includes(lower)
  }

  if (kind === "standard") {
    return lower === "standard" || lower === "standards"
  }

  if (kind === "vocabulary") {
    return (
      lower.startsWith("i can ") ||
      lower.startsWith("read ") ||
      lower.includes("main topic") ||
      lower.includes("key details") ||
      lower.includes("author's purpose") ||
      wordCount > 10
    )
  }

  if (kind === "wordList") {
    return (
      lower.startsWith("i can ") ||
      lower.startsWith("read ") ||
      lower.startsWith("identify ") ||
      lower.includes("sight words") ||
      wordCount > 8
    )
  }

  if (kind === "text") {
    return (
      lower.startsWith("i can ") ||
      lower.startsWith("read ") ||
      lower.includes("main topic") ||
      lower.includes("key details") ||
      lower.includes("author's purpose")
    )
  }

  if (kind === "practice") {
    return wordCount > 10
  }

  return false
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter((value) => value.length > 0))
  )
}






