import {
  LessonGenerationResult,
  LessonInputs,
  LessonOutputContents,
  MaterialFile,
  MissingAreaDecisionChoice,
  PlanningComponentKey,
  isGroupOutputSelected,
  isSupportPrintablesSelected,
} from "../types"
import { buildExports } from "../package/buildPackageExportArtifacts"
import { buildLessonPackageReadiness } from "../package/buildLessonPackageReadiness"

export type AiConstructedSlide = {
  title: string
  kind: string
  action: string
  purpose: string
  timing: string
  teacherMove: string
  promptStyle: string
  tone: string
  body: string[]
}

export type AiLessonConstructionResponse = {
  enabled: boolean
  confidence: number
  warnings: string[]
  derivedStandards: string[]
  vocabulary: string[]
  wordLists: string[]
  texts: string[]
  practiceIdeas: string[]
  lessonPlanText: string
  slides: AiConstructedSlide[]
  centers: string[]
  rotationPlanLines: string[]
  interventions: string[]
}

type LessonConstructionInput = {
  inputs: LessonInputs
  materials: MaterialFile[]
  outputContents: LessonOutputContents
  missingAreaDecisions: Partial<Record<PlanningComponentKey, MissingAreaDecisionChoice>>
  baseResult: LessonGenerationResult
}

type LessonConstructionPayload = {
  inputs: LessonInputs
  requestedOutputs: ReturnType<typeof summarizeRequestedOutputs>
  missingAreaDecisions: Partial<Record<PlanningComponentKey, MissingAreaDecisionChoice>>
  blueprint: {
    target: LessonGenerationResult["blueprint"]["content"]["target"]
    standards: string[]
    vocabulary: string[]
    wordLists: string[]
    texts: string[]
    practiceIdeas: string[]
    structure: {
      lessonSegments: string[]
      slideShell: string[]
      timing: string[]
      teacherMoves: string[]
      promptStyle: string[]
      tone: string[]
    }
    sourceReadiness: {
      curriculumSupport: string
      exemplarSupport: string
      overall: string
      warnings: string[]
    }
  }
  planningIdeas: {
    slidePlans: string[]
    lessonPlanIdeas: string[]
    centerIdeas: string[]
    smallGroupIdeas: string[]
    interventionIdeas: string[]
    missingAreaPrompts: string[]
  }
  deterministicDraft: {
    lessonPlan: string
    slides: string[]
    centers: string[]
    rotationPlan: string
    interventions: string[]
  }
  materials: Array<{
    id: string
    name: string
    role: string
    sourceKind: string | null
    reliability: {
      level: string | null
      score: number | null
      usableForContent: boolean | null
      usableForStructure: boolean | null
      warnings: string[]
    }
    summary: string
    curriculum: Record<string, string[]>
    exemplar: Record<string, string[]>
    extractedExcerpt: string[]
  }>
}

function buildEndpoint(): string {
  const baseUrl = String(import.meta.env.VITE_AI_ANALYSIS_URL ?? "").replace(/\/$/, "")
  return baseUrl ? `${baseUrl}/api/lesson-construction` : "/api/lesson-construction"
}

function isLessonConstructionEnabled(): boolean {
  return String(import.meta.env.VITE_ENABLE_AI_LESSON_CONSTRUCTION ?? "false") === "true"
}

export async function enhanceLessonGenerationWithAI(
  input: LessonConstructionInput
): Promise<LessonGenerationResult | null> {
  if (!isLessonConstructionEnabled()) {
    return null
  }

  const response = await fetch(buildEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildPayload(input)),
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || "AI lesson construction request failed.")
  }

  const ai = (await response.json()) as AiLessonConstructionResponse
  return mergeAiLessonConstruction(input, ai)
}

function prependAiGroundedWarning(warnings?: string[]): string[] {
  const aiWarning = "AI grounded content expanded weak fallback outputs."
  const safeWarnings = Array.isArray(warnings) ? warnings.filter(Boolean) : []

  if (safeWarnings.some((warning) => warning.includes("AI grounded content"))) {
    return safeWarnings
  }

  return [aiWarning, ...safeWarnings]
}
export function mergeAiLessonConstruction(
  input: Pick<LessonConstructionInput, "inputs" | "outputContents" | "baseResult">,
  ai: AiLessonConstructionResponse
): LessonGenerationResult {
  const base = input.baseResult
  const nextBlueprint = {
    ...base.blueprint,
    content: {
      ...base.blueprint.content,
      standards: chooseValues(ai.derivedStandards, base.blueprint.content.standards),
      vocabulary: chooseValues(ai.vocabulary, base.blueprint.content.vocabulary),
      wordLists: chooseValues(ai.wordLists, base.blueprint.content.wordLists),
      texts: chooseValues(ai.texts, base.blueprint.content.texts),
      practiceIdeas: chooseValues(ai.practiceIdeas, base.blueprint.content.practiceIdeas),
      coverage: {
        ...base.blueprint.content.coverage,
        standards: chooseValues(
          ai.derivedStandards,
          base.blueprint.content.coverage?.standards ?? base.blueprint.content.standards
        ),
        vocabulary: chooseValues(
          ai.vocabulary,
          base.blueprint.content.coverage?.vocabulary ?? base.blueprint.content.vocabulary
        ),
        wordLists: chooseValues(
          ai.wordLists,
          base.blueprint.content.coverage?.wordLists ?? base.blueprint.content.wordLists
        ),
        texts: chooseValues(
          ai.texts,
          base.blueprint.content.coverage?.texts ?? base.blueprint.content.texts
        ),
        practiceIdeas: chooseValues(
          ai.practiceIdeas,
          base.blueprint.content.coverage?.practiceIdeas ?? base.blueprint.content.practiceIdeas
        ),
      },
    },
    sourceReadiness: {
      ...base.blueprint.sourceReadiness,
      warnings: unique([...base.blueprint.sourceReadiness.warnings, ...limit(ai.warnings, 4)]),
    },
  }

  const nextSlides = ai.slides.length > 0 ? ai.slides.map(formatAiSlide) : base.lessonPackage.slides
  const nextLessonPlan = cleanText(ai.lessonPlanText) || base.lessonPackage.lessonPlan
  const nextCenters = chooseValues(ai.centers, base.lessonPackage.centers)
  const nextInterventions = chooseValues(ai.interventions, base.lessonPackage.interventions)
  const nextRotationPlan = ai.rotationPlanLines.length > 0
    ? limit(ai.rotationPlanLines, 12).map(cleanText).filter(Boolean).join("\n")
    : base.lessonPackage.rotationPlan

  const nextReadinessBase = buildLessonPackageReadiness({
    blueprint: nextBlueprint,
    slides: nextSlides,
    centers: nextCenters,
    interventions: nextInterventions,
  })

  const includeLessonSlidesExport = input.outputContents.lessonSlides.selected
  const includeLessonPlanExport = input.outputContents.lessonPlan.selected
  const includePrintablesExport = isSupportPrintablesSelected(input.outputContents)

  const nextExports = buildExports(
    input.inputs,
    nextSlides,
    nextLessonPlan,
    nextCenters,
    nextRotationPlan,
    nextInterventions,
    {
      includeLessonSlidesExport,
      includeLessonPlanExport,
      includePrintablesExport,
    }
  )

  const nextLessonPackage = {
    ...base.lessonPackage,
    slides: nextSlides,
    lessonPlan: nextLessonPlan,
    centers: nextCenters,
    rotationPlan: nextRotationPlan,
    interventions: nextInterventions,
    exports: nextExports,
    readiness: {
      ...nextReadinessBase,
      warnings: unique([...nextReadinessBase.warnings, ...limit(ai.warnings, 4)]),
    },
  }

  const nextTrace = {
    ...base.trace,
    package: {
      density: nextLessonPackage.readiness.density,
      lessonShape: nextLessonPackage.readiness.lessonShape,
      contentFit: nextLessonPackage.readiness.contentFit,
      warningCount: nextLessonPackage.readiness.warnings.length,
    },
  }

  return {
    blueprint: nextBlueprint,
    planningIdeas: base.planningIdeas,
    lessonSpec: base.lessonSpec,
    lessonPackage: nextLessonPackage,
    trace: nextTrace,
  }
}

function buildPayload(input: LessonConstructionInput): LessonConstructionPayload {
  const { baseResult, inputs, materials, outputContents, missingAreaDecisions } = input

  return {
    inputs,
    requestedOutputs: summarizeRequestedOutputs(outputContents),
    missingAreaDecisions,
    blueprint: {
      target: baseResult.blueprint.content.target,
      standards: limit(baseResult.blueprint.content.standards, 6),
      vocabulary: limit(baseResult.blueprint.content.vocabulary, 8),
      wordLists: limit(baseResult.blueprint.content.wordLists, 8),
      texts: limit(baseResult.blueprint.content.texts, 4),
      practiceIdeas: limit(baseResult.blueprint.content.practiceIdeas, 8),
      structure: {
        lessonSegments: limit(baseResult.blueprint.structure.lessonSegments, 8),
        slideShell: limit(baseResult.blueprint.structure.templateShell.slideShell, 8),
        timing: limit(baseResult.blueprint.structure.timing, 8),
        teacherMoves: limit(baseResult.blueprint.structure.teacherMoves, 8),
        promptStyle: limit(baseResult.blueprint.structure.promptStyle, 8),
        tone: limit(baseResult.blueprint.structure.tone, 6),
      },
      sourceReadiness: {
        curriculumSupport: baseResult.blueprint.sourceReadiness.curriculumSupport,
        exemplarSupport: baseResult.blueprint.sourceReadiness.exemplarSupport,
        overall: baseResult.blueprint.sourceReadiness.overall,
        warnings: limit(baseResult.blueprint.sourceReadiness.warnings, 6),
      },
    },
    planningIdeas: {
      slidePlans: baseResult.planningIdeas.slidePlans.map((slide) => `${slide.shellLabel}: ${slide.notes}`).slice(0, 10),
      lessonPlanIdeas: baseResult.planningIdeas.lessonPlanSections.flatMap((section) =>
        section.ideas.map((idea) => `${section.title}: ${idea.title} - ${idea.description}`)
      ).slice(0, 14),
      centerIdeas: baseResult.planningIdeas.centerIdeas.map((idea) => `${idea.title}: ${idea.description}`).slice(0, 8),
      smallGroupIdeas: baseResult.planningIdeas.smallGroupIdeas.map((idea) => `${idea.title}: ${idea.description}`).slice(0, 8),
      interventionIdeas: baseResult.planningIdeas.interventionIdeas.map((idea) => `${idea.title}: ${idea.description}`).slice(0, 8),
      missingAreaPrompts: (baseResult.planningIdeas.missingAreaPrompts ?? []).map((prompt) => `${prompt.component}: ${prompt.prompt}`).slice(0, 8),
    },
    deterministicDraft: {
      lessonPlan: baseResult.lessonPackage.lessonPlan,
      slides: limit(baseResult.lessonPackage.slides, 8),
      centers: limit(baseResult.lessonPackage.centers, 10),
      rotationPlan: baseResult.lessonPackage.rotationPlan,
      interventions: limit(baseResult.lessonPackage.interventions, 8),
    },
    materials: materials
      .filter((material) => material.analysis)
      .map((material) => ({
        id: material.id,
        name: material.name,
        role: material.role,
        sourceKind: material.sourceKind ?? null,
        reliability: {
          level: material.analysis?.reliability?.level ?? null,
          score: material.analysis?.reliability?.score ?? null,
          usableForContent: material.analysis?.reliability?.usableForContent ?? null,
          usableForStructure: material.analysis?.reliability?.usableForStructure ?? null,
          warnings: limit(material.analysis?.reliability?.warnings ?? [], 4),
        },
        summary: cleanText(material.analysis?.summary ?? ""),
        curriculum: {
          standards: limit(material.analysis?.curriculum?.standards ?? [], 6),
          vocabulary: limit(material.analysis?.curriculum?.vocabulary ?? [], 8),
          wordLists: limit(material.analysis?.curriculum?.wordLists ?? [], 8),
          texts: limit(material.analysis?.curriculum?.texts ?? [], 4),
          practiceTasks: limit(material.analysis?.curriculum?.practiceTasks ?? [], 8),
          instructionalTargets: limit(material.analysis?.curriculum?.instructionalTargets ?? [], 8),
          examples: limit(material.analysis?.curriculum?.examples ?? [], 8),
          foundationalSkills: limit(material.analysis?.curriculum?.coverage?.foundationalSkills ?? [], 8),
          sightWords: limit(material.analysis?.curriculum?.coverage?.sightWords ?? [], 8),
        },
        exemplar: {
          slideFlow: limit(material.analysis?.exemplar?.slideFlow ?? [], 8),
          pacing: limit(material.analysis?.exemplar?.pacing ?? [], 8),
          teacherMoves: limit(material.analysis?.exemplar?.teacherMoves ?? [], 8),
          promptStyle: limit(material.analysis?.exemplar?.promptStyle ?? [], 8),
          layoutCues: limit(material.analysis?.exemplar?.layoutCues ?? [], 8),
          tone: limit(material.analysis?.exemplar?.tone ?? [], 8),
          reusableStructure: limit(material.analysis?.exemplar?.reusableStructure ?? [], 8),
          detectedFeatures: limit(
            material.analysis?.exemplar?.detectedFeatures?.items.map((item) => `${item.category}:${item.label}=${item.value}`) ?? [],
            12
          ),
        },
        extractedExcerpt: limit(material.analysis?.extractedText ?? [], 32),
      }))
      .slice(0, 6),
  }
}

function summarizeRequestedOutputs(outputContents: LessonOutputContents) {
  return {
    lessonPlan: {
      selected: outputContents.lessonPlan.selected,
      parts: Object.entries(outputContents.lessonPlan.parts)
        .filter(([, selected]) => Boolean(selected))
        .map(([part]) => part),
    },
    slides: {
      selected: outputContents.lessonSlides.selected,
      studentFacingOnly: outputContents.lessonSlides.studentFacingOnly,
    },
    centers: {
      selected: isGroupOutputSelected(outputContents, "centers"),
      focusKeys: Object.entries(outputContents.centers.focuses)
        .filter(([, selected]) => Boolean(selected))
        .map(([focus]) => focus),
      options: Object.entries(outputContents.centers.options)
        .filter(([, selected]) => Boolean(selected))
        .map(([option]) => option),
    },
    smallGroup: {
      selected: isGroupOutputSelected(outputContents, "small_group"),
      tiers: Object.entries(outputContents.smallGroup.tiers)
        .filter(([, selected]) => Boolean(selected))
        .map(([tier]) => tier),
    },
    intervention: {
      selected: isGroupOutputSelected(outputContents, "intervention"),
    },
    printables: {
      selected: isSupportPrintablesSelected(outputContents),
    },
  }
}

function formatAiSlide(slide: AiConstructedSlide, index: number): string {
  return [
    `Slide ${index + 1}: ${cleanText(slide.title) || `Slide ${index + 1}`}`,
    `Kind: ${cleanText(slide.kind) || "guided_practice"}`,
    `Action: ${cleanText(slide.action) || "adapt"}`,
    `Purpose: ${cleanText(slide.purpose) || "Support teacher delivery and student learning."}`,
    `Timing: ${cleanText(slide.timing) || "Flexible timing"}`,
    `Teacher Move: ${cleanText(slide.teacherMove) || "teacher guidance"}`,
    `Prompt Style: ${cleanText(slide.promptStyle) || "teacher prompt"}`,
    `Tone: ${cleanText(slide.tone) || "clear instructional tone"}`,
    `Content: ${limit(slide.body, 8).map(cleanText).filter(Boolean).join(" | ")}`,
  ].join(" | ")
}

function chooseValues(preferred: string[], fallback: string[]): string[] {
  const cleanedPreferred = unique(limit(preferred, 12).map(cleanText).filter(Boolean))
  if (cleanedPreferred.length > 0) {
    return cleanedPreferred
  }

  return unique(limit(fallback, 12).map(cleanText).filter(Boolean))
}

function cleanText(value: string): string {
  return String(value ?? "").replace(/\s+/g, " ").trim()
}

function limit(values: string[], max: number): string[] {
  return values.slice(0, max)
}

function unique(values: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const value of values) {
    const normalized = value.toLowerCase()
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    result.push(value)
  }

  return result
}
