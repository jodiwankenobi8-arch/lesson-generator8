import { describe, expect, it } from "vitest"
import {
  getBlueprintContentGroundingItems,
  getNormalizedBlueprintValues,
} from "./teacherFacingContent"

const blueprint = {
  content: {
    target: {
      primary: "phonics",
      secondary: null,
      isMixedTarget: false,
      recommendedMode: "full",
    },
    standards: ["HB Florida B.E.S.T. Standards", "ELA.K.F.1.1"],
    vocabulary: [
      "Ses tpe metic parses blending practice, story visuals, and, up/down, and letter-sound motions).",
      "long a",
    ],
    wordLists: [
      "Unit: Unit 3, Week 4, Day 3 Programs: UFLI + Savvas",
      "Word List: made, same, late, cake",
    ],
    texts: [
      "Savvas story slides for The Best Story",
      "Decodable passage: Jake made a cake at the lake.",
    ],
    practiceIdeas: [
      "@® Materials, Educational Technology, and Sources",
      "Read and sort long a words",
    ],
    coverage: {
      standards: ["HB Florida B.E.S.T. Standards", "ELA.K.F.1.1"],
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
  structure: {
    lessonSegments: ["Opening", "Teach", "Guided Practice", "Closure"],
  },
} as any

describe("teacherFacingContent", () => {
  it("filters noisy curriculum/admin values from normalized blueprint content", () => {
    expect(getNormalizedBlueprintValues(blueprint, "standard")).toEqual(["ELA.K.F.1.1"])
    expect(getNormalizedBlueprintValues(blueprint, "wordList").join(" ")).toContain("Word List: made, same, late, cake")
    expect(getNormalizedBlueprintValues(blueprint, "wordList").join(" ")).not.toContain("Unit: Unit 3")
    expect(getNormalizedBlueprintValues(blueprint, "text").join(" ")).toContain("Decodable passage: Jake made a cake at the lake.")
    expect(getNormalizedBlueprintValues(blueprint, "text").join(" ")).not.toContain("Savvas story slides")
    expect(getNormalizedBlueprintValues(blueprint, "practice").join(" ")).toContain("Read and sort long a words")
    expect(getNormalizedBlueprintValues(blueprint, "practice").join(" ")).not.toContain("Materials, Educational Technology, and Sources")
  })

  it("keeps grounding items focused on actual lesson content before standards and free of OCR junk", () => {
    const joined = getBlueprintContentGroundingItems(blueprint).join(" | ")
    expect(joined).toContain("long a")
    expect(joined).toContain("Word List: made, same, late, cake")
    expect(joined).toContain("Decodable passage: Jake made a cake at the lake.")
    expect(joined).not.toContain("HB Florida B.E.S.T. Standards")
    expect(joined).not.toContain("Ses tpe metic")
  })

  it("narrows auto-selected standards to the active phonics target when off-target standards leak in", () => {
    const standardsBlueprint = {
      ...blueprint,
      content: {
        ...blueprint.content,
        target: {
          primary: "phonics",
          secondary: null,
          isMixedTarget: false,
          recommendedMode: "single",
        },
        standards: [
          "ELA.K.F.1.3: Demonstrate phonological awareness",
          "ELA.K.F.1.4: Read high-frequency words",
          "ELA.K.R.2.1: Identify the main topic and key details in a text (Author's Purpose)",
          "ELA.K.V.1.1: Identify and use new vocabulary",
        ],
        coverage: {
          ...blueprint.content.coverage,
          standards: [
            "ELA.K.F.1.3: Demonstrate phonological awareness",
            "ELA.K.F.1.4: Read high-frequency words",
            "ELA.K.R.2.1: Identify the main topic and key details in a text (Author's Purpose)",
            "ELA.K.V.1.1: Identify and use new vocabulary",
          ],
        },
      },
    } as any

    expect(getNormalizedBlueprintValues(standardsBlueprint, "standard")).toEqual([
      "ELA.K.F.1.3: Demonstrate phonological awareness",
      "ELA.K.F.1.4: Read high-frequency words",
    ])
  })

  it("drops standards-style placeholders from non-standard teacher-facing content", () => {
    const placeholderBlueprint = {
      ...blueprint,
      content: {
        ...blueprint.content,
        standards: [
          "ELA.K.F.1.3: Demonstrate phonological awareness",
          "ELA.K.F.1.4: Read high-frequency words",
        ],
        vocabulary: [
          "ELA.K.V.1.1: Identify and use new vocabulary",
          "long a",
          "silent e",
        ],
        wordLists: [
          "ELA.K.F.1.4: Read high-frequency words",
          "teacher-selected examples",
          "cake",
          "game",
          "lake",
        ],
        texts: [
          "teacher-provided text",
          "Short decodable text featuring long a CVCe words",
        ],
        practiceIdeas: [
          "guided practice",
          "curriculum-aligned guided practice",
          "Read and sort long a CVCe words",
        ],
      },
    } as any

    expect(getNormalizedBlueprintValues(placeholderBlueprint, "vocabulary")).toEqual([
      "long a",
      "silent e",
    ])
    const wordLists = getNormalizedBlueprintValues(placeholderBlueprint, "wordList")
    expect(wordLists.join(" | ")).toContain("cake")
    expect(wordLists.join(" | ")).toContain("game")
    expect(wordLists.join(" | ")).toContain("lake")
    expect(wordLists.join(" | ")).not.toContain("ELA.K.F.1.4: Read high-frequency words")
    const texts = getNormalizedBlueprintValues(placeholderBlueprint, "text")
    expect(texts.join(" | ")).toContain("Short decodable text featuring long a CVCe words")
    expect(texts.join(" | ")).not.toContain("teacher-provided text")
    const practice = getNormalizedBlueprintValues(placeholderBlueprint, "practice")
    expect(practice.join(" | ")).toContain("Read and sort long a")
    expect(practice.join(" | ")).not.toContain("guided practice")
  })

})
