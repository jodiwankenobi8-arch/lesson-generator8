# Lesson Generator Production Plan

This file is the working roadmap for taking Lesson Generator from its current state to a functional, reliable, visually polished production-ready app.

## Product goal

Build a teacher-first lesson generation tool that is:

- dependable in output
- transparent about how uploads and standards influence generation
- visually premium, not generic
- efficient to maintain and lightweight enough to run well locally

## North star

The app should feel like an editorial teaching studio with orchard-inspired warmth rather than a basic software dashboard.

## Phase 1: harden the active app path

### 1. Freeze one production branch
- Work from a single hardening branch.
- Tag the current state before major refactors.
- Stop splitting effort across multiple unfinished directions.

### 2. Keep one live runtime architecture
Keep the current live runtime centered on:
- `src/main.tsx`
- `src/App.tsx`
- `src/app/AppRouter.tsx`
- `src/pages/*`
- `src/state/*`
- `src/engine/*`

Archive overlapping or alternate app shells and route sets into a legacy or experimental area instead of keeping both active.

### 3. Fix startup and repo hygiene
- Ensure global styles load from app startup.
- Replace placeholder package metadata.
- Expand `.gitignore`.
- Remove review clutter from the live repo.
- Require typecheck and build verification before shipping.

## Phase 2: stabilize data and generation trust

### 4. Use one canonical lesson package model
- Define a single package model used by pages, previews, and exports.
- Add schema validation.
- Version saved data for clean migrations later.

### 5. Unify material extraction
Build one extraction entry point that returns:
- file kind
- source name
- extracted text
- confidence
- warnings
- metadata
- whether the source influenced blueprint or generation

Implementation order:
1. txt / md / docx
2. pdf
3. pptx
4. image OCR

### 6. Make generation traceable
The results experience should clearly show:
- standards source
- curriculum influence
- exemplar influence
- extraction warnings
- unresolved conflicts
- manual overrides

## Phase 3: production UI system

### 7. Build a real design system
Move from page-specific style objects toward:
- shared tokens
- shared layout primitives
- shared cards, fields, buttons, rails, headers, and status components

Visual direction:
- warm paper background
- orchard green anchor
- blush and honey accents
- serif editorial headings
- clean sans body text
- layered paper surfaces
- subtle motion

### 8. Redesign the three core screens
#### Inputs
- guided setup
- grouped sections
- sticky readiness summary
- better defaults

#### Materials
- upload workbench feel
- extraction preview
- confidence and warning chips
- clearer source typing

#### Results
- studio review + publishing desk feel
- traceability panels
- export center
- change summaries

## Phase 4: reliability and release readiness

### 9. Harden exports
Keep one live export surface and make PPTX, DOCX, and ZIP export flows resilient with:
- loading state
- success state
- failure messaging
- retry support
- safe file naming

### 10. Add release protections
- CI on every push
- smoke tests for the main flow
- error boundaries
- autosave and recovery
- environment validation
- release checklist
- changelog discipline

## Phase 5: reduce footprint only after stability

Do this last.

- lazy-load heavy export and extraction libraries
- remove dead dependencies
- remove archived code from the live build path
- keep only one clean release snapshot

## Immediate fixes already started

- global stylesheet import restored at startup
- placeholder package metadata replaced
- root project README refreshed
- repo ignore rules expanded

## Definition of done

The app is ready for production when:
- one runtime path is active
- one package model drives the app
- one extraction pipeline is active
- results explain what influenced generation
- exports are reliable
- the UI feels cohesive and premium
- build and smoke checks pass on a clean install
- the repo is no longer carrying random local clutter
