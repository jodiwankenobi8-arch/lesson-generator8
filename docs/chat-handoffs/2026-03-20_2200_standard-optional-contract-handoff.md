# Standard-optional contract handoff

## Scope finished in this chat
This handoff closes the standard-optional seam and packages it for the next chat.

## What changed
- Inputs UI now explains that Standard is optional.
- Inputs readiness copy no longer says Standard is required.
- Results blocked-state copy now matches the same optional-standard contract.
- Store gating no longer requires inputs.standard inside hasRequiredInputs().
- Blueprint standard resolution still honors an explicit typed standard first.
- When Standard is blank, curriculum remains the source of detected standards.
- Teacher-entered lesson info now helps rank curriculum-derived standards:
  - grade
  - subject
  - skill
  - topic
- Added automated contract coverage:
  - src/engine/standard-optional-contract.test.ts
  - src/engine/blueprint/resolveBlueprintContent.test.ts
  - integration coverage in src/engine/analysis-and-blueprint.test.ts
- Added repeatable command:
  - 
pm run test:standards-contract

## Verified in this chat
- 
pm run typecheck PASS
- 
pm run test:standards-contract PASS

## Important behavioral contract now in repo
1. Teacher-entered standard wins when provided.
2. Blank standard does not block generation by itself.
3. Blank standard falls back to curriculum-derived standards.
4. Teacher-entered lesson info helps rank those curriculum-derived standards.
5. The visible contract across Inputs, Results, store gating, and targeted tests is aligned.

## Known separate issue not included in this commit
- Unrelated full-suite red still reported in src/state/useLessonStore.test.ts timeout work.
- Do not reopen that here unless starting a separate seam.
- This handoff intentionally stops at the completed standards contract boundary.

## Suggested next chat starting point
Start from the unrelated useLessonStore.test.ts timeout only, and first verify whether the timeout is truly in the missing-id processMaterial test or elsewhere in the file before changing production code.

## Files included in this handoff commit
- src/pages/InputsPage.tsx
- src/pages/ResultsPage.tsx
- src/state/useLessonStore.ts
- src/engine/blueprint/buildBlueprint.ts
- src/engine/blueprint/resolveBlueprintContent.ts
- src/engine/blueprint/resolveBlueprintContent.test.ts
- src/engine/analysis-and-blueprint.test.ts
- src/engine/standard-optional-contract.test.ts
- package.json

## Recommended commit message
feat: make standard optional and add standards contract coverage