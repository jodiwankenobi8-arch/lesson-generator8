# Lesson Generator - UI Implementation Spec

## Purpose
This document translates the Master Design Bible into practical UI implementation rules for the current web app. It is the build-facing companion to the design bible and should guide visual polish work so the interface becomes consistent and recognizably Apple Orchard / teacher-first / warm storybook.

This document focuses on:
- shared shell
- global tokens
- card system
- ribbon system
- button system
- form system
- Inputs page
- Materials page
- Results Hub
- Wizard Progress
- preview / teach mode
- interaction rules

---

# 1. Implementation principles

## Main rule
Every visible UI change should make the app feel more like a warm, peaceful, orchard-inspired teacher planning space and less like a generic dashboard.

## Build priorities
1. Shared shell and tokens
2. Inputs page polish
3. Materials page polish
4. Results Hub hierarchy and presentation
5. Wizard progress / storyboard feeling
6. Preview and teach mode styling
7. Decorative refinements last

## Non-goals for this pass
Do not redesign backend logic. Do not add feature sprawl. Do not overbuild a component library before the core visual language is coherent.

---

# 2. Global tokens

## Core colors
Use these as the main CSS/token layer.

- Orchard Cream: `#FFF6E9`
- Paper White: `#FFFFFF`
- Warm Gray: `#E7E2DA`
- Text Charcoal: `#2F2F2F`
- Moss Green: `#6E8B6B`
- Deep Orchard: `#3F5A40`
- Apple Blush: `#F7D6D0`
- Warm Honey: `#F2C078`
- Muted Cranberry: `#B8545A`

## Functional usage
- app background = Orchard Cream
- major surfaces/cards = Paper White
- borders/dividers = Warm Gray
- primary text = Text Charcoal
- strong structural elements = Deep Orchard
- primary actions / support structure = Moss Green
- warm soft accents = Apple Blush
- callout/secondary emphasis = Warm Honey
- restrained alert emphasis = Muted Cranberry

## Shadow language
Use soft warm-neutral shadows only.

Suggested tiers:
- low: light paper lift
- medium: main card lift
- hover: subtle increase only

Never use harsh black-heavy shadows.

## Radius language
Use rounded corners consistently.

Suggested scale:
- small controls: 12px
- inputs/buttons: 12-14px
- major cards: 20-24px
- hero / large surfaces: 24px+

---

# 3. Typography implementation

## Preferred pair
- headings: Playfair Display
- body/UI: Inter

## Heading usage
Use serif headings for:
- page title
- hero headings
- major section titles
- ribbon section labels where appropriate

## Body usage
Use Inter for:
- labels
- buttons
- paragraph text
- helper text
- metadata
- form inputs
- content previews

## Hierarchy
Suggested working scale:
- page title: strong serif, clearly dominant
- section header: serif or strong structured sans depending on context
- card title: medium emphasis
- body/helper text: clean and quiet

Avoid overly tiny body text and avoid decorative heading overload.

---

# 4. Shared page shell

## Goal
All pages should feel like one coherent teacher workspace.

## Required shell elements
Every major page should share:
- orchard cream page background
- centered content container
- generous top/bottom spacing
- a consistent page header rhythm
- repeatable card spacing
- common action/button placement logic

## Container behavior
Suggested structure:
- page background fills viewport
- main content centered
- comfortable max width
- generous left/right padding

## Page rhythm
Recommended order for each page:
1. page title / hero block
2. short context/help line if useful
3. main content cards
4. primary action area
5. supportive footer/help only if truly useful

---

# 5. Background and texture system

## Main canvas
The app shell should use Orchard Cream with a subtle paper/canvas texture.

## Texture implementation rules
- low opacity
- soft contrast
- almost atmospheric
- should never interfere with text or controls

## Where texture belongs
- page background
- possibly large hero surfaces very lightly

## Where it should not dominate
- inside dense form controls
- behind long text blocks
- inside major results content areas

---

# 6. Hero block system

## Purpose
Each major page should start with a stronger top block so the app feels designed and guided, not like stacked cards.

## Hero block behavior
Hero blocks should:
- visually anchor the page
- reinforce the current step in the journey
- provide warmth and hierarchy
- help the page feel like a chapter in a storyboard

## Suggested visual traits
- rounded large card or header panel
- paper-white or soft accent surface
- serif heading
- supporting body text in Inter
- optional ribbon element or decorative accent line

---

# 7. Ribbon header system

## Purpose
Ribbon headers are a signature element and should be used deliberately.

## Visual style
- Moss Green or Deep Orchard background
- light stitched/dashed line detail optional
- paper-white text
- optional V-cut or ribbon-tail styling
- moderate softness, not cartoonish

## Use cases
Use ribbons for:
- main section markers
- grouped Results Hub categories
- strong page subsections

Do not use for every minor label.

---

# 8. Card system

## Main card
This is the default content container.

Visual rules:
- Paper White background
- Warm Gray border
- 20-24px radius
- soft shadow
- generous internal padding
- enough spacing between cards for a calm rhythm

## Card types
### Standard card
Default container for forms, output blocks, and summaries.

### Hero card
Larger, more visually expressive version for page openers.

### Soft accent card
A paper-white card with a very light blush or honey accent zone.
Use sparingly to add warmth.

### Grouped output card
For Results Hub outputs; should include clear title, short summary, and action area.

## Card composition
Preferred internal order:
- title area
- short description / summary
- main content preview or status
- action row

---

# 9. Button system

## Primary button
Use Moss Green with white text.

Use for:
- Generate
- primary next-step actions
- major export or proceed actions

## Secondary button
Use Warm Honey with Deep Orchard or Charcoal text.

Use for:
- meaningful but non-primary actions
- open/preview when not dominant

## Soft button
Use Apple Blush with Deep Orchard/Charcoal text.

Use for:
- supportive actions
- secondary interface warmth

## Tertiary/subtle button
Use Paper White or transparent with Warm Gray border.

Use for:
- low emphasis actions
- toggles
- utility buttons

## Button behavior
- rounded corners
- soft hover
- slight lift or shadow shift only
- no aggressive animation

---

# 10. Form system

## Form philosophy
Forms should feel like clean planning sheets, not raw software controls.

## Input style
- paper-white field
- Warm Gray border
- rounded corners
- strong readable text
- quiet but visible label
- moss/deep orchard focus treatment

## Input grouping
Each group of related inputs should sit inside a clearly bounded section/card.

## Labels and helper text
- labels should be clear and teacher-friendly
- helper text should be present where it reduces uncertainty
- avoid walls of instructional copy

## Optional vs required distinction
Use hierarchy and small helper language rather than loud color coding.

---

# 11. Upload area system

## Purpose
Upload zones are central to trust and should feel designed.

## Visual behavior
Upload blocks should feel like warm structured drop zones, not default dashed dev boxes.

## Shared upload style
- soft surface
- clear dashed or warm border
- icon + title + short explainer
- obvious drag-and-drop affordance
- clear accepted file type/help line

## Curriculum vs exemplar distinction
These must visually belong to the same family while remaining clearly distinct.

Recommended approach:
- same base card language
- slightly different header/accent treatments
- concise text explaining what each one influences

---

# 12. Inputs page spec

## Page purpose
The Inputs page is the opening of the planning journey.

## Emotional goal
It should feel like opening a beautiful teacher planner and getting ready to build a lesson.

## Layout goals
- strong welcoming hero
- visible start point
- section grouping that reduces overwhelm
- calm progression down the page
- primary action visible and satisfying

## Section behavior
Each section should feel intentional rather than like a random form chunk.

## Visual improvements to support
- stronger page opener
- cleaner internal hierarchy
- warmer field grouping
- more breathing room
- better pacing between sections
- subtle storybook tone without clutter

## What to avoid
- flat stacked generic forms
- hard utility spacing
- dashboard energy

---

# 13. Materials page spec

## Page purpose
This page is the teacher's material sorting desk.

## Emotional goal
It should feel like laying out curriculum and exemplar materials in a calm, trustworthy workspace.

## Structural needs
Must clearly show:
- what curriculum is
- what exemplar is
- how they influence the output
- what files are present
- what the system likely used

## Visual goals
- clearer distinction between the two source types
- stronger upload cards
- better visual grouping
- more tactile desk-like feeling
- source trust and clarity

## Ideal scan path
1. page meaning
2. curriculum area
3. exemplar area
4. what each affects
5. next action

---

# 14. Results Hub spec

## Page purpose
The Results Hub is the emotional payoff and should feel like opening a complete lesson package.

## Emotional goal
This page should feel satisfying, premium, polished, and ready for classroom use.

## Information hierarchy
Results Hub should present:
1. lesson identity
2. standards / metadata context
3. what sources influenced the lesson
4. generated outputs
5. preview/open/export actions
6. classroom readiness

## Structural pattern
Recommended rhythm:
- summary hero
- key lesson metadata / standards
- grouped output cards
- export area
- optional deeper reference/debug blocks lower down

## Output cards
Each output area should include:
- clear title
- short summary of what it contains
- status or preview cue
- primary action(s)

## Key result groups
Likely groups include:
- slides
- teacher lesson plan
- centers
- interventions / enrichment
- rotation / support materials
- exports

## Design goal
This should stop feeling like a utility results dump and start feeling like a polished teacher planning binder.

---

# 15. Wizard Progress spec

## Purpose
This is where the whimsical storyboard feeling becomes obvious.

## Emotional goal
The progress component should feel like the teacher is moving through meaningful steps in a guided planning journey.

## Design goals
- active state is clear
- completed steps feel satisfying
- upcoming steps feel inviting
- overall component feels like a sequence, not just a technical stepper

## Visual ideas
- connected progression line
- chapter-like labels
- warm structure colors
- gentle motion emphasis on current step

## Avoid
- raw software stepper styling
- cramped labels
- generic breadcrumb energy

---

# 16. Preview / teach mode spec

## Purpose
This is the classroom-facing or lesson-facing review experience.

## Emotional goal
It should feel more instructional and presentation-ready than the planning pages while remaining in the same visual family.

## Key qualities
- calm
- readable
- teacher-trustworthy
- slightly elevated from the planning view
- clean and presentation-friendly

## Avoid
- overly flashy slide-deck chrome
- disconnected styling from the rest of the app

---

# 17. Decorative rules

## Allowed decorative accents
- stitched separators
- ribbon headers
- small orchard motifs
- sparse gingham/polka-dot support areas
- subtle tabs or scrapbook layering cues

## Decorative placement rules
Use decoration in:
- hero zones
- empty states
- section transitions
- footer accents
- grouped card headers

## Do not decorate
- dense form fields
- long text-heavy areas
- every card
- every header

Decoration should act like a finishing touch, not the main event.

---

# 18. Interaction and motion

## Motion rules
- calm
- soft
- brief
- supportive

## Good motion examples
- hover shadow/lift
- section expand/collapse
- button feedback
- subtle progress emphasis

## Avoid
- bounce
- heavy spring motion
- dramatic transitions
- attention-seeking animations

---

# 19. Accessibility and usability

## Must preserve
- readable contrast
- strong text legibility
- obvious click targets
- visible focus states
- low cognitive load

## Key rule
Beauty must help clarity. The design should never make the product harder to use.

---

# 20. Anti-drift rules

## The design must not drift into
- corporate dashboards
- startup admin panels
- bright generic edtech UI
- childish classroom software
- random scrapbook clutter
- legacy blue/purple leftovers that conflict with orchard direction

## Red flags during implementation
- square cards or buttons
- harsh shadows
- cold background tones
- too many competing accent colors
- flat utility stacks with no page rhythm
- excessive decoration

---

# 21. Recommended implementation map

## Files that should carry the design system
- `src/styles/theme.css`
- `src/pages/orchardUi.ts`
- shared shell/card/ribbon helpers if introduced
- page-level files for Inputs, Materials, Results Hub, Wizard Progress

## Best order of work
1. theme tokens and global shell
2. shared orchard UI helpers
3. Inputs page
4. Materials page
5. Results Hub
6. Wizard Progress
7. preview / teach mode

---

# 22. Final practical check

Before calling a visual pass done, ask:
- Does this feel like a beautiful teacher planning space?
- Does it feel warm and peaceful?
- Does it feel layered and textured?
- Does it feel like a whimsical storyboard?
- Does it look like Jodie's product instead of generic software?

If the answer is no, keep polishing.

---

# 23. One-sentence implementation summary

Use warm orchard tokens, serif headings, soft paper-white cards, subtle texture, ribbon-led hierarchy, and guided page rhythm to turn the current app into a calm, storybook teacher planning workspace that feels intentionally designed from Inputs through Results Hub.
