# Lesson Generator - Pruned Package

This package was pruned to keep the source project while removing local bulk and review clutter.

Removed on purpose:
- `.git/` (local git history)
- `node_modules/`
- `dist/`
- `test-results/`
- `_archive/`
- `_ui_snapshot/`
- `tmp/`
- `lesson-generator8_backups/`
- `orchard-review-files/`
- `orchard-review-files.zip`
- `orchard-review-slices.txt`
- `orchard-audit-short.txt`
- `orchard-audit-tiny.txt`
- `orchard-build-log.txt`
- `orchard-dev-log.txt`
- `*.numbered.txt`
- `*.bak`

What this package still contains:
- source code (`src/`)
- configs (`package.json`, tsconfig, vite, playwright, etc.)
- docs and scripts
- public assets
- standards source data

To use it again after extracting:
1. Run `npm install`
2. Run `npm run dev`

Note:
This is a space-saving source snapshot, not a full local git clone.
