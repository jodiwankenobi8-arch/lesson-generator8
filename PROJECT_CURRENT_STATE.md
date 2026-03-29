# PROJECT_CURRENT_STATE.md

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 7264ae4
- Last auto-sync UTC: 2026-03-29T07:59:33Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## Current milestone
Teacher-minimal surface, drag-and-drop hardening, and teacher-facing wording/status consistency on top of the pushed OCR runtime stability checkpoint

## Why this seam exists
The pushed OCR runtime seam is already locked. The biggest safe finish-oriented next chunk in the current bundle was teacher-facing surface cleanup:
- keep only the information a teacher needs visible on the main interface
- keep status and generation readiness visible
- remove reasoning/trust-profile style detail from the main Materials and Results surfaces
- add drag-and-drop upload lanes without weakening the current supported upload contract
- make Inputs, Materials, and Results use consistent teacher-facing wording for readiness, generation, and downloads

## What is now locked locally
- OCR runtime stability at 73944f4 remains current pushed truth
- the visible Inputs intro is shorter and more teacher-facing
- Inputs now uses clearer teacher-facing labels for lesson-plan parts and lesson outputs
- Materials now supports drag-and-drop plus browse-file upload lanes for curriculum and exemplar
- drag-and-drop uses the same supported upload contract instead of silently accepting broader types
- Materials now focuses on upload actions, file status, counts, and generation readiness
- Materials no longer surfaces extraction trace, preview, or trust-profile style diagnostics in the main interface
- Materials status notes are simpler and more teacher-readable
- Results now keeps the main surface focused on package overview, package outputs, teacher decisions, and downloads
- Results required-input blocked-state copy is more consistent with the actual current required fields
- Results download/export copy is more teacher-facing and less internal/technical
- Results no longer renders the secondary evidence panel on the main interface

## Files touched in this pass
- src/pages/InputsPage.tsx
- src/pages/MaterialsPage.tsx
- src/pages/MaterialsPage.test.ts
- src/pages/ResultsPage.tsx
- src/pages/ResultsPage.test.ts
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- docs/chat-handoffs/2026-03-29_teacher-facing-wording-status-followup.md

## Validation for this seam
- `npx vitest run src/pages/MaterialsPage.test.ts src/pages/ResultsPage.test.ts`
- `npm run build`

## Current next step
- do a short browser/manual pass on Inputs, Materials, and Results
- confirm drag-and-drop works for supported uploads and rejects unsupported uploads clearly
- confirm Materials status language and Results download/export language feel teacher-facing in the live UI
- keep additional polish narrow and live-evidence-driven