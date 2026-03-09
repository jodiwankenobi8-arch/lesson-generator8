# Image-Aware Curriculum and Exemplar Ingestion Requirement

## Why this matters
Many elementary teaching materials are delivered as PPT/PDF slide decks where meaning is carried by:
- screenshots
- embedded images
- visible slide text
- anchor charts
- sample problems
- diagrams
- picture prompts
- labels and callouts
- pacing/timer cues
- teacher directions
- sequencing across slides

The current text-first extraction path can miss important instructional content when uploaded files are image-heavy.

## Scope
This requirement applies to both:
- curriculum files
- exemplar files

Both need multimodal analysis, but for different reasons.

## Curriculum purpose
Curriculum analysis should help the system understand:
- what to teach
- what concepts/skills are prioritized
- what examples/materials/tasks are emphasized
- what standards/objectives/success criteria are present
- what lesson content should shape slides, plan, centers, and assessment

## Exemplar purpose
Exemplar analysis should help the system understand:
- how to teach it
- lesson order and pacing
- instructional style
- teacher moves and transitions
- presentation flow
- cueing language
- slide function
- sequencing conventions
- the overall feel of the lesson

Exemplars are especially important when the goal is to generate a lesson in a similar:
- style
- order
- function
- pacing
- teacher-facing voice

## Desired behavior
When a user uploads curriculum or exemplar files, the system should:

1. read extractable text normally
2. inspect rendered slide/page images
3. detect visible text inside images
4. detect instructional visual content that shapes lesson design
5. merge both text-based and image-based findings into generation influence and traceability

## What should be detected from curriculum files
- lesson objectives
- I can statements
- success criteria
- standards references
- phonics patterns
- decodable examples
- comprehension prompts
- vocabulary cards
- anchor charts
- teacher directions
- slide titles
- worked examples
- picture cues that imply concept focus
- assessment tasks
- center/task language

## What should be detected from exemplar files
- lesson sequence/order
- slide progression
- teacher talk patterns
- timing/timer cues
- clicker/advance cues
- rotation wording
- launch/bridge/model/practice/close structure
- how objectives are presented
- how examples are modeled
- how transitions are handled
- how checks for understanding are phrased
- whether the lesson is teacher-led, hub-based, guidepost-style, or another recognizable pattern

## Expected product impact
This should improve:
- curriculum coverage extraction
- exemplar cue extraction
- blueprint influence quality
- lesson-topic accuracy
- mixed-topic detection
- style transfer from exemplars
- order/sequence quality
- teacher-note usefulness
- traceability shown on Results
- usefulness of PPT/PDF uploads for real classroom planning

## Key product distinction
Curriculum should mainly shape:
- content
- concepts
- examples
- tasks
- standards/objectives

Exemplars should mainly shape:
- style
- order
- function
- pacing
- lesson flow
- teacher moves

## QA symptom this explains
A PPTX may visibly influence generation while Results still says:
- no teacher-usable curriculum coverage items found
- curriculum items: 0
- presenter cues: 0

That inconsistency suggests the app is picking up some content, but not tracing image-heavy curriculum/exemplar files reliably.

## Future implementation direction
Potential implementation path:
- render PPT/PDF pages/slides to images
- run OCR / visible text extraction on rendered images
- detect slide titles, objectives, prompts, examples, and cue text
- optionally classify slide types and lesson roles
- merge findings with existing curriculum and exemplar extraction
- surface merged evidence in Results trace views

## Priority
High for personal classroom use.

## K-first note
This is especially important for Kindergarten because many K materials are highly visual, and exemplar style/order/function strongly affects whether the generated lesson feels truly usable.
