import { runMaterialAnalysis } from "../../engine/analysis/runMaterialAnalysis"
import { extractTextFromFile } from "../../engine/materials/extractTextFromFile"
import { MaterialAnalysis, MaterialFile } from "../../engine/types"

type ProcessMaterialActions = {
  beginMaterialExtraction: (id: string) => void
  beginMaterialAnalysis: (id: string) => void
  setMaterialAnalysis: (id: string, analysis: MaterialAnalysis) => void
  setMaterialError: (id: string, message: string) => void
}

function hasUsableSource(material: MaterialFile): boolean {
  return Boolean(material.fileBuffer) || Boolean(material.fileContent?.trim())
}

export async function processMaterialForStore(
  id: string,
  materials: MaterialFile[],
  actions: ProcessMaterialActions
): Promise<void> {
  const material = materials.find((item) => item.id === id)

  if (!material) {
    return
  }

  if (!hasUsableSource(material)) {
    actions.setMaterialError(id, "No file content is available for processing.")
    return
  }

  try {
    actions.beginMaterialExtraction(id)

    const extraction = await extractTextFromFile({
      fileName: material.name,
      fileBuffer: material.fileBuffer ?? undefined,
      fileContent: material.fileContent ?? undefined,
      sourceKind: material.sourceKind,
      sourceLabel: material.sourceLabel ?? undefined,
      sourceMimeType: material.sourceMimeType ?? undefined,
    })

    actions.beginMaterialAnalysis(id)

    const result = await runMaterialAnalysis(
      material.id,
      material.name,
      material.role,
      extraction.extractedText,
      extraction.extractionMetadata
    )

    const analysis: MaterialAnalysis = {
      ...result.analysis,
      extractionMetadata: extraction.extractionMetadata,
    }

    actions.setMaterialAnalysis(id, analysis)
  } catch (error) {
    actions.setMaterialError(
      id,
      error instanceof Error ? error.message : "Unknown material processing error"
    )
  }
}