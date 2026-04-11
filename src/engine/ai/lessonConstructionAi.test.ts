import { describe, expect, it, vi } from "vitest"

vi.mock("../package/buildPackageExportArtifacts", () => ({
  buildExports: () => ({
    zip: null,
    lessonSlides: null,
    lessonPlan: null,
    printables: null,
  }),
}))

vi.mock("../package/buildLessonPackageReadiness", () => ({
  buildLessonPackageReadiness: () => ({
    density: "balanced",
    lessonShape: "balanced",
    contentFit: "grounded",
    warnings: [],
  }),
}))

import { mergeAiLessonConstruction } from "./lessonConstructionAi"
import { createDefaultOutputContents } from "../types"

function makeOutputContents() {
  const outputContents = createDefaultOutputContents()
  outputContents.lessonPlan.selected = true
  outputContents.lessonSlides.selected = true
  outputContents.lessonSlides.studentFacingOnly = false

  Object.keys(outputContents.lessonPlan.parts).forEach((key) => {
    outputContents.lessonPlan.parts[key as keyof typeof outputContents.lessonPlan.parts] = false
  })

  outputContents.centers.selected = false
  outputContents.smallGroup.selected = false
  outputContents.smallGroup.tiers.T1 = false
  outputContents.smallGroup.tiers.T2 = false
  outputContents.smallGroup.tiers.T3 = false
  outputContents.smallGroup.tiers.Extension = false
  outputContents.groups.selected = false
  outputContents.groups.byTier.T1.centers = false
  outputContents.groups.byTier.T2.small_group = false
  outputContents.groups.byTier.T3.intervention = false
  outputContents.groups.byTier.Extension.small_group = false
  outputContents.other.printables = false

  return outputContents
}

describe("mergeAiLessonConstruction", () => {
  it("preserves strong deterministic grounded content instead of overwriting it with noisy AI content", () => {
    const baseResult = {
      blueprint: {
        content: {
          target: {
            primary: "phonics",
            secondary: null,
            isMixedTarget: false,
            recommendedMode: "full",
          },
          standards: ["ELA.K.F.1.1"],
          vocabulary: ["long a"],
          wordLists: ["Word List: made, same, late, cake"],
          texts: ["Decodable passage: Jake made a cake at the lake."],
          practiceIdeas: ["Read and sort long a words"],
          coverage: {
            standards: ["ELA.K.F.1.1"],
            vocabulary: ["long a"],
            wordLists: ["Word List: made, same, late, cake"],
            texts: ["Decodable passage: Jake made a cake at the lake."],
            practiceIdeas: ["Read and sort long a words"],
            instructionalTargets: ["I can read words with magic e (long A)."],
            sightWords: [],
            foundationalSkills: [],
            lessonSegments: ["Opening", "Teach", "Guided Practice", "Closure"],
          },
        },
        sourceReadiness: {
          curriculumSupport: "strong",
          exemplarSupport: "strong",
          overall: "balanced",
          warnings: [],
        },
      },
      planningIdeas: {} as any,
      lessonSpec: {} as any,
      lessonPackage: {
        slides: ["Clean deterministic slide"],
        lessonPlan: "Clean deterministic lesson plan",
        centers: ["Word work center"],
        rotationPlan: "Clean rotation plan",
        interventions: ["Immediate reteach"],
        exports: {},
        readiness: {
          density: "balanced",
          lessonShape: "balanced",
          contentFit: "grounded",
          warnings: [],
        },
      },
      trace: {
        package: {
          density: "balanced",
          lessonShape: "balanced",
          contentFit: "grounded",
          warningCount: 0,
        },
      },
    } as any

    const ai = {
      enabled: true,
      confidence: 0.92,
      warnings: [],
      derivedStandards: ["Teacher-selected standard"],
      vocabulary: ['Student "I Can" Learning Targets', "Ses tpe metic parses blending practice"],
      wordLists: ["phonics) Edition)", "Unit: Unit 3, Week 4, Day 3 Programs: UFLI + Savvas"],
      texts: ["Savvas story slides for The Best Story"],
      practiceIdeas: ["pacing, modeling, guided practice, and"],
      lessonPlanText: "No grounded standard identified yet. Current teacher focus: Long A phonics.",
      slides: [
        {
          title: "Objective",
          kind: "objective",
          action: "create_new",
          purpose: "Introduce the lesson objective",
          timing: "Opening",
          teacherMove: "teacher model",
          promptStyle: "teacher prompt",
          tone: "clear instructional tone",
          body: ["Teacher-selected standard", "Ses tpe metic parses blending practice"],
        },
      ],
      centers: ["Unit: Unit 3, Week 4, Day 3 Programs: UFLI + Savvas"],
      rotationPlanLines: ["No grounded standard identified yet"],
      interventions: ["phonics) Edition)"],
    } as any

    const merged = mergeAiLessonConstruction(
      {
        inputs: {
          grade: "K",
          subject: "ELA",
          standard: "teacher-selected standard",
          skill: "Long A phonics",
          topic: "Long a words",
          duration: "25 mins",
          notes: "",
        } as any,
        materials: [],
        outputContents: makeOutputContents(),
        baseResult,
      },
      ai
    )

    expect(merged.blueprint.content.standards).toEqual(["ELA.K.F.1.1"])
    expect(merged.blueprint.content.vocabulary).toEqual(["long a"])
    expect(merged.blueprint.content.wordLists).toEqual(["Word List: made, same, late, cake"])
    expect(merged.blueprint.content.texts).toEqual(["Decodable passage: Jake made a cake at the lake."])
    expect(merged.blueprint.content.practiceIdeas).toEqual(["Read and sort long a words"])
    expect(merged.lessonPackage.lessonPlan).toBe("Clean deterministic lesson plan")
    expect(merged.lessonPackage.slides).toEqual(["Clean deterministic slide"])
    expect(merged.lessonPackage.centers).toEqual(["Word work center"])
    expect(merged.lessonPackage.rotationPlan).toBe("Clean rotation plan")
    expect(merged.lessonPackage.interventions).toEqual(["Immediate reteach"])
  })

  it("still allows AI to fill missing content when deterministic grounding is not strong", () => {
    const baseResult = {
      blueprint: {
        content: {
          target: {
            primary: "phonics",
            secondary: null,
            isMixedTarget: false,
            recommendedMode: "full",
          },
          standards: [],
          vocabulary: [],
          wordLists: [],
          texts: [],
          practiceIdeas: [],
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
        sourceReadiness: {
          curriculumSupport: "limited",
          exemplarSupport: "limited",
          overall: "fallback_heavy",
          warnings: [],
        },
      },
      planningIdeas: {} as any,
      lessonSpec: {} as any,
      lessonPackage: {
        slides: [],
        lessonPlan: "",
        centers: [],
        rotationPlan: "",
        interventions: [],
        exports: {},
        readiness: {
          density: "thin",
          lessonShape: "fallback_heavy",
          contentFit: "fallback",
          warnings: [],
        },
      },
      trace: {
        package: {
          density: "thin",
          lessonShape: "fallback_heavy",
          contentFit: "fallback",
          warningCount: 0,
        },
      },
    } as any

    const ai = {
      enabled: true,
      confidence: 0.9,
      warnings: [],
      derivedStandards: ["ELA.K.F.1.1"],
      vocabulary: ["long a"],
      wordLists: ["Word List: made, same, late, cake"],
      texts: ["Decodable passage: Jake made a cake at the lake."],
      practiceIdeas: ["Read and sort long a words"],
      lessonPlanText: `Strong AI lesson plan text with enough detail to keep.

Lesson Grounding
- Primary Lesson Area: phonics
- Standards: ELA.K.F.1.1
- Vocabulary: long a
- Word List: Word List: made, same, late, cake
- Practice Ideas: Read and sort long a words

Opening
- Launch the lesson by reviewing the long a sound and setting the purpose for reading CVCe words.

Teach
- Model how silent e changes the vowel sound in made, same, late, and cake.
- Use explicit teacher language and a clear think-aloud.

Guided Practice
- Read and sort long a words together.
- Have students explain why the vowel says its name.

Independent Practice
- Students read and write a short set of long a CVCe words independently.

Closure
- Review the long a pattern and check whether students can read the target words accurately.`,
      slides: [
        {
          title: "Objective",
          kind: "objective",
          action: "create_new",
          purpose: "Introduce the lesson objective and frame the long a phonics work for students.",
          timing: "Opening",
          teacherMove: "teacher model",
          promptStyle: "teacher prompt",
          tone: "clear instructional tone",
          body: [
            "Standards: ELA.K.F.1.1",
            "Focus vocabulary: long a, silent e, CVCe",
            "Model words: made, same, late, cake",
            "Students will read, sort, and explain long a words during guided and independent practice.",
          ],
        },
      ],
      centers: ["Word work center"],
      rotationPlanLines: ["Teacher-led support for long a words"],
      interventions: ["Immediate reteach for long a words"],
    } as any

    const merged = mergeAiLessonConstruction(
      {
        inputs: {
          grade: "K",
          subject: "ELA",
          standard: "",
          skill: "Long A phonics",
          topic: "Long a words",
          duration: "25 mins",
          notes: "",
        } as any,
        materials: [],
        outputContents: makeOutputContents(),
        baseResult,
      },
      ai
    )

    expect(merged.blueprint.content.standards).toEqual(["ELA.K.F.1.1"])
    expect(merged.blueprint.content.wordLists).toEqual(["Word List: made, same, late, cake"])
    expect(merged.lessonPackage.lessonPlan).toContain("Strong AI lesson plan text")
    expect(merged.lessonPackage.slides[0]).toContain("ELA.K.F.1.1")
  })
})

