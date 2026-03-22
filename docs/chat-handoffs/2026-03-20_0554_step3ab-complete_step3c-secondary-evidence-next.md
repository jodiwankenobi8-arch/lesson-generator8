# Step 3A and Step 3B complete - Step 3C next handoff

## Repo checkpoint
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: work/canonical-project-consolidation
- Latest validated local checkpoint: 35bc248 - copy: align results gating with usable-material trust language
- Prior meaningful seam commit: 3588ecc - efactor: align results package naming and hierarchy

## Continuation discipline
- GitHub is connected, but treat the local repo state and local validation results as higher-confidence truth when there is any conflict.
- Do not restart broad discovery.
- Continue from the Step 3 checkpoint already closed below.
- One coherent seam at a time. No patch-stacking.

## What is verified complete
### Step 3A
Results naming and hierarchy cleanup is landed and validated:
- teacher-first package labels are in place
- Results ordering is teacher-first first, deeper evidence later
- centers and teacher-led support are now clearly different labels
- trace / proof is no longer ahead of the main package

### Step 3B
Visible Results trust language is landed and validated:
- Results gating uses usable materials, not just ready materials
- Results blocker and empty-state copy now reflects usable-material trust rules
- Results tests lock that wording

## Latest validation snapshot
- 
pm run typecheck = PASS
- 
pm run test -- src/pages/ResultsPage.test.tsx = PASS
- 
pm run test = PASS
- 21 test files passed
- 104 tests passed
- 
pm run build = PASS

## Non-blocking warnings
- SSR-style useLayoutEffect warnings still appear in tests around router rendering
- Vite still warns about large chunks after minification
- Neither warning blocked Step 3 closeout

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- centers = student-independent work
- small group / intervention = teacher-led support
- centers and teacher-led support may coexist during the same lesson block, but they are not the same lane
- optional lesson parts and outputs should only appear when explicitly requested or strongly source-grounded
- orchard / warm storybook / teacher-first direction stays in force
- do not drift into generic SaaS / dashboard styling

## Exact next seam
### Step 3C - secondary evidence grouping
The next narrow seam is **Results evidence hierarchy**, not engine churn.

Goal:
- keep teacher-ready lesson output clearly primary
- move trace / proof / selected-source evidence into clearly secondary surfaces
- preserve trust and provenance without making Results feel like a debug panel

## What to inspect first
Start with a read-only pass on:
- src/pages/ResultsPage.tsx
- src/pages/ResultsPage.test.tsx

Focus on:
- which sections are still too proof-forward
- what should remain visible in the main teacher-first flow
- what should become expandable or clearly secondary without losing trust value

## Working assumptions for the next edit
- PackageSummarySection and PackageOutputsSection stay primary
- CoverageDecisionsSection stays important because it is still teacher-actionable
- detailed source IDs, pipeline trace, and deeper authority evidence are candidates for more secondary presentation
- do not remove trust surfaces; regroup them

## Verified vs inferred
### Verified
- Step 3A and Step 3B are green locally
- local validation is stronger than the older handoff now
- Results still carries a lot of proof surfaces even after the naming/order cleanup

### Inferred
- Step 3C should be finishable inside Results-only UI/tests unless a hidden copy mismatch appears
- Inputs / Materials probably do not need a broad rewrite before Step 3C, because the recent audit did not identify a must-fix seam there

## Handoff rule for the next chat
Use START_HERE_CURRENT_TRUTH.md as the single entry file.
If connector retrieval is stale or incomplete, ask for one local inspect-first paste for the exact seam files and continue from that live output.