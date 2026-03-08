import {
  createEmptyLessonPackage,
  type ExtractionConfidence,
  type ExtractionWarning,
  type LessonMaterial,
  type LessonPackage,
  type StandardRecord,
  type TraceInfluence,
} from '../types/lesson-package'
import { buildTraceFromMaterials, makeExtractionWarning, makeTraceInfluence } from './lesson-package-trace'

type AnyRecord = Record<string, unknown>

function asRecord(value: unknown): AnyRecord {
  return value && typeof value === 'object' ? (value as AnyRecord) : {}
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []
}

function inferConfidence(value: unknown): ExtractionConfidence {
  if (value === 'high' || value === 'medium' || value === 'low' || value === 'unknown') return value
  if (typeof value === 'number' && Number.isFinite(value)) {
    if (value >= 0.85) return 'high'
    if (value >= 0.55) return 'medium'
    if (value > 0) return 'low'
  }
  return 'unknown'
}

function normalizeSourceKind(value: unknown): LessonMaterial['sourceKind'] {
  if (
    value === 'curriculum' ||
    value === 'exemplar' ||
    value === 'reference' ||
    value === 'student-material' ||
    value === 'teacher-note'
  ) {
    return value
  }
  return 'unknown'
}

function normalizeExtractionKind(value: unknown): LessonMaterial['extractionKind'] {
  if (
    value === 'txt' ||
    value === 'md' ||
    value === 'docx' ||
    value === 'pdf' ||
    value === 'pptx' ||
    value === 'image'
  ) {
    return value
  }
  return 'unknown'
}

function normalizeStandardSource(value: unknown, overridden?: unknown): StandardRecord['source'] {
  if (value === 'detected' || value === 'manual' || value === 'curriculum-derived') {
    return value
  }
  if (overridden === true) return 'manual'
  return 'detected'
}

function normalizeWarnings(raw: unknown): ExtractionWarning[] {
  if (!Array.isArray(raw)) return []

  return raw.map((w, wIndex) => {
    const warningRec = asRecord(w)
    return makeExtractionWarning(
      asString(warningRec.code, `warning_${wIndex + 1}`),
      asString(warningRec.message, 'Unknown extraction warning'),
    )
  })
}

function normalizeMaterials(raw: unknown): LessonMaterial[] {
  if (!Array.isArray(raw)) return []

  return raw.map((item, index) => {
    const rec = asRecord(item)
    return {
      id: asString(rec.id, `material_${index + 1}`),
      name: asString(rec.name, asString(rec.fileName, `Material ${index + 1}`)),
      sourceKind: normalizeSourceKind(rec.sourceKind),
      extractionKind: normalizeExtractionKind(rec.extractionKind),
      extractedText: asString(rec.extractedText, asString(rec.text)),
      confidence: inferConfidence(rec.confidence),
      warnings: normalizeWarnings(rec.warnings),
      metadata: asRecord(rec.metadata),
      influencedBlueprint: Boolean(rec.influencedBlueprint),
      influencedGeneration: Boolean(rec.influencedGeneration),
    }
  })
}

function normalizeStandards(raw: unknown): StandardRecord[] {
  if (!Array.isArray(raw)) return []

  return raw
    .map((item) => {
      const rec = asRecord(item)
      return {
        code: asString(rec.code),
        description: asString(rec.description),
        source: normalizeStandardSource(rec.source, rec.overridden),
        confidence: inferConfidence(rec.confidence),
      }
    })
    .filter((s) => s.code.length > 0)
}

function slideContentFromRecord(rec: AnyRecord): string {
  const content = asString(rec.content)
  if (content) return content

  const body = asString(rec.body)
  if (body) return body

  const text = asString(rec.text)
  if (text) return text

  const bullets = Array.isArray(rec.bullets)
    ? rec.bullets.filter((v): v is string => typeof v === 'string')
    : []

  return bullets.join('\n')
}

function normalizeSlides(raw: unknown): LessonPackage['slides'] {
  if (!Array.isArray(raw)) return []

  return raw.map((item, index) => {
    const rec = asRecord(item)
    return {
      id: asString(rec.id, `slide_${index + 1}`),
      title: asString(rec.title, `Slide ${index + 1}`),
      content: slideContentFromRecord(rec),
      notes: asString(rec.notes, asString(rec.teacherNotes)),
    }
  })
}

function normalizeLessonPlan(raw: unknown): LessonPackage['lessonPlan'] {
  if (Array.isArray(raw)) {
    return {
      blocks: raw.map((item, index) => {
        const block = asRecord(item)
        return {
          title: asString(block.title, asString(block.heading, `Block ${index + 1}`)),
          text: asString(block.text, asString(block.description, asString(block.content))),
          durationMinutes:
            typeof block.durationMinutes === 'number' && Number.isFinite(block.durationMinutes)
              ? block.durationMinutes
              : undefined,
        }
      }),
    }
  }

  const rec = asRecord(raw)
  const blocksRaw = Array.isArray(rec.blocks) ? rec.blocks : []

  return {
    blocks: blocksRaw.map((item, index) => {
      const block = asRecord(item)
      return {
        title: asString(block.title, `Block ${index + 1}`),
        text: asString(block.text, asString(block.content)),
        durationMinutes:
          typeof block.durationMinutes === 'number' && Number.isFinite(block.durationMinutes)
            ? block.durationMinutes
            : undefined,
      }
    }),
  }
}

function normalizeBlueprint(raw: unknown, input: AnyRecord): LessonPackage['blueprint'] {
  const rec = asRecord(raw)

  return {
    summary: asString(rec.summary),
    essentialQuestion: asString(rec.essentialQuestion, asString(input.essentialQuestion)),
    learningTargets:
      asStringArray(rec.learningTargets).length > 0
        ? asStringArray(rec.learningTargets)
        : [asString(input.objective)].filter(Boolean),
    vocabulary: asStringArray(rec.vocabulary),
    sequence: asStringArray(rec.sequence),
  }
}

function normalizeTraceInfluences(raw: unknown): TraceInfluence[] {
  if (!Array.isArray(raw)) return []

  return raw.map((item, index) => {
    const rec = asRecord(item)
    return makeTraceInfluence({
      sourceId: asString(rec.sourceId, `trace_${index + 1}`),
      sourceName: asString(rec.sourceName, `Trace ${index + 1}`),
      sourceKind: normalizeSourceKind(rec.sourceKind),
      note: asString(rec.note),
      confidence: inferConfidence(rec.confidence),
    })
  })
}

function deriveStandardsSource(input: AnyRecord, standards: StandardRecord[]): TraceInfluence[] {
  const manualOverrideCodes = Array.isArray(input.manualStandardOverride)
    ? input.manualStandardOverride.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
    : []

  if (manualOverrideCodes.length > 0) {
    return [
      makeTraceInfluence({
        sourceId: 'manual_override',
        sourceName: 'Manual standard override',
        sourceKind: 'teacher-note',
        note: `Manual override codes: ${manualOverrideCodes.join(', ')}`,
        confidence: 'unknown',
      }),
    ]
  }

  if (standards.length > 0) {
    return [
      makeTraceInfluence({
        sourceId: 'lesson_input_detection',
        sourceName: 'Lesson input fields',
        sourceKind: 'teacher-note',
        note: 'Standards were detected from lesson title, objective, essential question, text/topic, and materials.',
        confidence: standards[0].confidence,
      }),
    ]
  }

  return []
}

function buildCanonicalTrace(rawTrace: unknown, materials: LessonMaterial[], input: AnyRecord, standards: StandardRecord[]) {
  const rec = asRecord(rawTrace)
  const derived = buildTraceFromMaterials(materials)

  const standardsSource = normalizeTraceInfluences(rec.standardsSource)
  const curriculumInfluence = normalizeTraceInfluences(rec.curriculumInfluence)
  const exemplarInfluence = normalizeTraceInfluences(rec.exemplarInfluence)
  const extractionWarnings = normalizeWarnings(rec.extractionWarnings)
  const unresolvedConflicts = asStringArray(rec.unresolvedConflicts)

  const manualOverrides =
    asStringArray(rec.manualOverrides).length > 0
      ? asStringArray(rec.manualOverrides)
      : Array.isArray(input.manualStandardOverride)
        ? input.manualStandardOverride.filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
        : []

  return {
    standardsSource: standardsSource.length > 0 ? standardsSource : deriveStandardsSource(input, standards),
    curriculumInfluence: curriculumInfluence.length > 0 ? curriculumInfluence : derived.curriculumInfluence,
    exemplarInfluence: exemplarInfluence.length > 0 ? exemplarInfluence : derived.exemplarInfluence,
    extractionWarnings: extractionWarnings.length > 0 ? extractionWarnings : derived.extractionWarnings,
    unresolvedConflicts,
    manualOverrides,
  }
}

export function toCanonicalLessonPackage(raw: unknown): LessonPackage {
  const rec = asRecord(raw)
  const input = asRecord(rec.input)
  const metadata = asRecord(rec.metadata)
  const meta = asRecord(rec.meta)
  const exportsRec = asRecord(rec.exports)
  const lessonPlanRec = asRecord(rec.lessonPlan)

  const materials = normalizeMaterials(rec.materials)
  const standardsRaw =
    Array.isArray(rec.standards) && rec.standards.length > 0
      ? rec.standards
      : Array.isArray(rec.standardsDetected)
        ? rec.standardsDetected
        : []

  const standards = normalizeStandards(standardsRaw)
  const trace = buildCanonicalTrace(rec.trace, materials, input, standards)

  const title = asString(
    metadata.title,
    asString(input.lessonTitle, asString(input.topic, asString(input.textOrTopic, 'Untitled Lesson'))),
  )

  return createEmptyLessonPackage({
    metadata: {
      id: asString(metadata.id, crypto.randomUUID()),
      title,
      createdAt: asString(metadata.createdAt, asString(meta.generatedAt, new Date().toISOString())),
      updatedAt: asString(metadata.updatedAt, asString(meta.generatedAt, new Date().toISOString())),
      status:
        metadata.status === 'generated' || typeof meta.generatedAt === 'string'
          ? 'generated'
          : 'draft',
      version: 1,
    },
    input: {
      grade: asString(input.grade),
      subject: asString(input.subject),
      topic: asString(input.topic, asString(input.lessonTitle, asString(input.textOrTopic))),
      objective: asString(input.objective),
      notes: asString(input.notes, asString(input.materials)),
    },
    standards,
    materials,
    blueprint: normalizeBlueprint(rec.blueprint, input),
    lessonPlan: normalizeLessonPlan(rec.lessonPlan),
    slides: normalizeSlides(rec.slides),
    exports: {
      pptxReady: Boolean(exportsRec.pptxReady ?? (Array.isArray(rec.slides) && rec.slides.length > 0)),
      docxReady: Boolean(exportsRec.docxReady ?? Array.isArray(lessonPlanRec.blocks) ?? Array.isArray(rec.lessonPlan)),
      zipReady: Boolean(exportsRec.zipReady),
      ...(typeof exportsRec.lastExportedAt === 'string' ? { lastExportedAt: exportsRec.lastExportedAt } : {}),
    },
    trace,
  })
}

export function fromCanonicalLessonPackage(pkg: LessonPackage): Record<string, unknown> {
  return {
    metadata: pkg.metadata,
    input: pkg.input,
    standards: pkg.standards,
    materials: pkg.materials,
    blueprint: pkg.blueprint,
    lessonPlan: pkg.lessonPlan,
    slides: pkg.slides,
    exports: pkg.exports,
    trace: pkg.trace,
  }
}
