# Automated Step 4 test next handoff

## Repo checkpoint
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: work/canonical-project-consolidation
- Pushed checkpoint before this docs update: 94d924e
- This handoff is docs-only and continuation-focused.

## What was just confirmed
- Existing automated coverage already protects the Step 4 contract/parity layer:
  - package-output
  - package-decision
  - DOCX heading
  - ResultsPage
  - request-aware flows
- The remaining gap is not basic wording drift.
- The remaining gap is that there is not yet one single automated test covering the broader Results/export flow closely enough to replace the docs' manual-only Step 4 check.

## Why the next seam should be automated
- Manual full-flow verification is still documented as the remaining Step 4 risk.
- The user explicitly wants a test added instead of relying only on manual checking.
- Current repo evidence suggests the best narrow seam is to extend existing Results/export-oriented tests rather than invent a broad new framework.

## Best next seam
Add one automated Step 4 Results/export flow test.

Target inspection order for the next chat:
1. src/pages/ResultsPage.test.tsx
2. src/App.integration.test.tsx
3. src/engine/exports/exportLessonPlanDocx.test.ts
4. src/pages/ResultsPage.tsx

## Constraints for the next chat
- One coherent step only.
- Prefer extending existing tests over introducing a broad new harness.
- Keep useLessonStore as the orchestration seam.
- Do not reopen older timeout or wording seams unless live repo code contradicts current truth.
- After the next meaningful seam, refresh:
  - START_HERE_CURRENT_TRUTH.md
  - PROJECT_CURRENT_STATE.md
  - one new docs/chat-handoffs file if needed

## Suggested starting sentence for the next chat
Start with a read-only audit of the smallest existing Results/export test seam that can be extended into one automated Step 4 flow test, then make one coherent implementation step only.
