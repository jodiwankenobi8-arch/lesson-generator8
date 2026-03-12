import { buildBlueprint } from "../blueprint/buildBlueprint"
import { buildLessonPackage } from "../package/buildLessonPackage"
import { buildLessonPlanningIdeas } from "../planning/buildLessonPlanningIdeas"
import { buildLessonSpec } from "../spec/buildLessonSpec"
import {
  LessonGenerationResult,
  LessonInputs,
  LessonMode,
  MaterialFile,
} from "../types"

export function runLessonPipeline(
  inputs: LessonInputs,
  materials: MaterialFile[],
  selectedMode: LessonMode
): LessonGenerationResult {
  const blueprint = buildBlueprint(inputs, materials, selectedMode)
  const planningIdeas = buildLessonPlanningIdeas(blueprint)
  const spec = buildLessonSpec(blueprint, planningIdeas)
  const lessonPackage = buildLessonPackage(inputs, blueprint, spec, planningIdeas)

  return {
    blueprint,
    planningIdeas,
    spec,
    lessonSpec: spec,
    lessonPackage,
  }
}
