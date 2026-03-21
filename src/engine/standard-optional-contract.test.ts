import { describe, expect, it } from "vitest"
import { resolveBlueprintContent } from "./blueprint/resolveBlueprintContent"
import { useLessonStore } from "../state/useLessonStore"

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

describe("standard optional contract", () => {
  it("treats standard as optional when other required inputs are present", () => {
    const previousInputs = useLessonStore.getState().inputs

    try {
      useLessonStore.setState({
        inputs: {
          ...previousInputs,
          grade: "1",
          subject: "ELA",
          standard: "",
          skill: "Long A phonics",
          topic: "Long a words in connected text",
          duration: "45",
        },
      })

      expect(useLessonStore.getState().hasRequiredInputs()).toBe(true)
    } finally {
      useLessonStore.setState({ inputs: previousInputs })
    }
  })

  it("ranks curriculum-derived standards using teacher-entered skill and topic when standard is blank", () => {
    const result = resolveBlueprintContent({
      curriculumMaterials: [],
      curriculumAnalyses: [
        makeCurriculumAnalysis({
          standards: ["RL.1.2"],
          vocabulary: ["retell", "story events"],
          texts: ["Story events passage"],
          practiceTasks: ["Discuss character actions with a partner."],
          instructionalTargets: ["Retell story events and answer comprehension questions."],
          coverage: {
            standards: ["RL.1.2"],
            instructionalTargets: ["Retell story events and answer comprehension questions."],
            foundationalSkills: [],
            sightWords: [],
            vocabulary: ["retell", "story events"],
            wordLists: [],
            texts: ["Story events passage"],
            practiceTasks: ["Discuss character actions with a partner."],
            lessonSegments: [],
          },
        }),
        makeCurriculumAnalysis({
          standards: ["RF.1.3"],
          vocabulary: ["long a", "silent e"],
          wordLists: ["long a words"],
          texts: ["Long a words in connected text"],
          practiceTasks: ["Read long a words in connected text."],
          instructionalTargets: ["Decode long a words with silent e."],
          coverage: {
            standards: ["RF.1.3"],
            instructionalTargets: ["Decode long a words with silent e."],
            foundationalSkills: ["silent e"],
            sightWords: [],
            vocabulary: ["long a", "silent e"],
            wordLists: ["long a words"],
            texts: ["Long a words in connected text"],
            practiceTasks: ["Read long a words in connected text."],
            lessonSegments: [],
          },
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

    expect(result.standards).toEqual(["RF.1.3", "RL.1.2"])
  })
})