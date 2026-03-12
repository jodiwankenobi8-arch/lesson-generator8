import {
  LessonBlueprint,
  LessonPlanIdea,
  LessonPlanSectionIdeas,
  LessonPlanningIdeas,
} from "../types"
import { resolveTemplateShell } from "../shared/resolveTemplateShell"

export function buildLessonPlanningIdeas(
  blueprint: LessonBlueprint
): LessonPlanningIdeas {
  const shell = resolveTemplateShell(blueprint, {
    lessonSegmentsCount: 8,
    timingCount: 8,
    teacherMovesCount: 5,
    promptStyleCount: 5,
    toneCount: 3,
  })

  const target = blueprint.content.target
  const vocabulary = blueprint.content.vocabulary
  const texts = blueprint.content.texts
  const practiceIdeas = blueprint.content.practiceIdeas
  const wordLists = blueprint.content.wordLists
  const standards = blueprint.content.standards

  return {
    slidePlans: shell.slideShell.map((shellLabel, index) => ({
      shellLabel,
      action: inferSlideAction(shellLabel),
      purpose: inferSlidePurpose(shellLabel, target.primary),
      notes: [
        `Timing: ${shell.timing[index] ?? "Flexible timing"}`,
        `Teacher move: ${shell.teacherMoves[index % shell.teacherMoves.length] ?? "teacher guidance"}`,
        `Prompt style: ${shell.promptStyle[index % shell.promptStyle.length] ?? "teacher prompt"}`,
      ].join(" | "),
    })),
    lessonPlanSections: buildLessonPlanSections(
      target.primary,
      standards,
      vocabulary,
      texts,
      practiceIdeas,
      wordLists
    ),
    formativeAssessmentIdeas: buildFormativeIdeas(
      target.primary,
      vocabulary,
      practiceIdeas,
      texts,
      wordLists
    ),
    centerIdeas: buildCenterIdeas(target.primary, practiceIdeas, texts, wordLists),
    smallGroupIdeas: buildSmallGroupIdeas(target.primary, vocabulary, texts, wordLists),
    interventionIdeas: buildInterventionIdeas(target.primary, vocabulary, texts, wordLists),
  }
}

function inferSlideAction(shellLabel: string): "reuse" | "adapt" | "create_new" {
  const lower = shellLabel.toLowerCase()

  if (lower.includes("opening") || lower.includes("objective") || lower.includes("closure")) {
    return "adapt"
  }

  if (lower.includes("formative") || lower.includes("check")) {
    return "create_new"
  }

  if (lower.includes("teach") || lower.includes("guided") || lower.includes("independent")) {
    return "adapt"
  }

  return "reuse"
}

function inferSlidePurpose(shellLabel: string, primaryTarget: string): string {
  const lower = shellLabel.toLowerCase()

  if (lower.includes("opening") || lower.includes("objective")) {
    return "Introduce the lesson goal and frame the learning."
  }

  if (lower.includes("teach")) {
    return primaryTarget === "phonics"
      ? "Model the target phonics pattern or decoding move."
      : "Model the key comprehension or content thinking."
  }

  if (lower.includes("guided")) {
    return "Support students through scaffolded practice with teacher prompting."
  }

  if (lower.includes("independent")) {
    return "Move students into independent application of the target skill."
  }

  if (lower.includes("center")) {
    return "Set up rotation or station expectations and task options."
  }

  if (lower.includes("closure")) {
    return "Wrap up the lesson and check understanding."
  }

  return "Carry the exemplar shell forward while swapping in curriculum-aligned content."
}

function buildLessonPlanSections(
  primaryTarget: string,
  standards: string[],
  vocabulary: string[],
  texts: string[],
  practiceIdeas: string[],
  wordLists: string[]
): LessonPlanSectionIdeas[] {
  return [
    {
      section: "teach",
      title: "Teach Plan Ideas",
      ideas: buildTeachIdeas(primaryTarget, standards, vocabulary, texts, wordLists),
    },
    {
      section: "guided_practice",
      title: "Guided Practice Plan Ideas",
      ideas: buildGuidedPracticeIdeas(primaryTarget, standards, practiceIdeas, texts, wordLists),
    },
    {
      section: "independent_practice",
      title: "Independent Practice Plan Ideas",
      ideas: buildIndependentPracticeIdeas(primaryTarget, practiceIdeas, texts, wordLists),
    },
    {
      section: "closure",
      title: "Closure Plan Ideas",
      ideas: buildClosureIdeas(primaryTarget, vocabulary, texts, wordLists),
    },
  ]
}

function buildTeachIdeas(
  primaryTarget: string,
  standards: string[],
  vocabulary: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  if (primaryTarget === "phonics") {
    return [
      {
        title: "Model the target pattern",
        description: `Explicitly model the phonics focus using words such as ${wordLists.slice(0, 4).join(", ")}.`,
        rationale: `Keeps the lesson anchored to curriculum examples and standard(s): ${standards.slice(0, 2).join(", ")}.`,
      },
      {
        title: "Teach key phonics language",
        description: `Introduce or revisit language such as ${vocabulary.slice(0, 3).join(", ")} before practice begins.`,
        rationale: "Supports students in naming and explaining what they are learning.",
      },
    ]
  }

  return [
    {
      title: "Model thinking with text",
      description: `Use ${texts.slice(0, 1).join(", ")} to model the target thinking and connect to ${standards.slice(0, 2).join(", ")}.`,
      rationale: "Turns curriculum text into the centerpiece of the teach phase.",
    },
    {
      title: "Preteach key vocabulary",
      description: `Frontload vocabulary such as ${vocabulary.slice(0, 3).join(", ")} before guided discussion.`,
      rationale: "Improves access to the text and task before independent work.",
    },
  ]
}

function buildGuidedPracticeIdeas(
  primaryTarget: string,
  standards: string[],
  practiceIdeas: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  if (primaryTarget === "phonics") {
    return [
      {
        title: "Guided word practice",
        description: `Use structured support while students practice with ${wordLists.slice(0, 4).join(", ")}.`,
        rationale: `Bridges teacher modeling into student practice while staying aligned to ${standards.slice(0, 2).join(", ")}.`,
      },
      {
        title: "Supported phonics task",
        description: `Guide students through curriculum tasks such as ${practiceIdeas.slice(0, 2).join(", ")}.`,
        rationale: "Keeps guided practice grounded in actual curriculum routines instead of generic drill.",
      },
    ]
  }

  return [
    {
      title: "Guided text discussion",
      description: `Use ${texts.slice(0, 1).join(", ")} and scaffolded prompts tied to ${practiceIdeas.slice(0, 2).join(", ")}.`,
      rationale: "Supports students before they are expected to respond independently.",
    },
    {
      title: "Standards-aligned support",
      description: `Keep teacher prompting tied explicitly to ${standards.slice(0, 2).join(", ")} during guided work.`,
      rationale: "Prevents guided practice from drifting away from the core lesson goal.",
    },
  ]
}

function buildIndependentPracticeIdeas(
  primaryTarget: string,
  practiceIdeas: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  if (primaryTarget === "phonics") {
    return [
      {
        title: "Independent phonics application",
        description: `Students complete practice such as ${practiceIdeas.slice(0, 2).join(", ")} using ${wordLists.slice(0, 4).join(", ")}.`,
        rationale: "Moves students from supported decoding to independent application.",
      },
      {
        title: "Transfer check",
        description: "Ask students to apply the pattern in reading, sorting, or writing without immediate teacher support.",
        rationale: "Shows whether the skill transfers beyond the modeled examples.",
      },
    ]
  }

  return [
    {
      title: "Independent text response",
      description: `Students complete a response task tied to ${texts.slice(0, 1).join(", ")} using ${practiceIdeas.slice(0, 2).join(", ")}.`,
      rationale: "Creates a direct bridge from guided discussion to student-owned work.",
    },
    {
      title: "Reasoning and evidence application",
      description: "Require students to show understanding through a written, oral, or partner-based response.",
      rationale: "Checks whether students can independently apply the comprehension focus.",
    },
  ]
}

function buildClosureIdeas(
  primaryTarget: string,
  vocabulary: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  if (primaryTarget === "phonics") {
    return [
      {
        title: "Review the target pattern",
        description: `Revisit a short set of words such as ${wordLists.slice(0, 3).join(", ")} and restate the lesson focus.`,
        rationale: "Ends the lesson by reinforcing the exact target students practiced.",
      },
    ]
  }

  return [
    {
      title: "Summarize the key understanding",
      description: `Use ${texts.slice(0, 1).join(", ")} to prompt a final recap with vocabulary such as ${vocabulary.slice(0, 3).join(", ")}.`,
      rationale: "Closes the lesson by reconnecting students to the text and main objective.",
    },
  ]
}

function buildFormativeIdeas(
  primaryTarget: string,
  vocabulary: string[],
  practiceIdeas: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  if (primaryTarget === "phonics") {
    return [
      {
        title: "Mid-lesson decoding check",
        description: `Ask students to read or sort a short set of target words such as ${wordLists.slice(0, 3).join(", ")}.`,
        rationale: "Provides a quick understanding check before releasing students to fuller practice.",
      },
      {
        title: "Pattern explanation prompt",
        description: `Have students explain the sound or pattern using vocabulary like ${vocabulary.slice(0, 3).join(", ")}.`,
        rationale: "Checks whether students can verbalize the target concept, not just perform it.",
      },
    ]
  }

  return [
    {
      title: "Turn-and-talk comprehension check",
      description: `Pause after modeled reading and ask students to answer a short prompt tied to ${texts.slice(0, 1).join(", ")}.`,
      rationale: "Checks understanding before independent response work begins.",
    },
    {
      title: "Evidence-based response check",
      description: `Use a brief prompt connected to ${practiceIdeas.slice(0, 2).join(", ")} and require students to cite evidence or reasoning.`,
      rationale: "Creates a fast formative checkpoint aligned to the lesson objective.",
    },
  ]
}

function buildCenterIdeas(
  primaryTarget: string,
  practiceIdeas: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  if (primaryTarget === "phonics") {
    return [
      {
        title: "Word work center",
        description: `Students sort, read, or build target words such as ${wordLists.slice(0, 4).join(", ")}.`,
        rationale: "Keeps students practicing the target pattern with hands-on repetition.",
      },
      {
        title: "Partner decoding center",
        description: "Students read words or short decodable phrases and coach each other using the modeled routine.",
        rationale: "Extends modeled phonics work into supported peer practice.",
      },
    ]
  }

  return [
    {
      title: "Reading response center",
      description: `Students respond to a prompt tied to ${texts.slice(0, 1).join(", ")}.`,
      rationale: "Extends comprehension thinking into independent written or oral response.",
    },
    {
      title: "Partner discussion center",
      description: `Students discuss prompts based on ${practiceIdeas.slice(0, 2).join(", ")}.`,
      rationale: "Supports oral rehearsal before independent written work or closure.",
    },
  ]
}

function buildSmallGroupIdeas(
  primaryTarget: string,
  vocabulary: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  if (primaryTarget === "phonics") {
    return [
      {
        title: "Targeted pattern reteach group",
        description: `Pull a small group to reteach and practice with ${wordLists.slice(0, 3).join(", ")}.`,
        rationale: "Supports students who need more explicit modeling and guided rehearsal.",
      },
      {
        title: "Advanced transfer group",
        description: "Challenge students to apply the target pattern in reading and writing beyond the modeled examples.",
        rationale: "Provides extension without changing the core lesson focus.",
      },
    ]
  }

  return [
    {
      title: "Supported text discussion group",
      description: `Reread and discuss ${texts.slice(0, 1).join(", ")} with added prompts and vocabulary support.`,
      rationale: "Helps students who need more teacher-supported meaning making.",
    },
    {
      title: "Response extension group",
      description: `Use vocabulary like ${vocabulary.slice(0, 3).join(", ")} to strengthen oral or written responses.`,
      rationale: "Builds richer explanation and reasoning during small-group support.",
    },
  ]
}

function buildInterventionIdeas(
  primaryTarget: string,
  vocabulary: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  if (primaryTarget === "phonics") {
    return [
      {
        title: "Immediate phonics reteach",
        description: `Reteach with a reduced set of examples such as ${wordLists.slice(0, 3).join(", ")}.`,
        rationale: "Makes the skill more manageable for students who are not yet secure.",
      },
    ]
  }

  return [
    {
      title: "Guided comprehension support",
      description: `Use a shortened text chunk from ${texts.slice(0, 1).join(", ")} and revisit vocabulary such as ${vocabulary.slice(0, 3).join(", ")}.`,
      rationale: "Reduces complexity while preserving the lesson objective.",
    },
  ]
}
