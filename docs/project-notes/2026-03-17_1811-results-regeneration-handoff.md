# Lesson Generator 8 Results Regeneration and Explainability Handoff

- Date: 2026-03-17
- Repo: jodiwankenobi8-arch/lesson-generator8
- Chat purpose: Continue implementation on lesson-generator8, harden explainability and source-selection behavior, wire Results-page teacher decisions to real regeneration, and preserve a continuation-ready handoff.

## Canonical project assumptions
- The app is a teacher-facing lesson package generator with the flow Inputs -> Materials -> Results.
- Curriculum is the content authority.
- Exemplar is the presentation and structure authority.
- Results should explain why content, structure, and package choices were made.
- Missing-area teacher decisions in Results should regenerate lesson outputs through the real store and engine pipeline.
- Extraction, analysis, blueprinting, planning, spec generation, package generation, and traceability are all active parts of the current architecture.
- Bundle chunk-size warnings are real but non-blocking; passing typecheck, engine tests, and build is the current functional bar.

## What was reviewed
- code files
  - src/engine/blueprint/buildBlueprintSourceReadiness.ts
  - src/engine/blueprint/resolveBlueprintContent.ts
  - src/engine/blueprint/materialSelection.ts
  - src/engine/materials/extractTextFromFile.ts
  - src/engine/materials/analyzeMaterial.ts
  - src/engine/analysis/runMaterialAnalysis.ts
  - src/engine/pipeline/runLessonPipeline.ts
  - src/engine/package/buildLessonPackage.ts
  - src/engine/package/buildPackageOutputs.ts
  - src/pages/ResultsPage.tsx
  - src/state/useLessonStore.ts
  - src/engine/types.ts
  - src/engine/blueprint-selected-sources.test.ts
  - src/engine/pipeline-trace.test.ts
  - src/engine/planning-coverage.test.ts
  - src/engine/package-decisions.test.ts
- commits
  - c6f05f0 feat: wire store-driven lesson regeneration from results decisions
  - 55f27a3 fix: restore results imports and use engine lesson generation
  - 6ab6abf feat: clarify source coverage versus generated support in results
  - dec2fd2 feat: make exemplar source selection structure-aware
  - 2d23496 feat: make curriculum source selection coverage-aware
  - 6dc30c2 feat: add coverage support to blueprint source readiness
  - earlier referenced during this chat: 173b6d1, 3d5c65
- PRs
  - none reviewed in this chat
- issues
  - none reviewed in this chat
- terminal output
  - 
pm run typecheck
  - 
pm run test:engine
  - 
pm run build
  - git status --short
  - git log --oneline -n 5
  - git log --oneline -n 6
  - git add
  - git commit
  - git push
  - Get-Content
  - Select-String
- pasted notes
  - repeated requests for current status and handoff
  - requirement that terminal instructions be safe to paste into PowerShell
  - correction that raw TypeScript must not be pasted directly into terminal
- other evidence actually used
  - successful final typecheck, engine test, and build outputs
  - intermediate TypeScript and build failures in ResultsPage.tsx and pipeline-trace.test.ts
  - final clean git status after push
  - final git log showing c6f05f0 at HEAD -> main, origin/main

## Current state
- Latest confirmed pushed commit in this chat: c6f05f0.
- git log --oneline -n 6 showed c6f05f0 (HEAD -> main, origin/main).
- Results-page missing-area decisions are now wired to regenerate lesson outputs through a store action.
- Store now owns a generateLesson flow that can extract/analyze materials, run pipeline generation, and set blueprint, planning ideas, spec, package, and trace.
- Pipeline trace includes selected source IDs and package summary metadata.
- Blueprint/source readiness includes curriculum support, exemplar support, coverage support, selected source IDs, warnings, and signals.
- Curriculum source selection is coverage-aware.
- Exemplar source selection is structure-aware.
- Results UI now distinguishes source coverage versus generated support.
- Final validated terminal state in this chat:
  - 
pm run typecheck passed
  - 
pm run test:engine passed with 16 files and 75 tests
  - 
pm run build passed
  - build still emitted chunk-size warnings around large bundles, especially PDF-related assets
  - git status --short was clean after push

## Decisions made
- Keep curriculum as content authority and exemplar as presentation authority.
- Prefer behavior lineage over path lineage: preserve explainable authority and regeneration behavior even if implementation points move later.
- Use store-driven regeneration from Results for teacher missing-area decisions.
- Keep source coverage and generated support separate in Results UI and planning coverage.
- Make curriculum source choice coverage-aware, not reliability-only.
- Make exemplar source choice structure-aware, not generic ranking-only.
- Treat chunk-size warnings as a later optimization task, not a blocker before validating current behavior.

## Completed work
- Added and confirmed selected curriculum and exemplar material IDs in source readiness.
- Added and confirmed coverage support in blueprint source readiness.
- Extended source-selection tests, including broader curriculum-coverage tie-break behavior.
- Extended pipeline trace to include selected source IDs.
- Updated Results to show:
  - selected source names
  - selected source IDs in trace
  - reliability decision outcomes
  - source coverage vs generated support
  - teacher decision prompts with regeneration state
- Restored Results imports after earlier breakage.
- Added store-owned generateLesson behavior in useLessonStore.ts.
- Wired Results regeneration to the store action instead of page-only generation logic.
- Resolved intermediate TS/build failures related to ResultsPage.tsx, generateLesson, and trace typing.
- Ended with clean push and passing typecheck/tests/build.

## Remaining work
- End-to-end browser validation of the new Results regeneration flow is still needed.
- Confirm runtime behavior, not just compile/test behavior, for decision choices:
  - dd
  - leave_out
  - undecided
- Verify regenerated outputs actually change correctly for:
  - centers
  - rotation plan
  - interventions
  - lesson-plan support blocks
  - visible decision state
- Check repeated decision changes for stale state, double-regeneration, disabled-button issues, and error-state issues.
- Bundle optimization remains open:
  - dynamic imports
  - manual chunking
  - PDF-related bundle weight review
- General Results UX hardening may still be needed after live validation.

## Next steps
1. Run the app in the browser and validate the Results-page regeneration flow end to end with realistic materials.
2. Change missing-area decisions in Results and confirm blueprint, package, and trace-backed UI updates correctly after regeneration.
3. Specifically validate centers, small-group, intervention, lesson-plan support blocks, and visible decision state.
4. Check for stale content, duplicate regeneration, disabled-button edge cases, and error messaging during repeated toggles.
5. If runtime behavior is sound, move next to chunking and performance optimization.
6. Keep future terminal guidance PowerShell-safe; do not paste raw TypeScript directly into terminal.

## Important evidence
- SHAs
  - c6f05f0
  - 55f27a3
  - 6ab6abf
  - dec2fd2
  - 2d23496
  - 6dc30c2
  - 173b6d1
  - 3d5c65
- File paths
  - src/pages/ResultsPage.tsx
  - src/state/useLessonStore.ts
  - src/engine/pipeline/runLessonPipeline.ts
  - src/engine/blueprint/materialSelection.ts
  - src/engine/blueprint/buildBlueprintSourceReadiness.ts
  - src/engine/blueprint/resolveBlueprintContent.ts
  - src/engine/materials/extractTextFromFile.ts
  - src/engine/materials/analyzeMaterial.ts
  - src/engine/analysis/runMaterialAnalysis.ts
  - src/engine/package/buildLessonPackage.ts
  - src/engine/package/buildPackageOutputs.ts
  - src/engine/types.ts
  - src/engine/blueprint-selected-sources.test.ts
  - src/engine/pipeline-trace.test.ts
  - src/engine/planning-coverage.test.ts
  - src/engine/package-decisions.test.ts
- Commands actually mentioned and used
  - 
pm run typecheck
  - 
pm run test:engine
  - 
pm run build
  - git status --short
  - git log --oneline -n 5
  - git log --oneline -n 6
  - git add .\src\pages\ResultsPage.tsx .\src\state\useLessonStore.ts
  - git commit -m "feat: wire store-driven lesson regeneration from results decisions"
  - git push
  - Get-Content
  - Select-String

## Risks / cautions
- Do not reintroduce page-local generation logic that bypasses the store-owned regeneration flow.
- Do not collapse source coverage and generated support into one status; the distinction is intentional now.
- Do not undo curriculum-content versus exemplar-structure authority separation.
- Do not treat the chunk-size warning as a functional failure.
- Do not paste raw TypeScript into PowerShell; use terminal-safe file-writing commands only.
- Do not claim repo-wide review beyond the files and terminal evidence actually surfaced in this chat.

## Next action
Start from commit c6f05f0 and perform end-to-end browser validation of the Results-page missing-area decision regeneration flow, then use those observed runtime behaviors to drive the next implementation pass.
