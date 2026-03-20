# START_HERE_CURRENT_TRUTH.md

## Current repo truth
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: work/canonical-project-consolidation
- Latest validated checkpoint: MaterialsPage trust-language normalization committed
- Current milestone: Step 3 - trust behavior and UX wording alignment
- Current active seam: next = lesson-plan/export wording alignment to match the normalized request-aware contract

## What is actually landed
- Step 1 complete: local truth locked
- Step 2A complete: pipeline boundary backward compatibility restored
- Step 2B complete: request-aware contract reconciled and tests green
- Documentation checkpoint complete
- Step 3A complete: Results naming and hierarchy cleanup landed
- Step 3B complete: visible trust-language cleanup across Inputs, Materials, and Results is substantially aligned
- Step 3C complete: traceability and pipeline evidence moved into clearly secondary Results surfaces, with coverage evidence tucked behind expandable details
- Request-aware planning/package normalization committed
- MaterialsPage trust-language normalization committed
- Optional package outputs no longer unlock from printables alone

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
- npm run typecheck = PASS
- npm run test = PASS
- npm run build = PASS

## Non-blocking warnings
- Vite build still reports large chunk warnings after minification
- docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt was missing during earlier Step 3 audit
- SSR-style useLayoutEffect warnings still appear in some route tests, but the suite passes

## What to read next
1. PROJECT_CURRENT_STATE.md
2. newest file in docs/chat-handoffs/
3. then inspect lesson-plan/export wording files only

## Exact next move
- inspect lesson-plan and export wording for optional-output leakage
- align final narrative/output wording to the normalized request-aware contract
- do not reopen Results or Materials trust seams unless review finds a real regression

## Retrieval fallback rule
If connector retrieval is incomplete or stale, ask for one local inspect-first paste for the listed files and treat that as higher-trust than older indexed copies.
