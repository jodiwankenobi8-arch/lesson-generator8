# Project Current State

**Project:** Lesson Generator 8
**Last updated:** 2026-03-15
**Status:** In progress

## Current summary
- Active product flow is Inputs -> Materials -> Results.
- useLessonStore is the orchestration seam.
- Store-driven processing, generation, regeneration, and selected-source explainability are already in place.
- Current source of truth is GitHub main at 38f9f1c.
- Main remaining near-term gap is dead-shell / import-graph cleanup before export maturity work.

## Current priorities
- Confirm and clean dead shell/router artifacts.
- Protect the store seam from page-to-engine bypasses.
- Keep local repo state and GitHub state aligned through PROJECT_CURRENT_STATE.md.

## Active rules
- Keep useLessonStore as the orchestration seam.
- Do not prioritize visual redesign ahead of trust, clarity, and release hardening.
- Keep curriculum as content authority and exemplar as presentation authority.

## Known issues / risks
- Legacy shell files may still exist and mislead future edits.
- Export lifecycle maturity still trails the rest of the architecture.
- Build emits large chunk warnings that should be addressed later.
- Tests show non-blocking useLayoutEffect SSR-style warnings in integration output.
- npm install reported moderate dependency vulnerabilities that should be reviewed in a later maintenance pass.

## Next recommended step
- Review audit output and remove or mark confirmed-dead shell artifacts under the old shell/router path if any still exist as files.

---

## Update log

## Update - 2026-03-15

### What changed
- Added a repeatable import-graph audit script.
- Added a developer note documenting the supported store seam.
- Created the canonical in-repo current-state file.

### Files touched
- scripts/Find-LegacyShellReferences.ps1
- docs/STORE_SEAM_NOTE.md
- PROJECT_CURRENT_STATE.md

### Tests run
- .\scripts\Find-LegacyShellReferences.ps1
- npm run typecheck
- npm run test
- npm run build

### Current status
- Audit passed with no legacy shell references found.
- Audit passed with no forbidden page-to-engine imports found.
- Typecheck, tests, and build all passed.
- Repo is ready for dead-shell confirmation and cleanup work.

### Known issues / risks
- Build still reports large chunk warnings.
- Tests still report non-blocking useLayoutEffect SSR-style warnings.
- Dependency audit warnings remain for a future maintenance pass.

### Next recommended step
- Commit this no-behavior-change audit/setup step, then begin the actual dead-shell cleanup step in a new focused change.
