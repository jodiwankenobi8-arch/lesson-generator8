# lesson-generator8 chat handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue the lesson-generator8 hardening work from the current repo state, strengthen architecture and tests, avoid patch churn, and prepare a continuation-ready handoff grounded only in this chat.

## Canonical project assumptions

* The active local working folder is `C:\Users\jodiw\Desktop\lesson-generator8-local`.
* The repo is `jodiwankenobi8-arch/lesson-generator8` on branch `main`.
* Curriculum is the content authority; exemplar is the presentation authority.
* The product is coverage-first: detect what uploaded materials already cover, avoid duplicating it, and ask before adding meaningful missing areas.
* The canonical pipeline remains Inputs -> Materials -> Extraction -> Analysis -> Blueprint -> Planning -> Spec -> Package -> Results.
* Deterministic orchestration is preferred over black-box behavior; AI should support extraction/analysis later, not replace deterministic blueprint orchestration.

## What was reviewed

* code files
* commits
* terminal output
* pasted handoff notes

## Current state

The project is in a late blueprint / planning foundation pass. Extraction is already hardened with metadata and PDF OCR fallback. Analysis is structured and now includes exemplar detected features. Blueprint is strong: exemplar style settings are wired into blueprint shaping, blueprint structure consumes exemplar detected features, and blueprint content now carries explicit content coverage. Planning now distinguishes source-derived coverage from generated-support coverage and missing-area prompts are keyed to source coverage missing. Recent test runs in this chat showed 10 passing test files and 52 passing tests. The system is stable enough to continue from the blueprint-to-planning coverage seam rather than adding UI churn.

## Decisions made

* Keep `runLessonPipeline.ts` and `buildBlueprint.ts` as deterministic orchestrators; do not stuff feature logic into the pipeline orchestrator.
* Clean the `processMaterial.ts` / `analyzeMaterial.ts` seam so `analyzeMaterial.ts` owns full role-based `MaterialAnalysis` creation and `processMaterial.ts` only attaches extraction metadata.
* Add exemplar detected feature contracts and conservative feature detection in analysis.
* Feed exemplar detected features into `resolveBlueprintStructure.ts` in a bounded, deterministic way.
* Wire existing exemplar `styleSettings` into blueprint shaping rather than leaving them store-only.
* Separate planning coverage into `sourceCoverage` vs `generatedCoverage`; use source coverage for missing-area prompt decisions.
* Add `blueprint.content.coverage` so upstream curriculum coverage can be handed off cleanly into planning.
* Avoid brittle tests; assert core contracts and categories of influence rather than exact truncated arrays.

## Completed work

* Reviewed and used pasted project handoff notes from this chat as the working product/design baseline.
* Reviewed `src/engine/types.ts`, `src/engine/materials/analyzeMaterial.ts`, and `src/engine/workflow/processMaterial.ts`.
* Simplified `src/engine/workflow/processMaterial.ts` so it no longer rebuilds summary/tag* Refactored `src/engine/materials/analyzeMaterial.ts` so it owns full role-based analysis creation.
* Added exemplar detected feature contracts and feature detection in analysis.
* Added/updated tests in:

  * `src/engine/analysis-signals.test.ts`
  * `src/engine/blueprint-structure-features.test.ts`
  * `src/engine/style-settings-blueprint.test.ts`
  * `src/engine/planning-coverage.test.ts`
* Enriched `src/engine/blueprint/resolveBlueprintStructure.ts` so detected exemplar features influence timing, lesson segments, teacher moves, prompt style, and template shell.
* Wired exemplar `styleSettings` into `src/engine/blueprint/buildBlueprint.ts`.
* Added planning coverage contract support in `src/engine/types.ts` for `sourceCoverage` and `generatedCoverage`.
* Updated `src/engine/planning/buildLessonPlanningIdeas.ts` so missing-area prompts key off source coverage missing and coverage details are split between source and generated support.
* Added `BlueprintContentCoverage` to `src/engine/types.ts`.
* Updated `src/engine/blueprint/resolveBlueprintContent.ts` so `blueprint.content.coverage` is populated from curriculum analysis coverage.
* Git milestone pushed in this chat:

  * `226fdfb` — `Add exemplar feature contracts and blueprint structure signals`
  * `c2bd087` — `Separate source and generated planning coverage`

## Remaining work

* The next architectural seam is the blueprint-to-planning coverage handoff: planning still does some local source-signal inference and should rely more directly on `blueprint.content.coverage`.
* `buildLessonSpec.ts` is working but becoming dense; it is a future cleanup watch area, not the current target.
* PPTX/image OCR fallback is still not implemented.
* AI-assisted extraction/refinement and the true AI-backed material-analysis layer are still future work.
* Exemplar transformation UI is still not built.
* Exports remain early / placeholder.

## Next steps

1. Continue from `src/engine/planning/buildLessonPlanningIdeas.ts` and shift source coverage logic to rely more directly on `blueprint.content.coverage`.
2. Keep `generatedCoverage` tied to generated planning ideas only.
3. Add or update tests to protect blueprint-coverage-driven planning behavior once the handoff is cleaned further.
4. Re-audit whether remaining planning source-signal duplication can be removed cleanly.
5. Only after that milestone, decide whether to continue engine trust/coverage work or move to exemplar transformation UI.

## Important evidence

* Active repo/folder referenced in chat:

  * `C:\Users\jodiw\Desktop\lesson-generator8-local`
  * `jodiwankenobi8-arch/lesson-generator8`
* SHAs explicitly referenced in this chat:

  * `93b7e10` — `Add PDF OCR fallback extraction`
  * `226fdfb` — `Add exemplar feature contracts and blueprint structure signals`
  * `c2bd087` — `Separate source and generated planning coverage`
* Files explicitly reviewed or replaced in this chat:

  * `src/engine/types.ts`
  * `src/engine/materials/analyzeMaterial.ts`
  * `src/engine/workflow/processMaterial.ts`
  * `src/engine/analysis-signals.test.ts`
  * `src/engine/blueprint/buildBlueprint.ts`
  * `src/engine/blueprint/resolveBlueprintStructure.ts`
  * `src/engine/blueprint/resolveBlueprintContent.ts`
  * `src/engine/blueprint-readiness.test.ts`
  * `src/engine/blueprint-structure-features.test.ts`
  * `src/engine/style-settings-blueprint.test.ts`
  * `src/engine/planning/buildLessonPlanningIdeas.ts`
  * `src/engine/planning-coverage.test.ts`
  * `src/engine/spec/buildLessonSpec.ts`
  * `src/engine/package/buildLessonPackage.ts`
  * `src/engine/pipeline/runLessonPipeline.ts`
  * `src/state/useLessonStore.ts`
* Commands/output explicitly seen in this chat:

  * `npm run build`
  * `npm test`
  * `git status`
  * `git add`
  * `git commit -m "Separate source and generated planning coverage"`
  * `git push origin main`
* Recent verified test state in chat:

  * 10 test files passed
  * 52 tests passed

## Risks / cautions

* Do not revive patch-churn. The user explicitly does not want “a million patches.”
* Do not blur curriculum content authority with exemplar presentation authority.
* Do not replace deterministic blueprint orchestration with AI.
* Do not assume repo-wide review beyond the files and terminal output actually examined in this chat.
* Do not bypass the SOPs: one PowerShell paste at a time, biggest safe chunk, inspect the real seam first, and keep doing checkpoint audits every 2–3 implementation steps.
* Do not delete or ignore the recent coverage contract work; it is the current foundation for trustworthy non-duplication behavior.

## Next action

Start from these files and continue the blueprint-to-planning coverage handoff cleanup:

* `src/engine/planning/buildLessonPlanningIdeas.ts`
* `src/engine/blueprint/resolveBlueprintContent.ts`
* `src/engine/types.ts`

The first concrete task is to make planning source coverage consume `blueprint.content.coverage` more directly and reduce local source-signal re-inference while preserving generated coverage behavior.