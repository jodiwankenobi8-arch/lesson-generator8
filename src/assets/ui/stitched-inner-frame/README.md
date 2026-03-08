# Asset 04: stitched-inner-frame

## Status
Finalized / Exported

## Category
Frame

## Source page
New Lesson woodland/apple page

## Description
Standalone dashed / stitched inner frame extracted from the parchment panel language used on the New Lesson woodland/apple page.

This asset is **frame-only**. It contains:

- no paper fill
- no text
- no label
- no form fields
- no extra layout

It is only:

- stitched dashed border
- rounded corner treatment
- subtle thread-style highlight layer
- transparent center for reuse on other surfaces

## Deliverables
- `stitched-inner-frame-preview.png`
- `stitched-inner-frame.png`
- `stitched-inner-frame.svg`
- `stitched-inner-frame.css`
- `StitchedInnerFrame.tsx`
- `tokens.json`
- `index.ts`
- zipped handoff package

## Canonical code names
- `STITCHED_INNER_FRAME`
- `stitchedInnerFrameStyle`
- `StitchedInnerFrame`

## Recommended project placement
- `src/assets/ui/stitched-inner-frame/`
- `src/components/design-system/frames/StitchedInnerFrame.tsx`

## Usage notes
Use this asset as a reusable inset overlay inside parchment cards, planner modules, upload surfaces, or label containers when the design calls for stitched inner detailing without reusing the entire paper panel.

## Packaging notes
This package follows the same professional handoff structure established by Assets 01–03.

## Export summary
- PNG asset: transparent background
- SVG asset: transparent background
- Preview image: parchment background for inspection only
- CSS: reusable class-based implementation
- React/TSX: presentational component with configurable inset and radius
