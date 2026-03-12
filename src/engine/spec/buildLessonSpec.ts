import {
  LessonBlueprint,
  LessonPlanIdea,
  LessonPlanningIdeas,
  LessonSpec,
} from "../types"
import { resolveTemplateShell } from "../shared/resolveTemplateShell"

export function buildLessonSpec(
  blueprint: LessonBlueprint,
  planningIdeas?: LessonPlanningIdeas
): LessonSpec {
  const target = blueprint.content.target
  const primary = target.primary.toLowerCase()
  const isFullMixed = target.isMixedTarget && target.recommendedMode === "full"

  const vocabulary = take(blueprint.content.vocabulary, 4, ["key vocabulary"])
  const wordList = take(blueprint.content.wordLists, 5, ["teacher-selected examples"])
  const texts = take(blueprint.content.texts, 2, ["teacher-provided text"])
  const practiceIdeas = take(blueprint.content.practiceIdeas, 4, ["guided practice"])
  const standards = take(blueprint.content.standards, 2, ["teacher-selected standard"])

  const shell = resolveTemplateShell(blueprint, {
    lessonSegmentsCount: 6,
    teacherMovesCount: 4,
    promptStyleCount: 4,
    toneCount: 2,
  })

  const openingLine = buildOpeningLine(target.primary, target.secondary, standards, shell.tone)
  const modeledResources = buildModeledResources(primary, wordList, texts)
  const guidedTaskLine = buildGuidedTaskLine(primary, practiceIdeas, standards)
  const independentTaskLine = buildIndependentTaskLine(primary, practiceIdeas, wordList, texts)
  const closureLine = buildClosureLine(primary, vocabulary, wordList)
  const flowLine = `Follow the exemplar lesson flow: ${shell.lessonSegments.join(" -> ")}.`
  const slideShellLine = `Preserve the exemplar slide shell: ${shell.slideShell.join(" -> ")}.`
  const timingLine = `Keep pacing aligned to: ${shell.timing.join(" | ")}.`
  const teacherMoveLine = `Use exemplar-style teacher moves such as: ${shell.teacherMoves.join(", ")}.`
  const promptLine = `Use prompts and response frames such as: ${shell.promptStyle.join(", ")}.`
  const toneLine = `Keep the delivery tone aligned to: ${shell.tone.join(", ")}.`

  const teachPlanLines = planningLines(planningIdeas, "teach")
  const guidedPlanLines = planningLines(planningIdeas, "guided_practice")
  const independentPlanLines = planningLines(planningIdeas, "independent_practice")
  const closurePlanLines = planningLines(planningIdeas, "closure")
  const centerPlanLines = ideaLines(planningIdeas?.centerIdeas)
  const smallGroupPlanLines = ideaLines(planningIdeas?.smallGroupIdeas)
  const interventionPlanLines = ideaLines(planningIdeas?.interventionIdeas)
  const formativePlanLines = ideaLines(planningIdeas?.formativeAssessmentIdeas)

  if (isFullMixed) {
    return {
      teach: {
        title: "Teach",
        steps: compactSteps([
          openingLine,
          `Model the foundational skill first using: ${wordList.join(", ")}.`,
          `Then connect students to meaning and text work using: ${texts.join(", ")}.`,
          `Preteach and revisit vocabulary across both parts: ${vocabulary.join(", ")}.`,
          ...teachPlanLines,
          teacherMoveLine,
          promptLine,
          flowLine,
          slideShellLine,
        ]),
      },
      guidedPractice: {
        title: "Guided Practice",
        steps: compactSteps([
          `Guide students through two curriculum-aligned practice blocks: ${practiceIdeas.join(", ")}.`,
          `Use modeled examples and text support during teacher guidance: ${wordList.join(", ")}; ${texts.join(", ")}.`,
          `Keep support anchored to the standards: ${standards.join(", ")}.`,
          ...guidedPlanLines,
          ...takeLines(formativePlanLines, 1),
          promptLine,
          timingLine,
        ]),
      },
      independentPractice: {
        title: "Independent Practice",
        steps: compactSteps([
          `Students complete two aligned independent tasks using: ${practiceIdeas.slice(0, 2).join(", ")}.`,
          `Require students to apply both lesson resources and text support: ${wordList.join(", ")} / ${texts.join(", ")}.`,
          ...independentPlanLines,
          "Check for transfer from teacher-supported work to student-owned work in both lesson parts.",
          ...takeLines(formativePlanLines, 1, 1),
          toneLine,
        ]),
      },
      centers: {
        title: "Centers",
        steps: compactSteps([
          ...centerPlanLines,
          ...takeLines(smallGroupPlanLines, 1),
          ...takeLines(interventionPlanLines, 1),
          "Phonics / word work center",
          "Reading or response center",
          "Teacher-led support / reteach center",
        ]),
      },
      closure: {
        title: "Closure",
        steps: compactSteps([
          "Review what students learned in both parts of the lesson.",
          ...closurePlanLines,
          ...takeLines(formativePlanLines, 1),
          flowLine,
          timingLine,
          toneLine,
          "End with a quick check for understanding and identify students needing reteach.",
        ]),
      },
    }
  }

  if (primary === "phonics") {
    return {
      teach: {
        title: "Teach",
        steps: compactSteps([
          openingLine,
          `Model the phonics focus with these curriculum examples: ${wordList.join(", ")}.`,
          `Teach and reinforce the key language students will use: ${vocabulary.join(", ")}.`,
          "Think aloud while blending, reading, sorting, or encoding target words.",
          ...teachPlanLines,
          teacherMoveLine,
          flowLine,
          slideShellLine,
        ]),
      },
      guidedPractice: {
        title: "Guided Practice",
        steps: compactSteps([
          guidedTaskLine,
          `Use the lesson word list during support: ${wordList.join(", ")}.`,
          "Require students to explain or show the target pattern with teacher guidance.",
          ...guidedPlanLines,
          ...takeLines(formativePlanLines, 1),
          promptLine,
          timingLine,
        ]),
      },
      independentPractice: {
        title: "Independent Practice",
        steps: compactSteps([
          independentTaskLine,
          `Use these words or examples during practice: ${wordList.join(", ")}.`,
          ...independentPlanLines,
          ...takeLines(formativePlanLines, 1, 1),
          "Check for accurate decoding, sorting, encoding, and pattern application.",
          toneLine,
        ]),
      },
      centers: {
        title: "Centers",
        steps: compactSteps([
          ...centerPlanLines,
          ...takeLines(smallGroupPlanLines, 1),
          ...takeLines(interventionPlanLines, 1),
          "Word work / phonics center",
          "Partner reading or decoding center",
          "Teacher table for intervention or extension",
        ]),
      },
      closure: {
        title: "Closure",
        steps: compactSteps([
          "Review the target sound, pattern, or decoding skill.",
          closureLine,
          ...closurePlanLines,
          promptLine,
          "End with a quick oral read, sort, or exit check.",
        ]),
      },
    }
  }

  if (primary === "comprehension") {
    return {
      teach: {
        title: "Teach",
        steps: compactSteps([
          openingLine,
          `Model comprehension thinking with these lesson texts: ${texts.join(", ")}.`,
          `Preteach or revisit the lesson vocabulary: ${vocabulary.join(", ")}.`,
          "Demonstrate how students should discuss, answer, explain, or cite their thinking from the text.",
          ...teachPlanLines,
          teacherMoveLine,
          flowLine,
          slideShellLine,
        ]),
      },
      guidedPractice: {
        title: "Guided Practice",
        steps: compactSteps([
          guidedTaskLine,
          `Use the lesson text and prompts during support: ${texts.join(", ")}.`,
          `Anchor the work to the lesson standard: ${standards.join(", ")}.`,
          ...guidedPlanLines,
          ...takeLines(formativePlanLines, 1),
          promptLine,
          timingLine,
        ]),
      },
      independentPractice: {
        title: "Independent Practice",
        steps: compactSteps([
          independentTaskLine,
          `Use these texts or prompts during student work: ${texts.join(", ")}.`,
          ...independentPlanLines,
          ...takeLines(formativePlanLines, 1, 1),
          "Check for understanding, accuracy, and evidence of reasoning.",
          toneLine,
        ]),
      },
      centers: {
        title: "Centers",
        steps: compactSteps([
          ...centerPlanLines,
          ...takeLines(smallGroupPlanLines, 1),
          ...takeLines(interventionPlanLines, 1),
          "Reading response center",
          "Partner discussion / retell center",
          "Teacher table for guided comprehension support",
        ]),
      },
      closure: {
        title: "Closure",
        steps: compactSteps([
          "Review the comprehension objective and key takeaway from the text.",
          closureLine,
          ...closurePlanLines,
          promptLine,
          "Close with a brief discussion, written response, or oral recap.",
        ]),
      },
    }
  }

  return {
    teach: {
      title: "Teach",
      steps: compactSteps([
        openingLine,
        `Model the lesson content using: ${modeledResources}.`,
        `Teach the lesson vocabulary and focus language: ${vocabulary.join(", ")}.`,
        ...teachPlanLines,
        teacherMoveLine,
        flowLine,
        slideShellLine,
      ]),
    },
    guidedPractice: {
      title: "Guided Practice",
      steps: compactSteps([
        guidedTaskLine,
        `Reference standards during support: ${standards.join(", ")}.`,
        ...guidedPlanLines,
        ...takeLines(formativePlanLines, 1),
        promptLine,
        timingLine,
      ]),
    },
    independentPractice: {
      title: "Independent Practice",
      steps: compactSteps([
        independentTaskLine,
        `Use these lesson resources: ${wordList.join(", ")} / ${texts.join(", ")}.`,
        ...independentPlanLines,
        ...takeLines(formativePlanLines, 1, 1),
        toneLine,
      ]),
    },
    centers: {
      title: "Centers",
      steps: compactSteps([
        ...centerPlanLines,
        ...takeLines(smallGroupPlanLines, 1),
        ...takeLines(interventionPlanLines, 1),
        "Independent practice center",
        "Partner application center",
        "Teacher support center",
      ]),
    },
    closure: {
      title: "Closure",
      steps: compactSteps([
        "Review the lesson objective.",
        `Revisit the lesson flow: ${shell.lessonSegments.join(" -> ")}.`,
        closureLine,
        ...closurePlanLines,
        promptLine,
      ]),
    },
  }
}

function planningLines(
  planningIdeas: LessonPlanningIdeas | undefined,
  section:
    | "teach"
    | "guided_practice"
    | "independent_practice"
    | "closure"
): string[] {
  const match = planningIdeas?.lessonPlanSections.find((item) => item.section === section)

  if (!match) {
    return []
  }

  return match.ideas.map((idea) => formatPlanningIdea(idea))
}

function ideaLines(ideas: LessonPlanIdea[] | undefined): string[] {
  if (!ideas?.length) {
    return []
  }

  return ideas.map((idea) => formatPlanningIdea(idea))
}

function takeLines(lines: string[], count: number, start = 0): string[] {
  return lines.slice(start, start + count)
}

function formatPlanningIdea(idea: LessonPlanIdea): string {
  return `${idea.title}: ${idea.description}`
}

function compactSteps(steps: string[]): string[] {
  return Array.from(new Set(steps.map((step) => step.trim()).filter((step) => step.length > 0)))
}

function buildOpeningLine(
  primary: string,
  secondary: string | null,
  standards: string[],
  tone: string[]
): string {
  const targetLabel = formatTargetLabel(primary, secondary)
  return `Introduce the lesson target: ${targetLabel}. Connect the work to: ${standards.join(", ")}. Set the tone with: ${tone.join(", ")}.`
}

function buildModeledResources(primary: string, wordList: string[], texts: string[]): string {
  if (primary === "phonics") {
    return wordList.join(", ")
  }

  if (primary === "comprehension") {
    return texts.join(", ")
  }

  return `${wordList.join(", ")}; ${texts.join(", ")}`
}

function buildGuidedTaskLine(
  primary: string,
  practiceIdeas: string[],
  standards: string[]
): string {
  if (primary === "phonics") {
    return `Guide practice with these curriculum-aligned phonics tasks: ${practiceIdeas.join(", ")}. Keep practice aligned to: ${standards.join(", ")}.`
  }

  if (primary === "comprehension") {
    return `Guide students through these curriculum-based comprehension tasks: ${practiceIdeas.join(", ")}. Keep the work aligned to: ${standards.join(", ")}.`
  }

  return `Guide students through these lesson tasks: ${practiceIdeas.join(", ")}. Keep support aligned to: ${standards.join(", ")}.`
}

function buildIndependentTaskLine(
  primary: string,
  practiceIdeas: string[],
  wordList: string[],
  texts: string[]
): string {
  if (primary === "phonics") {
    return `Students complete independent phonics work using: ${practiceIdeas.slice(0, 2).join(", ")}.`
  }

  if (primary === "comprehension") {
    return `Students complete an independent response task using: ${practiceIdeas.slice(0, 2).join(", ")}.`
  }

  return `Students complete independent practice using: ${practiceIdeas.slice(0, 2).join(", ")}. Reference ${wordList.join(", ")} and ${texts.join(", ")} as needed.`
}

function buildClosureLine(primary: string, vocabulary: string[], wordList: string[]): string {
  if (primary === "phonics") {
    return `Revisit the strongest word examples: ${wordList.slice(0, 3).join(", ")}.`
  }

  return `Reinforce key lesson vocabulary: ${vocabulary.slice(0, 3).join(", ")}.`
}

function formatTargetLabel(primary: string, secondary: string | null): string {
  return secondary ? `${primary} + ${secondary}` : primary
}

function take(items: string[], count: number, fallback: string[]): string[] {
  const cleaned = Array.from(
    new Set(items.map((item) => item.trim()).filter((item) => item.length > 0))
  ).slice(0, count)

  return cleaned.length ? cleaned : fallback
}
