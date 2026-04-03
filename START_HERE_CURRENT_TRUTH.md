# START_HERE_CURRENT_TRUTH.md

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: dfc580c
- Last auto-sync UTC: 2026-04-03T17:31:02Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## Current repo truth
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Live repo code/tests beat stale docs or older handoffs when they conflict.
- Canonical runtime path:
  1. `src/state/useLessonStore.ts`
  2. `src/state/workflows/processMaterialForStore.ts`
  3. `src/engine/materials/extractTextFromFile.ts`
  4. `src/engine/analysis/runMaterialAnalysis.ts` -> `src/engine/materials/analyzeMaterial.ts`
  5. `src/engine/blueprint/buildBlueprint.ts`
  6. `src/engine/planning/buildLessonPlanningIdeas.ts`
  7. `src/engine/spec/buildLessonSpec.ts`
  8. `src/engine/package/buildLessonPackage.ts`
  9. `src/pages/ResultsPage.tsx`
  10. export helpers and local workspace persistence
- Curriculum remains the content authority.
- Exemplar remains the presentation / structure authority.
- Multiple exemplars are supported. Different exemplars may target shared structure, slides, lesson plan, centers / rotation, teacher-led support, intervention, or printables.
- Exemplar custom notes are for restyling or teacher preference overrides while preserving desired exemplar structure.
- Objective and opening are separate lesson parts. The opening can include the objective, but it is not the same thing as the objective.
- Multi-area lessons should surface ordered lesson portions so each resolved area can keep its own teach / guided / independent / closure flow.
- Inputs -> Materials -> Results remains the active teacher-facing product flow.
- Local workspace persistence remains active in `useLessonStore`.
- Do not reintroduce stale finish-pass framing that treats narrow lesson-type buckets as the completion metric.

## Latest validation snapshot
- `npm run typecheck` PASS
- `npm test` PASS (31 files / 185 tests)
- `npm run build` PASS
- Non-blocking warning noise remains around Vite react-babel esbuild/oxc deprecations.

## Exact next move
- Treat the runtime as finished enough for code-closeout unless fresh live regression evidence appears.
- Use the included now-to-wow evaluator scripts for repo status summaries and future handoffs.
- Reserve future work for browser/manual export verification or clearly evidenced product refinements.
