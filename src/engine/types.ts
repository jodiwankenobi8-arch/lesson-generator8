export type LessonInputs = {

  grade: string

  subject: string

  standard: string

  skill: string

  topic: string

  duration: string

}



export type LessonPlanContentPartKey =

  | "teach"

  | "guided_practice"

  | "independent_practice"

  | "closure"



export type AssessmentOutputTypeKey = "formative_assessment"



export type GroupOutputKindKey =

  | "centers"

  | "small_group"

  | "intervention"



export type OtherOutputKey = "printables"



export type LessonOutputContents = {

  lessonPlan: {

    selected: boolean

    parts: Record<LessonPlanContentPartKey, boolean>

  }

  lessonSlides: {

    selected: boolean

  }

  assessments: {

    selected: boolean

    types: Record<AssessmentOutputTypeKey, boolean>

  }

  groups: {

    selected: boolean

    byTier: {

      T1: {

        centers: boolean

      }

      T2: {

        small_group: boolean

      }

      T3: {

        intervention: boolean

      }

      Extension: Record<string, never>

    }

  }

  other: {

    printables: boolean

  }

}



export function createDefaultOutputContents(): LessonOutputContents {

  return {

    lessonPlan: {

      selected: true,

      parts: {

        teach: true,

        guided_practice: true,

        independent_practice: true,

        closure: true,

      },

    },

    lessonSlides: {

      selected: true,

    },

    assessments: {

      selected: false,

      types: {

        formative_assessment: false,

      },

    },

    groups: {

      selected: false,

      byTier: {

        T1: {

          centers: false,

        },

        T2: {

          small_group: false,

        },

        T3: {

          intervention: false,

        },

        Extension: {},

      },

    },

    other: {

      printables: false,

    },

  }

}



export function normalizeOutputContents(

  outputContents: LessonOutputContents

): LessonOutputContents {

  const lessonPlanParts = {

    teach: Boolean(outputContents.lessonPlan.parts.teach),

    guided_practice: Boolean(outputContents.lessonPlan.parts.guided_practice),

    independent_practice: Boolean(outputContents.lessonPlan.parts.independent_practice),

    closure: Boolean(outputContents.lessonPlan.parts.closure),

  }



  const assessmentTypes = {

    formative_assessment: Boolean(

      outputContents.assessments.types.formative_assessment

    ),

  }



  const groupByTier = {

    T1: {

      centers: Boolean(outputContents.groups.byTier.T1.centers),

    },

    T2: {

      small_group: Boolean(outputContents.groups.byTier.T2.small_group),

    },

    T3: {

      intervention: Boolean(outputContents.groups.byTier.T3.intervention),

    },

    Extension: {},

  }



  return {

    lessonPlan: {

      selected: true,

      parts: lessonPlanParts,

    },

    lessonSlides: {

      selected: true,

    },

    assessments: {

      selected: assessmentTypes.formative_assessment,

      types: assessmentTypes,

    },

    groups: {

      selected:

        groupByTier.T1.centers ||

        groupByTier.T2.small_group ||

        groupByTier.T3.intervention,

      byTier: groupByTier,

    },

    other: {

      printables: Boolean(outputContents.other.printables),

    },

  }

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



export type ExemplarDetectedFeatureKey =

  | "guideposts"

  | "toc"

  | "interactive_checkpoints"

  | "teacher_prompt_blocks"

  | "teacher_scripts"

  | "call_and_response"

  | "turn_and_talk"

  | "section_headers"

  | "agenda"

  | "objective_slide"

  | "warm_up"

  | "mini_lesson"

  | "guided_practice"

  | "independent_practice"

  | "closure"

  | "exit_ticket"

  | "small_group"

  | "centers"

  | "timers"

  | "pacing_markers"

  | "slide_numbering"

  | "icon_system"

  | "hero_image_slot"

  | "image_slots"

  | "example_non_example"

  | "anchor_chart_layout"

  | "table_layout"

  | "split_layout"

  | "color_theme"

  | "font_theme"

  | "visual_theme"

  | "animation_cues"

  | "curriculum_slide_slots"

  | "word_list_slots"

  | "passage_slots"

  | "practice_task_slots"



export type ExemplarDetectedFeatureCategory =

  | "structure"

  | "interaction"

  | "instructional_flow"

  | "pacing"

  | "visual_layout"

  | "theme_style"

  | "content_slots"



export type ExemplarDetectedFeature = {

  key: ExemplarDetectedFeatureKey

  label: string

  description: string

  evidence: string[]

  confidence: number

  category: ExemplarDetectedFeatureCategory

}



export type ExemplarDetectedFeatures = {

  items: ExemplarDetectedFeature[]

  warnings: string[]

}



export type ExemplarTransformationMode =

  | "keep_mostly_same"

  | "use_selected_features"

  | "use_as_inspiration"

  | "custom"



export type ExemplarTransformationRequest = {

  mode: ExemplarTransformationMode

  keepFeatures: ExemplarDetectedFeatureKey[]

  removeFeatures: ExemplarDetectedFeatureKey[]

  replaceContent: string[]

  addFeatures: string[]

  restyleInstructions: string

  customInstructions: string

}



export type ExtractionMethod = "parser" | "ocr" | "mixed" | "fallback_notice"



export type ExtractionQuality = "high" | "medium" | "low"



export type ExtractionMetadata = {

  method: ExtractionMethod

  quality: ExtractionQuality

  confidence: number

  notes: string[]

  ocrCandidate: boolean

  ocrReason: string | null

}



export type MaterialReliabilityLevel = "high" | "medium" | "low"



export type MaterialUseDecision = "allow" | "caution" | "block"



export type MaterialReliability = {

  level: MaterialReliabilityLevel

  score: number

  usableForContent: boolean

  usableForStructure: boolean

  contentDecision: MaterialUseDecision

  structureDecision: MaterialUseDecision

  reasons: string[]

  warnings: string[]

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

  detectedFeatures?: ExemplarDetectedFeatures

}



export type MaterialAnalysis = {

  summary: string

  extractedText: string[]

  tags: string[]

  sourceRole: MaterialRole

  extractionMetadata?: ExtractionMetadata

  reliability?: MaterialReliability

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

  transformationRequest?: ExemplarTransformationRequest | null

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



export type BlueprintContentCoverage = {

  standards: string[]

  vocabulary: string[]

  wordLists: string[]

  texts: string[]

  practiceIdeas: string[]

  instructionalTargets: string[]

  sightWords: string[]

  foundationalSkills: string[]

  lessonSegments: string[]

}



export type BlueprintContent = {

  target: LessonTargetInfo

  standards: string[]

  vocabulary: string[]

  wordLists: string[]

  texts: string[]

  practiceIdeas: string[]

  coverage?: BlueprintContentCoverage

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

  coverageSupport: "strong" | "limited"

  overall: "balanced" | "content_heavy" | "structure_heavy" | "limited"

  selectedCurriculumMaterialIds: string[]

  selectedExemplarMaterialIds: string[]

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


export function isLessonPlanPartSelected(

  outputContents: LessonOutputContents,

  part: LessonPlanContentPartKey

): boolean {

  return Boolean(outputContents.lessonPlan.parts[part])

}



export function isAssessmentTypeSelected(

  outputContents: LessonOutputContents,

  type: AssessmentOutputTypeKey

): boolean {

  return Boolean(outputContents.assessments.types[type])

}



export function isGroupOutputSelected(

  outputContents: LessonOutputContents,

  kind: GroupOutputKindKey

): boolean {

  if (kind === "centers") {

    return Boolean(outputContents.groups.byTier.T1.centers)

  }



  if (kind === "small_group") {

    return Boolean(outputContents.groups.byTier.T2.small_group)

  }



  return Boolean(outputContents.groups.byTier.T3.intervention)

}



export function isPlanningComponentSelected(

  outputContents: LessonOutputContents,

  component: PlanningComponentKey

): boolean {

  if (

    component === "teach" ||

    component === "guided_practice" ||

    component === "independent_practice" ||

    component === "closure"

  ) {

    return isLessonPlanPartSelected(outputContents, component)

  }



  if (component === "formative_assessment") {

    return isAssessmentTypeSelected(outputContents, "formative_assessment")

  }



  return isGroupOutputSelected(outputContents, component)

}



export function countSelectedOutputSections(

  outputContents: LessonOutputContents

): number {

  return [

    outputContents.lessonPlan.selected,

    outputContents.lessonSlides.selected,

    outputContents.assessments.selected,

    outputContents.groups.selected,

    outputContents.other.printables,

  ].filter(Boolean).length

}



export type PlanningCoverageStatus = "covered" | "partial" | "missing"



export type PlanningCoverageSource = "source_signals" | "generated_support" | "combined"



export type PlanningCoverageDetail = {

  status: PlanningCoverageStatus

  evidence: string[]

  rationale: string

  source: PlanningCoverageSource

}



export type PlanningComponentCoverage = {

  component: PlanningComponentKey

  status: PlanningCoverageStatus

  evidence: string[]

  rationale: string

  sourceCoverage?: PlanningCoverageDetail

  generatedCoverage?: PlanningCoverageDetail

}



export type MissingAreaPromptCandidate = {

  component: PlanningComponentKey

  importance: "high" | "medium"

  prompt: string

  rationale: string

}



export type MissingAreaDecisionChoice = "undecided" | "add" | "leave_out"



export type MissingAreaDecision = {

  component: PlanningComponentKey

  choice: MissingAreaDecisionChoice

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



export type ExportArtifactKind = "slides" | "lesson_plan" | "printables"



export type ExportArtifactStatus = "ready"



export type ExportArtifact = {
  kind: ExportArtifactKind
  label: string
  fileName: string
  mimeType?: string
  content?: string
}



export type LessonPackage = {

  slides: string[]

  lessonPlan: string

  centers: string[]

  rotationPlan: string

  interventions: string[]

  exports: ExportArtifact[]

  readiness: LessonPackageReadiness

}



export type LessonPipelineTrace = {

  selectedMode: LessonMode

  materialCounts: {

    total: number

    curriculum: number

    exemplar: number

  }

  selectedSources: {

    curriculumMaterialIds: string[]

    exemplarMaterialIds: string[]

  }

  target: {

    primary: string

    secondary: string | null

    isMixedTarget: boolean

    recommendedMode: LessonMode

  }

  blueprintWarnings: string[]

  missingAreaPromptComponents: PlanningComponentKey[]

  package: {

    density: LessonPackageReadiness["density"]

    lessonShape: LessonPackageReadiness["lessonShape"]

    contentFit: LessonPackageReadiness["contentFit"]

    warningCount: number

  }

}
export type LessonGenerationResult = {

  blueprint: LessonBlueprint

  planningIdeas: LessonPlanningIdeas

  lessonSpec: LessonSpec

  lessonPackage: LessonPackage

  trace: LessonPipelineTrace

}







