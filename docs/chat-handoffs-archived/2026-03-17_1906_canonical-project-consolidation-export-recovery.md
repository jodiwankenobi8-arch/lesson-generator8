# lesson-generator8 canonical project consolidation and export recovery handoff

* Date: March 17, 2026
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: determine the safest path for consolidating prior work from divergent branch/history lines into one canonical project, confirm what was already merged versus still only historical/donor material, and define the next continuation-ready plan focused on truthful exports and streamlined maintenance.

## Canonical project assumptions

- The canonical live project should remain the current hardened repo line, not an older branch/history line.
- The active product flow is Inputs -> Materials -> Results.
- `useLessonStore` is the orchestration seam for the live project.
- Older branches should be treated as donor/reference sources, not wholesale merge targets.
- Export/package follow-through is a confirmed remaining gap in the canonical project.
- Local repo state and current checked files are the source of truth when they conflict with older notes or branch history.

## What was reviewed

- code files:
  - `src/engine/types.ts`
  - `src/engine/package/buildPackageOutputs.ts`
  - `src/engine/package-outputs.test.ts`
  - `src/pages/ResultsPage.tsx`
  - donor-branch files from older export flow:
    - `src/engine/exports/exportSlidesPptx.ts`
    - `src/engine/exports/exportLessonPlanDocx.ts`
    - `src/engine/exports/exportFullZip.ts`
    - `src/pages/ResultsHubPage.tsx`
    - `e2e/smoke.spec.ts`
- commits:
  - local graph and specific SHAs surfaced during branch/history review
- PRs:
  - PR #1
  - PR #3
  - PR #4
  - PR #5
- issues:
  - none specifically reviewed in this chat
- terminal output:
  - local PowerShell/git status, branch, graph, branch audit, donor-branch inventory, export seam inspection
- pasted notes:
  - uploaded March 15 analysis/SOP docs
  - chat-generated continuation and consolidation notes
- other evidence actually used:
  - recovered donor-branch file listings
  - grep/search results from donor branches
  - temporary recovery files under `tmp/`

## Current state

- Current local canonical branch created in this chat: `work/canonical-project-consolidation`.
- Current hardened line is already the working base; local work branches were already merged into `main`.
- Several remote branches were found but showed no merge base against current `main`, indicating divergent history rather than normal unmerged feature work.
- Current export contract in the live project is still placeholder-only:
  - `ExportArtifactStatus = "placeholder"`
  - `buildPackageOutputs.ts` still emits placeholder export artifacts
  - `ResultsPage.tsx` currently renders exports through a generic list while also containing an unused/sidelined export-specific section that states export generation is not fully implemented
- Donor branches contain older real export behavior and modules, including PPTX/DOCX/ZIP export helpers and download-trigger tests.
- Canonical consolidation inventory is saved under `tmp/consolidation`.
- Recovered old export source files are saved under `tmp/recovered-export-source`.

## Decisions made

- Keep exactly one live project going forward: the current hardened repo line on the canonical consolidation branch.
- Do not merge divergent historical branches wholesale into the canonical project.
- Treat older branches as donor shelves only.
- Recover only proven high-value seams from donor branches.
- Prioritize export recovery first because exports are the clearest remaining honesty/contract gap.
- Keep export truth anchored in engine/package contracts rather than reviving the old ResultsHub shell as the active architecture.
- Preserve cleanliness and streamlining as explicit goals: one maintained project, fewer parallel structures, no unnecessary revival of old shells or legacy app paths.

## Completed work

- Confirmed local baseline could be restored cleanly after a failed patch attempt.
- Verified baseline typecheck, test, and build all passed on the clean branch state.
- Confirmed current export seam in live code:
  - placeholder-only export status
  - placeholder-only export artifacts
  - export UI not fully wired
- Fetched remote branches and compared merged versus non-merged branch status.
- Identified that key remote branches are on divergent history lines with no merge base to current `main`.
- Created local donor tracking branches:
  - `recover/runtime-phase4`
  - `recover/orchard-polish`
- Inventoried donor branches and located the old export modules and export-trigger behavior.
- Recovered old export source into:
  - `tmp/recovered-export-source/exportSlidesPptx.old.ts`
  - `tmp/recovered-export-source/exportLessonPlanDocx.old.ts`
  - `tmp/recovered-export-source/exportFullZip.old.ts`
  - `tmp/recovered-export-source/ResultsHubPage.old.tsx`
  - `tmp/recovered-export-source/smoke.old.spec.ts`
  - `tmp/recovered-export-source/package.old.json`
- Created consolidation inventory files under `tmp/consolidation`.
- Wrote a high-level canonical-project strategy in chat and produced handoff documents for continuation.

## Remaining work

- Port the export seam into the canonical project without reviving the old app shell.
- Replace placeholder-only export lifecycle with a truthful lifecycle in the canonical project.
- Add one real downloadable export path derived from current lesson package truth.
- Decide whether to keep recovery at text/plain first or reintroduce native PPTX/DOCX/ZIP in stages.
- Reconcile donor export behavior with the current `ResultsPage`/package/store architecture.
- Port or rewrite export tests appropriate to the current tree structure.
- Continue cleanup/streamlining review so only one maintained project remains active.
- Decide which extraction/runtime improvements from donor branches truly belong in the canonical project.
- Clean/archive low-value historical clutter without deleting donor references that still matter.

## Next steps

1. Keep working only on `work/canonical-project-consolidation`.
2. Treat current hardened repo as the only live product base.
3. Port exports into the canonical project from donor material one seam at a time.
4. Start with a minimal honest export lifecycle in the current engine/package contracts.
5. Add one real download path from current package outputs.
6. Update the live results UI to use the export-specific surface instead of the generic export list.
7. Run local validation after each change:
   - `npm run typecheck`
   - `npm run test`
   - `npm run build`
8. After exports are honest and working, reassess which donor extraction/runtime improvements are still worth porting.
9. Continue reducing parallel/legacy clutter while keeping donor references available until no longer needed.
10. Update handoff docs again after the first export milestone lands.

## Important evidence

- Branches and refs:
  - `main`
  - `work/export-followthrough-audit`
  - `work/import-graph-cleanup-audit`
  - `work/canonical-project-consolidation`
  - `recover/runtime-phase4`
  - `recover/orchard-polish`
- PRs mentioned:
  - PR #1
  - PR #3
  - PR #4
  - PR #5
- SHAs mentioned in terminal/history review:
  - `67a91d3`
  - `525c4b8`
  - `8b6f423`
  - `38f9f1c`
  - `5aad9c2`
  - `ec4e1e6`
  - `8ba54d7`
  - `c6f05f0`
  - `440edd1`
  - `ee3d52c`
  - `928782e`
  - donor/history SHAs surfaced during branch review:
    - `172e130`
    - `c989bb7`
    - `28f006a`
    - `1f91d8a`
    - `d323385`
    - `a8685c0`
    - `5042452`
    - `2db6eb8`
- Live code files inspected:
  - `src/engine/types.ts`
  - `src/engine/package/buildPackageOutputs.ts`
  - `src/engine/package-outputs.test.ts`
  - `src/pages/ResultsPage.tsx`
- Donor files identified as high-value:
  - `src/engine/exports/exportSlidesPptx.ts`
  - `src/engine/exports/exportLessonPlanDocx.ts`
  - `src/engine/exports/exportFullZip.ts`
  - `src/pages/ResultsHubPage.tsx`
  - `e2e/smoke.spec.ts`
  - `src/extraction/docxExtractor.ts`
  - `src/extraction/extractionService.ts`
  - `src/extraction/pdfExtractorSimple.ts`
  - `src/extraction/pptxExtractor.ts`
- Temporary recovery/inventory paths created in this chat:
  - `tmp/export-followthrough-failed-attempt.patch`
  - `tmp/recovered-export-source/*`
  - `tmp/consolidation/*`
- Commands actually run/mentioned in this chat:
  - `git status --short --branch`
  - `git restore ...`
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - `git fetch --all --prune`
  - `git branch -a`
  - `git branch --merged main`
  - `git branch -r --merged origin/main`
  - `git branch -r --no-merged origin/main`
  - `git log --graph --oneline --decorate --all -40`
  - `git rev-list --left-right --count main...<branch>`
  - `git merge-base main <branch>`
  - `git ls-tree -r --name-only <branch>`
  - `git grep -n -E "export|download|pptx|docx|zip|pdf|extract" <branch> -- .`
  - `git show <branch>:<path> > <file>`
  - `git diff --no-index -- ...`

## Risks / cautions

- Do not try to merge divergent old branches wholesale into the canonical project.
- Do not revive the old ResultsHub shell as the active product architecture.
- Do not import `legacy-src` or parallel app shells into the canonical live project.
- Do not assume older branches are more correct than the current hardened local tree.
- Do not delete donor/recovery files until the needed seams are fully ported or intentionally discarded.
- Do not let export behavior become page-only logic divorced from package/store truth.
- Do not claim repo-wide review beyond what was actually inspected in this chat.
- Be careful with cleanup so historical donor files are archived intentionally, not lost accidentally.

## Next action

Continue in a new chat from `work/canonical-project-consolidation` and implement the first narrow consolidation change: replace placeholder-only exports in the live project with one truthful export lifecycle and one real download path, using recovered donor export files only as reference material and validating locally after each change.
