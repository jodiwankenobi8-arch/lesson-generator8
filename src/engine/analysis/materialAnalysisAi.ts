import type { AnalyzeMaterialInput } from "../materials/analyzeMaterial"
import type { MaterialAnalysis } from "../types"

type AiCurriculumPayload = {
  standards: string[]
  vocabulary: string[]
  wordLists: string[]
  texts: string[]
  practiceTasks: string[]
  instructionalTargets: string[]
  examples: string[]
  coverage: {
    foundationalSkills: string[]
    sightWords: string[]
    lessonSegments: string[]
  }
}

type AiExemplarPayload = {
  slideFlow: string[]
  pacing: string[]
  teacherMoves: string[]
  promptStyle: string[]
  layoutCues: string[]
  tone: string[]
  reusableStructure: string[]
}

export type AiMaterialAnalysisResponse = {
  enabled: boolean
  role: "curriculum" | "exemplar"
  confidence: number
  summary: string
  warnings: string[]
  ignoredLines: string[]
  curriculum: AiCurriculumPayload
  exemplar: AiExemplarPayload
}

const MAX_FIELD_ITEMS = 8

function uniqueClean(items: string[] = [], limit = MAX_FIELD_ITEMS): string[] {
  const seen = new Set<string>()
  const cleaned: string[] = []

  for (const item of items) {
    const normalized = String(item ?? "").replace(/\s+/g, " ").trim()
    if (!normalized) {
      continue
    }

    const key = normalized.toLowerCase()
    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    cleaned.push(normalized)

    if (cleaned.length >= limit) {
      break
    }
  }

  return cleaned
}

function chooseAiList(aiItems: string[] | undefined, fallbackItems: string[] = []): string[] {
  const cleanedAi = uniqueClean(aiItems ?? [])
  return cleanedAi.length > 0 ? cleanedAi : uniqueClean(fallbackItems)
}

function buildEndpoint(): string {
  const baseUrl = String(import.meta.env.VITE_AI_ANALYSIS_URL ?? "").replace(/\/$/, "")
  return baseUrl ? `${baseUrl}/api/material-analysis` : "/api/material-analysis"
}

export async function analyzeMaterialAI(
  input: AnalyzeMaterialInput
): Promise<AiMaterialAnalysisResponse | null> {
  const enabled =
    String(import.meta.env.VITE_ENABLE_AI_MATERIAL_ANALYSIS ?? "false") === "true"

  if (!enabled) {
    return null
  }

  const response = await fetch(buildEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      materialId: input.materialId,
      name: input.name,
      role: input.role,
      extractedText: input.extractedText,
      extractionMetadata: input.extractionMetadata,
    }),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || "AI material analysis request failed.")
  }

  return (await response.json()) as AiMaterialAnalysisResponse
}

export function mergeMaterialAnalysis(
  heuristic: MaterialAnalysis,
  ai: AiMaterialAnalysisResponse
): MaterialAnalysis {
  if (ai.confidence < 0.65) {
    return {
      ...heuristic,
      tags: uniqueClean([...heuristic.tags, "ai-low-confidence"], 16),
    }
  }

  const merged: MaterialAnalysis = {
    ...heuristic,
    summary: ai.summary?.trim() ? ai.summary.trim() : heuristic.summary,
    tags: uniqueClean(
      [...heuristic.tags, "ai-normalized", "ai-confidence:" + ai.confidence.toFixed(2)],
      16
    ),
  }

  if (heuristic.curriculum && ai.role === "curriculum") {
    const currentCoverage = heuristic.curriculum.coverage

    merged.curriculum = {
      standards: chooseAiList(ai.curriculum.standards, heuristic.curriculum.standards),
      vocabulary: chooseAiList(ai.curriculum.vocabulary, heuristic.curriculum.vocabulary),
      wordLists: chooseAiList(ai.curriculum.wordLists, heuristic.curriculum.wordLists),
      texts: chooseAiList(ai.curriculum.texts, heuristic.curriculum.texts),
      practiceTasks: chooseAiList(
        ai.curriculum.practiceTasks,
        heuristic.curriculum.practiceTasks
      ),
      instructionalTargets: chooseAiList(
        ai.curriculum.instructionalTargets,
        heuristic.curriculum.instructionalTargets
      ),
      examples: chooseAiList(ai.curriculum.examples, heuristic.curriculum.examples),
      coverage: {
        standards: chooseAiList(
          ai.curriculum.standards,
          currentCoverage?.standards ?? heuristic.curriculum.standards
        ),
        instructionalTargets: chooseAiList(
          ai.curriculum.instructionalTargets,
          currentCoverage?.instructionalTargets ?? heuristic.curriculum.instructionalTargets
        ),
        foundationalSkills: chooseAiList(
          ai.curriculum.coverage?.foundationalSkills,
          currentCoverage?.foundationalSkills ?? []
        ),
        sightWords: chooseAiList(
          ai.curriculum.coverage?.sightWords,
          currentCoverage?.sightWords ?? []
        ),
        vocabulary: chooseAiList(
          ai.curriculum.vocabulary,
          currentCoverage?.vocabulary ?? heuristic.curriculum.vocabulary
        ),
        wordLists: chooseAiList(
          ai.curriculum.wordLists,
          currentCoverage?.wordLists ?? heuristic.curriculum.wordLists
        ),
        texts: chooseAiList(
          ai.curriculum.texts,
          currentCoverage?.texts ?? heuristic.curriculum.texts
        ),
        practiceTasks: chooseAiList(
          ai.curriculum.practiceTasks,
          currentCoverage?.practiceTasks ?? heuristic.curriculum.practiceTasks
        ),
        lessonSegments: chooseAiList(
          ai.curriculum.coverage?.lessonSegments,
          currentCoverage?.lessonSegments ?? []
        ),
      },
    }
  }

  if (heuristic.exemplar && ai.role === "exemplar") {
    merged.exemplar = {
      slideFlow: chooseAiList(ai.exemplar.slideFlow, heuristic.exemplar.slideFlow),
      pacing: chooseAiList(ai.exemplar.pacing, heuristic.exemplar.pacing),
      teacherMoves: chooseAiList(ai.exemplar.teacherMoves, heuristic.exemplar.teacherMoves),
      promptStyle: chooseAiList(ai.exemplar.promptStyle, heuristic.exemplar.promptStyle),
      layoutCues: chooseAiList(ai.exemplar.layoutCues, heuristic.exemplar.layoutCues),
      tone: chooseAiList(ai.exemplar.tone, heuristic.exemplar.tone),
      reusableStructure: chooseAiList(
        ai.exemplar.reusableStructure,
        heuristic.exemplar.reusableStructure
      ),
      detectedFeatures: heuristic.exemplar.detectedFeatures,
    }
  }

  return merged
}