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
import type { LessonPackage } from "../types";

export async function exportLessonPlanDocx(pkg: LessonPackage) {
  const title = pkg.input.lessonTitle || "Lesson Plan";
  const metaLine = `${pkg.input.date}  •  ${pkg.input.subject}  •  Grade ${pkg.input.grade}  •  ${pkg.input.durationMinutes} min`;

  const standardsLine =
    ((pkg as any).standardsDetected ?? (pkg as any).standards ?? []).length === 0
      ? "Standards: (none detected yet — dataset not loaded)"
      : "Standards: " +
        ((pkg as any).standardsDetected ?? (pkg as any).standards ?? [])
          .map((s) => `${s.code}${s.overridden ? " (override)" : ""}`)
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
          para(pkg.input.objective || ""),
          spacer(),

          heading("Essential Question"),
          para(pkg.input.essentialQuestion || "—"),
          spacer(),

          heading("Text / Topic"),
          para(pkg.input.textOrTopic || ""),
          spacer(),

          heading("Materials"),
          para(pkg.input.materials?.trim() ? pkg.input.materials : "—"),
          spacer(),

          heading("Lesson Plan (Slide-Aligned)"),
          ...pkg.lessonPlan.flatMap((sec) => lessonSection(sec.heading, sec.slides, sec.description, sec.differentiation)),
          spacer(),

          heading("Centers + Rotation"),
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
    children: [new TextRun({ text, bold: true })],
  });
}

function subheading(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, bold: true })],
  });
}

function para(text: string) {
  return new Paragraph({
    children: [new TextRun({ text })],
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
      para(`Tier 3: ${differentiation.tier3 ?? "—"}`),
      para(`Tier 2: ${differentiation.tier2 ?? "—"}`),
      para(`Enrichment: ${differentiation.enrichment ?? "—"}`),
    );
  }

  blocks.push(spacer());
  return blocks;
}

function centersBlock(pkg: LessonPackage): Paragraph[] {
  const blocks: Paragraph[] = [];
  pkg.centers.forEach((c, idx) => {
    blocks.push(
      subheading(`${idx + 1}. ${c.name}`),
      para(`Focus Skill: ${c.focusSkill}`),
      para(`Instructions: ${c.instructions}`),
      para(`Differentiation: ${c.differentiation ?? "—"}`),
      spacer()
    );
  });

  blocks.push(
    para(`Rotation Plan: ${pkg.rotationPlan}`),
  );

  return blocks;
}

function interventionsTable(pkg: LessonPackage) {
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
          cell(pkg.interventions.tier3[i] ?? ""),
          cell(pkg.interventions.tier2[i] ?? ""),
          cell(pkg.interventions.enrichment[i] ?? ""),
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
