import {
  inferSupportedSourceMimeType,
  isSupportedImageExtension,
  isSupportedImageMimeType,
} from "../engine/materials/sourceIntakeContract"
import type { ExtractionQuality, MaterialFile, MaterialSourceKind } from "../engine/types"

export type UploadSourceMetadata = {
  sourceKind: MaterialSourceKind
  sourceLabel: string
  sourceMimeType: string | null
}

export type TeacherVisibleMaterialSummary = {
  statusLabel: string
  summaryLines: string[]
  nextStep?: string
  tone: "strong" | "caution" | "blocked"
}

export function buildUploadSourceMetadata(file: Pick<File, "name" | "type">): UploadSourceMetadata {
  const sourceKind: MaterialSourceKind =
    isSupportedImageMimeType(file.type) || isSupportedImageExtension(file.name)
      ? "image_upload"
      : "file_upload"
  const sourceMimeType = file.type.trim() || inferMimeTypeFromName(file.name)

  return {
    sourceKind,
    sourceLabel: file.name,
    sourceMimeType,
  }
}

export function inferMimeTypeFromName(fileName: string): string | null {
  return inferSupportedSourceMimeType(fileName)
}

export function isSupportedUploadFile(file: Pick<File, "name" | "type">): boolean {
  return Boolean(inferSupportedSourceMimeType(file.name)) || isSupportedImageMimeType(file.type)
}

export function getTeacherVisibleMaterialNote(
  material: Pick<MaterialFile, "status" | "errorMessage" | "analysis">
): string {
  if (material.status === "error") {
    return material.errorMessage?.trim() || "Needs attention before it can be used."
  }

  if (material.status === "ready") {
    const reliability = material.analysis?.reliability

    if (reliability && !reliability.usableForContent && !reliability.usableForStructure) {
      return "Ready, but it still needs teacher review."
    }

    return "Ready to use."
  }

  if (material.status === "uploaded") {
    return "Uploaded. Getting it ready now."
  }

  if (material.status === "extracting") {
    return "Reading this material now."
  }

  return "Checking what this material can support."
}

export function getExtractionMethodLabel(
  material: Pick<MaterialFile, "status" | "analysis">
): string | null {
  if (material.status !== "ready" || !material.analysis?.extractionMetadata) {
    return null
  }

  const { method, quality, confidence } = material.analysis.extractionMetadata

  // Format based on method and quality
  if (method === "fallback_notice") {
    return "No text extracted"
  }

  if (method === "ocr" || method === "mixed") {
    const qualityLabel = getQualityLabel(quality)
    const confidencePercent = confidence ? Math.round(confidence * 100) : 0
    return `${qualityLabel} OCR (${confidencePercent}%)`
  }

  if (method === "parser") {
    const qualityLabel = getQualityLabel(quality)
    return qualityLabel
  }

  return null
}

export function getTeacherVisibleMaterialSummary(
  material: Pick<MaterialFile, "role" | "status" | "errorMessage" | "analysis">
): TeacherVisibleMaterialSummary | null {
  if (material.status === "error") {
    const errorMessage = material.errorMessage?.trim()
    return {
      statusLabel: "Needs attention",
      summaryLines: [
        "This file could not be prepared for lesson use.",
      ],
      nextStep: errorMessage
        ? `Next step: ${errorMessage}`
        : "Next step: Replace this file or upload a clearer source.",
      tone: "blocked",
    }
  }

  if (material.status !== "ready" || !material.analysis) {
    return null
  }

  const extraction = material.analysis.extractionMetadata
  const reliability = material.analysis.reliability
  const isCurriculum = material.role === "curriculum"
  const decision = isCurriculum
    ? reliability?.contentDecision
    : reliability?.structureDecision
  const blocked = isCurriculum
    ? reliability?.usableForContent === false || decision === "block"
    : reliability?.usableForStructure === false || decision === "block"
  const lowExtractionSignal =
    extraction?.method === "fallback_notice" ||
    extraction?.quality === "low" ||
    (typeof extraction?.confidence === "number" && extraction.confidence < 0.45)
  const caution = !blocked && (decision === "caution" || lowExtractionSignal)

  const summaryLines = isCurriculum
    ? buildCurriculumSummaryLines(material.analysis)
    : buildExemplarSummaryLines(material.analysis)

  const lines = [...summaryLines]
  if (lines.length === 0) {
    lines.push("Very little usable text was found.")
  }

  if (extraction?.method === "fallback_notice") {
    lines.unshift("Very little usable text was found.")
  }

  if ((extraction?.method === "ocr" || extraction?.method === "mixed") && extraction?.quality === "low") {
    lines.push("OCR recovered text, but confidence is low.")
  }

  if (blocked) {
    return {
      statusLabel: "Blocked",
      summaryLines: uniqueTrimmed(lines).slice(0, 4),
      nextStep: "Review this file before using it as a source.",
      tone: "blocked",
    }
  }

  if (caution) {
    return {
      statusLabel: "Use with caution",
      summaryLines: uniqueTrimmed(lines).slice(0, 4),
      nextStep: "This file may be used with caution. Review before generating.",
      tone: "caution",
    }
  }

  return {
    statusLabel: "Strong signal",
    summaryLines: uniqueTrimmed(lines).slice(0, 4),
    tone: "strong",
  }
}

function buildCurriculumSummaryLines(
  analysis: NonNullable<MaterialFile["analysis"]>
): string[] {
  const curriculum = analysis.curriculum
  if (!curriculum) {
    return []
  }

  const lines: string[] = []

  if (curriculum.standards.length > 0) {
    lines.push(`Standards detected: ${summarizePreview(curriculum.standards, 2)}`)
  }

  const skillSignals = uniqueTrimmed([
    ...curriculum.instructionalTargets,
    ...curriculum.vocabulary,
  ])
  if (skillSignals.length > 0) {
    lines.push(`Skill/content: ${summarizePreview(skillSignals, 3)}`)
  }

  const wordSignals = uniqueTrimmed([
    ...curriculum.wordLists,
    ...curriculum.examples,
  ])
  if (wordSignals.length > 0) {
    lines.push(`Word list/examples: ${summarizePreview(wordSignals, 3)}`)
  }

  if (curriculum.practiceTasks.length > 0) {
    lines.push(`Practice ideas: ${summarizePreview(curriculum.practiceTasks, 2)}`)
  }

  return lines
}

function buildExemplarSummaryLines(
  analysis: NonNullable<MaterialFile["analysis"]>
): string[] {
  const exemplar = analysis.exemplar
  if (!exemplar) {
    return []
  }

  const lines: string[] = []

  if (exemplar.slideFlow.length > 0) {
    lines.push(`Structure detected: ${summarizeFlow(exemplar.slideFlow, 4)}`)
  }

  if (exemplar.pacing.length > 0) {
    lines.push(`Pacing: ${summarizePreview(exemplar.pacing, 2)}`)
  }

  const styleSignals = uniqueTrimmed([
    ...exemplar.reusableStructure,
    ...exemplar.layoutCues,
    ...exemplar.promptStyle,
  ])
  if (styleSignals.length > 0) {
    lines.push(`Reusable style: ${summarizePreview(styleSignals, 3)}`)
  }

  return lines
}

function summarizeFlow(values: string[], limit: number): string {
  const preview = uniqueTrimmed(values).slice(0, limit)
  if (preview.length === 0) {
    return ""
  }

  return `${preview.join(" -> ")}${values.length > limit ? "..." : ""}`
}

function summarizePreview(values: string[], limit: number): string {
  const preview = uniqueTrimmed(values).slice(0, limit)
  if (preview.length === 0) {
    return ""
  }

  return `${preview.join(", ")}${values.length > limit ? "..." : ""}`
}

function uniqueTrimmed(values: string[]): string[] {
  return Array.from(
    new Set(
      values
        .map((value) => value.trim())
        .filter(Boolean)
    )
  )
}

function getQualityLabel(quality?: ExtractionQuality | string): string {
  if (!quality) return "Unknown"
  
  switch (quality) {
    case "high":
      return "Strong"
    case "medium":
      return "Fair"
    case "low":
      return "Weak"
    default:
      return "Unknown"
  }
}
