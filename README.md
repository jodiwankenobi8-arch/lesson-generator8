# lesson-generator8

Teacher-facing lesson generation studio with a 3-step flow:

**Inputs -> Materials -> Results**

The app takes teacher lesson inputs plus **multiple uploaded curriculum materials and multiple uploaded exemplar materials**, analyzes them, builds a blueprint, and generates a classroom-ready lesson package.

Curriculum uploads can include several source types together when that helps build stronger content grounding, such as lesson slides, worksheets, screenshots, teacher text companion pages, and other curriculum artifacts.

Exemplar uploads can also include several source types together when that helps shape presentation and structure, such as slide decks, lesson plans, centers examples, and other model materials.

## Current product direction

This project is in the **hardening / finishing phase**.

Current focus:
- trust and reliability
- source selection clarity
- coverage-first behavior
- teacher control surfaces
- clean architecture
- results trust surfaces that remain visible without making the app feel like a debug panel
- real export usefulness
- bounded AI later, without replacing deterministic control

## Locked product rules

- **Curriculum = content authority**
- **Exemplar = presentation / structure authority**
- Teachers may upload **multiple materials in each lane**, not just one curriculum file and one exemplar file
- Detect what uploaded materials already cover
- Avoid duplicating strong source coverage
- Ask before adding meaningful missing areas unless the teacher explicitly requests them
- AI must not replace deterministic extraction, blueprint orchestration, or trust surfaces
- Optional lesson parts and outputs should appear only when requested or strongly source-grounded
- Centers = student-independent work
- Small group / intervention = teacher-led support
- Centers and teacher-led support may coexist during the same lesson block, but they are not the same lane

## Current repo status summary

The repo already includes:
- real extraction with parser-first behavior and partial OCR fallback
- role-specific structured material analysis
- blueprint construction with content/structure separation
- planning / spec / package layers
- results rendering with teacher-readable trust, traceability, and pipeline evidence surfaces
- typed export artifact contracts
- request-aware planning / package behavior
- Results visibility alignment for optional teacher-facing outputs
- export support wording parity across lesson-plan, printables, DOCX headings, and related tests
- automated generated-artifact Results/export flow coverage through `useLessonStore` plus `downloadExportArtifact`

Current validated checkpoint:
- **generated-artifact Results/export flow seam pushed at `1fab6c2`**
- `npm test` passed
- `npm run build` passed
- `npm run typecheck` passed

Current active seam:
- **docs/status alignment after pushed checkpoint `1fab6c2`**
- keep README and continuation docs aligned with current repo truth
- treat any remaining export follow-up as **optional browser/UI-only work**
- do not reopen prior closed seams without proof

## Active documentation chain

For current continuation, use this order:
1. AGENTS.md
2. START_HERE_CURRENT_TRUTH.md
3. PROJECT_CURRENT_STATE.md
4. docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt
5. the latest relevant file in docs/chat-handoffs/

Treat older notes and deleted architecture docs as historical context only unless explicitly re-adopted.

## Current workflow rules

- Beginner-safe steps
- One PowerShell paste at a time
- Biggest safe coherent chunk
- Inspect the real file / contract first
- One clean edit
- Immediate verification
- Frequent build / test
- Checkpoint after meaningful progress
- No brittle patch stacking
- No raw TypeScript pasted directly into PowerShell

## Quick start

First-time setup and local run:

```powershell
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Verification commands

Typecheck:

```powershell
npm run typecheck
```

Run all tests:

```powershell
npm run test
```

Note: this repo uses Vitest, so Jest-style flags like `--runInBand` are not supported.

Run engine tests only:

```powershell
npm run test:engine
```

Build for production:

```powershell
npm run build
```

## Notes for future continuation

- Use the repo files in the current working tree as code truth
- Use the active documentation chain above for continuation
- If notes conflict with live code/tests, trust the live repo first
- Keep the worktree free of unrelated staging before the next seam
