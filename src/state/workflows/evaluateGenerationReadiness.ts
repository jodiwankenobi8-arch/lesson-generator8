import { buildBlueprint } from "../../engine/blueprint/buildBlueprint"
import {
  REVIEW_CONTENT_ANCHOR_STATUS,
  evaluateGroundingReviewState,
  formatGroundingReviewKinds,
} from "../../engine/shared/reviewGuidance"
import type { LessonInputs, LessonMode, MaterialFile } from "../../engine/types"

export type GenerationReadinessResult = {
  ready: boolean
  blockerMessage: string | null
}

export function evaluateGenerationReadiness(args: {
  inputs: LessonInputs
  materials: MaterialFile[]
  selectedLessonMode: LessonMode
}): GenerationReadinessResult {
  const { inputs, materials, selectedLessonMode } = args

  const readyCurriculumCount = materials.filter(
    (material) =>
      material.role === "curriculum" &&
      material.status === "ready" &&
      Boolean(material.analysis?.curriculum)
  ).length

  if (readyCurriculumCount === 0) {
    return {
      ready: false,
      blockerMessage:
        "Before generating, add at least one curriculum source and confirm the lesson content details on Materials.",
    }
  }

  const blueprint = buildBlueprint(inputs, materials, selectedLessonMode)
  const groundingReview = evaluateGroundingReviewState(blueprint)

  if (groundingReview.needsContentAnchor) {
    return {
      ready: false,
      blockerMessage: `${REVIEW_CONTENT_ANCHOR_STATUS}. Add concrete word examples or a text/topic on Materials before generating.`,
    }
  }

  if (groundingReview.missingRequired.length > 0) {
    return {
      ready: false,
      blockerMessage: `Before generating, confirm ${formatGroundingReviewKinds(
        groundingReview.missingRequired
      )} on Materials so the lesson is classroom-ready.`,
    }
  }

  return {
    ready: true,
    blockerMessage: null,
  }
}
