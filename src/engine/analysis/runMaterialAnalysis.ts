import { analyzeMaterial, AnalyzeMaterialInput } from "../materials/analyzeMaterial"
import { ExtractionMetadata, MaterialRole } from "../types"

/**
 * Central entrypoint for all material analysis.
 * Currently runs heuristic analysis only.
 * Future versions will also include AI analysis.
 */
export async function runMaterialAnalysis(
  materialId: string,
  name: string,
  role: MaterialRole,
  extractedText: string[],
  extractionMetadata?: ExtractionMetadata
) {
  const input: AnalyzeMaterialInput = {
    materialId,
    name,
    role,
    extractedText,
    extractionMetadata,
  }

  const heuristicResult = await analyzeMaterial(input)

  // Future extension point:
  // const aiResult = await analyzeMaterialAI(input)

  return heuristicResult
}
