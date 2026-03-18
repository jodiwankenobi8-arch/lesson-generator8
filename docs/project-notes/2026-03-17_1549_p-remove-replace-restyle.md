# Lesson Generator 8 Hardened chat handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue from the prior handoff, confirm current extraction state, implement OCR-candidate signaling and hardening, move the repo out of a OneDrive-locked folder, add PDF OCR fallback extraction, and define the next cleanup architecture for exemplar feature detection and transformation.

## Canonical project assumptions

* Curriculum is the content authority and exemplar is the presentation authority.
* The system should accept any uploaded materials, detect what is already covered, avoid duplication, and ask before adding important missing areas.
* Deterministic pipeline layers should remain in place; AI should improve upstream signals, not replace blueprint orchestration.
* Exemplar controls should work for any exemplar, not just a Figma slide deck.
* Exemplar UX should be detection first, then teacher choice: keep, remove, replace, restyle.
* The system should separate what an exemplar contains from what the teacher wants done with it.
* Workflow rules in this chat were strict: one PowerShell paste at a time, biggest safe chunk, inspect real files first, frequent test/build checks, frequent git pushes, and structured checkpoints.

## What was reviewed

* code files
* commits
* terminal output
* pasted handoff notes

## Current state

The active working folder moved from a OneDrive-backed path to `C:\Users\jodiw\Desktop\lesson-generator8-local` because npm installs were blocked by repeated Windows/OneDrive file locks in the original folder. The repo is on `main` and the latest pushed commit from this chat is `93b7e10` (`Add PDF OCR fallback extraction`).

Extraction is now parser-first, quality-scored, OCR-candidate aware, and includes real PDF OCR fallback. OCR fallback is conditional and bounded: parser runs first, OCR is attempted only for low-quality OCR-candidate PDFs with a file buffer, parser output is retained if OCR does not materially improve extraction, and metadata remains interpretable. Tests and build were green after this work, with the test count rising from 40 to 46 over the course of the chat.

The next seam identified for cleanup is the analysis/process boundary. `analyzeMaterial.ts` already owns most role-specific `MaterialAnalysis` creation, while `processMaterial.ts` still partially reconstructs `summary`, `tags`, `sourceRole`, and `extractedText` after analysis returns.

## Decisions made

* Solidify before code-splitting. Bundle warnings were treated as non-blocking; extraction architecture took priority.
* Add OCR-candidate signaling before adding real OCR.
* Use browser-safe OCR architecture for PDFs: `pdfjs-dist` to render pages and `tesseract.js` for OCR.
* Keep extraction deterministic: parser first, then OCR fallback, then possible future AI refinement.
* Preserve blueprint/spec/package determinism; do not replace blueprint orchestration with AI.
* Treat exemplar reuse as a universal template transformation problem for any exemplar, not a Figma-specific feature.
* Use a hybrid exemplar UX: first ask how to use the exemplar, then analyze it and list detected features, then let the teacher choose what to kee* The key architecture tweak for future work is to separate detected exemplar features from teacher-selected exemplar transformations.

## Completed work

* Confirmed current pushed baseline and validated that OCR-candidate fields were not yet present at the start of this chat.
* Added OCR-candidate extraction signals and pushed `0911c13`.
* Hardened extraction tests for OCR-candidate behavior and pushed `b951160`.
* Expanded extraction tests further; by the end of the chat the suite was at 46 passing tests.
* Moved repo work to `C:\Users\jodiw\Desktop\lesson-generator8-local` due to persistent OneDrive/node_modules file-lock failures during npm install.
* Installed `tesseract.js` and `pdfjs-dist` and pushed `697961e`.
* Added `src/engine/materials/extractPdfOcr.ts`.
* Wired PDF OCR fallback into `src/engine/materials/extractTextFromFile.ts`.
* Pushed real PDF OCR fallback extraction in `93b7e10`.
* Inspected and documented the current cleanup seam across `src/engine/types.ts`, `src/engine/materials/analyzeMaterial.ts`, and `src/engine/workflow/processMaterial.ts`.

## Remaining work

* Add non-breaking exemplar architecture contracts:

  * detected feature keys and detected feature items
  * detected feature collection
  * teacher transformation request object
* Clean up `processMaterial.ts` so `analyzeMaterial.ts` owns more of the full `MaterialAnalysis` and duplicated rebuild logic is reduced.
* Deepen `analyzeMaterial.ts` to produce richer exemplar feature detection.
* Add tests for exemplar feature detection and later for transformation-ready outputs.
* Build the user-friendly exemplar selection flow on top of detected features.
* PPTX/image OCR fallback is still not implemented.
* AI-assisted extraction/refinement is still not implemented.
* The true AI-backed material-analysis layer is still the biggest unfinished upstream intelligence gap.
* Exports remain early/placeholder.

## Next steps

1. Add the new exemplar contract types in `src/engine/types.ts` without changing runtime behavior yet:

   * `ExemplarDetectedFeatureKey`
   * `ExemplarDetectedFeature`
   * `ExemplarDetectedFeatures`
   * `ExemplarTransformationRequest`
2. Run `npm test` to confirm the contract-only step is non-breaking.
3. Refactor `src/engine/workflow/processMaterial.ts` so `analyzeMaterial.ts` owns more of `MaterialAnalysis` and duplicate summary/tag/sourceRole rebuilding is reduced.
4. Expand `src/engine/materials/analyzeMaterial.ts` to emit richer detected exemplar features using stable internal keys.
5. Add tests for detected exemplar features and transformation-ready analysis outputs.
6. After that, build the teacher-facing exemplar flow:

   * how to use exemplar
   * detected features list
   * keep/remove/replace/restyle controls

## Important evidence

* Repo: `jodiwankenobi8-arch/lesson-generator8`
* Branch reviewed in terminal: `main`
* SHAs referenced in this chat:

  * `93b7e10` — `Add PDF OCR fallback extraction`
  * `697961e` — `Install OCR dependencies and harden extraction tests`
  * `b951160` — `Add OCR candidate extraction tests`
  * `0911c13` — `Add OCR candidate extraction signals`
  * `9a30b61` — `Add extraction metadata and quality scoring`
* Files explicitly reviewed in this chat:

  * `src/engine/types.ts`
  * `src/engine/materials/extractTextFromFile.ts`
  * `src/engine/materials/extractPdfOcr.ts`
  * `src/engine/materials/analyzeMaterial.ts`
  * `src/engine/workflow/processMaterial.ts`
  * `src/engine/extraction.test.ts`
  * `src/pages/MaterialsPage.tsx`
  * `package.json`
* Terminal commands/actions explicitly used:

  * `npm test`
  * `npm run build`
  * `git status --short`
  * `git log --oneline -5`
  * `git add ...`
  * `git commit -m "..."`
  * `git push`
  * `npm install tesseract.js pdfjs-dist`
  * `robocopy . $dest /MIR /XD node_modules dist .vite`
* Active local working folder established in this chat:

  * `C:\Users\jodiw\Desktop\lesson-generator8-local`

## Risks / cautions

* Do not continue working in the original OneDrive-backed repo path for package installation work unless the lock issue is intentionally resolved; npm operations there repeatedly failed with EPERM/rmdir errors.
* Do not bypass the parser-first rule by making OCR the default extraction path.
* Do not blur curriculum content authority with exemplar presentation authority.
* Do not mix detected exemplar features with user-selected transformations in one loose object; that is the next architectural risk to avoid.
* Do not skip checkpoint discipline; this chat relied on frequent test/build/push cycles to stay stable.
* Do not assume repo-wide review happened beyond the files, terminal output, and handoff notes explicitly examined in this chat.

## Next action

Start from `C:\Users\jodiw\Desktop\lesson-generator8-local` and make the contract-only type update in `src/engine/types.ts` to add exemplar detected-feature and transformation-request types, then run `npm test` before touching `processMaterial.ts` or `analyzeMaterial.ts`.
