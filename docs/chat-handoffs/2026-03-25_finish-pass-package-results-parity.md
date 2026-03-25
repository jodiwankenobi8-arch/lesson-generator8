# Lesson Generator 8 — finish-pass package/results parity handoff

## Scope of this pass
- harden the package/results lane-separation contract
- keep the export model explicit as per-artifact downloads plus an optional package ZIP
- add focused parity tests and a manual validation checklist

## What changed
- teacher-led support only packages no longer invent a `No centers defined.` rotation placeholder
- printables export now separates:
  - Centers / Independent Work
  - Teacher-Led Support
  - Centers / Independent Work Rotation
  - Intervention Support
- Results export section now highlights the package ZIP and explicitly lists the artifacts currently bundled inside it
- focused tests were added for:
  - teacher-led support only output parity
  - mixed output parity
  - printables export lane separation

## What this pass does not claim
- no real browser/manual pass was executed in this bundle
- no OCR or AI expansion was attempted
- no broader source-intake expansion was landed

## Recommended next move after applying this bundle
1. run the targeted tests plus full typecheck/build
2. do the short browser/manual checklist in `docs/manual-validation/2026-03-25_results-export-parity-checklist.md`
3. if the manual pass is clean, update the active truth docs to point at this seam
