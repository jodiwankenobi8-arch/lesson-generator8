import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { SmartStitchedRibbonLabel } from "./SmartStitchedRibbonLabel"

describe("SmartStitchedRibbonLabel", () => {
  it("renders acceptance strings as real text", () => {
    const labels = [
      "Inputs",
      "Materials",
      "Results",
      "Teacher Planning Studio",
      "Curriculum Materials Uploaded",
      "Used with caution",
      "These materials were analyzed with caution",
    ]

    for (const label of labels) {
      const markup = renderToStaticMarkup(
        <SmartStitchedRibbonLabel allowWrap maxWidth={420}>
          {label}
        </SmartStitchedRibbonLabel>
      )

      expect(markup).toContain(label)
    }
  })

  it("keeps decorative layers aria-hidden and non-interactive", () => {
    const markup = renderToStaticMarkup(<SmartStitchedRibbonLabel>Inputs</SmartStitchedRibbonLabel>)
    const hiddenMatches = markup.match(/aria-hidden=\"true\"/g) ?? []

    expect(hiddenMatches.length).toBe(4)
    expect(markup).toContain("pointer-events:none")
    expect(markup).not.toContain('aria-hidden="true">Inputs')
  })

  it("supports className and style passthrough", () => {
    const markup = renderToStaticMarkup(
      <SmartStitchedRibbonLabel className="stitched-demo" style={{ marginBottom: 8 }}>
        Materials
      </SmartStitchedRibbonLabel>
    )

    expect(markup).toContain('class="stitched-demo"')
    expect(markup).toContain("margin-bottom:8px")
  })
})
