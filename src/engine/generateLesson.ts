import { runLessonPipeline } from "./pipeline/runLessonPipeline"
import { useLessonStore } from "../state/useLessonStore"

export async function generateLesson() {
  const store = useLessonStore.getState()

  if (!store.canGenerate()) {
    return
  }

  const result = await runLessonPipeline(
    store.inputs,
    store.materials,
    store.selectedLessonMode
  )

  store.setBlueprint(result.blueprint)
  store.setPlanningIdeas(result.planningIdeas)
  store.setLessonSpec(result.lessonSpec)
  store.setLessonPackage(result.lessonPackage)
}
