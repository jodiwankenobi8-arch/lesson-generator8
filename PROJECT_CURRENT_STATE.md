# PROJECT_CURRENT_STATE.md

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 41af58b
- Last auto-sync UTC: 2026-04-02T22:16:07Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

- Active branch: main
- Use `git log -1 --oneline` on `main` for the exact latest local continuation commit
- Last completed seam: export-status contract cleanup plus doc-truth refresh
- Live published/main checkpoint confirmed locally: `3269121 Remove export artifact status leftover and refresh truth docs`

## Current milestone
The export-status contract cleanup is already published on main. The active continuation docs now need to stop describing the seam as merely ready to push and instead reflect the published state plus next-seam selection posture.

## Validated state
- the seam changed exactly one live code file:
  - `src/engine/types.ts`
- the export contract cleanup removed:
  - `ExportArtifactStatus`
  - `status?: ExportArtifactStatus` from `ExportArtifact`
- the same edit also removed a UTF-8 BOM at the top of `src/engine/types.ts`
- validation for the seam remained green:
  - full test PASS (31 files / 175 tests)
  - typecheck PASS
  - build PASS
- the seam was successfully fetched, rebased, and pushed
- local `HEAD` matched `origin/main` at `3269121`
- warning noise remains non-blocking and unchanged

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- generation depends on usable materials
- active product flow remains Inputs -> Materials -> Results
- useLessonStore remains the orchestration seam
- do not reopen engine repair or broader refactors without fresh regression evidence

## Current risks
- active truth docs can drift if small validated seams are not closed out immediately after publication
- the auto-sync block currently lags the live published checkpoint
- `types.ts` still contains broader contract duplication beyond this narrow export seam
- warning noise remains distracting but non-blocking

## Top next steps
1. Keep the active continuation docs aligned with the published state on `main`
2. Use live repo truth to choose the next narrow seam
3. Keep the active continuation set small and obvious
4. Do not reopen broader engine or Results refactors without fresh evidence

## Local doc policy
- Keep continuation docs authoritative and small
- Preserve automation-compatible anchors and auto-sync blocks
- Prefer durable truth over transitional pre-push snapshots
- Prefer live repo code/tests and current `main` state when automation lags
- Do not reopen broader engine or Results refactors without fresh regression evidence
