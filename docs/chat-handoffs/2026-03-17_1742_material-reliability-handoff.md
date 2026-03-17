# lesson-generator8 Material Reliability Handoff

- Date: 2026-03-17
- Repo: jodiwankenobi8-arch/lesson-generator8
- Chat purpose: reconcile the real local repo state against the memorialization plans, confirm the current Material Reliability hardening work, and prepare the next continuation point.

## Canonical project assumptions
- Canonical local repo is `C:\Users\jodiw\Desktop\lesson-generator8-local`.
- Do not continue from the older OneDrive repo copy.
- Local repo files are code truth; uploaded memorialization docs are roadmap context.
- Project is already in the hardening phase, not the early mock-replacement phase.
- Curriculum = content authority.
- Exemplar = presentation authority.
- Parser-first extraction with bounded OCR fallback remains the intended trust model.
- AI must not replace deterministic extraction, blueprint orchestration, reliability gating, or trust surfaces.

## What was reviewed
- code files:
  - `README.md`
  - `package.json`
  - `src/engine/materials/analyzeMaterial.ts`
  - `src/engine/analysis/runMaterialAnalysis.ts`
  - `src/engine/blueprint/buildBlueprint.ts`
  - `src/engine/types.ts`
  - `src/engine/material-reliability.test.ts`
  - `src/engine/analysis-and-blueprint.test.ts`
  - `src/pages/MaterialsPage.tsx`
  - `src/pages/ResultsPage.tsx`
  - `src/state/useLessonStore.ts`
- terminal output:
  - `git branch --show-current`
  - `git rev-parse --short HEAD`
  - `git status --short`
  - `npm run typecheck`
  - `npm run test`
  - `npm run test:engine`
  - `npm run build`
  - repo-wide grep scans for reliability, trace, materials UI, and store seams
- pasted notes:
  - milestone roadmap / strict execution checklist
  - memorialization-plan continuation instructions
  - local repo verification output
- other evidence actually used:
  - current branch `main`
  - current HEAD short SHA `c4aef48`

## Current state
- `README.md` was rewritten to describe the hardening phase and the real current direction.
- `package.json` currently uses `"name": "lesson-generator8"`.
- Material Reliability types and scoring are present in `src/engine/types.ts` and `src/engine/materials/analyzeMaterial.ts`.
- `runMaterialAnalysis` was updated to accept and pass `extractionMetadata`.
- `buildBlueprint` now ranks by reliability first, then signal strength, and gates curriculum by `usableForContent` and exemplar by `usableForStructure`.
- New reliability tests were added in `src/engine/material-reliability.test.ts`.
- Expanded blueprint tests were added in `src/engine/analysis-and-blueprint.test.ts` to cover cleaner-vs-noisier source preference.
- `MaterialsPage.tsx` already shows extraction trace details such as method, quality, OCR candidate, confidence, OCR reason, and notes.
- `ResultsPage.tsx` already shows source readiness, warnings, traceability, and pipeline trace sections.
- The local repo still has uncommitted working-tree changes.

## Decisions made
- The local desktop repo is the only continuation repo for this work.
- The next work stays inside Material Reliability; do not jump ahead to later milestones yet.
- Before proposing broader features, reconcile roadmap documents against the actual repo state.
- Teacher-facing explanation should cover why a material was used, down-ranked, blocked, or ignored.
- Keep the parser-first, reliability-gated, bounded-OCR approach.

## Completed work
- README truth-alignment was started and reflected in the local repo.
- Package naming was corrected to `lesson-generator8`.
- Reliability seams were identified and partially wired through analysis and blueprint selection.
- Reliability-focused tests were created and reviewed.
- Material UI and result-trace seams were inspected for continuation work.
- Canonical repo location, branch, and SHA were confirmed.

## Remaining work
- Verify whether teacher-facing per-material reliability decisions are fully surfaced, not just extraction metadata and aggregate warnings.
- Confirm end-to-end verification from the canonical local repo after the latest changes.
- Clean up newline / line-ending churn risk in modified TypeScript files.
- Preserve commit hygiene: multiple tracked files are already modified, plus one new test file.
- Do not move to broader source-strength, exports, AI normalization, or OCR expansion until Material Reliability is closed out.

## Next steps
1. Inspect the current diffs in the modified reliability files and normalize line endings if needed.
2. Verify whether `MaterialsPage.tsx` and `ResultsPage.tsx` explicitly show why a material was allowed, cautioned, blocked, used, or ignored.
3. Add only the missing teacher-facing reliability explanation if it is not already complete.
4. Re-run `npm run typecheck`, `npm run test`, and `npm run build` in the canonical local repo.
5. Then commit the reliability hardening work or split the UI explanation into a follow-up commit if needed.

## Important evidence
- Repo path: `C:\Users\jodiw\Desktop\lesson-generator8-local`
- Branch: `main`
- HEAD SHA: `c4aef48`
- Files explicitly reviewed:
  - `README.md`
  - `package.json`
  - `src/engine/materials/analyzeMaterial.ts`
  - `src/engine/analysis/runMaterialAnalysis.ts`
  - `src/engine/blueprint/buildBlueprint.ts`
  - `src/engine/types.ts`
  - `src/engine/material-reliability.test.ts`
  - `src/engine/analysis-and-blueprint.test.ts`
  - `src/pages/MaterialsPage.tsx`
  - `src/pages/ResultsPage.tsx`
  - `src/state/useLessonStore.ts`
- Commands explicitly mentioned:
  - `git branch --show-current`
  - `git rev-parse --short HEAD`
  - `git status --short`
  - `npm run typecheck`
  - `npm run test`
  - `npm run test:engine`
  - `npm run build`
- Current modified/untracked files observed in the local repo:
  - `README.md`
  - `package.json`
  - `src/engine/analysis-and-blueprint.test.ts`
  - `src/engine/analysis/runMaterialAnalysis.ts`
  - `src/engine/blueprint/buildBlueprint.ts`
  - `src/engine/materials/analyzeMaterial.ts`
  - `src/engine/types.ts`
  - `src/engine/material-reliability.test.ts`

## Risks / cautions
- Do not continue from the older OneDrive repo copy.
- Do not bypass reliability gating to jump ahead to AI, export expansion, or broader OCR work.
- Do not paste raw TypeScript directly into PowerShell.
- Preserve encoding and line endings when editing; a prior repair preserved `cp1252` in `src/engine/materials/analyzeMaterial.ts`.
- Do not accidentally commit the broader working tree when saving this handoff.

## Next action
Resume in `C:\Users\jodiw\Desktop\lesson-generator8-local` by inspecting the live diffs for `src/engine/materials/analyzeMaterial.ts`, `src/engine/blueprint/buildBlueprint.ts`, `src/pages/MaterialsPage.tsx`, and `src/pages/ResultsPage.tsx`, then finish or verify the per-material reliability explanation before re-running full verification.
