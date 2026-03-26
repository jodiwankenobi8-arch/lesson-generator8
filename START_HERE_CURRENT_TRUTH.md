# START HERE - CURRENT TRUTH

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

- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Current published continuation point: 1e0ac83
- Current milestone: orchard/artifact finish pass is landed locally; export truth remains locked; manual/browser validation is still pending
- Current active seam: doc/commit closeout for the orchard finish pass, then broader source-intake matrix

## What is actually landed
- orchard shell direction is already present in the live repo
- unified outputContents seam is already complete
- request-aware planning/package flow is already complete
- Results export model is locked:
  - lesson plan -> DOCX
  - printables -> PDF
  - slides -> PPTX
  - full package -> ZIP
- Results must present both honestly:
  - individual classroom-ready artifact downloads
  - one optional package ZIP bundling the current generated artifacts
- package/results parity hardening is landed:
  - teacher-led-support-only packages no longer invent `No centers defined.`
  - teacher-led support remains separate from centers / student-independent work
- focused parity coverage is landed for:
  - export presence/absence rules
  - Results wording parity with actual artifacts
  - group-lane separation across package and Results
- supported source matrix is documented in `docs/project-notes/SUPPORTED_SOURCE_MATRIX_CURRENT.md`
- orchard/artifact finish pass is now landed locally:
  - Results has a Teacher Binder Snapshot above teacher-facing outputs
  - visible package sections are summarized explicitly
  - bundled export labels are summarized explicitly
  - export cards now use the dedicated orchard export grid/card/meta/button surfaces more consistently
  - focused tests were added for visible package section labels and bundled artifact labels
- local validation is green at this local checkpoint:
  - typecheck PASS
  - src/pages/ResultsPage.test.tsx PASS (14/14)
  - build PASS

## What is still true
- large build-chunk warnings still remain, especially around office and pdf
- manual/browser validation is still pending
- do not return to Step 6A as the active seam
- do not reopen export-model lock or parity hardening unless live proof shows drift
- broader intake/OCR expansion is still not part of the just-finished orchard pass

## Best next move
- keep the current code/docs aligned by committing this orchard finish pass cleanly
- after that, move to the broader source-intake matrix
- then do deliberate OCR expansion
- keep bounded AI later, only if still wanted

## Export decision lock
- Official teacher-facing export truth: per-artifact exports plus optional full-package ZIP.
- Results should present both honestly:
  - individual classroom-ready artifact downloads
  - one optional package ZIP bundling the current generated artifacts
- Do not describe the export model as artifact-only.
- Do not describe the ZIP as replacing the individual artifact exports.
- No new export-code seam is required from this decision alone.
- Lock remains in force through the current local working tree.
