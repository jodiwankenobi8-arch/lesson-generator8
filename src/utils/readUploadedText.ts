import type { UploadedTextFile } from "../engine/blueprint/types";

async function readDocx(file: File): Promise<string | undefined> {
  try {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return String(result.value || "").trim() || undefined;
  } catch (error) {
    console.warn("DOCX extraction failed", error);
    return undefined;
  }
}

function extensionOf(file: File): string {
  const parts = file.name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

function fallbackTextForFile(file: File): string {
  const ext = extensionOf(file);
  const lowerName = file.name.toLowerCase();
  const mime = (file.type || "").toLowerCase();

  if (lowerName.endsWith(".pdf") || mime.includes("pdf")) {
    return `PDF uploaded: ${file.name}. Full PDF text extraction is not available yet, so use this file name and document type as a curriculum/exemplar signal.`;
  }

  if (
    lowerName.endsWith(".ppt") ||
    lowerName.endsWith(".pptx") ||
    mime.includes("presentation") ||
    mime.includes("powerpoint")
  ) {
    return `Slide deck uploaded: ${file.name}. Full slide text extraction is not available yet, so use this file name and deck format as a pacing/structure signal.`;
  }

  if (
    lowerName.endsWith(".jpg") ||
    lowerName.endsWith(".jpeg") ||
    lowerName.endsWith(".png") ||
    lowerName.endsWith(".webp") ||
    mime.startsWith("image/")
  ) {
    return `Image uploaded: ${file.name}. Image OCR/vision extraction is not available yet, so use this file name and image format as a lesson-material signal.`;
  }

  if (lowerName.endsWith(".doc")) {
    return `Word document uploaded: ${file.name}. Legacy .doc extraction is not available yet, so use this file name and document type as a content signal.`;
  }

  return `File uploaded: ${file.name}${ext ? ` (${ext.toUpperCase()})` : ""}. Text extraction is not available yet, so use this file name and file type as a source signal.`;
}

export async function readTextIfPossible(file: File): Promise<string | undefined> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".txt") || name.endsWith(".md") || file.type.startsWith("text/")) {
    return file.text();
  }

  if (name.endsWith(".docx")) {
    const docxText = await readDocx(file);
    return docxText || fallbackTextForFile(file);
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
