import { describe, expect, it } from "vitest"
import {
  detectLessonTargets,
  resolveLessonProfile,
} from "./detectLessonTargets"
import type { CurriculumAnalysis, LessonInputs } from "../types"

function makeInputs(overrides: Partial<LessonInputs>): LessonInputs {
  return {
    grade: "K",
    subject: "ELA",
    standard: "",
    skill: "",
    topic: "",
    duration: "25",
    notes: "",
    ...overrides,
  }
}

describe("resolveLessonProfile", () => {
  it("keeps writing plus sight-word work out of the old phonics/comprehension-only buckets", () => {
    const inputs = makeInputs({
      skill: "Write a sentence with sight words",
      topic: "sentence writing with high frequency words",
      notes: "students write a sentence using target sight words",
    })

    const curriculumAnalyses: CurriculumAnalysis[] = [
      {
        standards: [],
        vocabulary: [],
        wordLists: ["the", "like", "see"],
        texts: [],
        practiceTasks: ["sentence writing with sight words"],
        instructionalTargets: ["write a sentence using target sight words"],
        examples: ["students write a sentence and reread it"],
      },
    ]

    const profile = resolveLessonProfile({
      inputs,
      selectedMode: "single",
      curriculumAnalyses,
    })

    expect(profile.dominantAreaKeys).toEqual(
      expect.arrayContaining(["writing_sentence_work", "high_frequency_words"])
    )

    const detected = detectLessonTargets(inputs, "single", curriculumAnalyses)
    expect(detected.primary).toBe("general")
    expect(detected.isMixedTarget).toBe(false)
  })

  it("still resolves a clearly phonics-focused lesson as phonics", () => {
    const inputs = makeInputs({
      skill: "Long A phonics",
      topic: "CVCe long a words",
      notes: "students decode long a words with magic e",
    })

    const detected = detectLessonTargets(inputs, "single")
    expect(detected.primary).toBe("phonics")
  })

  it("still resolves a clearly comprehension-focused lesson as comprehension", () => {
    const inputs = makeInputs({
      skill: "Author's purpose comprehension",
      topic: "retell and key details",
      notes: "students explain why an author wrote a text",
    })

    const detected = detectLessonTargets(inputs, "single")
    expect(detected.primary).toBe("comprehension")
  })
})
