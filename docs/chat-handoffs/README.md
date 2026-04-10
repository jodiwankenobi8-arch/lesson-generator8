# Chat handoffs

Store one markdown handoff per important chat here.

## Filename format

YYYY-MM-DD_HHMM_<short-slug>.md

Example:
2026-03-17_1315_results-seam-cluster.md

## Required sections

- Title
- Date
- Chat purpose
- Repo / branch context
- What was reviewed
- Current state
- Decisions made
- Open questions / unresolved seams
- Exact next steps
- Commands / files / SHAs mentioned
- Risks / cautions
- Product charter / authority model changes when a chat materially changes continuation truth

## Rules

- Prefer facts over narrative.
- Distinguish verified facts from assumptions.
- Include commit SHAs and file paths when known.
- Keep recommendations concrete.
- End with a short "Next action" section.
- If a chat materially changes the product charter, authority model, exemplar model, or default operating mode, record that near the top instead of burying it in implementation notes.
- Do not let older handoffs override the current canonical truth chain without fresh evidence.