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
