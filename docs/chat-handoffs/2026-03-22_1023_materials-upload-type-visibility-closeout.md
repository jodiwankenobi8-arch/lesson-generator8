# Materials upload-type visibility closeout

## Repo checkpoint
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: main
- Local HEAD during closeout: d8fafad
- origin/main during closeout: d8fafad

## What changed
- Landed the narrow Materials upload-type visibility seam on current main
- Updated the Materials intro copy so supported source files are explicit
- Added aligned accept values to both curriculum and exemplar upload inputs
- Refreshed START_HERE_CURRENT_TRUTH.md to current main truth
- Refreshed PROJECT_CURRENT_STATE.md to current main truth
- Added this handoff as the single current seam closeout note

## Files involved
- src/pages/MaterialsPage.tsx
- START_HERE_CURRENT_TRUTH.md
- PROJECT_CURRENT_STATE.md
- docs\chat-handoffs\2026-03-22_1023_materials-upload-type-visibility-closeout.md

## Verified
- MaterialsPage.tsx now says supported source files are .txt, .pdf, .docx, .pptx, .html, and .htm
- Both Materials upload inputs now use accept=".txt,.pdf,.docx,.pptx,.html,.htm"
- npm run typecheck passed after the Materials seam edit

## What is now current
- Current active branch is main, not work/canonical-project-consolidation
- The older 04a9b08 continuation docs are now historical
- The upload-type visibility seam should be treated as locally landed and closed unless live regression evidence appears

## Recommended next move
- Commit and push the Materials upload-type visibility seam together with this docs refresh
- Then do one inspect-first current-main review to choose the next narrow finishing seam
- Do not assume older handoffs are current if they still launch from work/canonical-project-consolidation
