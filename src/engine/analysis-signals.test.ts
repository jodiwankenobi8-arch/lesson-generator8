import { describe, expect, it } from "vitest"
import { analyzeMaterial } from "./materials/analyzeMaterial"

describe("material analysis signals", () => {
  it("detects richer curriculum signals from structured lesson text", async () => {
    const result = await analyzeMaterial({
      materialId: "curr-1",
      role: "curriculum",
      name: "curriculum.txt",
      extractedText: [
        "Standard: RF.1.3",
        "Objective: Students will read long a words.",
        "Learning Target: I can decode long a words with silent e.",
        "Vocabulary: decode - to read a word by matching sounds to letters",
        "Word List: cake, game, same, late",
        "Passage: Jake made a cake at the lake.",
        "Guided Practice: Read the word list aloud with a partner.",
        "Independent Practice: Write a sentence using one long a word.",
        "Teacher Example: cake",
      ],
    })

    expect(result.analysis.sourceRole).toBe("curriculum")
    expect(result.analysis.curriculum?.standards).toContain("Standard: RF.1.3")
    expect(result.analysis.curriculum?.instructionalTargets.length ?? 0).toBeGreaterThanOrEqual(2)
    expect(result.analysis.curriculum?.vocabulary.length ?? 0).toBeGreaterThan(0)
    expect(result.analysis.curriculum?.wordLists.length ?? 0).toBeGreaterThan(0)
    expect(result.analysis.curriculum?.texts.length ?? 0).toBeGreaterThan(0)
    expect(result.analysis.curriculum?.practiceTasks.length ?? 0).toBeGreaterThanOrEqual(2)
    expect(result.analysis.curriculum?.examples.length ?? 0).toBeGreaterThan(0)
    expect(result.analysis.tags).toEqual(
      expect.arrayContaining([
        "standards",
        "vocabulary",
        "word work",
        "practice",
        "instruction",
        "phonics",
        "long a",
      ])
    )
  })

  it("detects richer exemplar signals and detected features from lesson-delivery text", async () => {
    const result = await analyzeMaterial({
      materialId: "ex-1",
      role: "exemplar",
      name: "exemplar.txt",
      extractedText: [
        "Opening",
        "Objective: Students will blend long a words.",
        "5 min launch",
        "Teacher says: Watch how I blend these sounds.",
        "Model the decoding process.",
        "Prompt students to repeat the word.",
        "Question stem: What do you notice about the vowel pattern?",
        "Turn and talk to explain your answer.",
        "Guided Practice",
        "Independent Practice",
        "Closure",
        "Exit Ticket: Read one new word.",
        "Use a large word card and visual box.",
        "Use a picture and table to organize thinking.",
        "Color highlight the vowel team.",
        "Word List: cake, game, late",
        "Passage: Jake made a cake at the lake.",
        "I do, we do, you do.",
      ],
    })

    expect(result.analysis.sourceRole).toBe("exemplar")
    expect(result.analysis.exemplar?.slideFlow.length ?? 0).toBeGreaterThan(0)
    expect(result.analysis.exemplar?.pacing).toContain("5 min launch")
    expect(result.analysis.exemplar?.teacherMoves.length ?? 0).toBeGreaterThanOrEqual(2)
    expect(result.analysis.exemplar?.promptStyle.length ?? 0).toBeGreaterThanOrEqual(2)
    expect(result.analysis.exemplar?.layoutCues.length ?? 0).toBeGreaterThan(0)
    expect(result.analysis.exemplar?.reusableStructure.length ?? 0).toBeGreaterThan(0)
    expect(result.analysis.tags).toEqual(
      expect.arrayContaining(["slide flow", "pacing", "teacher prompts", "layout", "structure"])
    )

    const detected = result.analysis.exemplar?.detectedFeatures
    expect(detected).toBeTruthy()
    expect(detected?.items.length ?? 0).toBeGreaterThanOrEqual(10)
    expect(detected?.warnings).toBeDefined()

    const keys = (detected?.items ?? []).map((item) => item.key)
    expect(keys).toEqual(
      expect.arrayContaining([
        "turn_and_talk",
        "teacher_prompt_blocks",
        "teacher_scripts",
        "objective_slide",
        "guided_practice",
        "independent_practice",
        "closure",
        "exit_ticket",
        "timers",
      ])
    )

    expect(
      keys.some((key) =>
        [
          "image_slots",
          "table_layout",
          "split_layout",
          "color_theme",
          "visual_theme",
        ].includes(key)
      )
    ).toBe(true)

    expect(
      keys.some((key) =>
        [
          "word_list_slots",
          "passage_slots",
          "practice_task_slots",
        ].includes(key)
      )
    ).toBe(true)

    const turnAndTalk = detected?.items.find((item) => item.key === "turn_and_talk")
    expect(turnAndTalk?.category).toBe("interaction")
    expect(turnAndTalk?.confidence ?? 0).toBeGreaterThan(0)
    expect(turnAndTalk?.evidence.join(" ").toLowerCase()).toContain("turn and talk")
  })

  it("adds sensible warnings when exemplar text is too thin for strong feature detection", async () => {
    const result = await analyzeMaterial({
      materialId: "ex-2",
      role: "exemplar",
      name: "thin-exemplar.txt",
      extractedText: [
        "Lesson",
        "Teach",
        "Practice",
      ],
    })

    const detected = result.analysis.exemplar?.detectedFeatures

    expect(detected).toBeTruthy()
    expect(detected?.warnings.join(" ")).toContain("Visual/style features may be under-detected")
  })
})
