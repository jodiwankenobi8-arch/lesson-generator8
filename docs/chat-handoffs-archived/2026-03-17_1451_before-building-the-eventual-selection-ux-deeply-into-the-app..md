# Lesson Generator 8 Chat Handoff - before-building-the-eventual-selection-ux-deeply-into-the-app.

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue rebuilding lesson-generator8 into a curriculum-aware lesson generation engine, preserve project context, and save a continuation-ready handoff.

## Canonical project assumptions

* The project is a teacher-facing lesson package generator focused initially on Kindergarten ELA, with future expansion to broader grades and subjects.
* The core product rule is: curriculum drives content, exemplar drives presentation structure.
* The intended product flow is Inputs -> Materials -> Results.
* The intended engine flow is Inputs + Materials -> Blueprint -> Lesson Spec -> Lesson Package.
* The user prefers architecturally correct, SOLID, continuation-safe work over quick fixes.
* The preferred implementation style is the largest safe step at each point, while still verifying builds.

## What was reviewed

* code files
* terminal output
* pasted handoff notes

## Current state

The project was rebuilt into a working routed React/Vite baseline and now has a real shared-state pipeline. Inputs, Materials, and Results are wired through Zustand and React Router. Materials have role, status, and analysis modeling. The engine now has blueprint, target detection, spec, materials analysis mock logic, and pipeline orchestration layers. Results are gated by input/material readiness and show blueprint, lesson spec, and lesson package outputs. Mixed-target support has a first-pass structural model, and lesson mode selection is present in state and UI. The latest chat ended with a real contract mismatch identified in src/engine/generateLesson.ts: runLessonPipeline now requires selectedMode, but generateLesson was still calling it with only inputs and materials.

## Decisions made

* Moved from simple page-shell scaffolding to a structured pipeline architecture instead of keeping generation logic in pages.
* Kept page components focused on UI/orchestration and moved behavior into state or engine modules where appropriate.
* Introduced explicit material roles and lifecycle states rather than hardcoded placeholder rows.
* Added explicit intermediate pipeline state in the store: blueprint, lessonSpec, lessonPackage.
* Added generation readiness rules so preview is blocked until inputs are complete and materials are ready.
* Added explicit mixed-target domain modeling* Chose largest safe steps over artificially tiny steps, while still building and verifying after each major change.

## Completed work

* Installed and wired react-router-dom.
* Wrapped the app in BrowserRouter and converted App.tsx to route-based navigation for /inputs, /materials, and /results.
* Replaced simple page placeholders with working InputsPage, MaterialsPage, and ResultsPage structures.
* Added core engine types in src/engine/types.ts and aligned state and generation code to those types.
* Wired InputsPage to Zustand state and ResultsPage to generated output.
* Moved materials into real store-backed state and replaced hardcoded material rows.
* Added MaterialAnalysis, analysis/error fields, and simulated material status progression.
* Refactored material processing logic out of MaterialsPage and later moved mock analysis content into src/engine/materials/buildMockMaterialAnalysis.ts.
* Added buildBlueprint.ts and buildLessonSpec.ts and introduced a real engine pipeline.
* Added src/engine/pipeline/runLessonPipeline.ts and made generateLesson.ts a thinner compatibility layer.
* Added state reset behavior so generated content clears when inputs, materials, or lesson mode change.
* Added store readiness helpers: hasRequiredInputs, hasReadyMaterials, hasProcessingMaterials, canGenerate.
* Added Results blocking behavior for incomplete inputs, processing materials, missing ready materials, and missing generated results.
* Strengthened the domain model by splitting LessonBlueprint into content and structure and LessonSpec sections into title + steps.
* Added first-pass mixed-target detection and later added selected lesson mode support in state, pipeline, and UI.

## Remaining work

* Fix src/engine/generateLesson.ts so it passes selectedMode into runLessonPipeline.
* Improve mixed-target detection beyond simple keyword heuristics so it does not overfire on normal phonics lessons.
* Replace mock material analysis with real parsing/extraction for actual uploaded materials.
* Separate curriculum-derived content and exemplar-derived structure more deeply in blueprint construction.
* Enrich the lesson spec and package generation beyond placeholder instructional steps and strings.
* Implement the fuller mixed-target selection behavior intended by the product plan.
* Add real upload handling and persistence behavior for materials instead of mock additions only.

## Next steps

1. Update src/engine/generateLesson.ts so generateLesson accepts selectedMode (defaulting safely) and passes it to runLessonPipeline.
2. Run npm run build and verify the repo is back to a clean passing state.
3. Review whether any remaining callers still assume the old two-argument pipeline contract.
4. Tighten mixed-target detection using more disciplined signals from inputs and later materials, not only keyword matching.
5. Move from mock material additions to real file upload handling while preserving the current store and engine seams.
6. Expand blueprint/spec/package generation so curriculum content and exemplar structure are represented more concretely.

## Important evidence

* Files referenced and updated in this chat:

  * src/main.tsx
  * src/App.tsx
  * src/pages/InputsPage.tsx
  * src/pages/MaterialsPage.tsx
  * src/pages/ResultsPage.tsx
  * src/state/useLessonStore.ts
  * src/engine/types.ts
  * src/engine/generateLesson.ts
  * src/engine/blueprint/buildBlueprint.ts
  * src/engine/blueprint/detectLessonTargets.ts
  * src/engine/spec/buildLessonSpec.ts
  * src/engine/pipeline/runLessonPipeline.ts
  * src/engine/materials/buildMockMaterialAnalysis.ts
* Commands referenced in this chat:

  * npm install
  * npm install react-router-dom
  * npm run build
* Terminal evidence referenced in the chat:

  * repeated successful Vite builds
  * a TypeScript error in src/engine/generateLesson.ts complaining that runLessonPipeline expected 3 arguments but got 2

## Risks / cautions

* Do not bypass the curriculum-versus-exemplar separation by collapsing everything back into flat string generation.
* Do not reintroduce generation logic into page components just to move faster.
* Do not treat the current mixed-target detection as final; it is structural groundwork only.
* Do not delete or ignore the readiness gating, because it prevents stale or invalid Results output.
* Do not assume repo-wide review happened; this handoff is based only on files, terminal output, and notes explicitly covered in this chat.
* The last known repo state in this chat includes one unresolved compile error in src/engine/generateLesson.ts until that compatibility wrapper is fixed.

## Next action

Start by updating src/engine/generateLesson.ts so generateLesson passes selectedMode to runLessonPipeline, then run npm run build and continue from the now-structured pipeline and mixed-target model.