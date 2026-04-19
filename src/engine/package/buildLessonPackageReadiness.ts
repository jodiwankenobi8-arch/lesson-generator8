import {
  LessonBlueprint,
  LessonPackageReadiness,
} from "../types"
import { getUnresolvedBlueprintCurriculumLanes } from "../shared/curriculumReviewStatus"
import { getNormalizedBlueprintValues } from "../shared/teacherFacingContent"

export function buildLessonPackageReadiness(args: {
  blueprint: LessonBlueprint
  slides: string[]
  centers: string[]
  interventions: string[]
}): LessonPackageReadiness {
  const { blueprint, slides, centers, interventions } = args

  const density =
    slides.length >= 4 && centers.length >= 2 && interventions.length >= 1
      ? "balanced"
      : "thin"

  const lessonShape = blueprint.content.target.isMixedTarget
    ? "mixed"
    : "single-focus"

  const unresolvedCurriculumLanes = getUnresolvedBlueprintCurriculumLanes(blueprint)
  const normalizedVocabulary = getNormalizedBlueprintValues(blueprint, "vocabulary")
  const normalizedWordLists = getNormalizedBlueprintValues(blueprint, "wordList")
  const normalizedTexts = getNormalizedBlueprintValues(blueprint, "text")
  const normalizedPracticeIdeas = getNormalizedBlueprintValues(blueprint, "practice")

  const contentFit =
    unresolvedCurriculumLanes.length === 0 &&
    normalizedVocabulary.length > 0 &&
    normalizedWordLists.length > 0 &&
    normalizedTexts.length > 0 &&
    normalizedPracticeIdeas.length > 0
      ? "grounded"
      : "limited"

  const warnings: string[] = []

  if (density === "thin") {
    warnings.push("Package outputs look thin and may need richer planning signals.")
  }

  if (contentFit === "limited") {
    warnings.push("Curriculum-driven content signals look sparse.")
  }

  if (unresolvedCurriculumLanes.length > 0) {
    warnings.push(
      `Curriculum review is still needed for: ${unresolvedCurriculumLanes
        .map((lane) =>
          lane === "wordLists"
            ? "word list or examples"
            : lane === "texts"
              ? "text or topic"
              : lane === "practiceIdeas"
                ? "practice ideas"
                : lane
        )
        .join(", ")}.`
    )
  }

  if (lessonShape === "mixed") {
    warnings.push("This package includes more than one lesson area.")
  }

  return {
    density,
    lessonShape,
    contentFit,
    warnings,
    signals: [
      {
        label: "Package Density",
        value: density === "balanced" ? "Balanced" : "Thin",
        note:
          density === "balanced"
            ? "The package includes a solid spread of lesson components."
            : "This package may need richer outputs or stronger upstream planning signals.",
        tone: density === "balanced" ? "good" : "warn",
      },
      {
        label: "Lesson Area Shape",
        value: lessonShape === "mixed" ? "Multiple lesson areas" : "Single lesson area",
        note:
          lessonShape === "mixed"
            ? "The package is serving more than one lesson area."
            : "The package is centered on one main lesson area.",
        tone: "neutral",
      },
      {
        label: "Content Source Fit",
        value: contentFit === "grounded" ? "Grounded" : "Limited",
        note:
          contentFit === "grounded"
            ? "Curriculum-driven content signals are present in the package."
            : unresolvedCurriculumLanes.length > 0
              ? "Some curriculum lanes still need teacher confirmation before the package is classroom-ready."
              : "Some curriculum-driven content signals look sparse.",
        tone: contentFit === "grounded" ? "good" : "warn",
      },
    ],
  }
}
