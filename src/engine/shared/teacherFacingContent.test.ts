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

  it("keeps grounding items free of generic standards headings and OCR junk", () => {
    const joined = getBlueprintContentGroundingItems(blueprint).join(" | ")
    expect(joined).toContain("ELA.K.F.1.1")
    expect(joined).not.toContain("HB Florida B.E.S.T. Standards")
    expect(joined).not.toContain("Ses tpe metic")
  })
})
