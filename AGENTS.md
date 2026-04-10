# AGENTS.md

Use this file as both the continuation launcher and the operating contract.

## Current continuation order

1. `START_HERE_CURRENT_TRUTH.md`
2. `PROJECT_CURRENT_STATE.md`
3. `docs/chat-handoffs/README.md`
4. the newest relevant file in `docs/chat-handoffs/`

## Default operating mode

Default to take-over mode.

That means:
- inspect the live repo state first
- identify the highest-leverage seam from real code/tests/browser evidence
- complete the biggest safe coherent pass independently
- prefer repo-ready scripts, full-file replacements, or complete takes over drip-fed micro patches
- do not require line-by-line manual edits unless there is no safer option
- preserve store/pipeline ownership rather than moving logic back into page components
- verify immediately after meaningful edits

## Product rules that remain in force

- Curriculum is the content authority.
- Exemplar is the optional structure / style authority.
- Any requested final output may have its own scoped exemplar.
- Missing exemplar should not block output generation by itself.
- When no exemplar is requested for an output, use a trustworthy default artifact shell instead of blocking or producing vague fallback mush.
- Content-bearing outputs still require sufficient content grounding.
- Do not let the product drift into generic AI lesson synthesis when the real goal is trusted output transformation.

## Workflow rules

- One PowerShell paste at a time.
- Biggest safe coherent chunk.
- Inspect first.
- One clean edit.
- Verify immediately.
- Frequent checkpoints.
- No brittle patch stacking.
- No raw TypeScript pasted directly into PowerShell.

## Documentation rule

When notes conflict with live code, tests, or the current working tree, trust the live repo first.

Do not let older fragmented closeout notes or stale handoffs override the newest canonical truth.