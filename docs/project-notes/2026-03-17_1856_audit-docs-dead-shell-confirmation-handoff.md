# Lesson Generator 8 - Audit/Docs/Dead-Shell Confirmation Handoff

* Date: 2026-03-15
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: continue the current hardening/completion phase, lock in a PowerShell-first workflow, add audit/documentation safeguards, validate local state, and confirm whether any dead shell/router artifacts still exist.

## Canonical project assumptions

- Local files and local terminal output are the source of truth for active work.
- Windows is the operating environment.
- PowerShell is the command shell to use.
- The active app flow is Inputs -> Materials -> Results.
- `useLessonStore` is the orchestration seam.
- Curriculum = content authority.
- Exemplar = presentation authority.
- Pages should not bypass store-owned orchestration.
- Release hardening, trust contract integrity, and exports/package follow-through matter more than visual redesign.

## What was reviewed

- code files:
  - `scripts/Find-LegacyShellReferences.ps1`
  - `docs/STORE_SEAM_NOTE.md`
  - `PROJECT_CURRENT_STATE.md`
- commits:
  - `8b6f423`
  - `525c4b8`
  - `67a91d3`
- PRs:
  - no PR content was reviewed; only the PR creation URL was printed
- issues:
  - none
- terminal output:
  - branch/status output
  - audit script output
  - `npm install`
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - targeted filesystem/search inspection under `src`
- pasted notes:
  - March 15 master/canonical handoff files and workflow pack were used earlier in the chat as context
- other evidence actually used:
  - local search results showing no live shell/router references
  - local confirmation that `src/app` does not exist

## Current state

- Branch in use: `work/import-graph-cleanup-audit`.
- A no-behavior-change audit/docs pass was completed and pushed.
- The repo now contains:
  - `scripts/Find-LegacyShellReferences.ps1`
  - `docs/STORE_SEAM_NOTE.md`
  - `PROJECT_CURRENT_STATE.md`
- Local validation was completed successfully:
  - import-graph audit passed
  - typecheck passed
  - tests passed
  - build passed
- Dead-shell inspection was completed:
  - `src/app` does not exist
  - no live references were found for `BlueprintPage`, `ResultsHubPage`, `AppRouter`, `src/app`, `./app/AppRouter`, or `../app/AppRouter`
  - no shell/router deletions are required from current local truth
- The next hardening area identified in-chat is export/package follow-through.

## Decisions made

- Treat local repo state and local terminal output as the authoritative source of truth.
- Use PowerShell only for execution steps in this workflow.
- Keep `useLessonStore` as the orchestration seam and do not allow page-level engine orchestration bypasses.
- Do not revive or hunt for dead shell/router paths if local inspection shows they no longer exist.
- Record project state in `PROJECT_CURRENT_STATE.md` and keep it aligned with what was actually validated locally.
- Move next toward export/package follow-through rather than continuing shell cleanup.

## Completed work

- Added a repeatable import-graph audit script.
- Added a store seam note documenting the supported orchestration seam.
- Added a canonical current-state file in the repo.
- Installed local npm dependencies.
- Ran and passed:
  - `.\scripts\Find-LegacyShellReferences.ps1`
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
- Added a validation snapshot to `PROJECT_CURRENT_STATE.md`.
- Confirmed no dead shell/router path remains in the current local source of truth.
- Pushed branch updates to GitHub.

## Remaining work

- Export/package follow-through remains the next major hardening target.
- Build still reports large chunk warnings.
- Tests still report non-blocking `useLayoutEffect` SSR-style warnings in integration output.
- Dependency audit warnings from `npm install` remain for a later maintenance pass.
- Branch merge status into `main` was not verified in this chat.

## Next steps

1. Check whether `work/import-graph-cleanup-audit` has been merged or still needs a PR merge.
2. Inspect actual export/package files and tests from local repo state.
3. Run focused export/package tests and identify the next smallest safe hardening change.
4. Update `PROJECT_CURRENT_STATE.md` after each validated step so local truth stays aligned with GitHub work.
5. Continue using short PowerShell-only pastes rather than manual editing.

## Important evidence

- Branch:
  - `work/import-graph-cleanup-audit`
- SHAs:
  - `8b6f423` - `chore: add import-graph audit and store seam note`
  - `525c4b8` - `docs: record validation snapshot in current state`
  - `67a91d3` - `docs: record dead shell confirmation in current state`
- Files added/used:
  - `scripts/Find-LegacyShellReferences.ps1`
  - `docs/STORE_SEAM_NOTE.md`
  - `PROJECT_CURRENT_STATE.md`
- Commands actually run/mentioned:
  - `git branch --show-current`
  - `git status`
  - `.\scripts\Find-LegacyShellReferences.ps1`
  - `npm install`
  - `npm run typecheck`
  - `npm run test`
  - `npm run build`
  - `Get-ChildItem ".\src\app" -Recurse`
  - `Get-ChildItem ".\src" -Recurse -File -Include *.ts,*.tsx`
  - `Select-String -Pattern "BlueprintPage|ResultsHubPage|AppRouter|src/app|./app/AppRouter|../app/AppRouter"`
- PR URL printed:
  - `https://github.com/jodiwankenobi8-arch/lesson-generator8/pull/new/work/import-graph-cleanup-audit`

## Risks / cautions

- Do not reintroduce page-level imports of engine orchestration helpers when `useLessonStore` is the supported seam.
- Do not assume old shell/router artifacts still exist; the local inspection in this chat found none.
- Do not treat Codex environment branch/path mismatches as authoritative over local terminal truth.
- Do not claim repo-wide review or full merge status verification from this chat; that was not completed.
- Do not prioritize cosmetic redesign ahead of hardening/export/package work.

## Next action

Start the next chat by checking whether `work/import-graph-cleanup-audit` is already merged, then inspect export/package follow-through from the local repo and choose the next smallest safe PowerShell-driven hardening step.
