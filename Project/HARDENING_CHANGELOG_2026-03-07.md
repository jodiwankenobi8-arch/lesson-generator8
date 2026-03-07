# Hardening Changelog - 2026-03-07

## Changes applied in this pass

### Startup and repo hygiene
- Restored global stylesheet loading from `src/main.tsx`.
- Replaced placeholder package metadata in `package.json`.
- Added `check` and `test:smoke` scripts to support a cleaner release workflow.
- Expanded `.gitignore` to reduce local clutter and prevent heavy transient files from re-entering the repo.
- Refreshed the root `README.md` to match the current product direction.
- Added `README_PRODUCTION_PLAN.md` as the working production roadmap.

### Reliability
- Upgraded `src/state/useLessonStore.ts` to persist both draft input and generated package instead of only the package.
- Added versioned workspace storage with migration support from the older saved-package key.
- Added a root-level error boundary in `src/App.tsx` so unexpected crashes fail more gracefully.

### Design system foundation
- Added `src/design/orchardTokens.ts` as the first shared token source for the orchard visual language.
- Updated orchard UI helpers and the app error fallback to use shared tokens instead of only local hard-coded values.

## Not finished yet
- Full build verification after dependency install
- Route architecture cleanup
- Unified extraction pipeline
- Results traceability panels
- Full component-level design system
- Export hardening

## Recommended next implementation pass
1. Archive duplicate route/app paths into `legacy` or `experimental`.
2. Create one canonical lesson package schema and validation layer.
3. Replace `readUploadedText.ts` with a single extraction entry point that reports confidence and warnings.
4. Redesign `MaterialsPage` around source trust and extraction visibility.
5. Harden export flows and add release checks in CI.
