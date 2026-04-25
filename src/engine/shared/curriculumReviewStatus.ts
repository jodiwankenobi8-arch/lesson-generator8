import {
  BlueprintContentLaneStatus,
  BlueprintCurriculumLaneKey,
  LessonBlueprint,
} from "../types"
import { getNormalizedBlueprintValues } from "./teacherFacingContent"

export const CURRICULUM_REVIEW_LANE_LABELS: Record<BlueprintCurriculumLaneKey, string> = {
  vocabulary: "Vocabulary",
  wordLists: "Word list / examples",
  texts: "Text / topic",
  practiceIdeas: "Practice ideas",
}

export function getBlueprintCurriculumLaneStatus(
  blueprint: LessonBlueprint,
  lane: BlueprintCurriculumLaneKey
): BlueprintContentLaneStatus {
  const explicitStatus = blueprint.content.reviewStatus?.[lane]
  const groundedValues =
    lane === "vocabulary"
      ? getNormalizedBlueprintValues(blueprint, "vocabulary")
      : lane === "wordLists"
        ? getNormalizedBlueprintValues(blueprint, "wordList")
        : lane === "texts"
          ? getNormalizedBlueprintValues(blueprint, "text")
          : getNormalizedBlueprintValues(blueprint, "practice")

  if (explicitStatus === "blocked") {
    return "blocked"
  }

  if (explicitStatus === "reviewed") {
    return groundedValues.length > 0 ? "reviewed" : "review-needed"
  }

  if (explicitStatus === "extracted") {
    return groundedValues.length > 0 ? "extracted" : "review-needed"
  }

  if (explicitStatus === "review-needed") {
    return "review-needed"
  }

  return groundedValues.length > 0 ? "extracted" : "review-needed"
}

export function getUnresolvedBlueprintCurriculumLanes(
  blueprint: LessonBlueprint
): BlueprintCurriculumLaneKey[] {
  return (Object.keys(CURRICULUM_REVIEW_LANE_LABELS) as BlueprintCurriculumLaneKey[]).filter(
    (lane) => {
      const status = getBlueprintCurriculumLaneStatus(blueprint, lane)
      return status === "review-needed" || status === "blocked"
    }
  )
}

export function formatBlueprintCurriculumLaneLabel(
  lane: BlueprintCurriculumLaneKey
): string {
  return CURRICULUM_REVIEW_LANE_LABELS[lane]
}
