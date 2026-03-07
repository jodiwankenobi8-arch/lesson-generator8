import type { GeneratedLessonPlan } from '../types/lesson-schema';
import type { Slide } from '../types';

/**
 * Convert a generated lesson plan into a STUDENT-FACING slide deck.
 *
 * Business rule (solo-use mode):
 * - Slides are for whole-group instruction.
 * - Centers and detailed differentiation live in the teacher plan (not slides).
 * - Keep text minimal, readable, and kid-facing.
 */
export function planToSlides(plan: GeneratedLessonPlan): Slide[] {
  const slides: Slide[] = [];
  let idx = 1;

  slides.push({
    id: `slide-${idx++}`,
    type: 'title',
    title: plan.title,
    subtitle: `${plan.subject} • Grade ${plan.grade}${plan.date ? ` • ${plan.date}` : ''}`,
    showMascot: true,
  });

  slides.push({
    id: `slide-${idx++}`,
    type: 'objectives',
    title: 'Today We Will…',
    items: plan.objectives,
  });

  const isCentersBlock = (title: string) => /center|station|rotation/i.test(title);

  for (const block of plan.blocks) {
    if (isCentersBlock(block.title)) continue; // centers are planned separately

    // Section slide
    slides.push({
      id: `slide-${idx++}`,
      type: 'section',
      title: block.title,
      subtitle: block.minutes ? `${block.minutes} minutes` : undefined,
    });

    // Student-facing content
    const items: string[] = [];
    if (Array.isArray(block.studentsDo)) items.push(...block.studentsDo);
    if (Array.isArray(block.checksForUnderstanding) && block.checksForUnderstanding.length) {
      items.push('Check: ' + block.checksForUnderstanding[0]);
    }
    if (!items.length && Array.isArray(block.teacherSays) && block.teacherSays.length) {
      // fallback: simplify teacher prompts into a kid-friendly direction
      items.push('Listen and try your best!');
    }

    slides.push({
      id: `slide-${idx++}`,
      type: 'bullets',
      title: block.title,
      items: items.slice(0, 8),
    });
  }

  return slides;
}
