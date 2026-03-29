# Teacher-facing wording and status followup handoff

## Repo
- Repo: `jodiwankenobi8-arch/lesson-generator8`
- Branch: `main`
- Published checkpoint treated as current pushed truth: `7264ae4`
- This pass is a local follow-up on top of the drag-and-drop / teacher-minimal surface seam

## What landed in this pass
- kept the pushed OCR runtime stability seam closed
- kept the drag-and-drop and teacher-minimal Materials surface intact
- made Inputs more teacher-facing around lesson basics, lesson-plan parts, and lesson outputs
- kept centers separate from teacher-led support in visible Inputs language
- simplified Materials status wording so it reads as ready to use / needs teacher review / getting it ready now
- simplified Results status and download wording so it reads less like internal export language
- aligned Results required-input blocked-state copy more closely to the current required fields

## Narrow validation run
- `npx vitest run src/pages/MaterialsPage.test.ts src/pages/ResultsPage.test.ts`
- targeted page tests passed locally
- build should also be green for this checkpoint before commit
- browser/manual pass still needs to be done by hand

## Best next seam
Do not reopen the pushed OCR runtime seam unless direct live-code evidence shows regression.

Do not reintroduce trust-profile or reasoning-heavy panels on the main interface by default.

The next best seam is a short live browser/manual closeout:
- verify drag-and-drop behavior for supported and unsupported files
- verify Materials status text feels teacher-facing in live use
- verify Results still feels complete without the hidden evidence panel
- make only small polish edits from direct live UI evidence if needed