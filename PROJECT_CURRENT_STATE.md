# PROJECT_CURRENT_STATE.md

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 036c89a
- Last auto-sync UTC: 2026-03-29T01:13:52Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## Current milestone
Phase 5 OCR support-contract hardening — keep the bounded OCR lane aligned to the currently listed image formats before broader OCR expansion

## Why this seam exists
The centralized source-intake contract is landed, but one live-code gap remained: generic image/* MIME detection could still route unsupported image uploads into the OCR lane even though current docs and Inputs/Materials only list png/jpg/jpeg/webp. That had to be closed before any broader OCR expansion.

## What is now locked locally
- current intake remains upload-based
- the supported source extension list now lives in `src/engine/materials/sourceIntakeContract.ts`
- the Materials upload accept string now comes from that same contract
- Inputs and Materials supported-format copy now comes from that same contract
- unsupported extractor notices now reuse the same supported-target wording as the UI contract
- image uploads remain a bounded OCR recovery lane
- blank-MIME screenshot/photo uploads now stay in the image upload lane through extension-based detection
- generic unsupported image/* MIME uploads no longer silently enter the OCR lane
- supported MIME-only screenshots/photos can still enter the current OCR lane even when the browser-provided name is weak
- curriculum stays the content authority
- exemplar stays the presentation / structure authority
- generation still depends on usable materials
- links / URLs are not first-class intake in current UI/docs truth

## Files touched in this closeout
- src/engine/materials/sourceIntakeContract.ts
- src/engine/materials/sourceIntakeContract.test.ts
- src/engine/extraction.test.ts
- src/pages/MaterialsPage.test.ts
- docs/project-notes/SUPPORTED_SOURCE_MATRIX_CURRENT.md
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- docs/chat-handoffs/2026-03-29_ocr-support-contract-hardening.md

## Validation for this seam
- `npx vitest run src/engine/materials/sourceIntakeContract.test.ts src/pages/MaterialsPage.test.ts src/engine/extraction.test.ts`
- `npm run build`
- or, in a bundle-only environment, run the isolated contract assertions in `verify_changes.ps1` and treat full repo vitest/build as local follow-up

## Current next step
- keep browser/manual checking as a separate follow-up outside this environment
- then choose one deliberate OCR-expansion seam from the honest current baseline instead of widening support implicitly
- prefer current-runtime hardening in `extractImageOcr.ts` / `extractTextFromFile.ts` before adding new listed formats
