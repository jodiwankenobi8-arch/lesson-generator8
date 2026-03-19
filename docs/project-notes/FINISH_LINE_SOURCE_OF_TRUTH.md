# Finish Line Source Of Truth

**Project:** Lesson Generator 8  
**Written:** 2026-03-19 12:21 -05:00  
**Active branch:** work/canonical-project-consolidation  
**Current HEAD when written:** 4556a26

## Current verified repo truth

- This is a teacher-facing lesson generator with the flow **Inputs -> Materials -> Results**.
- The engine still follows: **extraction -> analysis -> blueprint -> planning -> spec -> package -> results**.
- **useLessonStore** remains the orchestration seam.
- **Curriculum = content authority**.
- **Exemplar = presentation / structure authority**.
- Package fallback outputs are now more grounded in blueprint content instead of generic placeholder wording.
- Generation now rejects **ready-but-blocked** materials and requires **usable** materials for grounded generation.
- Source-readiness teacher wording now uses **usable** language where trust depends on actual grounding value.
- `AGENTS.md` now requires visible, self-contained terminal summary blocks with actual outcome values.
- The local repo path used in this chat was `C:\Users\jodiw\OneDrive\Desktop\lesson-generator8-local`.
- The current local working tree should be rechecked before the next seam if absolute cleanliness matters, but the latest known pushed checkpoint remains `4556a26`.

## Documentation / continuation discipline

Before continuing in a new chat, evaluate these docs **fully, not skimmed**:

1. `AGENTS.md`
2. `PROJECT_CURRENT_STATE.md`
3. `docs/project-notes/FINISH_LINE_SOURCE_OF_TRUTH.md`
4. the most relevant current handoff
5. the actual repo files involved in the seam

`AGENTS.md` must be followed **religiously**.
Do not continue from older assumptions when live repo files or newer docs say otherwise.

## What was just verified

The current seam was verified with:
- `npm run test:engine` -> PASS
- `npm run build` -> PASS

Additional truth learned during this chat:
- `useLessonStore` lives under `src/state/useLessonStore.ts`, not `src/store/useLessonStore.ts`
- local path assumptions should be checked before pasting PowerShell
- summary blocks need to be self-contained so future chats do not depend on missing terminal context

Known non-blocking warnings still present:
- `useLayoutEffect` SSR warnings in route integration tests
- large chunk warnings during production build
- Vite/react-babel `esbuild` / `oxc` deprecation warnings during engine tests

These are follow-up items, not the immediate next seam.

## What is strong and should be protected

1. The product shape is coherent and finishable.
2. The store seam is real and should remain the orchestration boundary.
3. Materials is the trust center of the product.
4. Curriculum and exemplar roles are clearly separated in the engine and UI.
5. Package grounding is stronger than it was at the start of this chat.
6. Runtime usable-material gating is now more honest.
7. The orchard / warm / teacher-first direction is still worth protecting later.

## What is still weak or misleading

1. Lesson organization is still too tied to the narrow lesson-mode split instead of input-driven lesson parts plus requested outputs.
2. Optional outputs are still too close to being default assumptions instead of teacher-chosen outputs.
3. Some older docs and handoffs are now superseded and should not outrank current live code plus newer docs.
4. Exports still need a classroom-usability pass after the new planning contract is tightened.
5. `debug/` exists locally and should not be treated as repo truth.
6. Orchard convergence / polish is still not the right immediate seam.## Finish order from here

### 1. Keep repo truth aligned
Use this note plus `PROJECT_CURRENT_STATE.md` plus the newest current handoff as the continuation anchor.

### 2. Next implementation seam: input-driven lesson-part planning with requested outputs
Make the app handle current inputs more honestly across:
- detected lesson parts from inputs and materials
- source-grounded vs teacher-requested lesson parts
- requested outputs vs omitted outputs
- teacher-facing preview language
- generation/runtime behavior

The app should organize according to the actual inputs, allow teacher-requested additions when source coverage is partial, and only generate optional outputs when requested.

### 3. Then make exports genuinely classroom-usable
After the new planning contract is honest:
- tighten exported teacher materials
- reduce weak fallback feel
- improve classroom usability rather than just internal completeness

### 4. Then run the final hardening / finish-readiness pass
Before calling the app finish-ready:
- typecheck
- targeted tests
- full tests
- build
- manual flow pass
- export usefulness check
- docs aligned with shipped reality

### 5. Only then move into orchard / wow work
Do not start the second ladder early.

## Immediate next step

The single best next implementation move after this docs update is:

**Scaffold the lesson-parts + requested-outputs contract**

That seam should:
- create the correct contract first
- prepare the app for requested lesson parts and requested outputs
- preserve deterministic pipeline ownership and explainability## What not to do next

- Do not open a broad redesign track yet.
- Do not add major new features.
- Do not let older docs or damaged older handoffs outrank newer repo truth.
- Do not promote `debug/` into the repo unless it is intentionally rewritten into durable project notes.
- Do not revert from **usable** trust logic back to **ready-only** assumptions.
- Do not keep the app trapped in phonics/comprehension-only framing or auto-generate-all-output assumptions.
- Do not keep the app trapped in phonics/comprehension-only framing or auto-generate-all-output assumptions.

## Current checkpoint

As of this note:
- package-output grounding is landed
- usable-vs-ready runtime honesty is landed
- AGENTS summary discipline is stricter
- the new direction is clear
- the next seam is now the contract scaffold for requested lesson parts and requested outputs
- finish path is still ordered and practical

## Phase B - From working to wow

This second ladder starts only after the minimum working product is truly closed.

The first ladder gets the product to:
- grounded generation
- honest provenance
- trustworthy materials behavior
- mixed-target clarity
- classroom-usable exports
- finish-readiness validation

This second ladder takes it from "working" to "wow":
a product that feels unmistakably teacher-authored, orchard-warm, emotionally coherent, daily-usable, and recognizably its own thing.

### Phase B sequence

1. Lock the product soul / canonical product rules
   - Keep curriculum as content authority
   - Keep exemplar as presentation / structure authority
   - Keep Inputs -> Materials -> Results as the workflow
   - Keep the product low-friction, teacher-first, warm, calm, and deterministic
   - Keep provenance visible and honest

2. Build a signature output style pass
   - tighten lesson-plan tone
   - tighten slide-copy tone
   - preserve early-elementary teachable phrasing
   - keep exemplar shaping flow without donating content
   - make outputs sound like this product, not generic assembly

3. Replace provenance visibility with provenance confidence
   - make Results feel like a calm editorial review desk
   - answer what grounded content
   - answer what shaped structure
   - answer where fallback stepped in
   - answer what is safe to teach now
   - answer what to improve next time

4. Make Materials feel like a studio-quality trust workspace
   - instant row appearance
   - calm, truthful status progression
   - clear curriculum vs exemplar distinction
   - per-file reliability guidance
   - stronger next-upload guidance

5. Build the orchard interface system
   - one shell
   - one heading system
   - one card language
   - one notice/callout language
   - one ready/caution/blocked visual language
   - one spacing rhythm
   - one button language
   - one provenance panel style

6. Make the app feel chaptered and sequential
   - Inputs as the planning notebook opening
   - Materials as the source workbench
   - Results as the finished planning binder
   - preview/teach mode as the teaching surface
   - page intros and progress UI should feel guided, not dashboard-like

7. Add teacher-confidence UX and daily-use refinements
   - better calm recommendation language
   - clearer "what improved this lesson" summaries
   - better return-to-results and repeat-use flow
   - stronger persistence and recovery
   - fewer dead-end moments

8. Run a vision-level QA pass
   - source truth
   - teacher trust
   - output quality
   - emotional fit
   - daily-use fit
   - ownership

### Working rule

Do not start this second ladder early.
Finish the minimum working truth ladder first.
Only then move into signature output, orchard system work, sequential/chaptered experience, and daily-use refinement.