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
* Development must follow strict SOPs: one PowerShell paste at a time, safest biggest step, inspect real files/contracts first, keep logic deterministic and interpretable, build/test frequently, push meaningful milestones, and checkpoint every 2–3 steps.

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

* Confirmed and preserved the project’s canonical assumptions, SOPs, and product rules.
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

  * 5efbfdd — Add planning coverage and missing-area prompts
  * d5e096c — Expose coverage decisions in package and results
  * 9f6683d — Add teacher decisions for missing lesson areas

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