import type { KindergartenLessonData } from '../types/lesson-types';
import type { GeneratedLessonPlan } from '../types/lesson-schema';
import { GeneratedLessonPlanSchema } from '../types/lesson-schema';
import { buildKindergartenLessonPlanTemplate } from '../../lib/templateEngine/kindergarten';
import { api } from '../../utils/api';

/**
 * Business-safe lesson generation:
 * - Primary: server-side generation (Edge Function) with schema validation
 * - Fallback: deterministic template engine so teachers never hit a dead end
 */
export async function generateLessonPlan(options: {
  lessonData: KindergartenLessonData;
  approvedReviewContent?: any;
  exemplarIds?: string[];
}): Promise<{ plan: GeneratedLessonPlan; source: 'server' | 'fallback' }> {
  // 1) Try server
  try {
    const res = await api.generateLessonRag({
      grade: 'K',
      lessonData: options.lessonData,
      approvedReviewContent: options.approvedReviewContent ?? null,
      exemplarIds: options.exemplarIds ?? [],
    });

    const json = await api.getJSON(res);
    const parsed = GeneratedLessonPlanSchema.safeParse(json);
    if (!parsed.success) {
      throw new Error('Server returned invalid lesson schema');
    }
    return { plan: parsed.data, source: 'server' };
  } catch (e) {
    // 2) Fallback: deterministic template
    const fallback = buildKindergartenLessonPlanTemplate(options.lessonData);
    const parsed = GeneratedLessonPlanSchema.parse(fallback);
    return { plan: parsed, source: 'fallback' };
  }
}
