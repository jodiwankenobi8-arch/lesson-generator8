import { describe, expect, it } from "vitest"
import { buildLessonPlanningIdeas } from "./planning/buildLessonPlanningIdeas"
import { LessonBlueprint, PlanningCoverageStatus } from "./types"

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
      overall: "balanced",
      warnings: [],
      signals: [],
      ...overrides.sourceReadiness,
    },
  }
}

function isCoverageStatus(value: unknown): value is PlanningCoverageStatus {
  return value === "covered" || value === "partial" || value === "missing"
}

describe("planning coverage and missing-area prompts", () => {
  it("marks major lesson components as covered when blueprint signals are strong", () => {
    const planning = buildLessonPlanningIdeas(makeBlueprint())

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

  it("still produces structured planning output when blueprint structure is thin", () => {
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
      })
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
        [
          "guided_practice",
          "independent_practice",
          "closure",
          "formative_assessment",
          "centers",
          "small_group",
          "intervention",
        ].includes(prompt.component)
      )
    ).toBe(true)
  })

  it("generates downstream mixed-lesson support ideas even when center structure is not explicit", () => {
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
