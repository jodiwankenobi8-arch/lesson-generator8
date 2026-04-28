import React from "react"
import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { SmartTornPaperCard } from "./SmartTornPaperCard"

describe("SmartTornPaperCard", () => {
  it("renders children as real HTML content", () => {
    const markup = renderToStaticMarkup(
      <SmartTornPaperCard>
        <h3>Upload Status</h3>
        <p>Curriculum Materials Uploaded</p>
      </SmartTornPaperCard>
    )

    expect(markup).toContain("<h3>Upload Status</h3>")
    expect(markup).toContain("<p>Curriculum Materials Uploaded</p>")
  })

  it("marks decorative layers aria-hidden and non-interactive", () => {
    const markup = renderToStaticMarkup(<SmartTornPaperCard>Body</SmartTornPaperCard>)
    const hiddenMatches = markup.match(/aria-hidden=\"true\"/g) ?? []

    expect(hiddenMatches.length).toBe(8)
    expect(markup).toContain("pointer-events:none")
  })

  it("supports className and style passthrough", () => {
    const markup = renderToStaticMarkup(
      <SmartTornPaperCard className="demo-card" style={{ marginBottom: 12 }}>
        Body
      </SmartTornPaperCard>
    )

    expect(markup).toContain('class="demo-card"')
    expect(markup).toContain("margin-bottom:12px")
  })
})
