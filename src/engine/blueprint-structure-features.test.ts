import { describe, expect, it } from "vitest"
import { buildBlueprint } from "./blueprint/buildBlueprint"
import { ExemplarDetectedFeatures, MaterialAnalysis, MaterialFile } from "./types"

function makeExemplarAnalysis(detectedFeatures: ExemplarDetectedFeatures): MaterialAnalysis {
  return {
    sourceRole: "exemplar",
    summary: "Exemplar material with detected structural features.",
    extractedText: [],
    tags: ["exemplar", "structure"],
    exemplar: {
      slideFlow: [],
      pacing: [],
      teacherMoves: [],
      promptStyle: [],
      layoutCues: [],
      tone: [],
      reusableStructure: [],
      detectedFeatures,
    },
  }
}

function makeExemplarMaterial(
  id: string,
  detectedFeatures: ExemplarDetectedFeatures
): MaterialFile {
  return {
    id,
    role: "exemplar",
    name: `${id}.txt`,
    status: "ready",
    fileBuffer: null,
    fileContent: null,
    analysis: makeExemplarAnalysis(detectedFeatures),
    errorMessage: null,
    styleSettings: null,
    transformationRequest: null,
  }
}

describe("blueprint structure from exemplar detected features", () => {
  it("strengthens timing, interaction, segments, and template shell from detected exemplar features", () => {
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
        makeExemplarMaterial("ex-1", {
          items: [
            {
              key: "timers",
              label: "Timers",
              description: "Includes explicit timers.",
              evidence: ["5 min launch", "10 min practice"],
              confidence: 0.9,
              category: "pacing",
            },
            {
              key: "turn_and_talk",
              label: "Turn and Talk",
              description: "Includes turn and talk prompts.",
              evidence: ["Turn and talk to your partner."],
              confidence: 0.75,
              category: "interaction",
            },
            {
              key: "teacher_prompt_blocks",
              label: "Teacher Prompt Blocks",
              description: "Includes teacher prompts.",
              evidence: ["Prompt students to explain."],
              confidence: 0.75,
              category: "interaction",
            },
            {
              key: "objective_slide",
              label: "Objective Slide",
              description: "Includes lesson objective slide.",
              evidence: ["Objective: Students will read long a words."],
              confidence: 0.75,
              category: "instructional_flow",
            },
            {
              key: "guided_practice",
              label: "Guided Practice",
              description: "Includes guided practice.",
              evidence: ["Guided Practice"],
              confidence: 0.75,
              category: "instructional_flow",
            },
            {
              key: "independent_practice",
              label: "Independent Practice",
              description: "Includes independent practice.",
              evidence: ["Independent Practice"],
              confidence: 0.75,
              category: "instructional_flow",
            },
            {
              key: "exit_ticket",
              label: "Exit Ticket",
              description: "Includes exit ticket.",
              evidence: ["Exit Ticket"],
              confidence: 0.75,
              category: "instructional_flow",
            },
            {
              key: "word_list_slots",
              label: "Word List Slots",
              description: "Includes word-list slotting.",
              evidence: ["Word List: cake, game, late"],
              confidence: 0.75,
              category: "content_slots",
            },
          ],
          warnings: [],
        }),
      ],
      "single"
    )

    expect(result.structure.timing).toEqual([
      "Launch - 5 min",
      "Teach - 10 min",
      "Practice - 10 min",
      "Closure - 5 min",
    ])

    expect(result.structure.lessonSegments).toEqual(
      expect.arrayContaining([
        "Opening",
        "Guided Practice",
        "Independent Practice",
        "Closure",
      ])
    )

    expect(result.structure.teacherMoves).toEqual(
      expect.arrayContaining([
        "Teacher-led prompting",
        "Turn and talk facilitation",
      ])
    )

    expect(result.structure.promptStyle).toEqual(
      expect.arrayContaining([
        "Teacher prompt block",
        "Turn and talk",
      ])
    )

    expect(result.structure.templateShell.slideShell).toEqual(
      expect.arrayContaining([
        "Objective / Opening",
        "Closure / Check",
      ])
    )

    expect(
      result.structure.templateShell.slideShell.some((label) =>
        ["Word List / Practice", "Guided Practice", "Independent Practice"].includes(label)
      )
    ).toBe(true)
  })

  it("adds reusable interaction and layout slots from detected exemplar features", () => {
    const result = buildBlueprint(
      {
        grade: "4",
        subject: "Science",
        standard: "Teacher-selected standard",
        skill: "Compare examples and non-examples",
        topic: "Animal adaptations",
        duration: "35 minutes",
      },
      [
        makeExemplarMaterial("ex-structure", {
          items: [
            {
              key: "mini_lesson",
              label: "Mini-Lesson",
              description: "Includes explicit modeling.",
              evidence: ["Mini-lesson: model the comparison routine."],
              confidence: 0.8,
              category: "instructional_flow",
            },
            {
              key: "call_and_response",
              label: "Call and Response",
              description: "Includes echo responses.",
              evidence: ["Students echo the key phrase."],
              confidence: 0.8,
              category: "interaction",
            },
            {
              key: "example_non_example",
              label: "Example / Non-Example",
              description: "Includes example/non-example formatting.",
              evidence: ["Example / Non-example"],
              confidence: 0.8,
              category: "content_slots",
            },
            {
              key: "anchor_chart_layout",
              label: "Anchor Chart Layout",
              description: "Includes anchor chart shell.",
              evidence: ["Anchor chart: adaptation evidence."],
              confidence: 0.8,
              category: "visual_layout",
            },
            {
              key: "curriculum_slide_slots",
              label: "Curriculum Content Slots",
              description: "Includes replaceable source-content slots.",
              evidence: ["Curriculum slide: source text goes here."],
              confidence: 0.8,
              category: "content_slots",
            },
          ],
          warnings: [],
        }),
      ],
      "single"
    )

    expect(result.structure.templateShell.slideShell).toEqual(
      expect.arrayContaining([
        "Model / Teach",
        "Call and Response",
        "Example / Non-Example",
        "Anchor Chart / Model",
        "Curriculum Content Slot",
      ])
    )
  })

  it("adds content-slot shell signals from detected exemplar features", () => {
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
        makeExemplarMaterial("ex-2", {
          items: [
            {
              key: "passage_slots",
              label: "Passage Slots",
              description: "Includes passage slotting.",
              evidence: ["Passage: Jake made a cake at the lake."],
              confidence: 0.75,
              category: "content_slots",
            },
            {
              key: "practice_task_slots",
              label: "Practice Task Slots",
              description: "Includes practice-task slotting.",
              evidence: ["Practice task"],
              confidence: 0.75,
              category: "content_slots",
            },
            {
              key: "image_slots",
              label: "Image Slots",
              description: "Includes image slotting.",
              evidence: ["Picture here"],
              confidence: 0.75,
              category: "visual_layout",
            },
            {
              key: "table_layout",
              label: "Table Layout",
              description: "Includes table layout.",
              evidence: ["Use a table"],
              confidence: 0.75,
              category: "visual_layout",
            },
          ],
          warnings: [],
        }),
      ],
      "single"
    )

    expect(result.structure.templateShell.slideShell).toEqual(
      expect.arrayContaining([
        "Passage / Text",
        "Practice Task",
        "Visual / Image",
      ])
    )

    expect(
      result.structure.templateShell.slideShell.some((label) =>
        ["Table / Sort", "Practice Task", "Visual / Image"].includes(label)
      )
    ).toBe(true)
  })
})
