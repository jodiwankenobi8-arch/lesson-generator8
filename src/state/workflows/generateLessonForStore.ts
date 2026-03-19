import { runLessonPipeline } from "../../engine/pipeline/runLessonPipeline"
import {
  LessonBlueprint,
  LessonInputs,
  LessonMode,
  LessonPackage,
  LessonPipelineTrace,
  LessonPlanningIdeas,
  LessonSpec,
  MaterialFile,
  MissingAreaDecisionChoice,
  PlanningComponentKey,
} from "../../engine/types"

type GenerateLessonDependencies = {
  processMaterial: (id: string) => Promise<void>
  getCurrentStoreData: () => {
    inputs: LessonInputs
    materials: MaterialFile[]
    selectedLessonMode: LessonMode
    missingAreaDecisions: Partial<Record<PlanningComponentKey, MissingAreaDecisionChoice>>
  }
}

type GenerateLessonInput = {
  materials: MaterialFile[]
  hasRequiredInputs: () => boolean
  hasProcessingMaterials: () => boolean
}

type GenerateLessonResult = {
  blueprint: LessonBlueprint
  planningIdeas: LessonPlanningIdeas
  lessonSpec: LessonSpec
  lessonPackage: LessonPackage
  lessonTrace: LessonPipelineTrace
}

function hasUsableSource(material: MaterialFile): boolean {
  return Boolean(material.fileBuffer) || Boolean(material.fileContent?.trim())
}

function isReady(material: MaterialFile): boolean {
  return material.status === "ready" && Boolean(material.analysis)
}

function isUsableForGeneration(material: MaterialFile): boolean {
  if (!isReady(material)) {
    return false
  }

  const reliability = material.analysis?.reliability
  if (!reliability) {
    return true
  }

  return reliability.usableForContent || reliability.usableForStructure
}

export async function generateLessonForStore(
  store: GenerateLessonInput,
  dependencies: GenerateLessonDependencies
): Promise<GenerateLessonResult> {
  if (!store.hasRequiredInputs()) {
    throw new Error("Complete all required lesson inputs before generating.")
  }

  if (store.hasProcessingMaterials()) {
    throw new Error("Wait for current material processing to finish before generating.")
  }

  const current = dependencies.getCurrentStoreData()
  const materialsToPrepare = current.materials.filter((material) => {
    if (isReady(material)) {
      return false
    }

    return hasUsableSource(material)
  })

  for (const material of materialsToPrepare) {
    await dependencies.processMaterial(material.id)
  }

  const refreshed = dependencies.getCurrentStoreData()
  const readyMaterials = refreshed.materials.filter(isReady)
  const usableMaterials = readyMaterials.filter(isUsableForGeneration)

  if (readyMaterials.length === 0) {
    throw new Error("No analyzed materials are ready for lesson generation.")
  }

  if (usableMaterials.length === 0) {
    throw new Error(
      "No usable materials are available for grounded generation. Add a stronger curriculum or exemplar file."
    )
  }

  const result = runLessonPipeline(
    refreshed.inputs,
    readyMaterials,
    refreshed.selectedLessonMode,
    refreshed.missingAreaDecisions
  )

  return {
    blueprint: result.blueprint,
    planningIdeas: result.planningIdeas,
    lessonSpec: result.lessonSpec,
    lessonPackage: result.lessonPackage,
    lessonTrace: result.trace,
  }
}