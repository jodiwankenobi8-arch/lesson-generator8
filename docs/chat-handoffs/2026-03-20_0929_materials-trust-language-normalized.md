# Materials trust-language normalization handoff

## Repo checkpoint
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: work/canonical-project-consolidation
- Code seam checkpoint: 568dba0 refactor: clarify materials trust and readiness language

## What was changed
- MaterialsPage now separates file pipeline completion language from grounded-generation trust language
- teacher-facing summary and CTA copy use usable-material truth more explicitly
- per-file trust labels no longer over-claim grounded readiness just because analysis reached ready state
- pipeline helper text now reads as processing state, not trust approval

## Validation
- npm run typecheck = PASS
- npm run test = PASS
- npm run build = PASS

## Verified
- store/workflow gating did not need to change
- Results usable-material blocking remained aligned
- the seam stayed scoped to src/pages/MaterialsPage.tsx

## Non-blocking warnings
- Vite still reports large chunk warnings after minification
- docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt was missing during earlier Step 3 audit
- SSR-style useLayoutEffect warnings still appear in some route tests, but the suite passes

## Next move
- inspect lesson-plan and export wording for optional-output leakage
- align final teacher-facing narrative to the normalized request-aware contract
- do one end-to-end flow check after that wording seam
