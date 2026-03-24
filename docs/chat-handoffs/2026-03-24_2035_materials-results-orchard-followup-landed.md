# Lesson Generator 8 — handoff after Materials/Results orchard follow-up landed

## Repo
- Repo: `jodiwankenobi8-arch/lesson-generator8`
- Branch: `main`
- Current pushed HEAD: `13669e7`

## What just landed
- `src/pages/MaterialsPage.tsx`
  - moved page header onto `OrchardPageHeader`
  - normalized orchard UI import path
  - replaced broken textual pipeline placeholders with explicit markers
- `src/pages/ResultsPage.tsx`
  - applied orchard page shell consistently
  - moved main and blocked states onto `OrchardPageHeader`

## What remains true
- curriculum = content authority
- exemplar = presentation / structure authority
- centers = student-independent work
- teacher-led support / intervention = teacher-led lane
- optional lesson parts and outputs should appear only when explicitly requested or strongly source-grounded
- AI must not replace deterministic extraction, blueprint orchestration, or trust surfaces

## Validation truth
- this seam was landed as a narrow page-level follow-up
- prior targeted local validation history exists from the earlier published seam
- no new full repo typecheck/test/build run was recorded as part of this follow-up
- manual browser recheck of Materials + Results may still be pending unless already completed locally

## Active doc truth
- previous active truth docs had drifted behind live repo state
- this handoff exists to reset continuation to the real pushed checkpoint

## Best next move
1. refresh active truth docs to `13669e7`
2. if needed, do a brief manual browser recheck of Materials + Results
3. choose the next narrow implementation seam intentionally from current live repo truth
4. do not reopen Step 6A or Results/export wording unless live proof shows drift
