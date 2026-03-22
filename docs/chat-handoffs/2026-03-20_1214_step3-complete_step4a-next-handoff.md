# Lesson Generator 8 — Step 3 complete, Step 4A next

## Repo
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: work/canonical-project-consolidation
- HEAD before commit: $headBefore

## What landed in this checkpoint
### Step 3A — Results naming / hierarchy
- Results labels now distinguish teacher-led support from student centers.
- Visible Results labels use:
  - Teacher-Led Small-Group Support
  - Student Centers
  - Student Centers Rotation Plan

### Step 3B — visible trust-language alignment
- App route gating now uses usable-material truth for Results.
- Results locking/copy already matched usable-material gating and remains aligned.
- Materials / Results / store / workflow now agree on usable-material trust behavior at the visible route level.

### Step 3C — secondary evidence grouping
- Results stays teacher-first.
- Secondary trust/evidence surfaces are grouped behind:
  - Lesson Evidence and Planning Details

## Validation snapshot at this checkpoint
- 
px vitest run src/engine/package-outputs.test.ts = PASS
- 
px vitest run src/pages/ResultsPage.test.tsx = PASS
- 
px vitest run src/App.integration.test.tsx = PASS
- 
pm run typecheck = PASS
- 
pm run test = pending in this push script
- 
pm run build = pending in this push script

## Important truth to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- centers = student-independent work
- small group / intervention = teacher-led support
- optional lesson parts and optional outputs should not quietly appear by default
- materials trust depends on usable materials, not merely ready materials

## What did NOT land
- Step 4A package-layer export / narrative contract changes were attempted and then fully reverted.
- No Step 4 code is included in this checkpoint.

## Exact next seam
### Step 4A — package-layer narrative / export contract alignment
Target files:
- src/engine/package/buildPackageOutputs.ts
- src/engine/package-outputs.test.ts

Goal:
- make lesson-plan narrative obey the same optional-output contract as package arrays / exports
- remove quiet implication of unrequested centers / small-group / intervention sections
- keep Results export surface unchanged unless package/export truth changes underneath it

## Read first in the next chat
1. AGENTS.md
2. START_HERE_CURRENT_TRUTH.md
3. PROJECT_CURRENT_STATE.md
4. this file