# Traceability authority language hardening

## Date
2026-05-31 22:16 local

## Chat purpose
Perform a targeted automated/code-inspection release-hardening pass to ensure teacher-facing authority language stays consistent: curriculum as content authority, exemplar as structure/style authority, and no exemplar-only content-authority drift.

## Repo / branch context
- Repo path: C:/Users/jodiw/OneDrive/Desktop/lesson-generator8-local
- Branch: main
- Baseline HEAD after pull/rebase: 1fc6fb1
- Intentionally untracked path remains: tmp-manual-validation/

## What was reviewed
- AGENTS.md
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- docs/chat-handoffs/README.md
- docs/chat-handoffs/LATEST_AUTO_SYNC.md
- docs/chat-handoffs/2026-05-31_2210_exemplar-only-curriculum-authority-gate.md
- docs/chat-handoffs/2026-05-31_2201_curriculum-only-release-proof-coverage.md
- src/pages/MaterialsPage.tsx
- src/pages/ResultsPage.tsx
- src/pages/resultsPageTraceabilityHelpers.ts
- src/pages/resultsPageTraceabilityHelpers.test.ts
- src/state/workflows/evaluateGenerationReadiness.ts
- src/state/workflows/evaluateGenerationReadiness.test.ts
- e2e/release-proof.spec.ts

## Current state
- Source inspection found no immediate wording contradiction in live authority messages, but explicit regression coverage for traceability authority phrasing was limited.
- Added focused tests to lock authority-model language:
  - Curriculum-selected paths remain explicitly content-authority language.
  - No-curriculum paths keep content authority tied to teacher inputs/fallback grounding and do not mention exemplar as content authority.
- Strengthened exemplar-only release proof assertions to ensure blocked states do not show misleading exemplar-as-content phrasing or export-ready status.
- Full `npm run verify:release` is green after this hardening pass.

## Decisions made
- Chosen seam: targeted test-only hardening for traceability/release language consistency.
- Reason: highest-leverage low-risk pass aligned with mission, with no architecture or UI rewrites.
- No gating logic was weakened or changed.

## Open questions / unresolved seams
- Non-blocking warnings remain in release verification output:
  - Vite esbuild/oxc deprecation warnings
  - React `useLayoutEffect` SSR warnings in ResultsPage tests
- No additional high-confidence language seam was obvious via automated/headless/source inspection without manual judgment.

## Exact next steps
1. Keep these authority-language assertions in release and helper tests as regression guards.
2. If additional hardening is needed, add one narrow automated check for export-readiness copy consistency in blocked vs generated Results states.

## Commands / files / SHAs mentioned
- Commands run:
  - git pull --rebase origin main
  - git rev-parse --show-toplevel
  - git status --short
  - git rev-parse --short HEAD
  - npm run verify:release
  - npm test -- src/pages/resultsPageTraceabilityHelpers.test.ts
  - npx playwright test -c playwright.release.config.ts --grep "exemplar-only generation without curriculum grounding"
  - npm run verify:release
- Files changed:
  - src/pages/resultsPageTraceabilityHelpers.test.ts
  - e2e/release-proof.spec.ts
- Baseline HEAD before edit: 1fc6fb1

## Risks / cautions
- This pass hardens language regression coverage but does not prove subjective UX interpretation across all contexts.
- Automation confirms exemplar-only blocked behavior and no-export state, but cannot replace manual editorial review of all copy variants.

## Product charter / authority model changes when a chat materially changes continuation truth
- None. This pass reinforces existing authority model rules.

## Next action
Commit and push this test-hardening pass, then continue from green `npm run verify:release` baseline.
