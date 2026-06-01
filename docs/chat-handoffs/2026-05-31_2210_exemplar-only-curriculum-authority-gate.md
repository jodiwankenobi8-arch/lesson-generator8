# Exemplar-only curriculum-authority gate

## Date
2026-05-31 22:10 local

## Chat purpose
Add a high-signal automated release proof for the exemplar-only / no-curriculum case so exemplar structure support does not bypass curriculum grounding requirements for content-bearing outputs.

## Repo / branch context
- Repo path: C:/Users/jodiw/OneDrive/Desktop/lesson-generator8-local
- Branch: main
- Baseline HEAD after pull/rebase at start: ca00ac7
- Intentionally untracked path remains: tmp-manual-validation/

## What was reviewed
- AGENTS.md
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- docs/chat-handoffs/README.md
- docs/chat-handoffs/LATEST_AUTO_SYNC.md
- docs/chat-handoffs/2026-05-31_2201_curriculum-only-release-proof-coverage.md
- docs/chat-handoffs/2026-05-31_2142_scoped-printable-shell-cue-guard.md
- src/state/workflows/evaluateGenerationReadiness.ts
- src/state/workflows/evaluateGenerationReadiness.test.ts
- src/state/useLessonStore.ts
- src/App.gating.integration.test.tsx
- e2e/release-proof.spec.ts

## Current state
- `evaluateGenerationReadiness` previously allowed generation when no curriculum materials existed, including exemplar-only state.
- Added a targeted guard: if exemplar materials exist and curriculum materials do not, generation is blocked with a source-authority message requiring curriculum grounding.
- Added unit coverage proving exemplar-only state is blocked.
- Added release Playwright proof for exemplar-only state confirming:
  - Generate Lesson action is disabled on Materials.
  - Readiness/source-authority message explains exemplar cannot provide curriculum grounding.
  - Results route stays in blocked no-generated-lesson state.
  - Export action buttons are unavailable in blocked state.
- Full `npm run verify:release` remains green after these changes.

## Decisions made
- Chosen seam: source-authority gating + release-proof/test coverage for exemplar-only/no-curriculum.
- Reason: highest-leverage remaining gap aligned to product non-negotiables without architecture changes.
- Kept changes small and localized to readiness + tests.

## Open questions / unresolved seams
- Non-blocking warnings remain in verify output:
  - Vite esbuild/oxc deprecation warnings
  - React `useLayoutEffect` SSR warnings in ResultsPage tests
- No additional high-confidence automated seam was obvious in this pass without manual visual judgement.

## Exact next steps
1. Keep exemplar-only gating behavior and release proof as a permanent regression guard.
2. If further hardening is needed, add one similarly targeted automated seam around exemplar-only messaging in Results traceability text consistency.

## Commands / files / SHAs mentioned
- Commands run:
  - git pull --rebase origin main
  - git rev-parse --show-toplevel
  - git status --short
  - git rev-parse --short HEAD
  - npm run verify:release
  - npm test -- src/state/workflows/evaluateGenerationReadiness.test.ts
  - npx playwright test -c playwright.release.config.ts --grep "exemplar-only generation without curriculum grounding"
  - npm run verify:release
- Files changed:
  - src/state/workflows/evaluateGenerationReadiness.ts
  - src/state/workflows/evaluateGenerationReadiness.test.ts
  - e2e/release-proof.spec.ts
- Baseline HEAD before edit: ca00ac7

## Risks / cautions
- This seam intentionally blocks exemplar-only generation for content-bearing outputs; if future product direction changes for non-content artifacts in exemplar-only mode, readiness rules may need scoped exceptions.
- Automation cannot fully prove subjective instructional quality of generated content.

## Product charter / authority model changes when a chat materially changes continuation truth
- None. This pass enforces existing authority model rules rather than changing them.

## Next action
Commit and push this readiness/proof pass, and rerun `npm run verify:release` if a rebase is required before push.
