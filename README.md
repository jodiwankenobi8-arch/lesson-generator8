# Lesson Generator

A private instructional production engine for generating complete lesson packages.

## What this repository is

Lesson Generator converts structured lesson inputs plus optional uploaded materials into a packaged instructional set for teacher use.

Current live workflow:

1. Inputs
2. Materials
3. Blueprint
4. Results / export hub

## Current priorities

The current hardening effort is focused on four things:

- stabilizing the live app structure
- making upload influence traceable
- strengthening export reliability
- moving the UI toward a polished orchard-style design system

The detailed production roadmap now lives in [`README_PRODUCTION_PLAN.md`](./README_PRODUCTION_PLAN.md).
The current execution tracker lives in [`docs/project-notes/PRODUCTION_STATUS.md`](./docs/project-notes/PRODUCTION_STATUS.md).

## Development

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev:any
```

Helpful checks:

```bash
npm run typecheck
npm run build
npm run check
npm run check:production
npm run test:smoke
```

## Notes

- This is a single-product codebase, not a multi-tenant SaaS app.
- The orchard visual direction is intentional and should stay consistent as the app is refined.
- Keep experimental or legacy routes out of the live runtime until they are fully finished.

## Archived code

Unused source that is not part of the live runtime has been moved to `legacy-src/` instead of being deleted.

## CI

A starter GitHub Actions workflow now lives at `.github/workflows/ci.yml` and runs typecheck, build, and smoke tests.
