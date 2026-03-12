import { LessonBlueprint, LessonSpec } from "../types"
import { buildSlideContent } from "./buildSlideContent"
import { buildSlidePlan } from "./buildSlidePlan"

export function assembleSlideDeck(
  blueprint: LessonBlueprint,
  spec: LessonSpec
): string[] {
  const plan = buildSlidePlan(blueprint, spec)
  return plan.map((slide) => buildSlideContent(slide))
}
