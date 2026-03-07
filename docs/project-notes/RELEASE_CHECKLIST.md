# Release Checklist

Use this before calling a snapshot production-ready.

## Code health
- [ ] `npm ci`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm run test:smoke`
- [ ] confirm no local-only artifacts were reintroduced into `src/`

## Product flow
- [ ] Inputs page loads with no console errors
- [ ] Materials page accepts text files and shows influence summary
- [ ] Blueprint page builds from current workspace
- [ ] Results page renders from a generated package
- [ ] PPTX export works
- [ ] DOCX export works
- [ ] ZIP export works

## UX quality
- [ ] keyboard focus visible on buttons, links, and fields
- [ ] empty states read clearly
- [ ] error states show clear recovery guidance
- [ ] route transitions show loading fallback
- [ ] mobile layout checked on the three core pages

## Repository hygiene
- [ ] changelog updated
- [ ] production status tracker updated
- [ ] legacy code archived outside `src/`
- [ ] backup zips and local review artifacts not committed

## GitHub release prep
- [ ] push hardened snapshot to a dedicated release branch
- [ ] verify GitHub Actions CI passes
- [ ] tag release candidate
- [ ] merge only after smoke checks pass
