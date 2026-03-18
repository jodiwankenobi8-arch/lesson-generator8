# Lesson Generator 8 note-style exemplar cue port handoff

* Date: 2026-03-17 19:51
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: land the current canonical salvage seam, recover from failed patch attempts, record the finished state, and set up the next chat to reconnect GitHub, review the handoff file, and reanalyze the live repo before taking the next step.

## Canonical project assumptions

- work/canonical-project-consolidation is the only live branch.
- escue/runtime-phase4-tip and escue/orchard-polish-tip are donor shelves, not merge targets.
- Several donor commits contain useful behavior, but current canonical structure is newer; salvage should prefer manual ports over blind cherry-picks.
- Current salvage should follow current canonical seams rather than reviving deleted extractor-era paths.
- Behavior lineage matters more than path lineage when harvesting donor value into current canonical.

## What was reviewed

- Code files:
  - src/engine/analysis-signals.test.ts
  - src/engine/materials/analyzeMaterial.ts
- Commits:
  - 8cfa393 baseline at the start of the coding work in this chat
  - 3af7d35 landed and pushed in this chat
  - recent local log also showed 6a2cc18, 92ceeab, 56898ed, 2839a7, 1abe6c3
- PRs:
  - none reviewed in this chat
- Issues:
  - none reviewed in this chat
- Terminal output:
  - local git branch --show-current, git rev-parse, git status --short, git diff, git log --oneline -6
  - repeated git restore --source=HEAD -- src/engine/materials/analyzeMaterial.ts during recovery
  - targeted Vitest run for src/engine/analysis-signals.test.ts
  - local commit and push output
- Pasted notes:
  - original salvage guidance stating canonical-only, donor shelves only, likely next seam in src/engine/materials/analyzeMaterial.ts, and warning that the local working tree might be dirty
- Other evidence actually used:
  - attached original handoff files from this conversation (PDF, markdown, docx)
  - repeated local diffs while recovering from failed patch attempts
  - repo context selection via @GitHub for jodiwankenobi8-arch/lesson-generator8

## Current state

- Branch: work/canonical-project-consolidation
- HEAD after push: 3af7d35
- Commit message: detect note-style exemplar teacher delivery cues
- Working tree was clean after commit and push.
- The targeted test file passed:
  - 
pm run test -- src/engine/analysis-signals.test.ts
  - result: 1 file passed, 5 tests passed
- Landed change was narrow:
  - added one note-style exemplar test in src/engine/analysis-signals.test.ts
  - widened note-style exemplar heuristics in src/engine/materials/analyzeMaterial.ts

## Decisions made

- Keep canonical as the only live branch.
- Do not merge rescue branches.
- Do not do more blind donor cherry-picks for this seam.
- Solve the immediate failing seam with a narrow manual heuristic port in src/engine/materials/analyzeMaterial.ts.
- Use PowerShell-only paste workflow during the recovery because direct manual editing was not desired in chat.
- Rebaseline src/engine/materials/analyzeMaterial.ts from HEAD whenever patch attempts went sideways, then land only the minimal intended change.

## Completed work

- Confirmed local branch and origin alignment before modification.
- Recovered a dirty or mangled src/engine/materials/analyzeMaterial.ts back to clean canonical multiple times during patch recovery.
- Added a new exemplar note-style detection test covering:
  - Teacher Note
  - Notes:
  - Watch and listen
  - My turn, your turn
  - Say it with me
  - Circulate
  - Guided Practice
  - Closure
- Broadened exemplar heuristics to detect note-style delivery cues in:
  - selectTeacherMoves
  - selectPromptStyle
  - 	eacher_prompt_blocks
  - 	eacher_scripts
- Committed the landed change as 3af7d35.
- Pushed 3af7d35 to origin/work/canonical-project-consolidation.
- Removed temporary patch artifacts and ended clean.

## Remaining work

- Reanalyze the live repo after 3af7d35 rather than assuming the next seam from memory.
- Decide the next smallest donor-to-canonical seam; likely adjacent material-analysis behavior or extraction behavior, but this was not reopened in depth after push.
- Run broader validation if needed; only the targeted Vitest file was shown passing in this chat.
- Reconfirm whether the next high-value donor harvest should come from escue/runtime-phase4-tip or a different donor commit after fresh repo review.

## Next steps

1. In a new chat, type @GitHub and select jodiwankenobi8-arch/lesson-generator8.
2. Review the original attached handoff PDF from this conversation and this handoff before changing code.
3. Reconfirm local repo truth with:
   - git branch --show-current
   - git rev-parse --short HEAD
   - git rev-parse --short origin/work/canonical-project-consolidation
   - git status --short
   - git log --oneline -6
4. Inspect what actually landed:
   - git show --stat --oneline 3af7d35
   - git diff 8cfa393..3af7d35 -- src/engine/analysis-signals.test.ts src/engine/materials/analyzeMaterial.ts
5. Reanalyze current canonical seams before touching donor branches:
   - src/engine/materials/analyzeMaterial.ts
   - src/engine/analysis-signals.test.ts
   - src/engine/extractTextFromFile.ts if extraction is the next likely seam
   - downstream blueprint and reliability paths only as needed
6. Choose the next smallest manual donor harvest instead of branch surgery.

## Important evidence

- Repo path used locally:
  - C:\Users\jodiw\OneDrive\Desktop\lesson-generator8-local
- Branch:
  - work/canonical-project-consolidation
- SHAs:
  - 8cfa393
  - 3af7d35
  - log also showed 6a2cc18, 92ceeab, 56898ed, 2839a7, 1abe6c3
- Files changed in the landed work:
  - src/engine/analysis-signals.test.ts
  - src/engine/materials/analyzeMaterial.ts
- Commands actually run in this chat:
  - Set-Location "C:\Users\jodiw\OneDrive\Desktop\lesson-generator8-local"
  - git branch --show-current
  - git rev-parse --short HEAD
  - git rev-parse --short origin/work/canonical-project-consolidation
  - git status --short
  - git diff -- src/engine/analysis-signals.test.ts src/engine/materials/analyzeMaterial.ts
  - git log --oneline -6
  - git restore --source=HEAD -- src/engine/materials/analyzeMaterial.ts
  - 
pm run test -- src/engine/analysis-signals.test.ts
  - git add src/engine/analysis-signals.test.ts src/engine/materials/analyzeMaterial.ts
  - git commit -m "detect note-style exemplar teacher delivery cues"
  - git push origin work/canonical-project-consolidation
- PRs reviewed:
  - none
- Issues reviewed:
  - none

## Risks / cautions

- Do not treat donor shelves as merge targets.
- Do not revive deleted extractor-era files just because donor commits referenced them.
- Do not widen MaterialRole or redesign store, export, or role plumbing without fresh repo evidence.
- Do not assume the next seam is unchanged; reanalyze after 3af7d35.
- Remember that only the targeted analysis-signals test file was shown green in this chat.
- The successful salvage approach here was behavior lineage over path lineage: port useful behavior into current canonical seams instead of following old branch structure.

## Next action

Connect @GitHub to jodiwankenobi8-arch/lesson-generator8, review the original handoff PDF plus this file, then locally confirm 3af7d35 and inspect the landed diff before picking the next smallest donor-to-canonical seam.