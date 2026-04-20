import { describe, expect, it } from "vitest"
import type { LessonInputs, MaterialFile } from "../types"
import { buildCompactInferredMaterialReview } from "./buildCompactInferredMaterialReview"

const phonicsInputs: LessonInputs = {
  grade: "1",
  subject: "ELA",
  standard: "RF.1.3",
  skill: "Long A phonics",
  topic: "Decode long a words with silent e",
  duration: "30 minutes",
  notes: "Use decodable text only",
}

describe("buildCompactInferredMaterialReview", () => {
  it("turns noisy phonics curriculum signals into a short teacher-ready quick draft", () => {
    const material: MaterialFile = {
      id: "curriculum-1",
      name: "curriculum.pdf",
      role: "curriculum",
      status: "ready",
      errorMessage: null,
      fileBuffer: null,
      fileContent: null,
      analysis: {
        summary: "Curriculum summary",
        extractedText: [],
        tags: [],
        sourceRole: "curriculum",
        curriculum: {
          standards: ["ELA.K.F.1.3: Demonstrate phonological awareness"],
          vocabulary: [
            "Notes: Slide 3/12: Vocabulary: long a, silent e, vowel pattern",
            "author's purpose",
            "https://district.example/resource",
          ],
          wordLists: [
            "Word List: cake, lake, made, same",
            "phonics) Edition)",
            "Story events",
          ],
          texts: [
            "Savvas story slides for The Best Story",
            "Decodable passage: Jake made a cake at the lake.",
          ],
          practiceTasks: [
            "Guided Practice: blend and read long-a words",
            "Independent Practice: sort short a vs long a",
            "Discuss the author's purpose of the story",
          ],
          instructionalTargets: ["Learning Target: Students will decode long a words with silent e."],
          examples: ["made"],
        },
      },
    }

    const review = buildCompactInferredMaterialReview(material, phonicsInputs)

    expect(review).toEqual({
      standards: ["ELA.K.F.1.3: Demonstrate phonological awareness"],
      vocabulary: ["long a", "silent e", "vowel pattern"],
      wordLists: ["cake", "lake", "made", "same"],
      instructionalTargets: ["Students will decode long a words with silent e."],
      texts: ["Decodable passage for Long A phonics"],
      practiceIdeas: ["Blend and read long-a words", "Sort short a vs long a"],
      exemplarStructure: [],
      teacherSummary: "",
    })
  })

  it("builds teacher-meaningful exemplar structure cues instead of raw labels", () => {
    const material: MaterialFile = {
      id: "exemplar-1",
      name: "exemplar.pdf",
      role: "exemplar",
      status: "ready",
      errorMessage: null,
      fileBuffer: null,
      fileContent: null,
      analysis: {
        summary: "Exemplar summary",
        extractedText: [],
        tags: [],
        sourceRole: "exemplar",
        exemplar: {
          slideFlow: ["Opening", "Teach", "Guided Practice", "Independent Practice", "Closure"],
          pacing: ["5 min launch", "10 min guided practice"],
          teacherMoves: ["Teacher says: model the blend", "Think aloud the vowel pattern"],
          promptStyle: ["Turn and talk", "Question stem: What do you notice?"],
          layoutCues: [],
          tone: [],
          reusableStructure: ["center", "CENTER", "I do, we do, you do"],
        },
      },
    }

    const review = buildCompactInferredMaterialReview(material, phonicsInputs)

    expect(review?.exemplarStructure).toEqual([
      "Opening",
      "Model",
      "Guided practice",
      "Independent practice",
      "Closure",
      "Turn and talk prompts",
    ])
  })
})