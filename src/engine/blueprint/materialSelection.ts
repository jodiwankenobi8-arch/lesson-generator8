import { MaterialFile, MaterialRole, MaterialUseDecision } from "../types"

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

export function selectStrongestEligibleMaterials(
  materials: MaterialFile[],
  role: MaterialRole,
  axis: ReliabilityAxis
): MaterialFile[] {
  return materials
    .filter((material) => hasRelevantRoleAnalysis(material, role))
    .filter((material) => isUsableForAxis(material, axis))
    .sort((a, b) => sortByReliabilityAndStrength(a, b))
}
