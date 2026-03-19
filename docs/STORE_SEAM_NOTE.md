# Store seam note

## Source of truth
- Repo: `jodiwankenobi8-arch/lesson-generator8`
- Branch: `work/canonical-project-consolidation`
- Current verified checkpoint at time of this note: `28b9ca1`

## Public orchestration seam
`src/state/useLessonStore.ts` is the supported orchestration seam.

Pages should:
- read store state
- call store actions
- avoid direct orchestration imports from engine helpers

Pages must not directly import:
- `../engine/generateLesson`
- `../engine/workflow/processMaterial`

## Why this note exists
The repo is already in hardening mode.
The current risk is not basic runtime wiring.
The current risk is reintroducing page-to-engine orchestration bypasses, or letting stale docs drift away from the live store seam during polish and hardening.

## Audit command
Run this before shell cleanup work or seam-audit work:

    .\scripts\Find-LegacyShellReferences.ps1

## Current guardrail
If you touch page flow, material processing, generation, regeneration, or results refresh behavior:
- go through `useLessonStore.ts`
- do not bypass the store from pages
- keep page code teacher-facing and seam-light

## Current cleanup target
Preserve the store seam during orchard convergence / polish and the final hardening pass.
Only widen engine/page contracts when the seam clearly requires it.