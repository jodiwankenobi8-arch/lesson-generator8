# Manual Validation — Science Cross-Subject Proof

Date: 2026-05-03  
Flow: Cross-subject Science validation  
Dev URL used: http://127.0.0.1:4175/

## Purpose

Confirm that Lesson Generator 8 can generate a non-ELA / non-phonics lesson using Science curriculum content and a Science-oriented exemplar structure without drifting into phonics, decoding, CVCe, or word-study language.

## Scenario

Inputs used:

- Grade: 4
- Subject: Science
- Skill / focus: Compare animal adaptations
- Topic / text / unit: Wetland animal adaptations
- Duration: 40 minutes
- Outputs selected: lesson plan, slides, printables

## Curriculum source

File: science-curriculum-adaptations.txt

Content included:

- Topic: Animal adaptations in wetland habitats
- Vocabulary: adaptation, habitat, camouflage, beak, webbed feet
- Text/content about ducks, herons, body parts, behaviors, survival, and camouflage
- Practice: compare examples and non-examples of adaptations
- Assessment: explain one adaptation using evidence

## Exemplar source

File: science-exemplar-flow.txt

Content included:

- Objective / Opening
- Anchor Chart / Model
- Example / Non-Example
- Partner practice with sentence frames
- Table / Sort
- Closure / Quick Check

## Result

PASS.

## Confirmed behavior

- Inputs were set to Grade 4 Science.
- Outputs were selected: lesson plan, slides, printables.
- Science curriculum and Science exemplar sources were uploaded.
- Materials review requirements were completed, including standards and practice-task confirmation.
- Generation succeeded.
- Results source language was correct:
  - Content comes from curriculum materials.
  - Structure comes from exemplar materials.
- Results showed all expected exports:
  - Lesson plan export
  - Slides export
  - Printables export
  - Package ZIP
- Content used Science language:
  - adaptation
  - habitat
  - camouflage
  - beak
  - webbed feet
  - wetland animals
- Structure reflected the exemplar flow:
  - Anchor Chart / Model
  - Example / Non-Example
  - Table / Sort
  - Closure / Quick Check

## Fail conditions checked

No fail conditions were observed.

Specifically:

- No drift into phonics, decoding, long-a, CVCe, or ELA-only language.
- Science vocabulary was not treated as phonics word-study content.
- Exemplar shell was not ignored.
- Printables and package ZIP did not disappear or contradict Results.

## Important observation

The run exposed a workflow risk: previous ELA/phonics materials, confirmed standards, and draft-review fields were still present from an earlier validation flow and had to be manually removed or overwritten before the Science proof was valid.

This may be expected persistence behavior, but it should be validated next as a “new lesson / reset stale-state” workflow.

## Conclusion

Science cross-subject generation is browser-proven for this flow after cleaning stale prior-state data. No generation patch is needed from this proof. The next recommended validation seam is new-lesson/reset behavior.
