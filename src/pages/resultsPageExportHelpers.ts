import type { ExportArtifact } from "../engine/types"

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
const PDF_MIME = "application/pdf"
const PPTX_MIME = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
const ZIP_MIME = "application/zip"

export function getArtifactFormatLabel(artifact: ExportArtifact): string {
  if (artifact.format === "zip" || artifact.mimeType === ZIP_MIME) return "ZIP"
  if (artifact.format === "pptx" || artifact.mimeType === PPTX_MIME) return "PPTX"
  if (artifact.format === "pdf" || artifact.mimeType === PDF_MIME) return "PDF"
  return "DOCX"
}

export function getArtifactKindLabel(artifact: ExportArtifact): string {
  if (artifact.kind === "full_package") return "Package ZIP"
  if (artifact.kind === "lesson_plan") return "Lesson plan"
  if (artifact.kind === "slides") return "Slides"
  if (artifact.kind === "printables") return "Printables"
  return "Export"
}

export function getArtifactButtonLabel(artifact: ExportArtifact): string {
  if (artifact.format === "zip" || artifact.mimeType === ZIP_MIME) return "Download ZIP"
  if (artifact.format === "pptx" || artifact.mimeType === PPTX_MIME) return "Download PPTX"
  if (artifact.format === "pdf" || artifact.mimeType === PDF_MIME) return "Download PDF"
  return "Download DOCX"
}

export function getArtifactDescription(artifact: ExportArtifact): string {
  if (artifact.format === "zip" || artifact.mimeType === ZIP_MIME) {
    return "This download bundles the current generated artifacts into a ZIP file."
  }

  if (artifact.format === "pptx" || artifact.mimeType === PPTX_MIME) {
    return "This download is generated from the current lesson package and saves as a PPTX slide deck."
  }

  if (artifact.format === "pdf" || artifact.mimeType === PDF_MIME) {
    return "This download is generated from the current lesson package and saves as a PDF handout."
  }

  return "This download is generated from the current lesson package and saves as a DOCX lesson plan."
}

export function getBundledArtifactLabels(exports: ExportArtifact[]): string[] {
  return exports
    .filter((artifact) => artifact.kind !== "full_package")
    .map((artifact) => artifact.label)
}

export async function downloadExportArtifact(artifact: ExportArtifact, artifacts: ExportArtifact[] = []) {
  if (!artifact.content) return

  let blob: Blob

  if (artifact.format === "zip" || artifact.mimeType === ZIP_MIME) {
    const { exportFullPackageZip } = await import("../engine/exports/exportFullPackageZip")
    blob = await exportFullPackageZip(artifact.label, artifacts.length ? artifacts : [artifact])
  } else if (artifact.format === "pptx" || artifact.mimeType === PPTX_MIME) {
    const { exportSlidesPptx, parseSlidesExportContent } = await import("../engine/exports/exportSlidesPptx")
    const slides = parseSlidesExportContent(artifact.content)
    blob = await exportSlidesPptx(artifact.label, slides)
  } else if (artifact.format === "pdf" || artifact.mimeType === PDF_MIME) {
    const { exportPrintablesPdf } = await import("../engine/exports/exportPrintablesPdf")
    blob = await exportPrintablesPdf(artifact.label, artifact.content)
  } else {
    const { exportLessonPlanDocx } = await import("../engine/exports/exportLessonPlanDocx")
    blob = await exportLessonPlanDocx(artifact.label, artifact.content)
  }

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = artifact.fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
