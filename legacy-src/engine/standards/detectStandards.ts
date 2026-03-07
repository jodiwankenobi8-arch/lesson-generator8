import type { DetectedStandard, LessonInput } from "../types";
import { bestDataset } from "./dataset";

export function detectStandards(input: LessonInput): DetectedStandard[] {
  // Manual override bypasses scoring
  if (input.manualStandardOverride && input.manualStandardOverride.length > 0) {
    return input.manualStandardOverride
      .map((code) => bestDataset.find((s) => s.code === code))
      .filter(Boolean)
      .map((s) => ({
        code: s!.code,
        description: s!.description,
        confidence: 1,
        overridden: true,
      }));
  }

  if (!bestDataset.length) return [];

  const filtered = bestDataset.filter(
    (s) => s.grade === input.grade && s.subject === input.subject
  );

  const query = `${input.objective} ${input.essentialQuestion ?? ""} ${input.textOrTopic}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ");

  const tokens = Array.from(new Set(query.split(/\s+/).filter(Boolean)));

  const scored = filtered
    .map((std) => {
      const stdText = `${std.code} ${std.description}`.toLowerCase();
      const matched = tokens.filter((t) => t.length > 2 && stdText.includes(t));
      const confidence =
        tokens.length === 0 ? 0 : Math.max(0, Math.min(1, matched.length / tokens.length));

      return {
        code: std.code,
        description: std.description,
        confidence,
      } satisfies DetectedStandard;
    })
    .sort((a, b) => b.confidence - a.confidence);

  return scored.filter((s) => s.confidence > 0).slice(0, 3);
}
