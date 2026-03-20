import { describe, expect, it } from "vitest"
import { buildPackageOutputs } from "./package/buildPackageOutputs"
import {
  LessonBlueprint,
  LessonPlanningIdeas,
  LessonSpec,
  MissingAreaDecisionChoice,
  PlanningComponentKey,
} from "./types"

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
    coverageSupport: "strong",
    overall: "balanced",
    selectedCurriculumMaterialIds: [],
    selectedExemplarMaterialIds: [],
    warnings: ["Minor warning for visibility."],
    signals: [],
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
  slidePlans: [],
  lessonPlanSections: [],
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

function makeDecisionMap(
  overrides: Partial<Record<PlanningComponentKey, MissingAreaDecisionChoice>>
): Partial<Record<PlanningComponentKey, MissingAreaDecisionChoice>> {
  return overrides
}

describe("buildPackageOutputs decision handling", () => {
  it("leaves out centers, small group, and intervention when teacher chooses leave_out", () => {
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
      missingAreaDecisions: makeDecisionMap({
        centers: "leave_out",
        small_group: "leave_out",
        intervention: "leave_out",
      }),
    })

    expect(result.centers).toEqual([])
    expect(result.rotationPlan).toBe("")
    expect(result.lessonPlan).not.toContain("Teacher-Led Support")
    expect(result.lessonPlan).not.toContain("Intervention Support")
    expect(result.interventions).toEqual([])
  })

  it("adds grounded fallback support when teacher chooses add and planning ideas are absent", () => {
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
      planningIdeas: {
        slidePlans: [],
        lessonPlanSections: [],
        formativeAssessmentIdeas: [],
        centerIdeas: [],
        smallGroupIdeas: [],
        interventionIdeas: [],
      },
      missingAreaDecisions: makeDecisionMap({
        centers: "add",
        small_group: "add",
        intervention: "add",
      }),
    })

    expect(result.centers).toEqual([
      "Word sort center: Sort, read, and revisit cake, game, same, late.",
      "Partner reading center: Use this practice: Read the word list aloud.",
      "Teacher support center: Reteach the target phonics pattern with cake, game, same, late.",
    ])
    expect(result.rotationPlan).toContain(
      "Teacher Table Focus: Add a targeted phonics reteach using cake, game, same, late and guide students through this practice: Read the word list aloud."
    )
    expect(result.lessonPlan).toContain("Teacher-Led Support")
    expect(result.lessonPlan).toContain(
      "Teacher Table Support: Add a targeted phonics reteach using cake, game, same, late and guide students through this practice: Read the word list aloud."
    )
    expect(result.lessonPlan).toContain("Intervention Support")
    expect(result.lessonPlan).toContain(
      "Add a targeted intervention block using cake, game, same, late."
    )
    expect(result.lessonPlan).toContain(
      "Use Read the word list aloud for extra guided decoding and blending practice."
    )
    expect(result.interventions).toEqual([
      "Add a targeted intervention block using cake, game, same, late.",
      "Use Read the word list aloud for extra guided decoding and blending practice.",
    ])
  })

  it("prefers planning ideas over add-fallbacks when real planning support exists", () => {
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
      missingAreaDecisions: makeDecisionMap({
        centers: "add",
        small_group: "add",
        intervention: "add",
      }),
    })

    expect(result.centers).toEqual(["Word Sort: Sort long a and short a words."])
    expect(result.rotationPlan).toContain(
      "Teacher Table Focus: Targeted Blending - Reteach blending with a reduced list."
    )
    expect(result.lessonPlan).toContain(
      "Targeted Blending: Reteach blending with a reduced list."
    )
    expect(result.lessonPlan).toContain(
      "Phonics Reteach: Practice decoding with teacher support."
    )
    expect(result.interventions).toEqual([
      "Phonics Reteach: Practice decoding with teacher support.",
    ])
  })
})