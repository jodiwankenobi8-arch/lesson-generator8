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
    .replace(/[ ]*\n[ ]*/g, "\n")
    .trim();
}

function cleanCurriculumLine(line: string) {
  return normalize(
    String(line ?? "")
      .replace(/^[\-\*\u2022\u25CF\u25E6\u2023\u2043]+\s*/, "")
      .replace(/^\(?\d+[A-Za-z]?\)?[.)\-\s]+/, "")
      .replace(/^[A-Za-z]\.[)\-\s]+/, "")
      .replace(/^(lesson\s*objective|objective|learning\s*target|target|i can|students will|student will|we will|teaching point|focus skill|standard|skill focus|success criteria|goal|benchmark)\s*[:\-]\s*/i, "")
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

function splitIntoCandidateSentences(text: string) {
  const normalized = String(text ?? "")
    .replace(/\r/g, "\n")
    .replace(/\n+/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();

  if (!normalized) return [];

  return normalized
    .split(/(?<=[.!?])\s+|(?<=;)\s+(?=[A-Z0-9])/)
    .map(normalize)
    .filter(Boolean);
}

function looksLikeStandardCode(line: string) {
  return /\b([A-Z]{1,4}[.\-]?\d+(?:\.\d+){0,4}[A-Z]?)\b/.test(line);
}

function looksUsefulCurriculumLine(line: string) {
  if (!line) return false;
  if (line.length < 8) return false;
  if (line.length > 260) return false;

  const looksBulleted = /^[-*\u2022\u25CF\u25E6\u2023\u2043]/.test(line);
  const startsWithLabel = /^(lesson\s*objective|objective|learning\s*target|target|i can|students will|student will|we will|teaching point|focus skill|standard|skill focus|success criteria|goal|benchmark)\b/i.test(line);
  const hasDirective = /\b(must|required|teach|include|students will|student will|we will|today you will|objective|i can|identify|explain|describe|compare|retell|read|write|solve|practice|model|determine|analyze|decode|segment|blend|infer|cite|summarize|justify|demonstrate)\b/i.test(line);
  const standardish = looksLikeStandardCode(line);

  return looksBulleted || startsWithLabel || hasDirective || standardish;
}

function looksUsefulCurriculumSentence(line: string) {
  if (!line) return false;
  if (line.length < 18) return false;
  if (line.length > 260) return false;

  return /\b(students will|student will|we will|i can|objective|learning target|success criteria|teach|identify|explain|describe|compare|retell|read|write|solve|practice|model|determine|analyze|decode|segment|blend|infer|summarize|justify|demonstrate)\b/i.test(
    line,
  );
}

function sanitizeTitle(line: string) {
  return normalize(
    String(line ?? "")
      .replace(/\s+/g, " ")
      .replace(/^[,:;\-\s]+/, "")
      .replace(/[,:;\-\s]+$/, "")
  );
}

function canonicalize(line: string) {
  return sanitizeTitle(line)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractCoverageFromCurriculum(files: UploadedTextFile[]): CurriculumCoverageResult {
  const curriculumFiles = (files ?? []).filter((file) => {
    const text = String(file.text ?? "");
    const role = String(file.sourceRole ?? "curriculum").toLowerCase();
    return (role === "curriculum" || role === "teachingtool" || role === "mixed") && text.trim() && !isLikelyFallbackText(text);
  });

  const items: CurriculumCoverageItem[] = [];
  const seen = new Map<string, string[]>();

  for (const file of curriculumFiles) {
    const rawText = String(file.text ?? "");
    const lineCandidates = splitIntoCandidateLines(rawText);
    const sentenceCandidates = splitIntoCandidateSentences(rawText);

    for (const rawLine of lineCandidates) {
      if (!looksUsefulCurriculumLine(rawLine)) continue;

      const cleaned = sanitizeTitle(cleanCurriculumLine(rawLine));
      if (cleaned.length < 8) continue;

      const key = canonicalize(cleaned);
      if (!key) continue;

      if (!seen.has(key)) seen.set(key, []);
      seen.get(key)!.push(`${file.name}: ${cleaned}`);
    }

    for (const rawSentence of sentenceCandidates) {
      if (!looksUsefulCurriculumSentence(rawSentence)) continue;

      const cleaned = sanitizeTitle(cleanCurriculumLine(rawSentence));
      if (cleaned.length < 12) continue;

      const key = canonicalize(cleaned);
      if (!key || seen.has(key)) continue;

      seen.set(key, [`${file.name}: ${cleaned}`]);
    }
  }

  for (const [, evidence] of seen.entries()) {
    const title = evidence[0].replace(/^[^:]+:\s*/, "");
    items.push({
      id: mkId("cov"),
      title,
      required: /\b(must|required|objective|students will|student will|we will|i can|learning target|success criteria)\b/i.test(title),
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
