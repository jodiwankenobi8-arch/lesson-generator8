import type { LessonPackage } from "../engine/types"

export type BinderSurfaceTone = "neutral" | "moss" | "honey" | "cranberry"

export type PackageSnapshotItem = {
  label: string
  tone: BinderSurfaceTone
}

function hasVisibleText(content: string): boolean {
  return content.trim().length > 0
}

export function sanitizeListItems(items: string[]): string[] {
  return items
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

export function extractTeacherLedSupportLines(rotationPlan: string): string[] {
  return sanitizeListItems(rotationPlan.split(/\r?\n/))
    .filter((line) => line.startsWith("Teacher-Led Support Focus:"))
}

export function extractRotationOnlyText(rotationPlan: string): string {
  return sanitizeListItems(rotationPlan.split(/\r?\n/))
    .filter((line) => !line.startsWith("Teacher-Led Support Focus:"))
    .join("\n")
}

export function countTeacherLedSupportLines(rotationPlan: string): number {
  return extractTeacherLedSupportLines(rotationPlan).length
}

export function buildVisiblePackageSectionItems(lessonPackage: LessonPackage): PackageSnapshotItem[] {
  const items: PackageSnapshotItem[] = []
  const lessonPlan = lessonPackage.lessonPlan.trim()
  const slides = sanitizeListItems(lessonPackage.slides)
  const teacherLedSupportLines = extractTeacherLedSupportLines(lessonPackage.rotationPlan)
  const rotationOnly = extractRotationOnlyText(lessonPackage.rotationPlan)
  const interventions = sanitizeListItems(lessonPackage.interventions)
  const centers = sanitizeListItems(lessonPackage.centers)

  if (hasVisibleText(lessonPlan)) {
    items.push({ label: "Lesson Plan", tone: "moss" })
  }

  if (slides.length > 0) {
    items.push({ label: "Slides", tone: "moss" })
  }

  if (teacherLedSupportLines.length > 0) {
    items.push({ label: "Teacher-Led Support", tone: "moss" })
  }

  if (interventions.length > 0) {
    items.push({ label: "Intervention Support", tone: "honey" })
  }

  if (centers.length > 0) {
    items.push({ label: "Centers / Independent Work", tone: "neutral" })
  }

  if (hasVisibleText(rotationOnly)) {
    items.push({ label: "Centers / Independent Work Rotation", tone: "neutral" })
  }

  return items
}

export function getVisiblePackageSectionLabels(lessonPackage: LessonPackage): string[] {
  return buildVisiblePackageSectionItems(lessonPackage).map((item) => item.label)
}

const SHOW_SECONDARY_EVIDENCE = false

export function shouldShowSecondaryEvidencePanel(): boolean {
  return SHOW_SECONDARY_EVIDENCE
}

export function getResultsHeaderStatusText(): string {
  return "Status stays visible if anything needs attention before export."
}

export function getTeacherBinderLeadText(): string {
  return "Review what is included, then download only the pieces you need."
}

export function getPackageWarningsMessage(warningCount: number): string {
  return warningCount > 0
    ? "This package needs a teacher review before classroom use."
    : "No package warnings are currently flagged for this lesson."
}

export function getBinderReadinessTone(lessonPackage: LessonPackage): BinderSurfaceTone {
  return lessonPackage.readiness.contentFit === "grounded" ? "moss" : "honey"
}

export function getBinderReadinessLabel(lessonPackage: LessonPackage): string {
  return lessonPackage.readiness.contentFit === "grounded"
    ? "Ready to review"
    : "Needs teacher review"
}
