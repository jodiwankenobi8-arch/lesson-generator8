# lesson-generator8 chat handoff - ontradictory-states-over-time-so-the-final-persistence-behavior-should-be-re-verified-in-the-ui-not-just-from-code-and-qa.

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Capture the visible work from this chat around lesson-generator8 upload UX, blueprint extraction behavior, persistence across page navigation, and continuation guidance.

## Canonical project assumptions

* The project is `lesson-generator8-hardened`, associated with repo `jodiwankenobi8-arch/lesson-generator8`.
* The app has Inputs, Materials, and Results pages.
* The Materials page accepts curriculum files and exemplar files, extracts readable text, and feeds a blueprint used to generate a lesson package.
* The Results page shows generated lesson outputs, blueprint influence, standards, slide previews, lesson plan previews, and exports.
* The working style for this project in this chat was Windows PowerShell one-paste-at-a-time from the repo root.

## What was reviewed

* code files
* commits
* terminal output
* pasted handoff notes

## Current state

The project has been iterated heavily in this chat around upload persistence and upload-status UX. PDF extraction moved from error-only output to readable extracted curriculum text. Curriculum coverage extraction was tightened from noisy output toward shorter teacher-usable items. Mixed instructional target detection in blueprint notes was changed to ask the user which standards/components to include instead of silently assuming a two-part lesson. Persistence for Materials-page uploads was repeatedly patched in `src/pages/MaterialsPage.tsx` and `src/state/useLessonStore.ts`, with multiple syntax regressions repaired and QA repeatedly passing. The latest user-reported state was: uploaded materials no longer disappeared across navigation at least once, exemplar rows showed immediately, curriculum rows still lagged and appeared only after a moment, and the remaining priority was to make curriculum and exemplar both appear immediately with live status updates.

## Decisions made

* Behavior lineage mattered more than path lineage: the key behavior to preserve is immediate visible upload rows with progressive status updates, not just passing smoke tests.
* Mixed instructional target handling should clarify intent instead of guessing; the desired note became: ask which standards to include and whether to generate the full lesson, both components, or only a selected portion.
* Upload persistence should preserve curriculum and exemplar materials across page navigation; repeated re-entry was not acceptable UX.
* Results should not advance while materials are still processing.
* QA passing was treated as necessary but not sufficient because the smoke tests were not covering the real upload UX expectations.

## Completed work

* PDF extraction moved beyond the earlier `GlobalWorkerOptions.workerSrc` failure and readable curriculum PDF text began appearing in blueprint JSON.
* `extractCoverageFromCurriculum.ts` was repeatedly revised and improved from surfacing raw extraction errors / excessive noisy items toward shorter curriculum focus items such as:

  * Read CVC and CVCe words with long A (a_e pattern)
  * Read CVCe words with long A (a_e pattern) (e.g. made)
  * Read words with silent E (long A)
* `buildBlueprint.ts` mixed-target note was updated to instruct asking the user which standards/components to include.
* Persistence wiring was added in `MaterialsPage.tsx` and later also through Zustand workspace state in `useLessonStore.ts`.
* Multiple syntax failures introduced during patching were repaired, including duplicate declarations, stray braces, top-level return/export issues, and regex mistakes.
* QA gate repeatedly passed after repairs, including build plus 13 Playwright smoke tests.

## Remaining work

* Curriculum uploads still do not visually appear immediately the same way exemplar uploads do; exemplar is closer to the desired UX than curriculum.
* Both curriculum and exemplar need consistent immediate placeholder rows plus real-time status changes such as uploading, extracting, scanning, analyzing, and ready.
* The app should block navigation/generation to Results while any uploaded items are still processing.
* Materials persistence should be validated end-to-end; this chat reported c* Mixed-target detection is still broad because uploaded curriculum can contain both phonics and comprehension language; Long A phonics cases were still sometimes flagged as mixed.
* Canonical trace visibility on Results was still inconsistent in some user-reported runs (for example showing canonical materials / blueprint influence as zero while blueprint summary clearly referenced uploaded materials).

## Next steps

1. Inspect `src/pages/MaterialsPage.tsx` and compare `onPickMaterials`, `onPickExemplar`, `UploadDropZone`, and the curriculum/exemplar `UploadDropZone` call sites side by side.
2. Make curriculum and exemplar use the same immediate queue-rendering path: render queued placeholder rows from `materialsItemQueue` / `exemplarItemQueue` before extraction finishes, then transition naturally to the real saved uploaded items.
3. Verify that `UploadDropZone` renders both saved files and queued placeholder rows that are not yet represented in the saved files arrays.
4. Re-test navigation away from and back to Materials to ensure curriculum and exemplar entries remain visible without needing re-upload.
5. Add or update gating so Results/generation does not proceed while queue items are not ready.
6. Re-check `buildBlueprint.ts` mixed-target detection and tighten it so simple phonics lessons are not over-classified as mixed merely because curriculum PDFs contain comprehension language elsewhere.
7. Re-check Results trace visibility so canonical material influence and blueprint influence reflect actual uploaded files.

## Important evidence

* Files referenced:

  * `src/pages/MaterialsPage.tsx`
  * `src/state/useLessonStore.ts`
  * `src/engine/blueprint/buildBlueprint.ts`
  * `src/engine/curriculum/extractCoverageFromCurriculum.ts`
  * `src/utils/extractLessonMaterialSources.ts`
* Commands repeatedly referenced:

  * `npm run qa`
  * PowerShell file patching via `Get-Content`, `WriteAllText`, `WriteAllLines`, `Resolve-Path`, regex replacement, and local inspection line dumps
* Observed QA evidence:

  * build succeeded
  * Playwright smoke suite reported `13 passed`
* User-reported behavior evidence:

  * Exemplar uploads showed immediately
  * Curriculum uploads lagged and appeared after a moment
  * At several points uploaded items disappeared when navigating away and back
  * Later user reported: “It didn't disappear!!!!!!” followed by the remaining issue that curriculum should appear immediately like exemplar
* Results / blueprint evidence captured in chat:

  * Blueprint notes included curriculum focus items for Long A / CVCe / silent e
  * Mixed-target note was revised to ask which standards/components to include
  * Results sometimes showed canonical materials / blueprint influence as zero despite blueprint summary showing curriculum/exemplar usage

## Risks / cautions

* Do not assume QA smoke coverage proves the upload UX is correct; this chat showed repeated cases where QA passed while the user-facing behavior was still wrong.
* Do not delete or bypass persistence logic without verifying whether `MaterialsPage.tsx` local draft handling and `useLessonStore.ts` workspace `materialsDraft` are both still in play; they were layered in over multiple repair attempts.
* Do not revive earlier noisy curriculum extraction behavior that produced hundreds of low-value items or surfaced raw PDF extraction error strings.
* Do not silently split mixed lessons; the requested behavior is to ask the user which standards/components to include.
* Avoid broad destructive cleanup because the repo was known to contain unrelated staged, unstaged, and untracked files during this chat.

## Next action

Start in `src/pages/MaterialsPage.tsx`. Compare the curriculum and exemplar upload flows, especially `onPickMaterials`, `onPickExemplar`, `UploadDropZone`, and the call sites that pass queue state. Make curriculum follow the same immediate placeholder-row rendering behavior as exemplar, then verify navigation persistence and Results gating against live processing state.