# PROJECT CURRENT STATE

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: b9bc2d7
- Last auto-sync UTC: 2026-03-24T14:44:02Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## What is done
- export/package contract expansion is landed
- Results exports now support DOCX / PDF / PPTX / ZIP
- Results export builders are now lazy-loaded at the page/package seam
- teacher package truth is tightened in Results
- missing-area decision prompt text no longer leaks into teacher-facing package sections
- Results now separates Teacher-Led Support from Intervention Support
- Teacher-Led Support count now comes from the teacher-support rotation/support line instead of intervention count
- this narrow results/package truth pass is now published on main
- local validation PASS:
  - typecheck PASS
  - test PASS (24 files / 118 tests)
  - build PASS

## What is not done yet
- browser/manual confirmation of the final Results surface after the truth fix is not yet recorded in docs
- large build-chunk warnings still remain:
  - office
  - pdf
- broader intake/OCR expansion is still not started
- the next seam selection is still pending after this checkpoint closeout

## Top next steps
1. do one quick browser/manual smoke check on the final Results surface
2. use the refreshed truth docs and latest handoff as the continuation launcher
3. decide the next seam intentionally after that check
4. do not return to Step 6A as the active seam unless current repo truth forces it

- Manual/browser Results recheck recorded on main@1ac197d:
  - no High-priority decision lines in teacher package sections = YES
  - Teacher-Led Support and Intervention Support render separately = YES
  - export buttons still work = YES
  - closeout status = PASS

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
