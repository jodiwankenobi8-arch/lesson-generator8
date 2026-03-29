# OCR runtime stability hardening handoff

## Repo
- Repo: `jodiwankenobi8-arch/lesson-generator8`
- Branch: `main`
- Latest pushed checkpoint from current chat: `3b20ad5`
- This patch is a local follow-up bundle, not a pushed checkpoint.

## What landed in this pass
- kept the pushed OCR support contract intact; this pass does **not** widen listed image support
- `extractImageTextWithOcr(...)` now serializes screenshot/photo OCR jobs so repeated image processing does not overlap worker startup in the bounded lane
- object URLs now revoke even if OCR worker creation fails before recognition begins
- screenshot/photo OCR text now passes through the shared low-value line normalization before analysis
- image OCR now falls back cleanly when OCR only returns low-value noise like slide markers, raw URLs, or bare numbers
- added focused tests for runtime cleanup, serialized OCR jobs, and image OCR normalization behavior

## Why this mattered
The support matrix was already honest after 3b20ad5, but runtime behavior inside that lane was still thinner than the contract around it. This pass hardens the current OCR lane without reopening the already-validated MIME guardrail.

## Narrow validation target
Run only:
- `npx vitest run src/engine/materials/extractImageOcr.test.ts src/engine/extraction.test.ts`
- `npm run build`

## Best next seam
Do not reopen the pushed source-intake wording or MIME contract unless direct live-code evidence shows regression.

The next best seam is one deliberate OCR follow-up from the current listed-image baseline:
- browser/manual check one supported screenshot/photo upload end to end
- then inspect one teacher-facing OCR confidence seam, such as clearer low-confidence wording or stronger bounded PDF/PPTX OCR parity
- do not widen the listed source matrix unless direct runtime evidence shows the current lane is ready for it
