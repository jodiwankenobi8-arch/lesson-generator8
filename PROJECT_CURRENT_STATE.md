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
- Latest local code seam checkpoint: a151036 refactor: normalize request-aware planning and package outputs

## Current confirmed state
- Step 1 complete: local truth locked
- Step 2A complete: pipeline boundary backward compatibility restored
- Step 2B complete: request-aware contract reconciled and tests green
- Documentation checkpoint complete
- Step 3A complete: Results naming and hierarchy cleanup landed
- Step 3B complete: Results gating/copy aligned to usable-material trust language
- Step 3C complete: secondary evidence grouping landed in Results
- Request-aware planning/package normalization committed locally

## Validated state
- npm run typecheck = PASS
- npm run test -- src/engine/package-outputs.test.ts src/engine/package-decisions.test.ts src/engine/request-aware-pipeline.test.ts = PASS
- npm run build = PASS
- npm run test = PASS

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
- planning now applies request-aware inclusion for optional components
- package outputs now align with the same request-aware / source-grounded contract
- printables no longer act as a broad unlock for centers, small group, or intervention
- pipeline and package threading carry lessonRequest through the seam
- request-aware tests were updated and the full suite now passes

## Current risks
- route and button gating may still carry ready-versus-usable drift
- user-facing trust language may still lag behind engine truth in some Inputs / Materials / Results surfaces
- export/classroom-usability hardening is still ahead
- Vite build still reports large chunk warnings after minification
- docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt was missing during earlier Step 3 audit

## Active execution rule
Do not reopen Step 3C unless review finds a real regression.
Do not reopen the request-aware planning/package seam unless full inspection finds a real mismatch.
Choose the next seam from current repo state and keep it scoped to user-facing trust alignment.

## Top next steps
1. Inspect ready-versus-usable gating across Inputs, Materials, Results, and generate actions
2. Align user-facing trust language to usable materials
3. Verify lesson-plan/export wording still matches the normalized optional-output contract
4. Do one end-to-end manual flow check after the trust-alignment seam
5. Keep docs small, current, and non-competing

## Local doc policy
The active local doc set should stay small and obvious:
- AGENTS.md
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- README.md
- current relevant docs/chat-handoffs/*

Older docs that are no longer referenced and no longer authoritative should be removed from the local working set and preserved through Git history rather than kept as apparently-live guidance.
