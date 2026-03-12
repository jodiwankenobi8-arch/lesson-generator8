import {
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
  const exports = buildExports(inputs)

  return {
    slides,
    lessonPlan,
    centers,
    rotationPlan,
    interventions,
    exports,
  }
}

function buildSlides(
  blueprint: LessonBlueprint,
  spec: LessonSpec
): string[] {
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
    `Primary Target: ${blueprint.content.target.primary}`,
    `Secondary Target: ${blueprint.content.target.secondary ?? "None"}`,
    `Mixed Target: ${blueprint.content.target.isMixedTarget ? "Yes" : "No"}`,
    `Source Balance: ${blueprint.sourceReadiness.overall}`,
  ].join("\n")

  const sections = [
    spec.teach,
    spec.guidedPractice,
    spec.independentPractice,
    spec.centers,
    spec.closure,
  ]

  const body = sections
    .map((section) => {
      const steps = section.steps.map((step) => `- ${step}`).join("\n")
      return `${section.title}\n${steps}`
    })
    .join("\n\n")

  const readinessBlock = buildBlueprintReadinessBlock(blueprint)
  const coverageBlock = buildCoverageDecisionBlock(planningIdeas, missingAreaDecisions)
  const planningBlock = buildPlanningBlock(planningIdeas)
  const supportBlock = buildSupportBlock(planningIdeas, missingAreaDecisions)

  return [header, readinessBlock, coverageBlock, body, planningBlock, supportBlock]
    .filter(Boolean)
    .join("\n\n")
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

  const smallGroup =
    shouldLeaveOut("small_group", missingAreaDecisions)
      ? []
      : planningIdeas.smallGroupIdeas.map(
          (idea) => `- ${idea.title}: ${idea.description}`
        )

  const interventions =
    shouldLeaveOut("intervention", missingAreaDecisions)
      ? []
      : planningIdeas.interventionIdeas.map(
          (idea) => `- ${idea.title}: ${idea.description}`
        )

  const sections: string[] = []

  if (formative.length > 0) {
    sections.push("Formative Assessment Ideas", ...formative)
  }

  if (smallGroup.length > 0) {
    sections.push("Small Group Ideas", ...smallGroup)
  } else if (shouldAdd("small_group", missingAreaDecisions)) {
    sections.push(
      "Small Group Ideas",
      "- Teacher Table Support: Add a small-group reteach or extension block based on student need."
    )
  }

  if (interventions.length > 0) {
    sections.push("Intervention Ideas", ...interventions)
  } else if (shouldAdd("intervention", missingAreaDecisions)) {
    sections.push(
      "Intervention Ideas",
      "- Targeted Reteach: Add an intervention block for students who need extra support with the main lesson skill."
    )
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
  if (shouldLeaveOut("centers", missingAreaDecisions)) {
    return []
  }

  const planningCenters =
    planningIdeas?.centerIdeas.map(
      (idea) => `${idea.title}: ${idea.description}`
    ) ?? []

  if (planningCenters.length > 0) {
    return planningCenters
  }

  if (shouldAdd("centers", missingAreaDecisions)) {
    return [
      "Independent practice center",
      "Partner practice center",
      "Teacher support center",
    ]
  }

  return spec.centers.steps.length > 0
    ? spec.centers.steps
    : ["Independent practice center", "Partner practice center", "Teacher support center"]
}

function buildRotationPlan(
  centers: string[],
  planningIdeas?: LessonPlanningIdeas,
  missingAreaDecisions: MissingAreaDecisionMap = {}
): string {
  if (centers.length === 0) {
    return "No centers defined."
  }

  const smallGroupLine = shouldLeaveOut("small_group", missingAreaDecisions)
    ? "Teacher Table Focus: No small-group block selected."
    : planningIdeas?.smallGroupIdeas[0]
      ? `Teacher Table Focus: ${planningIdeas.smallGroupIdeas[0].title} - ${planningIdeas.smallGroupIdeas[0].description}`
      : shouldAdd("small_group", missingAreaDecisions)
        ? "Teacher Table Focus: Add a targeted small-group reteach or extension block based on student need."
        : "Teacher Table Focus: Targeted reteach or extension based on student need."

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
  if (shouldLeaveOut("intervention", missingAreaDecisions)) {
    return []
  }

  const plannedInterventions =
    planningIdeas?.interventionIdeas.map(
      (idea) => `${idea.title}: ${idea.description}`
    ) ?? []

  if (plannedInterventions.length > 0) {
    return plannedInterventions
  }

  if (shouldAdd("intervention", missingAreaDecisions)) {
    return [
      "Provide targeted reteach for the primary lesson need.",
      "Use a short teacher-led intervention block before independent transfer.",
    ]
  }

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

function buildExports(inputs: LessonInputs): string[] {
  const safeSubject = inputs.subject.trim() || "lesson"
  return [
    `${safeSubject}-slides-export-placeholder`,
    `${safeSubject}-lesson-plan-export-placeholder`,
    `${safeSubject}-printables-export-placeholder`,
  ]
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
