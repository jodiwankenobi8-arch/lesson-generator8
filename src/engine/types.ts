export type LessonInputs = {

  grade: string

  subject: string

  standard: string

  skill: string

  topic: string

  duration: string

  notes?: string

}



export type LessonPlanContentPartKey =

  | "standards"

  | "objective"

  | "opening"

  | "direct_instruction_modeling"

  | "teach"

  | "guided_practice"

  | "independent_practice"

  | "closure"

  | "differentiation"

  | "vocabulary"

  | "materials_prep_list"

  | "assessment_connection"



export type AssessmentOutputTypeKey =

  | "observation_checklist"

  | "exit_ticket"

  | "running_record_conference_notes"

  | "quick_oral_check"

  | "end_of_lesson_task"

  | "skill_check"

  | "response_sheet"

  | "brief_performance_task"

  | "formative_assessment"



export type CenterOutputOptionKey =

  | "use_what_you_have"

  | "create_new_center_activities"



export type CenterFocusKey =

  | "letter_identification"

  | "phonological_awareness"

  | "phonemic_awareness"

  | "phonics"

  | "high_frequency_words"

  | "word_building"

  | "vocabulary_oral_language"

  | "handwriting_fine_motor"

  | "decodable_reading"

  | "fluency"

  | "reading_response"

  | "comprehension"

  | "writing_sentence_work"



export type ElaAreaKey =

  | CenterFocusKey

  | "spelling_encoding"

  | "grammar_language_conventions"

  | "speaking_listening"



export type SmallGroupTierKey = "T1" | "T2" | "T3" | "Extension"



export type GroupOutputKindKey =

  | "centers"

  | "small_group"

  | "intervention"



export type OtherOutputKey = "printables"



type AssessmentTypeMap = Record<AssessmentOutputTypeKey, boolean>

type LessonPlanPartMap = Record<LessonPlanContentPartKey, boolean>

type CenterOptionMap = Record<CenterOutputOptionKey, boolean>

type CenterFocusMap = Record<CenterFocusKey, boolean>

type SmallGroupTierMap = Record<SmallGroupTierKey, boolean>

const lessonPlanContentPartKeys: LessonPlanContentPartKey[] = [
  "standards",
  "objective",
  "opening",
  "direct_instruction_modeling",
  "teach",
  "guided_practice",
  "independent_practice",
  "closure",
  "differentiation",
  "vocabulary",
  "materials_prep_list",
  "assessment_connection",
]

const assessmentOutputTypeKeys: AssessmentOutputTypeKey[] = [
  "observation_checklist",
  "exit_ticket",
  "running_record_conference_notes",
  "quick_oral_check",
  "end_of_lesson_task",
  "skill_check",
  "response_sheet",
  "brief_performance_task",
  "formative_assessment",
]

const formativeAssessmentOutputTypeKeys: AssessmentOutputTypeKey[] = [
  "observation_checklist",
  "exit_ticket",
  "running_record_conference_notes",
  "quick_oral_check",
]

const centerOutputOptionKeys: CenterOutputOptionKey[] = [
  "use_what_you_have",
  "create_new_center_activities",
]

const centerFocusKeys: CenterFocusKey[] = [
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

const smallGroupTierKeys: SmallGroupTierKey[] = ["T1", "T2", "T3", "Extension"]

function normalizeBooleanRecord<T extends string>(
  keys: T[],
  incoming?: Partial<Record<T, boolean>>
): Record<T, boolean> {
  return keys.reduce(
    (result, key) => {
      result[key] = Boolean(incoming?.[key])
      return result
    },
    {} as Record<T, boolean>
  )
}

export type LessonOutputContents = {

  lessonPlan: {

    selected: boolean

    parts: LessonPlanPartMap

  }

  lessonSlides: {

    selected: boolean

    studentFacingOnly: boolean

  }

  assessment: {

    selected: boolean

    types: AssessmentTypeMap

    answerKeys: boolean

  }

  centers: {

    selected: boolean

    options: CenterOptionMap

    focuses: CenterFocusMap

  }

  smallGroup: {

    selected: boolean

    tiers: SmallGroupTierMap

  }

  assessments: {

    selected: boolean

    types: AssessmentTypeMap

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

      Extension: {

        small_group: boolean

      }

    }

  }

  other: {

    printables: boolean

  }

}



export function createDefaultOutputContents(): LessonOutputContents {

  return normalizeOutputContents({

    lessonPlan: {

      selected: true,

      parts: {
        standards: true,
        objective: true,
        opening: true,
        direct_instruction_modeling: true,
        teach: true,
        guided_practice: true,
        independent_practice: true,
        closure: true,
        differentiation: false,
        vocabulary: true,
        materials_prep_list: true,
        assessment_connection: true,
      },

    },

    lessonSlides: {

      selected: true,

      studentFacingOnly: true,

    },

    assessment: {

      selected: false,

      types: normalizeBooleanRecord(assessmentOutputTypeKeys),

      answerKeys: true,

    },

    centers: {

      selected: false,

      options: normalizeBooleanRecord(centerOutputOptionKeys),

      focuses: normalizeBooleanRecord(centerFocusKeys),

    },

    smallGroup: {

      selected: false,

      tiers: normalizeBooleanRecord(smallGroupTierKeys),

    },

    assessments: {

      selected: false,

      types: normalizeBooleanRecord(assessmentOutputTypeKeys),

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

        Extension: {

          small_group: false,

        },

      },

    },

    other: {

      printables: false,

    },

  })

}



export function normalizeOutputContents(

  outputContents: LessonOutputContents

): LessonOutputContents {

  const lessonPlanParts = normalizeBooleanRecord(
    lessonPlanContentPartKeys,
    outputContents.lessonPlan.parts
  )

  const directInstructionSelected =
    lessonPlanParts.direct_instruction_modeling || lessonPlanParts.teach

  lessonPlanParts.direct_instruction_modeling = directInstructionSelected
  lessonPlanParts.teach = directInstructionSelected

  const assessmentTypes = normalizeBooleanRecord(
    assessmentOutputTypeKeys,
    outputContents.assessment?.types ?? outputContents.assessments?.types
  )

  assessmentTypes.formative_assessment =
    assessmentTypes.formative_assessment ||
    formativeAssessmentOutputTypeKeys.some((key) => assessmentTypes[key])

  const centerOptions = normalizeBooleanRecord(
    centerOutputOptionKeys,
    outputContents.centers?.options
  )

  const centerFocuses = normalizeBooleanRecord(
    centerFocusKeys,
    outputContents.centers?.focuses
  )

  if (
    Boolean(
      (outputContents.centers?.options as unknown as Record<string, boolean> | undefined)?.[
        "vocabulary_support"
      ]
    )
  ) {
    centerFocuses.vocabulary_oral_language = true
  }

  const smallGroupTiers = normalizeBooleanRecord(
    smallGroupTierKeys,
    outputContents.smallGroup?.tiers
  )

  const assessmentSelected = assessmentOutputTypeKeys.some(
    (key) => assessmentTypes[key] && key !== "formative_assessment"
  ) || assessmentTypes.formative_assessment

  const centersSelected = centerOutputOptionKeys.some((key) => centerOptions[key])

  const smallGroupSelected = smallGroupTierKeys.some((key) => smallGroupTiers[key])

  const printablesSelected =
    Boolean(outputContents.other?.printables) ||
    centersSelected ||
    smallGroupSelected

  return {

    lessonPlan: {

      selected: Boolean(outputContents.lessonPlan.selected),

      parts: lessonPlanParts,

    },

    lessonSlides: {

      selected: Boolean(outputContents.lessonSlides.selected),

      studentFacingOnly: outputContents.lessonSlides.studentFacingOnly !== false,

    },

    assessment: {

      selected: assessmentSelected,

      types: assessmentTypes,

      answerKeys: outputContents.assessment?.answerKeys !== false,

    },

    centers: {

      selected: centersSelected,

      options: centerOptions,

      focuses: centerFocuses,

    },

    smallGroup: {

      selected: smallGroupSelected,

      tiers: smallGroupTiers,

    },

    assessments: {

      selected: assessmentSelected,

      types: assessmentTypes,

    },

    groups: {

      selected: centersSelected || smallGroupSelected,

      byTier: {

        T1: {

          centers: centersSelected,

        },

        T2: {

          small_group: smallGroupSelected,

        },

        T3: {

          intervention: smallGroupTiers.T3,

        },

        Extension: {

          small_group: smallGroupTiers.Extension,

        },

      },

    },

    other: {

      printables: printablesSelected,

    },

  }

}



export type MaterialRole = "curriculum" | "exemplar"



export type MaterialSourceKind = "file_upload" | "pasted_text" | "image_upload"



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



export type ExemplarInfluenceTarget =

  | "shared"

  | "lesson_plan"

  | "lesson_slides"

  | "centers"

  | "small_group"

  | "intervention"

  | "printables"



export type ExemplarStyleSettings = {

  mode: ExemplarStyleMode

  aspects: ExemplarStyleAspect[]

  customInstructions: string

  targets: ExemplarInfluenceTarget[]

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



export type ExtractionOcrDisposition =

  | "not_needed"

  | "applied"

  | "suggested"

  | "unavailable"



export type ExtractionProvenance = {

  sourceKind: MaterialSourceKind

  sourceLabel: string

  originalType: string

}



export type ExtractionMetadata = {

  method: ExtractionMethod

  quality: ExtractionQuality

  confidence: number

  notes: string[]

  ocrCandidate: boolean

  ocrReason: string | null

  provenance?: ExtractionProvenance

  ocrDisposition?: ExtractionOcrDisposition

  fallbackBehavior?: string

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



export type MaterialAnalysisReview = {
  standards: string[]
  vocabulary: string[]
  instructionalTargets: string[]
  texts: string[]
  practiceIdeas: string[]
  exemplarStructure: string[]
  teacherSummary: string
}

export type MaterialFile = {

  id: string

  name: string

  role: MaterialRole

  status: MaterialStatus

  analysis: MaterialAnalysis | null

  analysisReview?: MaterialAnalysisReview | null

  errorMessage: string | null

  styleSettings?: ExemplarStyleSettings | null

  transformationRequest?: ExemplarTransformationRequest | null

  sourceKind?: MaterialSourceKind

  sourceLabel?: string | null

  sourceMimeType?: string | null

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



export type ResolvedElaArea = {

  key: ElaAreaKey

  score: number

  evidence: string[]

  sources: Array<"teacher_input" | "curriculum_analysis" | "curriculum_text" | "standards_match">

}



export type ResolvedLessonProfile = {

  areas: ResolvedElaArea[]

  dominantAreaKeys: ElaAreaKey[]

  pinnedAreaKeys: ElaAreaKey[]

  excludedAreaKeys: ElaAreaKey[]

  lessonShape: "single" | "combined"

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

  profile?: ResolvedLessonProfile

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



export type BlueprintScopedTemplateShells = Partial<

  Record<ExemplarInfluenceTarget, BlueprintTemplateShell>

>



export type BlueprintStructure = {

  timing: string[]

  lessonSegments: string[]

  teacherMoves: string[]

  promptStyle: string[]

  tone: string[]

  templateShell: BlueprintTemplateShell

  scopedTemplateShells?: BlueprintScopedTemplateShells

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

  if (part === "teach") {

    return Boolean(
      outputContents.lessonPlan.parts.teach ||
        outputContents.lessonPlan.parts.direct_instruction_modeling
    )

  }



  if (part === "direct_instruction_modeling") {

    return Boolean(
      outputContents.lessonPlan.parts.direct_instruction_modeling ||
        outputContents.lessonPlan.parts.teach
    )

  }



  return Boolean(outputContents.lessonPlan.parts[part])

}



export function isAssessmentTypeSelected(

  outputContents: LessonOutputContents,

  type: AssessmentOutputTypeKey

): boolean {

  if (type === "formative_assessment") {

    return Boolean(
      outputContents.assessment.types.formative_assessment ||
        formativeAssessmentOutputTypeKeys.some(
          (key) => outputContents.assessment.types[key]
        )
    )

  }



  return Boolean(outputContents.assessment.types[type])

}



export function isGroupOutputSelected(

  outputContents: LessonOutputContents,

  kind: GroupOutputKindKey

): boolean {

  if (kind === "centers") {

    return Boolean(outputContents.centers.selected)

  }



  if (kind === "small_group") {

    return Boolean(outputContents.smallGroup.selected)

  }



  return Boolean(outputContents.smallGroup.tiers.T3)

}


export function isSupportPrintablesSelected(

  outputContents: LessonOutputContents

): boolean {

  const centersSelected =
    Boolean(outputContents.centers?.selected) ||
    centerOutputOptionKeys.some((key) => Boolean(outputContents.centers?.options?.[key]))

  const smallGroupSelected =
    Boolean(outputContents.smallGroup?.selected) ||
    smallGroupTierKeys.some((key) => Boolean(outputContents.smallGroup?.tiers?.[key]))

  return Boolean(outputContents.other?.printables) || centersSelected || smallGroupSelected

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

    outputContents.assessment.selected,

    outputContents.centers.selected,

    outputContents.smallGroup.selected,

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



export type ExportArtifactKind = "slides" | "lesson_plan" | "printables" | "full_package"

export type ExportArtifactFormat = "docx" | "pdf" | "pptx" | "zip"


export type ExportArtifact = {
  kind: ExportArtifactKind
  format: ExportArtifactFormat
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




export type AiConstructionTeacherReviewItem = {
  label: string
  reason: string
  note: string
}

export type AiConstructionStandardsSuggestion = {
  value: string
  origin: "grounded" | "inferred"
  sourceTypes: string[]
  evidence: string[]
}

export type AiConstructionTrace = {
  applied: boolean
  confidence: number
  groundedContentLabels: string[]
  inferredContentLabels: string[]
  teacherReviewItems: AiConstructionTeacherReviewItem[]
  requestedButMissing: string[]
  standardsSuggestions: AiConstructionStandardsSuggestion[]
  warnings: string[]
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

  aiConstruction?: AiConstructionTrace

}
export type LessonGenerationResult = {

  blueprint: LessonBlueprint

  planningIdeas: LessonPlanningIdeas

  lessonSpec: LessonSpec

  lessonPackage: LessonPackage

  trace: LessonPipelineTrace

}










