import { describe, expect, it } from "vitest"
import { buildLessonPlanningIdeas } from "./buildLessonPlanningIdeas"

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
      "pacing, modeling, guided practice, and",
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
      lessonSegments: ["Opening", "Teach", "Guided Practice", "Independent Practice", "Closure"],
    },
  },
  structure: {
    lessonSegments: ["Opening", "Teach", "Guided Practice", "Independent Practice", "Closure"],
    timing: ["Opening", "Mini-lesson", "Guided Practice"],
    teacherMoves: ["teacher model", "guided support"],
    promptStyle: ["teacher prompt"],
    tone: ["clear instructional tone"],
    templateShell: {
      slideShell: ["Objective / Opening", "Model / Teach", "Guided Practice", "Independent Practice", "Closure / Check"],
    },
  },
} as any

describe("buildLessonPlanningIdeas", () => {
  it("uses normalized blueprint content instead of noisy raw OCR/admin values", () => {
    const result = buildLessonPlanningIdeas(blueprint)
    const joined = JSON.stringify(result)

    expect(joined).toContain("Word List: made, same, late, cake")
    expect(joined).toContain("Read and sort long a words")
    expect(joined).not.toContain("Unit: Unit 3")
    expect(joined).not.toContain("HB Florida B.E.S.T. Standards")
    expect(joined).not.toContain("Ses tpe metic")
    expect(joined).not.toContain("Savvas story slides")
  })
})
