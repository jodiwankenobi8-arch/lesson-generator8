# 2026-03-23 lane-separation and Results export wording handoff

## Repo / branch
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Published checkpoint: d0fb041

## What changed in this narrow pass
- hardened package outputs so T1 centers remain student-independent in package outputs
- filtered teacher-led/T2/T3 lines out of center narrative/labels where they did not belong
- removed teacher-led support from a T1-only rotation plan
- kept teacher-led support in rotation only when T2 is selected
- refined Results export wording so ZIP/export behavior is described more precisely and more calmly
- updated focused tests to match the corrected lane separation / wording truth

## Files changed
- src/engine/package/buildPackageOutputs.ts
- src/engine/package-outputs.test.ts
- src/pages/ResultsPage.tsx
- src/pages/ResultsPage.test.tsx

## Verified status
- published on main at d0fb041
- typecheck PASS
- test PASS (24 files / 118 tests)
- build PASS

## Still true / not yet done
- browser/manual Results smoke check is still pending after this pass
- large build chunk warnings remain unchanged:
  - ResultsPage
  - office
  - pdf

## Recommended next move
1. do a quick browser/manual smoke check on Results export buttons and wording
2. then choose the next seam intentionally instead of returning to Step 6A

## Notes
- this pass does not change export/package format support
- this pass does not change OCR/provider scope
- this pass is a narrow trust/presentation hardening step on top of the already-landed export/package seam
