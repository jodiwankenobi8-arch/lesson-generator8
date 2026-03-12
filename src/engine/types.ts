export type LessonInputs = {
  grade: string
  subject: string
  standard: string
  skill: string
  topic: string
  duration: string
}

export type MaterialRole = "curriculum" | "exemplar"

export type MaterialStatus =
  | "uploaded"
  | "extracting"
  | "analyzing"
  | "ready"
  | "error"

export type ExemplarStyleMode =
  | "copy_closely"
  | "inspiration"
  | "selected_aspects"
  | "custom"

export type ExemplarStyleAspect =
  | "structure"
  | "slide_flow"
  | "teacher_prompts"
  | "pacing"
  | "visual_layout"
  | "wording_tone"

export type ExemplarStyleSettings = {
  mode: ExemplarStyleMode
  aspects: ExemplarStyleAspect[]
  customInstructions: string
}

export type CurriculumCoverage = {
  standards: string[]
  instructionalTargets: string[]
  foundationalSkills: string[]
  sightWords: string[]
  vocabulary: string[]
  wordLists: string[]
  texts: string[]
  practiceTasks: string[]
  lessonSegments: string[]
}

export type CurriculumAnalysis = {
  standards: string[]
  vocabulary: string[]
  wordLists: string[]
  texts: string[]
  practiceTasks: string[]
  instructionalTargets: string[]
  examples: string[]
  coverage?: CurriculumCoverage
}

export type ExemplarAnalysis = {
  slideFlow: string[]
  pacing: string[]
  teacherMoves: string[]
  promptStyle: string[]
  layoutCues: string[]
  tone: string[]
  reusableStructure: string[]
}

export type MaterialAnalysis = {
  summary: string
  extractedText: string[]
  tags: string[]
  sourceRole: MaterialRole
  curriculum?: CurriculumAnalysis
  exemplar?: ExemplarAnalysis
}

export type MaterialFile = {
  id: string
  name: string
  role: MaterialRole
  status: MaterialStatus
  analysis: MaterialAnalysis | null
  errorMessage: string | null
  styleSettings?: ExemplarStyleSettings | null
  fileBuffer: ArrayBuffer | null
  fileContent: string | null
}

export type LessonMode = "single" | "full" | "phonics_only" | "comprehension_only"

export type LessonTargetInfo = {
  primary: string
  secondary: string | null
  isMixedTarget: boolean
  recommendedMode: LessonMode
}

export type BlueprintContent = {
  target: LessonTargetInfo
  standards: string[]
  vocabulary: string[]
  wordLists: string[]
  texts: string[]
  practiceIdeas: string[]
}

export type BlueprintTemplateShell = {
  segmentOrder: string[]
  slideShell: string[]
  timingShell: string[]
  teacherMoveShell: string[]
  promptShell: string[]
  toneShell: string[]
}

export type BlueprintStructure = {
  timing: string[]
  lessonSegments: string[]
  teacherMoves: string[]
  promptStyle: string[]
  tone: string[]
  templateShell: BlueprintTemplateShell
}

export type BlueprintSourceSignalTone = "good" | "warn" | "neutral"

export type BlueprintSourceSignal = {
  label: string
  value: string
  note: string
  tone: BlueprintSourceSignalTone
}

export type BlueprintSourceReadiness = {
  curriculumSupport: "strong" | "limited"
  exemplarSupport: "strong" | "limited"
  overall: "balanced" | "content_heavy" | "structure_heavy" | "limited"
  warnings: string[]
  signals: BlueprintSourceSignal[]
}

export type LessonBlueprint = {
  content: BlueprintContent
  structure: BlueprintStructure
  sourceReadiness: BlueprintSourceReadiness
}

export type LessonPlanIdea = {
  title: string
  description: string
  rationale: string
}

export type LessonPlanSectionKey =
  | "teach"
  | "guided_practice"
  | "independent_practice"
  | "closure"

export type LessonPlanSectionIdeas = {
  section: LessonPlanSectionKey
  title: string
  ideas: LessonPlanIdea[]
}

export type SlidePlanAction = "reuse" | "adapt" | "create_new"

export type SlidePlan = {
  shellLabel: string
  action: SlidePlanAction
  purpose: string
  notes: string
}

export type PlanningComponentKey =
  | "teach"
  | "guided_practice"
  | "independent_practice"
  | "closure"
  | "formative_assessment"
  | "centers"
  | "small_group"
  | "intervention"

export type PlanningCoverageStatus = "covered" | "partial" | "missing"

export type PlanningComponentCoverage = {
  component: PlanningComponentKey
  status: PlanningCoverageStatus
  evidence: string[]
  rationale: string
}

export type MissingAreaPromptCandidate = {
  component: PlanningComponentKey
  importance: "high" | "medium"
  prompt: string
  rationale: string
}

export type LessonPlanningIdeas = {
  slidePlans: SlidePlan[]
  lessonPlanSections: LessonPlanSectionIdeas[]
  formativeAssessmentIdeas: LessonPlanIdea[]
  centerIdeas: LessonPlanIdea[]
  smallGroupIdeas: LessonPlanIdea[]
  interventionIdeas: LessonPlanIdea[]
  componentCoverage?: PlanningComponentCoverage[]
  missingAreaPrompts?: MissingAreaPromptCandidate[]
}

export type LessonSpecSection = {
  title: string
  steps: string[]
}

export type LessonSpec = {
  teach: LessonSpecSection
  guidedPractice: LessonSpecSection
  independentPractice: LessonSpecSection
  centers: LessonSpecSection
  closure: LessonSpecSection
}

export type LessonPackageSignalTone = "good" | "warn" | "neutral"

export type LessonPackageSignal = {
  label: string
  value: string
  note: string
  tone: LessonPackageSignalTone
}

export type LessonPackageReadiness = {
  density: "balanced" | "thin"
  lessonShape: "single-focus" | "mixed"
  contentFit: "grounded" | "limited"
  warnings: string[]
  signals: LessonPackageSignal[]
}

export type LessonPackage = {
  slides: string[]
  lessonPlan: string
  centers: string[]
  rotationPlan: string
  interventions: string[]
  exports: string[]
  readiness: LessonPackageReadiness
}

export type LessonGenerationResult = {
  blueprint: LessonBlueprint
  planningIdeas: LessonPlanningIdeas
  spec: LessonSpec
  lessonSpec: LessonSpec
  lessonPackage: LessonPackage
}
