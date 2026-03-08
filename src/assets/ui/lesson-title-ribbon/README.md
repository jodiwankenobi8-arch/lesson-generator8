# Asset 05: lesson-title-ribbon

Professional asset package for the Apple Orchard lesson title ribbon.

## Included files

- `lesson-title-ribbon-preview.png` - contextual preview using the original reference surface
- `lesson-title-ribbon.png` - exact transparent raster extraction from the uploaded reference crop
- `lesson-title-ribbon.svg` - SVG wrapper that preserves the exact raster art
- `lesson-title-ribbon.css` - reusable CSS class and optional overlay title styling
- `LessonTitleRibbon.tsx` - React component for app/web integration
- `tokens.json` - design tokens, dimensions, and metadata
- `index.ts` - barrel export for codebases

## Notes

- This package is raster-first so the visual stays faithful to the uploaded reference.
- The exported PNG preserves the original ribbon lettering exactly as it appears in the source crop.
- The React/CSS layer supports an optional overlay title, but it is off by default so the reference art stays untouched.
- This asset is ribbon-only. It does not include the surrounding paper panel, tabs, or page layout.

## Recommended project placement

- `src/assets/ui/lesson-title-ribbon/`
- `src/components/design-system/ribbons/LessonTitleRibbon.tsx`
