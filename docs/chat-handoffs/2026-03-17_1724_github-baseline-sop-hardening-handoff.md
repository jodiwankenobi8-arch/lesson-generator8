# Lesson Generator 8 — GitHub Baseline, SOP Review, and Hardening Handoff

- Date: 2026-03-17
- Repo: jodiwankenobi8-arch/lesson-generator8
- Chat purpose: verify the current pushed GitHub baseline, reconcile it with the March 11 and March 13 planning documents, review the user’s SOPs and beginner workflow needs, and define the next continuation point for lesson-generator8.

## Canonical project assumptions
- The March 13, 2026 updated execution plan is the live roadmap; the March 11, 2026 plan is historical context only.
- Curriculum is the content authority; exemplar is the presentation / structure authority.
- The product should detect what uploaded materials already cover, avoid duplicating strong source coverage, and ask before adding meaningful missing areas.
- The immediate next engineering target is a formal material reliability layer and blueprint source gating.
- Broader OCR expansion, broad AI generation work, and broader export expansion should come after trust / source-selection hardening.
- The user is completely new to this and wants a beginner-safe workflow: one PowerShell paste at a time, biggest safe chunk, inspect first, one clean edit, verify immediately, frequent checkpoints.
- Public GitHub was used as the pushed-state reference; local-only unpushed changes were not directly available in this chat.

## What was reviewed
- code files
  - public GitHub-visible files and structure, including `README.md`, `package.json`, `src/pages/*`, `src/extraction/*`, `src/engine/*`, and app / route structure
  - GitHub-derived code excerpts loaded into canvas for:
    - `src/App.tsx`
    - `src/main.tsx`
    - `src/engine/materials/extractPdfOcr.ts`
    - `src/engine/workflow/processMaterial.ts`
    - large portions of `src/engine/materials/extractTextFromFile.ts`
- commits
  - visible pushed baseline sequence ending at `c4aef48`
  - earlier referenced checkpoint `83b32d8` was checked but not confirmed as the latest visible pushed baseline
- PRs
  - none reviewed in this chat
- issues
  - none reviewed in this chat
- terminal output
  - no local terminal session was directly reviewed in this chat
- pasted notes
  - full March 13 continuation handoff pasted into chat
  - repeated SOPs / workflow preferences discussed across the conversation
- other evidence actually used
  - uploaded files:
    - `/mnt/data/PROJECT_PLAN_UPDATED_2026-03-11.md`
    - `/mnt/data/Lesson_Generator8_Hardened_Updated_Execution_Plan_2026-03-13.docx`
  - GitHub activity screenshots showing the pushed commit sequence on `main`
  - public repo pages and file tree
  - earlier generated transcript / handoff artifacts from this chat

## Current state
- The current visible pushed GitHub stabilization arc ends at `c4aef48` and includes recent work on:
  - pipeline trace metadata
  - results trace surfacing
  - export artifact structuring / refinement
  - materials processing visibility
  - stronger blueprint source signaling
  - strongest curriculum + strongest exemplar prioritization
- The public repo story is behind the newer plan:
  - `README.md` still describes an older simpler workflow and milestone framing
  - `package.json` still contains stale scaffold metadata (`@figma/my-make-file`)
- The March 13 plan says the project is already in a hardening phase, not a mock-replacement phase.
- The public repo structure does not exactly match the March 13 seam names; seam mapping against the real local tree is still needed before edits.
- A GitHub-derived code bundle was loaded into canvas, but it was not a full byte-for-byte repo dump because the connector surfaced diff-style / retrieved excerpts rather than a raw checkout.
- The user’s SOPs are strong, but for a beginner they need to be centralized and simplified into:
  - product rules
  - build workflow rules
  - beginner safety rules

## Decisions made
- Use the March 13 updated execution plan as the canonical live roadmap.
- Treat the March 11 plan as historical baseline only.
- Treat the visible pushed GitHub baseline ending at `c4aef48` as the current official pushed starting point.
- Prioritize material reliability scoring and blueprint gating before new feature expansion.
- Keep top-1 strongest-source blueprint behavior as the current stabilizer, then evolve selection later only after reliability and multidimensional source strength exist.
- Do not prioritize broad OCR expansion, broad AI generation work, or broad export expansion before trust / source-selection hardening.
- Use a stricter beginner-safe implementation format going forward:
  - what we are doing
  - why now
  - one PowerShell paste
  - expected success result
  - what to send back if it fails
- Treat the ChatGPT Project as needing one canonical operating note rather than multiple equally authoritative chats.

## Completed work
- Reviewed the March 11 plan and compared it against the newer state.
- Reviewed the March 13 continuation handoff and used it as the live roadmap basis.
- Checked the public GitHub repo and the visible pushed commit baseline.
- Determined that `83b32d8` is not the current latest visible pushed baseline from the evidence shown in this chat.
- Identified the latest visible pushed stabilization sequence ending in `c4aef48`.
- Produced a strategic product / startup / UX / technical review.
- Produced a strict milestone-by-milestone execution checklist.
- Reviewed the user’s SOPs and beginner workflow constraints and converted them into a clearer three-layer operating model.
- Created downloadable artifacts during this chat, including a readable transcript and an updated execution plan.
- Loaded a GitHub-derived code bundle into canvas for review.

## Remaining work
- Align repo truth with current reality:
  - update `README.md`
  - fix `package.json` metadata
  - ensure route / flow naming matches the actual product
- Implement formal material reliability scoring and gating.
- Replace flat signal strength with content / structure / coverage strength.
- Move coverage-first semantics earlier in the engine to reduce downstream duplication.
- Evolve blueprint selection with controlled curriculum merging only after reliability exists.
- Finish mixed-target and major teacher-choice workflow.
- Build full exemplar transformation UX with keep / remove / replace / restyle behavior.
- Add bounded AI normalization later, with schema validation and fallback.
- Turn export artifacts into real downloadable files.
- Expand OCR carefully later and harden performance / trust surfaces.
- Centralize the user’s operating rules into one canonical Project note so older chats stop acting like live instructions.

## Next steps
1. Lock the current pushed baseline and stop roadmap drift:
   - update `README.md`
   - fix `package.json`
   - align visible app flow naming with current roadmap
2. Create one canonical ChatGPT Project note containing:
   - product rules
   - workflow rules
   - beginner safety rules
   - current roadmap phase
   - immediate next milestone
3. Inspect the real local seam files in the active local folder before editing:
   - material analysis entrypoint
   - extraction entrypoint
   - blueprint builder / selector
4. Implement typed `MaterialReliability` and wire it through the analysis path.
5. Gate blueprint source selection using reliability.
6. Add tests for noisy OCR / thin extraction / weak-structure cases.
7. Add multidimensional source strength (`content`, `structure`, `coverage`).
8. Move stronger coverage semantics upstream.
9. Only after those are stable, continue into mixed-target decisions, exemplar UX, bounded AI, and real exports.

## Important evidence
- uploaded files
  - `/mnt/data/PROJECT_PLAN_UPDATED_2026-03-11.md`
  - `/mnt/data/Lesson_Generator8_Hardened_Updated_Execution_Plan_2026-03-13.docx`
- repo
  - `jodiwankenobi8-arch/lesson-generator8`
- visible commit SHAs discussed
  - `c4aef48` — Prioritize strongest curriculum and exemplar in blueprint
  - `9c70154` — Prioritize stronger material signals in blueprint pipeline
  - `1e09825` — Add material processing pipeline indicator to Materials page
  - `35db8a7` — Revert metadata store change and keep store contract clean
  - `8786f98` — Improve materials processing visibility and prevent duplicate uploads
  - `440edd1`
  - `928782e`
  - `caaa347`
  - `b8b5e07`
  - `63195fd`
  - referenced but not confirmed as latest pushed baseline: `83b32d8`
- public repo files / paths discussed
  - `README.md`
  - `package.json`
  - `src/pages/InputsPage.tsx`
  - `src/pages/MaterialsPage.tsx`
  - `src/pages/ResultsHubPage.tsx`
  - `src/pages/WizardProgress.tsx`
  - `src/extraction/extractionService.ts`
  - `src/extraction/pdfExtractorSimple.ts`
  - `src/extraction/docxExtractor.ts`
  - `src/extraction/pptxExtractor.ts`
  - `src/engine/`
  - `src/app/`
- canonical seam names from the March 13 plan
  - `src/engine/analysis/runMaterialAnalysis.ts`
  - `src/engine/materials/analyzeMaterial.ts`
  - `src/engine/materials/extractTextFromFile.ts`
  - `src/engine/blueprint/buildBlueprint.ts`
- commands explicitly mentioned as the local continuation inspection point
  - `Get-Content .\src\engine\analysis\runMaterialAnalysis.ts`
  - `Get-Content .\src\engine\materials\analyzeMaterial.ts`
  - `Get-Content .\src\engine\materials\extractTextFromFile.ts`
  - `Get-Content .\src\engine\blueprint\buildBlueprint.ts`
- URL explicitly mentioned
  - `https://github.com/jodiwankenobi8-arch/lesson-generator8/commit/83b32d8`

## Risks / cautions
- Do not treat the March 11 plan as the live roadmap.
- Do not treat stale public README / package metadata as authoritative product state.
- Do not claim a full repo-wide review happened in this chat; review was based on public repo visibility, screenshots, uploaded plans, and retrieved code excerpts.
- Do not broaden OCR, AI generation, or export scope before reliability and source gating are in place.
- Do not blur curriculum vs exemplar authority.
- Do not let old ChatGPT Project chats override the newest canonical plan.
- Do not bypass the beginner-safe workflow:
  - one PowerShell paste at a time
  - inspect first
  - one clean edit
  - verify immediately
- Do not paste raw TypeScript directly into PowerShell.
- Do not let multiple overlapping project chats continue to function as equal-authority roadmap sources.

## Next action
Start the next chat from the active local repo folder, inspect the real local seam files first, then implement the typed material reliability layer and blueprint gating as the first engineering milestone after baseline-truth cleanup.
