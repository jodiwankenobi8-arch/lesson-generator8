# lesson-generator8 repo audit and GitHub access handoff

* Date: 2026-03-17 18:27
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: preserve the verified repo anchor, GitHub access context, partial architecture audit findings, and the safest continuation point for the next chat.

## Canonical project assumptions

- Use inspect/origin-main at 5aad9c2 as the audit branch and source of truth for current mainline behavior.
- Do not confuse current mainline with preserved local main @ 83b32d8.
- Treat repository files as source of truth over docs if they conflict.
- App flow is Inputs -> Materials -> Results.
- Deterministic engine flow is inputs/materials -> blueprint -> planning -> spec -> package.
- src/state/useLessonStore.ts is the current orchestration seam.
- Product rule carried in this chat: curriculum is content authority; exemplar is presentation authority.
- Behavior lineage matters more than legacy path names when docs or older notes mention removed helpers.

## What was reviewed

- code files:
  - package.json
  - src/App.tsx
  - src/state/useLessonStore.ts
  - src/engine/pipeline/runLessonPipeline.ts
  - live repo files through the GitHub connector for current store and reliability-layer confirmation
- commits:
  - local and remote commit history around 83b32d8 and 5aad9c2
  - latest origin/main commit chain shown in terminal output
- PRs:
  - not reviewed in this chat
- issues:
  - not reviewed in this chat
- terminal output:
  - Git status, SSH setup/auth, remote switch to SSH, fetch, branch backup, inspect branch creation, tree listing, and key file dumps
- pasted notes:
  - the initial verified analysis anchor and constraints
- other evidence actually used:
  - attached handoff markdown file
  - screenshot showing the SSH key present in GitHub
  - live GitHub connector access to the selected repo

## Current state

- Local repo path used in this chat: C:\Users\jodiw\OneDrive\Desktop\New folder\lesson-generator8.
- Preserved local branch state:
  - main @ 83b32d8 still exists
  - ackup/local-main-83b32d8 exists
  - ackup-local-main-83b32d8 tag exists
- Current audit branch:
  - inspect/origin-main
  - HEAD = 5aad9c2
  - subject: efactor: remove legacy lesson orchestration helpers
  - working tree: clean
- origin/main was fetched successfully over SSH after remote was changed to git@github.com:jodiwankenobi8-arch/lesson-generator8.git.
- SSH authentication is working locally; confirmed by successful ssh -T git@github.com.
- Chat-side GitHub access is via the GitHub connector, not the local SSH key.
- Current app shell uses routes:
  - /inputs
  - /materials
  - /results
- Results navigation is gated in src/App.tsx based on store readiness.
- src/state/useLessonStore.ts owns:
  - inputs
  - materials
  - selected lesson mode
  - blueprint
  - planning ideas
  - lesson spec
  - lesson package
  - lesson trace
  - missing-area decisions
  - processMaterial()
  - generateLesson()
  - readiness and target-preview helpers
- src/engine/pipeline/runLessonPipeline.ts is the current deterministic composition seam for blueprint -> planning -> spec -> package -> trace.
- Repo debt still visible in the checked tree:
  - many .bak and .broken files inside src/
  - _old/ exists
  - store file is growing large
- Docs drift exists; older notes mention removed helpers and older page/file names.

## Decisions made

- Audit against inspect/origin-main @ 5aad9c2, not preserved local main @ 83b32d8.
- Treat live repo code as canonical over handoff docs where they disagree.
- Use the GitHub connector when available for live repo review in chat.
- If the connector disappears in another chat or mode, use a zip snapshot upload as the fallback review path.
- The single best next implementation step identified in this chat is a no-behavior-change refactor:
  - extract material-processing orchestration out of src/state/useLessonStore.ts into a dedicated application-service module while keeping the store as the public seam.

## Completed work

- Verified local GitHub SSH setup end-to-end:
  - key generated
  - key added to GitHub
  - origin switched to SSH
  - SSH auth confirmed
  - fetch from origin succeeded
- Preserved local history before mainline inspection:
  - backup branch and tag for 83b32d8
- Switched to a clean inspection branch tracking origin/main.
- Captured current top-level tree and full src file listing from the inspected branch.
- Reviewed current package.json, src/App.tsx, src/state/useLessonStore.ts, and src/engine/pipeline/runLessonPipeline.ts.
- Confirmed that current mainline removed legacy orchestration helpers and moved workflow ownership into the store.
- Confirmed that the connector can read the selected repo in this chat.
- Identified the main architectural hotspot:
  - useLessonStore.ts mixes persistent state with async workflow orchestration.

## Remaining work

- Full repo-grounded layer-by-layer audit was started but not completed end-to-end in this chat.
- PR review remains undone.
- Issue review remains undone.
- Export architecture was noted but not deeply inspected from current source in this chat.
- Reliability/extraction policy needs a more explicit readiness gate review.
- Docs need a current-state rewrite or status banner to reduce drift.
- Source-tree cleanup remains open:
  - .bak
  - .broken
  - _old/
- Store decomposition remains the highest-ROI hardening target.

## Next steps

1. In the next chat, reconnect the GitHub connector to jodiwankenobi8-arch/lesson-generator8 if available.
2. If the connector is unavailable, upload a zip snapshot from inspect/origin-main excluding 
ode_modules and dist.
3. Re-open and review in order:
   - README.md
   - src/App.tsx
   - src/state/useLessonStore.ts
   - src/engine/pipeline/runLessonPipeline.ts
   - src/engine/types.ts
   - materials / analysis / blueprint / spec / package files
   - page files
   - tests
   - docs/PROJECT_ARCHITECTURE_MAP.md
   - docs/LESSON_GENERATOR8_EXECUTIVE_HANDOFF.md
4. Finish the repo-grounded audit with explicit separation of:
   - verified facts
   - inferences
   - recommendations
5. Implement the single best next step as a no-behavior-change refactor:
   - extract material-processing workflow from the store into a dedicated module
6. After that, do cleanup and docs hardening:
   - archive or delete dead backup artifacts from active src/
   - refresh architecture docs from current code

## Important evidence

- SHAs and commit subjects actually mentioned:
  - 5aad9c2 - efactor: remove legacy lesson orchestration helpers
  - ec4e1e6 - efactor: move materials workflow orchestration into lesson store
  - e2a0b88 - chore: make win32 rolldown binding optional
  - 8ba54d7 - eat: improve results regeneration feedback
  - 1465ab1 - efactor: make lesson shape automatic-first in inputs
  - 83b32d8 - Checkpoint latest stabilized lesson generator work
- Real file paths actually mentioned or reviewed:
  - README.md
  - package.json
  - src/App.tsx
  - src/state/useLessonStore.ts
  - src/engine/pipeline/runLessonPipeline.ts
  - src/engine/types.ts
  - src/engine/materials/extractTextFromFile.ts
  - src/engine/materials/analyzeMaterial.ts
  - src/engine/analysis/runMaterialAnalysis.ts
  - src/pages/InputsPage.tsx
  - src/pages/MaterialsPage.tsx
  - src/pages/ResultsPage.tsx
  - src/state/useLessonStore.test.ts
  - docs/PROJECT_ARCHITECTURE_MAP.md
  - docs/LESSON_GENERATOR8_EXECUTIVE_HANDOFF.md
- Attached or created handoff artifacts mentioned in this chat:
  - /mnt/data/lesson_generator8_master_handoff_UPDATED_2026-03-14.md
  - /mnt/data/lesson_generator8_master_handoff_UPDATED_2026-03-14_FULL.md
- Real commands actually mentioned:
  - git status
  - git branch --show-current
  - ssh-keygen -t ed25519 -C "your_email@example.com"
  - Start-Service ssh-agent
  - ssh-add C:\Users\jodiw\.ssh\id_ed25519
  - Get-Content C:\Users\jodiw\.ssh\id_ed25519.pub
  - ssh -T git@github.com
  - git remote add origin git@github.com:jodiwankenobi8-arch/lesson-generator8.git
  - git remote set-url origin git@github.com:jodiwankenobi8-arch/lesson-generator8.git
  - git remote -v
  - git push -u origin main
  - git fetch origin --prune
  - git rev-list --left-right --count origin/main...HEAD
  - git branch -vv
  - git log --oneline --graph --decorate --left-right --boundary HEAD...origin/main
  - git switch -c inspect/origin-main --track origin/main
  - git log --oneline -1
  - git log --oneline -5
  - Get-ChildItem -Name
  - Get-ChildItem src -Recurse -File
  - Get-Content package.json
  - Get-Content src\App.tsx
  - Get-Content src\state\useLessonStore.ts
  - Get-Content src\engine\pipeline\runLessonPipeline.ts
- PRs and issues:
  - none reviewed in this chat

## Risks / cautions

- Do not overwrite or delete preserved local history:
  - main @ 83b32d8
  - ackup/local-main-83b32d8
  - ackup-local-main-83b32d8
- Do not confuse path lineage from older docs with current behavior lineage in the live repo.
- Do not treat the older docs as canonical when they conflict with live code.
- Do not assume the local SSH key gives chat-side repo access; in chat, connector access and uploaded files are the review mechanisms.
- If another chat loses the GitHub connector, repo review must continue from an uploaded zip or file snapshot, not by referencing the local repo path alone.
- The live src/ tree still contains backup artifacts; avoid reviving or editing stale .bak / .broken files by mistake.
- The store is the main seam but is becoming a maintenance hotspot; avoid adding more orchestration into it before extracting workflow code.

## Next action

Reconnect the GitHub connector to jodiwankenobi8-arch/lesson-generator8 or upload a zip snapshot from inspect/origin-main, then continue with a repo-grounded audit starting at src/state/useLessonStore.ts and implement the no-behavior-change extraction of material-processing workflow into a dedicated module.
