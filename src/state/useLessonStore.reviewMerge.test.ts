import { describe, expect, it } from "vitest"
import type { MaterialFile } from "../engine/types"
import { mergeMaterialWithReview } from "./useLessonStore"

describe("mergeMaterialWithReview", () => {
  it("treats teacher review as authoritative even when reviewed lists are cleared", () => {
    const material: MaterialFile = {
      id: "curriculum-1",
      name: "curriculum.pdf",
      role: "curriculum",
      status: "ready",
      errorMessage: null,
      fileBuffer: null,
      fileContent: null,
      analysis: {
        summary: "Raw extracted curriculum summary",
        extractedText: [],
        tags: [],
        sourceRole: "curriculum",
        curriculum: {
          standards: [
            "HB Florida B.E.S.T. Standards",
            "ELA.K.F.1.3: Demonstrate phonological awareness",
          ],
          vocabulary: [
            "Ses tpe metic parses blending practice, story visuals, and",
            "long a",
          ],
          wordLists: [
            "phonics) Edition)",
            "cake",
            "game",
          ],
          texts: [
            "Savvas story slides for The Best Story",
          ],
          practiceTasks: [
            "Materials, Educational Technology, and Sources",
            "Read and sort long a words",
          ],
          instructionalTargets: [
            "@ Learning Objective",
            "I can read words with magic e (long A).",
          ],
          examples: [],
        },
      },
      analysisReview: {
        standards: ["ELA.K.F.1.3: Demonstrate phonological awareness"],
        vocabulary: ["long a"],
        wordLists: ["cake", "game"],
        instructionalTargets: [],
        texts: [],
        practiceIdeas: ["Read and sort long a words"],
        exemplarStructure: [],
        teacherSummary: "",
      },
    }

    const merged = mergeMaterialWithReview(material)
    const curriculum = merged.analysis?.curriculum

    expect(curriculum?.standards).toEqual([
      "ELA.K.F.1.3: Demonstrate phonological awareness",
    ])
    expect(curriculum?.vocabulary).toEqual(["long a"])
    expect(curriculum?.wordLists).toEqual(["cake", "game"])
    expect(curriculum?.examples).toEqual(["cake", "game"])
    expect(curriculum?.instructionalTargets).toEqual([])
    expect(curriculum?.texts).toEqual([])
    expect(curriculum?.practiceTasks).toEqual(["Read and sort long a words"])
    expect(curriculum?.texts).not.toContain("Savvas story slides for The Best Story")
    expect(curriculum?.practiceTasks).not.toContain("Materials, Educational Technology, and Sources")
  })
})
