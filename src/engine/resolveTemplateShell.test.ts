import { describe, expect, it } from "vitest"
import { resolveTemplateShell } from "./shared/resolveTemplateShell"
import type { LessonBlueprint } from "./types"

function makeBlueprint(args?: {
  segmentOrder?: string[]
  slideShell?: string[]
}): LessonBlueprint {
  return {
    content: {
      target: {
        primary: "phonics",
        secondary: null,
        isMixedTarget: false,
        recommendedMode: "single",
      },
      standards: [],
      vocabulary: [],
      wordLists: [],
      texts: [],
      practiceIdeas: [],
    },
    sourceReadiness: {
      curriculumSupport: "limited",
      exemplarSupport: "strong",
      overall: "structure_heavy",
      warnings: [],
      signals: [],
      coverageSupport: "limited",
      selectedCurriculumMaterialIds: [],
      selectedExemplarMaterialIds: [],
    },
    structure: {
      lessonSegments: args?.segmentOrder ?? [],
      timing: [],
      teacherMoves: ["teacher model"],
      promptStyle: ["teacher prompt"],
      tone: ["clear instructional tone"],
      templateShell: {
        segmentOrder: args?.segmentOrder ?? [],
        slideShell: args?.slideShell ?? [],
        timingShell: [],
        teacherMoveShell: [],
        promptShell: [],
        toneShell: [],
      },
    },
  } as LessonBlueprint
}

describe("resolveTemplateShell guardrails", () => {
  it("falls back to a sane instructional sequence when the exemplar shell is mostly layout-only", () => {
    const shell = resolveTemplateShell(
      makeBlueprint({
        segmentOrder: ["Centers"],
        slideShell: ["Centers", "Visual / Image"],
      }),
      {
        lessonSegmentsCount: 6,
        slideShellCount: 6,
      }
    )

    expect(shell.lessonSegments).toEqual(
      expect.arrayContaining([
        "Opening",
        "Teach",
        "Guided Practice",
        "Independent Practice",
        "Closure",
      ])
    )

    expect(shell.lessonSegments.join(" -> ")).not.toContain("Visual / Image")
    expect(shell.slideShell).toEqual(
      expect.arrayContaining([
        "Objective / Opening",
        "Model / Teach",
        "Guided Practice",
        "Independent Practice",
        "Closure / Check",
      ])
    )
  })

  it("keeps centers only as a secondary part of the resolved flow when instructional coverage is otherwise present", () => {
    const shell = resolveTemplateShell(
      makeBlueprint({
        segmentOrder: ["Teach", "Guided Practice", "Independent Practice", "Centers", "Closure"],
        slideShell: ["Model / Teach", "Guided Practice", "Independent Practice", "Centers / Rotation", "Closure / Check"],
      }),
      {
        lessonSegmentsCount: 6,
        slideShellCount: 6,
      }
    )

    expect(shell.lessonSegments).toEqual(
      expect.arrayContaining([
        "Teach",
        "Guided Practice",
        "Independent Practice",
        "Centers",
        "Closure",
      ])
    )
  })

  it("keeps reusable content-slot shell cues without letting old content become lesson segments", () => {
    const shell = resolveTemplateShell(
      makeBlueprint({
        segmentOrder: ["Opening", "Teach", "Guided Practice", "Independent Practice", "Closure"],
        slideShell: [
          "Objective / Opening",
          "Model / Teach",
          "Old Lesson Word List: cake, game, late",
          "Example / Non-Example",
          "Table / Sort",
          "Closure / Check",
        ],
      }),
      {
        lessonSegmentsCount: 6,
        slideShellCount: 8,
      }
    )

    expect(shell.lessonSegments.join(" -> ")).not.toContain("Old Lesson Word List")
    expect(shell.slideShell).toEqual(
      expect.arrayContaining([
        "Word List / Practice",
        "Example / Non-Example",
        "Table / Sort",
      ])
    )
  })

  it("preserves artifact-specific scoped defaults for support outputs", () => {
    const blueprint = makeBlueprint()
    const shell = resolveTemplateShell(
      {
        ...blueprint,
        structure: {
          ...blueprint.structure,
          scopedTemplateShells: {
            centers: {
              segmentOrder: ["Rotation Launch", "Centers / Rotation", "Independent Rotation", "Share / Closure"],
              slideShell: ["Rotation Launch", "Centers / Rotation", "Independent Rotation", "Share / Closure"],
              timingShell: ["Rotation Launch", "Center Work", "Independent Rotation", "Share / Closure"],
              teacherMoveShell: ["Set up the rotation", "Monitor groups and confer"],
              promptShell: ["Review the directions", "Coach students through the rotation"],
              toneShell: ["clear and organized"],
            },
          },
        },
      },
      {
        scope: "centers",
        lessonSegmentsCount: 4,
        slideShellCount: 4,
        timingCount: 4,
      }
    )

    expect(shell.lessonSegments).toEqual([
      "Rotation Launch",
      "Centers / Rotation",
      "Independent Rotation",
      "Share / Closure",
    ])
    expect(shell.slideShell).toEqual([
      "Rotation Launch",
      "Centers / Rotation",
      "Independent Rotation",
      "Share / Closure",
    ])
    expect(shell.timing).toEqual([
      "Rotation Launch",
      "Center Work",
      "Independent Rotation",
      "Share / Closure",
    ])
  })

  it("preserves scoped printable shell cues when only slide-shell cues are present", () => {
    const blueprint = makeBlueprint()
    const shell = resolveTemplateShell(
      {
        ...blueprint,
        structure: {
          ...blueprint.structure,
          scopedTemplateShells: {
            printables: {
              segmentOrder: [],
              slideShell: ["Directions", "Passage / Text", "Word List / Practice", "Exit Ticket"],
              timingShell: [],
              teacherMoveShell: ["Introduce printable routine"],
              promptShell: ["Direct students to annotate the printable"],
              toneShell: ["clear and focused"],
            },
          },
        },
      },
      {
        scope: "printables",
        lessonSegmentsCount: 4,
        slideShellCount: 4,
      }
    )

    expect(shell.lessonSegments).toEqual([
      "Directions",
      "Passage / Text",
      "Word List / Practice",
      "Exit Ticket",
    ])
    expect(shell.slideShell).toEqual([
      "Directions",
      "Passage / Text",
      "Word List / Practice",
      "Exit Ticket",
    ])
  })
})