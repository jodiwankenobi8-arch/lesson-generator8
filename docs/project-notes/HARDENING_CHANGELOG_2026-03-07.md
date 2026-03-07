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


## Pass 2 — live-runtime isolation and orchard helper hardening

Completed:
- exported `ORCHARD_COLORS` from `src/pages/orchardUi.ts`
- normalized orchard helper parameter types to stop literal-color type drift in live pages
- applied the pinned-note rotation parameter instead of leaving it unused
- moved 107 unreachable source files out of `src/` into `legacy-src/`
- added `docs/project-notes/PRODUCTION_STATUS.md`
- updated the root README to point to the new execution tracker and archived source location

Goal of this pass:
- reduce noise in the live app path
- remove dormant code from current typecheck scope without deleting future work
- make the project structure match the actual runtime more closely

## Pass 3 — route-level code splitting

Completed:
- converted the live router pages to `React.lazy(...)`
- added a polished orchard-style route loading fallback
- reduced the amount of code required for the first screen load

Goal of this pass:
- shrink the initial JavaScript footprint
- move the app toward a production-ready loading experience instead of a blank route transition

## Pass 4 — baseline CI workflow

Completed:
- added `.github/workflows/ci.yml`
- added `npm run check:production`
- updated the README to document the CI path

Goal of this pass:
- make the hardened snapshot easier to push into GitHub with an immediate verification path

## Pass 5 — global polish and release discipline

Completed:
- added global focus-visible styling
- added reduced-motion handling
- added subtle interaction polish for buttons and links
- added `docs/project-notes/RELEASE_CHECKLIST.md`

Goal of this pass:
- improve accessibility and perceived polish without destabilizing page code
