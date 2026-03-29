# PROJECT_CURRENT_STATE.md

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 036c89a
- Last auto-sync UTC: 2026-03-29T01:13:52Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## Current milestone
Phase 5 source-intake contract parity hardening — centralized contract landed locally

## Why this seam exists
The broader source-intake truth was already visible in docs, UI copy, extractor behavior, and tests, but the supported extension list and accept string were still duplicated across pages and engine notices. That duplication made future OCR/intake expansion easy to drift.

## What is now locked locally
- current intake remains upload-based
- the supported source extension list now lives in `src/engine/materials/sourceIntakeContract.ts`
- the Materials upload accept string now comes from that same contract
- Inputs and Materials supported-format copy now comes from that same contract
- unsupported extractor notices now reuse the same supported-target wording as the UI contract
- image uploads remain a bounded OCR recovery lane
- blank-MIME screenshot/photo uploads now stay in the image upload lane through extension-based detection
- curriculum stays the content authority
- exemplar stays the presentation / structure authority
- generation still depends on usable materials
- links / URLs are not first-class intake in current UI/docs truth

## Files touched in this closeout
- src/engine/materials/sourceIntakeContract.ts
- src/engine/materials/sourceIntakeContract.test.ts
- src/engine/materials/extractTextFromFile.ts
- src/engine/extraction.test.ts
- src/pages/InputsPage.tsx
- src/pages/MaterialsPage.tsx
- src/pages/MaterialsPage.test.ts
- docs/project-notes/SUPPORTED_SOURCE_MATRIX_CURRENT.md
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- docs/chat-handoffs/2026-03-28_2205_source-intake-contract-parity-hardening.md

## Validation for this seam
- `npx vitest run src/engine/materials/sourceIntakeContract.test.ts src/pages/MaterialsPage.test.ts src/engine/extraction.test.ts`
- `npm run build`

## Current next step
- decide whether the next live seam is deliberate OCR expansion or a later orchard/artifact tightening pass
- keep browser/manual checking as a separate follow-up outside this environment
