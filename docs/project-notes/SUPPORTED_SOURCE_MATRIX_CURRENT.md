# Supported source matrix — current live contract

Status:
- current intake is upload-file based
- broader intake expansion is not locked yet
- do not imply screenshots, links, photos, or OCR-heavy mixed sources are first-class until that work is explicitly landed

## Current supported source intake

Entry point:
- Materials page upload flow

Supported file types:
- `.txt`
- `.pdf`
- `.docx`
- `.pptx`
- `.html`
- `.htm`

Lane roles:
- curriculum = content authority
- exemplar = presentation / structure authority

Trust rule:
- generation depends on usable materials, not merely ready materials
- OCR exists only as a bounded recovery path inside the current extraction flow

## Not yet first-class

These should be treated as future-expansion ideas, not current product promises:
- screenshots / images as primary intake
- worksheet photos
- web links / URLs
- pasted text as a separate lane
- audio / video sources
- multi-provider OCR orchestration
- AI-first intake interpretation

## Finish recommendation

Before broader intake is expanded, keep the product contract explicit:
- upload-file intake is the current truth
- broader source expansion should land only with an explicit source matrix, trust behavior, and validation plan
