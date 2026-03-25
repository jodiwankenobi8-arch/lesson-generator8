# Lesson Generator 8 — finish-pass package/results parity landed

## Repo
- Repo: `jodiwankenobi8-arch/lesson-generator8`
- Branch: `main`
- Current pushed HEAD: `f35ca7e`

## What just landed
- export-model lock is now explicit everywhere:
  - lesson plan -> DOCX
  - printables -> PDF
  - slides -> PPTX
  - optional full package -> ZIP
- package/results parity hardening is landed:
  - teacher-led-support-only packages no longer invent `No centers defined.`
  - teacher-led support remains separate from centers / student-independent work
- focused parity coverage is landed for:
  - export presence/absence rules
  - Results wording parity with actual artifacts
  - group-lane separation across package and Results
- supported source matrix is now documented in `docs/project-notes/SUPPORTED_SOURCE_MATRIX_CURRENT.md`

## Validation truth
- `npm run typecheck` PASS
- `npm run test` PASS (`24` files / `129` tests)
- `npm run build` PASS
- build still warns on large office/pdf chunks
- manual/browser validation was intentionally deferred

## Active truth
- export-model lock is landed
- parity hardening is landed
- broader intake/OCR expansion is not part of the current finish pass
- next active seam is orchard/artifact finish work, not export repair

## Best next move
1. start the orchard/artifact finish pass
2. make Results the strongest planning-binder / artifact payoff page
3. tighten reusable orchard surfaces and reduce inline-style sprawl
4. keep bundle cleanup narrow after the orchard pass