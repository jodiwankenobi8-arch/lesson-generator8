import type { UploadedFileTraceMetadata, UploadedTextFile } from "../engine/blueprint/types";
import { readTextIfPossible } from "./readUploadedText";

type ExtractionMethod = "text" | "docx" | "pdf" | "pptx" | "fallback";

export type NormalizedExtractedSource = {
  name: string;
  kind: string;
  text: string;
  confidence: number;
  warnings: string[];
  metadata: UploadedFileTraceMetadata;
};

function extensionOf(file: File): string {
  const match = /\.([a-z0-9]+)$/i.exec(file.name);
  return match ? match[1].toLowerCase() : "";
}

function detectExtractionMethod(file: File): ExtractionMethod {
  const lowerName = file.name.toLowerCase();
  const mime = (file.type || "").toLowerCase();

  if (lowerName.endsWith(".txt") || lowerName.endsWith(".md") || mime.startsWith("text/")) {
    return "text";
  }

  if (lowerName.endsWith(".docx")) {
    return "docx";
  }

  if (lowerName.endsWith(".pdf") || mime.includes("pdf")) {
    return "pdf";
  }

  if (
    lowerName.endsWith(".ppt") ||
    lowerName.endsWith(".pptx") ||
    mime.includes("presentation") ||
    mime.includes("powerpoint")
  ) {
    return "pptx";
  }

  return "fallback";
}

function detectConfidence(method: ExtractionMethod, text: string): number {
  const lower = text.toLowerCase();

  if (lower.includes("text extraction failed") || lower.includes("not available yet")) {
    return 0.35;
  }

  if (method === "text") return 0.98;
  if (method === "docx") return 0.85;
  if (method === "pdf") return 0.8;
  if (method === "pptx") return 0.78;
  return 0.35;
}

function buildWarnings(text: string, method: ExtractionMethod): string[] {
  const warnings: string[] = [];
  const lower = text.toLowerCase();

  if (method === "fallback") {
    warnings.push("Text extraction is not available yet for this file type; using filename and file type as a source signal.");
  }

  if ((method === "pdf" || method === "pptx") && (lower.includes("text extraction failed") || lower.includes("not available yet"))) {
    warnings.push("This file type was recognized, but readable document text could not be extracted. Filename and file type are being used as fallback signals.");
  }

  if (!text.trim()) {
    warnings.push("No extracted text was available.");
  }

  return warnings;
}

export async function extractLessonMaterialSources(
  files: FileList | null
): Promise<NormalizedExtractedSource[]> {
  if (!files) return [];

  const extracted: NormalizedExtractedSource[] = [];

  for (const file of Array.from(files)) {
    const extractionMethod = detectExtractionMethod(file);
    const text = (await readTextIfPossible(file)) ?? "";

    extracted.push({
      name: file.name,
      kind: file.type || extensionOf(file) || "unknown",
      text,
      confidence: detectConfidence(extractionMethod, text),
      warnings: buildWarnings(text, extractionMethod),
      metadata: {
        extension: extensionOf(file),
        mimeType: file.type || "",
        extractionMethod,
      },
    });
  }

  return extracted;
}

export async function extractFilesToUploaded(files: FileList | null): Promise<UploadedTextFile[]> {
  const extracted = await extractLessonMaterialSources(files);

  return extracted.map((item) => ({
    name: item.name,
    kind: item.kind,
    text: item.text,
    confidence: item.confidence,
    warnings: item.warnings,
    metadata: item.metadata,
  }));
}
