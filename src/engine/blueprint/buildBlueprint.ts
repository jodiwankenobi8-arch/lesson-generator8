import { detectLessonTargets, resolveLessonMode } from "./detectLessonTargets"
import { resolveBlueprintContent } from "./resolveBlueprintContent"
import { resolveBlueprintStructure } from "./resolveBlueprintStructure"
import { buildBlueprintSourceReadiness } from "./buildBlueprintSourceReadiness"
import {
  CurriculumAnalysis,
  ExemplarAnalysis,
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
  const curriculumMaterials = materials.filter(
    (material) => material.role === "curriculum" && material.analysis?.curriculum
  )

  const exemplarMaterials = materials.filter(
    (material) => material.role === "exemplar" && material.analysis?.exemplar
  )

  const curriculumAnalyses = curriculumMaterials
    .map((material) => material.analysis?.curriculum)
    .filter((analysis): analysis is CurriculumAnalysis => Boolean(analysis))

  const exemplarAnalyses = exemplarMaterials
    .map((material) => material.analysis?.exemplar)
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
