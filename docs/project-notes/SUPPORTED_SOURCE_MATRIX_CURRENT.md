# Supported source matrix â€” current live contract

Status:
- current intake is upload based through the Materials page
- current uploaded source formats include text/docs and image uploads
- broader intake expansion is not locked yet
- do not imply web links / URLs or pasted text as separate first-class Materials-page lanes until that UI work is explicitly landed
- do not imply screenshots / photos are equal to clean parser-first text sources; image uploads currently depend on bounded OCR recovery and may still be caution-scored or blocked

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
- `.png`
- `.jpg`
- `.jpeg`
- `.webp`

Lane roles:
- curriculum = content authority
- exemplar = presentation / structure authority

Trust rule:
- generation depends on usable materials, not merely ready materials
- parser-first document extraction remains the primary path for `.txt`, `.pdf`, `.docx`, `.pptx`, `.html`, and `.htm`
- screenshots / photos are supported as uploaded image sources through bounded OCR recovery
- image uploads stay visible for the teacher, but they should not steer lesson generation until OCR recovers readable text strongly enough to be usable
- OCR exists only as a bounded recovery path inside the current extraction flow

## Not yet first-class

These should be treated as future-expansion ideas, not current product promises:
- web links / URLs as a Materials-page source lane
- pasted text as a separate Materials-page lane
- audio / video sources
- multi-provider OCR orchestration
- AI-first intake interpretation

## Teacher-facing wording guardrails

- say `upload-based intake` rather than implying broad multi-source intake
- say `screenshots / photos are supported through bounded OCR` rather than implying guaranteed grounding quality
- keep curriculum and exemplar authority roles explicit
- keep `usable materials` language explicit whenever generation gating is described

## Finish recommendation

Before broader intake is expanded, keep the product contract explicit:
- upload-based intake is the current truth
- image uploads are supported, but only through bounded OCR recovery and trust scoring
- broader source expansion should land only with an explicit source matrix, trust behavior, and validation plan