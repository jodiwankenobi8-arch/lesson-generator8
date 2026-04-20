import { describe, expect, it } from "vitest"
import { resolveBlueprintContent } from "./resolveBlueprintContent"

describe("resolveBlueprintContent", () => {
  it("filters noisy OCR and admin curriculum lines before they shape blueprint content", () => {
    const curriculumAnalysis = {
      standards: [
        "HB Florida B.E.S.T. Standards",
        "Standards",
        "ELA.K.F.1.1: Demonstrate knowledge of grade-level phonics and word-analysis skills.",
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
          "ELA.K.F.1.1: Demonstrate knowledge of grade-level phonics and word-analysis skills.",
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
              "ELA.K.F.1.1: Demonstrate knowledge of grade-level phonics and word-analysis skills.",
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
      "ELA.K.F.1.1: Demonstrate knowledge of grade-level phonics and word-analysis skills.",
    ])
    expect(result.wordLists.join(" ")).toContain("Word List: made, same, late, cake")
    expect(result.wordLists.join(" ")).not.toContain("Unit: Unit 3")
    expect(result.texts.join(" ")).toContain("Decodable passage: Jake made a cake at the lake.")
    expect(result.texts.join(" ")).not.toContain("Savvas story slides")
    expect(result.vocabulary.join(" ")).not.toContain("Materials, Educational Technology, and Sources")
    expect(result.vocabulary.join(" ")).not.toContain("Ses tpe metic parses")
  })

  it("falls back to concrete phonics cues when only abstract standards-style content remains", () => {
    const curriculumAnalysis = {
      standards: [
        "ELA.K.F.1.3: Demonstrate phonological awareness",
        "ELA.K.F.1.4: Read high-frequency words",
        "ELA.K.V.1.1: Identify and use new vocabulary",
      ],
      vocabulary: ["ELA.K.V.1.1: Identify and use new vocabulary"],
      wordLists: ["ELA.K.F.1.4: Read high-frequency words", "teacher-selected examples"],
      texts: ["teacher-provided text"],
      practiceTasks: ["guided practice", "curriculum-aligned guided practice"],
      instructionalTargets: ["Blend and read long a words."],
      examples: [],
      coverage: {
        standards: [
          "ELA.K.F.1.3: Demonstrate phonological awareness",
          "ELA.K.F.1.4: Read high-frequency words",
          "ELA.K.V.1.1: Identify and use new vocabulary",
        ],
        instructionalTargets: ["Blend and read long a words."],
        foundationalSkills: [],
        sightWords: [],
        vocabulary: ["ELA.K.V.1.1: Identify and use new vocabulary"],
        wordLists: ["ELA.K.F.1.4: Read high-frequency words", "teacher-selected examples"],
        texts: ["teacher-provided text"],
        practiceTasks: ["guided practice", "curriculum-aligned guided practice"],
        lessonSegments: [],
      },
    } as any

    const result = resolveBlueprintContent({
      curriculumMaterials: [],
      curriculumAnalyses: [curriculumAnalysis],
      inputs: {
        standard: "",
        grade: "K",
        subject: "ELA",
        skill: "Long A phonics",
        topic: "",
      },
      target: {
        primary: "phonics",
        secondary: null,
        isMixedTarget: false,
        recommendedMode: "full",
      } as any,
    })

    expect(result.vocabulary).toEqual(expect.arrayContaining(["long a", "silent e"]))
    expect(result.vocabulary.join(" ")).not.toContain("Identify and use new vocabulary")
    expect(result.wordLists).toEqual(expect.arrayContaining(["cake", "game", "lake"]))
    expect(result.wordLists.join(" ")).not.toContain("Read high-frequency words")
    expect(result.texts[0]).toContain("Short decodable")
    expect(result.practiceIdeas).toEqual(
      expect.arrayContaining(["Read and sort long a CVCe words"])
    )
    expect(result.practiceIdeas.join(" ")).not.toContain("guided practice")
  })


  it("uses individually confirmed standards from the textarea instead of one raw combined string", () => {
    const result = resolveBlueprintContent({
      curriculumMaterials: [],
      curriculumAnalyses: [],
      inputs: {
        standard: "ELA.K.F.1.3: Demonstrate phonological awareness; e ELA.K.F.1.4: Read high-frequency words",
        grade: "K",
        subject: "ELA",
        skill: "Long A phonics",
        topic: "",
      },
      target: {
        primary: "phonics",
        secondary: null,
        isMixedTarget: false,
        recommendedMode: "full",
      } as any,
    })

    expect(result.standards).toEqual([
      "ELA.K.F.1.3: Demonstrate phonological awareness",
      "ELA.K.F.1.4: Read high-frequency words",
    ])
  })

  it("keeps standards descriptions out of vocabulary, word list, text, and practice lanes", () => {
    const curriculumAnalysis = {
      standards: [
        "ELA.K.F.1.3: Demonstrate phonological awareness",
        "ELA.K.F.1.4: Read high-frequency words",
        "ELA.K.V.1.1: Identify and use new vocabulary",
      ],
      vocabulary: ["ELA.K.V.1.1: Identify and use new vocabulary", "silent e"],
      wordLists: ["ELA.K.F.1.4: Read high-frequency words", "cake, game, lake"],
      texts: ["ELA.K.R.2.1: Identify the main topic and key details in a text", "Short decodable text about long a words"],
      practiceTasks: ["guided practice", "Read and sort long a CVCe words"],
      instructionalTargets: ["Blend and read long a words."],
      examples: [],
      coverage: {
        standards: [
          "ELA.K.F.1.3: Demonstrate phonological awareness",
          "ELA.K.F.1.4: Read high-frequency words",
          "ELA.K.V.1.1: Identify and use new vocabulary",
        ],
        instructionalTargets: ["Blend and read long a words."],
        foundationalSkills: [],
        sightWords: [],
        vocabulary: ["ELA.K.V.1.1: Identify and use new vocabulary"],
        wordLists: ["ELA.K.F.1.4: Read high-frequency words", "cake, game, lake"],
        texts: ["ELA.K.R.2.1: Identify the main topic and key details in a text", "Short decodable text about long a words"],
        practiceTasks: ["guided practice", "Read and sort long a CVCe words"],
        lessonSegments: [],
      },
    } as any

    const result = resolveBlueprintContent({
      curriculumMaterials: [],
      curriculumAnalyses: [curriculumAnalysis],
      inputs: {
        standard: "",
        grade: "K",
        subject: "ELA",
        skill: "Long A phonics",
        topic: "",
      },
      target: {
        primary: "phonics",
        secondary: null,
        isMixedTarget: false,
        recommendedMode: "full",
      } as any,
    })

    expect(result.vocabulary).toEqual(["silent e"])
    expect(result.wordLists).toEqual(["cake, game, lake"])
    expect(result.texts).toEqual(["Short decodable text about long a words"])
    expect(result.practiceIdeas).toEqual(["Read and sort long a CVCe words"])
  })

})
