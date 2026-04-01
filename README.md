# lesson-generator8

Teacher-facing lesson generation studio with a 3-step flow:

**Inputs -> Materials -> Results**

The app takes teacher lesson inputs plus uploaded curriculum and exemplar source files, analyzes them, builds a blueprint, and generates a classroom-ready lesson package.

Current intake is upload-file based. Supported source files on the Materials page are `.txt`, `.pdf`, `.docx`, `.pptx`, `.html`, `.htm`, `.png`, `.jpg`, `.jpeg`, and `.webp`.

Curriculum remains the content authority. Exemplar remains the presentation and structure authority.

Optional lesson parts and outputs should appear only when explicitly requested or strongly source-grounded.
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
- real extraction with parser-first document parsing, bounded PDF OCR fallback, and bounded image OCR for uploaded screenshots and photos
- role-specific structured material analysis
- blueprint construction with content/structure separation
- planning / spec / package layers
- results rendering with teacher-readable trust, traceability, and pipeline evidence surfaces
- typed export artifact contracts
- request-aware planning / package behavior
- Results visibility alignment for optional teacher-facing outputs
- export support wording parity across lesson-plan, printables, DOCX headings, and related tests
- automated generated-artifact Results/export flow coverage through `useLessonStore` plus `downloadExportArtifact`

Current repo truth:
- Materials upload-type visibility seam is closed on current main
- The Materials page explicitly lists supported source files: .txt, .pdf, .docx, .pptx, .html, .htm, .png, .jpg, .jpeg, and .webp
- Both Materials upload inputs use `accept=".txt,.pdf,.docx,.pptx,.html,.htm,.png,.jpg,.jpeg,.webp"`
- Results uses the newer teacher-first support lane structure
- Uploaded screenshots and photos are supported through a bounded OCR recovery lane and may still be caution-scored or blocked if OCR does not recover strong readable text
- `useLessonStore` remains the orchestration seam
- A live local inspect confirmed `main` matched `origin/main` and the worktree was clean when this README was refreshed

Documentation note:
- `README.md` is a public-facing repo summary, not the authoritative continuation launcher
- For exact current continuation truth, use `AGENTS.md` -> `START_HERE_CURRENT_TRUTH.md` -> `PROJECT_CURRENT_STATE.md` -> latest relevant handoff
- Older checkpoint and active-seam text previously carried here should be treated as historical once it conflicts with live repo truth
- Do not reopen prior closed seams without live regression evidence
## Active documentation chain

For current continuation, use this order:
1. AGENTS.md
2. START_HERE_CURRENT_TRUTH.md
3. PROJECT_CURRENT_STATE.md
4. docs/chat-handoffs/README.md
5. the latest relevant file in docs/chat-handoffs/

Treat older notes as historical context only unless they still match the live repo.
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

