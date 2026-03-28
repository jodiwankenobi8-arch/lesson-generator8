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
- Current milestone: Phase 4 source-intake matrix lock — code closeout landed locally
- Current active seam: preserve upload provenance across Materials/store generation truth, then finish manual copy verification and publish

## What is actually landed in this seam
- source-intake truth stays explicit in the repo docs and page copy
- Materials uploads now preserve source kind, source label, and source MIME metadata at intake time
- image uploads are recorded as bounded OCR recovery sources instead of generic file uploads
- generation wording now matches the teacher-facing source-material language already used elsewhere
- targeted automated coverage now checks both upload metadata derivation and store-level image provenance persistence

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- generation depends on usable materials
- screenshot/photo uploads are a bounded OCR recovery lane
- do not overclaim links / URLs as first-class intake

## Validation snapshot for this seam
Run in this order:
1. `npx vitest run src/pages/MaterialsPage.test.ts src/state/useLessonStore.test.ts`
2. `npm run build`

## Exact next move after validation
- brief manual copy check on Inputs and Materials
- commit the Phase 4 closeout files
- push the current branch
