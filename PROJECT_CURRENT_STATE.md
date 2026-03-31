# PROJECT_CURRENT_STATE.md

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 65d7d5d
- Last auto-sync UTC: 2026-03-31T13:48:09Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

- Active branch: main
- Use `git log -1 --oneline` on `main` for the exact latest local continuation commit
- Last completed seam: export-status contract cleanup plus doc-truth refresh

## Current milestone
Smoke-gating coverage is already on main, and the export-status contract cleanup plus truth-doc refresh are now closed out locally and ready to push.

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
- warning noise remains non-blocking and unchanged
- active truth docs were refreshed to match the completed seam and stop stale checkpoint drift

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- generation depends on usable materials
- active product flow remains Inputs -> Materials -> Results
- useLessonStore remains the orchestration seam
- do not reopen engine repair or broader refactors without fresh regression evidence

## Current risks
- active truth docs can drift if small validated seams are not closed out immediately
- `types.ts` still contains broader contract duplication beyond this narrow export seam
- warning noise remains distracting but non-blocking
- remote connectivity may delay publication even when the seam is locally complete

## Top next steps
1. Push this local commit when network access to GitHub is available
2. Reconfirm the pushed state on `main`
3. Choose the next narrow seam from live repo truth
4. Keep the active continuation set small and obvious

## Local doc policy
- Keep continuation docs authoritative and small
- Preserve automation-compatible anchors and auto-sync blocks
- Prefer durable truth over transitional pre-push snapshots
- Do not reopen broader engine or Results refactors without fresh regression evidence
