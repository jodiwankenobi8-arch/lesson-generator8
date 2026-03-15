# lesson-generator8

Teacher-facing lesson generation studio with a 3-step flow:

**Inputs -> Materials -> Results**

The app takes teacher lesson inputs plus uploaded curriculum and exemplar materials, analyzes them, builds a blueprint, and generates a classroom-ready lesson package.

## Current product direction

This project is no longer in the early mock-replacement stage.
It is now in the **hardening phase**.

Current engineering focus:
- material trust and reliability
- source selection and explainability
- coverage-first behavior
- teacher control surfaces
- real export generation
- bounded AI later, without replacing deterministic control

## Locked product rules

- **Curriculum = content authority**
- **Exemplar = presentation authority**
- Detect what uploaded materials already cover
- Avoid duplicating strong source coverage
- Ask before adding meaningful missing areas
- AI must not replace deterministic extraction, blueprint orchestration, or trust surfaces

## Current workflow rules

- Beginner-safe steps
- One PowerShell paste at a time
- Biggest safe chunk
- Inspect the real file/contract first
- One clean edit
- Immediate verification
- Frequent build/test
- Checkpoint every 2-3 meaningful steps
- No brittle patch stacking
- No raw TypeScript pasted directly into PowerShell

## Current repo status summary

The repo already includes:
- real extraction with parser-first behavior and partial OCR fallback
- role-specific structured material analysis
- blueprint construction with content/structure separation
- planning/spec/package layers
- results rendering and pipeline trace concepts
- typed export artifact contracts

The current major hardening track is the **Material Reliability layer**, followed by stronger source selection, coverage-first behavior, teacher-choice flows, exemplar transformation UX, real exports, and later OCR/performance hardening.

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
> Note: this repo uses Vitest, so Jest-style flags like --runInBand are not supported.

```

Run engine tests only:

```powershell
npm run test:engine
```

Build for production:

```powershell
npm run build
```

## Notes for future continuation

- Canonical working repo:
  `C:\Users\jodiw\Desktop\lesson-generator8-local`
- Do not continue from the older OneDrive repo copy
- Use local project files as code truth
- Treat uploaded memorialization documents as reference material and roadmap context
