import {
  BlueprintContentCoverage,
  BlueprintSourceReadiness,
  MaterialFile,
} from "../types"

export function buildBlueprintSourceReadiness(args: {
  curriculumMaterials: MaterialFile[]
  exemplarMaterials: MaterialFile[]
  coverage?: BlueprintContentCoverage
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
    coverage,
    standards,
    vocabulary,
    texts,
    practiceIdeas,
    lessonSegments,
    teacherMoves,
    promptStyle,
  } = args

  const selectedCurriculumMaterialIds = curriculumMaterials.slice(0, 2).map((material) => material.id)
  const selectedExemplarMaterialIds = exemplarMaterials.slice(0, 1).map((material) => material.id)

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

  const coverageSignalCount = countCoverageDimensions(
    coverage,
    standards,
    vocabulary,
    texts,
    practiceIdeas
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

  const coverageSupport =
    curriculumMaterials.length === 0
      ? "limited"
      : coverageSignalCount >= 4
        ? "strong"
        : "limited"

  const overall =
    curriculumSupport === "strong" &&
    exemplarSupport === "strong" &&
    coverageSupport === "strong"
      ? "balanced"
      : (curriculumSupport === "strong" || coverageSupport === "strong") &&
          exemplarSupport !== "strong"
        ? "content_heavy"
        : exemplarSupport === "strong"
          ? "structure_heavy"
          : "limited"

  const warnings: string[] = []

  if (curriculumMaterials.length === 0) {
    warnings.push("No usable curriculum materials are available, so content is relying on fallback signals.")
  } else if (curriculumSupport === "limited") {
    warnings.push("Usable curriculum materials are present, but strong content signals still look limited.")
  }

  if (coverageSupport === "limited") {
    warnings.push("Curriculum coverage breadth still looks limited, so some lesson areas may rely on fallback logic.")
  }

  if (exemplarMaterials.length === 0) {
    warnings.push("No usable exemplar materials are available, so structure is relying on generic lesson flow.")
  } else if (exemplarSupport === "limited") {
    warnings.push("Usable exemplar materials are present, but strong structure signals still look limited.")
  }

  return {
    curriculumSupport,
    exemplarSupport,
    coverageSupport,
    overall,
    selectedCurriculumMaterialIds,
    selectedExemplarMaterialIds,
    warnings,
    signals: [
      {
        label: "Curriculum Support",
        value: curriculumSupport === "strong" ? "Strong" : "Limited",
        note:
          curriculumSupport === "strong"
            ? `Content signals are grounded by usable curriculum material (${curriculumSignalCount} strong signal areas detected).`
            : curriculumMaterials.length === 0
              ? "No usable curriculum materials were available."
              : `Usable curriculum material is present, but only ${curriculumSignalCount} strong content signal area(s) were detected.`,
        tone: curriculumSupport === "strong" ? "good" : "warn",
      },
      {
        label: "Exemplar Support",
        value: exemplarSupport === "strong" ? "Strong" : "Limited",
        note:
          exemplarSupport === "strong"
            ? `Structure signals are grounded by usable exemplar material (${exemplarSignalCount} strong signal areas detected).`
            : exemplarMaterials.length === 0
              ? "No usable exemplar materials were available."
              : `Usable exemplar material is present, but only ${exemplarSignalCount} strong structure signal area(s) were detected.`,
        tone: exemplarSupport === "strong" ? "good" : "warn",
      },
      {
        label: "Coverage Support",
        value: coverageSupport === "strong" ? "Strong" : "Limited",
        note:
          coverageSupport === "strong"
            ? `Curriculum coverage spans ${coverageSignalCount} meaningful source dimension(s).`
            : curriculumMaterials.length === 0
              ? "No usable curriculum materials were available to establish coverage breadth."
              : `Usable curriculum material is present, but only ${coverageSignalCount} meaningful coverage dimension(s) were detected.`,
        tone: coverageSupport === "strong" ? "good" : "warn",
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
            ? "Curriculum, coverage breadth, and exemplar structure are all contributing meaningfully."
            : overall === "content_heavy"
              ? "Content grounding or coverage breadth is stronger than structure grounding."
              : overall === "structure_heavy"
                ? "Structure grounding is stronger than content grounding or coverage breadth."
                : "Content grounding, coverage breadth, and structure grounding still look limited.",
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

function countCoverageDimensions(
  coverage: BlueprintContentCoverage | undefined,
  standards: string[],
  vocabulary: string[],
  texts: string[],
  practiceIdeas: string[]
): number {
  const resolvedCoverage = coverage ?? {
    standards,
    vocabulary,
    wordLists: [],
    texts,
    practiceIdeas,
    instructionalTargets: [],
    sightWords: [],
    foundationalSkills: [],
    lessonSegments: [],
  }

  const coverageGroups = [
    resolvedCoverage.standards,
    resolvedCoverage.vocabulary,
    resolvedCoverage.wordLists,
    resolvedCoverage.texts,
    resolvedCoverage.practiceIdeas,
    resolvedCoverage.instructionalTargets,
    resolvedCoverage.sightWords,
    resolvedCoverage.foundationalSkills,
    resolvedCoverage.lessonSegments,
  ]

  return coverageGroups.filter((group) => Array.isArray(group) && group.length > 0).length
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
