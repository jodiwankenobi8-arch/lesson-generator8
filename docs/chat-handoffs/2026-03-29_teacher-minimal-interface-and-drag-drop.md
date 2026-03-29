# Teacher-minimal interface and drag-and-drop handoff

## Repo
- Repo: `jodiwankenobi8-arch/lesson-generator8`
- Branch: `main`
- Published checkpoint treated as current pushed truth: `73944f4`
- This patch is a local follow-up bundle, not a pushed checkpoint.

## What landed in this pass
- kept the pushed OCR runtime stability seam closed
- shortened Inputs intro copy so the next step is described in teacher language instead of contract-heavy intake wording
- turned both Materials lanes into drag-and-drop upload zones with browse-file fallback
- kept drag-and-drop on the same supported upload contract instead of widening file support implicitly
- removed reasoning-heavy Materials detail from the main interface: no extraction trace, preview, or trust-profile style block on the default page
- hid the secondary Results evidence panel from the main interface
- simplified teacher decision cards so they focus on the choice and current status rather than evidence-detail walls

## Why this mattered
The visible interface was still carrying more internal reasoning/trust detail than a teacher needs on the main path. The safer finish-oriented move was to keep status and package usefulness visible while pushing diagnostic detail out of the default interface.

## Narrow validation target
Run only:
- `npx vitest run src/pages/MaterialsPage.test.ts src/pages/ResultsPage.test.ts src/engine/materials/sourceIntakeContract.test.ts src/engine/extraction.test.ts`
- `npm run build`
- then do a short browser/manual pass on Inputs, Materials, and Results

## Best next seam
Do not reopen the pushed OCR runtime seam unless direct live-code evidence shows regression.

Do not reintroduce trust-profile or reasoning-heavy panels on the main interface by default.

The next best seam is a short live browser/manual closeout:
- verify drag-and-drop behavior for supported and unsupported files
- verify Results still feels complete without the hidden evidence panel
- make only small polish edits from direct live UI evidence if needed
