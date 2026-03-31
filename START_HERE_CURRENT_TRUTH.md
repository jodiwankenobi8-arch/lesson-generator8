# START_HERE_CURRENT_TRUTH.md

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: 1c213c1
- Last auto-sync UTC: 2026-03-31T00:52:37Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## Current repo truth
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Current milestone: ELA profile foundation and dominant-area-key routing across blueprint, planning, and spec on top of the pushed teacher-minimal / OCR / drag-and-drop checkpoint
- Current active seam: short browser/manual closeout plus continuation-doc alignment for the pushed dominant-area-key checkpoint

## What is actually landed in this local bundle
- pushed main checkpoint 380e54f refactors ELA blueprint, planning, and spec around dominant area keys
- cross-family dominant-area selection in single mode is working
- buildBlueprint / resolveBlueprintContent / resolveBlueprintStructure now participate in the ELA profile foundation seam
- planning now resolves blueprint.content.profile.dominantAreaKeys first and falls back to legacy target fields only if needed
- lesson spec now resolves dominantAreaKeys first instead of legacy phonics/comprehension branching
- detectLessonTargets coverage now includes the dominant-area-key seam
- Results coverage remained green through the spec follow-up
- the existing large-chunk build warning remains non-blocking
- dominant-area-key code checkpoint 380e54f refactors ELA blueprint, planning, and spec around dominant area keys

## Product truths to preserve
- do not force every lesson into phonics/comprehension/mixed
- a lesson may contain one meaningful area, two areas, or more than two
- planning and spec should derive from the resolved ELA area list first
- curriculum = content authority
- exemplar = presentation / structure authority
- generation depends on usable materials
- centers = student-independent work
- teacher-led support stays separate from centers
- latest pushed checkpoint 6301992 refreshes continuation docs around that landed code seam

## Validation snapshot for this seam
Run in this order inside the full repo:
1. `npx vitest run src/engine/lesson-spec.test.ts src/engine/blueprint/detectLessonTargets.test.ts src/pages/ResultsPage.test.ts src/pages/ResultsPage.test.tsx`
2. `npm run build`

Local note:
- 4 test files passed
- 25 tests passed
- build passed
- browser/manual verification still needs to be updated by hand
- existing chunk warning remains non-blocking

## Exact next move after validation
- do a short browser/manual pass on the dominant-area-key checkpoint
- verify single-mode selection across area families produces the intended planning/spec/results behavior
- verify teacher-facing Results still reads cleanly after the blueprint/planning/spec refactor
- only after that, choose any additional narrow polish from direct live evidence instead of reopening older seams
- if browser/manual validation is not possible in-chat, the narrowest follow-on seam is continuation-doc truth alignment only; do not reopen supported-source matrix work unless direct live regression appears
