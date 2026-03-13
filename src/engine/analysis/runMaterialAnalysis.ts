import { analyzeMaterial, AnalyzeMaterialInput } from "../materials/analyzeMaterial"
import { MaterialRole } from "../types"

/**
 * Central entrypoint for all material analysis.
 * Currently runs heuristic analysis only.
 * Future versions will also include AI analysis.
 */
export async function runMaterialAnalysis(
  materialId: string,
  name: string,
  role: MaterialRole,
  extractedText: string[]
) {
  const input: AnalyzeMaterialInput = {
    materialId,
    name,
    role,
    extractedText,
  }

  const heuristicResult = await analyzeMaterial(input)

  // Future extension point:
  // const aiResult = await analyzeMaterialAI(input)

  return heuristicResult
}
