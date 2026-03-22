import { describe, expect, it } from "vitest"
import { buildLessonPlanningIdeas } from "./planning/buildLessonPlanningIdeas"
import {
  createDefaultOutputContents,
  normalizeOutputContents,
  LessonBlueprint,
  LessonOutputContents,
  PlanningCoverageStatus,
} from "./types"

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
      wordLists: ["cake, game, same, late"],
      texts: ["Jake made a cake at the lake."],
      practiceIdeas: ["Read the word list aloud", "Write a sentence with a long a word"],
      coverage: {
        standards: ["RF.1.3"],
        vocabulary: ["long a", "silent e"],
        wordLists: ["cake, game, same, late"],
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

function makeOutputContents(options: {
  assessment?: boolean
  centers?: boolean
  smallGroup?: boolean
  intervention?: boolean
} = {}): LessonOutputContents {
  const outputContents = createDefaultOutputContents()

  outputContents.assessments.types.formative_assessment = Boolean(options.assessment)
  outputContents.groups.byTier.T1.centers = Boolean(options.centers)
  outputContents.groups.byTier.T2.small_group = Boolean(options.smallGroup)
  outputContents.groups.byTier.T3.intervention = Boolean(options.intervention)

  return normalizeOutputContents(outputContents)
}

function isCoverageStatus(value: unknown): value is PlanningCoverageStatus {
  return value === "covered" || value === "partial" || value === "missing"
}

describe("planning coverage and missing-area prompts", () => {
  it("marks major lesson components as covered when blueprint signals are strong", () => {
    const planning = buildLessonPlanningIdeas(makeBlueprint(), makeOutputContents())

    const coverage = planning.componentCoverage ?? []

    expect(coverage.length).toBeGreaterThan(0)

    const byComponent = new Map(
      coverage.map((entry) => [entry.component, entry] as const)
    )

    expect(byComponent.get("teach")?.status).toBe("covered")
    expect(byComponent.get("guided_practice")?.status).toBe("covered")
    expect(byComponent.get("independent_practice")?.status).toBe("covered")
    expect(byComponent.get("closure")?.status).toBe("covered")

    expect(planning.missingAreaPrompts ?? []).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ component: "guided_practice" }),
        expect.objectContaining({ component: "independent_practice" }),
        expect.objectContaining({ component: "closure" }),
      ])
    )
  })

  it("uses blueprint content coverage as the source-coverage handoff even when structure is thin", () => {
    const planning = buildLessonPlanningIdeas(
      makeBlueprint({
        content: {
          target: {
            primary: "phonics",
            secondary: null,
            isMixedTarget: false,
            recommendedMode: "single",
          },
          standards: ["RF.1.3"],
          vocabulary: ["long a", "silent e"],
          wordLists: ["cake, game, same, late"],
          texts: ["Jake made a cake at the lake."],
          practiceIdeas: ["Read the word list aloud", "Write a sentence with a long a word"],
          coverage: {
            standards: ["RF.1.3"],
            vocabulary: ["long a", "silent e"],
            wordLists: ["cake, game, same, late"],
            texts: ["Jake made a cake at the lake."],
            practiceIdeas: ["Read the word list aloud", "Write a sentence with a long a word"],
            instructionalTargets: ["Decode words with long a and silent e"],
            sightWords: [],
            foundationalSkills: ["long vowel patterns"],
            lessonSegments: ["Teach", "Guided Practice", "Independent Practice", "Closure"],
          },
        },
        structure: {
          timing: ["Mini-lesson"],
          lessonSegments: ["Opening"],
          teacherMoves: ["Teacher model"],
          promptStyle: ["Teacher prompt"],
          tone: ["clear instructional tone"],
          templateShell: {
            segmentOrder: ["Opening"],
            slideShell: ["Objective / Opening"],
            timingShell: ["Mini-lesson"],
            teacherMoveShell: ["Teacher model"],
            promptShell: ["Teacher prompt"],
            toneShell: ["clear instructional tone"],
          },
        },
      }),
      makeOutputContents()
    )

    const coverage = planning.componentCoverage ?? []
    const byComponent = new Map(
      coverage.map((entry) => [entry.component, entry] as const)
    )

    expect(byComponent.get("teach")?.sourceCoverage?.status).toBe("covered")
    expect(byComponent.get("guided_practice")?.sourceCoverage?.status).toBe("covered")
    expect(byComponent.get("independent_practice")?.sourceCoverage?.status).toBe("covered")
    expect(byComponent.get("closure")?.sourceCoverage?.status).toBe("covered")

    expect(planning.missingAreaPrompts ?? []).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ component: "guided_practice" }),
        expect.objectContaining({ component: "independent_practice" }),
        expect.objectContaining({ component: "closure" }),
      ])
    )
  })

  it("still produces structured planning output and selected assessment coverage when blueprint structure is thin", () => {
    const planning = buildLessonPlanningIdeas(
      makeBlueprint({
        content: {
          target: {
            primary: "phonics",
            secondary: null,
            isMixedTarget: false,
            recommendedMode: "single",
          },
          standards: ["RF.1.3"],
          vocabulary: [],
          wordLists: [],
          texts: [],
          practiceIdeas: [],
          coverage: {
            standards: ["RF.1.3"],
            vocabulary: [],
            wordLists: [],
            texts: [],
            practiceIdeas: [],
            instructionalTargets: [],
            sightWords: [],
            foundationalSkills: [],
            lessonSegments: ["Teach"],
          },
        },
        structure: {
          timing: ["Mini-lesson", "Practice", "Closure"],
          lessonSegments: ["Teach"],
          teacherMoves: ["Teacher model"],
          promptStyle: ["Teacher prompt"],
          tone: ["clear instructional tone"],
          templateShell: {
            segmentOrder: ["Teach"],
            slideShell: ["Model / Teach"],
            timingShell: ["Mini-lesson"],
            teacherMoveShell: ["Teacher model"],
            promptShell: ["Teacher prompt"],
            toneShell: ["clear instructional tone"],
          },
        },
      }),
      makeOutputContents({ assessment: true })
    )

    const coverage = planning.componentCoverage ?? []
    const prompts = planning.missingAreaPrompts ?? []

    const byComponent = new Map(
      coverage.map((entry) => [entry.component, entry] as const)
    )

    expect(planning.lessonPlanSections.length).toBeGreaterThan(0)
    expect(planning.formativeAssessmentIdeas.length).toBeGreaterThan(0)

    expect(isCoverageStatus(byComponent.get("teach")?.status)).toBe(true)
    expect(isCoverageStatus(byComponent.get("guided_practice")?.status)).toBe(true)
    expect(isCoverageStatus(byComponent.get("independent_practice")?.status)).toBe(true)
    expect(isCoverageStatus(byComponent.get("formative_assessment")?.status)).toBe(true)

    expect(Array.isArray(prompts)).toBe(true)
    expect(
      prompts.every((prompt) =>
        ["guided_practice", "independent_practice", "closure"].includes(prompt.component)
      )
    ).toBe(true)
  })

  it("generates downstream mixed-lesson support ideas when those group outputs are selected", () => {
    const planning = buildLessonPlanningIdeas(
      makeBlueprint({
        content: {
          target: {
            primary: "phonics",
            secondary: "comprehension",
            isMixedTarget: true,
            recommendedMode: "full",
          },
          standards: ["RF.1.3", "RL.1.1"],
          vocabulary: ["long a"],
          wordLists: ["cake, game"],
          texts: ["Jake made a cake."],
          practiceIdeas: ["Read the word list aloud"],
          coverage: {
            standards: ["RF.1.3", "RL.1.1"],
            vocabulary: ["long a"],
            wordLists: ["cake, game"],
            texts: ["Jake made a cake."],
            practiceIdeas: ["Read the word list aloud"],
            instructionalTargets: ["Decode long a words", "Connect decoding to text meaning"],
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
      makeOutputContents({
        centers: true,
        smallGroup: true,
        intervention: true,
      })
    )

    const coverage = planning.componentCoverage ?? []
    const byComponent = new Map(
      coverage.map((entry) => [entry.component, entry] as const)
    )

    expect(planning.centerIdeas.length).toBeGreaterThan(0)
    expect(planning.smallGroupIdeas.length).toBeGreaterThan(0)
    expect(planning.interventionIdeas.length).toBeGreaterThan(0)

    expect(isCoverageStatus(byComponent.get("centers")?.status)).toBe(true)
    expect(isCoverageStatus(byComponent.get("small_group")?.status)).toBe(true)
    expect(isCoverageStatus(byComponent.get("intervention")?.status)).toBe(true)
  })
})
