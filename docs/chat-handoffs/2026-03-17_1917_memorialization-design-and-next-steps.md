# lesson-generator8 handoff — memorialization, design direction, and next-step reset

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: consolidate the uploaded handoffs and transcripts, preserve the user's rules and goals, clarify the current project state, lock the design direction from mockups, and define the safest continuation point for the next chat.

## Canonical project assumptions

- The project is a teacher-facing lesson generator with the main app flow Inputs -> Materials -> Results.
- The core product rule remains: Curriculum = content authority; Exemplar = presentation authority.
- The project is already beyond the original mock-replacement stage in the reviewed handoffs and is now in a trust/hardening phase.
- The most reliable continuation docs reviewed in this chat treat the March 13 execution plan as the live roadmap over older plans.
- Behavior lineage matters more than old folder/path lineage when older handoffs disagree: preserve the app flow, source-authority rule, trust surfaces, and beginner-safe SOPs.
- The user's workflow requirements are active project requirements, not optional preferences:
  - one PowerShell paste at a time
  - biggest safe chunk
  - inspect real files/contracts first
  - immediate verification
  - frequent build/test
  - no patch churn
  - clean, understandable architecture

## What was reviewed

- code files
  - repo/app design seams discussed or targeted in this chat:
    - src/styles/theme.css
    - src/App.tsx
    - src/pages/InputsPage.tsx
    - src/pages/MaterialsPage.tsx
    - src/pages/ResultsPage.tsx
  - next-engine seams named from reviewed handoffs:
    - src/engine/analysis/runMaterialAnalysis.ts
    - src/engine/materials/analyzeMaterial.ts
    - src/engine/materials/extractTextFromFile.ts
    - src/engine/blueprint/buildBlueprint.ts
    - src/engine/blueprint/resolveBlueprintContent.ts
    - src/engine/blueprint/resolveBlueprintStructure.ts
- commits
  - SHAs and milestone references surfaced in reviewed handoffs/history:
    - c4aef48
    - 9c70154
    - 1e09825
    - a255d2c
- PRs
  - none directly reviewed in this chat
- issues
  - none directly reviewed in this chat
- terminal output
  - no fresh local terminal session was run in this chat
  - historical commands and green-state references were reviewed from uploaded handoffs
- pasted notes
  - uploaded memorialization docs
  - uploaded chat transcripts and readable exports
  - uploaded execution-plan docs
  - uploaded design mockups
- other evidence actually used
  - the user's design mockups and follow-up design preferences
  - prior uploaded project summaries and continuity handoffs created earlier in the project

## Current state

- Reviewed handoffs describe the project as structurally real, not just a mock shell.
- The reviewed project shape remains:
  - Inputs -> Materials -> Results
  - extraction -> analysis -> blueprint -> planning/spec/package -> results
- The reviewed live roadmap says the immediate next engineering target is a formal Material Reliability layer and using it to influence or gate blueprint source selection.
- The reviewed docs describe a latest known baseline where stronger curriculum/exemplar prioritization already exists, but chronology still needs local verification before new code work.
- This chat did not land repo code changes; it produced memorialization, continuation guidance, and design-direction decisions.
- The visual direction was narrowed successfully:
  - yes to apple-orchard storybook scrapbook language
  - yes to stitched grosgrain-style ribbons and layered paper cards
  - no to dark wood-heavy, schoolhouse, or overly sepia UI

## Decisions made

- Treat the uploaded memorialization documents and the March 13 execution plan as the carry-forward context for a new chat.
- Treat older plan/history documents as useful history, but not as the live roadmap if they conflict with the later hardening plan.
- Do not continue blindly from older archive claims until the true current local repo baseline is re-verified.
- The next engineering priority remains trust/hardening, not flashy feature expansion.
- The next design direction is lighter orchard storybook scrapbook, not literal dark rustic classroom scenery.
- The darker mockups are useful for shape/layering language only; the final app should stay lighter, softer, and less brown.
- Any future design implementation should be translated into real reusable app code, not left as descriptive inspiration only.

## Completed work

- Consolidated and evaluated the uploaded handoffs, summaries, transcripts, and archive documents.
- Extracted a newcomer-friendly project summary covering:
  - what the project is
  - what the user wants
  - what is done
  - what is not done
  - what should happen next
- Produced downloadable memorialization files in this chat:
  - Lesson_Generator8_Master_Memorialization_Plan.docx
  - Lesson_Generator8_Master_Memorialization_Plan.md
- Identified the safest continuation package for a future chat:
  - memorialization plan
  - March 13 execution plan
  - design mockups
  - starter continuation prompt
- Clarified the design target from the uploaded mockups and narrowed the live visual direction.

## Remaining work

- Reconcile the true current repo baseline locally before more coding:
  - current branch
  - HEAD
  - clean/dirty status
  - actual latest build/test status
  - whether older local-only notes still apply
- Implement the formal Material Reliability layer.
- Upgrade source selection to separate content strength, structure strength, and coverage strength.
- Improve coverage-first behavior so the app reuses what uploaded materials already cover and avoids duplication.
- Improve mixed-target and teacher-choice flows.
- Build exemplar transformation UX in a controlled way.
- Ship one dependable real export before expanding everything else.
- Apply the clarified design direction in actual repo code; the design code suggested in chat was not applied here.

## Next steps

1. In the next chat, upload:
   - Lesson_Generator8_Master_Memorialization_Plan.docx
   - Lesson_Generator8_Master_Memorialization_Plan.md
   - Lesson_Generator8_Hardened_Updated_Execution_Plan_2026-03-13.docx
   - the orchard/storybook mockup images if design work will continue
2. Start by verifying the real local repo baseline instead of assuming every older handoff is still current.
3. Confirm the canonical working repo/folder and avoid resuming work from any deprecated clone.
4. Inspect the Material Reliability seam files first:
   - src/engine/analysis/runMaterialAnalysis.ts
   - src/engine/materials/analyzeMaterial.ts
   - src/engine/materials/extractTextFromFile.ts
   - src/engine/blueprint/buildBlueprint.ts
   - then resolveBlueprintContent.ts and resolveBlueprintStructure.ts
5. Implement reliability scoring and blueprint gating before new major features.
6. Only after trust/reliability is stabilized:
   - improve teacher-choice flows
   - improve exemplar transformation UX
   - implement real export polish
   - apply the refined orchard design system in code

## Important evidence

- real file paths and filenames mentioned in this chat
  - src/styles/theme.css
  - src/App.tsx
  - src/pages/InputsPage.tsx
  - src/pages/MaterialsPage.tsx
  - src/pages/ResultsPage.tsx
  - src/engine/analysis/runMaterialAnalysis.ts
  - src/engine/materials/analyzeMaterial.ts
  - src/engine/materials/extractTextFromFile.ts
  - src/engine/blueprint/buildBlueprint.ts
  - src/engine/blueprint/resolveBlueprintContent.ts
  - src/engine/blueprint/resolveBlueprintStructure.ts
  - Lesson_Generator8_Master_Memorialization_Plan.docx
  - Lesson_Generator8_Master_Memorialization_Plan.md
  - Lesson_Generator8_Hardened_Updated_Execution_Plan_2026-03-13.docx
- SHAs actually mentioned in this chat or surfaced from reviewed handoffs
  - c4aef48
  - 9c70154
  - 1e09825
  - a255d2c
- PRs actually mentioned
  - none
- issue numbers actually mentioned
  - none
- commands actually mentioned in this chat or in reviewed carry-forward instructions
  - git status
  - git diff
  - npm run build
  - npm run typecheck
  - npm run test:engine

## Risks / cautions

- Do not treat older handoff chronology as automatically current; verify the real local baseline first.
- Do not resume work from an old or deprecated clone if a newer canonical repo path exists.
- Do not skip reliability hardening in favor of new features, OCR expansion, or export expansion.
- Do not lose the user's SOPs; they are part of the project contract.
- Do not implement the dark wood/schoolhouse mockup literally across the live app.
- Do not assume repo-wide review happened in this chat; this was a consolidation/memorialization/design-direction pass, not a full fresh local repo audit.
- Do not let design work drift into over-illustrated scene dressing; keep decorations structural and reusable.

## Next action

Open the canonical local repo in the next chat, verify the true current baseline, then inspect the Material Reliability seam files and implement reliability scoring plus blueprint source-selection gating before any new feature expansion or design-polish pass.
