# PROJECT_CURRENT_STATE

Last refreshed: 2026-03-21

## Purpose
This file is the current project status board for active work.
It should be read after AGENTS.md and START_HERE_CURRENT_TRUTH.md.

## Authority order
1. AGENTS.md = workflow and rules authority
2. START_HERE_CURRENT_TRUTH.md = entry doc and active seam launcher
3. PROJECT_CURRENT_STATE.md = current working status
4. latest relevant docs/chat-handoffs/* file = seam-level execution detail

Anything older or not in that chain should be treated as historical unless explicitly re-adopted.

## Repo and branch
- Repo: jodiwankenobi8-arch/lesson-generator8
- Active branch: work/canonical-project-consolidation
- Current published continuation point: 49af196 docs: refresh current truth after 519f65c materials wording seam
- Last meaningful code checkpoint: 519f65c copy: align materials intake wording with upload-file contract
## Current confirmed state
- Step 1 complete: local truth locked
- Step 2A complete: pipeline boundary backward compatibility restored
- Step 2B complete: request-aware contract reconciled and tests green
- Documentation checkpoint complete
- Step 3A complete: Results naming and hierarchy cleanup landed
- Step 3B complete: visible trust-language cleanup across Inputs, Materials, and Results substantially aligned
- Step 3C complete: secondary evidence grouping landed in Results
- Step 4A complete: lesson-plan narrative / export contract alignment landed
- Step 4B complete: Results output visibility contract alignment landed
- Step 4C complete: export support wording parity alignment landed
- Step 4D complete: generated-artifact Results/export flow has committed automated guardrail coverage through useLessonStore plus downloadExportArtifact
- Step 5A complete: orchard surface foundation landed
- Step 5B complete: Inputs and Materials translated onto the shared orchard surface system
- Step 5C complete: Results translated onto orchard-native surfaces while keeping teacher package first and evidence secondary
- src/pages/orchardUi.ts now exists as the shared orchard UI seam
- src/styles/theme.css now holds the orchard token / surface layer for the active lesson flow
- src/App.tsx now uses the shared orchard shell
- the active product flow remains Inputs -> Materials -> Results

## Validated state
- current published continuation point is 49af196 docs: refresh current truth after 519f65c materials wording seam
- last meaningful code checkpoint is 519f65c copy: align materials intake wording with upload-file contract
- npm run typecheck passed for 519f65c; current repo head before this doc repair run was 49af196
- doc refresh was run from branch work/canonical-project-consolidation
## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- orchard / warm storybook / teacher-first direction
- do not drift into generic SaaS/dashboard styling
- centers = student-independent work
- small group / intervention = teacher-led support
- centers and teacher-led support may coexist during the same lesson block, but they are not the same lane
- I/E is the umbrella block where centers and teacher-led support can run at the same time without collapsing those lanes
- optional lesson parts and outputs should only appear when explicitly requested or strongly source-grounded
- materials trust depends on usable materials, not merely ready materials

## Flow truths
- Product flow: Inputs -> Materials -> Results
- Engine flow: extraction -> analysis -> blueprint -> planning -> spec -> package -> results
- useLessonStore remains the orchestration seam

## What the latest seam changed
- created src/pages/orchardUi.ts as the shared orchard helper layer
- expanded src/styles/theme.css from starter tokens into the real orchard token / surface system
- moved src/App.tsx onto the shared orchard shell
- translated Inputs into the orchard planning-notebook surface language
- translated Materials into orchard-native source-workbench language, including multi-source wording and removal of blue/purple accent remnants
- translated Results into an orchard planning-binder surface while keeping teacher package first and evidence secondary
- preserved existing flow and compile safety through the orchard lesson-flow pass

## Current risks
- confirm remote push status for 6e144f5 before treating it as the latest pushed checkpoint
- README.md may still lag the active continuation docs and should not be used as the continuation authority
- Vite build still reports large chunk warnings after minification
- SSR-style useLayoutEffect warnings still appear in some route tests, but the suite passes
- dashboard/mockup specs from earlier chats should be treated as donor guidance only; they are not current repo truth and must not override live file inspection
- the next seam is not automatically dashboard work, because no dashboard route/file currently exists under src in this working repo

## Active execution rule
Do not reopen prior closed seams unless live inspection finds a real regression.
Choose the next seam from current repo state and keep it narrow.
Prefer continuation from the newest handoff file to avoid lag and repeated rediscovery.

$11. Continue from the newest handoff file and live repo files
2. Treat the current active seam as: doc automation compatibility aligned to current continuation schema
3. review the refreshed docs and newest handoff, then commit and push the automation repair if the diff looks correct
4. Keep continuation docs authoritative and small
5. Do not let overridden notes compete with the active continuation set
## Local doc policy
The active local doc set should stay small and obvious:
- AGENTS.md
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- README.md
- current relevant docs/chat-handoffs/*

Older docs that are no longer referenced and no longer authoritative should be removed from the local working set and preserved through Git history rather than kept as apparently-live guidance.

