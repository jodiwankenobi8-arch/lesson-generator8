# OCR support-contract hardening handoff

## Repo
- Repo: `jodiwankenobi8-arch/lesson-generator8`
- Branch: `main`
- Published checkpoint still reflected in active docs: `cc94e94`
- This patch is a local follow-up bundle, not a pushed checkpoint.

## What landed in this pass
- kept the bounded OCR lane aligned to the currently listed screenshot/photo formats only
- `isSupportedImageMimeType(...)` now matches the listed OCR lane instead of accepting any generic `image/*` MIME
- supported MIME-only screenshots/photos like `image/png` still enter the current OCR lane even when the browser-provided file name is weak
- unsupported image MIME types like `image/bmp` no longer silently enter the OCR lane before broader OCR expansion is explicitly chosen
- updated targeted tests and active docs to reflect that guardrail

## Why this mattered
The source-intake matrix and Inputs/Materials wording were already locked to `.png/.jpg/.jpeg/.webp` for the bounded OCR lane, but live code still accepted generic `image/*` MIME types. That blurred current support versus planned-next support.

## Narrow validation target
Run only:
- `npx vitest run src/engine/materials/sourceIntakeContract.test.ts src/pages/MaterialsPage.test.ts src/engine/extraction.test.ts`
- `npm run build`

## Best next seam
Do not reopen the source-intake wording lock unless direct live-code evidence shows regression.

The next best seam is one deliberate OCR runtime hardening pass on the current listed-image baseline:
- inspect `src/engine/materials/extractImageOcr.ts`
- inspect the image path in `src/engine/materials/extractTextFromFile.ts`
- inspect `src/engine/extraction.test.ts`
- choose one coherent runtime improvement such as worker reuse / serial execution hardening / clearer OCR failure notes
- do not widen the listed source matrix unless direct file evidence shows the runtime is already ready for it
