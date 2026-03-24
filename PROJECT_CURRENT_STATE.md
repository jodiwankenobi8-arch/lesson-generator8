# PROJECT CURRENT STATE

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 74e4fe9
- Last auto-sync UTC: 2026-03-24T23:52:30Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## Local verification update
- checkpoint: 13669e7
- orchard page-header consistency and Materials pipeline-state text repair are now landed on main
- targeted local validation previously passed for: src/engine/planning-coverage.test.ts, src/pages/ResultsPage.test.tsx, src/engine/package-outputs.test.ts, src/engine/lesson-spec.test.ts
- manual browser recheck of Materials + Results remains pending unless already completed locally

## What is done
- export/package contract expansion is landed
- Results exports now support DOCX / PDF / PPTX / ZIP
- Results export builders are now lazy-loaded at the page/package seam
- teacher package truth is tightened in Results
- missing-area decision prompt text no longer leaks into teacher-facing package sections
- Results now separates Teacher-Led Support from Intervention Support
- Teacher-Led Support count now comes from the teacher-support rotation/support line instead of intervention count
- the narrow results/package truth pass is now published on main
- the follow-up Materials/Results orchard consistency pass is now also published on main:
  - Materials uses OrchardPageHeader
  - Results uses OrchardPageHeader and orchard page shell consistently
  - Materials processing pipeline text now shows explicit state markers instead of broken placeholder characters
- prior local validation history remains:
  - typecheck PASS
  - test PASS (24 files / 118 tests)
  - build PASS

## What is not done yet
- active truth docs and latest handoff still need refresh to the real pushed checkpoint
- manual browser recheck of Materials + Results may still be pending unless already completed locally
- large build-chunk warnings still remain:
  - office
  - pdf
- broader intake/OCR expansion is still not started
- the next seam selection is still pending after doc closeout

## Top next steps
1. refresh START_HERE_CURRENT_TRUTH.md, PROJECT_CURRENT_STATE.md, and LATEST_AUTO_SYNC.md to 13669e7
2. add one new latest handoff naming the now-landed Materials/Results follow-up seam and the real next seam
3. choose the next narrow implementation seam from the orchard continuation surface
4. do not return to Step 6A as the active seam unless current repo truth forces it

## Export decision lock
- Official teacher-facing export truth: per-artifact exports plus optional full-package ZIP.
- Results should present both honestly:
  - individual classroom-ready artifact downloads
  - one optional package ZIP bundling the current generated artifacts
- Do not describe the export model as artifact-only.
- Do not describe the ZIP as replacing the individual artifact exports.
- No new export-code seam is required from this decision alone; code/tests were already aligned when this note was added.
- Next seam after this doc lock should be chosen from live active docs, not by reopening Results/export wording unless live proof shows drift.
- Decision locked at main@b9bc2d7.
