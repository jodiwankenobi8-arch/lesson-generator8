import {
  LessonBlueprint,
  LessonInputs,
  LessonPackage,
  LessonSpec,
} from "../types"

export function buildLessonPackage(
  inputs: LessonInputs,
  blueprint: LessonBlueprint,
  spec: LessonSpec
): LessonPackage {
  const slides = buildSlides(blueprint)
  const lessonPlan = buildLessonPlan(inputs, blueprint, spec)
  const centers = buildCenters(spec)
  const rotationPlan = buildRotationPlan(centers)
  const interventions = buildInterventions(blueprint)
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

function buildSlides(blueprint: LessonBlueprint): string[] {
  const shell = blueprint.structure.templateShell.slideShell

  if (shell.length === 0) {
    return [
      "Slide 1: Opening",
      "Slide 2: Teach",
      "Slide 3: Practice",
      "Slide 4: Closure",
    ]
  }

  return shell.map((label, index) => `Slide ${index + 1}: ${label}`)
}

function buildLessonPlan(
  inputs: LessonInputs,
  blueprint: LessonBlueprint,
  spec: LessonSpec
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

  return `${header}\n\n${body}`
}

function buildCenters(spec: LessonSpec): string[] {
  return spec.centers.steps.length > 0
    ? spec.centers.steps
    : ["Independent practice center", "Partner practice center", "Teacher support center"]
}

function buildRotationPlan(centers: string[]): string {
  if (centers.length === 0) {
    return "No centers defined."
  }

  return centers
    .map((center, index) => `Rotation ${index + 1}: ${center}`)
    .join("\n")
}

function buildInterventions(blueprint: LessonBlueprint): string[] {
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
