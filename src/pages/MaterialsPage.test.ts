import { describe, expect, it } from "vitest"
import { buildUploadSourceMetadata, inferMimeTypeFromName } from "./MaterialsPage"

describe("buildUploadSourceMetadata", () => {
  it("classifies image uploads as bounded OCR recovery sources with traceable metadata", () => {
    const metadata = buildUploadSourceMetadata({
      name: "worksheet-photo.png",
      type: "image/png",
    })

    expect(metadata).toEqual({
      sourceKind: "image_upload",
      sourceLabel: "worksheet-photo.png",
      sourceMimeType: "image/png",
    })
  })


  it("keeps supported MIME-only screenshots in the OCR recovery lane", () => {
    const metadata = buildUploadSourceMetadata({
      name: "Camera Upload",
      type: "image/png",
    })

    expect(metadata).toEqual({
      sourceKind: "image_upload",
      sourceLabel: "Camera Upload",
      sourceMimeType: "image/png",
    })
  })

  it("does not silently route unsupported image MIME uploads into the OCR recovery lane yet", () => {
    const metadata = buildUploadSourceMetadata({
      name: "district-scan.bmp",
      type: "image/bmp",
    })

    expect(metadata).toEqual({
      sourceKind: "file_upload",
      sourceLabel: "district-scan.bmp",
      sourceMimeType: "image/bmp",
    })
  })

  it("falls back to file-name inference when the browser omits a MIME type", () => {
    const metadata = buildUploadSourceMetadata({
      name: "lesson-outline.docx",
      type: "",
    })

    expect(metadata).toEqual({
      sourceKind: "file_upload",
      sourceLabel: "lesson-outline.docx",
      sourceMimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    })
  })


  it("keeps image uploads in the OCR recovery lane when the browser omits a MIME type", () => {
    const metadata = buildUploadSourceMetadata({
      name: "screenshot-note.webp",
      type: "",
    })

    expect(metadata).toEqual({
      sourceKind: "image_upload",
      sourceLabel: "screenshot-note.webp",
      sourceMimeType: "image/webp",
    })
  })
})

describe("inferMimeTypeFromName", () => {
  it("returns null for unknown extensions so upload provenance stays honest", () => {
    expect(inferMimeTypeFromName("notes.custom")).toBeNull()
  })
})
