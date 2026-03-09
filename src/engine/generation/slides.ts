import type { LessonInput, Slide, SlideType } from "../types";
import type { LessonBlueprint } from "../blueprint/types";
import { makeId } from "../../utils/makeId";
import { buildLessonSpec } from "../spec/buildLessonSpec";
import { resolveLessonContext, type LessonContext } from "../lessonContext";

function curriculumTitleAt(context: LessonContext, index: number, fallback?: string): string {
  const value = context.curriculumTitles[index];
  return value && value.trim() ? value.trim() : (fallback || "");
}

function detectTwoPartLesson(input: LessonInput, blueprint?: LessonBlueprint | null) {
  const corpus = [
    input.lessonTitle || "",
    input.objective || "",
    input.essentialQuestion || "",
    input.textOrTopic || "",
    blueprint?.synthesis?.notes || "",
    ...(blueprint?.curriculum?.coverageChecklist ?? []).map((item) => item.title || ""),
    ...(blueprint?.exemplar?.presenterCues ?? []).map((cue: any) => cue?.text || cue?.note || ""),
  ]
    .join(" ")
    .toLowerCase();

  const phonicsSignals = [
    /\bcvc\b/,
    /\bcvce\b/,
    /\bphonics\b/,
    /\bdecodable\b/,
    /\bblend\b/,
    /\bsegment\b/,
    /\blong a\b/,
    /\bshort a\b/,
    /\bmagic e\b/,
    /\bonset\b/,
    /\brime\b/,
    /\bword family\b/,
  ];

  const comprehensionSignals = [
    /\bauthor'?s purpose\b/,
    /\bpurpose\b/,
    /\bsetting\b/,
    /\bcharacter\b/,
    /\bretell\b/,
    /\bmain idea\b/,
    /\bstory\b/,
    /\bplot\b/,
    /\bdetails\b/,
    /\binfer\b/,
    /\btheme\b/,
    /\bcomprehension\b/,
  ];

  const phonicsHit = phonicsSignals.some((pattern) => pattern.test(corpus));
  const comprehensionHit = comprehensionSignals.some((pattern) => pattern.test(corpus));
  const split = phonicsHit && comprehensionHit;

  return {
    split,
    phonicsHit,
    comprehensionHit,
    objectiveLabel: split ? "Phonics + Comprehension" : null,
  };
}

function makeMiniLessonBullets(input: LessonInput, context: LessonContext, splitMode: ReturnType<typeof detectTwoPartLesson>): string[] {
  const curriculumTitles = context.curriculumTitles;

  if (splitMode.split) {
    return [
      `Part 1: phonics focus -> ${input.objective}`,
      `Part 2: comprehension/application -> ${input.textOrTopic}`,
      curriculumTitles[0] ? `Curriculum anchor: ${curriculumTitles[0]}` : "Teach each part separately and connect them at the end.",
    ];
  }

  if (context.teacherLed) {
    return [
      `Focus skill: ${input.objective}`,
      `Lesson text/topic: ${input.textOrTopic}`,
      curriculumTitleAt(context, 0)
        ? `Model with: ${curriculumTitleAt(context, 0)}`
        : "Model with one clear teacher-led example tied to the target skill.",
      curriculumTitleAt(context, 1) ? `Next connection: ${curriculumTitleAt(context, 1)}` : "",
    ].filter(Boolean);
  }

  if (context.framework === "clickableHub") {
    return [
      `Focus skill: ${input.objective}`,
      `Lesson text/topic: ${input.textOrTopic}`,
      curriculumTitleAt(context, 0) ? `Anchor task: ${curriculumTitleAt(context, 0)}` : "Anchor task: teacher-led modeled example",
      curriculumTitleAt(context, 1) ? `Support task: ${curriculumTitleAt(context, 1)}` : "",
    ].filter(Boolean);
  }

  if (curriculumTitles.length) {
    return [
      `Focus skill: ${input.objective}`,
      `Lesson text/topic: ${input.textOrTopic}`,
      curriculumTitleAt(context, 0) ? `Curriculum connection: ${curriculumTitleAt(context, 0)}` : "",
      curriculumTitleAt(context, 1) ? `Next example: ${curriculumTitleAt(context, 1)}` : "",
    ].filter(Boolean);
  }

  return [
    `Text/Topic: ${input.textOrTopic}`,
    "Teach the new skill clearly and briefly.",
  ];
}
function makeGuidedBullets(input: LessonInput, context: LessonContext, splitMode: ReturnType<typeof detectTwoPartLesson>): string[] {
  const curriculumTitles = context.curriculumTitles;

  if (splitMode.split) {
    return [
      "Part 1 guided practice: rehearse the phonics pattern together.",
      curriculumTitleAt(context, 1)
        ? `Part 2 guided application: ${curriculumTitleAt(context, 1)}`
        : curriculumTitleAt(context, 0)
          ? `Part 2 guided application: ${curriculumTitleAt(context, 0)}`
          : "Part 2 guided application: connect the phonics work to meaning or text work.",
    ].filter(Boolean);
  }

  if (context.teacherLed) {
    return [
      "Let's do one together.",
      curriculumTitleAt(context, 1)
        ? `Guided example: ${curriculumTitleAt(context, 1)}`
        : curriculumTitleAt(context, 0)
          ? `Guided example: ${curriculumTitleAt(context, 0)}`
          : "Guided example: one supported teacher-led example tied to the target skill.",
      curriculumTitleAt(context, 2)
        ? `Then students try: ${curriculumTitleAt(context, 2)}`
        : "Say it with me. Then try one.",
    ].filter(Boolean);
  }

  if (context.framework === "clickableHub") {
    return [
      curriculumTitleAt(context, 1)
        ? `We do: Practice this path together first -> ${curriculumTitleAt(context, 1)}`
        : curriculumTitleAt(context, 0)
          ? `We do: Practice this path together first -> ${curriculumTitleAt(context, 0)}`
          : "We do: Practice one round together before students rotate.",
      context.cueText[1]
        ? `Transition cue: ${context.cueText[1]}`
        : "Name the transition expectations.",
    ].filter(Boolean);
  }

  if (curriculumTitles.length) {
    return [
      curriculumTitleAt(context, 1)
        ? `We do: Solve one together using ${curriculumTitleAt(context, 1)}`
        : curriculumTitleAt(context, 0)
          ? `We do: Solve one together using ${curriculumTitleAt(context, 0)}`
          : "We do: Solve one together.",
      "Students respond with support.",
    ];
  }

  return [
    "We do: Solve one together.",
    "Students respond with support.",
  ];
}
function makePracticeBullets(input: LessonInput, context: LessonContext, splitMode: ReturnType<typeof detectTwoPartLesson>): string[] {
  const curriculumTitles = context.curriculumTitles;

  if (splitMode.split) {
    return [
      `Part 1: phonics focus -> ${input.objective}`,
      `Part 2: comprehension/application -> ${input.textOrTopic}`,
      curriculumTitles[0] ? `Curriculum anchor: ${curriculumTitles[0]}` : "Teach each part separately and connect them at the end.",
    ];
  }

  if (context.teacherLed) {
    return [
      "Let's practice together.",
      curriculumTitleAt(context, 1)
        ? `Use this example during guided practice: ${curriculumTitleAt(context, 1)}`
        : curriculumTitleAt(context, 0)
          ? `Use this example during guided practice: ${curriculumTitleAt(context, 0)}`
          : "Use teacher-led examples to practice the target skill.",
      curriculumTitleAt(context, 2) ? `Independent try: ${curriculumTitleAt(context, 2)}` : "",
    ].filter(Boolean);
  }

  if (context.framework === "clickableHub") {
    return [
      "Rotate through the practice path you were assigned.",
      curriculumTitleAt(context, 1)
        ? `Use this task during practice: ${curriculumTitleAt(context, 1)}`
        : curriculumTitleAt(context, 0)
          ? `Use this task during practice: ${curriculumTitleAt(context, 0)}`
          : "Use center materials to practice the target skill.",
      curriculumTitleAt(context, 2) ? `Then move to: ${curriculumTitleAt(context, 2)}` : "",
    ].filter(Boolean);
  }

  if (curriculumTitles.length) {
    return [
      "You do: Try it on your own.",
      `Apply the skill with: ${curriculumTitleAt(context, 2) || curriculumTitleAt(context, 1) || curriculumTitleAt(context, 0)}`,
    ];
  }

  return [
    "You do: Try it on your own.",
    curriculumTitleAt(context, 2) || curriculumTitleAt(context, 1) || curriculumTitleAt(context, 0) || "Explain or show your thinking.",
  ];
}

function makeExitBullets(input: LessonInput, context: LessonContext, splitMode: ReturnType<typeof detectTwoPartLesson>): string[] {
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

type SlideBuilder = (input: LessonInput, blueprint: LessonBlueprint | null | undefined, context: LessonContext, splitMode: ReturnType<typeof detectTwoPartLesson>) => Slide;

const SLIDE_LIBRARY: Record<SlideType, SlideBuilder> = {
  title: (input, blueprint, context, splitMode) => ({
    id: makeId("s"),
    type: "title",
    title: input.lessonTitle,
    bullets: [
      `${input.subject} | Grade ${input.grade}`,
      `Date: ${input.date}`,
      ...(context.framework !== "linear" && !context.teacherLed ? [`Framework: ${context.framework}`] : []),
    ],
  }),
  objective: (input, blueprint, context, splitMode) => ({
    id: makeId("s"),
    type: "objective",
    title: context.teacherLed ? "I Can" : "Objective",
    bullets: [input.objective],
    teacherNotes: "State objective. Students echo. Preview lesson steps.",
  }),
  discussion: (input, blueprint, context, splitMode) => ({
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
  "mini-lesson": (input, blueprint, context, splitMode) => ({
    id: makeId("s"),
    type: "mini-lesson",
    title: context.teacherLed ? "Teach" : context.framework === "clickableHub" ? "Mini Lesson" : "Teach",
    bullets: makeMiniLessonBullets(input, context, splitMode),
    teacherNotes: context.allowStudentNavigation
      ? "Teach briefly, then launch students into the next hub path."
      : "Teach in short chunks. Name the strategy and model the thinking.",
  }),
  modeling: (input, blueprint, context, splitMode) => ({
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
    guided: (input, blueprint, context, splitMode) => ({
      id: makeId("s"),
      type: "guided",
      title: "Guided Practice",
      bullets: makeGuidedBullets(input, context, splitMode),
      teacherNotes: "Prompt and scaffold. Correct misconceptions immediately.",
    }),
  practice: (input, blueprint, context, splitMode) => ({
    id: makeId("s"),
    type: "practice",
    title: context.teacherLed
      ? "Let's Practice"
      : context.framework === "clickableHub"
        ? "Center Rotation"
        : "Independent Practice",
    bullets: makePracticeBullets(input, context, splitMode),
    teacherNotes: context.allowStudentNavigation
      ? "Circulate between stations. Reinforce routines and accountability."
      : "Circulate. Pull Tier 3 first. Provide fast feedback.",
  }),
  "exit-ticket": (input, blueprint, context, splitMode) => ({
    id: makeId("s"),
    type: "exit-ticket",
    title: context.teacherLed
      ? "Show What You Know"
      : context.framework === "guidepost"
        ? "Reflection"
        : "Exit Ticket",
    bullets: makeExitBullets(input, context, splitMode),
    teacherNotes: context.allowStudentNavigation
      ? "Bring students back together and close the hub path with one final check."
      : "Collect evidence to decide reteach or enrich next lesson.",
  }),
};

export function buildSlides(input: LessonInput, blueprint?: LessonBlueprint | null): Slide[] {
  const spec = buildLessonSpec(input, blueprint);
  const context = resolveLessonContext(input, blueprint);
  const splitMode = detectTwoPartLesson(input, blueprint);

  return spec.slideOrder.map((type, index) => {
    const slide = SLIDE_LIBRARY[type](input, blueprint, context, splitMode);
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

    if (splitMode.split && type === "objective") {
      slide.bullets = [
        input.objective,
        "Two-part lesson: phonics first, then comprehension/application.",
      ];
    }

    if (splitMode.split && type === "discussion") {
      slide.bullets = [
        "We have two jobs today.",
        "Part 1 builds the word-reading skill. Part 2 uses that skill in meaning work.",
      ];
    }

    return slide;
  });
}






