import JSZip from "jszip"
import { describe, expect, it } from "vitest"
import { exportFullPackageZip } from "./exportFullPackageZip"
import { parseSlidesExportContent } from "./exportSlidesPptx"

describe("parseSlidesExportContent", () => {
  it("drops the export heading and returns one entry per slide even when markers are inline", () => {
    const content = [
      "Slides Export",
      "",
      "Slide 1: Objective",
      "Slide 2: Guided Practice Slide 3: Closure",
      "Slide 4: Teaching Notes",
    ].join("\n")

    expect(parseSlidesExportContent(content)).toEqual([
      "Slide 1: Objective",
      "Slide 2: Guided Practice",
      "Slide 3: Closure",
      "Slide 4: Teaching Notes",
    ])
  })
})

describe("exportFullPackageZip PPTX packaging", () => {
  it("writes one physical PPTX slide per exported slide entry", async () => {
    const artifact = {
      kind: "slides",
      format: "pptx",
      label: "Slides Export",
      fileName: "ELA-slides-export.pptx",
      mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      content: [
        "Slides Export",
        "",
        "Slide 1: Objective",
        "Slide 2: Guided Practice Slide 3: Closure",
        "Slide 4: Teaching Notes",
      ].join("\n"),
    } as const

    const zipBlob = await exportFullPackageZip("Full Lesson Package", [artifact])
    const zipBuffer = await zipBlob.arrayBuffer()
    const zip = await JSZip.loadAsync(zipBuffer)
    const pptxFile = zip.file(artifact.fileName)

    expect(pptxFile).toBeTruthy()

    const pptxBuffer = await pptxFile!.async("arraybuffer")
    const pptx = await JSZip.loadAsync(pptxBuffer)
    const slideFiles = Object.keys(pptx.files).filter((name) =>
      /^ppt\/slides\/slide\d+\.xml$/.test(name)
    )

    expect(slideFiles).toHaveLength(4)
  })

  it("bundles PDF printables into the full package ZIP manifest", async () => {
    const zipBlob = await exportFullPackageZip("Full Lesson Package", [
      {
        kind: "lesson_plan",
        format: "docx",
        label: "Lesson Plan Export",
        fileName: "ELA-lesson-plan-export.docx",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        content: "Lesson plan body",
      },
      {
        kind: "slides",
        format: "pptx",
        label: "Slides Export",
        fileName: "ELA-slides-export.pptx",
        mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        content: "Slides Export\n\nSlide 1: Opening",
      },
      {
        kind: "printables",
        format: "pdf",
        label: "Centers & Support Printables Export",
        fileName: "ELA-printables-export.pdf",
        mimeType: "application/pdf",
        content: "Centers & Support Printables Export",
      },
    ])

    const zip = await JSZip.loadAsync(await zipBlob.arrayBuffer())
    const fileNames = Object.keys(zip.files)

    expect(fileNames).toEqual(
      expect.arrayContaining([
        "ELA-lesson-plan-export.docx",
        "ELA-slides-export.pptx",
        "ELA-printables-export.pdf",
        "manifest.txt",
      ])
    )

    const manifest = await zip.file("manifest.txt")!.async("string")
    expect(manifest).toContain("ELA-printables-export.pdf")
    expect(manifest).toContain("Centers & Support Printables Export")
  })
})
