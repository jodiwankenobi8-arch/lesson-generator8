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

type AiContentOrigin = "grounded" | "inferred"

type AiContentFieldKey =
  | "standards"
  | "vocabulary"
  | "wordLists"
  | "texts"
  | "practiceIdeas"
  | "lessonPlan"
  | "slides"
  | "centers"
  | "rotationPlan"
  | "interventions"

const AI_CONTENT_FIELD_LABELS: Record<AiContentFieldKey, string> = {
  standards: "Standards",
  vocabulary: "Vocabulary",
  wordLists: "Word lists",
  texts: "Texts / topic",
  practiceIdeas: "Practice ideas",
  lessonPlan: "Lesson plan",
  slides: "Lesson slides",
  centers: "Centers / independent work",
  rotationPlan: "Teacher-led support",
  interventions: "Intervention support",
}

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

type AiTeacherReviewItem = {
  label: string
  reason: string
  note: string
}

type AiStandardsSuggestion = {
  value: string
  origin: AiContentOrigin
  sourceTypes: string[]
  evidence: string[]
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
  contentOrigins?: Partial<Record<AiContentFieldKey, AiContentOrigin>>
  teacherReviewItems?: AiTeacherReviewItem[]
  requestedButMissing?: string[]
  standardsSuggestions?: AiStandardsSuggestion[]
}

type NormalizedAiLessonConstruction = Omit<AiLessonConstructionResponse, "contentOrigins" | "teacherReviewItems" | "requestedButMissing" | "standardsSuggestions"> & {
  fieldOrigins: Record<AiContentFieldKey, AiContentOrigin>
  teacherReviewItems: AiTeacherReviewItem[]
  requestedButMissing: string[]
  standardsSuggestions: AiStandardsSuggestion[]
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
  if (ai.enabled === false) {
    return input.baseResult
  }

  return mergeAiLessonConstruction(input, ai)
}

function prependAiGroundedWarning(warnings?: string[]): string[] {
  const aiWarning = "AI grounded content expanded weak fallback outputs."
  const safeWarnings = Array.isArray(warnings) ? warnings.filter(Boolean) : []
  const nonAiWarnings = safeWarnings.filter((warning) => !warning.includes("AI grounded content"))

  return [aiWarning, ...nonAiWarnings]
}

function buildAiCoverage(
  baseCoverage: LessonGenerationResult["blueprint"]["content"]["coverage"],
  baseContent: LessonGenerationResult["blueprint"]["content"],
  ai: NormalizedAiLessonConstruction
) {
  return {
    standards: chooseValues(ai.derivedStandards, baseCoverage?.standards ?? baseContent.standards),
    vocabulary: chooseValues(ai.vocabulary, baseCoverage?.vocabulary ?? baseContent.vocabulary),
    wordLists: chooseValues(ai.wordLists, baseCoverage?.wordLists ?? baseContent.wordLists),
    texts: chooseValues(ai.texts, baseCoverage?.texts ?? baseContent.texts),
    practiceIdeas: chooseValues(ai.practiceIdeas, baseCoverage?.practiceIdeas ?? baseContent.practiceIdeas),
    instructionalTargets: baseCoverage?.instructionalTargets ?? [],
    sightWords: baseCoverage?.sightWords ?? [],
    foundationalSkills: baseCoverage?.foundationalSkills ?? [],
    lessonSegments: baseCoverage?.lessonSegments ?? [],
  }
}

export function mergeAiLessonConstruction(
  input: Pick<LessonConstructionInput, "inputs" | "materials" | "outputContents" | "baseResult">,
  ai: AiLessonConstructionResponse
): LessonGenerationResult {
  const base = input.baseResult
  const normalizedAi = normalizeAiLessonConstruction(
    {
      inputs: input.inputs,
      materials: input.materials,
      outputContents: input.outputContents,
      missingAreaDecisions: {},
      baseResult: input.baseResult,
    },
    ai
  )

  const nextBlueprint = {
    ...base.blueprint,
    content: {
      ...base.blueprint.content,
      standards: chooseValues(normalizedAi.derivedStandards, base.blueprint.content.standards),
      vocabulary: chooseValues(normalizedAi.vocabulary, base.blueprint.content.vocabulary),
      wordLists: chooseValues(normalizedAi.wordLists, base.blueprint.content.wordLists),
      texts: chooseValues(normalizedAi.texts, base.blueprint.content.texts),
      practiceIdeas: chooseValues(normalizedAi.practiceIdeas, base.blueprint.content.practiceIdeas),
      coverage: buildAiCoverage(base.blueprint.content.coverage, base.blueprint.content, normalizedAi),
    },
    sourceReadiness: {
      ...base.blueprint.sourceReadiness,
      warnings: unique([
        ...base.blueprint.sourceReadiness.warnings,
        ...limit(normalizedAi.warnings, 6),
      ]),
    },
  }

  const nextSlides = normalizedAi.slides.length > 0
    ? normalizedAi.slides.map(formatAiSlide)
    : base.lessonPackage.slides
  const nextLessonPlan = cleanText(normalizedAi.lessonPlanText) || base.lessonPackage.lessonPlan
  const nextCenters = chooseValues(normalizedAi.centers, base.lessonPackage.centers)
  const nextInterventions = chooseValues(normalizedAi.interventions, base.lessonPackage.interventions)
  const nextRotationPlan = normalizedAi.rotationPlanLines.length > 0
    ? limit(normalizedAi.rotationPlanLines, 12).map(cleanText).filter(Boolean).join("`n")
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
      warnings: prependAiGroundedWarning(unique([
        ...nextReadinessBase.warnings,
        ...limit(normalizedAi.warnings, 6),
      ])),
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
    aiConstruction: {
      applied: true,
      confidence: normalizedAi.confidence,
      groundedContentLabels: getOriginLabels(normalizedAi, "grounded"),
      inferredContentLabels: getOriginLabels(normalizedAi, "inferred"),
      teacherReviewItems: normalizedAi.teacherReviewItems,
      requestedButMissing: normalizedAi.requestedButMissing,
      standardsSuggestions: normalizedAi.standardsSuggestions,
      warnings: limit(normalizedAi.warnings, 8),
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
            material.analysis?.exemplar?.detectedFeatures?.items.map((item) => `${item.category}:${item.label}=${item.key}`) ?? [],
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

function normalizeAiLessonConstruction(
  input: LessonConstructionInput,
  ai: AiLessonConstructionResponse
): NormalizedAiLessonConstruction {
  const fieldOrigins = buildFieldOrigins(input, ai)
  const derivedStandards = sanitizeValueList(ai.derivedStandards, 6)
  const vocabulary = sanitizeValueList(ai.vocabulary, 8)
  const wordLists = sanitizeValueList(ai.wordLists, 8)
  const texts = sanitizeValueList(ai.texts, 6)
  const practiceIdeas = sanitizeValueList(ai.practiceIdeas, 8)
  const lessonPlanText = cleanLongText(ai.lessonPlanText)
  const slides = sanitizeSlides(ai.slides)
  const centers = sanitizeValueList(ai.centers, 10)
  const rotationPlanLines = sanitizeValueList(ai.rotationPlanLines, 12)
  const interventions = sanitizeValueList(ai.interventions, 8)

  const missingRequestedLessonPlanParts = lessonPlanText.length > 0
    ? findMissingRequestedLessonPlanParts(input.outputContents, lessonPlanText)
    : []

  const shouldKeepAiLessonPlan = shouldUseAiLessonPlan(
    lessonPlanText,
    missingRequestedLessonPlanParts,
    input.outputContents
  )

  const requestedButMissing = unique([
    ...sanitizeValueList(ai.requestedButMissing ?? [], 8),
    ...missingRequestedLessonPlanParts,
    ...collectRequestedOutputGaps(input.outputContents, {
      lessonPlanReady: shouldKeepAiLessonPlan,
      slidesReady: slides.length > 0,
      centersReady: centers.length > 0,
      rotationReady: rotationPlanLines.length > 0,
      interventionsReady: interventions.length > 0,
    }),
  ])

  const teacherReviewItems = normalizeTeacherReviewItems(
    ai.teacherReviewItems,
    input,
    fieldOrigins,
    requestedButMissing,
    shouldKeepAiLessonPlan
  )

  const standardsSuggestions = buildStandardsSuggestions(input, ai, fieldOrigins, derivedStandards)

  const warnings = unique([
    ...sanitizeValueList(ai.warnings, 6),
    !shouldKeepAiLessonPlan
      ? "AI lesson plan text was too generic or dropped requested parts, so the deterministic lesson plan stayed in place."
      : "",
    requestedButMissing.length > 0
      ? `Teacher review recommended: ${requestedButMissing.join(", ")}.`
      : "",
    standardsSuggestions.some((suggestion) => suggestion.origin === "inferred")
      ? "Standards suggestions include inferred matches and should be confirmed by the teacher."
      : "",
    ...teacherReviewItems.map((item) => item.note),
  ])

  return {
    enabled: ai.enabled !== false,
    confidence: clampConfidence(ai.confidence),
    warnings,
    derivedStandards,
    vocabulary,
    wordLists,
    texts,
    practiceIdeas,
    lessonPlanText: shouldKeepAiLessonPlan ? lessonPlanText : "",
    slides,
    centers,
    rotationPlanLines,
    interventions,
    fieldOrigins,
    teacherReviewItems,
    requestedButMissing,
    standardsSuggestions,
  }
}

function buildFieldOrigins(
  input: LessonConstructionInput,
  ai: AiLessonConstructionResponse
): Record<AiContentFieldKey, AiContentOrigin> {
  const curriculumGrounded = input.baseResult.blueprint.sourceReadiness.curriculumSupport === "strong"
  const structureGrounded = input.baseResult.blueprint.sourceReadiness.exemplarSupport === "strong"

  return {
    standards: ai.contentOrigins?.standards ?? (curriculumGrounded ? "grounded" : "inferred"),
    vocabulary: ai.contentOrigins?.vocabulary ?? (curriculumGrounded ? "grounded" : "inferred"),
    wordLists: ai.contentOrigins?.wordLists ?? (curriculumGrounded ? "grounded" : "inferred"),
    texts: ai.contentOrigins?.texts ?? (curriculumGrounded ? "grounded" : "inferred"),
    practiceIdeas: ai.contentOrigins?.practiceIdeas ?? (curriculumGrounded ? "grounded" : "inferred"),
    lessonPlan: ai.contentOrigins?.lessonPlan ?? (curriculumGrounded ? "grounded" : "inferred"),
    slides: ai.contentOrigins?.slides ?? (structureGrounded ? "grounded" : "inferred"),
    centers: ai.contentOrigins?.centers ?? (curriculumGrounded ? "grounded" : "inferred"),
    rotationPlan: ai.contentOrigins?.rotationPlan ?? (curriculumGrounded ? "grounded" : "inferred"),
    interventions: ai.contentOrigins?.interventions ?? (curriculumGrounded ? "grounded" : "inferred"),
  }
}

function collectRequestedOutputGaps(
  outputContents: LessonOutputContents,
  readiness: {
    lessonPlanReady: boolean
    slidesReady: boolean
    centersReady: boolean
    rotationReady: boolean
    interventionsReady: boolean
  }
): string[] {
  const missing: string[] = []

  if (outputContents.lessonPlan.selected && !readiness.lessonPlanReady) {
    missing.push("Lesson plan")
  }

  if (outputContents.lessonSlides.selected && !readiness.slidesReady) {
    missing.push("Lesson slides")
  }

  if (isGroupOutputSelected(outputContents, "centers") && !readiness.centersReady) {
    missing.push("Centers / independent work")
  }

  if (isGroupOutputSelected(outputContents, "small_group") && !readiness.rotationReady) {
    missing.push("Teacher-led support")
  }

  if (isGroupOutputSelected(outputContents, "intervention") && !readiness.interventionsReady) {
    missing.push("Intervention support")
  }

  return missing
}

function findMissingRequestedLessonPlanParts(
  outputContents: LessonOutputContents,
  lessonPlanText: string
): string[] {
  if (!outputContents.lessonPlan.selected) {
    return []
  }

  const normalized = lessonPlanText.toLowerCase()
  const checks: Array<{ key: keyof LessonOutputContents["lessonPlan"]["parts"]; label: string; keywords: string[] }> = [
    { key: "standards", label: "Standards", keywords: ["standard", "benchmark"] },
    { key: "objective", label: "Objective", keywords: ["objective", "goal", "students will"] },
    { key: "opening", label: "Opening", keywords: ["opening", "warm", "hook", "launch"] },
    { key: "direct_instruction_modeling", label: "Direct instruction / modeling", keywords: ["model", "direct instruction", "i do", "teach"] },
    { key: "guided_practice", label: "Guided practice", keywords: ["guided practice", "we do", "guided"] },
    { key: "independent_practice", label: "Independent practice", keywords: ["independent practice", "you do", "independent"] },
    { key: "closure", label: "Closure", keywords: ["closure", "wrap", "reflect", "exit"] },
    { key: "differentiation", label: "Differentiation", keywords: ["different", "reteach", "extension", "support"] },
    { key: "vocabulary", label: "Vocabulary", keywords: ["vocabulary", "word work", "academic language"] },
    { key: "materials_prep_list", label: "Materials / prep list", keywords: ["materials", "prep", "supplies"] },
    { key: "assessment_connection", label: "Assessment connection", keywords: ["assessment", "check for understanding", "exit ticket"] },
  ]

  return checks
    .filter((check) => outputContents.lessonPlan.parts[check.key])
    .filter((check) => !check.keywords.some((keyword) => normalized.includes(keyword)))
    .map((check) => check.label)
}

function shouldUseAiLessonPlan(
  lessonPlanText: string,
  missingRequestedLessonPlanParts: string[],
  outputContents: LessonOutputContents
): boolean {
  if (!lessonPlanText) {
    return false
  }

  if (isWeakLongText(lessonPlanText, 220)) {
    return false
  }

  const requestedPartCount = Object.values(outputContents.lessonPlan.parts).filter(Boolean).length
  if (requestedPartCount === 0) {
    return true
  }

  return missingRequestedLessonPlanParts.length <= Math.max(1, Math.floor(requestedPartCount / 3))
}

function sanitizeSlides(slides: AiConstructedSlide[]): AiConstructedSlide[] {
  return slides
    .map((slide) => ({
      title: cleanText(slide.title),
      kind: cleanText(slide.kind),
      action: cleanText(slide.action),
      purpose: cleanText(slide.purpose),
      timing: cleanText(slide.timing),
      teacherMove: cleanText(slide.teacherMove),
      promptStyle: cleanText(slide.promptStyle),
      tone: cleanText(slide.tone),
      body: sanitizeValueList(slide.body, 8),
    }))
    .filter((slide) => {
      const compact = [slide.title, slide.purpose, slide.teacherMove, ...slide.body].join(" ")
      return !isWeakLongText(compact, 80)
    })
    .slice(0, 12)
}

function normalizeTeacherReviewItems(
  rawItems: AiTeacherReviewItem[] | undefined,
  input: LessonConstructionInput,
  fieldOrigins: Record<AiContentFieldKey, AiContentOrigin>,
  requestedButMissing: string[],
  keptAiLessonPlan: boolean
): AiTeacherReviewItem[] {
  const items = Array.isArray(rawItems) ? rawItems : []
  const normalized = items
    .map((item) => ({
      label: cleanText(item.label),
      reason: cleanText(item.reason),
      note: cleanText(item.note),
    }))
    .filter((item) => item.label && item.note)

  const inferredFields = Object.entries(fieldOrigins)
    .filter(([, origin]) => origin === "inferred")
    .map(([field]) => AI_CONTENT_FIELD_LABELS[field as AiContentFieldKey])

  const autoItems: AiTeacherReviewItem[] = []

  if (!keptAiLessonPlan && input.outputContents.lessonPlan.selected) {
    autoItems.push({
      label: "Lesson plan",
      reason: "generic_ai_output",
      note: "The AI lesson plan draft was too generic, so the deterministic lesson plan stayed in place.",
    })
  }

  if (requestedButMissing.length > 0) {
    autoItems.push({
      label: "Requested outputs",
      reason: "requested_but_missing",
      note: `Some requested outputs still need teacher review: ${requestedButMissing.join(", ")}.`,
    })
  }

  inferredFields.forEach((label) => {
    autoItems.push({
      label,
      reason: "inferred_content",
      note: `${label} includes inferred content and should be reviewed before classroom use.`,
    })
  })

  return uniqueReviewItems([...normalized, ...autoItems])
}

function buildStandardsSuggestions(
  input: LessonConstructionInput,
  ai: AiLessonConstructionResponse,
  fieldOrigins: Record<AiContentFieldKey, AiContentOrigin>,
  derivedStandards: string[]
): AiStandardsSuggestion[] {
  const rawSuggestions = Array.isArray(ai.standardsSuggestions) ? ai.standardsSuggestions : []
  const explicit = rawSuggestions
    .map((suggestion) => ({
      value: cleanText(suggestion.value),
      origin: suggestion.origin ?? fieldOrigins.standards,
      sourceTypes: sanitizeValueList(suggestion.sourceTypes, 4),
      evidence: sanitizeValueList(suggestion.evidence, 4),
    }))
    .filter((suggestion) => suggestion.value)

  if (explicit.length > 0) {
    return uniqueStandardsSuggestions(explicit).slice(0, 6)
  }

  const teacherStandards = input.inputs.standard
    .split(/[;,\n]/)
    .map(cleanText)
    .filter(Boolean)

  const curriculumEvidence = input.materials
    .filter((material) => material.role === "curriculum")
    .flatMap((material) => material.analysis?.curriculum?.standards ?? [])
    .map(cleanText)
    .filter(Boolean)

  return uniqueStandardsSuggestions(
    derivedStandards.map((value) => ({
      value,
      origin: fieldOrigins.standards,
      sourceTypes: unique([
        teacherStandards.some((standard) => standard === value) ? "teacher_input" : "",
        curriculumEvidence.some((standard) => standard === value) ? "curriculum" : "",
        fieldOrigins.standards === "inferred" ? "inference" : "deterministic_draft",
      ]),
      evidence: unique([
        ...teacherStandards.filter((standard) => standard === value),
        ...curriculumEvidence.filter((standard) => standard === value),
      ]),
    }))
  ).slice(0, 6)
}

function getOriginLabels(
  ai: NormalizedAiLessonConstruction,
  origin: AiContentOrigin
): string[] {
  return (Object.keys(ai.fieldOrigins) as AiContentFieldKey[])
    .filter((field) => ai.fieldOrigins[field] === origin)
    .map((field) => AI_CONTENT_FIELD_LABELS[field])
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

function sanitizeValueList(values: string[], max: number): string[] {
  return unique(
    limit(values, max)
      .map(cleanText)
      .filter(Boolean)
      .filter((value) => !isWeakShortValue(value))
  )
}

function cleanLongText(value: string): string {
  return String(value ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function isWeakShortValue(value: string): boolean {
  const normalized = cleanText(value).toLowerCase()
  if (!normalized) return true
  if (normalized.length < 4) return true

  return [
    "support student learning",
    "engage students",
    "as needed",
    "appropriate activity",
    "appropriate activities",
    "teacher guidance",
    "student discussion",
    "flexible timing",
    "clear instructional tone",
    "teacher prompt",
    "practice activity",
  ].some((fragment) => normalized === fragment || normalized.includes(`${fragment}.`))
}

function isWeakLongText(value: string, minimumLength: number): boolean {
  const normalized = cleanLongText(value).toLowerCase()
  if (!normalized) return true
  if (normalized.length < minimumLength) return true

  const weakFragments = [
    "support student learning",
    "engage students",
    "as needed",
    "appropriate activities",
    "teacher guidance",
    "students practice",
    "use the lesson materials",
    "ask students to share",
    "review the concept",
  ]

  const weakHitCount = weakFragments.filter((fragment) => normalized.includes(fragment)).length
  return weakHitCount >= 3
}

function clampConfidence(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(1, value))
}

function uniqueReviewItems(items: AiTeacherReviewItem[]): AiTeacherReviewItem[] {
  const seen = new Set<string>()
  const result: AiTeacherReviewItem[] = []

  for (const item of items) {
    const key = `${item.label.toLowerCase()}::${item.reason.toLowerCase()}::${item.note.toLowerCase()}`
    if (!item.label || !item.note || seen.has(key)) continue
    seen.add(key)
    result.push(item)
  }

  return result
}

function uniqueStandardsSuggestions(items: AiStandardsSuggestion[]): AiStandardsSuggestion[] {
  const seen = new Set<string>()
  const result: AiStandardsSuggestion[] = []

  for (const item of items) {
    const key = item.value.toLowerCase()
    if (!item.value || seen.has(key)) continue
    seen.add(key)
    result.push(item)
  }

  return result
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