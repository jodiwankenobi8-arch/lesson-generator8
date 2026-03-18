# Lesson Generator 8 — GitHub Baseline, SOPs, and Continuation Handoff

- Date: 2026-03-17
- Repo: jodiwankenobi8-arch/lesson-generator8
- Chat purpose: review the pushed GitHub baseline, reconcile it with the March 11 and March 13 plans, evaluate SOPs and beginner workflow needs, and define the next continuation point for lesson-generator8.

## Canonical project assumptions
- The March 13, 2026 updated execution plan is the live roadmap; the March 11, 2026 plan is historical context only.
- Curriculum is the content authority; exemplar is the presentation and structure authority.
- The product should detect what uploaded materials already cover, avoid duplicating strong source coverage, and ask before adding meaningful missing areas.
- The immediate next engineering target is a formal material reliability layer and blueprint source gating.
- Broader OCR expansion, broad AI generation work, and broader export expansion should come after trust and source-selection hardening.
- The user is completely new to this and wants a beginner-safe workflow: one PowerShell paste at a time, biggest safe chunk, inspect first, one clean edit, verify immediately, frequent checkpoints.
- Public GitHub was used as the pushed-state reference in this chat; local-only unpushed changes were not directly available here.

## What was reviewed
- code files
  - Public GitHub-visible repo structure and files including README.md, package.json, src/pages/*, src/extraction/*, and src/engine/*
  - GitHub-derived retrieved excerpts loaded into canvas for:
    - src/App.tsx
    - src/main.tsx
    - src/engine/materials/extractPdfOcr.ts
    - src/engine/workflow/processMaterial.ts
    - large retrieved portions of src/engine/materials/extractTextFromFile.ts
- commits
  - Visible pushed baseline sequence ending at c4aef48
  - Referenced checkpoint 83b32d8 was checked but not confirmed as the latest visible pushed baseline
- PRs
  - None reviewed in this chat
- issues
  - None reviewed in this chat
- terminal output
  - No direct local terminal session was reviewed in this chat
- pasted notes
  - Full March 13 continuation handoff pasted into chat
  - Repeated SOPs and workflow preferences discussed in this conversation
- other evidence actually used
  - Uploaded files:
    - /mnt/data/PROJECT_PLAN_UPDATED_2026-03-11.md
    - /mnt/data/Lesson_Generator8_Hardened_Updated_Execution_Plan_2026-03-13.docx
  - GitHub activity screenshots showing the pushed commit sequence on main
  - Public repo pages and file tree

## Current state
- The current visible pushed GitHub stabilization arc ends at c4aef48.
- The recent pushed sequence includes work on:
  - pipeline trace metadata
  - results trace surfacing
  - export artifact structuring and refinement
  - materials processing visibility
  - stronger blueprint source signaling
  - strongest curriculum plus strongest exemplar prioritization
- The public repo story is behind the newer plan:
  - README.md still describes an older simpler workflow and older milestone framing
  - package.json still contains stale scaffold metadata (@figma/my-make-file)
- The March 13 plan says the project is already in a hardening phase, not a mock-replacement phase.
- The public repo structure does not exactly match the March 13 seam names, so real local seam inspection is still required before editing.
- A GitHub-derived code bundle was loaded into canvas, but it was not a byte-for-byte full repo dump because the connector surfaced retrieved excerpts rather than a raw checkout.
- A readable transcript and an updated execution plan file were generated during this chat.

## Decisions made
- Use the March 13 updated execution plan as the canonical live roadmap.
- Treat the March 11 plan as historical baseline only.
- Treat the visible pushed GitHub baseline ending at c4aef48 as the current official pushed starting point.
- Prioritize material reliability scoring and blueprint gating before new feature expansion.
- Keep top-1 strongest-source blueprint behavior as the current stabilizer, then evolve selection later only after reliability and multidimensional source strength exist.
- Do not prioritize broad OCR expansion, broad AI generation work, or broad export expansion before trust and source-selection hardening.
- Use a stricter beginner-safe implementation format going forward:
  - what we are doing
  - why now
  - one PowerShell paste
  - expected success result
  - what to send back if it fails
- Treat the ChatGPT Project as needing one canonical operating note rather than multiple equally authoritative chats.

## Completed work
- Reviewed the March 11 plan against the newer state.
- Reviewed the March 13 continuation handoff and used it as the live roadmap basis.
- Checked the public GitHub repo and the visible pushed commit baseline.
- Determined that 83b32d8 is not the current latest visible pushed baseline from the evidence shown in this chat.
- Identified the latest visible pushed stabilization sequence ending in c4aef48.
- Produced a strategic product, UX, and technical review.
- Produced a strict milestone-by-milestone execution checklist.
- Created downloadable artifacts during this chat:
  - updated execution plan document
  - readable transcript document
  - readable transcript markdown
- Loaded a GitHub-derived code bundle into canvas for review.

## Remaining work
- Align repo truth with current reality:
  - update README.md
  - fix package.json metadata
  - ensure route and flow naming matches the actual product
- Implement formal material reliability scoring and gating.
- Replace flat signal strength with content, structure, and coverage strength.
- Move coverage-first semantics earlier in the engine to reduce downstream duplication.
- Evolve blueprint selection with controlled curriculum merging only after reliability exists.
- Finish mixed-target and major teacher-choice workflow.
- Build full exemplar transformation UX with keep, remove, replace, and restyle behavior.
- Add bounded AI normalization later, with schema validation and fallback.
- Turn export artifacts into real downloadable files.
- Expand OCR carefully later and harden performance and trust surfaces.

## Next steps
1. Lock the current pushed baseline and stop roadmap drift:
   - update README.md
   - fix package.json
   - align visible app flow naming with current roadmap
2. Inspect the real local seam files in the active local folder before editing:
   - material analysis entrypoint
   - extraction entrypoint
   - blueprint builder and selector
3. Implement typed MaterialReliability and wire it through the analysis path.
4. Gate blueprint source selection using reliability.
5. Add tests for noisy OCR, thin extraction, and weak-structure cases.
6. Add multidimensional source strength (content, structure, coverage).
7. Move stronger coverage semantics upstream.
8. Only after those are stable, continue into mixed-target decisions, exemplar UX, bounded AI, and real exports.

## Important evidence
- Uploaded files:
  - /mnt/data/PROJECT_PLAN_UPDATED_2026-03-11.md
  - /mnt/data/Lesson_Generator8_Hardened_Updated_Execution_Plan_2026-03-13.docx
- Repo:
  - jodiwankenobi8-arch/lesson-generator8
- Visible commit SHAs discussed:
  - c4aef48 — Prioritize strongest curriculum and exemplar in blueprint
  - 9c70154 — Prioritize stronger material signals in blueprint pipeline
  - 1e09825 — Add material processing pipeline indicator to Materials page
  - 35db8a7 — Revert metadata store change and keep store contract clean
  - 8786f98 — Improve materials processing visibility and prevent duplicate uploads
  - 440edd1
  - 928782e
  - caaa347
  - 8b5e07
  - 63195fd
  - referenced but not confirmed as latest pushed baseline: 83b32d8
- Public repo files and paths discussed:
  - README.md
  - package.json
  - src/pages/InputsPage.tsx
  - src/pages/MaterialsPage.tsx
  - src/pages/ResultsHubPage.tsx
  - src/pages/WizardProgress.tsx
  - src/extraction/extractionService.ts
  - src/extraction/pdfExtractorSimple.ts
  - src/extraction/docxExtractor.ts
  - src/extraction/pptxExtractor.ts
  - src/engine/
  - src/app/
- Canonical seam names from the March 13 plan:
  - src/engine/analysis/runMaterialAnalysis.ts
  - src/engine/materials/analyzeMaterial.ts
  - src/engine/materials/extractTextFromFile.ts
  - src/engine/blueprint/buildBlueprint.ts
- Commands explicitly mentioned as the local continuation inspection point:
  - Get-Content .\src\engine\analysis\runMaterialAnalysis.ts
  - Get-Content .\src\engine\materials\analyzeMaterial.ts
  - Get-Content .\src\engine\materials\extractTextFromFile.ts
  - Get-Content .\src\engine\blueprint\buildBlueprint.ts
- URL explicitly mentioned:
  - https://github.com/jodiwankenobi8-arch/lesson-generator8/commit/83b32d8

## Risks / cautions
- Do not treat the March 11 plan as the live roadmap.
- Do not treat stale public README or package metadata as authoritative product state.
- Do not claim a full repo-wide code review happened in this chat; review was based on public repo visibility, screenshots, uploaded plans, and retrieved code excerpts.
- Do not broaden OCR, AI generation, or export scope before reliability and source gating are in place.
- Do not blur curriculum versus exemplar authority.
- Do not let old ChatGPT Project chats override the newest canonical plan.
- Do not bypass the beginner-safe workflow:
  - one PowerShell paste at a time
  - inspect first
  - one clean edit
  - verify immediately
- Do not paste raw TypeScript directly into PowerShell.

## Next action
Start the next chat from the active local repo folder and inspect the real local seam files first, then implement the typed material reliability layer and blueprint gating as the first engineering milestone after baseline-truth cleanup.
