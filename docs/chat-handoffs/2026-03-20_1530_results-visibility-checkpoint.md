# Lesson Generator 8 - results visibility checkpoint

## Repo
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: work/canonical-project-consolidation
- Checkpoint scope: validated Results output visibility seam plus doc-chain refresh

## What landed in this seam
- Results no longer renders empty optional teacher-facing output sections by default
- Lesson Plan, Slides, Intervention Support, Student Centers, Student Centers Rotation Plan, and Exports now appear only when the current package actually contains content, items, or artifacts
- Results now shows a fallback Package Outputs card when the current package contains no teacher-facing outputs yet
- AGENTS now instructs future follow-up terminal requests to ask for only the smallest necessary output

## Validation for this seam
- npm run typecheck passed
- npm test -- src/pages/ResultsPage.test.tsx passed
- npm test -- src/engine/package-outputs.test.ts src/engine/request-aware-pipeline.test.ts passed

## Progress snapshot (estimated, grounded in current docs and latest local validation)
- Step 1 - local truth locked: 100%
- Step 2 - request-aware contract: 100%
- Step 3 - trust/UX alignment: 100%
- Step 4 - package/export contract follow-through: about 70%
  - 4A lesson-plan narrative/export contract: 100%
  - 4B Results output visibility contract: 100%
  - 4C final Results/export parity seam: about 40%
  - 4D manual full-flow Inputs -> Materials -> Results -> export check: 0%
  - 4E docs/handoff checkpoint: 100%
- Step 5 - hardening/maintenance pass: about 15%
- Step 6 - signature output pass: 0%
- Step 7 - orchard/storybook final polish: 0%
- Overall to the basic finished / honestly usable line: about 85%

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- centers = student-independent work
- small group / intervention = teacher-led support
- optional lesson parts and outputs should not quietly appear by default
- ready = pipeline/readiness state
- usable = grounded-generation trust state

## Known non-blocking warnings
- Vite still reports esbuild/oxc deprecation warnings during test runs
- Vite build still reports large chunk warnings after minification
- SSR-style useLayoutEffect warnings still appear in some route tests, but targeted suites pass

## Best next move
- confirm pushed HEAD and clean worktree
- run one manual full-flow Inputs -> Materials -> Results -> export check
- only inspect one final Step 4 seam if the live flow exposes one
- do not restart discovery from scratch

## Files changed in this checkpoint
- src/pages/ResultsPage.tsx
- AGENTS.md
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- 2026-03-20_1530_results-visibility-checkpoint.md

## Read first in the next chat
1. AGENTS.md
2. START_HERE_CURRENT_TRUTH.md
3. PROJECT_CURRENT_STATE.md
4. 2026-03-20_1530_results-visibility-checkpoint.md