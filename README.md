# lesson-generator8

Teacher-facing lesson generation studio with a 3-step flow:

**Inputs -> Materials -> Results**

The app takes teacher lesson inputs plus uploaded curriculum and exemplar materials, analyzes them, builds a blueprint, and generates a classroom-ready lesson package.

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
- Detect what uploaded materials already cover
- Avoid duplicating strong source coverage
- Ask before adding meaningful missing areas unless the teacher explicitly requests them
- AI must not replace deterministic extraction, blueprint orchestration, or trust surfaces
- Optional outputs should appear only when requested or strongly source-grounded
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

Current active seam:
- **Step 3C: secondary evidence grouping in Results**
- keep Results teacher-first
- keep PackageSummarySection, PackageOutputsSection, and CoverageDecisionsSection primary
- move deeper trace / proof / selected-source evidence into clearly secondary surfaces
- preserve trust and provenance without making Results feel like a debug panel

## Active documentation chain

For current continuation, use this order:
1. START_HERE_CURRENT_TRUTH.md
2. AGENTS.md
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
