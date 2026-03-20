# PROJECT_CURRENT_STATE

Last refreshed: 2026-03-20

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
- Latest pushed HEAD: 669d31c - docs: refresh current truth and step 3 handoff

## Current confirmed state
- Step 1 complete: local truth locked
- Step 2A complete: pipeline boundary backward compatibility restored
- Step 2B complete: request-aware contract reconciled and tests green
- Documentation checkpoint complete
- Step 3A complete: Results naming and hierarchy cleanup landed
- Step 3B complete: Results gating/copy aligned to usable-material trust language
- Step 3C complete: secondary evidence grouping landed in Results

## Validated state
- 
pm run test -- src/pages/ResultsPage.test.tsx = PASS
- 
pm run typecheck = PASS
- 
pm run build = PASS

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- orchard / warm storybook / teacher-first direction
- do not drift into generic SaaS/dashboard styling
- centers = student-independent work
- small group / intervention = teacher-led support
- centers and teacher-led support may coexist during the same lesson block, but they are not the same lane
- optional lesson parts and outputs should only appear when explicitly requested or strongly source-grounded
- materials trust depends on usable materials, not merely ready materials

## Flow truths
- Product flow: Inputs -> Materials -> Results
- Engine flow: extraction -> analysis -> blueprint -> planning -> spec -> package -> results
- useLessonStore is the orchestration seam

## Step 3C outcome
Completed Results hierarchy changes:
- PackageSummarySection and PackageOutputsSection remain primary
- CoverageDecisionsSection remains primary and teacher-actionable
- deeper coverage evidence now sits behind expandable details
- TraceabilitySection is now a secondary details surface
- PipelineTraceSection is now a secondary details surface
- trust/provenance stayed visible without making Results feel like a debug panel

## Non-blocking warnings
- docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt was missing during the Step 3C audit
- Vite build still reports large chunk warnings after minification

## Active execution rule
Step 3C is closed pending commit.
Do not reopen this seam unless review finds a real regression.
Choose the next seam from the current repo state after this checkpoint commit.

## Local doc policy
The active local doc set should stay small and obvious:
- AGENTS.md
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- README.md
- current relevant docs/chat-handoffs/*

Older docs that are no longer referenced and no longer authoritative should be removed from the local working set and preserved through Git history rather than kept as apparently-live guidance.
