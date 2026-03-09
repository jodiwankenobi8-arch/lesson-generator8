# Lesson Generator 8 - QA Checklist

_Last updated: 

## Current branch
- feat/hardened-pass5-runtime-and-polish-fastfix-phase1-reconcile-phase2-context-phase3-split-phase4-qa

## Completed engineering phases
- [x] Phase 1 - reconcile hardening/polish work into runnable branch
- [x] Phase 2 - centralize lesson context
- [x] Phase 3 - split lesson generation into focused modules

## Manual QA matrix

### Input combinations
- [ ] No uploads
- [ ] Curriculum only
- [ ] Exemplar only
- [ ] Curriculum + exemplar

### Grade / framework coverage
- [ ] Kindergarten lesson stays teacher-led / linear
- [ ] Grade 1 lesson stays teacher-led / linear
- [ ] Grade 2+ lesson can remain non-linear when blueprint says clickableHub
- [ ] Guidepost lesson preserves bridge / connection behavior
- [ ] Essential question survives blueprint -> spec -> generated slides

### Curriculum / exemplar influence
- [ ] Curriculum checklist items visibly affect slide bullets
- [ ] Curriculum checklist items affect lesson plan wording
- [ ] Curriculum checklist items affect centers wording
- [ ] Exemplar cues affect teacher notes
- [ ] Exemplar cues affect rotation wording when applicable

### Fallback / resilience
- [ ] Low-text or fallback curriculum file does not create junk checklist items
- [ ] Saved blueprint recovery works
- [ ] No standards case renders safely
- [ ] No slides case renders safely
- [ ] No lesson plan case renders safely

### Export paths
- [ ] PPTX export works
- [ ] DOCX export works
- [ ] ZIP export works
- [ ] Export error state remains readable and non-breaking

## Release readiness checks
- [ ] npm run build passes
- [ ] No obvious TypeScript/runtime regression in browser
- [ ] Results Hub labels are teacher-facing
- [ ] Trace / blueprint detail stays secondary to teacher-facing content
- [ ] Branch pushed to GitHub
- [ ] PR opened
- [ ] Reviewer notes added

## Suggested smoke-test lesson set
1. K ELA phonics lesson with no uploads
2. Grade 1 ELA lesson with curriculum only
3. Grade 2 ELA lesson with exemplar only
4. Grade 3 lesson with curriculum + exemplar
5. One low-text / fallback upload case
6. One saved package recovery case

## Final go / no-go
- [ ] GO
- [ ] NO-GO