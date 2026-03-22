# Request-aware planning/package normalization handoff

## Repo checkpoint
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: work/canonical-project-consolidation
- Code seam checkpoint: a151036 refactor: normalize request-aware planning and package outputs

## What was changed
- buildLessonPlanningIdeas now uses lessonRequest to decide optional planning inclusion
- buildPackageOutputs now follows the same request-aware / source-grounded contract
- printables no longer unlock centers, small group, or intervention by themselves
- runLessonPipeline and buildLessonPackage thread lessonRequest through the seam
- request-aware tests were added or updated around planning, package outputs, package decisions, and pipeline behavior

## Validation
- npm run typecheck = PASS
- npm run test -- src/engine/package-outputs.test.ts src/engine/package-decisions.test.ts src/engine/request-aware-pipeline.test.ts = PASS
- npm run build = PASS
- npm run test = PASS

## Verified
- the optional-output contract is now more consistent across planning and package
- the Results Step 3C hierarchy was not reopened
- the seam remained path-scoped to engine/store contract files plus related tests

## Non-blocking warnings
- Vite still reports large chunk warnings after minification
- docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt was missing during earlier Step 3 audit

## Next move
- inspect user-facing ready-versus-usable gating and trust copy
- align Inputs / Materials / Results wording to the usable-material truth
- verify exports and final teacher-facing wording still match the normalized contract
