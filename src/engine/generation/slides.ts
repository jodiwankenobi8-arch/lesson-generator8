import type { LessonInput, Slide, SlideType } from "../types";
import type { LessonBlueprint } from "../blueprint/types";
import { makeId } from "../../utils/makeId";
import { buildLessonSpec } from "../spec/buildLessonSpec";
import { resolveLessonContext, type LessonContext } from "../lessonContext";

function makeMiniLessonBullets(input: LessonInput, context: LessonContext): string[] {
  const curriculumTitles = context.curriculumTitles;

  if (context.teacherLed) {
    return [
      `Focus skill: ${input.objective}`,
      `Lesson text/topic: ${input.textOrTopic}`,
      curriculumTitles[0] ? `Teaching example: ${curriculumTitles[0]}` : "Teaching example: teacher-led modeled example",
    ];
  }

  if (context.framework === "clickableHub") {
    return [
      `Focus skill: ${input.objective}`,
      `Lesson text/topic: ${input.textOrTopic}`,
      curriculumTitles[0] ? `Anchor task: ${curriculumTitles[0]}` : "Anchor task: teacher-led modeled example",
    ];
  }

  if (curriculumTitles.length) {
    return [
      `Focus skill: ${input.objective}`,
      `Lesson text/topic: ${input.textOrTopic}`,
      `Curriculum connection: ${curriculumTitles.join(" | ")}`,
    ];
  }

  return [
    `Text/Topic: ${input.textOrTopic}`,
    "Teach the new skill clearly and briefly.",
  ];
}

function makePracticeBullets(input: LessonInput, context: LessonContext): string[] {
  const curriculumTitles = context.curriculumTitles;

  if (context.teacherLed) {
    return [
      "Let's practice together.",
      curriculumTitles[0] ? `Use this example during guided practice: ${curriculumTitles[0]}` : "Use teacher-led examples to practice the target skill.",
    ];
  }

  if (context.framework === "clickableHub") {
    return [
      "Rotate through the practice path you were assigned.",
      curriculumTitles[0] ? `Use this task during practice: ${curriculumTitles[0]}` : "Use center materials to practice the target skill.",
    ];
  }

  if (curriculumTitles.length) {
    return [
      "You do: Try it on your own.",
      `Apply the skill with: ${curriculumTitles[0]}`,
    ];
  }

  return [
    "You do: Try it on your own.",
    "Explain or show your thinking.",
  ];
}

function makeExitBullets(input: LessonInput, context: LessonContext): string[] {
  if (context.teacherLed) {
    return [
      "Let's show what we learned.",
      `Show this goal: ${input.objective}`,
    ];
  }

  if (context.framework === "guidepost") {
    return [
      "Reflect on what helped you today.",
      `Show how you met this goal: ${input.objective}`,
    ];
  }

  if (context.framework === "clickableHub") {
    return [
      "Complete the final quick check before leaving the hub.",
      `Show evidence of this goal: ${input.objective}`,
    ];
  }

  return [
    "1 quick check",
    "Show you met the objective",
  ];
}

type SlideBuilder = (input: LessonInput, blueprint: LessonBlueprint | null | undefined, context: LessonContext) => Slide;

const SLIDE_LIBRARY: Record<SlideType, SlideBuilder> = {
  title: (input, blueprint, context) => ({
    id: makeId("s"),
    type: "title",
    title: input.lessonTitle,
    bullets: [
      `${input.subject} | Grade ${input.grade}`,
      `Date: ${input.date}`,
      ...(context.framework !== "linear" && !context.teacherLed ? [`Framework: ${context.framework}`] : []),
    ],
  }),
  objective: (input, blueprint, context) => ({
    id: makeId("s"),
    type: "objective",
    title: context.teacherLed ? "I Can" : "Objective",
    bullets: [input.objective],
    teacherNotes: "State objective. Students echo. Preview lesson steps.",
  }),
  discussion: (input, blueprint, context) => ({
    id: makeId("s"),
    type: "discussion",
    title: context.teacherLed ? "What Are We Learning?" : "Essential Question",
    bullets: [
      context.essentialQuestion || "What are we learning today?",
      ...(context.cueText.slice(0, 1).length && !context.teacherLed ? [`Cue: ${context.cueText[0]}`] : []),
    ],
    teacherNotes: context.allowStudentNavigation
      ? "Use the hub opening to preview choices, then turn-and-talk."
      : "Turn-and-talk; share 2-3 ideas; connect to objective.",
  }),
  "mini-lesson": (input, blueprint, context) => ({
    id: makeId("s"),
    type: "mini-lesson",
    title: context.teacherLed ? "Teach" : context.framework === "clickableHub" ? "Mini Lesson" : "Teach",
    bullets: makeMiniLessonBullets(input, context),
    teacherNotes: context.allowStudentNavigation
      ? "Teach briefly, then launch students into the next hub path."
      : "Teach in short chunks. Name the strategy and model the thinking.",
  }),
  modeling: (input, blueprint, context) => ({
    id: makeId("s"),
    type: "modeling",
    title: "Modeling",
    bullets: context.teacherLed
      ? ["My turn. Watch and listen.", "Notice how we say the sounds and blend the word."]
      : context.framework === "clickableHub"
        ? ["Model one path clearly before rotations begin.", "Show what success looks like in the hub."]
        : ["I do: Watch me think aloud.", "Notice the steps and language I use."],
    teacherNotes: "Think aloud. Show one complete example before release.",
  }),
  guided: (input, blueprint, context) => ({
    id: makeId("s"),
    type: "guided",
    title: "Guided Practice",
    bullets: context.teacherLed
      ? ["Let's do one together.", "Say it with me. Then try one."]
      : context.framework === "clickableHub"
        ? ["We do: Practice one round together before students rotate.", "Name the transition expectations."]
        : ["We do: Solve one together.", "Students respond with support."],
    teacherNotes: "Prompt and scaffold. Correct misconceptions immediately.",
  }),
  practice: (input, blueprint, context) => ({
    id: makeId("s"),
    type: "practice",
    title: context.teacherLed
      ? "Let's Practice"
      : context.framework === "clickableHub"
        ? "Center Rotation"
        : "Independent Practice",
    bullets: makePracticeBullets(input, context),
    teacherNotes: context.allowStudentNavigation
      ? "Circulate between stations. Reinforce routines and accountability."
      : "Circulate. Pull Tier 3 first. Provide fast feedback.",
  }),
  "exit-ticket": (input, blueprint, context) => ({
    id: makeId("s"),
    type: "exit-ticket",
    title: context.teacherLed
      ? "Show What You Know"
      : context.framework === "guidepost"
        ? "Reflection"
        : "Exit Ticket",
    bullets: makeExitBullets(input, context),
    teacherNotes: context.allowStudentNavigation
      ? "Bring students back together and close the hub path with one final check."
      : "Collect evidence to decide reteach or enrich next lesson.",
  }),
};

export function buildSlides(input: LessonInput, blueprint?: LessonBlueprint | null): Slide[] {
  const spec = buildLessonSpec(input, blueprint);
  const context = resolveLessonContext(input, blueprint);

  return spec.slideOrder.map((type, index) => {
    const slide = SLIDE_LIBRARY[type](input, blueprint, context);
    const extraNotes = spec.teacherNoteAdditions[type] || [];

    if (extraNotes.length) {
      slide.teacherNotes = [slide.teacherNotes, ...extraNotes].filter(Boolean).join("\n");
    }

    if (spec.frameworkApplied === "clickableHub" && index === 1 && !context.teacherLed) {
      slide.title = "Lesson Hub";
      slide.bullets = ["Choose the lesson path together.", "Preview stations, teaching, and exit steps."];
    }

    if (spec.frameworkApplied === "guidepost" && type === "discussion") {
      slide.title = "Bridge";
      slide.bullets = ["Connect prior learning to today.", context.essentialQuestion || "Discuss the focus of the lesson."];
    }

    return slide;
  });
}