import { describe, expect, it } from "vitest"
import { resolveBlueprintContent } from "./resolveBlueprintContent"

describe("resolveBlueprintContent", () => {
  it("filters noisy OCR and admin curriculum lines before they shape blueprint content", () => {
    const curriculumAnalysis = {
      standards: [
        "HB Florida B.E.S.T. Standards",
        "Standards",
        "ELA.K.F.1.1 Demonstrate knowledge of grade-level phonics and word-analysis skills.",
      ],
      vocabulary: [
        "e Read CVCe words with long A (a_e pattern) (e.g., made)",
        "Ses tpe metic parses blending practice, story visuals, and, up/down, and letter-sound motions).",
        "@® Materials, Educational Technology, and Sources",
      ],
      wordLists: [
        "Unit: Unit 3, Week 4, Day 3 Programs: UFLI + Savvas",
        "Word List: made, same, late, cake",
      ],
      texts: [
        "Savvas story slides for The Best Story",
        "Decodable passage: Jake made a cake at the lake.",
      ],
      practiceTasks: [
        "Read high-frequency words",
        "I can read words with magic e (long A).",
        "Posted and read together at the beginning. Reviewed at the end.",
      ],
      instructionalTargets: [
        "@ Learning Objective",
        "I can read words with magic e (long A).",
      ],
      examples: [],
      coverage: {
        standards: [
          "HB Florida B.E.S.T. Standards",
          "ELA.K.F.1.1 Demonstrate knowledge of grade-level phonics and word-analysis skills.",
        ],
        instructionalTargets: [
          "I can read words with magic e (long A).",
        ],
        foundationalSkills: [],
        sightWords: [],
        vocabulary: [
          "e Read CVCe words with long A (a_e pattern) (e.g., made)",
        ],
        wordLists: [
          "Word List: made, same, late, cake",
        ],
        texts: [
          "Decodable passage: Jake made a cake at the lake.",
        ],
        practiceTasks: [
          "Read high-frequency words",
          "I can read words with magic e (long A).",
        ],
        lessonSegments: [],
      },
    } as any

    const result = resolveBlueprintContent({
      curriculumMaterials: [
        {
          analysis: {
            extractedText: [
              "HB Florida B.E.S.T. Standards",
              "ELA.K.F.1.1 Demonstrate knowledge of grade-level phonics and word-analysis skills.",
              "Word List: made, same, late, cake",
              "Unit: Unit 3, Week 4, Day 3 Programs: UFLI + Savvas",
              "Decodable passage: Jake made a cake at the lake.",
            ],
          },
        } as any,
      ],
      curriculumAnalyses: [curriculumAnalysis],
      inputs: {
        standard: "",
        grade: "K",
        subject: "ELA",
        skill: "Long A phonics",
        topic: "Long a words",
      },
      target: {
        primary: "phonics",
        secondary: null,
        isMixedTarget: false,
        recommendedMode: "full",
      } as any,
    })

    expect(result.standards).toEqual([
      "ELA.K.F.1.1 Demonstrate knowledge of grade-level phonics and word-analysis skills.",
    ])
    expect(result.wordLists.join(" ")).toContain("Word List: made, same, late, cake")
    expect(result.wordLists.join(" ")).not.toContain("Unit: Unit 3")
    expect(result.texts.join(" ")).toContain("Decodable passage: Jake made a cake at the lake.")
    expect(result.texts.join(" ")).not.toContain("Savvas story slides")
    expect(result.vocabulary.join(" ")).not.toContain("Materials, Educational Technology, and Sources")
    expect(result.vocabulary.join(" ")).not.toContain("Ses tpe metic parses")
  })
})
