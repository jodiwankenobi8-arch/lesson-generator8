import { describe, expect, it } from "vitest"
import { buildLessonHeader } from "./buildPackageLessonPlanTextHelpers"

describe("buildLessonHeader", () => {
  it("uses resolved grounded standards instead of raw placeholder input standards", () => {
    const header = buildLessonHeader(
      {
        grade: "K",
        subject: "ELA",
        standard: "teacher-selected standard",
        skill: "Long A phonics",
        topic: "Long a words",
        duration: "25 mins",
      } as any,
      {
        content: {
          standards: ["ELA.K.F.1.1"],
        },
      } as any
    )

    expect(header).toContain("Standard(s): ELA.K.F.1.1")
    expect(header).not.toContain("teacher-selected standard")
  })
})
