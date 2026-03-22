# lesson-generator8 materials-upload runtime handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue from the existing handoff, inspect the live Materials upload path, diagnose why curriculum/exemplar files appear immediately but stall in queue state, and preserve the product rule that curriculum controls lesson content while exemplar controls structure/style/pacing.

## Canonical project assumptions

Only assumptions supported in this chat:

* The project is `lesson-generator8-hardened` / repo `jodiwankenobi8-arch/lesson-generator8`.
* Product rule: curriculum is content authority; exemplar is presentation authority.
* User preferences are project requirements for ongoing help: one Windows PowerShell paste at a time, low-friction workflow, immediate visible progress, preserve uploads across navigation, clarify mixed lessons before generation, avoid re-explaining context.
* GitHub repo context previously referenced in chat: `jodiwankenobi8-arch/lesson-generator8`.

## What was reviewed

* code files: reviewed live snippets from `src/pages/MaterialsPage.tsx`, `src/utils/readUploadedText.ts`, and `src/utils/extractLessonMaterialSources.ts`
* commits: only SHAs mentioned in pasted handoff notes were referenced (`5042452`, `7d97a2a`, `c120996`); commits were not directly inspected in this chat
* PRs: none reviewed in this chat
* issues: none reviewed in this chat
* terminal output: reviewed PowerShell command output, `git diff`, `npm run build`, and runtime screenshot-based verification
* pasted handoff notes: reviewed the detailed project handoff provided at the start of this chat

## Current state

The materials upload path was narrowed to a runtime seam in `MaterialsPage.tsx`. The queue placeholder rows render immediately, but after patching they still stall at the first queued state in runtime. Build passes after the applied patch. The current evidence suggests the code is stopping before the second queue-state update and before promotion into `materialsPack` / `exemplarPack`. The most likely next seam to inspect is `nextPaint` / any paint-wait helper used between the first and second queue updates.

## Decisions made

* Treat the main remaining bug as a live runtime seam, not as solved by prior commits alone.
* Prioritize behavior verification over assuming commit history equals correctness.
* Treat the assets-area merge logic as likely correct after inspection; if a real uploaded item reaches `materialsPack` / `exemplarPack`, it should display.
* Remove brittle `DataTransfer` usage from `singleFileList` and replace it with a plain `File[]` path.
* Harden extraction plumbing so per-file extraction failure does not silently freeze placeholder rows.
* Add explicit per-file queue-status transitions and visible failure states in the upload handlers.
* Keep the core product rule intact: curriculum should drive content; exemplar should drive structure/style/pacing.

## Completed work

* Inspected the current live* Confirmed the prior handler shape inserted placeholder queue rows and only promoted items after extraction succeeded.
* Inspected `src/utils/readUploadedText.ts` and confirmed `readTextIfPossible` generally falls back for PDF/PPTX/image/docx paths rather than intentionally throwing on known file types.
* Inspected `src/utils/extractLessonMaterialSources.ts` and confirmed it previously awaited `readTextIfPossible(file)` without a local per-file try/catch.
* Inspected the Materials page rendering/merge logic and confirmed real files from `materialsPack` / `exemplarPack` should appear, while queued placeholders are only shown when no matching real asset exists.
* Identified `singleFileList(file)` using `new DataTransfer()` as a brittle runtime seam.
* Applied a patch that:

  * changed `singleFileList` from `FileList | null` via `DataTransfer` to plain `File[]`
  * updated `extractLessonMaterialSources` / `extractFilesToUploaded` to accept `FileList | File[] | null`
  * added per-file extraction try/catch in `extractLessonMaterialSources`
  * wrapped both upload handlers in `try/finally`
  * added visible per-file queue transitions and explicit `Upload failed` state
* Verified the patch with `git diff`.
* Ran `npm run build` successfully.
* Ran runtime verification and captured evidence that the live UI still stalls at:

  * `Upload: Queued`
  * `Evaluation: Preparing file`
  * `Pipeline: Waiting to start extraction`

## Remaining work

* Inspect and likely patch the exact `nextPaint` implementation and all call sites in `src/pages/MaterialsPage.tsx`.
* Confirm whether `await nextPaint()` is the actual runtime stall point before extraction starts.
* After fixing the stall, re-test with one curriculum PDF and one exemplar PPTX to verify:

  * queue row appears immediately
  * status advances beyond initial queued state
  * item either promotes into real assets or shows explicit failure
* After Materials runtime is stable, resume generator hardening work:

  * `src/engine/blueprint/buildBlueprint.ts`
  * `src/engine/generateLesson.ts`
* Preserve product constraints not yet fully validated in this chat:

  * uploads persist across navigation
  * Results cannot open while processing is incomplete
  * mixed lessons are clarified before generation
  * curriculum content authority and exemplar presentation authority remain enforced
  * results traceability remains visible and trustworthy

## Next steps

1. Inspect the exact `nextPaint` implementation and every occurrence of `nextPaint`, `requestAnimationFrame`, and `setTimeout` in `src/pages/MaterialsPage.tsx`.
2. Patch or bypass the paint-wait seam if it can hang in this runtime.
3. Re-run `npm run dev` and retest with one curriculum PDF and one exemplar PPTX.
4. Confirm that successful files move into the real assets area and failed files surface as explicit failures.
5. Only after Materials runtime is stable, continue to `src/engine/blueprint/buildBlueprint.ts` and then `src/engine/generateLesson.ts` to strengthen curriculum-vs-exemplar separation.
6. Later, improve Results traceability so the user can see why curriculum changed content and exemplar changed structure/cues/style.

## Important evidence

* file paths:

  * `src/pages/MaterialsPage.tsx`
  * `src/utils/readUploadedText.ts`
  * `src/utils/extractLessonMaterialSources.ts`
  * `src/state/useLessonStore.ts`
  * `src/engine/blueprint/buildBlueprint.ts`
  * `src/engine/curriculum/extractCoverageFromCurriculum.ts`
  * `src/utils/extractLessonMaterialSources.ts`
* SHAs mentioned in pasted handoff notes:

  * `5042452` — `Stabilize materials queue rendering, status, and removal`
  * `7d97a2a` — `Checkpoint existing blueprint, curriculum extraction, store, and upload text changes`
  * `c120996` — `Fix materials queue rendering and removal behavior`
* PRs:

  * none referenced in this chat
* commands actually referenced:

  * `Get-Content` inspections of `MaterialsPage.tsx`, `readUploadedText.ts`, and `extractLessonMaterialSources.ts`
  * `git diff -- src/pages/MaterialsPage.tsx src/utils/extractLessonMaterialSources.ts`
  * `npm run build`
  * `npm run dev`

## Risks / cautions

* Do not assume prior commits solved runtime behavior; this chat found a live seam that still reproduces after build passes.
* Do not do blind broad replacements without inspecting current file contents first; earlier history included brittle patch attempts and orphaned code fragments.
* Do not bypass the product rule: exemplar should not hijack lesson topic/content.
* Do not move on to blueprint/generator hardening until the Materials runtime path is actually stable.
* Do not delete or ignore queue/status logic without preserving immediate visible progress and persistence expectations.
* Keep working one Windows PowerShell paste at a time.

## Next action

Continue from this handoff by inspecting the exact `nextPaint` implementation and every `nextPaint`/`requestAnimationFrame` call in `src/pages/MaterialsPage.tsx`, because the runtime is still stalling at the first queued state before extraction starts.