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
- Current published continuation point: 1408023 copy: align Materials teacher-facing terminology with the usable-materials contract
- Current local working seam: README truth-alignment repair is verified locally on main and pending commit/push with docs closeout

## Current confirmed state
- Active product flow remains Inputs -> Materials -> Results
- Current local branch is main
- Current local HEAD during this refresh is e8c5936
- Live README inspect confirmed the stale broader README opening wording was still present before repair
- Live README verification confirmed the repaired truth-aligned wording is now present locally
- Materials intro explicitly lists supported source files: .txt, .pdf, .docx, .pptx, .html, and .htm
- Both Materials upload inputs now use accept=".txt,.pdf,.docx,.pptx,.html,.htm"
- src/pages/orchardUi.ts exists on current main
- Results uses the newer teacher-first support lane structure

## Validated state
- The Materials upload-type visibility seam is committed and pushed
- The README truth-alignment repair is verified locally
- The stale broader README markers are gone locally
- Engine behavior was not broadened during this README seam
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
- the README seam is still local until commit/push completes
- older handoffs can mislaunch work if treated as current
- after this closeout, re-pick the next narrow finishing seam from live current main without reopening closed seams
- do not reopen closed seams unless live regression evidence appears

## Active execution rule
Do not reopen prior closed seams unless live inspection finds a real regression.
Choose the next seam from current repo state and keep it narrow.
Prefer continuation from the newest handoff file to avoid lag and repeated rediscovery.

## Top next steps
1. Commit and push the README truth-alignment seam with docs closeout
2. Re-pick the next narrow finishing seam from live current main
3. Keep the active continuation set small and obvious
4. Do not let overridden notes compete with the active continuation set
5. Do not reopen closed seams unless live regression evidence appears

## Local doc policy
The active local doc set should stay small and obvious:
- AGENTS.md
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- README.md
- current relevant docs/chat-handoffs/*
