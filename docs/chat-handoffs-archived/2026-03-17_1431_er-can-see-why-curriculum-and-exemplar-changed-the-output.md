# lesson-generator8 chat handoff

* Date: 2026-03-17
* Repo: jodiwankenobi8-arch/lesson-generator8
* Chat purpose: Preserve a continuation-ready handoff based only on evidence pasted and discussed in this chat, including the app review framing and the pasted executive audit for lesson-generator8-hardened.

## Canonical project assumptions

* The product is a teacher-facing lesson package generator with a 3-step flow: Inputs -> Materials -> Results.
* The core product rule is: curriculum is content authority; exemplar is presentation authority.
* The intended users are teachers, especially elementary teachers needing usable lesson materials quickly.
* The project is expected to be blueprint-driven rather than a generic generator.
* Early elementary teacher-led lessons should force linear structure and teacher-led wording.
* Apple Orchard Storybook is the approved visual direction.
* The user prefers one Windows PowerShell paste at a time, low-friction workflow, immediate visible progress, preserved uploads across navigation, mixed lessons clarified before generation, fixes to real behavior rather than only smoke tests, and no repeated re-explaining of context.

## What was reviewed

* code files: not directly reviewed in-tool during this chat; file paths were referenced in pasted notes
* commits: none directly reviewed in this chat
* PRs: none directly reviewed in this chat
* issues: none directly reviewed in this chat
* terminal output: none reviewed in this chat
* pasted handoff notes: yes; the executive audit pasted in chat was the main evidence source

## Current state

The project has meaningful architecture in place: source-role modeling, blueprint differentiation, framework-aware generation, teacher-led override logic, export paths, and a Results hub. The tracked milestone behavior says output structure now varies based on curriculum and exemplar presence. The main unfinished promise is stronger content grounding: curriculum and exemplar should not only alter structure, but also materially shape lesson wording, slide text, center directions, rotations, exit ticket wording, and overall teacher-facing content. Upload/extraction reliability and Results traceability remain open risks.

## Decisions made

* Treat curriculum as content authority and exemplar as presentation authority.
* Treat the app as blueprint-driven, with blueprint selection upstream of final generation wording.
* Keep source-role taxonomy as curriculum, teachingTool, exemplar, and mixed.
* Use true exemplars for framework detection and allow mixed sources to contribute cues with lower confidence.
* Preserve the early-elementary teacher-led override to prevent self-guided hub behavior in K/1.
* Keep teacher cues more in notes than in main slide body text.
* Preserve Apple Orchard Storybook as the visual source of truth rather than reviving generic dashboard styling.
* Treat the user's workflow preferences as product requirements, not mere style preferences.

## Completed work

* In this chat, the app review request was distilled into a structured review prompt and then expanded using the pasted executive audit.
* A concise, continuation-ready product framing was established from the pasted notes.
* No repo changes, no direct code review, no direct commit review, and no direct issue or PR review were performed in this chat.

## Remaining work

* Make curriculum and exemplar influence final lesson content more deeply, not only structure.
* Strengthen Results traceability so the us* Resolve materials upload/extraction stalls after queue insertion.
* Improve mixed-target clarification behavior before generation.
* Reduce cases where exemplar over-influences structure or content.
* Finish export cleanup and encoding polish.
* Investigate and harden ZIP export runtime/import behavior.
* Expand testing beyond smoke coverage to verify meaningful structure and content variation.

## Next steps

1. Audit and harden the materials upload/extraction path so queue insertion reliably progresses to completed extraction.
2. Strengthen blueprint-to-generation grounding so curriculum materially shapes lesson wording, examples, and practice language.
3. Tighten exemplar influence so it affects pacing, teacher moves, and structure without overriding curriculum content authority.
4. Improve Results hub traceability to clearly explain source-role impact, framework choice, and output changes.
5. Add targeted tests for curriculum-only, exemplar-only, both, and neither cases, including content assertions rather than only page-load or export-trigger checks.
6. Clean up export text/encoding and then re-check ZIP export behavior under real preview/runtime conditions.
7. Continue using Apple Orchard Storybook as the visual source of truth while avoiding generic dashboard leftovers.

## Important evidence

* Referenced file paths from pasted notes:

  * src/pages/MaterialsPage.tsx
  * src/engine/blueprint/buildBlueprint.ts
  * src/engine/spec/buildLessonSpec.ts
  * src/engine/generateLesson.ts
  * src/pages/ResultsHubPage.tsx
* Referenced export-related files by description only:

  * exportLessonPlanDocx.ts
  * exportSlidesPptx.ts
* Version referenced in pasted notes:

  * 1.4.0
* SHAs: none referenced in this chat
* PRs: none referenced in this chat
* Commands: none referenced in this chat

## Risks / cautions

* Do not claim repo-wide review from this chat; the main evidence here was pasted handoff material, not direct repo inspection.
* Do not treat passing smoke tests as proof that the product behavior is correct.
* Do not bypass mixed-source clarification before generation.
* Do not let exemplar dominate curriculum-driven content authority.
* Do not revive older generic dashboard/theme leftovers over the Apple Orchard Storybook direction.
* Do not remove or weaken the early-elementary teacher-led safeguard.
* Do not frame the generator as complete while the core promise of curriculum-grounded content variation is still partial.

## Next action

Start the next chat from the blueprint-to-generation seam: verify how buildBlueprint outputs are consumed by generateLesson, then identify the minimum changes needed so curriculum affects final wording and lesson content more deeply while exemplar remains presentation authority.
