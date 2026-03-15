# Project Current State

**Project:** Lesson Generator 8  
**Last updated:** 2026-03-16 (America/Chicago)  
**Status:** In progress

## Current summary
- Active product flow is Inputs -> Materials -> Results.
- **useLessonStore is the orchestration seam.** Pages may read state and call store actions; pages must not import engine orchestration helpers directly.
- Store-driven processing, generation, regeneration, and selected-source explainability are already in place.
- Canonical working branch: **work/canonical-project-consolidation** (base commit at time of this update: b0580bb).

## Current priorities
- Protect the store seam from page-to-engine orchestration bypasses.
- Keep repo state and GitHub branch aligned by updating this file alongside changes.
- Continue export/package hardening via small, verifiable seams.
- Leave chunk-size tuning and dependency audit for dedicated follow-up seams.

## Active rules
- Keep useLessonStore as the orchestration seam.
- Do not prioritize visual redesign ahead of trust, clarity, and release hardening.
- Keep curriculum as content authority and exemplar as presentation authority.

## Known issues / risks
- Export lifecycle maturity still trails the rest of the architecture.
- Build emits large chunk warnings that should be addressed later with targeted chunking rules.
- Tests show non-blocking useLayoutEffect SSR-style warnings in integration output.
- npm install reported moderate dependency vulnerabilities that should be addressed in a later maintenance pass.

## Validation snapshot (local)
- Environment: Windows PowerShell at C:\Users\jodiw\OneDrive\Desktop\lesson-generator8-local
- Import-graph audit: **PASS** (no legacy shell references; no forbidden page-to-engine orchestration imports)
- npm run typecheck: **PASS**
- npm run test: **PASS** (19 test files, 89 tests)
- npm run build: **PASS**
- Note: local Windows validation is the source of truth if any external tool reports different environment assumptions.

## Dead shell confirmation (current local source of truth)
- No legacy router/shell code is on the live import path.
- If src/app exists as files, it is not referenced by the live graph and can be deprecated or removed only after inventory confirms its presence.
- This repo now relies on App.tsx route lazy-loading and useLessonStore orchestration.

## Next recommended step
- Continue with export/package follow-through (exports completeness + packaging polish), then isolate chunking improvements.

---

## Update log

### Update - 2026-03-16
- Landed import-graph audit tooling and store-seam note (cherry-picked).
- Resolved PROJECT_CURRENT_STATE.md conflict markers and recorded canonical guidance + validation snapshot.
