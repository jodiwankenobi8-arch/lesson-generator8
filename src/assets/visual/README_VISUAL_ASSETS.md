# Lesson Generator 8 Visual Asset Pack

These are repo-ready visual assets for the image-like / premium stationery direction.

## Install location

Copy the `src/assets/visual/` folder into the local repo:

`C:\Users\jodiw\OneDrive\Desktop\lesson-generator8-local\src\assets\visual\`

## Assets

- `paper-bg-cream-aged.png` — full-page cream scanned-paper style background.
- `panel-notebook-stack.png` — large paper/notebook stack content panel.
- `plaque-wood-paper-moss.png` — wood + moss + paper header plaque.
- `label-fabric-cranberry-floral.png` — cranberry/blush fabric label strip.
- `option-cards-pinned-set.png` — three pinned paper option-card elements.
- `tags-labels-set.png` — paper/fabric label/button element sheet.

## Design intent

Use these as **real image-like material assets**, not as Photoshop-only mockups.

The product should feel like:
- premium stationery
- realistic paper materials
- warm orchard storybook workspace
- tactile collage
- mature, image-like UI elements

This visual direction applies to app/interface presentation. Generated lesson output styling remains exemplar- and teacher-request-driven.

Avoid:
- fake vector wood/paper
- cartoonish classroom clipart
- generic SaaS cards
- flat vector/digitized scrapbook imitation

## Implementation guidance

Use the assets selectively in shared visual seams first. Do not rewrite the app.

Recommended first implementation:
1. Add imports or public asset URLs for `paper-bg-cream-aged.png`, `panel-notebook-stack.png`, and `plaque-wood-paper-moss.png`.
2. Use `paper-bg-cream-aged.png` as the page shell background.
3. Use `panel-notebook-stack.png` behind the primary content area or key hero section.
4. Use `plaque-wood-paper-moss.png` as the header/ribbon visual basis.
5. Keep text as real HTML text layered on top for accessibility.
6. Preserve Inputs -> Materials -> Results.
7. Run `npm run verify:release` after any implementation patch.
