# Mixed Input Handling Rule

## Problem
Sometimes lesson inputs, standards, and uploaded materials point to two different instructional targets.
Example:
- phonics target in lesson title/objective/standards
- comprehension target in curriculum text/materials

## Desired behavior
When the system detects a likely mismatch between standards/topics/materials, it should not silently force a single lesson shape.

## Preferred UX
Ask the user to choose:

1. Combine into a two-part lesson
2. Fix a likely mix-up in standards/topics/materials

## Combination guidance
If the user chooses combine, prefer a two-part lesson.
For early elementary mixed cases, default to:
- Part 1: phonics
- Part 2: comprehension

## Decision rule
- If inputs are aligned, generate normally.
- If there is a low-confidence mismatch, ask the user whether to combine or correct.
- If there is a strong intentional blend, offer a combined two-part lesson.
- If there is an early-elementary phonics + comprehension mix, suggest a two-part lesson first.

## QA note
A result where curriculum wording appears but the core lesson remains on a different target should be treated as:
- acceptable only if the user intentionally wants a combined lesson
- otherwise a mismatch that should trigger the choice flow above
