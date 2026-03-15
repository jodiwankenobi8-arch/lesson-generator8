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
  const exports = buildExports({ inputs, slides, lessonPlan, centers, rotationPlan, interventions })

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
  if (centers.length === 0) {
    return "No centers defined."
  }

  const smallGroupLine = resolveTeacherTableLine(planningIdeas, missingAreaDecisions)

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

type ExportBuildInput = {
  inputs: LessonInputs
  slides: string[]
  lessonPlan: string
  centers: string[]
  rotationPlan: string
  interventions: string[]
}

function sanitizeExportStem(value: string): string {
  const cleaned = value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^A-Za-z0-9\-_]/g, "")

  return cleaned || "lesson"
}

function buildSlidesExportText(slides: string[]): string {
  if (slides.length === 0) {
    return "Slides Export\n\nNo slides generated."
  }

  return ["Slides Export", "", ...slides.map((slide, index) => `${index + 1}. ${slide}`)].join("\n")
}

function buildPrintablesExportText({
  centers,
  rotationPlan,
  interventions,
}: Pick<ExportBuildInput, "centers" | "rotationPlan" | "interventions">): string {
  return [
    "Printables Export",
    "",
    "Centers",
    centers.length > 0 ? centers.map((item, index) => `${index + 1}. ${item}`).join("\n") : "None generated.",
    "",
    "Rotation Plan",
    rotationPlan.trim() || "None generated.",
    "",
    "Interventions",
    interventions.length > 0
      ? interventions.map((item, index) => `${index + 1}. ${item}`).join("\n")
      : "None generated.",
  ].join("\n")
}

function buildExports({
  inputs,
  slides,
  lessonPlan,
  centers,
  rotationPlan,
  interventions,
}: ExportBuildInput): ExportArtifact[] {
  const safeSubject = sanitizeExportStem(inputs.subject ?? "")

  return [
    {
      kind: "slides",
      label: "Slides Export",
      fileName: `${safeSubject}-slides-export.txt`,
      status: "ready",
      mimeType: "text/plain;charset=utf-8",
      content: buildSlidesExportText(slides),
    },
    {
      kind: "lesson_plan",
      label: "Lesson Plan Export",
      fileName: `${safeSubject}-lesson-plan-export.txt`,
      status: "ready",
      mimeType: "text/plain;charset=utf-8",
      content: lessonPlan.trim() || "Lesson plan export is empty.",
    },
    {
      kind: "printables",
      label: "Printables Export",
      fileName: `${safeSubject}-printables-export.txt`,
      status: "ready",
      mimeType: "text/plain;charset=utf-8",
      content: buildPrintablesExportText({ centers, rotationPlan, interventions }),
    },
  ]
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



