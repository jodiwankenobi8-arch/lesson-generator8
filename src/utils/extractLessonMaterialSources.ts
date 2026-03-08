import type { UploadedTextFile } from "../engine/blueprint/types";
import { readTextIfPossible } from "./readUploadedText";

export type NormalizedExtractedSource = {
  name: string;
  kind: string;
  text: string;
  confidence: number;
  warnings: string[];
  metadata: {
    extension: string;
    mimeType: string;
    extractionMethod: "text" | "docx" | "fallback";
  };
};

function extensionOf(file: File): string {
  const match = /\.([a-z0-9]+)$/i.exec(file.name);
  return match ? match[1].toLowerCase() : "";
}

function detectExtractionMethod(file: File): "text" | "docx" | "fallback" {
  const lowerName = file.name.toLowerCase();

  if (lowerName.endsWith(".txt") || lowerName.endsWith(".md") || file.type.startsWith("text/")) {
    return "text";
  }

  if (lowerName.endsWith(".docx")) {
    return "docx";
  }

  return "fallback";
}

function detectConfidence(method: "text" | "docx" | "fallback"): number {
  if (method === "text") return 0.98;
  if (method === "docx") return 0.85;
  return 0.35;
}

function buildWarnings(text: string, method: "text" | "docx" | "fallback"): string[] {
  const warnings: string[] = [];

  if (method === "fallback") {
    warnings.push("Text extraction is not available yet for this file type; using filename and file type as a source signal.");
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
      confidence: detectConfidence(extractionMethod),
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
  }));
}