# PROJECT_CURRENT_STATE.md

## Auto-sync status
<!-- AUTO_SYNC_START -->
- Published main checkpoint: eb01b3f
- Last auto-sync UTC: 2026-04-28T16:14:33Z
- Manual/browser verification notes must still be updated by hand.
<!-- AUTO_SYNC_END -->

## Current state

- Active branch: main
- Current repo is in finish / hardening / targeted-refinement mode, not rediscovery mode.
- The core runtime is established: upload intake -> extraction -> analysis -> blueprint -> planning/spec -> package -> Results/exports -> persistence.
- The product already includes important finish-path upgrades:
  - scoped multi-exemplar routing
  - exemplar restyle notes
  - objective/opening separation
  - multi-area lesson portions
  - Results grounding and routing visibility
  - refresh-safe lightweight persistence
- The clarified product charter is now:
  - transform trusted teacher outputs into new grounded versions
  - preserve the structural parts that make those outputs effective
  - support exemplar-driven transformation when exemplars exist
  - support trustworthy default artifact shells when exemplars are absent
- Curriculum is the content authority.
- Exemplar is the optional presentation / structure authority.
- Any requested final output may have its own scoped exemplar.
- Missing exemplar should not block generation by itself.
- Content-bearing outputs still require sufficient content grounding.
- Internal target buckets may support heuristics, but they are not the product definition or completion metric.

## Current risks

- Active truth docs can drift if they are not refreshed after meaningful product-charter or authority-model changes.
- Closeout-only framing can understate the transformation charter and hide the importance of exemplar payoff.
- Browser/export/manual verification still needs to be recorded separately from automated checks.
- Parsing quality, artifact-scoped exemplar payoff, and default-shell behavior still matter to visible product quality even when the codebase is stable.

## Active non-negotiables

- Keep curriculum and exemplar authority separate.
- Do not let the product drift into generic AI lesson synthesis.
- Keep `useLessonStore` as the orchestration seam unless fresh evidence justifies a stronger change.
- Prefer complete coherent takes over micro-patch drip feeds.
- Preserve teacher-facing trust, traceability, and source-grounded output.
- Treat artifact-scoped exemplar behavior and default-no-exemplar behavior as core product rules, not optional polish.

## Current next steps

1. Start future sessions with `npm run verify:release`.
2. If `verify:release` is green, only pursue browser-visible or export-visible mismatches; avoid reopening broad architecture seams.
3. Keep canonical docs aligned with the live product charter.
4. Use take-over mode by default when advancing the repo.
5. Prefer seams that improve exemplar payoff, artifact-scoped exemplar behavior, default-shell behavior, parsing quality, and teacher-facing coherence.
6. Use automated verification plus targeted browser/manual checks before claiming regressions or completion.
7. Do not reopen broad architecture changes without fresh evidence from the live repo or browser behavior.
