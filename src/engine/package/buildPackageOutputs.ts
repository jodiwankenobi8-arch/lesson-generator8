import {
  CenterFocusKey,
  ExportArtifact,
  LessonBlueprint,
  LessonInputs,
  LessonOutputContents,
  LessonPlanningIdeas,
  LessonSpec,
  MissingAreaDecisionChoice,
  PlanningComponentKey,
  createDefaultOutputContents,
  isGroupOutputSelected,
  isLessonPlanPartSelected,
  isSupportPrintablesSelected,
} from "../types"
import { assembleSlideDeck } from "../slides/assembleSlideDeck"
import { resolveTemplateShell } from "../shared/resolveTemplateShell"
import {
  REVIEW_PRACTICE_STATUS,
  REVIEW_TEXT_STATUS,
  REVIEW_VOCABULARY_STATUS,
  REVIEW_WORD_EXAMPLES_STATUS,
  evaluateGroundingReviewState,
} from "../shared/reviewGuidance"
import { buildExports } from "./buildPackageExportArtifacts"
import {
  buildLessonHeader,
  buildLessonPortionsBlock,
  buildObjectiveSummary,
  buildStandardsSummary,
} from "./buildPackageLessonPlanTextHelpers"
import {
  getPackageDisplayValues,
  resolveCenterLabels,
  selectPracticeFocus,
  selectTextFocus,
  selectVocabularyFocus,
  selectWordListFocus,
} from "./buildPackageValueHelpers"

type MissingAreaDecisionMap = Partial<
  Record<PlanningComponentKey, MissingAreaDecisionChoice>
>

type DecisionAwareListOptions = {
  component: PlanningComponentKey
  plannedItems?: string[]
  missingAreaDecisions?: MissingAreaDecisionMap
  addFallbackItems?: string[]
  defaultItems?: string[]
}

type LessonPlanOutputOptions = {
  outputContents: LessonOutputContents
  includeCentersOutput: boolean
  includeSmallGroupOutput: boolean
  includeInterventionOutput: boolean
}

type SupportBlockOutputOptions = {
  outputContents: LessonOutputContents
  includeSmallGroupOutput: boolean
  includeInterventionOutput: boolean
}

export function buildPackageOutputs(args: {
  inputs: LessonInputs
  blueprint: LessonBlueprint
  spec: LessonSpec
  planningIdeas?: LessonPlanningIdeas
  outputContents?: LessonOutputContents
  missingAreaDecisions?: MissingAreaDecisionMap
}) {
  const {
    inputs,
    blueprint,
    spec,
    planningIdeas,
    outputContents = createDefaultOutputContents(),
    missingAreaDecisions = {},
  } = args

  const includeLessonSlidesOutput = outputContents.lessonSlides.selected
  const includeLessonPlanOutput = outputContents.lessonPlan.selected
  const includeCentersOutput = isGroupOutputSelected(outputContents, "centers")
  const includeSmallGroupOutput = isGroupOutputSelected(outputContents, "small_group")
  const includeInterventionOutput = isGroupOutputSelected(outputContents, "intervention")
  const groundingReview = evaluateGroundingReviewState(blueprint)

  const slides = includeLessonSlidesOutput
    ? buildSlides(blueprint, spec, {
        includeCentersOutput,
        includeSmallGroupOutput,
        includeInterventionOutput,
      })
    : []
  const rawLessonPlan = includeLessonPlanOutput
    ? buildLessonPlan(
        inputs,
        blueprint,
        spec,
        planningIdeas,
        missingAreaDecisions,
        {
          outputContents,
          includeCentersOutput,
          includeSmallGroupOutput,
          includeInterventionOutput,
        }
      )
    : ""
  const rawCenters = includeCentersOutput
    ? buildCenters(blueprint, spec, planningIdeas, missingAreaDecisions, outputContents)
    : []
  const rawRotationPlan =
    includeSmallGroupOutput
      ? buildRotationPlan(
          blueprint,
          rawCenters,
          planningIdeas,
          missingAreaDecisions,
          {
            includeTeacherLedSupport: true,
          }
        )
      : includeCentersOutput && rawCenters.length > 0
        ? buildRotationPlan(
            blueprint,
            rawCenters,
            planningIdeas,
            missingAreaDecisions,
            {
              includeTeacherLedSupport: false,
            }
          )
        : ""
  const rawInterventions = includeInterventionOutput
    ? buildInterventions(
        blueprint,
        planningIdeas,
        missingAreaDecisions
      )
    : []
  const lessonPlan = sanitizeTeacherFacingText(rawLessonPlan)
  const slidesCleaned = slides.map((slide) => sanitizeTeacherFacingText(slide))
  const centers = rawCenters.map((line) => sanitizeTeacherFacingText(line))
  const rotationPlan = sanitizeTeacherFacingText(rawRotationPlan)
  const interventions = rawInterventions.map((line) => sanitizeTeacherFacingText(line))

  const exports = groundingReview.blocksExports
    ? []
    : buildExports(
        inputs,
        slidesCleaned,
        lessonPlan,
        centers,
        rotationPlan,
        interventions,
        {
          includeLessonSlidesExport: includeLessonSlidesOutput,
          includeLessonPlanExport: includeLessonPlanOutput,
          includePrintablesExport: isSupportPrintablesSelected(outputContents),
        }
      )

  return {
    slides: slidesCleaned,
    lessonPlan,
    centers,
    rotationPlan,
    interventions,
    exports,
  }
}

function buildSlides(
  blueprint: LessonBlueprint,
  spec: LessonSpec,
  options: {
    includeCentersOutput: boolean
    includeSmallGroupOutput: boolean
    includeInterventionOutput: boolean
  } = {
    includeCentersOutput: true,
    includeSmallGroupOutput: true,
    includeInterventionOutput: true,
  }
): string[] {
  const assembled = filterSlidesForSelectedOutputs(
    assembleSlideDeck(blueprint, spec),
    options
  )

  if (assembled.length > 0) {
    return assembled
  }

  const shell = blueprint.structure.templateShell.slideShell

  if (shell.length === 0) {
    return [
      "Slide 1: Opening - Launch the lesson and connect students to the work.",
      "Slide 2: Teach - Model the focus skill with curriculum-aligned content.",
      "Slide 3: Practice - Guide students into supported application.",
      "Slide 4: Closure - Review learning and check understanding.",
    ]
  }

  return shell.map((label, index) => `Slide ${index + 1}: ${label}`)
}

function filterSlidesForSelectedOutputs(
  slides: string[],
  options: {
    includeCentersOutput: boolean
    includeSmallGroupOutput: boolean
    includeInterventionOutput: boolean
  }
): string[] {
  return slides.filter((slide) => {
    const normalized = slide.toLowerCase()
    const firstLine = slide.split(/\r?\n/)[0]?.toLowerCase() ?? ""
    const isCentersSlide =
      normalized.includes("| kind: centers |") ||
      /slide\s+\d+\s*:\s*.*center/.test(firstLine)

    if (!options.includeCentersOutput && isCentersSlide) {
      return false
    }

    return true
  })
}


function renumberSlides(slides: string[]): string[] {
  return slides.map((slide, index) =>
    slide.replace(/^Slide\s+\d+:/, `Slide ${index + 1}:`)
  )
}
function buildLessonPlan(
  inputs: LessonInputs,
  blueprint: LessonBlueprint,
  spec: LessonSpec,
  planningIdeas?: LessonPlanningIdeas,
  missingAreaDecisions: MissingAreaDecisionMap = {},
  lessonPlanOutputs: LessonPlanOutputOptions = {
    outputContents: createDefaultOutputContents(),
    includeCentersOutput: true,
    includeSmallGroupOutput: true,
    includeInterventionOutput: true,
  }
): string {
  const {
    outputContents,
    includeCentersOutput,
    includeSmallGroupOutput,
    includeInterventionOutput,
  } = lessonPlanOutputs

  const resolvedTemplateShell = resolveTemplateShell(blueprint, {
    scope: "lesson_plan",
    lessonSegmentsCount: 5,
    slideShellCount: 5,
    timingCount: 5,
    teacherMovesCount: 4,
    promptStyleCount: 4,
    toneCount: 2,
  })

  const header = buildLessonHeader(inputs, blueprint)
  const groundingBlock = buildLessonGroundingBlock(blueprint)

  const standardsBlock = isLessonPlanPartSelected(outputContents, "standards")
    ? buildSectionNarrativeBlock("Standards", [
        `Requested / grounded standards: ${buildStandardsSummary(inputs, blueprint)}`,
      ], [])
    : ""

  const objectiveBlock = isLessonPlanPartSelected(outputContents, "objective")
    ? buildSectionNarrativeBlock("Objective", [
        `Objective focus: ${buildObjectiveSummary(inputs, blueprint)}`,
      ], [])
    : ""

  const openingBlock = isLessonPlanPartSelected(outputContents, "opening")
    ? buildSectionNarrativeBlock("Opening", [
        `Opening flow: ${buildOpeningSequenceLabel(resolvedTemplateShell.lessonSegments)}`,
        "Opening purpose: Start the lesson, activate prior knowledge, and orient students to the work. The objective can be shared here if helpful, but it is not the same thing as the opening.",
      ], [
        `Use ${selectOpeningResources(blueprint)} to connect students to the lesson context or materials.`,
        `Set the purpose for the lesson using ${normalizeToneCue(joinOrFallback(
          resolvedTemplateShell.tone.slice(0, 2),
          "clear, supportive"
        ))}, then move into ${buildFirstTeachingMoveLabel(resolvedTemplateShell.lessonSegments)}.`,
      ])
    : ""
  const lessonPortionsBlock = buildLessonPortionsBlock(blueprint)

  const directInstructionBlock = isLessonPlanPartSelected(
    outputContents,
    "direct_instruction_modeling"
  )
    ? buildSectionNarrativeBlock("Direct Instruction / Modeling", [
        `Model Resources: ${selectModelResources(blueprint)}`,
        `Teacher moves: ${joinOrFallback(
          resolvedTemplateShell.teacherMoves.slice(0, 3),
          "teacher model, guided support"
        )}`,
      ], spec.teach.steps)
    : ""

  const guidedBlock =
    isLessonPlanPartSelected(outputContents, "guided_practice")
      ? buildSectionNarrativeBlock("Guided Practice", [
          `Practice focus: ${joinOrFallback(
            getPackageDisplayValues(blueprint, "practice", 3),
            "a grounded guided-practice task from the selected lesson materials"
          )}`,
        `Timing: ${joinOrFallback(
            resolvedTemplateShell.timing.slice(0, 3),
            "Opening, Mini-lesson, Guided Practice"
          )}`,
        ], spec.guidedPractice.steps)
      : ""
  const independentBlock =
    isLessonPlanPartSelected(outputContents, "independent_practice")
      ? buildSectionNarrativeBlock("Independent Practice", [
          `Transfer Task: ${selectIndependentResources(blueprint)}`,
          `Student Practice: ${joinOrFallback(
            getPackageDisplayValues(blueprint, "practice", 2),
            "independent application"
          )}`,
        ], spec.independentPractice.steps)
      : ""

  const closureBlock =
    isLessonPlanPartSelected(outputContents, "closure")
      ? buildSectionNarrativeBlock("Closure", [
          `Review focus: ${selectClosureResources(blueprint)}`,
          `Keep delivery: ${joinOrFallback(
            resolvedTemplateShell.tone.slice(0, 2),
            "clear instructional tone"
          )}`,
        ], spec.closure.steps)
      : ""
  const differentiationBlock = isLessonPlanPartSelected(outputContents, "differentiation")
    ? buildSectionNarrativeBlock("Differentiation", [
        `Centers: ${includeCentersOutput ? "Requested" : "Not requested"}`,
        `Teacher-Led Small Group: ${includeSmallGroupOutput ? "Requested" : "Not requested"}`,
        `Intervention / Tier 3: ${includeInterventionOutput ? "Requested" : "Not requested"}`,
      ], buildDifferentiationSteps(blueprint, outputContents))
    : ""

  const vocabularyBlock = isLessonPlanPartSelected(outputContents, "vocabulary")
    ? buildSectionNarrativeBlock("Vocabulary", [
        `Story + academic vocabulary: ${buildVocabularySummary(blueprint)}`,
      ], [])
    : ""

  const materialsPrepBlock = isLessonPlanPartSelected(outputContents, "materials_prep_list")
    ? buildSectionNarrativeBlock("Materials / Prep List", [
        `Lesson resources: ${selectModelResources(blueprint)}`,
        `Independent materials: ${selectIndependentResources(blueprint)}`,
      ], buildMaterialsPrepSteps(blueprint, outputContents))
    : ""

  const assessmentConnectionBlock = isLessonPlanPartSelected(
    outputContents,
    "assessment_connection"
  )
    ? buildSectionNarrativeBlock("Assessment Connection", [
        `Requested assessment outputs: ${buildSelectedAssessmentTypeSummary(outputContents)}`,
        outputContents.assessment.selected
          ? "Answer keys generate automatically where applicable."
          : "No assessment output requested yet.",
      ], [])
    : ""

  const supportBlock = buildSupportBlock(
    blueprint,
    planningIdeas,
    missingAreaDecisions,
    {
      outputContents,
      includeSmallGroupOutput,
      includeInterventionOutput,
    }
  )

  const lessonPlan = [
    header,
    groundingBlock,
    standardsBlock,
    objectiveBlock,
    openingBlock,
    lessonPortionsBlock,
    directInstructionBlock,
    guidedBlock,
    independentBlock,
    closureBlock,
    differentiationBlock,
    vocabularyBlock,
    materialsPrepBlock,
    assessmentConnectionBlock,
    supportBlock,
  ]
    .filter(Boolean)
    .join("\n\n")

  return lessonPlan
}

function buildOpeningSequenceLabel(lessonSegments: string[]): string {
  const openingSegments = lessonSegments.filter((segment) => {
    const lower = segment.toLowerCase()
    return lower.includes("opening") || lower.includes("launch") || lower.includes("warm")
  })

  if (openingSegments.length > 0) {
    return openingSegments.slice(0, 2).join(", ")
  }

  return "Opening, transition into teach"
}

function buildFirstTeachingMoveLabel(lessonSegments: string[]): string {
  const teachingSegment = lessonSegments.find((segment) => {
    const lower = segment.toLowerCase()
    return lower.includes("teach") || lower.includes("model") || lower.includes("mini")
  })

  return teachingSegment ?? "the first teaching move"
}

function selectOpeningResources(blueprint: LessonBlueprint): string {
  const contentResources = [
    ...getPackageDisplayValues(blueprint, "wordList", 2),
    ...getPackageDisplayValues(blueprint, "text", 1),
    ...getPackageDisplayValues(blueprint, "vocabulary", 2),
  ]

  return joinOrFallback(contentResources, "the selected lesson materials")
}

function buildDifferentiationSteps(
  blueprint: LessonBlueprint,
  outputContents: LessonOutputContents
): string[] {
  const steps: string[] = []

  if (outputContents.centers.selected) {
    steps.push("Use centers for student-independent follow-through while teacher-led support happens in a separate lane.")
  }

  if (outputContents.smallGroup.selected) {
    steps.push(`Teacher-led tiers requested: ${buildSelectedSmallGroupTierSummary(outputContents)}.`)
  }

  if (steps.length === 0) {
    steps.push(`Differentiate using ${selectPracticeFocus(blueprint, "targeted lesson support")} without forcing a separate center or teacher-led lane.`)
  }

  return steps
}

function buildVocabularySummary(blueprint: LessonBlueprint): string {
  return joinOrFallback(getPackageDisplayValues(blueprint, "vocabulary", 6), "No vocabulary surfaced yet.")
}

function buildMaterialsPrepSteps(
  blueprint: LessonBlueprint,
  outputContents: LessonOutputContents
): string[] {
  const steps = [
    `Have ${selectModelResources(blueprint)} ready for direct instruction and modeling.`,
    `Prepare ${selectIndependentResources(blueprint)} for student practice.`,
  ]

  if (outputContents.centers.selected) {
    steps.push("Prepare any student-independent center materials separately from teacher-led support materials.")
  }

  if (outputContents.smallGroup.selected) {
    steps.push("Pull teacher-led support materials for the requested small-group tiers.")
  }

  return steps
}

function buildSelectedAssessmentTypeSummary(outputContents: LessonOutputContents): string {
  const labels = buildSelectedAssessmentLabels(outputContents)
  return labels.length > 0 ? labels.join(", ") : "No assessment output requested"
}

function buildSelectedAssessmentLabels(outputContents: LessonOutputContents): string[] {
  const labels: Array<{ key: string; label: string }> = [
    { key: "observation_checklist", label: "Observation checklist" },
    { key: "exit_ticket", label: "Exit ticket" },
    { key: "running_record_conference_notes", label: "Running record / conference notes" },
    { key: "quick_oral_check", label: "Quick oral check" },
    { key: "end_of_lesson_task", label: "End-of-lesson task" },
    { key: "skill_check", label: "Skill check" },
    { key: "response_sheet", label: "Response sheet" },
    { key: "brief_performance_task", label: "Brief performance task" },
  ]

  return labels
    .filter(({ key }) => outputContents.assessment.types[key as keyof typeof outputContents.assessment.types])
    .map(({ label }) => label)
}

function buildSelectedSmallGroupTierSummary(outputContents: LessonOutputContents): string {
  const tiers = ["T1", "T2", "T3", "Extension"].filter(
    (tier) => outputContents.smallGroup.tiers[tier as keyof typeof outputContents.smallGroup.tiers]
  )

  return tiers.length > 0 ? tiers.join(", ") : "none selected"
}

function buildCenterFocusLine(
  blueprint: LessonBlueprint,
  focus: CenterFocusKey
): string {
  switch (focus) {
    case "letter_identification":
      return `Letter identification center: Match, sort, or name target letters using ${selectWordListFocus(
        blueprint,
        "teacher-selected letter cards"
      )}.`
    case "phonological_awareness":
      return `Phonological awareness center: Practice listening for rhyme, syllables, and larger sound parts through ${selectPracticeFocus(
        blueprint,
        "teacher-guided oral language routines"
      )}.`
    case "phonemic_awareness":
      return `Phonemic awareness center: Blend, segment, and manipulate sounds using ${selectPracticeFocus(
        blueprint,
        "oral sound work tied to the lesson focus"
      )}.`
    case "phonics":
      return `Phonics center: Read and sort ${selectWordListFocus(
        blueprint,
        "target words"
      )} while practicing the target sound-spelling pattern.`
    case "high_frequency_words":
      return `High-frequency word center: Review and read ${selectWordListFocus(
        blueprint,
        "teacher-selected high-frequency words"
      )} during quick recognition practice.`
    case "word_building":
      return `Word-building center: Build and change words from ${selectWordListFocus(
        blueprint,
        "teacher-selected target words"
      )}.`
    case "vocabulary_oral_language":
      return `Vocabulary & oral language center: Revisit ${selectVocabularyFocus(
        blueprint,
        "grounded lesson vocabulary"
      )} through student-friendly oral language practice.`
    case "handwriting_fine_motor":
      return `Handwriting / fine motor center: Trace, build, or write ${selectWordListFocus(
        blueprint,
        "target letters or words"
      )} with attention to correct formation.`
    case "decodable_reading":
      return `Decodable reading center: Revisit ${selectTextFocus(
        blueprint,
        "a grounded decodable or lesson text"
      )} for independent reading practice.`
    case "fluency":
      return `Fluency center: Practice accurate, repeated reading with ${selectTextFocus(
        blueprint,
        "grounded text or topic from the selected lesson materials"
      )}.`
    case "reading_response":
      return `Reading response center: Respond to ${selectTextFocus(
        blueprint,
        "grounded text or topic from the selected lesson materials"
      )} through drawing, discussion, or simple written reflection.`
    case "comprehension":
      return `Comprehension center: Revisit ${selectTextFocus(
        blueprint,
        "grounded text or topic from the selected lesson materials"
      )} and use ${selectPracticeFocus(
        blueprint,
        "a simple understanding check"
      )} to show understanding.`
    case "writing_sentence_work":
      return `Writing / sentence work center: Use ${selectVocabularyFocus(
        blueprint,
        "grounded lesson vocabulary"
      )} and ${selectWordListFocus(
        blueprint,
        "grounded lesson words"
      )} in sentence-level writing.`
  }
}

function buildSelectedCenterFocusLines(
  blueprint: LessonBlueprint,
  outputContents: LessonOutputContents
): string[] {
  const focusOrder: CenterFocusKey[] = [
    "letter_identification",
    "phonological_awareness",
    "phonemic_awareness",
    "phonics",
    "high_frequency_words",
    "word_building",
    "vocabulary_oral_language",
    "handwriting_fine_motor",
    "decodable_reading",
    "fluency",
    "reading_response",
    "comprehension",
    "writing_sentence_work",
  ]

  return focusOrder
    .filter((focus) => outputContents.centers.focuses[focus])
    .map((focus) => buildCenterFocusLine(blueprint, focus))
}

function dedupeStrings(items: string[]): string[] {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)))
}

function buildLessonGroundingBlock(blueprint: LessonBlueprint): string {
  return [
    "Lesson at a Glance",
    `- Primary focus: ${blueprint.content.target.primary}`,
    `- Additional focus: ${blueprint.content.target.secondary ?? "None"}`,
    `- Lesson coverage: ${blueprint.content.target.isMixedTarget ? "Integrated focus" : "Single focus"}`,
    `- Standards: ${formatGroundingStandards(blueprint)}`,
    `- Curriculum source use: ${buildCurriculumSourceUseLine(blueprint)}`,
    `- Curriculum details used: ${buildCurriculumDetailsUsedLine(blueprint)}`,
    `- Teacher review needs: ${buildTeacherReviewNeedsLine(blueprint)}`,
    `- Vocabulary: ${joinOrFallback(
      getPackageDisplayValues(blueprint, "vocabulary", 4),
      REVIEW_VOCABULARY_STATUS
    )}`,
    `- Word examples: ${joinOrFallback(
      getPackageDisplayValues(blueprint, "wordList", 5),
      REVIEW_WORD_EXAMPLES_STATUS
    )}`,
    `- Text or topic: ${joinOrFallback(
      getPackageDisplayValues(blueprint, "text", 2),
      REVIEW_TEXT_STATUS
    )}`,
    `- Practice Ideas: ${joinOrFallback(
      getPackageDisplayValues(blueprint, "practice", 4),
      REVIEW_PRACTICE_STATUS
    )}`,
  ].join("\n")
}

function formatGroundingStandards(blueprint: LessonBlueprint): string {
  const standards = getPackageDisplayValues(blueprint, "standard", 3)
  return standards.length > 0 ? standards.join(", ") : "No grounded standard identified yet"
}

type CurriculumLaneStatus = NonNullable<
  LessonBlueprint["content"]["reviewStatus"]
>[keyof NonNullable<LessonBlueprint["content"]["reviewStatus"]>]

type CurriculumLaneKey = keyof NonNullable<LessonBlueprint["content"]["reviewStatus"]>

const CURRICULUM_LANE_LABELS: Record<CurriculumLaneKey, string> = {
  vocabulary: "vocabulary",
  wordLists: "word examples",
  texts: "text/topic",
  practiceIdeas: "practice tasks",
}

function buildCurriculumSourceUseLine(blueprint: LessonBlueprint): string {
  const selectedCount = blueprint.sourceReadiness.selectedCurriculumMaterialIds.length

  if (selectedCount === 0) {
    return "No curriculum source used; content comes from teacher inputs and generated defaults."
  }

  const groundedLanes = getCurriculumLanesByStatus(blueprint, ["reviewed", "extracted"])
  const reviewLanes = getCurriculumLanesByStatus(blueprint, ["review-needed", "blocked"])
  const sourceLabel = `${selectedCount} curriculum source${selectedCount === 1 ? "" : "s"}`

  if (groundedLanes.length === 0) {
    return `${sourceLabel} selected, but content lanes need teacher review before the curriculum can be treated as grounded.`
  }

  const groundedSummary = `${formatCurriculumLaneList(groundedLanes)} came from reviewed or extracted curriculum content`
  const reviewSummary =
    reviewLanes.length > 0 ? `; ${formatCurriculumLaneList(reviewLanes)} needs review` : ""

  return `${sourceLabel} selected; ${groundedSummary}${reviewSummary}.`
}

function buildCurriculumDetailsUsedLine(blueprint: LessonBlueprint): string {
  return [
    `vocabulary: ${joinOrFallback(
      getPackageDisplayValues(blueprint, "vocabulary", 3),
      REVIEW_VOCABULARY_STATUS
    )}`,
    `word examples: ${joinOrFallback(
      getPackageDisplayValues(blueprint, "wordList", 4),
      REVIEW_WORD_EXAMPLES_STATUS
    )}`,
    `text/topic: ${joinOrFallback(
      getPackageDisplayValues(blueprint, "text", 2),
      REVIEW_TEXT_STATUS
    )}`,
    `practice: ${joinOrFallback(
      getPackageDisplayValues(blueprint, "practice", 3),
      REVIEW_PRACTICE_STATUS
    )}`,
  ].join(" | ")
}

function buildTeacherReviewNeedsLine(blueprint: LessonBlueprint): string {
  if (blueprint.sourceReadiness.selectedCurriculumMaterialIds.length === 0) {
    return "Not needed for an input-only run."
  }

  const reviewNeeded = getCurriculumLanesByStatus(blueprint, ["review-needed"])
  const blocked = getCurriculumLanesByStatus(blueprint, ["blocked"])

  if (reviewNeeded.length === 0 && blocked.length === 0) {
    return "No required curriculum review flags for the content used in this package."
  }

  const messages: string[] = []

  if (reviewNeeded.length > 0) {
    messages.push(
      `Review ${formatCurriculumLaneList(reviewNeeded)} before treating that lane as fully source-grounded`
    )
  }

  if (blocked.length > 0) {
    messages.push(
      `Replace or clarify ${formatCurriculumLaneList(blocked)} before using that lane as curriculum-grounded content`
    )
  }

  return `${messages.join("; ")}.`
}

function getCurriculumLanesByStatus(
  blueprint: LessonBlueprint,
  statuses: CurriculumLaneStatus[]
): string[] {
  const reviewStatus = blueprint.content.reviewStatus

  if (!reviewStatus) {
    return []
  }

  return (Object.entries(reviewStatus) as Array<[CurriculumLaneKey, CurriculumLaneStatus]>)
    .filter(([, status]) => statuses.includes(status))
    .map(([key]) => CURRICULUM_LANE_LABELS[key])
}

function formatCurriculumLaneList(lanes: string[]): string {
  if (lanes.length === 0) {
    return "no curriculum lanes"
  }

  if (lanes.length === 1) {
    return lanes[0]
  }

  if (lanes.length === 2) {
    return `${lanes[0]} and ${lanes[1]}`
  }

  return `${lanes.slice(0, -1).join(", ")}, and ${lanes[lanes.length - 1]}`
}

function buildSectionNarrativeBlock(
  title: string,
  contextLines: string[],
  steps: string[]
): string {
  const details = contextLines.map((line) => `- ${line}`)
  const body = steps.map((step) => `- ${step}`)

  return [title, ...details, ...body].join("\n")
}

function selectModelResources(blueprint: LessonBlueprint): string {
  const primary = blueprint.content.target.primary.toLowerCase()

  if (primary === "phonics") {
    return joinOrFallback(
      getPackageDisplayValues(blueprint, "wordList", 4),
      "grounded word examples from the selected lesson materials"
    )
  }

  if (primary === "comprehension") {
    return joinOrFallback(
      getPackageDisplayValues(blueprint, "text", 2),
      "grounded text from the selected lesson materials"
    )
  }

  return joinOrFallback(
    [
      ...getPackageDisplayValues(blueprint, "wordList", 2),
      ...getPackageDisplayValues(blueprint, "text", 1),
    ],
    "grounded examples from the selected lesson materials"
  )
}

function selectIndependentResources(blueprint: LessonBlueprint): string {
  const primary = blueprint.content.target.primary.toLowerCase()

  if (primary === "phonics") {
    return joinOrFallback(
      getPackageDisplayValues(blueprint, "wordList", 3),
      "grounded examples for student transfer"
    )
  }

  if (primary === "comprehension") {
    return joinOrFallback(
      getPackageDisplayValues(blueprint, "text", 2),
      "lesson text for student response"
    )
  }

  return joinOrFallback(
    [
      ...getPackageDisplayValues(blueprint, "practice", 2),
      ...getPackageDisplayValues(blueprint, "text", 1),
    ],
    "independent lesson resources"
  )
}

function selectClosureResources(blueprint: LessonBlueprint): string {
  const primary = blueprint.content.target.primary.toLowerCase()

  if (primary === "phonics") {
    return joinOrFallback(
      getPackageDisplayValues(blueprint, "wordList", 3),
      "grounded review examples"
    )
  }

  return joinOrFallback(
    getPackageDisplayValues(blueprint, "vocabulary", 3),
    "grounded lesson vocabulary"
  )
}

function buildPlanningBlock(planningIdeas?: LessonPlanningIdeas): string {
  if (!planningIdeas) {
    return ""
  }

  const planningLines = planningIdeas.lessonPlanSections.flatMap((section) => [
    `${section.title}`,
    ...section.ideas.map((idea) => `- ${idea.title}: ${idea.description}`),
  ])

  if (planningLines.length === 0) {
    return ""
  }

  return ["Planning Notes", ...planningLines].join("\n")
}

function buildSupportBlock(
  blueprint: LessonBlueprint,
  planningIdeas?: LessonPlanningIdeas,
  missingAreaDecisions: MissingAreaDecisionMap = {},
  supportOutputs: SupportBlockOutputOptions = {
    outputContents: createDefaultOutputContents(),
    includeSmallGroupOutput: true,
    includeInterventionOutput: true,
  }
): string {
  const { outputContents, includeSmallGroupOutput, includeInterventionOutput } = supportOutputs

  const sections: string[] = []

  if (outputContents.assessment.selected) {
    const assessmentSelections = buildSelectedAssessmentLabels(outputContents).map(
      (label) => `- ${label}`
    )
    const formativeIdeas = planningIdeas?.formativeAssessmentIdeas.map(
      (idea) => `- ${idea.title}: ${idea.description}`
    ) ?? []

    sections.push(
      "Assessment",
      ...assessmentSelections,
      ...formativeIdeas,
      "- Answer keys generate automatically where applicable."
    )
  }

  const smallGroup = includeSmallGroupOutput
    ? resolveDecisionAwareList({
        component: "small_group",
        plannedItems: planningIdeas?.smallGroupIdeas.map(
          (idea) => `- ${idea.title}: ${idea.description}`
        ) ?? [],
        missingAreaDecisions,
        addFallbackItems: [`- ${buildAddSmallGroupSupportLine(blueprint)}`],
      })
    : []

  const interventions = includeInterventionOutput
    ? resolveDecisionAwareList({
        component: "intervention",
        plannedItems: planningIdeas?.interventionIdeas.map(
          (idea) => `- ${idea.title}: ${idea.description}`
        ) ?? [],
        missingAreaDecisions,
        addFallbackItems: buildAddFallbackInterventions(blueprint).map(
          (item) => `- ${item}`
        ),
      })
    : []

  if (smallGroup.length > 0) {
    sections.push(
      "Teacher-Led Support",
      `- Requested tiers: ${buildSelectedSmallGroupTierSummary(outputContents)}`,
      `- Flow: ${buildScopedFlowCue(blueprint, "small_group")}`,
      buildScopedPromptCue(blueprint, "small_group")
        ? `- Prompts: ${buildScopedPromptCue(blueprint, "small_group")}`
        : "",
      ...smallGroup
    )
  }

  if (interventions.length > 0) {
    sections.push(
      "Intervention Support",
      `- Flow: ${buildScopedFlowCue(blueprint, "intervention")}`,
      buildScopedPromptCue(blueprint, "intervention")
        ? `- Prompts: ${buildScopedPromptCue(blueprint, "intervention")}`
        : "",
      ...interventions
    )
  }

  return sections.filter(Boolean).length > 0 ? sections.filter(Boolean).join("\n") : ""
}

function buildCenters(
  blueprint: LessonBlueprint,
  spec: LessonSpec,
  planningIdeas: LessonPlanningIdeas | undefined,
  missingAreaDecisions: MissingAreaDecisionMap = {},
  outputContents: LessonOutputContents
): string[] {
  const plannedItems = outputContents.centers.options.use_what_you_have
    ? planningIdeas?.centerIdeas.map((idea) => `${idea.title}: ${idea.description}`) ?? []
    : []

  const generatedItems = outputContents.centers.options.create_new_center_activities
    ? buildGroundedCenterDefaults(blueprint, spec)
    : []

  const focusItems = buildSelectedCenterFocusLines(blueprint, outputContents)

  const requestedItems = dedupeStrings([
    ...plannedItems,
    ...generatedItems,
    ...focusItems,
  ])

  if (shouldLeaveOut("centers", missingAreaDecisions)) {
    return []
  }

  if (requestedItems.length > 0) {
    return requestedItems
  }

  if (shouldAdd("centers", missingAreaDecisions)) {
    return buildGroundedCenterDefaults(blueprint, spec)
  }

  if (outputContents.centers.options.use_what_you_have) {
    return buildGroundedCenterDefaults(blueprint, spec)
  }

  return []
}

function buildRotationPlan(
  blueprint: LessonBlueprint,
  centers: string[],
  planningIdeas?: LessonPlanningIdeas,
  missingAreaDecisions: MissingAreaDecisionMap = {},
  options: {
    includeTeacherLedSupport: boolean
  } = {
    includeTeacherLedSupport: true,
  }
): string {
  const rotationLines = centers.map(
    (center, index) => `Rotation ${index + 1}: ${center}`
  )
  const centerCue = `Rotation Structure Cue: ${buildScopedFlowCue(blueprint, "centers")}`

  if (!options.includeTeacherLedSupport) {
    return rotationLines.join("\n")
  }

  const teacherLedSupportLine = resolveTeacherTableLine(
    blueprint,
    planningIdeas,
    missingAreaDecisions
  )

  if (rotationLines.length === 0) {
    return teacherLedSupportLine
  }

  if (!teacherLedSupportLine) {
    return rotationLines.join("\n")
  }

  return [
    ...rotationLines,
    teacherLedSupportLine,
  ].join("\n")
}

function buildInterventions(
  blueprint: LessonBlueprint,
  planningIdeas?: LessonPlanningIdeas,
  missingAreaDecisions: MissingAreaDecisionMap = {}
): string[] {
  return resolveDecisionAwareList({
    component: "intervention",
    plannedItems:
      planningIdeas?.interventionIdeas.map(
        (idea) => `${idea.title}: ${idea.description}`
      ) ?? [],
    missingAreaDecisions,
    addFallbackItems: buildAddFallbackInterventions(blueprint),
    defaultItems: buildDefaultInterventions(blueprint),
  })
}

function buildGroundedCenterDefaults(
  blueprint: LessonBlueprint,
  spec: LessonSpec
): string[] {
  const isMixed = blueprint.content.target.isMixedTarget
  const primary = blueprint.content.target.primary.toLowerCase()
  const labels = resolveCenterLabels(
    spec,
    isMixed
      ? ["Word work center", "Reading response center", "Vocabulary connection center"]
      : primary === "phonics"
        ? ["Word work center", "Partner practice center", "Independent practice center"]
        : ["Reading response center", "Partner discussion center", "Independent response center"]
  )

  if (isMixed) {
    return [
      `${labels[0]}: Practice the foundational skill with ${selectWordListFocus(
        blueprint,
        "teacher-selected examples"
      )}.`,
      `${labels[1]}: Revisit ${selectTextFocus(
        blueprint,
        "grounded text or topic from the selected lesson materials"
      )} through this task: ${selectPracticeFocus(blueprint, "a grounded practice task from the selected lesson materials")}.`,
      `${labels[2]}: Connect word work and meaning using ${selectVocabularyFocus(
        blueprint,
        "grounded lesson vocabulary"
      )}.`,
    ]
  }

  if (primary === "phonics") {
    return [
      `${labels[0]}: Sort, read, and revisit ${selectWordListFocus(
        blueprint,
        "target words"
      )}.`,
      `${labels[1]}: Use this practice: ${selectPracticeFocus(
        blueprint,
        "partner decoding and word reading"
      )}.`,
      `${labels[2]}: Reinforce the target phonics pattern with ${selectWordListFocus(
        blueprint,
        "target words"
      )} during independent review.`,
    ]
  }

  return [
    `${labels[0]}: Reread ${selectTextFocus(
      blueprint,
      "No grounded text or topic surfaced yet"
    )} and talk through the key thinking.`,
    `${labels[1]}: Use this task during partner work: ${selectPracticeFocus(
      blueprint,
      "partner discussion"
    )}.`,
    `${labels[2]}: Reinforce ${selectVocabularyFocus(
      blueprint,
      "No grounded vocabulary surfaced yet"
    )} while revisiting ${selectTextFocus(blueprint, "grounded text or topic from the selected lesson materials")}.`,
  ]
}

function buildScopedFlowCue(blueprint: LessonBlueprint, scope: "centers" | "small_group" | "intervention"): string {
  const shell = resolveTemplateShell(blueprint, {
    scope,
    lessonSegmentsCount: 4,
    promptStyleCount: 2,
    teacherMovesCount: 2,
    toneCount: 1,
  })

  return joinOrFallback(shell.lessonSegments.slice(0, 3), "Default support flow")
}

function buildScopedPromptCue(blueprint: LessonBlueprint, scope: "small_group" | "intervention"): string {
  const shell = resolveTemplateShell(blueprint, {
    scope,
    lessonSegmentsCount: 4,
    promptStyleCount: 2,
    teacherMovesCount: 2,
    toneCount: 1,
  })

  return shell.promptStyle
    .slice(0, 2)
    .map((prompt) => prompt.trim())
    .filter(Boolean)
    .filter((prompt) => !/^teacher prompt$/i.test(prompt))
    .join(", ")
}

function buildAddFallbackInterventions(blueprint: LessonBlueprint): string[] {
  const isMixed = blueprint.content.target.isMixedTarget
  const primary = blueprint.content.target.primary.toLowerCase()

  if (isMixed) {
    return [
      `Add a targeted intervention block with ${selectWordListFocus(
        blueprint,
        "teacher-selected examples"
      )}.`,
      `Reconnect the text task using ${selectTextFocus(
        blueprint,
        "grounded text or topic from the selected lesson materials"
      )} and ${selectVocabularyFocus(blueprint, "grounded lesson vocabulary")}.`,
    ]
  }

  if (primary === "phonics") {
    return [
      `Add a targeted intervention block using ${selectWordListFocus(
        blueprint,
        "target words"
      )}.`,
      `Use ${selectPracticeFocus(
        blueprint,
        "guided decoding and blending practice"
      )} for extra guided decoding and blending practice.`,
    ]
  }

  return [
    `Add a targeted intervention block using ${selectTextFocus(
      blueprint,
      "No grounded text or topic surfaced yet"
    )}.`,
    `Reinforce ${selectVocabularyFocus(
      blueprint,
      "No grounded vocabulary surfaced yet"
    )} through this practice: ${selectPracticeFocus(blueprint, "guided response work")}.`,
  ]
}

function buildDefaultInterventions(blueprint: LessonBlueprint): string[] {
  const isMixed = blueprint.content.target.isMixedTarget
  const primary = blueprint.content.target.primary.toLowerCase()

  if (isMixed) {
    return [
      `Reteach the foundational skill with ${selectWordListFocus(
        blueprint,
        "teacher-selected examples"
      )}.`,
      `Reconnect the text task using ${selectTextFocus(
        blueprint,
        "grounded text or topic from the selected lesson materials"
      )} and ${selectVocabularyFocus(blueprint, "grounded lesson vocabulary")}.`,
    ]
  }

  if (primary === "phonics") {
    return [
      `Reteach the target phonics pattern with ${selectWordListFocus(
        blueprint,
        "target words"
      )}.`,
      `Provide extra guided decoding and blending practice with ${selectPracticeFocus(
        blueprint,
        "guided decoding and blending practice"
      )}.`,
    ]
  }

  return [
    `Reread ${selectTextFocus(blueprint, "grounded text or topic from the selected lesson materials")} with guided prompting.`,
    `Reinforce ${selectVocabularyFocus(
      blueprint,
      "No grounded vocabulary surfaced yet"
    )} through this practice: ${selectPracticeFocus(blueprint, "guided response work")}.`,
  ]
}

function buildAddSmallGroupSupportLine(blueprint: LessonBlueprint): string {
  const isMixed = blueprint.content.target.isMixedTarget
  const primary = blueprint.content.target.primary.toLowerCase()

  if (isMixed) {
    return `Teacher-Led Support: Add a targeted small-group block that connects ${selectWordListFocus(
      blueprint,
      "No grounded word examples surfaced yet"
    )} to ${selectTextFocus(
      blueprint,
      "No grounded text or topic surfaced yet"
    )} through this practice: ${selectPracticeFocus(blueprint, "a grounded practice task from the selected lesson materials")}.`
  }

  if (primary === "phonics") {
    return `Teacher-Led Support: Add a targeted phonics reteach using ${selectWordListFocus(
      blueprint,
      "target words"
    )} and guide students through this practice: ${selectPracticeFocus(
      blueprint,
      "guided decoding and blending practice"
    )}.`
  }

  return `Teacher-Led Support: Add a guided small-group reread using ${selectTextFocus(
    blueprint,
    "grounded text or topic from the selected lesson materials"
  )} and reinforce ${selectVocabularyFocus(
    blueprint,
    "grounded lesson vocabulary"
  )} through this practice: ${selectPracticeFocus(blueprint, "guided response work")}.`
}

function resolveTeacherTableLine(
  blueprint: LessonBlueprint,
  planningIdeas?: LessonPlanningIdeas,
  missingAreaDecisions: MissingAreaDecisionMap = {}
): string {
  if (shouldLeaveOut("small_group", missingAreaDecisions)) {
    return ""
  }

  const firstSmallGroupIdea = planningIdeas?.smallGroupIdeas[0]

  if (firstSmallGroupIdea) {
    return `Teacher-Led Support Focus: ${firstSmallGroupIdea.title} - ${firstSmallGroupIdea.description}`
  }

  if (shouldAdd("small_group", missingAreaDecisions)) {
    return buildAddTeacherTableLine(blueprint)
  }

  return buildDefaultTeacherTableLine(blueprint)
}

function buildAddTeacherTableLine(blueprint: LessonBlueprint): string {
  const isMixed = blueprint.content.target.isMixedTarget
  const primary = blueprint.content.target.primary.toLowerCase()

  if (isMixed) {
    return `Teacher-Led Support Focus: Add a targeted small-group block that connects ${selectWordListFocus(
      blueprint,
      "No grounded word examples surfaced yet"
    )} to ${selectTextFocus(
      blueprint,
      "No grounded text or topic surfaced yet"
    )} through this practice: ${selectPracticeFocus(blueprint, "a grounded practice task from the selected lesson materials")}.`
  }

  if (primary === "phonics") {
    return `Teacher-Led Support Focus: Add a targeted phonics reteach using ${selectWordListFocus(
      blueprint,
      "target words"
    )} and guide students through this practice: ${selectPracticeFocus(
      blueprint,
      "guided decoding and blending practice"
    )}.`
  }

  return `Teacher-Led Support Focus: Add a guided small-group reread using ${selectTextFocus(
    blueprint,
    "grounded text or topic from the selected lesson materials"
  )} and reinforce ${selectVocabularyFocus(
    blueprint,
    "grounded lesson vocabulary"
  )} through this practice: ${selectPracticeFocus(blueprint, "guided response work")}.`
}

function buildDefaultTeacherTableLine(blueprint: LessonBlueprint): string {
  const isMixed = blueprint.content.target.isMixedTarget
  const primary = blueprint.content.target.primary.toLowerCase()

  if (isMixed) {
    return `Teacher-Led Support Focus: Support both word work and meaning using ${selectWordListFocus(
      blueprint,
      "No grounded word examples surfaced yet"
    )} and ${selectTextFocus(
      blueprint,
      "No grounded text or topic surfaced yet"
    )} through this practice: ${selectPracticeFocus(blueprint, "a grounded practice task from the selected lesson materials")}.`
  }

  if (primary === "phonics") {
    return `Teacher-Led Support Focus: Reteach the target phonics pattern with ${selectWordListFocus(
      blueprint,
      "target words"
    )} and guide students through this practice: ${selectPracticeFocus(
      blueprint,
      "guided decoding and blending practice"
    )}.`
  }

  return `Teacher-Led Support Focus: Reread ${selectTextFocus(
    blueprint,
    "grounded text or topic from the selected lesson materials"
  )} and reinforce ${selectVocabularyFocus(
    blueprint,
    "grounded lesson vocabulary"
  )} through this practice: ${selectPracticeFocus(blueprint, "guided response work")}.`
}

function resolveDecisionAwareList(options: DecisionAwareListOptions): string[] {
  const {
    component,
    plannedItems = [],
    missingAreaDecisions = {},
    addFallbackItems = [],
    defaultItems = [],
  } = options

  if (shouldLeaveOut(component, missingAreaDecisions)) {
    return []
  }

  if (plannedItems.length > 0) {
    return plannedItems
  }

  if (shouldAdd(component, missingAreaDecisions)) {
    return addFallbackItems
  }

  return defaultItems
}

function shouldAdd(
  component: PlanningComponentKey,
  missingAreaDecisions: MissingAreaDecisionMap
): boolean {
  return missingAreaDecisions[component] === "add"
}

function shouldLeaveOut(
  component: PlanningComponentKey,
  missingAreaDecisions: MissingAreaDecisionMap
): boolean {
  return missingAreaDecisions[component] === "leave_out"
}

function normalizeToneCue(value: string): string {
  const cleaned = value.trim()
  if (cleaned.length === 0) {
    return "clear, supportive tone"
  }

  const withoutRepeat = collapseRepeatedWords(cleaned)
  return /\btone\b/i.test(withoutRepeat) ? withoutRepeat : `${withoutRepeat} tone`
}

function sanitizeTeacherFacingText(text: string): string {
  return text
    .replace(/\b(\w+)\s+\1\b/gi, "$1")
    .replace(/\btone\s+tone\b/gi, "tone")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function collapseRepeatedWords(value: string): string {
  return value.replace(/\b(\w+)\s+\1\b/gi, "$1")
}

function joinOrFallback(items: string[], fallback: string): string {
  const cleaned = Array.from(
    new Set((items ?? []).map((item) => item.trim()).filter((item) => item.length > 0))
  )

  return cleaned.length > 0 ? cleaned.join(", ") : fallback
}



