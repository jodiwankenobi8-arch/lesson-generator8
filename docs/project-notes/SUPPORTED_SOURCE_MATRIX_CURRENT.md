# SUPPORTED_SOURCE_MATRIX_CURRENT

## Purpose
This file is the teacher-facing and continuation-facing source-intake truth for the current repo state.
Use it to keep docs, UI copy, and tests aligned.

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- generation depends on usable materials, not merely uploaded or ready materials
- screenshot/photo uploads are a bounded OCR recovery lane
- do not overclaim links or URLs as first-class intake

## Current intake model
Current intake is upload-based.
The app currently works from uploaded source materials, not link-first retrieval.

## Supported now

### Curriculum lane
Use for standards, texts, word lists, practice tasks, examples, and instructional targets.

Supported upload types now:
- `.txt`
- `.pdf`
- `.docx`
- `.pptx`
- `.html`
- `.htm`
- `.png`
- `.jpg`
- `.jpeg`
- `.webp`

Lane truth:
- curriculum remains the content authority
- image uploads can help recover text when needed
- screenshots/photos should not outrank stronger curriculum documents when stronger content sources exist

### Exemplar lane
Use for slide flow, pacing, prompts, layout cues, teacher moves, and reusable structure.

Supported upload types now:
- `.txt`
- `.pdf`
- `.docx`
- `.pptx`
- `.html`
- `.htm`
- `.png`
- `.jpg`
- `.jpeg`
- `.webp`

Lane truth:
- exemplar remains the presentation / structure authority
- image uploads can help recover layout/prompt clues when needed
- screenshots/photos are still a bounded OCR recovery lane, not stronger authority than a clearer exemplar deck or document

## Bounded OCR recovery lane
Image uploads are supported for bounded OCR recovery.
That means:
- they are allowed
- they can contribute extracted text/provenance when readable
- they are useful when a teacher only has screenshots or photos
- they should not be described as the preferred or primary intake path when better document sources are available

## Not first-class today
Do not claim these as first-class intake in UI or docs:
- raw links / URLs as a primary source lane
- website crawling
- screenshot/photo-only workflows as the ideal teacher path
- broad mixed-source retrieval outside upload-based intake

## Safe teacher-facing wording
Prefer wording like:
- source materials
- uploads
- curriculum materials
- exemplar materials
- bounded OCR recovery for screenshots/photos when needed
- generate only from usable curriculum and exemplar materials

Avoid wording like:
- links are fully supported as source intake
- screenshots/photos are the primary intake model
- any uploaded image is automatically strong authority