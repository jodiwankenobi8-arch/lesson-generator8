export type LessonDomain =
  | "FOUNDATIONS"
  | "READING"
  | "VOCABULARY"
  | "COMMUNICATION";

export function classifyLessonDomain(input: string): LessonDomain {
  const text = input.toLowerCase();

  const foundationsTriggers = ["blend", "segment", "phoneme", "cvc", "letter sound", "decode"];
  const readingTriggers = ["retell", "setting", "character", "events", "story", "sequence", "plot", "comprehension"];
  const vocabTriggers = ["synonym", "antonym", "categorize", "category", "vocabulary", "word meaning"];
  const communicationTriggers = ["opinion", "explain", "describe", "write about", "speaking"];

  const countMatches = (triggers: string[]) =>
    triggers.reduce((count, word) => count + (text.includes(word) ? 1 : 0), 0);

  const scores = {
    FOUNDATIONS: countMatches(foundationsTriggers),
    READING: countMatches(readingTriggers),
    VOCABULARY: countMatches(vocabTriggers),
    COMMUNICATION: countMatches(communicationTriggers),
  };

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  return (sorted[0][0] as LessonDomain) ?? "READING";
}

export const DOMAIN_WEIGHT: Record<
  LessonDomain,
  { F: number; R: number; V: number; C: number }
> = {
  FOUNDATIONS: { F: 1.6, R: 0.7, V: 0.6, C: 0.8 },
  READING: { R: 1.6, V: 0.7, F: 0.8, C: 1.0 },
  VOCABULARY: { V: 1.6, R: 0.8, F: 0.6, C: 0.9 },
  COMMUNICATION: { C: 1.6, R: 1.0, V: 0.8, F: 0.7 },
};
