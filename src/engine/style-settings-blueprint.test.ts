import { describe, expect, it } from "vitest"
import { buildBlueprint } from "./blueprint/buildBlueprint"
import { resolveTemplateShell } from "./shared/resolveTemplateShell"
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
          targets: ["shared"],
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
          targets: ["shared"],
        }),
      ],
      "single"
    )

    expect(result.structure.timing).toContain("5 min launch")
    expect(result.structure.lessonSegments).toEqual(
      expect.arrayContaining(["Opening", "Teach", "Guided Practice", "Closure"])
    )
    expect(result.sourceReadiness.exemplarSupport).toBe("strong")

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
          targets: ["shared"],
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

  it("builds scoped template shells when exemplars target different package areas", () => {
    const slidesOnlyAnalysis = makeExemplarAnalysis({
      slideFlow: ["Opening", "Mini-Lesson", "Guided Practice", "Closing Reflection"],
      pacing: ["3 min launch", "12 min model"],
      reusableStructure: ["Slides-focused shell"],
    })
    const centersOnlyAnalysis = makeExemplarAnalysis({
      slideFlow: ["Rotation Launch", "Center Directions", "Independent Rotation", "Share"],
      pacing: ["4 min rotation launch", "12 min center work"],
      reusableStructure: ["Centers-focused shell"],
    })

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
          ...makeExemplarMaterial("ex-shared", {
            mode: "selected_aspects",
            aspects: ["slide_flow", "pacing"],
            customInstructions: "",
            targets: ["shared"],
          }),
          analysis: makeExemplarAnalysis(),
        },
        {
          ...makeExemplarMaterial("ex-slides", {
            mode: "selected_aspects",
            aspects: ["slide_flow", "pacing"],
            customInstructions: "",
            targets: ["lesson_slides"],
          }),
          analysis: slidesOnlyAnalysis,
        },
        {
          ...makeExemplarMaterial("ex-centers", {
            mode: "selected_aspects",
            aspects: ["slide_flow", "pacing"],
            customInstructions: "",
            targets: ["centers"],
          }),
          analysis: centersOnlyAnalysis,
        },
      ],
      "single"
    )

    expect(result.structure.scopedTemplateShells?.lesson_slides?.timingShell).toEqual(
      expect.arrayContaining(["3 min launch", "12 min model"])
    )
    expect(result.structure.scopedTemplateShells?.centers?.timingShell).toEqual(
      expect.arrayContaining(["4 min rotation launch", "12 min center work"])
    )
    expect(result.structure.scopedTemplateShells?.lesson_slides?.slideShell).not.toEqual(
      result.structure.scopedTemplateShells?.centers?.slideShell
    )
    expect(result.structure.templateShell.slideShell).toEqual(
      expect.arrayContaining(["Opening", "Teach", "Guided Practice", "Closure"])
    )
  })

  it("builds deterministic default scoped shells for all six scopes when no exemplar is selected", () => {
    const result = buildBlueprint(
      {
        grade: "1",
        subject: "ELA",
        standard: "RF.1.3",
        skill: "Long A",
        topic: "Long a words",
        duration: "30 minutes",
      },
      [],
      "single"
    )

    expect(result.structure.scopedTemplateShells).toBeDefined()
    expect(Object.keys(result.structure.scopedTemplateShells ?? {})).toEqual([
      "lesson_plan",
      "lesson_slides",
      "centers",
      "small_group",
      "intervention",
      "printables",
    ])

    expect(result.structure.scopedTemplateShells?.centers?.segmentOrder).toEqual([
      "Rotation Launch",
      "Centers / Rotation",
      "Independent Rotation",
      "Share / Closure",
    ])
    expect(result.structure.scopedTemplateShells?.small_group?.segmentOrder).toEqual([
      "Warm-Up Review",
      "Reteach / Model",
      "Guided Practice",
      "Check for Understanding",
    ])
    expect(result.structure.scopedTemplateShells?.intervention?.segmentOrder).toEqual([
      "Re-Engage",
      "Targeted Reteach",
      "Supported Practice",
      "Exit Check",
    ])
    expect(result.structure.scopedTemplateShells?.printables?.segmentOrder).toEqual([
      "Directions",
      "Warm-Up",
      "Practice",
      "Exit Ticket",
    ])
  })

  it("resolves artifact-specific default shells for support and printable scopes when no exemplar is selected", () => {
    const result = buildBlueprint(
      {
        grade: "1",
        subject: "ELA",
        standard: "RF.1.3",
        skill: "Long A",
        topic: "Long a words",
        duration: "30 minutes",
      },
      [],
      "single"
    )

    expect(
      resolveTemplateShell(result, {
        scope: "centers",
        lessonSegmentsCount: 4,
        slideShellCount: 4,
        timingCount: 4,
      }).lessonSegments
    ).toEqual([
      "Rotation Launch",
      "Centers / Rotation",
      "Independent Rotation",
      "Share / Closure",
    ])
    expect(
      resolveTemplateShell(result, {
        scope: "small_group",
        lessonSegmentsCount: 4,
        slideShellCount: 4,
        timingCount: 4,
      }).lessonSegments
    ).toEqual([
      "Warm-Up Review",
      "Reteach / Model",
      "Guided Practice",
      "Check for Understanding",
    ])
    expect(
      resolveTemplateShell(result, {
        scope: "intervention",
        lessonSegmentsCount: 4,
        slideShellCount: 4,
        timingCount: 4,
      }).lessonSegments
    ).toEqual([
      "Re-Engage",
      "Targeted Reteach",
      "Supported Practice",
      "Exit Check",
    ])
    expect(
      resolveTemplateShell(result, {
        scope: "printables",
        lessonSegmentsCount: 4,
        slideShellCount: 4,
      }).lessonSegments
    ).toEqual([
      "Directions",
      "Warm-Up",
      "Practice",
      "Exit Ticket",
    ])
  })
})
