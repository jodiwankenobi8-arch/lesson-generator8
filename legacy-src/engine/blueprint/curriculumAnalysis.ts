import type { UploadedTextFile } from "./types";
import { extractCoverageFromCurriculum as extractCanonical } from "../curriculum/extractCoverageFromCurriculum";

export type CoverageItem = {
  id: string;
  title: string;
  required: boolean;
  evidence?: string[];
};

export function extractCoverageFromCurriculum(files: UploadedTextFile[]): {
  summary: string;
  items: CoverageItem[];
} {
  return extractCanonical(files);
}
