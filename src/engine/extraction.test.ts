import { describe, expect, it } from "vitest"
import {
  detectFileType,
  extractPlainText,
  extractTextFromFile,
} from "./materials/extractTextFromFile"

describe("extraction contract", () => {
  it("detectFileType recognizes supported formats", () => {
    expect(detectFileType("lesson.TXT")).toBe("txt")
    expect(detectFileType("curriculum.Pdf")).toBe("pdf")
    expect(detectFileType("guide.Docx")).toBe("docx")
    expect(detectFileType("slides.PPTX")).toBe("pptx")
    expect(detectFileType("page.html")).toBe("html")
    expect(detectFileType("page.htm")).toBe("html")
    expect(detectFileType("archive.zip")).toBe("unknown")
  })

  it("extractPlainText trims, deduplicates, and removes blank lines", () => {
    expect(
      extractPlainText("  Line one  \n\nLine two\nLine one\n   \nLine three  ")
    ).toEqual(["Line one", "Line two", "Line three"])
  })

  it("extractPlainText removes noisy low-value lines before analysis", () => {
    expect(
      extractPlainText(`
        1
        2
        https://example.com/resource
        www.example.com/unit1
        Slide 3
        ---
        ***
        Short a words
        Teacher model the blending
        12
      `)
    ).toEqual(["Short a words", "Teacher model the blending"])
  })

  it("extractTextFromFile extracts normalized txt content", async () => {
    const result = await extractTextFromFile({
      fileName: "notes.txt",
      fileContent: " Alpha  \n\nBeta\nAlpha\nGamma "
    })

    expect(result.fileType).toBe("txt")
    expect(result.extractedText).toEqual(["Alpha", "Beta", "Gamma"])
  })

  it("extractTextFromFile extracts readable html content and strips scripts/styles", async () => {
    const result = await extractTextFromFile({
      fileName: "page.html",
      fileContent: `
        <html>
          <head>
            <style>.hidden { display:none; }</style>
            <script>console.log("ignore me")</script>
          </head>
          <body>
            <h1>Lesson Focus</h1>
            <p>Short vowel a</p>
            <div>Teacher prompt &amp; modeling</div>
          </body>
        </html>
      `,
    })

    expect(result.fileType).toBe("html")
    expect(result.extractedText).toContain("Lesson Focus")
    expect(result.extractedText).toContain("Short vowel a")
    expect(result.extractedText).toContain("Teacher prompt & modeling")
    expect(result.extractedText.join(" ")).not.toMatch(/ignore me|display:none/)
  })

  it("extractTextFromFile normalizes noisy html into analysis-ready lines", async () => {
    const result = await extractTextFromFile({
      fileName: "lesson.html",
      fileContent: `
        <html>
          <body>
            <div>Slide 1</div>
            <div>https://district.example.org</div>
            <h1>Long A Lesson</h1>
            <p>Teacher says: Today we will read long a words.</p>
            <div>3</div>
          </body>
        </html>
      `,
    })

    expect(result.fileType).toBe("html")
    expect(result.extractedText).toEqual([
      "Long A Lesson",
      "Teacher says: Today we will read long a words.",
    ])
  })

  it("returns a clear message when pdf is missing a file buffer", async () => {
    const result = await extractTextFromFile({
      fileName: "curriculum.pdf",
    })

    expect(result.fileType).toBe("pdf")
    expect(result.extractedText[0]).toContain("PDF file curriculum.pdf was detected")
    expect(result.extractedText[1]).toContain("ArrayBuffer")
  })

  it("returns a clear message when docx is missing a file buffer", async () => {
    const result = await extractTextFromFile({
      fileName: "curriculum.docx",
    })

    expect(result.fileType).toBe("docx")
    expect(result.extractedText[0]).toContain("DOCX file curriculum.docx was detected")
    expect(result.extractedText[1]).toContain("ArrayBuffer")
  })

  it("returns a clear message when pptx is missing a file buffer", async () => {
    const result = await extractTextFromFile({
      fileName: "slides.pptx",
    })

    expect(result.fileType).toBe("pptx")
    expect(result.extractedText[0]).toContain("PPTX file slides.pptx was detected")
    expect(result.extractedText[1]).toContain("ArrayBuffer")
  })

  it("returns a clear unsupported message for unknown file types", async () => {
    const result = await extractTextFromFile({
      fileName: "materials.csv",
      fileContent: "a,b,c",
    })

    expect(result.fileType).toBe("unknown")
    expect(result.extractedText).toEqual([
      "Unsupported file type for materials.csv.",
      "Supported extraction targets are txt, pdf, docx, pptx, html, and htm.",
    ])
  })
})
