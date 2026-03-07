import type { UploadedTextFile } from "../blueprint/types";

export interface CurriculumCoverageItem {
  id: string;
  title: string;
  required: boolean;
  evidence?: string[];
}

export interface CurriculumCoverageResult {
  summary: string;
  items: CurriculumCoverageItem[];
}

function mkId(prefix: string) {
  return prefix + "_" + Math.random().toString(36).slice(2, 10);
}

function normalize(line: string) {
  return String(line ?? "").replace(/\s+/g, " ").trim();
}

export function extractCoverageFromCurriculum(files: UploadedTextFile[]): CurriculumCoverageResult {
  const allText = (files ?? []).map((f) => f.text ?? "").join("\n\n");
  const lines = allText.split(/\r?\n/).map(normalize).filter(Boolean);
  const items: CurriculumCoverageItem[] = [];
  const seen = new Map<string, string[]>();

  for (const line of lines) {
    const looksBulleted = /^[-*•]/.test(line);
    const hasDirective = /\b(must|required|teach|include|students will|today you will|objective|i can)\b/i.test(line);
    if (!looksBulleted && !hasDirective) continue;
    const cleaned = normalize(line.replace(/^[-*•]\s*/, ""));
    if (cleaned.length < 6) continue;
    if (!seen.has(cleaned)) seen.set(cleaned, []);
    seen.get(cleaned)!.push(line);
  }

  for (const [title, evidence] of seen.entries()) {
    items.push({
      id: mkId("cov"),
      title,
      required: /\b(must|required)\b/i.test(title),
      evidence,
    });
  }

  const summary = items.length
    ? `Extracted ${items.length} coverage items from curriculum text.`
    : "No text-based coverage items found. Upload TXT, MD, or DOCX files with readable text for extraction.";

  return { summary, items };
}
