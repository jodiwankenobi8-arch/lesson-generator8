import { runLessonPipeline } from "./pipeline/runLessonPipeline"
import { useLessonStore } from "../state/useLessonStore"

let isGeneratingLesson = false

export async function generateLesson() {
  if (isGeneratingLesson) {
    return
  }

  const store = useLessonStore.getState()

  if (!store.canGenerate()) {
    return
  }

  isGeneratingLesson = true

  try {
    const result = await runLessonPipeline(
      store.inputs,
      store.materials,
      store.selectedLessonMode,
      store.missingAreaDecisions
    )

    store.setBlueprint(result.blueprint)
    store.setPlanningIdeas(result.planningIdeas)
    store.setLessonSpec(result.lessonSpec)
    store.setLessonPackage(result.lessonPackage)
  } finally {
    isGeneratingLesson = false
  }
}
