import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import type { LessonPackage, RotationPlanItem } from "../types";

function cleanText(value: any, fallback = "—") {
  const raw = String(value ?? "")
    .replace(/[?]+/g, "—")
    .replace(/\r/g, "")
    .replace(/\u2022/g, "-")
    .replace(/\s+/g, " ")
    .trim();

  if (!raw) return fallback;

  return raw
    .replace(/CURRICULUM SOURCE:\s*/gi, "Curriculum source: ")
    .replace(/(^|\s)(timer cue|clicker cue|script cue|transition cue)\s*-\s*/gi, "$1")
    .replace(/\bIf curriculum includes\b.*$/gi, "")
    .replace(/\bIf exemplar includes\b.*$/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim() || fallback;
}

function cleanMultiline(value: any, fallback = "—") {
  const text = String(value ?? "")
    .replace(/[?]+/g, "—")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => cleanText(line, ""))
    .filter(Boolean)
    .join("\n")
    .trim();

  return text || fallback;
}

function getCenterTitle(c: any, idx: number) {
  return cleanText(c?.title ?? c?.name ?? `Center ${idx + 1}`);
}

function getCenterObjective(c: any) {
  return cleanText(c?.objective ?? c?.focusSkill ?? "");
}

function getCenterDirection(c: any) {
  return cleanMultiline(c?.direction ?? c?.instructions ?? "");
}

function getCenterDifferentiation(c: any) {
  return cleanText(c?.differentiation ?? "");
}

function getRotationLines(rotationPlan: LessonPackage["rotationPlan"]): string[] {
  if (Array.isArray(rotationPlan)) {
    return rotationPlan.map((item: RotationPlanItem, idx: number) => {
      if (typeof item === "string") return cleanText(item);
      const title = cleanText(item?.title ?? `Rotation ${idx + 1}`, `Rotation ${idx + 1}`);
      const description = cleanText(item?.description ?? item?.text ?? "");
      return description === "—" ? title : `${title}: ${description}`;
    });
  }

  if (typeof rotationPlan === "string" && rotationPlan.trim()) {
    return [cleanText(rotationPlan)];
  }

  return ["No rotation plan generated."];
}

export async function exportLessonPlanDocx(pkg: LessonPackage) {
  const title = cleanText(pkg.input.lessonTitle || "Lesson Plan", "Lesson Plan");
  const metaLine = cleanText(
    `${pkg.input.date || ""} • ${pkg.input.subject || ""} • Grade ${pkg.input.grade || ""} • ${pkg.input.durationMinutes || ""} min`
  );

  const standards = ((pkg as any).standardsDetected ?? (pkg as any).standards ?? []) as any[];
  const standardsLine =
    standards.length === 0
      ? "Standards: none detected yet"
      : "Standards: " +
        standards
          .map((s: any) => `${cleanText(s.code, "")}${s.overridden ? " (override)" : ""}`.trim())
          .filter(Boolean)
          .join(", ");

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: title, bold: true })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: metaLine })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: standardsLine })],
          }),
          spacer(),

          heading("Objective"),
          para(cleanText(pkg.input.objective)),
          spacer(),

          heading("Essential Question"),
          para(cleanText(pkg.input.essentialQuestion)),
          spacer(),

          heading("Text / Topic"),
          para(cleanText(pkg.input.textOrTopic)),
          spacer(),

          heading("Materials"),
          para(cleanText(pkg.input.materials)),
          spacer(),

          heading("Lesson Plan (Slide-Aligned)"),
          ...pkg.lessonPlan.flatMap((sec) =>
            lessonSection(sec.heading, sec.slides, sec.description, sec.differentiation)
          ),
          spacer(),

          heading("Centers and Rotation"),
          ...centersBlock(pkg),
          spacer(),

          heading("Interventions / Enrichment"),
          interventionsTable(pkg),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeTitle = sanitizeFilename(pkg.input.lessonTitle || "lesson_plan");
  const filename = `${safeTitle}_${pkg.input.date}_lesson_plan.docx`;
  saveAs(blob, filename);
}

function heading(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text: cleanText(text), bold: true })],
  });
}

function subheading(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text: cleanText(text), bold: true })],
  });
}

function para(text: string) {
  return new Paragraph({
    children: [new TextRun({ text: cleanMultiline(text) })],
  });
}

function spacer() {
  return new Paragraph({ children: [new TextRun({ text: "" })] });
}

function lessonSection(
  headingText: string,
  slides: number[],
  description: string,
  differentiation?: { tier3?: string; tier2?: string; enrichment?: string }
) {
  const slideLine = slides?.length ? `Slides: ${slides.join(", ")}` : "Slides: —";

  const blocks: Paragraph[] = [
    subheading(headingText),
    para(slideLine),
    para(description || ""),
  ];

  if (differentiation) {
    blocks.push(
      para(`Tier 3: ${cleanText(differentiation.tier3)}`),
      para(`Tier 2: ${cleanText(differentiation.tier2)}`),
      para(`Enrichment: ${cleanText(differentiation.enrichment)}`),
    );
  }

  blocks.push(spacer());
  return blocks;
}

function centersBlock(pkg: LessonPackage): Paragraph[] {
  const blocks: Paragraph[] = [];

  pkg.centers.forEach((c, idx) => {
    const objective = getCenterObjective(c);
    const direction = getCenterDirection(c);
    const differentiation = getCenterDifferentiation(c);

    blocks.push(
      subheading(`${idx + 1}. ${getCenterTitle(c, idx)}`),
      para(`Focus Skill: ${objective}`),
      para(`Instructions: ${direction}`),
      ...(differentiation !== "—" ? [para(`Differentiation: ${differentiation}`)] : []),
      spacer()
    );
  });

  blocks.push(subheading("Rotation Plan"));
  getRotationLines(pkg.rotationPlan).forEach((line) => {
    blocks.push(para(line));
  });

  return blocks;
}

function interventionsTable(pkg: LessonPackage) {
  const normalizeItem = (item: any) => cleanText(item?.description ?? item?.text ?? item ?? "");

  const cell = (text: string) =>
    new TableCell({
      width: { size: 33.3, type: WidthType.PERCENTAGE },
      children: [new Paragraph({ children: [new TextRun(text)] })],
    });

  const headerCell = (text: string) =>
    new TableCell({
      width: { size: 33.3, type: WidthType.PERCENTAGE },
      children: [new Paragraph({ children: [new TextRun({ text, bold: true })] })],
    });

  const maxLen = Math.max(
    pkg.interventions.tier3.length,
    pkg.interventions.tier2.length,
    pkg.interventions.enrichment.length
  );

  const rows: TableRow[] = [
    new TableRow({
      children: [headerCell("Tier 3"), headerCell("Tier 2"), headerCell("Enrichment")],
    }),
  ];

  for (let i = 0; i < maxLen; i++) {
    rows.push(
      new TableRow({
        children: [
          cell(normalizeItem(pkg.interventions.tier3[i])),
          cell(normalizeItem(pkg.interventions.tier2[i])),
          cell(normalizeItem(pkg.interventions.enrichment[i])),
        ],
      })
    );
  }

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows,
  });
}

function sanitizeFilename(name: string) {
  return name
    .trim()
    .replace(/[\/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, "_")
    .slice(0, 80);
}
