# PROJECT CURRENT STATE

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: a0a8a16
- Last auto-sync UTC: 2026-03-25T19:52:32Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## Local verification update
- checkpoint: f35ca7e
- export-model lock and package/results parity hardening are landed on main
- targeted validation at this checkpoint:
  - typecheck PASS
  - test PASS (24 files / 129 tests)
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
- current local validation PASS:
  - typecheck PASS
  - test PASS (24 files / 129 tests)
  - build PASS

## What is not done yet
- manual/browser validation is still pending
- orchard/artifact finish pass is not started yet
- large build-chunk warnings still remain:
  - office
  - pdf
- broader intake/OCR expansion is still not started
- the next seam selection after orchard finish is still pending

## Top next steps
1. start the orchard/artifact finish pass
2. make Results the strongest planning-binder / artifact payoff page
3. tighten reusable orchard surfaces and reduce inline-style sprawl
4. keep bundle cleanup narrow and finish-phase appropriate after the orchard pass

## Export decision lock
- Official teacher-facing export truth: per-artifact exports plus optional full-package ZIP.
- Results should present both honestly:
  - individual classroom-ready artifact downloads
  - one optional package ZIP bundling the current generated artifacts
- Do not describe the export model as artifact-only.
- Do not describe the ZIP as replacing the individual artifact exports.
- No new export-code seam is required from this decision alone.
- Lock carried forward through `main@f35ca7e`.
