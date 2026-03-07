# Archived source modules

This folder holds source files that are **not part of the live runtime path** for the current Lesson Generator app.

Why they were moved here:
- they were unreachable from `src/main.tsx`
- several of them were causing TypeScript noise or build-risk while not affecting the live app
- keeping them archived is safer than deleting them while the production hardening pass is still in progress

What remains live in `src/`:
- `src/main.tsx`
- `src/App.tsx`
- `src/app/AppRouter.tsx`
- `src/pages/*`
- active lesson engine files used by the current routing flow
- `src/state/useLessonStore.ts`
- active export helpers
- active design token and utility files

What was archived in this pass:
- legacy app shell and alternate routes
- deck player / teach mode experiments
- dormant extraction and OCR pipeline work
- unused upload, auth, and template helpers
- unused standards and template-engine variants

Archived file count in this pass: 107
