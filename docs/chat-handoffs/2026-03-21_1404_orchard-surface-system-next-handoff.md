# Lesson Generator 8 - orchard surface system next handoff

## Repo checkpoint
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: work/canonical-project-consolidation
- Latest local/pushed HEAD at handoff time: 5f3d938 docs: align status docs to pushed export seam
- Latest validated pushed code seam still treated as the canonical export checkpoint: 1fab6c2 generated-artifact Results/export flow seam

## Current maintained truth
- Step 4D is complete and pushed.
- The generated-artifact Results/export flow guardrail is already in place through useLessonStore plus downloadExportArtifact.
- Remaining Step 4 risk, if any, should be treated only as a true browser/UI-only gap.
- Closed seams should not be reopened without live proof.
- The project is in hardening / finishing mode.
- Product flow remains: Inputs -> Materials -> Results.
- Engine flow remains: extraction -> analysis -> blueprint -> planning -> spec -> package -> results.
- useLessonStore remains the orchestration seam.

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- orchard / warm storybook / teacher-first direction
- do not drift into generic SaaS / dashboard styling
- centers = student-independent work
- small group / intervention = teacher-led support
- centers and teacher-led support may coexist during the same lesson block, but they are not the same lane
- optional lesson parts and outputs should only appear when explicitly requested or strongly source-grounded
- materials trust depends on usable materials, not merely ready materials
- AI must not replace deterministic extraction, blueprint orchestration, or trust surfaces

## What the live local inspect proved
1. src/pages/orchardUi.ts does not exist yet.
2. src/styles/theme.css is only a starter orchard token layer, not the real scrapbook/orchard surface system.
3. App.tsx already uses some orchard tokens and serif heading treatment, but the shell is still mostly inline and scattered.
4. InputsPage is partially aligned, but not on a centralized orchard surface system yet.
5. MaterialsPage already supports multiple files per lane with multiple inputs and iteration over selected files.
6. MaterialsPage copy still undersells the real model with wording like Upload Curriculum Files and Upload Exemplar Files.
7. MaterialsPage still carries legacy blue/purple accent remnants that should be replaced by orchard-native accents.

## Worktree hygiene note
- Before this handoff commit, local scratch artifacts were present in the worktree.
- This push cleans the obvious disposable scratch artifacts so the next chat starts from a narrower surface.
- README.md remains an intentional tracked change and is included in this push.

## Updated plan from this point
### Step 4E - hygiene closeout
- Keep the worktree free of unrelated staging before the next meaningful seam.

### Step 5A - Orchard Surface System foundation
#### Step 5A.1 - create src/pages/orchardUi.ts
- shared page shell
- hero/header block
- ribbon label/header styles
- stitched divider pattern
- paper panel / card system
- orchard button/input/tag/badge styles
- page-level spacing / hierarchy helpers
- provenance/status badges that feel orchard-native instead of dev-tool-ish

#### Step 5A.2 - expand src/styles/theme.css
- Orchard Cream #FFF6E9
- Apple Blush #F7D6D0
- Cranberry #B8545A
- Moss #6E8B6B
- Deep Orchard #3F5A40
- Honey #F2C078
- Paper White #FFFFFF
- Warm Gray #E7E2DA
- Charcoal #2F2F2F
- Muted #6B7280
- subtle paper/canvas texture helpers
- softer shadow/border tokens
- ribbon/stitched/tactile motif helpers
- remove blue/purple as primary identity accents

#### Step 5A.3 - move App.tsx onto the shared orchard shell
- hero block
- shell container
- step navigation
- shared card wrapping

### Step 5B - translate Inputs and Materials
- Inputs = planning notebook
- Materials = source workbench / sorting table
- keep multi-source capability explicit in visible wording
- stop implying single-file thinking
- use materials / sources / uploads language more consistently
- replace legacy blue/purple materials accents with orchard-native accents

### Step 5C - translate Results
- Results = completed planning binder / teacher package
- keep teacher-facing package first
- keep evidence secondary
- do not reopen closed Step 3 or Step 4 seams unless live evidence shows regression

### Step 6 - capability expansion only after the orchard system is real
- Step 6A = source intake contract
- Step 6B = OCR provider expansion
- Step 6C = export registry expansion
- Step 6D = AI analysis provider
- Step 6E = AI production assist

## Immediate next move
- Start with Step 5A.1 by creating src/pages/orchardUi.ts.
- Then expand src/styles/theme.css and move App.tsx onto the shared orchard shell.

## What should not happen next
- do not start OCR expansion first
- do not start AI integration first
- do not start export proliferation first
- do not reopen closed Step 4 seams without live regression evidence
- do not continue patching inline page styles without first creating the shared orchard seam

## Read first in the next chat
1. AGENTS.md
2. START_HERE_CURRENT_TRUTH.md
3. PROJECT_CURRENT_STATE.md
4. README.md
5. this newest handoff file

## Suggested launch line for the next chat
Lesson Generator 8 continuation. Start from the newest orchard-surface-system handoff, confirm clean worktree on work/canonical-project-consolidation, then do a read-only audit of the smallest shared UI seam needed to create src/pages/orchardUi.ts and expand theme.css before making one coherent implementation step only.
