import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import {
  buildUploadSourceMetadata,
  getTeacherVisibleMaterialNote,
  inferMimeTypeFromName,
  isSupportedUploadFile,
} from "./MaterialsPage"
import { EXEMPLAR_INFLUENCE_MODE_OPTIONS } from "./materialsPageExemplarHelpers"

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
    ).toBe("Ready to use.")
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
    ).toBe("Ready, but it still needs teacher review.")
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


describe("getTeacherVisibleMaterialNote progress wording", () => {
  it("keeps upload and processing notes teacher-readable", () => {
    expect(
      getTeacherVisibleMaterialNote({
        status: "uploaded",
        errorMessage: null,
        analysis: null,
      } as never)
    ).toBe("Uploaded. Getting it ready now.")

    expect(
      getTeacherVisibleMaterialNote({
        status: "extracting",
        errorMessage: null,
        analysis: null,
      } as never)
    ).toBe("Reading this material now.")

    expect(
      getTeacherVisibleMaterialNote({
        status: "analyzing",
        errorMessage: null,
        analysis: null,
      } as never)
    ).toBe("Checking what this material can support.")
  })
})

describe("exemplar restyle note copy", () => {
  it("keeps the custom exemplar option focused on preserving structure while restyling details", () => {
    const customOption = EXEMPLAR_INFLUENCE_MODE_OPTIONS.find((option) => option.value === "custom")

    expect(customOption).toBeDefined()
    expect(customOption?.label).toBe("Keep structure, restyle details")
    expect(customOption?.help).toContain("layout, structure, and pacing")
    expect(customOption?.help).toContain("colors, theme, or wording")
  })
})


describe("Materials page teacher-facing copy", () => {
  it("keeps the visible workbench language simple and classroom-facing", () => {
    const source = readFileSync("src/pages/MaterialsPage.tsx", "utf8")

    expect(source).toContain(
      "Add the curriculum and exemplar materials you want this lesson to follow."
    )
    expect(source).toContain("You can generate now. At least one material is ready to use.")
    expect(source).toContain(
      "Each file shows whether it is being prepared, ready to use, or needs attention."
    )

    expect(source).not.toContain(
      "Lesson generation stays paused until uploads finish processing."
    )
    expect(source).not.toContain(
      "At least one material is ready to use in grounded lesson generation."
    )
    expect(source).not.toContain(
      "Status stays visible while each file moves through upload, extraction, analysis, and ready."
    )
  })
})
