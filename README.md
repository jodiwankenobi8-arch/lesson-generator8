# Lesson Generator

A private instructional production engine for generating complete lesson packages.

## Overview

Lesson Generator converts structured lesson inputs into a fully packaged instructional set:

- Student-facing slide deck
- Detailed teacher lesson plan (slide-aligned)
- Centers + rotation plan
- Tier 3, Tier 2, and Enrichment suggestions
- Export-ready files (coming next phase)

This is a single-teacher productivity tool.
Not SaaS. Not multi-user.

---

## Current Architecture (v1 – March 2026)

### Tech Stack

- React
- Vite
- TypeScript
- Zustand (state management)
- React Router

### Core Engine

The application revolves around a single data object:

LessonPackage

It contains:

- Input metadata
- Detected standards
- Slides
- Lesson plan sections
- Centers
- Rotation plan
- Interventions

Generation is deterministic and stable.

---

## Workflow

1. Inputs Page
2. Generate LessonPackage
3. Results Hub
4. Export (next phase)

---

## Development

Install dependencies:

npm install

Run dev server (Windows):

npx vite --host 127.0.0.1 --port 5173

Open:

http://127.0.0.1:5173

---

## Next Milestones

- PPTX export (pptxgenjs)
- DOCX export (docx)
- ZIP full export
- Florida B.E.S.T standards dataset integration
- UI refinement

---

## Status

Engine: Complete  
Routing: Complete  
UI (v1 skeleton): Complete  
Exports: In Progress  
Standards dataset: Pending integration  

---

Built March 2026
