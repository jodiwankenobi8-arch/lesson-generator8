# Lesson Generator 8 - export support parity checkpoint

## Repo
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: work/canonical-project-consolidation
- HEAD at doc refresh time: 6299d3c checkpoint: save results visibility seam
- Checkpoint scope: validated export support parity seam plus doc-chain refresh

## What landed in this seam
- lesson-plan support sections now use current teacher-facing headings instead of legacy Small Group Ideas / Intervention Ideas wording
- printables export now uses Intervention Support and clearer empty-state wording
- DOCX export heading recognition now includes current teacher-facing support headings
- package-output and package-decision tests now assert the current support-heading contract
- Results labels were not reopened; the seam stayed scoped to export/support parity

## Validation for this seam
- npm test passed
- npm run build passed
- npm run typecheck passed

## Progress snapshot (estimated, grounded in current docs and latest local validation)
- Step 1 - local truth locked: 100%
- Step 2 - request-aware contract: 100%
- Step 3 - trust/UX alignment: 100%
- Step 4 - package/export contract follow-through: about 90%
  - 4A lesson-plan narrative/export contract: 100%
  - 4B Results output visibility contract: 100%
  - 4C export support parity seam: 100%
  - 4D manual full-flow Inputs -> Materials -> Results -> export check: 0%
  - 4E docs/handoff checkpoint: 100%
- Step 5 - hardening/maintenance pass: about 25%
- Step 6 - signature output pass: 0%
- Step 7 - orchard/storybook final polish: 0%
- Overall to the basic finished / honestly usable line: about 90%

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- centers = student-independent work
- small group / intervention = teacher-led support
- centers and teacher-led support may coexist during the same lesson block, but they are not the same lane
- I/E is the umbrella block where centers and teacher-led support can run at the same time without collapsing those lanes
- optional lesson parts and outputs should not quietly appear by default
- ready = pipeline/readiness state
- usable = grounded-generation trust state

## Known non-blocking warnings
- Vite still reports esbuild/oxc deprecation warnings during test runs
- Vite build still reports large chunk warnings after minification
- SSR-style useLayoutEffect warnings still appear in some route tests, but the suite passes

## Best next move
- confirm pushed HEAD and clean worktree
- run one manual full-flow Inputs -> Materials -> Results -> export check
- only inspect one final Step 4 seam if the live flow exposes one
- do not restart discovery from scratch

## Files changed in this checkpoint
- src/engine/package/buildPackageOutputs.ts
- src/engine/exports/exportLessonPlanDocx.ts
- src/engine/package-outputs.test.ts
- src/engine/package-decisions.test.ts
- src/engine/exports/exportLessonPlanDocx.test.ts
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- 2026-03-20_1707_export-support-parity-checkpoint.md

## Read first in the next chat
1. AGENTS.md
2. START_HERE_CURRENT_TRUTH.md
3. PROJECT_CURRENT_STATE.md
4. 2026-03-20_1707_export-support-parity-checkpoint.md