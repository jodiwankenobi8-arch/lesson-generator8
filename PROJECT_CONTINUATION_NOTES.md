# Project Continuation Notes

## Official app path
The wizard app is the official product path:
- `/` -> `src/pages/InputsPage.tsx`
- `/materials` -> `src/pages/MaterialsPage.tsx`
- `/results` -> `src/pages/ResultsHubPage.tsx`
- `/blueprint` -> `src/pages/BlueprintPage.tsx`

## Current architecture direction
Extract -> Blueprint -> LessonSpec -> Generate -> Validate -> Export

## Source-level repairs included
- Canonical curriculum extraction now returns `summary` + `items[]`
- `generateLesson()` now accepts optional Blueprint input
- `useLessonStore.generate()` now passes Blueprint into generation
- `BlueprintPage` and `MaterialsPage` share upload parsing utilities
- `.docx` text extraction is enabled via `mammoth`
- Results Hub blueprint preview now reads `bp.plan.input.*`
- Results Hub confidence display now handles `0..1` scores correctly

## Highest-priority next work
1. Verify end-to-end generation into Results Hub locally
2. Expand `LessonSpec` so Blueprint controls section ordering more explicitly
3. Wire PDF and PPTX extraction into the active upload flow
4. Add validation before export
5. Add teacher review/edit step before export

## Archive rule
Do not work inside `_archive/` unless you intentionally want to recover an old idea.
