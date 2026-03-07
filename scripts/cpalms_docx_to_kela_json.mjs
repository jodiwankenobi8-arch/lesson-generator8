import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

const SOURCE = path.resolve("standards_source/ela_best.docx");
const OUT = path.resolve("src/engine/standards/data/k_ela_best.json");

const CODE_RE = /\bELA\.K\.[A-Z]\.\d+\.\d+\b/g;

function decodeXml(s){
  return s
    .replace(/&amp;/g,"&")
    .replace(/&lt;/g,"<")
    .replace(/&gt;/g,">")
    .replace(/&quot;/g,'"')
    .replace(/&#39;/g,"'")
    .replace(/&#x2019;/g,"’")
    .replace(/&#x201C;/g,"“")
    .replace(/&#x201D;/g,"”")
    .replace(/&#x2013;/g,"–")
    .replace(/&#x2014;/g,"—")
    .replace(/&#xA;/g,"\n")
    .replace(/&#x9;/g,"\t");
}

function extractParagraphs(xml){
  const paraMatches = xml.match(/<w:p\b[\s\S]*?<\/w:p>/g) ?? [];
  const paragraphs = [];

  for (const p of paraMatches){
    const runs = p.match(/<w:t\b[^>]*>[\s\S]*?<\/w:t>/g) ?? [];
    const text = runs
      .map(r => decodeXml(r.replace(/^<w:t\b[^>]*>/,"").replace(/<\/w:t>$/,"")))
      .join("")
      .replace(/\s+/g," ")
      .trim();
    if (text) paragraphs.push(text);
  }

  return paragraphs;
}

function parseStandards(text){
  const matches = [...text.matchAll(CODE_RE)];
  const results = [];

  for (let i=0;i<matches.length;i++){
    const code = matches[i][0];
    const start = matches[i].index + code.length;
    const end = i+1 < matches.length ? matches[i+1].index : text.length;

    const desc = text
      .slice(start,end)
      .replace(/\s+/g," ")
      .replace(/^[\s:–—-]+/,"")
      .trim();

    if (desc){
      results.push({ code, description: desc });
    }
  }

  const map = new Map();
  for (const r of results){
    if (!map.has(r.code)) map.set(r.code,r);
  }

  return [...map.values()];
}

function main(){
  if (!fs.existsSync(SOURCE)) throw new Error("Missing DOCX file.");

  const zip = new AdmZip(SOURCE);
  const entry = zip.getEntry("word/document.xml");
  if (!entry) throw new Error("document.xml not found.");

  const xml = entry.getData().toString("utf8");
  const paragraphs = extractParagraphs(xml);
  const fullText = paragraphs.join("\n");
  const rows = parseStandards(fullText);

  fs.mkdirSync(path.dirname(OUT), { recursive:true });
  fs.writeFileSync(OUT, JSON.stringify(rows,null,2),"utf8");

  console.log("Paragraphs:", paragraphs.length);
  console.log("Standards Found:", rows.length);
  console.log("Output:", OUT);
}

main();
