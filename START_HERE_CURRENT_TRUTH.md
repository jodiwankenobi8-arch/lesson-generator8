# START_HERE_CURRENT_TRUTH.md

## Current repo truth
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: work/canonical-project-consolidation
- Latest pushed checkpoint: generated-artifact Results/export flow seam pushed at 1fab6c2
- Current milestone: Step 4 - package/export contract follow-through
- Current active seam: docs/status alignment after pushed checkpoint 1fab6c2; any remaining export gap should be treated as an optional true browser/UI-only follow-up

## What is actually landed
- Step 1 complete: local truth locked
- Step 2A complete: pipeline boundary backward compatibility restored
- Step 2B complete: request-aware contract reconciled and tests green
- Documentation checkpoint complete
- Step 3A complete: Results naming and hierarchy cleanup landed
- Step 3B complete: visible trust-language cleanup across Inputs, Materials, and Results is substantially aligned
- Step 3C complete: traceability and pipeline evidence moved into clearly secondary Results surfaces
- Request-aware planning/package normalization committed
- MaterialsPage trust-language normalization committed
- Export fallback narrative normalization committed
- Printables no longer imply optional practice sections by empty placeholder fallback text alone
- Step 4A complete: lesson-plan narrative now obeys the same requested-output contract as package arrays / exports
- Optional centers, small-group, and intervention sections no longer appear in lesson-plan narrative unless requested or source-grounded
- Step 4B complete: teacher-facing Results now hides empty optional output sections unless the current package actually contains them
- Step 4C complete: export support wording parity aligned across lesson-plan support blocks, printables export headings, DOCX heading recognition, and decision/package tests
- Documentation checkpoint refreshed after the validated export support parity seam
- Step 4D complete and pushed: generated-artifact Results/export flow test now covers the lesson-plan DOCX export path through useLessonStore and downloadExportArtifact without changing product code

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- orchard / warm storybook / teacher-first direction
- do not drift into generic SaaS / dashboard styling
- centers = student-independent work
- small group / intervention = teacher-led support
- centers and teacher-led support may coexist during the same lesson block, but they are not the same lane
- I/E is the umbrella block where centers and teacher-led support can run at the same time without collapsing those lanes
- optional lesson parts and outputs should only appear when explicitly requested or strongly source-grounded
- materials trust depends on usable materials, not merely ready materials

## Latest validation snapshot
- npm test passed
- npm run build passed
- npm run typecheck passed
- local DOCX Student Centers heading parity seam verified with targeted export test coverage and typecheck
- generated-artifact Step 4 Results/export seam verified with targeted ResultsPage vitest and typecheck, then pushed at 1fab6c2
- repo-wide stale-wording sweep is now green for the current support-heading contract
- use the newest handoff file as the continuation launch point in the next chat

## Non-blocking warnings
- Vite build still reports large chunk warnings after minification
- docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt has been restored as the official design authority
- SSR-style useLayoutEffect warnings still appear in some route tests, but the suite passes
- Vite still reports esbuild/oxc deprecation warnings during test runs

## What to read next
1. PROJECT_CURRENT_STATE.md
2. newest file in docs/chat-handoffs/
3. then inspect README/status alignment and treat any remaining export follow-up as optional browser/UI-only work

## Exact next move
- start the next chat from the newest handoff file below
- confirm pushed HEAD at 1fab6c2 and keep the worktree free of unrelated staging
- keep README and continuation docs aligned with the pushed generated-artifact Results/export seam
- only inspect one final Step 4 seam if the live flow exposes one
- do not reopen closed seams without proof

## Retrieval fallback rule
If connector retrieval is incomplete or stale, ask for one local inspect-first paste for the listed files and treat that as higher-trust than older indexed copies.
- Latest validated checkpoint: generated-artifact Results/export flow seam pushed at 1fab6c2; browser/UI export remains optional follow-up only if a live gap matters

