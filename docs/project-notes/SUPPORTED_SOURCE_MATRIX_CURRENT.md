# SUPPORTED_SOURCE_MATRIX_CURRENT

## Purpose
This file is the teacher-facing and continuation-facing source-intake truth for the current repo state.
Use it to keep docs, UI copy, and tests aligned.
Code-level extension/accept-string authority and teacher-facing Inputs/Materials wording authority live in `src/engine/materials/sourceIntakeContract.ts`.

## Product truths to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- generation depends on usable materials, not merely uploaded or ready materials
- screenshot/photo uploads are a bounded OCR recovery lane
- do not overclaim links or URLs as first-class intake

## Current intake model
Current intake is upload-based.
The app currently works from uploaded source materials, not link-first retrieval.

Both curriculum and exemplar lanes currently accept the same source categories:
- document uploads: `.txt`, `.pdf`, `.docx`, `.pptx`, `.html`, and `.htm`
- screenshot/photo uploads: `.png`, `.jpg`, `.jpeg`, and `.webp`

Only those listed screenshot/photo formats are intentionally routed into the OCR lane today.

The difference between the two lanes is source authority, not file-type support.

## Lane truth

### Curriculum lane
Use for standards, texts, word lists, practice tasks, examples, and instructional targets.

Lane truth:
- curriculum remains the content authority
- document uploads are the primary intake path when they are available
- screenshots/photos can help recover text when needed, but they are still a bounded OCR recovery lane
- screenshots/photos should not outrank stronger curriculum documents when stronger content sources exist

### Exemplar lane
Use for slide flow, pacing, prompts, layout cues, teacher moves, and reusable structure.

Lane truth:
- exemplar remains the presentation / structure authority
- document uploads are the primary intake path when they are available
- screenshots/photos can help recover layout and prompt clues when needed, but they are still a bounded OCR recovery lane
- screenshots/photos are not stronger authority than a clearer exemplar deck or document

## Bounded OCR recovery lane
Image uploads are supported for bounded OCR recovery.
That means:
- they are allowed
- they can contribute extracted text and provenance when readable
- they are useful when a teacher only has screenshots or photos
- they should not be described as the preferred or primary intake path when better document sources are available
- they may still be caution-scored or blocked until readable text is recovered strongly enough to be usable

## Not first-class today
Do not claim these as first-class intake in UI or docs:
- raw links / URLs as a primary source lane
- website crawling
- pasted text as a first-class Materials-page upload lane
- screenshot/photo-only workflows as the ideal teacher path
- broad mixed-source retrieval outside upload-based intake

## Current UI wording lock
Teacher-facing page wording now stays aligned from the code-level contract in `src/engine/materials/sourceIntakeContract.ts`.

Inputs wording:
> Current intake on Materials is upload based. Materials currently accepts document uploads (.txt, .pdf, .docx, .pptx, .html, and .htm) plus screenshots/photos (.png, .jpg, .jpeg, and .webp) as a bounded OCR recovery lane when needed. Links and URLs are not a first-class Materials source lane.

Materials wording:
> Current teacher-facing intake is upload based. Upload documents (.txt, .pdf, .docx, .pptx, .html, and .htm) or screenshots/photos (.png, .jpg, .jpeg, and .webp). Screenshots and photos are a bounded OCR recovery lane, not the primary intake path, and may still be caution-scored or blocked until readable text is recovered strongly enough to be usable. Pasted text exists in the extraction seam, but it is not a first-class Materials-page upload lane here. Add sources here, then generate only from usable curriculum and exemplar sources.

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
