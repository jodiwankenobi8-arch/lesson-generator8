import { describe, expect, it } from "vitest"
import { buildLessonPackageReadiness } from "./package/buildLessonPackageReadiness"
import type { LessonBlueprint } from "./types"

const blueprint: LessonBlueprint = {
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
    timing: ["Opening", "Teach", "Guided Practice"],
    lessonSegments: ["Opening", "Teach", "Guided Practice", "Closure"],
    teacherMoves: ["Teacher model"],
    promptStyle: ["teacher prompt"],
    tone: ["clear instructional tone"],
    templateShell: {
      segmentOrder: ["Opening", "Teach", "Guided Practice", "Closure"],
      slideShell: ["Objective / Opening", "Model / Teach", "Guided Practice", "Closure / Check"],
      timingShell: ["Opening", "Teach", "Guided Practice"],
      teacherMoveShell: ["Teacher model"],
      promptShell: ["teacher prompt"],
      toneShell: ["clear instructional tone"],
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

describe("buildLessonPackageReadiness", () => {
  it("marks the package as needing teacher review and blocks exports when required grounding is missing", () => {
    const readiness = buildLessonPackageReadiness({
      blueprint,
      slides: ["Slide 1: Opening"],
      centers: [],
      interventions: [],
    })

    expect(readiness.contentFit).toBe("limited")
    expect(readiness.warnings).toContain(
      "Review Materials before export: confirm word examples and practice task."
    )
    expect(readiness.warnings).toContain(
      "Review needed on Materials before concrete lesson examples or a text/topic are classroom-ready"
    )
    expect(readiness.warnings).toContain(
      "Exports stay blocked until the required lesson content is confirmed on Materials."
    )
  })
})
