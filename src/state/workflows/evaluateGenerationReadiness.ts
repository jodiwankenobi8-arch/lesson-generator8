import { buildBlueprint } from "../../engine/blueprint/buildBlueprint"
import { getBlueprintCurriculumLaneStatus } from "../../engine/shared/curriculumReviewStatus"
import {
  REVIEW_CONTENT_ANCHOR_STATUS,
  evaluateGroundingReviewState,
  formatGroundingReviewKinds,
} from "../../engine/shared/reviewGuidance"
import type {
  BlueprintCurriculumLaneKey,
  LessonInputs,
  LessonMode,
  MaterialFile,
} from "../../engine/types"

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

  const curriculumMaterials = materials.filter((material) => material.role === "curriculum")

  if (curriculumMaterials.length === 0) {
    return {
      ready: true,
      blockerMessage: null,
    }
  }

  const readyCurriculumCount = curriculumMaterials.filter(
    (material) =>
      material.status === "ready" &&
      Boolean(material.analysis?.curriculum)
  ).length

  if (curriculumMaterials.length > 0 && readyCurriculumCount === 0) {
    return {
      ready: false,
      blockerMessage:
        "A curriculum source was added, but no usable curriculum content is ready yet. Review, remove, or replace the curriculum source before generating.",
    }
  }

  const blueprint = buildBlueprint(inputs, materials, selectedLessonMode)
  const requiredCurriculumLanes = getRequiredCurriculumLanes(blueprint)
  const unresolvedRequiredLanes = requiredCurriculumLanes.filter((lane) => {
    const status = getBlueprintCurriculumLaneStatus(blueprint, lane)
    return status === "review-needed" || status === "blocked"
  })
  const groundingReview = evaluateGroundingReviewState(blueprint)

  if (unresolvedRequiredLanes.length > 0) {
    return {
      ready: false,
      blockerMessage: `Before generating, confirm ${formatGroundingReviewKinds(
        unresolvedRequiredLanes.map((lane) => mapLaneToGroundingKind(lane))
      )} on Materials so the lesson is classroom-ready.`,
    }
  }

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

function getRequiredCurriculumLanes(
  blueprint: ReturnType<typeof buildBlueprint>
): BlueprintCurriculumLaneKey[] {
  if (blueprint.content.target.isMixedTarget) {
    return ["practiceIdeas"]
  }

  switch (blueprint.content.target.primary) {
    case "phonics":
    case "foundational":
    case "foundational_skills":
    case "phonological_awareness":
    case "phonemic_awareness":
    case "high_frequency_words":
    case "letter_identification":
    case "decoding":
    case "encoding":
    case "spelling":
    case "spelling_encoding":
    case "word_recognition":
    case "word_building":
    case "decodable_reading":
      return ["wordLists", "practiceIdeas"]
    case "comprehension":
    case "language_comprehension":
    case "reading_response":
    case "fluency":
    case "writing":
    case "writing_about_reading":
    case "writing_sentence_work":
      return ["texts", "practiceIdeas"]
    case "vocabulary":
    case "oral_language":
    case "vocabulary_oral_language":
    case "speaking_listening":
      return ["vocabulary", "practiceIdeas"]
    default:
      return ["practiceIdeas"]
  }
}

function mapLaneToGroundingKind(
  lane: BlueprintCurriculumLaneKey
): "vocabulary" | "wordList" | "text" | "practice" {
  switch (lane) {
    case "vocabulary":
      return "vocabulary"
    case "wordLists":
      return "wordList"
    case "texts":
      return "text"
    case "practiceIdeas":
      return "practice"
  }
}
