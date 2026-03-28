# START_HERE_CURRENT_TRUTH.md

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 3d6362a
- Last auto-sync UTC: 2026-03-28T22:37:40Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## Current repo truth
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Current milestone: Phase 5 source-intake contract parity hardening — centralized contract landed locally
- Current active seam: keep the supported-source matrix, upload accept strings, MIME inference, and extractor fallback notices aligned from one code-level contract before any later OCR expansion

## What is actually landed in this seam
- the supported-source extension list now lives in one code-level contract
- Materials and Inputs now read their supported-format wording from that same contract
- Materials upload inputs now use the centralized accept string instead of page-local copies
- unsupported extraction fallback notices now reuse the same supported-target wording as the UI
- extension-based image detection now keeps blank-MIME screenshot/photo uploads in the bounded OCR recovery lane
- targeted automated coverage now checks the centralized contract and the blank-MIME image upload path

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- generation depends on usable materials
- screenshot/photo uploads are a bounded OCR recovery lane
- do not overclaim links / URLs as first-class intake

## Validation snapshot for this seam
Run in this order:
1. `npx vitest run src/engine/materials/sourceIntakeContract.test.ts src/pages/MaterialsPage.test.ts src/engine/extraction.test.ts`
2. `npm run build`

## Exact next move after validation
- update the supported-source matrix doc and active continuation docs
- keep browser/manual checking as a separate follow-up outside this environment
- then decide whether the next live seam is deliberate OCR expansion or a later orchard/artifact tightening pass
