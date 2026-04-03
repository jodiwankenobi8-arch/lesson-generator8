import { describe, expect, it } from "vitest"
import { buildLessonSpec } from "./spec/buildLessonSpec"
import { LessonBlueprint, LessonPlanningIdeas } from "./types"

function makeBlueprint(overrides: Partial<LessonBlueprint> = {}): LessonBlueprint {
  return {
    content: {
      target: {
        primary: "phonics",
        secondary: null,
        isMixedTarget: false,
        recommendedMode: "single",
      },
      standards: ["RF.1.3"],
      vocabulary: ["long a", "silent e"],
      wordLists: ["cake", "game", "same", "late"],
      texts: ["Jake made a cake at the lake."],
      practiceIdeas: ["Read the word list aloud", "Write a sentence with a long a word"],
      coverage: {
        standards: ["RF.1.3"],
        vocabulary: ["long a", "silent e"],
        wordLists: ["cake", "game", "same", "late"],
        texts: ["Jake made a cake at the lake."],
        practiceIdeas: ["Read the word list aloud", "Write a sentence with a long a word"],
        instructionalTargets: ["Decode words with long a and silent e"],
        sightWords: [],
        foundationalSkills: ["long vowel patterns"],
        lessonSegments: ["Opening", "Teach", "Guided Practice", "Independent Practice", "Closure"],
      },
      ...overrides.content,
    },
    structure: {
      timing: ["5 min launch", "10 min model", "10 min practice", "5 min closure"],
      lessonSegments: ["Opening", "Teach", "Guided Practice", "Independent Practice", "Closure"],
      teacherMoves: ["Teacher model", "Guide blending"],
      promptStyle: ["Say the sound", "Read the word"],
      tone: ["clear instructional tone"],
      templateShell: {
        segmentOrder: ["Opening", "Teach", "Guided Practice", "Independent Practice", "Closure"],
        slideShell: ["Objective / Opening", "Model / Teach", "Guided Practice", "Independent Practice", "Closure / Check"],
        timingShell: ["5 min launch", "10 min model", "10 min practice", "5 min closure"],
        teacherMoveShell: ["Teacher model", "Guide blending"],
        promptShell: ["Say the sound", "Read the word"],
        toneShell: ["clear instructional tone"],
      },
      ...overrides.structure,
    },
    sourceReadiness: {
      curriculumSupport: "strong",
      exemplarSupport: "strong",
      coverageSupport: "strong",
      overall: "balanced",
      selectedCurriculumMaterialIds: [],
      selectedExemplarMaterialIds: [],
      warnings: [],
      signals: [],
      ...overrides.sourceReadiness,
    },
  }
}

function makePlanningIdeas(overrides: Partial<LessonPlanningIdeas> = {}): LessonPlanningIdeas {
  return {
    slidePlans: [],
    lessonPlanSections: [
      {
        section: "teach",
        title: "Teach Plan Ideas",
        ideas: [
          {
            title: "Model the target pattern",
            description: "Explicitly model long a words.",
            rationale: "Keeps the lesson anchored to curriculum examples.",
          },
        ],
      },
      {
        section: "guided_practice",
        title: "Guided Practice Plan Ideas",
        ideas: [
          {
            title: "Guided word practice",
            description: "Use structured support with long a words.",
            rationale: "Bridges teacher modeling into student practice.",
          },
        ],
      },
      {
        section: "independent_practice",
        title: "Independent Practice Plan Ideas",
        ideas: [
          {
            title: "Independent phonics application",
            description: "Students apply the pattern independently.",
            rationale: "Moves students toward transfer.",
          },
        ],
      },
      {
        section: "closure",
        title: "Closure Plan Ideas",
        ideas: [
          {
            title: "Review the target pattern",
            description: "Revisit the strongest long a examples.",
            rationale: "Reinforces the target practiced.",
          },
        ],
      },
    ],
    formativeAssessmentIdeas: [
      {
        title: "Mid-lesson decoding check",
        description: "Ask students to read a short set of target words.",
        rationale: "Provides a quick understanding check.",
      },
      {
        title: "Pattern explanation prompt",
        description: "Have students explain the sound or pattern.",
        rationale: "Checks whether students can verbalize the concept.",
      },
    ],
    centerIdeas: [
      {
        title: "Word work center",
        description: "Students sort and read target words.",
        rationale: "Keeps students practicing the pattern.",
      },
    ],
    smallGroupIdeas: [
      {
        title: "Targeted pattern reteach group",
        description: "Pull a small group for reteach.",
        rationale: "Supports students needing more explicit modeling.",
      },
    ],
    interventionIdeas: [
      {
        title: "Immediate phonics reteach",
        description: "Reteach with a reduced set of examples.",
        rationale: "Makes the skill more manageable.",
      },
    ],
    componentCoverage: [],
    missingAreaPrompts: [],
    ...overrides,
  }
}

describe("buildLessonSpec", () => {
  it("keeps missing-area decision prompts out of the teacher package sections", () => {
    const spec = buildLessonSpec(
      makeBlueprint(),
      makePlanningIdeas({
        missingAreaPrompts: [
          {
            component: "guided_practice",
            importance: "high",
            prompt: "Add a scaffolded guided-practice block?",
            rationale: "Guided practice is a core lesson component.",
          },
          {
            component: "independent_practice",
            importance: "high",
            prompt: "Add an independent application task?",
            rationale: "Independent practice is important for transfer.",
          },
          {
            component: "closure",
            importance: "medium",
            prompt: "Add a short recap or exit check?",
            rationale: "Closure is instructionally meaningful.",
          },
          {
            component: "formative_assessment",
            importance: "high",
            prompt: "Add a quick understanding check?",
            rationale: "A formative check helps the lesson stay trustworthy.",
          },
          {
            component: "centers",
            importance: "medium",
            prompt: "Add targeted centers or rotation work?",
            rationale: "Centers can support downstream practice.",
          },
          {
            component: "small_group",
            importance: "medium",
            prompt: "Add a clear small-group support plan?",
            rationale: "Small-group follow-through supports reteach.",
          },
          {
            component: "intervention",
            importance: "medium",
            prompt: "Add a clear intervention or reteach plan?",
            rationale: "Intervention keeps support targeted.",
          },
        ],
      })
    )

    expect(spec.guidedPractice.steps.join(" ")).not.toContain(
      "High-priority decision: Add a scaffolded guided-practice block?"
    )
    expect(spec.independentPractice.steps.join(" ")).not.toContain(
      "High-priority decision: Add an independent application task?"
    )
    expect(spec.closure.steps.join(" ")).not.toContain(
      "Decision: Add a short recap or exit check?"
    )
    expect(spec.closure.steps.join(" ")).not.toContain(
      "High-priority decision: Add a quick understanding check?"
    )
    expect(spec.centers.steps.join(" ")).not.toContain(
      "Decision: Add targeted centers or rotation work?"
    )
    expect(spec.centers.steps.join(" ")).not.toContain(
      "Decision: Add a clear small-group support plan?"
    )
    expect(spec.centers.steps.join(" ")).not.toContain(
      "Decision: Add a clear intervention or reteach plan?"
    )
  })

  it("builds a multi-area full lesson spec with explicit lesson-portion language", () => {
    const spec = buildLessonSpec(
      makeBlueprint({
        content: {
          target: {
            primary: "phonics",
            secondary: "comprehension",
            isMixedTarget: true,
            recommendedMode: "full",
          },
          standards: ["RF.1.3", "RL.1.1"],
          vocabulary: ["long a", "evidence"],
          wordLists: ["cake", "game"],
          texts: ["Jake made a cake at the lake."],
          practiceIdeas: ["Read the word list aloud", "Answer a text question"],
          coverage: {
            standards: ["RF.1.3", "RL.1.1"],
            vocabulary: ["long a", "evidence"],
            wordLists: ["cake", "game"],
            texts: ["Jake made a cake at the lake."],
            practiceIdeas: ["Read the word list aloud", "Answer a text question"],
            instructionalTargets: ["Decode long a words", "Connect decoding to meaning"],
            sightWords: [],
            foundationalSkills: ["long vowel patterns"],
            lessonSegments: ["Part 1", "Part 2", "Closure"],
          },
        },
        structure: {
          timing: ["Part 1 - 10 min", "Part 2 - 10 min", "Closure - 5 min"],
          lessonSegments: ["Part 1", "Part 2", "Closure"],
          teacherMoves: ["Teacher model"],
          promptStyle: ["Teacher prompt"],
          tone: ["clear instructional tone"],
          templateShell: {
            segmentOrder: ["Part 1", "Part 2", "Closure"],
            slideShell: ["Part 1", "Part 2", "Closure / Check"],
            timingShell: ["Part 1 - 10 min", "Part 2 - 10 min", "Closure - 5 min"],
            teacherMoveShell: ["Teacher model"],
            promptShell: ["Teacher prompt"],
            toneShell: ["clear instructional tone"],
          },
        },
      }),
      makePlanningIdeas()
    )

    expect(spec.teach.steps.join(" ")).toContain(
      "Lesson Portion 1 (foundational skill) - Teach"
    )
    expect(spec.teach.steps.join(" ")).toContain(
      "Lesson Portion 2 (comprehension) - Teach"
    )
    expect(spec.guidedPractice.steps.join(" ")).toContain(
      "Lesson Portion 1 (foundational skill) - Guided Practice"
    )
    expect(spec.independentPractice.steps.join(" ")).toContain(
      "Lesson Portion 2 (comprehension) - Independent Practice"
    )
    expect(spec.closure.steps.join(" ")).toContain(
      "Close the lesson by reconnecting what students learned across the resolved lesson portions."
    )
  })

  it("keeps the opening distinct from the objective framing", () => {
    const spec = buildLessonSpec(makeBlueprint(), makePlanningIdeas())

    expect(spec.teach.steps.join(" ")).toContain(
      "Share the objective here if helpful, but treat the opening as the lesson start rather than the objective itself."
    )
  })

  it("uses dominant area keys before legacy target labels", () => {
    const spec = buildLessonSpec(
      makeBlueprint({
        content: {
          target: {
            primary: "general",
            secondary: null,
            isMixedTarget: false,
            recommendedMode: "single",
          },
          profile: {
            dominantAreaKeys: ["phonics"],
          },
        },
      } as unknown as Partial<LessonBlueprint>),
      makePlanningIdeas()
    )

    expect(spec.teach.steps.join(" ")).toContain(
      "Model the foundational-skill focus with these curriculum examples"
    )
    expect(spec.guidedPractice.steps.join(" ")).toContain(
      "Guide practice with these curriculum-aligned foundational-skill tasks"
    )
    expect(spec.closure.steps.join(" ")).toContain(
      "Review the target foundational skill or pattern."
    )
  })

  it("keeps foundational-skill lesson language for foundational lessons", () => {
    const spec = buildLessonSpec(makeBlueprint(), makePlanningIdeas())

    expect(spec.teach.steps.join(" ")).toContain(
      "Model the foundational-skill focus with these curriculum examples"
    )
    expect(spec.guidedPractice.steps.join(" ")).toContain(
      "Guide practice with these curriculum-aligned foundational-skill tasks"
    )
    expect(spec.independentPractice.steps.join(" ")).toContain(
      "Students complete independent foundational-skill work using"
    )
    expect(spec.closure.steps.join(" ")).toContain(
      "Review the target foundational skill or pattern."
    )
  })
})