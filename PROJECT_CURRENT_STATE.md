# PROJECT_CURRENT_STATE.md

## Current milestone
Step 6A — source-intake contract tightening

## Current checkpoint
- Latest pushed continuation point: 22a4732
- Local HEAD when this doc was refreshed: 22a4732 docs: refresh active continuation checkpoint after results seam push

## What is done
- orchard / teacher-first surface direction is already present
- Results chrome consolidation is pushed on main
- active continuation docs were refreshed and pushed
- validation at checkpoint 22a4732 was green:
  - npm run typecheck = PASS
  - npm run test = PASS
  - npm run build = PASS
- teacher-facing Materials flow already supports curriculum and exemplar as separate multi-source lanes
- extraction owner for current accepted upload-file types exists in src/engine/materials/extractTextFromFile.ts
- reliability-aware source selection helpers already exist in src/engine/blueprint/materialSelection.ts

## What is not done yet
- the teacher-facing source-intake contract is still not explicit enough across the flow
- MaterialsPage wording still needs one tighter, more honest contract pass
- InputsPage still under-describes sources / uploads compared with MaterialsPage
- accepted-type truth is not yet clearly anchored across the user-facing copy
- OCR expansion is not started
- export registry expansion is not started
- AI analysis / production assist are not started

## Current risks
- older notes still point at pre-push Results work and older checkpoints
- user-facing wording can still overclaim or under-explain what the intake system currently accepts
- copy drift could make the UI disagree with the extraction owner
- reopening already-stable engine seams would create avoidable patch-stacking

## Validation status
- checkpoint 22a4732 is green:
  - typecheck PASS
  - full test PASS
  - build PASS

## Top next steps
1. finish Step 6A source-intake contract copy pass in MaterialsPage.tsx
2. adjust InputsPage.tsx only if needed to keep wording consistent
3. verify immediately:
   - targeted inspect
   - npm run typecheck
   - relevant tests
   - npm run build
   - brief manual copy check
4. refresh START_HERE_CURRENT_TRUTH.md, PROJECT_CURRENT_STATE.md, and one latest handoff if the seam lands cleanly
5. commit and push the Step 6A checkpoint before starting Step 6B OCR expansion

## What should wait until later
- OCR provider expansion
- export registry expansion
- AI analysis provider
- AI production assist
- broad polish beyond the narrow current seam
