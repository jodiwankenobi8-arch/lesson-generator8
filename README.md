# lesson-generator8

Teacher-facing lesson transformation studio with a 3-step flow:

Inputs -> Materials -> Results

The app takes teacher lesson inputs plus uploaded curriculum and exemplar source files, analyzes them, builds a blueprint, and generates teacher-usable outputs.

Current intake is upload-file based. Supported source files on the Materials page are `.txt`, `.pdf`, `.docx`, `.pptx`, `.html`, `.htm`, `.png`, `.jpg`, `.jpeg`, and `.webp`.

## Current product charter

Lesson Generator 8 is a template-preserving lesson transformation system.

Its primary job is to:
- start from grounded lesson content
- optionally use a trusted exemplar shell for a requested output
- preserve the instructional structure that makes that exemplar effective
- replace lesson-specific content with new grounded content fast
- produce teacher-usable outputs without drifting into generic AI lesson synthesis

The original and still-canonical goal is not "generate a generic package." It is to transform trusted teacher outputs into new grounded versions while preserving the parts that make them work.

## Authority model

- Curriculum = content authority
- Exemplar = optional structure / style authority
- Content-bearing outputs should not be generated without sufficient content grounding.
- Missing exemplar should not block generation by itself.
- If no exemplar is provided for an output, the app should use a trustworthy default artifact shell for that output.
- If an exemplar is provided, it should shape that output without overriding grounded content.

## Exemplar model

- Teachers may upload multiple materials in each lane, not just one curriculum file and one exemplar file.
- Different exemplars may target specific outputs such as slides, lesson plan, centers / rotation, teacher-led support, intervention, printables, or the shared package structure.
- Any final output can have its own exemplar.
- Exemplar influence should be scoped by artifact rather than treated as one global style switch.
- Exemplar custom notes are for restyling or teacher preference overrides while preserving desired exemplar structure.
- Style variation is allowed, but it should layer on top of the shell rather than replacing the shell.

## Locked product rules

- Detect what uploaded materials already cover.
- Avoid duplicating strong source coverage.
- Ask before adding meaningful missing areas unless the teacher explicitly requests them.
- Optional lesson parts and outputs should appear only when requested or strongly source-grounded.
- Opening and objective are treated as separate lesson parts.
- Multi-area lessons should surface ordered lesson portions instead of one vague mixed block.
- Centers = student-independent work.
- Small group / intervention = teacher-led support.
- Centers and teacher-led support may coexist during the same lesson block, but they are not the same lane.
- AI must not replace deterministic extraction, blueprint orchestration, or trust surfaces.

## Current execution frame

This project is in hardening / finishing / targeted-refinement mode, not rescue or broad rebuild mode.

Current focus:
- trust and reliability
- teacher-facing coherence
- source selection clarity
- exemplar payoff
- materials continuity and status honesty
- results trust surfaces
- artifact usefulness
- bounded parsing / OCR improvements where they materially improve grounded output quality

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

## Active documentation chain

For current continuation, use this order:
1. `AGENTS.md`
2. `START_HERE_CURRENT_TRUTH.md`
3. `PROJECT_CURRENT_STATE.md`
4. `docs/chat-handoffs/README.md`
5. the newest relevant file in `docs/chat-handoffs/`

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

    npm install
    npm run dev

Open the local Vite URL shown in the terminal.

## Verification commands

Typecheck:

    npm run typecheck

Run all tests:

    npm run test

Run engine tests only:

    npm run test:engine

Build for production:

    npm run build

## Notes for future continuation

- Use the repo files in the current working tree as code truth.
- Use the active documentation chain above for continuation.
- If notes conflict with live code/tests, trust the live repo first.
- Keep the worktree free of unrelated staging before the next seam.
- Do not let closeout-only notes erase the product charter, artifact-scoped exemplar model, or the optional-exemplar/default-shell rule.