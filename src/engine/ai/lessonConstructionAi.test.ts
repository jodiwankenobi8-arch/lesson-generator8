import { describe, expect, it } from "vitest"
import { createDefaultOutputContents, type LessonGenerationResult } from "../types"
import { mergeAiLessonConstruction, type AiLessonConstructionResponse } from "./lessonConstructionAi"

function makeBaseResult(): LessonGenerationResult {
  return {
    blueprint: {
      content: {
        target: {
          primary: "phonics",
          secondary: null,
          isMixedTarget: false,
          recommendedMode: "single",
        },
        standards: ["teacher-selected standard"],
        vocabulary: ["phonics pattern"],
        wordLists: ["Teacher-provided practice items"],
        texts: ["Teacher-provided lesson text"],
        practiceIdeas: ["Word reading"],
        coverage: {
          standards: [],
          vocabulary: [],
          wordLists: [],
          texts: [],
          practiceIdeas: [],
          instructionalTargets: [],
          sightWords: [],
          foundationalSkills: [],
          lessonSegments: [],
        },
      },
      structure: {
        templateShell: {
          lessonSegments: ["Opening", "Teach", "Guided Practice", "Closure"],
          slideShell: ["Opening", "Teach", "Guided Practice", "Closure"],
          teacherMoves: ["teacher model"],
          promptStyle: ["teacher prompt"],
          tone: ["clear instructional tone"],
          timing: ["Opening", "Teach", "Practice", "Closure"],
        },
        lessonSegments: ["Opening", "Teach", "Guided Practice", "Closure"],
        timing: ["Opening", "Teach", "Practice", "Closure"],
        teacherMoves: ["teacher model"],
        promptStyle: ["teacher prompt"],
        tone: ["clear instructional tone"],
      },
      sourceReadiness: {
        selectedCurriculumMaterialIds: [],
        selectedExemplarMaterialIds: ["exemplar-1"],
        curriculumSupport: "limited",
        exemplarSupport: "strong",
        overall: "structure_heavy",
        coverageSupport: "partial",
        warnings: [],
        signals: [],
      },
    } as any,
    planningIdeas: {
      slidePlans: [],
      lessonPlanSections: [],
      formativeAssessmentIdeas: [],
      centerIdeas: [],
      smallGroupIdeas: [],
      interventionIdeas: [],
    },
    lessonSpec: {
      teach: { title: "Teach", steps: ["Teach step"] },
      guidedPractice: { title: "Guided", steps: ["Guided step"] },
      independentPractice: { title: "Independent", steps: ["Independent step"] },
      centers: { title: "Centers", steps: ["Center step"] },
      closure: { title: "Closure", steps: ["Closure step"] },
    },
    lessonPackage: {
      slides: ["Slide 1: Objective | Kind: objective | Action: create_new | Purpose: Objective | Timing: Opening | Teacher Move: teacher model | Prompt Style: teacher prompt | Tone: clear instructional tone | Content: Target: phonics"],
      lessonPlan: "Lesson Plan\n\n- Standards: teacher-selected standard",
      centers: ["Old center"],
      rotationPlan: "Old rotation",
      interventions: ["Old intervention"],
      exports: [],
      readiness: {
        density: "balanced",
        lessonShape: "single-focus",
        contentFit: "limited",
        warnings: [],
        signals: [],
      },
    },
    trace: {
      selectedMode: "single",
      materialCounts: { total: 1, curriculum: 0, exemplar: 1 },
      selectedSources: { curriculumMaterialIds: [], exemplarMaterialIds: ["exemplar-1"] },
      target: {
        primary: "phonics",
        secondary: null,
        isMixedTarget: false,
        recommendedMode: "single",
      },
      blueprintWarnings: [],
      missingAreaPromptComponents: [],
      package: {
        density: "balanced",
        lessonShape: "single-focus",
        contentFit: "limited",
        warningCount: 0,
      },
    },
  }
}

describe("mergeAiLessonConstruction", () => {
  it("replaces placeholder standards and package outputs with grounded AI content", () => {
    const merged = mergeAiLessonConstruction(
      {
        inputs: {
          grade: "K",
          subject: "ELA",
          standard: "",
          skill: "Long A phonics",
          topic: "Long a words",
          duration: "30 minutes",
        },
        materials: [],
        outputContents: createDefaultOutputContents(),
        baseResult: makeBaseResult(),
      },
      {
        enabled: true,
        confidence: 0.87,
        warnings: ["AI grounded content expanded weak fallback outputs. from teacher input and exemplar context."],
        derivedStandards: ["ELA.K.F.1.3 Decode and encode regularly spelled one-syllable words with long vowels."],
        vocabulary: ["long a", "magic e", "vowel pattern"],
        wordLists: ["cake", "lake", "make", "same"],
        texts: ["Jake and Kate Bake a Cake"],
        practiceIdeas: ["word reading", "sound sort", "sentence reading"],
        lessonPlanText: "Lesson Plan\n\nStandards\n- ELA.K.F.1.3 Decode and encode regularly spelled one-syllable words with long vowels.",
        slides: [
          {
            title: "Objective",
            kind: "objective",
            action: "create_new",
            purpose: "Frame the phonics focus.",
            timing: "Opening",
            teacherMove: "teacher model",
            promptStyle: "teacher prompt",
            tone: "clear instructional tone",
            body: ["Target: phonics", "Standards: ELA.K.F.1.3", "Focus Vocabulary: long a, magic e"],
          },
        ],
        centers: ["Word sort center with long-a CVCe cards."],
        rotationPlanLines: ["Rotation 1: Word sort center with long-a CVCe cards."],
        interventions: ["Immediate reteach with cake, lake, make, same."],
      }
    )

    expect(merged.blueprint.content.standards[0]).toContain("ELA.K.F.1.3")
    expect(merged.lessonPackage.lessonPlan).toContain("ELA.K.F.1.3")
    expect(merged.lessonPackage.centers[0]).toContain("Word sort center")
    expect(merged.lessonPackage.interventions[0]).toContain("Immediate reteach")
    expect(merged.lessonPackage.slides[0]).toContain("Slide 1: Objective")
    expect(merged.lessonPackage.readiness.warnings[0]).toContain("AI grounded content expanded weak fallback outputs.")
  })
})
