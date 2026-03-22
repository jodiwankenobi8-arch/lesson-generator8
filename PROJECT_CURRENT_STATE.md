# PROJECT_CURRENT_STATE

Last refreshed: 2026-03-22

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
- Current published continuation point: ee9028f fix: align support wording across package outputs
- Last meaningful code checkpoint: ee9028f fix: align support wording across package outputs

## Current confirmed state
- Inputs deliverable copy seam landed at 10c55c6
- Continuation docs refresh landed at 96a55c2
- Support-wording package/test seam landed at ee9028f
- src/pages/orchardUi.ts exists as the shared orchard UI seam
- Results uses the newer teacher-first support lane structure
- the active product flow remains Inputs -> Materials -> Results

## Validated state
- Live repo HEAD is ee9028f
- Live worktree is clean
- Local branch is ahead of origin/work/canonical-project-consolidation by 3 commits
- orchard foundation is not the next missing seam
- older 10c55c6 continuation docs and the Step 3A launcher are stale relative to live HEAD

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

## Current risks
- remote still does not include the latest 3 local commits
- README.md may still lag the active continuation docs
- older handoffs can mislaunch work if treated as current
- do not reopen closed seams unless live regression evidence appears

## Active execution rule
Do not reopen prior closed seams unless live inspection finds a real regression.
Choose the next seam from current repo state and keep it narrow.
Prefer continuation from the newest handoff file to avoid lag and repeated rediscovery.

## Top next steps
1. Continue from the newest handoff file and live repo files
2. Treat the next seam as: source-intake contract inspect
3. Inspect the current source-intake entrypoints, accepted file types, extraction path, and trust surfaces before changing behavior
4. Keep continuation docs authoritative and small
5. Do not let overridden notes compete with the active continuation set

## Local doc policy
The active local doc set should stay small and obvious:
- AGENTS.md
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- README.md
- current relevant docs/chat-handoffs/*
