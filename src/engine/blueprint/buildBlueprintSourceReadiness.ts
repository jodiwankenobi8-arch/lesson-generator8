import {
  BlueprintSourceReadiness,
  MaterialFile,
} from "../types"

export function buildBlueprintSourceReadiness(args: {
  curriculumMaterials: MaterialFile[]
  exemplarMaterials: MaterialFile[]
  standards: string[]
  vocabulary: string[]
  texts: string[]
  practiceIdeas: string[]
  lessonSegments: string[]
  teacherMoves: string[]
  promptStyle: string[]
}): BlueprintSourceReadiness {
  const {
    curriculumMaterials,
    exemplarMaterials,
    standards,
    vocabulary,
    texts,
    practiceIdeas,
    lessonSegments,
    teacherMoves,
    promptStyle,
  } = args

  const curriculumSignalCount = countStrongCurriculumSignals(
    standards,
    vocabulary,
    texts,
    practiceIdeas
  )

  const exemplarSignalCount = countStrongExemplarSignals(
    lessonSegments,
    teacherMoves,
    promptStyle
  )

  const curriculumSupport =
    curriculumMaterials.length === 0
      ? "limited"
      : curriculumSignalCount >= 3
        ? "strong"
        : "limited"

  const exemplarSupport =
    exemplarMaterials.length === 0
      ? "limited"
      : exemplarSignalCount >= 2
        ? "strong"
        : "limited"

  const overall =
    curriculumSupport === "strong" && exemplarSupport === "strong"
      ? "balanced"
      : curriculumSupport === "strong"
        ? "content_heavy"
        : exemplarSupport === "strong"
          ? "structure_heavy"
          : "limited"

  const warnings: string[] = []

  if (curriculumMaterials.length === 0) {
    warnings.push("No curriculum materials are ready, so content is relying on fallback signals.")
  } else if (curriculumSupport === "limited") {
    warnings.push("Curriculum materials are present, but strong content signals still look limited.")
  }

  if (exemplarMaterials.length === 0) {
    warnings.push("No exemplar materials are ready, so structure is relying on generic lesson flow.")
  } else if (exemplarSupport === "limited") {
    warnings.push("Exemplar materials are present, but strong structure signals still look limited.")
  }

  return {
    curriculumSupport,
    exemplarSupport,
    overall,
    warnings,
    signals: [
      {
        label: "Curriculum Support",
        value: curriculumSupport === "strong" ? "Strong" : "Limited",
        note:
          curriculumSupport === "strong"
            ? `Content signals are grounded by curriculum material (${curriculumSignalCount} strong signal areas detected).`
            : curriculumMaterials.length === 0
              ? "No ready curriculum materials were available."
              : `Curriculum material is present, but only ${curriculumSignalCount} strong content signal area(s) were detected.`,
        tone: curriculumSupport === "strong" ? "good" : "warn",
      },
      {
        label: "Exemplar Support",
        value: exemplarSupport === "strong" ? "Strong" : "Limited",
        note:
          exemplarSupport === "strong"
            ? `Structure signals are grounded by exemplar material (${exemplarSignalCount} strong signal areas detected).`
            : exemplarMaterials.length === 0
              ? "No ready exemplar materials were available."
              : `Exemplar material is present, but only ${exemplarSignalCount} strong structure signal area(s) were detected.`,
        tone: exemplarSupport === "strong" ? "good" : "warn",
      },
      {
        label: "Source Balance",
        value:
          overall === "balanced"
            ? "Balanced"
            : overall === "content_heavy"
              ? "Content-heavy"
              : overall === "structure_heavy"
                ? "Structure-heavy"
                : "Limited",
        note:
          overall === "balanced"
            ? "Curriculum and exemplar are both contributing meaningfully."
            : overall === "content_heavy"
              ? "Content grounding is stronger than structure grounding."
              : overall === "structure_heavy"
                ? "Structure grounding is stronger than content grounding."
                : "Both content and structure grounding still look limited.",
        tone: overall === "balanced" ? "good" : overall === "limited" ? "warn" : "neutral",
      },
    ],
  }
}

function countStrongCurriculumSignals(
  standards: string[],
  vocabulary: string[],
  texts: string[],
  practiceIdeas: string[]
): number {
  let count = 0

  if (hasStrongValues(standards, [
    "teacher-selected standard",
  ])) {
    count += 1
  }

  if (hasStrongValues(vocabulary, [
    "key vocabulary",
    "phonics pattern",
    "target words",
    "comprehension language",
  ])) {
    count += 1
  }

  if (hasStrongValues(texts, [
    "teacher-provided lesson text",
  ])) {
    count += 1
  }

  if (hasStrongValues(practiceIdeas, [
    "curriculum-aligned practice task",
    "word reading",
    "sound sort",
    "partner decoding",
    "guided reading",
    "partner discussion",
    "question practice",
  ])) {
    count += 1
  }

  return count
}

function countStrongExemplarSignals(
  lessonSegments: string[],
  teacherMoves: string[],
  promptStyle: string[]
): number {
  let count = 0

  if (hasStrongValues(lessonSegments, [
    "teach",
    "practice",
    "close",
    "part 1",
    "part 2",
    "closure",
  ])) {
    count += 1
  }

  if (hasStrongValues(teacherMoves, [
    "teacher model",
    "guided support",
    "guided blending",
    "prompt students to explain the pattern",
    "teacher think-aloud",
    "prompt for evidence",
    "guide partner discussion",
  ])) {
    count += 1
  }

  if (hasStrongValues(promptStyle, [
    "teacher prompt",
    "partner response",
    "say the sound",
    "read the word",
    "explain the pattern",
    "turn and talk",
    "what evidence helps you know?",
    "retell the important part",
  ])) {
    count += 1
  }

  return count
}

function hasStrongValues(values: string[], weakValues: string[]): boolean {
  const cleaned = values
    .map((value) => value.trim().toLowerCase())
    .filter((value) => value.length > 0)

  if (cleaned.length === 0) {
    return false
  }

  return cleaned.some((value) => !weakValues.includes(value))
}
