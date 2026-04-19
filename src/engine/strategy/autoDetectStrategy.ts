import type { MaterialAnalysis } from "../types"
import {
  analyzeCurriculumQuality,
  type CurriculumQualityScore,
} from "../materials/analyzeCurriculumQuality"
import {
  analyzeExemplarQuality,
  type ExemplarQualityScore,
} from "../materials/analyzeExemplarQuality"

export type GenerationMode = "exemplar-strict" | "exemplar-guided" | "creative-build"

export interface AutoDetectionResult {
  mode: GenerationMode
  curriculumQuality: CurriculumQualityScore
  exemplarQuality: ExemplarQualityScore
  reasoning: string
  confidence: "high" | "medium" | "low"
}

export function autoDetectGenerationStrategy(
  materials: MaterialAnalysis[]
): AutoDetectionResult {
  const curriculumQuality = analyzeCurriculumQuality(materials)
  const exemplarQuality = analyzeExemplarQuality(materials)

  const { mode, reasoning, confidence } = determineMode(
    curriculumQuality,
    exemplarQuality
  )

  return {
    mode,
    curriculumQuality,
    exemplarQuality,
    reasoning,
    confidence,
  }
}

function determineMode(
  curriculum: CurriculumQualityScore,
  exemplar: ExemplarQualityScore
): {
  mode: GenerationMode
  reasoning: string
  confidence: "high" | "medium" | "low"
} {
  const curriculumScore = curriculum.overall
  const exemplarScore = exemplar.overall

  if (curriculumScore >= 0.8 && exemplarScore >= 0.8) {
    return {
      mode: "exemplar-strict",
      reasoning:
        "Strong curriculum content and clear exemplar structure detected. Following exemplar closely with curriculum content.",
      confidence: "high",
    }
  }

  if (exemplarScore >= 0.8 && curriculumScore >= 0.4) {
    return {
      mode: "exemplar-strict",
      reasoning:
        "Clear exemplar structure with some curriculum content. Following exemplar structure and using available curriculum content for grounding.",
      confidence: "medium",
    }
  }

  if (exemplarScore >= 0.5 && curriculumScore >= 0.8) {
    return {
      mode: "exemplar-guided",
      reasoning:
        "Strong curriculum with partial exemplar guidance. Using exemplar structure flexibly while keeping curriculum content primary.",
      confidence: "high",
    }
  }

  if (exemplarScore >= 0.5 && curriculumScore >= 0.4) {
    return {
      mode: "exemplar-guided",
      reasoning:
        "Moderate curriculum and exemplar materials. Using exemplar as a guide with flexible generation support.",
      confidence: "medium",
    }
  }

  if (exemplarScore < 0.5 && curriculumScore >= 0.8) {
    return {
      mode: "exemplar-guided",
      reasoning:
        "Strong curriculum but limited exemplar structure. Using grounded curriculum content with lighter structural guidance.",
      confidence: "medium",
    }
  }

  if (exemplarScore < 0.5 && curriculumScore >= 0.4) {
    return {
      mode: "creative-build",
      reasoning:
        "Partial curriculum with minimal exemplar structure. Building a lesson from available content with lighter structural support.",
      confidence: "medium",
    }
  }

  if (curriculumScore < 0.4 && exemplarScore < 0.5) {
    return {
      mode: "creative-build",
      reasoning:
        "Limited curriculum and exemplar materials. Building with the weakest source support level.",
      confidence: "low",
    }
  }

  if (exemplarScore >= 0.8 && curriculumScore < 0.4) {
    return {
      mode: "exemplar-strict",
      reasoning:
        "Clear exemplar structure with minimal curriculum content. Preserving exemplar structure while relying on limited grounded content.",
      confidence: "medium",
    }
  }

  return {
    mode: "creative-build",
    reasoning:
      "Mixed material quality. Building with flexible support based on the available source signals.",
    confidence: "low",
  }
}
