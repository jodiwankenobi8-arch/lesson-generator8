import { LessonBlueprint, LessonPlanIdea, LessonPlanSectionIdeas, LessonPlanningIdeas } from "../types"
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
  const lessonSegments = blueprint.structure.lessonSegments

  return {
    slidePlans: shell.slideShell.map((shellLabel, index) => {
      const segmentLabel =
        lessonSegments[index] ??
        blueprint.structure.templateShell.segmentOrder[index] ??
        shellLabel

      return {
        shellLabel,
        action: inferSlideAction(shellLabel),
        purpose: inferSlidePurpose(segmentLabel, shellLabel, blueprint),
        notes: buildSlideNotes({
          index,
          shellLabel,
          segmentLabel,
          shell,
          blueprint,
        }),
      }
    }),
    lessonPlanSections: buildLessonPlanSections(
      blueprint,
      standards,
      vocabulary,
      texts,
      practiceIdeas,
      wordLists
    ),
    formativeAssessmentIdeas: buildFormativeIdeas(
      blueprint,
      vocabulary,
      practiceIdeas,
      texts,
      wordLists
    ),
    centerIdeas: buildCenterIdeas(blueprint, practiceIdeas, texts, wordLists),
    smallGroupIdeas: buildSmallGroupIdeas(blueprint, vocabulary, texts, wordLists),
    interventionIdeas: buildInterventionIdeas(blueprint, vocabulary, texts, wordLists),
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

function inferSlidePurpose(
  segmentLabel: string,
  shellLabel: string,
  blueprint: LessonBlueprint
): string {
  const target = blueprint.content.target
  const lowerSegment = segmentLabel.toLowerCase()
  const lowerShell = shellLabel.toLowerCase()

  if (lowerSegment.includes("opening") || lowerShell.includes("objective")) {
    return target.isMixedTarget
      ? "Introduce the combined lesson focus and preview both parts of the lesson."
      : "Introduce the lesson goal and frame the learning."
  }

  if (lowerSegment.includes("teach")) {
    return target.primary === "phonics"
      ? "Model the target phonics pattern or decoding move with curriculum-aligned examples."
      : "Model the key comprehension or content thinking with curriculum-aligned text."
  }

  if (lowerSegment.includes("guided")) {
    return "Support students through scaffolded practice using the exemplar’s structure and prompts."
  }

  if (lowerSegment.includes("independent")) {
    return "Move students into independent application of the target skill with curriculum-grounded tasks."
  }

  if (lowerSegment.includes("center")) {
    return "Set up center or rotation tasks that continue the lesson target with clear expectations."
  }

  if (lowerSegment.includes("closure")) {
    return target.isMixedTarget
      ? "Close the lesson by reconnecting both parts and checking what students retained."
      : "Wrap up the lesson and check understanding."
  }

  return "Carry the exemplar shell forward while swapping in curriculum-aligned content."
}

function buildSlideNotes(args: {
  index: number
  shellLabel: string
  segmentLabel: string
  shell: ReturnType<typeof resolveTemplateShell>
  blueprint: LessonBlueprint
}): string {
  const { index, shellLabel, segmentLabel, shell, blueprint } = args

  const timing = shell.timing[index] ?? "Flexible timing"
  const teacherMove = shell.teacherMoves[index % shell.teacherMoves.length] ?? "teacher guidance"
  const prompt = shell.promptStyle[index % shell.promptStyle.length] ?? "teacher prompt"
  const tone = shell.tone[index % shell.tone.length] ?? "clear instructional tone"
  const contentAnchor = selectSlideContentAnchor(segmentLabel, blueprint)

  return [
    `Segment: ${segmentLabel || shellLabel}`,
    `Timing: ${timing}`,
    `Teacher move: ${teacherMove}`,
    `Prompt style: ${prompt}`,
    `Content anchor: ${contentAnchor}`,
    `Tone: ${tone}`,
  ].join(" | ")
}

function selectSlideContentAnchor(
  segmentLabel: string,
  blueprint: LessonBlueprint
): string {
  const lower = segmentLabel.toLowerCase()
  const primaryTarget = blueprint.content.target.primary

  if (lower.includes("teach")) {
    return primaryTarget === "phonics"
      ? blueprint.content.wordLists.slice(0, 3).join(", ") || "target word examples"
      : blueprint.content.texts.slice(0, 1).join(", ") || "lesson text"
  }

  if (lower.includes("guided") || lower.includes("independent") || lower.includes("center")) {
    return blueprint.content.practiceIdeas.slice(0, 2).join(", ") || "curriculum practice task"
  }

  if (lower.includes("closure")) {
    return primaryTarget === "phonics"
      ? blueprint.content.wordLists.slice(0, 2).join(", ") || "target words"
      : blueprint.content.vocabulary.slice(0, 2).join(", ") || "key vocabulary"
  }

  return blueprint.content.standards.slice(0, 1).join(", ") || "lesson objective"
}

function buildLessonPlanSections(
  blueprint: LessonBlueprint,
  standards: string[],
  vocabulary: string[],
  texts: string[],
  practiceIdeas: string[],
  wordLists: string[]
): LessonPlanSectionIdeas[] {
  const target = blueprint.content.target

  return [
    {
      section: "teach",
      title: "Teach Plan Ideas",
      ideas: buildTeachIdeas(target, standards, vocabulary, texts, wordLists),
    },
    {
      section: "guided_practice",
      title: "Guided Practice Plan Ideas",
      ideas: buildGuidedPracticeIdeas(target, standards, practiceIdeas, texts, wordLists),
    },
    {
      section: "independent_practice",
      title: "Independent Practice Plan Ideas",
      ideas: buildIndependentPracticeIdeas(target, practiceIdeas, texts, wordLists),
    },
    {
      section: "closure",
      title: "Closure Plan Ideas",
      ideas: buildClosureIdeas(target, vocabulary, texts, wordLists),
    },
  ]
}

function buildTeachIdeas(
  target: LessonBlueprint["content"]["target"],
  standards: string[],
  vocabulary: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  if (target.isMixedTarget && target.recommendedMode === "full") {
    return [
      {
        title: "Teach Part 1 explicitly",
        description: `Open with the first lesson target and model it clearly using ${wordLists.slice(0, 3).join(", ") || texts.slice(0, 1).join(", ")}.`,
        rationale: "Mixed lessons work better when the first part is taught explicitly instead of blending everything together immediately.",
      },
      {
        title: "Bridge into Part 2 intentionally",
        description: `After the first model, transition into the second target using ${texts.slice(0, 1).join(", ") || vocabulary.slice(0, 3).join(", ")} so students feel the lesson connection.`,
        rationale: "Creates a true two-part lesson instead of a muddled mixed block.",
      },
    ]
  }

  if (target.primary === "phonics") {
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
  target: LessonBlueprint["content"]["target"],
  standards: string[],
  practiceIdeas: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  if (target.isMixedTarget && target.recommendedMode === "full") {
    return [
      {
        title: "Guide practice for Part 1 first",
        description: "Provide scaffolded support with the first target before asking students to integrate it with the second part of the lesson.",
        rationale: "Reduces overload in mixed lessons.",
      },
      {
        title: "Then connect both parts",
        description: `Use tasks such as ${practiceIdeas.slice(0, 2).join(", ")} to help students move from one target into the next.`,
        rationale: "Keeps the lesson coherent while still respecting both targets.",
      },
    ]
  }

  if (target.primary === "phonics") {
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
  target: LessonBlueprint["content"]["target"],
  practiceIdeas: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  if (target.isMixedTarget && target.recommendedMode === "full") {
    return [
      {
        title: "Independent Part 1 application",
        description: "Let students first apply the first target with manageable support and materials.",
        rationale: "Builds independence without collapsing both targets into one unclear task.",
      },
      {
        title: "Integrated final application",
        description: `Then ask students to complete a second task tied to ${practiceIdeas.slice(0, 2).join(", ")} that reflects the full lesson.`,
        rationale: "Allows the lesson to culminate in a fuller combined task once each part has been supported.",
      },
    ]
  }

  if (target.primary === "phonics") {
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
  target: LessonBlueprint["content"]["target"],
  vocabulary: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  if (target.isMixedTarget && target.recommendedMode === "full") {
    return [
      {
        title: "Reconnect both lesson parts",
        description: "Close by naming what students learned in each part of the lesson and how the two targets connected.",
        rationale: "Prevents mixed lessons from feeling like two unrelated mini-lessons.",
      },
    ]
  }

  if (target.primary === "phonics") {
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
  blueprint: LessonBlueprint,
  vocabulary: string[],
  practiceIdeas: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  const target = blueprint.content.target

  if (target.isMixedTarget && target.recommendedMode === "full") {
    return [
      {
        title: "Part 1 checkpoint",
        description: "Pause after the first lesson part and quickly check whether students can do the first target before moving on.",
        rationale: "Prevents the second lesson part from piling onto an unstable foundation.",
      },
      {
        title: "End-of-lesson integration check",
        description: `Use a short task tied to ${practiceIdeas.slice(0, 2).join(", ")} to see whether students can bring both targets together.`,
        rationale: "Shows whether the two-part lesson held together instructionally.",
      },
    ]
  }

  if (target.primary === "phonics") {
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
  blueprint: LessonBlueprint,
  practiceIdeas: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  const target = blueprint.content.target

  if (target.isMixedTarget && target.recommendedMode === "full") {
    return [
      {
        title: "Part 1 practice center",
        description: "Create one center that isolates the first lesson target for repeated supported practice.",
        rationale: "Keeps center work focused instead of overloading students with both targets at once.",
      },
      {
        title: "Part 2 application center",
        description: `Create a second center tied to ${texts.slice(0, 1).join(", ") || practiceIdeas.slice(0, 2).join(", ")} for applying the second target.`,
        rationale: "Preserves the two-part lesson structure during rotation work.",
      },
    ]
  }

  if (target.primary === "phonics") {
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
  blueprint: LessonBlueprint,
  vocabulary: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  const target = blueprint.content.target

  if (target.isMixedTarget && target.recommendedMode === "full") {
    return [
      {
        title: "Part-specific reteach group",
        description: "Pull students for reteach on whichever lesson part broke down first rather than reteaching the entire lesson at once.",
        rationale: "Makes mixed-lesson support more precise and manageable.",
      },
      {
        title: "Part-integration extension group",
        description: "Meet with students who are ready to connect both targets in a more complex way.",
        rationale: "Provides extension without making the whole class lesson more complicated.",
      },
    ]
  }

  if (target.primary === "phonics") {
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
  blueprint: LessonBlueprint,
  vocabulary: string[],
  texts: string[],
  wordLists: string[]
): LessonPlanIdea[] {
  const target = blueprint.content.target

  if (target.isMixedTarget && target.recommendedMode === "full") {
    return [
      {
        title: "Intervene on the first broken step",
        description: "Identify which part of the two-part lesson caused difficulty first and intervene there before reteaching everything.",
        rationale: "Makes mixed-lesson intervention cleaner and more targeted.",
      },
    ]
  }

  if (target.primary === "phonics") {
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
