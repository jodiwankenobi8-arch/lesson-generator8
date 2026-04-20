# LESSON GENERATOR 8 — CORRECTED MASTER COMPLETION PLAN

**Date:** 2026-04-20  
**Status:** Finish / hardening / targeted-refinement mode  
**Purpose:** Carry forward one authoritative plan that preserves the locked product charter, incorporates recent repo improvements, and explicitly adds the missing high-fidelity Figma phase.

---

## 1. Current state summary

Lesson Generator 8 is **not** a rescue/rebuild and **not** a generic AI lesson generator. It is a teacher-first lesson transformation system built around the canonical product flow **Inputs -> Materials -> Results** and the engine flow **extraction -> analysis -> blueprint -> planning -> spec -> package -> results**.

The repo is architecturally solid and functionally complete enough to ship after finish work. The core runtime, store orchestration, exports, intake contract, OCR contract, and artifact-scoped exemplar support are all materially landed. Recent work also pushed the pass11 review gate / review guidance seam, cranberry-forward color rebalancing, and the teacher-facing coherence terminology pass.

The project should now be treated as a **finish-and-trust** effort: improve trust, coherence, exemplar payoff, Results traceability, Materials trust, and grounded output quality without reopening architecture churn.

---

## 2. Locked product truths

These are fixed and should not be weakened during later work:

1. **Curriculum is the content authority.**
2. **Exemplar is the structure/presentation authority.**
3. **Exemplar is optional, not required.** Missing exemplar should not block generation by itself.
4. **Any final output may have its own scoped exemplar.** Slides, lesson plan, printables, and teacher-support artifacts can each use different exemplars.
5. **When no exemplar is present, the system should use a trustworthy default artifact shell.**
6. **Everything uploaded remains a candidate input** and must surface as used, used with caution, or blocked with a reason.
7. **Teacher-facing honesty matters more than cleverness.** The product must clearly show what was grounded, inferred/generated, blocked, or shaped by exemplar influence.
8. The true north star remains **template-preserving lesson transformation**: start from a trusted shell, map new grounded lesson content into it, preserve timers/routines/teacher moves/slide roles, and keep downstream artifacts secondary to that engine.

---

## 3. Active requirements that remain attached to every later seam

These requests are still active unless explicitly removed:

- Materials must show uploaded items immediately.
- Live upload / scanning / analyzing status progression must be visible.
- Results must remain blocked while processing is incomplete.
- Uploads and review state should persist across navigation / refresh.
- Mixed-target lessons should trigger clarification rather than silent flattening.
- Every uploaded item remains a candidate input and must resolve to used / caution / blocked.
- Curriculum content should pair cleanly with exemplar structure.
- Image-first curriculum PDFs still need an honest usable path or honest surfaced limitation.
- The project should keep the existing backbone and avoid architecture churn.
- Biggest-safe-step workflow discipline remains part of the project contract.

---

## 4. What is already materially landed

The repo already has:

- teacher-facing Inputs -> Materials -> Results flow
- real layered pipeline
- store-owned generation seam (`useLessonStore`)
- blueprint / planning / spec / package separation
- export support (DOCX, PPTX, PDF, ZIP)
- source-intake contract hardening
- bounded OCR contract hardening
- artifact-scoped exemplar support
- refresh-safe persistence
- review-gate / readiness helper infrastructure
- cranberry-forward orchard color rebalancing
- teacher-facing terminology coherence pass across Inputs / Materials / Results

This means the main remaining work is **not** architecture rescue. It is finish-quality truth, product readability, trust, and payoff.

---

## 5. Corrected master completion order

### Phase 0 — Fresh browser/export closeout proof
This remains the explicit closeout gate for the current shipping lane.

Run one fresh end-to-end lesson on the latest code and verify:
- Results trust language is coherent
- teacher-led support stays separate from centers / independent work
- PPTX / DOCX / PDF / ZIP all download and match Results
- refresh once and confirm continuity stays honest

If this passes, the closeout-ready lane is certified. If it fails, the first failed check becomes the only active seam.

### Phase 1 — Teacher-facing coherence cleanup
This is already materially advanced by the terminology pass, but it should still be treated as a finish seam until browser verification confirms it on current code.

Objective:
- make Inputs, Materials, Results, and exports read like one polished teacher product
- preserve curriculum/exemplar authority language
- keep multi-area lesson wording ordered and teacher-facing
- keep export wording aligned with Results wording

### Phase 2 — Results traceability / review-gate UI wiring
The repo now already has review guidance and review-gate helper infrastructure. This phase is no longer “invent traceability”; it is “surface the existing truth clearly in the UI.”

Objective:
- expand “What Came from Where”
- clearly show what came from curriculum, exemplar, and generated completion
- surface support/confidence and materials-needing-review states clearly
- wire review guidance helpers into Results in a teacher-friendly way

### Phase 3 — Exemplar payoff / deterministic shell mapping
This remains one of the biggest unfinished north-star seams.

Objective:
- make exemplars visibly matter in pacing, teacher moves, prompts, section order, slide roles, timers, and artifact-specific shells
- preserve shell structure more deterministically
- surface artifact-scoped exemplar targets clearly in Results
- keep curriculum content authority separate from structural influence

### Phase 4 — Materials trust and continuity
Objective:
- make Materials feel like a reliable source-prep workspace
- show what the system found in uploads
- make readiness / partial coverage / review-needed states clearer
- keep continuity and processing truth strong

### Phase 5 — Editable pre-generation analysis
Objective:
- add concise editable analysis before generation
- expose inferred standards, vocabulary, lesson targets, text/topic, practice ideas, exemplar structural cues, and reliability/use summary
- store teacher overrides separately from raw analysis and feed confirmed values into generation

### Phase 6 — AI structured-output hardening
Objective:
- keep the current AI seam but harden it with schema-constrained output
- explicitly separate grounded content from inferred/generated content
- add teacher-review-needed flags, requested-but-missing parts, evidence-bearing standards suggestions, and section-level generation

### Phase 7 — Inputs simplification
Objective:
- continue turning Inputs into a cleaner teacher wizard
- reduce settings-wall feeling
- use progressive disclosure where it improves clarity without rewriting the architecture

### Phase 8 — Parsing and grounded-output quality
Objective:
- improve the existing extraction / analysis path inside the current store-owned pipeline
- make strong curriculum materials produce visibly stronger outputs
- improve extraction for PDFs, DOCX, PPTX, and curriculum-specific signal capture where it materially improves teacher-visible quality

### Phase 9 — OCR runtime hardening
Objective:
- harden OCR on the currently supported matrix
- preserve honest support boundaries
- improve runtime behavior without overpromising broader format support

### Phase 10 — Image-first curriculum PDF path
Objective:
- treat image-first curriculum PDFs as a distinct seam
- make them visible candidate inputs and, where possible, usable grounding
- if support remains partial, surface that limitation explicitly in trust language and UI

### Phase 11 — High-Fidelity Asset-Exact Visual Pass (Figma)
This is the missing phase that should no longer be treated as generic “visual polish.”

Objective:
- create the real production visual layer for the finished product
- define the final mockups, component system, asset map, and production asset library
- match approved mockups as closely as practical
- use code for layout/behavior and real assets where approximation would materially change the intended look

This is a **visual production phase**, not just a color/spacing pass.

### Phase 12 — Orchard implementation integration / polish
After the Figma phase, integrate the approved visuals and assets into the product.

Objective:
- apply the finalized orchard system consistently across Inputs, Materials, Results, progress, and preview/teach mode
- preserve trust/readability over decoration
- keep orchard tightening subordinate to the product/trust seams above

### Phase 13 — High-risk cleanup / scenario verification / performance
Objective:
- extract helpers where it reduces blast radius
- verify artifacts across multiple scenarios (single-area, multi-area, weak exemplar, no exemplar, multi-exemplar)
- do bounded performance cleanup only after truth surfaces and product payoff are stable

---

## 6. Explicit Figma phase brief

### Figma identity
The visual direction remains:

**Apple Orchard / teacher desk / classy scrapbook / warm storybook**

The product should feel:
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

It should feel like a **beautiful teacher planner / digital desk / guided storybook workspace**, not a corporate dashboard.

### Color direction
Keep the approved orchard palette family, but use the updated balance:
- more cranberry
- more blush
- green still meaningful
- less green dominance
- less sepia/brown heaviness
- cleaner cream and paper-white surfaces
- fresher, softer, more polished planner feel

### Core palette family
- Orchard Cream `#FFF6E9`
- Apple Blush `#F7D6D0`
- Warm Honey `#F2C078`
- Moss Green `#6E8B6B`
- Deep Orchard `#3F5A40`
- Paper White `#FFFFFF`
- Warm Gray `#E7E2DA`
- Text Charcoal `#2F2F2F`
- Muted Cranberry `#B8545A`

### Typography
Preferred pair:
- **Playfair Display** for headings
- **Inter** for body and UI

### Surface language
Use:
- orchard cream canvas
- paper-white cards
- warm-gray borders
- subtle paper/canvas texture
- soft shadows
- ribbon-led section hierarchy
- stitched/dashed details
- rounded paper-like cards and panels
- restrained botanical/orchard motifs

### Asset-exact rule
The design phase is **not** only a polish pass.

It must explicitly prepare:
- full mockups
- production asset map
- asset library
- production-ready decorative and structural assets where exact appearance matters

Guiding rule:
- **Use code for layout and behavior**
- **Use real assets where approximation would materially change the intended look**

### Figma deliverables
Figma should produce:
1. Foundation page (tokens, type, spacing, radii, shadows, texture, ribbons, badges, forms, cards)
2. Shared shell page (page headers, hero blocks, progress treatment, containers, section rhythm)
3. Full page sets for Inputs, Materials, Results, Preview/Teach mode
4. Production asset library (ribbons, stitched dividers, botanical accents, overlays, decorative supports)
5. Asset map labeling each important visual element as code-rendered, asset-rendered, or hybrid

---

## 7. Recommended execution sequence

**Stage 1: certify the closeout-ready product**
1. Fresh browser/export closeout proof
2. Teacher-facing coherence verification / cleanup
3. Results traceability wiring

**Stage 2: finish the deeper north-star product**
4. Exemplar payoff / deterministic shell mapping
5. Materials trust / continuity
6. Editable pre-generation analysis
7. AI seam hardening
8. Inputs simplification
9. Parsing and OCR quality work
10. Image-first curriculum PDF seam

**Stage 3: finish the visual system properly**
11. High-Fidelity Asset-Exact Visual Pass in Figma
12. Orchard implementation integration / polish
13. High-risk cleanup / performance / scenario verification

---

## 8. Done when

The project is fully done only when both conditions are true:

### A. Closeout lane certified
- fresh browser/export proof passes on the latest code
- no trust/export/continuity regressions remain

### B. North-star product materially proven
With real curriculum and exemplar inputs, the app can:
- preserve shell structure
- map grounded lesson content into those roles
- keep timers/routines/teacher moves intact
- surface what was grounded vs inferred/generated honestly
- produce strong default artifacts when no exemplar is provided
- present a final visual layer that feels polished, teacher-first, attractive, and unmistakably part of the orchard/storybook product system

---

## 9. Bottom-line continuation note

Nothing the user asked for should be treated as dropped.

The current repo should be carried forward as a **finish-and-trust plan**, not a rescue plan and not a broad expansion plan. The main correction to older roadmap versions is this:

**The design/Figma portion must now be treated as its own explicit high-fidelity asset-exact phase, not just generic visual polish.**

Everything else remains in the plan: closeout proof, teacher-facing coherence, Results traceability, exemplar payoff, Materials trust, editable analysis, AI hardening, Inputs wizard work, parsing/OCR/image-first PDF handling, and later bounded cleanup.
