import { describe, expect, it } from "vitest"

import {
  BOUNDED_IMAGE_OCR_RECOVERY_LANE_TEXT,
  CURRENT_INPUTS_PAGE_SOURCE_INTRO_TEXT,
  CURRENT_MATERIALS_PAGE_SOURCE_INTRO_TEXT,
  CURRENT_SOURCE_INTAKE_MODEL_TEXT,
  LINKS_AND_URLS_NOT_FIRST_CLASS_TEXT,
  PASTED_TEXT_NOT_FIRST_CLASS_MATERIALS_UPLOAD_LANE_TEXT,
  SUPPORTED_DOCUMENT_UPLOAD_FORMATS_TEXT,
  SUPPORTED_EXTRACTION_TARGETS_NOTICE,
  SUPPORTED_IMAGE_UPLOAD_FORMATS_TEXT,
  SUPPORTED_SOURCE_UPLOAD_ACCEPT,
  SUPPORTED_SOURCE_UPLOAD_EXTENSIONS,
  SUPPORTED_SOURCE_UPLOAD_FORMATS_TEXT,
  getSupportedSourceUploadExtension,
  inferSupportedSourceMimeType,
  isSupportedImageExtension,
} from "./sourceIntakeContract"

describe("sourceIntakeContract", () => {
  it("keeps the upload accept string, grouped human-readable lists, and extraction notice aligned", () => {
    expect(SUPPORTED_SOURCE_UPLOAD_EXTENSIONS).toEqual([
      ".txt",
      ".pdf",
      ".docx",
      ".pptx",
      ".html",
      ".htm",
      ".png",
      ".jpg",
      ".jpeg",
      ".webp",
    ])

    expect(SUPPORTED_SOURCE_UPLOAD_ACCEPT).toBe(
      ".txt,.pdf,.docx,.pptx,.html,.htm,.png,.jpg,.jpeg,.webp"
    )
    expect(SUPPORTED_DOCUMENT_UPLOAD_FORMATS_TEXT).toBe(
      ".txt, .pdf, .docx, .pptx, .html, and .htm"
    )
    expect(SUPPORTED_IMAGE_UPLOAD_FORMATS_TEXT).toBe(
      ".png, .jpg, .jpeg, and .webp"
    )
    expect(SUPPORTED_SOURCE_UPLOAD_FORMATS_TEXT).toBe(
      ".txt, .pdf, .docx, .pptx, .html, .htm, .png, .jpg, .jpeg, and .webp"
    )
    expect(SUPPORTED_EXTRACTION_TARGETS_NOTICE).toBe(
      "Supported extraction targets are txt, pdf, docx, pptx, html, htm, png, jpg, jpeg, and webp."
    )
  })

  it("locks the teacher-facing source-matrix wording from one contract", () => {
    expect(CURRENT_SOURCE_INTAKE_MODEL_TEXT).toBe(
      "Current teacher-facing intake is upload based."
    )
    expect(BOUNDED_IMAGE_OCR_RECOVERY_LANE_TEXT).toBe(
      "Screenshots and photos are a bounded OCR recovery lane, not the primary intake path, and may still be caution-scored or blocked until readable text is recovered strongly enough to be usable."
    )
    expect(LINKS_AND_URLS_NOT_FIRST_CLASS_TEXT).toBe(
      "Links and URLs are not a first-class Materials source lane."
    )
    expect(PASTED_TEXT_NOT_FIRST_CLASS_MATERIALS_UPLOAD_LANE_TEXT).toBe(
      "Pasted text exists in the extraction seam, but it is not a first-class Materials-page upload lane here."
    )
    expect(CURRENT_INPUTS_PAGE_SOURCE_INTRO_TEXT).toBe(
      "Current intake on Materials is upload based. Materials currently accepts document uploads (.txt, .pdf, .docx, .pptx, .html, and .htm) plus screenshots/photos (.png, .jpg, .jpeg, and .webp) as a bounded OCR recovery lane when needed. Links and URLs are not a first-class Materials source lane."
    )
    expect(CURRENT_MATERIALS_PAGE_SOURCE_INTRO_TEXT).toBe(
      "Current teacher-facing intake is upload based. Upload documents (.txt, .pdf, .docx, .pptx, .html, and .htm) or screenshots/photos (.png, .jpg, .jpeg, and .webp). Screenshots and photos are a bounded OCR recovery lane, not the primary intake path, and may still be caution-scored or blocked until readable text is recovered strongly enough to be usable. Pasted text exists in the extraction seam, but it is not a first-class Materials-page upload lane here. Add sources here, then generate only from usable curriculum and exemplar sources."
    )
  })

  it("infers supported extensions and MIME types without guessing unknown uploads", () => {
    expect(getSupportedSourceUploadExtension("Lesson.PDF")).toBe(".pdf")
    expect(getSupportedSourceUploadExtension("anchor-chart.webp")).toBe(".webp")
    expect(getSupportedSourceUploadExtension("notes.custom")).toBeNull()

    expect(inferSupportedSourceMimeType("lesson-outline.docx")).toBe(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
    expect(inferSupportedSourceMimeType("anchor-chart.webp")).toBe("image/webp")
    expect(inferSupportedSourceMimeType("notes.custom")).toBeNull()
  })

  it("keeps extension-based image detection aligned with the bounded OCR lane", () => {
    expect(isSupportedImageExtension("worksheet-photo.png")).toBe(true)
    expect(isSupportedImageExtension("screenshot-note.webp")).toBe(true)
    expect(isSupportedImageExtension("lesson-outline.docx")).toBe(false)
  })
})
