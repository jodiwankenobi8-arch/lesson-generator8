import { z } from 'zod';

/**
 * Canonical schema for generated lesson plans.
 * Business rule: generator MUST return this structure.
 */

export const IEGroupSuggestionSchema = z.object({
  groupName: z.string().min(1),
  canDoNow: z.array(z.string()).optional(),
  nextSteps: z.array(z.string()).optional(),
  suggestedActivities: z.array(z.string()).optional(),
});

export const IESuggestionsSchema = z.object({
  window: z.enum(['BOY','MOY','EOY']),
  tier3: z.array(IEGroupSuggestionSchema).optional(),
  tier2: z.array(IEGroupSuggestionSchema).optional(),
  enrichment: z.array(IEGroupSuggestionSchema).optional(),
  notes: z.array(z.string()).optional(),
});

export const LessonPlanBlockSchema = z.object({
  title: z.string().min(1),
  minutes: z.number().int().nonnegative(),
  teacherSays: z.array(z.string()).optional(),
  studentsDo: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
  checksForUnderstanding: z.array(z.string()).optional(),
  differentiation: z.object({
    intervention: z.array(z.string()).optional(),
    ell: z.array(z.string()).optional(),
    extension: z.array(z.string()).optional(),
  }).optional(),
});

export const GeneratedLessonPlanSchema = z.object({
  schemaVersion: z.literal('1.1'),
  grade: z.union([z.literal('K'), z.literal('1'), z.literal('2'), z.literal('3-5')]),
  subject: z.string().min(1),
  title: z.string().min(1),
  date: z.string().optional(),
  objectives: z.array(z.string()).min(1),
  standards: z.array(z.string()).optional(),
  materials: z.array(z.string()),
  blocks: z.array(LessonPlanBlockSchema).min(1),
  ieSuggestions: IESuggestionsSchema.optional(),
  notes: z.object({
    pacingTips: z.array(z.string()).optional(),
    classroomManagement: z.array(z.string()).optional(),
  }).optional(),
});

export type GeneratedLessonPlan = z.infer<typeof GeneratedLessonPlanSchema>;
export type LessonPlanBlock = z.infer<typeof LessonPlanBlockSchema>;
