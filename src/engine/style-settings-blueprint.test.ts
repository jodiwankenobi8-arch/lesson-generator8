import { describe, expect, it } from "vitest"
import { buildBlueprint } from "./blueprint/buildBlueprint"
import {
  ExemplarAnalysis,
  ExemplarDetectedFeatures,
  ExemplarStyleSettings,
  MaterialAnalysis,
  MaterialFile,
} from "./types"

function makeExemplarAnalysis(
  overrides: Partial<ExemplarAnalysis> = {},
  detectedFeatures?: ExemplarDetectedFeatures
): MaterialAnalysis {
  return {
    sourceRole: "exemplar",
    summary: "Exemplar material with configurable style settings.",
    extractedText: [],
    tags: ["exemplar", "structure"],
    exemplar: {
      slideFlow: ["Opening", "Teach", "Guided Practice", "Closure"],
      pacing: ["5 min launch", "10 min model", "10 min practice"],
      teacherMoves: ["Teacher says: model first", "Guide partner response"],
      promptStyle: ["Turn and talk", "What do you notice?"],
      layoutCues: ["Large image area", "Two-column table"],
      tone: ["supportive", "clear"],
      reusableStructure: ["I do, we do, you do"],
      detectedFeatures:
        detectedFeatures ?? {
          items: [
            {
              key: "timers",
              label: "Timers",
              description: "Includes timing cues.",
              evidence: ["5 min launch"],
              confidence: 0.9,
              category: "pacing",
            },
            {
              key: "teacher_prompt_blocks",
              label: "Teacher Prompt Blocks",
              description: "Includes teacher prompts.",
              evidence: ["Prompt students to respond."],
              confidence: 0.75,
              category: "interaction",
            },
            {
              key: "turn_and_talk",
              label: "Turn and Talk",
              description: "Includes partner talk.",
              evidence: ["Turn and talk."],
              confidence: 0.75,
              category: "interaction",
            },
            {
              key: "objective_slide",
              label: "Objective Slide",
              description: "Includes objective slide.",
              evidence: ["Objective"],
              confidence: 0.75,
              category: "instructional_flow",
            },
            {
              key: "image_slots",
              label: "Image Slots",
              description: "Includes image layout.",
              evidence: ["Image area"],
              confidence: 0.75,
              category: "visual_layout",
            },
          ],
          warnings: [],
        },
      ...overrides,
    },
  }
}

function makeExemplarMaterial(
  id: string,
  styleSettings: ExemplarStyleSettings
): MaterialFile {
  return {
    id,
    role: "exemplar",
    name: `${id}.txt`,
    status: "ready",
    fileBuffer: null,
    fileContent: null,
    analysis: makeExemplarAnalysis(),
    errorMessage: null,
    styleSettings,
    transformationRequest: null,
  }
}

describe("blueprint respects exemplar style settings", () => {
  it("keeps full exemplar influence for copy_closely mode", () => {
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
        makeExemplarMaterial("ex-copy", {
          mode: "copy_closely",
          aspects: [],
          customInstructions: "",
        }),
      ],
      "single"
    )

    expect(result.structure.timing).toContain("5 min launch")
    expect(result.structure.teacherMoves.join(" ")).toContain("Teacher says: model first")
    expect(result.structure.promptStyle).toEqual(
      expect.arrayContaining(["Turn and talk", "What do you notice?"])
    )
    expect(result.structure.lessonSegments).toEqual(
      expect.arrayContaining(["Opening", "Teach", "Guided Practice", "Closure"])
    )
  })

  it("filters blueprint structure to selected aspects only", () => {
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
        makeExemplarMaterial("ex-selected", {
          mode: "selected_aspects",
          aspects: ["slide_flow", "pacing"],
          customInstructions: "",
        }),
      ],
      "single"
    )

    expect(result.structure.timing).toContain("5 min launch")
    expect(result.structure.lessonSegments).toEqual(
      expect.arrayContaining(["Opening", "Teach", "Guided Practice", "Closure"])
    )

    expect(result.structure.teacherMoves).not.toEqual(
      expect.arrayContaining(["Teacher says: model first", "Guide partner response"])
    )
    expect(result.structure.promptStyle).not.toEqual(
      expect.arrayContaining(["Turn and talk", "What do you notice?"])
    )
  })

  it("removes pacing influence when pacing is not selected", () => {
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
        makeExemplarMaterial("ex-no-pacing", {
          mode: "selected_aspects",
          aspects: ["teacher_prompts"],
          customInstructions: "",
        }),
      ],
      "single"
    )

    expect(result.structure.timing).not.toContain("5 min launch")
    expect(result.structure.teacherMoves).toEqual(
      expect.arrayContaining(["Teacher says: model first", "Guide partner response"])
    )
    expect(result.structure.promptStyle).toEqual(
      expect.arrayContaining(["Turn and talk", "What do you notice?"])
    )
  })
})
