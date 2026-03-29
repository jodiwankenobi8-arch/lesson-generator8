import { describe, expect, it } from "vitest"
import {
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
      "Status notes stay visible when something needs attention."
    )
  })

  it("keeps the binder lead text focused on exports", () => {
    expect(getTeacherBinderLeadText()).toBe(
      "Review the classroom-ready sections included in this package before you export."
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
