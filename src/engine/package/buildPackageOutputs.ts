import {
  LessonBlueprint,
  LessonInputs,
  LessonPlanningIdeas,
  LessonSpec,
} from "../types"
import { assembleSlideDeck } from "../slides/assembleSlideDeck"

export function buildPackageOutputs(args: {
  inputs: LessonInputs
  blueprint: LessonBlueprint
  spec: LessonSpec
  planningIdeas?: LessonPlanningIdeas
}) {
  const { inputs, blueprint, spec, planningIdeas } = args

  const slides = buildSlides(blueprint, spec)
  const lessonPlan = buildLessonPlan(inputs, blueprint, spec, planningIdeas)
  const centers = buildCenters(spec, planningIdeas)
  const rotationPlan = buildRotationPlan(centers, planningIdeas)
  const interventions = buildInterventions(blueprint, planningIdeas)
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
  planningIdeas?: LessonPlanningIdeas
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

  const planningBlock = buildPlanningBlock(planningIdeas)
  const supportBlock = buildSupportBlock(planningIdeas)
  const readinessBlock = buildBlueprintReadinessBlock(blueprint)

  return [header, readinessBlock, body, planningBlock, supportBlock]
    .filter(Boolean)
    .join("\n\n")
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

function buildSupportBlock(planningIdeas?: LessonPlanningIdeas): string {
  if (!planningIdeas) {
    return ""
  }

  const formative = planningIdeas.formativeAssessmentIdeas.map(
    (idea) => `- ${idea.title}: ${idea.description}`
  )

  const smallGroup = planningIdeas.smallGroupIdeas.map(
    (idea) => `- ${idea.title}: ${idea.description}`
  )

  const interventions = planningIdeas.interventionIdeas.map(
    (idea) => `- ${idea.title}: ${idea.description}`
  )

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
  planningIdeas?: LessonPlanningIdeas
): string[] {
  const planningCenters =
    planningIdeas?.centerIdeas.map(
      (idea) => `${idea.title}: ${idea.description}`
    ) ?? []

  if (planningCenters.length > 0) {
    return planningCenters
  }

  return spec.centers.steps.length > 0
    ? spec.centers.steps
    : ["Independent practice center", "Partner practice center", "Teacher support center"]
}

function buildRotationPlan(
  centers: string[],
  planningIdeas?: LessonPlanningIdeas
): string {
  if (centers.length === 0) {
    return "No centers defined."
  }

  const smallGroupLine =
    planningIdeas?.smallGroupIdeas[0]
      ? `Teacher Table Focus: ${planningIdeas.smallGroupIdeas[0].title} - ${planningIdeas.smallGroupIdeas[0].description}`
      : "Teacher Table Focus: Targeted reteach or extension based on student need."

  return [
    ...centers.map((center, index) => `Rotation ${index + 1}: ${center}`),
    smallGroupLine,
  ].join("\n")
}

function buildInterventions(
  blueprint: LessonBlueprint,
  planningIdeas?: LessonPlanningIdeas
): string[] {
  const plannedInterventions =
    planningIdeas?.interventionIdeas.map(
      (idea) => `${idea.title}: ${idea.description}`
    ) ?? []

  if (plannedInterventions.length > 0) {
    return plannedInterventions
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
