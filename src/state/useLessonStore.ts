import { create } from "zustand"
import {
  AssessmentOutputTypeKey,
  CenterFocusKey,
  CenterOutputOptionKey,
  ExemplarStyleSettings,
  GroupOutputKindKey,
  LessonBlueprint,
  LessonInputs,
  LessonMode,
  LessonOutputContents,
  LessonPackage,
  LessonPlanContentPartKey,
  LessonPlanningIdeas,
  LessonPipelineTrace,
  LessonSpec,
  MaterialAnalysis,
  MaterialAnalysisReview,
  MaterialFile,
  MaterialRole,
  MaterialSourceKind,
  MaterialStatus,
  MissingAreaDecisionChoice,
  OtherOutputKey,
  PlanningComponentKey,
  SmallGroupTierKey,
  createDefaultOutputContents,
  normalizeOutputContents,
} from "../engine/types"
import { evaluateGenerationReadiness } from "./workflows/evaluateGenerationReadiness"
import { buildCompactInferredMaterialReview } from "../engine/materials/buildCompactInferredMaterialReview"
import { processMaterialForStore } from "./workflows/processMaterialForStore"
import { generateLessonForStore } from "./workflows/generateLessonForStore"

type MaterialCounts = {
  total: number
  uploaded: number
  extracting: number
  analyzing: number
  ready: number
  error: number
}

type LessonStore = {
  inputs: LessonInputs
  materials: MaterialFile[]
  selectedLessonMode: LessonMode
  blueprint: LessonBlueprint | null
  planningIdeas: LessonPlanningIdeas | null
  lessonSpec: LessonSpec | null
  lessonPackage: LessonPackage | null
  lessonTrace: LessonPipelineTrace | null
  outputContents: LessonOutputContents
  missingAreaDecisions: Partial<Record<PlanningComponentKey, MissingAreaDecisionChoice>>

  setInputs: (updates: Partial<LessonInputs>) => void
  setSelectedLessonMode: (mode: LessonMode) => void
  setOutputContents: (outputContents: LessonOutputContents) => void
  toggleLessonPlanOutput: () => void
  toggleLessonSlidesOutput: () => void
  toggleLessonPlanPart: (part: LessonPlanContentPartKey) => void
  toggleAssessmentType: (type: AssessmentOutputTypeKey) => void
  toggleCenterOption: (option: CenterOutputOptionKey) => void
  toggleCenterFocus: (focus: CenterFocusKey) => void
  toggleSmallGroupTier: (tier: SmallGroupTierKey) => void
  toggleGroupOutput: (output: GroupOutputKindKey) => void
  toggleOtherOutput: (output: OtherOutputKey) => void

  addMaterial: (
    role: MaterialRole,
    name?: string,
    options?: {
      sourceKind?: MaterialSourceKind
      sourceLabel?: string | null
      sourceMimeType?: string | null
    }
  ) => string
  setMaterialSource: (
    id: string,
    source: {
      fileBuffer: ArrayBuffer | null
      fileContent?: string | null
      sourceKind?: MaterialSourceKind
      sourceLabel?: string | null
      sourceMimeType?: string | null
    }
  ) => void
  updateMaterialStatus: (id: string, status: MaterialStatus) => void
  setMaterialAnalysis: (id: string, analysis: MaterialAnalysis) => void
  setMaterialAnalysisReview: (id: string, review: MaterialAnalysisReview | null) => void
  setMaterialError: (id: string, message: string) => void
  setMaterialStyleSettings: (id: string, settings: ExemplarStyleSettings) => void
  removeMaterial: (id: string) => void

  beginMaterialExtraction: (id: string) => void
  beginMaterialAnalysis: (id: string) => void

  setBlueprint: (blueprint: LessonBlueprint | null) => void
  setPlanningIdeas: (planningIdeas: LessonPlanningIdeas | null) => void
  setLessonSpec: (spec: LessonSpec | null) => void
  setLessonPackage: (pkg: LessonPackage | null) => void
  setLessonTrace: (trace: LessonPipelineTrace | null) => void
  setMissingAreaDecision: (
    component: PlanningComponentKey,
    choice: MissingAreaDecisionChoice
  ) => void
  clearMissingAreaDecisions: () => void
  resetGeneratedContent: () => void
  processMaterial: (id: string) => Promise<void>
  generateLesson: () => Promise<void>

  hasRequiredInputs: () => boolean
  hasReadyMaterials: () => boolean
  hasUsableMaterialsForGeneration: () => boolean
  getGenerationReadinessMessage: () => string | null
  hasProcessingMaterials: () => boolean
  canGenerate: () => boolean
  getMaterialCounts: () => MaterialCounts
}

const emptyInputs: LessonInputs = {
  grade: "",
  subject: "",
  standard: "",
  skill: "",
  topic: "",
  duration: "",
  notes: "",
}

function clearedGeneratedState() {
  return {
    blueprint: null,
    planningIdeas: null,
    lessonSpec: null,
    lessonPackage: null,
    lessonTrace: null,
    missingAreaDecisions: {},
  }
}

function isFilled(value: string): boolean {
  return value.trim().length > 0
}

function buildMaterialCounts(materials: MaterialFile[]): MaterialCounts {
  return materials.reduce(
    (counts, material) => {
      counts.total += 1
      counts[material.status] += 1
      return counts
    },
    {
      total: 0,
      uploaded: 0,
      extracting: 0,
      analyzing: 0,
      ready: 0,
      error: 0,
    }
  )
}

function defaultMaterialName(role: MaterialRole, timestamp: string): string {
  return role === "curriculum"
    ? `curriculum-${timestamp}`
    : `exemplar-${timestamp}`
}

let materialIdCounter = 0

function createMaterialId(role: MaterialRole): string {
  materialIdCounter += 1

  const timestamp = Date.now().toString(36)
  const counter = materialIdCounter.toString(36)
  const random = Math.random().toString(36).slice(2, 8)

  return `${role}-${timestamp}-${counter}-${random}`
}

function defaultExemplarStyleSettings(): ExemplarStyleSettings {
  return {
    mode: "inspiration",
    aspects: [],
    customInstructions: "",
    targets: ["shared"],
  }
}

function normalizeExemplarStyleSettings(
  settings?: ExemplarStyleSettings | null
): ExemplarStyleSettings {
  const defaults = defaultExemplarStyleSettings()

  return {
    mode: settings?.mode ?? defaults.mode,
    aspects: [...(settings?.aspects ?? defaults.aspects)],
    customInstructions: settings?.customInstructions ?? defaults.customInstructions,
    targets: [...((settings?.targets && settings.targets.length > 0) ? settings.targets : defaults.targets)],
  }
}


function normalizeMaterialAnalysisReview(
  review?: MaterialAnalysisReview | null
): MaterialAnalysisReview | null {
  if (!review) {
    return null
  }

  const normalizeList = (values?: string[]) =>
    [...(values ?? [])]
      .map((value) => value.trim())
      .filter(Boolean)

  return {
    standards: normalizeList(review.standards),
    vocabulary: normalizeList(review.vocabulary),
    wordLists: normalizeList(review.wordLists),
    instructionalTargets: normalizeList(review.instructionalTargets),
    texts: normalizeList(review.texts),
    practiceIdeas: normalizeList(review.practiceIdeas),
    exemplarStructure: normalizeList(review.exemplarStructure),
    teacherSummary: review.teacherSummary?.trim() ?? "",
  }
}

export function mergeMaterialWithReview(
  material: MaterialFile,
  inputs?: LessonInputs
): MaterialFile {
  const review = normalizeMaterialAnalysisReview(
    material.analysisReview ?? (inputs ? buildCompactInferredMaterialReview(material, inputs) : null)
  )

  if (!material.analysis || !review) {
    return material
  }

  const curriculum = material.analysis.curriculum
  const exemplar = material.analysis.exemplar
  const teacherSummary = review.teacherSummary.trim()
  const withTeacherSummary = (values: string[]) =>
    teacherSummary.length > 0 ? [...values, teacherSummary] : values

  return {
    ...material,
    analysis: {
      ...material.analysis,
      summary: review.teacherSummary || material.analysis.summary,
      curriculum: curriculum
        ? {
            ...curriculum,
            standards: review.standards,
            vocabulary: review.vocabulary,
            wordLists: review.wordLists ?? [],
            instructionalTargets: withTeacherSummary(review.instructionalTargets),
            texts: review.texts,
            practiceTasks: review.practiceIdeas,
            examples: review.wordLists ?? [],
            coverage: curriculum.coverage
              ? {
                  ...curriculum.coverage,
                  instructionalTargets: withTeacherSummary(review.instructionalTargets),
                }
              : curriculum.coverage,
          }
        : curriculum,
      exemplar: exemplar
        ? {
            ...exemplar,
            reusableStructure: review.exemplarStructure,
          }
        : exemplar,
    },
    analysisReview: review,
  }
}
function defaultOutputContents(): LessonOutputContents {
  return createDefaultOutputContents()
}

const LESSON_STORE_SNAPSHOT_KEY = "lesson-generator8__workspace_v1"

function getLessonWorkspaceStorage(): Storage | null {
  if (typeof globalThis === "undefined") {
    return null
  }

  const candidate = (globalThis as { localStorage?: Storage }).localStorage
  return candidate ?? null
}

type LessonWorkspaceSnapshot = {
  inputs: LessonInputs
  materials: MaterialFile[]
  selectedLessonMode: LessonMode
  blueprint: LessonBlueprint | null
  planningIdeas: LessonPlanningIdeas | null
  lessonSpec: LessonSpec | null
  lessonPackage: LessonPackage | null
  lessonTrace: LessonPipelineTrace | null
  outputContents: LessonOutputContents
  missingAreaDecisions: Partial<Record<PlanningComponentKey, MissingAreaDecisionChoice>>
}

function rehydratePersistedMaterials(materials: MaterialFile[]): MaterialFile[] {
  return materials.map((material) => {
    const lostUploadSource =
      !material.analysis &&
      !material.fileContent &&
      (material.status === "uploaded" ||
        material.status === "extracting" ||
        material.status === "analyzing")

    return {
      ...material,
      fileBuffer: null,
      fileContent: material.fileContent ?? null,
      sourceKind: material.sourceKind ?? "file_upload",
      sourceLabel: material.sourceLabel ?? null,
      sourceMimeType: material.sourceMimeType ?? null,
      styleSettings:
        material.role === "exemplar"
          ? normalizeExemplarStyleSettings(material.styleSettings)
          : null,
      status: lostUploadSource ? "error" : material.status,
      errorMessage: lostUploadSource
        ? material.errorMessage ?? "Re-upload this source after refresh to continue processing."
        : material.errorMessage ?? null,
    }
  })
}

function safeLoadLessonWorkspace(): LessonWorkspaceSnapshot | null {
  const storage = getLessonWorkspaceStorage()
  if (!storage) {
    return null
  }

  try {
    const raw = storage.getItem(LESSON_STORE_SNAPSHOT_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<LessonWorkspaceSnapshot>

    return {
      inputs: {
        ...emptyInputs,
        ...(parsed.inputs ?? {}),
      },
      materials: rehydratePersistedMaterials(
        Array.isArray(parsed.materials) ? (parsed.materials as MaterialFile[]) : []
      ),
      selectedLessonMode: parsed.selectedLessonMode ?? "single",
      blueprint: parsed.blueprint ?? null,
      planningIdeas: parsed.planningIdeas ?? null,
      lessonSpec: parsed.lessonSpec ?? null,
      lessonPackage: parsed.lessonPackage ?? null,
      lessonTrace: parsed.lessonTrace ?? null,
      outputContents: normalizeOutputContents(
        parsed.outputContents ?? defaultOutputContents()
      ),
      missingAreaDecisions: parsed.missingAreaDecisions ?? {},
    }
  } catch {
    return null
  }
}

function safeSaveLessonWorkspace(state: LessonStore) {
  const storage = getLessonWorkspaceStorage()
  if (!storage) {
    return
  }

  try {
    const snapshot: LessonWorkspaceSnapshot = {
      inputs: state.inputs,
      materials: state.materials.map((material) => ({
        ...material,
        fileBuffer: null,
        fileContent: material.fileContent ?? null,
        sourceKind: material.sourceKind ?? "file_upload",
        sourceLabel: material.sourceLabel ?? null,
        sourceMimeType: material.sourceMimeType ?? null,
        styleSettings:
          material.role === "exemplar"
            ? normalizeExemplarStyleSettings(material.styleSettings)
            : null,
      })),
      selectedLessonMode: state.selectedLessonMode,
      blueprint: state.blueprint,
      planningIdeas: state.planningIdeas,
      lessonSpec: state.lessonSpec,
      lessonPackage: state.lessonPackage,
      lessonTrace: state.lessonTrace,
      outputContents: state.outputContents,
      missingAreaDecisions: state.missingAreaDecisions,
    }

    storage.setItem(LESSON_STORE_SNAPSHOT_KEY, JSON.stringify(snapshot))
  } catch {
    // ignore persistence failures
  }
}

const hydratedWorkspace = safeLoadLessonWorkspace()

export const useLessonStore = create<LessonStore>((set, get) => ({
  inputs: hydratedWorkspace?.inputs ?? emptyInputs,
  materials: hydratedWorkspace?.materials ?? [],
  selectedLessonMode: hydratedWorkspace?.selectedLessonMode ?? "single",
  blueprint: hydratedWorkspace?.blueprint ?? null,
  planningIdeas: hydratedWorkspace?.planningIdeas ?? null,
  lessonSpec: hydratedWorkspace?.lessonSpec ?? null,
  lessonPackage: hydratedWorkspace?.lessonPackage ?? null,
  lessonTrace: hydratedWorkspace?.lessonTrace ?? null,
  outputContents: hydratedWorkspace?.outputContents ?? defaultOutputContents(),
  missingAreaDecisions: hydratedWorkspace?.missingAreaDecisions ?? {},

  setInputs: (updates) =>
    set((state) => ({
      inputs: {
        ...state.inputs,
        ...updates,
      },
      ...clearedGeneratedState(),
    })),

  setSelectedLessonMode: (selectedLessonMode) =>
    set({
      selectedLessonMode,
      ...clearedGeneratedState(),
    }),

  setOutputContents: (outputContents) =>
    set({
      outputContents: normalizeOutputContents(outputContents),
      ...clearedGeneratedState(),
    }),

  toggleLessonPlanOutput: () =>
    set((state) => ({
      outputContents: normalizeOutputContents({
        ...state.outputContents,
        lessonPlan: {
          ...state.outputContents.lessonPlan,
          selected: !state.outputContents.lessonPlan.selected,
        },
      }),
      ...clearedGeneratedState(),
    })),

  toggleLessonSlidesOutput: () =>
    set((state) => ({
      outputContents: normalizeOutputContents({
        ...state.outputContents,
        lessonSlides: {
          ...state.outputContents.lessonSlides,
          selected: !state.outputContents.lessonSlides.selected,
        },
      }),
      ...clearedGeneratedState(),
    })),

  toggleLessonPlanPart: (part) =>
    set((state) => ({
      outputContents: normalizeOutputContents({
        ...state.outputContents,
        lessonPlan: {
          ...state.outputContents.lessonPlan,
          parts: {
            ...state.outputContents.lessonPlan.parts,
            [part]: !state.outputContents.lessonPlan.parts[part],
          },
        },
      }),
      ...clearedGeneratedState(),
    })),

  toggleAssessmentType: (type) =>
    set((state) => ({
      outputContents: normalizeOutputContents({
        ...state.outputContents,
        assessment: {
          ...state.outputContents.assessment,
          types: {
            ...state.outputContents.assessment.types,
            [type]: !state.outputContents.assessment.types[type],
          },
        },
      }),
      ...clearedGeneratedState(),
    })),

  toggleCenterOption: (option) =>
    set((state) => ({
      outputContents: normalizeOutputContents({
        ...state.outputContents,
        centers: {
          ...state.outputContents.centers,
          options: {
            ...state.outputContents.centers.options,
            [option]: !state.outputContents.centers.options[option],
          },
        },
      }),
      ...clearedGeneratedState(),
    })),

  toggleCenterFocus: (focus) =>
    set((state) => ({
      outputContents: normalizeOutputContents({
        ...state.outputContents,
        centers: {
          ...state.outputContents.centers,
          focuses: {
            ...state.outputContents.centers.focuses,
            [focus]: !state.outputContents.centers.focuses[focus],
          },
        },
      }),
      ...clearedGeneratedState(),
    })),

  toggleSmallGroupTier: (tier) =>
    set((state) => ({
      outputContents: normalizeOutputContents({
        ...state.outputContents,
        smallGroup: {
          ...state.outputContents.smallGroup,
          tiers: {
            ...state.outputContents.smallGroup.tiers,
            [tier]: !state.outputContents.smallGroup.tiers[tier],
          },
        },
      }),
      ...clearedGeneratedState(),
    })),

  toggleGroupOutput: (output) =>
    set((state) => {
      const nextOutputContents = {
        ...state.outputContents,
        centers: {
          ...state.outputContents.centers,
          options: {
            ...state.outputContents.centers.options,
          },
        },
        smallGroup: {
          ...state.outputContents.smallGroup,
          tiers: {
            ...state.outputContents.smallGroup.tiers,
          },
        },
      }

      if (output === "centers") {
        nextOutputContents.centers.options.use_what_you_have =
          !state.outputContents.centers.options.use_what_you_have
      }

      if (output === "small_group") {
        nextOutputContents.smallGroup.tiers.T2 =
          !state.outputContents.smallGroup.tiers.T2
      }

      if (output === "intervention") {
        nextOutputContents.smallGroup.tiers.T3 =
          !state.outputContents.smallGroup.tiers.T3
      }

      return {
        outputContents: normalizeOutputContents(nextOutputContents),
        ...clearedGeneratedState(),
      }
    }),

  toggleOtherOutput: (output) =>
    set((state) => ({
      outputContents: normalizeOutputContents({
        ...state.outputContents,
        other: {
          ...state.outputContents.other,
          [output]: !state.outputContents.other[output],
        },
      }),
      ...clearedGeneratedState(),
    })),

  addMaterial: (role, name, options) => {
    const timestamp = Date.now().toString()
    const id = createMaterialId(role)

    set((state) => ({
      materials: [
        ...state.materials,
        {
          id,
          name: name?.trim() ? name.trim() : defaultMaterialName(role, timestamp),
          role,
          status: "uploaded",
          analysis: null,
          errorMessage: null,
          styleSettings: role === "exemplar" ? defaultExemplarStyleSettings() : null,
          sourceKind: options?.sourceKind ?? "file_upload",
          sourceLabel: options?.sourceLabel ?? null,
          sourceMimeType: options?.sourceMimeType ?? null,
          fileBuffer: null,
          fileContent: null,
        },
      ],
      ...clearedGeneratedState(),
    }))

    return id
  },

  setMaterialSource: (id, source) =>
    set((state) => ({
      materials: state.materials.map((material) =>
        material.id === id
          ? {
              ...material,
              fileBuffer: source.fileBuffer,
              fileContent: source.fileContent ?? null,
              sourceKind: source.sourceKind ?? material.sourceKind ?? "file_upload",
              sourceLabel: source.sourceLabel ?? material.sourceLabel ?? null,
              sourceMimeType: source.sourceMimeType ?? material.sourceMimeType ?? null,
            }
          : material
      ),
      ...clearedGeneratedState(),
    })),

  updateMaterialStatus: (id, status) =>
    set((state) => ({
      materials: state.materials.map((material) =>
        material.id === id
          ? {
              ...material,
              status,
            }
          : material
      ),
    })),

  setMaterialAnalysis: (id, analysis) =>
    set((state) => ({
      materials: state.materials.map((material) =>
        material.id === id
          ? {
              ...material,
              status: "ready",
              analysis,
              errorMessage: null,
            }
          : material
      ),
      ...clearedGeneratedState(),
    })),

  setMaterialAnalysisReview: (id, review) =>
    set((state) => ({
      materials: state.materials.map((material) =>
        material.id === id
          ? {
              ...material,
              analysisReview: normalizeMaterialAnalysisReview(review),
            }
          : material
      ),
      ...clearedGeneratedState(),
    })),
  setMaterialError: (id, message) =>
    set((state) => ({
      materials: state.materials.map((material) =>
        material.id === id
          ? {
              ...material,
              status: "error",
              errorMessage: message,
            }
          : material
      ),
      ...clearedGeneratedState(),
    })),

  setMaterialStyleSettings: (id, settings) =>
    set((state) => ({
      materials: state.materials.map((material) =>
        material.id === id
          ? {
              ...material,
              styleSettings: normalizeExemplarStyleSettings(settings),
            }
          : material
      ),
      ...clearedGeneratedState(),
    })),

  removeMaterial: (id) =>
    set((state) => ({
      materials: state.materials.filter((material) => material.id !== id),
      ...clearedGeneratedState(),
    })),

  beginMaterialExtraction: (id) => {
    get().updateMaterialStatus(id, "extracting")
  },

  beginMaterialAnalysis: (id) => {
    get().updateMaterialStatus(id, "analyzing")
  },

  setBlueprint: (blueprint) => set({ blueprint }),
  setPlanningIdeas: (planningIdeas) => set({ planningIdeas }),
  setLessonSpec: (lessonSpec) => set({ lessonSpec }),
  setLessonPackage: (lessonPackage) => set({ lessonPackage }),
  setLessonTrace: (lessonTrace) => set({ lessonTrace }),

  setMissingAreaDecision: (component, choice) =>
    set((state) => ({
      missingAreaDecisions: {
        ...state.missingAreaDecisions,
        [component]: choice,
      },
    })),

  clearMissingAreaDecisions: () => set({ missingAreaDecisions: {} }),

  resetGeneratedContent: () => set(clearedGeneratedState()),

  processMaterial: async (id) => {
    const store = get()

    if (!store.materials.some((material) => material.id === id)) {
      return
    }

    await processMaterialForStore(id, store.materials, {
      beginMaterialExtraction: store.beginMaterialExtraction,
      beginMaterialAnalysis: store.beginMaterialAnalysis,
      setMaterialAnalysis: store.setMaterialAnalysis,
      setMaterialError: store.setMaterialError,
    })
  },

  generateLesson: async () => {
    const store = get()

    const result = await generateLessonForStore(
      {
        materials: store.materials,
        hasRequiredInputs: store.hasRequiredInputs,
        hasProcessingMaterials: store.hasProcessingMaterials,
      },
      {
        processMaterial: store.processMaterial,
        getCurrentStoreData: () => {
          const current = get()

          return {
            inputs: current.inputs,
            materials: current.materials.map((material) => mergeMaterialWithReview(material, current.inputs)),
            selectedLessonMode: current.selectedLessonMode,
            outputContents: current.outputContents,
            missingAreaDecisions: current.missingAreaDecisions,
          }
        },
      }
    )

    set({
      blueprint: result.blueprint,
      planningIdeas: result.planningIdeas,
      lessonSpec: result.lessonSpec,
      lessonPackage: result.lessonPackage,
      lessonTrace: result.lessonTrace,
    })
  },

  hasRequiredInputs: () => {
    const { inputs } = get()
    return (
      isFilled(inputs.grade) &&
      isFilled(inputs.subject) &&
      isFilled(inputs.skill)
    )
  },

  hasReadyMaterials: () => {
    const { materials } = get()
    return materials.some(
      (material) => material.status === "ready" && Boolean(material.analysis)
    )
  },

  hasUsableMaterialsForGeneration: () => {
    const { materials } = get()
    return materials.some((material) => {
      if (material.status !== "ready" || !material.analysis) {
        return false
      }

      const reliability = material.analysis.reliability
      if (!reliability) {
        return true
      }

      return reliability.usableForContent || reliability.usableForStructure
    })
  },

  getGenerationReadinessMessage: () => {
    const store = get()

    if (!store.hasRequiredInputs() || store.hasProcessingMaterials() || !store.hasUsableMaterialsForGeneration()) {
      return null
    }

    const { inputs, materials, selectedLessonMode } = store
    const mergedMaterials = materials.map((material) => mergeMaterialWithReview(material, inputs))

    const readiness = evaluateGenerationReadiness({
      inputs,
      materials: mergedMaterials,
      selectedLessonMode,
    })

    return readiness.blockerMessage
  },

  hasProcessingMaterials: () => {
    const { materials } = get()
    return materials.some(
      (material) =>
        material.status === "uploaded" ||
        material.status === "extracting" ||
        material.status === "analyzing"
    )
  },

  canGenerate: () => {
    const store = get()
    const readinessMessage = store.getGenerationReadinessMessage()

    return (
      store.hasRequiredInputs() &&
      !store.hasProcessingMaterials() &&
      store.hasUsableMaterialsForGeneration() &&
      !readinessMessage
    )
  },

  getMaterialCounts: () => buildMaterialCounts(get().materials),

}))

useLessonStore.subscribe((state) => {
  safeSaveLessonWorkspace(state)
})
