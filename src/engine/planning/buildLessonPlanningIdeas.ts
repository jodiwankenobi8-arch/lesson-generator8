import { LessonBlueprint, LessonPlanningIdeas, LessonPlanIdea } from "../types"
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
    formativeAssessmentIdeas: buildFormativeIdeas(target.primary, vocabulary, practiceIdeas, texts, wordLists),
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
