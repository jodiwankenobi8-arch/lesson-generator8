# Apple Orchard Asset Registry

Updated through Asset 05.

## Asset Status Key

- **Queued** — identified but not extracted yet
- **In progress** — being reconstructed
- **Finalized** — approved and ready for export
- **Exported** — packaged for project use

---

## Assets 01–05

### Asset 01: wood-background-orchard

**Status:** Finalized / Exported  
**Category:** Background  
**Source page:** New Lesson woodland/apple page  
**Description:** Warm horizontal orchard wood planks with darker seams, subtle grain variation, and soft tonal wear. Used as the base surface behind parchment cards and decorative clusters.

**Deliverables:** preview PNG; PNG asset; SVG asset; CSS implementation; React/TSX component; design tokens JSON; README; zipped handoff package  
**Canonical code names:** `WOOD_BACKGROUND_ORCHARD`, `woodBackgroundOrchardStyle`, `WoodBackgroundOrchard`  
**Recommended project placement:** `src/assets/ui/wood-background-orchard/`, `src/components/design-system/backgrounds/wood-background-orchard/`

**Notes:** Source-derived wood surface asset packaged as a reusable background element.

---

### Asset 02: main-cream-paper-panel

**Status:** Finalized / Exported  
**Category:** Panel  
**Source page:** New Lesson woodland/apple page  
**Description:** Layered parchment-style primary content panel with outer cream frame, soft paper center, and dashed stitched inner border. Intended as the main reusable content container for forms, notes, and setup screens.

**Deliverables:** preview PNG; PNG asset; SVG asset; CSS implementation; React/TSX component; design tokens JSON; README; zipped handoff package  
**Canonical code names:** `MAIN_CREAM_PAPER_PANEL`, `mainCreamPaperPanelStyle`, `mainCreamPaperInnerStyle`, `MainCreamPaperPanel`  
**Recommended project placement:** `src/assets/ui/main-cream-paper-panel/`, `src/components/design-system/panels/main-cream-paper-panel/`

**Notes:** Panel-only. No text, labels, buttons, or fields.

---

### Asset 03: new-lesson-label-apple

**Status:** Finalized / Exported  
**Category:** Label  
**Source page:** New Lesson woodland/apple page  
**Description:** Decorative page-title label with apple illustration, blossom cluster, and title treatment extracted from the source image. Intended for headers, section titles, planner title moments, and dashboard hero labels.

**Deliverables:** preview PNG; PNG asset; SVG asset; CSS implementation; React/TSX component; design tokens JSON; README; zipped handoff package  
**Canonical code names:** `NEW_LESSON_LABEL_APPLE`, `AppleIconArtwork`, `BlossomCluster`, `NewLessonLabelApple`  
**Recommended project placement:** `src/assets/ui/new-lesson-label-apple/`, `src/components/design-system/labels/new-lesson-label-apple/`

**Notes:** Current raster preserves the reference title treatment for exact visual fidelity.

---

### Asset 04: stitched-inner-frame

**Status:** Finalized / Exported  
**Category:** Frame  
**Source page:** New Lesson woodland/apple page  
**Description:** Standalone dashed / stitched inner frame extracted from the parchment panel language. Intended as a reusable overlay for cards, forms, planner surfaces, and parchment containers when the inner stitch detail is needed without reusing the full paper panel.

**Deliverables:** preview PNG; PNG asset; SVG asset; CSS implementation; React/TSX component; design tokens JSON; README; zipped handoff package  
**Canonical code names:** `STITCHED_INNER_FRAME`, `stitchedInnerFrameStyle`, `StitchedInnerFrame`  
**Recommended project placement:** `src/assets/ui/stitched-inner-frame/`, `src/components/design-system/frames/stitched-inner-frame/`

**Notes:** Frame-only. Transparent center. No fill, text, labels, buttons, or fields.

---

### Asset 05: lesson-title-ribbon

**Status:** Finalized / Exported  
**Category:** Ribbon  
**Source page:** New Lesson woodland/apple page  
**Description:** Standalone moss ribbon header extracted from the lesson setup screen. Preserves the signature Apple Orchard ribbon treatment with stitched detail, warm moss palette, V-cut tails, lower folded tabs, and the reference title treatment.

**Deliverables:** preview PNG; PNG asset; SVG asset; CSS implementation; React/TSX component; design tokens JSON; README; zipped handoff package  
**Canonical code names:** `LESSON_TITLE_RIBBON`, `lessonTitleRibbonStyle`, `LessonTitleRibbon`  
**Recommended project placement:** `src/assets/ui/lesson-title-ribbon/`, `src/components/design-system/ribbons/lesson-title-ribbon/`

**Notes:** Current exported raster preserves the original baked-in title text for exact visual fidelity.

---
