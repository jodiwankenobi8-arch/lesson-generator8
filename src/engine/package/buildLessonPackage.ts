import {
  LessonBlueprint,
  LessonInputs,
  LessonPackage,
  LessonPlanningIdeas,
  LessonSpec,
} from "../types"
import { buildPackageOutputs } from "./buildPackageOutputs"
import { buildLessonPackageReadiness } from "./buildLessonPackageReadiness"

export function buildLessonPackage(
  inputs: LessonInputs,
  blueprint: LessonBlueprint,
  spec: LessonSpec,
  planningIdeas?: LessonPlanningIdeas
): LessonPackage {
  const outputs = buildPackageOutputs({
    inputs,
    blueprint,
    spec,
    planningIdeas,
  })

  const readiness = buildLessonPackageReadiness({
    blueprint,
    slides: outputs.slides,
    centers: outputs.centers,
    interventions: outputs.interventions,
  })

  return {
    ...outputs,
    readiness,
  }
}
