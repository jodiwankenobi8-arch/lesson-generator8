import { z } from 'zod'

export const LESSON_PACKAGE_VERSION = 1 as const
export const LESSON_PACKAGE_STORAGE_KEY = 'lesson_generator__package_v2'

export const sourceKindSchema = z.enum([
  'curriculum',
  'exemplar',
  'reference',
  'student-material',
  'teacher-note',
  'unknown',
])

export const extractionKindSchema = z.enum([
  'txt',
  'md',
  'docx',
  'pdf',
  'pptx',
  'image',
  'unknown',
])

export const extractionConfidenceSchema = z.enum([
  'high',
  'medium',
  'low',
  'unknown',
])

export const standardsSourceSchema = z.enum([
  'detected',
  'manual',
  'curriculum-derived',
  'unknown',
])

export const traceInfluenceSchema = z.object({
  sourceId: z.string(),
  sourceName: z.string(),
  sourceKind: sourceKindSchema,
  note: z.string().default(''),
  confidence: extractionConfidenceSchema.default('unknown'),
})

export const extractionWarningSchema = z.object({
  code: z.string(),
  message: z.string(),
})

export const lessonMaterialSchema = z.object({
  id: z.string(),
  name: z.string(),
  sourceKind: sourceKindSchema.default('unknown'),
  extractionKind: extractionKindSchema.default('unknown'),
  extractedText: z.string().default(''),
  confidence: extractionConfidenceSchema.default('unknown'),
  warnings: z.array(extractionWarningSchema).default([]),
  metadata: z.record(z.string(), z.unknown()).default({}),
  influencedBlueprint: z.boolean().default(false),
  influencedGeneration: z.boolean().default(false),
})

export const standardRecordSchema = z.object({
  code: z.string(),
  description: z.string().default(''),
  source: standardsSourceSchema.default('unknown'),
  confidence: extractionConfidenceSchema.default('unknown'),
})

export const packageTraceSchema = z.object({
  standardsSource: z.array(traceInfluenceSchema).default([]),
  curriculumInfluence: z.array(traceInfluenceSchema).default([]),
  exemplarInfluence: z.array(traceInfluenceSchema).default([]),
  extractionWarnings: z.array(extractionWarningSchema).default([]),
  unresolvedConflicts: z.array(z.string()).default([]),
  manualOverrides: z.array(z.string()).default([]),
})

export const lessonPackageMetadataSchema = z.object({
  id: z.string(),
  version: z.number().int().positive().default(LESSON_PACKAGE_VERSION),
  createdAt: z.string(),
  updatedAt: z.string(),
  title: z.string().default('Untitled Lesson'),
  status: z.enum(['draft', 'generated', 'archived']).default('draft'),
})

export const lessonPackageInputSchema = z.object({
  grade: z.string().default(''),
  subject: z.string().default(''),
  topic: z.string().default(''),
  objective: z.string().default(''),
  notes: z.string().default(''),
})

export const lessonBlueprintSchema = z.object({
  summary: z.string().default(''),
  essentialQuestion: z.string().default(''),
  learningTargets: z.array(z.string()).default([]),
  vocabulary: z.array(z.string()).default([]),
  sequence: z.array(z.string()).default([]),
})

export const lessonPlanBlockSchema = z.object({
  title: z.string(),
  text: z.string().default(''),
  durationMinutes: z.number().int().nonnegative().optional(),
})

export const lessonPlanSchema = z.object({
  blocks: z.array(lessonPlanBlockSchema).default([]),
})

export const lessonSlideSchema = z.object({
  id: z.string().default(''),
  title: z.string().default(''),
  content: z.string().default(''),
  notes: z.string().default(''),
})

export const lessonExportsSchema = z.object({
  pptxReady: z.boolean().default(false),
  docxReady: z.boolean().default(false),
  zipReady: z.boolean().default(false),
  lastExportedAt: z.string().optional(),
})

export const lessonPackageSchema = z.object({
  metadata: lessonPackageMetadataSchema,
  input: lessonPackageInputSchema.default({}),
  standards: z.array(standardRecordSchema).default([]),
  materials: z.array(lessonMaterialSchema).default([]),
  blueprint: lessonBlueprintSchema.default({}),
  lessonPlan: lessonPlanSchema.default({}),
  slides: z.array(lessonSlideSchema).default([]),
  exports: lessonExportsSchema.default({}),
  trace: packageTraceSchema.default({}),
})

export type SourceKind = z.infer<typeof sourceKindSchema>
export type ExtractionKind = z.infer<typeof extractionKindSchema>
export type ExtractionConfidence = z.infer<typeof extractionConfidenceSchema>
export type StandardsSource = z.infer<typeof standardsSourceSchema>

export type TraceInfluence = z.infer<typeof traceInfluenceSchema>
export type ExtractionWarning = z.infer<typeof extractionWarningSchema>
export type LessonMaterial = z.infer<typeof lessonMaterialSchema>
export type StandardRecord = z.infer<typeof standardRecordSchema>
export type PackageTrace = z.infer<typeof packageTraceSchema>
export type LessonPackageMetadata = z.infer<typeof lessonPackageMetadataSchema>
export type LessonPackageInput = z.infer<typeof lessonPackageInputSchema>
export type LessonBlueprint = z.infer<typeof lessonBlueprintSchema>
export type LessonPlanBlock = z.infer<typeof lessonPlanBlockSchema>
export type LessonPlan = z.infer<typeof lessonPlanSchema>
export type LessonSlide = z.infer<typeof lessonSlideSchema>
export type LessonExports = z.infer<typeof lessonExportsSchema>
export type LessonPackage = z.infer<typeof lessonPackageSchema>

export function createEmptyLessonPackage(partial?: Partial<LessonPackage>): LessonPackage {
  const now = new Date().toISOString()

  return lessonPackageSchema.parse({
    metadata: {
      id: partial?.metadata?.id ?? crypto.randomUUID(),
      version: LESSON_PACKAGE_VERSION,
      createdAt: partial?.metadata?.createdAt ?? now,
      updatedAt: partial?.metadata?.updatedAt ?? now,
      title: partial?.metadata?.title ?? 'Untitled Lesson',
      status: partial?.metadata?.status ?? 'draft',
    },
    input: partial?.input ?? {},
    standards: partial?.standards ?? [],
    materials: partial?.materials ?? [],
    blueprint: partial?.blueprint ?? {},
    lessonPlan: partial?.lessonPlan ?? {},
    slides: partial?.slides ?? [],
    exports: partial?.exports ?? {},
    trace: partial?.trace ?? {},
  })
}
