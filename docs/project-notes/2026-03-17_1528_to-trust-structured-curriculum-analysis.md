# lesson-generator8 handoff - to-trust-structured-curriculum-analysis

* Date: 2026-03-17 15:28
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue hardening the lesson engine, wire outputs end to end, add automated testing, and preserve a continuation-ready handoff with the user’s SOP and workflow constraints.

## Canonical project assumptions

* The app is a teacher-facing lesson package generator with a 3-step flow: Inputs -> Materials -> Results.
* Curriculum is the content authority; exemplar is the presentation authority.
* Mixed-target handling matters and should avoid overfiring on clear single-target phonics lessons.
* Build warnings around large chunks and pdf-parse are currently non-blocking and were intentionally deprioritized.
* The user prefers one PowerShell paste at a time, large safe architectural steps, low-friction instructions, frequent build checks, frequent git checkpoints, and structured audits every 2-3 meaningful steps.
* At the end of this chat, the user preferred automated testing over manual testing.

## What was reviewed

* code files: src/engine/generateLesson.ts; src/engine/pipeline/runLessonPipeline.ts; src/engine/types.ts; src/engine/materials/extractTextFromFile.ts; src/engine/materials/analyzeMaterial.ts; src/engine/workflow/processMaterial.ts; src/engine/blueprint/buildBlueprint.ts; src/engine/blueprint/resolveBlueprintContent.ts; src/engine/blueprint/resolveBlueprintStructure.ts; src/engine/blueprint/buildBlueprintSourceReadiness.ts; src/engine/planning/buildLessonPlanningIdeas.ts; src/engine/spec/buildLessonSpec.ts; src/engine/package/buildLessonPackage.ts; src/engine/package/buildPackageOutputs.ts; src/engine/package/buildLessonPackageReadiness.ts; src/engine/slides/assembleSlideDeck.ts; src/engine/slides/buildSlidePlan.ts; src/engine/slides/buildSlideContent.ts; src/pages/MaterialsPage.tsx; src/pages/ResultsPage.tsx; package.json
* commits: earlier push to main showed 7a015db..9fadf6f; local commit 09907ad ("Improve planning and lesson spec intelligence") was created later
* PRs: none reviewed in this chat
* issues: none reviewed in this chat
* terminal output: repeated npm run build output; npm run dev usage; npm test output; npm install / npm pkg set output; git status / commit / push output including one failed push due to network
* pasted handoff notes: comprehensive lesson-generator8 handoff/spec notes supplied by the user at the start of the chat

## Current state

The engine pipeline is materially stronger and builds cleanly: material extraction, analysis, blueprinting, planning, spec generation, slide planning/assembly, package building, and results surfacing were all reviewed and tightened. Package slide output now routes through the slide engine instead of bypassing it. Vitest is installed and wired in package.json, and src/engine/pipeline.test.ts passes with 4 green regression tests covering end-to-end pipeline execution, phonics single-target behavior, mixed-target behavior, and curriculum-vs-exemplar influence. The app can run locally with npm run dev. Recent work after local commit 09907ad remains important context; not every post-09907ad change was confirmed as pushed.

## Decisions made

* Keep architecture layered and ownership-based: materials -> blueprint -> planning -> spec -> slides/package -> UI.
* Treat extractTextFromFile/analyzeMaterial as the materials seam; do not leak extraction/analysis logic into later layers.
* Tighten blueprint content* Tighten blueprint readiness so fallback/default arrays do not automatically count as strong support.
* Strengthen planning for mixed-target lessons and blueprint-aware slide notes without changing return shapes.
* Strengthen spec so it carries planning, formative, small-group, and intervention intelligence forward.
* Use assembleSlideDeck/buildSlidePlan/buildSlideContent as the canonical slide path; do not bypass it in package outputs.
* Start automated validation with Vitest engine tests instead of manual testing, per the user’s preference at the end of the chat.
* Defer chunk-size/build-warning cleanup and avoid more broad refactoring unless tests or real output quality expose a concrete weakness.

## Completed work

* Confirmed repeated green builds with non-blocking Vite/pdf-parse chunk warnings.
* Strengthened material extraction wiring and material analysis heuristics.
* Tightened blueprint content resolution and blueprint source readiness logic.
* Upgraded planning intelligence, including stronger mixed-target handling.
* Upgraded lesson spec to surface planning/support ideas more directly.
* Upgraded slide planning to be more selective and content-anchored.
* Changed package outputs so lessonPackage.slides uses the slide engine path via assembleSlideDeck.
* Installed Vitest and @types/node.
* Added test scripts to package.json: test, test:watch, test:engine.
* Resolved Vitest native binding issue by installing @rolldown/binding-win32-x64-msvc.
* Added src/engine/pipeline.test.ts and passed 4 tests.

## Remaining work

* Add the next automated test batch for material analysis and blueprint readiness (the next suggested file in chat was src/engine/analysis-and-blueprint.test.ts).
* Add slide/package-focused automated tests so the stronger slide engine and package outputs stay protected.
* Do real output-quality validation later when the user wants it; manual testing was explicitly postponed.
* Real export generation is still placeholder-based.
* PDF/DOCX/PPTX extraction quality may still need deeper validation with realistic files.
* Large chunk warnings and Vite/esbuild/oxc warnings remain unresolved but were intentionally deprioritized.

## Next steps

1. Add automated tests for analyzeMaterial and buildBlueprint source readiness, then run npm test.
2. Add automated tests covering slide/package behavior now that package outputs use assembleSlideDeck.
3. Only after test coverage improves, inspect any concrete output-quality failures instead of doing more speculative refactors.
4. When the user wants, resume git push workflow carefully because unrelated staged/unstaged/untracked files exist in the repo.

## Important evidence

* Files referenced: src/engine/generateLesson.ts; src/engine/pipeline/runLessonPipeline.ts; src/engine/types.ts; src/engine/materials/extractTextFromFile.ts; src/engine/materials/analyzeMaterial.ts; src/engine/workflow/processMaterial.ts; src/engine/blueprint/buildBlueprint.ts; src/engine/blueprint/resolveBlueprintContent.ts; src/engine/blueprint/resolveBlueprintStructure.ts; src/engine/blueprint/buildBlueprintSourceReadiness.ts; src/engine/planning/buildLessonPlanningIdeas.ts; src/engine/spec/buildLessonSpec.ts; src/engine/package/buildLessonPackage.ts; src/engine/package/buildPackageOutputs.ts; src/engine/package/buildLessonPackageReadiness.ts; src/engine/slides/assembleSlideDeck.ts; src/engine/slides/buildSlidePlan.ts; src/engine/slides/buildSlideContent.ts; src/pages/MaterialsPage.tsx; src/pages/ResultsPage.tsx; package.json; src/engine/pipeline.test.ts
* SHAs actually referenced in chat: 9fadf6f (pushed to main earlier in chat), 09907ad (local commit message: Improve planning and lesson spec intelligence)
* Commands actually referenced: npm run build; npm run dev; npm test; npm install -D vitest @types/node; npm pkg set scripts.test="vitest run"; npm pkg set scripts.test:watch="vitest"; npm pkg set scripts.test:engine="vitest run src/engine/**/*.test.ts"; npm install -D @rolldown/binding-win32-x64-msvc; git status; git add .; git commit -m "Improve planning and lesson spec intelligence"; git push
* Test evidence actually observed: vitest run showed 1 file passed, 4 tests passed in src/engine/pipeline.test.ts

## Risks / cautions

* Do not break the core product rule: curriculum must remain content authority and exemplar must remain presentation authority.
* Do not reintroduce the older package-output bypass that built slides from planningIdeas.slidePlans instead of the slide engine.
* Do not treat current chunk-size or Vite warnings as blockers unless they start breaking builds or tests.
* Do not over-refactor the engine again without test- or output-driven evidence; the agreed direction was to stop speculative refactoring and rely more on testing.
* The repo currently contains unrelated staged, unstaged, and untracked files; any future commits must stay isolated.
* Preserve the user’s SOP: one PowerShell paste at a time, large safe steps, minimal friction, frequent build checks, periodic audits, and explicit continuation-ready handoffs.

## Next action

Start the next chat by adding the pending analysis/blueprint automated tests (the prepared but not yet created next file was src/engine/analysis-and-blueprint.test.ts), run npm test, and use any failures to decide the next targeted hardening step.
