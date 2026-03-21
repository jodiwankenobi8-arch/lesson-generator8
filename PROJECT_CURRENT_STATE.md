# PROJECT_CURRENT_STATE

Last refreshed: 2026-03-20

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
- Active branch: work/canonical-project-consolidation
- - Latest local code seam checkpoint: DOCX Student Centers parity seam pushed at 94d924e; next seam is automated Step 4 flow coverage

## Current confirmed state
- Step 1 complete: local truth locked
- Step 2A complete: pipeline boundary backward compatibility restored
- Step 2B complete: request-aware contract reconciled and tests green
- Documentation checkpoint complete
- Step 3A complete: Results naming and hierarchy cleanup landed
- Step 3B complete: visible trust-language cleanup across Inputs, Materials, and Results is substantially aligned
- Step 3C complete: secondary evidence grouping landed in Results
- Request-aware planning/package normalization committed
- MaterialsPage trust-language normalization committed
- Export fallback narrative normalization committed
- Step 4A complete: lesson-plan narrative / export contract alignment landed
- Step 4B complete: Results output visibility contract alignment landed
- Step 4C complete: export support wording parity alignment landed
- Local follow-through: DOCX heading recognition now also covers Student Centers and Student Centers Rotation Plan with targeted test coverage
- AGENTS concise follow-up request rule update landed

## Validated state
- npm test passed
- npm run build passed
- npm run typecheck passed
- committed export support wording parity verified with package-output, package-decision, DOCX heading, ResultsPage, and request-aware test coverage
- local DOCX Student Centers heading parity verified with targeted exportLessonPlanDocx vitest coverage and npm run typecheck
- repo-wide stale-wording sweep found only current intended support/output wording for the active Step 4 seam
- use the newest handoff file as the continuation launch point in the next chat

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- orchard / warm storybook / teacher-first direction
- do not drift into generic SaaS/dashboard styling
- centers = student-independent work
- small group / intervention = teacher-led support
- centers and teacher-led support may coexist during the same lesson block, but they are not the same lane
- I/E is the umbrella block where centers and teacher-led support can run at the same time without collapsing those lanes
- optional lesson parts and outputs should only appear when explicitly requested or strongly source-grounded
- materials trust depends on usable materials, not merely ready materials

## Flow truths
- Product flow: Inputs -> Materials -> Results
- Engine flow: extraction -> analysis -> blueprint -> planning -> spec -> package -> results
- useLessonStore is the orchestration seam

## What the latest seam changed
- lesson-plan support sections now use current teacher-facing headings instead of legacy small-group/intervention idea labels
- printables export now uses current intervention support wording and clearer empty-state wording
- DOCX export heading recognition now includes the current teacher-facing support headings, including Student Centers and Student Centers Rotation Plan
- package-output and package-decision tests now assert the current support-heading contract
- AGENTS still prefers the smallest necessary terminal output in follow-up requests

## Current risks
- Step 4 generated-artifact export flow is now covered locally by automated test coverage through useLessonStore plus downloadExportArtifact
- remaining Step 4 risk, if any, should now be treated as the smallest true browser/UI gap rather than a missing repo-level export-flow guardrail
- local generated-artifact Results/export seam is validated but not yet checkpointed / committed; preserve working-tree hygiene before any push
- Vite build still reports large chunk warnings after minification
- docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt has been restored and should now be used as the design authority reference
- SSR-style useLayoutEffect warnings still appear in some route tests, but the suite passes
- the only remaining Step 4 risk should now come from the live flow, not from a known code-side wording mismatch

## Active execution rule
Do not reopen prior closed seams unless live inspection finds a real regression.
Choose the next seam from current repo state and keep it narrow.
Prefer continuation from the newest handoff file to avoid lag and repeated rediscovery.

## Top next steps
1. Start the next chat from the newest handoff file
2. Confirm pushed HEAD and clean worktree
3. Refresh START_HERE_CURRENT_TRUTH.md and PROJECT_CURRENT_STATE.md to record the passing local generated-artifact Results/export seam
4. Only pursue a manual or UI-harness Step 4 follow-up if a true browser-only Results/export gap still matters after the docs refresh
5. Preserve checkpoint discipline and avoid reopening closed seams

## Local doc policy
The active local doc set should stay small and obvious:
- AGENTS.md
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- README.md
- current relevant docs/chat-handoffs/*

Older docs that are no longer referenced and no longer authoritative should be removed from the local working set and preserved through Git history rather than kept as apparently-live guidance.


