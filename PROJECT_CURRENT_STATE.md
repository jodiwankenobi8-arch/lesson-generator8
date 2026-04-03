# PROJECT_CURRENT_STATE.md

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: use `git log -1 --oneline` on `main`
- Last auto-sync UTC: automation-managed
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## Current state
- Active branch: main
- Current repo is in finish / closeout mode, not rediscovery mode.
- The core runtime is green locally: typecheck, full tests, and build pass.
- The project already includes the intended finish-path upgrades:
  - scoped multi-exemplar routing
  - exemplar restyle notes
  - objective/opening separation
  - multi-area lesson portions
  - Results grounding and routing visibility
  - refresh-safe lightweight persistence
- The canonical runtime path is upload intake -> extraction -> analysis -> blueprint -> planning/spec -> package -> Results/exports -> persistence.
- Curriculum is the content authority.
- Exemplar is the presentation / structure authority.
- Internal target buckets may still support heuristics, but they are not the product definition or completion metric.

## Current risks
- Active truth docs can drift if they are not refreshed after meaningful closeout changes.
- Manual browser/export verification still needs to be recorded separately from automated checks.
- Non-blocking Vite warning noise remains distracting.

## Current next steps
1. Keep docs aligned to the real current runtime.
2. Use automated verification plus targeted manual browser/export checks before claiming new regressions.
3. Do not reopen broad architecture changes without fresh evidence.
4. Prefer narrow product refinements over new systems.