import { buildBlueprint } from "../blueprint/buildBlueprint"
import { buildLessonPackage } from "../package/buildLessonPackage"
import { buildLessonPlanningIdeas } from "../planning/buildLessonPlanningIdeas"
import { buildLessonSpec } from "../spec/buildLessonSpec"
import {
  LessonGenerationResult,
  LessonInputs,
  LessonMode,
  MaterialFile,
  MissingAreaDecisionChoice,
  PlanningComponentKey,
} from "../types"

export function runLessonPipeline(
  inputs: LessonInputs,
  materials: MaterialFile[],
  selectedMode: LessonMode,
  missingAreaDecisions: Partial<Record<PlanningComponentKey, MissingAreaDecisionChoice>> = {}
): LessonGenerationResult {
  const blueprint = buildBlueprint(inputs, materials, selectedMode)
  const planningIdeas = buildLessonPlanningIdeas(blueprint)
  const lessonSpec = buildLessonSpec(blueprint, planningIdeas)
  const lessonPackage = buildLessonPackage(
    inputs,
    blueprint,
    lessonSpec,
    planningIdeas,
    missingAreaDecisions
  )

  const trace = {
    selectedMode,
    materialCounts: {
      total: materials.length,
      curriculum: materials.filter((material) => material.role === "curriculum").length,
      exemplar: materials.filter((material) => material.role === "exemplar").length,
    },
    selectedSources: {
      curriculumMaterialIds: blueprint.sourceReadiness.selectedCurriculumMaterialIds,
      exemplarMaterialIds: blueprint.sourceReadiness.selectedExemplarMaterialIds,
    },
    target: {
      primary: blueprint.content.target.primary,
      secondary: blueprint.content.target.secondary,
      isMixedTarget: blueprint.content.target.isMixedTarget,
      recommendedMode: blueprint.content.target.recommendedMode,
    },
    blueprintWarnings: blueprint.sourceReadiness.warnings,
    missingAreaPromptComponents:
      planningIdeas.missingAreaPrompts?.map((prompt) => prompt.component) ?? [],
    package: {
      density: lessonPackage.readiness.density,
      lessonShape: lessonPackage.readiness.lessonShape,
      contentFit: lessonPackage.readiness.contentFit,
      warningCount: lessonPackage.readiness.warnings.length,
    },
  }

  return {
    blueprint,
    planningIdeas,
    lessonSpec,
    lessonPackage,
    trace,
  }
}