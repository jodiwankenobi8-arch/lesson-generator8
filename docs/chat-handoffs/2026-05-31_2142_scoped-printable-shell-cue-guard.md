# Scoped printable shell cue guard

## Date
2026-05-31 21:42 local

## Chat purpose
Advance release completeness with the smallest coherent seam tied to artifact-scoped exemplar payoff and no-exemplar/default-shell guardrails, using automated checks plus source inspection only.

## Repo / branch context
- Repo path: C:/Users/jodiw/OneDrive/Desktop/lesson-generator8-local
- Branch: main
- Baseline HEAD: bdbfd4c
- Baseline verify status before edits: green
- Intentionally untracked path remains: tmp-manual-validation/

## What was reviewed
- AGENTS.md
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- docs/chat-handoffs/README.md
- docs/chat-handoffs/2026-05-31_2105_asset-size-blocker-webp-pass.md
- src/engine/shared/resolveTemplateShell.ts
- src/engine/resolveTemplateShell.test.ts
- src/engine/style-settings-blueprint.test.ts
- src/engine/package/buildPackageOutputs.ts
- src/engine/slides/buildSlidePlan.ts
- src/pages/ResultsPage.test.tsx

## Current state
- `resolveTemplateShell` support/printable scoped branch previously required non-empty `segmentOrder` to preserve scoped shells.
- If a scoped exemplar shell provided artifact cues in `slideShell` but left `segmentOrder` empty, resolver could fall back to generic instructional normalization and reduce artifact-scoped exemplar payoff.
- Added a targeted guard so support/printable scopes preserve scoped behavior when either `segmentOrder` or `slideShell` is populated.
- Added regression test for `printables` scope with slide-only cues.
- Full `npm run verify` is green after change.

## Decisions made
- Chosen seam: resolver guard + regression test only.
- Reason: highest leverage with lowest risk for artifact-scoped exemplar behavior; no architecture changes.
- No UI/manual browser checks were used.

## Open questions / unresolved seams
- No unresolved blockers found in this seam.
- Existing test warnings about `useLayoutEffect` in React Router SSR test rendering remain non-blocking and pre-existing.

## Exact next steps
1. Keep this resolver/test seam as-is unless a new failing case shows scoped shells missing both `segmentOrder` and `slideShell`.
2. Continue release hardening from current green verify baseline.

## Commands / files / SHAs mentioned
- Commands run:
  - git rev-parse --show-toplevel
  - git status --short
  - git rev-parse --short HEAD
  - npm run verify
  - npm test -- src/engine/resolveTemplateShell.test.ts
  - npm run verify
- Files changed:
  - src/engine/shared/resolveTemplateShell.ts
  - src/engine/resolveTemplateShell.test.ts
- HEAD during this chat: bdbfd4c

## Risks / cautions
- Scoped-shell preservation now treats slide-only scoped shells as authoritative for support/printable scopes; this is intended, but downstream text generation quality still depends on the quality of extracted exemplar cues.
- No commit was created in this chat.

## Product charter / authority model changes when a chat materially changes continuation truth
- None. Charter and authority model unchanged.

## Next action
Run `npm run verify:release` to continue release gating from this green baseline.
