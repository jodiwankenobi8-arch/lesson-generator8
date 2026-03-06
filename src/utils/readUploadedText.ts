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

export async function readTextIfPossible(file: File): Promise<string | undefined> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".txt") || name.endsWith(".md") || file.type.startsWith("text/")) {
    return file.text();
  }
  if (name.endsWith(".docx")) {
    return readDocx(file);
  }
  return undefined;
}

export async function filesToUploaded(files: FileList | null): Promise<UploadedTextFile[]> {
  if (!files) return [];
  const uploaded: UploadedTextFile[] = [];
  for (const file of Array.from(files)) {
    const text = await readTextIfPossible(file);
    uploaded.push({
      name: file.name,
      kind: file.type || file.name.split(".").pop() || "unknown",
      text,
    });
  }
  return uploaded;
}
