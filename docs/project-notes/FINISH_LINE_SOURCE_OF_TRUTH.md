# Finish Line Source Of Truth

**Project:** Lesson Generator 8  
**Written:** 2026-03-18 18:34 -04:00  
**Active branch:** work/canonical-project-consolidation  
**Current HEAD when written:** 74b7093  

## Current verified repo truth

- This is a teacher-facing lesson generator with the flow **Inputs -> Materials -> Results**.
- The engine still follows: **extraction -> analysis -> blueprint -> planning -> spec -> package -> results**.
- **useLessonStore** remains the orchestration seam.
- **Curriculum = content authority**.
- **Exemplar = presentation / structure authority**.
- The export/package hardening seam has been landed and verified in the current branch.
- The current local working tree is clean except for the untracked `debug/` folder, which should be treated as local scratch unless intentionally promoted later.

## What was just verified

The current seam was verified with:
- `npm run typecheck` -> PASS
- targeted Vitest run -> PASS
- `npm run build` -> PASS

Known non-blocking warnings still present:
- `useLayoutEffect` SSR warnings in the route integration test
- large chunk warnings during production build

These are follow-up items, not the immediate next seam.

## What is strong and should be protected

1. The product shape is coherent and finishable.
2. The store seam is real and should remain the orchestration boundary.
3. Materials is the trust center of the product.
4. Curriculum and exemplar roles are clearly separated in the engine and UI.
5. The app already has real staged pipeline structure rather than a vague one-shot generation flow.
6. The orchard / warm / teacher-first direction is partially present and should be preserved.

## What is still weak or misleading

1. `docs/STORE_SEAM_NOTE.md` is stale and still points to `main` and an older baseline.
2. `README.md` still contains stale continuation/path guidance and a milestone emphasis that does not fully match current repo reality.
3. `PROJECT_CURRENT_STATE.md` still needs reconciliation with the latest live branch state and the newly landed seam.
4. Materials trust language can still overstate support by treating analyzed/ready files as more trustworthy than they may actually be.
5. The Materials pipeline helper still has visible polish debt (`?` pipeline markers) and should be cleaned during the trust/UI seam.
6. `debug/` exists locally and should not be treated as repo truth.

## Finish order from here

### 1. Lock repo truth first
Use this note as the current continuation anchor until the other project docs are reconciled.

### 2. Next implementation seam: Materials trust honesty
Make the app distinguish between:
- analyzed
- ready
- usable with confidence
- caution
- blocked

The Materials Trust Summary and generate gating should reflect reliability decisions, not just completed analysis.

### 3. Then tighten Results trace clarity
A teacher should be able to tell:
- what curriculum grounded
- what exemplar shaped
- what fallback logic supplied
- what is exportable now

### 4. Then reconcile stale docs
Update:
- `PROJECT_CURRENT_STATE.md`
- `README.md`
- `docs/STORE_SEAM_NOTE.md`

Those files should all reflect the same current truth.

### 5. Then do the orchard convergence pass
Not a broad redesign.

Do a controlled convergence pass across:
- Inputs
- Materials
- Results
- export surfaces
- shared notices, cards, buttons, helper text, and badges

Preserve:
- warm
- calm
- readable
- teacher-first
- orchard / storybook direction

Avoid:
- generic SaaS/dashboard drift
- flashy redesign work
- over-decoration

### 6. Final hardening pass
Before calling the app truly finish-ready:
- typecheck
- targeted tests
- full tests
- build
- manual flow pass
- export usefulness check
- docs aligned with shipped reality

## Immediate next step

The single best next implementation move after this docs commit is:

**Materials trust honesty seam**

That seam should:
- make support summaries honest
- make generate gating honest
- align teacher-facing trust language with the actual reliability model
- clean obvious Materials-page trust/polish issues while staying inside that seam

## What not to do next

- Do not open a broad redesign track yet.
- Do not add major new features.
- Do not let multiple conflicting "current state" documents continue to coexist uncorrected.
- Do not promote `debug/` into the repo unless it is intentionally rewritten into durable project notes.

## Current checkpoint

As of this note:
- export/package seam is landed
- repo is in a safe continuation state
- next seam is clear
- finish path is now ordered and practical
## Phase B - From working to wow

This second ladder starts only after the minimum working product is truly closed.

The first ladder gets the product to:
- grounded generation,
- honest provenance,
- trustworthy materials behavior,
- mixed-target clarity,
- classroom-usable exports,
- finish-readiness validation.

This second ladder takes it from "working" to "wow":
a product that feels unmistakably teacher-authored, orchard-warm, emotionally coherent, daily-usable, and recognizably its own thing.

### Phase B sequence

1. Lock the product soul / canonical product rules
   - Keep curriculum as content authority
   - Keep exemplar as presentation / structure authority
   - Keep Inputs -> Materials -> Results as the workflow
   - Keep the product low-friction, teacher-first, warm, calm, and deterministic
   - Keep provenance visible and honest

2. Build a signature output style pass
   - tighten lesson-plan tone
   - tighten slide-copy tone
   - preserve early-elementary teachable phrasing
   - keep exemplar shaping flow without donating content
   - make outputs sound like this product, not generic assembly

3. Replace provenance visibility with provenance confidence
   - make Results feel like a calm editorial review desk
   - answer what grounded content
   - answer what shaped structure
   - answer where fallback stepped in
   - answer what is safe to teach now
   - answer what to improve next time

4. Make Materials feel like a studio-quality trust workspace
   - instant row appearance
   - calm, truthful status progression
   - clear curriculum vs exemplar distinction
   - per-file reliability guidance
   - stronger next-upload guidance

5. Build the orchard interface system
   - one shell
   - one heading system
   - one card language
   - one notice/callout language
   - one ready/caution/blocked visual language
   - one spacing rhythm
   - one button language
   - one provenance panel style

6. Make the app feel chaptered and sequential
   - Inputs as the planning notebook opening
   - Materials as the source workbench
   - Results as the finished planning binder
   - preview/teach mode as the teaching surface
   - page intros and progress UI should feel guided, not dashboard-like

7. Add teacher-confidence UX and daily-use refinements
   - better calm recommendation language
   - clearer "what improved this lesson" summaries
   - better return-to-results and repeat-use flow
   - stronger persistence and recovery
   - fewer dead-end moments

8. Run a vision-level QA pass
   - source truth
   - teacher trust
   - output quality
   - emotional fit
   - daily-use fit
   - ownership

### Working rule

Do not start this second ladder early.
Finish the minimum working truth ladder first.
Only then move into signature output, orchard system work, sequential/chaptered experience, and daily-use refinement.