# Lesson Generator 8 — checkpoint for next chat

## Repo
- Repo: jodiwankenobi8-arch/lesson-generator8
- Branch: work/canonical-project-consolidation
- HEAD at handoff creation: 490fed9 refactor: clarify intervention support labels

## What is done
- Step 4A package narrative / export contract alignment landed and was pushed
- official design authority file was restored and pushed
- ready-vs-usable wording cleanup landed and was pushed
- intervention support label cleanup landed and was pushed

## Latest verification
- targeted package tests passed for Step 4A
- targeted Results/App tests passed for wording cleanup
- typecheck passed on the latest wording seams
- repo-wide stale-wording sweep only found current intended strings:
  - Ready files:
  - Intervention Support

## Current truth to preserve
- curriculum = content authority
- exemplar = presentation / structure authority
- centers = student-independent work
- small group / intervention = teacher-led support
- optional lesson parts and outputs should not quietly appear by default
- ready = pipeline/readiness state
- usable = grounded-generation trust state

## Known non-blocking warning
- SSR-style useLayoutEffect warnings still appear in route tests, but targeted suites pass

## Best next move
- inspect the next smallest live seam from current repo state
- stay inspect-first
- do not reopen finished seams without proof

## Read first in the next chat
1. AGENTS.md
2. START_HERE_CURRENT_TRUTH.md
3. PROJECT_CURRENT_STATE.md
4. this file