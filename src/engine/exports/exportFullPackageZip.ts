import JSZip from "jszip"
import type { ExportArtifact } from "../types"

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
const PDF_MIME = "application/pdf"
const PPTX_MIME = "application/vnd.openxmlformats-officedocument.presentationml.presentation"

function normalizeTextContent(content: string | undefined): string {
  return (content ?? "").trim()
}

async function blobToZipData(blob: Blob): Promise<Uint8Array> {
  return new Uint8Array(await blob.arrayBuffer())
}

async function buildArtifactData(artifact: ExportArtifact): Promise<Uint8Array | string> {
  const content = normalizeTextContent(artifact.content)
  if (!content) {
    throw new Error(`Cannot export empty artifact: ${artifact.label}`)
  }

  if (artifact.mimeType === DOCX_MIME || artifact.format === "docx") {
    const { exportLessonPlanDocx } = await import("./exportLessonPlanDocx")
    return blobToZipData(await exportLessonPlanDocx(artifact.label, content))
  }

  if (artifact.mimeType === PDF_MIME || artifact.format === "pdf") {
    const { exportPrintablesPdf } = await import("./exportPrintablesPdf")
    return blobToZipData(await exportPrintablesPdf(artifact.label, content))
  }

  if (artifact.mimeType === PPTX_MIME || artifact.format === "pptx") {
    const { exportSlidesPptx, parseSlidesExportContent } = await import("./exportSlidesPptx")
    const slides = parseSlidesExportContent(content)
    return blobToZipData(await exportSlidesPptx(artifact.label, slides))
  }

  return content
}

export async function exportFullPackageZip(title: string, artifacts: ExportArtifact[]): Promise<Blob> {
  const zip = new JSZip()
  const exportable = artifacts.filter(
    (artifact) => artifact.kind !== "full_package" && Boolean(normalizeTextContent(artifact.content))
  )

  for (const artifact of exportable) {
    const data = await buildArtifactData(artifact)
    zip.file(artifact.fileName, data)
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
