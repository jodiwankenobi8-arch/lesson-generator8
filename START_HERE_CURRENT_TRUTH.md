# START_HERE_CURRENT_TRUTH.md

## Current repo truth
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: work/canonical-project-consolidation
- Current checkpoint in working repo: orchard lesson-flow surface system committed at 6e144f5
- Current milestone: Step 5 orchard lesson-flow surface system complete for the active teacher flow
- Current active seam: docs alignment after 6e144f5, then choose the next implementation seam from live repo state only

## What is actually landed
- Step 1 complete: local truth locked
- Step 2A complete: pipeline boundary backward compatibility restored
- Step 2B complete: request-aware contract reconciled and tests green
- Documentation checkpoint complete
- Step 3A complete: Results naming and hierarchy cleanup landed
- Step 3B complete: visible trust-language cleanup across Inputs, Materials, and Results substantially aligned
- Step 3C complete: traceability and pipeline evidence moved into clearly secondary Results surfaces
- Step 4A complete: lesson-plan narrative obeys the requested-output contract
- Step 4B complete: empty optional Results outputs stay hidden unless actually present
- Step 4C complete: export support wording parity aligned across lesson-plan, printables, DOCX headings, and tests
- Step 4D complete: generated-artifact Results/export flow guardrail landed through useLessonStore plus downloadExportArtifact
- Step 5A complete: orchard surface foundation landed through shared orchardUi.ts, real theme tokens, and App shell migration
- Step 5B complete: Inputs and Materials moved onto the orchard surface system
- Step 5C complete: Results moved onto orchard-native surfaces while keeping teacher package first and evidence secondary

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
- AI must not replace deterministic extraction, blueprint orchestration, or trust surfaces

## Latest validation snapshot
- orchard lesson-flow seam committed at 6e144f5
- npm run typecheck passed for the orchard lesson-flow seam immediately before commit
- worktree was clean immediately after commit
- last explicitly confirmed broader validation checkpoint remains the earlier 1fab6c2 export seam, where npm test, npm run build, and npm run typecheck were green
- local inspection confirmed there is no src/app/routes/dashboard.tsx in the current repo and no dashboard match under src

## Non-blocking warnings
- Vite build still reports large chunk warnings after minification
- SSR-style useLayoutEffect warnings still appear in some route tests, but the suite passes
- Vite still reports esbuild/oxc deprecation warnings during some runs
- README.md may still lag the active continuation docs and should not override START_HERE_CURRENT_TRUTH.md or PROJECT_CURRENT_STATE.md
- confirm remote state if you need to treat 6e144f5 as the latest pushed checkpoint

## What to read next
1. PROJECT_CURRENT_STATE.md
2. newest file in docs/chat-handoffs/
3. docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt
4. then inspect the actual repo files involved in the next seam

## Exact next move
- start the next chat from the newest handoff file below
- confirm HEAD 6e144f5 and a clean worktree
- do not assume dashboard route work exists in this repo
- treat dashboard/mockup ideas as donor material only
- choose the next single seam from live repo files and current product priorities
- do not reopen closed export or orchard seams without proof

## Retrieval fallback rule
If connector retrieval is incomplete or stale, ask for one local inspect-first paste for the exact missing file(s) and treat that as higher-trust than older indexed copies.
