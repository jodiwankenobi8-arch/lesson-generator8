# Project Current State

**Project:** Lesson Generator 8  
**Last updated:** 2026-03-19 (America/Chicago)  
**Status:** In progress

## Current summary
- Active product flow is **Inputs -> Materials -> Results**.
- **useLessonStore is the orchestration seam.** Pages may read state and call store actions; pages must not import engine orchestration helpers directly.
- Store-driven processing, generation, regeneration, and selected-source explainability are already in place.
- Canonical working branch: **work/canonical-project-consolidation**
- Current verified branch head at time of this update: **b55f5e4**
- Package fallback outputs are now more directly grounded in blueprint content instead of generic placeholders.
- Generation now rejects **ready-but-blocked** materials and requires **usable** materials for grounded generation.
- Source-readiness wording now uses **usable** language where teacher trust depends on actual grounding value.
- `AGENTS.md` now requires visible, self-contained terminal summary blocks with actual outcome values.

## Recently landed seams
- **16145b2** — materials trust gating honesty
- **0b1dcd9** — results authority trace clarity
- **28b9ca1** — prefer allow over caution in material selection
- **09d5761** — sync project state and store seam notes
- **5f1dc45** — extend finish-line plan and add updated handoff
- **b55f5e4** — align generation gating with usable materials

## Current priorities
- Protect the store seam from page-to-engine orchestration bypasses.
- Preserve **usable**, not merely **ready**, trust/gating language and behavior.
- Harden **mixed-target clarification** as the next truth-first seam.
- Make exports genuinely classroom-usable after mixed-target behavior is honest.
- Leave chunk-size tuning, SSR warning cleanup, and dependency maintenance for dedicated follow-up seams.

## Active rules
- Keep useLessonStore as the orchestration seam.
- Do not prioritize visual redesign ahead of trust, clarity, and release hardening.
- Keep curriculum as content authority and exemplar as presentation authority.
- Evaluate core continuation docs **fully, not skimmed**.
- `AGENTS.md` must be followed **religiously** in continuation work.

## Known issues / risks
- Mixed-target behavior still needs a tighter truth-first clarification pass.
- Build emits large chunk warnings that should be addressed later with targeted chunking rules.
- Tests show non-blocking useLayoutEffect SSR-style warnings in integration output.
- Vite/react-babel emitted `esbuild` / `oxc` deprecation warnings during engine-test runs.
- Local `debug/` output should not be treated as repo truth unless intentionally promoted.

## Validation snapshot (local)
- Environment: Windows PowerShell at `C:\Users\jodiw\OneDrive\Desktop\lesson-generator8-local`
- `npm run test:engine`: **PASS**
- `npm run build`: **PASS**
- Note: this chat did **not** rerun full `npm run typecheck` or full `npm run test`
- Note: local Windows validation remains the source of truth if external tools disagree on environment assumptions.

## Shell / cleanup note
- Legacy shell cleanup is not the current priority.
- Re-run `.\\scripts\\Find-LegacyShellReferences.ps1` before any future shell deletion or shell cleanup work.
- Confirm real local paths before pasting PowerShell; earlier chat assumptions drifted on both repo path and `useLessonStore` path.

## Next recommended step
- Harden **mixed-target clarification**.
- Then make exports genuinely classroom-usable.
- Then do the final validation / finish-readiness pass.
- Keep orchard convergence and broader polish behind the truth-first ladder.

## Files likely involved next
- `src/engine/blueprint/detectLessonTargets.ts`
- `src/engine/blueprint/buildBlueprint.ts`
- `src/engine/pipeline/runLessonPipeline.ts`
- `src/engine/types.ts`
- `src/state/useLessonStore.ts`
- the live lesson-mode selection / inputs UI file(s)
- target-detection / mixed-target tests

---

## Update log

### Update - 2026-03-19
- Confirmed package-output grounding is landed in current branch history.
- Landed usable-vs-ready runtime honesty so generation now rejects ready-but-blocked materials.
- Updated source-readiness wording to use **usable** language.
- Confirmed `npm run test:engine` PASS and `npm run build` PASS after final readiness-test wording fix.
- Confirmed `AGENTS.md` now requires self-contained summary blocks with actual outcome values.
- Set the next truth-first seam to **mixed-target clarification**.

## Branch archaeology / deletion gate

Do not treat older repo notes as gospel.

For branch archaeology and donor-branch deletion:
- judge seams by behavior lineage, not path lineage
- use current code and recent merged lineage as the benchmark
- mine donor branches before deleting them
- port only the still-valuable missing remainder into canonical
- delete branches only after their meaningful seams are accounted for as already present, hand-ported, or truly superseded

Working order:
mine first -> prune second -> harden third -> move forward fourth