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

const APP_VERSION = "1.4.0";

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

function getFramework(blueprint?: LessonBlueprint | null) {
  return blueprint?.synthesis?.frameworkApplied || "linear";
}

function isTeacherLedEarlyElementary(input: LessonInput, blueprint?: LessonBlueprint | null) {
  const grade = String(input.grade || blueprint?.plan?.grade || "").trim().toLowerCase();
  return /^(k|kg|kindergarten|grade k|grade kindergarten|1|1st|first|grade 1|grade first)$/.test(grade);
}

function allowStudentNavigationLanguage(input: LessonInput, blueprint?: LessonBlueprint | null) {
  return getFramework(blueprint) === "clickableHub" && !isTeacherLedEarlyElementary(input, blueprint);
}

function getCurriculumTitles(blueprint?: LessonBlueprint | null): string[] {
  return (blueprint?.curriculum?.coverageChecklist || [])
    .map((item) => item.title)
    .filter(Boolean)
    .slice(0, 3);
}

function getCueText(blueprint?: LessonBlueprint | null): string[] {
  return (blueprint?.exemplar?.presenterCues || [])
    .map((cue) => cue.rawText)
    .filter(Boolean)
    .slice(0, 4);
}

function makeMiniLessonBullets(input: LessonInput, blueprint?: LessonBlueprint | null): string[] {
  const curriculumTitles = getCurriculumTitles(blueprint);
  const teacherLed = isTeacherLedEarlyElementary(input, blueprint);

  if (teacherLed) {
    return [
      `Focus skill: ${input.objective}`,
      `Lesson text/topic: ${input.textOrTopic}`,
      curriculumTitles[0] ? `Teaching example: ${curriculumTitles[0]}` : "Teaching example: teacher-led modeled example",
    ];
  }

  if (getFramework(blueprint) === "clickableHub") {
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

function makePracticeBullets(input: LessonInput, blueprint?: LessonBlueprint | null): string[] {
  const framework = getFramework(blueprint);
  const curriculumTitles = getCurriculumTitles(blueprint);

  if (isTeacherLedEarlyElementary(input, blueprint)) {
    return [
      "Let's practice together.",
      curriculumTitles[0] ? `Use this example during guided practice: ${curriculumTitles[0]}` : "Use teacher-led examples to practice the target skill.",
    ];
  }

  if (framework === "clickableHub") {
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

function makeExitBullets(input: LessonInput, blueprint?: LessonBlueprint | null): string[] {
  const framework = getFramework(blueprint);

  if (isTeacherLedEarlyElementary(input, blueprint)) {
    return [
      "Let's show what we learned.",
      `Show this goal: ${input.objective}`,
    ];
  }

  if (framework === "guidepost") {
    return [
      "Reflect on what helped you today.",
      `Show how you met this goal: ${input.objective}`,
    ];
  }
  if (framework === "clickableHub") {
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

const SLIDE_LIBRARY: Record<SlideType, (input: LessonInput, blueprint?: LessonBlueprint | null) => Slide> = {
  title: (input, blueprint) => ({
    id: makeId("s"),
    type: "title",
    title: input.lessonTitle,
    bullets: [
      `${input.subject} | Grade ${input.grade}`,
      `Date: ${input.date}`,
      ...(getFramework(blueprint) !== "linear" && !isTeacherLedEarlyElementary(input) ? [`Framework: ${getFramework(blueprint)}`] : []),
    ],
  }),
  objective: (input) => ({
    id: makeId("s"),
    type: "objective",
    title: isTeacherLedEarlyElementary(input, blueprint) ? "I Can" : "Objective",
    bullets: [input.objective],
    teacherNotes: "State objective. Students echo. Preview lesson steps.",
  }),
  discussion: (input, blueprint) => ({
    id: makeId("s"),
    type: "discussion",
    title: isTeacherLedEarlyElementary(input, blueprint) ? "What Are We Learning?" : "Essential Question",
    bullets: [
      input.essentialQuestion || "What are we learning today?",
      ...(getCueText(blueprint).slice(0, 1).length && !isTeacherLedEarlyElementary(input) ? [`Cue: ${getCueText(blueprint)[0]}`] : []),
    ],
    teacherNotes: allowStudentNavigationLanguage(input, blueprint)
      ? "Use the hub opening to preview choices, then turn-and-talk."
      : "Turn-and-talk; share 2-3 ideas; connect to objective.",
  }),
  "mini-lesson": (input, blueprint) => ({
    id: makeId("s"),
    type: "mini-lesson",
    title: isTeacherLedEarlyElementary(input, blueprint) ? "Teach" : getFramework(blueprint) === "clickableHub" ? "Mini Lesson" : "Teach",
    bullets: makeMiniLessonBullets(input, blueprint),
    teacherNotes: allowStudentNavigationLanguage(input, blueprint)
      ? "Teach briefly, then launch students into the next hub path."
      : "Teach in short chunks. Name the strategy and model the thinking.",
  }),
  modeling: (input, blueprint) => ({
    id: makeId("s"),
    type: "modeling",
    title: "Modeling",
    bullets: isTeacherLedEarlyElementary(input, blueprint)
      ? ["My turn. Watch and listen.", "Notice how we say the sounds and blend the word."]
      : getFramework(blueprint) === "clickableHub"
        ? ["Model one path clearly before rotations begin.", "Show what success looks like in the hub."]
        : ["I do: Watch me think aloud.", "Notice the steps and language I use."],
    teacherNotes: "Think aloud. Show one complete example before release.",
  }),
  guided: (input, blueprint) => ({
    id: makeId("s"),
    type: "guided",
    title: "Guided Practice",
    bullets: isTeacherLedEarlyElementary(input, blueprint)
      ? ["Let's do one together.", "Say it with me. Then try one."]
      : getFramework(blueprint) === "clickableHub"
        ? ["We do: Practice one round together before students rotate.", "Name the transition expectations."]
        : ["We do: Solve one together.", "Students respond with support."],
    teacherNotes: "Prompt and scaffold. Correct misconceptions immediately.",
  }),
  practice: (input, blueprint) => ({
    id: makeId("s"),
    type: "practice",
    title: isTeacherLedEarlyElementary(input, blueprint)
      ? "Let's Practice"
      : getFramework(blueprint) === "clickableHub"
        ? "Center Rotation"
        : "Independent Practice",
    bullets: makePracticeBullets(input, blueprint),
    teacherNotes: allowStudentNavigationLanguage(input, blueprint)
      ? "Circulate between stations. Reinforce routines and accountability."
      : "Circulate. Pull Tier 3 first. Provide fast feedback.",
  }),
  "exit-ticket": (input, blueprint) => ({
    id: makeId("s"),
    type: "exit-ticket",
    title: isTeacherLedEarlyElementary(input, blueprint)
      ? "Show What You Know"
      : getFramework(blueprint) === "guidepost"
        ? "Reflection"
        : "Exit Ticket",
    bullets: makeExitBullets(input, blueprint),
    teacherNotes: allowStudentNavigationLanguage(input, blueprint)
      ? "Bring students back together and close the hub path with one final check."
      : "Collect evidence to decide reteach or enrich next lesson.",
  }),
};

function buildSlides(input: LessonInput, blueprint?: LessonBlueprint | null): Slide[] {
  const spec = buildLessonSpec(input, blueprint);
  return spec.slideOrder.map((type, index) => {
    const slide = SLIDE_LIBRARY[type](input, blueprint);
    const extraNotes = spec.teacherNoteAdditions[type] || [];
    if (extraNotes.length) {
      slide.teacherNotes = [slide.teacherNotes, ...extraNotes].filter(Boolean).join("\n");
    }
    if (spec.frameworkApplied === "clickableHub" && index === 1 && !isTeacherLedEarlyElementary(input, blueprint)) {
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
  const curriculumTitles = getCurriculumTitles(blueprint);
  const cueText = getCueText(blueprint);
  const teacherLed = isTeacherLedEarlyElementary(input, blueprint);

  if (framework === "clickableHub" && !teacherLed) {
    return [
      {
        heading: "Launch and Navigation",
        slides: [idx("title"), idx("discussion"), idx("objective")].filter((n) => n > 0),
        description: cueText[0]
          ? `Open the lesson with a hub-style overview, preview choices, and use this cue: ${cueText[0]}.`
          : "Open the lesson with a hub-style overview, preview choices, and anchor the objective before instruction begins.",
        differentiation: { tier3, tier2, enrichment },
      },
      {
        heading: "Mini Lesson and Model",
        slides: [idx("mini-lesson"), idx("modeling")].filter((n) => n > 0),
        description: curriculumTitles[0]
          ? `Teach the skill using ${input.textOrTopic} and anchor the model in ${curriculumTitles[0]}.`
          : `Teach the skill using ${input.textOrTopic}. Model the process clearly, then set students up for station or center work.`,
        differentiation: { tier3, tier2, enrichment },
      },
      {
        heading: "Guided Rotation and Practice",
        slides: [idx("guided"), idx("practice")].filter((n) => n > 0),
        description: cueText[1]
          ? `Move students through guided support and center-based practice with this transition cue: ${cueText[1]}.`
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

  if (framework === "guidepost" && !teacherLed) {
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
        description: curriculumTitles[0]
          ? `Teach the skill using ${input.textOrTopic} and practice it through ${curriculumTitles[0]}.`
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
      description: "Welcome students, introduce the objective, and anchor the lesson with the essential question.",
      differentiation: { tier3, tier2, enrichment },
    },
    {
      heading: "Teach and Model",
      slides: [idx("mini-lesson"), idx("modeling")].filter((n) => n > 0),
      description: curriculumTitles[0]
        ? `Teach the skill using ${input.textOrTopic} and model it with ${curriculumTitles[0]}.`
        : `Teach the skill using ${input.textOrTopic}. Model the thinking and name the steps explicitly.`,
      differentiation: { tier3, tier2, enrichment },
    },
    {
      heading: teacherLed ? "Guided Practice and Teacher Support" : "Guided and Independent Practice",
      slides: [idx("guided"), idx("practice")].filter((n) => n > 0),
      description: curriculumTitles[1]
        ? `Guide one example together, then release students to apply the skill using ${curriculumTitles[1]}.`
        : "Guide one example together, then release students to apply the skill with support matched to need.",
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
  const curriculumTitles = getCurriculumTitles(blueprint);

  if (framework === "clickableHub" && !isTeacherLedEarlyElementary(input, blueprint)) {
    return [
      {
        title: "Teacher Table",
        objective: input.objective,
        direction: curriculumTitles[0]
          ? `Meet with the teacher for a guided round using ${curriculumTitles[0]}.`
          : "Meet with the teacher for a guided round tied to the mini lesson.",
        materials: input.materials || "Teacher-selected lesson materials",
        printables: "Optional guided group sheet",
      },
      {
        title: "Center Rotation",
        objective: "Practice the focus skill in a station format",
        direction: curriculumTitles[1]
          ? `Rotate through a short task using ${curriculumTitles[1]}.`
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
      direction: curriculumTitles[0]
        ? `Repeat the exact skill with this material: ${curriculumTitles[0]}. Complete 2-3 reps.`
        : "Repeat the exact skill with a short routine. Complete 2-3 reps.",
      materials: input.materials || "Teacher-selected lesson materials",
      printables: "Optional teacher-created response sheet",
    },
    {
      title: "Apply It Center",
      objective: "Apply the skill in context",
      direction: curriculumTitles[1]
        ? `Use ${curriculumTitles[1]} to apply the skill and explain your thinking.`
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

function buildRotationPlan(input: LessonInput, blueprint?: LessonBlueprint | null) {
  const framework = blueprint?.synthesis?.frameworkApplied || "linear";
  const cueText = getCueText(blueprint);

  if (framework === "clickableHub" && !isTeacherLedEarlyElementary(input, blueprint)) {
    return [
      {
        title: "Hub Launch",
        description: "Preview the lesson hub and explain how students will move through instruction and practice.",
      },
      {
        title: "Teacher Table Rotation",
        description: cueText[0]
          ? `Start guided support and use this launch cue: ${cueText[0]}`
          : `Start with guided support for about ${Math.max(8, Math.round(input.durationMinutes / 5))} minutes while others work in stations.`,
      },
      {
        title: "Center Rotation",
        description: cueText[1]
          ? `Rotate students through tasks using this transition cue: ${cueText[1]}`
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
