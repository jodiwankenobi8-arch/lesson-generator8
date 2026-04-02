import type { ExportArtifact, LessonInputs } from "../types"

export function buildExports(
  inputs: LessonInputs,
  slides: string[],
  lessonPlan: string,
  centers: string[],
  rotationPlan: string,
  interventions: string[],
  exportOptions: {
    includeLessonSlidesExport: boolean
    includeLessonPlanExport: boolean
    includePrintablesExport: boolean
  }
): ExportArtifact[] {
  const safeSubject = sanitizeExportSubject(inputs.subject)

  const artifacts: ExportArtifact[] = []

  if (exportOptions.includeLessonSlidesExport) {
    artifacts.push({
      kind: "slides",
      label: "Slides Export",
      fileName: `${safeSubject}-slides-export.pptx`,
      format: "pptx",
      mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      content: buildSlidesExportText(slides),
    })
  }

  if (exportOptions.includeLessonPlanExport) {
    artifacts.push({
      kind: "lesson_plan",
      label: "Lesson Plan Export",
      fileName: `${safeSubject}-lesson-plan-export.docx`,
      format: "docx",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      content: lessonPlan,
    })
  }

  if (exportOptions.includePrintablesExport) {
    artifacts.push({
      kind: "printables",
      label: "Centers & Support Printables Export",
      fileName: `${safeSubject}-printables-export.pdf`,
      format: "pdf",
      mimeType: "application/pdf",
      content: buildPrintablesExportText(centers, rotationPlan, interventions),
    })
  }

  if (artifacts.length > 0) {
    artifacts.unshift({
      kind: "full_package",
      format: "zip",
      label: "Full Lesson Package",
      fileName: `${safeSubject}-full-lesson-package.zip`,
      mimeType: "application/zip",
      content: [
        lessonPlan,
        slides.join("\n\n"),
        exportOptions.includePrintablesExport
          ? buildPrintablesExportText(centers, rotationPlan, interventions)
          : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
    })
  }

  return artifacts
}

function buildSlidesExportText(slides: string[]): string {
  const lines = slides.length > 0 ? slides : ["No slides defined."]

  return [
    "Slides Export",
    "",
    ...lines,
  ].join("\n")
}

function buildPrintablesExportText(
  centers: string[],
  rotationPlan: string,
  interventions: string[]
): string {
  const centerLines =
    centers.length > 0
      ? centers.map((center) => `- ${center}`)
      : ["- No student centers defined."]

  const { teacherLedSupportLines, rotationOnlyLines } = splitRotationPlanLines(rotationPlan)

  const teacherLedSupportSection = teacherLedSupportLines.length > 0
    ? [
        "",
        "Teacher-Led Support",
        ...teacherLedSupportLines,
      ]
    : []

  const rotationSection = centers.length > 0 || rotationOnlyLines.length > 0
    ? [
        "",
        "Centers / Independent Work Rotation",
        ...(rotationOnlyLines.length > 0 ? rotationOnlyLines : ["No rotation plan defined."]),
      ]
    : []

  const interventionLines =
    interventions.length > 0
      ? interventions.map((item) => `- ${item}`)
      : ["- No intervention support defined."]

  return [
    "Centers & Support Printables Export",
    "",
    "Current scope: selected centers, teacher-led support, independent work rotation, and intervention printables where this repo already supports classroom-ready output.",
    "",
    "Centers / Independent Work",
    ...centerLines,
    ...teacherLedSupportSection,
    ...rotationSection,
    "",
    "Intervention Support",
    ...interventionLines,
  ].join("\n")
}

function splitRotationPlanLines(rotationPlan: string): {
  teacherLedSupportLines: string[]
  rotationOnlyLines: string[]
} {
  const lines = rotationPlan
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  return {
    teacherLedSupportLines: lines.filter((line) => line.startsWith("Teacher-Led Support Focus:")),
    rotationOnlyLines: lines.filter((line) => !line.startsWith("Teacher-Led Support Focus:")),
  }
}

function sanitizeExportSubject(subject: string): string {
  const trimmed = subject.trim()

  if (!trimmed) {
    return "lesson"
  }

  const cleaned = trimmed
    .replace(/[^\w\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")

  return cleaned || "lesson"
}
