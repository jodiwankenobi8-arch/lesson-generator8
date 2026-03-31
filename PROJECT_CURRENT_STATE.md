# PROJECT_CURRENT_STATE.md

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 10aadc7
- Last auto-sync UTC: 2026-03-31T13:09:26Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

- Active branch: main
- Current published continuation point: 10aadc7
- Last meaningful code checkpoint: 10aadc7 Add automated smoke coverage for route and input gating

## Current milestone
Engine repair and automated smoke gating are published on main

## Validated state
- current published continuation point is 10aadc7
- published main checkpoint is currently 7c9328e
- last meaningful code checkpoint is 10aadc7 Add automated smoke coverage for route and input gating
- fetch/rebase/push already published the smoke-test code seam on main
- prior local validation for the smoke-test addition remained green:
  - full test PASS (31 files / 175 tests)
  - typecheck PASS
  - build PASS
- warning noise remains non-blocking and unchanged
- this docs closeout is being rebased on top of the latest auto-refresh docs commit before push

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- generation depends on usable materials
- active product flow remains Inputs -> Materials -> Results
- useLessonStore remains the orchestration seam
- do not reopen engine repair without fresh regression evidence

## Top next steps
1. Publish this docs closeout cleanly
2. Then choose the next narrow seam from live repo truth
3. Keep the active continuation set small and obvious
4. Do not let overridden notes compete with the active continuation set

## Local doc policy
- Keep continuation docs authoritative and small
- Preserve automation-compatible anchors and auto-sync blocks
- Do not reopen engine repair without fresh regression evidence