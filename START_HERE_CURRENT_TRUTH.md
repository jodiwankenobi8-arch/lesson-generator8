# START_HERE_CURRENT_TRUTH.md

## Current repo truth
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: work/canonical-project-consolidation
- Latest validated checkpoint: Results output visibility seam validated after conditional Results rendering cleanup
- Current milestone: Step 4 - package/export contract follow-through
- Current active seam: next = manual full-flow Inputs -> Materials -> Results -> export check, then inspect only one final Step 4 seam if the live flow exposes one

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
- Documentation checkpoint refreshed after the validated Results visibility seam

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- orchard / warm storybook / teacher-first direction
- do not drift into generic SaaS / dashboard styling
- centers = student-independent work
- small group / intervention = teacher-led support
- centers and teacher-led support may coexist during the same lesson block, but they are not the same lane
- optional lesson parts and outputs should only appear when explicitly requested or strongly source-grounded
- materials trust depends on usable materials, not merely ready materials

## Latest validation snapshot
- Results output visibility seam verified with targeted ResultsPage tests, targeted package-output tests, targeted request-aware pipeline tests, and typecheck
- Step 4A package narrative contract seam verified with targeted package test, typecheck, and build
- ready-vs-usable wording cleanup verified with targeted Results/App tests and typecheck
- intervention support label cleanup verified with targeted Results/App tests and typecheck
- repo-wide stale-wording sweep found only current intended strings for Results support and ready-file wording
- use the newest handoff file as the continuation launch point in the next chat

## Non-blocking warnings
- Vite build still reports large chunk warnings after minification
- docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt has been restored as the official design authority
- SSR-style useLayoutEffect warnings still appear in some route tests, but the suite passes

## What to read next
1. PROJECT_CURRENT_STATE.md
2. newest file in docs/chat-handoffs/
3. then run the smallest manual full-flow Step 4 check only

## Exact next move
- start the next chat from the newest handoff file below
- confirm pushed HEAD and clean worktree
- run one manual full-flow Inputs -> Materials -> Results -> export check
- only inspect one final Step 4 seam if the live flow exposes one
- do not reopen closed seams without proof

## Retrieval fallback rule
If connector retrieval is incomplete or stale, ask for one local inspect-first paste for the listed files and treat that as higher-trust than older indexed copies.