import type { LessonInput, InterventionSet } from "../types";

export function buildInterventions(_input: LessonInput): InterventionSet {
  return {
    tier3: [
      "Re-teach with manipulatives or pictures using a model -> echo -> we do routine.",
      "Shorten the task and check after each step.",
      "Allow oral response, pointing, or choice supports.",
    ],
    tier2: [
      "Provide scaffolded practice with prompts and sentence frames.",
      "Do 2 guided examples, then 2 independent with immediate feedback.",
    ],
    enrichment: [
      "Transfer the skill to a new example, text, or problem.",
      "Ask students to justify why their answer works.",
    ],
  };
}