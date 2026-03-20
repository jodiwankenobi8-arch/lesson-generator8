# AGENTS.md

## Project identity
Lesson Generator 8 is a teacher-facing lesson generator.

Primary app flow:
Inputs -> Materials -> Results

Canonical engine flow:
extraction -> analysis -> blueprint -> planning -> spec -> package -> results

This is not a generic AI toy or a generic dashboard app.
It should feel teacher-first, trustworthy, source-grounded, and finishable.

## Instruction priority
If the user gives a direct request in the current chat that conflicts with a default preference here, follow the user's current request.

## Current product phase
This project is in hardening / finishing mode.

Prioritize:
- trust
- reliability
- source selection clarity
- results traceability
- export usefulness
- clean architecture

Do not prioritize broad new-feature expansion ahead of core trust hardening.

## Core product rules
These are non-negotiable:
- Curriculum = content authority
- Exemplar = presentation / structure authority
- Do not let exemplar override lesson topic or lesson content
- Do not reduce strong curriculum content into weak generic filler
- Detect what uploaded materials already cover
- Organize lessons according to the parts detected from current inputs and materials
- Distinguish source-grounded lesson parts from teacher-requested AI-added lesson parts
- Avoid duplicating strong source coverage
- Ask before adding meaningful missing areas unless the teacher explicitly requests them
- Optional outputs such as slides, centers, assessments, small group, intervention, and printables should be generated only when requested or strongly source-grounded
- Centers = student-independent work
- Small group / intervention = teacher-led support
- Centers and teacher-led support may coexist during the same lesson block, but they are not the same lane
- Do not force the product into a narrow binary lesson-shape model when the real input is broader
- AI must not replace deterministic extraction, blueprint orchestration, or trust surfaces

## Design direction
Official design authority:
docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt

Design requirements:
- teacher-first
- warm
- calm
- orchard / storybook direction
- elegant
- readable
- layered but not cluttered
- polished, not corporate
- inviting, not childish
- practical, not flashy

Avoid:
- generic SaaS / dashboard drift
- startup admin-panel styling
- bright edtech energy
- cold corporate surfaces
- harsh shadows
- square, stiff visual language
- over-decoration
- clutter
- visual gimmicks
- dark wood-heavy or schoolhouse-heavy styling
- overly sepia UI

When design sources conflict, use:
1. OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt
2. current streamlined product vision
3. current shared UI system
4. older leftover theme files last

## Documentation authority
Keep the active continuation set small and obvious.

Active continuation docs:
1. AGENTS.md
2. START_HERE_CURRENT_TRUTH.md
3. PROJECT_CURRENT_STATE.md
4. one latest relevant file in docs/chat-handoffs/

Supporting docs:
- docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt for design decisions
- README.md for public-facing repo summary

Historical docs:
- older handoffs
- archive notes
- superseded architecture maps
- any older note that still sounds current but is no longer authoritative

Historical docs may remain in Git history, but they should not compete with the active continuation set.

## Role of each active doc
Use AGENTS.md for:
- lasting workflow rules
- SOPs
- product rules
- design rules
- review behavior
- output format

Use START_HERE_CURRENT_TRUTH.md for:
- the single entry door for a new chat
- repo / branch / latest validated checkpoint
- what is actually landed
- current active seam
- what to read next
- latest validation snapshot
- exact next move

Use PROJECT_CURRENT_STATE.md for:
- current milestone
- what is done
- what is not done
- current risks
- validation status
- top next steps

Use one latest relevant docs/chat-handoffs file for:
- seam-level continuation detail
- exact local observations
- scoped execution context worth preserving

## Notes review mode
There are two valid review modes.

### Standard continuation mode
Use this by default.

Read:
1. START_HERE_CURRENT_TRUTH.md
2. AGENTS.md
3. PROJECT_CURRENT_STATE.md
4. docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt
5. the most relevant recent handoff(s)
6. the actual repo files involved in the task

### Full historical sweep mode
Use this when:
- the user asks for it
- the project direction is unclear
- notes conflict
- a major planning or architecture review is requested

In full historical sweep mode, expand review to:
- docs/project-notes/
- docs/project-notes/archive/
- docs/chat-handoffs/
- README.md

## Notes precedence rule
When repo files, notes, and handoffs disagree, use this order:
1. live repo code and tests
2. START_HERE_CURRENT_TRUTH.md for entry context and exact active seam
3. PROJECT_CURRENT_STATE.md for current working status
4. newer handoff files
5. OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt for design decisions
6. README.md for public-facing repo summary
7. older archive notes as historical context only

Never treat older archive notes as current truth if they are clearly overridden.

Always identify:
- what is current
- what is stale
- what is superseded
- what changed over time

## Default continuation behavior
If a new chat is opened for this repo, the assistant should first:
- read START_HERE_CURRENT_TRUTH.md fully
- then read AGENTS.md fully and treat it as the workflow rules authority
- then read PROJECT_CURRENT_STATE.md
- then read docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt
- then inspect the most relevant recent handoff(s)
- then inspect the actual repo files involved
- then recommend the single best next move

Do not assume older chat context is current unless it is reflected in repo files or maintained notes.

## Retrieval fallback rule
If connector retrieval is incomplete or stale:
- say so plainly
- request one inspect-first local paste for the exact missing file(s)
- treat that live output as higher-trust than older indexed copies

## Documentation maintenance rule
After every meaningful seam, update exactly these:
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- one handoff file only if the seam was meaningful enough to need continuation detail

Do not create extra competing "truth" docs unless one older doc is being replaced.

START_HERE_CURRENT_TRUTH.md should stay short.
It is a launch wrapper, not a second roadmap.

## User workflow / SOP rules
The repo owner is completely new to development and wants beginner-safe help.

Always work like this:
1. inspect first
2. explain what is being changed and why
3. prefer one PowerShell paste at a time, but do not over-split work into tiny pastes
4. prefer fewer, larger, coherent PowerShell pastes over many small ones
5. if one coherent step naturally needs sequential terminal actions, several PowerShell pastes in one assistant message are allowed
6. use the biggest safe coherent chunk
7. do one clean edit
8. verify immediately
9. keep architecture clean
10. checkpoint frequently
11. push to Git after meaningful progress

When helping with implementation, prefer this structure:
- What we are doing
- Why now
- One PowerShell paste
- Expected success result
- What to send back if it fails

PowerShell pacing preference:
- Prefer fewer, larger, coherent PowerShell pastes over many tiny ones
- Several sequential PowerShell pastes in one assistant message are allowed when they belong to one coherent step
- Do not fragment work unnecessarily

## Standard repo review behavior
When asked to review the connected GitHub repo:
1. confirm which repo is selected
2. choose the correct review mode
3. read the required context for that mode
4. separate current truth from stale history
5. identify contradictions and overridden notes
6. inspect the actual repo files before recommending edits
7. keep all advice beginner-safe and implementation-ready

If connector access is incomplete, say so clearly instead of pretending the full set was read.

## Required output format for repo review
After reviewing the repo and notes, respond in this order:
1. what the app currently is
2. what is already working
3. what is incomplete, fragile, or misleading
4. what changed over time in the project
5. which older notes are now stale or overridden
6. the top 5 next steps in order
7. what should be fixed now vs later vs not at all
8. the single best next move now
9. one PowerShell paste only
10. what success should look like
11. what the user should send back if it fails

Keep it:
- honest
- repo-grounded
- practical
- beginner-safe
- structured
- focused on finishing the app

## Honesty rule
Do not claim a file, note set, repo area, test result, or review scope was checked unless it was actually inspected.

If access is incomplete, say exactly:
- what was checked
- what was not checked
- what conclusions are therefore uncertain

## Documentation drift rule
If notes, handoffs, README, or repo files conflict, identify the conflict clearly and recommend which file should be updated so future chats do not inherit stale guidance.

## PowerShell safety rules
- Do not paste raw TypeScript directly into PowerShell
- Use safe file-write commands when code must be created or replaced
- Prefer inspect-first commands before edit commands
- Prefer one clean change at a time
- Verify immediately after edits
- Prefer targeted git commands over overly broad git commands
- Avoid sloppy bulk commands when a narrower command is safer

## Architecture rules
- Keep responsibilities clearly separated
- Prefer clean architecture over quick patches
- Do not patch-stack brittle fixes if a seam clearly needs a cleaner repair
- Inspect real current files before recommending edits
- Treat live repo files as truth over older notes when they conflict
- Preserve explainability and trust surfaces
- Avoid unnecessary complexity
- Make the smartest safest biggest move in plan order

## Build quality rule
- Build the correct underlying contract first
- Prefer seam-level repairs over patch-stacking
- If the store, type, blueprint, planning, spec, or package contract is wrong, fix the contract instead of layering UI-only workarounds
- Keep the app generic and input-driven, not tied to one teacher, one curriculum brand, or one recurring lesson pattern unless that behavior is explicitly canonical
- We want a clean, solid, working app built correctly, not a million patches

## Verification rule
After meaningful edits, prefer this order when available:
1. targeted inspection
2. typecheck
3. relevant tests
4. build
5. brief manual verification

## Summary block rule
If terminal results need to be pasted back into chat, end the PowerShell paste with a visible summary block like this:

============================================================
==============================SUMMARY========================
Status: <real outcome of the terminal run>
Key result: <main result or next useful takeaway>
Paste back: <exact text, output block, or short result to return>
============================================================

That summary block must be self-contained, continuation-ready, and sufficient for the user's reply.
Everything the assistant wants pasted back from the terminal should appear between the SUMMARY lines so the user does not need to hunt through earlier output.
Prefer asking for the SUMMARY block only.
If extra detail is truly required, print that detail inside the SUMMARY block as labeled lines instead of asking the user to gather it from earlier terminal output.
Include real outcomes, not vague conditional language.

