# Store seam note

## Source of truth
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Confirmed baseline from handoff: 38f9f1c

## Public orchestration seam
src/state/useLessonStore.ts is the supported orchestration seam.

Pages should:
- read store state
- call store actions
- avoid direct orchestration imports from engine helpers

Pages must not directly import:
- ../engine/generateLesson
- ../engine/workflow/processMaterial

## Why this note exists
The repo is already in completion / hardening mode. The current risk is not broken runtime wiring. The current risk is editing dead shell files or reintroducing bypasses around the store seam.

## Audit command
Run this before shell cleanup work:

    .\scripts\Find-LegacyShellReferences.ps1

## Current cleanup target
Confirm whether any legacy router/shell files under src/app/ are still referenced. Only remove files after this audit shows they are not on the live path.
