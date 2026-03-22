# PROJECT_CURRENT_STATE

Last refreshed: 2026-03-22

## Purpose
This file is the current project status board for active work.

## Repo and branch
- Repo: jodiwankenobi8-arch/lesson-generator8
- Active branch: main
- Current published continuation point: b2cc872

## Current milestone
- Step 4 basic-finished closeout is complete
- The project is in Step 5 continuation from the live orchard surface state already present in the repo

## Current confirmed state
- src/pages/orchardUi.ts exists as the shared orchard UI seam
- src/styles/theme.css contains orchard token coverage
- src/pages/ResultsPage.tsx is the canonical Results surface
- InputsPage orchard shell seam is landed
- MaterialsPage orchard shell seam is landed
- request-aware printables package gating no longer treats printables as a proxy unlock for optional support/package outputs
- request-aware and trust/support terminology tests are aligned to the current teacher-facing language
- the active product flow remains Inputs -> Materials -> Results
- a first Step 5 Results chrome consolidation pass is now landed locally in src/pages/ResultsPage.tsx:
  - extracted helper styles for repeated Results chrome
  - preserved teacher-first package-first hierarchy
  - preserved secondary evidence grouping

## Validated state
- Targeted Results helper/usage inspect passed after the local seam
- npm run typecheck passed after the local seam
- npm run build passed after the local seam
- The full test suite was last known green at pushed checkpoint b2cc872, but was not rerun after this local seam

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- orchard / warm storybook / teacher-first direction
- do not drift into generic SaaS/dashboard styling
- centers = student-independent work
- small group / intervention = teacher-led support
- optional lesson parts and outputs should only appear when explicitly requested or strongly source-grounded
- materials trust depends on usable materials, not merely ready materials

## Current risks
- older handoffs may still imply that the next move is still orchard continuation inspect-first rather than a landed local Results seam
- ResultsPage still contains substantial inline styling beyond this first chrome pass
- do not widen scope into behavior, export, or trust-contract edits without proof
- unrelated untracked docs exist locally and are intentionally untouched

## Top next steps
1. Inspect the current local diff for src/pages/ResultsPage.tsx
2. Decide whether one more narrow Results chrome cleanup pass is worth doing
3. If not, commit/push ResultsPage.tsx plus the active doc chain only
4. Keep continuation docs authoritative and small
5. Move to the next narrow Step 5 seam only after the current seam is either pushed or intentionally parked

## What is not the next move
- do not recreate src/pages/orchardUi.ts
- do not restart broad repo discovery
- do not reopen closed Results/export/request-aware seams without proof
- do not touch unrelated untracked docs unless there is a separate reason
