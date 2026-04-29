# Asset Color Palette Matrix

## Purpose

- This is an inspect-first reference for app/interface visual assets.
- This document does not define generated lesson output style.
- Generated lesson output styling remains exemplar- and teacher-request-driven.

## Visual Target

- App/interface direction: Apple Orchard Storybook + classy scrapbook feel.
- Avoid binder, teacher desk, teacher planner, planner, digital desk, and planning desk terminology.

## Approved Palette

- Orchard Cream: #FFF6E9
- Blush: #F7D6D0
- Cranberry: #B8545A
- Moss: #6E8B6B
- Deep Orchard: #3F5A40
- Honey: #F2C078
- Paper White: #FFFFFF
- Warm Gray: #E7E2DA
- Charcoal: #2F2F2F
- Warm Brown (support): #7A5B1B

Palette evidence:

- [src/styles/theme.css](src/styles/theme.css#L1)
- [src/pages/orchardUi.ts](src/pages/orchardUi.ts#L3)

## Inspect-Only Matrix

| Asset/Pack | Evidence/File Path | Dominant Colors | Palette Fit | Usage Class | Wiring Status | Risk | Recommendation |
|---|---|---|---|---|---|---|---|
| paper-bg-cream-aged.png | [src/assets/visual/paper-bg-cream-aged.png](src/assets/visual/paper-bg-cream-aged.png), [src/styles/theme.css](src/styles/theme.css#L67) | Warm cream, light tan, paper texture neutrals | Strong fit | Full background | Wired via visual paper background token | Low | Keep as the base page-shell texture. |
| panel-notebook-stack.png | [src/assets/visual/panel-notebook-stack.png](src/assets/visual/panel-notebook-stack.png), [src/assets/visual/README_VISUAL_ASSETS.md](src/assets/visual/README_VISUAL_ASSETS.md#L11) | Cream paper, warm tan, muted brass, small cranberry notes | Strong fit | Panel/frame decorative layer | Not directly wired | Medium | Use only behind real HTML content regions. |
| plaque-wood-paper-moss.png | [src/assets/visual/plaque-wood-paper-moss.png](src/assets/visual/plaque-wood-paper-moss.png), [src/assets/visual/README_VISUAL_ASSETS.md](src/assets/visual/README_VISUAL_ASSETS.md#L13) | Wood brown, moss, cream paper | Mostly fit (wood is supportive, not core token) | Header/plaque decorative layer | Not directly wired | Medium | Safe as decorative header layer with readable HTML text over it. |
| label-fabric-cranberry-floral.png | [src/assets/visual/label-fabric-cranberry-floral.png](src/assets/visual/label-fabric-cranberry-floral.png) | Cranberry, blush, cream, moss accents | Strong fit | Label accent layer | Not directly wired | Medium | Use as non-interactive decorative label treatment only. |
| option-cards-pinned-set.png | [src/assets/visual/option-cards-pinned-set.png](src/assets/visual/option-cards-pinned-set.png) | Cream card stock, warm brass pin tones, soft neutrals | Strong fit | Decorative card material | Not directly wired | Medium | Candidate for subtle card backing, not a content surface replacement. |
| tags-labels-set.png | [src/assets/visual/tags-labels-set.png](src/assets/visual/tags-labels-set.png) | Cream, cranberry, moss, honey-adjacent warm accents | Strong fit | Label/tag source sheet | Not directly wired | Medium | Use selective cutouts only; do not place full sheet in UI. |
| rustic_country_kraft_scrapbook_layout.png | [src/assets/visual/generated-smart/rustic_country_kraft_scrapbook_layout.png](src/assets/visual/generated-smart/rustic_country_kraft_scrapbook_layout.png), [src/styles/theme.css](src/styles/theme.css#L126), [src/assets/visual/generated-smart/README_GENERATED_SMART_ASSETS.md](src/assets/visual/generated-smart/README_GENERATED_SMART_ASSETS.md#L1) | Cream center, moss/cranberry/apple edge collage, kraft neutrals | Strong fit with higher visual intensity | Desktop shell background | Wired for desktop scrapbook background token | Medium | Keep as decorative shell only and preserve center readability. |
| ribbon-labels pack | [src/assets/visual/ribbon-labels/README_RIBBON_LABEL_ASSETS.md](src/assets/visual/ribbon-labels/README_RIBBON_LABEL_ASSETS.md#L1), [src/assets/visual/ribbon-labels/visual-assets-manifest.json](src/assets/visual/ribbon-labels/visual-assets-manifest.json#L1) | Cranberry, cream, honey, moss variants | Strong fit | Ribbon/label decorative layers | Not globally wired | Medium | Best candidate for one shared ribbon seam with real HTML text. |
| fixed-page-labels plan | [src/assets/visual/ribbon-labels/fixed-page-labels/README_FIXED_PAGE_LABELS.md](src/assets/visual/ribbon-labels/fixed-page-labels/README_FIXED_PAGE_LABELS.md#L1) | Planned brick/terracotta stitched ribbon family | Expected fit | Decorative fixed route labels | Not asset-complete or wired | Medium | Keep deferred until all files exist and accessibility contract is fully met. |
| extra-orchard-elements pack | [src/assets/visual/extra-orchard-elements/README_EXTRA_ORCHARD_ELEMENTS.md](src/assets/visual/extra-orchard-elements/README_EXTRA_ORCHARD_ELEMENTS.md#L1), [src/assets/visual/visual-autosize-classification-manifest.json](src/assets/visual/visual-autosize-classification-manifest.json#L1) | Mixed apples, florals, ribbons, mushroom accents in orchard family | Mostly fit with selective-use constraints | Mostly decorative-only; some items marked needs-editing for text-surface conversion | Not wired as production text surfaces | Medium to High | Keep decorative-only by default; only promote items marked safe/ready after split and validation. |

## Guardrails

- Keep content, controls, export buttons, upload states, and generated outputs as real accessible HTML.
- Use image assets as decorative/supporting interface layers only unless manifest/classification marks them safe as text surfaces.
- Do not use whole source sheets directly in UI.
- Do not force generated outputs into orchard/storybook styling.

Guardrail evidence:

- [src/assets/visual/README_VISUAL_ASSETS.md](src/assets/visual/README_VISUAL_ASSETS.md#L31)
- [src/assets/visual/extra-orchard-elements/README_EXTRA_ORCHARD_ELEMENTS.md](src/assets/visual/extra-orchard-elements/README_EXTRA_ORCHARD_ELEMENTS.md#L12)
- [src/assets/visual/visual-autosize-classification-manifest.json](src/assets/visual/visual-autosize-classification-manifest.json#L1)

## Safest Next Implementation Seam

- One small interface-only decorative asset placement after visual approval.
- No generated output styling changes.
