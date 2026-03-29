# START_HERE_CURRENT_TRUTH.md

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 73944f4
- Last auto-sync UTC: 2026-03-29T00:00:00Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## Current repo truth
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Current milestone: teacher-minimal surface and drag-and-drop hardening on top of the pushed OCR runtime stability checkpoint
- Current active seam: keep the main interface limited to teacher-needed status, package outputs, and clear actions while adding drag-and-drop upload lanes that still obey the current supported upload contract

## What is actually landed in this local bundle
- the pushed OCR runtime stability seam at 73944f4 is treated as locked current truth and is not reopened here
- Inputs now points to Materials with a shorter teacher-facing upload summary instead of contract-heavy intake wording
- Materials now shows teacher-minimal upload lanes with drag-and-drop plus browse-file fallback
- drag-and-drop upload handling still honors the current supported upload contract instead of widening formats implicitly
- Materials now keeps the main surface focused on upload actions, status, ready/processing counts, and generation readiness
- Materials no longer shows extraction trace, preview, trust-profile, or reasoning-heavy detail on the main interface
- Results now keeps the main surface teacher-first and status-first, hides the secondary evidence panel from the main page, and simplifies teacher decision cards

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- generation depends on usable materials
- status may stay visible; internal reasoning/trust diagnostics should stay out of the main teacher surface
- screenshots/photos remain a bounded OCR recovery lane under the current listed formats only
- do not widen supported upload types implicitly while improving UX

## Validation snapshot for this seam
Run in this order inside the full repo:
1. `npx vitest run src/pages/MaterialsPage.test.ts src/pages/ResultsPage.test.ts src/engine/materials/sourceIntakeContract.test.ts src/engine/extraction.test.ts`
2. `npm run build`

If the full repo is unavailable in this environment, run `verify_changes.ps1` and treat browser/manual checking as the next local follow-up.

## Exact next move after validation
- do a short browser/manual pass on Inputs, Materials, and Results
- confirm drag-and-drop works for supported files and rejects unsupported files cleanly
- confirm Results now feels teacher-minimal with package/status/exports first
- only after that, choose any additional small polish from direct live UI evidence instead of reopening hidden evidence/trust surfaces
