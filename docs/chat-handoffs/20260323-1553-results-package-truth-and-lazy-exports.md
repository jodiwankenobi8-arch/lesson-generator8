# Handoff - results package truth + lazy exports

Date: 2026-03-23
Commit: beba70d
Branch: main

## What landed
- Results/export builders were moved off eager top-level imports and onto lazy dynamic imports.
- Teacher package truth was tightened in Results.
- Missing-area decision prompt text no longer leaks into teacher-facing lesson package sections.
- Results now separates:
  - Teacher-Led Support
  - Intervention Support
- Teacher-Led Support count now comes from the teacher-support rotation/support line instead of intervention count.

## Files changed
- src/pages/ResultsPage.tsx
- src/engine/exports/exportFullPackageZip.ts
- src/engine/spec/buildLessonSpec.ts
- src/engine/lesson-spec.test.ts

## Validation completed
- npm run typecheck -> pass
- npm run test -> pass (24/24 files, 118/118 tests)
- npm run build -> pass

## Known non-blocking notes
- Vite chunk-size warnings remain for large office/pdf chunks.
- React router/useLayoutEffect warnings in tests were noise only.
- Windows CRLF warnings appeared during git add/diff; not a blocker.

## Important current truth
- The export seam is no longer the main issue.
- The upstream package/results truth seam was the real leak.
- Missing-area prompts belong in teacher decision UI, not inside teacher-facing package sections.

## Remaining follow-up
1. Refresh START_HERE_CURRENT_TRUTH.md
2. Refresh PROJECT_CURRENT_STATE.md
3. Keep this handoff as the latest seam reference
4. Do one quick browser/manual Results recheck
5. Then choose the next seam intentionally

## Do not reopen yet
- broad OCR work
- AI/provider redesign
- generic Results redesign
- unrelated Step 6A/source-intake wandering

## Manual note
- Terminal-backed validation is complete.
- If not already rechecked after the final fix, do one quick browser confirmation on Results to confirm:
  - no High-priority decision lines in teacher package sections
  - Teacher-Led Support and Intervention Support render separately
  - export buttons still work