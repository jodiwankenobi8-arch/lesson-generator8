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
* Clean text/encoding artifacts noted during chat (for example `â€“` / replacement-character style issues seen in terminal/file output).

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
* Behavior lineage matters more than path lineage here: the key unresolved behavior is “immediate queued row but stuck before real asset transition.”

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