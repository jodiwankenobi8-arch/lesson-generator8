import { describe, expect, it } from "vitest"
import {
  formatSlidePreviewItem,
  getPackageWarningsMessage,
  getResultsHeaderStatusText,
  getTeacherBinderLeadText,
  shouldShowSecondaryEvidencePanel,
} from "./ResultsPage"

describe("teacher-minimal results surface", () => {
  it("keeps secondary evidence hidden from the main results surface", () => {
    expect(shouldShowSecondaryEvidencePanel()).toBe(false)
  })

  it("uses a status-only helper line in the results header", () => {
    expect(getResultsHeaderStatusText()).toBe(
      "Status stays visible if anything needs attention before export."
    )
  })

  it("keeps the binder lead text focused on exports", () => {
    expect(getTeacherBinderLeadText()).toBe(
      "Review what is included, then download only the pieces you need."
    )
  })

  it("keeps warning copy teacher-facing", () => {
    expect(getPackageWarningsMessage(2)).toBe(
      "This package needs a teacher review before classroom use."
    )
    expect(getPackageWarningsMessage(0)).toBe(
      "No package warnings are currently flagged for this lesson."
    )
  })
})

describe("formatSlidePreviewItem — Guided/Independent Practice split", () => {
  it("splits single-line Guided Practice title with embedded colon content into title — practice — words", () => {
    const input = "Slide 4: Guided Practice: Blend and read long a words; Sort long a words: cake, game, lake"
    const result = formatSlidePreviewItem(input)
    expect(result).toBe(
      "Slide 4: Guided Practice — Practice: Blend and read long a words; Sort long a words — Words: cake, game, lake"
    )
  })

  it("splits single-line Independent Practice title with embedded colon content into title — practice — words", () => {
    const input = "Slide 5: Independent Practice: Blend and read long a words; Sort long a words: cake, game, lake"
    const result = formatSlidePreviewItem(input)
    expect(result).toBe(
      "Slide 5: Independent Practice — Practice: Blend and read long a words; Sort long a words — Words: cake, game, lake"
    )
  })

  it("handles multi-line Guided Practice slide with clean title correctly", () => {
    const input = "Slide 4: Guided Practice\nPractice: Blend and read long a words; Sort long a words\nWords: cake, game, lake"
    const result = formatSlidePreviewItem(input)
    expect(result).toBe(
      "Slide 4: Guided Practice — Practice: Blend and read long a words; Sort long a words — Words: cake, game, lake"
    )
  })

  it("leaves clean slide titles without practice content unchanged", () => {
    const input = "Slide 1: Objective"
    expect(formatSlidePreviewItem(input)).toBe("Slide 1: Objective")
  })
})
