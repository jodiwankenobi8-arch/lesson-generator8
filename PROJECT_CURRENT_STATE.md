# PROJECT_CURRENT_STATE.md

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 380e54f
- Last auto-sync UTC: 2026-03-29T16:58:47Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## Current milestone
ELA profile foundation and dominant-area-key routing across blueprint, planning, and spec on top of the pushed teacher-minimal / OCR / drag-and-drop checkpoint

## Why this seam exists
The older continuation docs were still pointing at the teacher-minimal drag-and-drop follow-up seam even though the current pushed checkpoint moved the repo further into the ELA profile foundation seam:
- dominant-area resolution now matters more than legacy phonics/comprehension branching
- planning should derive from the resolved ELA area list first
- spec should derive from the resolved ELA area list first
- the continuation chain needed to be updated so future chats stop relaunching from stale seam guidance

## What is now locked locally
- pushed checkpoint 380e54f is the current main truth for this pass
- buildBlueprint now participates in the ELA profile foundation seam
- detectLessonTargets and its new focused test cover the dominant-area-key path
- resolveBlueprintContent and resolveBlueprintStructure now support the profile-first ELA routing seam
- buildLessonPlanningIdeas now resolves dominantAreaKeys first, with sanitized planning values and area-family-first fallback behavior
- buildLessonSpec now resolves dominantAreaKeys first instead of routing only through legacy phonics/comprehension labels
- buildPackageOutputs and ResultsPage stayed aligned enough for focused Results coverage to remain green
- the current build is still green with the same non-blocking large-chunk warning

## Files touched in this pass
- src/engine/blueprint/buildBlueprint.ts
- src/engine/blueprint/detectLessonTargets.ts
- src/engine/blueprint/detectLessonTargets.test.ts
- src/engine/blueprint/resolveBlueprintContent.ts
- src/engine/blueprint/resolveBlueprintStructure.ts
- src/engine/lesson-spec.test.ts
- src/engine/package/buildPackageOutputs.ts
- src/engine/planning/buildLessonPlanningIdeas.ts
- src/engine/spec/buildLessonSpec.ts
- src/engine/types.ts
- src/pages/ResultsPage.tsx

## Validation for this seam
- `npx vitest run src/engine/lesson-spec.test.ts src/engine/blueprint/detectLessonTargets.test.ts src/pages/ResultsPage.test.ts src/pages/ResultsPage.test.tsx`
- `npm run build`

Local result:
- 4 test files passed
- 25 tests passed
- build passed
- existing chunk warning remained non-blocking

## Current next step
- do a short browser/manual pass on the pushed dominant-area-key checkpoint
- verify single-mode cross-family area selection behaves correctly in the live UI
- verify planning/spec/results still read teacher-first after the refactor
- keep any further edits narrow and live-evidence-driven