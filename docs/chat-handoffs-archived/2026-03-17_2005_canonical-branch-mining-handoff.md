# Canonical branch mining handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: continue consolidating useful work into `work/canonical-project-consolidation`, recover and assess rescue branches, and leave a continuation-ready mining plan.

## Canonical project assumptions

- `work/canonical-project-consolidation` is the active canonical working branch in this chat.
- `rescue/orchard-polish-tip` and `rescue/runtime-phase4-tip` were used as mining sources and must not be treated as safely disposable until their remaining useful commits are reviewed.
- Behavior lineage matters more than path lineage when comparing older rescue work to current canonical files.
- Canonical already includes source-readiness coverage support, selected blueprint source ids / explainability, and some store/results-trace hardening, so those areas should not be re-mined blindly.

## What was reviewed

- code files
  - `src/engine/materials/analyzeMaterial.ts`
  - `src/engine/materials/extractCurriculumCoverageCandidates.ts`
  - `src/engine/analysis-signals.test.ts`
  - `src/engine/analysis-and-blueprint.test.ts`
  - `src/engine/blueprint/buildBlueprintSourceReadiness.ts`
  - `src/engine/blueprint/materialSelection.ts`
  - `src/engine/blueprint-selected-sources.test.ts`
  - `src/engine/blueprint-readiness.test.ts`
  - `src/engine/package/buildPackageOutputs.ts`
  - `src/engine/slides/buildSlidePlan.ts`
  - `src/state/useLessonStore.ts`
  - `src/pages/MaterialsPage.tsx`
  - `src/pages/ResultsHubPage.tsx`
  - `src/engine/curriculum/extractCoverageFromCurriculum.ts`
  - `src/engine/generation/slides.ts`
  - `src/utils/lesson-package-adapters.ts`
  - `src/utils/lesson-package-storage.ts`
  - `src/utils/lesson-package-trace.ts`
  - `src/utils/results-trace-summary.ts`
  - `src/types/lesson-package.ts`
- commits
  - canonical commits: `ad6653b`, `d906efc`, `4c28f4f`
  - rescue/runtime-phase4-tip commits reviewed by stat: `aa754c3`, `79d61dc`, `62b9c33`, `145f553`, `09e6abe`, `5e8a3b2`, `d657aa3`, `6465c67`, `400a0ff`, `5042452`
  - rescue/orchard-polish-tip commits reviewed by stat: `176420c`, `3de468c`, `172e130`, `e704421`, `676a407`, `1a83ab4`
  - large rescue checkpoint reviewed by stat only: `131a874`
- PRs
  - none reviewed directly in this chat
- issues
  - none reviewed directly in this chat
- terminal output
  - branch listings
  - range logs versus canonical
  - file diff name-status reports
  - `git show --stat` for candidate commits
  - repeated `npm run test:engine` runs
- pasted notes
  - pasted engine code slices
  - pasted branch mining checklist/report text
  - pasted PowerShell session output
- other evidence actually used
  - `branch-mining-report.txt`
  - `branch-mining-checklist.txt`

## Current state

- Canonical branch head confirmed in chat: `4c28f4f` on `work/canonical-project-consolidation`.
- Engine test suite reached green at `83 passed`.
- Rescue branches were accidentally deleted, then recreated from SHAs and pushed back:
  - `rescue/orchard-polish-tip` -> `73d0a2b`
  - `rescue/runtime-phase4-tip` -> `5042452`
- Current visible branch set after restoration:
  - local: `work/canonical-project-consolidation`, `rescue/orchard-polish-tip`, `rescue/runtime-phase4-tip`
  - remote: `origin/main`, `origin/work/canonical-project-consolidation`, `origin/rescue/orchard-polish-tip`, `origin/rescue/runtime-phase4-tip`
- A concrete mining shortlist was assembled for both rescue branches.
- No repo-wide mining pass was completed; only targeted commit/file inspection happened.

## Decisions made

- Do not delete rescue branches until mining is complete.
- Do not straight-cherry-pick the large checkpoint commits `131a874` or `73d0a2b`.
- Treat the rescue branches as mining sources, not merge targets.
- Prefer behavior-focused extraction into canonical rather than restoring old path structures wholesale.
- Keep using `work/canonical-project-consolidation` as the destination branch.

## Completed work

- Added and pushed canonical engine hardening/tests:
  - `ad6653b` `prefer cleaned curriculum coverage over noisy slide wrappers`
  - `d906efc` `cover balanced source readiness when coverage is strong`
  - `4c28f4f` `cover curriculum-side warnings when only exemplar is strong`
- Restored deleted rescue branches from known SHAs and republished them to origin.
- Built a concrete rescue-branch mining checklist.
- Verified canonical source-readiness related tests and warnings behavior through targeted test additions and green engine test runs.
- Confirmed that some rescue work is already reflected in canonical and should not be re-applied blindly.

## Remaining work

- Mine the shortlisted runtime-phase4 commits into canonical, carefully reconciling with current engine/store/results behavior.
- Mine the shortlisted orchard-polish commits into canonical, focusing on UI behavior and teacher-facing workflow improvements rather than wholesale file replacement.
- Re-check whether LessonPackage storage/trace lineage from runtime rescue still adds value on top of the current canonical store/results trace behavior.
- Re-check whether orchard UI commits depend on broader asset-system or route refactors that should be partially ignored.
- After mining and verification, then delete rescue branches again.

## Next steps

1. Re-run branch comparison commands from canonical to refresh context:
   - `git log --oneline work/canonical-project-consolidation..rescue/runtime-phase4-tip`
   - `git log --oneline work/canonical-project-consolidation..rescue/orchard-polish-tip`
   - `git diff --name-status work/canonical-project-consolidation..rescue/runtime-phase4-tip`
   - `git diff --name-status work/canonical-project-consolidation..rescue/orchard-polish-tip`
2. Start with runtime mining, in this order:
   - `aa754c3`
   - `79d61dc`
   - `62b9c33`
   - `145f553`
   - `09e6abe`
   - `5e8a3b2`
   - `d657aa3`
   - `6465c67`
   - `400a0ff`
   - `5042452`
3. For each runtime commit, compare current canonical equivalents before changing anything:
   - `src/state/useLessonStore.ts`
   - `src/utils/lesson-package-adapters.ts`
   - `src/utils/results-trace-summary.ts`
   - `src/utils/lesson-package-storage.ts`
   - `src/utils/lesson-package-trace.ts`
   - `src/types/lesson-package.ts`
   - `src/engine/curriculum/extractCoverageFromCurriculum.ts`
   - `src/engine/generation/slides.ts`
   - `src/pages/MaterialsPage.tsx`
   - `src/pages/ResultsHubPage.tsx`
4. After each meaningful runtime mining step, run `npm run test:engine`.
5. Then mine orchard/UI commits, in this order:
   - `176420c`
   - `3de468c`
   - `172e130`
   - `e704421`
   - `676a407`
   - `1a83ab4`
6. For orchard work, compare only the currently relevant canonical UI paths first:
   - `src/pages/InputsPage.tsx`
   - `src/pages/MaterialsPage.tsx`
   - `src/pages/ResultsHubPage.tsx`
   - `src/pages/WizardProgress.tsx`
   - `src/pages/orchardUi.ts`
   - `src/styles/theme.css`
7. Once mining is complete and verified, remove rescue branches locally and remotely.

## Important evidence

- Branches
  - `work/canonical-project-consolidation`
  - `rescue/orchard-polish-tip`
  - `rescue/runtime-phase4-tip`
- Canonical SHAs
  - `ad6653b`
  - `d906efc`
  - `4c28f4f`
- Runtime rescue SHAs shortlisted
  - `aa754c3`
  - `79d61dc`
  - `62b9c33`
  - `145f553`
  - `09e6abe`
  - `5e8a3b2`
  - `d657aa3`
  - `6465c67`
  - `400a0ff`
  - `5042452`
- Orchard rescue SHAs shortlisted
  - `176420c`
  - `3de468c`
  - `172e130`
  - `e704421`
  - `676a407`
  - `1a83ab4`
- Do-not-straight-cherry-pick SHAs
  - `131a874`
  - `73d0a2b`
- Commands actually used in chat
  - `git branch --all`
  - `git log --oneline work/canonical-project-consolidation..rescue/orchard-polish-tip`
  - `git log --oneline work/canonical-project-consolidation..rescue/runtime-phase4-tip`
  - `git diff --name-status work/canonical-project-consolidation..rescue/orchard-polish-tip`
  - `git diff --name-status work/canonical-project-consolidation..rescue/runtime-phase4-tip`
  - `git show --stat <sha>`
  - `npm run test:engine`
  - `git branch rescue/orchard-polish-tip 73d0a2b`
  - `git branch rescue/runtime-phase4-tip 5042452`
  - `git push -u origin rescue/orchard-polish-tip`
  - `git push -u origin rescue/runtime-phase4-tip`
- Working notes files created in chat
  - `branch-mining-report.txt`
  - `branch-mining-checklist.txt`

## Risks / cautions

- Do not delete `rescue/orchard-polish-tip` or `rescue/runtime-phase4-tip` again until mining is actually finished.
- Do not revive the old rescue tree layout wholesale; many rescue diffs include path churn, duplicated systems, and legacy copies.
- Do not trust path-based deletions/additions in rescue diffs as a migration plan.
- Do not re-mine source-readiness coverage support, selected source ids, or existing results-trace/store contracts blindly; canonical already absorbed parts of that behavior.
- Do not paste terminal output back into PowerShell as commands; earlier in the chat that caused noisy command-not-found cascades.
- Do not claim repo-wide review; only targeted commit/file inspection happened here.

## Next action

Resume from `work/canonical-project-consolidation` and start mining `rescue/runtime-phase4-tip` commit-by-commit, beginning with `aa754c3`, comparing its current canonical equivalents before making any changes.