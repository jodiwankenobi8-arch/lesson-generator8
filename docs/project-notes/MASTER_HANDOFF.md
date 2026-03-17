
---

Imported from: docs/chat-handoffs/2026-03-17_1340_lesson-generator8-initial-context-only.md
Imported at: 2026-03-17 16:42

# lesson-generator8 chat handoff: initial context only
- Date: 2026-03-17
- Repo: jodiwankenobi8-arch/lesson-generator8
- Chat purpose: Capture the current chat state and prepare a clean, evidence-based starting point for a future repo analysis and improvement pass.

## Canonical project assumptions
- The project is an app in progress.
- The target repository is jodiwankenobi8-arch/lesson-generator8.
- The user wants analysis, advice on how to improve and finish the project, and suggestions to make it better.
- This chat did not include repository artifacts or implementation details.

## What was reviewed
- code files: not reviewed in this chat
- commits: not reviewed in this chat
- PRs: not reviewed in this chat
- issues: not reviewed in this chat
- terminal output: not reviewed in this chat
- pasted handoff notes: not reviewed in this chat

## Current state
No repository analysis was performed in this chat. The conversation established the kind of prompt the user could use to request a thorough app review and then requested this GitHub-ready handoff. There is no evidence here about the codebase, architecture, feature set, quality level, or project status beyond the fact that the app is being built.

## Decisions made
- Future analysis should be evidence-based and grounded in actual repo artifacts.
- Do not claim repo-wide review unless code, commits, PRs, issues, or terminal output were actually examined.
- Keep handoffs concise, continuation-ready, and aligned to behavior lineage over path lineage when that distinction matters.

## Completed work
- Drafted a strong prompt template the user could use to ask for app analysis, improvement advice, and finishing guidance.
- Created this concise handoff reflecting only facts supported by this chat.

## Remaining work
- Review the actual repository contents.
- Assess current implementation status, architecture, seams, risks, and blockers.
- Identify what is complete, what is fragile, and what should be prioritized next.
- Produce concrete recommendations for finishing and improving the app.

## Next steps
1. Review the current repo code to determine actual architecture, flow, and implementation status.
2. Check recent commits for active workstreams, regressions, or abandoned directions.
3. Inspect open and recent PRs for pending changes and decision history.
4. Inspect issues for known bugs, roadmap items, and unresolved blockers.
5. Summarize current state, risks, hardening priorities, and highest-leverage next actions.
6. Convert findings into an ordered finish plan with clear keep/cut/postpone recommendations.

## Important evidence
- Repo referenced: jodiwankenobi8-arch/lesson-generator8
- File paths referenced in this chat: none
- SHAs referenced in this chat: none
- PRs referenced in this chat: none
- Commands referenced in this chat: none

## Risks / cautions
- Do not infer technical state, quality, or completion level from this handoff alone.
- Do not claim any code, PR, issue, or terminal review happened in this chat.
- Do not delete, revive, or bypass any part of the project based on this handoff; inspect the repo first.
- Treat this as a minimal context handoff, not an implementation or architecture review.

## Next action
Start the next chat by reviewing the actual repository artifacts for jodiwankenobi8-arch/lesson-generator8 and then produce an evidence-backed project assessment with prioritized recommendations to improve and finish the app.

---

Imported from: docs/chat-handoffs/2026-03-17_1402_.md
Imported at: 2026-03-17 16:42

# lesson-generator8 handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Analyze current project state, reconcile hardening work, refactor core lesson-generation seams, establish reliable local workflow, add/update automated coverage, and prepare continuation-ready handoff.

## Canonical project assumptions

* The project is a teacher-facing lesson-generation app that builds a blueprint from lesson inputs, curriculum files, and exemplar files, then generates a lesson package and exports PPTX, DOCX, and ZIP.
* The clean working repo is `C:\dev\lesson-generator8-hardened`; the old OneDrive-based clone is unreliable and should not be used.
* The active continuation branch in this chat is `feat/hardened-pass5-runtime-and-polish-fastfix-phase1-reconcile-phase2-context-phase3-split-phase4-qa`.
* The app intentionally gates progression/generation until required lesson inputs are filled, including Lesson Title, Objective, and Text / Topic.
* The current results flow hydrates the rendered engine package from workspace storage (`lesson_generator__workspace_v3`, with legacy fallback `lesson_generator__engine_package_v1`), while canonical package storage (`lesson_generator__package_v2`) is separate.

## What was reviewed

* code files
* commits
* terminal output
* pasted handoff notes

## Current state

The project is in an engineering-complete state for the refactor/hardening pass done in this chat. The lesson-generation runtime was reconciled into a runnable branch, shared lesson context was centralized, generation was split into focused modules, build passed, and automated Playwright coverage was updated to match current app behavior. The clean repo outside OneDrive is working. The local branch is clean and, at the end of the chat, has one additional local test commit pending push because GitHub connectivity failed from the user machine.

## Decisions made

* Centralize repeated lesson-state resolution into `src/engine/lessonContext.ts` instead of continuing to duplicate framework / teacher-led / curriculum / cue logic across blueprint/spec/generation.
* Split `generateLesson.ts` into focused generation modules for slides, lesson plan, centers, rotation plan, and interventions rather than adding more logic to one large file.
* Treat the OneDrive clone as unsafe; use the fresh clone at `C:\dev\lesson-generator8-hardened` as the canonical local working repo.
* Use behavior lineage over older UI/storage assumptions when updating tests: smoke tests were rewritten to match current Results labels and current workspace hydration path rather than older package-key assumptions.
* Keep the Results experience teacher-facing first, with trace/debug details secondary and progressively disclosed.

## Completed work

* Reconciled hardening / polish work into a runnable fast-fix branch and resolved a runtime generator issue.
* Added `src/engine/lessonContext.ts` and rewired generation/spec usage around shared lesson context.
* Split generation into:

  * `src/engine/generation/slides.ts`
  * `src/engine/generation/lessonPlan.ts`
  * `src/engine/generation/centers.ts`
  * `src/engine/generation/rotationPlan.ts`
  * `src/engine/generation/interventions.ts`
* Added QA/release-prep docs:

  * `QA_CHECKLIST.md`
  * `RELEASE_NOTES_DRAFT.md`
  * repo snapshot files under `.qa_*`
* Established clean repo outside OneDrive and confirmed:

  * `npm install`
  * `npm run build`
  * clean `git status`
* Updated and passed automated Playwright coverage:

  * `e2e/smoke.spec.ts`
  * `e2e/blueprint.spec.ts`
  * `e2e/teacher-flow.spec.ts`
* Wrote final local checkpoint files:

  * `FINAL_CHECKPOINT.txt`
  * `FINAL_GIT_STATUS.txt`
  * `FINAL_GIT_LOG.txt`
* Created local commit:

  * `ddae129` ΓÇö `test: update blueprint and smoke coverage for current results flow`

## Remaining work

* Push local commit `ddae129` when GitHub/network access from the machine returns.
* Run manual QA not fully covered by seeded browser tests:

  * real curriculum upload flow
  * real exemplar upload flow
  * combined curriculum + exemplar flow
  * saved recovery flow through actual UI use
  * export content quality review for PPTX/DOCX/ZIP
  * final visual/copy pass
* Optionally follow up later on build chunk warnings and any remaining low-priority cleanup, but those were not blockers in this chat.

## Next steps

1. In `C:\dev\lesson-generator8-hardened`, retry:

   * `git push`
   * `git status`
2. Run manual QA in this order:

   * no uploads
   * curriculum only
   * exemplar only
   * curriculum + exemplar
   * kindergarten / grade 1 / grade 2+ framework behavior
   * saved recovery flow
   * export content review
   * final visual/copy pass
3. Log any blockers/high-severity issues found in manual QA and fix only in the clean repo.
4. Re-run:

   * `npm run build`
   * `npm test -- e2e/blueprint.spec.ts`
   * `npm test -- e2e/teacher-flow.spec.ts`
   * `npm test -- e2e/smoke.spec.ts`
5. Decide release/signoff after manual QA.

## Important evidence

* Branches referenced:

  * `feat/hardened-pass5-runtime-and-polish`
  * `feat/hardened-pass5-runtime-and-polish-fastfix`
  * `feat/hardened-pass5-runtime-and-polish-fastfix-phase1-reconcile`
  * `feat/hardened-pass5-runtime-and-polish-fastfix-phase1-reconcile-phase2-context`
  * `feat/hardened-pass5-runtime-and-polish-fastfix-phase1-reconcile-phase2-context-phase3-split`
  * `feat/hardened-pass5-runtime-and-polish-fastfix-phase1-reconcile-phase2-context-phase3-split-phase4-qa`
* Commits referenced:

  * `3292482` ΓÇö Results Hub hierarchy/trace polish
  * `9c013bc` ΓÇö teacher-facing Results copy polish
  * `c7fccbd` ΓÇö curriculum extraction hardening
  * `9219722` ΓÇö blueprint type alignment
  * `608d305` ΓÇö essential-question carry-through
  * `6caab43` ΓÇö reconcile hardening work and patch runtime generator
  * `ed658a5` ΓÇö centralize lesson context across spec and generation
  * `f162692` ΓÇö split lesson generation into focused modules
  * `2c39ee9` ΓÇö docs: add QA checklist and release snapshot
  * `ddae129` ΓÇö test: update blueprint and smoke coverage for current results flow
* File paths referenced:

  * `src/engine/lessonContext.ts`
  * `src/engine/spec/buildLessonSpec.ts`
  * `src/engine/generateLesson.ts`
  * `src/engine/generation/slides.ts`
  * `src/engine/generation/lessonPlan.ts`
  * `src/engine/generation/centers.ts`
  * `src/engine/generation/rotationPlan.ts`
  * `src/engine/generation/interventions.ts`
  * `src/pages/ResultsHubPage.tsx`
  * `src/state/useLessonStore.ts`
  * `src/utils/lesson-package-storage.ts`
  * `src/types/lesson-package.ts`
  * `e2e/smoke.spec.ts`
  * `e2e/blueprint.spec.ts`
  * `e2e/teacher-flow.spec.ts`
  * `QA_CHECKLIST.md`
  * `RELEASE_NOTES_DRAFT.md`
* Commands actually used/recommended in this chat:

  * `npm install`
  * `npm run build`
  * `npm test -- e2e/blueprint.spec.ts`
  * `npm test -- e2e/teacher-flow.spec.ts`
  * `npm test -- e2e/smoke.spec.ts`
  * `git push`
  * `Test-NetConnection github.com -Port 443`

## Risks / cautions

* Do not revive or rely on the old OneDrive clone; it produced `.git/index.lock` problems, false deletions, checkout/reset corruption, and unreliable state.
* Do not assume older Results labels or older storage seeding behavior in tests; those were already shown to be stale.
* Do not bypass page-2 generation gating; required inputs must be filled or the disabled-button behavior is expected.
* Do not claim repo-wide review beyond what was directly examined in this chat; review here focused on the specific files, commits, terminal outputs, and notes referenced above.
* Local branch may still be ahead of origin by one commit until network access returns and `git push` succeeds.

## Next action

Start in `C:\dev\lesson-generator8-hardened` on branch `feat/hardened-pass5-runtime-and-polish-fastfix-phase1-reconcile-phase2-context-phase3-split-phase4-qa`, retry `git push`, then run the remaining manual QA matrix focusing on real upload flows and export content quality.

---

Imported from: docs/chat-handoffs/2026-03-17_1410_ntermittently-blocked-by-network-connectivity-to-github..md
Imported at: 2026-03-17 16:42

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

  * `ae35b71` ΓÇö `Add two-part mixed lesson handling`
  * `9a0e237` ΓÇö `Remove local QA run logs`
  * `39ed1f2` ΓÇö `Fix smoke navigation wait syntax`
  * `2db6eb8` ΓÇö `Add real PPTX, PDF, and image extraction for uploaded lesson sources`
  * `09e6abe` ΓÇö `Allow slide-based curriculum extraction from uploaded teaching materials`
  * `d657aa3` ΓÇö `Use extracted curriculum items in slides and lesson plan`
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

---

Imported from: docs/chat-handoffs/2026-03-17_1415_le-queue-behavior.md
Imported at: 2026-03-17 16:42

# lesson-generator8 chat handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue local hardening and product-fit work for lesson-generator8, focusing on runtime generation issues, Results recovery, mixed-target behavior, storyboard navigation, and Materials intake UX.

## Canonical project assumptions

* Main active local repo path used in this chat was `C:\dev\lesson-generator8-hardened`.
* Main use case is the user's own Kindergarten classroom workflow.
* The product goal is a teacher-ready lesson package grounded in uploaded curriculum and exemplars, not generic planner text.
* The user prefers one PowerShell paste at a time, low-friction workflows, and minimal manual editing.
* Mixed lesson inputs should prefer a two-part lesson only when appropriate; earlier logic overfired for a Long A phonics lesson and needed tightening.

## What was reviewed

* code files
* commits
* terminal output
* pasted handoff notes

## Current state

* Generation/runtime path was repaired earlier in the chat so Results could open again after a `splitMode` wiring bug in `src/engine/generation/slides.ts`.
* `slides.ts` and `lessonPlan.ts` were tightened to reduce over-eager mixed-target detection; QA passed after that work.
* `WizardProgress.tsx` was updated so Inputs / Materials / Results boxes are clickable and navigate directly; QA passed.
* A later Materials intake/persistence/queue pass became unstable due to repeated patching of `src/pages/MaterialsPage.tsx`.
* The latest visible local state in this chat showed `src/pages/MaterialsPage.tsx` with build-breaking syntax/runtime issues during an in-session queue rebuild attempt, including duplicate declarations and unexpected braces.
* A readable transcript export of this chat was created at `/mnt/data/chat_transcript_readable.md`.

## Decisions made

* Keep the workflow recovery-first: restore build stability before adding more Materials features.
* Treat Materials persistence and queue behavior as a layered rebuild, not a patch-on-patch continuation.
* Prefer behavior lineage over path lineage: the key behavior target is trustworthy source processing, not just fast acceptance into local state.
* Do not bypass QA; `npm run qa` remained the acceptance gate throughout the chat.
* Results should not feel instant or fake if uploaded materials are supposed to influence the lesson; future gating should prove materials were read, analyzed, and used.

## Completed work

* Confirmed `generateLesson(input, blueprint)` is the active engine path and that `useLessonStore.ts` calls it.
* Repaired a runtime generation failure caused by `splitMode` not being passed through slide builders in `src/engine/generation/slides.ts`.
* Recovered Results rendering after generation by fixing the runtime path rather than forcing Results to prefer canonical package rendering.
* Improved Teach / Guided grounding so source-aware curriculum items surfaced better in runtime output.
* Tightened mixed-target detection in `src/engine/generation/slides.ts` and `src/engine/generation/lessonPlan.ts`; QA passed.
* Added direct storyboard navigation in `src/pages/WizardProgress.tsx`; QA passed.
* Successfully committed and pushed at least these SHAs referenced in chat:

  * `6465c67` Fix lesson generation runtime and results recovery; improve teach/guided grounding
  * `80e442f` Improve materials intake queue and storyboard navigation
* Verified branch tracking/push status at one point:

  * branch `feat/hardened-pass5-runtime-and-polish-fastfix-phase1-reconcile-phase2-context-phase3-split-phase4-qa`
  * up to date with origin after push
* Generated a readable transcript export file for this chat.

## Remaining work

* Restore `src/pages/MaterialsPage.tsx` to a clean, compiling, stable state if it is still locally broken.
* Rebuild Materials persistence in smaller steps:

  1. persist uploaded materials across page navigation
  2. verify restore works
  3. add clear status display under the drop zones
  4. only then add true per-fi* Revisit Materials trustworthiness so the app can show serious per-file processing evidence rather than appearing to accept files instantly.
* Continue lesson-quality work after Materials stabilizes, especially:

  * validating that Long A now stays a single phonics lesson
  * improving Practice to prefer real curriculum tasks such as extracted word lists
* Clean up transient `qa-runs/` clutter when present, without touching unrelated repo work.

## Next steps

1. From the repo, restore or verify `src/pages/MaterialsPage.tsx` is back to the last known-good committed version if the build is still broken.
2. Run `npm run qa` and do not continue until build and smoke pass.
3. Re-implement Materials persistence only, with a minimal draft restore/save path and hydration guard.
4. Verify this exact flow manually: upload one file on Materials, click Inputs, click Materials, confirm the item remains.
5. After persistence is truly stable, add simple honest status display under the drop zones.
6. Only after that, reintroduce real per-file queue state and stronger ΓÇ£read/analyzed/usedΓÇ¥ gating.
7. Then return to lesson-quality follow-up: re-test the Long A case and strengthen Practice.

## Important evidence

* Repo path used throughout chat: `C:\dev\lesson-generator8-hardened`
* Branch used throughout chat: `feat/hardened-pass5-runtime-and-polish-fastfix-phase1-reconcile-phase2-context-phase3-split-phase4-qa`
* Files repeatedly referenced:

  * `src/utils/readUploadedText.ts`
  * `src/engine/curriculum/extractCoverageFromCurriculum.ts`
  * `src/engine/blueprint/buildBlueprint.ts`
  * `src/engine/lessonContext.ts`
  * `src/engine/spec/buildLessonSpec.ts`
  * `src/engine/generation/slides.ts`
  * `src/engine/generation/lessonPlan.ts`
  * `src/engine/generation/centers.ts`
  * `src/engine/generateLesson.ts`
  * `src/state/useLessonStore.ts`
  * `src/pages/MaterialsPage.tsx`
  * `src/pages/ResultsHubPage.tsx`
  * `src/pages/WizardProgress.tsx`
* SHAs explicitly referenced in chat:

  * `6465c67`
  * `80e442f`
  * earlier visible history also showed `d657aa3`, `5e8a3b2`, `09e6abe`
* Commands repeatedly used:

  * `npm run qa`
  * `git status`
  * `git add ...`
  * `git commit -m "..."`
  * `git push`
  * `git restore src/pages/MaterialsPage.tsx`
* Transcript export created during this chat:

  * `/mnt/data/chat_transcript_readable.md`

## Risks / cautions

* Do not revive the unstable patch-stacked `MaterialsPage.tsx` queue work blindly; rebuild it in smaller slices.
* Do not switch Results to prefer canonical package rendering unless seeded smoke data and adapter paths are updated; this previously broke smoke tests.
* Do not claim uploaded materials were seriously analyzed if the UI only reflects local acceptance into state.
* Do not delete or overwrite unrelated staged/unstaged work while recovering Materials.
* Keep QA green before further UX or product-fit changes.

## Next action

Start by restoring or verifying `src/pages/MaterialsPage.tsx` to a clean compiling state, run `npm run qa`, and only then implement the smallest possible Materials persistence fix so uploaded items survive navigation between Inputs and Materials.

---

Imported from: docs/chat-handoffs/2026-03-17_1419_readuploadedtext-ts-and-verify-whether-a-pdf-ocr-fallback-is-already-present-in-the-current-working-tree.md
Imported at: 2026-03-17 16:42

# lesson-generator8 chat handoff: materials-results-exemplar-pdf-extraction

* Date: 2026-03-10
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: recover Materials flow, re-stabilize Results gating, restore exemplar influence for structure/style only, and identify the remaining curriculum PDF extraction blocker.

## Canonical project assumptions

* Local repo path used in this chat: `C:\dev\lesson-generator8-hardened`
* Branch used in this chat: `feat/hardened-pass5-runtime-and-polish-fastfix-phase1-reconcile-phase2-context-phase3-split-phase4-qa`
* Collaboration preference is one PowerShell paste at a time, terminal-safe only.
* Main user is a Kindergarten teacher and wants teacher-ready lesson packages.
* Uploaded curriculum should strongly influence lesson content.
* Uploaded exemplars should strongly influence style, order, pacing, lesson layout, and teacher-facing flow.
* Exemplars must not donate lesson-specific content such as letters, sounds, sight words, or comprehension topic.
* Mixed-topic detection should prefer a two-part lesson when appropriate, but split detection must stay tight enough not to overfire on a Long A phonics lesson.

## What was reviewed

* code files
* commits
* terminal output
* pasted handoff notes

## Current state

The Materials page and Materials-to-Results flow were recovered and QA is passing. Results gating was fixed so an idle processing state no longer traps the user from advancing. Exemplar influence is partially restored: Results moved from `Presenter cues: 0` to `Presenter cues: 5`, and exemplar cues are now appearing in Results. Curriculum influence is still blocked because uploaded curriculum PDFs are still coming through as fallback-only text instead of readable extracted text, so `Curriculum items: 0` remains in Results for the tested Long A case.

## Decisions made

* Recovery-first approach was used for `src/pages/MaterialsPage.tsx` after unstable patch stacking.
* Materials Results gating was changed so active processing should block with a wait state, but idle processing should not block advancement forever.
* Exemplar influence was explicitly constrained to style, structure, pacing, lesson layout, and teacher-facing flow only.
* Exemplar content must not be used as lesson-specific instructional content.
* `teachingTool` exemplar files were allowed into framework detection and presenter cue extraction because the uploaded PPTX was landing under `sourceRole: "teachingTool"` and was otherwise ignored.
* The next major hardening target was identified as PDF curriculum extraction, not Materials UI.

## Completed work

* Restored `src/pages/MaterialsPage.tsx` to a clean compiling state after brace/patch damage.
* Repaired missing helper/runtime issues in `MaterialsPage.tsx`, including:

  * `itemUploadStatus is not defined`
  * `processingLabelForItem is not defined`
  * `orchardGhostButtonStyle is not defined`
* Repaired Materials Results gate behavior so idle processing no longer blocks Push to Results.
* Broadened curriculum extraction heuristics in `src/engine/curriculum/extractCoverageFromCurriculum.ts`.
* Broadened exemplar cue extraction in `src/engine/blueprint/exemplarAnalysis.ts`.
* Updated `src/engine/blueprint/buildBlueprint.ts` so `teachingTool` exemplar files also participate in framework detection and presenter cue extraction.
* Verified multiple times via `npm run qa` that the repo was green after these fixes.
* Created and committed:

  * `a8d0983 Fix Materials Results gate when processing is idle`
  * `400a0ff Improve exemplar cue influence and broaden curriculum extraction`

## Remaining work

* Fix curriculum PDF extraction so lesson-plan PDFs produce readable text instead of fallback-only signals.
* Re-test the same curriculum PDFs and exemplar PPTX after PDF extraction changes.
* Confirm Results shows curriculum influence with `Curriculum items` greater than 0 and non-empty `Curriculum Used`.
* Tighten exemplar cue selection later so very generic slide-note lines like welcome/roadmap titles do not over-shape teacher wording.
* Continue preserving the rule that exemplar influences structure/flow only, not lesson-specific content.

## Next steps

1. Inspect `src/utils2. If PDF OCR fallback is still missing, add a safe OCR fallback for PDF pages with little or no selectable text.
3. Run `npm run qa`.
4. Re-test with the same curriculum PDFs and exemplar PPTX in the browser.
5. Check Results for:

   * `Curriculum items:`
   * `Presenter cues:`
   * `Curriculum Used`
   * `Exemplar Cues Used`
6. If curriculum remains at 0, inspect the exact extracted PDF text reaching blueprint generation before widening curriculum extraction further.
7. Later, refine exemplar cue filtering so only structure/pacing/teacher-flow cues are retained.

## Important evidence

* Local repo path used throughout chat: `C:\dev\lesson-generator8-hardened`
* Branch used throughout chat: `feat/hardened-pass5-runtime-and-polish-fastfix-phase1-reconcile-phase2-context-phase3-split-phase4-qa`
* Earlier branch history noted in chat:

  * `80e442f Improve materials intake queue and storyboard navigation`
  * `f35ecbd Tighten mixed-target detection and stabilize lesson generation`
  * `706455d Fix MaterialsPage upload status helper`
  * `38805e8 Make Materials card status reflect extraction evidence`
  * `0f271a7 Fix MaterialsPage processing label helper`
* Commits created in this chat:

  * `a8d0983 Fix Materials Results gate when processing is idle`
  * `400a0ff Improve exemplar cue influence and broaden curriculum extraction`
* Files directly discussed or modified in this chat:

  * `src/pages/MaterialsPage.tsx`
  * `src/engine/blueprint/buildBlueprint.ts`
  * `src/engine/blueprint/exemplarAnalysis.ts`
  * `src/engine/curriculum/extractCoverageFromCurriculum.ts`
  * `src/utils/readUploadedText.ts`
  * `src/utils/extractLessonMaterialSources.ts`
  * `src/engine/blueprint/types.ts`
  * `src/engine/generation/slides.ts`
  * `src/engine/generation/lessonPlan.ts`
  * `src/pages/WizardProgress.tsx`
* Commands repeatedly used and verified:

  * `npm run qa`
  * `git restore --source=HEAD --worktree --staged src/pages/MaterialsPage.tsx`
  * `git log --oneline -5`
  * `git status --short`
* Results evidence from browser after exemplar fix:

  * `Applied framework: linear`
  * `Curriculum items: 0`
  * `Presenter cues: 5`
  * `Curriculum Used: No curriculum checklist items found.`
  * `Exemplar Cues Used` populated from PPTX note lines
* Raw blueprint evidence from browser:

  * curriculum PDFs were still fallback-only text
  * exemplar PPTX had rich extracted text
  * `sourceRole` on the exemplar PPTX was `teachingTool`

## Risks / cautions

* Do not bypass the one-PowerShell-paste workflow.
* Do not give terminal pastes that include prompt text, terminal output, chat transcript text, or explanatory prose; that previously created junk files and bad terminal state.
* Do not reintroduce unstable brace or patch stacking changes in `MaterialsPage.tsx`.
* Do not let exemplar text donate lesson-specific content; keep exemplar influence limited to structure/style/pacing/teacher flow.
* Do not claim repo-wide review beyond the files and terminal evidence actually examined in this chat.
* Do not assume PDF OCR fallback is already in place; a later attempted string-replacement patch failed with `Could not find readPdf block.` and QA still passed because the file did not change in that failed attempt.

## Next action

Open `src/utils/readUploadedText.ts`, verify whether a PDF OCR fallback helper such as `ocrPdfPage(...)` is actually present, and if it is still missing, add it safely in one terminal-only PowerShell paste before re-running QA and re-testing the same curriculum PDFs and exemplar PPTX.

---

Imported from: docs/chat-handoffs/2026-03-17_1423_ontradictory-states-over-time-so-the-final-persistence-behavior-should-be-re-verified-in-the-ui-not-just-from-code-and-qa..md
Imported at: 2026-03-17 16:42

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
  * Later user reported: ΓÇ£It didn't disappear!!!!!!ΓÇ¥ followed by the remaining issue that curriculum should appear immediately like exemplar
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

---

Imported from: docs/chat-handoffs/2026-03-17_1428_nuing-brittle-line-surgery-when-the-file-became-structurally-damaged..md
Imported at: 2026-03-17 16:42

# lesson-generator8 materials/runtime handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: stabilize Materials page queue/render/remove behavior, preserve curriculum-vs-exemplar roles, checkpoint the repo, and prepare continuation context for the next chat.

## Canonical project assumptions

* This is `lesson-generator8-hardened`, a lesson package generator that takes lesson inputs plus uploaded curriculum/exemplar materials, builds a blueprint, then generates a lesson package with slides, lesson plan, centers, rotations, interventions, and exports.
* Curriculum is the content authority: what is taught, instructional target, standards/content, vocabulary/examples/word lists, and lesson-specific content.
* Exemplar is the presentation authority: structure, pacing, timers, teacher moves, layout/style, slide flow, and presentation patterns.
* Desired product behavior is to combine new curriculum content with exemplar structure/style without allowing exemplars to hijack the lesson topic/content.
* Workflow preference is one Windows PowerShell paste at a time, with low-friction, continuation-ready handoffs.

## What was reviewed

* code files: `src/pages/MaterialsPage.tsx`, `src/engine/blueprint/buildBlueprint.ts`, `src/engine/curriculum/extractCoverageFromCurriculum.ts`, `src/state/useLessonStore.ts`, `src/utils/readUploadedText.ts`, `src/utils/extractLessonMaterialSources.ts`
* commits: reviewed local git history/status including `5042452`, `7d97a2a`, `c120996`
* PRs: none reviewed in this chat
* issues: none reviewed in this chat
* terminal output: extensive PowerShell command/output for file inspection, patching, git status/log/commit
* pasted handoff notes: a detailed project/product handoff describing expected behavior, known regressions, and priorities

## Current state

* `src/pages/MaterialsPage.tsx` was repeatedly repaired and eventually committed in multiple checkpoints.
* Confirmed git state at the end of chat:

  * `5042452` `Stabilize materials queue rendering, status, and removal`
  * `7d97a2a` `Checkpoint existing blueprint, curriculum extraction, store, and upload text changes`
  * `c120996` `Fix materials queue rendering and removal behavior`
* Branch was confirmed ahead of origin by 6 commits.
* Working tree was clean except untracked `qa-runs/`.
* Materials queue UI/regression work was heavily focused on immediate row rendering, live statuses, and remove behavior.
* However, the runtime path was not fully proven stable: later in the chat, the user reported rows appearing immediately but staying at `Upload: Uploading / Evaluation: Waiting to read file / Pipeline: Queued for extraction` and not moving into the real assets area.

## Decisions made

* Preserve the product seam:

  * curriculum = content authority
  * exemplar = structure/style/pacing authority
* Treat Materials page stabilization as a prerequisite before moving to blueprint/generation hardening.
* Prefer restoring `src/pages/MaterialsPage.tsx` to a known-good git base rather than conti* Do not assume a fix is complete just because it is committed; runtime behavior must be re-verified in the app.
* Next hardening phase should start in `src/engine/blueprint/buildBlueprint.ts`, then `src/engine/generateLesson.ts`, but only after Materials runtime is verified.

## Completed work

* Captured and used the pasted project handoff to preserve continuity.
* Repaired `MaterialsPage.tsx` multiple times after syntax/structure breakages caused by patch churn.
* Restored `MaterialsPage.tsx` from git when needed to recover from broken states.
* Reintroduced queue-rendering behavior so dropped items could appear immediately.
* Added/iterated on queue-related helpers and remove handling in `MaterialsPage.tsx`.
* Fixed several cases where remove behavior failed due to stale queue entries or queued placeholder rows.
* Cleaned temporary backup files created during repairs.
* Created and confirmed local commits for the Materials page and checkpoint changes.

## Remaining work

* Verify and, if necessary, fix the current upload/extraction runtime path in `src/pages/MaterialsPage.tsx` so queued rows transition into real assets instead of remaining stuck at initial queue statuses.
* Reconfirm that remove works for:

  * queued curriculum rows
  * finished curriculum rows
  * queued exemplar rows
  * finished exemplar rows
* Reconfirm that no ghost items reappear after refresh/navigation.
* After Materials runtime is stable, harden `src/engine/blueprint/buildBlueprint.ts` so exemplar influence stays structural and curriculum remains content authority.
* Then harden generation so curriculum deepens actual lesson content while exemplar deepens pacing/notes/cues/style.
* Improve Results traceability so curriculum vs exemplar influence is visible and trustworthy.
* Clean text/encoding artifacts noted during chat (for example `├óΓé¼ΓÇ£` / replacement-character style issues seen in terminal/file output).

## Next steps

1. Inspect the current live `onPickMaterials` and `onPickExemplar` in `src/pages/MaterialsPage.tsx`.
2. Reproduce the current runtime symptom:

   * row appears immediately
   * row does not move past initial queue state
   * row does not enter the real assets area
3. Fix the extraction transition path only after inspecting exact live code on disk.
4. Re-test queued and completed remove behavior for curriculum and exemplar.
5. Once Materials runtime is confirmed stable, move to `src/engine/blueprint/buildBlueprint.ts`.
6. Enforce curriculum/content vs exemplar/structure separation more explicitly in blueprint and generation.

## Important evidence

* Files explicitly referenced:

  * `src/pages/MaterialsPage.tsx`
  * `src/engine/blueprint/buildBlueprint.ts`
  * `src/engine/curriculum/extractCoverageFromCurriculum.ts`
  * `src/state/useLessonStore.ts`
  * `src/utils/readUploadedText.ts`
  * `src/utils/extractLessonMaterialSources.ts`
* Commits explicitly referenced:

  * `5042452` `Stabilize materials queue rendering, status, and removal`
  * `7d97a2a` `Checkpoint existing blueprint, curriculum extraction, store, and upload text changes`
  * `c120996` `Fix materials queue rendering and removal behavior`
* Commands explicitly referenced:

  * `git log --oneline -n 3`
  * `git status`
  * `git add src\pages\MaterialsPage.tsx`
  * `git commit -m "Stabilize materials queue rendering, status, and removal"`
  * repeated PowerShell `Get-Content` range inspections for `MaterialsPage.tsx`
  * restore/checkpoint commands using `git restore --source=HEAD -- src\pages\MaterialsPage.tsx`
* Runtime evidence explicitly reported by user:

  * files appeared immediately in the stacks
  * rows remained at `Upload: Uploading / Evaluation: Waiting to read file / Pipeline: Queued for extraction`
  * rows were not showing in the real assets area

## Risks / cautions

* Do not assume the current Materials behavior is fully fixed just because commits exist; the last runtime symptom indicated the extraction transition may still be broken.
* Do not resume broad blind replacement surgery in `MaterialsPage.tsx` without first inspecting the exact current file contents.
* Do not delete or commit unrelated files; `qa-runs/` was intentionally left untracked.
* Do not revive old backup files or stale local draft assumptions unless needed for recovery.
* Preserve the curriculum/exemplar seam; do not let exemplar override lesson topic/content.
* Behavior lineage matters more than path lineage here: the key unresolved behavior is ΓÇ£immediate queued row but stuck before real asset transition.ΓÇ¥

## Next action

Run a focused inspection of the live upload handlers in `src/pages/MaterialsPage.tsx` and continue from there with one PowerShell paste at a time:

`Set-Location 'C:\dev\lesson-generator8-hardened'`
`$path = Resolve-Path 'src\pages\MaterialsPage.tsx'`
`$i = 0`
`Get-Content $path | ForEach-Object {`
`  $i++`
`  if (($i -ge 740 -and $i -le 860) -or ($i -ge 860 -and $i -le 930)) {`
`    '{0,4}: {1}' -f $i, $_`
`  }`
`}`

---

Imported from: docs/chat-handoffs/2026-03-17_1431_er-can-see-why-curriculum-and-exemplar-changed-the-output.md
Imported at: 2026-03-17 16:42

# lesson-generator8 chat handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Preserve a continuation-ready handoff based only on evidence pasted and discussed in this chat, including the app review framing and the pasted executive audit for lesson-generator8-hardened.

## Canonical project assumptions

* The product is a teacher-facing lesson package generator with a 3-step flow: Inputs -> Materials -> Results.
* The core product rule is: curriculum is content authority; exemplar is presentation authority.
* The intended users are teachers, especially elementary teachers needing usable lesson materials quickly.
* The project is expected to be blueprint-driven rather than a generic generator.
* Early elementary teacher-led lessons should force linear structure and teacher-led wording.
* Apple Orchard Storybook is the approved visual direction.
* The user prefers one Windows PowerShell paste at a time, low-friction workflow, immediate visible progress, preserved uploads across navigation, mixed lessons clarified before generation, fixes to real behavior rather than only smoke tests, and no repeated re-explaining of context.

## What was reviewed

* code files: not directly reviewed in-tool during this chat; file paths were referenced in pasted notes
* commits: none directly reviewed in this chat
* PRs: none directly reviewed in this chat
* issues: none directly reviewed in this chat
* terminal output: none reviewed in this chat
* pasted handoff notes: yes; the executive audit pasted in chat was the main evidence source

## Current state

The project has meaningful architecture in place: source-role modeling, blueprint differentiation, framework-aware generation, teacher-led override logic, export paths, and a Results hub. The tracked milestone behavior says output structure now varies based on curriculum and exemplar presence. The main unfinished promise is stronger content grounding: curriculum and exemplar should not only alter structure, but also materially shape lesson wording, slide text, center directions, rotations, exit ticket wording, and overall teacher-facing content. Upload/extraction reliability and Results traceability remain open risks.

## Decisions made

* Treat curriculum as content authority and exemplar as presentation authority.
* Treat the app as blueprint-driven, with blueprint selection upstream of final generation wording.
* Keep source-role taxonomy as curriculum, teachingTool, exemplar, and mixed.
* Use true exemplars for framework detection and allow mixed sources to contribute cues with lower confidence.
* Preserve the early-elementary teacher-led override to prevent self-guided hub behavior in K/1.
* Keep teacher cues more in notes than in main slide body text.
* Preserve Apple Orchard Storybook as the visual source of truth rather than reviving generic dashboard styling.
* Treat the user's workflow preferences as product requirements, not mere style preferences.

## Completed work

* In this chat, the app review request was distilled into a structured review prompt and then expanded using the pasted executive audit.
* A concise, continuation-ready product framing was established from the pasted notes.
* No repo changes, no direct code review, no direct commit review, and no direct issue or PR review were performed in this chat.

## Remaining work

* Make curriculum and exemplar influence final lesson content more deeply, not only structure.
* Strengthen Results traceability so the us* Resolve materials upload/extraction stalls after queue insertion.
* Improve mixed-target clarification behavior before generation.
* Reduce cases where exemplar over-influences structure or content.
* Finish export cleanup and encoding polish.
* Investigate and harden ZIP export runtime/import behavior.
* Expand testing beyond smoke coverage to verify meaningful structure and content variation.

## Next steps

1. Audit and harden the materials upload/extraction path so queue insertion reliably progresses to completed extraction.
2. Strengthen blueprint-to-generation grounding so curriculum materially shapes lesson wording, examples, and practice language.
3. Tighten exemplar influence so it affects pacing, teacher moves, and structure without overriding curriculum content authority.
4. Improve Results hub traceability to clearly explain source-role impact, framework choice, and output changes.
5. Add targeted tests for curriculum-only, exemplar-only, both, and neither cases, including content assertions rather than only page-load or export-trigger checks.
6. Clean up export text/encoding and then re-check ZIP export behavior under real preview/runtime conditions.
7. Continue using Apple Orchard Storybook as the visual source of truth while avoiding generic dashboard leftovers.

## Important evidence

* Referenced file paths from pasted notes:

  * src/pages/MaterialsPage.tsx
  * src/engine/blueprint/buildBlueprint.ts
  * src/engine/spec/buildLessonSpec.ts
  * src/engine/generateLesson.ts
  * src/pages/ResultsHubPage.tsx
* Referenced export-related files by description only:

  * exportLessonPlanDocx.ts
  * exportSlidesPptx.ts
* Version referenced in pasted notes:

  * 1.4.0
* SHAs: none referenced in this chat
* PRs: none referenced in this chat
* Commands: none referenced in this chat

## Risks / cautions

* Do not claim repo-wide review from this chat; the main evidence here was pasted handoff material, not direct repo inspection.
* Do not treat passing smoke tests as proof that the product behavior is correct.
* Do not bypass mixed-source clarification before generation.
* Do not let exemplar dominate curriculum-driven content authority.
* Do not revive older generic dashboard/theme leftovers over the Apple Orchard Storybook direction.
* Do not remove or weaken the early-elementary teacher-led safeguard.
* Do not frame the generator as complete while the core promise of curriculum-grounded content variation is still partial.

## Next action

Start the next chat from the blueprint-to-generation seam: verify how buildBlueprint outputs are consumed by generateLesson, then identify the minimum changes needed so curriculum affects final wording and lesson content more deeply while exemplar remains presentation authority.

---

Imported from: docs/chat-handoffs/2026-03-17_1434_onpickmaterials-and-onpickexemplar-handlers-in-src-pages-materialspage-tsx.md
Imported at: 2026-03-17 16:42

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

  * `5042452` ΓÇö `Stabilize materials queue rendering, status, and removal`
  * `7d97a2a` ΓÇö `Checkpoint existing blueprint, curriculum extraction, store, and upload text changes`
  * `c120996` ΓÇö `Fix materials queue rendering and removal behavior`
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

---

Imported from: docs/chat-handoffs/2026-03-17_1436_rule-when-evaluating-lesson-generation-behavior-and-seams..md
Imported at: 2026-03-17 16:42

# lesson-generator8 chat handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Preserve a repo-ready handoff based only on evidence visible in this chat, centered on baseline packaging, prior audit context, and safe continuation.

## Canonical project assumptions

* The repo in scope is `jodiwankenobi8-arch/lesson-generator8`.
* The product is a teacher-facing lesson package generator with a wizard flow of Inputs -> Materials -> Results.
* A stated product rule from prior visible chat context is: curriculum is content authority and exemplar is presentation authority.
* The user wants a solid baseline, not a minimal or fragile one.
* The user does not want history kept unless it is relied upon to function.

## What was reviewed

* code files
* commits
* PRs
* issues
* terminal output
* pasted handoff notes

## Current state

The visible chat evidence shows partial review context rather than a fresh repo-wide audit in this thread. Prior context excerpts indicate an executive audit existed for `lesson-generator8-hardened`, with emphasis on the curriculum/exemplar authority rule and improving content quality influence. In this chat, packaging succeeded only for uploaded HTML review artifacts, not for a full app baseline download from the connected GitHub repo. The connected repo was inspected enough to reference ZIP export-related code and historical ZIP artifacts in repo history, but no full repo archive was produced here.

## Decisions made

* Preserve behavior lineage over path lineage: keep only history that is required for current function.
* Prioritize a solid baseline and hardening over a merely working baseline.
* Treat curriculum as the instructional/content authority and exemplar as the presentation/structure authority.
* Do not claim a full repo-wide review based on this chat alone.
* Isolate any handoff commit to the generated handoff file only.

## Completed work

* A downloadable ZIP was created containing the three uploaded HTML artifacts:

  * `Project - App Development 222.html`
  * `Project - App Development Review2132132.html`
  * `Project - App Development Review.html`
* A readable HTML export of visible chat interactions was created:

  * `chat_interactions_readable_export.html`
* The chat established that a full baseline app ZIP was not produced from the GitHub-connected repo in this thread.

## Remaining work

* Produce a true app baseline download from actual repo contents.
* Resolve any dependency, build, and foundation issues needed for a solid baseline.
* Update README while keeping design specs summarized rather than excessively verbose.
* Continue hardening only with evidence-backed review of actual code seams and current implementation state.
* Avoid reviving unnecessary history unless runtime behavior depends on it.

## Next steps

1. Use the connected repo as the primary source of truth and inspect current code directly before making further baseline claims.
2. Reconstruct or package a real baseline from repo contents rather than uploaded review artifacts.
3. Validate dependency health, build validity, and any blocking foundation issues.
4. Update README to reflect current architecture and summarize design specs.
5. Continue from the curriculum/exemplar authority 6. Save future chat handoffs under `docs/chat-handoffs/` for continuation continuity.

## Important evidence

* Repo: `jodiwankenobi8-arch/lesson-generator8`
* Referenced code path: `src/engine/exports/exportFullZip.ts`
* Referenced code path: `src/pages/ResultsHubPage.tsx`
* Historical ZIP artifact path mentioned: `Project/lesson-generator8_new_project_folder.zip`
* Historical ZIP artifact path mentioned: `Project/lesson-generator8_pruned_safe.zip`
* Uploaded artifact packaged in chat: `Project - App Development 222.html`
* Uploaded artifact packaged in chat: `Project - App Development Review2132132.html`
* Uploaded artifact packaged in chat: `Project - App Development Review.html`
* Exported interaction file created in chat: `chat_interactions_readable_export.html`

## Risks / cautions

* Do not claim repo-wide review or completion beyond what was actually evidenced in this chat.
* Do not delete history that current behavior depends on.
* Do not bypass the curriculum/content vs exemplar/presentation rule when continuing architecture or cleanup work.
* Do not assume prior generated ZIP links are valid or reproducible without current repo-backed packaging.
* Do not include unrelated staged, unstaged, or untracked files in this handoff commit.

## Next action

Open the current repo state and continue from the baseline-hardening objective by inspecting the real implementation behind `src/engine/exports/exportFullZip.ts` and `src/pages/ResultsHubPage.tsx`, then package a true repo-backed baseline.

---

Imported from: docs/chat-handoffs/2026-03-17_1439_ility-so-teachers-can-see-why-structure-and-content-changed-and-which-source-influenced-output.md
Imported at: 2026-03-17 16:42

# lesson-generator8 chat handoff - ility-so-teachers-can-see-why-structure-and-content-changed-and-which-source-influenced-output

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Preserve a continuation-ready handoff based on pasted project notes and assistant recommendations from this chat.

## Canonical project assumptions

* The project is `lesson-generator8`.
* The product is a teacher-facing lesson package generator.
* Current scope is intentionally limited to Kindergarten ELA until that path is stable.
* The core product rule is: curriculum is content authority; exemplar is presentation authority.
* The intended workflow is Inputs -> Materials -> Results.
* The project owner is new to development and wants simple, step-by-step guidance with one PowerShell command at a time.
* Small focused changes are preferred over large rewrites.

## What was reviewed

* code files: none directly reviewed in this chat
* commits: none directly reviewed in this chat
* PRs: none directly reviewed in this chat
* issues: none directly reviewed in this chat
* terminal output: none directly reviewed in this chat
* pasted handoff notes: yes, a long pasted master spec / continuation handoff for the project

## Current state

The current state in this chat is based on pasted handoff notes rather than direct repo inspection. The project is described as having baseline cleanup, documentation rewrite, package contract fix, README improvement, beginner workflow instructions, design summary, and a project master plan already completed before or outside this chat. Immediate priorities called out in the pasted notes are baseline stability, materials reliability, generation fidelity, results traceability, and export reliability.

## Decisions made

* Keep the app scoped to Kindergarten ELA unless explicitly expanded later.
* Preserve the core rule that curriculum drives lesson content and exemplar drives presentation structure.
* Treat mixed sources as lower-confidence inputs that should be clarified before generation.
* Prioritize stability, simplification, narrowed scope, and the core product promise before expansion.
* Strengthen future handoff quality by documenting repository structure, file responsibilities, known issues, next engineering tasks, safe workflow, and success criteria.
* The product should be treated as a teacher productivity tool, not an AI toy.

## Completed work

* The user pasted a full project master spec / continuation handoff into the chat.
* The assistant proposed concrete additions to improve that spec for future continuation:

  * expected repository structure
  * key file responsibilities
  * known product issues
  * next engineering tasks in priority order
  * safe development workflow
  * success criteria
  * stronger product principle framing
* The assistant recommended maintaining two documents:

  * `LESSON_GENERATOR8_MASTER_SPEC.md`
  * `LESSON_GENERATOR8_ENGINEERING_BLUEPRINT.md`
* A PDF transcript was generated in chat, but that file was only a readable conversation artifact and not evidence of repo state.

## Remaining work

* Verify actual baseline status in the repo with install, typecheck, and build.
* Fix Materials Page upload persistence.
* Add visible processing states for uploads.
* Improve curriculum influence on examples, practice, centers, and exit tickets.
* Improve exemplar influence on slide structure, teacher cues, timing, and pacing.
* Add traceab* Stabilize exports for pptx, docx, and zip.
* Produce or update a repo-resident engineering blueprint if it does not already exist.

## Next steps

1. Start from the repo root on the currently selected branch.
2. Verify baseline health with `npm install`, `npm run typecheck`, and `npm run build`.
3. Inspect the wizard flow pages and the central store referenced in the pasted notes:

   * `src/pages/InputsPage.tsx`
   * `src/pages/MaterialsPage.tsx`
   * `src/pages/BlueprintPage.tsx`
   * `src/pages/ResultsHubPage.tsx`
   * `src/state/useLessonStore.ts`
4. Confirm the current behavior of materials upload persistence and processing status before changing anything.
5. Review the generation pipeline files named in the pasted notes:

   * `src/engine/blueprint/buildBlueprint.ts`
   * `src/engine/spec/buildLessonSpec.ts`
   * `src/engine/generateLesson.ts`
6. Make one small focused fix at a time, starting with materials reliability.
7. Re-run typecheck and build after each focused change.

## Important evidence

* Pasted file name suggested by the user: `LESSON_GENERATOR8_MASTER_SPEC.md`
* Additional file name recommended by the assistant: `LESSON_GENERATOR8_ENGINEERING_BLUEPRINT.md`
* File paths referenced in the pasted notes:

  * `src/pages/InputsPage.tsx`
  * `src/pages/MaterialsPage.tsx`
  * `src/pages/ResultsHubPage.tsx`
  * `src/pages/BlueprintPage.tsx`
  * `src/engine/blueprint/buildBlueprint.ts`
  * `src/engine/spec/buildLessonSpec.ts`
  * `src/engine/generateLesson.ts`
  * `src/state/useLessonStore.ts`
  * `src/utils/readUploadedText.ts`
  * `src/utils/extractLessonMaterialSources.ts`
* Commands referenced in the pasted notes and assistant response:

  * `npm install`
  * `npm run typecheck`
  * `npm run build`
  * `npm run dev`
* No SHAs, PR numbers, issue numbers, or terminal transcripts were provided in this chat.

## Risks / cautions

* Do not claim repo-wide review based on this handoff alone; this chat did not include direct repo inspection.
* Do not expand beyond Kindergarten ELA until the scoped path is stable.
* Do not let mixed-source uploads silently dominate framework selection.
* Do not bypass the core product rule separating curriculum authority from exemplar authority.
* Do not attempt a large rewrite before verifying baseline health.
* Do not treat the generated PDF transcript as authoritative technical evidence of repo state.

## Next action

Open the repo on the current branch, run baseline verification (`npm install`, `npm run typecheck`, `npm run build`), then inspect `src/pages/MaterialsPage.tsx` and `src/state/useLessonStore.ts` first to assess upload persistence before making the next small focused fix.

---

Imported from: docs/chat-handoffs/2026-03-17_1447_d-docs-project-architecture-map-md.md
Imported at: 2026-03-17 16:42

# lesson-generator8 chat handoff

* Date: 2026-03-11
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Rebuild a usable baseline from a broken/missing local state, preserve project context, and create continuation-ready project handoff material.

## Canonical project assumptions

* The project is a teacher-facing lesson package generator.
* Current release scope should remain Kindergarten ELA first.
* The core product rule is curriculum = content authority and exemplar = presentation authority.
* The intended user flow is Inputs -> Materials -> Results.
* The product should be blueprint-driven rather than a generic generator.
* The user is new to this workflow and prefers one Windows PowerShell paste at a time, small focused changes, and minimal re-explaining.

## What was reviewed

* code files
* terminal output
* pasted handoff notes

## Current state

A minimal working baseline was rebuilt locally in PowerShell after prior zip/download handoff attempts failed. The repo now has a working React + TypeScript + Vite baseline with package installation completed, TypeScript typecheck passing, and Vite production build succeeding. Core baseline files created or restored during this chat include package.json, tsconfig.json, vite.config.ts, index.html, src/main.tsx, src/App.tsx, src/engine/types.ts, src/engine/generateLesson.ts, src/state/useLessonStore.ts, and placeholder page components for Inputs, Materials, and Results. Documentation files were also created in docs, including LESSON_GENERATOR8_EXECUTIVE_HANDOFF.md and PROJECT_ARCHITECTURE_MAP.md.

## Decisions made

* Scope was intentionally narrowed to Kindergarten ELA first.
* The correct build order is stabilize baseline first, then restore the real product systems incrementally.
* Large patch piles were rejected in favor of small focused changes.
* The baseline was treated as a clean rebuild target rather than trying to keep every broken or missing prior local artifact.
* The next rebuild sequence was set as app shell -> pages -> materials reliability -> blueprint engine -> lesson spec -> generation helpers -> results/exposes polish.
* The user requested and received documentation intended to be reusable in future chats.

## Completed work

* Recreated a valid package.json after npm failed due to missing package.json.
* Diagnosed npm connectivity problems using npm ping, nslookup, and Test-NetConnection.
* Confirmed npm registry access later worked and completed npm install successfully.
* Installed missing React type packages (@types/react and @types/react-dom).
* Verified npm run typecheck succeeded.
* Verified npm run build succeeded with Vite.
* Created src/App.tsx and rewired src/main.tsx to use App.
* Created placeholder page components:

  * src/pages/InputsPage.tsx
  * src/pages/MaterialsPage.tsx
  * src/pages/ResultsPage.tsx
* Updated App.tsx to render those pages and established a basic app shell.
* Created and saved docs/LESSON_GENERATOR8_EXECUTIVE_HANDOFF.md.
* Created and save
## Remaining work

* Replace the current simple shell with proper route-based wizard navigation if desired.
* Restore real Inputs form fields and lesson metadata capture.
* Rebuild the Materials upload pipeline, including curriculum/exemplar handling, live status, persistence across navigation, and clarification gating for mixed sources.
* Rebuild the blueprint engine and spec layer:

  * src/engine/blueprint/buildBlueprint.ts
  * src/engine/blueprint/types.ts
  * src/engine/spec/buildLessonSpec.ts
* Rebuild generation helper modules for slides, lesson plans, centers, rotation plans, and interventions.
* Rebuild the Results page into a true lesson package review/export surface.
* Reintroduce stronger design system structure and product traceability only after workflow integrity is restored.

## Next steps

1. Confirm the current baseline still builds after any new file additions with npm run typecheck and npm run build.
2. Add or finalize the project architecture map in docs if not already present.
3. Decide whether to keep the current simple step-state navigation or move immediately to React Router.
4. Restore InputsPage into a real lesson metadata entry screen.
5. Restore MaterialsPage into a real curriculum/exemplar upload and processing screen.
6. Rebuild the blueprint and spec layers before attempting advanced exports or broad scope expansion.
7. Keep all further work on small focused branches and validate after each change.

## Important evidence

* Repo referenced in chat: jodiwankenobi8-arch/lesson-generator8
* Commands explicitly run or discussed:

  * npm install
  * npm install --no-audit --no-fund
  * npm install --no-audit --no-fund --verbose
  * npm run typecheck
  * npm run build
  * npm ping
  * npm config list
  * nslookup registry.npmjs.org
  * Test-NetConnection registry.npmjs.org -Port 443
* Files explicitly created or updated in chat:

  * package.json
  * tsconfig.json
  * vite.config.ts
  * index.html
  * src/main.tsx
  * src/App.tsx
  * src/engine/types.ts
  * src/engine/generateLesson.ts
  * src/state/useLessonStore.ts
  * src/pages/InputsPage.tsx
  * src/pages/MaterialsPage.tsx
  * src/pages/ResultsPage.tsx
  * docs/LESSON_GENERATOR8_EXECUTIVE_HANDOFF.md
  * docs/PROJECT_ARCHITECTURE_MAP.md
* Build evidence from terminal:

  * npm install completed successfully after network issues were resolved
  * npm run typecheck passed
  * npm run build passed and produced a Vite dist build

## Risks / cautions

* Do not treat the current shell as the finished product; it is only a rebuilt baseline.
* Do not widen scope beyond Kindergarten ELA until the core workflow is stable.
* Do not reintroduce giant patch piles or broad rewrites without a focused purpose.
* Do not assume prior zip/download artifacts are reliable; the local rebuilt baseline is the authoritative continuation point from this chat.
* Do not bypass the curriculum/exemplar authority rule when rebuilding blueprint and generation logic.
* Do not delete docs/LESSON_GENERATOR8_EXECUTIVE_HANDOFF.md or docs/PROJECT_ARCHITECTURE_MAP.md; they preserve continuity from this chat.

## Next action

Open the repo at the rebuilt baseline, verify App.tsx and the three page components still build cleanly, then continue by turning InputsPage from placeholder text into the first real lesson metadata form while preserving the K ELA-first scope.

---

Imported from: docs/chat-handoffs/2026-03-17_1451_before-building-the-eventual-selection-ux-deeply-into-the-app..md
Imported at: 2026-03-17 16:42

# Lesson Generator 8 Chat Handoff - before-building-the-eventual-selection-ux-deeply-into-the-app.

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue rebuilding lesson-generator8 into a curriculum-aware lesson generation engine, preserve project context, and save a continuation-ready handoff.

## Canonical project assumptions

* The project is a teacher-facing lesson package generator focused initially on Kindergarten ELA, with future expansion to broader grades and subjects.
* The core product rule is: curriculum drives content, exemplar drives presentation structure.
* The intended product flow is Inputs -> Materials -> Results.
* The intended engine flow is Inputs + Materials -> Blueprint -> Lesson Spec -> Lesson Package.
* The user prefers architecturally correct, SOLID, continuation-safe work over quick fixes.
* The preferred implementation style is the largest safe step at each point, while still verifying builds.

## What was reviewed

* code files
* terminal output
* pasted handoff notes

## Current state

The project was rebuilt into a working routed React/Vite baseline and now has a real shared-state pipeline. Inputs, Materials, and Results are wired through Zustand and React Router. Materials have role, status, and analysis modeling. The engine now has blueprint, target detection, spec, materials analysis mock logic, and pipeline orchestration layers. Results are gated by input/material readiness and show blueprint, lesson spec, and lesson package outputs. Mixed-target support has a first-pass structural model, and lesson mode selection is present in state and UI. The latest chat ended with a real contract mismatch identified in src/engine/generateLesson.ts: runLessonPipeline now requires selectedMode, but generateLesson was still calling it with only inputs and materials.

## Decisions made

* Moved from simple page-shell scaffolding to a structured pipeline architecture instead of keeping generation logic in pages.
* Kept page components focused on UI/orchestration and moved behavior into state or engine modules where appropriate.
* Introduced explicit material roles and lifecycle states rather than hardcoded placeholder rows.
* Added explicit intermediate pipeline state in the store: blueprint, lessonSpec, lessonPackage.
* Added generation readiness rules so preview is blocked until inputs are complete and materials are ready.
* Added explicit mixed-target domain modeling* Chose largest safe steps over artificially tiny steps, while still building and verifying after each major change.

## Completed work

* Installed and wired react-router-dom.
* Wrapped the app in BrowserRouter and converted App.tsx to route-based navigation for /inputs, /materials, and /results.
* Replaced simple page placeholders with working InputsPage, MaterialsPage, and ResultsPage structures.
* Added core engine types in src/engine/types.ts and aligned state and generation code to those types.
* Wired InputsPage to Zustand state and ResultsPage to generated output.
* Moved materials into real store-backed state and replaced hardcoded material rows.
* Added MaterialAnalysis, analysis/error fields, and simulated material status progression.
* Refactored material processing logic out of MaterialsPage and later moved mock analysis content into src/engine/materials/buildMockMaterialAnalysis.ts.
* Added buildBlueprint.ts and buildLessonSpec.ts and introduced a real engine pipeline.
* Added src/engine/pipeline/runLessonPipeline.ts and made generateLesson.ts a thinner compatibility layer.
* Added state reset behavior so generated content clears when inputs, materials, or lesson mode change.
* Added store readiness helpers: hasRequiredInputs, hasReadyMaterials, hasProcessingMaterials, canGenerate.
* Added Results blocking behavior for incomplete inputs, processing materials, missing ready materials, and missing generated results.
* Strengthened the domain model by splitting LessonBlueprint into content and structure and LessonSpec sections into title + steps.
* Added first-pass mixed-target detection and later added selected lesson mode support in state, pipeline, and UI.

## Remaining work

* Fix src/engine/generateLesson.ts so it passes selectedMode into runLessonPipeline.
* Improve mixed-target detection beyond simple keyword heuristics so it does not overfire on normal phonics lessons.
* Replace mock material analysis with real parsing/extraction for actual uploaded materials.
* Separate curriculum-derived content and exemplar-derived structure more deeply in blueprint construction.
* Enrich the lesson spec and package generation beyond placeholder instructional steps and strings.
* Implement the fuller mixed-target selection behavior intended by the product plan.
* Add real upload handling and persistence behavior for materials instead of mock additions only.

## Next steps

1. Update src/engine/generateLesson.ts so generateLesson accepts selectedMode (defaulting safely) and passes it to runLessonPipeline.
2. Run npm run build and verify the repo is back to a clean passing state.
3. Review whether any remaining callers still assume the old two-argument pipeline contract.
4. Tighten mixed-target detection using more disciplined signals from inputs and later materials, not only keyword matching.
5. Move from mock material additions to real file upload handling while preserving the current store and engine seams.
6. Expand blueprint/spec/package generation so curriculum content and exemplar structure are represented more concretely.

## Important evidence

* Files referenced and updated in this chat:

  * src/main.tsx
  * src/App.tsx
  * src/pages/InputsPage.tsx
  * src/pages/MaterialsPage.tsx
  * src/pages/ResultsPage.tsx
  * src/state/useLessonStore.ts
  * src/engine/types.ts
  * src/engine/generateLesson.ts
  * src/engine/blueprint/buildBlueprint.ts
  * src/engine/blueprint/detectLessonTargets.ts
  * src/engine/spec/buildLessonSpec.ts
  * src/engine/pipeline/runLessonPipeline.ts
  * src/engine/materials/buildMockMaterialAnalysis.ts
* Commands referenced in this chat:

  * npm install
  * npm install react-router-dom
  * npm run build
* Terminal evidence referenced in the chat:

  * repeated successful Vite builds
  * a TypeScript error in src/engine/generateLesson.ts complaining that runLessonPipeline expected 3 arguments but got 2

## Risks / cautions

* Do not bypass the curriculum-versus-exemplar separation by collapsing everything back into flat string generation.
* Do not reintroduce generation logic into page components just to move faster.
* Do not treat the current mixed-target detection as final; it is structural groundwork only.
* Do not delete or ignore the readiness gating, because it prevents stale or invalid Results output.
* Do not assume repo-wide review happened; this handoff is based only on files, terminal output, and notes explicitly covered in this chat.
* The last known repo state in this chat includes one unresolved compile error in src/engine/generateLesson.ts until that compatibility wrapper is fixed.

## Next action

Start by updating src/engine/generateLesson.ts so generateLesson passes selectedMode to runLessonPipeline, then run npm run build and continue from the now-structured pipeline and mixed-target model.

---

Imported from: docs/chat-handoffs/2026-03-17_1454_esentation-export-system..md
Imported at: 2026-03-17 16:42

# Lesson Generator 8 Chat Handoff

* Date: 2026-03-17 14:54
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue development of lesson-generator8, preserve current architecture/state, and capture repo-safe handoff details, rules, preferences, and next steps from this chat.

## Canonical project assumptions

* lesson-generator8 is a teacher-facing lesson package generator.
* Core product rule: curriculum = content authority; exemplar = presentation authority.
* Wizard flow is Inputs -> Materials -> Results.
* The pipeline is intended to be deterministic: buildBlueprint() -> buildLessonSpec() -> buildLessonPackage().
* Supported lesson modes in this chat are single, full, phonics_only, and comprehension_only.
* Materials currently use simulated processing and mock analysis, not real file parsing.
* The user is building with guidance and wants one PowerShell paste at a time, in large safe steps, with clean architecture and no hacks.

## What was reviewed

* code files
* commits: none reviewed in this chat
* PRs: none reviewed in this chat
* issues: none reviewed in this chat
* terminal output
* pasted handoff notes

## Current state

* The app builds successfully after multiple engine and UI changes.
* Engine layers are now separated into blueprint, spec, package, pipeline, and materials.
* runLessonPipeline.ts is orchestration-only and now calls buildBlueprint(), buildLessonSpec(), and buildLessonPackage().
* buildBlueprint.ts is mode-aware and uses curriculum-derived vocabulary, word lists, texts, and practice ideas more intentionally.
* detectLessonTargets.ts was repaired to match the actual repo types and now supports detectLessonTargets() plus resolveLessonMode().
* buildLessonSpec.ts was upgraded from generic filler to target-aware instructional sections for phonics, comprehension, and full/mixed lessons.
* buildLessonPackage.ts was moved into its own package layer and upgraded to generate richer slides, lesson plan, rotation plan, interventions, and exports.
* Zustand workflow state was improved with getMaterialCounts() and clearer material status handling.
* MaterialsPage.tsx now shows visible processing status, summary counts, and clearer role/status UI.
* ResultsPage.tsx now uses explicit blocked states instead of redirecting when outputs are missing or prerequisites are not met.
* InputsPage.tsx now shows live target analysis, mode guidance, and a lesson scope decision panel for mixed/full/single/portion selection.
* The latest build shown in this chat succeeded and produced dist/assets/index-CCnZ-fai.js.

## Decisions made

* Keep the pipeline layered and responsibility-separated: blueprint decides what to teach, spec decides how to teach it, package builds deliverables, pipeline orchestrates only.
* Do not keep adding logic blindly; inspect real file contents before replacing code.
* Prefer curriculum-derived content over generic fallback content wherever possible.
* Surface mixed-target analysis in the Inputs UI instead of silently relying on engine behavior.
* Keep Results blocked while materials are processing or prerequisites are incomplete, and show explicit reasons.
* Use the current lesson mode as the temporary lesson-scope decision mechanism; standards/component-level split controls are still future work.

## Completed work

* Fixed generateLesson.ts to pass selectedMode into the pipeline.
* Repaired detectLessonTargets.ts to match actual LessonInputs and repo types.
* Updated buildBlueprint.ts to pass selectedMode into detectLessonTargets() and resolve target behavior more consistently.
* Strengthened blueprint extraction to prefer curriculum-derived vocabulary, word lists, texts, and practice ideas.
* Replaced the generic buildLessonSpec.ts implementation with target-aware lesson spec generation.
* Created src/engine/package/buildLessonPackage.ts and moved package creation out of runLessonPipeline.ts.
* Upgraded buildLessonPackage.ts to produce richer deliverables and target-aware interventions/exports.
* Expanded Zustand store workflow helpers with getMaterialCounts().
* Improved MaterialsPage.tsx and ResultsPage.tsx blocked-state UX and status clarity.
* Upgraded InputsPage.tsx to show live target analysis and lesson scope decision UI.
* Verified successful builds repeatedly after each major step.

## Remaining work

* Real file parsing is still not implemented; buildMockMaterialAnalysis.ts is still the active material-analysis mechanism.
* Mixed-lesson scope is only controlled by lesson mode; standards/component selection is not yet implemented.
* Slide output is still text-only and not a true pr* Export generation is still declarative text, not real files.
* Curriculum/exemplar parsing is still heuristic and lightweight, not true document-driven extraction.
* Mixed-target detection was improved but remains heuristic and should still be treated cautiously.

## Next steps

1. Refine mixed-lesson handling beyond mode buttons by adding standards/component selection when lessons are truly mixed.
2. Replace mock material analysis with real parsing for PDF, PPT/PPTX, and DOC/DOCX sources.
3. Improve curriculum extraction quality for word lists, vocabulary, texts, and practice structures.
4. Improve exemplar extraction for pacing, slide sequence, teacher prompts, and activity structure.
5. Upgrade slide/package outputs from text summaries into more structured deliverables.
6. Continue periodic architecture audits to ensure changes remain clean, efficient, effective, and aligned with the product rule.

## Important evidence

* Files reviewed or edited in this chat:

  * src/engine/generateLesson.ts
  * src/engine/blueprint/detectLessonTargets.ts
  * src/engine/blueprint/buildBlueprint.ts
  * src/engine/spec/buildLessonSpec.ts
  * src/engine/package/buildLessonPackage.ts
  * src/engine/pipeline/runLessonPipeline.ts
  * src/engine/types.ts
  * src/state/useLessonStore.ts
  * src/pages/InputsPage.tsx
  * src/pages/MaterialsPage.tsx
  * src/pages/ResultsPage.tsx
  * src/App.tsx
  * src/main.tsx
* Commands/output referenced in this chat:

  * npm run build
  * Get-Content .\src\engine\blueprint\buildBlueprint.ts
  * Get-Content .\src\engine\types.ts
  * Get-Content .\src\engine\spec\buildLessonSpec.ts
  * Get-Content .\src\engine\pipeline\runLessonPipeline.ts
  * Get-Content .\src\engine\package\buildLessonPackage.ts
  * Get-Content .\src\state\useLessonStore.ts
  * Get-Content .\src\pages\MaterialsPage.tsx
  * Get-Content .\src\pages\ResultsPage.tsx
  * Get-Content .\src\pages\InputsPage.tsx
  * Get-Content .\src\App.tsx
  * Get-Content .\src\main.tsx
  * Get-ChildItem .\src\engine -Recurse
* Terminal build evidence from this chat:

  * Successful builds reported after major changes, ending with dist/assets/index-CCnZ-fai.js and "built in 671ms".

## Risks / cautions

* Do not reintroduce generic package/spec behavior now that the engine layers are separated and target-aware.
* Do not collapse package generation back into runLessonPipeline.ts; keep orchestration-only separation.
* Do not bypass the product rule that curriculum drives content and exemplar drives presentation structure.
* Do not claim repo-wide review, commit review, PR review, or issue review; those did not happen in this chat.
* Do not delete or bypass the blocked-results workflow; it is now part of the intended UX.
* Do not treat the current mixed-target handling as fully complete; standards/component granularity is still missing.
* Do not replace clean architectural steps with quick patches; the user explicitly requested large safe changes and maintainable structure.

## Next action

Open the current repo state and continue from the mixed-lesson/product-hardening seam: keep the existing architecture, verify the latest InputsPage mixed-scope UI is present, then implement the next large safe step by replacing mock material analysis with real material parsing or by adding standards/component-level mixed-lesson selection if UI-first work is preferred.

---

Imported from: docs/chat-handoffs/2026-03-17_1459_become-a-first-class-control-model-rather-than-just-exemplar-on-off..md
Imported at: 2026-03-17 16:42

# lesson-generator8 chat handoff - real-analysis transition

* Date: 2026-03-11
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Recover the local app to a clean passing build, preserve working rules, and transition the project away from mock material processing toward a real extraction + analysis architecture.

## Canonical project assumptions

* The app is a teacher-facing lesson package generator with a 3-step wizard: Inputs -> Materials -> Results.
* Curriculum is the content authority; exemplar is the presentation authority.
* The user does not want mock behavior going forward and wants a functioning app.
* The user wants exemplar handling to support close copying, inspiration, selected aspects, and custom style requests.
* The user prefers one PowerShell paste at a time, large but safe steps, clean architecture, and frequent milestone baselines.
* Local project files are the source of truth; temporary uploaded workspace files are not.

## What was reviewed

* code files

  * src/App.tsx
  * src/engine/blueprint/buildBlueprint.ts
  * src/engine/blueprint/detectLessonTargets.ts
  * src/engine/generateLesson.ts
  * src/engine/materials/buildMockMaterialAnalysis.ts
  * src/engine/package/buildLessonPackage.ts
  * src/engine/pipeline/runLessonPipeline.ts
  * src/engine/spec/buildLessonSpec.ts
  * src/engine/types.ts
  * src/main.tsx
  * src/pages/InputsPage.tsx
  * src/pages/MaterialsPage.tsx
  * src/pages/ResultsPage.tsx
  * src/state/useLessonStore.ts
* commits

  * none reviewed in this chat
* PRs

  * none reviewed in this chat
* issues

  * none reviewed in this chat
* terminal output

  * repeated npm run build output
  * PowerShell file writes, verification reads, and baseline snapshot commands
* pasted handoff notes

  * user-provided continuation handoff describing project goals, workflow, architecture, and rules

## Current state

* The local app was recovered from a corrupted src/pages/InputsPage.tsx and returned to a clean passing build.
* Mixed-target detection was tightened to reduce phonics/comprehension overfiring.
* Practice generation was updated to use curriculum-derived content more explicitly.
* The type contract was expanded for a real-analysis direction:

  * MaterialStatus uses uploaded/extracting/analyzing/ready/error.
  * structured CurriculumAnalysis and ExemplarAnalysis types exist.
  * ExemplarStyleSettings exists in the type layer.
* The store was updated to remove the mock-processing dependency and is now prepared for explicit real extraction/analyzing actions and exemplar style settings.
* A new analysis entrypoint file was added:

  * src/engine/materials/analyzeMaterial.ts
* A new extraction entrypoint file was added:

  * src/engine/materials/extractTextFromFile.ts
* The extraction entrypoint currently provides a safe transitional implementation:

  * txt extraction path exists
  * pdf/docx/pptx are recognized but not yet truly parsed
* Build was passing at the end of the chat.

## Decisions made

* No more mock behavior should be added for final product behavior.
* Do not broad-refactor opportunistically; work in targeted continuation steps.
* Keep the layered pipeline:

  * blueprint = what is taught
  * spec = how it is taught
  * package = deliverables
* Keep terminal workflow disciplined:

  * backup first
  * make change
  * verify key lines
  * run npm run build
  * save baseline only after a passing build
* Exemplar support must* Real ingestion + analysis is now the primary direction; improving mock analysis is no longer an active goal.

## Completed work

* Recovered corrupted src/pages/InputsPage.tsx and restored a clean build.
* Fixed generateLesson.ts call shape earlier in the conversation context by aligning with selectedMode usage expectations.
* Tightened detectLessonTargets behavior to reduce false mixed-target detection.
* Improved buildLessonSpec practice wording to use extracted lesson content more explicitly.
* Updated project plan in-repo:

  * PROJECT_PLAN_UPDATED_2026-03-11.md
* Expanded src/engine/types.ts for real-analysis direction.
* Renamed status usage from scanning to extracting across type/store/UI alignment work.
* Updated src/state/useLessonStore.ts to:

  * remove mock-processing dependency
  * add explicit beginMaterialExtraction / beginMaterialAnalysis actions
  * add setMaterialStyleSettings
  * add removeMaterial
  * support exemplar style settings in state
* Added src/engine/materials/analyzeMaterial.ts as the real analysis entrypoint.
* Added src/engine/materials/extractTextFromFile.ts as the real extraction entrypoint.
* Saved multiple local milestone baselines under lesson-generator8-baselines.

## Remaining work

* Implement real file parsers for:

  * pdf
  * docx
  * pptx
* Wire actual file upload payloads into extractTextFromFile().
* Wire extraction -> analyzeMaterial() -> store status transitions in the live UI flow.
* Replace any remaining runtime paths that still depend on old mock assumptions.
* Update buildBlueprint.ts to consume structured curriculum/exemplar analysis instead of relying mainly on broad keyword matching over extractedText.
* Update Materials UI for exemplar style controls:

  * mode
  * selected aspects
  * custom instructions
* Add AI-backed normalization and generation integration behind the extraction/analysis seam.
* Re-check Results and Materials pages for any remaining wording that implies old simulated processing behavior.

## Next steps

1. Implement the first real parser in src/engine/materials/extractTextFromFile.ts, starting with PDF.
2. Add the integration seam that passes uploaded file content into extractTextFromFile().
3. After extraction succeeds, call analyzeMaterial() and persist structured analysis in store.
4. Update Materials UI to manage exemplar style settings in a visible user flow.
5. Refactor buildBlueprint.ts to prefer structured curriculum/exemplar analysis fields over generic extractedText heuristics.
6. Only after that, continue with AI-backed normalization and lesson-generation refinement.

## Important evidence

* Files reviewed or directly discussed:

  * src/App.tsx
  * src/engine/blueprint/buildBlueprint.ts
  * src/engine/blueprint/detectLessonTargets.ts
  * src/engine/generateLesson.ts
  * src/engine/materials/buildMockMaterialAnalysis.ts
  * src/engine/package/buildLessonPackage.ts
  * src/engine/pipeline/runLessonPipeline.ts
  * src/engine/spec/buildLessonSpec.ts
  * src/engine/types.ts
  * src/main.tsx
  * src/pages/InputsPage.tsx
  * src/pages/MaterialsPage.tsx
  * src/pages/ResultsPage.tsx
  * src/state/useLessonStore.ts
  * PROJECT_PLAN_UPDATED_2026-03-11.md
  * src/engine/materials/analyzeMaterial.ts
  * src/engine/materials/extractTextFromFile.ts
* Commands repeatedly used:

  * npm run build
  * Get-Content
  * Set-Content
  * Copy-Item
  * Select-String
* Baseline folders explicitly created during this chat included:

  * lesson-generator8-post-mixed-fix-*
  * lesson-generator8-post-practice-upgrade-*
  * lesson-generator8-post-store-real-workflow-fixed-20260311-142924
  * lesson-generator8-post-analyze-material-entrypoint-20260311-143333

## Risks / cautions

* Do not revive buildMockMaterialAnalysis as a forward path.
* Do not save milestone baselines after a failed build.
* Do not claim repo-wide review beyond the files and terminal outputs touched in this chat.
* Temporary uploaded workspace files may expire; rely on local repo files and saved baselines.
* The current extraction entrypoint is only a seam; pdf/docx/pptx are not truly implemented yet.
* The older snapshots of some files shown in the chat may not match the final local repo state after later edits; trust the local repo and milestone baselines.

## Next action

Implement real PDF extraction inside src/engine/materials/extractTextFromFile.ts, then wire the live materials flow so upload -> extracting -> analyzing -> ready uses extractTextFromFile() and analyzeMaterial() instead of any legacy simulated path.

---

Imported from: docs/chat-handoffs/2026-03-17_1503_at-s-development-flow.md
Imported at: 2026-03-17 16:42

# Lesson Generator 8 Chat Handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue hardening lesson-generator8, wire real material extraction and analysis flow, keep the project aligned with the production plan, and produce a continuation-ready handoff.

## Canonical project assumptions

* The project is a teacher-facing lesson package generator, not a prototype.
* Curriculum is the content authority.
* Exemplar is the presentation authority.
* The intended workflow is Inputs ΓåÆ Materials ΓåÆ Results.
* The pipeline is Inputs ΓåÆ Material Extraction ΓåÆ Material Analysis ΓåÆ Lesson Target Detection ΓåÆ Blueprint ΓåÆ Lesson Spec ΓåÆ Lesson Package ΓåÆ Outputs.
* The user is not an engineer and prefers single PowerShell pastes, simple instructions, minimal manual editing, frequent baselines, and no temporary hacks.
* Every few implementation steps, the project should be audited for architecture integrity, build health, extraction sanity, analysis sanity, and system weight.

## What was reviewed

* code files
* commits
* terminal output
* pasted handoff notes

## Current state

The repo and terminal history in this chat show a real staged pipeline is in place and the project is beyond a shell prototype. The extractor was extended across this chat to support TXT, PDF, DOCX, PPTX, and HTML/HTM in `src/engine/materials/extractTextFromFile.ts`, with local types added for `pptx-parser`. The store was updated so `MaterialFile` now carries `fileBuffer` and `fileContent`, which is the missing foundation for real upload-driven processing. A new workflow entrypoint, `src/engine/workflow/processMaterial.ts`, was added to orchestrate extraction ΓåÆ analysis ΓåÆ store updates. The build was passing after the store/type updates, but the workflow helper is still mid-fix because `analyzeMaterial(...)` requires `materialId`, `name`, `extractedText`, and `role`, and the helper was still being corrected to match the real input/output contract. GitHub was initialized, connected, pushed, and later updated successfully from this chat.

## Decisions made

* Native extraction comes before OCR. OCR is a later fallback layer, not the default path.
* The immediate priority is workflow completion, not adding more feature surface.
* `MaterialFile` must store raw uploaded source data via `fileBuffer` and `fileContent`.
* A dedicated workflow helper (`processMaterial`) is the clean seam for upload-driven processing.
* Status names should remain `uploaded / extracting / analyzing / ready / error`.
* The project should use regular checkpoint audits to avoid architectural drift and brittle layered heuristics.
* Mock analysis should not be revived or reintroduced.
* Baselines should continue to be saved after stable milestones.

## Completed work

* Confirmed and reinforced the core project rules and pipeline shape.
* Added or confirmed real analysis entrypoints with role-aware curriculum vs exemplar analysis.
* Added or confirmed extraction support work for TXT, PDF, DOCX, PPTX, and HTML/HTM in this ch* Installed and worked through dependencies including `pdf-parse`, `mammoth`, and `pptx-parser`.
* Added a local type declaration for `pptx-parser`.
* Updated `src/engine/types.ts` so `MaterialFile` includes `fileBuffer` and `fileContent`.
* Updated `src/state/useLessonStore.ts` to initialize and persist `fileBuffer` / `fileContent` and to expose `setMaterialSource(...)`.
* Created `src/engine/workflow/processMaterial.ts` as the orchestration seam for extraction and analysis.
* Ran repeated `npm run build` checks and saved multiple baselines during the chat.
* Initialized Git locally, connected the GitHub remote, resolved push setup, and pushed subsequent updates to `main`.

## Remaining work

* Finish the `processMaterial.ts` fix so it exactly matches the real `analyzeMaterial(...)` contract and returns a full `MaterialAnalysis` shape acceptable to the store.
* Wire the Materials page upload flow so a real file drop/select does:
  add material ΓåÆ save source (`fileBuffer` / `fileContent`) ΓåÆ `processMaterial(id)` ΓåÆ live status updates.
* Ensure Materials page copy and helpers remain consistent with `uploaded / extracting / analyzing / ready / error`.
* Keep Results generation blocked until processing is complete and ready materials exist.
* Strengthen curriculum-derived signals in blueprint/spec/package outputs.
* Strengthen exemplar-derived structure reuse in blueprint/spec/package outputs.
* Add image support and OCR later, after the real upload-to-analysis loop works end to end.

## Next steps

1. Fix `src/engine/workflow/processMaterial.ts` so it passes `materialId`, `name`, `extractedText`, and `role` to `analyzeMaterial(...)` and wraps the result into the storeΓÇÖs full `MaterialAnalysis` shape.
2. Run `npm run build` and confirm the workflow seam compiles cleanly.
3. Wire the Materials page upload handler to:

   * create the material record
   * persist `fileBuffer` / `fileContent` with `setMaterialSource(...)`
   * call `processMaterial(id)`
4. Verify the first real end-to-end loop:
   upload file ΓåÆ extracting ΓåÆ analyzing ΓåÆ ready.
5. Audit status naming, page copy, and gating behavior after the first end-to-end run.
6. Save a new baseline and push once the loop is working.
7. Only then continue to image/OCR and fallback extraction work.

## Important evidence

* Repo: `jodiwankenobi8-arch/lesson-generator8`
* Branch used in this chat: `main`
* Commit referenced from this chat: `5664e83`
* Commit referenced from this chat: `6419719`
* Files repeatedly discussed or modified in this chat:

  * `src/engine/types.ts`
  * `src/state/useLessonStore.ts`
  * `src/engine/materials/analyzeMaterial.ts`
  * `src/engine/materials/extractTextFromFile.ts`
  * `src/engine/workflow/processMaterial.ts`
  * `src/engine/blueprint/buildBlueprint.ts`
  * `src/engine/blueprint/detectLessonTargets.ts`
  * `src/engine/spec/buildLessonSpec.ts`
  * `src/engine/package/buildLessonPackage.ts`
* Commands actually used or referenced:

  * `npm install pdf-parse`
  * `npm install mammoth --omit=optional --verbose`
  * `npm ls pptx-parser`
  * `npm run build`
  * `git init`
  * `git branch -M main`
  * `git add .`
  * `git commit -m "..."`
  * `git remote add origin https://github.com/jodiwankenobi8-arch/lesson-generator8.git`
  * `git push -u origin main --force`
* Baseline examples referenced in this chat:

  * `lesson-generator8-post-extract-entrypoint-20260311-143333`
  * `lesson-generator8-post-pdf-extraction-20260311-152502`
  * `lesson-generator8-post-pptx-extraction-20260311-161428`

## Risks / cautions

* Do not reintroduce mock analysis paths.
* Do not bypass the staged pipeline with one-off UI shortcuts.
* Do not add OCR before the real upload ΓåÆ extraction ΓåÆ analysis loop is working.
* Do not assume `analyzeMaterial(...)` and the store share the same shape; the workflow seam must adapt them explicitly.
* Do not lose the raw file source fields now added to `MaterialFile`; they are required for real extraction.
* Do not drift status naming away from `uploaded / extracting / analyzing / ready / error`.
* Do not make repo-wide claims beyond what was actually reviewed in this chat.

## Next action

Start in `src/engine/workflow/processMaterial.ts`, fix the `analyzeMaterial(...)` call and output shaping so the file builds cleanly, then wire the Materials page upload handler to save source data and call `processMaterial(id)` for the first real end-to-end material processing run.

---

Imported from: docs/chat-handoffs/2026-03-17_1512_ush-cranberry-led-color-feel-is-preferred.md
Imported at: 2026-03-17 16:42

# Lesson Generator 8 Hardened — Chat Handoff
- Date: 2026-03-17
- Repo: jodiwankenobi8-arch/lesson-generator8
- Chat purpose: Continue hardening/build-out of lesson-generator8, carry exemplar shell deeper into generation, add planning and slide architecture, review and lock initial design direction, and leave a continuation-ready checkpoint.

## Canonical project assumptions
- Repo context in this chat: `jodiwankenobi8-arch/lesson-generator8` on `main`.
- Product purpose: teacher-facing lesson package generator with Inputs → Materials → Results flow.
- Non-negotiable rule: curriculum is content authority; exemplar is presentation/template authority.
- User workflow rules confirmed in chat:
  - one PowerShell paste at a time
  - biggest safe coherent chunks
  - no mock/fake systems
  - frequent `npm run build`
  - frequent git checkpoints/pushes
  - low-friction continuation
- Current app is the streamlined wizard, not an old dashboard/Supabase architecture.
- OCR / JPG / PNG / scanned PDF support is still planned, not implemented in the hardened path yet.
- Design decisions saved in-chat:
  - Group 1 locked: Apple Orchard / Warm Storybook Workspace; classy scrapbook with layered textures; anti-corporate rule locked; storyboard feeling should be implicit, not explicitly stated; “teacher desk/planning notebook” metaphor removed as core framing.
  - Group 2 locked: cream-first surfaces, white used sparingly; blush + cranberry are preferred emotional accents, greens secondary structural anchors; orchard means storybook orchard mood; working type pair is Playfair Display + Inter; subtle paper/canvas texture.
- Group 3 design work was intentionally paused before final lock; ribbon/header specifics were discussed but not finalized as a locked implementation rule.

## What was reviewed
- code files
  - `src/engine/types.ts`
  - `src/engine/blueprint/buildBlueprint.ts`
  - `src/engine/package/buildLessonPackage.ts`
  - `src/engine/spec/buildLessonSpec.ts`
  - `src/engine/pipeline/runLessonPipeline.ts`
  - `src/engine/generateLesson.ts`
  - `src/state/useLessonStore.ts`
  - `src/pages/ResultsPage.tsx`
  - `src/engine/planning/buildLessonPlanningIdeas.ts`
  - new slide-layer files under `src/engine/slides/`
- commits
  - reviewed by terminal output only; see SHAs in Important evidence
- PRs
  - none reviewed in this chat
- issues
  - none reviewed in this chat
- terminal output
  - repeated `npm run build`
  - repeated `git status`, `git add`, `git commit`, `git push`
  - path discovery for spec/package files
- pasted handoff notes
  - long continuation handoff supplied at chat start
  - pasted design docs and design-source text reviewed in chat

## Current state
The project is a working hardened prototype with a real end-to-end spine:
Inputs → Materials upload/processing → Blueprint → Planning Ideas → Lesson Spec → Slide Plan/Content/Deck → Lesson Package → Results.

The app now has:
- real material processing flow and statuses
- blueprint/template shell logic
- planning ideas generated and displayed in Results
- lesson-plan section planning (teach / guided / independent / closure)
- planning ideas shaping the actual lesson spec
- a first modular slide engine foundation used by lesson package generation

The repo was left in a pushed, build-green state after adding the slide engine foundation.

## Decisions made
- Template-shell behavior is the central generation seam:
  - blueprint produces template shell
  - shared shell resolution is used across spec/package
  - package/spec should preserve shell while replacing content
- Planning layer is a formal architecture seam between blueprint and final outputs:
  - `buildLessonPlanningIdeas()` became a real step in the pipeline
  - planning should power lesson-plan building, not just support ideas
- Lesson spec now consumes planning ideas rather than relying only on blueprint-level heuristics.
- Slide generation is now a separate architecture seam:
  - `slideTypes.ts`
  - `buildSlidePlan.ts`
  - `buildSlideContent.ts`
  - `assembleSlideDeck.ts`
- Cleanup/hardening priority chosen in chat:
  - prefer real structured layers over inline blob logic
  - save major checkpoints frequently
  - do not revive old dashboard/theme leftovers when design conflicts with orchard direction
- Design authority decisions made in chat:
  - Apple Orchard / Warm Storybook Workspace is the approved top-level direction
  - classy scrapbook with layered textures is approved
  - cream-first, bl  - ribbon/header and some surface/card specifics remain paused for later lock

## Completed work
Closed in this chat:
- Confirmed and pushed template-shell-related generation work:
  - `8006d8a` — Prefer template shell in lesson package generation
  - `863662b` — Align lesson spec with template shell structure
  - `5c7ba23` — Share template shell resolution across spec and package
  - `711ace5` — Refine blueprint template shell construction
- Added planning layer to pipeline:
  - `c7b4433` — Add lesson planning ideas to generation pipeline
- Persisted and surfaced planning ideas in Results:
  - `a1bfec1` — Surface lesson planning ideas in results
- Expanded planning ideas with explicit lesson-plan sections:
  - `9cb5ad3` — Expand planning ideas with lesson plan sections
- Made planning ideas shape lesson spec generation
- Added slide engine foundation and wired package generation to it:
  - `7a015db` — Add slide engine foundation for lesson package assembly
- Confirmed pushed/build-green milestones repeatedly after each major step.

## Remaining work
- Slide system is still foundational, not finished:
  - no real exemplar slide import/reuse yet
  - no PPTX authoring/export yet
  - no slide visuals/preview hierarchy beyond text content strings
  - slide layer does not yet fully consume `planningIdeas.slidePlans`
- Material extraction remains incomplete for production use:
  - OCR/JPG/PNG/scanned PDFs still not implemented
  - true PDF/DOCX/PPTX parsing still needs completion/verification
- Design implementation is only partially locked:
  - Groups 1–2 are locked in-chat
  - Group 3+ detailed UI implementation decisions are paused/unlocked
- Foundation cleanup still possible:
  - normalize final pipeline result contract if needed
  - continue state/navigation/error hardening
- Results page still mixes structured planning output and raw-ish generated output; there is room to improve inspection of slide plan and output hierarchy.

## Next steps
1. Surface the structured slide plan in Results, not just final slide strings
2. Wire slide engine more directly to `planningIdeas.slidePlans`
3. Decide slide behavior contract for exemplar usage
4. Continue into export and/or exemplar slide ingestion
5. Resume design implementation later using locked Groups 1–2 first
6. OCR/image ingestion remains a later but still planned workstream

## Important evidence
- Repo/branch assumptions from chat handoff: `jodiwankenobi8-arch/lesson-generator8`, `main`
- Commands referenced repeatedly:
  - `npm run build`
  - `git status`
  - `git add`
  - `git commit -m "..."`
  - `git push origin main`
- File paths actually referenced in chat:
  - `src/engine/types.ts`
  - `src/engine/blueprint/buildBlueprint.ts`
  - `src/engine/shared/resolveTemplateShell.ts`
  - `src/engine/planning/buildLessonPlanningIdeas.ts`
  - `src/engine/spec/buildLessonSpec.ts`
  - `src/engine/package/buildLessonPackage.ts`
  - `src/engine/pipeline/runLessonPipeline.ts`
  - `src/engine/generateLesson.ts`
  - `src/state/useLessonStore.ts`
  - `src/pages/ResultsPage.tsx`
  - `src/engine/slides/slideTypes.ts`
  - `src/engine/slides/buildSlidePlan.ts`
  - `src/engine/slides/buildSlideContent.ts`
  - `src/engine/slides/assembleSlideDeck.ts`
- SHAs explicitly shown in terminal output during this chat:
  - `d2600bb`
  - `8006d8a`
  - `863662b`
  - `5c7ba23`
  - `711ace5`
  - `c7b4433`
  - `a1bfec1`
  - `9cb5ad3`
  - `7a015db`

## Risks / cautions
- Do not delete or bypass the new planning layer; it is now a real generation seam
- Do not collapse slide generation back into one inline helper
- Do not revive old dashboard/Supabase architecture or legacy themes
- Do not treat paused design discussions as locked rules
- Do not replace curriculum/exemplar authority split

## Next action
Start by inspecting slide system + Results rendering, then implement structured slide plan visibility and tighter planning → slides linkage.

---

Imported from: docs/chat-handoffs/2026-03-17_1515_rn-structure.templateshell-..md
Imported at: 2026-03-17 16:42

# lesson-generator8 chat handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue hardening lesson-generator8 into a real working prototype, wire real upload/extract/analyze/generate flow, strengthen curriculum-vs-exemplar authority, and preserve a continuation-ready handoff.

## Canonical project assumptions

* This project is a teacher-facing lesson package generator with a 3-step flow: Inputs -> Materials -> Results.
* Curriculum is the content authority; exemplar is the presentation authority.
* The user wants a working prototype, not mock behavior.
* The user wants exemplar to function increasingly like a reusable template shell: preserve reusable structure/pacing/prompts and replace old lesson-specific content with new curriculum-driven content.
* The user is working from the repo root on branch `main` and prefers one PowerShell paste at a time in the biggest safe coherent chunks.

## What was reviewed

* code files
* commits
* terminal output
* pasted handoff notes

## Current state

* Real material upload/processing is wired from the UI: files are added immediately, source buffers are stored, `processMaterial(id)` runs extraction and analysis, and material statuses move through uploaded/extracting/analyzing/ready/error.
* Results are gated both in navigation and on the Results page based on required inputs, material processing completion, and generated outputs.
* `generateLesson.ts` exists as a clean generation entrypoint calling `runLessonPipeline(...)` and storing blueprint/spec/package in the Zustand store.
* `buildBlueprint.ts` was hardened to prefer structured curriculum and exemplar analysis over raw text rescans.
* `buildLessonSpec.ts` and `buildLessonPackage.ts` were strengthened so curriculum content carries further downstream and exemplar structure/pacing/teacher-move/prompt/tone cues influence outputs more directly.
* Local build-green work after the last pushed commit added `BlueprintTemplateShell` to `src/engine/types.ts` and updated `src/engine/blueprint/buildBlueprint.ts` to return `structure.templateShell`.
* The latest observed local build after the template-shell change succeeded with Vite chunk-size warnings only.

## Decisions made

* No mock systems: no fake extraction, fake analysis, or fake generation.
* No patch-stacking: prefer fewer, larger, well-reasoned safe changes.
* Keep the architecture layered as: extract -> analyze -> blueprint -> spec -> package.
* Use structured analysis fields as the primary contract for generation; raw extracted text heuristics are fallback only.
* Defer code-splitting/performance work until after core generation/template behavior is stable.
* Introduce a reusable `templateShell` contract in the blueprint to move toward exemplar-as-template behavior without creating a parallel subsystem.

## Completed work

* Fixed and stabilized store-aware `processMaterial.ts` and confirmed green builds.
* Replaced placeholder `MaterialsPage.tsx` with real upload handling, immediate material listing, status updates, removal, and processing orchestration.
* Hardened Results gating in both `App.tsx` nav behavior and `ResultsPage.tsx`.
* Added `src/engine/generateLesson.ts` as a real generation entrypoint.
* Wired Generate Lesson from the Materials page to run the pipeline and navigate to Results.
* Rewrote `src/engine/blueprint/buildBlueprint.ts` to prioritize structured curriculum/exemplar analysis.
* Strengthened lesson spec generation to carry curriculum-driven content more directly.
* Carried exemplar presentation cues (`teacherMoves`, `promptStyle`, `tone`) into the blueprint and then into the lesson spec.
* Strengthened lesson package outputs so slides/lesson plan/rotation plan reflect more exemplar structure/presentation cues.
* Added `BlueprintTemplateShell` to `src/engine/types.ts` and updated `buildBlueprint.ts` to retu* Successful pushes observed in this chat:

  * `6e08450` - Wire real material upload and processing flow
  * `16d4e25` - Make blueprint analysis-driven by curriculum and exemplar
  * `d2600bb` - Carry exemplar cues into lesson package outputs

## Remaining work

* Make `buildLessonPackage.ts` prefer `blueprint.structure.templateShell` as the primary shell source for package generation.
* Continue separating reusable exemplar shell from replaceable lesson-specific content.
* Mixed-target detection still needs refinement so it does not overfire on simple phonics lessons.
* Visual/template concerns such as same-layout-different-theme or same-theme-different-layout are not implemented.
* OCR/image extraction (jpg/jpeg/png, scanned PDF fallback) is not implemented.
* Bundle-size/code-splitting work remains deferred technical debt.

## Next steps

1. Inspect current local `src/engine/types.ts`, `src/engine/blueprint/buildBlueprint.ts`, and the actual `buildLessonPackage.ts` path/content to confirm the build-green template-shell state.
2. Update `buildLessonPackage.ts` so package generation prefers `blueprint.structure.templateShell` for segment order, slide shell, timing shell, teacher-move shell, prompt shell, and tone shell.
3. Run `npm run build`.
4. Checkpoint audit: solidity, efficiency, effectiveness, cleanliness, alignment to final product, and fat trimming.
5. Commit and push the package-shell adoption if green.
6. Then continue strengthening shell/content separation and later revisit mixed-target refinement.

## Important evidence

* Repo: `jodiwankenobi8-arch/lesson-generator8`
* Branch referenced in pasted handoff: `main`
* Files reviewed or edited in this chat:

  * `src/state/useLessonStore.ts`
  * `src/engine/workflow/processMaterial.ts`
  * `src/pages/MaterialsPage.tsx`
  * `src/App.tsx`
  * `src/pages/ResultsPage.tsx`
  * `src/engine/generateLesson.ts`
  * `src/engine/blueprint/buildBlueprint.ts`
  * actual `buildLessonSpec.ts` path discovered dynamically in terminal
  * actual `buildLessonPackage.ts` path discovered dynamically in terminal
  * `src/engine/materials/analyzeMaterial.ts`
  * `src/engine/types.ts`
* Commands actually referenced:

  * `npm run build`
  * `git add .; git commit -m "Wire real material upload and processing flow"; git push origin main`
  * `git add .; git commit -m "Make blueprint analysis-driven by curriculum and exemplar"; git push origin main`
  * `git add .; git commit -m "Carry exemplar cues into lesson package outputs"; git push origin main`
* SHAs actually referenced:

  * `6e08450`
  * `16d4e25`
  * `d2600bb`

## Risks / cautions

* Do not reintroduce mock behavior, fake analysis, or fake generation.
* Do not bypass the curriculum-content / exemplar-presentation authority split.
* Do not patch-stack small fixes onto a weak design; keep using the biggest safe coherent changes.
* Do not prioritize code splitting before stabilizing core generation/template behavior.
* The generation files are growing; avoid turning `buildBlueprint.ts`, `buildLessonSpec.ts`, and `buildLessonPackage.ts` into blobs.
* There are known unrelated staged, unstaged, and untracked files in the repo environment; commits must stay isolated to the intended handoff file.

## Next action

Start by inspecting the current local `types.ts`, `buildBlueprint.ts`, and `buildLessonPackage.ts`, then update `buildLessonPackage.ts` to prefer `blueprint.structure.templateShell` so exemplar shell behavior becomes more explicit in package generation.

---

Imported from: docs/chat-handoffs/2026-03-17_1519_unstaged-and-untracked-files-future-git-actions-must-stay-isolated.md
Imported at: 2026-03-17 16:42

# Lesson Generator 8 chat handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue hardening lesson-generator8, preserve full project context and SOP, reduce patch drift, and leave a continuation-ready handoff.

## Canonical project assumptions

* The product is a teacher-facing lesson package generator with a 3-step flow: Inputs -> Materials -> Results.
* Core product rule: curriculum = content authority; exemplar = presentation authority.
* The pipeline is Inputs -> Materials Upload -> Extraction -> Analysis -> Blueprint -> Planning Ideas -> Lesson Spec -> Lesson Package -> Results.
* The project should favor the safest biggest solid step, not fast local patches.
* "No bandaids" is now part of the canonical SOP for this project.
* The user prefers one PowerShell paste at a time, frequent checkpoints, and frequent Git pushes when available.
* Git push was not available earlier in the chat due to a network error, and later the user stated no git for the next 8 hours.

## What was reviewed

* code files
* commits
* PRs: none reviewed in this chat
* issues: none reviewed in this chat
* terminal output
* pasted handoff notes

## Current state

The project is in a materially cleaner state than at the start of this chat. The mixed-target lesson handling, results presentation, blueprint layer, and package layer were all moved toward clearer ownership and less duplication. The build passed multiple times after structural refactors. Current architecture is clean enough to stop core refactoring and return to product-facing work.

Current layer ownership:

* store = state and derived preview only
* materials = extraction and analysis
* blueprint = target/content/structure/source readiness
* planning = expansion
* spec = instructional flow
* package = outputs/readiness
* UI = presentation only

Recently stabilized areas:

* Results page refactored into smaller presentation components
* Blueprint refactored into orchestrator + focused helpers
* Package refactored into orchestrator + focused helpers
* Source readiness lives in blueprint
* Package readiness lives in package
* Heavy extraction libraries were lazy-loaded earlier in this chat and the build output showed chunking improvements, though pdf-parse still produces a large chunk warning

## Decisions made

* Do not continue endless small patches; prefer structural fixes when logic starts clumping.
* Treat "no bandaids" as canonical SOP.
* Stop refactoring a subsystem once it is solid enough for safe continuation.
* Keep strict responsibility boundaries across store, blueprint, planning, spec, package, and UI.
* Results should remain a presentation layer, not a place that recreates engine logic.
* Blueprint should be an orchestrator that delegates content resolution, structure resolution, and source readiness.
* Package should be an orchestrator that delegates output creation and readiness evaluation.
* Future work should shift back toward product value after the last core cleanups rather than continuing internal refactors.

## Completed work

* Fixed material analysis merge behavior in processMaterial so analysis fields are preserved instead of being overwritten.
* Added lesson shape selection on Inputs for single / full / phonics_only / comprehension_only.
* Added mixed-target detection and mode resolution behavior around phonics vs comprehension.
* Refactored ResultsPage into smaller presentation components without behavior change.
* Added blueprint source readiness signals and warnings.
* Added package readiness signals and warnings.
* Refactored blueprint into:

  * src/engine/blueprint/buildBlueprint.ts
  * src/engine/blueprint/resolveBlueprintContent.ts
  * src/engine/blueprint/resolveBlueprintStructure.ts
  * src/engine/blueprint/buildBlueprintSourceReadiness.ts
* Refactored package into:

  * src/engine/package/buildLessonPackage.ts
  * src/engine/package/buildPackageOutputs.ts
  * src/engine/package/buildLessonPackageReadiness.ts
* Multiple successful builds after these refactors.
* A Support Summary addition for MaterialsPage was drafted as the next product-facing step, but the build result for that exact step was not shown in this chat.

## Remaining work

* Resume product work instead of more core refactoring unless a new god-file risk appears.
* Materials experience still needs clearer user guidance around support strength if the drafted Support Summary change was not yet fully landed/verified.
* Export placeholders still need eventual real exports.
* Lesson intelligence can still be improved in planning/spec/output quality.
* Large chunk warning for pdf-parse remains, but it is not currently treated as a blocking issue.
* Git state may include unrelated staged
## Next steps

1. Verify the current repo state before making more edits, especially whether the drafted MaterialsPage support-summary change was actually saved and built.
2. If not yet landed, implement or verify the Materials support summary using existing analyzed material data only, without introducing a new pipeline layer.
3. Resume product-facing improvements in lesson intelligence rather than more architecture cleanup.
4. Keep using one PowerShell paste at a time and checkpoint every 2-3 steps.
5. Push cleanly when git/network access is available, isolating only intended files.

## Important evidence

* Repo: jodiwankenobi8-arch/lesson-generator8
* Local commit referenced in chat: 79d8bda ("Fix material analysis merge and add lesson shape selection")
* Git push failure referenced in chat: fatal: unable to access '[https://github.com/jodiwankenobi8-arch/lesson-generator8.git/](https://github.com/jodiwankenobi8-arch/lesson-generator8.git/)': Failed to connect to github.com port 443 after 21044 ms
* Referenced files:

  * src/App.tsx
  * src/main.tsx
  * src/pages/InputsPage.tsx
  * src/pages/MaterialsPage.tsx
  * src/pages/ResultsPage.tsx
  * src/state/useLessonStore.ts
  * src/engine/generateLesson.ts
  * src/engine/pipeline/runLessonPipeline.ts
  * src/engine/materials/analyzeMaterial.ts
  * src/engine/materials/extractTextFromFile.ts
  * src/engine/workflow/processMaterial.ts
  * src/engine/blueprint/detectLessonTargets.ts
  * src/engine/blueprint/buildBlueprint.ts
  * src/engine/blueprint/resolveBlueprintContent.ts
  * src/engine/blueprint/resolveBlueprintStructure.ts
  * src/engine/blueprint/buildBlueprintSourceReadiness.ts
  * src/engine/planning/buildLessonPlanningIdeas.ts
  * src/engine/spec/buildLessonSpec.ts
  * src/engine/package/buildLessonPackage.ts
  * src/engine/package/buildPackageOutputs.ts
  * src/engine/package/buildLessonPackageReadiness.ts
  * src/engine/types.ts
* Commands referenced:

  * npm run build
  * git add .; git commit -m "Fix material analysis merge and add lesson shape selection"; git push
  * Write-Host / Get-Content inspection commands across Inputs, Materials, Results, blueprint, package, store, and pipeline files

## Risks / cautions

* Do not revert to patch stacking now that blueprint and package have been structurally cleaned up.
* Do not reintroduce duplicated logic across UI, store, blueprint, and package.
* Do not claim repo-wide review beyond the files and terminal evidence shown in this chat.
* Do not include unrelated staged files in commits; the repo state was explicitly said to contain unrelated staged, unstaged, and untracked files.
* Do not bypass the curriculum/content vs exemplar/structure rule.
* Do not over-refactor helper files just for cosmetic cleanliness once a subsystem is solid enough.

## Next action

Start by checking the actual current repo contents for src/pages/MaterialsPage.tsx and confirming whether the drafted Support Summary change from this chat is present and build-verified. If it is not, land that feature using existing material analysis state only, then continue with product-facing quality improvements.

---

Imported from: docs/chat-handoffs/2026-03-17_1528_to-trust-structured-curriculum-analysis.md
Imported at: 2026-03-17 16:42

# lesson-generator8 handoff - to-trust-structured-curriculum-analysis

* Date: 2026-03-17 15:28
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue hardening the lesson engine, wire outputs end to end, add automated testing, and preserve a continuation-ready handoff with the user’s SOP and workflow constraints.

## Canonical project assumptions

* The app is a teacher-facing lesson package generator with a 3-step flow: Inputs -> Materials -> Results.
* Curriculum is the content authority; exemplar is the presentation authority.
* Mixed-target handling matters and should avoid overfiring on clear single-target phonics lessons.
* Build warnings around large chunks and pdf-parse are currently non-blocking and were intentionally deprioritized.
* The user prefers one PowerShell paste at a time, large safe architectural steps, low-friction instructions, frequent build checks, frequent git checkpoints, and structured audits every 2-3 meaningful steps.
* At the end of this chat, the user preferred automated testing over manual testing.

## What was reviewed

* code files: src/engine/generateLesson.ts; src/engine/pipeline/runLessonPipeline.ts; src/engine/types.ts; src/engine/materials/extractTextFromFile.ts; src/engine/materials/analyzeMaterial.ts; src/engine/workflow/processMaterial.ts; src/engine/blueprint/buildBlueprint.ts; src/engine/blueprint/resolveBlueprintContent.ts; src/engine/blueprint/resolveBlueprintStructure.ts; src/engine/blueprint/buildBlueprintSourceReadiness.ts; src/engine/planning/buildLessonPlanningIdeas.ts; src/engine/spec/buildLessonSpec.ts; src/engine/package/buildLessonPackage.ts; src/engine/package/buildPackageOutputs.ts; src/engine/package/buildLessonPackageReadiness.ts; src/engine/slides/assembleSlideDeck.ts; src/engine/slides/buildSlidePlan.ts; src/engine/slides/buildSlideContent.ts; src/pages/MaterialsPage.tsx; src/pages/ResultsPage.tsx; package.json
* commits: earlier push to main showed 7a015db..9fadf6f; local commit 09907ad ("Improve planning and lesson spec intelligence") was created later
* PRs: none reviewed in this chat
* issues: none reviewed in this chat
* terminal output: repeated npm run build output; npm run dev usage; npm test output; npm install / npm pkg set output; git status / commit / push output including one failed push due to network
* pasted handoff notes: comprehensive lesson-generator8 handoff/spec notes supplied by the user at the start of the chat

## Current state

The engine pipeline is materially stronger and builds cleanly: material extraction, analysis, blueprinting, planning, spec generation, slide planning/assembly, package building, and results surfacing were all reviewed and tightened. Package slide output now routes through the slide engine instead of bypassing it. Vitest is installed and wired in package.json, and src/engine/pipeline.test.ts passes with 4 green regression tests covering end-to-end pipeline execution, phonics single-target behavior, mixed-target behavior, and curriculum-vs-exemplar influence. The app can run locally with npm run dev. Recent work after local commit 09907ad remains important context; not every post-09907ad change was confirmed as pushed.

## Decisions made

* Keep architecture layered and ownership-based: materials -> blueprint -> planning -> spec -> slides/package -> UI.
* Treat extractTextFromFile/analyzeMaterial as the materials seam; do not leak extraction/analysis logic into later layers.
* Tighten blueprint content* Tighten blueprint readiness so fallback/default arrays do not automatically count as strong support.
* Strengthen planning for mixed-target lessons and blueprint-aware slide notes without changing return shapes.
* Strengthen spec so it carries planning, formative, small-group, and intervention intelligence forward.
* Use assembleSlideDeck/buildSlidePlan/buildSlideContent as the canonical slide path; do not bypass it in package outputs.
* Start automated validation with Vitest engine tests instead of manual testing, per the user’s preference at the end of the chat.
* Defer chunk-size/build-warning cleanup and avoid more broad refactoring unless tests or real output quality expose a concrete weakness.

## Completed work

* Confirmed repeated green builds with non-blocking Vite/pdf-parse chunk warnings.
* Strengthened material extraction wiring and material analysis heuristics.
* Tightened blueprint content resolution and blueprint source readiness logic.
* Upgraded planning intelligence, including stronger mixed-target handling.
* Upgraded lesson spec to surface planning/support ideas more directly.
* Upgraded slide planning to be more selective and content-anchored.
* Changed package outputs so lessonPackage.slides uses the slide engine path via assembleSlideDeck.
* Installed Vitest and @types/node.
* Added test scripts to package.json: test, test:watch, test:engine.
* Resolved Vitest native binding issue by installing @rolldown/binding-win32-x64-msvc.
* Added src/engine/pipeline.test.ts and passed 4 tests.

## Remaining work

* Add the next automated test batch for material analysis and blueprint readiness (the next suggested file in chat was src/engine/analysis-and-blueprint.test.ts).
* Add slide/package-focused automated tests so the stronger slide engine and package outputs stay protected.
* Do real output-quality validation later when the user wants it; manual testing was explicitly postponed.
* Real export generation is still placeholder-based.
* PDF/DOCX/PPTX extraction quality may still need deeper validation with realistic files.
* Large chunk warnings and Vite/esbuild/oxc warnings remain unresolved but were intentionally deprioritized.

## Next steps

1. Add automated tests for analyzeMaterial and buildBlueprint source readiness, then run npm test.
2. Add automated tests covering slide/package behavior now that package outputs use assembleSlideDeck.
3. Only after test coverage improves, inspect any concrete output-quality failures instead of doing more speculative refactors.
4. When the user wants, resume git push workflow carefully because unrelated staged/unstaged/untracked files exist in the repo.

## Important evidence

* Files referenced: src/engine/generateLesson.ts; src/engine/pipeline/runLessonPipeline.ts; src/engine/types.ts; src/engine/materials/extractTextFromFile.ts; src/engine/materials/analyzeMaterial.ts; src/engine/workflow/processMaterial.ts; src/engine/blueprint/buildBlueprint.ts; src/engine/blueprint/resolveBlueprintContent.ts; src/engine/blueprint/resolveBlueprintStructure.ts; src/engine/blueprint/buildBlueprintSourceReadiness.ts; src/engine/planning/buildLessonPlanningIdeas.ts; src/engine/spec/buildLessonSpec.ts; src/engine/package/buildLessonPackage.ts; src/engine/package/buildPackageOutputs.ts; src/engine/package/buildLessonPackageReadiness.ts; src/engine/slides/assembleSlideDeck.ts; src/engine/slides/buildSlidePlan.ts; src/engine/slides/buildSlideContent.ts; src/pages/MaterialsPage.tsx; src/pages/ResultsPage.tsx; package.json; src/engine/pipeline.test.ts
* SHAs actually referenced in chat: 9fadf6f (pushed to main earlier in chat), 09907ad (local commit message: Improve planning and lesson spec intelligence)
* Commands actually referenced: npm run build; npm run dev; npm test; npm install -D vitest @types/node; npm pkg set scripts.test="vitest run"; npm pkg set scripts.test:watch="vitest"; npm pkg set scripts.test:engine="vitest run src/engine/**/*.test.ts"; npm install -D @rolldown/binding-win32-x64-msvc; git status; git add .; git commit -m "Improve planning and lesson spec intelligence"; git push
* Test evidence actually observed: vitest run showed 1 file passed, 4 tests passed in src/engine/pipeline.test.ts

## Risks / cautions

* Do not break the core product rule: curriculum must remain content authority and exemplar must remain presentation authority.
* Do not reintroduce the older package-output bypass that built slides from planningIdeas.slidePlans instead of the slide engine.
* Do not treat current chunk-size or Vite warnings as blockers unless they start breaking builds or tests.
* Do not over-refactor the engine again without test- or output-driven evidence; the agreed direction was to stop speculative refactoring and rely more on testing.
* The repo currently contains unrelated staged, unstaged, and untracked files; any future commits must stay isolated.
* Preserve the user’s SOP: one PowerShell paste at a time, large safe steps, minimal friction, frequent build checks, periodic audits, and explicit continuation-ready handoffs.

## Next action

Start the next chat by adding the pending analysis/blueprint automated tests (the prepared but not yet created next file was src/engine/analysis-and-blueprint.test.ts), run npm test, and use any failures to decide the next targeted hardening step.

---

Imported from: docs/chat-handoffs/2026-03-17_1531_Keep watching for slide-logic drift into duplicate systems and avoid weakening the curriculum-versus-exemplar authority rule..md
Imported at: 2026-03-17 16:42

# Lesson Generator 8 Hardened Chat Handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue lesson-generator8 safely from the current state, harden core engine layers in plan order, save milestones to Git, and prepare a clean continuation handoff for another chat.

## Canonical project assumptions

* Project name is lesson-generator8-hardened and current repo folder is lesson-generator8.
* Curriculum is the non-negotiable content authority; exemplar is the non-negotiable presentation authority.
* Canonical user flow is Inputs -> Materials -> Results.
* Canonical engine flow is extraction -> analysis -> blueprint -> planning -> spec -> package -> results.
* Work should follow safest-largest-step discipline, one PowerShell paste at a time, with frequent build/test checks and regular Git checkpoints.
* Mixed-topic lessons should prefer a two-part lesson rather than one muddy lesson, and mixed-target handling should not overfire on simple phonics lessons.

## What was reviewed

* code files
* commits
* terminal output
* pasted handoff notes

## Current state

* Latest pushed commit at end of chat: a255d2c (`Strengthen analysis and package output coverage`).
* Previous pushed milestone in this chat: ca616a5 (`Strengthen extraction and blueprint test coverage`).
* Verified local state before the final unverified UI edit: 7 test files passing, 31 tests passing, build passing.
* Extraction, analysis, blueprint/readiness, pipeline, slides, and package outputs all have direct test coverage.
* `src/pages/ResultsPage.tsx` was locally replaced near the end of the chat to add a stronger teacher-facing traceability section, but that local edit was not yet verified with build/tests, committed, or pushed.

## Decisions made

* Safest largest next step after earlier milestones was to strengthen `src/engine/materials/analyzeMaterial.ts` without changing its contract.
* Extraction cleanup stayed centralized in `src/engine/materials/extractTextFromFile.ts` instead of spreading noise filtering across the pipeline.
* Tests should be written against real engine contracts, not shallow fake object shapes.
* Package output behavior needed direct coverage before further downstream work.
* Results traceability was identified as the next hardening target after upstream engine stabilization.
* Workflow rule reinforced: inspect real file/contract first, then make one clean replacement, then verify; avoid ΓÇ£a million patches.ΓÇ¥

## Completed work

* Added and verified stronger extraction contract coverage in `src/engine/extraction.test.ts`.
* Hardened extraction normalization/noise filtering in `src/engine/materials/extractTextFromFile.ts`.
* Added and verified analysis signal coverage in `src/engine/analysis-signals.test.ts`.
* Added and verified blueprint readiness coverage in `src/engine/blueprint-readiness.test.ts`.
* Strengthened `src/engine/materials/analyzeMaterial.ts` to improve curriculum target/practice/example detection, exemplar teacher-move/prompt/pacing detection, and phonics/comprehension tag inference while preserving compatibility with existing tests.
* Added and verified package output coverage in `src/engine/package-outputs.test.ts`.
* Confirmed green test/build checkpoints multiple times and pushed two milestones:

  * ca616a5 ΓÇö `Strengthen extraction and blueprint test coverage`
  * a255d2c ΓÇö `Strengthen analysis and package output coverage`

## Remaining work

* Verify the current local `src/pages/ResultsPage.tsx` edit that adds traceability/explanation UI.
* If needed, fix any build/type issues in that Results page change in one clean pass.
* Commit and push the verified Results traceability milestone separately.
* Continue hardening results traceability / source-influence visibility after the UI compiles.
* Later targets still not complete: canonical package/readiness hardening, mixed-target teacher decision UI, real export generation, deeper extraction/parser realism.

## Next steps

1. Run a build to verify the current local `src/pages/ResultsPage.tsx` change.
2. If build fails, inspect the exact error and fix `src/pages/ResultsPage.tsx` in one clean edit.
3. Re-run build and optionally tests to confirm the Results traceability change is stable.
4. Commit and push the ResultsPage traceability milestone only.
5. After that, continue improving source-influence visibility and readiness explanation in Results.
6. Then move to can
## Important evidence

* SHAs referenced in chat:

  * a255d2c
  * ca616a5
  * 4505c0c
  * 228608a
* Files explicitly reviewed or edited in chat:

  * src/engine/materials/extractTextFromFile.ts
  * src/engine/materials/analyzeMaterial.ts
  * src/engine/analysis-signals.test.ts
  * src/engine/extraction.test.ts
  * src/engine/blueprint-readiness.test.ts
  * src/engine/package/buildPackageOutputs.ts
  * src/engine/package-outputs.test.ts
  * src/engine/types.ts
  * src/pages/ResultsPage.tsx
* Commands explicitly used/referenced in chat:

  * npm test
  * npm run build
  * git status
  * git add
  * git commit -m "Strengthen extraction and blueprint test coverage"
  * git commit -m "Strengthen analysis and package output coverage"
  * git push
  * Get-Content .\src\engine\materials\analyzeMaterial.ts
  * Get-Content .\src\pages\ResultsPage.tsx

## Risks / cautions

* Do not bypass the curriculum-vs-exemplar authority rule.
* Do not reintroduce patch-churn or scattered micro-fixes; keep the workflow to one safe chunk, one verification step.
* Do not move on to new features before verifying the current local ResultsPage change.
* Do not prioritize exports ahead of source-trace trust and readiness hardening.
* Do not write mature-layer tests against fake contracts when the real typed contract is already available.
* The current local `src/pages/ResultsPage.tsx` change is unverified; treat it as open work, not finished work.

## Next action

Start by verifying the current local `src/pages/ResultsPage.tsx` change with a build before doing any new feature work.

---

Imported from: docs/chat-handoffs/2026-03-17_1539_order.md
Imported at: 2026-03-17 16:42

# Lesson Generator 8 Hardened Chat Handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue lesson-generator8 safely from the current state, harden core engine layers in plan order, save milestones to Git, and prepare a clean continuation handoff for another chat.

## Canonical project assumptions

* Project name is lesson-generator8-hardened and current repo folder is lesson-generator8.
* Curriculum is the non-negotiable content authority; exemplar is the non-negotiable presentation authority.
* Canonical user flow is Inputs -> Materials -> Results.
* Canonical engine flow is extraction -> analysis -> blueprint -> planning -> spec -> package -> results.
* Work should follow safest-largest-step discipline, one PowerShell paste at a time, with frequent build/test checks and regular Git checkpoints.
* Mixed-topic lessons should prefer a two-part lesson rather than one muddy lesson, and mixed-target handling should not overfire on simple phonics lessons.

## What was reviewed

* code files
* commits
* terminal output
* pasted handoff notes

## Current state

* Latest pushed commit at end of chat: a255d2c (`Strengthen analysis and package output coverage`).
* Previous pushed milestone in this chat: ca616a5 (`Strengthen extraction and blueprint test coverage`).
* Verified local state before the final unverified UI edit: 7 test files passing, 31 tests passing, build passing.
* Extraction, analysis, blueprint/readiness, pipeline, slides, and package outputs all have direct test coverage.
* `src/pages/ResultsPage.tsx` was locally replaced near the end of the chat to add a stronger teacher-facing traceability section, but that local edit was not yet verified with build/tests, committed, or pushed.

## Decisions made

* Safest largest next step after earlier milestones was to strengthen `src/engine/materials/analyzeMaterial.ts` without changing its contract.
* Extraction cleanup stayed centralized in `src/engine/materials/extractTextFromFile.ts` instead of spreading noise filtering across the pipeline.
* Tests should be written against real engine contracts, not shallow fake object shapes.
* Package output behavior needed direct coverage before further downstream work.
* Results traceability was identified as the next hardening target after upstream engine stabilization.
* Workflow rule reinforced: inspect real file/contract first, then make one clean replacement, then verify; avoid ΓÇ£a million patches.ΓÇ¥

## Completed work

* Added and verified stronger extraction contract coverage in `src/engine/extraction.test.ts`.
* Hardened extraction normalization/noise filtering in `src/engine/materials/extractTextFromFile.ts`.
* Added and verified analysis signal coverage in `src/engine/analysis-signals.test.ts`.
* Added and verified blueprint readiness coverage in `src/engine/blueprint-readiness.test.ts`.
* Strengthened `src/engine/materials/analyzeMaterial.ts` to improve curriculum target/practice/example detection, exemplar teacher-move/prompt/pacing detection, and phonics/comprehension tag inference while preserving compatibility with existing tests.
* Added and verified package output coverage in `src/engine/package-outputs.test.ts`.
* Confirmed green test/build checkpoints multiple times and pushed two milestones:

  * ca616a5 ΓÇö `Strengthen extraction and blueprint test coverage`
  * a255d2c ΓÇö `Strengthen analysis and package output coverage`

## Remaining work

* Verify the current local `src/pages/ResultsPage.tsx` edit that adds traceability/explanation UI.
* If needed, fix any build/type issues in that Results page change in one clean pass.
* Commit and push the verified Results traceability milestone separately.
* Continue hardening results traceability / source-influence visibility after the UI compiles.
* Later targets still not complete: canonical package/readiness hardening, mixed-target teacher decision UI, real export generation, deeper extraction/parser realism.

## Next steps

1. Run a build to verify the current local `src/pages/ResultsPage.tsx` change.
2. If build fails, inspect the exact error and fix `src/pages/ResultsPage.tsx` in one clean edit.
3. Re-run build and optionally tests to confirm the Results traceability change is stable.
4. Commit and push the ResultsPage traceability milestone only.
5. After that, continue improving source-influence visibility and readiness explanation in Results.
6. Then move to canonical package/readiness hardening, mixed-target decision UI, and exports in that 
## Important evidence

* SHAs referenced in chat:

  * a255d2c
  * ca616a5
  * 4505c0c
  * 228608a
* Files explicitly reviewed or edited in chat:

  * src/engine/materials/extractTextFromFile.ts
  * src/engine/materials/analyzeMaterial.ts
  * src/engine/analysis-signals.test.ts
  * src/engine/extraction.test.ts
  * src/engine/blueprint-readiness.test.ts
  * src/engine/package/buildPackageOutputs.ts
  * src/engine/package-outputs.test.ts
  * src/engine/types.ts
  * src/pages/ResultsPage.tsx
* Commands explicitly used/referenced in chat:

  * npm test
  * npm run build
  * git status
  * git add
  * git commit -m "Strengthen extraction and blueprint test coverage"
  * git commit -m "Strengthen analysis and package output coverage"
  * git push
  * Get-Content .\src\engine\materials\analyzeMaterial.ts
  * Get-Content .\src\pages\ResultsPage.tsx

## Risks / cautions

* Do not bypass the curriculum-vs-exemplar authority rule.
* Do not reintroduce patch-churn or scattered micro-fixes; keep the workflow to one safe chunk, one verification step.
* Do not move on to new features before verifying the current local ResultsPage change.
* Do not prioritize exports ahead of source-trace trust and readiness hardening.
* Do not write mature-layer tests against fake contracts when the real typed contract is already available.
* The current local `src/pages/ResultsPage.tsx` change is unverified; treat it as open work, not finished work.

## Next action

Start by verifying the current local `src/pages/ResultsPage.tsx` change with a build before doing any new feature work.

---

Imported from: docs/chat-handoffs/2026-03-17_1544_ore-making-further-baseline-claims..md
Imported at: 2026-03-17 16:42

# lesson-generator8 chat handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Preserve a repo-ready handoff based only on evidence visible in this chat, centered on baseline packaging, prior audit context, and safe continuation.

## Canonical project assumptions

* The repo in scope is `jodiwankenobi8-arch/lesson-generator8`.
* The product is a teacher-facing lesson package generator with a wizard flow of Inputs -> Materials -> Results.
* A stated product rule from prior visible chat context is: curriculum is content authority and exemplar is presentation authority.
* The user wants a solid baseline, not a minimal or fragile one.
* The user does not want history kept unless it is relied upon to function.

## What was reviewed

* code files
* commits
* PRs
* issues
* terminal output
* pasted handoff notes

## Current state

The visible chat evidence shows partial review context rather than a fresh repo-wide audit in this thread. Prior context excerpts indicate an executive audit existed for `lesson-generator8-hardened`, with emphasis on the curriculum/exemplar authority rule and improving content quality influence. In this chat, packaging succeeded only for uploaded HTML review artifacts, not for a full app baseline download from the connected GitHub repo. The connected repo was inspected enough to reference ZIP export-related code and historical ZIP artifacts in repo history, but no full repo archive was produced here.

## Decisions made

* Preserve behavior lineage over path lineage: keep only history that is required for current function.
* Prioritize a solid baseline and hardening over a merely working baseline.
* Treat curriculum as the instructional/content authority and exemplar as the presentation/structure authority.
* Do not claim a full repo-wide review based on this chat alone.
* Isolate any handoff commit to the generated handoff file only.

## Completed work

* A downloadable ZIP was created containing the three uploaded HTML artifacts:

  * `Project - App Development 222.html`
  * `Project - App Development Review2132132.html`
  * `Project - App Development Review.html`
* A readable HTML export of visible chat interactions was created:

  * `chat_interactions_readable_export.html`
* The chat established that a full baseline app ZIP was not produced from the GitHub-connected repo in this thread.

## Remaining work

* Produce a true app baseline download from actual repo contents.
* Resolve any dependency, build, and foundation issues needed for a solid baseline.
* Update README while keeping design specs summarized rather than excessively verbose.
* Continue hardening only with evidence-backed review of actual code seams and current implementation state.
* Avoid reviving unnecessary history unless runtime behavior depends on it.

## Next steps

1. Use the connected repo as the primary source of truth and inspect current code directly bef2. Reconstruct or package a real baseline from repo contents rather than uploaded review artifacts.
3. Validate dependency health, build validity, and any blocking foundation issues.
4. Update README to reflect current architecture and summarize design specs.
5. Continue from the curriculum/exemplar authority rule when evaluating lesson generation behavior and seams.
6. Save future chat handoffs under `docs/chat-handoffs/` for continuation continuity.

## Important evidence

* Repo: `jodiwankenobi8-arch/lesson-generator8`
* Referenced code path: `src/engine/exports/exportFullZip.ts`
* Referenced code path: `src/pages/ResultsHubPage.tsx`
* Historical ZIP artifact path mentioned: `Project/lesson-generator8_new_project_folder.zip`
* Historical ZIP artifact path mentioned: `Project/lesson-generator8_pruned_safe.zip`
* Uploaded artifact packaged in chat: `Project - App Development 222.html`
* Uploaded artifact packaged in chat: `Project - App Development Review2132132.html`
* Uploaded artifact packaged in chat: `Project - App Development Review.html`
* Exported interaction file created in chat: `chat_interactions_readable_export.html`

## Risks / cautions

* Do not claim repo-wide review or completion beyond what was actually evidenced in this chat.
* Do not delete history that current behavior depends on.
* Do not bypass the curriculum/content vs exemplar/presentation rule when continuing architecture or cleanup work.
* Do not assume prior generated ZIP links are valid or reproducible without current repo-backed packaging.
* Do not include unrelated staged, unstaged, or untracked files in this handoff commit.

## Next action

Open the current repo state and continue from the baseline-hardening objective by inspecting the real implementation behind `src/engine/exports/exportFullZip.ts` and `src/pages/ResultsHubPage.tsx`, then package a true repo-backed baseline.

---

Imported from: docs/chat-handoffs/2026-03-17_1549_p-remove-replace-restyle.md
Imported at: 2026-03-17 16:42

# Lesson Generator 8 Hardened chat handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue from the prior handoff, confirm current extraction state, implement OCR-candidate signaling and hardening, move the repo out of a OneDrive-locked folder, add PDF OCR fallback extraction, and define the next cleanup architecture for exemplar feature detection and transformation.

## Canonical project assumptions

* Curriculum is the content authority and exemplar is the presentation authority.
* The system should accept any uploaded materials, detect what is already covered, avoid duplication, and ask before adding important missing areas.
* Deterministic pipeline layers should remain in place; AI should improve upstream signals, not replace blueprint orchestration.
* Exemplar controls should work for any exemplar, not just a Figma slide deck.
* Exemplar UX should be detection first, then teacher choice: keep, remove, replace, restyle.
* The system should separate what an exemplar contains from what the teacher wants done with it.
* Workflow rules in this chat were strict: one PowerShell paste at a time, biggest safe chunk, inspect real files first, frequent test/build checks, frequent git pushes, and structured checkpoints.

## What was reviewed

* code files
* commits
* terminal output
* pasted handoff notes

## Current state

The active working folder moved from a OneDrive-backed path to `C:\Users\jodiw\Desktop\lesson-generator8-local` because npm installs were blocked by repeated Windows/OneDrive file locks in the original folder. The repo is on `main` and the latest pushed commit from this chat is `93b7e10` (`Add PDF OCR fallback extraction`).

Extraction is now parser-first, quality-scored, OCR-candidate aware, and includes real PDF OCR fallback. OCR fallback is conditional and bounded: parser runs first, OCR is attempted only for low-quality OCR-candidate PDFs with a file buffer, parser output is retained if OCR does not materially improve extraction, and metadata remains interpretable. Tests and build were green after this work, with the test count rising from 40 to 46 over the course of the chat.

The next seam identified for cleanup is the analysis/process boundary. `analyzeMaterial.ts` already owns most role-specific `MaterialAnalysis` creation, while `processMaterial.ts` still partially reconstructs `summary`, `tags`, `sourceRole`, and `extractedText` after analysis returns.

## Decisions made

* Solidify before code-splitting. Bundle warnings were treated as non-blocking; extraction architecture took priority.
* Add OCR-candidate signaling before adding real OCR.
* Use browser-safe OCR architecture for PDFs: `pdfjs-dist` to render pages and `tesseract.js` for OCR.
* Keep extraction deterministic: parser first, then OCR fallback, then possible future AI refinement.
* Preserve blueprint/spec/package determinism; do not replace blueprint orchestration with AI.
* Treat exemplar reuse as a universal template transformation problem for any exemplar, not a Figma-specific feature.
* Use a hybrid exemplar UX: first ask how to use the exemplar, then analyze it and list detected features, then let the teacher choose what to kee* The key architecture tweak for future work is to separate detected exemplar features from teacher-selected exemplar transformations.

## Completed work

* Confirmed current pushed baseline and validated that OCR-candidate fields were not yet present at the start of this chat.
* Added OCR-candidate extraction signals and pushed `0911c13`.
* Hardened extraction tests for OCR-candidate behavior and pushed `b951160`.
* Expanded extraction tests further; by the end of the chat the suite was at 46 passing tests.
* Moved repo work to `C:\Users\jodiw\Desktop\lesson-generator8-local` due to persistent OneDrive/node_modules file-lock failures during npm install.
* Installed `tesseract.js` and `pdfjs-dist` and pushed `697961e`.
* Added `src/engine/materials/extractPdfOcr.ts`.
* Wired PDF OCR fallback into `src/engine/materials/extractTextFromFile.ts`.
* Pushed real PDF OCR fallback extraction in `93b7e10`.
* Inspected and documented the current cleanup seam across `src/engine/types.ts`, `src/engine/materials/analyzeMaterial.ts`, and `src/engine/workflow/processMaterial.ts`.

## Remaining work

* Add non-breaking exemplar architecture contracts:

  * detected feature keys and detected feature items
  * detected feature collection
  * teacher transformation request object
* Clean up `processMaterial.ts` so `analyzeMaterial.ts` owns more of the full `MaterialAnalysis` and duplicated rebuild logic is reduced.
* Deepen `analyzeMaterial.ts` to produce richer exemplar feature detection.
* Add tests for exemplar feature detection and later for transformation-ready outputs.
* Build the user-friendly exemplar selection flow on top of detected features.
* PPTX/image OCR fallback is still not implemented.
* AI-assisted extraction/refinement is still not implemented.
* The true AI-backed material-analysis layer is still the biggest unfinished upstream intelligence gap.
* Exports remain early/placeholder.

## Next steps

1. Add the new exemplar contract types in `src/engine/types.ts` without changing runtime behavior yet:

   * `ExemplarDetectedFeatureKey`
   * `ExemplarDetectedFeature`
   * `ExemplarDetectedFeatures`
   * `ExemplarTransformationRequest`
2. Run `npm test` to confirm the contract-only step is non-breaking.
3. Refactor `src/engine/workflow/processMaterial.ts` so `analyzeMaterial.ts` owns more of `MaterialAnalysis` and duplicate summary/tag/sourceRole rebuilding is reduced.
4. Expand `src/engine/materials/analyzeMaterial.ts` to emit richer detected exemplar features using stable internal keys.
5. Add tests for detected exemplar features and transformation-ready analysis outputs.
6. After that, build the teacher-facing exemplar flow:

   * how to use exemplar
   * detected features list
   * keep/remove/replace/restyle controls

## Important evidence

* Repo: `jodiwankenobi8-arch/lesson-generator8`
* Branch reviewed in terminal: `main`
* SHAs referenced in this chat:

  * `93b7e10` — `Add PDF OCR fallback extraction`
  * `697961e` — `Install OCR dependencies and harden extraction tests`
  * `b951160` — `Add OCR candidate extraction tests`
  * `0911c13` — `Add OCR candidate extraction signals`
  * `9a30b61` — `Add extraction metadata and quality scoring`
* Files explicitly reviewed in this chat:

  * `src/engine/types.ts`
  * `src/engine/materials/extractTextFromFile.ts`
  * `src/engine/materials/extractPdfOcr.ts`
  * `src/engine/materials/analyzeMaterial.ts`
  * `src/engine/workflow/processMaterial.ts`
  * `src/engine/extraction.test.ts`
  * `src/pages/MaterialsPage.tsx`
  * `package.json`
* Terminal commands/actions explicitly used:

  * `npm test`
  * `npm run build`
  * `git status --short`
  * `git log --oneline -5`
  * `git add ...`
  * `git commit -m "..."`
  * `git push`
  * `npm install tesseract.js pdfjs-dist`
  * `robocopy . $dest /MIR /XD node_modules dist .vite`
* Active local working folder established in this chat:

  * `C:\Users\jodiw\Desktop\lesson-generator8-local`

## Risks / cautions

* Do not continue working in the original OneDrive-backed repo path for package installation work unless the lock issue is intentionally resolved; npm operations there repeatedly failed with EPERM/rmdir errors.
* Do not bypass the parser-first rule by making OCR the default extraction path.
* Do not blur curriculum content authority with exemplar presentation authority.
* Do not mix detected exemplar features with user-selected transformations in one loose object; that is the next architectural risk to avoid.
* Do not skip checkpoint discipline; this chat relied on frequent test/build/push cycles to stay stable.
* Do not assume repo-wide review happened beyond the files, terminal output, and handoff notes explicitly examined in this chat.

## Next action

Start from `C:\Users\jodiw\Desktop\lesson-generator8-local` and make the contract-only type update in `src/engine/types.ts` to add exemplar detected-feature and transformation-request types, then run `npm test` before touching `processMaterial.ts` or `analyzeMaterial.ts`.

---

Imported from: docs/chat-handoffs/2026-03-17_1552_emaining-work.md
Imported at: 2026-03-17 16:42

# Lesson Generator 8 chat handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue lesson-generator8 from the current state, preserve all project SOPs/preferences, improve the core app UX/design, harden extraction traceability, and prepare the extraction layer for OCR/AI work without losing architecture discipline.

## Canonical project assumptions

* Project/repo is `lesson-generator8` on GitHub repo `jodiwankenobi8-arch/lesson-generator8` on branch `main`.
* Product is a teacher-facing lesson generation system.
* Canonical product rule is: curriculum = content authority; exemplar = presentation authority.
* System should not be locked to named curricula; it should detect what uploaded materials already cover and avoid duplicating it.
* Missing meaningful lesson areas should be surfaced for teacher choice rather than silently forced in.
* Mixed-target lessons should prefer a two-part lesson over a muddy single lesson when warranted.
* Sight words belong on the foundational-skills / phonics side, not as a separate top-level lesson mode.
* Development workflow must stay deterministic, interpretable, beginner-friendly, and low-friction.

## What was reviewed

* code files
* commits
* terminal output
* pasted handoff notes

## Current state

The project is in a stable, pushed state with latest confirmed commit `9a30b61` (`Add extraction metadata and quality scoring`). Main flow pages were visually aligned to the orchard theme in an earlier pushed commit `d7cd0e4` (`Add orchard theme and align core app pages`). Live regeneration for missing-area teacher decisions was already implemented and pushed earlier in `03592ad`. Build and tests were repeatedly verified as green in this chat, including 8 test files / 40 tests passing. The extraction layer is parser-first and now includes extraction metadata and smarter quality scoring, and the Materials page surfaces extraction provenance. OCR itself is not implemented yet. AI-assisted extraction/analysis is also not implemented yet.

## Decisions made

* Keep blueprint orchestration deterministic. `buildBlueprint.ts` is an orchestrator and should not be replaced by AI first.
* Improve upstream inputs feeding blueprint resolvers rather than replacing resolver logic.
* Use parser-first extraction, then OCR fallback later, then AI refinement later if needed.
* Add extraction provenance before OCR so the system remains interpretable.
* Surface extraction method / quality / confidence / notes in the Materials UI before adding OCR execution.
* Preserve plan-order discipline: UI polish and extraction hardening first, then OCR candidate gating, then OCR, then bounded AI enhancements.
* Continue using one PowerShell paste at a time, inspect real files first, prefer clean full-file replacements, and verify after each major change.

## Completed work

* Reviewed and preserved the full continuation handoff and project SOPs/preferences.
* Confirmed and continued from pushed milestones including:

  * `03592ad` ΓÇö Add live regeneration for missing-area decisions
  * `d7cd0e4` ΓÇö Add orchard theme and align core app pages
  * `9a30b61` ΓÇö Add extraction metadata and quality scoring
* Styled the core flow around the orchard theme across:

  * `src/main.tsx`
  * `src/App.tsx`
  * `src/pages/InputsPage.tsx`
  * `src/pages/MaterialsPage.tsx`
  * `src/pages/ResultsPage.tsx`
  * `src/styles/theme.css`
* Confirmed build/test stability after the visual pass.
* Inspected extraction entrypoint and its tests:

  * `src/engine/materials/extractTextFromFile.ts`
  * `src/engine/extraction.test.ts`
* Inspected workflow and analysis consumers:

  * `src/engine/workflow/processMaterial.ts`
  * `src/engine/materials/analyzeMaterial.ts`
* Extended the type contract to support extraction provenance in:

  * `src/engine/types.ts`
* Wired extraction metadata through:

  * `src/engine/materials/extractTextFromFile.ts`
  * `src/engine/workflow/processMaterial.ts`
* Surfaced extraction metadata in:

  * `src/pages/MaterialsPage.tsx`
* Upgraded extraction quality scoring from simple line-count-only logic to a more structured scoring based on:

  * usable line count
  * average line length
  * alpha character ratio
  * long-line presence
* Inspected blueprint orchestration and resolvers:

  * `src/engine/blueprint/buildBlueprint.ts`
  * `src/engine/blueprint/resolveBlueprintContent.ts`
  * `src/engine/blueprint/resolveBlueprintStructure.ts`

## R
* OCR is not implemented yet.
* OCR candidate marking was identified as the next safest step, but there is no confirmed pushed implementation from this chat for `ocrCandidate` / `ocrReason`.
* AI-assisted extraction is not implemented yet.
* AI-enhanced analysis is not implemented yet.
* Export flow remains early/placeholder.
* Extraction tests do not yet appear to cover the new extraction metadata scoring behavior from this chat.
* Bundle-size warning remains during builds but was treated as non-blocking.

## Next steps

1. Inspect the exact pushed state of:

   * `src/engine/types.ts`
   * `src/engine/materials/extractTextFromFile.ts`
   * `src/pages/MaterialsPage.tsx`
2. Add OCR-candidate marking to extraction metadata in a deterministic way, likely by extending metadata with fields like `ocrCandidate` and `ocrReason`.
3. Surface OCR-candidate status in Materials UI so low-quality parser results are visible before actual OCR exists.
4. Verify with `npm run build` and `npm test`.
5. Add focused tests for extraction metadata quality / OCR-candidate gating.
6. Only after the gating layer is solid, add actual OCR fallback for low-quality PDF/PPTX parser results.
7. After OCR fallback is stable, explore bounded AI refinement for extraction and then bounded AI enhancements for material analysis.

## Important evidence

* Repo: `jodiwankenobi8-arch/lesson-generator8`
* Branch: `main`
* Confirmed pushed SHAs referenced in this chat:

  * `9a30b61` ΓÇö Add extraction metadata and quality scoring
  * `d7cd0e4` ΓÇö Add orchard theme and align core app pages
  * `03592ad` ΓÇö Add live regeneration for missing-area decisions
  * `50080be`
  * `9f6683d` ΓÇö Add teacher decisions for missing lesson areas
* Files explicitly reviewed or edited in this chat:

  * `src/main.tsx`
  * `src/App.tsx`
  * `src/pages/InputsPage.tsx`
  * `src/pages/MaterialsPage.tsx`
  * `src/pages/ResultsPage.tsx`
  * `src/styles/theme.css`
  * `src/engine/types.ts`
  * `src/engine/materials/extractTextFromFile.ts`
  * `src/engine/workflow/processMaterial.ts`
  * `src/engine/materials/analyzeMaterial.ts`
  * `src/engine/extraction.test.ts`
  * `src/engine/blueprint/buildBlueprint.ts`
  * `src/engine/blueprint/resolveBlueprintContent.ts`
  * `src/engine/blueprint/resolveBlueprintStructure.ts`
  * `src/state/useLessonStore.ts`
* Commands/output explicitly referenced:

  * `npm run build`
  * `npm test`
  * `git status`
  * `git add ...`
  * `git commit -m "Add orchard theme and align core app pages"`
  * `git commit -m "Add extraction metadata and quality scoring"`
  * `git push`
* Observed test status multiple times:

  * 8 test files passing
  * 40 tests passing

## Risks / cautions

* Do not lose the canonical SOPs:

  * one PowerShell paste at a time
  * safest biggest step
  * inspect real files first
  * low-friction workflow
  * build/test frequently
  * git checkpoints after meaningful milestones
  * checkpoint every 2ΓÇô3 steps
  * plan-order discipline
* Do not blur curriculum content authority with exemplar presentation authority.
* Do not replace deterministic blueprint orchestration with AI.
* Do not jump straight to OCR or AI without preserving traceability and gating logic.
* Do not claim repo-wide review beyond files and outputs actually inspected in this chat.
* Do not revive deleted/old paths blindly; this chat found the real blueprint orchestrator was `buildBlueprint.ts`, not `buildLessonBlueprint.ts`.
* Treat drafted-but-unconfirmed OCR-candidate additions as planned work, not completed work.

## Next action

From repo root, inspect the exact current pushed versions of `src/engine/types.ts`, `src/engine/materials/extractTextFromFile.ts`, and `src/pages/MaterialsPage.tsx`, then implement OCR-candidate marking in extraction metadata and Materials UI, followed by `npm run build` and `npm test`.

---

Imported from: docs/chat-handoffs/2026-03-17_1555_d-live-in-planning-first-then-be-reflected-in-spec-then-exposed-in-package-results-rather-than-being-scattered..md
Imported at: 2026-03-17 16:42

# Lesson Generator 8 Hardened continuation handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue lesson-generator8 from the current pushed state, preserve project rules and SOPs, harden missing-area coverage logic, expose teacher-facing decisions, and carry that logic into generation without losing architecture discipline.

## Canonical project assumptions

* The project is a teacher-facing AI lesson generation system that follows a canonical pipeline: Inputs -> Materials Upload -> Material Extraction -> Material Analysis -> Blueprint Construction -> Planning Ideas -> Lesson Spec -> Lesson Package Construction -> Results UI.
* Curriculum is the content authority and exemplar is the presentation authority.
* The product should accept any uploaded materials rather than being locked to named curricula like UFLI or Savvas.
* The primary system behavior is coverage detection: determine what uploaded materials already cover, avoid duplication, and ask before adding important missing areas.
* Mixed instructional targets should prefer a clearer two-part lesson rather than a muddy single lesson when appropriate.
* Sight words belong on the foundational-skills / phonics side, not as a separate top-level lesson mode.
* Development must follow strict SOPs: one PowerShell paste at a time, safest biggest step, inspect real files/contracts first, keep logic deterministic and interpretable, build/test frequently, push meaningful milestones, and checkpoint every 2ΓÇô3 steps.

## What was reviewed

* code files

  * src/engine/types.ts
  * src/engine/planning/buildLessonPlanningIdeas.ts
  * src/engine/spec/buildLessonSpec.ts
  * src/engine/package/buildLessonPackage.ts
  * src/engine/package/buildPackageOutputs.ts
  * src/engine/generateLesson.ts
  * src/engine/pipeline/runLessonPipeline.ts
  * src/state/useLessonStore.ts
  * src/pages/InputsPage.tsx
  * src/pages/MaterialsPage.tsx
  * src/pages/ResultsPage.tsx
  * src/App.tsx
* commits

  * earlier pushed milestones were referenced, including 0245c01, 5efbfdd, d5e096c, and 9f6683d
* PRs

  * none reviewed in this chat
* issues

  * none reviewed in this chat
* terminal output

  * repeated npm test and npm run build results
  * repeated git status / add / commit / push output
  * file contents pasted from PowerShell Get-Content
* pasted handoff notes

  * a large continuation handoff was provided and refined in this chat

## Current state

The repo advanced beyond the earlier coverage-aware analysis milestone into a fuller missing-area decision architecture. Planning now computes major component coverage and missing-area prompt candidates. Spec surfaces missing-area decision lines instead of silently assuming every component should always be present. Package output and Results expose coverage status, evidence, and missing-area prompts. Teacher decisions for missing lesson areas are now stored in Zustand, surfaced in Results, and generation now honors those decisions for package-relevant areas: centers, small_group, and intervention. The project was repeatedly verified with npm test and npm run build in this chat. The latest pushed commit explicitly referenced in chat before the final uncommitted wiring step was 9f6683d.

## Decisions made

* Coverage-first behavior is the primary product direction; curriculum-brand detection is secondary at most.
* Missing-area logic shoul* Backward compatibility matters: newly added type fields like coverage and planning-level missing-area fields were treated carefully to avoid breaking older fixtures/builders.
* Results was chosen as the first teacher decision surface because missing-area prompts only exist after planning/spec/package are produced.
* Teacher decision storage was added in state before live regeneration, so the architecture would remain clean and continuation-ready.
* Package generation was wired to honor teacher decisions first for package-relevant areas only: centers, small_group, and intervention. This avoided overreaching into all lesson sections in one step.
* The next major UX seam is live regeneration on decision change rather than forcing manual reruns.

## Completed work

* Confirmed and preserved the projectΓÇÖs canonical assumptions, SOPs, and product rules.
* Reviewed and summarized the current repo state from pasted file contents and terminal output.
* Added planning-level component coverage and missing-area prompt candidates.
* Updated spec generation so it surfaces decision lines rather than assuming every component should always be added.
* Exposed coverage decisions and missing-area prompts in package output and Results.
* Added teacher decision capture in Results with Add it / Leave it out / Decide later choices.
* Added Zustand state for missingAreaDecisions.
* Wired generation and package construction so teacher decisions are consumed by:

  * src/engine/generateLesson.ts
  * src/engine/pipeline/runLessonPipeline.ts
  * src/engine/package/buildLessonPackage.ts
  * src/engine/package/buildPackageOutputs.ts
* Made package generation honor teacher decisions for:

  * centers
  * small_group
  * intervention
* Repeatedly validated the work with npm test and npm run build.
* Pushed these milestones during the chat:

  * 5efbfdd ΓÇö Add planning coverage and missing-area prompts
  * d5e096c ΓÇö Expose coverage decisions in package and results
  * 9f6683d ΓÇö Add teacher decisions for missing lesson areas

## Remaining work

* Live regeneration is not yet implemented. Teacher decisions are stored and consumed on generation, but the Results page does not yet automatically regenerate the lesson when a decision changes.
* Coverage-aware / decision-aware regeneration is still limited mainly to package-relevant areas; broader downstream honoring for teach/guided/independent/closure remains future work if done cleanly.
* Exports remain mostly placeholders.
* Extraction/parser realism can still improve, especially for real-world PDFs/DOCX/PPTX.
* Materials UX can still be hardened further, especially around live progress/persistence polish.
* There were repeated very long ResultsPage paste operations late in the chat; avoid reviving duplicated content or assuming those repetitions represented new design decisions.

## Next steps

1. Implement live regeneration when a teacher changes a missing-area decision in Results.
2. Keep the implementation in plan order and use the existing generation handoff points:

   * src/engine/generateLesson.ts
   * src/engine/pipeline/runLessonPipeline.ts
   * src/state/useLessonStore.ts
   * src/pages/ResultsPage.tsx
3. Ensure decision changes trigger regeneration automatically and update blueprint/planning/spec/package consistently.
4. Re-run npm test and npm run build.
5. Push the regeneration milestone as a clean, isolated commit.
6. After that, continue with either broader decision-aware generation or export/materials hardening, depending on the cleanest next seam.

## Important evidence

* Repo: jodiwankenobi8-arch/lesson-generator8
* Branch reviewed in terminal output: main
* SHAs referenced in chat:

  * 0245c01
  * 5efbfdd
  * d5e096c
  * 9f6683d
* Commands actually referenced:

  * git status
  * git add
  * git commit -m "Add planning coverage and missing-area prompts"
  * git commit -m "Expose coverage decisions in package and results"
  * git commit -m "Add teacher decisions for missing lesson areas"
  * git push
  * npm test
  * npm run build
  * Get-Content on the files listed above
* Files directly inspected in chat:

  * src/engine/types.ts
  * src/engine/planning/buildLessonPlanningIdeas.ts
  * src/engine/spec/buildLessonSpec.ts
  * src/engine/package/buildLessonPackage.ts
  * src/engine/package/buildPackageOutputs.ts
  * src/engine/generateLesson.ts
  * src/engine/pipeline/runLessonPipeline.ts
  * src/state/useLessonStore.ts
  * src/pages/InputsPage.tsx
  * src/pages/MaterialsPage.tsx
  * src/pages/ResultsPage.tsx
  * src/App.tsx

## Risks / cautions

* Do not bypass the standard operating procedures. The user explicitly requires one PowerShell paste at a time, safest biggest step, inspect-then-edit workflow, frequent verification, and regular checkpoints.
* Do not blur curriculum/content authority with exemplar/presentation authority.
* Do not reintroduce brand-locked curriculum assumptions.
* Do not silently force missing lesson components when the product direction is to ask before adding important missing areas.
* Do not assume repo-wide review beyond the files and terminal evidence in this chat.
* Do not delete or revive duplicated late-chat ResultsPage paste content as if it were separate feature work; it was repeated terminal content, not a new milestone.
* Do not commit unrelated staged/unstaged files when continuing; the user explicitly called out that the repo can contain unrelated work.

## Next action

Start from the current state after 9f6683d plus the in-chat package-generation wiring work, inspect the existing generation/store/results seam, and implement live regeneration so that changing a missing-area decision in Results automatically reruns generation and updates the lesson package immediately.

---

Imported from: docs/chat-handoffs/2026-03-17_1559_s-sourcerole-and-only-attaches-extraction-metadata.md
Imported at: 2026-03-17 16:42

# lesson-generator8 chat handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue the lesson-generator8 hardening work from the current repo state, strengthen architecture and tests, avoid patch churn, and prepare a continuation-ready handoff grounded only in this chat.

## Canonical project assumptions

* The active local working folder is `C:\Users\jodiw\Desktop\lesson-generator8-local`.
* The repo is `jodiwankenobi8-arch/lesson-generator8` on branch `main`.
* Curriculum is the content authority; exemplar is the presentation authority.
* The product is coverage-first: detect what uploaded materials already cover, avoid duplicating it, and ask before adding meaningful missing areas.
* The canonical pipeline remains Inputs -> Materials -> Extraction -> Analysis -> Blueprint -> Planning -> Spec -> Package -> Results.
* Deterministic orchestration is preferred over black-box behavior; AI should support extraction/analysis later, not replace deterministic blueprint orchestration.

## What was reviewed

* code files
* commits
* terminal output
* pasted handoff notes

## Current state

The project is in a late blueprint / planning foundation pass. Extraction is already hardened with metadata and PDF OCR fallback. Analysis is structured and now includes exemplar detected features. Blueprint is strong: exemplar style settings are wired into blueprint shaping, blueprint structure consumes exemplar detected features, and blueprint content now carries explicit content coverage. Planning now distinguishes source-derived coverage from generated-support coverage and missing-area prompts are keyed to source coverage missing. Recent test runs in this chat showed 10 passing test files and 52 passing tests. The system is stable enough to continue from the blueprint-to-planning coverage seam rather than adding UI churn.

## Decisions made

* Keep `runLessonPipeline.ts` and `buildBlueprint.ts` as deterministic orchestrators; do not stuff feature logic into the pipeline orchestrator.
* Clean the `processMaterial.ts` / `analyzeMaterial.ts` seam so `analyzeMaterial.ts` owns full role-based `MaterialAnalysis` creation and `processMaterial.ts` only attaches extraction metadata.
* Add exemplar detected feature contracts and conservative feature detection in analysis.
* Feed exemplar detected features into `resolveBlueprintStructure.ts` in a bounded, deterministic way.
* Wire existing exemplar `styleSettings` into blueprint shaping rather than leaving them store-only.
* Separate planning coverage into `sourceCoverage` vs `generatedCoverage`; use source coverage for missing-area prompt decisions.
* Add `blueprint.content.coverage` so upstream curriculum coverage can be handed off cleanly into planning.
* Avoid brittle tests; assert core contracts and categories of influence rather than exact truncated arrays.

## Completed work

* Reviewed and used pasted project handoff notes from this chat as the working product/design baseline.
* Reviewed `src/engine/types.ts`, `src/engine/materials/analyzeMaterial.ts`, and `src/engine/workflow/processMaterial.ts`.
* Simplified `src/engine/workflow/processMaterial.ts` so it no longer rebuilds summary/tag* Refactored `src/engine/materials/analyzeMaterial.ts` so it owns full role-based analysis creation.
* Added exemplar detected feature contracts and feature detection in analysis.
* Added/updated tests in:

  * `src/engine/analysis-signals.test.ts`
  * `src/engine/blueprint-structure-features.test.ts`
  * `src/engine/style-settings-blueprint.test.ts`
  * `src/engine/planning-coverage.test.ts`
* Enriched `src/engine/blueprint/resolveBlueprintStructure.ts` so detected exemplar features influence timing, lesson segments, teacher moves, prompt style, and template shell.
* Wired exemplar `styleSettings` into `src/engine/blueprint/buildBlueprint.ts`.
* Added planning coverage contract support in `src/engine/types.ts` for `sourceCoverage` and `generatedCoverage`.
* Updated `src/engine/planning/buildLessonPlanningIdeas.ts` so missing-area prompts key off source coverage missing and coverage details are split between source and generated support.
* Added `BlueprintContentCoverage` to `src/engine/types.ts`.
* Updated `src/engine/blueprint/resolveBlueprintContent.ts` so `blueprint.content.coverage` is populated from curriculum analysis coverage.
* Git milestone pushed in this chat:

  * `226fdfb` ΓÇö `Add exemplar feature contracts and blueprint structure signals`
  * `c2bd087` ΓÇö `Separate source and generated planning coverage`

## Remaining work

* The next architectural seam is the blueprint-to-planning coverage handoff: planning still does some local source-signal inference and should rely more directly on `blueprint.content.coverage`.
* `buildLessonSpec.ts` is working but becoming dense; it is a future cleanup watch area, not the current target.
* PPTX/image OCR fallback is still not implemented.
* AI-assisted extraction/refinement and the true AI-backed material-analysis layer are still future work.
* Exemplar transformation UI is still not built.
* Exports remain early / placeholder.

## Next steps

1. Continue from `src/engine/planning/buildLessonPlanningIdeas.ts` and shift source coverage logic to rely more directly on `blueprint.content.coverage`.
2. Keep `generatedCoverage` tied to generated planning ideas only.
3. Add or update tests to protect blueprint-coverage-driven planning behavior once the handoff is cleaned further.
4. Re-audit whether remaining planning source-signal duplication can be removed cleanly.
5. Only after that milestone, decide whether to continue engine trust/coverage work or move to exemplar transformation UI.

## Important evidence

* Active repo/folder referenced in chat:

  * `C:\Users\jodiw\Desktop\lesson-generator8-local`
  * `jodiwankenobi8-arch/lesson-generator8`
* SHAs explicitly referenced in this chat:

  * `93b7e10` ΓÇö `Add PDF OCR fallback extraction`
  * `226fdfb` ΓÇö `Add exemplar feature contracts and blueprint structure signals`
  * `c2bd087` ΓÇö `Separate source and generated planning coverage`
* Files explicitly reviewed or replaced in this chat:

  * `src/engine/types.ts`
  * `src/engine/materials/analyzeMaterial.ts`
  * `src/engine/workflow/processMaterial.ts`
  * `src/engine/analysis-signals.test.ts`
  * `src/engine/blueprint/buildBlueprint.ts`
  * `src/engine/blueprint/resolveBlueprintStructure.ts`
  * `src/engine/blueprint/resolveBlueprintContent.ts`
  * `src/engine/blueprint-readiness.test.ts`
  * `src/engine/blueprint-structure-features.test.ts`
  * `src/engine/style-settings-blueprint.test.ts`
  * `src/engine/planning/buildLessonPlanningIdeas.ts`
  * `src/engine/planning-coverage.test.ts`
  * `src/engine/spec/buildLessonSpec.ts`
  * `src/engine/package/buildLessonPackage.ts`
  * `src/engine/pipeline/runLessonPipeline.ts`
  * `src/state/useLessonStore.ts`
* Commands/output explicitly seen in this chat:

  * `npm run build`
  * `npm test`
  * `git status`
  * `git add`
  * `git commit -m "Separate source and generated planning coverage"`
  * `git push origin main`
* Recent verified test state in chat:

  * 10 test files passed
  * 52 tests passed

## Risks / cautions

* Do not revive patch-churn. The user explicitly does not want ΓÇ£a million patches.ΓÇ¥
* Do not blur curriculum content authority with exemplar presentation authority.
* Do not replace deterministic blueprint orchestration with AI.
* Do not assume repo-wide review beyond the files and terminal output actually examined in this chat.
* Do not bypass the SOPs: one PowerShell paste at a time, biggest safe chunk, inspect the real seam first, and keep doing checkpoint audits every 2ΓÇô3 implementation steps.
* Do not delete or ignore the recent coverage contract work; it is the current foundation for trustworthy non-duplication behavior.

## Next action

Start from these files and continue the blueprint-to-planning coverage handoff cleanup:

* `src/engine/planning/buildLessonPlanningIdeas.ts`
* `src/engine/blueprint/resolveBlueprintContent.ts`
* `src/engine/types.ts`

The first concrete task is to make planning source coverage consume `blueprint.content.coverage` more directly and reduce local source-signal re-inference while preserving generated coverage behavior.

---

Imported from: docs/chat-handoffs/2026-03-17_1608_.md
Imported at: 2026-03-17 16:42

# Lesson Generator 8 Chat Handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue and harden the lesson-generator8 engine, verify repo state, checkpoint recent work, improve extraction/analysis/blueprint behavior, and produce a continuation-ready handoff.

## Canonical project assumptions

* Active/canonical working repo is `C:\Users\jodiw\Desktop\lesson-generator8-local`.
* Older OneDrive repo `C:\Users\jodiw\OneDrive\Desktop\New folder\lesson-generator8` is not canonical and should not be used for ongoing work.
* Core product rule is non-negotiable: curriculum = content authority; exemplar = presentation authority.
* Product direction is coverage-first, not curriculum-brand-first.
* Deterministic orchestration is preferred over black-box behavior.
* The blueprint layer should remain deterministic; future AI should improve inputs to blueprint, not replace blueprint orchestration.
* One PowerShell paste at a time is the required workflow.

## What was reviewed

* code files

  * `src/engine/materials/analyzeMaterial.ts`
  * `src/engine/materials/extractTextFromFile.ts`
  * `src/engine/materials/extractPdfOcr.ts`
  * `src/engine/analysis/runMaterialAnalysis.ts`
  * `src/engine/workflow/processMaterial.ts`
  * `src/engine/blueprint/buildBlueprint.ts`
  * `src/engine/blueprint/buildBlueprintSourceReadiness.ts`
  * `src/engine/blueprint/resolveBlueprintContent.ts`
  * `src/engine/blueprint/resolveBlueprintStructure.ts`
  * `src/engine/types.ts`
  * `src/engine/package/buildPackageOutputs.ts`
  * `src/engine/package-outputs.test.ts`
  * `src/pages/ResultsPage.tsx`
  * `src/pages/MaterialsPage.tsx`
  * `src/state/useLessonStore.ts`
  * `src/App.tsx`
* commits

  * `928782e` `Structure export artifacts in package outputs`
  * `440edd1` `Refine export section in results`
  * `35db8a7` `Revert metadata store change and keep store contract clean`
  * `1e09825` `Add material processing pipeline indicator to Materials page`
  * `9c70154` `Prioritize stronger material signals in blueprint pipeline`
  * `c4aef48` `Prioritize strongest curriculum and exemplar in blueprint`
  * older/referenced: `caaa347` `Surface pipeline trace in results`
* PRs

  * none reviewed in this chat
* issues

  * none reviewed in this chat
* terminal output

  * repeated `git status`, `git diff`, `npm test`, `npm run build`
  * build stayed green after recent engine and UI changes
  * tests stayed green at 14 files / 64 tests
  * OneDrive repo push/rebase conflict was investigated and abandoned
* pasted handoff notes

  * large prior master continuation handoff pasted at the start of this chat and used as project context

## Current state

The project is in a strong mid-to-late hardening phase. The main app flow remains Inputs → Materials → Results. Extraction supports txt/html/pdf/docx/pptx with metadata-aware extraction and a real PDF OCR fallback. Materials now show clearer processing progress. Analysis has a new central entrypoint (`runMaterialAnalysis.ts`) and remains heuristic/deterministic. Analysis now computes simple signal-strength tags. Blueprint now sorts materials by signal strength and currently narrows to the strongest curriculum and strongest exemplar before resolving content and structure. Results/export contract cleanup from earlier work remains in place. The canonical local repo was confirmed clean, synced to GitHub, and green on build/tests.

## Decisions made

* Keep the canonical repo as `lesson-generator8-local`; do not continue work in the older OneDrive copy.* Do not treat `buildBlueprintSourceReadiness.ts` as selection logic; it remains a diagnostics/readiness layer.
* Put source selection in `buildBlueprint.ts`, not in readiness diagnostics.
* Add a central material-analysis seam with `runMaterialAnalysis.ts` so future AI-assisted analysis can plug in without replacing existing deterministic orchestration.
* Keep OCR parser-first, with OCR as bounded fallback.
* Improve OCR triggering based on weak parser output rather than parser failure only.
* Add signal-strength scoring in analysis as a light-weight intermediate step before formal reliability scoring.
* Prioritize strongest curriculum and strongest exemplar in blueprint as a stabilization step.
* Avoid broad type churn when not necessary; prefer contained, seam-based hardening.
* Avoid patch-churn; inspect real contracts/files first, then make one clean edit, then verify.

## Completed work

* Verified repo state multiple times with build and test checkpoints.
* Converted package exports to structured `ExportArtifact[]` and updated Results rendering accordingly.
* Added/confirmed pipeline trace surfacing in Results.
* Added materials-page processing pipeline indicator and improved materials status UX.
* Created `src/engine/analysis/runMaterialAnalysis.ts` and wired `processMaterial.ts` to use it.
* Improved PDF OCR fallback triggering in `extractTextFromFile.ts` so weak parser output can invoke OCR.
* Added curriculum/exemplar signal-strength scoring helpers in `analyzeMaterial.ts`.
* Stored signal-strength in material analysis tags.
* Added blueprint helper logic to read signal strength and sort materials.
* Updated blueprint to currently use the strongest curriculum and strongest exemplar only.
* Verified all recent work with green build and green tests.
* Cleaned the canonical repo to a fully synced state.
* Identified and isolated the non-canonical OneDrive repo as a diverged/outdated copy and stopped using it.

## Remaining work

* Add a formal material reliability layer; this is the most important next hardening step.

  * likely around `runMaterialAnalysis.ts`
  * should incorporate extraction quality, OCR confidence, weak/noisy extraction, and signal quality
  * likely outputs: reliability/confidence and/or usable-for-content / usable-for-structure decisions
* Revisit signal strength so it becomes more meaningful than a flat tag count.
* Revisit blueprint source selection after reliability exists; current top-1/top-1 is a stabilization step, not final weighted merging.
* OCR is not fully finished:

  * PDF OCR fallback exists
  * PPTX/image OCR does not
  * OCR reliability guards can still improve
* AI-backed material analysis is not implemented yet.
* Export generation is still placeholder-level.
* Build chunk size warnings remain; OCR/pdf libraries should likely be lazy-loaded later, but not before core reliability hardening.

## Next steps

1. Inspect and harden `src/engine/analysis/runMaterialAnalysis.ts` as the central reliability seam.
2. Inspect `src/engine/materials/analyzeMaterial.ts` and `src/engine/materials/extractTextFromFile.ts` together to design a formal material reliability score/gate.
3. Add reliability-aware gating so weak materials do not control blueprint content/structure.
4. Re-evaluate blueprint source prioritization after reliability exists; only then consider weighted multi-material merging.
5. Keep build/test checkpoints after each meaningful stabilization step.
6. Keep work in `lesson-generator8-local` only.

## Important evidence

* File paths reviewed:

  * `src/engine/materials/analyzeMaterial.ts`
  * `src/engine/materials/extractTextFromFile.ts`
  * `src/engine/materials/extractPdfOcr.ts`
  * `src/engine/analysis/runMaterialAnalysis.ts`
  * `src/engine/workflow/processMaterial.ts`
  * `src/engine/blueprint/buildBlueprint.ts`
  * `src/engine/blueprint/buildBlueprintSourceReadiness.ts`
  * `src/engine/blueprint/resolveBlueprintContent.ts`
  * `src/engine/blueprint/resolveBlueprintStructure.ts`
  * `src/pages/MaterialsPage.tsx`
  * `src/pages/ResultsPage.tsx`
  * `src/engine/types.ts`
  * `src/engine/package/buildPackageOutputs.ts`
  * `src/engine/package-outputs.test.ts`
* SHAs referenced in this chat:

  * `928782e`
  * `440edd1`
  * `35db8a7`
  * `1e09825`
  * `9c70154`
  * `c4aef48`
  * `caaa347`
  * OneDrive-only diverged commit: `83b32d8`
* Commands actually used/referenced:

  * `git status`
  * `git diff -- <file>`
  * `npm test`
  * `npm run build`
  * `git add ...`
  * `git commit -m "..."`
  * `git push origin main`
  * `git pull --rebase origin main`
  * `git rebase --abort`
  * `git reset --hard HEAD`
  * `Get-Content ...`
  * `Select-String ...`
  * `Get-ChildItem -Recurse .\src\engine -Name`

## Risks / cautions

* Do not use the older OneDrive repo for continued work; it diverged from GitHub and caused push/rebase conflict noise.
* Do not bypass the canonical product rule: curriculum drives content, exemplar drives presentation/structure.
* Do not move source selection logic into `buildBlueprintSourceReadiness.ts`; keep diagnostics separate from decision logic.
* Do not start adding many new features before reliability hardening; current system is strong enough that fragile behavior would now come from low-trust materials, not missing UI.
* Do not paste raw TypeScript into PowerShell; earlier terminal errors came from this and did not reflect repo corruption.
* Do not revive broad patch-churn. Continue with inspect-first, one-clean-edit, verify-immediately workflow.
* OCR is not “done”; PDF fallback exists, but OCR remains a bounded partial implementation and still needs further hardening before expansion.

## Next action

Start the next chat by reviewing:

* `src/engine/analysis/runMaterialAnalysis.ts`
* `src/engine/materials/analyzeMaterial.ts`
* `src/engine/materials/extractTextFromFile.ts`
* `src/engine/blueprint/buildBlueprint.ts`

Then make the safest-biggest next move: add a formal material reliability layer before adding any new major feature.

---

Imported from: docs/chat-handoffs/2026-03-17_1616_material-reliability-handoff.md
Imported at: 2026-03-17 16:42

# Lesson Generator 8 Chat Handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue and harden the lesson-generator8 engine, verify repo state, checkpoint recent work, improve extraction/analysis/blueprint behavior, and produce a continuation-ready handoff.

## Canonical project assumptions

* Active/canonical working repo is `C:\Users\jodiw\Desktop\lesson-generator8-local`.
* Older OneDrive repo `C:\Users\jodiw\OneDrive\Desktop\New folder\lesson-generator8` is not canonical and should not be used for ongoing work.
* Core product rule is non-negotiable: curriculum = content authority; exemplar = presentation authority.
* Product direction is coverage-first, not curriculum-brand-first.
* Deterministic orchestration is preferred over black-box behavior.
* The blueprint layer should remain deterministic; future AI should improve inputs to blueprint, not replace blueprint orchestration.
* One PowerShell paste at a time is the required workflow.

## What was reviewed

* code files

  * `src/engine/materials/analyzeMaterial.ts`
  * `src/engine/materials/extractTextFromFile.ts`
  * `src/engine/materials/extractPdfOcr.ts`
  * `src/engine/analysis/runMaterialAnalysis.ts`
  * `src/engine/workflow/processMaterial.ts`
  * `src/engine/blueprint/buildBlueprint.ts`
  * `src/engine/blueprint/buildBlueprintSourceReadiness.ts`
  * `src/engine/blueprint/resolveBlueprintContent.ts`
  * `src/engine/blueprint/resolveBlueprintStructure.ts`
  * `src/engine/types.ts`
  * `src/engine/package/buildPackageOutputs.ts`
  * `src/engine/package-outputs.test.ts`
  * `src/pages/ResultsPage.tsx`
  * `src/pages/MaterialsPage.tsx`
  * `src/state/useLessonStore.ts`
  * `src/App.tsx`
* commits

  * `928782e` `Structure export artifacts in package outputs`
  * `440edd1` `Refine export section in results`
  * `35db8a7` `Revert metadata store change and keep store contract clean`
  * `1e09825` `Add material processing pipeline indicator to Materials page`
  * `9c70154` `Prioritize stronger material signals in blueprint pipeline`
  * `c4aef48` `Prioritize strongest curriculum and exemplar in blueprint`
  * older/referenced: `caaa347` `Surface pipeline trace in results`
* PRs

  * none reviewed in this chat
* issues

  * none reviewed in this chat
* terminal output

  * repeated `git status`, `git diff`, `npm test`, `npm run build`
  * build stayed green after recent engine and UI changes
  * tests stayed green at 14 files / 64 tests
  * OneDrive repo push/rebase conflict was investigated and abandoned
* pasted handoff notes

  * large prior master continuation handoff pasted at the start of this chat and used as project context

## Current state

The project is in a strong mid-to-late hardening phase. The main app flow remains Inputs → Materials → Results. Extraction supports txt/html/pdf/docx/pptx with metadata-aware extraction and a real PDF OCR fallback. Materials now show clearer processing progress. Analysis has a new central entrypoint (`runMaterialAnalysis.ts`) and remains heuristic/deterministic. Analysis now computes simple signal-strength tags. Blueprint now sorts materials by signal strength and currently narrows to the strongest curriculum and strongest exemplar before resolving content and structure. Results/export contract cleanup from earlier work remains in place. The canonical local repo was confirmed clean, synced to GitHub, and green on build/tests.

## Decisions made

* Keep the canonical repo as `lesson-generator8-local`; do not continue work in the older OneDrive copy.
* Do not treat `buildBlueprintSourceReadiness.ts` as selection logic; it remains a diagnostics/readiness layer.
* Put source selection in `buildBlueprint.ts`, not in readiness diagnostics.
* Add a central material-analysis seam with `runMaterialAnalysis.ts` so future AI-assisted analysis can plug in without replacing existing deterministic orchestration.
* Keep OCR parser-first, with OCR as bounded fallback.
* Improve OCR triggering based on weak parser output rather than parser failure only.
* Add signal-strength scoring in analysis as a light-weight intermediate step before formal reliability scoring.
* Prioritize strongest curriculum and strongest exemplar in blueprint as a stabilization step.
* Avoid broad type churn when not necessary; prefer contained, seam-based hardening.
* Avoid patch-churn; inspect real contracts/files first, then make one clean edit, then verify.

## Completed work

* Verified repo state multiple times with build and test checkpoints.
* Converted package exports to structured `ExportArtifact[]` and updated Results rendering accordingly.
* Added/confirmed pipeline trace surfacing in Results.
* Added materials-page processing pipeline indicator and improved materials status UX.
* Created `src/engine/analysis/runMaterialAnalysis.ts` and wired `processMaterial.ts` to use it.
* Improved PDF OCR fallback triggering in `extractTextFromFile.ts` so weak parser output can invoke OCR.
* Added curriculum/exemplar signal-strength scoring helpers in `analyzeMaterial.ts`.
* Stored signal-strength in material analysis tags.
* Added blueprint helper logic to read signal strength and sort materials.
* Updated blueprint to currently use the strongest curriculum and strongest exemplar only.
* Verified all recent work with green build and green tests.
* Cleaned the canonical repo to a fully synced state.
* Identified and isolated the non-canonical OneDrive repo as a diverged/outdated copy and stopped using it.

## Remaining work

* Add a formal material reliability layer; this is the most important next hardening step.

  * likely around `runMaterialAnalysis.ts`
  * should incorporate extraction quality, OCR confidence, weak/noisy extraction, and signal quality
  * likely outputs: reliability/confidence and/or usable-for-content / usable-for-structure decisions
* Revisit signal strength so it becomes more meaningful than a flat tag count.
* Revisit blueprint source selection after reliability exists; current top-1/top-1 is a stabilization step, not final weighted merging.
* OCR is not fully finished:

  * PDF OCR fallback exists
  * PPTX/image OCR does not
  * OCR reliability guards can still improve
* AI-backed material analysis is not implemented yet.
* Export generation is still placeholder-level.
* Build chunk size warnings remain; OCR/pdf libraries should likely be lazy-loaded later, but not before core reliability hardening.

## Next steps

1. Inspect and harden `src/engine/analysis/runMaterialAnalysis.ts` as the central reliability seam.
2. Inspect `src/engine/materials/analyzeMaterial.ts` and `src/engine/materials/extractTextFromFile.ts` together to design a formal material reliability score/gate.
3. Add reliability-aware gating so weak materials do not control blueprint content/structure.
4. Re-evaluate blueprint source prioritization after reliability exists; only then consider weighted multi-material merging.
5. Keep build/test checkpoints after each meaningful stabilization step.
6. Keep work in `lesson-generator8-local` only.

## Important evidence

* File paths reviewed:

  * `src/engine/materials/analyzeMaterial.ts`
  * `src/engine/materials/extractTextFromFile.ts`
  * `src/engine/materials/extractPdfOcr.ts`
  * `src/engine/analysis/runMaterialAnalysis.ts`
  * `src/engine/workflow/processMaterial.ts`
  * `src/engine/blueprint/buildBlueprint.ts`
  * `src/engine/blueprint/buildBlueprintSourceReadiness.ts`
  * `src/engine/blueprint/resolveBlueprintContent.ts`
  * `src/engine/blueprint/resolveBlueprintStructure.ts`
  * `src/pages/MaterialsPage.tsx`
  * `src/pages/ResultsPage.tsx`
  * `src/engine/types.ts`
  * `src/engine/package/buildPackageOutputs.ts`
  * `src/engine/package-outputs.test.ts`
* SHAs referenced in this chat:

  * `928782e`
  * `440edd1`
  * `35db8a7`
  * `1e09825`
  * `9c70154`
  * `c4aef48`
  * `caaa347`
  * OneDrive-only diverged commit: `83b32d8`
* Commands actually used/referenced:

  * `git status`
  * `git diff -- <file>`
  * `npm test`
  * `npm run build`
  * `git add ...`
  * `git commit -m "..."`
  * `git push origin main`
  * `git pull --rebase origin main`
  * `git rebase --abort`
  * `git reset --hard HEAD`
  * `Get-Content ...`
  * `Select-String ...`
  * `Get-ChildItem -Recurse .\src\engine -Name`

## Risks / cautions

* Do not use the older OneDrive repo for continued work; it diverged from GitHub and caused push/rebase conflict noise.
* Do not bypass the canonical product rule: curriculum drives content, exemplar drives presentation/structure.
* Do not move source selection logic into `buildBlueprintSourceReadiness.ts`; keep diagnostics separate from decision logic.
* Do not start adding many new features before reliability hardening; current system is strong enough that fragile behavior would now come from low-trust materials, not missing UI.
* Do not paste raw TypeScript into PowerShell; earlier terminal errors came from this and did not reflect repo corruption.
* Do not revive broad patch-churn. Continue with inspect-first, one-clean-edit, verify-immediately workflow.
* OCR is not “done”; PDF fallback exists, but OCR remains a bounded partial implementation and still needs further hardening before expansion.

## Next action

Start the next chat by reviewing:

* `src/engine/analysis/runMaterialAnalysis.ts`
* `src/engine/materials/analyzeMaterial.ts`
* `src/engine/materials/extractTextFromFile.ts`
* `src/engine/blueprint/buildBlueprint.ts`

Then make the safest-biggest next move: add a formal material reliability layer before adding any new major feature.
