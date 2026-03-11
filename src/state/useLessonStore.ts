import { create } from "zustand"
import {
  ExemplarStyleSettings,
  LessonBlueprint,
  LessonInputs,
  LessonMode,
  LessonPackage,
  LessonSpec,
  MaterialAnalysis,
  MaterialFile,
  MaterialRole,
  MaterialStatus,
} from "../engine/types"

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
  lessonSpec: LessonSpec | null
  lessonPackage: LessonPackage | null

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
  setLessonSpec: (spec: LessonSpec | null) => void
  setLessonPackage: (pkg: LessonPackage | null) => void
  resetGeneratedContent: () => void

  hasRequiredInputs: () => boolean
  hasReadyMaterials: () => boolean
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
}

function clearedGeneratedState() {
  return {
    blueprint: null,
    lessonSpec: null,
    lessonPackage: null,
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

export const useLessonStore = create<LessonStore>((set, get) => ({
  inputs: emptyInputs,
  materials: [],
  selectedLessonMode: "single",
  blueprint: null,
  lessonSpec: null,
  lessonPackage: null,

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
  setLessonSpec: (lessonSpec) => set({ lessonSpec }),
  setLessonPackage: (lessonPackage) => set({ lessonPackage }),

  resetGeneratedContent: () => set(clearedGeneratedState()),

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
    return materials.some((material) => material.status === "ready")
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
}))
