# LESSON_GENERATOR8_EXECUTIVE_HANDOFF

## Project
lesson-generator8-hardened

Teacher-facing lesson package generator for K–2 ELA (starting with Kindergarten).

Core rule:
Curriculum = content authority  
Exemplar = presentation authority

Pipeline:
Inputs ? Materials ? Results

Engine pipeline:
Inputs + Materials ? Blueprint ? Lesson Spec ? Lesson Package

Outputs:
- Slides
- Lesson plan
- Centers
- Rotation plan
- Interventions
- Printables
- Exports

Core stack:
React + TypeScript + Vite + Zustand + React Router

Current baseline structure:

lesson-generator8
docs
scripts
src
  engine
    generateLesson.ts
    types.ts
  pages
  state
    useLessonStore.ts
  main.tsx
index.html
package.json
tsconfig.json
vite.config.ts
README.md

Development rules:
- Small focused commits
- One change at a time
- Test after each change
- Stabilize K ELA before expanding scope

Status:
Baseline rebuilt
TypeScript compiling
Vite build successful
Project runs locally

Next systems to restore:
InputsPage
MaterialsPage
ResultsHubPage
Lesson blueprint engine
