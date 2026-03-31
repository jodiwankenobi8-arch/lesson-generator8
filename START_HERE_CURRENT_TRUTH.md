# START_HERE_CURRENT_TRUTH.md

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 65d7d5d
- Last auto-sync UTC: 2026-03-31T13:48:09Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## Current repo truth
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Last completed seam: export-status contract cleanup plus doc-truth refresh
- Use `git log -1 --oneline` on `main` for the exact latest local continuation commit
- Last meaningful code checkpoint is the export-contract cleanup in `src/engine/types.ts`
- Current active seam: choose the next narrow seam from live repo truth

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- generation depends on usable materials
- active product flow remains Inputs -> Materials -> Results
- useLessonStore remains the orchestration seam
- do not reopen closed seams without live regression evidence

## Latest validation snapshot
- removed dead `ExportArtifactStatus`
- removed optional `status?: ExportArtifactStatus` from `ExportArtifact`
- the same edit also removed a UTF-8 BOM at the top of `src/engine/types.ts`
- validation for the seam remained green:
  - full test PASS (31 files / 175 tests)
  - typecheck PASS
  - build PASS
- active truth docs were refreshed so they no longer compete with stale smoke-gating-only continuation notes

## Non-blocking warnings
- useLayoutEffect SSR warnings in integration output
- Vite/react-babel/esbuild/oxc warning noise
- build chunk-size warnings

## Exact next move
- push this completed seam when remote connectivity is available
- then inspect live repo truth on `main`
- choose the next narrow seam
- do not widen into broader refactors without fresh evidence

## Retrieval fallback rule
- if continuation notes conflict, prefer live repo code/tests, live repo state on `main`, and the newest handoff
- treat auto-sync files as synchronization helpers, not replacements for human seam handoffs
