import {
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
} from "../types"
import { assembleSlideDeck } from "../slides/assembleSlideDeck"

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

  const slides = includeLessonSlidesOutput ? buildSlides(blueprint, spec) : []
  const lessonPlan = includeLessonPlanOutput
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
  const centers = includeCentersOutput
    ? buildCenters(blueprint, spec, planningIdeas, missingAreaDecisions)
    : []
  const rotationPlan =
    includeSmallGroupOutput
      ? buildRotationPlan(
          blueprint,
          centers,
          planningIdeas,
          missingAreaDecisions,
          {
            includeTeacherLedSupport: true,
          }
        )
      : includeCentersOutput && centers.length > 0
        ? buildRotationPlan(
            blueprint,
            centers,
            planningIdeas,
            missingAreaDecisions,
            {
              includeTeacherLedSupport: false,
            }
          )
        : ""
  const interventions = includeInterventionOutput
    ? buildInterventions(
        blueprint,
        planningIdeas,
        missingAreaDecisions
      )
    : []
  const exports = buildExports(
    inputs,
    slides,
    lessonPlan,
    centers,
    rotationPlan,
    interventions,
    {
      includeLessonSlidesExport: includeLessonSlidesOutput,
      includeLessonPlanExport: includeLessonPlanOutput,
      includePrintablesExport: outputContents.other.printables,
    }
  )

  return {
    slides,
    lessonPlan,
    centers,
    rotationPlan,
    interventions,
    exports,
  }
}

function buildSlides(blueprint: LessonBlueprint, spec: LessonSpec): string[] {
  const assembled = assembleSlideDeck(blueprint, spec)

  if (assembled.length > 0) {
    return assembled
  }

  const shell = blueprint.structure.templateShell.slideShell

  if (shell.length === 0) {
    return [
      "Slide 1: Opening - Introduce the lesson target and objective.",
      "Slide 2: Teach - Model the focus skill with curriculum-aligned content.",
      "Slide 3: Practice - Guide students into supported application.",
      "Slide 4: Closure - Review learning and check understanding.",
    ]
  }

  return shell.map((label, index) => `Slide ${index + 1}: ${label}`)
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

  const header = [
    `Grade: ${inputs.grade}`,
    `Subject: ${inputs.subject}`,
    `Standard: ${inputs.standard}`,
    `Skill: ${inputs.skill}`,
    `Topic: ${inputs.topic}`,
    `Duration: ${inputs.duration}`,
  ].join("\n")

  const groundingBlock = buildLessonGroundingBlock(blueprint)
  const readinessBlock = buildBlueprintReadinessBlock(blueprint)
  const coverageBlock = buildCoverageDecisionBlock(planningIdeas, missingAreaDecisions)

  const teachBlock = isLessonPlanPartSelected(outputContents, "teach")
    ? buildSectionNarrativeBlock(spec.teach.title, [
    `Model Resources: ${selectModelResources(blueprint)}`,
    `Teacher Moves: ${joinOrFallback(
      blueprint.structure.teacherMoves.slice(0, 3),
      "teacher model, guided support"
    )}`,
    `Slide Shell Cue: ${joinOrFallback(
      blueprint.structure.templateShell.slideShell.slice(0, 3),
      "Objective -> Teach -> Guided Practice"
    )}`,
  ], spec.teach.steps)
    : ""

  const guidedBlock = isLessonPlanPartSelected(outputContents, "guided_practice")
    ? buildSectionNarrativeBlock(spec.guidedPractice.title, [
    `Practice Anchor: ${joinOrFallback(
      blueprint.content.practiceIdeas.slice(0, 3),
      "curriculum-aligned guided practice"
    )}`,
    `Prompt Style: ${joinOrFallback(
      blueprint.structure.promptStyle.slice(0, 3),
      "teacher prompt"
    )}`,
    `Timing Cue: ${joinOrFallback(
      blueprint.structure.templateShell.timingShell.slice(0, 3),
      "Mini-lesson | Practice | Closure"
    )}`,
  ], spec.guidedPractice.steps)
    : ""

  const independentBlock = isLessonPlanPartSelected(outputContents, "independent_practice")
    ? buildSectionNarrativeBlock(spec.independentPractice.title, [
    `Transfer Task: ${selectIndependentResources(blueprint)}`,
    `Student Practice: ${joinOrFallback(
      blueprint.content.practiceIdeas.slice(0, 2),
      "independent application"
    )}`,
  ], spec.independentPractice.steps)
    : ""

  const centersBlock = includeCentersOutput
    ? buildSectionNarrativeBlock(
        spec.centers.title,
        [
          `Rotation Focus: ${joinOrFallback(
            planningIdeas?.centerIdeas.map((idea) => idea.title).slice(0, 3) ?? [],
            "student-independent practice, partner practice, independent application"
          )}`,
        ],
        resolveCenterNarrativeSteps(spec)
      )
    : ""

  const closureBlock = isLessonPlanPartSelected(outputContents, "closure")
    ? buildSectionNarrativeBlock(spec.closure.title, [
    `Review Focus: ${selectClosureResources(blueprint)}`,
    `Delivery Tone: ${joinOrFallback(
      blueprint.structure.tone.slice(0, 2),
      "clear instructional tone"
    )}`,
  ], spec.closure.steps)
    : ""

  const planningBlock = buildPlanningBlock(planningIdeas)
  const supportBlock = buildSupportBlock(
    blueprint,
    planningIdeas,
    missingAreaDecisions,
    {
      includeSmallGroupOutput,
      includeInterventionOutput,
    }
  )

  return [
    header,
    groundingBlock,
    readinessBlock,
    coverageBlock,
    teachBlock,
    guidedBlock,
    independentBlock,
    centersBlock,
    closureBlock,
    planningBlock,
    supportBlock,
  ]
    .filter(Boolean)
    .join("\n\n")
}

function buildLessonGroundingBlock(blueprint: LessonBlueprint): string {
  return [
    "Lesson Grounding",
    `- Primary Target: ${blueprint.content.target.primary}`,
    `- Secondary Target: ${blueprint.content.target.secondary ?? "None"}`,
    `- Mixed Target: ${blueprint.content.target.isMixedTarget ? "Yes" : "No"}`,
    `- Source Balance: ${blueprint.sourceReadiness.overall}`,
    `- Standards: ${joinOrFallback(
      blueprint.content.standards.slice(0, 3),
      "teacher-selected standard"
    )}`,
    `- Vocabulary: ${joinOrFallback(
      blueprint.content.vocabulary.slice(0, 4),
      "key vocabulary"
    )}`,
    `- Word List: ${joinOrFallback(
      blueprint.content.wordLists.slice(0, 5),
      "teacher-selected examples"
    )}`,
    `- Texts: ${joinOrFallback(
      blueprint.content.texts.slice(0, 2),
      "teacher-provided text"
    )}`,
    `- Practice Ideas: ${joinOrFallback(
      blueprint.content.practiceIdeas.slice(0, 4),
      "guided practice"
    )}`,
    `- Exemplar Segment Order: ${joinOrFallback(
      blueprint.structure.templateShell.segmentOrder.slice(0, 6),
      "Teach -> Practice -> Closure"
    )}`,
    `- Exemplar Slide Shell: ${joinOrFallback(
      blueprint.structure.templateShell.slideShell.slice(0, 6),
      "Objective -> Teach -> Guided Practice -> Closure"
    )}`,
    `- Exemplar Teacher Moves: ${joinOrFallback(
      blueprint.structure.teacherMoves.slice(0, 4),
      "teacher model, guided support"
    )}`,
    `- Exemplar Prompt Style: ${joinOrFallback(
      blueprint.structure.promptStyle.slice(0, 4),
      "teacher prompt"
    )}`,
    `- Exemplar Tone: ${joinOrFallback(
      blueprint.structure.tone.slice(0, 2),
      "clear instructional tone"
    )}`,
  ].join("\n")
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
      blueprint.content.wordLists.slice(0, 4),
      "teacher-selected word examples"
    )
  }

  if (primary === "comprehension") {
    return joinOrFallback(
      blueprint.content.texts.slice(0, 2),
      "teacher-selected text"
    )
  }

  return joinOrFallback(
    [
      ...blueprint.content.wordLists.slice(0, 2),
      ...blueprint.content.texts.slice(0, 1),
    ],
    "teacher-selected lesson resources"
  )
}

function selectIndependentResources(blueprint: LessonBlueprint): string {
  const primary = blueprint.content.target.primary.toLowerCase()

  if (primary === "phonics") {
    return joinOrFallback(
      blueprint.content.wordLists.slice(0, 3),
      "target words for student transfer"
    )
  }

  if (primary === "comprehension") {
    return joinOrFallback(
      blueprint.content.texts.slice(0, 2),
      "lesson text for student response"
    )
  }

  return joinOrFallback(
    [
      ...blueprint.content.practiceIdeas.slice(0, 2),
      ...blueprint.content.texts.slice(0, 1),
    ],
    "independent lesson resources"
  )
}

function selectClosureResources(blueprint: LessonBlueprint): string {
  const primary = blueprint.content.target.primary.toLowerCase()

  if (primary === "phonics") {
    return joinOrFallback(
      blueprint.content.wordLists.slice(0, 3),
      "strong word examples"
    )
  }

  return joinOrFallback(
    blueprint.content.vocabulary.slice(0, 3),
    "key lesson vocabulary"
  )
}

function buildCoverageDecisionBlock(
  planningIdeas?: LessonPlanningIdeas,
  missingAreaDecisions: MissingAreaDecisionMap = {}
): string {
  if (!planningIdeas) {
    return ""
  }

  const coverageLines =
    planningIdeas.componentCoverage?.flatMap((entry) => {
      const evidence =
        entry.evidence.length > 0 ? ` Evidence: ${entry.evidence.join(", ")}.` : ""

      return [
        `- ${formatCoverageLabel(entry.component)}: ${entry.status}. ${entry.rationale}${evidence}`,
      ]
    }) ?? []

  const promptLines =
    planningIdeas.missingAreaPrompts?.map((prompt) => {
      const currentDecision = missingAreaDecisions[prompt.component] ?? "undecided"
      return `- ${formatCoverageLabel(prompt.component)} (${prompt.importance}): ${prompt.prompt} Current decision: ${formatDecisionLabel(currentDecision)}.`
    }) ?? []

  if (coverageLines.length === 0 && promptLines.length === 0) {
    return ""
  }

  const sections: string[] = []

  if (coverageLines.length > 0) {
    sections.push("Coverage Decisions", ...coverageLines)
  }

  if (promptLines.length > 0) {
    sections.push("Missing-Area Prompts", ...promptLines)
  }

  return sections.join("\n")
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
    includeSmallGroupOutput: true,
    includeInterventionOutput: true,
  }
): string {
  if (!planningIdeas) {
    return ""
  }

  const { includeSmallGroupOutput, includeInterventionOutput } = supportOutputs

  const formative = planningIdeas.formativeAssessmentIdeas.map(
    (idea) => `- ${idea.title}: ${idea.description}`
  )

  const smallGroup = includeSmallGroupOutput
    ? resolveDecisionAwareList({
        component: "small_group",
        plannedItems: planningIdeas.smallGroupIdeas.map(
          (idea) => `- ${idea.title}: ${idea.description}`
        ),
        missingAreaDecisions,
        addFallbackItems: [`- ${buildAddSmallGroupSupportLine(blueprint)}`],
      })
    : []

  const interventions = includeInterventionOutput
    ? resolveDecisionAwareList({
        component: "intervention",
        plannedItems: planningIdeas.interventionIdeas.map(
          (idea) => `- ${idea.title}: ${idea.description}`
        ),
        missingAreaDecisions,
        addFallbackItems: buildAddFallbackInterventions(blueprint).map(
          (item) => `- ${item}`
        ),
      })
    : []

  const sections: string[] = []

  if (formative.length > 0) {
    sections.push("Formative Assessment Ideas", ...formative)
  }

  if (smallGroup.length > 0) {
    sections.push("Teacher-Led Support", ...smallGroup)
  }

  if (interventions.length > 0) {
    sections.push("Intervention Support", ...interventions)
  }

  return sections.length > 0 ? sections.join("\n") : ""
}

function buildBlueprintReadinessBlock(blueprint: LessonBlueprint): string {
  const warnings = blueprint.sourceReadiness.warnings.map((warning) => `- ${warning}`)

  return [
    "Blueprint Readiness",
    `- Curriculum Support: ${blueprint.sourceReadiness.curriculumSupport}`,
    `- Exemplar Support: ${blueprint.sourceReadiness.exemplarSupport}`,
    `- Overall Balance: ${blueprint.sourceReadiness.overall}`,
    ...warnings,
  ].join("\n")
}

function buildCenters(
  blueprint: LessonBlueprint,
  spec: LessonSpec,
  planningIdeas?: LessonPlanningIdeas,
  missingAreaDecisions: MissingAreaDecisionMap = {}
): string[] {
  const groundedDefaults = buildGroundedCenterDefaults(blueprint, spec)

  return resolveDecisionAwareList({
    component: "centers",
    plannedItems:
      planningIdeas?.centerIdeas.map((idea) => `${idea.title}: ${idea.description}`) ?? [],
    missingAreaDecisions,
    addFallbackItems: groundedDefaults,
    defaultItems: groundedDefaults,
  })
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

  if (!options.includeTeacherLedSupport) {
    return rotationLines.join("\n")
  }

  const smallGroupLine = resolveTeacherTableLine(
    blueprint,
    planningIdeas,
    missingAreaDecisions
  )

  if (rotationLines.length === 0) {
    return [
      "No centers defined.",
      smallGroupLine,
    ].join("\n")
  }

  return [
    ...rotationLines,
    smallGroupLine,
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
        "teacher-provided text"
      )} through this task: ${selectPracticeFocus(blueprint, "guided practice")}.`,
      `${labels[2]}: Connect word work and meaning using ${selectVocabularyFocus(
        blueprint,
        "key vocabulary"
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
      "teacher-provided text"
    )} and talk through the key thinking.`,
    `${labels[1]}: Use this task during partner work: ${selectPracticeFocus(
      blueprint,
      "partner discussion"
    )}.`,
    `${labels[2]}: Reinforce ${selectVocabularyFocus(
      blueprint,
      "key vocabulary"
    )} while revisiting ${selectTextFocus(blueprint, "teacher-provided text")}.`,
  ]
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
        "teacher-provided text"
      )} and ${selectVocabularyFocus(blueprint, "key vocabulary")}.`,
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
      "teacher-provided text"
    )}.`,
    `Reinforce ${selectVocabularyFocus(
      blueprint,
      "key vocabulary"
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
        "teacher-provided text"
      )} and ${selectVocabularyFocus(blueprint, "key vocabulary")}.`,
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
    `Reread ${selectTextFocus(blueprint, "teacher-provided text")} with guided prompting.`,
    `Reinforce ${selectVocabularyFocus(
      blueprint,
      "key vocabulary"
    )} through this practice: ${selectPracticeFocus(blueprint, "guided response work")}.`,
  ]
}

function buildAddSmallGroupSupportLine(blueprint: LessonBlueprint): string {
  const isMixed = blueprint.content.target.isMixedTarget
  const primary = blueprint.content.target.primary.toLowerCase()

  if (isMixed) {
    return `Teacher-Led Support: Add a targeted small-group block that connects ${selectWordListFocus(
      blueprint,
      "teacher-selected examples"
    )} to ${selectTextFocus(
      blueprint,
      "teacher-provided text"
    )} through this practice: ${selectPracticeFocus(blueprint, "guided practice")}.`
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
    "teacher-provided text"
  )} and reinforce ${selectVocabularyFocus(
    blueprint,
    "key vocabulary"
  )} through this practice: ${selectPracticeFocus(blueprint, "guided response work")}.`
}

function resolveTeacherTableLine(
  blueprint: LessonBlueprint,
  planningIdeas?: LessonPlanningIdeas,
  missingAreaDecisions: MissingAreaDecisionMap = {}
): string {
  if (shouldLeaveOut("small_group", missingAreaDecisions)) {
    return "Teacher-Led Support Focus: No small-group block selected."
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
      "teacher-selected examples"
    )} to ${selectTextFocus(
      blueprint,
      "teacher-provided text"
    )} through this practice: ${selectPracticeFocus(blueprint, "guided practice")}.`
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
    "teacher-provided text"
  )} and reinforce ${selectVocabularyFocus(
    blueprint,
    "key vocabulary"
  )} through this practice: ${selectPracticeFocus(blueprint, "guided response work")}.`
}

function buildDefaultTeacherTableLine(blueprint: LessonBlueprint): string {
  const isMixed = blueprint.content.target.isMixedTarget
  const primary = blueprint.content.target.primary.toLowerCase()

  if (isMixed) {
    return `Teacher-Led Support Focus: Support both word work and meaning using ${selectWordListFocus(
      blueprint,
      "teacher-selected examples"
    )} and ${selectTextFocus(
      blueprint,
      "teacher-provided text"
    )} through this practice: ${selectPracticeFocus(blueprint, "guided practice")}.`
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
    "teacher-provided text"
  )} and reinforce ${selectVocabularyFocus(
    blueprint,
    "key vocabulary"
  )} through this practice: ${selectPracticeFocus(blueprint, "guided response work")}.`
}

function resolveCenterLabels(spec: LessonSpec, fallbackLabels: string[]): string[] {
  const rawLabels = takeClean(spec.centers.steps, 6)
    .filter(isStudentIndependentCenterLine)
    .map((item) => {
      const lower = item.toLowerCase()
      return lower.includes("center") ? item : ""
    })
    .filter(Boolean)
    .slice(0, 3)

  return fallbackLabels.map((defaultLabel, index) => rawLabels[index] || defaultLabel)
}

function resolveCenterNarrativeSteps(spec: LessonSpec): string[] {
  const studentIndependentSteps = takeClean(spec.centers.steps, spec.centers.steps.length)
    .filter(isStudentIndependentCenterLine)

  if (studentIndependentSteps.length > 0) {
    return studentIndependentSteps
  }

  return [
    "Set up student-independent center expectations.",
    "Rotate students through the selected center tasks.",
  ]
}

function isStudentIndependentCenterLine(line: string): boolean {
  const lower = line.toLowerCase()

  return !(
    lower.includes("teacher") ||
    lower.includes("small group") ||
    lower.includes("small-group") ||
    lower.includes("intervention") ||
    lower.includes("reteach") ||
    lower.includes("guided group") ||
    lower.includes("teacher-led") ||
    lower.includes("teacher led") ||
    lower.includes("support /") ||
    lower.includes("support center") ||
    lower.includes("teacher table")
  )
}

function selectWordListFocus(blueprint: LessonBlueprint, fallback: string): string {
  return focusList(blueprint.content.wordLists, 2, fallback)
}

function selectTextFocus(blueprint: LessonBlueprint, fallback: string): string {
  return focusList(blueprint.content.texts, 1, fallback)
}

function selectPracticeFocus(blueprint: LessonBlueprint, fallback: string): string {
  return focusList(blueprint.content.practiceIdeas, 1, fallback)
}

function selectVocabularyFocus(blueprint: LessonBlueprint, fallback: string): string {
  return focusList(blueprint.content.vocabulary, 3, fallback)
}

function focusList(items: string[], count: number, fallback: string): string {
  const cleaned = takeClean(items, count)
  return cleaned.length > 0 ? cleaned.join(", ") : fallback
}

function takeClean(items: string[], count: number): string[] {
  return Array.from(
    new Set(
      (items ?? [])
        .map((item) => stripTrailingPunctuation(item.trim()))
        .filter((item) => item.length > 0)
    )
  ).slice(0, count)
}

function stripTrailingPunctuation(value: string): string {
  return value.replace(/[.!?]+$/g, "").trim()
}

function buildExports(
  inputs: LessonInputs,
  slides: string[],
  lessonPlan: string,
  centers: string[],
  rotationPlan: string,
  interventions: string[],
  exportOptions: {
    includeLessonSlidesExport: boolean
    includeLessonPlanExport: boolean
    includePrintablesExport: boolean
  }
): ExportArtifact[] {
  const safeSubject = sanitizeExportSubject(inputs.subject)

  const artifacts: ExportArtifact[] = []

  if (exportOptions.includeLessonSlidesExport) {
    artifacts.push({
      kind: "slides",
      label: "Slides Export",
      fileName: `${safeSubject}-slides-export.pptx`,
      format: "pptx",
      mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      content: buildSlidesExportText(slides),
    })
  }

  if (exportOptions.includeLessonPlanExport) {
    artifacts.push({
      kind: "lesson_plan",
      label: "Lesson Plan Export",
      fileName: `${safeSubject}-lesson-plan-export.docx`,
      format: "docx",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      content: lessonPlan,
    })
  }

  if (exportOptions.includePrintablesExport) {
    artifacts.push({
      kind: "printables",
      label: "Printables Export",
      fileName: `${safeSubject}-printables-export.pdf`,
      format: "pdf",
      mimeType: "application/pdf",
      content: buildPrintablesExportText(centers, rotationPlan, interventions),
    })
  }

    if (artifacts.length > 0) {
    artifacts.unshift({
      kind: "full_package",
      format: "zip",
      label: "Full Lesson Package",
      fileName: `${safeSubject}-full-lesson-package.zip`,
      mimeType: "application/zip",
      content: [lessonPlan, slides.join("\n\n"), buildPrintablesExportText(centers, rotationPlan, interventions)]
        .filter(Boolean)
        .join("\n\n"),
    })
  }

  return artifacts
}

function buildSlidesExportText(slides: string[]): string {
  const lines = slides.length > 0 ? slides : ["No slides defined."]

  return [
    "Slides Export",
    "",
    ...lines,
  ].join("\n")
}

function buildPrintablesExportText(
  centers: string[],
  rotationPlan: string,
  interventions: string[]
): string {
  const centerLines =
    centers.length > 0
      ? centers.map((center) => `- ${center}`)
      : ["- No student centers defined."]

  const interventionLines =
    interventions.length > 0
      ? interventions.map((item) => `- ${item}`)
      : ["- No intervention support defined."]

  return [
    "Printables Export",
    "",
    "Centers",
    ...centerLines,
    "",
    "Rotation Plan",
    rotationPlan || "No rotation plan defined.",
    "",
    "Intervention Support",
    ...interventionLines,
  ].join("\n")
}

function sanitizeExportSubject(subject: string): string {
  const trimmed = subject.trim()

  if (!trimmed) {
    return "lesson"
  }

  const cleaned = trimmed
    .replace(/[^\w\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  return cleaned || "lesson"
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

function formatCoverageLabel(component: string): string {
  return component.replace(/_/g, " ")
}

function formatDecisionLabel(choice: MissingAreaDecisionChoice): string {
  if (choice === "add") {
    return "Add it"
  }

  if (choice === "leave_out") {
    return "Leave it out"
  }

  return "Decide later"
}

function joinOrFallback(items: string[], fallback: string): string {
  const cleaned = Array.from(
    new Set((items ?? []).map((item) => item.trim()).filter((item) => item.length > 0))
  )

  return cleaned.length > 0 ? cleaned.join(", ") : fallback
}



