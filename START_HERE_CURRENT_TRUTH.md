# START HERE - CURRENT TRUTH

- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Current published continuation point: d0fb041
- Current milestone: export/package contract expansion is landed; narrow lane-separation hardening and Results export wording refinement are now published on main
- Current active seam: quick browser/manual Results smoke check, then choose the next seam intentionally

## What is actually landed
- orchard shell direction is already present in the live repo
- unified outputContents seam is already complete
- request-aware planning/package flow is already complete
- Results now supports format-aware exports:
  - lesson plan -> DOCX
  - printables -> PDF
  - slides -> PPTX
  - full package -> ZIP
- package outputs are now hardened so T1 centers remain student-independent in package outputs
- Results export wording is now calmer and more precise about actual ZIP/export behavior
- local validation is green at this checkpoint:
  - typecheck PASS
  - test PASS (24 files / 118 tests)
  - build PASS

## What is still true
- large build-chunk warnings still remain, especially around ResultsPage / office / pdf
- browser/manual confirmation of the Results export surface is still not yet recorded after this narrow pass
- do not return to Step 6A as the active seam
- choose the next seam intentionally after the Results smoke check

## Best next move
- do a quick browser/manual smoke check on Results export buttons and ZIP/export wording
- use this refreshed truth + handoff as the continuation launcher
- then choose the next seam intentionally instead of returning to Step 6A
