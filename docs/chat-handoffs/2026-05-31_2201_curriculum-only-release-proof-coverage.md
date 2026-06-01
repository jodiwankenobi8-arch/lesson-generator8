# Curriculum-only release proof coverage

## Date
2026-05-31 22:01 local

## Chat purpose
Strengthen automated release-proof coverage for a core charter rule: missing exemplar must not block generation, and curriculum-only runs should show trustworthy default-shell behavior with export parity.

## Repo / branch context
- Repo path: C:/Users/jodiw/OneDrive/Desktop/lesson-generator8-local
- Branch: main
- Baseline HEAD at start of pass: 9d65a27
- Intentionally untracked path remains: tmp-manual-validation/

## What was reviewed
- AGENTS.md
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- docs/chat-handoffs/README.md
- docs/chat-handoffs/2026-05-31_2142_scoped-printable-shell-cue-guard.md
- docs/chat-handoffs/2026-05-31_2105_asset-size-blocker-webp-pass.md
- docs/chat-handoffs/LATEST_AUTO_SYNC.md
- e2e/release-proof.spec.ts
- src/pages/ResultsPage.tsx (results intro text branches for source availability)

## Current state
- Baseline `npm run verify:release` was green at HEAD 9d65a27.
- Release e2e previously covered exemplar+curriculum flow only.
- Added a second release e2e proof for curriculum-only flow to validate:
  - results intro explicitly states default classroom-ready shell because no exemplar source was selected
  - exemplar payoff section is absent
  - export readiness remains at expected parity (4 ready, 0 needs review)
  - ZIP/PPTX/DOCX/PDF export buttons are visible
- Full `npm run verify:release` remains green after the test expansion.

## Decisions made
- Chosen seam: targeted Playwright release-proof coverage only.
- Reason: highest-leverage remaining automated gap tied to no-exemplar default-shell behavior and teacher-facing trust/coherence, without reopening architecture.
- Kept implementation as a single-file e2e expansion with a curriculum-only seeded snapshot helper.

## Open questions / unresolved seams
- Non-blocking warnings remain in verify output:
  - Vite esbuild/oxc deprecation warnings
  - React `useLayoutEffect` SSR warnings in ResultsPage tests
- No new blocking seam identified from automated checks/code inspection in this pass.

## Exact next steps
1. Keep this curriculum-only release-proof test in the release gate to prevent regressions in default-shell messaging and export parity.
2. If a future seam is needed, prioritize grounded parsing/coherence improvements with similarly targeted automated evidence.

## Commands / files / SHAs mentioned
- Commands run:
  - git rev-parse --show-toplevel
  - git status --short
  - git rev-parse --short HEAD
  - npm run verify:release
  - npx playwright test -c playwright.release.config.ts --grep "curriculum-only default-shell flow"
  - npm run verify:release
- Files changed:
  - e2e/release-proof.spec.ts
- Baseline HEAD before edit: 9d65a27

## Risks / cautions
- This pass increases release-proof confidence for curriculum-only default-shell behavior, but cannot prove subjective visual quality.
- Export button presence and status parity are covered; deep content-quality audits still rely on existing unit/integration checks plus future targeted scenarios.

## Product charter / authority model changes when a chat materially changes continuation truth
- None. Charter and authority model unchanged.

## Next action
Commit and push this release-proof coverage expansion, then rerun `npm run verify:release` on pushed HEAD if any rebase is required.
