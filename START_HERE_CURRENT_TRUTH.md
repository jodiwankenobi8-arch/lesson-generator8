# START_HERE_CURRENT_TRUTH.md

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 1a2aa3b
- Last auto-sync UTC: 2026-04-12T00:17:00Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## Current repo truth

- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Live repo code/tests beat stale docs or older handoffs when they conflict.
- Inputs -> Materials -> Results remains the active teacher-facing product flow.
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
- Active product charter: Lesson Generator 8 is a template-preserving lesson transformation system, not a generic AI lesson-package generator.
- The primary engine should support trusted output-shell transformation when exemplars are present and solid default artifact shells when exemplars are absent.
- Curriculum remains the content authority for content-bearing outputs.
- Exemplar remains the optional presentation / structure authority and may be scoped per artifact.
- Multiple exemplars are supported. Different exemplars may target shared structure, slides, lesson plan, centers / rotation, teacher-led support, intervention, or printables.
- Any requested final output may use its own exemplar.
- Missing exemplar should not block output generation by itself.
- When no exemplar is present for a requested output, use a trustworthy default artifact shell.
- Exemplar custom notes are for restyling or teacher preference overrides while preserving desired exemplar structure.
- Objective and opening are separate lesson parts.
- Multi-area lessons should surface ordered lesson portions so each resolved area can keep its own teach / guided / independent / closure flow.
- Local workspace persistence remains active in `useLessonStore`.

## Default continuation mode

Use take-over mode by default:
- inspect the live seam first
- choose the highest-leverage seam from current evidence
- complete the biggest safe coherent pass independently
- prefer full coherent fixes over drip-patch handoffs
- keep one PowerShell paste at a time
- verify immediately after meaningful edits

## Current status

- The repo remains in finish / hardening / targeted-refinement mode, not rescue mode.
- Manual browser/export verification still matters and must be recorded separately from automated validation.
- Current work should strengthen teacher-facing trust, exemplar payoff, artifact-scoped exemplar behavior, parsing quality, and output coherence without reopening broad architecture changes.

## Exact next move

- Keep docs aligned to the clarified product charter and live runtime.
- Use live browser/code evidence to choose the next seam rather than relying on stale “final pass” notes.
- Prioritize work that improves:
  1. exemplar payoff and artifact-scoped exemplar behavior
  2. default-shell behavior when no exemplar is requested
  3. grounded output quality and parsing quality
  4. teacher-facing coherence and trust
- Do not reintroduce stale completion framing that treats narrow lesson-type buckets or one export proof as the only current metric.
