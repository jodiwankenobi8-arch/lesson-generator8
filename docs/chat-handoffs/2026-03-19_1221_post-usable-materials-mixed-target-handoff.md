# Lesson Generator 8 - Continuation Update

## Current continuation point

**Repo:** `jodiwankenobi8-arch/lesson-generator8`  
**Branch:** `work/canonical-project-consolidation`  
**Latest known pushed checkpoint:** `4556a26`

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

### 1. Product direction was clarified beyond the narrow mixed-target framing
- the real product goal is now explicitly broader than phonics/comprehension-only lesson-shape handling
- the app should organize according to the actual inputs and materials
- the app should support teacher-requested additions when source coverage is partial
- optional outputs such as slides, assessments, centers, small group, intervention, and printables should be generated only when requested

### 2. Source-of-truth docs and AGENTS were updated locally
The core source-of-truth docs were updated locally in this chat to reflect the new plan and current repo truth:
- `AGENTS.md`
- `PROJECT_CURRENT_STATE.md`
- `docs/project-notes/FINISH_LINE_SOURCE_OF_TRUTH.md`
- `docs/chat-handoffs/2026-03-19_1221_post-usable-materials-mixed-target-handoff.md`

### 3. The truth-first ladder was reordered
The next implementation order is now:
1. scaffold the lesson-parts + requested-outputs contract in types/store
2. update Inputs for requested lesson parts and requested outputs
3. teach blueprint/planning/spec/package to honor the new contract and provenance
4. make exports genuinely classroom-usable
5. run the final validation / finish-readiness pass

### 4. The first code seam was inspected but not landed yet
- a first contract-scaffold edit was attempted in this chat but did **not** land
- local numbered anchor snippets were captured to help the next edit target the real file contents
- no new code checkpoint was created or pushed in this chat

### 5. Path truth still matters
- actual local repo path in this chat remained:
  `C:\Users\jodiw\OneDrive\Desktop\lesson-generator8-local`
- actual store path remains:
  `src/state/useLessonStore.ts`

Do not continue from older path assumptions without checking them first.## What is next

### Highest-value next seam now

**Input-driven lesson-part planning with requested outputs**

This is now the next truth-first seam.

The remaining unresolved promise is:
- the app should organize according to the actual inputs and materials, not a narrow binary lesson-shape model
- detected/source-grounded lesson parts should stay distinct from teacher-requested AI-added lesson parts
- optional outputs should be teacher-chosen instead of assumed defaults
- teacher-facing messaging should stay honest about what came from sources versus what was added by request
- deterministic generation behavior should stay clean and explainable

### Concrete next seam target

Trace one canonical case through:
- detected lesson parts from current inputs and materials
- requested lesson parts beyond current source coverage
- requested outputs versus omitted outputs
- blueprint content resolution
- planning/spec/package behavior
- teacher-facing preview / messaging
- generation entry behavior

### Acceptance bar
- the app organizes according to the actual inputs and materials
- teacher-requested additions can be generated and placed appropriately even when source coverage is partial
- optional outputs are generated only when requested
- provenance stays honest about source-grounded vs AI-added content
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
- keeping the app locked to phonics/comprehension-only framing or auto-generated optional outputs

## Relevant files to inspect next

### Core docs
- `AGENTS.md`
- `PROJECT_CURRENT_STATE.md`
- `docs/project-notes/FINISH_LINE_SOURCE_OF_TRUTH.md`
- this handoff file

### Next-seam files
- `src/engine/types.ts`
- `src/state/useLessonStore.ts`
- `src/state/useLessonStore.test.ts`

### Follow-up seam files after that
- `src/pages/InputsPage.tsx`
- requested-output / lesson-part UI file(s)
- `src/engine/blueprint/buildBlueprint.ts`
- `src/engine/planning/buildLessonPlanningIdeas.ts`
- `src/engine/spec/buildLessonSpec.ts`
- `src/engine/package/buildLessonPackage.ts`
- `src/engine/package/buildPackageOutputs.ts`
- output-selection / provenance tests## Recommended next move

**Next seam: input-driven lesson-part planning with requested outputs**

Work that seam tightly before orchard convergence.
The immediate goal is to make the app organize according to actual inputs, support teacher-requested additions when source coverage is partial, and generate optional outputs only when requested.