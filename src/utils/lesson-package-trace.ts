import type {
  ExtractionConfidence,
  ExtractionWarning,
  LessonMaterial,
  PackageTrace,
  SourceKind,
  TraceInfluence,
} from '../types/lesson-package'

export function makeTraceInfluence(input: {
  sourceId: string
  sourceName: string
  sourceKind?: SourceKind
  note?: string
  confidence?: ExtractionConfidence
}): TraceInfluence {
  return {
    sourceId: input.sourceId,
    sourceName: input.sourceName,
    sourceKind: input.sourceKind ?? 'unknown',
    note: input.note ?? '',
    confidence: input.confidence ?? 'unknown',
  }
}

export function makeExtractionWarning(code: string, message: string): ExtractionWarning {
  return { code, message }
}

export function buildTraceFromMaterials(materials: LessonMaterial[]): PackageTrace {
  return {
    standardsSource: [],
    curriculumInfluence: materials
      .filter((m) => m.sourceKind === 'curriculum' && m.influencedGeneration)
      .map((m) =>
        makeTraceInfluence({
          sourceId: m.id,
          sourceName: m.name,
          sourceKind: m.sourceKind,
          confidence: m.confidence,
          note: 'Curriculum source influenced generation.',
        }),
      ),
    exemplarInfluence: materials
      .filter((m) => m.sourceKind === 'exemplar' && m.influencedGeneration)
      .map((m) =>
        makeTraceInfluence({
          sourceId: m.id,
          sourceName: m.name,
          sourceKind: m.sourceKind,
          confidence: m.confidence,
          note: 'Exemplar source influenced generation.',
        }),
      ),
    extractionWarnings: materials.flatMap((m) => m.warnings),
    unresolvedConflicts: [],
    manualOverrides: [],
  }
}
