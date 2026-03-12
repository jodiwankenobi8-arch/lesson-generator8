import {
  LessonBlueprint,
  LessonPackageReadiness,
} from "../types"

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

  const contentFit =
    blueprint.content.vocabulary.length > 0 &&
    blueprint.content.texts.length > 0 &&
    blueprint.content.practiceIdeas.length > 0
      ? "grounded"
      : "limited"

  const warnings: string[] = []

  if (density === "thin") {
    warnings.push("Package outputs look thin and may need richer planning signals.")
  }

  if (contentFit === "limited") {
    warnings.push("Curriculum-driven content signals look sparse.")
  }

  if (lessonShape === "mixed") {
    warnings.push("This package includes more than one instructional target.")
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
        label: "Lesson Shape",
        value: lessonShape === "mixed" ? "Mixed" : "Single-focus",
        note:
          lessonShape === "mixed"
            ? "The package is serving more than one instructional target."
            : "The package is centered on one main instructional target.",
        tone: "neutral",
      },
      {
        label: "Content Source Fit",
        value: contentFit === "grounded" ? "Grounded" : "Limited",
        note:
          contentFit === "grounded"
            ? "Curriculum-driven content signals are present in the package."
            : "Some curriculum-driven content signals look sparse.",
        tone: contentFit === "grounded" ? "good" : "warn",
      },
    ],
  }
}
