import { describe, expect, it } from "vitest"
import { buildPackageOutputs } from "./package/buildPackageOutputs"
import {
  createDefaultOutputContents,
  normalizeOutputContents,
  LessonBlueprint,
  LessonOutputContents,
  LessonPlanningIdeas,
  LessonSpec,
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

function makeOutputContents(options: {
  assessment?: boolean
  centers?: boolean
  smallGroup?: boolean
  intervention?: boolean
  printables?: boolean
} = {}): LessonOutputContents {
  const outputContents = createDefaultOutputContents()

  outputContents.assessments.types.formative_assessment = Boolean(options.assessment)
  outputContents.groups.byTier.T1.centers = Boolean(options.centers)
  outputContents.groups.byTier.T2.small_group = Boolean(options.smallGroup)
  outputContents.groups.byTier.T3.intervention = Boolean(options.intervention)
  outputContents.other.printables = Boolean(options.printables)

  return normalizeOutputContents(outputContents)
}

function makePlanningIdeas(options: {
  assessment?: boolean
  centers?: boolean
  smallGroup?: boolean
  intervention?: boolean
  missingAreaPrompts?: LessonPlanningIdeas["missingAreaPrompts"]
} = {}): LessonPlanningIdeas {
  return {
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
    formativeAssessmentIdeas: options.assessment
      ? [
          {
            title: "Quick Check",
            description: "Listen to each student read one target word.",
            rationale: "Checks immediate transfer.",
          },
        ]
      : [],
    centerIdeas: options.centers
      ? [
          {
            title: "Word Sort",
            description: "Sort long a and short a words.",
            rationale: "Reinforces discrimination.",
          },
        ]
      : [],
    smallGroupIdeas: options.smallGroup
      ? [
          {
            title: "Targeted Blending",
            description: "Reteach blending with a reduced list.",
            rationale: "Supports students needing more modeling.",
          },
        ]
      : [],
    interventionIdeas: options.intervention
      ? [
          {
            title: "Phonics Reteach",
            description: "Practice decoding with teacher support.",
            rationale: "Builds confidence and accuracy.",
          },
        ]
      : [],
    missingAreaPrompts: options.missingAreaPrompts ?? [],
  }
}

describe("buildPackageOutputs", () => {
  it("builds package outputs using outputContents-selected planning ideas when available", () => {
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
      planningIdeas: makePlanningIdeas({
        assessment: true,
        centers: true,
        smallGroup: true,
        intervention: true,
      }),
      outputContents: makeOutputContents({
        assessment: true,
        centers: true,
        smallGroup: true,
        intervention: true,
        printables: true,
      }),
    })

    expect(result.slides.length).toBeGreaterThan(0)
    expect(result.lessonPlan).toContain("Blueprint Readiness")
    expect(result.lessonPlan).toContain("Planning Notes")
    expect(result.lessonPlan).toContain("Centers")
    expect(result.lessonPlan).toContain("Formative Assessment Ideas")
    expect(result.lessonPlan).toContain("Teacher-Led Support")
    expect(result.lessonPlan).toContain("Intervention Support")
    expect(result.centers).toEqual(["Word Sort: Sort long a and short a words."])
    expect(result.rotationPlan).toContain("Rotation 1: Word Sort: Sort long a and short a words.")
    expect(result.rotationPlan).toContain(
      "Teacher-Led Support Focus: Targeted Blending - Reteach blending with a reduced list."
    )
    expect(result.interventions).toEqual([
      "Phonics Reteach: Practice decoding with teacher support.",
    ])
    expect(result.exports).toEqual([
      {
        kind: "full_package",
        label: "Full Lesson Package",
        format: "zip",
        fileName: "ELA-full-lesson-package.zip",
        mimeType: "application/zip",
        content: expect.stringContaining("Blueprint Readiness"),
      },
      {
        kind: "slides",
        label: "Slides Export",
        fileName: "ELA-slides-export.pptx",
        format: "pptx",
        mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        content: expect.stringContaining("Slides Export"),
      },
      {
        kind: "lesson_plan",
        label: "Lesson Plan Export",
        format: "docx",
        fileName: "ELA-lesson-plan-export.docx",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        content: expect.stringContaining("Blueprint Readiness"),
      },
      {
        kind: "printables",
        label: "Printables Export",
        fileName: "ELA-printables-export.pdf",
        format: "pdf",
        mimeType: "application/pdf",
        content: expect.stringContaining("Centers"),
      },
    ])
  })

  it("omits unselected optional group sections from the lesson plan narrative", () => {
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
      planningIdeas: makePlanningIdeas({ assessment: true }),
      outputContents: makeOutputContents({ assessment: true }),
    })

    expect(result.lessonPlan).toContain("Formative Assessment Ideas")
    expect(result.lessonPlan).not.toContain("Rotation Focus:")
    expect(result.lessonPlan).not.toContain("Teacher-Led Support")
    expect(result.lessonPlan).not.toContain("Intervention Support")
    expect(result.lessonPlan).not.toContain("Small Group Support:")
    expect(result.lessonPlan).not.toContain("Intervention Focus:")
    expect(result.centers).toEqual([])
    expect(result.rotationPlan).toBe("")
    expect(result.interventions).toEqual([])
    expect(result.exports.map((artifact) => artifact.kind)).toEqual(["full_package", "slides", "lesson_plan"])
    expect(result.exports[1].content).not.toContain("Rotation Focus:")
    expect(result.exports[1].content).not.toContain("Teacher-Led Support")
    expect(result.exports[1].content).not.toContain("Intervention Support")
  })

  it("falls back to grounded target-based defaults when planning ideas are absent", () => {
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
      outputContents: makeOutputContents({
        centers: true,
        smallGroup: true,
        intervention: true,
        printables: true,
      }),
    })

    expect(result.centers).toEqual([
      "Word sort center: Sort, read, and revisit cake, game, same, late.",
      "Partner reading center: Use this practice: Read the word list aloud.",
      "Independent practice center: Reinforce the target phonics pattern with cake, game, same, late during independent review.",
    ])
    expect(result.rotationPlan).toContain(
      "Rotation 1: Word sort center: Sort, read, and revisit cake, game, same, late."
    )
    expect(result.rotationPlan).toContain(
      "Teacher-Led Support Focus: Reteach the target phonics pattern with cake, game, same, late and guide students through this practice: Read the word list aloud."
    )
    expect(result.interventions).toEqual([
      "Reteach the target phonics pattern with cake, game, same, late.",
      "Provide extra guided decoding and blending practice with Read the word list aloud.",
    ])
    expect(result.lessonPlan).toContain("Source Balance: balanced")
    expect(result.lessonPlan).toContain("Minor warning for visibility.")
  })

  it("keeps export support labels aligned without forcing results-page center wording", () => {
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
      planningIdeas: makePlanningIdeas({
        assessment: true,
        centers: true,
        smallGroup: true,
        intervention: true,
      }),
      outputContents: makeOutputContents({
        assessment: true,
        centers: true,
        smallGroup: true,
        intervention: true,
        printables: true,
      }),
    })

    expect(result.lessonPlan).toContain("Centers")
    expect(result.lessonPlan).toContain("Teacher-Led Support")
    expect(result.lessonPlan).toContain("Intervention Support")
    expect(result.lessonPlan).not.toContain("Small Group Ideas")
    expect(result.lessonPlan).not.toContain("Intervention Ideas")

    const printablesExport = result.exports.find((artifact) => artifact.kind === "printables")
    expect(printablesExport).toBeDefined()
    expect(printablesExport!.content).toContain("Centers")
    expect(printablesExport!.content).toContain("Rotation Plan")
    expect(printablesExport!.content).toContain("Intervention Support")
    expect(printablesExport!.content).not.toContain("\nInterventions\n")
  })

  it("does not let printables alone unlock optional centers or teacher-led support lanes", () => {
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
      planningIdeas: makePlanningIdeas(),
      outputContents: makeOutputContents({ printables: true }),
    })

    expect(result.lessonPlan).not.toContain("Centers")
    expect(result.lessonPlan).not.toContain("Teacher-Led Support")
    expect(result.lessonPlan).not.toContain("Intervention Support")
    expect(result.centers).toEqual([])
    expect(result.rotationPlan).toBe("")
    expect(result.interventions).toEqual([])
    expect(result.exports.map((artifact) => artifact.kind)).toEqual([
      "full_package",
      "slides",
      "lesson_plan",
      "printables",
    ])

    const printablesExport = result.exports.find((artifact) => artifact.kind === "printables")
    expect(printablesExport).toBeDefined()
    expect(printablesExport!.content).toContain("Centers")
    expect(printablesExport!.content).toContain("- No student centers defined.")
    expect(printablesExport!.content).toContain("Rotation Plan")
    expect(printablesExport!.content).toContain("No rotation plan defined.")
    expect(printablesExport!.content).toContain("Intervention Support")
    expect(printablesExport!.content).toContain("- No intervention support defined.")
  })

  it("keeps missing-area decision prompt language out of teacher-facing package sections and exports", () => {
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
      planningIdeas: makePlanningIdeas({
        assessment: true,
        centers: true,
        smallGroup: true,
        intervention: true,
        missingAreaPrompts: [
          {
            component: "guided_practice",
            importance: "high",
            prompt: "Add a scaffolded guided-practice block?",
            rationale: "Guided practice is a core lesson component.",
          },
          {
            component: "closure",
            importance: "medium",
            prompt: "Add a short recap or exit check?",
            rationale: "Closure is instructionally meaningful.",
          },
          {
            component: "intervention",
            importance: "medium",
            prompt: "Add a clear intervention or reteach plan?",
            rationale: "Intervention keeps support targeted.",
          },
        ],
      }),
      outputContents: makeOutputContents({
        assessment: true,
        centers: true,
        smallGroup: true,
        intervention: true,
        printables: true,
      }),
    })

    const teacherFacingContent = [
      result.lessonPlan,
      result.rotationPlan,
      ...result.exports.map((artifact) => artifact.content ?? ""),
    ].join("\n")

    expect(teacherFacingContent).not.toContain("High-priority decision:")
    expect(teacherFacingContent).not.toContain("Decision: Add a short recap or exit check?")
    expect(teacherFacingContent).not.toContain("Decision: Add a clear intervention or reteach plan?")
  })

  it("keeps canonical exports free of banned hub language", () => {
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
      planningIdeas: makePlanningIdeas(),
      outputContents: makeOutputContents(),
    })

    const exportContent = result.exports
      .map((artifact) => artifact.content ?? "")
      .join("\n")

    const bannedPhrases = [
      "Lesson Hub",
      "Clickable Hub",
      "Choose the lesson path together",
      "Launch and Navigation",
      "Guided Rotation and Practice",
      "Hub Launch",
      "Center Rotation",
      "Complete the final quick check before leaving the hub",
      "Rotate through the practice path you were assigned",
    ]

    bannedPhrases.forEach((phrase) => {
      expect(exportContent).not.toContain(phrase)
    })
  })
})

