import { extractTextFromFile } from "../materials/extractTextFromFile"
import { analyzeMaterial } from "../materials/analyzeMaterial"
import { useLessonStore } from "../../state/useLessonStore"
import { MaterialAnalysis } from "../types"

export async function processMaterial(id: string) {
  const store = useLessonStore.getState()
  const material = store.materials.find((m) => m.id === id)

  if (!material) {
    return
  }

  try {
    store.beginMaterialExtraction(id)

    const extraction = await extractTextFromFile({
      fileName: material.name,
      fileBuffer: material.fileBuffer ?? undefined,
      fileContent: material.fileContent ?? undefined,
    })

    store.beginMaterialAnalysis(id)

    const analysisResult = await analyzeMaterial({
      materialId: material.id,
      name: material.name,
      extractedText: extraction.extractedText,
      role: material.role,
    })

    const analysis: MaterialAnalysis = {
      ...analysisResult.analysis,
      extractionMetadata: extraction.extractionMetadata,
    }

    store.setMaterialAnalysis(id, analysis)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown material processing error"

    store.setMaterialError(id, message)
  }
}
