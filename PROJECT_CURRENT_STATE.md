# PROJECT_CURRENT_STATE.md

## Current milestone
**Step 3 - trust behavior and UX wording alignment**

## Current repo truth
- Repo: `jodiwankenobi8-arch/lesson-generator8`
- Branch: `work/canonical-project-consolidation`
- Latest validated local checkpoint: `35bc248` - `copy: align results gating with usable-material trust language`

## What changed most recently
### Step 3A landed
- Results naming was aligned to teacher-facing product language:
  - `Teacher Package Summary`
  - `Teacher-Led Support`
  - `Student Centers`
  - `Center Rotation Plan`
  - `Source Authority and Lesson Grounding`
  - `Teacher Decisions for Missing Lesson Parts`
- Results ordering now keeps teacher package content earlier and pushes deeper proof later
- Results tests were updated to lock the intended naming and ordering contracts

### Step 3B landed
- Results gating now uses **usable materials** instead of merely **ready materials**
- Results blocker copy now says the user needs at least one curriculum or exemplar material usable for grounded generation
- Results empty-state copy now says inputs are complete and at least one material is usable, but no generated lesson is currently loaded
- Results processing copy now says `Ready status:` instead of implying readiness alone is enough
- Results tests now lock the usable-material trust language

## What is done
- Step 1 complete: local truth locked
- Step 2A complete: pipeline boundary backward compatibility restored
- Step 2B complete: request-aware contract reconciled and tests green
- Documentation checkpoint complete
- Step 3A complete
- Step 3B complete

## What is not done
- Step 3C secondary evidence grouping in Results is still open
- Results still contains more proof surfaces than a teacher-first primary view should expose by default
- Inputs / Materials copy was audited during Step 3B, but no broader rewrite was landed there yet
- Step 4 export / classroom-usability alignment has not started

## Verified current truths
- Product flow: `Inputs -> Materials -> Results`
- Engine flow: `extraction -> analysis -> blueprint -> planning -> spec -> package -> results`
- `useLessonStore` is still the orchestration seam
- curriculum = content authority
- exemplar = presentation / structure authority
- centers are student-independent work
- small group / intervention is teacher-led support
- centers and teacher-led support are not the same lane

## Current risks
### Verified
- Results is still information-dense even after Step 3A
- Secondary evidence still competes with teacher-ready outputs more than it should
- Step 3C can easily drift into generic debug-panel layout if not kept teacher-first
- Build chunk-size warnings still exist
- SSR-style router warnings still appear in tests

### Inferred
- If Step 3C is done as visual churn instead of hierarchy cleanup, the product can drift toward generic dashboard feel
- If future chats ignore the current doc authority rules, stale handoffs can still slow continuation

## Validation status
- `npm run typecheck` = PASS
- `npm run test` = PASS
- `21` test files passed
- `104` tests passed
- `npm run build` = PASS

## Top next steps
1. Finish **Step 3C** in `ResultsPage` by collapsing secondary evidence into clearly secondary sections
2. Re-validate that teacher-first package content remains primary and calm after the hierarchy change
3. Only after Step 3 is closed cleanly, move into Step 4 export / classroom-usability alignment

## Guardrails for the next seam
- Do not restart engine discovery
- Do not reopen Step 2 unless Step 3C exposes a real contract mismatch
- Keep orchard / warm storybook / teacher-first tone
- Do not flatten the UI into generic SaaS cards or dashboard chrome
- Preserve visible source trust cues while reducing proof-first density