import {
  inferSupportedSourceMimeType,
  isSupportedImageExtension,
  isSupportedImageMimeType,
} from "../engine/materials/sourceIntakeContract"
import type { MaterialFile, MaterialSourceKind } from "../engine/types"

export type UploadSourceMetadata = {
  sourceKind: MaterialSourceKind
  sourceLabel: string
  sourceMimeType: string | null
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
