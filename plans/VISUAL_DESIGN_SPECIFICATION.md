# Lesson Generator 8 Visual Design Specification

## 1. Purpose and Scope
This document defines the high-fidelity visual design direction for Lesson Generator 8 as a design handoff for Figma and visual production planning.

Scope includes:
- Visual language, style, and component appearance for existing product flow
- Page-level design direction for Inputs, Materials, and Results
- Export artifact visual templates for PPTX, DOCX, and PDF outputs
- Accessibility, responsiveness, and quality acceptance standards for design review
- Future-facing implementation notes without changing current behavior

Scope does not include code implementation.

## 2. Non-Goals
This specification does not:
- Redesign or reorder the Inputs -> Materials -> Results flow
- Change product logic, runtime architecture, or store ownership
- Introduce AI-assistant wizard framing or conversational assistant UX
- Modify curriculum/exemplar authority model
- Author or request code, CSS, React, test, or pipeline changes in this phase

## 3. Product Rules to Preserve
The visual system must preserve existing product rules:
- Inputs -> Materials -> Results remains the canonical teacher-facing flow
- Curriculum is the content authority for content-bearing outputs
- Exemplar is the structure/presentation authority when provided
- Teacher-first tone remains primary in all labels, helper text, and status language
- Avoid AI-wizard language, assistant persona cues, or chat-like scaffolding
- No broad architecture or flow redesign in visual direction
- Release-proof closeout rule remains in force: no code changes unless a browser-visible or export-visible defect is proven

## 4. Visual Direction
Design intent:
- Warm teacher planning space with premium classroom binder character
- Apple orchard and teacher desk cues expressed as subtle visual storytelling
- Classy scrapbook and warm storybook references without nostalgia overload
- Cranberry-balanced palette as signature anchor, with restrained decorative accents
- Whimsical storyboard details that feel crafted and thoughtful, never childish or cluttered

Atmosphere keywords:
- Grounded
- Crafted
- Trustworthy
- Warm
- Instructionally focused

## 5. Color System
### Cranberry-Forward Balance
Primary visual identity should center on a cranberry-led accent family balanced by warm neutrals and supporting moss greens.

### Core Palette
- Cranberry 700: #7F1D35 (primary emphasis, active states)
- Cranberry 600: #9E2744 (primary buttons, authority accents)
- Cranberry 500: #B43759 (interactive highlight)
- Moss 700: #355E3B (curriculum/content authority)
- Moss 600: #467A4A (curriculum tags, readiness-positive support)
- Moss 500: #5C9460 (secondary affirming accents)
- Cream 50: #FCF8F1 (page wash)
- Paper 100: #F6F1E7 (card base)
- Warm Gray 700: #4D463F (primary body text)
- Warm Gray 500: #746B63 (secondary text)
- Warm Gray 300: #B8AEA3 (borders/dividers)

### Authority Mapping
- Curriculum/content authority UI markers should default to moss family
- Exemplar/structure authority UI markers should default to cranberry family

### Neutrals
- Cream/paper neutrals are primary surfaces
- Warm gray is default typographic family for legibility and hierarchy

### Status Colors
- Success: Moss 600 (#467A4A)
- Info: Slate Blue 500 (#4C628A)
- Warning: Amber 600 (#A86A1A)
- Error: Brick 600 (#A84432)

### Usage Rules
- Keep cranberry as accent-forward, not full-page flood
- Preserve contrast ratios for all text and interactive elements
- Use status colors semantically, never decoratively
- Avoid saturated color stacking in one component
- Maintain clear color distinction between authority badges and action buttons

## 6. Typography
### Font Families
- Headings: Playfair Display
- Body/UI: Inter

### Type Scale
- Display: 40/48, Playfair Display, semi-bold
- H1: 32/40, Playfair Display, semi-bold
- H2: 28/36, Playfair Display, medium
- H3: 24/32, Playfair Display, medium
- H4: 20/28, Inter, semi-bold
- Body L: 18/28, Inter, regular
- Body M: 16/24, Inter, regular
- Body S: 14/20, Inter, regular
- Caption: 12/16, Inter, medium

### Accessibility Sizing
- Minimum body size: 16px for core instructional content
- Secondary helper text may use 14px with sufficient contrast
- Interactive controls minimum text: 14px with 1.4 line-height or greater
- Do not use all-caps for long labels or instructional guidance

## 7. Layout System
### Page Canvas
- Max content width: 1200px desktop
- Centered layout with generous outer breathing room
- Vertical rhythm anchored in an 8px spacing system

### Card Spacing
- Standard card padding: 24px desktop, 16px mobile
- Section-to-section spacing: 24px to 32px based on density
- Intra-card row spacing: 12px to 16px

### 8px Grid
All spacing values should resolve to 8px increments wherever practical:
- 8, 16, 24, 32, 40, 48, 56, 64

### Responsive Breakpoints
- Mobile: 0 to 767
- Tablet: 768 to 1023
- Desktop: 1024 to 1439
- Wide desktop: 1440+

## 8. Component Library
### Ribbon Headers
- Visual motif inspired by binder tabs/ribbons
- Playfair heading with subtle paper-shadow lift
- Optional authority chip (curriculum or exemplar)

### Buttons
- Primary: cranberry 600 fill, cream text
- Secondary: paper fill, warm gray border, cranberry hover text
- Tertiary/text: minimal chrome, clear focus state
- Disabled: reduced contrast but still readable and compliant

### Form Inputs
- Paper surface with warm-gray border
- Focus ring uses cranberry 500 with accessible contrast
- Label-first composition with teacher-oriented microcopy

### Cards
- Paper-based surfaces with soft elevation
- Rounded corners: 12px standard
- Border accent optional for semantic groupings

### Upload Cards
- Dashed warm-gray boundary with orchard-themed icon support
- Clear file-state labels: ready, processing, needs review
- Drag-and-drop affordance without playful gimmicks

### Tags and Badges
- Curriculum tags default moss palette
- Exemplar tags default cranberry palette
- Neutral metadata tags in warm-gray tint

### Readiness Badges
- Ready: moss with concise, affirmative language
- Needs review: amber with actionable and specific phrasing
- Blocked: brick with direct corrective instruction

### Dividers
- Warm-gray low-contrast lines with optional leaf-knot decorative marker at major transitions

### Botanical Icons
- Thin-line, understated orchard/botanical iconography
- Used as supportive cues only; no mascot behavior

### Export Cards
- Distinct format cards for ZIP, PPTX, DOCX, PDF
- Show format role, readiness, and parity hint to Results content
- Strong state clarity for available vs blocked exports

### Slide Preview Cards
- Structured, readable hierarchy for slide title, intent, and content preview
- Preserve legibility at dense text lengths
- Avoid decorative overlays that reduce scanability

## 9. Page Designs
### Inputs: Planning Notebook
- Framing metaphor: teacher planning notebook on warm desk surface
- Purpose cues: lesson objective, standards context, exemplar intent
- Form groups should read top-to-bottom with minimal cognitive branching
- Emphasize confidence-building helper text and clear completion trajectory

### Materials: Source Workbench
- Framing metaphor: curated source desk/workbench with evidence-first review
- Source cards present extraction confidence and review need with calm clarity
- Readiness panel should be visually prominent and unambiguous
- Preserve practical teacher language over technical pipeline wording

### Results: Planning Binder
- Framing metaphor: compiled planning binder with sectioned output tabs
- Organize generated outputs into coherent, scannable sections
- Export panel should feel dependable and completion-oriented
- Keep any decorative motifs low-noise to prioritize instructional content

## 10. Export Artifact Templates
### PPTX Title Slide
- Cream paper background with subtle orchard border motif
- Playfair title, Inter subtitle
- Footer metadata strip for grade/lesson context

### PPTX Teaching Slide
- Strong instructional heading band (cranberry accent)
- Body region optimized for projection contrast and concise bullets
- Teacher cue area styled but not dominant

### PPTX Guided Practice Slide
- Two-zone layout: model area and student response area
- Clear visual distinction between prompt and practice sections
- Optional moss cue accents for content grounding

### DOCX Lesson Plan First Page
- Binder-style heading block with lesson metadata
- Structured sections: objective, standards, materials, sequence
- High print legibility with restrained decorative framing

### PDF Printable Page
- Generous margins for classroom printing reliability
- Crisp hierarchy with minimal background noise
- Student-facing content area clearly isolated from teacher notes

### Teacher Guide Page
- Practical, sequence-forward layout
- Clear timing and facilitation notes with teacher-first language
- Avoid jargon and assistant-like commentary

## 11. Motion and Interaction
- Motion should be subtle, purposeful, and low frequency
- Use quick fade/slide transitions (120 to 220ms) for section changes and state confirmations
- Avoid novelty motion, bounce effects, and game-like transitions
- Maintain reduced-motion compatibility with equivalent non-animated affordances

## 12. Accessibility Requirements
- WCAG 2.2 AA contrast compliance for text and interactive elements
- Keyboard navigation support across all interactive controls and export actions
- Visible focus indicators on all focusable UI
- Semantic heading hierarchy maintained per page
- Error/status messaging must be textual, not color-only
- Target minimum touch size: 44x44 for interactive controls where feasible

## 13. Responsive Design Requirements
- Inputs, Materials, Results must remain fully usable on mobile, tablet, desktop
- Stack multi-column groups into clear single-column flow on mobile
- Preserve hierarchy and readability for readiness/status regions at all widths
- Avoid horizontal scrolling for core workflows
- Keep action buttons reachable and clearly grouped in narrow layouts

## 14. Figma Deliverables Checklist
- Global color styles and text styles aligned to this spec
- Component set for all listed library elements and states
- Inputs, Materials, Results page frames for desktop/tablet/mobile
- Export artifact template mockups for PPTX, DOCX, PDF
- Interaction notes for motion and state transitions
- Accessibility annotation layer (contrast, focus, keyboard expectations)
- Final handoff notes mapping component usage and page intent

## 15. CSS Custom Properties for Future Implementation
The following token names are reserved for future implementation planning only.

Color tokens:
- --color-cranberry-700
- --color-cranberry-600
- --color-cranberry-500
- --color-moss-700
- --color-moss-600
- --color-moss-500
- --color-cream-50
- --color-paper-100
- --color-warm-gray-700
- --color-warm-gray-500
- --color-warm-gray-300
- --color-status-success
- --color-status-info
- --color-status-warning
- --color-status-error

Typography tokens:
- --font-heading
- --font-body
- --type-display
- --type-h1
- --type-h2
- --type-h3
- --type-h4
- --type-body-l
- --type-body-m
- --type-body-s
- --type-caption

Spacing/radius/shadow tokens:
- --space-1 through --space-8 (8px scale mapping)
- --radius-card
- --radius-control
- --shadow-card-soft
- --shadow-card-focus

## 16. Component Interface Notes for Future Implementation
These notes define intended visual interfaces without changing current functional contracts.

- AuthorityBadge: supports variants curriculum and exemplar with fixed color mapping
- ReadinessBadge: supports ready, needs-review, blocked with explicit text labels
- ExportCard: supports format type, availability state, and brief parity descriptor
- RibbonHeader: supports title, subtitle, optional authority badge slot
- SlidePreviewCard: supports title, section label, normalized content excerpt

Implementation expectation:
- Preserve existing data ownership and runtime flow
- Treat these interfaces as visual wrappers around existing behavior

## 17. Design Quality Checklist
- Teacher-first voice is consistent across labels and helper text
- Inputs -> Materials -> Results hierarchy is visually clear
- Curriculum vs exemplar authority is always distinguishable
- Visual styling feels premium and warm, not toy-like or crowded
- Readiness and export states are immediately understandable
- Typography remains readable in dense planning contexts
- Decorative motifs never reduce instructional clarity
- Mobile layouts preserve workflow completion confidence

## 18. Success Criteria
Design is successful when:
- Teachers can complete the existing workflow with lower cognitive friction
- Authority model is clearer at a glance (curriculum vs exemplar)
- Results and export surfaces feel trustworthy and publication-ready
- The interface feels distinctive, warm, and professional without functional disruption
- The visual direction can be implemented incrementally without architecture change

## 19. Implementation Guardrails
This document is a Figma/high-fidelity design handoff only.

Guardrails:
- Do not implement this design system while release-proof baseline governance is under review
- Do not perform code changes based solely on this document
- Keep release-proof closeout rule active: no code changes unless a browser-visible or export-visible defect is proven
- Any future implementation pass must begin by confirming verify:release remains green
- Any implementation should be the smallest safe visual-only pass that preserves current flow, authority rules, and teacher-first tone
