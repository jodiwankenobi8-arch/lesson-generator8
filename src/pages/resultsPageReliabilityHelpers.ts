import { getAxisDecision, getReliabilityScore, hasRelevantRoleAnalysis, sortByAxisPriority } from "../engine/blueprint/materialSelection"
import type { MaterialFile } from "../engine/types"

export type ReliabilityAxis = "content" | "structure"
export type ReliabilityOutcome = "used" | "down-ranked" | "blocked" | "ignored"

export type ReliabilityUiItem = {
  key: string
  name: string
  outcome: ReliabilityOutcome
  decision: string
  score: number
  note: string
  reasons: string[]
}

export function buildReliabilityDecisions(
  materials: MaterialFile[],
  role: "curriculum" | "exemplar",
  axis: ReliabilityAxis,
  selectedMaterialIds: string[]
): ReliabilityUiItem[] {
  const relevant = materials
    .filter((material) => material.status === "ready" && hasRelevantRoleAnalysis(material, role))
    .sort((a, b) => sortByAxisPriority(a, b, axis))

  const selectedIdSet = new Set(selectedMaterialIds)

  return relevant.map((material) => {
    const decision = getAxisDecision(material, axis)
    let outcome: ReliabilityOutcome = "ignored"

    if (decision === "block") {
      outcome = "blocked"
    } else if (selectedIdSet.has(material.id)) {
      outcome = "used"
    } else if (decision === "allow" || decision === "caution") {
      outcome = "down-ranked"
    }

    return {
      key: material.id + "-" + axis,
      name: material.name,
      outcome,
      decision,
      score: getReliabilityScore(material),
      note: buildReliabilityNote(material, axis, outcome, selectedMaterialIds.indexOf(material.id)),
      reasons: collectReliabilityReasons(material),
    }
  })
}

export function getSelectedMaterialNames(materials: MaterialFile[], selectedIds: string[]): string[] {
  const selectedIdSet = new Set(selectedIds)

  return materials
    .filter((material) => selectedIdSet.has(material.id))
    .map((material) => material.name)
}

function buildReliabilityNote(
  material: MaterialFile,
  axis: ReliabilityAxis,
  outcome: ReliabilityOutcome,
  selectedIndex: number
): string {
  if (outcome === "used") {
    if (axis === "content") {
      return selectedIndex === 0
        ? "Used as the primary curriculum grounding source because it ranked strongest for content on this axis."
        : "Used as a secondary curriculum support source because it added additional eligible content signals."
    }

    return "Used to shape pacing, flow, and teacher-facing structure because it was the strongest eligible exemplar source."
  }

  if (outcome === "down-ranked") {
    const decision = getAxisDecision(material, axis)
    return decision === "caution"
      ? "Stayed eligible with caution, but a cleaner or stronger source won this axis."
      : "Remained eligible, but another source ranked higher for this axis."
  }

  if (outcome === "blocked") {
    return axis === "content"
      ? "Blocked from steering content because the reliability layer marked it unsafe for curriculum grounding."
      : "Blocked from steering presentation because the reliability layer marked it unsafe for exemplar structure."
  }

  return axis === "content"
    ? "Ignored because it did not provide relevant usable content signals for this axis."
    : "Ignored because it did not provide relevant usable presentation signals for this axis."
}

function collectReliabilityReasons(material: MaterialFile): string[] {
  const reliability = material.analysis?.reliability

  if (!reliability) {
    return []
  }

  const reasons = Array.isArray(reliability.reasons) ? reliability.reasons : []
  const warnings = Array.isArray(reliability.warnings) ? reliability.warnings : []

  return Array.from(new Set([...reasons, ...warnings]))
}

export function formatReliabilityOutcome(outcome: ReliabilityOutcome): string {
  if (outcome === "used") return "Used"
  if (outcome === "down-ranked") return "Down-ranked"
  if (outcome === "blocked") return "Blocked"
  return "Ignored"
}

export function formatReliabilityDecision(decision: string): string {
  if (!decision) {
    return "Allow"
  }

  return decision.charAt(0).toUpperCase() + decision.slice(1)
}
