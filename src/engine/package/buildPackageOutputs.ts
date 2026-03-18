import {
  ExportArtifact,
  LessonBlueprint,
  LessonInputs,
  LessonPlanningIdeas,
  LessonSpec,
  MissingAreaDecisionChoice,
  PlanningComponentKey,
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

export function buildPackageOutputs(args: {
  inputs: LessonInputs
  blueprint: LessonBlueprint
  spec: LessonSpec
  planningIdeas?: LessonPlanningIdeas
  missingAreaDecisions?: MissingAreaDecisionMap
}) {
  const { inputs, blueprint, spec, planningIdeas, missingAreaDecisions = {} } = args

  const slides = buildSlides(blueprint, spec)
  const lessonPlan = buildLessonPlan(
    inputs,
    blueprint,
    spec,
    planningIdeas,
    missingAreaDecisions
  )
  const centers = buildCenters(spec, planningIdeas, missingAreaDecisions)
  const rotationPlan = buildRotationPlan(centers, planningIdeas, missingAreaDecisions)
  const interventions = buildInterventions(
    blueprint,
    planningIdeas,
    missingAreaDecisions
  )
  const exports = buildExports(inputs, slides, lessonPlan, centers, rotationPlan, interventions)

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
  missingAreaDecisions: MissingAreaDecisionMap = {}
): string {
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

  const teachBlock = buildSectionNarrativeBlock(spec.teach.title, [
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

  const guidedBlock = buildSectionNarrativeBlock(spec.guidedPractice.title, [
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

  const independentBlock = buildSectionNarrativeBlock(spec.independentPractice.title, [
    `Transfer Task: ${selectIndependentResources(blueprint)}`,
    `Student Practice: ${joinOrFallback(
      blueprint.content.practiceIdeas.slice(0, 2),
      "independent application"
    )}`,
  ], spec.independentPractice.steps)

  const centersBlock = buildSectionNarrativeBlock(spec.centers.title, [
    `Rotation Focus: ${joinOrFallback(
      planningIdeas?.centerIdeas.map((idea) => idea.title).slice(0, 3) ?? [],
      "teacher table, partner practice, independent practice"
    )}`,
    `Small Group Support: ${joinOrFallback(
      planningIdeas?.smallGroupIdeas.map((idea) => idea.title).slice(0, 2) ?? [],
      "targeted reteach or extension"
    )}`,
    `Intervention Focus: ${joinOrFallback(
      planningIdeas?.interventionIdeas.map((idea) => idea.title).slice(0, 2) ?? [],
      "targeted support for the lesson need"
    )}`,
  ], spec.centers.steps)

  const closureBlock = buildSectionNarrativeBlock(spec.closure.title, [
    `Review Focus: ${selectClosureResources(blueprint)}`,
    `Delivery Tone: ${joinOrFallback(
      blueprint.structure.tone.slice(0, 2),
      "clear instructional tone"
    )}`,
  ], spec.closure.steps)

  const planningBlock = buildPlanningBlock(planningIdeas)
  const supportBlock = buildSupportBlock(planningIdeas, missingAreaDecisions)

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
  planningIdeas?: LessonPlanningIdeas,
  missingAreaDecisions: MissingAreaDecisionMap = {}
): string {
  if (!planningIdeas) {
    return ""
  }

  const formative = planningIdeas.formativeAssessmentIdeas.map(
    (idea) => `- ${idea.title}: ${idea.description}`
  )

  const smallGroup = resolveDecisionAwareList({
    component: "small_group",
    plannedItems: planningIdeas.smallGroupIdeas.map(
      (idea) => `- ${idea.title}: ${idea.description}`
    ),
    missingAreaDecisions,
    addFallbackItems: [
      "- Teacher Table Support: Add a small-group reteach or extension block based on student need.",
    ],
  })

  const interventions = resolveDecisionAwareList({
    component: "intervention",
    plannedItems: planningIdeas.interventionIdeas.map(
      (idea) => `- ${idea.title}: ${idea.description}`
    ),
    missingAreaDecisions,
    addFallbackItems: [
      "- Targeted Reteach: Add an intervention block for students who need extra support with the main lesson skill.",
    ],
  })

  const sections: string[] = []

  if (formative.length > 0) {
    sections.push("Formative Assessment Ideas", ...formative)
  }

  if (smallGroup.length > 0) {
    sections.push("Small Group Ideas", ...smallGroup)
  }

  if (interventions.length > 0) {
    sections.push("Intervention Ideas", ...interventions)
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
  spec: LessonSpec,
  planningIdeas?: LessonPlanningIdeas,
  missingAreaDecisions: MissingAreaDecisionMap = {}
): string[] {
  return resolveDecisionAwareList({
    component: "centers",
    plannedItems:
      planningIdeas?.centerIdeas.map((idea) => `${idea.title}: ${idea.description}`) ?? [],
    missingAreaDecisions,
    addFallbackItems: [
      "Independent practice center",
      "Partner practice center",
      "Teacher support center",
    ],
    defaultItems:
      spec.centers.steps.length > 0
        ? spec.centers.steps
        : [
            "Independent practice center",
            "Partner practice center",
            "Teacher support center",
          ],
  })
}

function buildRotationPlan(
  centers: string[],
  planningIdeas?: LessonPlanningIdeas,
  missingAreaDecisions: MissingAreaDecisionMap = {}
): string {
  const smallGroupLine = resolveTeacherTableLine(planningIdeas, missingAreaDecisions)

  if (centers.length === 0) {
    return [
      "No centers defined.",
      smallGroupLine,
    ].join("\n")
  }

  return [
    ...centers.map((center, index) => `Rotation ${index + 1}: ${center}`),
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
    addFallbackItems: [
      "Provide targeted reteach for the primary lesson need.",
      "Use a short teacher-led intervention block before independent transfer.",
    ],
    defaultItems: buildDefaultInterventions(blueprint),
  })
}

function buildDefaultInterventions(blueprint: LessonBlueprint): string[] {
  if (blueprint.content.target.primary === "phonics") {
    return [
      "Reteach the target phonics pattern with a reduced word set.",
      "Provide extra guided decoding and blending practice.",
    ]
  }

  if (blueprint.content.target.primary === "comprehension") {
    return [
      "Reread a shorter chunk of text with guided prompting.",
      "Support vocabulary and evidence-based responses in a small group.",
    ]
  }

  return [
    "Provide targeted reteach for the primary lesson need.",
    "Use small-group support before independent transfer.",
  ]
}

function buildExports(
  inputs: LessonInputs,
  slides: string[],
  lessonPlan: string,
  centers: string[],
  rotationPlan: string,
  interventions: string[]
): ExportArtifact[] {
  const safeSubject = sanitizeExportSubject(inputs.subject)
  const slidesContent = buildSlidesExportText(slides)
  const printablesContent = buildPrintablesExportText(
    centers,
    rotationPlan,
    interventions
  )

  return [
    {
      kind: "slides",
      label: "Slides Export",
      fileName: `${safeSubject}-slides-export.txt`,
      mimeType: "text/plain;charset=utf-8",
      content: slidesContent,
    },
    {
      kind: "lesson_plan",
      label: "Lesson Plan Export",
      fileName: `${safeSubject}-lesson-plan-export.docx`,
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      content: lessonPlan,
    },
    {
      kind: "printables",
      label: "Printables Export",
      fileName: `${safeSubject}-printables-export.txt`,
      mimeType: "text/plain;charset=utf-8",
      content: printablesContent,
    },
  ]
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
      : ["- No centers defined."]

  const interventionLines =
    interventions.length > 0
      ? interventions.map((item) => `- ${item}`)
      : ["- No interventions defined."]

  return [
    "Printables Export",
    "",
    "Centers",
    ...centerLines,
    "",
    "Rotation Plan",
    rotationPlan || "No rotation plan defined.",
    "",
    "Interventions",
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

function resolveTeacherTableLine(
  planningIdeas?: LessonPlanningIdeas,
  missingAreaDecisions: MissingAreaDecisionMap = {}
): string {
  if (shouldLeaveOut("small_group", missingAreaDecisions)) {
    return "Teacher Table Focus: No small-group block selected."
  }

  const firstSmallGroupIdea = planningIdeas?.smallGroupIdeas[0]

  if (firstSmallGroupIdea) {
    return `Teacher Table Focus: ${firstSmallGroupIdea.title} - ${firstSmallGroupIdea.description}`
  }

  if (shouldAdd("small_group", missingAreaDecisions)) {
    return "Teacher Table Focus: Add a targeted small-group reteach or extension block based on student need."
  }

  return "Teacher Table Focus: Targeted reteach or extension based on student need."
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

