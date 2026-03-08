import type { UploadedTextFile } from "../engine/blueprint/types";

function extensionOf(file: File): string {
  const parts = file.name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

function cleanSingleLineText(value?: string | null): string | undefined {
  const cleaned = String(value || "")
    .replace(/\u0000/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || undefined;
}

function cleanMultilineText(value?: string | null): string | undefined {
  const cleaned = String(value || "")
    .replace(/\u0000/g, " ")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return cleaned || undefined;
}

async function readDocx(file: File): Promise<string | undefined> {
  try {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return cleanMultilineText(result.value);
  } catch (error) {
    console.warn("DOCX extraction failed", error);
    return undefined;
  }
}

async function readPdf(file: File): Promise<string | undefined> {
  try {
    const pdfjs: any = await import("pdfjs-dist/legacy/build/pdf.mjs");

    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString();
    }

    const data = new Uint8Array(await file.arrayBuffer());
    const pdf = await pdfjs.getDocument({ data }).promise;
    const pages: string[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageText = cleanSingleLineText(
        textContent.items
          .map((item: any) => (typeof item?.str === "string" ? item.str : ""))
          .join(" "),
      );

      if (pageText) {
        pages.push(`Page ${pageNumber}: ${pageText}`);
      }
    }

    return cleanMultilineText(pages.join("\n\n"));
  } catch (error) {
    console.warn("PDF extraction failed", error);
    return undefined;
  }
}

function getSlideNumberFromPath(path: string): number {
  const match = path.match(/slide(\d+)\.xml$/i);
  return match ? Number(match[1]) : 0;
}

function getXmlText(xml: string): string {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  const primaryNodes = Array.from(doc.getElementsByTagName("a:t"));
  const fallbackNodes = Array.from(doc.getElementsByTagName("t"));
  const nodes = primaryNodes.length ? primaryNodes : fallbackNodes;

  return nodes
    .map((node) => node.textContent || "")
    .filter(Boolean)
    .join(" ");
}

async function readPptx(file: File): Promise<string | undefined> {
  try {
    const { default: JSZip } = await import("jszip");
    const zip = await JSZip.loadAsync(await file.arrayBuffer());

    const slidePaths = Object.keys(zip.files)
      .filter((path) => /^ppt\/slides\/slide\d+\.xml$/i.test(path))
      .sort((a, b) => getSlideNumberFromPath(a) - getSlideNumberFromPath(b));

    const extractedSlides: string[] = [];

    for (const slidePath of slidePaths) {
      const entry = zip.file(slidePath);
      if (!entry) continue;

      const xml = await entry.async("string");
      const slideText = cleanSingleLineText(getXmlText(xml));

      if (slideText) {
        extractedSlides.push(`Slide ${getSlideNumberFromPath(slidePath)}: ${slideText}`);
      }
    }

    return cleanMultilineText(extractedSlides.join("\n\n"));
  } catch (error) {
    console.warn("PPTX extraction failed", error);
    return undefined;
  }
}

function fallbackTextForFile(file: File): string {
  const ext = extensionOf(file);
  const lowerName = file.name.toLowerCase();
  const mime = (file.type || "").toLowerCase();

  if (lowerName.endsWith(".pdf") || mime.includes("pdf")) {
    return `PDF uploaded: ${file.name}. PDF text extraction failed, so use this file name and document type as a curriculum or exemplar signal.`;
  }

  if (
    lowerName.endsWith(".ppt") ||
    lowerName.endsWith(".pptx") ||
    mime.includes("presentation") ||
    mime.includes("powerpoint")
  ) {
    return `Slide deck uploaded: ${file.name}. Slide text extraction failed, so use this file name and deck format as a pacing or structure signal.`;
  }

  if (
    lowerName.endsWith(".jpg") ||
    lowerName.endsWith(".jpeg") ||
    lowerName.endsWith(".png") ||
    lowerName.endsWith(".webp") ||
    mime.startsWith("image/")
  ) {
    return `Image uploaded: ${file.name}. Image OCR or vision extraction is not available yet, so use this file name and image format as a lesson-material signal.`;
  }

  if (lowerName.endsWith(".doc")) {
    return `Word document uploaded: ${file.name}. Legacy .doc extraction is not available yet, so use this file name and document type as a content signal.`;
  }

  return `File uploaded: ${file.name}${ext ? ` (${ext.toUpperCase()})` : ""}. Text extraction is not available yet, so use this file name and file type as a source signal.`;
}

export async function readTextIfPossible(file: File): Promise<string | undefined> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".txt") || name.endsWith(".md") || file.type.startsWith("text/")) {
    return cleanMultilineText(await file.text());
  }

  if (name.endsWith(".docx")) {
    return (await readDocx(file)) || fallbackTextForFile(file);
  }

  if (name.endsWith(".pdf")) {
    return (await readPdf(file)) || fallbackTextForFile(file);
  }

  if (name.endsWith(".pptx")) {
    return (await readPptx(file)) || fallbackTextForFile(file);
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
