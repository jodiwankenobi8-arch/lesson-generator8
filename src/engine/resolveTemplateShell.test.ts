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
})