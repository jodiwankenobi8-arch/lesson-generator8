# START_HERE_CURRENT_TRUTH.md

## Current repo truth
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Current published continuation point: 22a4732
- Current milestone: Step 6A source-intake contract from a green Step 5 checkpoint
- Current active seam: teacher-facing source-intake contract tightening in MaterialsPage.tsx, with InputsPage.tsx only if needed for wording consistency

## What is actually landed
- orchard shell direction is already present in the live repo
- Results chrome consolidation and continuation-doc checkpoint are already pushed on main
- validation at checkpoint 22a4732 was green:
  - npm run typecheck = PASS
  - npm run test = PASS
  - npm run build = PASS
- blueprint source selection already has reliability-aware helpers in src/engine/blueprint/materialSelection.ts
- accepted upload-file type truth currently lives in src/engine/materials/extractTextFromFile.ts
- MaterialsPage already describes the current intake as upload-file based and multi-source by lane, but the teacher-facing contract still needs tightening

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- orchard / warm storybook / teacher-first direction
- do not drift into generic SaaS / dashboard styling
- centers = student-independent work
- small group / intervention = teacher-led support
- optional lesson parts and outputs should only appear when explicitly requested or strongly source-grounded
- materials trust depends on usable materials, not merely ready materials
- AI must not replace deterministic extraction, blueprint orchestration, or trust surfaces

## Latest validation snapshot
- checkpoint 22a4732 was validated green on main
- npm run typecheck = PASS
- npm run test = PASS
- npm run build = PASS
- working tree was clean after validation at that checkpoint
- continue from live repo files and the newest handoff, not older stale notes

## What to read next
1. AGENTS.md
2. PROJECT_CURRENT_STATE.md
3. docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt
4. then inspect live source files directly (chat-handoffs removed during repo cleanup)
5. then inspect:
   - src/pages/MaterialsPage.tsx
   - src/pages/InputsPage.tsx
   - src/engine/materials/extractTextFromFile.ts

## Exact next move
- do one narrow Step 6A source-intake contract pass
- primary target: src/pages/MaterialsPage.tsx
- secondary target only if needed for consistency: src/pages/InputsPage.tsx
- make the current intake model explicit and honest
- keep accepted visible file types aligned with src/engine/materials/extractTextFromFile.ts:
  - .txt
  - .pdf
  - .docx
  - .pptx
  - .html
  - .htm
- keep trust language aligned with usable / caution / blocked behavior, not just ready-state wording
- do not reopen blueprint / reliability / Results seams unless fresh inspect proves a real gap
- after the seam, verify in this order:
  1. targeted inspect
  2. npm run typecheck
  3. relevant tests
  4. npm run build
  5. brief manual copy check
