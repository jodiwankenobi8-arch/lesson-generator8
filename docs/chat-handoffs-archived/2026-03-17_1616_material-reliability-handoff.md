# Lesson Generator 8 Chat Handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue and harden the lesson-generator8 engine, verify repo state, checkpoint recent work, improve extraction/analysis/blueprint behavior, and produce a continuation-ready handoff.

## Canonical project assumptions

* Active/canonical working repo is `C:\Users\jodiw\Desktop\lesson-generator8-local`.
* Older OneDrive repo `C:\Users\jodiw\OneDrive\Desktop\New folder\lesson-generator8` is not canonical and should not be used for ongoing work.
* Core product rule is non-negotiable: curriculum = content authority; exemplar = presentation authority.
* Product direction is coverage-first, not curriculum-brand-first.
* Deterministic orchestration is preferred over black-box behavior.
* The blueprint layer should remain deterministic; future AI should improve inputs to blueprint, not replace blueprint orchestration.
* One PowerShell paste at a time is the required workflow.

## What was reviewed

* code files

  * `src/engine/materials/analyzeMaterial.ts`
  * `src/engine/materials/extractTextFromFile.ts`
  * `src/engine/materials/extractPdfOcr.ts`
  * `src/engine/analysis/runMaterialAnalysis.ts`
  * `src/engine/workflow/processMaterial.ts`
  * `src/engine/blueprint/buildBlueprint.ts`
  * `src/engine/blueprint/buildBlueprintSourceReadiness.ts`
  * `src/engine/blueprint/resolveBlueprintContent.ts`
  * `src/engine/blueprint/resolveBlueprintStructure.ts`
  * `src/engine/types.ts`
  * `src/engine/package/buildPackageOutputs.ts`
  * `src/engine/package-outputs.test.ts`
  * `src/pages/ResultsPage.tsx`
  * `src/pages/MaterialsPage.tsx`
  * `src/state/useLessonStore.ts`
  * `src/App.tsx`
* commits

  * `928782e` `Structure export artifacts in package outputs`
  * `440edd1` `Refine export section in results`
  * `35db8a7` `Revert metadata store change and keep store contract clean`
  * `1e09825` `Add material processing pipeline indicator to Materials page`
  * `9c70154` `Prioritize stronger material signals in blueprint pipeline`
  * `c4aef48` `Prioritize strongest curriculum and exemplar in blueprint`
  * older/referenced: `caaa347` `Surface pipeline trace in results`
* PRs

  * none reviewed in this chat
* issues

  * none reviewed in this chat
* terminal output

  * repeated `git status`, `git diff`, `npm test`, `npm run build`
  * build stayed green after recent engine and UI changes
  * tests stayed green at 14 files / 64 tests
  * OneDrive repo push/rebase conflict was investigated and abandoned
* pasted handoff notes

  * large prior master continuation handoff pasted at the start of this chat and used as project context

## Current state

The project is in a strong mid-to-late hardening phase. The main app flow remains Inputs → Materials → Results. Extraction supports txt/html/pdf/docx/pptx with metadata-aware extraction and a real PDF OCR fallback. Materials now show clearer processing progress. Analysis has a new central entrypoint (`runMaterialAnalysis.ts`) and remains heuristic/deterministic. Analysis now computes simple signal-strength tags. Blueprint now sorts materials by signal strength and currently narrows to the strongest curriculum and strongest exemplar before resolving content and structure. Results/export contract cleanup from earlier work remains in place. The canonical local repo was confirmed clean, synced to GitHub, and green on build/tests.

## Decisions made

* Keep the canonical repo as `lesson-generator8-local`; do not continue work in the older OneDrive copy.
* Do not treat `buildBlueprintSourceReadiness.ts` as selection logic; it remains a diagnostics/readiness layer.
* Put source selection in `buildBlueprint.ts`, not in readiness diagnostics.
* Add a central material-analysis seam with `runMaterialAnalysis.ts` so future AI-assisted analysis can plug in without replacing existing deterministic orchestration.
* Keep OCR parser-first, with OCR as bounded fallback.
* Improve OCR triggering based on weak parser output rather than parser failure only.
* Add signal-strength scoring in analysis as a light-weight intermediate step before formal reliability scoring.
* Prioritize strongest curriculum and strongest exemplar in blueprint as a stabilization step.
* Avoid broad type churn when not necessary; prefer contained, seam-based hardening.
* Avoid patch-churn; inspect real contracts/files first, then make one clean edit, then verify.

## Completed work

* Verified repo state multiple times with build and test checkpoints.
* Converted package exports to structured `ExportArtifact[]` and updated Results rendering accordingly.
* Added/confirmed pipeline trace surfacing in Results.
* Added materials-page processing pipeline indicator and improved materials status UX.
* Created `src/engine/analysis/runMaterialAnalysis.ts` and wired `processMaterial.ts` to use it.
* Improved PDF OCR fallback triggering in `extractTextFromFile.ts` so weak parser output can invoke OCR.
* Added curriculum/exemplar signal-strength scoring helpers in `analyzeMaterial.ts`.
* Stored signal-strength in material analysis tags.
* Added blueprint helper logic to read signal strength and sort materials.
* Updated blueprint to currently use the strongest curriculum and strongest exemplar only.
* Verified all recent work with green build and green tests.
* Cleaned the canonical repo to a fully synced state.
* Identified and isolated the non-canonical OneDrive repo as a diverged/outdated copy and stopped using it.

## Remaining work

* Add a formal material reliability layer; this is the most important next hardening step.

  * likely around `runMaterialAnalysis.ts`
  * should incorporate extraction quality, OCR confidence, weak/noisy extraction, and signal quality
  * likely outputs: reliability/confidence and/or usable-for-content / usable-for-structure decisions
* Revisit signal strength so it becomes more meaningful than a flat tag count.
* Revisit blueprint source selection after reliability exists; current top-1/top-1 is a stabilization step, not final weighted merging.
* OCR is not fully finished:

  * PDF OCR fallback exists
  * PPTX/image OCR does not
  * OCR reliability guards can still improve
* AI-backed material analysis is not implemented yet.
* Export generation is still placeholder-level.
* Build chunk size warnings remain; OCR/pdf libraries should likely be lazy-loaded later, but not before core reliability hardening.

## Next steps

1. Inspect and harden `src/engine/analysis/runMaterialAnalysis.ts` as the central reliability seam.
2. Inspect `src/engine/materials/analyzeMaterial.ts` and `src/engine/materials/extractTextFromFile.ts` together to design a formal material reliability score/gate.
3. Add reliability-aware gating so weak materials do not control blueprint content/structure.
4. Re-evaluate blueprint source prioritization after reliability exists; only then consider weighted multi-material merging.
5. Keep build/test checkpoints after each meaningful stabilization step.
6. Keep work in `lesson-generator8-local` only.

## Important evidence

* File paths reviewed:

  * `src/engine/materials/analyzeMaterial.ts`
  * `src/engine/materials/extractTextFromFile.ts`
  * `src/engine/materials/extractPdfOcr.ts`
  * `src/engine/analysis/runMaterialAnalysis.ts`
  * `src/engine/workflow/processMaterial.ts`
  * `src/engine/blueprint/buildBlueprint.ts`
  * `src/engine/blueprint/buildBlueprintSourceReadiness.ts`
  * `src/engine/blueprint/resolveBlueprintContent.ts`
  * `src/engine/blueprint/resolveBlueprintStructure.ts`
  * `src/pages/MaterialsPage.tsx`
  * `src/pages/ResultsPage.tsx`
  * `src/engine/types.ts`
  * `src/engine/package/buildPackageOutputs.ts`
  * `src/engine/package-outputs.test.ts`
* SHAs referenced in this chat:

  * `928782e`
  * `440edd1`
  * `35db8a7`
  * `1e09825`
  * `9c70154`
  * `c4aef48`
  * `caaa347`
  * OneDrive-only diverged commit: `83b32d8`
* Commands actually used/referenced:

  * `git status`
  * `git diff -- <file>`
  * `npm test`
  * `npm run build`
  * `git add ...`
  * `git commit -m "..."`
  * `git push origin main`
  * `git pull --rebase origin main`
  * `git rebase --abort`
  * `git reset --hard HEAD`
  * `Get-Content ...`
  * `Select-String ...`
  * `Get-ChildItem -Recurse .\src\engine -Name`

## Risks / cautions

* Do not use the older OneDrive repo for continued work; it diverged from GitHub and caused push/rebase conflict noise.
* Do not bypass the canonical product rule: curriculum drives content, exemplar drives presentation/structure.
* Do not move source selection logic into `buildBlueprintSourceReadiness.ts`; keep diagnostics separate from decision logic.
* Do not start adding many new features before reliability hardening; current system is strong enough that fragile behavior would now come from low-trust materials, not missing UI.
* Do not paste raw TypeScript into PowerShell; earlier terminal errors came from this and did not reflect repo corruption.
* Do not revive broad patch-churn. Continue with inspect-first, one-clean-edit, verify-immediately workflow.
* OCR is not “done”; PDF fallback exists, but OCR remains a bounded partial implementation and still needs further hardening before expansion.

## Next action

Start the next chat by reviewing:

* `src/engine/analysis/runMaterialAnalysis.ts`
* `src/engine/materials/analyzeMaterial.ts`
* `src/engine/materials/extractTextFromFile.ts`
* `src/engine/blueprint/buildBlueprint.ts`

Then make the safest-biggest next move: add a formal material reliability layer before adding any new major feature.
