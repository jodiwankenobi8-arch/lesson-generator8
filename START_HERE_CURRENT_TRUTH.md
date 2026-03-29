# START_HERE_CURRENT_TRUTH.md

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 7375ebb
- Last auto-sync UTC: 2026-03-29T09:23:35Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## Current repo truth
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Current milestone: teacher-minimal surface, drag-and-drop upload lanes, and teacher-facing wording/status consistency on top of the pushed OCR runtime stability checkpoint
- Current active seam: keep the main interface limited to teacher-needed status, upload actions, ready/useful outputs, and clear export language without reopening hidden evidence or diagnostics

## What is actually landed in this local bundle
- the pushed OCR runtime stability seam at 73944f4 is treated as locked current truth and is not reopened here
- Inputs now uses more teacher-facing setup language for lesson basics, lesson-plan parts, and lesson outputs
- Inputs continues to keep centers separate from teacher-led support
- Materials now shows teacher-minimal upload lanes with drag-and-drop plus browse-file fallback
- drag-and-drop upload handling still honors the current supported upload contract instead of widening formats implicitly
- Materials now uses simpler teacher-facing status text like ready to use / needs teacher review / getting it ready now
- Results now keeps the main surface teacher-first and status-first, with clearer download/export wording
- Results required-input messaging now matches the actual current required fields more closely

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- generation depends on usable materials
- status may stay visible; internal reasoning/trust diagnostics should stay out of the main teacher surface
- screenshots/photos remain a bounded OCR recovery lane under the current listed formats only
- do not widen supported upload types implicitly while improving UX
- centers = student-independent work
- teacher-led support stays separate from centers

## Validation snapshot for this seam
Run in this order inside the full repo:
1. `npx vitest run src/pages/MaterialsPage.test.ts src/pages/ResultsPage.test.ts`
2. `npm run build`

Local note:
- targeted page tests passed after the wording/status consistency pass
- browser/manual verification still needs to be updated by hand

## Exact next move after validation
- do a short browser/manual pass on Inputs, Materials, and Results
- confirm drag-and-drop works for supported files and rejects unsupported files cleanly
- confirm Materials status copy and Results export/download language feel teacher-facing in the live UI
- only after that, choose any additional small polish from direct live UI evidence instead of reopening hidden evidence/trust surfaces
