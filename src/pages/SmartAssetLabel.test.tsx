import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { SmartAssetLabel, pickVariantForText } from "./SmartAssetLabel"

describe("SmartAssetLabel", () => {
  it("renders children as real HTML text (not baked into image)", () => {
    const html = renderToStaticMarkup(
      <SmartAssetLabel>Lesson Inputs</SmartAssetLabel>
    )
    expect(html).toContain("Lesson Inputs")
    // Real text must NOT be an alt attribute � it must appear as node text
    expect(html).not.toMatch(/alt="Lesson Inputs"/i)
  })

  it("decorative image layer is aria-hidden with no pointer events", () => {
    const html = renderToStaticMarkup(
      <SmartAssetLabel>Materials</SmartAssetLabel>
    )
    // The background img is aria-hidden
    expect(html).toMatch(/aria-hidden="true"/)
    // The background img has no alt text content
    expect(html).toMatch(/alt=""/)
    // pointer-events none on img
    expect(html).toContain("pointer-events:none")
  })

  it("renders the explicit variant without crashing", () => {
    const variants = ["small", "medium", "large", "xlarge", "two-line"] as const
    for (const variant of variants) {
      const html = renderToStaticMarkup(
        <SmartAssetLabel variant={variant}>Sample text</SmartAssetLabel>
      )
      expect(html).toContain("Sample text")
    }
  })
})

describe("pickVariantForText", () => {
  it("picks small for very short text", () => {
    expect(pickVariantForText("Inputs")).toBe("small")
  })

  it("picks medium for short text", () => {
    expect(pickVariantForText("Lesson Inputs")).toBe("medium")
  })

  it("picks large for mid-length text", () => {
    expect(pickVariantForText("Materials & Resources")).toBe("large")
  })

  it("picks xlarge for long text", () => {
    expect(pickVariantForText("Materials and Additional Resources for This Lesson Plan")).toBe("xlarge")
  })
})
