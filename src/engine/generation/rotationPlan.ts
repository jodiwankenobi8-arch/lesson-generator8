import type { LessonInput } from "../types";
import type { LessonBlueprint } from "../blueprint/types";
import { resolveLessonContext } from "../lessonContext";

export function buildRotationPlan(input: LessonInput, blueprint?: LessonBlueprint | null) {
  const context = resolveLessonContext(input, blueprint);

  if (context.framework === "clickableHub" && !context.teacherLed) {
    return [
      {
        title: "Hub Launch",
        description: "Preview the lesson hub and explain how students will move through instruction and practice.",
      },
      {
        title: "Teacher Table Rotation",
        description: context.cueText[0]
          ? `Start guided support and use this launch cue: ${context.cueText[0]}`
          : `Start with guided support for about ${Math.max(8, Math.round(input.durationMinutes / 5))} minutes while others work in stations.`,
      },
      {
        title: "Center Rotation",
        description: context.cueText[1]
          ? `Rotate students through tasks using this transition cue: ${context.cueText[1]}`
          : "Rotate students through independent or partner tasks with explicit transitions.",
      },
      {
        title: "Whole Group Close",
        description: "Return to the whole group for the exit check and reflection.",
      },
    ];
  }

  return [
    {
      title: "Launch and Teach",
      description: "Open with explicit instruction, model clearly, and keep students with you during the main teaching portion.",
    },
    {
      title: "Guided Practice",
      description: "Practice together with prompts, choral responses, and immediate correction.",
    },
    {
      title: "Check and Close",
      description: "Use a quick check to confirm understanding and decide next-step support.",
    },
  ];
}