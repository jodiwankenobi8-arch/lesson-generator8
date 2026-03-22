# START_HERE_CURRENT_TRUTH.md

## Current repo truth
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: work/canonical-project-consolidation
- Current published continuation point: 5806ff0 docs: refresh continuation after assessment wording seam
- Last meaningful code checkpoint: 158b1de copy: align assessment output wording with package behavior
- Current milestone: Step 5 orchard lesson-flow surface system complete for the active teacher flow
- Current active seam: Core deliverable toggle copy seam identified: slides and lesson plan should be treated as always-included core outputs, not optional deliverable toggles in Inputs.
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
- current published continuation point is 5806ff0 docs: refresh continuation after assessment wording seam
- last meaningful code checkpoint is 158b1de copy: align assessment output wording with package behavior
- Live repo HEAD is 5806ff0 with a clean worktree; last meaningful code checkpoint remains 158b1de; small_group is intentionally folded into Teacher-Led Support; assessment wording seam landed and docs are aligned.
- doc refresh was run from branch work/canonical-project-consolidation
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
- current active seam: Core deliverable toggle copy seam identified: slides and lesson plan should be treated as always-included core outputs, not optional deliverable toggles in Inputs.
- continue from the newest handoff file and live repo files, not older overridden notes
- Inspect and land the smallest copy-only Inputs seam that removes slides and lesson plan from optional deliverable toggles while preserving current engine behavior.
## Retrieval fallback rule
If connector retrieval is incomplete or stale, ask for one local inspect-first paste for the exact missing file(s) and treat that as higher-trust than older indexed copies.

