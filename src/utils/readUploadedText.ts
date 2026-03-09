import type { UploadedTextFile } from "../engine/blueprint/types";

function extensionOf(file: File): string {
  const parts = file.name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

function normalizeExtractedText(text: string): string {
  return String(text ?? "")
    .replace(/\u0000/g, " ")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function fallbackTextForFile(file: File): string {
  const ext = extensionOf(file);
  const lowerName = file.name.toLowerCase();
  const mime = (file.type || "").toLowerCase();

  if (lowerName.endsWith(".pdf") || mime.includes("pdf")) {
    return `PDF uploaded: ${file.name}. PDF extraction did not return readable text, so use this file name and document type as a curriculum/exemplar signal.`;
  }

  if (
    lowerName.endsWith(".ppt") ||
    lowerName.endsWith(".pptx") ||
    mime.includes("presentation") ||
    mime.includes("powerpoint")
  ) {
    return `Slide deck uploaded: ${file.name}. Slide extraction did not return readable text, so use this file name and deck format as a pacing/structure signal.`;
  }

  if (
    lowerName.endsWith(".jpg") ||
    lowerName.endsWith(".jpeg") ||
    lowerName.endsWith(".png") ||
    lowerName.endsWith(".webp") ||
    mime.startsWith("image/")
  ) {
    return `Image uploaded: ${file.name}. OCR/vision extraction did not return readable text, so use this file name and image format as a lesson-material signal.`;
  }

  if (lowerName.endsWith(".doc")) {
    return `Word document uploaded: ${file.name}. Legacy .doc extraction is not available yet, so use this file name and document type as a content signal.`;
  }

  return `File uploaded: ${file.name}${ext ? ` (${ext.toUpperCase()})` : ""}. Text extraction did not return readable text, so use this file name and file type as a source signal.`;
}

async function readDocx(file: File): Promise<string | undefined> {
  try {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = normalizeExtractedText(result.value || "");
    return text || undefined;
  } catch (error) {
    console.warn("DOCX extraction failed", error);
    return undefined;
  }
}

async function readPptx(file: File): Promise<string | undefined> {
  try {
    const JSZip = (await import("jszip")).default;
    const zip = await JSZip.loadAsync(await file.arrayBuffer());

    const parser = new DOMParser();
    const slideFiles = Object.keys(zip.files)
      .filter((name) => /ppt\/slides\/slide\d+\.xml$/i.test(name))
      .sort((a, b) => {
        const aNum = Number(a.match(/slide(\d+)\.xml$/i)?.[1] || 0);
        const bNum = Number(b.match(/slide(\d+)\.xml$/i)?.[1] || 0);
        return aNum - bNum;
      });

    const notesBySlide = new Map<number, string>();

    const noteFiles = Object.keys(zip.files)
      .filter((name) => /ppt\/notesSlides\/notesSlide\d+\.xml$/i.test(name))
      .sort((a, b) => {
        const aNum = Number(a.match(/notesSlide(\d+)\.xml$/i)?.[1] || 0);
        const bNum = Number(b.match(/notesSlide(\d+)\.xml$/i)?.[1] || 0);
        return aNum - bNum;
      });

    for (const noteFile of noteFiles) {
      const xml = await zip.file(noteFile)?.async("text");
      if (!xml) continue;
      const doc = parser.parseFromString(xml, "text/xml");
      const texts = Array.from(doc.getElementsByTagName("a:t"))
        .map((node) => node.textContent?.trim() || "")
        .filter(Boolean);
      const noteNum = Number(noteFile.match(/notesSlide(\d+)\.xml$/i)?.[1] || 0);
      const noteText = normalizeExtractedText(texts.join(" "));
      if (noteNum && noteText) notesBySlide.set(noteNum, noteText);
    }

    const sections: string[] = [];

    for (const slideFile of slideFiles) {
      const xml = await zip.file(slideFile)?.async("text");
      if (!xml) continue;

      const doc = parser.parseFromString(xml, "text/xml");
      const texts = Array.from(doc.getElementsByTagName("a:t"))
        .map((node) => node.textContent?.trim() || "")
        .filter(Boolean);

      const slideNum = Number(slideFile.match(/slide(\d+)\.xml$/i)?.[1] || 0);
      const merged = normalizeExtractedText(texts.join(" "));
      const notes = notesBySlide.get(slideNum);

      if (!merged && !notes) continue;

      const firstSentence =
        merged.split(/(?<=[.!?])\s+/).find(Boolean) ||
        merged.split(/\n/).find(Boolean) ||
        `Slide ${slideNum}`;

      sections.push(
        [
          `SLIDE ${slideNum}: ${firstSentence}`,
          merged ? `Text: ${merged}` : "",
          notes ? `Notes: ${notes}` : "",
        ]
          .filter(Boolean)
          .join("\n")
      );
    }

    const result = normalizeExtractedText(sections.join("\n\n"));
    return result || undefined;
  } catch (error) {
    console.warn("PPTX extraction failed", error);
    return undefined;
  }
}

async function readPdf(file: File): Promise<string | undefined> {
  try {
    const pdfjs = await import("pdfjs-dist");
    const arrayBuffer = await file.arrayBuffer();

    const loadingTask = pdfjs.getDocument({
      data: arrayBuffer,
      useWorkerFetch: false,
      isEvalSupported: false,
      disableFontFace: true,
      verbosity: 0,
    } as any);

    const pdf = await loadingTask.promise;
    const pageTexts: string[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      const text = normalizeExtractedText(
        (content.items as any[])
          .map((item: any) => ("str" in item ? item.str : ""))
          .join(" ")
      );

      if (text) {
        pageTexts.push(`PAGE ${pageNumber}: ${text}`);
      }
    }

    const result = normalizeExtractedText(pageTexts.join("\n\n"));
    return result || undefined;
  } catch (error) {
    console.warn("PDF extraction failed", error);
    return undefined;
  }
}

async function readImageWithOcr(file: File): Promise<string | undefined> {
  try {
    const Tesseract = await import("tesseract.js");
    const result = await Tesseract.recognize(file, "eng", {
      logger: () => {},
    });

    const text = normalizeExtractedText(result.data?.text || "");
    return text || undefined;
  } catch (error) {
    console.warn("Image OCR failed", error);
    return undefined;
  }
}

export async function readTextIfPossible(file: File): Promise<string | undefined> {
  const name = file.name.toLowerCase();
  const mime = (file.type || "").toLowerCase();

  if (name.endsWith(".txt") || name.endsWith(".md") || mime.startsWith("text/")) {
    return normalizeExtractedText(await file.text()) || fallbackTextForFile(file);
  }

  if (name.endsWith(".docx")) {
    return (await readDocx(file)) || fallbackTextForFile(file);
  }

  if (
    name.endsWith(".ppt") ||
    name.endsWith(".pptx") ||
    mime.includes("presentation") ||
    mime.includes("powerpoint")
  ) {
    return (await readPptx(file)) || fallbackTextForFile(file);
  }

  if (name.endsWith(".pdf") || mime.includes("pdf")) {
    return (await readPdf(file)) || fallbackTextForFile(file);
  }

  if (
    name.endsWith(".jpg") ||
    name.endsWith(".jpeg") ||
    name.endsWith(".png") ||
    name.endsWith(".webp") ||
    mime.startsWith("image/")
  ) {
    return (await readImageWithOcr(file)) || fallbackTextForFile(file);
  }

  return fallbackTextForFile(file);
}

export async function filesToUploaded(files: FileList | null): Promise<UploadedTextFile[]> {
  if (!files) return [];

  const uploaded: UploadedTextFile[] = [];

  for (const file of Array.from(files)) {
    const text = await readTextIfPossible(file);
    uploaded.push({
      name: file.name,
      kind: file.type || extensionOf(file) || "unknown",
      text,
    });
  }

  return uploaded;
}