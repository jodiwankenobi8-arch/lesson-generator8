import fs from "fs";
import path from "path";
import mammoth from "mammoth";

const docxPath = process.argv[2];
if (!docxPath) {
  console.error("Usage: node scripts/compile_k_ela_best_dataset.mjs <path-to-docx>");
  process.exit(1);
}

const outDir = path.resolve("src/engine/standards/data");
const outPath = path.join(outDir, "k_ela_best_dataset.ts");
fs.mkdirSync(outDir, { recursive: true });

// -------- helpers --------
function decodeEntities(s) {
  return s
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function stripHtml(html) {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/p>\s*<p[^>]*>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function looksLikeCode(s) {
  const x = s.trim();
  // Flexible code detector (handles a bunch of BEST-ish patterns):
  // e.g. "ELA.K.R.1.1", "ELA.K12.EE.1.1", "K.R.1.1", etc.
  // We just require: starts with letter/number, contains at least 2 dots, and is mostly [A-Z0-9.-]
  if (!/^[A-Za-z0-9]/.test(x)) return false;
  if ((x.match(/\./g) || []).length < 2) return false;
  if (!/^[A-Za-z0-9.\-]+$/.test(x)) return false;
  if (x.length < 5) return false;
  return true;
}

function keywordsFromLabel(label) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2)
    .slice(0, 30);
}

// -------- extract --------
const { value: html } = await mammoth.convertToHtml({ path: docxPath });

// 1) Parse TABLE rows first (most standards docs put codes/labels in tables)
const rows = html.match(/<tr[\s\S]*?<\/tr>/gi) || [];
const items = [];

for (const row of rows) {
  const cells = [];
  const re = /<t[dh][\s\S]*?>([\s\S]*?)<\/t[dh]>/gi;
  let m;
  while ((m = re.exec(row))) {
    cells.push(stripHtml(m[1]));
  }
  if (cells.length < 2) continue;

  const c0 = (cells[0] || "").trim();
  const c1 = (cells[1] || "").trim();

  if (!c0 || !c1) continue;
  if (!looksLikeCode(c0)) continue;

  items.push({
    code: c0.toUpperCase(),
    label: c1,
    keywords: keywordsFromLabel(c1)
  });
}

// 2) Fallback: if table parse finds nothing, try raw text line parsing
if (items.length === 0) {
  const { value: raw } = await mammoth.extractRawText({ path: docxPath });
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // "CODE - label" / "CODE: label"
  const lineRx = /^([A-Za-z0-9.\-]{5,})\s*[:\-–]\s*(.+)$/;

  for (const l of lines) {
    const mm = l.match(lineRx);
    if (!mm) continue;
    const code = mm[1].trim();
    const label = mm[2].trim();
    if (!looksLikeCode(code)) continue;
    if (label.length < 6) continue;

    items.push({
      code: code.toUpperCase(),
      label,
      keywords: keywordsFromLabel(label)
    });
  }
}

// de-dupe by code
const byCode = new Map();
for (const it of items) {
  if (!byCode.has(it.code)) byCode.set(it.code, it);
}
const dataset = Array.from(byCode.values()).sort((a,b)=>a.code.localeCompare(b.code));

const ts = `/**
 * AUTO-GENERATED from: ${docxPath.replaceAll("\\\\","/")}
 * Generated: ${new Date().toISOString()}
 *
 * NOTE: This file is generated from your DOCX (no hallucinated standards).
 * If parsing misses items, improve scripts/compile_k_ela_best_dataset.mjs.
 */
export type KelaBestStandard = {
  code: string;
  label: string;
  keywords?: string[];
};

export const K_ELA_BEST_DATASET: KelaBestStandard[] = ${JSON.stringify(dataset, null, 2)} as const;
`;

fs.writeFileSync(outPath, ts, "utf8");
console.log(`Wrote dataset: ${outPath}`);
console.log(`Items: ${dataset.length}`);
