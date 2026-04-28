# Visual Autosizing Strategy Worklist

This worklist defines how each visual element class should adapt to real HTML text/content without forcing one style across all labels.

## Core rule

- Keep each visual identity intact.
- Apply autosizing through component structure, not by replacing all labels with one style.
- Never use baked image text for content-bearing UI.

## Class strategy map

### 1) Label / Ribbon / Plaque assets

Adaptation path:

- Preferred: cap + stretchable center + cap component composition.
- Alternate: CSS-backed tactile ribbon/fabric/plaque component that preserves the same identity.
- Always real HTML text.
- Support minWidth, maxWidth, paddingInline, allowWrap, and long-label handling.

Current worklist:

- `SmartStitchedRibbonLabel` (CSS-backed) for current stitched ribbon header seam.
- `SmartWoodLabel` remains available architecturally, but wood split art is currently `needs-editing` for production visual quality.
- Fabric/plaque labels remain `needs-editing` until split-quality or CSS-backed variants are approved.

### 2) Paper / Card / Panel assets

Adaptation path:

- Preferred: nine-slice (or equivalent) frame system.
- Real HTML children in the center content region.
- Variable width/height support.
- Maintain readable center and stable inner padding.

Current worklist:

- `SmartTornPaperCard` remains the first approved nine-slice component path.
- Additional notebook/panel assets remain queued for split or CSS-backed frame work.

### 3) Full background assets

Adaptation path:

- Decorative shell only.
- No text-container autosizing requirement.
- Validate contrast, readability, and responsive behavior.

Current worklist:

- Keep current page-shell background behavior.
- Continue readability checks at desktop/mobile breakpoints.

### 4) Stickers / Florals / Apples / Mushrooms

Adaptation path:

- Decorative-only by default.
- Do not use as text containers.
- Promote only if explicitly rebuilt as a label/card system with safe text center.

Current worklist:

- No production text-container usage.
- Keep as accent-only visual layers.

## Next implementation order

1. Stabilize `SmartStitchedRibbonLabel` in production header seam.
2. Keep wood label architecture and tests, but defer wood art until improved split set passes visual review.
3. Expand componentized treatment to additional ribbon/fabric/plaque assets without style identity drift.
4. Evaluate additional paper/panel candidates for nine-slice conversion.
