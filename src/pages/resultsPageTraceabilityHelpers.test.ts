import { describe, expect, it } from "vitest"
import { summarizeExemplarPayoff } from "./resultsPageTraceabilityHelpers"
import type { BlueprintTemplateShell, LessonBlueprint } from "../engine/types"

function makeEmptyShell(): BlueprintTemplateShell {
  return {
    segmentOrder: [],
    slideShell: [],
    timingShell: [],
    teacherMoveShell: [],
    promptShell: [],
    toneShell: [],
  }
}

function makePopulatedShell(overrides: Partial<ReturnType<typeof makeEmptyShell>> = {}) {
  return { ...makeEmptyShell(), ...overrides }
}

function makeBlueprint(
  scopedTemplateShells?: LessonBlueprint["structure"]["scopedTemplateShells"],
  overrides?: Partial<LessonBlueprint["sourceReadiness"]>
): LessonBlueprint {
  return {
    content: {
      target: { primary: "phonics", secondary: null, isMixedTarget: false, recommendedMode: "single" },
      standards: [],
      vocabulary: [],
      wordLists: [],
      texts: [],
      practiceIdeas: [],
      coverage: {
        standards: [],
        instructionalTargets: [],
        foundationalSkills: [],
        sightWords: [],
        vocabulary: [],
        wordLists: [],
        texts: [],
        practiceIdeas: [],
        lessonSegments: [],
      },
    },
    structure: {
      timing: [],
      lessonSegments: [],
      teacherMoves: [],
      promptStyle: [],
      tone: [],
      templateShell: makeEmptyShell(),
      scopedTemplateShells,
    },
    sourceReadiness: {
      overall: "limited",
      curriculumSupport: "limited",
      exemplarSupport: "strong",
      coverageSupport: "limited",
      selectedCurriculumMaterialIds: [],
      selectedExemplarMaterialIds: ["ex-1"],
      signals: [],
      warnings: [],
      ...overrides,
    },
  }
}

describe("summarizeExemplarPayoff", () => {
  it("returns null when no scopedTemplateShells exist", () => {
    expect(summarizeExemplarPayoff(makeBlueprint(undefined))).toBeNull()
  })

  it("returns null when default scoped shells exist without exemplar support", () => {
    const blueprint = makeBlueprint(
      {
        centers: makePopulatedShell({ segmentOrder: ["Rotation Launch", "Centers / Rotation"] }),
        small_group: makePopulatedShell({ segmentOrder: ["Warm-Up Review", "Reteach / Model"] }),
      },
      {
        exemplarSupport: "limited",
        selectedExemplarMaterialIds: [],
      }
    )

    expect(summarizeExemplarPayoff(blueprint)).toBeNull()
  })

  it("keeps exemplar payoff when actual exemplar support exists", () => {
    const blueprint = makeBlueprint({
      lesson_plan: makePopulatedShell({ segmentOrder: ["Opening", "Teach"], timingShell: ["5 min"] }),
      lesson_slides: makePopulatedShell({ slideShell: ["Objective / Opening", "Model / Teach"] }),
      centers: makePopulatedShell({ segmentOrder: ["Rotation Launch", "Centers / Rotation"] }),
    })

    const summary = summarizeExemplarPayoff(blueprint)

    expect(summary?.title).toBe("How the exemplar shaped this lesson")
    expect(summary?.lines.length).toBeGreaterThan(0)
  })
})