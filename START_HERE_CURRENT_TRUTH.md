# START HERE - CURRENT TRUTH

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 2b9e6d8
- Last auto-sync UTC: 2026-03-24T15:52:36Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Current published continuation point: 2b9e6d8
- Current milestone: results package truth hardening and lazy export loading are landed on main
- Current active seam: Results/doc closeout is already complete; next step is to choose the next narrow implementation seam intentionally from the orchard continuation surface

## What is actually landed
- orchard shell direction is already present in the live repo
- unified outputContents seam is already complete
- request-aware planning/package flow is already complete
- Results export builders are now lazy-loaded instead of eager-loaded at the page/package seam
- teacher package truth is tighter in Results
- missing-area decision prompt text no longer leaks into teacher-facing package sections
- Results now separates:
  - Teacher-Led Support
  - Intervention Support
- Teacher-Led Support count now comes from the teacher-support rotation/support line instead of intervention count
- Results now supports format-aware exports:
  - lesson plan -> DOCX
  - printables -> PDF
  - slides -> PPTX
  - full package -> ZIP
- local validation is green at this checkpoint:
  - typecheck PASS
  - test PASS (24 files / 118 tests)
  - build PASS

## What is still true
- large build-chunk warnings still remain, especially around office and pdf
- do not return to Step 6A as the active seam
- the export seam is no longer the main issue; the upstream package/results truth seam was the real leak and that narrow repair is now landed
- Results recheck/doc closeout is already complete and should not remain the active seam

## Best next move
- treat the Results recheck/doc closeout as complete
- use the refreshed truth docs as the continuation launcher
- choose the next narrow implementation seam intentionally from the orchard continuation surface
- do not reopen Results/export wording unless live proof shows drift

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
