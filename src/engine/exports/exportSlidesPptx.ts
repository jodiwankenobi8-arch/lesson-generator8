import PptxGenJS from "pptxgenjs";
import type { LessonPackage, Slide } from "../types";

function getFrameworkLabel(pkg: LessonPackage) {
  const firstHeading = pkg.lessonPlan?.[0]?.heading || "";
  if (/navigation/i.test(firstHeading)) return "clickableHub";
  if (/bridge/i.test(firstHeading)) return "guidepost";
  return "linear";
}

function getSlideBodyText(s: Slide) {
  const bullets = s.bullets?.filter(Boolean) ?? [];
  if (bullets.length > 0) return bullets.map((b) => `� ${b}`).join("\n");
  if (s.text) return String(s.text);
  if (s.body) return String(s.body);
  return "";
}

export async function exportSlidesPptx(pkg: LessonPackage) {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";

  pptx.author = "Lesson Generator";
  pptx.company = "Lesson Generator";
  pptx.subject = `${pkg.input.subject} Grade ${pkg.input.grade}`;
  pptx.title = pkg.input.lessonTitle;

  const W = 13.33;
  const H = 7.5;
  const framework = getFrameworkLabel(pkg);

  const topBarColor =
    framework === "clickableHub"
      ? "1D4ED8"
      : framework === "guidepost"
        ? "0F766E"
        : "0F172A";

  const accentLabel =
    framework === "clickableHub"
      ? "Framework: Clickable Hub"
      : framework === "guidepost"
        ? "Framework: Guidepost"
        : "Framework: Linear";

  const addStandardSlide = (s: Slide, index: number) => {
    const slide = pptx.addSlide();

    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: W,
      h: 1.05,
      fill: { color: topBarColor },
      line: { color: topBarColor },
    });

    slide.addText(s.title || `Slide ${index + 1}`, {
      x: 0.6,
      y: 0.22,
      w: W - 1.2,
      h: 0.45,
      fontFace: "Calibri",
      fontSize: 28,
      color: "FFFFFF",
      bold: true,
    });

    slide.addText(accentLabel, {
      x: 0.6,
      y: 0.64,
      w: 2.8,
      h: 0.2,
      fontFace: "Calibri",
      fontSize: 12,
      color: "E5E7EB",
      bold: false,
    });

    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.75,
      y: 1.35,
      w: W - 1.5,
      h: H - 2.0,
      fill: { color: "FFFFFF" },
      line: { color: "E5E7EB" },
    });

    const bodyText = getSlideBodyText(s);

    slide.addText(bodyText || " ", {
      x: 1.05,
      y: 1.72,
      w: W - 2.1,
      h: H - 3.0,
      fontFace: "Calibri",
      fontSize: 22,
      color: "111827",
      valign: "top",
      breakLine: false,
      margin: 0,
    });

    if (s.teacherNotes) {
      slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.95,
        y: H - 1.15,
        w: W - 1.9,
        h: 0.5,
        fill: { color: "F8FAFC" },
        line: { color: "CBD5E1" },
      });

      slide.addText(`Teacher note: ${s.teacherNotes}`, {
        x: 1.1,
        y: H - 1.02,
        w: W - 2.2,
        h: 0.24,
        fontFace: "Calibri",
        fontSize: 10,
        color: "475569",
        italic: true,
        fit: "shrink",
        margin: 0,
      });
    }

    slide.addText(`${pkg.input.date}  �  ${pkg.input.subject}  �  Grade ${pkg.input.grade}`, {
      x: 0.75,
      y: H - 0.45,
      w: W - 1.5,
      h: 0.2,
      fontFace: "Calibri",
      fontSize: 11,
      color: "6B7280",
      align: "right",
      margin: 0,
    });
  };

  pkg.slides.forEach((s, i) => addStandardSlide(s, i));

  const safeTitle = sanitizeFilename(pkg.input.lessonTitle || "lesson");
  const filename = `${safeTitle}_${pkg.input.date}_slides.pptx`;

  await pptx.writeFile({ fileName: filename });
}

function sanitizeFilename(name: string) {
  return name
    .trim()
    .replace(/[\/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, "_")
    .slice(0, 80);
}
