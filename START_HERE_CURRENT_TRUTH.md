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
- Current published continuation point: 65d7d5d
- Last meaningful code checkpoint: 10aadc7 Add automated smoke coverage for route and input gating
- Current active seam: docs closeout after smoke-test route and input gating push

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- generation depends on usable materials
- active product flow remains Inputs -> Materials -> Results
- useLessonStore remains the orchestration seam
- do not reopen closed seams without live regression evidence

## Latest validation snapshot
- current published continuation point is 10aadc7
- published main checkpoint is currently 7c9328e
- last meaningful code checkpoint is 10aadc7 Add automated smoke coverage for route and input gating
- fetch/rebase/push already published the smoke-test code seam on main
- prior local validation for the smoke-test addition remained green:
  - full test PASS (31 files / 175 tests)
  - typecheck PASS
  - build PASS
- this docs closeout is being rebased on top of the latest auto-refresh docs commit before push

## Non-blocking warnings
- useLayoutEffect SSR warnings in integration output
- Vite/react-babel/esbuild/oxc warning noise
- build chunk-size warnings

## Exact next move
- finish publishing this docs closeout
- then choose the next narrow seam from live repo truth
- do not reopen engine repair unless live regression evidence appears

## Retrieval fallback rule
- if continuation notes conflict, prefer the newest handoff file plus live repo state on main
- treat auto-sync files as synchronization helpers, not replacements for human seam handoffs
