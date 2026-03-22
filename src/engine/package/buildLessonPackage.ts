import {
  LessonBlueprint,
  LessonInputs,
  LessonPackage,
  LessonPlanningIdeas,
  LessonRequestPreferences,
  LessonSpec,
  MissingAreaDecisionChoice,
  PlanningComponentKey,
} from "../types"
import { buildPackageOutputs } from "./buildPackageOutputs"
import { buildLessonPackageReadiness } from "./buildLessonPackageReadiness"

export function buildLessonPackage(
  inputs: LessonInputs,
  blueprint: LessonBlueprint,
  spec: LessonSpec,
  planningIdeas?: LessonPlanningIdeas,
  lessonRequest: LessonRequestPreferences = {
    requestedLessonParts: [],
    requestedOutputs: [],
  },
  missingAreaDecisions: Partial<Record<PlanningComponentKey, MissingAreaDecisionChoice>> = {}
): LessonPackage {
  const outputs = buildPackageOutputs({
    inputs,
    blueprint,
    spec,
    planningIdeas,
    lessonRequest,
    missingAreaDecisions,
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