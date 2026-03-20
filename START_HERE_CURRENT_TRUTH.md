# START_HERE_CURRENT_TRUTH.md

## Current repo truth
- Repo: `jodiwankenobi8-arch/lesson-generator8`
- Branch: `work/canonical-project-consolidation`
- Latest validated local checkpoint: `Step 3C local validation complete`
- Current milestone: **Step 3 - trust behavior and UX wording alignment**
- Current active seam: **Step 3C complete - secondary evidence grouping in Results**

## What is actually landed
- Step 1 complete: local truth locked
- Step 2A complete: pipeline boundary backward compatibility restored
- Step 2B complete: request-aware contract reconciled and tests green
- Documentation checkpoint complete
- Step 3A complete: Results naming and hierarchy cleanup landed
- Step 3B complete: Results gating/copy aligned to usable-material trust language
- Step 3C complete: traceability and pipeline evidence moved into clearly secondary Results surfaces, with coverage evidence tucked behind expandable details

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- orchard / warm storybook / teacher-first direction
- do not drift into generic SaaS / dashboard styling
- centers = student-independent work
- small group / intervention = teacher-led support
- centers and teacher-led support may coexist during the same lesson block, but they are not the same lane
- optional lesson parts and outputs should only appear when explicitly requested or strongly source-grounded
- Materials trust depends on usable materials, not merely ready materials

## Latest validation snapshot
- `npm run test -- src/pages/ResultsPage.test.tsx` = PASS
- `npm run typecheck` = PASS
- `npm run build` = PASS

## Non-blocking warnings
- Vite build still reports large chunk warnings after minification
- Neither warning blocked Step 3C validation

## What to read next
1. `PROJECT_CURRENT_STATE.md`
2. newest file in `docs/chat-handoffs/`
3. then inspect the next active seam files only

## Exact next move
Checkpoint Step 3C cleanly:
- review the final diff in `src/pages/ResultsPage.tsx` and `src/pages/ResultsPage.test.tsx`
- commit the Step 3C Results hierarchy change
- then decide the next narrow seam from the updated repo state rather than guessing ahead

## Retrieval fallback rule
If connector retrieval is incomplete or stale, ask for one local inspect-first paste for the listed files and treat that as higher-trust than older indexed copies.
