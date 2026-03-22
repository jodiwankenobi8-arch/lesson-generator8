# Lesson Generator 8 — ready-vs-usable wording cleanup

## Repo
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: work/canonical-project-consolidation
- HEAD before commit: 17735fe docs: restore official design source of truth

## What landed in this checkpoint
- src/pages/MaterialsPage.tsx
  - changed summary label from Analyzed to Ready
- src/pages/ResultsPage.tsx
  - changed processing details from Ready status: to Ready files:
- src/pages/ResultsPage.test.tsx
  - updated wording expectation to match the new Results copy

## Why this mattered
- pipeline readiness and usable-for-generation trust were already distinct in logic
- the UI wording now reflects that distinction more cleanly
- this keeps eady as pipeline state language and usable as grounded-generation trust language

## Validation snapshot
- 
px vitest run src/pages/ResultsPage.test.tsx src/App.integration.test.tsx = PASS
- 
pm run typecheck = PASS

## Known non-blocking warning
- SSR-style useLayoutEffect warnings still appear in route tests, but the targeted suite passes

## Current likely next move
- inspect the next smallest live UX/copy seam from current repo state
- avoid guessing; keep it narrow

## Read first in the next chat
1. AGENTS.md
2. START_HERE_CURRENT_TRUTH.md
3. PROJECT_CURRENT_STATE.md
4. this file