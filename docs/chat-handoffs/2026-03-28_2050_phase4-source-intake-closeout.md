# Phase 4 source-intake closeout

## Repo state
- Repo: `jodiwankenobi8-arch/lesson-generator8`
- Branch: `main`
- Published checkpoint before this local closeout: `333e559`

## What changed locally
- `src/pages/MaterialsPage.tsx`
  - derive upload provenance metadata at intake time
  - preserve `sourceKind`, `sourceLabel`, and `sourceMimeType` for uploaded files
  - classify image uploads as `image_upload`
  - infer MIME type from the file name when the browser leaves `file.type` empty
- `src/pages/MaterialsPage.test.ts`
  - new targeted test coverage for upload metadata derivation
- `src/state/useLessonStore.test.ts`
  - remove duplicated image-provenance test copies
  - strengthen the remaining test so it verifies image upload source metadata persistence
- `src/state/workflows/generateLessonForStore.ts`
  - align the no-usable-materials error string to `source material`

## Why this seam mattered
The live repo already described an upload-based source matrix with bounded OCR recovery for images, but the Materials upload path still stored new uploads as generic file sources unless later code filled the metadata back in. This closeout makes the source-intake truth and the stored provenance truth match.

## Validation run locally
1. `npx vitest run src/pages/MaterialsPage.test.ts src/state/useLessonStore.test.ts`
2. `npm run build`

## Remaining manual check
- quick Inputs + Materials copy pass in the browser
- confirm the upload cards and intro copy still read naturally after the provenance helper change

## Next move after manual check
- commit the Phase 4 closeout files
- push `main`
- then re-evaluate whether the next seam is a broader orchard/artifact follow-up or a later intake-expansion seam based on live code, not older notes
