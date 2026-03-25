# START HERE - CURRENT TRUTH

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 5ecd2c5
- Last auto-sync UTC: 2026-03-25T01:31:40Z
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

- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Current published continuation point: 5ecd2c5
- Current milestone: export truth is locked, parity hardening is landed, and the supported source matrix is documented
- Current active seam: orchard/artifact finish pass on Results and reusable orchard surfaces

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
- local validation is green at this checkpoint:
  - typecheck PASS
  - test PASS (24 files / 129 tests)
  - build PASS

## What is still true
- large build-chunk warnings still remain, especially around office and pdf
- manual/browser validation is still pending
- do not return to Step 6A as the active seam
- do not reopen export-model lock or parity hardening unless live proof shows drift
- broader intake/OCR expansion is still not part of the current finish pass

## Best next move
- start the orchard/artifact finish pass
- make Results the strongest planning-binder / artifact payoff page
- tighten reusable orchard surfaces and reduce inline-style sprawl
- keep bundle cleanup narrow and finish-phase appropriate after the orchard pass

## Export decision lock
- Official teacher-facing export truth: per-artifact exports plus optional full-package ZIP.
- Results should present both honestly:
  - individual classroom-ready artifact downloads
  - one optional package ZIP bundling the current generated artifacts
- Do not describe the export model as artifact-only.
- Do not describe the ZIP as replacing the individual artifact exports.
- No new export-code seam is required from this decision alone.
- Lock carried forward through `main@f35ca7e`.
