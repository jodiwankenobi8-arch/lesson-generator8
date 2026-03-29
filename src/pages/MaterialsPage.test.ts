import { describe, expect, it } from "vitest"
import {
  buildUploadSourceMetadata,
  getTeacherVisibleMaterialNote,
  inferMimeTypeFromName,
  isSupportedUploadFile,
} from "./MaterialsPage"

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

describe("isSupportedUploadFile", () => {
  it("accepts supported document uploads for drag and drop", () => {
    expect(
      isSupportedUploadFile({
        name: "lesson-outline.docx",
        type: "",
      })
    ).toBe(true)
  })

  it("keeps MIME-only screenshots compatible with drag and drop", () => {
    expect(
      isSupportedUploadFile({
        name: "Camera Upload",
        type: "image/png",
      })
    ).toBe(true)
  })

  it("rejects unsupported dropped files before they reach the workbench", () => {
    expect(
      isSupportedUploadFile({
        name: "district-scan.bmp",
        type: "image/bmp",
      })
    ).toBe(false)
  })
})

describe("getTeacherVisibleMaterialNote", () => {
  it("returns a simple ready status for usable materials", () => {
    expect(
      getTeacherVisibleMaterialNote({
        status: "ready",
        errorMessage: null,
        analysis: {
          reliability: {
            usableForContent: true,
            usableForStructure: false,
          },
        },
      } as never)
    ).toBe("Ready to use in generation.")
  })

  it("keeps blocked ready materials teacher-readable", () => {
    expect(
      getTeacherVisibleMaterialNote({
        status: "ready",
        errorMessage: null,
        analysis: {
          reliability: {
            usableForContent: false,
            usableForStructure: false,
          },
        },
      } as never)
    ).toBe("Ready, but it still needs teacher review before use.")
  })

  it("uses the error message directly when a file needs attention", () => {
    expect(
      getTeacherVisibleMaterialNote({
        status: "error",
        errorMessage: "Unsupported file content",
        analysis: null,
      } as never)
    ).toBe("Unsupported file content")
  })
})

describe("inferMimeTypeFromName", () => {
  it("returns null for unknown extensions so upload provenance stays honest", () => {
    expect(inferMimeTypeFromName("notes.custom")).toBeNull()
  })
})
