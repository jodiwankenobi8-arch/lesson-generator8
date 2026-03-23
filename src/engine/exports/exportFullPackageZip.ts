import JSZip from "jszip"
import type { ExportArtifact } from "../types"
import { exportLessonPlanDocx } from "./exportLessonPlanDocx"
import { exportPrintablesPdf } from "./exportPrintablesPdf"
import { exportSlidesPptx } from "./exportSlidesPptx"

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
const PDF_MIME = "application/pdf"
const PPTX_MIME = "application/vnd.openxmlformats-officedocument.presentationml.presentation"

function normalizeTextContent(content: string | undefined): string {
  return (content ?? "").trim()
}

async function buildArtifactBlob(artifact: ExportArtifact): Promise<Blob> {
  const content = normalizeTextContent(artifact.content)
  if (!content) {
    throw new Error(`Cannot export empty artifact: ${artifact.label}`)
  }

  if (artifact.mimeType === DOCX_MIME || artifact.format === "docx") {
    return exportLessonPlanDocx(artifact.label, content)
  }

  if (artifact.mimeType === PDF_MIME || artifact.format === "pdf") {
    return exportPrintablesPdf(artifact.label, content)
  }

  if (artifact.mimeType === PPTX_MIME || artifact.format === "pptx") {
    const slides = content.split(/\n{2,}/).map((chunk) => chunk.trim()).filter(Boolean)
    return exportSlidesPptx(artifact.label, slides)
  }

  return new Blob([content], { type: artifact.mimeType ?? "text/plain;charset=utf-8" })
}

export async function exportFullPackageZip(title: string, artifacts: ExportArtifact[]): Promise<Blob> {
  const zip = new JSZip()
  const exportable = artifacts.filter(
    (artifact) => artifact.kind !== "full_package" && Boolean(normalizeTextContent(artifact.content))
  )

  for (const artifact of exportable) {
    const blob = await buildArtifactBlob(artifact)
    zip.file(artifact.fileName, blob)
  }

  const manifest = [
    `Package: ${title}`,
    "",
    "Included files:",
    ...exportable.map((artifact) => `- ${artifact.fileName} (${artifact.label})`),
  ].join("\n")

  zip.file("manifest.txt", manifest)

  const buffer = await zip.generateAsync({ type: "arraybuffer" })
  return new Blob([buffer], { type: "application/zip" })
}