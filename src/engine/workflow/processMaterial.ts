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
      summary: buildSummary(material.role, extraction.extractedText, analysisResult.analysis.summary),
      extractedText: extraction.extractedText,
      tags: deriveTags(extraction.extractedText, material.role, analysisResult.analysis.tags),
      sourceRole: material.role,
    }

    store.setMaterialAnalysis(id, analysis)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown material processing error"

    store.setMaterialError(id, message)
  }
}

function buildSummary(
  role: "curriculum" | "exemplar",
  extractedText: string[],
  preferredSummary?: string
): string {
  if (preferredSummary && preferredSummary.trim().length > 0) {
    return preferredSummary
  }

  const lineCount = extractedText.length

  if (role === "curriculum") {
    return lineCount > 0
      ? `Curriculum material processed with ${lineCount} extracted text lines.`
      : "Curriculum material processed, but no usable text was extracted."
  }

  return lineCount > 0
    ? `Exemplar material processed with ${lineCount} extracted text lines.`
    : "Exemplar material processed, but no usable text was extracted."
}

function deriveTags(
  lines: string[],
  role: "curriculum" | "exemplar",
  preferredTags: string[] = []
): string[] {
  const baseTags =
    role === "curriculum"
      ? ["curriculum", "content", "instruction"]
      : ["exemplar", "structure", "presentation"]

  const shortLines = lines
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && line.split(/\s+/).length <= 5)
    .slice(0, 5)

  return Array.from(new Set([...baseTags, ...preferredTags, ...shortLines]))
}
