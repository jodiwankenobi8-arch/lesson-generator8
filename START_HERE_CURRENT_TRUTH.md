# START_HERE_CURRENT_TRUTH.md

## Current repo truth
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Current published continuation point: b2cc872
- Current milestone: Step 5 continuation from the live orchard surface already present in the repo
- Current active seam: Step 5 Results chrome consolidation is landed locally and verified

## What is actually landed
- src/pages/orchardUi.ts exists in the live repo
- src/styles/theme.css contains orchard token coverage
- src/pages/ResultsPage.tsx remains the canonical Results surface
- InputsPage.tsx orchard shell refit is landed
- MaterialsPage.tsx orchard shell refit is landed
- ResultsPage.tsx now has a first Results chrome consolidation pass:
  - helper styles extracted for feedback stack, success notice, section stack, meta list, small note, details grid, and blocked-state title/message
  - teacher-first package-first hierarchy is preserved
  - evidence and planning details remain secondary

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
- Targeted Results helper/usage inspect passed in live local ResultsPage.tsx
- npm run typecheck passed after the seam
- npm run build passed after the seam
- The full test suite was last known green at pushed checkpoint b2cc872, but was not rerun after this local seam
- Continue from live repo files and newest handoff, not older notes

## What to read next
1. AGENTS.md
2. PROJECT_CURRENT_STATE.md
3. docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt
4. newest file in docs/chat-handoffs/
5. then inspect src/pages/ResultsPage.tsx and its local diff

## Exact next move
- inspect the current local diff for src/pages/ResultsPage.tsx
- either commit/push this seam cleanly, or do one more narrow Results chrome cleanup pass
- do not reopen closed request-aware / Results / export seams without live regression evidence
- do not recreate src/pages/orchardUi.ts
- do not touch unrelated untracked docs unless explicitly asked
