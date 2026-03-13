import { describe, expect, it } from "vitest"
import { buildPackageOutputs } from "./package/buildPackageOutputs"
import { LessonBlueprint, LessonPlanningIdeas, LessonSpec } from "./types"

const blueprint: LessonBlueprint = {
  content: {
    target: {
      primary: "phonics",
      secondary: null,
      isMixedTarget: false,
      recommendedMode: "full",
    },
    standards: ["RF.1.3"],
    vocabulary: ["long a"],
    wordLists: ["cake, game, same, late"],
    texts: ["Students read long a words in context."],
    practiceIdeas: ["Read the word list aloud."],
  },
  structure: {
    timing: ["5 min launch", "10 min model", "10 min practice"],
    lessonSegments: ["Opening", "Teach", "Practice", "Closure"],
    teacherMoves: ["Model blending", "Guide student response"],
    promptStyle: ["Call and response"],
    tone: ["explicit", "supportive"],
    templateShell: {
      segmentOrder: ["Opening", "Teach", "Practice", "Closure"],
      slideShell: ["Opening", "Teach", "Practice", "Closure"],
      timingShell: ["5 min launch", "10 min model", "10 min practice"],
      teacherMoveShell: ["Model blending", "Guide student response"],
      promptShell: ["Call and response"],
      toneShell: ["explicit", "supportive"],
    },
  },
  sourceReadiness: {
    curriculumSupport: "strong",
    exemplarSupport: "strong",
    overall: "balanced",
    warnings: ["Minor warning for visibility."],
    signals: [
      {
        label: "Content Source Fit",
        value: "Grounded",
        note: "Curriculum and exemplar are both present.",
        tone: "good",
      },
    ],
  },
}

const spec: LessonSpec = {
  teach: {
    title: "Teach",
    steps: ["Model long a decoding.", "Blend target words."],
  },
  guidedPractice: {
    title: "Guided Practice",
    steps: ["Read words together.", "Prompt students to explain."],
  },
  independentPractice: {
    title: "Independent Practice",
    steps: ["Students read a short list independently."],
  },
  centers: {
    title: "Centers",
    steps: ["Word sort center", "Partner reading center"],
  },
  closure: {
    title: "Closure",
    steps: ["Review the target skill."],
  },
}

const planningIdeas: LessonPlanningIdeas = {
  slidePlans: [
    {
      shellLabel: "Opening",
      action: "adapt",
      purpose: "Launch the lesson",
      notes: "Use exemplar pacing",
    },
  ],
  lessonPlanSections: [
    {
      section: "teach",
      title: "Teaching Moves",
      ideas: [
        {
          title: "Model and mark vowels",
          description: "Underline the vowel team before blending.",
          rationale: "Makes the sound-spelling pattern visible.",
        },
      ],
    },
  ],
  formativeAssessmentIdeas: [
    {
      title: "Quick Check",
      description: "Listen to each student read one target word.",
      rationale: "Checks immediate transfer.",
    },
  ],
  centerIdeas: [
    {
      title: "Word Sort",
      description: "Sort long a and short a words.",
      rationale: "Reinforces discrimination.",
    },
  ],
  smallGroupIdeas: [
    {
      title: "Targeted Blending",
      description: "Reteach blending with a reduced list.",
      rationale: "Supports students needing more modeling.",
    },
  ],
  interventionIdeas: [
    {
      title: "Phonics Reteach",
      description: "Practice decoding with teacher support.",
      rationale: "Builds confidence and accuracy.",
    },
  ],
}

describe("buildPackageOutputs", () => {
  it("builds package outputs using planning ideas when available", () => {
    const result = buildPackageOutputs({
      inputs: {
        grade: "1",
        subject: "ELA",
        standard: "RF.1.3",
        skill: "Long A",
        topic: "Long a words",
        duration: "30 minutes",
      },
      blueprint,
      spec,
      planningIdeas,
    })

    expect(result.slides.length).toBeGreaterThan(0)
    expect(result.lessonPlan).toContain("Blueprint Readiness")
    expect(result.lessonPlan).toContain("Planning Notes")
    expect(result.lessonPlan).toContain("Formative Assessment Ideas")
    expect(result.lessonPlan).toContain("Small Group Ideas")
    expect(result.lessonPlan).toContain("Intervention Ideas")
    expect(result.centers).toEqual(["Word Sort: Sort long a and short a words."])
    expect(result.rotationPlan).toContain("Rotation 1: Word Sort: Sort long a and short a words.")
    expect(result.rotationPlan).toContain("Teacher Table Focus: Targeted Blending - Reteach blending with a reduced list.")
    expect(result.interventions).toEqual(["Phonics Reteach: Practice decoding with teacher support."])
    expect(result.exports).toEqual([
      {
        kind: "slides",
        label: "Slides Export",
        fileName: "ELA-slides-export-placeholder",
        status: "placeholder",
      },
      {
        kind: "lesson_plan",
        label: "Lesson Plan Export",
        fileName: "ELA-lesson-plan-export-placeholder",
        status: "placeholder",
      },
      {
        kind: "printables",
        label: "Printables Export",
        fileName: "ELA-printables-export-placeholder",
        status: "placeholder",
      },
    ])
  })

  it("falls back to spec and target-based defaults when planning ideas are absent", () => {
    const result = buildPackageOutputs({
      inputs: {
        grade: "1",
        subject: "ELA",
        standard: "RF.1.3",
        skill: "Long A",
        topic: "Long a words",
        duration: "30 minutes",
      },
      blueprint,
      spec,
    })

    expect(result.centers).toEqual(["Word sort center", "Partner reading center"])
    expect(result.rotationPlan).toContain("Rotation 1: Word sort center")
    expect(result.rotationPlan).toContain("Teacher Table Focus: Targeted reteach or extension based on student need.")
    expect(result.interventions).toEqual([
      "Reteach the target phonics pattern with a reduced word set.",
      "Provide extra guided decoding and blending practice.",
    ])
    expect(result.lessonPlan).toContain("Source Balance: balanced")
    expect(result.lessonPlan).toContain("Minor warning for visibility.")
  })
})
