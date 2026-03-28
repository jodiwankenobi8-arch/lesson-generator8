# START_HERE_CURRENT_TRUTH.md

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 333e559
- Last auto-sync UTC: 2026-03-28T18:53:29Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## Current repo truth
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Current milestone: Phase 4 source-intake matrix lock
- Current active seam: align docs + UI + targeted store provenance test to the broader upload-based source matrix already supported locally

## What is actually landed in this seam
- source-intake truth is now explicit in one repo doc
- Materials copy now treats curriculum and exemplar as material lanes, not just document-file lanes
- Inputs copy now names the current upload-based source model earlier
- bounded OCR recovery for image uploads is described honestly
- links / URLs are not overclaimed as first-class intake
- targeted store provenance coverage includes an image-upload traceability assertion

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- generation depends on usable materials
- screenshot/photo uploads are a bounded OCR recovery lane
- do not overclaim links / URLs as first-class intake

## Validation snapshot for this seam
Run in this order:
1. `npx vitest run src/state/useLessonStore.test.ts`
2. `npm run build`

## Exact next move after validation
- brief manual copy check on Inputs and Materials
- commit only the six Phase 4 target files
- push the current branch
