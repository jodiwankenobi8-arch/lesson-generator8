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

  it("harvests curriculum coverage signals from noisy slide and PDF-style extraction lines", async () => {
    const result = await analyzeMaterial({
      materialId: "curr-2",
      role: "curriculum",
      name: "noisy-curriculum.txt",
      extractedText: [
        "Notes: Slide 4/12: Practice Words: cake, game, same, late",
        "Text: Let's read together: Jake made a cake at the lake.",
        "Slide 5: Phonemic Awareness: blend the sounds in cake and late.",
        "Slide 6: Segment & Spell: map the sounds in game.",
        "Activity Roadmap",
        "Celebration",
      ],
    })

    const curriculum = result.analysis.curriculum
    expect(curriculum).toBeTruthy()
    expect(curriculum?.wordLists).not.toContain("teacher-selected word list")
    expect(curriculum?.texts).not.toContain("teacher-provided lesson text")
    expect(curriculum?.practiceTasks).not.toContain("curriculum-aligned practice task")
    expect(curriculum?.wordLists.length ?? 0).toBeGreaterThan(0)
    expect(curriculum?.texts.length ?? 0).toBeGreaterThan(0)
    expect(curriculum?.practiceTasks.length ?? 0).toBeGreaterThan(0)
  })

  it("harvests noisy curriculum vocabulary and practice cues from slide-style extraction", async () => {
    const result = await analyzeMaterial({
      materialId: "curr-3",
      role: "curriculum",
      name: "noisy-curriculum-vocab.txt",
      extractedText: [
        "Notes: Slide 3/12: Vocabulary: vowel team - two letters that make one sound",
        "Slide 4: Guided Practice: Sort ai and ay words with a partner",
        "Text: Read Aloud: Gail waited for the train.",
      ],
    })

    const curriculum = result.analysis.curriculum
    expect(curriculum).toBeTruthy()
    expect(curriculum?.vocabulary).not.toContain("key vocabulary")
    expect(curriculum?.practiceTasks).not.toContain("curriculum-aligned practice task")
    expect(curriculum?.texts).not.toContain("teacher-provided lesson text")
    expect(curriculum?.vocabulary.length ?? 0).toBeGreaterThan(0)
    expect(curriculum?.practiceTasks.length ?? 0).toBeGreaterThan(0)
    expect(curriculum?.texts.length ?? 0).toBeGreaterThan(0)
  })


  it("keeps standards descriptions out of curriculum content lanes and preserves concrete phonics cues", async () => {
    const result = await analyzeMaterial({
      materialId: "curr-standards-noise",
      role: "curriculum",
      name: "curriculum-standards-noise.txt",
      extractedText: [
        "ELA.K.F.1.4: Read high-frequency words",
        "ELA.K.V.1.1: Identify and use new vocabulary",
        "Phonics Prior Knowledge: vowel sounds, with a focus on long A in CVCe words (a_e).",
        "Word List: cake, game, lake, name",
        "Guided Practice: Read and sort long a CVCe words.",
      ],
    })

    const curriculum = result.analysis.curriculum
    expect(curriculum).toBeTruthy()

    const vocabulary = (curriculum?.vocabulary ?? []).join(" | ").toLowerCase()
    const wordLists = (curriculum?.wordLists ?? []).join(" | ").toLowerCase()
    const practice = (curriculum?.practiceTasks ?? []).join(" | ").toLowerCase()

    expect(vocabulary).not.toContain("identify and use new vocabulary")
    expect(wordLists).not.toContain("read high-frequency words")
    expect(wordLists).toContain("cake")
    expect(practice).toContain("guided practice")
    expect(practice).not.toContain("read high-frequency words")
  })

  it("prefers cleaned curriculum candidates over raw noisy slide lines", async () => {
    const result = await analyzeMaterial({
      materialId: "curr-4",
      role: "curriculum",
      name: "cleaned-curriculum-candidates.txt",
      extractedText: [
        "Notes: Slide 3/12: Vocabulary: vowel team - two letters that make one sound",
        "Slide 4: Guided Practice: Sort ai and ay words with a partner",
        "Text: Read Aloud: Gail waited for the train. Page 3 of 12",
      ],
    })

    const curriculum = result.analysis.curriculum
    expect(curriculum).toBeTruthy()

    const joinedVocabulary = (curriculum?.vocabulary ?? []).join(" ").toLowerCase()
    const joinedPractice = (curriculum?.practiceTasks ?? []).join(" ").toLowerCase()
    const joinedTexts = (curriculum?.texts ?? []).join(" ").toLowerCase()

    expect(joinedVocabulary).toContain("vocabulary: vowel team")
    expect(joinedVocabulary).not.toContain("notes: slide 3/12")
    expect(joinedPractice).toContain("guided practice: sort ai and ay words with a partner")
    expect(joinedPractice).not.toContain("slide 4:")
    expect(joinedTexts).toContain("read aloud: gail waited for the train")
    expect(joinedTexts).not.toContain("text:")
    expect(joinedTexts).not.toContain("page 3 of 12")
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

  it("detects teacher-delivery cues from note-style exemplar text", async () => {
    const result = await analyzeMaterial({
      materialId: "ex-3",
      role: "exemplar",
      name: "teacher-notes-exemplar.txt",
      extractedText: [
        "Teacher Note: Preview lesson steps before students begin.",
        "Notes: Students echo the target word after you model it.",
        "Watch and listen.",
        "My turn, your turn.",
        "Say it with me.",
        "Circulate and give fast feedback.",
        "Guided Practice",
        "Closure",
      ],
    })

    const exemplar = result.analysis.exemplar
    expect(exemplar).toBeTruthy()

    const joinedMoves = (exemplar?.teacherMoves ?? []).join(" ").toLowerCase()
    const joinedPrompts = (exemplar?.promptStyle ?? []).join(" ").toLowerCase()
    const keys = (exemplar?.detectedFeatures?.items ?? []).map((item) => item.key)

    expect(joinedMoves).toMatch(/teacher note|watch and listen|my turn|say it with me|circulate|echo/)
    expect(joinedPrompts).toMatch(/watch and listen|my turn|your turn|say it with me|preview lesson steps/)
    expect(keys).toEqual(
      expect.arrayContaining([
        "teacher_prompt_blocks",
        "teacher_scripts",
        "guided_practice",
        "closure",
      ])
    )
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


