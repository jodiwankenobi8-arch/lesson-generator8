# PROJECT_CURRENT_STATE.md

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 8242798
- Last auto-sync UTC: 2026-03-28T21:34:31Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## Current milestone
Phase 4 source-intake matrix lock — code closeout landed locally

## Why this seam exists
The broader source-intake truth was already visible in docs and page copy, but one live upload path still dropped provenance detail and one generation error string still lagged behind the current teacher-facing wording.

## What is now locked locally
- current intake is upload-based
- supported source materials include:
  - `.txt`
  - `.pdf`
  - `.docx`
  - `.pptx`
  - `.html`
  - `.htm`
  - `.png`
  - `.jpg`
  - `.jpeg`
  - `.webp`
- image uploads remain a bounded OCR recovery lane
- Materials uploads now store source kind, label, and MIME metadata as soon as they are added
- curriculum stays the content authority
- exemplar stays the presentation / structure authority
- generation still depends on usable materials
- links / URLs are not first-class intake in current UI/docs truth

## Files touched in this closeout
- src/pages/MaterialsPage.tsx
- src/pages/MaterialsPage.test.ts
- src/state/useLessonStore.test.ts
- src/state/workflows/generateLessonForStore.ts
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- docs/chat-handoffs/2026-03-28_2050_phase4-source-intake-closeout.md

## Validation for this seam
- `npx vitest run src/pages/MaterialsPage.test.ts src/state/useLessonStore.test.ts`
- `npm run build`
- brief manual Inputs + Materials copy check

## Current next step
- finish the brief manual copy check
- publish this Phase 4 closeout cleanly
- only then reopen a larger orchard/artifact or intake-expansion seam if live code still proves it is next
