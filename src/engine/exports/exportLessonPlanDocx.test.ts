import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

const source = readFileSync(new URL("./exportLessonPlanDocx.ts", import.meta.url), "utf8")

describe("exportLessonPlanDocx", () => {
  it("recognizes current teacher-facing support headings for DOCX formatting", () => {
    expect(source).toContain('"Centers"')
    expect(source).toContain('"Teacher-Led Support"')
    expect(source).toContain('"Student Centers"')
    expect(source).toContain('"Student Centers Rotation Plan"')
    expect(source).toContain('"Intervention Support"')
  })
})
