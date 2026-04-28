# Smart Component Split Assets

This folder contains split image assets prepared from generated smart source sheets.

## Scope

- Asset preparation only.
- No production UI wiring in this pass.
- Source sheets remain unchanged.

## Source sheets

- `src/assets/visual/generated-smart/wooden_sign_components_with_floral_accents.png`
- `src/assets/visual/generated-smart/torn_paper_frame_set_with_accents.png`

Both source sheets are `1448x1086`.

## Output folders

- `wood-label/`
  - `wood-label-left-cap.png`
  - `wood-label-center-tile.png`
  - `wood-label-right-cap.png`
- `torn-paper-card/`
  - `torn-card-tl.png`
  - `torn-card-t.png`
  - `torn-card-tr.png`
  - `torn-card-l.png`
  - `torn-card-center.png`
  - `torn-card-r.png`
  - `torn-card-bl.png`
  - `torn-card-b.png`
  - `torn-card-br.png`

## First-pass note

Crop coordinates are first-pass candidates and require visual validation once SmartWoodLabel and SmartTornPaperCard are scaffolded.

## Hard runtime requirements for SmartWoodLabel

- Real HTML text only.
- Auto-size to fit content with no clipping or overflow.
- Left cap + stretchable/repeatable center + right cap model.
- Must expose controls for `minWidth`, `maxWidth`, `paddingInline`, and long-label wrap/large-variant behavior.
- Baked image text is not allowed.

Acceptance strings to test fit:

- Inputs
- Materials
- Results
- Teacher Planning Studio
- Curriculum Materials Uploaded
- Used with caution
- These materials were analyzed with caution