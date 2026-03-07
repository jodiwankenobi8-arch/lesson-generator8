# Lesson Generator - Master Design Bible

## Status
This is the unified source of truth for the Lesson Generator visual and experience direction going forward. It combines the project's saved design decisions and the design guidance developed across the project conversations, while resolving contradictions in favor of the current approved direction.

## Executive summary
Lesson Generator should feel like a warm, peaceful, orchard-inspired storybook planning workspace for a teacher. It should look like a beautiful teacher desk brought to life digitally: orchard cream paper canvas, rounded paper-white cards, moss and deep orchard structure, honey and blush accents, elegant serif headings, readable sans body text, subtle paper texture, restrained scrapbook layering, and a guided workflow that feels like progressing through a whimsical storyboard.

It must not feel like a cold SaaS dashboard, a corporate admin tool, a generic edtech product, or a childish classroom game.

---

# 1. Product identity

## What the product is
Lesson Generator is a solo teacher planning engine for daily classroom use. It turns lesson inputs into a complete instructional package.

Core outputs include:
- student-facing lesson slides
- teacher lesson plan that references slide numbers
- centers ideas and printable materials
- intervention support for Tier 3 and Tier 2
- enrichment support
- rotation materials and support artifacts

## Product priorities
The product is built around:
- speed
- reliability
- predictable outputs
- low friction
- teacher trust
- classroom practicality
- stability over flash

## Product model
This is not a SaaS product. It is a teacher-first personal workspace and planning tool.

---

# 2. Official design direction

## Approved direction
The official design direction is:

**Apple Orchard / teacher desk / classy scrapbook / warm storybook**

This supersedes older generic blue dashboard, chalkboard, sterile productivity, or corporate SaaS directions when they conflict.

## Emotional target
The interface should feel:
- warm
- calm
- organized
- trustworthy
- teacher-smart
- elegant
- tactile
- peaceful
- curated
- lightly whimsical

## Experience target
The app should feel like the teacher is progressing through a whimsical storyboard as they move from inputs to materials to generation to results and eventually into preview / teach mode.

## What it must never feel like
- a corporate dashboard
- a cold admin panel
- generic edtech SaaS
- a bright startup UI
- a childish classroom game
- chaotic scrapbook clutter
- a raw developer tool

---

# 3. Contradictions resolved

Across earlier design exploration, several directions appeared. The following are now resolved:

## Retired or secondary directions
These are no longer primary where they conflict with the orchard direction:
- generic academic blue dashboard systems
- chalkboard-heavy visual themes
- sterile Notion/Linear-only visual systems
- old blue, slate, purple, or navy token leftovers
- plain utility-first prototype styling

## Final resolved choices
- Visual system: Apple Orchard / storybook / teacher desk / classy scrapbook
- Experience progression: whimsical storyboard
- Feeling: classy, layered, textured, peaceful
- Tone: warm storybook
- Typography: heading/body pairing can be chosen pragmatically now and revised later if desired; current preferred working pair is Playfair Display + Inter

---

# 4. Design philosophy

## Core philosophy
The design should support the teacher's real work with calm structure and low cognitive load. The interface should feel like a powerful instructional tool disguised as a beautiful planning space.

## Design intent
The product should feel like:
- a beautiful teacher planner
- a curated planning notebook
- a calm digital desk
- a warm storybook workspace
- a structured instructional engine hidden inside a beautiful interface

## Guiding sentence
The UI should feel like a beautiful teacher planning space that quietly turns complex instructional work into something clear, warm, and usable.

---

# 5. Product and workflow structure

## Core workflow
The application still follows a simple workflow:
- Inputs
- Generate
- Results Hub

This remains the structural backbone.

## Inputs page structure
The Inputs page uses collapsible sections to keep the interface clean and reduce overwhelm.

Core sections include:
1. Lesson Basics
2. Student Groups (I/E)
3. Lesson Focus
4. Materials and Constraints
5. Optional Exemplars
6. Standards (Auto Detect)

## Results Hub structure
The Results Hub is the final generated package area. It should present outputs in a clear, satisfying, polished layout.

It should foreground:
- lesson identity
- date / subject / grade / standards context
- what materials influenced the lesson
- what was generated
- what can be opened or exported
- what is ready for classroom use

## Workflow feel
The journey through the product should feel sequential and guided, not like moving between disconnected utility screens.

---

# 6. Official palette

## Core palette
- Orchard Cream - `#FFF6E9`
- Apple Blush / Soft Apple Blush - `#F7D6D0`
- Warm Honey - `#F2C078`
- Moss Green - `#6E8B6B`
- Deep Orchard - `#3F5A40`
- Paper White - `#FFFFFF`
- Warm Gray - `#E7E2DA`
- Text Charcoal - `#2F2F2F`
- Muted Cranberry - `#B8545A`

## Palette roles
### Orchard Cream
Use for:
- main application background
- canvas background
- overall page atmosphere
- any area that should feel like warm paper

### Paper White
Use for:
- primary cards
- panels
- forms
- main content surfaces

### Warm Gray
Use for:
- borders
- dividers
- subtle structural lines
- card outlines

### Text Charcoal
Use for:
- primary text
- body text
- general readable content

### Moss Green
Use for:
- primary brand structure
- buttons
- section accents
- progress indicators
- ribbon header base

### Deep Orchard
Use for:
- strongest structure anchors
- section hierarchy
- footer/nav emphasis
- strong headings

### Apple Blush
Use for:
- supportive highlights
- soft emphasis
- gentle warmth
- subtle accent cards

### Warm Honey
Use for:
- emphasis
- CTA accents
- supportive badges
- highlights

### Muted Cranberry
Use sparingly for:
- errors
- warnings needing warmth rather than harshness
- special emphasis

## Color usage rules
A healthy page should feel mostly made of:
- orchard cream
- white / warm white
- warm neutral structure
- moss/deep orchard anchors
with small amounts of blush/honey/cranberry.

Do not allow the app to drift toward:
- bright primaries
- neon colors
- default SaaS blues as the primary brand layer
- too many accent colors competing at once

---

# 7. Typography

## Heading fonts
Approved heading fonts:
- Playfair Display
- Libre Baskerville

Use for:
- page titles
- section headers
- hero text
- major card headers
- ribbon header text

Headings should feel:
- elegant
- literary
- warm
- storybook-adjacent
- teacher-smart

## Body fonts
Approved body fonts:
- Inter
- Source Sans 3

Use for:
- body text
- labels
- forms
- buttons
- helper text
- metadata
- teacher notes

Body text should feel:
- highly readable
- calm
- modern enough to function well
- soft rather than corporate

## Optional accent font
Approved sparingly:
- Caveat

Use only for:
- tiny warmth accents
- occasional teacher-note flourishes

Never use Caveat for core UI, dense body text, or main navigation.

## Current preferred working pair
Use **Playfair Display + Inter** unless there is a strong implementation reason to prefer Libre Baskerville or Source Sans 3. This can be changed later if desired.

---

# 8. Texture and surface system

## Texture intent
A major part of the visual identity is a subtle paper/canvas texture that makes the app feel lightly tactile and storybook-like.

## Desired texture qualities
- paper-like
- soft canvas feel
- subtle grain
- lightly painted surface feeling
- scrapbook layering without mess
- warm and almost atmospheric

## Not desired
- grunge
- heavy distressing
- loud paper fibers
- visible fake vintage effect
- fabric simulation
- busy patterns behind text

## Practical rule
Texture should be present enough to create mood but subtle enough that many users barely consciously notice it. The right result is atmosphere, not decoration.

---

# 9. Card and container system

## Core card language
Cards are the main building block of the app.

Cards should feel like:
- placed paper panels
- premium stationery
- calm desk items
- layered planning surfaces

## Card styling rules
- background: Paper White
- border: Warm Gray
- radius: large and soft, generally 20-24px
- shadow: soft and diffused
- padding: generous
- spacing: breathable

## Visual feel
Cards should feel warm, tactile, and structured. They should not feel like dashboard widgets.

## Avoid
- square corners
- harsh black borders
- aggressive elevation
- flat dev-tool panels
- overly dense card grids

---

# 10. Signature UI elements

## Ribbon headers
Ribbon headers are a signature element and should be used in important places.

Characteristics:
- Moss Green or Deep Orchard base
- Paper White or white text
- optional stitched line detail
- optional V-cut tail
- warm handcrafted feel

Use for:
- major section headers
- workflow markers
- hero/section callouts
- big Results Hub groups

Do not turn every small header into a ribbon.

## Stitched details
Approved as subtle accents:
- stitched lines
- dashed separators
- seam-like header accents

Use sparingly and deliberately.

## Orchard motifs
Approved motifs include:
- apples
- leaves
- seeds
- storybook botanical cues

Use them in restrained ways:
- small accents
- empty states
- decorative side/support moments
- badges/icons

Never turn the product into an illustrated children's app.

## Gingham / dots
Approved only as support patterns.

Best use cases:
- footer strips
- empty states
- side accents
- supportive decorative areas

Do not use them across major surfaces or dense content areas.

---

# 11. Layout and hierarchy philosophy

## Layout goals
The interface should be:
- breathable
- guided
- easy to scan
- structured
- visually calm
- clearly sequenced

## Good layout traits
- strong hierarchy
- generous whitespace
- obvious grouping
- clear next action
- supportive sectioning
- one primary scan path

## Bad layout traits
- dense dashboard clusters
- cramped forms
- too many competing anchors
- flat utility layouts
- overdecorated sections
- random spacing or alignment

---

# 12. Shared shell system

## Purpose
All major pages should share a recognizable shell so the app feels like one coherent environment.

## Shared shell should include
- orchard cream page background
- consistent content width
- repeatable page spacing
- shared hero/header treatment
- consistent card rhythm
- common button language
- common section spacing rules
- consistent relationship between page title, content, and actions

This is one of the highest-value polish areas.

---

# 13. Page-specific direction

## Inputs page
The Inputs page should feel like the beginning of the lesson journey.

It should feel:
- welcoming
- calm
- beautifully structured
- like opening a planning notebook
- like "start your lesson here"

Key qualities:
- strong hero or opening card
- clear section grouping
- soft form surfaces
- visible narrative flow
- low overwhelm

## Materials page
The Materials page should feel like a trusted sorting table or teacher desk workspace.

It should feel:
- organized
- tactile
- trustworthy
- clear about the difference between curriculum and exemplar
- visually layered

Curriculum and exemplar should feel related but distinct.

## Results Hub
This is the biggest emotional payoff page and should feel richly satisfying.

It should feel like:
- a completed planning binder
- a polished lesson package
- a real classroom-ready output space
- a premium teacher tool

The Results Hub should visibly communicate:
- lesson identity
- standards context
- source influence
- what was generated
- what can be opened/exported
- what is classroom-ready

## Preview / teach mode
Preview / teach mode should feel:
- classroom-usable
- clean
- focused
- slightly elevated visually
- instructional, not busy

---

# 14. Workflow and storyboard feeling

## Storyboard requirement
The user explicitly wants the experience to feel like progressing through a whimsical storyboard.

That means the interface should reinforce:
- sequence
- progress
- continuity
- growing completeness
- satisfaction at each stage

## Practical interpretation
- page headers should feel purposeful, not generic
- transitions between sections should feel like moving to the next chapter
- progress UI should feel guided, not merely technical
- the Results Hub should feel like the conclusion of a visual journey

---

# 15. Inputs and source trust rules

## Upload experience
The app should support multiple upload/input types for both curriculum and exemplar sources, including:
- doc/docx
- pdf
- ppt/pptx
- jpg/jpeg
- website/link input
- additional practical formats as implementation allows

## Upload UI
Both curriculum and exemplar areas should support drag-and-drop and should visually communicate:
- what type of material belongs there
- how it influences the lesson
- what the system used

## Ambiguity handling
If uploaded materials conflict, are ambiguous, or pull in opposing directions, the app should ask the teacher for clarification rather than silently guessing.

This is a core teacher-trust rule, not just an engineering detail.

---

# 16. Standards and instructional trust

## Standards rule
The system loads a known local Florida B.E.S.T. dataset and should auto-detect standards with confidence and manual override.

It must never invent standards.

## Visual implication
The standards display should feel:
- trustworthy
- clear
- unobtrusive
- teacher-usable

It should not feel like a debug artifact.

---

# 17. Motion and interaction style

## Motion design
Motion should be:
- soft
- subtle
- calm
- reassuring

Good motion examples:
- gentle fades
- slight lift on hover
- smooth expand/collapse
- soft step transitions

Avoid:
- bouncing
- spring-heavy motion
- flashy dashboard-style transitions
- anything toy-like

## Timing
Short, restrained, calm. Motion exists to support clarity and feel, not attention-seeking.

---

# 18. Accessibility and usability

## Accessibility
- maintain readable contrast
- preserve strong readable typography
- interactive elements should remain obvious
- buttons and clickable zones should feel comfortably usable
- decorative layers must never reduce legibility

## Usability principle
The UI must never compete with the lesson content or planning task. Beauty should help clarity, not obscure it.

---

# 19. Anti-drift rules

The design fails when it starts drifting toward:
- corporate enterprise software
- a generic startup dashboard
- clipart-heavy classroom software
- bright rainbow edtech
- flat sterile utility UI
- overloaded scrapbook chaos
- legacy blue/purple theme leftovers that conflict with orchard direction

## Hard avoid list
Never allow:
- neon colors
- square corners
- hard black shadows
- loud busy wallpaper patterns
- emoji clutter
- sharp mechanical panels
- random design languages from old iterations mixing in

---

# 20. Source-of-truth hierarchy

When design sources conflict, use this order:
1. Apple Orchard / teacher desk / classy scrapbook / warm storybook direction
2. Saved orchard design decisions and orchard-specific documents/components
3. Current shared orchard UI system
4. Older blue/slate/chalkboard/general productivity directions only where they do not conflict

If a legacy theme file conflicts with the orchard direction, the orchard direction wins.

---

# 21. Current design implementation priorities

Current priority order for polishing is:
1. Results Hub hierarchy
2. shared shell / card system
3. orchard color cleanup
4. workflow polish
5. slide preview / teach mode visuals
6. decorative refinements

Immediate focus areas are:
- shared shell
- Inputs page
- Materials page
- Results Hub
- preview / teach mode styling

This matches the user's stated desire to prioritize visual polish because that work is gratifying and is the next major product priority.

---

# 22. Practical implementation guidance

## Global tokens to use consistently
- orchard cream background
- paper white cards
- warm gray borders
- moss / deep orchard structure
- honey / blush accents
- text charcoal body text
- serif headings + readable sans body text

## Spacing behavior
Keep pages breathable. Avoid cramped dashboard density.

## Hierarchy behavior
Every major page should clearly show:
- where the teacher is
- what matters most
- what comes next
- what was used
- what is ready

## Provenance visibility
The UI should increasingly make it easy to see what came from:
- curriculum
- exemplar
- system synthesis

This is important to trust and to the "teacher-first engine" feeling.

---

# 23. Design success test

The design is successful if the user thinks:
- this feels like a beautiful teacher planning space
- this feels warm and peaceful
- this feels layered and textured
- this feels like progressing through a whimsical storyboard
- this feels like my product, not generic software
- this feels professional, organized, and usable every day

The design fails if the user thinks:
- this looks like software
- this looks like a dashboard
- this feels generic
- this feels too plain
- this feels corporate
- this feels childish or messy

---

# 24. One-paragraph master summary

Lesson Generator should look and feel like a warm, peaceful, orchard-inspired storybook planning workspace for a teacher: orchard cream paper canvas, rounded paper-white cards, warm gray borders, moss and deep orchard structure, blush and honey accents, elegant serif headings, readable sans body text, subtle paper texture, restrained scrapbook layering, soft stitched/ribbon details, and a guided workflow that feels like moving through a whimsical storyboard toward a polished classroom-ready lesson package.

---

# 25. Recommended file structure going forward

To avoid drift, the design system should ideally be reflected in files like:
- `docs/project-notes/OFFICIAL_DESIGN_SOURCE_OF_TRUTH.txt`
- `docs/design/MASTER_DESIGN_BIBLE.md`
- `docs/design/UI_IMPLEMENTATION_SPEC.md`
- `src/styles/theme.css`
- `src/pages/orchardUi.ts`
- shared shell / card / ribbon helpers

This document should serve as the high-level master source of truth for visual and experiential direction.
