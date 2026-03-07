# Lesson Generator - Save This Folder

This is the cleaned project folder to keep working from.

## What was kept live
- Wizard app flow: `Inputs -> Materials -> Results`
- Core lesson engine under `src/engine`
- Standards dataset + scripts
- Exporters
- Public assets and root config files

## What was archived
- Legacy `src/app/components` workspace branch
- Supabase branch
- E2E tests that do not match the live wizard routes
- Old backup files (`.bak*`)
- Root status/audit docs that were cluttering the repo
- Import/note dump files under `src/imports`

## Next place to work
- `src/pages/*`
- `src/state/useLessonStore.ts`
- `src/engine/blueprint/*`
- `src/engine/spec/buildLessonSpec.ts`
- `src/engine/generateLesson.ts`
- `src/engine/exports/*`

## Recommended local commands
- `npm install`
- `npm run typecheck`
- `npm run build`
- `npm run dev`

## Product direction
Use the wizard app as the main product. Treat everything in `_archive/` as reference only.
