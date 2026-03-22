# Lesson Generator 8 — handoff before Step 6A source-intake contract pass

## Repo
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Latest pushed continuation point: 865ca2b
- Local HEAD when this handoff was written: 865ca2b docs: refresh active continuation checkpoint after results seam push

## What was actually verified before this handoff
- checkpoint 865ca2b is already pushed on main
- npm run typecheck = PASS
- npm run test = PASS
- npm run build = PASS
- working tree was clean after that validation checkpoint

## What is current
- the Results seam is not the active next move anymore
- blueprint source selection already has reliability-aware helper logic in src/engine/blueprint/materialSelection.ts
- the accepted upload-file type truth currently lives in src/engine/materials/extractTextFromFile.ts
- MaterialsPage already says:
  - current intake is upload-file based
  - supported source files are .txt, .pdf, .docx, .pptx, .html, and .htm
  - curriculum and exemplar both operate across one or more source files
- InputsPage still under-describes sources / uploads relative to MaterialsPage
- the best next seam is now teacher-facing source-intake contract tightening

## What is stale / superseded
- any note that says the next move is still Results chrome commit review or Results cleanup
- any note that still uses b2cc872 as the live continuation point
- any note that implies blueprint reliability selection is still the main open seam without fresh contradicting inspect
- any note that implies OCR expansion should happen before the source-intake contract is made explicit

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

## Best next narrow move
Do one narrow Step 6A source-intake contract copy pass.

Primary target:
- src/pages/MaterialsPage.tsx

Secondary target only if needed for consistency:
- src/pages/InputsPage.tsx

Anchor truth to:
- src/engine/materials/extractTextFromFile.ts

What the seam should do:
1. clearly say the current intake is upload-file based
2. make curriculum and exemplar read as multi-source lanes
3. normalize wording toward materials / sources / uploads
4. keep visible accepted file types aligned with the extraction owner:
   - .txt
   - .pdf
   - .docx
   - .pptx
   - .html
   - .htm
5. keep trust wording aligned with usable / caution / blocked behavior
6. do not reopen blueprint / reliability / Results seams unless fresh inspect proves a real gap

## Verification order after the seam
1. targeted inspect
2. npm run typecheck
3. relevant tests
4. npm run build
5. brief manual copy check

## Paste this into the next chat

Lesson Generator 8 continuation.

Act like a sharp senior staff engineer / technical lead / product-minded architect. Be direct, rigorous, beginner-safe, and do not guess. Prefer one coherent PowerShell paste at a time. Inspect first, then recommend the single best next move.

Important:
- GitHub is connected in this chat, but treat the live local repo state and the updated active docs below as the highest-confidence current truth when there is any conflict.
- Do not restart discovery from scratch.
- Do not patch-stack.
- Keep the active continuation set small and authoritative.
- If any retrieved note appears stale or conflicts with the checkpoint below, say so plainly and prefer live repo files/tests plus the updated active docs.

Repo:
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Latest pushed checkpoint: 865ca2b
- Local HEAD at handoff time: 865ca2b docs: refresh active continuation checkpoint after results seam push
- Latest active handoff file: docs\chat-handoffs\2026-03-22_1707_step6a-source-intake-contract-handoff.md

Read in this exact order:
1. START_HERE_CURRENT_TRUTH.md
2. AGENTS.md
3. PROJECT_CURRENT_STATE.md
4. docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt
5. the newest relevant handoff file
6. the actual repo files involved in the next seam

Product truths to preserve:
- curriculum = content authority
- exemplar = presentation / structure authority
- orchard / warm storybook / teacher-first direction
- do not drift into generic SaaS / dashboard styling
- centers = student-independent work
- small group / intervention = teacher-led support
- optional lesson parts and outputs should only appear when explicitly requested or strongly source-grounded
- materials trust depends on usable materials, not merely ready materials
- AI must not replace deterministic extraction, blueprint orchestration, or trust surfaces

Current verified repo truth:
- the latest pushed continuation point is 865ca2b
- checkpoint 865ca2b was green on main:
  - npm run typecheck = PASS
  - npm run test = PASS
  - npm run build = PASS
- the immediate next seam is not more Results hardening and not another blueprint/reliability rewrite
- the current next seam is the teacher-facing source-intake contract seam

Current planned next move:
- Finish Step 6A — source-intake contract
- Primary file target: src/pages/MaterialsPage.tsx
- Secondary file target only if needed for consistency: src/pages/InputsPage.tsx

What Step 6A should do:
1. make the current intake model explicit and honest
2. clearly say the current intake is upload-file based
3. make curriculum and exemplar both read as multi-source lanes
4. normalize wording toward materials / sources / uploads
5. make the visible accepted-type truth match the extraction owner:
   - .txt
   - .pdf
   - .docx
   - .pptx
   - .html
   - .htm
6. keep trust language aligned with usable / caution / blocked behavior, not just ready-state wording
7. do not reopen already-stable engine seams unless a fresh inspect proves a real gap

What is already known from live inspect:
- MaterialsPage already contains the current upload-file intake truth and multi-source lane wording
- InputsPage under-describes sources / uploads compared with MaterialsPage
- extractTextFromFile.ts is the accepted-type owner for the current upload-file intake truth
- materialSelection.ts already contains reliability-aware source-selection helpers

What should happen after Step 6A lands:
1. targeted inspect
2. npm run typecheck
3. relevant tests
4. npm run build
5. brief manual copy check on Inputs and Materials
6. refresh:
   - START_HERE_CURRENT_TRUTH.md
   - PROJECT_CURRENT_STATE.md
   - one latest handoff file only if the seam is meaningful enough to need it
7. commit and push the Step 6A checkpoint before starting Step 6B

What is not the next move:
- do not restart broad repo discovery
- do not reopen closed Results / export / reliability seams without proof
- do not start OCR expansion first
- do not start AI integration first
- do not start export proliferation first
- do not create extra competing truth docs

If notes conflict, use this precedence:
1. live repo code and tests
2. START_HERE_CURRENT_TRUTH.md
3. PROJECT_CURRENT_STATE.md
4. newest handoff
5. OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt
6. README.md
7. older archive notes as historical only

Start by telling me:
1. what the app currently is
2. what is already working
3. what is incomplete, fragile, or misleading
4. which older notes are stale
5. the single best next move now

Then give one PowerShell paste only.
