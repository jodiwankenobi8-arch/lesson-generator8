import PptxGenJS from "pptxgenjs";
import type { LessonPackage, Slide } from "../types";

export async function exportSlidesPptx(pkg: LessonPackage) {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5

  pptx.author = "Lesson Generator";
  pptx.company = "Lesson Generator";
  pptx.subject = `${pkg.input.subject} Grade ${pkg.input.grade}`;
  pptx.title = pkg.input.lessonTitle;

  const W = 13.33;
  const H = 7.5;

  const addStandardSlide = (s: Slide, index: number) => {
    const slide = pptx.addSlide();

    // Top bar
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

    // Body box
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.75,
      y: 1.45,
      w: W - 1.5,
      h: H - 2.1,
      fill: { color: "FFFFFF" },
      line: { color: "E5E7EB" },
      radius: 0.2,
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
