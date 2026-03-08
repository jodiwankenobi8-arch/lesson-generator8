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
  return String(line ?? "")
    .replace(/\u0000/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function cleanCurriculumLine(line: string) {
  return normalize(
    String(line ?? "")
      .replace(/^[\-\*\u2022\u25CF\u25E6\u2023\u2043]+\s*/, "")
      .replace(/^(lesson\s*objective|objective|i can|students will|teaching point|focus skill|standard|skill focus)\s*[:\-]\s*/i, "")
  );
}

function isLikelyFallbackText(text: string) {
  const t = text.toLowerCase();
  return (
    t.includes("text extraction failed") ||
    t.includes("not available yet") ||
    t.includes("use this file name") ||
    t.includes("use this file name and") ||
    t.includes("source signal")
  );
}

function splitIntoCandidateLines(text: string) {
  return String(text ?? "")
    .replace(/\r/g, "\n")
    .split(/\n+/)
    .map(normalize)
    .filter(Boolean);
}

function looksUsefulCurriculumLine(line: string) {
  if (!line) return false;
  if (line.length < 8) return false;
  if (line.length > 220) return false;

  const looksBulleted = /^[-*\u2022\u25CF\u25E6\u2023\u2043]/.test(line);
  const startsWithLabel = /^(lesson\s*objective|objective|i can|students will|teaching point|focus skill|standard|skill focus)\b/i.test(line);
  const hasDirective = /\b(must|required|teach|include|students will|today you will|objective|i can|identify|explain|describe|compare|retell|read|write|solve|practice|model|determine|analyze)\b/i.test(line);

  return looksBulleted || startsWithLabel || hasDirective;
}

export function extractCoverageFromCurriculum(files: UploadedTextFile[]): CurriculumCoverageResult {
  const curriculumFiles = (files ?? []).filter((file) => {
    const text = String(file.text ?? "");
    const role = String(file.sourceRole ?? "curriculum").toLowerCase();
    return role === "curriculum" && text.trim() && !isLikelyFallbackText(text);
  });

  const items: CurriculumCoverageItem[] = [];
  const seen = new Map<string, string[]>();

  for (const file of curriculumFiles) {
    const lines = splitIntoCandidateLines(String(file.text ?? ""));

    for (const rawLine of lines) {
      if (!looksUsefulCurriculumLine(rawLine)) continue;

      const cleaned = cleanCurriculumLine(rawLine);
      if (cleaned.length < 8) continue;

      const key = cleaned.toLowerCase();
      if (!seen.has(key)) seen.set(key, []);
      seen.get(key)!.push(`${file.name}: ${cleaned}`);
    }
  }

  for (const [, evidence] of seen.entries()) {
    const title = evidence[0].replace(/^[^:]+:\s*/, "");
    items.push({
      id: mkId("cov"),
      title,
      required: /\b(must|required|objective|students will|i can)\b/i.test(title),
      evidence: evidence.slice(0, 3),
    });
  }

  items.sort((a, b) => {
    const req = Number(b.required) - Number(a.required);
    if (req !== 0) return req;
    return a.title.localeCompare(b.title);
  });

  const summary = items.length
    ? `Extracted ${items.length} curriculum coverage items from readable curriculum text.`
    : "No teacher-usable curriculum coverage items were found. Upload readable curriculum text or DOCX/PDF content with extractable instructional language.";

  return { summary, items: items.slice(0, 12) };
}
