# Project Current State

**Project:** Lesson Generator 8
**Last updated:** 2026-03-15
**Status:** In progress

## Current summary
- Active product flow is Inputs -> Materials -> Results.
- useLessonStore is the orchestration seam.
- Store-driven processing, generation, regeneration, and selected-source explainability are already in place.
- Current source of truth is GitHub main at 38f9f1c.
- Main remaining near-term gap is export maturity / packaging follow-through, not shell cleanup.

## Current priorities
- Keep the store seam protected from page-to-engine bypasses.
- Keep local repo state and GitHub state aligned through PROJECT_CURRENT_STATE.md.
- Move to the next hardening step now that dead-shell confirmation is complete.

## Active rules
- Keep useLessonStore as the orchestration seam.
- Do not prioritize visual redesign ahead of trust, clarity, and release hardening.
- Keep curriculum as content authority and exemplar as presentation authority.

## Known issues / risks
- Export lifecycle maturity still trails the rest of the architecture.
- Build emits large chunk warnings that should be addressed later.
- Tests show non-blocking useLayoutEffect SSR-style warnings in integration output.
- npm install reported moderate dependency vulnerabilities that should be reviewed in a later maintenance pass.

## Validation snapshot
- Local environment: Windows PowerShell at C:\Users\jodiw\OneDrive\Desktop\lesson-generator8-local.
- Import-graph audit passed: no legacy shell references found.
- Import-graph audit passed: no forbidden page-to-engine imports found.
- npm run typecheck passed.
- npm run test passed: 19 test files, 85 tests passed.
- npm run build passed.
- Note: local Windows validation is the source of truth if Codex reports a different shell or branch environment.

## Dead shell confirmation
- src/app does not exist.
- Search for BlueprintPage, ResultsHubPage, AppRouter, src/app, ./app/AppRouter, and ../app/AppRouter returned no live references.
- Import-graph audit re-run passed cleanly.
- No shell/router deletions are required from the current local source of truth.

## Next recommended step
- Move to the next hardening task: export/package follow-through and cleanup of any remaining delivery/documentation gaps.

---

## Update log

## Update - 2026-03-15

### What changed
- Added a repeatable import-graph audit script.
- Added a developer note documenting the supported store seam.
- Created the canonical in-repo current-state file.
- Confirmed no dead shell/router path remains in the local source of truth.

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
- Dead-shell confirmation is complete and no deletions are required.
- Repo is ready for the next hardening step.

### Known issues / risks
- Build still reports large chunk warnings.
- Tests still report non-blocking useLayoutEffect SSR-style warnings.
- Dependency audit warnings remain for a future maintenance pass.

### Next recommended step
- Start the next focused hardening change on export/package follow-through.
