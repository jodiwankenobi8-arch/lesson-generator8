# Project Current State

**Project:** Lesson Generator 8  
**Last updated:** 2026-03-18 (America/Chicago)  
**Status:** In progress

## Current summary
- Active product flow is Inputs -> Materials -> Results.
- **useLessonStore is the orchestration seam.** Pages may read state and call store actions; pages must not import engine orchestration helpers directly.
- Store-driven processing, generation, regeneration, and selected-source explainability are already in place.
- Canonical working branch: **work/canonical-project-consolidation**
- Current verified branch head at time of this update: **28b9ca1**

## Recently landed seams
- **16145b2** Ã¢â‚¬â€ materials trust gating honesty
- **0b1dcd9** Ã¢â‚¬â€ results authority trace clarity
- **28b9ca1** Ã¢â‚¬â€ prefer allow over caution in material selection

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

## Shell / cleanup note
- Legacy shell cleanup is not the current priority.
- Re-run `.\scripts\Find-LegacyShellReferences.ps1` before any future shell deletion or shell cleanup work.


## Next recommended step
- Continue with orchard convergence / polish.
- Then do the final hardening pass.
- Keep chunk-size tuning and dependency audit isolated into later follow-up seams.

---

## Update log

### Update - 2026-03-16
- Landed import-graph audit tooling and store-seam note (cherry-picked).
- Resolved PROJECT_CURRENT_STATE.md conflict markers and recorded canonical guidance + validation snapshot.

## Branch archaeology / deletion gate

Do not treat older repo notes as gospel.

For branch archaeology and donor-branch deletion:
- judge seams by behavior lineage, not path lineage
- use current code and recent merged lineage as the benchmark
- mine donor branches before deleting them
- port only the still-valuable missing remainder into canonical
- delete branches only after their meaningful seams are accounted for as already present, hand-ported, or truly superseded

Working order:
mine first -> prune second -> harden third -> move forward fourth

## Imported chat handoff summaries (2026-03-17 16:39)


Recommended cleanup:
- rename or remove any empty-slug handoff filenames
- continue using sanitized slugs for future handoffs
