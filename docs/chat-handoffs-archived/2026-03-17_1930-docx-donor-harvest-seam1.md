# Lesson Generator 8 — DOCX milestone and donor-harvest seam 1 handoff

* Date: March 17, 2026
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: finish the DOCX-first lesson-plan export milestone in the canonical repo, reconcile Codex/local/GitHub truth, and land the first donor-harvest curriculum/extraction seam safely.

## Canonical project assumptions

- Canonical local repo path is `C:\Users\jodiw\OneDrive\Desktop\lesson-generator8-local`.
- Canonical working branch is `work/canonical-project-consolidation`.
- Live repo truth is authoritative over notes, summaries, or side environments.
- Rescue refs are donor shelves, not live branches to revive or merge wholesale.
- Current phase is hardening, with donor harvest prioritized before cleanup or broader redesign.
- Curriculum remains content authority; exemplar remains presentation authority.
- Deterministic engine logic remains authoritative; AI/OCR may support later but do not replace engine truth.

## What was reviewed

- code files:
  - `src/engine/package-outputs.test.ts`
  - `src/engine/package/buildPackageOutputs.ts`
  - `src/pages/ResultsPage.tsx`
  - `src/engine/exports/exportLessonPlanDocx.ts`
  - `src/engine/blueprint/buildBlueprint.ts`
  - `src/engine/blueprint/resolveBlueprintContent.ts`
  - `src/engine/blueprint/buildBlueprintSourceReadiness.ts`
  - `src/engine/analysis/runMaterialAnalysis.ts`
  - `src/engine/materials/analyzeMaterial.ts`
  - `src/engine/materials/extractTextFromFile.ts`
  - `src/engine/analysis-signals.test.ts`
  - `src/engine/blueprint-readiness.test.ts`
  - `src/engine/blueprint-selected-sources.test.ts`
  - donor helper/source files from rescue refs including `src/engine/curriculum/extractCoverageFromCurriculum.ts`, `src/utils/readUploadedText.ts`, and `src/engine/domain/classifyLessonDomain.ts`
- commits:
  - `63025da`
  - `dd9a09b`
  - `3cbf4e3`
  - `0497731`
  - donor-side commit identities discussed: `708b182`, `b589803`, and an unrecoverable/incorrect `7b83d98`
- PRs:
  - no GitHub PR page/thread was directly reviewed in this chat
- issues:
  - no GitHub issue page/thread was directly reviewed in this chat
- terminal output:
  - branch/status/log output
  - `git diff`
  - `git show`
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - `git push`
- pasted notes:
  - March 16 project handoff update
  - March 16 current SOPs PDF
- other evidence actually used:
  - rescue refs present in local repo:
    - `rescue/runtime-phase4-tip`
    - `rescue/orchard-polish-tip`
    - tags `rescue-005017e`, `rescue-d657aa3`, `rescue-400a0ff`

## Current state

- Canonical branch is `work/canonical-project-consolidation`.
- Current canonical checkpoint is `0497731`.
- `0497731` is pushed to GitHub on `origin/work/canonical-project-consolidation`.
- DOCX-first lesson-plan export is complete and verified.
- Donor-harvest seam 1 is complete and verified in canonical truth.
- Full verification passed after the wiring fix:
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
- Full suite result at this point: 19 test files passed / 87 tests passed.
- Known warnings remain non-blocking:
  - Vite/esbuild deprecation warnings
  - `useLayoutEffect` SSR warnings in route integration tests
  - chunk-size warnings during build

## Decisions made

- Treat the Windows local repo plus GitHub as canonical truth.
- Keep GitHub, Codex, and local files on the same page.
- Codex can be used, but nothing counts unless it lands in canonical and is pushed.
- Finish the DOCX-first milestone narrowly without broadening into PPTX, ZIP, or export redesign.
- Treat donor harvest as the immediate next phase after DOCX-first completion.
- Use inspect-first, one-seam-at-a-time donor harvest from rescue refs.
- Land donor-harvest seam 1 in deterministic engine logic, not UI/shell layers.
- Do an inspect-only pass for donor-harvest seam 2 next; do not jump to broader redesign.

## Completed work

- Finished DOCX-first lesson-plan export and pushed checkpoint `dd9a09b`.
- Repaired over-broad export test expectations so only lesson-plan export moved to DOCX.
- Confirmed slides and printables remain plain-text exports.
- Inspected donor refs and identified curriculum/extraction seams rather than broad branch revival.
- Added deterministic helper `src/engine/materials/extractCurriculumCoverageCandidates.ts`.
- Added targeted noisy-source curriculum analysis test in `src/engine/analysis-signals.test.ts`.
- Landed helper/test checkpoint `3cbf4e3`.
- Verified and then fixed missing wiring in `src/engine/materials/analyzeMaterial.ts`.
- Pushed wiring completion checkpoint `0497731`.

## Remaining work

- Donor-harvest phase is not complete.
- Donor-harvest seam 2 is not yet chosen.
- Rescue refs/tags should remain available; no cleanup/deletion yet.
- PPTX export, ZIP export, broader export redesign, route churn, shell revival, and broad cleanup are not the next step.
- Codex branch/remote behavior remains a caution: some Codex sandboxes were not aligned to canonical branch refs/remotes.

## Next steps

1. Confirm canonical repo truth before any new work:
   - repo path `C:\Users\jodiw\OneDrive\Desktop\lesson-generator8-local`
   - branch `work/canonical-project-consolidation`
   - HEAD `0497731`
   - clean working tree
2. Do an inspect-only donor-harvest seam 2 pass against:
   - `rescue-005017e`
   - `rescue-d657aa3`
   - optional tiny salvage from `rescue-400a0ff`
3. Focus inspection on one curriculum/extraction engine seam only.
4. Choose one best safe seam.
5. Extend the nearest existing test seam when behavior changes.
6. After any implementation, run:
   - `npm run typecheck`
   - `npm run test`
   - `npm run build`
7. Checkpoint and push immediately after the seam is verified.

## Important evidence

- Canonical repo path: `C:\Users\jodiw\OneDrive\Desktop\lesson-generator8-local`
- Canonical branch: `work/canonical-project-consolidation`
- Key SHAs:
  - `63025da` — Harden multi-source curriculum threading and results traceability
  - `dd9a09b` — Finish DOCX-first lesson plan export
  - `3cbf4e3` — Harvest curriculum coverage from noisy slide/PDF text
  - `0497731` — Wire harvested curriculum coverage into curriculum analysis
- Donor refs examined:
  - `rescue/runtime-phase4-tip`
  - `rescue/orchard-polish-tip`
  - `rescue-005017e`
  - `rescue-d657aa3`
  - `rescue-400a0ff`
- Important file paths:
  - `src/engine/exports/exportLessonPlanDocx.ts`
  - `src/engine/package/buildPackageOutputs.ts`
  - `src/engine/package-outputs.test.ts`
  - `src/pages/ResultsPage.tsx`
  - `src/engine/materials/extractCurriculumCoverageCandidates.ts`
  - `src/engine/materials/analyzeMaterial.ts`
  - `src/engine/analysis-signals.test.ts`
  - `src/engine/materials/extractTextFromFile.ts`
  - `src/engine/blueprint/resolveBlueprintContent.ts`
  - `src/engine/blueprint/buildBlueprint.ts`
  - `src/engine/blueprint/buildBlueprintSourceReadiness.ts`
- Commands actually used in this chat included:
  - `git branch --show-current`
  - `git rev-parse --short HEAD`
  - `git status --short`
  - `git diff -- ...`
  - `git show --stat --oneline <sha>`
  - `git push`
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`

## Risks / cautions

- Do not treat summaries or Codex-only output as truth over the canonical local repo/GitHub branch.
- Do not revive donor branches or old shells wholesale.
- Do not delete rescue refs/tags yet.
- Do not broaden the next step into PPTX/ZIP/export redesign.
- Do not mix unrelated cleanup into donor harvest.
- Passing tests alone are not enough; verify the exact seam actually landed.
- Behavior lineage matters more than path lineage when comparing donor code to canonical engine seams.
- Keep deterministic engine logic authoritative; UI explains decisions but should not become ranking/authority logic.
- I can also use Codex, but only if it stays aligned to canonical truth and pushes are reflected in the canonical branch.

## Next action

Start the next chat by confirming canonical truth at `0497731`, then perform an inspect-only donor-harvest seam 2 comparison across `rescue-005017e`, `rescue-d657aa3`, and optional tiny salvage from `rescue-400a0ff`, focusing on one curriculum/extraction engine seam only and making no edits until that inspection is complete.