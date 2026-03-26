# PROJECT CURRENT STATE

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 1e0ac83
- Last auto-sync UTC: 2026-03-26T20:20:48Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## Local verification update
- checkpoint: local working tree after orchard/artifact finish pass
- orchard/artifact finish pass is now landed locally
- targeted validation at this local checkpoint:
  - typecheck PASS
  - src/pages/ResultsPage.test.tsx PASS (14/14)
  - build PASS
- manual/browser validation is still pending by choice

## What is done
- export/package contract expansion is landed
- Results exports support DOCX / PDF / PPTX / ZIP
- Results export builders are lazy-loaded at the page/package seam
- teacher package truth is tightened in Results
- package/results parity hardening is landed:
  - teacher-led-support-only packages no longer invent `No centers defined.`
  - teacher-led support remains separate from centers / student-independent work
- focused export/lane parity tests are landed
- supported source matrix is documented in `docs/project-notes/SUPPORTED_SOURCE_MATRIX_CURRENT.md`
- orchard/artifact finish pass is now landed locally:
  - Teacher Binder Snapshot added above package outputs
  - visible package sections summarized explicitly
  - bundled artifact labels summarized explicitly
  - export cards use the orchard export grid/card/meta/button surfaces more consistently
  - focused Results tests cover the new snapshot/helper truth
- current local validation PASS:
  - typecheck PASS
  - src/pages/ResultsPage.test.tsx PASS (14/14)
  - build PASS

## What is not done yet
- manual/browser validation is still pending
- large build-chunk warnings still remain:
  - office
  - pdf
- broader intake/OCR expansion is still not started
- the next seam after doc/commit closeout is still to be started

## Top next steps
1. commit the orchard/artifact finish pass cleanly
2. start the broader source-intake matrix
3. do deliberate OCR expansion after that
4. keep bounded AI later, only if still wanted

## Export decision lock
- Official teacher-facing export truth: per-artifact exports plus optional full-package ZIP.
- Results should present both honestly:
  - individual classroom-ready artifact downloads
  - one optional package ZIP bundling the current generated artifacts
- Do not describe the export model as artifact-only.
- Do not describe the ZIP as replacing the individual artifact exports.
- No new export-code seam is required from this decision alone.
- Lock remains in force through the current local working tree.
