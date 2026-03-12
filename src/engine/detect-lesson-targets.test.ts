import { describe, expect, it } from "vitest"
import { detectLessonTargets, resolveLessonMode } from "./blueprint/detectLessonTargets"
import { LessonInputs } from "./types"

function makeInputs(overrides: Partial<LessonInputs> = {}): LessonInputs {
  return {
    grade: "1",
    subject: "ELA",
    standard: "RF.1.3",
    skill: "Long A phonics",
    topic: "Read and spell long A words in connected text",
    duration: "30 minutes",
    ...overrides,
  }
}

describe("detectLessonTargets", () => {
  it("keeps a simple long a phonics lesson phonics-only", () => {
    const detected = detectLessonTargets(
      makeInputs({
        standard: "RF.1.3",
        skill: "Long A phonics",
        topic: "Decode and read long A vowel pattern words in a decodable passage",
      }),
      "single"
    )

    expect(detected.primary).toBe("phonics")
    expect(detected.secondary).toBeNull()
    expect(detected.isMixedTarget).toBe(false)
    expect(detected.recommendedMode).toBe("phonics_only")
  })

  it("keeps a comprehension lesson comprehension-only", () => {
    const detected = detectLessonTargets(
      makeInputs({
        standard: "RL.1.2",
        skill: "Comprehension",
        topic: "Retell key details, identify main idea, and use text evidence from the story",
      }),
      "single"
    )

    expect(detected.primary).toBe("comprehension")
    expect(detected.secondary).toBeNull()
    expect(detected.isMixedTarget).toBe(false)
    expect(detected.recommendedMode).toBe("comprehension_only")
  })

  it("detects true phonics plus comprehension inputs as mixed", () => {
    const detected = detectLessonTargets(
      makeInputs({
        standard: "RF.1.3 and RL.1.2",
        skill: "Long A phonics and comprehension",
        topic: "Decode long A words in a decodable passage, then retell key details and answer comprehension questions with text evidence",
      }),
      "single"
    )

    expect(detected.primary).toBe("phonics")
    expect(detected.secondary).toBe("comprehension")
    expect(detected.isMixedTarget).toBe(true)
    expect(detected.recommendedMode).toBe("full")
  })

  it("respects explicit phonics-only override", () => {
    const detected = detectLessonTargets(
      makeInputs({
        standard: "RF.1.3 and RL.1.2",
        skill: "Long A phonics and comprehension",
        topic: "Decode long A words, retell the text, and answer questions",
      }),
      "phonics_only"
    )

    expect(detected.primary).toBe("phonics")
    expect(detected.secondary).toBeNull()
    expect(detected.isMixedTarget).toBe(false)
    expect(detected.recommendedMode).toBe("phonics_only")
  })

  it("respects explicit comprehension-only override", () => {
    const detected = detectLessonTargets(
      makeInputs({
        standard: "RF.1.3 and RL.1.2",
        skill: "Long A phonics and comprehension",
        topic: "Decode long A words, retell the text, and answer questions",
      }),
      "comprehension_only"
    )

    expect(detected.primary).toBe("comprehension")
    expect(detected.secondary).toBeNull()
    expect(detected.isMixedTarget).toBe(false)
    expect(detected.recommendedMode).toBe("comprehension_only")
  })
})

describe("resolveLessonMode", () => {
  it("prefers an explicit lesson mode string", () => {
    expect(resolveLessonMode("full", "single")).toBe("full")
  })

  it("falls back to recommendedMode from objects", () => {
    expect(resolveLessonMode({ recommendedMode: "phonics_only" }, null)).toBe("phonics_only")
  })

  it('returns "single" when nothing usable is provided', () => {
    expect(resolveLessonMode(null, undefined)).toBe("single")
  })
})
