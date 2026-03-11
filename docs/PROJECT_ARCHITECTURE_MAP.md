# PROJECT_ARCHITECTURE_MAP

## Goal
This file describes the intended full structure of lesson-generator8 so future work can rebuild the real product safely from the working baseline.

## Core app flow
Inputs -> Materials -> Results

## Root
- README.md
- package.json
- tsconfig.json
- vite.config.ts
- index.html

## Docs
- docs/LESSON_GENERATOR8_EXECUTIVE_HANDOFF.md
- docs/PROJECT_ARCHITECTURE_MAP.md
- docs/design/DESIGN_SUMMARY.md
- docs/design/MASTER_DESIGN_BIBLE.md
- docs/design/UI_IMPLEMENTATION_SPEC.md

## Scripts
- scripts/windows-setup-and-verify.ps1

## Source
- src/main.tsx
- src/App.tsx

## Pages
- src/pages/InputsPage.tsx
- src/pages/MaterialsPage.tsx
- src/pages/ResultsHubPage.tsx
- src/pages/BlueprintPage.tsx
- src/pages/WizardProgress.tsx
- src/pages/orchardUi.ts
- src/pages/orchardDecor.tsx

## State
- src/state/useLessonStore.ts

## Engine
- src/engine/types.ts
- src/engine/generateLesson.ts

## Blueprint
- src/engine/blueprint/buildBlueprint.ts
- src/engine/blueprint/types.ts

## Spec
- src/engine/spec/buildLessonSpec.ts

## Generation helpers
- src/engine/generation/slides.ts
- src/engine/generation/lessonPlan.ts
- src/engine/generation/centers.ts
- src/engine/generation/rotationPlan.ts
- src/engine/generation/interventions.ts

## Standards
- src/engine/standards/detectKelaBest.ts

## Utilities
- src/utils/readUploadedText.ts
- src/utils/extractLessonMaterialSources.ts

## Product rules
- Curriculum = content authority
- Exemplar = presentation authority
- Mixed sources require clarification
- Kindergarten ELA is current release scope
- Keep changes small and focused

## Rebuild priority
1. App shell and routing
2. Inputs page
3. Materials page
4. Results page
5. Blueprint engine
6. Lesson spec
7. Generation helpers
8. Export system
9. Polish and traceability
