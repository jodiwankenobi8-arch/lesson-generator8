import type {
  LessonInput,
  LessonPackage,
  Slide,
  DetectedStandard,
  LessonPlanSection,
  Center,
  InterventionSet,
  SlideType,
} from "./types";
import type { LessonBlueprint } from "./blueprint/types";
import { makeId } from "../utils/makeId";
import { detectKelaBest } from "./standards/detectKelaBest";
import { buildLessonSpec } from "./spec/buildLessonSpec";

const APP_VERSION = "1.2.0";

function computeDetectedStandards(input: LessonInput): DetectedStandard[] {
  if (Array.isArray(input.manualStandardOverride) && input.manualStandardOverride.length > 0) {
    return input.manualStandardOverride.map((code: string) => ({
      code,
      description: "(manual override)",
      confidence: 1,
      overridden: true,
    }));
  }

  if (input.grade === "K" && input.subject === "ELA") {
    return detectKelaBest(
      {
        lessonTitle: input.lessonTitle,
        objective: input.objective,
        essentialQuestion: input.essentialQuestion,
        textOrTopic: input.textOrTopic,
        materials: input.materials,
      },
      { max: 3 },
    ).map((item: any) => ({
      code: item.code,
      description: item.description || item.label || "",
      confidence: typeof item.confidence === "number" ? item.confidence : 0,
    }));
  }

  return [];
}

function adjustStandardsByIntent(standards: DetectedStandard[], input: LessonInput): DetectedStandard[] {
  const corpus = [
    input.lessonTitle,
    input.objective,
    input.essentialQuestion,
    input.textOrTopic,
    input.materials,
  ].filter(Boolean).join(" ").toLowerCase();

  const comprehensionIntent = /(comprehens|retell|story|characters?|setting|important\s+events?|beginning|middle|end|who|where|when|plot|sequence|main\s+character|key\s+details)/i.test(corpus);
  const vocabExplicit = /(vocab|vocabulary|word\s+sort|sort\s+words|categories|category|classify\s+words|word\s+relationships|context\s+clues|synonym|antonym)/i.test(corpus);

  const adjusted = standards.map((standard) => {
    let score = standard.confidence;
    if (comprehensionIntent && /^ELA\.K\.R\./.test(standard.code)) score += 0.2;
    if (comprehensionIntent && !vocabExplicit && /^ELA\.K\.V\./.test(standard.code)) score -= 0.15;
    return { ...standard, confidence: Math.max(0, Math.min(1, score)) };
  });

  adjusted.sort((a, b) => b.confidence - a.confidence || a.code.localeCompare(b.code));
  return adjusted;
}

const SLIDE_LIBRARY: Record<SlideType, (input: LessonInput) => Slide> = {
  title: (input) => ({
    id: makeId("s"),
    type: "title",
    title: input.lessonTitle,
    bullets: [`${input.subject} | Grade ${input.grade}`, `Date: ${input.date}`],
  }),
  objective: (input) => ({
    id: makeId("s"),
    type: "objective",
    title: "Objective",
    bullets: [input.objective],
    teacherNotes: "State objective. Students echo. Preview lesson steps.",
  }),
  discussion: (input) => ({
    id: makeId("s"),
    type: "discussion",
    title: "Essential Question",
    bullets: [input.essentialQuestion || "What are we learning today?"],
    teacherNotes: "Turn-and-talk; share 2-3 ideas; connect to objective.",
  }),
  "mini-lesson": (input) => ({
    id: makeId("s"),
    type: "mini-lesson",
    title: "Mini Lesson",
    bullets: [`Text/Topic: ${input.textOrTopic}`, "Teach the new skill clearly and briefly."],
    teacherNotes: "Teach in short chunks. Name the strategy and model the thinking.",
  }),
  modeling: () => ({
    id: makeId("s"),
    type: "modeling",
    title: "Modeling",
    bullets: ["I do: Watch me think aloud.", "Notice the steps and language I use."],
    teacherNotes: "Think aloud. Show one complete example before release.",
  }),
  guided: () => ({
    id: makeId("s"),
    type: "guided",
    title: "Guided Practice",
    bullets: ["We do: Solve one together.", "Students respond with support."],
    teacherNotes: "Prompt and scaffold. Correct misconceptions immediately.",
  }),
  practice: () => ({
    id: makeId("s"),
    type: "practice",
    title: "Independent Practice",
    bullets: ["You do: Try it on your own.", "Explain or show your thinking."],
    teacherNotes: "Circulate. Pull Tier 3 first. Provide fast feedback.",
  }),
  "exit-ticket": () => ({
    id: makeId("s"),
    type: "exit-ticket",
    title: "Exit Ticket",
    bullets: ["1 quick check", "Show you met the objective"],
    teacherNotes: "Collect evidence to decide reteach or enrich next lesson.",
  }),
};

function buildSlides(input: LessonInput, blueprint?: LessonBlueprint | null): Slide[] {
  const spec = buildLessonSpec(input, blueprint);
  return spec.slideOrder.map((type, index) => {
    const slide = SLIDE_LIBRARY[type](input);
    const extraNotes = spec.teacherNoteAdditions[type] || [];
    if (extraNotes.length) {
      slide.teacherNotes = [slide.teacherNotes, ...extraNotes].filter(Boolean).join("\n");
    }
    if (spec.frameworkApplied === "clickableHub" && index === 1) {
      slide.title = "Lesson Hub";
      slide.bullets = ["Choose the lesson path together.", "Preview stations, teaching, and exit steps."];
    }
    if (spec.frameworkApplied === "guidepost" && type === "discussion") {
      slide.title = "Bridge";
      slide.bullets = ["Connect prior learning to today.", input.essentialQuestion || "Discuss the focus of the lesson."];
    }
    return slide;
  });
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

function buildLessonPlan(input: LessonInput, slides: Slide[], primaryStandardCode?: string, blueprint?: LessonBlueprint | null): LessonPlanSection[] {
  const idx = (type: SlideType) => slides.findIndex((slide) => slide.type === type) + 1;
  const diff = buildStrandDifferentiation(primaryStandardCode);
  const tier3 = input.groupNotes?.tier3 || diff.tier3;
  const tier2 = input.groupNotes?.tier2 || diff.tier2;
  const enrichment = input.groupNotes?.enrichment || diff.enrichment;
  const framework = blueprint?.synthesis?.frameworkApplied || "linear";

  if (framework === "clickableHub") {
    return [
      {
        heading: "Launch and Navigation",
        slides: [idx("title"), idx("discussion"), idx("objective")].filter((n) => n > 0),
        description: "Open the lesson with a hub-style overview, preview choices, and anchor the objective before instruction begins.",
        differentiation: { tier3, tier2, enrichment },
      },
      {
        heading: "Mini Lesson and Model",
        slides: [idx("mini-lesson"), idx("modeling")].filter((n) => n > 0),
        description: `Teach the skill using ${input.textOrTopic}. Model the process clearly, then set students up for station or center work.`,
        differentiation: { tier3, tier2, enrichment },
      },
      {
        heading: "Guided Rotation and Practice",
        slides: [idx("guided"), idx("practice")].filter((n) => n > 0),
        description: "Move students through guided support and center-based practice with explicit transitions.",
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

  if (framework === "guidepost") {
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
        description: `Teach the skill using ${input.textOrTopic}, then move quickly into supported guided practice.`,
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
      description: "Welcome students, introduce the objective, and anchor the lesson with the essential question.",
      differentiation: { tier3, tier2, enrichment },
    },
    {
      heading: "Teach and Model",
      slides: [idx("mini-lesson"), idx("modeling")].filter((n) => n > 0),
      description: `Teach the skill using ${input.textOrTopic}. Model the thinking and name the steps explicitly.`,
      differentiation: { tier3, tier2, enrichment },
    },
    {
      heading: "Guided and Independent Practice",
      slides: [idx("guided"), idx("practice")].filter((n) => n > 0),
      description: "Guide one example together, then release students to apply the skill with support matched to need.",
      differentiation: { tier3, tier2, enrichment },
    },
    {
      heading: "Assessment and Next Steps",
      slides: [idx("exit-ticket")].filter((n) => n > 0),
      description: "Use a quick exit ticket to check mastery and decide reteach, review, or enrichment.",
      differentiation: { tier3, tier2, enrichment },
    },
  ];
}

function buildCenters(input: LessonInput, blueprint?: LessonBlueprint | null): Center[] {
  const framework = blueprint?.synthesis?.frameworkApplied || "linear";

  if (framework === "clickableHub") {
    return [
      {
        title: "Teacher Table",
        objective: input.objective,
        direction: "Meet with the teacher for a guided round tied to the mini lesson.",
        materials: input.materials || "Teacher-selected lesson materials",
        printables: "Optional guided group sheet",
      },
      {
        title: "Center Rotation",
        objective: "Practice the focus skill in a station format",
        direction: `Rotate through a short task using ${input.textOrTopic}.`,
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
      direction: "Repeat the exact skill with a short routine. Complete 2-3 reps.",
      materials: input.materials || "Teacher-selected lesson materials",
      printables: "Optional teacher-created response sheet",
    },
    {
      title: "Apply It Center",
      objective: "Apply the skill in context",
      direction: `Use ${input.textOrTopic} to apply the skill and explain your thinking.`,
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

function buildRotationPlan(input: LessonInput, blueprint?: LessonBlueprint | null) {
  const framework = blueprint?.synthesis?.frameworkApplied || "linear";

  if (framework === "clickableHub") {
    return [
      {
        title: "Hub Launch",
        description: "Preview the lesson hub and explain how students will move through instruction and practice.",
      },
      {
        title: "Teacher Table Rotation",
        description: `Start with guided support for about ${Math.max(8, Math.round(input.durationMinutes / 5))} minutes while others work in stations.`,
      },
      {
        title: "Center Rotation",
        description: "Rotate students through independent or partner tasks with explicit transitions.",
      },
      {
        title: "Whole Group Close",
        description: "Return to the whole group for the exit check and reflection.",
      },
    ];
  }

  return [
    {
      title: "Rotation 1",
      description: `Start with teacher table and Tier 3 support. Spend about ${Math.max(8, Math.round(input.durationMinutes / 5))} minutes.`,
    },
    {
      title: "Rotation 2",
      description: "Move Tier 2 students into guided support while on-level students complete independent practice.",
    },
    {
      title: "Rotation 3",
      description: "Close with enrichment check-in, accountability, and a transition to the exit ticket.",
    },
  ];
}

function buildInterventions(_input: LessonInput): InterventionSet {
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

export function generateLesson(input: LessonInput, blueprint?: LessonBlueprint | null): LessonPackage {
  const detected = adjustStandardsByIntent(computeDetectedStandards(input), input);
  const primaryStandard = detected[0];
  const slides = buildSlides(input, blueprint);
  const lessonPlan = buildLessonPlan(input, slides, primaryStandard?.code, blueprint);
  const centers = buildCenters(input, blueprint);
  const rotationPlan = buildRotationPlan(input, blueprint);
  const interventions = buildInterventions(input);

  return {
    meta: { generatedAt: new Date().toISOString(), version: APP_VERSION },
    input,
    standards: detected,
    standardsDetected: detected,
    slides,
    lessonPlan,
    centers,
    rotationPlan,
    interventions,
  };
}
