import { describe, expect, it } from "vitest"
import { resolveBlueprintContent } from "./resolveBlueprintContent"

function makeCurriculumAnalysis(overrides: Record<string, unknown> = {}) {
  return {
    standards: [],
    vocabulary: [],
    wordLists: [],
    texts: [],
    practiceTasks: [],
    instructionalTargets: [],
    examples: [],
    coverage: {
      standards: [],
      instructionalTargets: [],
      foundationalSkills: [],
      sightWords: [],
      vocabulary: [],
      wordLists: [],
      texts: [],
      practiceTasks: [],
      lessonSegments: [],
    },
    ...overrides,
  } as any
}

describe("resolveBlueprintContent standards ranking", () => {
  it("keeps an explicit teacher-entered standard as the winner", () => {
    const result = resolveBlueprintContent({
      curriculumMaterials: [],
      curriculumAnalyses: [
        makeCurriculumAnalysis({
          standards: ["RL.1.2"],
          instructionalTargets: ["Retell key details from a story."],
        }),
      ],
      inputs: {
        standard: "RF.1.3",
        grade: "1",
        subject: "ELA",
        skill: "Long A phonics",
        topic: "Long a words in connected text",
      },
      target: { primary: "phonics" } as any,
    })

    expect(result.standards).toEqual(["RF.1.3"])
  })

  it("uses teacher-entered skill/topic to rank curriculum-derived standards when standard is blank", () => {
    const result = resolveBlueprintContent({
      curriculumMaterials: [],
      curriculumAnalyses: [
        makeCurriculumAnalysis({
          standards: ["RL.1.2"],
          instructionalTargets: ["Retell story events and answer comprehension questions."],
          vocabulary: ["retell", "story events"],
          practiceTasks: ["Discuss character actions with a partner."],
        }),
        makeCurriculumAnalysis({
          standards: ["RF.1.3"],
          instructionalTargets: ["Decode long a words with silent e."],
          vocabulary: ["long a", "silent e"],
          practiceTasks: ["Read long a words in connected text."],
        }),
      ],
      inputs: {
        standard: "",
        grade: "1",
        subject: "ELA",
        skill: "Long A phonics",
        topic: "Long a words in connected text",
      },
      target: { primary: "phonics" } as any,
    })

    expect(result.standards[0]).toBe("RF.1.3")
    expect(result.standards).toEqual(["RF.1.3", "RL.1.2"])
  })
})