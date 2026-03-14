import {
  CurriculumCoverage,
  MaterialFile,
  MaterialRole,
  MaterialUseDecision,
} from "../types"

export type ReliabilityAxis = "content" | "structure"

export function getSignalStrength(material: MaterialFile): number {
  const tags = Array.isArray(material.analysis?.tags) ? material.analysis.tags : []
  const tag = tags.find((value) => value.startsWith("signal-strength:"))

  if (!tag) {
    return 0
  }

  const parsed = parseInt(String(tag).split(":")[1] ?? "0", 10)
  return Number.isFinite(parsed) ? parsed : 0
}

export function getReliabilityScore(material: MaterialFile): number {
  const score = material.analysis?.reliability?.score
  return typeof score === "number" ? score : 100
}

export function getCurriculumCoverageBreadth(material: MaterialFile): number {
  if (material.role !== "curriculum" || !material.analysis?.curriculum) {
    return 0
  }

  const coverage = getCurriculumCoverage(material)
  const groups = [
    coverage.standards,
    coverage.instructionalTargets,
    coverage.foundationalSkills,
    coverage.sightWords,
    coverage.vocabulary,
    coverage.wordLists,
    coverage.texts,
    coverage.practiceTasks,
    coverage.lessonSegments,
  ]

  return groups.filter((group) => hasMeaningfulCoverage(group)).length
}

export function getCurriculumCoverageVolume(material: MaterialFile): number {
  if (material.role !== "curriculum" || !material.analysis?.curriculum) {
    return 0
  }

  const coverage = getCurriculumCoverage(material)
  const groups = [
    coverage.standards,
    coverage.instructionalTargets,
    coverage.foundationalSkills,
    coverage.sightWords,
    coverage.vocabulary,
    coverage.wordLists,
    coverage.texts,
    coverage.practiceTasks,
    coverage.lessonSegments,
  ]

  return groups.reduce(
    (sum, group) => sum + group.filter((value) => !isWeakCoverageValue(value)).length,
    0
  )
}

export function getExemplarStructureBreadth(material: MaterialFile): number {
  if (material.role !== "exemplar" || !material.analysis?.exemplar) {
    return 0
  }

  const exemplar = material.analysis.exemplar
  const groups = [
    exemplar.slideFlow,
    exemplar.pacing,
    exemplar.teacherMoves,
    exemplar.promptStyle,
    exemplar.layoutCues,
    exemplar.tone,
    exemplar.reusableStructure,
    exemplar.detectedFeatures?.items.map((item) => item.key) ?? [],
  ]

  return groups.filter((group) => hasMeaningfulStructure(group)).length
}

export function getExemplarStructureVolume(material: MaterialFile): number {
  if (material.role !== "exemplar" || !material.analysis?.exemplar) {
    return 0
  }

  const exemplar = material.analysis.exemplar
  const groups = [
    exemplar.slideFlow,
    exemplar.pacing,
    exemplar.teacherMoves,
    exemplar.promptStyle,
    exemplar.layoutCues,
    exemplar.tone,
    exemplar.reusableStructure,
    exemplar.detectedFeatures?.items.map((item) => item.key) ?? [],
  ]

  return groups.reduce(
    (sum, group) => sum + group.filter((value) => !isWeakStructureValue(value)).length,
    0
  )
}

export function hasRelevantRoleAnalysis(material: MaterialFile, role: MaterialRole): boolean {
  if (role === "curriculum") {
    return material.role === "curriculum" && Boolean(material.analysis?.curriculum)
  }

  return material.role === "exemplar" && Boolean(material.analysis?.exemplar)
}

export function getAxisDecision(
  material: MaterialFile,
  axis: ReliabilityAxis
): MaterialUseDecision {
  const reliability = material.analysis?.reliability

  if (!reliability) {
    return "allow"
  }

  return axis === "content"
    ? reliability.contentDecision ?? "allow"
    : reliability.structureDecision ?? "allow"
}

export function isUsableForAxis(material: MaterialFile, axis: ReliabilityAxis): boolean {
  if (axis === "content") {
    if (material.role !== "curriculum" || !material.analysis?.curriculum) {
      return false
    }

    const reliability = material.analysis.reliability
    if (!reliability) {
      return true
    }

    return Boolean(reliability.usableForContent)
  }

  if (material.role !== "exemplar" || !material.analysis?.exemplar) {
    return false
  }

  const reliability = material.analysis.reliability
  if (!reliability) {
    return true
  }

  return Boolean(reliability.usableForStructure)
}

export function sortByReliabilityAndStrength(a: MaterialFile, b: MaterialFile): number {
  const reliabilityDelta = getReliabilityScore(b) - getReliabilityScore(a)
  if (reliabilityDelta !== 0) {
    return reliabilityDelta
  }

  return getSignalStrength(b) - getSignalStrength(a)
}

export function sortByAxisPriority(
  a: MaterialFile,
  b: MaterialFile,
  axis: ReliabilityAxis
): number {
  const reliabilityDelta = getReliabilityScore(b) - getReliabilityScore(a)
  if (reliabilityDelta !== 0) {
    return reliabilityDelta
  }

  if (axis === "content") {
    const coverageBreadthDelta =
      getCurriculumCoverageBreadth(b) - getCurriculumCoverageBreadth(a)
    if (coverageBreadthDelta !== 0) {
      return coverageBreadthDelta
    }

    const coverageVolumeDelta =
      getCurriculumCoverageVolume(b) - getCurriculumCoverageVolume(a)
    if (coverageVolumeDelta !== 0) {
      return coverageVolumeDelta
    }
  }

  if (axis === "structure") {
    const structureBreadthDelta =
      getExemplarStructureBreadth(b) - getExemplarStructureBreadth(a)
    if (structureBreadthDelta !== 0) {
      return structureBreadthDelta
    }

    const structureVolumeDelta =
      getExemplarStructureVolume(b) - getExemplarStructureVolume(a)
    if (structureVolumeDelta !== 0) {
      return structureVolumeDelta
    }
  }

  return getSignalStrength(b) - getSignalStrength(a)
}

export function selectStrongestEligibleMaterials(
  materials: MaterialFile[],
  role: MaterialRole,
  axis: ReliabilityAxis
): MaterialFile[] {
  return materials
    .filter((material) => hasRelevantRoleAnalysis(material, role))
    .filter((material) => isUsableForAxis(material, axis))
    .sort((a, b) => sortByAxisPriority(a, b, axis))
}

function getCurriculumCoverage(material: MaterialFile): CurriculumCoverage {
  const curriculum = material.analysis?.curriculum

  return (
    curriculum?.coverage ?? {
      standards: curriculum?.standards ?? [],
      instructionalTargets: curriculum?.instructionalTargets ?? [],
      foundationalSkills: [],
      sightWords: [],
      vocabulary: curriculum?.vocabulary ?? [],
      wordLists: curriculum?.wordLists ?? [],
      texts: curriculum?.texts ?? [],
      practiceTasks: curriculum?.practiceTasks ?? [],
      lessonSegments: [],
    }
  )
}

function hasMeaningfulCoverage(values: string[]): boolean {
  return values.some((value) => !isWeakCoverageValue(value))
}

function hasMeaningfulStructure(values: string[]): boolean {
  return values.some((value) => !isWeakStructureValue(value))
}

function isWeakCoverageValue(value: string): boolean {
  const lower = value.trim().toLowerCase()

  return [
    "teacher-selected standard",
    "key vocabulary",
    "teacher-selected word list",
    "teacher-provided lesson text",
    "curriculum-aligned practice task",
    "lesson target",
    "modeled example",
    "teacher-provided practice items",
  ].includes(lower)
}

function isWeakStructureValue(value: string): boolean {
  const lower = value.trim().toLowerCase()

  return [
    "opening",
    "teach",
    "practice",
    "closure",
    "teacher prompt",
    "teacher model",
    "guided support",
    "teacher-directed pacing",
    "presentation structure cue",
    "clear instructional tone",
  ].includes(lower)
}
