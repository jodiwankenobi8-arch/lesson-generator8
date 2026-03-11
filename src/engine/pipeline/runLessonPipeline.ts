import { buildBlueprint } from "../blueprint/buildBlueprint"
import { buildLessonPackage } from "../package/buildLessonPackage"
import { buildLessonSpec } from "../spec/buildLessonSpec"
import {
  LessonBlueprint,
  LessonInputs,
  LessonMode,
  LessonPackage,
  LessonSpec,
  MaterialFile,
} from "../types"

export type LessonPipelineResult = {
  blueprint: LessonBlueprint
  lessonSpec: LessonSpec
  lessonPackage: LessonPackage
}

export function runLessonPipeline(
  inputs: LessonInputs,
  materials: MaterialFile[],
  selectedMode: LessonMode
): LessonPipelineResult {
  const blueprint = buildBlueprint(inputs, materials, selectedMode)
  const lessonSpec = buildLessonSpec(blueprint)
  const lessonPackage = buildLessonPackage(inputs, blueprint, lessonSpec)

  return {
    blueprint,
    lessonSpec,
    lessonPackage,
  }
}
