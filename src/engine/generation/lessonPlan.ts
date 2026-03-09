import type { LessonInput, LessonPlanSection, Slide, SlideType } from "../types";
import type { LessonBlueprint } from "../blueprint/types";
import { resolveLessonContext } from "../lessonContext";

function detectTwoPartLessonPlanMode(input: LessonInput, blueprint?: LessonBlueprint | null) {
  const corpus = [
    input.lessonTitle || "",
    input.objective || "",
    input.essentialQuestion || "",
    input.textOrTopic || "",
    blueprint?.synthesis?.notes || "",
  ]
    .join(" ")
    .toLowerCase();

  const phonicsHit = /\bcvc\b|\bcvce\b|\bphonics\b|\bblend\b|\bsegment\b|\blong a\b|\bshort a\b|\bmagic e\b|\bword family\b/.test(corpus);
  const comprehensionHit = /\bauthor'?s purpose\b|\bsetting\b|\bcharacter\b|\bretell\b|\bmain idea\b|\bstory\b|\bdetails\b|\binfer\b|\bcomprehension\b/.test(corpus);

  return {
    split: phonicsHit && comprehensionHit,
  };
}

function getStrandFromCode(primaryCode?: string): string | undefined {
  if (!primaryCode) return undefined;
  const parts = primaryCode.split(".");
  return parts.length >= 3 ? parts[2] : undefined;
}

function buildStrandDifferentiation(primaryCode?: string) {
  const strand = getStrandFromCode(primaryCode);
  switch (strand) {
    case "F":
      return {
        tier3: "Use sound boxes, stretch and tap phonemes, and keep the set short with immediate feedback.",
        tier2: "Provide blending lines with visual tracking and prompt students to segment before reading.",
        enrichment: "Add word-building challenges and ask students to explain the decoding move used.",
      };
    case "R":
      return {
        tier3: "Use picture support, retell with sentence frames, and focus on one key detail at a time.",
        tier2: "Provide a simple organizer with guided prompts.",
        enrichment: "Ask students to justify answers with text evidence.",
      };
    case "W":
      return {
        tier3: "Use oral rehearsal and sentence frames before writing.",
        tier2: "Provide a checklist for capitalization, spacing, and punctuation.",
        enrichment: "Add a second sentence and explain word choice.",
      };
    case "V":
      return {
        tier3: "Pre-teach target words with visuals and student-friendly definitions.",
        tier2: "Use sentence stems to apply vocabulary in context.",
        enrichment: "Generate synonyms or use the word in a new context.",
      };
    default:
      return {
        tier3: "Provide visual and verbal scaffolds.",
        tier2: "Offer guided prompts and structured support.",
        enrichment: "Extend with application or explanation.",
      };
  }
}

export function buildLessonPlan(
  input: LessonInput,
  slides: Slide[],
  primaryStandardCode?: string,
  blueprint?: LessonBlueprint | null
): LessonPlanSection[] {
  const idx = (type: SlideType) => slides.findIndex((slide) => slide.type === type) + 1;
  const diff = buildStrandDifferentiation(primaryStandardCode);
  const tier3 = input.groupNotes?.tier3 || diff.tier3;
  const tier2 = input.groupNotes?.tier2 || diff.tier2;
  const enrichment = input.groupNotes?.enrichment || diff.enrichment;
  const context = resolveLessonContext(input, blueprint);
  const splitMode = detectTwoPartLessonPlanMode(input, blueprint);

  if (context.framework === "clickableHub" && !context.teacherLed) {
    return [
      {
        heading: "Launch and Navigation",
        slides: [idx("title"), idx("discussion"), idx("objective")].filter((n) => n > 0),
        description: context.cueText[0]
          ? `Open the lesson with a hub-style overview, preview choices, and use this cue: ${context.cueText[0]}.`
          : "Open the lesson with a hub-style overview, preview choices, and anchor the objective before instruction begins.",
        differentiation: { tier3, tier2, enrichment },
      },
      {
        heading: "Mini Lesson and Model",
        slides: [idx("mini-lesson"), idx("modeling")].filter((n) => n > 0),
        description: context.curriculumTitles[0]
          ? `Teach the skill using ${input.textOrTopic} and anchor the model in ${context.curriculumTitles[0]}.`
          : `Teach the skill using ${input.textOrTopic}. Model the process clearly, then set students up for station or center work.`,
        differentiation: { tier3, tier2, enrichment },
      },
      {
        heading: "Guided Rotation and Practice",
        slides: [idx("guided"), idx("practice")].filter((n) => n > 0),
        description: context.cueText[1]
          ? `Move students through guided support and center-based practice with this transition cue: ${context.cueText[1]}.`
          : "Move students through guided support and center-based practice with explicit transitions.",
        differentiation: { tier3, tier2, enrichment },
      },
      {
        heading: "Check and Close",
        slides: [idx("exit-ticket")].filter((n) => n > 0),
        description: "Use a quick closing check to decide reteach, extension, or next-step grouping.",
        differentiation: { tier3, tier2, enrichment },
      },
    ];
  }

  if (context.framework === "guidepost" && !context.teacherLed) {
    return [
      {
        heading: "Launch and Bridge",
        slides: [idx("title"), idx("objective"), idx("discussion")].filter((n) => n > 0),
        description: "Open with the lesson goal, then bridge from prior learning into the new focus.",
        differentiation: { tier3, tier2, enrichment },
      },
      {
        heading: "Teach and Guided Practice",
        slides: [idx("mini-lesson"), idx("guided")].filter((n) => n > 0),
        description: context.curriculumTitles[0]
          ? `Teach the skill using ${input.textOrTopic} and practice it through ${context.curriculumTitles[0]}.`
          : `Teach the skill using ${input.textOrTopic}, then move quickly into supported guided practice.`,
        differentiation: { tier3, tier2, enrichment },
      },
      {
        heading: "Independent Work and Reflection",
        slides: [idx("practice"), idx("exit-ticket")].filter((n) => n > 0),
        description: "Give students time to apply the skill independently and close with reflection or an exit check.",
        differentiation: { tier3, tier2, enrichment },
      },
    ];
  }

  return [
    {
      heading: "Launch and Objective",
      slides: [idx("title"), idx("objective"), idx("discussion")].filter((n) => n > 0),
      description: splitMode.split
        ? "Open the lesson by naming the two parts clearly: first the phonics skill, then the comprehension/application task."
        : "Welcome students, introduce the objective, and anchor the lesson with the essential question.",
      differentiation: { tier3, tier2, enrichment },
    },
    {
      heading: "Teach and Model",
      slides: [idx("mini-lesson"), idx("modeling")].filter((n) => n > 0),
      description: splitMode.split
        ? "Part 1 teaches the phonics or word-reading skill explicitly. Part 2 models how that skill connects to meaning or text work."
        : context.curriculumTitles[0]
          ? `Teach the skill using ${input.textOrTopic} and model it with ${context.curriculumTitles[0]}.`
          : `Teach the skill using ${input.textOrTopic}. Model the thinking and name the steps explicitly.`,
      differentiation: { tier3, tier2, enrichment },
    },
    {
      heading: context.teacherLed ? "Guided Practice and Teacher Support" : "Guided and Independent Practice",
      slides: [idx("guided"), idx("practice")].filter((n) => n > 0),
      description: splitMode.split
        ? "Guide students through the phonics practice first, then shift into comprehension/application with clear teacher support."
        : context.curriculumTitles[1]
          ? `Guide one example together, then release students to apply the skill using ${context.curriculumTitles[1]}.`
          : "Guide one example together, then release students to apply the skill with support matched to need.",
      differentiation: { tier3, tier2, enrichment },
    },
    {
      heading: "Assessment and Next Steps",
      slides: [idx("exit-ticket")].filter((n) => n > 0),
      description: splitMode.split
        ? "Use a brief exit check that confirms both the phonics skill and the connected comprehension/application task."
        : "Use a quick exit ticket to check mastery and decide reteach, review, or enrichment.",
      differentiation: { tier3, tier2, enrichment },
    },
  ];
}
