import {
  createEmptyLessonPackage,
  type ExtractionConfidence,
  type LessonMaterial,
  type LessonPackage,
  type StandardRecord,
} from '../types/lesson-package'
import { buildTraceFromMaterials, makeExtractionWarning } from './lesson-package-trace'

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
  return 'unknown'
}

function normalizeMaterials(raw: unknown): LessonMaterial[] {
  if (!Array.isArray(raw)) return []

  return raw.map((item, index) => {
    const rec = asRecord(item)
    const warnings = Array.isArray(rec.warnings)
      ? rec.warnings.map((w, wIndex) => {
          const warningRec = asRecord(w)
          return makeExtractionWarning(
            asString(warningRec.code, warning__),
            asString(warningRec.message, 'Unknown extraction warning'),
          )
        })
      : []

    return {
      id: asString(rec.id, material_),
      name: asString(rec.name, asString(rec.fileName, Material )),
      sourceKind:
        rec.sourceKind === 'curriculum' ||
        rec.sourceKind === 'exemplar' ||
        rec.sourceKind === 'reference' ||
        rec.sourceKind === 'student-material' ||
        rec.sourceKind === 'teacher-note'
          ? rec.sourceKind
          : 'unknown',
      extractionKind:
        rec.extractionKind === 'txt' ||
        rec.extractionKind === 'md' ||
        rec.extractionKind === 'docx' ||
        rec.extractionKind === 'pdf' ||
        rec.extractionKind === 'pptx' ||
        rec.extractionKind === 'image'
          ? rec.extractionKind
          : 'unknown',
      extractedText: asString(rec.extractedText, asString(rec.text)),
      confidence: inferConfidence(rec.confidence),
      warnings,
      metadata: asRecord(rec.metadata),
      influencedBlueprint: Boolean(rec.influencedBlueprint),
      influencedGeneration: Boolean(rec.influencedGeneration),
    }
  })
}

function normalizeStandards(raw: unknown): StandardRecord[] {
  if (!Array.isArray(raw)) return []

  return raw.map((item) => {
    const rec = asRecord(item)
    return {
      code: asString(rec.code),
      description: asString(rec.description),
      source:
        rec.source === 'detected' || rec.source === 'manual' || rec.source === 'curriculum-derived'
          ? rec.source
          : 'unknown',
      confidence: inferConfidence(rec.confidence),
    }
  }).filter((s) => s.code.length > 0)
}

function normalizeSlides(raw: unknown): LessonPackage['slides'] {
  if (!Array.isArray(raw)) return []

  return raw.map((item, index) => {
    const rec = asRecord(item)
    return {
      id: asString(rec.id, slide_),
      title: asString(rec.title, Slide ),
      content: asString(rec.content, asString(rec.body)),
      notes: asString(rec.notes),
    }
  })
}

function normalizeLessonPlan(raw: unknown): LessonPackage['lessonPlan'] {
  const rec = asRecord(raw)
  const blocksRaw = Array.isArray(rec.blocks) ? rec.blocks : []

  return {
    blocks: blocksRaw.map((item, index) => {
      const block = asRecord(item)
      return {
        title: asString(block.title, Block ),
        text: asString(block.text, asString(block.content)),
        durationMinutes:
          typeof block.durationMinutes === 'number' && Number.isFinite(block.durationMinutes)
            ? block.durationMinutes
            : undefined,
      }
    }),
  }
}

function normalizeBlueprint(raw: unknown): LessonPackage['blueprint'] {
  const rec = asRecord(raw)

  return {
    summary: asString(rec.summary),
    essentialQuestion: asString(rec.essentialQuestion),
    learningTargets: asStringArray(rec.learningTargets),
    vocabulary: asStringArray(rec.vocabulary),
    sequence: asStringArray(rec.sequence),
  }
}

export function toCanonicalLessonPackage(raw: unknown): LessonPackage {
  const rec = asRecord(raw)
  const input = asRecord(rec.input)
  const metadata = asRecord(rec.metadata)
  const exportsRec = asRecord(rec.exports)
  const lessonPlanRec = asRecord(rec.lessonPlan)
  const materials = normalizeMaterials(rec.materials)
  const trace = buildTraceFromMaterials(materials)

  return createEmptyLessonPackage({
    metadata: {
      id: asString(metadata.id, crypto.randomUUID()),
      title: asString(metadata.title, asString(input.topic, 'Untitled Lesson')),
      createdAt: asString(metadata.createdAt, new Date().toISOString()),
      updatedAt: asString(metadata.updatedAt, new Date().toISOString()),
      status: metadata.status === 'generated' ? 'generated' : 'draft',
      version: 1,
    },
    input: {
      grade: asString(input.grade),
      subject: asString(input.subject),
      topic: asString(input.topic),
      objective: asString(input.objective),
      notes: asString(input.notes),
    },
    standards: normalizeStandards(rec.standards),
    materials,
    blueprint: normalizeBlueprint(rec.blueprint),
    lessonPlan: normalizeLessonPlan(rec.lessonPlan),
    slides: normalizeSlides(rec.slides),
    exports: {
      pptxReady: Boolean(exportsRec.pptxReady ?? (Array.isArray(rec.slides) && rec.slides.length > 0)),
      docxReady: Boolean(exportsRec.docxReady ?? Array.isArray(lessonPlanRec.blocks)),
      zipReady: Boolean(exportsRec.zipReady),
      ...(typeof exportsRec.lastExportedAt === 'string' ? { lastExportedAt: exportsRec.lastExportedAt } : {}),
    },
    trace: {
      ...trace,
      standardsSource: trace.standardsSource,
      unresolvedConflicts: [],
      manualOverrides: [],
    },
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
