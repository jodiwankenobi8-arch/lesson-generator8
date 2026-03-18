# Lesson Generator 8 export contract handoff

* Date: 2026-03-16
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue canonical hardening on `work/canonical-project-consolidation`, land export/package follow-through safely, preserve `useLessonStore` as the orchestration seam, and produce a continuation-ready handoff.

## Canonical project assumptions

- Canonical local repo path used in this chat: `C:\Users\jodiw\OneDrive\Desktop\lesson-generator8-local`
- Canonical branch used in this chat: `work/canonical-project-consolidation`
- `useLessonStore` remains the public orchestration seam.
- Live product flow remains Inputs -> Materials -> Results.
- Truth comes from the live repo and terminal validation over stale notes.
- Export/package hardening is a valid near-term seam; broad redesign is not.

## What was reviewed

- code files:
  - `src/engine/types.ts`
  - `src/engine/package/buildPackageOutputs.ts`
  - `src/engine/package-outputs.test.ts`
  - `src/pages/ResultsPage.tsx`
  - `src/pages/ResultsPage.test.tsx`
  - `src/state/useLessonStore.ts`
  - `vite.config.ts`
  - `scripts/Find-LegacyShellReferences.ps1`
  - `scripts/scan-export-content.ps1`
  - `scripts/SCAN_EXPORT_CONTENT_README.txt`
  - `PROJECT_CURRENT_STATE.md`
  - `docs/STORE_SEAM_NOTE.md`
- commits:
  - `b0580bb` lazy-load lesson-plan exporter from results download path
  - `a1f6819` chore: add import-graph audit and store seam note
  - `abe57ac` Add reusable export content regression scan
  - `7842523` align export regression scan with canonical exports
  - `56898ed` test: lock exports against banned hub language
  - `1abe6c3` remove dead ready-only export status
  - `b2839a7` Revert "remove dead ready-only export status"
  - `92ceeab` remove dead ready-only export status
  - `6a2cc18` Revert "remove dead ready-only export status"
  - `8cfa393` remove export artifact ready-only status
- PRs:
  - none referenced or reviewed in this chat
- issues:
  - none referenced or reviewed in this chat
- terminal output:
  - repeated `git status`, `git log`, `git rev-parse`, `git push`
  - repeated `npm run typecheck`
  - repeated `npm run test`
  - repeated `npm run build`
  - import-graph audit output from `.\scripts\Find-LegacyShellReferences.ps1`
- pasted notes:
  - explicit seam-selection notes pasted from terminal during the chat
  - the live `ExportArtifact` snippet pasted at the end showing the field-free shape
- other evidence actually used:
  - uploaded handoff PDF: `Lesson-generator8-handoff-updated-6535258-plan-refresh.pdf`
  - uploaded SOP PDF: `Lesson-generator8-current-sops.pdf`

## Current state

- Canonical branch was advanced and pushed multiple times during this chat.
- Import-graph/store-seam documentation and audit tooling were harvested into canonical.
- Export regression scan tooling was harvested and then aligned with the canonical export targets.
- Regression coverage was added to keep banned hub language out of canonical export content.
- The export artifact ready-only status removal was eventually landed and pushed at `8cfa393`.
- Terminal state at the end showed:
  - `HEAD = 8cfa393`
  - `origin/work/canonical-project-consolidation = 8cfa393`
  - clean working tree
- Build still reports large chunk warnings.
- Integration tests still report non-blocking `useLayoutEffect` SSR-style warnings.

## Decisions made

- Keep `useLessonStore` as the orchestration seam.
- Do not revive dead shell/router architecture.
- Prefer inspect-first, one-seam-at-a-time hardening.
- Treat export/package follow-through as the next valid hardening lane after dead-shell confirmation.
- Add regression protection against banned hub language in export content.
- Remove the ready-only export artifact status from the export contract, but do not touch `MaterialFile.status`.

## Completed work

- Confirmed dead shell/router path was no longer on the live import graph.
- Landed import-graph audit tooling and store-seam note into canonical.
- Landed reusable export content regression scan tooling.
- Aligned export regression scan with canonical export targets:
  - `*-lesson-plan-export.docx`
  - `*-slides-export.txt`
  - `*-printables-export.txt`
- Added regression test coverage to keep banned hub language out of canonical exports.
- Landed export artifact ready-only status removal in canonical at `8cfa393`.
- Verified successful passes for:
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`

## Remaining work

- Inspect whether the leftover `ExportArtifactStatus` alias in `src/engine/types.ts` is now dead and removable, since the live `ExportArtifact` shape shown in chat no longer includes the field.
- Keep export contract cleanup narrowly scoped; do not drift into material lifecycle changes.
- Large Vite chunk warnings remain for a later, separate seam.
- Non-blocking SSR-style warning noise in integration tests remains for later cleanup.
- Dependency audit / vulnerability follow-up remains deferred.

## Next steps

1. Reconfirm canonical repo state:
   - `git branch --show-current`
   - `git rev-parse --short HEAD`
   - `git rev-parse --short origin/work/canonical-project-consolidation`
   - `git status --short`
2. Inspect the live export contract boundary only:
   - `src/engine/types.ts`
   - `src/engine/package/buildPackageOutputs.ts`
   - `src/engine/package-outputs.test.ts`
   - `src/pages/ResultsPage.test.tsx`
3. Search specifically for:
   - `ExportArtifactStatus`
   - `status: ExportArtifactStatus`
   - export-artifact-only uses of `status: "ready"`
4. If the alias is truly orphaned, remove only that alias and reverify.
5. Run:
   - `npm run typecheck`
   - `npm run test`
   - `npm run build`
6. Commit and push only if the seam is clean and still isolated.

## Important evidence

- Repo path:
  - `C:\Users\jodiw\OneDrive\Desktop\lesson-generator8-local`
- Branch:
  - `work/canonical-project-consolidation`
- SHAs explicitly used in this chat:
  - `b0580bb`
  - `a1f6819`
  - `abe57ac`
  - `7842523`
  - `56898ed`
  - `1abe6c3`
  - `b2839a7`
  - `92ceeab`
  - `6a2cc18`
  - `8cfa393`
- Files explicitly inspected:
  - `src/engine/types.ts`
  - `src/engine/package/buildPackageOutputs.ts`
  - `src/engine/package-outputs.test.ts`
  - `src/pages/ResultsPage.tsx`
  - `src/pages/ResultsPage.test.tsx`
  - `src/state/useLessonStore.ts`
  - `vite.config.ts`
  - `scripts/Find-LegacyShellReferences.ps1`
  - `scripts/scan-export-content.ps1`
  - `scripts/SCAN_EXPORT_CONTENT_README.txt`
  - `PROJECT_CURRENT_STATE.md`
  - `docs/STORE_SEAM_NOTE.md`
- Commands explicitly used:
  - `git branch --show-current`
  - `git rev-parse --short HEAD`
  - `git rev-parse --short origin/work/canonical-project-consolidation`
  - `git status --short`
  - `git log --oneline -6`
  - `git fetch origin`
  - `git cherry-pick`
  - `git revert --no-edit`
  - `git commit -m "..."`
  - `git push origin work/canonical-project-consolidation`
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - `.\scripts\Find-LegacyShellReferences.ps1`
  - `powershell -ExecutionPolicy Bypass -File .\scripts\scan-export-content.ps1 ...`

## Risks / cautions

- Do not confuse `ExportArtifact` cleanup with `MaterialFile.status`.
- Do not revive old shell/router paths or bypass `useLessonStore`.
- Do not broaden a type-boundary seam into export redesign or store rewrite.
- Do not claim repo-wide review beyond the files and terminal evidence actually inspected here.
- Keep donor harvest logic separate from canonical cleanup logic.

## Next action

Continue from `8cfa393` on `work/canonical-project-consolidation` by inspecting whether the remaining `ExportArtifactStatus` alias in `src/engine/types.ts` is now orphaned and can be removed safely without touching `MaterialFile.status` or widening scope.