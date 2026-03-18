# lesson-generator8 chat handoff - real-analysis transition

* Date: 2026-03-11
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Recover the local app to a clean passing build, preserve working rules, and transition the project away from mock material processing toward a real extraction + analysis architecture.

## Canonical project assumptions

* The app is a teacher-facing lesson package generator with a 3-step wizard: Inputs -> Materials -> Results.
* Curriculum is the content authority; exemplar is the presentation authority.
* The user does not want mock behavior going forward and wants a functioning app.
* The user wants exemplar handling to support close copying, inspiration, selected aspects, and custom style requests.
* The user prefers one PowerShell paste at a time, large but safe steps, clean architecture, and frequent milestone baselines.
* Local project files are the source of truth; temporary uploaded workspace files are not.

## What was reviewed

* code files

  * src/App.tsx
  * src/engine/blueprint/buildBlueprint.ts
  * src/engine/blueprint/detectLessonTargets.ts
  * src/engine/generateLesson.ts
  * src/engine/materials/buildMockMaterialAnalysis.ts
  * src/engine/package/buildLessonPackage.ts
  * src/engine/pipeline/runLessonPipeline.ts
  * src/engine/spec/buildLessonSpec.ts
  * src/engine/types.ts
  * src/main.tsx
  * src/pages/InputsPage.tsx
  * src/pages/MaterialsPage.tsx
  * src/pages/ResultsPage.tsx
  * src/state/useLessonStore.ts
* commits

  * none reviewed in this chat
* PRs

  * none reviewed in this chat
* issues

  * none reviewed in this chat
* terminal output

  * repeated npm run build output
  * PowerShell file writes, verification reads, and baseline snapshot commands
* pasted handoff notes

  * user-provided continuation handoff describing project goals, workflow, architecture, and rules

## Current state

* The local app was recovered from a corrupted src/pages/InputsPage.tsx and returned to a clean passing build.
* Mixed-target detection was tightened to reduce phonics/comprehension overfiring.
* Practice generation was updated to use curriculum-derived content more explicitly.
* The type contract was expanded for a real-analysis direction:

  * MaterialStatus uses uploaded/extracting/analyzing/ready/error.
  * structured CurriculumAnalysis and ExemplarAnalysis types exist.
  * ExemplarStyleSettings exists in the type layer.
* The store was updated to remove the mock-processing dependency and is now prepared for explicit real extraction/analyzing actions and exemplar style settings.
* A new analysis entrypoint file was added:

  * src/engine/materials/analyzeMaterial.ts
* A new extraction entrypoint file was added:

  * src/engine/materials/extractTextFromFile.ts
* The extraction entrypoint currently provides a safe transitional implementation:

  * txt extraction path exists
  * pdf/docx/pptx are recognized but not yet truly parsed
* Build was passing at the end of the chat.

## Decisions made

* No more mock behavior should be added for final product behavior.
* Do not broad-refactor opportunistically; work in targeted continuation steps.
* Keep the layered pipeline:

  * blueprint = what is taught
  * spec = how it is taught
  * package = deliverables
* Keep terminal workflow disciplined:

  * backup first
  * make change
  * verify key lines
  * run npm run build
  * save baseline only after a passing build
* Exemplar support must* Real ingestion + analysis is now the primary direction; improving mock analysis is no longer an active goal.

## Completed work

* Recovered corrupted src/pages/InputsPage.tsx and restored a clean build.
* Fixed generateLesson.ts call shape earlier in the conversation context by aligning with selectedMode usage expectations.
* Tightened detectLessonTargets behavior to reduce false mixed-target detection.
* Improved buildLessonSpec practice wording to use extracted lesson content more explicitly.
* Updated project plan in-repo:

  * PROJECT_PLAN_UPDATED_2026-03-11.md
* Expanded src/engine/types.ts for real-analysis direction.
* Renamed status usage from scanning to extracting across type/store/UI alignment work.
* Updated src/state/useLessonStore.ts to:

  * remove mock-processing dependency
  * add explicit beginMaterialExtraction / beginMaterialAnalysis actions
  * add setMaterialStyleSettings
  * add removeMaterial
  * support exemplar style settings in state
* Added src/engine/materials/analyzeMaterial.ts as the real analysis entrypoint.
* Added src/engine/materials/extractTextFromFile.ts as the real extraction entrypoint.
* Saved multiple local milestone baselines under lesson-generator8-baselines.

## Remaining work

* Implement real file parsers for:

  * pdf
  * docx
  * pptx
* Wire actual file upload payloads into extractTextFromFile().
* Wire extraction -> analyzeMaterial() -> store status transitions in the live UI flow.
* Replace any remaining runtime paths that still depend on old mock assumptions.
* Update buildBlueprint.ts to consume structured curriculum/exemplar analysis instead of relying mainly on broad keyword matching over extractedText.
* Update Materials UI for exemplar style controls:

  * mode
  * selected aspects
  * custom instructions
* Add AI-backed normalization and generation integration behind the extraction/analysis seam.
* Re-check Results and Materials pages for any remaining wording that implies old simulated processing behavior.

## Next steps

1. Implement the first real parser in src/engine/materials/extractTextFromFile.ts, starting with PDF.
2. Add the integration seam that passes uploaded file content into extractTextFromFile().
3. After extraction succeeds, call analyzeMaterial() and persist structured analysis in store.
4. Update Materials UI to manage exemplar style settings in a visible user flow.
5. Refactor buildBlueprint.ts to prefer structured curriculum/exemplar analysis fields over generic extractedText heuristics.
6. Only after that, continue with AI-backed normalization and lesson-generation refinement.

## Important evidence

* Files reviewed or directly discussed:

  * src/App.tsx
  * src/engine/blueprint/buildBlueprint.ts
  * src/engine/blueprint/detectLessonTargets.ts
  * src/engine/generateLesson.ts
  * src/engine/materials/buildMockMaterialAnalysis.ts
  * src/engine/package/buildLessonPackage.ts
  * src/engine/pipeline/runLessonPipeline.ts
  * src/engine/spec/buildLessonSpec.ts
  * src/engine/types.ts
  * src/main.tsx
  * src/pages/InputsPage.tsx
  * src/pages/MaterialsPage.tsx
  * src/pages/ResultsPage.tsx
  * src/state/useLessonStore.ts
  * PROJECT_PLAN_UPDATED_2026-03-11.md
  * src/engine/materials/analyzeMaterial.ts
  * src/engine/materials/extractTextFromFile.ts
* Commands repeatedly used:

  * npm run build
  * Get-Content
  * Set-Content
  * Copy-Item
  * Select-String
* Baseline folders explicitly created during this chat included:

  * lesson-generator8-post-mixed-fix-*
  * lesson-generator8-post-practice-upgrade-*
  * lesson-generator8-post-store-real-workflow-fixed-20260311-142924
  * lesson-generator8-post-analyze-material-entrypoint-20260311-143333

## Risks / cautions

* Do not revive buildMockMaterialAnalysis as a forward path.
* Do not save milestone baselines after a failed build.
* Do not claim repo-wide review beyond the files and terminal outputs touched in this chat.
* Temporary uploaded workspace files may expire; rely on local repo files and saved baselines.
* The current extraction entrypoint is only a seam; pdf/docx/pptx are not truly implemented yet.
* The older snapshots of some files shown in the chat may not match the final local repo state after later edits; trust the local repo and milestone baselines.

## Next action

Implement real PDF extraction inside src/engine/materials/extractTextFromFile.ts, then wire the live materials flow so upload -> extracting -> analyzing -> ready uses extractTextFromFile() and analyzeMaterial() instead of any legacy simulated path.
