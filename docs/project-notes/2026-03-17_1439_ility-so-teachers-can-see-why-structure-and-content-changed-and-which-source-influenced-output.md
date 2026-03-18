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