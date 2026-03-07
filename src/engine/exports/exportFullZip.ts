import JSZip from "jszip";
import { saveAs } from "file-saver";
import PptxGenJS from "pptxgenjs";
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

import type { LessonPackage, Slide } from "../types";

export async function exportFullZip(pkg: LessonPackage) {
  const zip = new JSZip();

  const safeTitle = sanitizeFilename(pkg.input.lessonTitle || "lesson");
  const date = pkg.input.date || "date";
  const rootFolderName = `${safeTitle}_${date}`;
  const folder = zip.folder(rootFolderName)!;

  // 1) PPTX (slides)
  const pptxBytes = await buildSlidesPptxBytes(pkg);
  folder.file(`${safeTitle}_${date}_slides.pptx`, pptxBytes);

  // 2) DOCX (lesson plan)
  const docxBytes = await buildLessonPlanDocxBytes(pkg);
  folder.file(`${safeTitle}_${date}_lesson_plan.docx`, docxBytes);

  // 3) JSON (full package)
  folder.file(`${safeTitle}_${date}_lesson_package.json`, JSON.stringify(pkg, null, 2));

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${rootFolderName}_FULL_EXPORT.zip`);
}

async function buildSlidesPptxBytes(pkg: LessonPackage): Promise<Uint8Array> {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Lesson Generator";
  pptx.company = "Lesson Generator";
  pptx.subject = `${pkg.input.subject} Grade ${pkg.input.grade}`;
  pptx.title = pkg.input.lessonTitle;

  const W = 13.33;
  const H = 7.5;

  const addStandardSlide = (s: Slide, index: number) => {
    const slide = pptx.addSlide();

    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: W,
      h: 1.05,
      fill: { color: "0F172A" },
      line: { color: "0F172A" },
    });

    slide.addText(s.title || `Slide ${index + 1}`, {
      x: 0.6,
      y: 0.22,
      w: W - 1.2,
      h: 0.8,
      fontFace: "Calibri",
      fontSize: 36,
      color: "FFFFFF",
      bold: true,
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.75,
      y: 1.45,
      w: W - 1.5,
      h: H - 2.1,
      fill: { color: "FFFFFF" },
      line: { color: "E5E7EB" },
    });

    const bullets = s.bullets?.filter(Boolean) ?? [];
    const bodyText = bullets.length > 0 ? bullets.map((b) => `• ${b}`).join("\n") : "";

    slide.addText(bodyText || " ", {
      x: 1.1,
      y: 1.75,
      w: W - 2.2,
      h: H - 2.7,
      fontFace: "Calibri",
      fontSize: 30,
      color: "111827",
      valign: "top",
      lineSpacingMultiple: 1.15,
    });

    slide.addText(`${pkg.input.date}  •  ${pkg.input.subject}  •  Grade ${pkg.input.grade}`, {
      x: 0.75,
      y: H - 0.55,
      w: W - 1.5,
      h: 0.3,
      fontFace: "Calibri",
      fontSize: 14,
      color: "6B7280",
      align: "right",
    });
  };

  pkg.slides.forEach((s, i) => addStandardSlide(s, i));

  // Uint8Array output for zipping
  const out = (await pptx.write({ outputType: "arraybuffer" })) as ArrayBuffer;
  return new Uint8Array(out);
}

async function buildLessonPlanDocxBytes(pkg: LessonPackage): Promise<Uint8Array> {
  const title = pkg.input.lessonTitle || "Lesson Plan";
  const metaLine = `${pkg.input.date}  •  ${pkg.input.subject}  •  Grade ${pkg.input.grade}  •  ${pkg.input.durationMinutes} min`;

  const standardsLine =
    ((pkg as any).standardsDetected ?? (pkg as any).standards ?? []).length === 0
      ? "Standards: (none detected yet — dataset not loaded)"
      : "Standards: " +
        ((pkg as any).standardsDetected ?? (pkg as any).standards ?? [])
          .map((s: { code: string; overridden?: boolean }) => `${s.code}${s.overridden ? " (override)" : ""}`)
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
          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(metaLine)] }),
          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(standardsLine)] }),
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
          ...pkg.lessonPlan.flatMap((sec) =>
            lessonSection(sec.heading, sec.slides, sec.description, sec.differentiation)
          ),
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

  const ab = await Packer.toArrayBuffer(doc);
  return new Uint8Array(ab);
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

  const blocks: Paragraph[] = [subheading(headingText), para(slideLine), para(description || "")];

  if (differentiation) {
    blocks.push(
      para(`Tier 3: ${differentiation.tier3 ?? "—"}`),
      para(`Tier 2: ${differentiation.tier2 ?? "—"}`),
      para(`Enrichment: ${differentiation.enrichment ?? "—"}`)
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

  blocks.push(para(`Rotation Plan: ${pkg.rotationPlan}`));
  return blocks;
}

function interventionsTable(pkg: LessonPackage) {
  const cell = (text: string | { description?: string; text?: string }) => {
    const normalizedText = typeof text === "string" ? text : text?.description ?? text?.text ?? "";
    return new TableCell({
      width: { size: 33.3, type: WidthType.PERCENTAGE },
      children: [new Paragraph({ children: [new TextRun(normalizedText)] })],
    });
  };

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
