# Fixed Decorative Page Label Assets

## Status: AWAITING ASSETS

These four ribbon label images have not been created yet.
No code in `OrchardRibbon.tsx` or anywhere else should reference these files
until every file in the table below is physically present and has passed visual review.

---

## Asset table

| File | Baked text | Used on page | Notes |
|---|---|---|---|
| `ribbon-inputs.png` | Planning Notebook | Inputs page header | Primary header ribbon |
| `ribbon-materials.png` | Source Workbench | Materials page header | Primary header ribbon |
| `ribbon-results.png` | Planning Binder | Results page header | Primary header ribbon |
| `ribbon-teacher-planning-studio.png` | Teacher Planning Studio | App-level header (reserved) | Wire only when needed |

---

## Visual spec

- **Base art:** Same visual as `../brick-floral-stitched-ribbon-label.png` (brick/terracotta floral stitched ribbon).
- **Transparent PNG — no checkerboard, no solid background.**
- **Text must be visually integrated into the ribbon surface**, not browser-rendered over the top.
  Compose text as part of the same image layer (Photoshop / Figma / Illustrator / similar).
  Match the ribbon's shadow depth, fabric texture, and color temperature.
- **Export size:** Minimum 1712 × 586 px (2× source scale: 856 × 293 display px).
  Larger is fine; display size is controlled by CSS.
- **Consistency:** All four files must look like they belong to the same set.
- **No other colors, styles, or base art.** Keep visual identity identical to the existing brick ribbon.

---

## Accessibility rule (hard requirement)

These are **decorative images that carry stable page label text**.
Because the text is baked into the image, the accessible name must be supplied separately.

**Required pattern in code:**

```tsx
// The wrapper exposes the accessible label.
// The img is fully decorative.
<div role="img" aria-label="Planning Notebook" style={wrapStyle}>
  <img src={ribbonInputs} alt="" aria-hidden="true" style={imgStyle} />
  {/* No visible HTML text span — the baked text IS the label */}
</div>
```

Rules:
- The `<img>` must have `alt=""` and `aria-hidden="true"`.
- The baked image must never be the **only** accessible source of text.
- The accessible name must be the exact same string as the baked text (case-insensitive match allowed).
- Do not make the wrapper a `<button>` or interactive control.

---

## Scope constraint

When these assets are ready and wired in:

**DO change:**
- `OrchardRibbon.tsx` — choose the correct fixed-label asset per `text` prop value; remove visible HTML `<span>` for these fixed labels; use responsive `width: min(...)` not fixed 356 px; ensure mobile does not clip the ribbon tails.

**DO NOT change:**
- Generation engine, exports, store logic, routing, material processing, lesson engine.
- `SmartWoodLabel.tsx` — do not wire it back into production.
- `SmartTornPaperCard.tsx` — not relevant to this seam.
- Any dynamic labels, status messages, upload states, warnings, card content, buttons, inputs, or data-generated text — these must remain real HTML text always.

---

## Implementation checklist (run in order when assets are ready)

1. Place all four PNG files in this directory.
2. Open each in an image viewer and confirm: transparent background, text visually integrated, no clipping on mobile at 390 px display width.
3. Update `OrchardRibbon.tsx`:
   - Import the four PNGs.
   - Map `text` prop value → asset import (exact string match).
   - Set `width: "min(430px, 100%)"` on the wrapper (no fixed pixel width).
   - Set `height: auto` with `aspectRatio` derived from natural dimensions.
   - Remove the visible HTML `<span>` for fixed labels.
   - Add `role="img"` and `aria-label={text}` to the wrapper div.
4. Run `npm run verify:release` — must be fully green.
5. Run visual checkpoint: Inputs desktop, Materials desktop, Results desktop, Materials mobile.
   - Confirm no ribbon tail clipping at 390 px.
   - Confirm text reads as part of the ribbon surface.
6. Commit: `Use fixed ribbon label images for page headers`
7. `git pull --rebase origin main`
8. Run `npm run verify:release` again.
9. Push only if green.

---

## Why fixed baked-text images are acceptable here

These labels are:
- **Static** — the page label never changes based on user data.
- **Not interactive** — they are not buttons or controls.
- **Stable** — there are exactly 4 per the route structure; adding a new page would require a new asset anyway.

The HTML text overlay approach was evaluated and **rejected** for this seam because:
- The ribbon art is tactile and photographic.
- Browser-rendered Playfair Display over a photo-like fabric reads as "text pasted on image" rather than belonging to the same surface.
- On mobile (390 px), the fixed-width ribbon tail clips off screen.

Fixed baked-text images solve both problems, provided the accessibility contract above is met.
