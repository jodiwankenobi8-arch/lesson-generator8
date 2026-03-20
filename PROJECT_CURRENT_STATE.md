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
- Latest pushed HEAD: 669d31c — docs: refresh current truth and step 3 handoff

## Current confirmed state
- Step 1 complete: local truth locked
- Step 2A complete: pipeline boundary backward compatibility restored
- Step 2B complete: request-aware contract reconciled and tests green
- Documentation checkpoint complete
- Step 3A complete: Results naming and hierarchy cleanup landed
- Step 3B complete: Results gating/copy aligned to usable-material trust language
- Current active seam: Step 3C secondary evidence grouping in Results

## Validated state
- 
pm run typecheck = PASS
- 
pm run test = PASS
- 
pm run build = PASS
- 21 test files passed
- 104 tests passed

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

## Step 3C scope
Do Step 3C only.

Goal:
- keep Results teacher-first
- move trace / proof / selected-source evidence into clearly secondary surfaces
- preserve trust and provenance visibility without making Results feel like a debug panel
- do not reopen engine churn unless Step 3C exposes a real contract mismatch

Working assumptions for Step 3C:
- PackageSummarySection and PackageOutputsSection stay primary
- CoverageDecisionsSection stays important because it is teacher-actionable
- SignalSection trust cues may stay visible if they remain compact
- TraceabilitySection and PipelineTraceSection are the strongest candidates for clearly secondary / expandable presentation
- detailed source IDs, pipeline trace, and deeper authority evidence are candidates for more secondary presentation
- in CoverageDecisionsSection, statuses and rationales likely stay visible, while deeper inline evidence may become secondary
- regroup trust surfaces; do not remove them

## Known checkpoint fact
A previous Step 3C patch attempt failed before landing changes.
- failure: Failed to replace PipelineTraceSection
- git diff --stat -- src/pages/ResultsPage.tsx src/pages/ResultsPage.test.tsx was empty afterward
- ResultsPage tests still passed after that failed attempt
- treat the repo as unchanged by that failed patch attempt

## Active execution rule
Start with a tight read-only audit of the Step 3C Results surface.
Do not redo broad repo discovery.
Clearly separate verified findings from inferred risks.
Keep each implementation step coherent and scoped.
No patch-stacking.

## Local doc policy
The active local doc set should stay small and obvious:
- AGENTS.md
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- README.md
- current relevant docs/chat-handoffs/*

Older docs that are no longer referenced and no longer authoritative should be removed from the local working set and preserved through Git history rather than kept as apparently-live guidance.
