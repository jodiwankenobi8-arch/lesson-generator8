import {
  LessonBlueprint,
  LessonPackageReadiness,
} from "../types"
import {
  evaluateGroundingReviewState,
  formatGroundingReviewKinds,
  REVIEW_CONTENT_ANCHOR_STATUS,
} from "../shared/reviewGuidance"

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

  const groundingReview = evaluateGroundingReviewState(blueprint)
  const contentFit = groundingReview.blocksExports ? "limited" : "grounded"

  const warnings: string[] = []

  if (density === "thin") {
    warnings.push("Package outputs look thin and may need richer planning signals.")
  }

  if (groundingReview.missingRequired.length > 0) {
    warnings.push(
      `Review Materials before export: confirm ${formatGroundingReviewKinds(groundingReview.missingRequired)}.`
    )
  }

  if (groundingReview.needsContentAnchor) {
    warnings.push(REVIEW_CONTENT_ANCHOR_STATUS)
  }

  if (groundingReview.blocksExports) {
    warnings.push("Exports stay blocked until the required lesson content is confirmed on Materials.")
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
        value: contentFit === "grounded" ? "Grounded" : "Needs teacher review",
        note:
          contentFit === "grounded"
            ? "Required lesson content is grounded strongly enough for classroom-ready exports."
            : "Review Materials and confirm the missing lesson content before exporting.",
        tone: contentFit === "grounded" ? "good" : "warn",
      },
    ],
  }
}
