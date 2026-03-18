# lesson-generator8 chat handoff: source-grounded generation and repo workflow

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: continue practical hardening of lesson-generator8 for teacher use, improve source-grounded lesson generation from uploaded curriculum/exemplars, reduce manual terminal friction, and leave a continuation-ready handoff.

## Canonical project assumptions

* Repo root used throughout the chat was `C:\dev\lesson-generator8-hardened`.
* GitHub repo referenced in terminal output was `jodiwankenobi8-arch/lesson-generator8`.
* Main user workflow right now is personal classroom use as a Kindergarten teacher.
* Curriculum and exemplar uploads are both important; exemplar influence is especially important for style, order, and function.
* When mixed instructional targets are detected, the preferred behavior is a two-part lesson, especially phonics plus comprehension when appropriate.
* The project already has a local QA workflow and the user prefers one PowerShell paste at a time over manual file editing.

## What was reviewed

* code files
* terminal output
* pasted handoff notes

## Current state

The repo now has working local QA (`npm run qa`) and multiple incremental changes landed around upload processing, mixed-target detection, and file extraction. Curriculum extraction from PPTX/PDF/image sources improved substantially: the blueprint now shows meaningful curriculum coverage items for a Long A test deck instead of empty coverage. However, the confirmed remaining blocker is that the generated runtime package still falls back to generic slide and lesson-plan wording even when the blueprint clearly contains usable curriculum items and planned slide curriculum references. The issue is therefore downstream of extraction and blueprinting, in generation/runtime package creation or consumption, not in raw file ingestion. A temporary ResultsHub change to prefer canonical-package rendering was reverted after it broke smoke tests; QA was restored to green.

## Decisions made

* Prefer behavior lineage over path lineage: follow the actual generated package path rather than assuming blueprint improvements automatically reach rendered output.
* Keep the teacher-facing product grounded in uploaded materials and avoid generic fallback wording when usable curriculum/exemplar signals exist.
* Preserve a low-friction workflow: one PowerShell paste at a time, avoid manual editing where possible.
* Do not keep the ResultsHub canonical-package preference change as-is; it broke smoke tests because seeded canonical data is incomplete.
* Keep local QA green and avoid broad risky changes to results rendering until the engine/runtime issue is understood.
* Cleanup decisions made during the chat: remove `.bak_*` files and `qa-runs/*` clutter locally when they only add noise; do not reset, clean, or restore unrelated work.

## Completed work

* Added a local QA gate script and established `npm run qa`.
* Added a PowerShell convenience workflow including `lg8push`, though `git push` remained i* Added mixed-target detection and blueprint notes that flag potential mixed instructional targets.
* Began two-part lesson handling for phonics plus comprehension scenarios.
* Added staged material-processing UX on the Materials page (uploading/extracting/scanning/analyzing/generating with percent and ETA).
* Replaced upload reading logic with real extraction paths for PPTX, PDF, and image OCR in `src/utils/readUploadedText.ts`.
* Improved curriculum extraction so slide-based teaching materials can be treated as curriculum-like sources instead of being ignored due to role classification.
* Cleaned and prioritized extracted curriculum slide signals in `src/engine/curriculum/extractCoverageFromCurriculum.ts`.
* Confirmed via browser console that blueprint data now includes real curriculum titles and planned slide curriculum refs for the Long A test case.
* Confirmed via browser console that the generated runtime package (`workspace_v3` / legacy engine package) still contains fallback-heavy slides and lesson-plan descriptions.
* Reverted a ResultsHub canonical-package preference experiment after smoke tests failed, and restored QA to passing.

## Remaining work

* Trace the exact runtime generation seam where blueprint curriculum titles stop influencing the generated package.
* Determine why `pkg.slides` and `pkg.lessonPlan` still use fallback wording even though:

  * `generateLesson(input, blueprint)` is called,
  * `resolveLessonContext()` maps `coverageChecklist` into `curriculumTitles`,
  * and the blueprint contains valid curriculum items.
* Re-check generation files that are most likely to still be missing or bypassing the blueprint-derived curriculum flow at runtime.
* Expand exemplar influence so teacher-facing wording, pacing, and order are shaped more strongly by exemplar cues once the curriculum-to-generation seam is resolved.
* Revisit mixed-input UX later: possibly ask whether the user wants a combined lesson or if the mixed inputs were accidental, but keep two-part generation as the current default preference when clearly mixed.
* Avoid reviving the ResultsHub canonical-package preference change until canonical seeded data and/or adapters are complete enough not to break smoke tests.

## Next steps

1. Continue debugging the engine/runtime generation path, not extraction or Results rendering.
2. Reinspect the generation seam using the current runtime evidence already captured:

   * blueprint has curriculum titles,
   * planned slides reference curriculum items,
   * generated package still falls back.
3. Focus next on engine-generation files and any remaining runtime adapters/normalizers that may overwrite or ignore `context.curriculumTitles`.
4. Keep using `npm run qa` after each targeted change and avoid broad ResultsHub modifications.
5. After the seam is fixed, rerun the same real test:

   * Grade K
   * Long A
   * same PPT curriculum
   * no exemplar
     and verify that generated slides and lesson-plan descriptions explicitly use extracted items such as `Let's Read Together - CVC Words`, `Phonemic Awareness - Segment & Spell`, and `Practice Words - tap, tape, cap, cape`.
6. Only after runtime generation is fixed should additional exemplar-style shaping and mixed-two-part refinement continue.

## Important evidence

* Working repo path used in terminal sessions: `C:\dev\lesson-generator8-hardened`
* Branch referenced in terminal output: `feat/hardened-pass5-runtime-and-polish-fastfix-phase1-reconcile-phase2-context-phase3-split-phase4-qa`
* Commits shown in terminal:

  * `ae35b71` — `Add two-part mixed lesson handling`
  * `9a0e237` — `Remove local QA run logs`
  * `39ed1f2` — `Fix smoke navigation wait syntax`
  * `2db6eb8` — `Add real PPTX, PDF, and image extraction for uploaded lesson sources`
  * `09e6abe` — `Allow slide-based curriculum extraction from uploaded teaching materials`
  * `d657aa3` — `Use extracted curriculum items in slides and lesson plan`
* Key files reviewed in chat:

  * `src/engine/generateLesson.ts`
  * `src/engine/blueprint/buildBlueprint.ts`
  * `src/engine/curriculum/extractCoverageFromCurriculum.ts`
  * `src/engine/generation/slides.ts`
  * `src/engine/generation/lessonPlan.ts`
  * `src/engine/generation/rotationPlan.ts`
  * `src/engine/generation/centers.ts`
  * `src/engine/lessonContext.ts`
  * `src/engine/spec/buildLessonSpec.ts`
  * `src/pages/MaterialsPage.tsx`
  * `src/pages/ResultsHubPage.tsx`
  * `src/state/useLessonStore.ts`
  * `src/utils/readUploadedText.ts`
  * `src/utils/lesson-package-adapters.ts`
* Commands and checks actually used:

  * `npm run build`
  * `npm run qa`
  * `npx playwright test e2e/smoke.spec.ts --reporter=line`
  * `git status --short`
  * browser-console inspection of:

    * `lessonBlueprintV1`
    * `lesson_generator__workspace_v3`
    * `lesson_generator__engine_package_v1`
    * `lesson_generator__package_v2`
* Confirmed runtime evidence from browser console:

  * `curriculumTitlesFromBlueprint` populated with cleaned PPT-derived items
  * `plannedSlides` includes curriculum refs on `Teach` and `Guided Practice`
  * `pkg.slides` still shows fallback bullets such as `Teaching example: teacher-led modeled example`
  * `pkg.lessonPlan` still shows fallback descriptions
  * `pkg.centers` shows only partial source influence

## Risks / cautions

* Do not assume blueprint improvements automatically reach rendered output; the confirmed problem is a runtime generation seam.
* Do not reapply the ResultsHub canonical-package preference change without also addressing incomplete canonical seeded test data; that change caused multiple Playwright smoke failures and was reverted.
* Do not delete or bypass the local QA workflow; `npm run qa` is now a critical guardrail.
* Do not claim repo-wide review; only the files and behaviors inspected in this chat were reviewed.
* GitHub network connectivity was flaky in this chat; local commits worked, but pushes sometimes failed with connection errors.
* Backup files (`*.bak_*`) and `qa-runs/*` were created during work; they are operational noise, not product evidence.

## Next action

Start the next chat by tracing the engine/runtime generation seam that causes `pkg.slides` and `pkg.lessonPlan` to ignore blueprint-derived curriculum titles even though `generateLesson(input, blueprint)` is called and `resolveLessonContext()` exposes `curriculumTitles`.