import type { LessonInput, Center } from "../types";
import type { LessonBlueprint } from "../blueprint/types";
import { resolveLessonContext } from "../lessonContext";

export function buildCenters(input: LessonInput, blueprint?: LessonBlueprint | null): Center[] {
  const context = resolveLessonContext(input, blueprint);

  if (context.framework === "clickableHub" && !context.teacherLed) {
    return [
      {
        title: "Teacher Table",
        objective: input.objective,
        direction: context.curriculumTitles[0]
          ? `Meet with the teacher for a guided round using ${context.curriculumTitles[0]}.`
          : "Meet with the teacher for a guided round tied to the mini lesson.",
        materials: input.materials || "Teacher-selected lesson materials",
        printables: "Optional guided group sheet",
      },
      {
        title: "Center Rotation",
        objective: "Practice the focus skill in a station format",
        direction: context.curriculumTitles[1]
          ? `Rotate through a short task using ${context.curriculumTitles[1]}.`
          : `Rotate through a short task using ${input.textOrTopic}.`,
        materials: input.materials || "Primary lesson text or topic materials",
        printables: "Optional station card",
      },
      {
        title: "Word Work",
        objective: "Rehearse decoding or response routines",
        direction: "Complete a short skill cycle and check with a partner.",
        materials: "Cards, manipulatives, or practice sheet",
        printables: "Optional response page",
      },
      {
        title: "Exit Check Prep",
        objective: "Get ready for the closing check",
        direction: "Review one last example before the exit ticket.",
        materials: "Mini whiteboard or response strip",
        printables: "Optional quick-check sheet",
      },
    ];
  }

  return [
    {
      title: "Skill Builder Center",
      objective: input.objective,
      direction: context.curriculumTitles[0]
        ? `Repeat the exact skill with this material: ${context.curriculumTitles[0]}. Complete 2-3 reps.`
        : "Repeat the exact skill with a short routine. Complete 2-3 reps.",
      materials: input.materials || "Teacher-selected lesson materials",
      printables: "Optional teacher-created response sheet",
    },
    {
      title: "Apply It Center",
      objective: "Apply the skill in context",
      direction: context.curriculumTitles[1]
        ? `Use ${context.curriculumTitles[1]} to apply the skill and explain your thinking.`
        : `Use ${input.textOrTopic} to apply the skill and explain your thinking.`,
      materials: input.materials || "Primary lesson text or topic materials",
      printables: "Optional recording sheet",
    },
    {
      title: "Spiral Review Center",
      objective: "Review and maintain a supporting skill",
      direction: "Complete a short confidence-building review task connected to prior learning.",
      materials: "Simple review cards or manipulatives",
      printables: "Optional quick-check sheet",
    },
  ];
}