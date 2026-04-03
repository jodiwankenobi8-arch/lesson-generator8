> Historical note: this document uses older narrow lesson-bucket framing. Do not use it as current product truth. Current truth is curriculum-content extraction plus multi-area lesson resolution across many ELA area types.

﻿# LESSON GENERATOR 8
## UPDATED PROJECT PLAN
## Date: 2026-03-11

This file replaces the old mock-first direction with the current real-app plan.

---

## CORE PRODUCT RULES

### Curriculum = content authority
Curriculum materials should determine:
- standards
- vocabulary
- word lists
- texts
- examples
- practice tasks
- instructional targets

### Exemplar = presentation authority
Exemplar materials should determine:
- pacing
- slide flow
- teacher moves
- prompt style
- visual/layout structure
- presentation tone

### No more mock behavior
Going forward, the project should not add or depend on:
- mock material analysis
- fake extraction
- simulated intelligence standing in for the real product
- fake “analysis complete” behavior as a substitute for real analysis

The goal is now a functioning app with real processing.

---

## CURRENT PRODUCT DIRECTION

The app should move toward this real pipeline:

uploaded file
-> real file extraction
-> AI analysis
-> structured curriculum/exemplar analysis
-> blueprint generation
-> lesson spec generation
-> lesson package generation

---

## EXEMPLAR CONTROL REQUIREMENT

Exemplar handling must support user choice, not just a simple exemplar on/off model.

Required exemplar modes:
- Copy style closely
- Use as inspiration
- Preserve selected aspects
- Custom style instructions

Selectable aspects should eventually include:
- structure
- slide flow
- teacher prompts
- pacing/timers
- visual layout
- wording/tone

Custom instructions should allow requests such as:
- keep the same structure but simplify language
- preserve timing and teacher moves but not visuals
- match this exemplar closely but swap in the new curriculum content

---

## UPDATED ENGINEERING PLAN

### Phase 0 - Freeze prototype scope
Do not spend further effort improving mock material analysis or simulated processing.
Prototype-only placeholders should be replaced, not expanded.

### Phase 1 - Real file ingestion
Replace simulated material processing with real ingestion.

Required direction:
- user uploads real files
- app reads actual file contents
- extraction status reflects real work
- files move through real processing states
- ready/error states reflect actual outcomes

Target first formats:
- PDF
- DOCX
- PPTX
- TXT

### Phase 2 - Structured analysis schema
Replace thin generic material analysis with structured role-specific analysis.

Curriculum analysis should include fields such as:
- standards
- vocabulary
- wordLists
- texts
- practiceTasks
- instructionalTargets
- examples

Exemplar analysis should include fields such as:
- slideFlow
- pacing
- teacherMoves
- promptStyle
- layoutCues
- tone
- reusableStructure

### Phase 3 - AI-backed analysis
Use AI to normalize extracted material content into structured JSON.

AI should be used in two different steps:

1. Material analysis AI
   - takes extracted file content plus material role
   - returns structured curriculum or exemplar analysis

2. Lesson generation AI
   - takes lesson inputs plus structured analysis plus exemplar control settings
   - generates higher-quality blueprint/spec/package outputs

### Phase 4 - Store and workflow update
Replace simulated processing in state flow with real async processing.

Material statuses should reflect real work, for example:
- uploaded
- extracting
- analyzing
- ready
- error

Results must remain blocked until required processing is truly complete.

### Phase 5 - Rewire blueprint/spec/package to real structured analysis
Keep the layered architecture:
- blueprint = what is taught
- spec = how it is taught
- package = deliverables

But change the source of truth:
- not broad keyword inference from mock extracted text
- instead structured real analysis outputs

### Phase 6 - Mixed-lesson decision UI
Once real analysis is in place, improve mixed-lesson handling so the user can choose:
- which standards to include
- which components to include
- full lesson or only portions

This remains important, but it follows real analysis.

---

## CURRENT PRIORITY ORDER

1. Remove dependence on mock material analysis
2. Design and implement real file extraction pipeline
3. Expand material analysis schema for curriculum and exemplar
4. Add AI material-analysis step returning structured JSON
5. Add exemplar style-control options and store them as real inputs
6. Rewire blueprint/spec/package layers to use structured analysis
7. Improve mixed-lesson choice UI
8. Improve exports and final presentation fidelity

---

## WORKING RULES

### Development workflow
- One PowerShell paste at a time
- Large but safe steps
- No hacky quick patches
- No patch stacking just to get things working
- Verify file writes, then verify build, then continue
- Save a baseline snapshot after each solid milestone

### Source of truth
- Local project files are the source of truth
- Temporary workspace uploads are reference only
- Do not rely on temporary uploaded copies as the permanent project state

### Engineering rules
- Favor clean architecture over quick fixes
- Keep responsibilities clearly separated
- Maintain readable, maintainable code
- Do not broad-refactor immediately after recovery; do the next planned step first

---

## CURRENT STATUS AS OF 2026-03-11

Completed recently:
- Recovered corrupted InputsPage.tsx
- Re-aligned Inputs page with current LessonInputs shape
- Tightened mixed-target detection to reduce overfiring
- Improved practice generation to use curriculum-derived content more explicitly
- Preserved clean passing build
- Saved milestone baselines

Current reality:
- App builds successfully
- Upstream material analysis is still mock/simulated
- Next major step is replacing that with real ingestion and AI-backed analysis

---

## NEXT IMPLEMENTATION TARGET

The next major implementation target is:

### Real material-analysis pipeline

This should begin by replacing the mock material-analysis path with a real analysis entry point and designing the real structured analysis contract for curriculum and exemplar files.

Recommended implementation direction:
- add real extractor layer
- add AI analysis layer
- validate structured outputs
- persist analysis in state
- feed generation layers from structured analysis

---

## NOTE FOR FUTURE HANDOFFS

This project is no longer pursuing a mock-first plan.
It is now pursuing a functioning app with:
- real file processing
- real AI-backed analysis
- real exemplar style controls
- structured generation inputs

Any future work should align with that direction.
