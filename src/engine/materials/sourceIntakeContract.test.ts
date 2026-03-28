import { describe, expect, it } from "vitest"

import {
  SUPPORTED_EXTRACTION_TARGETS_NOTICE,
  SUPPORTED_SOURCE_UPLOAD_ACCEPT,
  SUPPORTED_SOURCE_UPLOAD_EXTENSIONS,
  SUPPORTED_SOURCE_UPLOAD_FORMATS_TEXT,
  getSupportedSourceUploadExtension,
  inferSupportedSourceMimeType,
  isSupportedImageExtension,
} from "./sourceIntakeContract"

describe("sourceIntakeContract", () => {
  it("keeps the upload accept string, human-readable list, and extraction notice aligned", () => {
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
    expect(SUPPORTED_SOURCE_UPLOAD_FORMATS_TEXT).toBe(
      ".txt, .pdf, .docx, .pptx, .html, .htm, .png, .jpg, .jpeg, and .webp"
    )
    expect(SUPPORTED_EXTRACTION_TARGETS_NOTICE).toBe(
      "Supported extraction targets are txt, pdf, docx, pptx, html, htm, png, jpg, jpeg, and webp."
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
