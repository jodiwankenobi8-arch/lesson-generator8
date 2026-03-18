# Lesson Generator 8 origin/main branch and architecture handoff

- Date: 2026-03-17 18:23 -04:00
- Repo: jodiwankenobi8-arch/lesson-generator8
- Chat purpose: Reconnect local, GitHub, and chat context; verify branch state; preserve divergent local work safely; inspect current origin/main architecture; create a continuation-ready handoff.

## Canonical project assumptions

- The product is a teacher-facing lesson package generator.
- Primary flow is Inputs -> Materials -> Results.
- Curriculum is the content authority.
- Exemplar is the presentation authority.
- Generation is a deterministic pipeline.
- Current mainline orchestration lives in the store rather than legacy workflow helpers.
- For this handoff, the clean analysis anchor is inspect/origin-main at 5aad9c2.
- Preserved divergent local history exists at main and ackup/local-main-83b32d8, both pointing to 83b32d8.

## What was reviewed

- Code files:
  - package.json
  - src/App.tsx
  - src/state/useLessonStore.ts
  - src/engine/pipeline/runLessonPipeline.ts
- Commits:
  - local 83b32d8
  - origin/main 5aad9c2
  - recent origin/main commits visible in terminal history, including ec4e1e6, e2a0b88, 8ba54d7, 1465ab1
- Terminal output:
  - git status
  - git branch --show-current
  - git remote -v
  - ssh -T git@github.com
  - git fetch origin --prune
  - git rev-list --left-right --count origin/main...HEAD
  - git branch -vv
  - git log --oneline --graph --decorate --left-right --boundary HEAD...origin/main
  - Get-ChildItem src -Recurse -File
  - Get-Content package.json
  - Get-Content src\App.tsx
  - Get-Content src\state\useLessonStore.ts
  - Get-Content src\engine\pipeline\runLessonPipeline.ts
- Pasted notes:
  - user-supplied current-state rules and preferences
  - attached updated handoff file used as context, then superseded where live repo state disagreed
- Other evidence actually used:
  - GitHub SSH key setup confirmation via terminal and screenshot

## Current state

- Current working branch is inspect/origin-main.
- inspect/origin-main is clean and up to date with origin/main.
- inspect/origin-main HEAD is 5aad9c2 (efactor: remove legacy lesson orchestration helpers).
- main still exists locally at 83b32d8 (Checkpoint latest stabilized lesson generator work).
- Local-only checkpoint was preserved on branch ackup/local-main-83b32d8 and tag ackup-local-main-83b32d8.
- Before preservation/switching, local main was ahead 1 and behind 41 relative to origin/main.
- GitHub remote is now SSH:
  - git@github.com:jodiwankenobi8-arch/lesson-generator8.git
- SSH authentication succeeded:
  - Hi jodiwankenobi8-arch! You've successfully authenticated, but GitHub does not provide shell access.
- Current mainline architecture observed in code:
  - React + TypeScript + Vite + React Router + Zustand app shell
  - routes: /inputs, /materials, /results
  - results route is gated by store readiness
  - useLessonStore.ts owns inputs, materials, selected mode, blueprint, planning ideas, lesson spec, lesson package, lesson trace, missing-area decisions
  - useLessonStore.ts also owns processMaterial() and generateLesson()
  - unLessonPipeline() composes uildBlueprint(), uildLessonPlanningIdeas(), uildLessonSpec(), and uildLessonPackage(), then returns trace metadata
- The live source tree still contains debt markers:
  - .bak files under src/
  - .broken page copy
  - _old/ directory at repo root

## Decisions made

- Use live local repo state and terminal output as source of truth over stale prior handoff anchors.
- Preserve the divergent local-only checkpoint before any reconciliation.
- Analyze current mainline from a clean tracking branch instead of from divergent local main.
- Do not blindly git pull, merge, ebase, eset, or force-push.
- Treat SSH/agent problems as environment issues, not code issues.
- Treat inspect/origin-main @ 5aad9c2 as the main analysis base for continuation unless a newer verified state is provided.

## Completed work

- Confirmed the repo was clean locally.
- Confirmed local main had diverged from origin/main.
- Generated and added an SSH key to GitHub.
- Switched origin from HTTPS to SSH.
- Verified SSH authentication to GitHub.
- Fetched remote refs and discovered current remote branch map.
- Created ackup/local-main-83b32d8.
- Created tag ackup-local-main-83b32d8.
- Created and switched to inspect/origin-main tracking origin/main.
- Verified inspect/origin-main is clean and at 5aad9c2.
- Reviewed key runtime files and summarized current mainline architecture.

## Remaining work

- Decide whether the preserved local-only checkpoint at 83b32d8 should be dropped, cherry-picked, reimplemented, or compared more deeply against current mainline.
- Perform a deeper review of InputsPage.tsx, MaterialsPage.tsx, and ResultsPage.tsx on current mainline if product/UX analysis is needed.
- Review additional engine modules if a full subsystem audit is required:
  - blueprint selection/readiness
  - material analysis/reliability
  - package outputs/readiness
  - slides subsystem
- Reduce repo cleanup debt:
  - .bak files in src/
  - .broken copy in src/pages/
  - _old/
- Watch store size/complexity in src/state/useLessonStore.ts as orchestration continues to consolidate there.

## Next steps

1. Stay on inspect/origin-main for all continuation analysis unless there is an explicit reason to revisit divergent local main.
2. Inspect current mainline page implementations:
   - src/pages/InputsPage.tsx
   - src/pages/MaterialsPage.tsx
   - src/pages/ResultsPage.tsx
3. Inspect deeper engine behavior only as needed for the next concrete task:
   - src/engine/blueprint/*
   - src/engine/analysis/runMaterialAnalysis.ts
   - src/engine/materials/extractTextFromFile.ts
   - src/engine/package/*
4. Decide what to do with preserved local checkpoint 83b32d8 only after comparing its behavior/value to current mainline.
5. Keep future changes tightly scoped and report exact files changed, exact diff summary, allowed-files confirmation, exact final diff, and verification results after each task.

## Important evidence

- Branches / refs:
  - inspect/origin-main
  - main
  - ackup/local-main-83b32d8
  - ackup-local-main-83b32d8
  - origin/main
  - origin/feat/apple-orchard-visual-polish
  - origin/feat/hardened-pass5-runtime-and-polish
  - origin/feat/hardened-pass5-runtime-and-polish-fastfix
  - origin/feat/hardened-pass5-runtime-and-polish-fastfix-phase1-reconcile
  - origin/feat/hardened-pass5-runtime-and-polish-fastfix-phase1-reconcile-phase2-context
  - origin/feat/hardened-pass5-runtime-and-polish-fastfix-phase1-reconcile-phase2-context-phase3-split
  - origin/feat/hardened-pass5-runtime-and-polish-fastfix-phase1-reconcile-phase2-context-phase3-split-phase4-qa
  - origin/feat/orchard-inputs-materials-preview-polish
  - origin/hardened-pass5
  - tag phase1-closure-checkpoint
- SHAs:
  - 5aad9c2 efactor: remove legacy lesson orchestration helpers
  - ec4e1e6 efactor: move materials workflow orchestration into lesson store
  - e2a0b88 chore: make win32 rolldown binding optional
  - 8ba54d7 eat: improve results regeneration feedback
  - 1465ab1 efactor: make lesson shape automatic-first in inputs
  - 83b32d8 Checkpoint latest stabilized lesson generator work
  - 951160 Add OCR candidate extraction tests
- File paths reviewed:
  - package.json
  - src/App.tsx
  - src/state/useLessonStore.ts
  - src/engine/pipeline/runLessonPipeline.ts
- Commands actually used:
  - git status
  - git branch --show-current
  - git remote set-url origin git@github.com:jodiwankenobi8-arch/lesson-generator8.git
  - git remote -v
  - ssh -T git@github.com
  - git fetch origin --prune
  - git rev-list --left-right --count origin/main...HEAD
  - git branch -vv
  - git log --oneline --graph --decorate --left-right --boundary HEAD...origin/main
  - Get-ChildItem src -Recurse -File
  - Get-Content package.json
  - Get-Content src\App.tsx
  - Get-Content src\state\useLessonStore.ts
  - Get-Content src\engine\pipeline\runLessonPipeline.ts

## Risks / cautions

- Do not delete or overwrite:
  - main @ 83b32d8
  - ackup/local-main-83b32d8
  - ackup-local-main-83b32d8
  until the preserved checkpoint has been intentionally evaluated.
- Do not assume older handoff claims are still current if they conflict with live repo state.
- Do not revive removed legacy workflow helpers without checking why 5aad9c2 and ec4e1e6 removed them.
- Do not treat SSH/service issues as application code defects.
- Do not perform reconciliation on main with blind pull, merge, ebase, eset, or force-push steps.

## Next action

Continue from inspect/origin-main @ 5aad9c2 and perform the next analysis pass on the current mainline UI/runtime seam by reviewing src/pages/InputsPage.tsx, src/pages/MaterialsPage.tsx, and src/pages/ResultsPage.tsx, then decide whether any preserved behavior from main @ 83b32d8 is still needed.
