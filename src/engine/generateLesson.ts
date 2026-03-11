import { runLessonPipeline } from "./pipeline/runLessonPipeline"
import { LessonInputs, LessonMode, LessonPackage, MaterialFile } from "./types"

export { runLessonPipeline }
export type { LessonPipelineResult } from "./pipeline/runLessonPipeline"

export function generateLesson(
  inputs: LessonInputs,
  materials: MaterialFile[],
  selectedMode: LessonMode = "single"
): LessonPackage {
  return runLessonPipeline(inputs, materials, selectedMode).lessonPackage
}
