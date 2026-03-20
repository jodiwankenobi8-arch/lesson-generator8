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
- Latest local code seam checkpoint: 568dba0 refactor: clarify materials trust and readiness language

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

## Validated state
- npm run typecheck = PASS
- npm run test = PASS
- npm run build = PASS

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
- MaterialsPage now separates pipeline readiness wording from grounded-generation trust wording more clearly
- analyzed-file status language is less likely to over-claim trust just because a file reached ready state
- generate CTA copy now aligns better with usable-material gating already enforced by the store/workflow seam
- Inputs and Results remain aligned with usable-material trust language

## Current risks
- lesson-plan and export wording may still imply optional outputs more broadly than the normalized request-aware contract allows
- final teacher-facing narrative still needs inspection for optional-output leakage
- export/classroom-usability hardening is still ahead
- Vite build still reports large chunk warnings after minification
- docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt was missing during earlier Step 3 audit
- SSR-style useLayoutEffect warnings still appear in some route tests, but the suite passes

## Active execution rule
Do not reopen Step 3C unless review finds a real regression.
Do not reopen the request-aware planning/package seam unless inspection finds a real mismatch.
Do not reopen the MaterialsPage trust seam unless wording review finds a real regression.
Choose the next seam from current repo state and keep it scoped to lesson-plan/export wording alignment.

## Top next steps
1. Inspect lesson-plan/export wording for optional-output leakage
2. Align final narrative/output wording to the normalized request-aware contract
3. Do one end-to-end manual flow check after the wording seam
4. Keep docs small, current, and non-competing
5. Leave visual polish and non-blocking warnings for later unless they block trust

## Local doc policy
The active local doc set should stay small and obvious:
- AGENTS.md
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- README.md
- current relevant docs/chat-handoffs/*

Older docs that are no longer referenced and no longer authoritative should be removed from the local working set and preserved through Git history rather than kept as apparently-live guidance.
