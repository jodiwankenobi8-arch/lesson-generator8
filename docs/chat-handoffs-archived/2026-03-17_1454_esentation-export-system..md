# Lesson Generator 8 Chat Handoff

* Date: 2026-03-17 14:54
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue development of lesson-generator8, preserve current architecture/state, and capture repo-safe handoff details, rules, preferences, and next steps from this chat.

## Canonical project assumptions

* lesson-generator8 is a teacher-facing lesson package generator.
* Core product rule: curriculum = content authority; exemplar = presentation authority.
* Wizard flow is Inputs -> Materials -> Results.
* The pipeline is intended to be deterministic: buildBlueprint() -> buildLessonSpec() -> buildLessonPackage().
* Supported lesson modes in this chat are single, full, phonics_only, and comprehension_only.
* Materials currently use simulated processing and mock analysis, not real file parsing.
* The user is building with guidance and wants one PowerShell paste at a time, in large safe steps, with clean architecture and no hacks.

## What was reviewed

* code files
* commits: none reviewed in this chat
* PRs: none reviewed in this chat
* issues: none reviewed in this chat
* terminal output
* pasted handoff notes

## Current state

* The app builds successfully after multiple engine and UI changes.
* Engine layers are now separated into blueprint, spec, package, pipeline, and materials.
* runLessonPipeline.ts is orchestration-only and now calls buildBlueprint(), buildLessonSpec(), and buildLessonPackage().
* buildBlueprint.ts is mode-aware and uses curriculum-derived vocabulary, word lists, texts, and practice ideas more intentionally.
* detectLessonTargets.ts was repaired to match the actual repo types and now supports detectLessonTargets() plus resolveLessonMode().
* buildLessonSpec.ts was upgraded from generic filler to target-aware instructional sections for phonics, comprehension, and full/mixed lessons.
* buildLessonPackage.ts was moved into its own package layer and upgraded to generate richer slides, lesson plan, rotation plan, interventions, and exports.
* Zustand workflow state was improved with getMaterialCounts() and clearer material status handling.
* MaterialsPage.tsx now shows visible processing status, summary counts, and clearer role/status UI.
* ResultsPage.tsx now uses explicit blocked states instead of redirecting when outputs are missing or prerequisites are not met.
* InputsPage.tsx now shows live target analysis, mode guidance, and a lesson scope decision panel for mixed/full/single/portion selection.
* The latest build shown in this chat succeeded and produced dist/assets/index-CCnZ-fai.js.

## Decisions made

* Keep the pipeline layered and responsibility-separated: blueprint decides what to teach, spec decides how to teach it, package builds deliverables, pipeline orchestrates only.
* Do not keep adding logic blindly; inspect real file contents before replacing code.
* Prefer curriculum-derived content over generic fallback content wherever possible.
* Surface mixed-target analysis in the Inputs UI instead of silently relying on engine behavior.
* Keep Results blocked while materials are processing or prerequisites are incomplete, and show explicit reasons.
* Use the current lesson mode as the temporary lesson-scope decision mechanism; standards/component-level split controls are still future work.

## Completed work

* Fixed generateLesson.ts to pass selectedMode into the pipeline.
* Repaired detectLessonTargets.ts to match actual LessonInputs and repo types.
* Updated buildBlueprint.ts to pass selectedMode into detectLessonTargets() and resolve target behavior more consistently.
* Strengthened blueprint extraction to prefer curriculum-derived vocabulary, word lists, texts, and practice ideas.
* Replaced the generic buildLessonSpec.ts implementation with target-aware lesson spec generation.
* Created src/engine/package/buildLessonPackage.ts and moved package creation out of runLessonPipeline.ts.
* Upgraded buildLessonPackage.ts to produce richer deliverables and target-aware interventions/exports.
* Expanded Zustand store workflow helpers with getMaterialCounts().
* Improved MaterialsPage.tsx and ResultsPage.tsx blocked-state UX and status clarity.
* Upgraded InputsPage.tsx to show live target analysis and lesson scope decision UI.
* Verified successful builds repeatedly after each major step.

## Remaining work

* Real file parsing is still not implemented; buildMockMaterialAnalysis.ts is still the active material-analysis mechanism.
* Mixed-lesson scope is only controlled by lesson mode; standards/component selection is not yet implemented.
* Slide output is still text-only and not a true pr* Export generation is still declarative text, not real files.
* Curriculum/exemplar parsing is still heuristic and lightweight, not true document-driven extraction.
* Mixed-target detection was improved but remains heuristic and should still be treated cautiously.

## Next steps

1. Refine mixed-lesson handling beyond mode buttons by adding standards/component selection when lessons are truly mixed.
2. Replace mock material analysis with real parsing for PDF, PPT/PPTX, and DOC/DOCX sources.
3. Improve curriculum extraction quality for word lists, vocabulary, texts, and practice structures.
4. Improve exemplar extraction for pacing, slide sequence, teacher prompts, and activity structure.
5. Upgrade slide/package outputs from text summaries into more structured deliverables.
6. Continue periodic architecture audits to ensure changes remain clean, efficient, effective, and aligned with the product rule.

## Important evidence

* Files reviewed or edited in this chat:

  * src/engine/generateLesson.ts
  * src/engine/blueprint/detectLessonTargets.ts
  * src/engine/blueprint/buildBlueprint.ts
  * src/engine/spec/buildLessonSpec.ts
  * src/engine/package/buildLessonPackage.ts
  * src/engine/pipeline/runLessonPipeline.ts
  * src/engine/types.ts
  * src/state/useLessonStore.ts
  * src/pages/InputsPage.tsx
  * src/pages/MaterialsPage.tsx
  * src/pages/ResultsPage.tsx
  * src/App.tsx
  * src/main.tsx
* Commands/output referenced in this chat:

  * npm run build
  * Get-Content .\src\engine\blueprint\buildBlueprint.ts
  * Get-Content .\src\engine\types.ts
  * Get-Content .\src\engine\spec\buildLessonSpec.ts
  * Get-Content .\src\engine\pipeline\runLessonPipeline.ts
  * Get-Content .\src\engine\package\buildLessonPackage.ts
  * Get-Content .\src\state\useLessonStore.ts
  * Get-Content .\src\pages\MaterialsPage.tsx
  * Get-Content .\src\pages\ResultsPage.tsx
  * Get-Content .\src\pages\InputsPage.tsx
  * Get-Content .\src\App.tsx
  * Get-Content .\src\main.tsx
  * Get-ChildItem .\src\engine -Recurse
* Terminal build evidence from this chat:

  * Successful builds reported after major changes, ending with dist/assets/index-CCnZ-fai.js and "built in 671ms".

## Risks / cautions

* Do not reintroduce generic package/spec behavior now that the engine layers are separated and target-aware.
* Do not collapse package generation back into runLessonPipeline.ts; keep orchestration-only separation.
* Do not bypass the product rule that curriculum drives content and exemplar drives presentation structure.
* Do not claim repo-wide review, commit review, PR review, or issue review; those did not happen in this chat.
* Do not delete or bypass the blocked-results workflow; it is now part of the intended UX.
* Do not treat the current mixed-target handling as fully complete; standards/component granularity is still missing.
* Do not replace clean architectural steps with quick patches; the user explicitly requested large safe changes and maintainable structure.

## Next action

Open the current repo state and continue from the mixed-lesson/product-hardening seam: keep the existing architecture, verify the latest InputsPage mixed-scope UI is present, then implement the next large safe step by replacing mock material analysis with real material parsing or by adding standards/component-level mixed-lesson selection if UI-first work is preferred.