# Lesson Generator 8 — Step 4A package narrative alignment

## Repo
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: work/canonical-project-consolidation
- HEAD before Step 4A commit: acdf1c4 refactor: finish step 3 trust and results hierarchy

## What landed in this checkpoint
### Step 4A — package-layer narrative / export contract alignment
- src/engine/package/buildPackageOutputs.ts now passes requested-output contract flags into lesson-plan narrative assembly.
- Lesson-plan narrative no longer quietly implies centers when centers were not requested.
- Lesson-plan narrative no longer quietly implies small-group or intervention sections when those outputs were not requested.
- Support sections in the lesson plan now obey the same requested-output contract already used by package arrays / exports.

## Validation snapshot at this checkpoint
- 
px vitest run src/engine/package-outputs.test.ts = PASS
- 
pm run typecheck = PASS
- 
pm run build = PASS

## Important truth to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- centers = student-independent work
- small group / intervention = teacher-led support
- optional lesson parts and outputs should not quietly appear by default
- materials trust depends on usable materials, not merely ready materials

## What changed in tests
- added omission coverage proving lesson-plan narrative does not include unrequested centers / small-group / intervention sections
- existing inclusion coverage remains in place

## Current likely next move
- inspect the next smallest live seam from current repo state
- prefer a narrow user-facing wording / doc-truth seam before any larger expansion
- reconcile the missing docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt reference if it is still intended to be authoritative

## Read first in the next chat
1. AGENTS.md
2. START_HERE_CURRENT_TRUTH.md
3. PROJECT_CURRENT_STATE.md
4. this file