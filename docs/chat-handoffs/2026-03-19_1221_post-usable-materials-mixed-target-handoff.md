# Lesson Generator 8 - Continuation Update

## Current continuation point

**Repo:** `jodiwankenobi8-arch/lesson-generator8`  
**Branch:** `work/canonical-project-consolidation`  
**Latest known pushed checkpoint:** `b55f5e4`

### Current shipped truth

- Product flow is **Inputs -> Materials -> Results**.
- Engine flow is **extraction -> analysis -> blueprint -> planning -> spec -> package -> results**.
- `useLessonStore` remains the orchestration seam and should stay that way.
- **Curriculum** is the content authority.
- **Exemplar** is the presentation / structure authority.
- Materials trust gating depends on **usable** materials, not merely **ready** materials.
- Generation now rejects **ready-but-blocked** materials instead of treating any analyzed file as sufficient.
- Package fallback outputs are now more grounded in blueprint content instead of generic placeholder wording.
- Source-readiness wording now uses **usable** language where teacher trust depends on actual grounding value.
- `AGENTS.md` now requires visible, self-contained terminal summary blocks with actual outcome values.
- The planning model remains split into **two ladders**:
  1. minimum working / truth-first completion
  2. working-to-wow / product-identity refinement

## Continuation discipline

Before continuing:
- evaluate `AGENTS.md`, `PROJECT_CURRENT_STATE.md`, `docs/project-notes/FINISH_LINE_SOURCE_OF_TRUTH.md`, and the newest handoff **fully, not skimmed**
- inspect the actual repo files involved in the next seam
- confirm real local paths before pasting PowerShell
- follow `AGENTS.md` **religiously**

## What changed in this chat

### 1. Package-output grounding is now part of current truth
- package fallback outputs are more source-grounded than they were before
- the weakest blueprint-to-generation leak is no longer generic package wording

### 2. Usable-vs-ready runtime honesty was landed
- generation now rejects **ready-but-blocked** materials
- runtime/store behavior now matches the Materials trust model more honestly
- source-readiness wording now says **usable** instead of **ready** where appropriate
- `npm run test:engine` passed
- `npm run build` passed

Checkpoint:
- `b55f5e4` — `feat: align generation gating with usable materials`

### 3. AGENTS terminal-summary rules were hardened
- summary blocks must now be visible
- summary blocks must now be self-contained
- summary blocks must include actual outcome values needed for continuation
- continuation chats should not rely on missing terminal context outside the summary block

### 4. Path truth mattered
- actual local repo path in this chat was:
  `C:\Users\jodiw\OneDrive\Desktop\lesson-generator8-local`
- actual store path is:
  `src/state/useLessonStore.ts`

Do not continue from older path assumptions without checking them first.

## Current plan position

### Ladder 1 - minimum working / truth-first
1. **Deepen blueprint-to-generation grounding** — done
2. **Finish Materials runtime honesty / status behavior** — done
3. **Harden mixed-target clarification** — next
4. **Make exports genuinely classroom-usable**
5. **Run the final validation / finish-readiness pass**

### Ladder 2 - from working to wow
Only after Ladder 1 is truly closed:
1. Lock the product soul / canonical product rules
2. Build the signature output style pass
3. Turn provenance into teacher confidence
4. Make Materials feel like a studio-quality trust workspace
5. Build the orchard interface system
6. Make the app feel chaptered and sequential
7. Add teacher-confidence UX and daily-use refinements
8. Run a vision-level QA pass

## What is next

### Highest-value next seam now

**Mixed-target clarification**

This is now the next truth-first seam.

The remaining unresolved promise is:
- mixed inputs should not be flattened too early into a misleading single-focus story
- selected mode, detected mode, and recommended mode should stay honest and understandable
- teacher-facing messaging should encourage clarification when inputs are mixed
- deterministic generation behavior should stay clean and explainable

### Concrete next seam target

Trace one mixed-target case through:
- target detection
- selected lesson mode
- recommended mode
- blueprint target resolution
- teacher-facing preview / messaging
- generation entry behavior

### Acceptance bar
- mixed signals are detected consistently
- the app does not overclaim a single-focus lesson when inputs are actually mixed
- recommended mode stays honest
- teacher-facing messaging encourages clarification where needed
- deterministic pipeline behavior stays clean

## Important constraints going forward

### Preserve
- warm / calm / readable / teacher-first feel
- orchard / storybook direction
- `useLessonStore` as the orchestration seam
- curriculum as content authority
- exemplar as presentation authority
- deterministic staged pipeline architecture
- the two-ladder plan
- AGENTS/SOP discipline

### Avoid
- broad redesign work
- generic SaaS/dashboard drift
- promoting `debug/` into repo truth unless intentional
- letting UI explanation replace engine truth
- jumping to orchard polish before truth seams are closed
- starting the second ladder early
- reverting from **usable** trust logic back to **ready-only** assumptions

## Relevant files to inspect next

### Core docs
- `AGENTS.md`
- `PROJECT_CURRENT_STATE.md`
- `docs/project-notes/FINISH_LINE_SOURCE_OF_TRUTH.md`
- this handoff file

### Next-seam files
- `src/engine/blueprint/detectLessonTargets.ts`
- `src/engine/blueprint/buildBlueprint.ts`
- `src/engine/pipeline/runLessonPipeline.ts`
- `src/engine/types.ts`
- `src/state/useLessonStore.ts`
- the live lesson-mode selection / inputs UI file(s)
- mixed-target tests

## Recommended next move

**Next seam: mixed-target clarification**

Work that seam tightly before orchard convergence.
The immediate goal is to make mixed inputs honest and explainable across detection, preview, selected mode, recommended mode, and generation behavior.