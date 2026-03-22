# START_HERE_CURRENT_TRUTH.md

## Current repo truth
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Current published continuation point: b2cc872
- Current milestone: Step 4 basic-finished closeout is complete
- Current active seam: refresh doc chain, then inspect the live orchard continuation seam from actual repo files only

## What is actually landed
- src/pages/orchardUi.ts exists in the live repo
- src/styles/theme.css contains orchard token coverage
- src/pages/ResultsPage.tsx remains the canonical Results surface
- InputsPage.tsx orchard shell refit is landed
- MaterialsPage.tsx orchard shell refit is landed
- request-aware printables package gating is tightened
- remaining trust/support terminology tests were aligned
- active product flow remains Inputs -> Materials -> Results

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- orchard / warm storybook / teacher-first direction
- do not drift into generic SaaS / dashboard styling
- centers = student-independent work
- small group / intervention = teacher-led support
- optional lesson parts and outputs should only appear when explicitly requested or strongly source-grounded
- materials trust depends on usable materials, not merely ready materials

## Latest validation snapshot
- Live local HEAD is b2cc872 on branch main
- git status was clean before this doc refresh
- npm run typecheck passed
- npm run test passed
- npm run build passed
- Continue from live repo files and newest handoff, not older notes

## What to read next
1. AGENTS.md
2. PROJECT_CURRENT_STATE.md
3. docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt
4. newest file in docs/chat-handoffs/
5. then inspect the actual repo files involved in the next seam

## Exact next move
- inspect the live current main repo files for the next narrow Step 5 seam
- start from existing orchardUi.ts and theme.css, not from a missing-shared-seam assumption
- inspect first: src/pages/orchardUi.ts, src/styles/theme.css, src/App.tsx, src/pages/ResultsPage.tsx
- only then choose one narrow continuation seam
- do not reopen closed request-aware / Results / export seams unless live regression evidence appears
- do not recreate src/pages/orchardUi.ts