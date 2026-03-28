# PROJECT_CURRENT_STATE.md

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 245313d
- Last auto-sync UTC: 2026-03-28T18:52:16Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## Current milestone
Phase 4 source-intake matrix lock

## Why this seam exists
The broader source-intake truth had drifted:
- docs and UI still read as document-only upload intake
- local engine/state/test work already supported image-upload provenance and bounded OCR recovery
- teacher-facing wording needed to catch up without overclaiming links/URLs or screenshot-first workflows

## Files in scope
- docs/project-notes/SUPPORTED_SOURCE_MATRIX_CURRENT.md
- src/pages/MaterialsPage.tsx
- src/pages/InputsPage.tsx
- src/state/useLessonStore.test.ts
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md

## Truth locked by this seam
- current intake is upload-based
- supported source materials include:
  - .txt
  - .pdf
  - .docx
  - .pptx
  - .html
  - .htm
  - .png
  - .jpg
  - .jpeg
  - .webp
- image uploads are a bounded OCR recovery lane
- curriculum stays the content authority
- exemplar stays the presentation / structure authority
- generation still depends on usable materials
- links / URLs are not first-class intake in current UI/docs truth

## Validation for this seam
- `npx vitest run src/state/useLessonStore.test.ts`
- `npm run build`
- brief manual Inputs + Materials copy check

## Commit scope rule
Do not stack unrelated work on top of this seam.
Commit only the six Phase 4 target files after validation passes.
