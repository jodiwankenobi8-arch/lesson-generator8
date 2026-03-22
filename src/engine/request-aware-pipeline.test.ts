import { describe, expect, it } from "vitest"
import { buildLessonPlanningIdeas } from "./planning/buildLessonPlanningIdeas"
import { buildPackageOutputs } from "./package/buildPackageOutputs"
import {
  LessonBlueprint,
  LessonPlanningIdeas,
  LessonSpec,
} from "./types"

function makeBlueprint(optionalSegments: string[] = []): LessonBlueprint {
  return {
    content: {
      target: {
        primary: "phonics",
        secondary: null,
        isMixedTarget: false,
        recommendedMode: "full",
      },
      standards: ["RF.1.3"],
      vocabulary: ["long a"],
      wordLists: ["cake", "game", "same", "late"],
      texts: ["Jake made a cake at the lake."],
      practiceIdeas: ["Read the word list aloud."],
      coverage: {
        standards: ["RF.1.3"],
        vocabulary: ["long a"],
        wordLists: ["cake", "game", "same", "late"],
        texts: ["Jake made a cake at the lake."],
        practiceIdeas: ["Read the word list aloud."],
        instructionalTargets: ["Decode long a words."],
        sightWords: [],
        foundationalSkills: ["silent e"],
        lessonSegments: [
          "Opening",
          "Teach",
          "Guided Practice",
          "Independent Practice",
          "Closure",
          ...optionalSegments,
        ],
      },
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
      warnings: [],
      signals: [],
    },
  }
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

describe("request-aware planning", () => {
  it("keeps optional planning components out when they are neither requested nor strongly grounded", () => {
    const result = buildLessonPlanningIdeas(makeBlueprint(), {
      requestedLessonParts: [],
      requestedOutputs: [],
    })

    expect(result.formativeAssessmentIdeas).toEqual([])
    expect(result.centerIdeas).toEqual([])
    expect(result.smallGroupIdeas).toEqual([])
    expect(result.interventionIdeas).toEqual([])
  })

  it("includes optional planning components when they are strongly grounded or explicitly requested", () => {
    const grounded = buildLessonPlanningIdeas(
      makeBlueprint([
        "Formative Check",
        "Exit Ticket",
        "Center Rotation",
        "Station Work",
        "Teacher Table",
        "Guided Group",
        "Intervention Block",
        "Reteach",
      ]),
      {
        requestedLessonParts: [],
        requestedOutputs: [],
      }
    )

    expect(grounded.formativeAssessmentIdeas.length).toBeGreaterThan(0)
    expect(grounded.centerIdeas.length).toBeGreaterThan(0)
    expect(grounded.smallGroupIdeas.length).toBeGreaterThan(0)
    expect(grounded.interventionIdeas.length).toBeGreaterThan(0)

    const requested = buildLessonPlanningIdeas(makeBlueprint(), {
      requestedLessonParts: ["small_group"],
      requestedOutputs: ["assessment", "centers", "intervention"],
    })

    expect(requested.formativeAssessmentIdeas.length).toBeGreaterThan(0)
    expect(requested.centerIdeas.length).toBeGreaterThan(0)
    expect(requested.smallGroupIdeas.length).toBeGreaterThan(0)
    expect(requested.interventionIdeas.length).toBeGreaterThan(0)
  })
})

describe("request-aware package outputs", () => {
  it("does not assemble optional package outputs by default", () => {
    const result = buildPackageOutputs({
      inputs: {
        grade: "1",
        subject: "ELA",
        standard: "RF.1.3",
        skill: "Long A",
        topic: "Long a words",
        duration: "30 minutes",
      },
      blueprint: makeBlueprint(),
      spec,
      planningIdeas,
      lessonRequest: {
        requestedLessonParts: [],
        requestedOutputs: [],
      },
    })

    expect(result.centers).toEqual([])
    expect(result.rotationPlan).toBe("")
    expect(result.interventions).toEqual([])
    expect(result.exports.map((artifact) => artifact.kind)).toEqual([
      "slides",
      "lesson_plan",
    ])
  })

  it("assembles optional package outputs when they are explicitly requested", () => {
    const result = buildPackageOutputs({
      inputs: {
        grade: "1",
        subject: "ELA",
        standard: "RF.1.3",
        skill: "Long A",
        topic: "Long a words",
        duration: "30 minutes",
      },
      blueprint: makeBlueprint(),
      spec,
      planningIdeas,
      lessonRequest: {
        requestedLessonParts: [],
        requestedOutputs: ["centers", "small_group", "intervention", "printables"],
      },
    })

    expect(result.centers).toEqual([
      "Word Sort: Sort long a and short a words.",
    ])
    expect(result.rotationPlan).toContain(
      "Teacher Table Focus: Targeted Blending - Reteach blending with a reduced list."
    )
    expect(result.interventions).toEqual([
      "Phonics Reteach: Practice decoding with teacher support.",
    ])
    expect(result.exports.map((artifact) => artifact.kind)).toEqual([
      "slides",
      "lesson_plan",
      "printables",
    ])
  })
})