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
  const spec = buildLessonSpec(blueprint, planningIdeas)
  const lessonPackage = buildLessonPackage(
    inputs,
    blueprint,
    spec,
    planningIdeas,
    missingAreaDecisions
  )

  return {
    blueprint,
    planningIdeas,
    spec,
    lessonSpec: spec,
    lessonPackage,
  }
}
