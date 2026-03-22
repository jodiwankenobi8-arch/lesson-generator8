# PROJECT_CURRENT_STATE

Last refreshed: 2026-03-22

## Purpose
This file is the current project status board for active work.

## Repo and branch
- Repo: jodiwankenobi8-arch/lesson-generator8
- Active branch: main
- Current published continuation point: f8444b4

## Current confirmed state
- src/pages/orchardUi.ts exists as the shared orchard UI seam
- src/styles/theme.css contains orchard token coverage
- src/pages/ResultsPage.tsx is the canonical Results surface
- InputsPage orchard shell seam is landed
- MaterialsPage orchard shell seam is landed
- the active product flow remains Inputs -> Materials -> Results

## Validated state
- npm run typecheck passed during this closeout

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
- older handoffs may describe pre-closeout local uncertainty
- do not reopen closed seams unless live regression evidence appears

## Top next steps
1. Inspect live repo files
2. Pick the next narrow finishing seam
3. Keep continuation docs authoritative and small
4. Save only one new handoff per meaningful seam
