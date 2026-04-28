import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { SmartWoodLabel } from "./SmartWoodLabel"

function renderLabel(text: string): string {
  return renderToStaticMarkup(<SmartWoodLabel>{text}</SmartWoodLabel>)
}

describe("SmartWoodLabel", () => {
  it("renders the acceptance strings as real text", () => {
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
      const markup = renderLabel(label)
      expect(markup).toContain(label)
    }
  })

  it("keeps decorative layers aria-hidden while not hiding text content", () => {
    const markup = renderLabel("Inputs")

    const hiddenMatches = markup.match(/aria-hidden=\"true\"/g) ?? []
    expect(hiddenMatches.length).toBeGreaterThanOrEqual(3)
    expect(markup).not.toContain('aria-hidden="true">Inputs')
  })

  it("supports className and style passthrough", () => {
    const markup = renderToStaticMarkup(
      <SmartWoodLabel className="demo-label" style={{ marginTop: 10 }}>
        Results
      </SmartWoodLabel>
    )

    expect(markup).toContain('class="demo-label"')
    expect(markup).toContain("margin-top:10px")
  })
})
