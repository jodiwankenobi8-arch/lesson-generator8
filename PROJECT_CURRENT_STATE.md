# PROJECT_CURRENT_STATE

Last refreshed: 2026-03-22

## Purpose
This file is the current project status board for active work.
It should be read after AGENTS.md and START_HERE_CURRENT_TRUTH.md.

## Authority order
1. AGENTS.md = workflow and rules authority
2. START_HERE_CURRENT_TRUTH.md = entry doc and active seam launcher
3. PROJECT_CURRENT_STATE.md = current working status
4. latest relevant docs/chat-handoffs/* file = seam-level execution detail

Anything older or not in that chain should be treated as historical unless explicitly re-adopted.

## Repo and branch
- Repo: jodiwankenobi8-arch/lesson-generator8
- Active branch: main
- Current published continuation point: 9e4e457 refine Results blocked-state materials terminology and close the seam on current main
- Current validated local state: Materials upload-type visibility is closed on current main, the README current-truth summary is pushed, Inputs terminology alignment is pushed, Results blocked-state terminology alignment is pushed, and this docs refresh matches the pushed repo truth

## Current confirmed state
- Active product flow remains Inputs -> Materials -> Results
- Current local branch is main
- Current local HEAD during this refresh is 40d192d
- origin/main matched local during this refresh at 40d192d
- Materials intro explicitly lists supported source files: .txt, .pdf, .docx, .pptx, .html, and .htm
- Both Materials upload inputs now use accept=".txt,.pdf,.docx,.pptx,.html,.htm"
- src/pages/orchardUi.ts exists on current main
- Results uses the newer teacher-first support lane structure

## Validated state
- The Materials upload-type visibility seam is committed and pushed
- npm run typecheck passed for the seam before this refresh
- The seam remained narrow and UI-contract focused
- Engine behavior was not broadened during the seam
- The previous continuation docs on work/canonical-project-consolidation and 04a9b08 are historical

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

## Flow truths
- Product flow: Inputs -> Materials -> Results
- Engine flow: extraction -> analysis -> blueprint -> planning -> spec -> package -> results
- useLessonStore remains the orchestration seam

## Current risks
- README.md may still lag the active continuation docs
- older handoffs can mislaunch work if treated as current
- after this docs closeout, re-pick the next narrow finishing seam from live current main without reopening closed seams
- do not reopen closed seams unless live regression evidence appears

## Active execution rule
Do not reopen prior closed seams unless live inspection finds a real regression.
Choose the next seam from current repo state and keep it narrow.
Prefer continuation from the newest handoff file to avoid lag and repeated rediscovery.

## Top next steps
1. Do one inspect-first current-main review to choose the next narrow finishing seam
2. Refresh README.md only if it conflicts with the active continuation docs
3. Keep the active continuation set small and obvious
4. Do not let overridden notes compete with the active continuation set
5. Commit and push future seam closeouts immediately after they land

## Local doc policy
The active local doc set should stay small and obvious:
- AGENTS.md
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- README.md
- current relevant docs/chat-handoffs/*
