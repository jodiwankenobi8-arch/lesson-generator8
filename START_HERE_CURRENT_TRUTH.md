# START_HERE_CURRENT_TRUTH.md

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 036c89a
- Last auto-sync UTC: 2026-03-29T01:13:52Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## Current repo truth
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Current milestone: Phase 5 OCR support-contract hardening — keep the bounded OCR lane aligned to the currently listed image formats before broader OCR expansion
- Current active seam: do not silently route unsupported image/* uploads into the OCR lane; keep supported screenshot/photo MIME handling aligned to the current listed formats before any broader OCR expansion

## What is actually landed in this seam
- the supported-source extension list now lives in one code-level contract
- Materials and Inputs now read their supported-format wording from that same contract
- Materials upload inputs now use the centralized accept string instead of page-local copies
- unsupported extraction fallback notices now reuse the same supported-target wording as the UI
- extension-based image detection now keeps blank-MIME screenshot/photo uploads in the bounded OCR recovery lane
- targeted automated coverage now checks the centralized contract, the blank-MIME image upload path, and the unsupported-image-MIME guardrail

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- generation depends on usable materials
- screenshot/photo uploads are a bounded OCR recovery lane
- only the currently listed screenshot/photo formats should enter that OCR lane today
- do not overclaim links / URLs as first-class intake

## Validation snapshot for this seam
Run in this order:
1. `npx vitest run src/engine/materials/sourceIntakeContract.test.ts src/pages/MaterialsPage.test.ts src/engine/extraction.test.ts`
2. `npm run build`

If the repo is unavailable in this environment, run the isolated contract checks in `verify_changes.ps1` and treat full vitest/build as local follow-up.

## Exact next move after validation
- keep browser/manual checking as a separate follow-up outside this environment
- then inspect one deliberate OCR-expansion seam from the now-honest current support baseline
- prefer current-runtime hardening in `extractImageOcr.ts` / `extractTextFromFile.ts` before adding new listed formats
