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
- Latest local code seam checkpoint: 4ae3806 docs: clarify powershell pacing and summary reply rules

## Current confirmed state
- Step 1 complete: local truth locked
- Step 2A complete: pipeline boundary backward compatibility restored
- Step 2B complete: request-aware contract reconciled and tests green
- Documentation checkpoint complete
- Step 3A complete: Results naming and hierarchy cleanup landed
- Step 3B complete: visible trust-language cleanup across Inputs, Materials, and Results is substantially aligned
- Step 3C complete: secondary evidence grouping landed in Results
- Request-aware planning/package normalization committed
- MaterialsPage trust-language normalization committed
- Export fallback narrative normalization committed
- Step 4A complete: lesson-plan narrative / export contract alignment landed

## Validated state
- Step 4A package narrative contract seam verified with targeted package test, typecheck, and build
- ready-vs-usable wording cleanup verified with targeted Results/App tests and typecheck
- use the newest handoff file as the continuation launch point in the next chat

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

## What the latest seam changed
- printables/export text no longer relies on empty optional placeholder copy like 'No centers defined.'
- lesson-plan narrative now uses the same requested-output contract as package arrays / exports
- unrequested centers, small-group, and intervention sections no longer quietly appear in lesson-plan narrative

## Current risks
- the next seam should be chosen from live repo state rather than guessed
- Vite build still reports large chunk warnings after minification
- docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt has been restored and should now be used as the design authority reference
- SSR-style useLayoutEffect warnings still appear in some route tests, but the suite passes
- there may be a final small user-facing wording seam left, but it should be chosen from live repo state instead of guessed

## Active execution rule
Do not reopen prior closed seams unless live inspection finds a real regression.
Choose the next seam from current repo state and keep it narrow.
Prefer continuation from the newest handoff file to avoid lag and repeated rediscovery.

## Top next steps
1. Start next chat from the newest handoff file
2. Reconfirm current branch head and full worktree status
3. Inspect the next smallest live UX/copy seam only
4. Reconcile the missing design-source reference in docs
5. Preserve checkpoint discipline

## Local doc policy
The active local doc set should stay small and obvious:
- AGENTS.md
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- README.md
- current relevant docs/chat-handoffs/*

Older docs that are no longer referenced and no longer authoritative should be removed from the local working set and preserved through Git history rather than kept as apparently-live guidance.
