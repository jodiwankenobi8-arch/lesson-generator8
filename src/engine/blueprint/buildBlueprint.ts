
function getSignalStrength(material: MaterialFile): number {
  const tags = material.analysis?.tags ?? []
  const tag = tags.find(t => t.startsWith("signal-strength:"))
  if (!tag) return 0
  const value = parseInt(tag.split(":")[1], 10)
  return Number.isFinite(value) ? value : 0
}

function selectStrongestMaterials(materials: MaterialFile[]): MaterialFile[] {
  return [...materials].sort((a: MaterialFile, b: MaterialFile) => {
    return getSignalStrength(b) - getSignalStrength(a)
  })
}
import { detectLessonTargets, resolveLessonMode } from "./detectLessonTargets"
import { resolveBlueprintContent } from "./resolveBlueprintContent"
import { resolveBlueprintStructure } from "./resolveBlueprintStructure"
import { buildBlueprintSourceReadiness } from "./buildBlueprintSourceReadiness"
import {
  CurriculumAnalysis,
  ExemplarAnalysis,
  ExemplarStyleSettings,
  LessonBlueprint,
  LessonInputs,
  LessonMode,
  MaterialFile,
} from "../types"

export function buildBlueprint(
  inputs: LessonInputs,
  materials: MaterialFile[],
  selectedMode: LessonMode
): LessonBlueprint {
  const curriculumMaterials = selectStrongestMaterials(
    materials.filter(
      (material) => material.role === "curriculum" && material.analysis?.curriculum
    )
  )

  const exemplarMaterials = selectStrongestMaterials(
    materials.filter(
      (material) => material.role === "exemplar" && material.analysis?.exemplar
    )
  )

  const curriculumAnalyses = curriculumMaterials
    .map((material) => material.analysis?.curriculum)
    .filter((analysis): analysis is CurriculumAnalysis => Boolean(analysis))

  const exemplarAnalyses = exemplarMaterials
    .map((material) =>
      material.analysis?.exemplar
        ? applyExemplarStyleSettings(material.analysis.exemplar, material.styleSettings)
        : null
    )
    .filter((analysis): analysis is ExemplarAnalysis => Boolean(analysis))

  const rawTarget = detectLessonTargets(inputs, selectedMode)
  const resolvedMode = resolveLessonMode(selectedMode, rawTarget)
  const target = buildResolvedTarget(rawTarget, resolvedMode)

  const content = resolveBlueprintContent({
    curriculumMaterials,
    curriculumAnalyses,
    inputs: {
      standard: inputs.standard,
      topic: inputs.topic,
    },
    target,
  })

  const structure = resolveBlueprintStructure({
    exemplarAnalyses,
    target,
  })

  const sourceReadiness = buildBlueprintSourceReadiness({
    curriculumMaterials,
    exemplarMaterials,
    standards: content.standards,
    vocabulary: content.vocabulary,
    texts: content.texts,
    practiceIdeas: content.practiceIdeas,
    lessonSegments: structure.lessonSegments,
    teacherMoves: structure.teacherMoves,
    promptStyle: structure.promptStyle,
  })

  return {
    content: {
      target,
      ...content,
    },
    structure,
    sourceReadiness,
  }
}

function applyExemplarStyleSettings(
  analysis: ExemplarAnalysis,
  styleSettings?: ExemplarStyleSettings | null
): ExemplarAnalysis {
  if (!styleSettings) {
    return analysis
  }

  if (styleSettings.mode === "copy_closely" || styleSettings.mode === "inspiration") {
    return analysis
  }

  if (styleSettings.mode === "custom" && styleSettings.aspects.length === 0) {
    return analysis
  }

  const aspects = new Set(styleSettings.aspects)

  return {
    slideFlow:
      aspects.has("slide_flow") || aspects.has("structure") ? analysis.slideFlow : [],
    pacing: aspects.has("pacing") ? analysis.pacing : [],
    teacherMoves: aspects.has("teacher_prompts") ? analysis.teacherMoves : [],
    promptStyle: aspects.has("teacher_prompts") ? analysis.promptStyle : [],
    layoutCues: aspects.has("visual_layout") ? analysis.layoutCues : [],
    tone: aspects.has("wording_tone") ? analysis.tone : [],
    reusableStructure: aspects.has("structure") ? analysis.reusableStructure : [],
    detectedFeatures: filterDetectedFeaturesForStyleSettings(analysis, aspects),
  }
}

function filterDetectedFeaturesForStyleSettings(
  analysis: ExemplarAnalysis,
  aspects: Set<ExemplarStyleSettings["aspects"][number]>
) {
  const detected = analysis.detectedFeatures

  if (!detected) {
    return detected
  }

  const items = detected.items.filter((item) => {
    if (item.category === "structure" || item.category === "instructional_flow") {
      return aspects.has("structure") || aspects.has("slide_flow")
    }

    if (item.category === "interaction") {
      return aspects.has("teacher_prompts")
    }

    if (item.category === "pacing") {
      return aspects.has("pacing")
    }

    if (item.category === "visual_layout" || item.category === "theme_style") {
      return aspects.has("visual_layout") || aspects.has("wording_tone")
    }

    if (item.category === "content_slots") {
      return aspects.has("structure") || aspects.has("slide_flow") || aspects.has("visual_layout")
    }

    return true
  })

  return {
    items,
    warnings: detected.warnings,
  }
}

function buildResolvedTarget(
  rawTarget: ReturnType<typeof detectLessonTargets>,
  resolvedMode: LessonMode
) {
  if (resolvedMode === "phonics_only") {
    return {
      primary: "phonics",
      secondary: rawTarget.primary === "comprehension" ? "comprehension" : null,
      isMixedTarget: false,
      recommendedMode: resolvedMode,
    }
  }

  if (resolvedMode === "comprehension_only") {
    return {
      primary: "comprehension",
      secondary: rawTarget.primary === "phonics" ? "phonics" : null,
      isMixedTarget: false,
      recommendedMode: resolvedMode,
    }
  }

  if (resolvedMode === "full") {
    return {
      primary: rawTarget.isMixedTarget ? "phonics" : rawTarget.primary,
      secondary: rawTarget.isMixedTarget
        ? rawTarget.secondary ?? "comprehension"
        : rawTarget.secondary,
      isMixedTarget: rawTarget.isMixedTarget,
      recommendedMode: resolvedMode,
    }
  }

  return {
    ...rawTarget,
    recommendedMode: resolvedMode,
  }
}


