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

export type CurriculumAnalysis = {
  standards: string[]
  vocabulary: string[]
  wordLists: string[]
  texts: string[]
  practiceTasks: string[]
  instructionalTargets: string[]
  examples: string[]
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

export type LessonBlueprint = {
  content: BlueprintContent
  structure: BlueprintStructure
}

export type LessonPlanIdea = {
  title: string
  description: string
  rationale: string
}

export type SlidePlanAction = "reuse" | "adapt" | "create_new"

export type SlidePlan = {
  shellLabel: string
  action: SlidePlanAction
  purpose: string
  notes: string
}

export type LessonPlanningIdeas = {
  slidePlans: SlidePlan[]
  formativeAssessmentIdeas: LessonPlanIdea[]
  centerIdeas: LessonPlanIdea[]
  smallGroupIdeas: LessonPlanIdea[]
  interventionIdeas: LessonPlanIdea[]
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

export type LessonPackage = {
  slides: string[]
  lessonPlan: string
  centers: string[]
  rotationPlan: string
  interventions: string[]
  exports: string[]
}

export type LessonGenerationResult = {
  blueprint: LessonBlueprint
  planningIdeas: LessonPlanningIdeas
  spec: LessonSpec
  lessonSpec: LessonSpec
  lessonPackage: LessonPackage
}
