import { create } from "zustand"
import { detectLessonTargets } from "../engine/blueprint/detectLessonTargets"
import {
  ExemplarStyleSettings,
  LessonBlueprint,
  LessonInputs,
  LessonMode,
  LessonPackage,
  LessonPlanningIdeas,
  LessonPipelineTrace,
  LessonSpec,
  MaterialAnalysis,
  MaterialFile,
  MaterialRole,
  MaterialStatus,
  MissingAreaDecisionChoice,
  PlanningComponentKey,
} from "../engine/types"

type MaterialCounts = {
  total: number
  uploaded: number
  extracting: number
  analyzing: number
  ready: number
  error: number
}

type TargetPreview = {
  primary: string
  secondary: string | null
  isMixedTarget: boolean
  recommendedMode: LessonMode
  message: string
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
  missingAreaDecisions: Partial<Record<PlanningComponentKey, MissingAreaDecisionChoice>>

  setInputs: (updates: Partial<LessonInputs>) => void
  setSelectedLessonMode: (mode: LessonMode) => void

  addMaterial: (role: MaterialRole, name?: string) => string
  setMaterialSource: (
    id: string,
    source: {
      fileBuffer: ArrayBuffer | null
      fileContent?: string | null
    }
  ) => void
  updateMaterialStatus: (id: string, status: MaterialStatus) => void
  setMaterialAnalysis: (id: string, analysis: MaterialAnalysis) => void
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
  hasProcessingMaterials: () => boolean
  canGenerate: () => boolean
  getMaterialCounts: () => MaterialCounts
  getTargetPreview: () => TargetPreview
}

const emptyInputs: LessonInputs = {
  grade: "",
  subject: "",
  standard: "",
  skill: "",
  topic: "",
  duration: "",
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

function defaultExemplarStyleSettings(): ExemplarStyleSettings {
  return {
    mode: "inspiration",
    aspects: [],
    customInstructions: "",
  }
}

function buildTargetPreview(
  inputs: LessonInputs,
  selectedLessonMode: LessonMode
): TargetPreview {
  const detected = detectLessonTargets(inputs, selectedLessonMode)

  if (detected.isMixedTarget) {
    return {
      primary: detected.primary === "mixed" ? "phonics" : detected.primary,
      secondary: detected.secondary,
      isMixedTarget: true,
      recommendedMode: detected.recommendedMode,
      message:
        selectedLessonMode === "single"
          ? "Inputs appear mixed. Full mixed lesson is likely the best fit unless you want only one portion."
          : `Inputs appear mixed. Current selection: ${selectedLessonMode}.`,
    }
  }

  if (detected.primary === "phonics") {
    return {
      primary: "phonics",
      secondary: detected.secondary,
      isMixedTarget: false,
      recommendedMode: detected.recommendedMode,
      message: "Inputs currently read mostly as phonics-focused.",
    }
  }

  if (detected.primary === "comprehension") {
    return {
      primary: "comprehension",
      secondary: detected.secondary,
      isMixedTarget: false,
      recommendedMode: detected.recommendedMode,
      message: "Inputs currently read mostly as comprehension-focused.",
    }
  }

  return {
    primary: "general",
    secondary: null,
    isMixedTarget: false,
    recommendedMode: detected.recommendedMode,
    message: "Add more lesson detail or choose a lesson shape manually if needed.",
  }
}

export const useLessonStore = create<LessonStore>((set, get) => ({
  inputs: emptyInputs,
  materials: [],
  selectedLessonMode: "single",
  blueprint: null,
  planningIdeas: null,
  lessonSpec: null,
  lessonPackage: null,
  lessonTrace: null,
  missingAreaDecisions: {},

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

  addMaterial: (role, name) => {
    const timestamp = Date.now().toString()
    const id = `${role}-${timestamp}`

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
              styleSettings: settings,
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

    const { processMaterialForStore } = await import("./workflows/processMaterialForStore")

    await processMaterialForStore(id, store.materials, {
      beginMaterialExtraction: store.beginMaterialExtraction,
      beginMaterialAnalysis: store.beginMaterialAnalysis,
      setMaterialAnalysis: store.setMaterialAnalysis,
      setMaterialError: store.setMaterialError,
    })
  },

  generateLesson: async () => {
    const store = get()

    const { generateLessonForStore } = await import("./workflows/generateLessonForStore")

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
            materials: current.materials,
            selectedLessonMode: current.selectedLessonMode,
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
      isFilled(inputs.standard) &&
      isFilled(inputs.skill) &&
      isFilled(inputs.topic) &&
      isFilled(inputs.duration)
    )
  },

  hasReadyMaterials: () => {
    const { materials } = get()
    return materials.some(
      (material) => material.status === "ready" && Boolean(material.analysis)
    )
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
    return (
      store.hasRequiredInputs() &&
      !store.hasProcessingMaterials() &&
      store.hasReadyMaterials()
    )
  },

  getMaterialCounts: () => buildMaterialCounts(get().materials),

  getTargetPreview: () => {
    const { inputs, selectedLessonMode } = get()
    return buildTargetPreview(inputs, selectedLessonMode)
  },
}))

