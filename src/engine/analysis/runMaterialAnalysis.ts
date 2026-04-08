import { analyzeMaterial, AnalyzeMaterialInput } from "../materials/analyzeMaterial"
import { ExtractionMetadata, MaterialRole } from "../types"
import { analyzeMaterialAI, mergeMaterialAnalysis } from "./materialAnalysisAi"

/**
 * Central entrypoint for all material analysis.
 * Heuristic analysis stays the deterministic baseline.
 * When AI material analysis is enabled, it normalizes curriculum/exemplar
 * signals into cleaner teacher-facing grounding without replacing provenance.
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

  try {
    const aiResult = await analyzeMaterialAI(input)

    if (!aiResult) {
      return heuristicResult
    }

    return {
      materialId,
      analysis: mergeMaterialAnalysis(heuristicResult.analysis, aiResult),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown-ai-analysis-error"

    return {
      materialId,
      analysis: {
        ...heuristicResult.analysis,
        tags: Array.from(
          new Set([
            ...heuristicResult.analysis.tags,
            "ai-analysis-unavailable",
            `ai-analysis-error:${message.slice(0, 48)}`,
          ])
        ).slice(0, 20),
      },
    }
  }
}
