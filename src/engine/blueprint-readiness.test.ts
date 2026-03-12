import { describe, expect, it } from "vitest"
import { buildBlueprint } from "./blueprint/buildBlueprint"

describe("blueprint source readiness", () => {
  it("uses exemplar-provided structure when both curriculum and exemplar materials are present", () => {
    const result = buildBlueprint(
      {
        grade: "1",
        subject: "ELA",
        standard: "RF.1.3",
        skill: "Long A",
        topic: "Long a words",
        duration: "30 minutes",
      },
      [
        {
          id: "curr-1",
          role: "curriculum",
          name: "curriculum.txt",
          status: "ready",
          fileBuffer: null,
          fileContent: null,
          analysis: {
            sourceRole: "curriculum",
            summary: "Curriculum material with long a content support.",
            extractedText: [
              "Objective: Students will read long a words.",
              "Practice: Read the word list aloud.",
            ],
            tags: ["phonics", "long a", "curriculum"],
            curriculum: {
              standards: ["RF.1.3"],
              vocabulary: ["long a"],
              wordLists: ["cake, game, same, late"],
              texts: ["Students read long a words in context."],
              practiceTasks: ["Read the word list aloud."],
              instructionalTargets: ["Students will read long a words."],
              examples: ["cake"],
            },
          },
          errorMessage: null,
          styleSettings: null,
        },
        {
          id: "ex-1",
          role: "exemplar",
          name: "exemplar.txt",
          status: "ready",
          fileBuffer: null,
          fileContent: null,
          analysis: {
            sourceRole: "exemplar",
            summary: "Exemplar material with lesson structure support.",
            extractedText: [
              "Opening",
              "Teach",
              "Guided practice",
              "Closure",
            ],
            tags: ["exemplar", "structure", "slides"],
            exemplar: {
              slideFlow: ["opening", "teach", "practice", "closure"],
              pacing: ["5 min launch", "10 min model", "10 min practice"],
              teacherMoves: ["Model blending", "Guide student response"],
              promptStyle: ["Call and response"],
              layoutCues: ["Large word display"],
              tone: ["explicit", "supportive"],
              reusableStructure: ["I do, we do, you do"],
            },
          },
          errorMessage: null,
          styleSettings: null,
        },
      ],
      "full"
    )

    expect(result.content.standards).toContain("RF.1.3")
    expect(result.structure.timing).toEqual([
      "5 min launch",
      "10 min model",
      "10 min practice",
    ])
    expect(result.structure.lessonSegments).toEqual(
      expect.arrayContaining(["Opening", "Teach", "Practice", "Closure"])
    )
    expect(result.structure.teacherMoves.length).toBeGreaterThan(0)
    expect(result.structure.promptStyle.length).toBeGreaterThan(0)
    expect(result.sourceReadiness.overall).toBe("balanced")
  })

  it("uses fallback structure when curriculum is present without exemplar support", () => {
    const result = buildBlueprint(
      {
        grade: "1",
        subject: "ELA",
        standard: "RF.1.3",
        skill: "Long A",
        topic: "Long a words",
        duration: "30 minutes",
      },
      [
        {
          id: "curr-1",
          role: "curriculum",
          name: "curriculum.txt",
          status: "ready",
          fileBuffer: null,
          fileContent: null,
          analysis: {
            sourceRole: "curriculum",
            summary: "Curriculum material with long a content support.",
            extractedText: [
              "Objective: Students will read long a words.",
              "Practice: Read the word list aloud.",
            ],
            tags: ["phonics", "long a", "curriculum"],
            curriculum: {
              standards: ["RF.1.3"],
              vocabulary: ["long a"],
              wordLists: ["cake, game, same, late"],
              texts: ["Students read long a words in context."],
              practiceTasks: ["Read the word list aloud."],
              instructionalTargets: ["Students will read long a words."],
              examples: ["cake"],
            },
          },
          errorMessage: null,
          styleSettings: null,
        },
      ],
      "full"
    )

    expect(result.content.standards).toContain("RF.1.3")
    expect(result.structure.timing).toEqual([
      "Part 1 - 10 min",
      "Part 2 - 10 min",
      "Closure - 5 min",
    ])
    expect(result.structure.lessonSegments).toEqual([
      "Part 1",
      "Part 2",
      "Closure",
    ])
    expect(result.sourceReadiness.overall).toBe("content_heavy")
  })
})
