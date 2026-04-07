import JSZip from "jszip"
import { describe, expect, it } from "vitest"
import { exportFullPackageZip } from "./exportFullPackageZip"
import { parseSlidesExportContent } from "./exportSlidesPptx"

describe("parseSlidesExportContent", () => {
  it("drops the export heading and returns one entry per slide even when markers are inline", () => {
    const content = [
      "Slides Export",
      "",
      "Slide 1: Objective | Kind: objective",
      "Slide 2: Guided Practice | Kind: guided_practice Slide 3: Closure | Kind: closure",
      "Slide 4: Teaching Notes | Kind: teaching_notes",
    ].join("\n")

    expect(parseSlidesExportContent(content)).toEqual([
      "Slide 1: Objective | Kind: objective",
      "Slide 2: Guided Practice | Kind: guided_practice",
      "Slide 3: Closure | Kind: closure",
      "Slide 4: Teaching Notes | Kind: teaching_notes",
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
        "Slide 1: Objective | Kind: objective",
        "Slide 2: Guided Practice | Kind: guided_practice Slide 3: Closure | Kind: closure",
        "Slide 4: Teaching Notes | Kind: teaching_notes",
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
})
