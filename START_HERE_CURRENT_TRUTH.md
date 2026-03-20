# START_HERE_CURRENT_TRUTH.md

## Current repo truth
- Repo: `jodiwankenobi8-arch/lesson-generator8`
- Branch: `work/canonical-project-consolidation`
- Latest validated local checkpoint: `35bc248` - `copy: align results gating with usable-material trust language`
- Current milestone: **Step 3 - trust behavior and UX wording alignment**
- Current active seam: **Step 3C - secondary evidence grouping in Results**

## What is actually landed
- Step 1 complete: local truth locked
- Step 2A complete: pipeline boundary backward compatibility restored
- Step 2B complete: request-aware contract reconciled and tests green
- Documentation checkpoint complete
- Step 3A complete: Results naming and hierarchy cleanup landed
- Step 3B complete: Results gating/copy aligned to usable-material trust language

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
- `npm run typecheck` = PASS
- `npm run test` = PASS
- `21` test files passed
- `104` tests passed
- `npm run build` = PASS

## Non-blocking warnings
- SSR-style `useLayoutEffect` warnings still appear in tests around router rendering
- Vite build still reports large chunk warnings after minification
- Neither warning blocked Step 3A or Step 3B closeout validation

## What to read next
1. `PROJECT_CURRENT_STATE.md`
2. newest file in `docs/chat-handoffs/`
3. then inspect the active Step 3 seam files only

## Exact next move
Do **Step 3C** next:
- keep Results teacher-first
- move trace / proof / selected-source evidence into clearly secondary sections
- preserve source trust visibility without making Results feel like a debug panel
- do not start new engine churn unless Step 3C exposes a real contract mismatch

## Retrieval fallback rule
If connector retrieval is incomplete or stale, ask for one local inspect-first paste for the listed files and treat that as higher-trust than older indexed copies.