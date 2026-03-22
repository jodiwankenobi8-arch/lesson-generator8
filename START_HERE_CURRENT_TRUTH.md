# START_HERE_CURRENT_TRUTH.md

## Current repo truth
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Current published continuation point: d8fafad current main checkpoint after consolidation fast-forward
- Current validated local seam: Materials upload-type visibility is now surfaced in MaterialsPage.tsx and both upload inputs use aligned accept values
- Current milestone: current-main truth is refreshed after consolidation and the upload-type visibility seam is locally landed
- Current active seam: docs closeout and commit-ready checkpoint for the landed Materials upload-type visibility seam

## What is actually landed
- Active product flow remains Inputs -> Materials -> Results
- Current local branch is main
- Current local HEAD during this refresh is d8fafad
- origin/main matched local during this refresh at d8fafad
- Materials intro now explicitly lists supported source files: .txt, .pdf, .docx, .pptx, .html, and .htm
- Both Materials upload inputs now use accept=".txt,.pdf,.docx,.pptx,.html,.htm"
- npm run typecheck passed after the Materials seam edit
- src/pages/orchardUi.ts exists on current main

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- orchard / warm storybook / teacher-first direction
- do not drift into generic SaaS / dashboard styling
- centers = student-independent work
- small group / intervention = teacher-led support
- centers and teacher-led support may coexist during the same lesson block, but they are not the same lane
- I/E is the umbrella block where centers and teacher-led support can run at the same time without collapsing those lanes
- optional lesson parts and outputs should only appear when explicitly requested or strongly source-grounded
- materials trust depends on usable materials, not merely ready materials
- AI must not replace deterministic extraction, blueprint orchestration, or trust surfaces

## Latest validation snapshot
- Live local branch was main during this refresh
- Live local HEAD was d8fafad during this refresh
- origin/main matched local at d8fafad during this refresh
- Materials upload-type visibility seam was edited and verified locally
- Verification already completed for this seam:
  - supported source files copy present in MaterialsPage.tsx
  - both upload inputs have aligned accept values
  - npm run typecheck passed

## Non-blocking warnings
- README.md may still lag the active continuation docs
- older handoffs that still launch from work/canonical-project-consolidation and 04a9b08 are now historical
- do not reopen the upload-type visibility seam unless live regression evidence appears

## What to read next
1. AGENTS.md
2. PROJECT_CURRENT_STATE.md
3. docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt
4. newest file in docs/chat-handoffs/
5. then inspect the actual current-main repo files for the next narrow finishing seam

## Exact next move
- Commit and push the landed Materials upload-type visibility seam together with this docs refresh
- Then do one inspect-first current-main review to choose the next narrow finishing seam
- Prefer current main repo files over older continuation notes if they conflict

## Retrieval fallback rule
If connector retrieval is incomplete or stale, trust live local git output and live local source files first.
