# Lesson Generator 8 Chat Handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Continue hardening lesson-generator8, wire real material extraction and analysis flow, keep the project aligned with the production plan, and produce a continuation-ready handoff.

## Canonical project assumptions

* The project is a teacher-facing lesson package generator, not a prototype.
* Curriculum is the content authority.
* Exemplar is the presentation authority.
* The intended workflow is Inputs → Materials → Results.
* The pipeline is Inputs → Material Extraction → Material Analysis → Lesson Target Detection → Blueprint → Lesson Spec → Lesson Package → Outputs.
* The user is not an engineer and prefers single PowerShell pastes, simple instructions, minimal manual editing, frequent baselines, and no temporary hacks.
* Every few implementation steps, the project should be audited for architecture integrity, build health, extraction sanity, analysis sanity, and system weight.

## What was reviewed

* code files
* commits
* terminal output
* pasted handoff notes

## Current state

The repo and terminal history in this chat show a real staged pipeline is in place and the project is beyond a shell prototype. The extractor was extended across this chat to support TXT, PDF, DOCX, PPTX, and HTML/HTM in `src/engine/materials/extractTextFromFile.ts`, with local types added for `pptx-parser`. The store was updated so `MaterialFile` now carries `fileBuffer` and `fileContent`, which is the missing foundation for real upload-driven processing. A new workflow entrypoint, `src/engine/workflow/processMaterial.ts`, was added to orchestrate extraction → analysis → store updates. The build was passing after the store/type updates, but the workflow helper is still mid-fix because `analyzeMaterial(...)` requires `materialId`, `name`, `extractedText`, and `role`, and the helper was still being corrected to match the real input/output contract. GitHub was initialized, connected, pushed, and later updated successfully from this chat.

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
  add material → save source (`fileBuffer` / `fileContent`) → `processMaterial(id)` → live status updates.
* Ensure Materials page copy and helpers remain consistent with `uploaded / extracting / analyzing / ready / error`.
* Keep Results generation blocked until processing is complete and ready materials exist.
* Strengthen curriculum-derived signals in blueprint/spec/package outputs.
* Strengthen exemplar-derived structure reuse in blueprint/spec/package outputs.
* Add image support and OCR later, after the real upload-to-analysis loop works end to end.

## Next steps

1. Fix `src/engine/workflow/processMaterial.ts` so it passes `materialId`, `name`, `extractedText`, and `role` to `analyzeMaterial(...)` and wraps the result into the store’s full `MaterialAnalysis` shape.
2. Run `npm run build` and confirm the workflow seam compiles cleanly.
3. Wire the Materials page upload handler to:

   * create the material record
   * persist `fileBuffer` / `fileContent` with `setMaterialSource(...)`
   * call `processMaterial(id)`
4. Verify the first real end-to-end loop:
   upload file → extracting → analyzing → ready.
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
* Do not add OCR before the real upload → extraction → analysis loop is working.
* Do not assume `analyzeMaterial(...)` and the store share the same shape; the workflow seam must adapt them explicitly.
* Do not lose the raw file source fields now added to `MaterialFile`; they are required for real extraction.
* Do not drift status naming away from `uploaded / extracting / analyzing / ready / error`.
* Do not make repo-wide claims beyond what was actually reviewed in this chat.

## Next action

Start in `src/engine/workflow/processMaterial.ts`, fix the `analyzeMaterial(...)` call and output shaping so the file builds cleanly, then wire the Materials page upload handler to save source data and call `processMaterial(id)` for the first real end-to-end material processing run.