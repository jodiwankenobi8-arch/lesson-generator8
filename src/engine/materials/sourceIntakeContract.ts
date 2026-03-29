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

export const SUPPORTED_DOCUMENT_UPLOAD_FORMATS_TEXT = formatSupportedList(
  SUPPORTED_DOCUMENT_UPLOAD_EXTENSIONS
)

export const SUPPORTED_IMAGE_UPLOAD_FORMATS_TEXT = formatSupportedList(
  SUPPORTED_IMAGE_UPLOAD_EXTENSIONS
)

export const SUPPORTED_SOURCE_UPLOAD_FORMATS_TEXT = formatSupportedList(
  SUPPORTED_SOURCE_UPLOAD_EXTENSIONS
)

export const SUPPORTED_EXTRACTION_TARGETS_TEXT = formatSupportedList(
  SUPPORTED_SOURCE_UPLOAD_EXTENSIONS.map((extension) => extension.slice(1))
)

export const SUPPORTED_EXTRACTION_TARGETS_NOTICE =
  `Supported extraction targets are ${SUPPORTED_EXTRACTION_TARGETS_TEXT}.`

export const CURRENT_SOURCE_INTAKE_MODEL_TEXT =
  "Current teacher-facing intake is upload based."

export const BOUNDED_IMAGE_OCR_RECOVERY_LANE_TEXT =
  "Screenshots and photos are a bounded OCR recovery lane, not the primary intake path, and may still be caution-scored or blocked until readable text is recovered strongly enough to be usable."

export const LINKS_AND_URLS_NOT_FIRST_CLASS_TEXT =
  "Links and URLs are not a first-class Materials source lane."

export const PASTED_TEXT_NOT_FIRST_CLASS_MATERIALS_UPLOAD_LANE_TEXT =
  "Pasted text exists in the extraction seam, but it is not a first-class Materials-page upload lane here."

export const CURRENT_INPUTS_PAGE_SOURCE_INTRO_TEXT =
  `Current intake on Materials is upload based. Materials currently accepts document uploads (${SUPPORTED_DOCUMENT_UPLOAD_FORMATS_TEXT}) plus screenshots/photos (${SUPPORTED_IMAGE_UPLOAD_FORMATS_TEXT}) as a bounded OCR recovery lane when needed. ${LINKS_AND_URLS_NOT_FIRST_CLASS_TEXT}`

export const CURRENT_MATERIALS_PAGE_SOURCE_INTRO_TEXT =
  `${CURRENT_SOURCE_INTAKE_MODEL_TEXT} Upload documents (${SUPPORTED_DOCUMENT_UPLOAD_FORMATS_TEXT}) or screenshots/photos (${SUPPORTED_IMAGE_UPLOAD_FORMATS_TEXT}). ${BOUNDED_IMAGE_OCR_RECOVERY_LANE_TEXT} ${PASTED_TEXT_NOT_FIRST_CLASS_MATERIALS_UPLOAD_LANE_TEXT} Add sources here, then generate only from usable curriculum and exemplar sources.`

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
