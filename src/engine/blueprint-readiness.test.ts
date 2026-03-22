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
    expect(result.sourceReadiness.coverageSupport).toBe("strong")
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
    expect(result.sourceReadiness.coverageSupport).toBe("strong")
    expect(result.sourceReadiness.overall).toBe("content_heavy")
  })

it("emits curriculum-side warnings without exemplar warning when exemplar is strong but curriculum is missing", () => {
  const result = buildBlueprint(
    {
      grade: "1",
      subject: "ELA",
      standard: "RF.1.3",
      skill: "Long A phonics",
      topic: "Long A vowel patterns",
      duration: "30 minutes",
    },
    [
      {
        id: "ex-strong",
        name: "exemplar.txt",
        role: "exemplar",
        status: "ready",
        analysis: {
          summary: "Strong exemplar structure.",
          extractedText: [],
          tags: ["signal-strength:8"],
          sourceRole: "exemplar",
          exemplar: {
            slideFlow: ["Opening", "Teach", "Guided Practice", "Closure"],
            pacing: ["5 minutes"],
            teacherMoves: ["Teacher prompt: What do you notice?"],
            promptStyle: ["Turn and talk to your partner."],
            layoutCues: ["Layout cue: large word display"],
            tone: ["Supportive and clear tone"],
            reusableStructure: ["I do, we do, you do."],
            detectedFeatures: {
              items: [
                {
                  key: "guided_practice",
                  label: "Guided Practice",
                  description: "Includes guided-practice structure.",
                  evidence: ["Guided Practice"],
                  confidence: 0.9,
                  category: "instructional_flow",
                },
              ],
              warnings: [],
            },
          },
        },
        errorMessage: null,
        styleSettings: null,
        transformationRequest: null,
        fileBuffer: null,
        fileContent: null,
      },
    ],
    "single"
  )

  expect(result.sourceReadiness.curriculumSupport).toBe("limited")
  expect(result.sourceReadiness.coverageSupport).toBe("limited")
  expect(result.sourceReadiness.exemplarSupport).toBe("strong")
  expect(result.sourceReadiness.overall).toBe("structure_heavy")

  expect(result.sourceReadiness.warnings).toEqual(
    expect.arrayContaining([
      "No usable curriculum materials are available, so content is relying on fallback signals.",
      "Curriculum coverage breadth still looks limited, so some lesson areas may rely on fallback logic.",
    ])
  )

  expect(result.sourceReadiness.warnings).not.toContain(
    "Exemplar materials are present, but strong structure signals still look limited."
  )
  expect(result.sourceReadiness.warnings).not.toContain(
    "No usable exemplar materials are available, so structure is relying on generic lesson flow."
  )
})
})