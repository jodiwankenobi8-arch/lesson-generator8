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
- The project is entering Step 5 continuation from the live orchard surface state already present in the repo

## Current confirmed state
- src/pages/orchardUi.ts exists as the shared orchard UI seam
- src/styles/theme.css contains orchard token coverage
- src/pages/ResultsPage.tsx is the canonical Results surface
- InputsPage orchard shell seam is landed
- MaterialsPage orchard shell seam is landed
- request-aware printables package gating no longer treats printables as a proxy unlock for optional support/package outputs
- request-aware and trust/support terminology tests are aligned to the current teacher-facing language
- the active product flow remains Inputs -> Materials -> Results

## Validated state
- npm run typecheck passed
- npm run test passed
- npm run build passed
- git status was clean after push and before this doc refresh

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
- continuation docs were stale before this refresh and must stay small and authoritative
- older handoffs may still imply that orchardUi.ts is missing or that older checkpoints are current
- do not reopen closed seams unless live regression evidence appears

## Top next steps
1. Inspect the live orchard continuation files:
   - src/pages/orchardUi.ts
   - src/styles/theme.css
   - src/App.tsx
   - src/pages/ResultsPage.tsx
2. Choose one narrow Step 5 continuation seam from those actual files
3. Keep continuation docs authoritative and small
4. Save only one new handoff per meaningful seam

## What is not the next move
- do not recreate src/pages/orchardUi.ts
- do not restart broad repo discovery
- do not reopen closed Results/export/request-aware seams without proof