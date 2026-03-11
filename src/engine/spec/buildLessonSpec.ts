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

  if (isFullMixed) {
    return {
      teach: {
        title: "Teach",
        steps: [
          `Introduce the two-part lesson target: ${formatTargetLabel(target.primary, target.secondary)}.`,
          `Teach the foundational content using: ${wordList.join(", ")}.`,
          `Connect the lesson to meaning and text work using: ${texts.join(", ")}.`,
          `Highlight key vocabulary for both parts: ${vocabulary.join(", ")}.`,
        ],
      },
      guidedPractice: {
        title: "Guided Practice",
        steps: [
          `Guide students through the first practice block using these curriculum tasks: ${practiceIdeas.join(", ")}.`,
          `Use the lesson examples and texts during teacher support: ${wordList.join(", ")}; ${texts.join(", ")}.`,
          `Reference the lesson standards during support: ${standards.join(", ")}.`,
        ],
      },
      independentPractice: {
        title: "Independent Practice",
        steps: [
          `Students complete two aligned tasks drawn from the lesson materials: ${practiceIdeas.slice(0, 2).join(", ")}.`,
          `Use these lesson resources during practice: ${wordList.join(", ")} and ${texts.join(", ")}.`,
          "Check for transfer from teacher-supported work to student-owned work in both parts of the lesson.",
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
          `Revisit the lesson flow: ${blueprint.structure.lessonSegments.join(" -> ")}.`,
          "End with a quick check for understanding and note who needs reteach.",
        ],
      },
    }
  }

  if (primary === "phonics") {
    return {
      teach: {
        title: "Teach",
        steps: [
          "State the phonics objective and name the focus pattern or skill.",
          `Model the target pattern with these examples: ${wordList.join(", ")}.`,
          `Teach key language students will use: ${vocabulary.join(", ")}.`,
          "Think aloud while blending, reading, or sorting target words.",
        ],
      },
      guidedPractice: {
        title: "Guided Practice",
        steps: [
          `Guide practice with these curriculum-aligned phonics tasks: ${practiceIdeas.join(", ")}.`,
          `Use the lesson word list during support: ${wordList.join(", ")}.`,
          `Keep practice aligned to the lesson standard: ${standards.join(", ")}.`,
        ],
      },
      independentPractice: {
        title: "Independent Practice",
        steps: [
          `Students complete independent phonics work using these lesson tasks or examples: ${practiceIdeas.slice(0, 2).join(", ")}.`,
          `Use these words or examples during practice: ${wordList.join(", ")}.`,
          "Check for accurate decoding, sorting, encoding, and pattern application.",
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
          `Have students revisit the strongest examples: ${wordList.slice(0, 3).join(", ")}.`,
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
          "Introduce the comprehension focus and connect it to the lesson text.",
          `Model comprehension thinking with: ${texts.join(", ")}.`,
          `Preteach or review key vocabulary: ${vocabulary.join(", ")}.`,
          "Demonstrate how students should discuss, answer, or cite thinking from the text.",
        ],
      },
      guidedPractice: {
        title: "Guided Practice",
        steps: [
          `Guide students through these curriculum-based comprehension tasks: ${practiceIdeas.join(", ")}.`,
          `Use the lesson text and prompts during support: ${texts.join(", ")}.`,
          `Anchor the work to the lesson standard: ${standards.join(", ")}.`,
        ],
      },
      independentPractice: {
        title: "Independent Practice",
        steps: [
          `Students complete an independent response task using these lesson activities or prompts: ${practiceIdeas.slice(0, 2).join(", ")}.`,
          `Use these lesson texts or prompts during practice: ${texts.join(", ")}.`,
          "Check for understanding, accuracy, and evidence of reasoning.",
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
          `Reinforce the lesson vocabulary: ${vocabulary.slice(0, 3).join(", ")}.`,
          "Close with a brief discussion, written response, or oral recap.",
        ],
      },
    }
  }

  return {
    teach: {
      title: "Teach",
      steps: [
        `Introduce the lesson target: ${formatTargetLabel(target.primary, target.secondary)}.`,
        `Model key lesson content using: ${vocabulary.join(", ")}.`,
      ],
    },
    guidedPractice: {
      title: "Guided Practice",
      steps: [
        `Practice with teacher support using these lesson tasks: ${practiceIdeas.join(", ")}.`,
        `Reference standards during support: ${standards.join(", ")}.`,
      ],
    },
    independentPractice: {
      title: "Independent Practice",
      steps: [
        `Students complete independent practice using these lesson materials or tasks: ${practiceIdeas.slice(0, 2).join(", ")}.`,
        `Use these lesson resources: ${wordList.join(", ")}.`,
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
        `Revisit the lesson flow: ${blueprint.structure.lessonSegments.join(" -> ")}.`,
      ],
    },
  }
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
