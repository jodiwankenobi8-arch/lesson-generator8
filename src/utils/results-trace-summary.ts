import type { LessonPackage } from '../types/lesson-package'

export type ResultsTraceSummaryItem = {
  label: string
  value: string
  tone: 'neutral' | 'good' | 'warn'
}

export function buildResultsTraceSummary(pkg: LessonPackage): ResultsTraceSummaryItem[] {
  const warnings = pkg.trace.extractionWarnings.length
  const standards = pkg.standards.length
  const curriculum = pkg.trace.curriculumInfluence.length
  const exemplars = pkg.trace.exemplarInfluence.length
  const conflicts = pkg.trace.unresolvedConflicts.length

  return [
    {
      label: 'Standards',
      value: standards > 0 ? ${standards} detected : 'None detected',
      tone: standards > 0 ? 'good' : 'warn',
    },
    {
      label: 'Curriculum influence',
      value: curriculum > 0 ? ${curriculum} source(s) : 'No curriculum influence logged',
      tone: curriculum > 0 ? 'good' : 'neutral',
    },
    {
      label: 'Exemplar influence',
      value: exemplars > 0 ? ${exemplars} source(s) : 'No exemplar influence logged',
      tone: exemplars > 0 ? 'good' : 'neutral',
    },
    {
      label: 'Extraction warnings',
      value: warnings > 0 ? ${warnings} warning(s) : 'No warnings',
      tone: warnings > 0 ? 'warn' : 'good',
    },
    {
      label: 'Conflicts',
      value: conflicts > 0 ? ${conflicts} unresolved : 'No unresolved conflicts',
      tone: conflicts > 0 ? 'warn' : 'good',
    },
  ]
}
