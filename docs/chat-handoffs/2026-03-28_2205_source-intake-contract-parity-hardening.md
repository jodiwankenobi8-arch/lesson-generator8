# Source-intake contract parity hardening

## Repo state
- Repo: `jodiwankenobi8-arch/lesson-generator8`
- Branch: `main`
- Published checkpoint before this local seam: `8242798`

## Why this seam was next
Phase 4 upload provenance closeout was already treated as pushed truth. The next highest-leverage remaining intake seam in live code was duplication: the supported-source list, accept string, and unsupported extractor notice were still copied across pages and engine code. That made future OCR/intake expansion easy to drift.

## What changed locally
- Added `src/engine/materials/sourceIntakeContract.ts` as the single code-level contract for:
  - supported upload extensions
  - upload accept string
  - human-readable supported-format wording
  - unsupported extraction-target notice
  - MIME inference helpers
  - extension-based image detection helpers
- Updated `src/pages/InputsPage.tsx` to read supported-format wording from the centralized contract
- Updated `src/pages/MaterialsPage.tsx` to:
  - read supported-format wording from the centralized contract
  - use the centralized accept string
  - keep blank-MIME screenshot/photo uploads in the `image_upload` lane through extension-based detection
  - delegate MIME inference to the centralized contract
- Updated `src/engine/materials/extractTextFromFile.ts` to reuse the centralized supported-target notice and extension detection helpers
- Added focused coverage in `src/engine/materials/sourceIntakeContract.test.ts`
- Strengthened `src/pages/MaterialsPage.test.ts` to cover blank-MIME image uploads
- Updated `src/engine/extraction.test.ts` to reuse the centralized extraction-target notice and cover `.webp` detection
- Added a code-authority note to `docs/project-notes/SUPPORTED_SOURCE_MATRIX_CURRENT.md`

## Validation run locally
1. `npx vitest run src/engine/materials/sourceIntakeContract.test.ts src/pages/MaterialsPage.test.ts src/engine/extraction.test.ts`
2. `npm run build`

## What this seam locks
- UI copy, upload accept strings, MIME inference, and extractor fallback wording now stay aligned from one code-level contract
- supported screenshots/photos remain a bounded OCR recovery lane
- blank-MIME image uploads no longer fall out of the image-source lane just because the browser omitted `file.type`

## Best next move after this seam
- inspect live code for the next single bounded seam
- likely candidates after this parity hardening:
  - deliberate OCR expansion, if the live extractor/tests still show the contract is explicit enough
  - orchard/artifact tightening only if live UI code proves that is now the bigger remaining gap
- do not reopen Phase 4 provenance work without direct regression evidence
