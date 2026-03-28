export const SUPPORTED_DOCUMENT_UPLOAD_EXTENSIONS = [
  ".txt",
  ".pdf",
  ".docx",
  ".pptx",
  ".html",
  ".htm",
] as const

export const SUPPORTED_IMAGE_UPLOAD_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
] as const

export const SUPPORTED_SOURCE_UPLOAD_EXTENSIONS = [
  ...SUPPORTED_DOCUMENT_UPLOAD_EXTENSIONS,
  ...SUPPORTED_IMAGE_UPLOAD_EXTENSIONS,
] as const

export type SupportedSourceUploadExtension =
  (typeof SUPPORTED_SOURCE_UPLOAD_EXTENSIONS)[number]

const SUPPORTED_SOURCE_MIME_TYPES: Record<SupportedSourceUploadExtension, string> = {
  ".txt": "text/plain",
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".html": "text/html",
  ".htm": "text/html",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
}

export const SUPPORTED_SOURCE_UPLOAD_ACCEPT =
  SUPPORTED_SOURCE_UPLOAD_EXTENSIONS.join(",")

export const SUPPORTED_SOURCE_UPLOAD_FORMATS_TEXT = formatSupportedList(
  SUPPORTED_SOURCE_UPLOAD_EXTENSIONS
)

export const SUPPORTED_EXTRACTION_TARGETS_TEXT = formatSupportedList(
  SUPPORTED_SOURCE_UPLOAD_EXTENSIONS.map((extension) => extension.slice(1))
)

export const SUPPORTED_EXTRACTION_TARGETS_NOTICE =
  `Supported extraction targets are ${SUPPORTED_EXTRACTION_TARGETS_TEXT}.`

export function getSupportedSourceUploadExtension(
  fileName: string
): SupportedSourceUploadExtension | null {
  const lower = fileName.trim().toLowerCase()

  return (
    SUPPORTED_SOURCE_UPLOAD_EXTENSIONS.find((extension) =>
      lower.endsWith(extension)
    ) ?? null
  )
}

export function inferSupportedSourceMimeType(fileName: string): string | null {
  const extension = getSupportedSourceUploadExtension(fileName)

  return extension ? SUPPORTED_SOURCE_MIME_TYPES[extension] : null
}

export function isSupportedImageExtension(fileName: string): boolean {
  const extension = getSupportedSourceUploadExtension(fileName)

  return extension
    ? SUPPORTED_IMAGE_UPLOAD_EXTENSIONS.some((imageExtension) => imageExtension === extension)
    : false
}

export function isSupportedImageMimeType(mimeType?: string | null): boolean {
  return mimeType?.trim().toLowerCase().startsWith("image/") ?? false
}

function formatSupportedList(items: readonly string[]): string {
  if (items.length === 0) {
    return ""
  }

  if (items.length === 1) {
    return items[0]
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`
  }

  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`
}
