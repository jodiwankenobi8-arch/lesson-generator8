# Lesson Generator 8 — handoff after basic-finished closeout and Step 5 launch prep

## Repo
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Latest pushed HEAD at this handoff: b2cc872
- Worktree was clean before this handoff

## What just landed
### Commit a013457
- Tighten printables request-aware package gating
- buildPackageOutputs no longer treats printables as a proxy unlock for centers, small_group, or intervention
- Added printables-only regression coverage in:
  - src/engine/package-outputs.test.ts
  - src/engine/request-aware-pipeline.test.ts

### Commit b2cc872
- Align remaining trust and support terminology tests
- Updated stale teacher-support wording expectations
- Updated stale usable-materials error expectation

## Verified current truth from the live local repo/session
- Canonical app flow remains: Inputs -> Materials -> Results
- src/pages/ResultsPage.tsx remains the canonical Results surface
- src/pages/orchardUi.ts already exists in the live repo
- src/styles/theme.css already contains orchard token coverage
- Inputs and Materials orchard shell refits are already landed
- Full gates passed on live local HEAD:
  - npm run typecheck
  - npm run test
  - npm run build
- The project has reached the practical Step 4 basic-finished line
- Do not reopen closed request-aware / Results / export seams without real regression evidence

## What is current vs stale
### Current
- Live repo truth is branch main at pushed HEAD b2cc872
- Step 4 basic-finished closeout is complete
- The next work is Step 5 continuation from the orchard surface state already present in the repo

### Stale / superseded
- Any note that still treats f8444b4 as the current continuation point
- Any note that still treats 2026-03-22_1413_results-test-closeout-handoff.md as the newest handoff
- Any note that still assumes src/pages/orchardUi.ts is missing and must be created from scratch

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- orchard / warm storybook / teacher-first direction
- do not drift into generic SaaS / dashboard styling
- optional lesson parts and outputs should only appear when explicitly requested or strongly source-grounded
- materials trust depends on usable materials, not merely ready materials
- centers = student-independent work
- small group / intervention = teacher-led support
- centers and teacher-led support may coexist during the same lesson block, but they are not the same lane

## Best next narrow seam
Inspect-first pass on the live orchard continuation files, then choose one narrow Step 5 seam only.

Reason:
- the shared orchard seam already exists
- Inputs and Materials orchard shell work is already landed
- the docs were behind the live repo
- the next value is choosing the real continuation seam from actual files, not recreating already-landed foundation

## Files to inspect first in the next chat
1. AGENTS.md
2. START_HERE_CURRENT_TRUTH.md
3. PROJECT_CURRENT_STATE.md
4. this handoff file
5. src/pages/orchardUi.ts
6. src/styles/theme.css
7. src/App.tsx
8. src/pages/ResultsPage.tsx

## Recommended next move for the next chat
Do an inspect-first pass on the current orchard continuation surface and choose one narrow seam only:
- either shared-shell consolidation in App.tsx / orchardUi.ts
- or Results binder translation on top of the existing orchard system

Do not recreate orchardUi.ts.
Do not reopen closed request-aware / Results / export seams without live regression evidence.
Use live local repo state over older notes if they conflict.