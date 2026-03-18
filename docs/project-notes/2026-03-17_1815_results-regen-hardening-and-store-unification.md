# lesson-generator8 — Results regen hardening, chunk split, and Materials/store unification handoff

Date: 2026-03-17

Repo: jodiwankenobi8-arch/lesson-generator8

## Chat purpose

Continue from the prior handoff, validate and harden the Results-page regeneration flow, reduce manual QA burden with targeted automation, do a first performance/chunking pass, and choose the best next continuation point based on the actual repo state.

## Canonical project assumptions

- Canonical local repo used in this chat: `C:\Users\jodiw\Desktop\lesson-generator8-local`
- Product flow: Inputs ? Materials ? Results
- Product rule: curriculum = content authority; exemplar = presentation authority
- Store-driven lesson generation is the intended source of truth
- UI should explain and trigger generation behavior, not own parallel business logic
- Use beginner-safe PowerShell steps, inspect first, one clean seam at a time, verify immediately

## What was reviewed

### code files
- `src/state/useLessonStore.ts`
- `src/pages/ResultsPage.tsx`
- `src/pages/MaterialsPage.tsx`
- `src/engine/generateLesson.ts`
- `src/engine/materials/extractTextFromFile.ts`
- `src/engine/materials/extractPdfOcr.ts`
- `src/engine/package-decisions.test.ts`
- `src/engine/types.ts`
- `vite.config.ts`
- `package.json`

### commits
- `c6f05f0` — feat: wire store-driven lesson regeneration from results decisions
- `ea14aaa` — test: cover store-driven regeneration decisions
- `72e74bf` — build: split extraction libraries into manual chunks
- `bab9e50` — refactor: route materials generation through lesson store

### PRs
- None reviewed in this chat

### issues
- None reviewed in this chat

### terminal output
- `git status`
- `git log --oneline -n 3`
- `npm run typecheck`
- `npm run build`
- `npm run test:engine`
- `npm run test`
- Vite build chunk output before and after manual chunking
- Git commit and push output for `ea14aaa`, `72e74bf`, and `bab9e50`

### pasted notes
- Long pasted LESSON-GENERATOR8 handoff in chat
- Prior attached handoff DOCX used as supplemental operating context

### other evidence actually used
- The current local checkout did not contain Playwright setup (`playwright.config.ts`, local `@playwright/test`, local Playwright binary all absent)
- Existing Vitest suite and repo scripts in `package.json`

## Current state

- Branch used in this chat: `main`
- Remote was pushed successfully through `bab9e50`
- Full Vitest suite reached **77 passed**
- Store-level regeneration coverage exists for:
  - centers
  - small group
  - intervention
- First manual chunking pass is in place in `vite.config.ts`
- Chunk split result produced clearer feature chunks:
  - `app-vendor`
  - `pdf`
  - `office`
  - `ocr`
- Materials generation path was unified to the store-driven path
- Results regeneration path was treated as the important validated seam
- Remaining large bundles are concentrated in document-processing features, especially PDF / office extraction
- A narrow Materials trust / extraction visibility UI pass was proposed but not verified or completed in this chat

## Decisions made

- Do not pursue Playwright in this checkout; use Vitest because Playwright is not actually present locally
- Reduce manual QA by adding focused store-level regeneration tests instead of broad browser clicking
- Treat store-driven generation as the canonical runtime path
- Unify Materials generation behavior with the store-driven path instead of preserving a parallel engine path
- Do a first performance pass via Vite manual chunking instead of deeper refactors first
- Defer broader UI polish and second-pass performance work until after the core regeneration seam and runtime-path cleanup were in a better state
- Best next feature/UI priority after these fixes: narrow Materials trust / extraction visibility pass

## Completed work

- Added and committed store-level regeneration tests in `src/state/useLessonStore.test.ts`
- Verified full suite green at 77 tests after those additions
- Added and committed manual chunking in `vite.config.ts`
- Verified build still passed after chunk split
- Found and removed a path inconsistency where `MaterialsPage.tsx` was using a parallel generate path
- Changed Materials generation to use the lesson-store generation path and pushed that cleanup
- Confirmed remote pushes for:
  - `ea14aaa`
  - `72e74bf`
  - `bab9e50`

## Remaining work

- Materials trust / extraction visibility UI pass is still unfinished
- Browser-only Results UX details are still lighter-coverage than the store seam:
  - temporary regeneration notice rendering
  - button disable / re-enable timing
  - visible error-state behavior
- Remaining chunk-size warnings still exist for heavy feature chunks, especially PDF / office parsing
- Need a fresh post-`bab9e50` verification pass with:
  - `npm run typecheck`
  - `npm run build`
  - `npm run test`
- If the attempted Materials trust UI edit was applied locally but not verified, inspect current working tree first before stacking more edits

## Next steps

1. Reconfirm the live repo after `bab9e50` with:
   - `git status`
   - `git log --oneline -n 5`
   - `npm run typecheck`
   - `npm run build`
   - `npm run test`
2. Inspect `src/pages/MaterialsPage.tsx` before editing again
3. Land the narrow Materials trust / extraction visibility pass:
   - per-file influence label
   - clearer use-status label
   - short extraction preview
4. Re-run:
   - `npm run typecheck`
   - `npm run build`
   - `npm run test`
5. Only after that, decide whether to:
   - commit/push the Materials trust pass, or
   - do a second-pass performance split for `pdf` / `office`

## Important evidence

### file paths
- `src/state/useLessonStore.ts`
- `src/state/useLessonStore.test.ts`
- `src/pages/ResultsPage.tsx`
- `src/pages/MaterialsPage.tsx`
- `src/engine/generateLesson.ts`
- `src/engine/materials/extractTextFromFile.ts`
- `src/engine/materials/extractPdfOcr.ts`
- `src/engine/package-decisions.test.ts`
- `src/engine/types.ts`
- `vite.config.ts`
- `package.json`

### SHAs
- `c6f05f0`
- `ea14aaa`
- `72e74bf`
- `bab9e50`

### PRs / issues
- No PRs or issues were reviewed or cited in this chat

### commands actually mentioned
- `git status`
- `git log --oneline -n 3`
- `git log --oneline -n 5`
- `git add src/state/useLessonStore.test.ts`
- `git commit -m "test: cover store-driven regeneration decisions"`
- `git commit -m "build: split extraction libraries into manual chunks"`
- `git commit -m "refactor: route materials generation through lesson store"`
- `git push`
- `npm run typecheck`
- `npm run build`
- `npm run test:engine`
- `npm run test`

## Risks / cautions

- Do not revive Playwright assumptions unless the live repo actually has Playwright configured
- Do not reintroduce parallel generation paths; behavior lineage matters more than path lineage here
- Keep Materials and Results on the same store-driven generation seam
- Do not bypass the store with direct UI-owned generation logic
- Do not claim repo-wide review; only the files and seams listed above were actually inspected in this chat
- Remaining PDF / office chunk warnings are not zero, so do not overstate performance completion
- Re-run verification before continuing because the latest pushed cleanup (`bab9e50`) was validated in-chat mainly via the test suite output shown after the edit

## Next action

Start the next chat by verifying the repo at `bab9e50` and then implement the narrow Materials trust / extraction visibility pass in `src/pages/MaterialsPage.tsx` without redesigning the page or reintroducing a parallel generation path.
