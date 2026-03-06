export type LessonDomain = "ELA" | "Math" | "Science" | "SocialStudies" | "Other";

/**
 * Safe fallback classifier (prevents runtime crashes).
 * Uses simple keyword heuristics.
 */
export function classifyLessonDomain(input: any): LessonDomain {
  const text = String(
    (input && (input.domain || input.subject || input.topic || input.lessonTitle || input.title || input.unit || input.bigIdea)) ?? input ?? ""
  ).toLowerCase();

  if (/(phonemic|phonics|reading|literacy|letters?|sounds?|sight\s*words?|close\s*read|comprehension|vocabulary|writing|narrative|informational|poem|rhyme|ela)/.test(text)) return "ELA";
  if (/(math|number|count|addition|subtract|shape|geometry|measurement|ten\s*frame|pattern|compare|more|less)/.test(text)) return "Math";
  if (/(science|weather|plant|animal|life\s*cycle|force|motion|matter|observe|experiment)/.test(text)) return "Science";
  if (/(social|history|community|government|map|geography|citizen|economy)/.test(text)) return "SocialStudies";
  return "Other";
}
