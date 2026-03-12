import { describe, expect, it } from "vitest"
import { analyzeMaterial } from "./materials/analyzeMaterial"

describe("material analysis signals", () => {
  it("detects instructional targets and practice tasks from curriculum text", async () => {
    const result = await analyzeMaterial({
      materialId: "curr-1",
      role: "curriculum",
      name: "curriculum.txt",
      extractedText: [
        "Objective: Students will read long a words.",
        "Practice: Read the word list aloud.",
        "Word list: cake, game, same, late",
        "Teacher models blending.",
      ],
    })

    expect(result.materialId).toBe("curr-1")
    expect(result.analysis.sourceRole).toBe("curriculum")
    expect(result.analysis.curriculum?.instructionalTargets.length ?? 0).toBeGreaterThan(0)
    expect(result.analysis.curriculum?.practiceTasks.length ?? 0).toBeGreaterThan(0)
  })

  it("detects teacher moves and prompts from exemplar text", async () => {
    const result = await analyzeMaterial({
      materialId: "ex-1",
      role: "exemplar",
      name: "exemplar.txt",
      extractedText: [
        "Teacher says: Watch how I blend these sounds.",
        "Prompt students to repeat the word.",
        "Model the decoding process.",
        "Guide students through the example.",
      ],
    })

    expect(result.materialId).toBe("ex-1")
    expect(result.analysis.sourceRole).toBe("exemplar")
    expect(result.analysis.exemplar?.teacherMoves.length ?? 0).toBeGreaterThan(0)
    expect(result.analysis.exemplar?.promptStyle.length ?? 0).toBeGreaterThan(0)
  })
})
