import { LessonBlueprint, LessonSpec } from "../types"

export function buildLessonSpec(blueprint: LessonBlueprint): LessonSpec {
  const target = blueprint.content.target
  const primary = target.primary.toLowerCase()
  const isFullMixed = target.isMixedTarget && target.recommendedMode === "full"

  const vocabulary = take(blueprint.content.vocabulary, 4, ["key vocabulary"])
  const wordList = take(blueprint.content.wordLists, 5, ["teacher-selected examples"])
  const texts = take(blueprint.content.texts, 2, ["teacher-provided text"])
  const practiceIdeas = take(blueprint.content.practiceIdeas, 4, ["guided practice"])
  const standards = take(blueprint.content.standards, 2, ["teacher-selected standard"])
  const lessonFlow = take(blueprint.structure.lessonSegments, 6, ["Teach", "Practice", "Closure"])
  const timing = take(blueprint.structure.timing, 6, ["Mini-lesson", "Practice", "Closure"])
  const teacherMoves = take(blueprint.structure.teacherMoves, 4, ["teacher model", "guided support"])
  const promptStyle = take(blueprint.structure.promptStyle, 4, ["teacher prompt"])
  const tone = take(blueprint.structure.tone, 2, ["clear instructional tone"])

  const openingLine = buildOpeningLine(target.primary, target.secondary, standards, tone)
  const modeledResources = buildModeledResources(primary, wordList, texts)
  const guidedTaskLine = buildGuidedTaskLine(primary, practiceIdeas, standards)
  const independentTaskLine = buildIndependentTaskLine(primary, practiceIdeas, wordList, texts)
  const closureLine = buildClosureLine(primary, vocabulary, wordList)
  const flowLine = `Follow the exemplar lesson flow: ${lessonFlow.join(" -> ")}.`
  const timingLine = `Keep pacing aligned to: ${timing.join(" | ")}.`
  const teacherMoveLine = `Use exemplar-style teacher moves such as: ${teacherMoves.join(", ")}.`
  const promptLine = `Use prompts and response frames such as: ${promptStyle.join(", ")}.`
  const toneLine = `Keep the delivery tone aligned to: ${tone.join(", ")}.`

  if (isFullMixed) {
    return {
      teach: {
        title: "Teach",
        steps: [
          openingLine,
          `Model the foundational skill first using: ${wordList.join(", ")}.`,
          `Then connect students to meaning and text work using: ${texts.join(", ")}.`,
          `Preteach and revisit vocabulary across both parts: ${vocabulary.join(", ")}.`,
          teacherMoveLine,
          promptLine,
          flowLine,
        ],
      },
      guidedPractice: {
        title: "Guided Practice",
        steps: [
          `Guide students through two curriculum-aligned practice blocks: ${practiceIdeas.join(", ")}.`,
          `Use modeled examples and text support during teacher guidance: ${wordList.join(", ")}; ${texts.join(", ")}.`,
          `Keep support anchored to the standards: ${standards.join(", ")}.`,
          promptLine,
          timingLine,
        ],
      },
      independentPractice: {
        title: "Independent Practice",
        steps: [
          `Students complete two aligned independent tasks using: ${practiceIdeas.slice(0, 2).join(", ")}.`,
          `Require students to apply both lesson resources and text support: ${wordList.join(", ")} / ${texts.join(", ")}.`,
          "Check for transfer from teacher-supported work to student-owned work in both lesson parts.",
          toneLine,
        ],
      },
      centers: {
        title: "Centers",
        steps: [
          "Phonics / word work center",
          "Reading or response center",
          "Teacher-led support / reteach center",
        ],
      },
      closure: {
        title: "Closure",
        steps: [
          "Review what students learned in both parts of the lesson.",
          flowLine,
          timingLine,
          toneLine,
          "End with a quick check for understanding and identify students needing reteach.",
        ],
      },
    }
  }

  if (primary === "phonics") {
    return {
      teach: {
        title: "Teach",
        steps: [
          openingLine,
          `Model the phonics focus with these curriculum examples: ${wordList.join(", ")}.`,
          `Teach and reinforce the key language students will use: ${vocabulary.join(", ")}.`,
          "Think aloud while blending, reading, sorting, or encoding target words.",
          teacherMoveLine,
          flowLine,
        ],
      },
      guidedPractice: {
        title: "Guided Practice",
        steps: [
          guidedTaskLine,
          `Use the lesson word list during support: ${wordList.join(", ")}.`,
          "Require students to explain or show the target pattern with teacher guidance.",
          promptLine,
          timingLine,
        ],
      },
      independentPractice: {
        title: "Independent Practice",
        steps: [
          independentTaskLine,
          `Use these words or examples during practice: ${wordList.join(", ")}.`,
          "Check for accurate decoding, sorting, encoding, and pattern application.",
          toneLine,
        ],
      },
      centers: {
        title: "Centers",
        steps: [
          "Word work / phonics center",
          "Partner reading or decoding center",
          "Teacher table for intervention or extension",
        ],
      },
      closure: {
        title: "Closure",
        steps: [
          "Review the target sound, pattern, or decoding skill.",
          closureLine,
          promptLine,
          "End with a quick oral read, sort, or exit check.",
        ],
      },
    }
  }

  if (primary === "comprehension") {
    return {
      teach: {
        title: "Teach",
        steps: [
          openingLine,
          `Model comprehension thinking with these lesson texts: ${texts.join(", ")}.`,
          `Preteach or revisit the lesson vocabulary: ${vocabulary.join(", ")}.`,
          "Demonstrate how students should discuss, answer, explain, or cite their thinking from the text.",
          teacherMoveLine,
          flowLine,
        ],
      },
      guidedPractice: {
        title: "Guided Practice",
        steps: [
          guidedTaskLine,
          `Use the lesson text and prompts during support: ${texts.join(", ")}.`,
          `Anchor the work to the lesson standard: ${standards.join(", ")}.`,
          promptLine,
          timingLine,
        ],
      },
      independentPractice: {
        title: "Independent Practice",
        steps: [
          independentTaskLine,
          `Use these texts or prompts during student work: ${texts.join(", ")}.`,
          "Check for understanding, accuracy, and evidence of reasoning.",
          toneLine,
        ],
      },
      centers: {
        title: "Centers",
        steps: [
          "Reading response center",
          "Partner discussion / retell center",
          "Teacher table for guided comprehension support",
        ],
      },
      closure: {
        title: "Closure",
        steps: [
          "Review the comprehension objective and key takeaway from the text.",
          closureLine,
          promptLine,
          "Close with a brief discussion, written response, or oral recap.",
        ],
      },
    }
  }

  return {
    teach: {
      title: "Teach",
      steps: [
        openingLine,
        `Model the lesson content using: ${modeledResources}.`,
        `Teach the lesson vocabulary and focus language: ${vocabulary.join(", ")}.`,
        teacherMoveLine,
        flowLine,
      ],
    },
    guidedPractice: {
      title: "Guided Practice",
      steps: [
        guidedTaskLine,
        `Reference standards during support: ${standards.join(", ")}.`,
        promptLine,
        timingLine,
      ],
    },
    independentPractice: {
      title: "Independent Practice",
      steps: [
        independentTaskLine,
        `Use these lesson resources: ${wordList.join(", ")} / ${texts.join(", ")}.`,
        toneLine,
      ],
    },
    centers: {
      title: "Centers",
      steps: [
        "Independent practice center",
        "Partner application center",
        "Teacher support center",
      ],
    },
    closure: {
      title: "Closure",
      steps: [
        "Review the lesson objective.",
        `Revisit the lesson flow: ${lessonFlow.join(" -> ")}.`,
        closureLine,
        promptLine,
      ],
    },
  }
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
