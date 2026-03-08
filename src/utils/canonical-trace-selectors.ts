import { K_ELA_BEST_DATASET } from "../engine/standards/data/k_ela_best_dataset";
import type { LessonMaterial, LessonPackage, StandardRecord } from "../types/lesson-package";

export type CanonicalMaterialInfluenceRow = {
  id: string;
  name: string;
  sourceKind: LessonMaterial["sourceKind"];
  confidence: LessonMaterial["confidence"];
  influencedBlueprint: boolean;
  influencedGeneration: boolean;
  warningCount: number;
};

export type CanonicalStandardVisibilityRow = {
  code: string;
  description: string;
  source: StandardRecord["source"];
  confidence: StandardRecord["confidence"];
};

function normalizeStandardCode(value: unknown): string {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

function findDatasetStandardDescription(codeRaw: unknown): string {
  const code = normalizeStandardCode(codeRaw);
  if (!code) return "";
  const found = (K_ELA_BEST_DATASET as Array<Record<string, unknown>>).find(
    (standard) => normalizeStandardCode(standard?.code) === code,
  );
  return String(found?.label ?? found?.description ?? "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function pushUnique(bucket: string[], value: unknown) {
  const normalized = normalizeText(value);
  if (!normalized) return;
  if (!bucket.includes(normalized)) bucket.push(normalized);
}

function extractStringsDeep(value: unknown, bucket: string[], seen = new Set<unknown>()) {
  if (value == null || seen.has(value)) return;
  seen.add(value);

  if (typeof value === "string") {
    pushUnique(bucket, value);
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) extractStringsDeep(item, bucket, seen);
    return;
  }

  if (isRecord(value)) {
    const preferredKeys = [
      "summary",
      "highlights",
      "bullets",
      "lines",
      "items",
      "warnings",
      "materialLines",
      "standardLines",
      "traceLines",
      "notes",
      "message",
      "label",
      "value",
      "text",
      "title",
    ];

    for (const key of preferredKeys) {
      if (key in value) extractStringsDeep(value[key], bucket, seen);
    }

    for (const key of Object.keys(value)) {
      if (!preferredKeys.includes(key)) extractStringsDeep(value[key], bucket, seen);
    }
  }
}

export function coerceSummaryLines(value: unknown, limit = 8): string[] {
  const bucket: string[] = [];
  extractStringsDeep(value, bucket);
  return bucket.slice(0, limit);
}

export function summarizeStandardsSource(value: unknown): string {
  const bucket: string[] = [];

  if (typeof value === "string") {
    pushUnique(bucket, value);
  } else if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === "string") {
        pushUnique(bucket, item);
        continue;
      }

      if (isRecord(item)) {
        pushUnique(bucket, item.sourceName);
        pushUnique(bucket, item.sourceKind);
        pushUnique(bucket, item.note);
        pushUnique(bucket, item.confidence);
      }
    }
  } else if (isRecord(value)) {
    pushUnique(bucket, value.sourceName);
    pushUnique(bucket, value.sourceKind);
    pushUnique(bucket, value.note);
    pushUnique(bucket, value.confidence);
  }

  if (bucket.length === 0) return "unknown";
  if (bucket.length <= 3) return bucket.join(" • ");
  return `${bucket.slice(0, 3).join(" • ")} +${bucket.length - 3} more`;
}

export function getCanonicalMaterialInfluenceRows(
  pkg: LessonPackage,
): CanonicalMaterialInfluenceRow[] {
  return pkg.materials.map((material) => ({
    id: material.id,
    name: material.name,
    sourceKind: material.sourceKind,
    confidence: material.confidence,
    influencedBlueprint: Boolean(material.influencedBlueprint),
    influencedGeneration: Boolean(material.influencedGeneration),
    warningCount: Array.isArray(material.warnings) ? material.warnings.length : 0,
  }));
}

export function getCanonicalStandardVisibilityRows(
  pkg: LessonPackage,
): CanonicalStandardVisibilityRow[] {
  return pkg.standards.map((standard) => ({
    code: standard.code,
    description: standard.description,
    source: standard.source,
    confidence: standard.confidence,
  }));
}

export function getCompatibilityStandardVisibilityRows(
  rawStandards: Array<{
    code?: unknown;
    source?: unknown;
    confidence?: unknown;
  }>,
): CanonicalStandardVisibilityRow[] {
  return rawStandards.map((standard) => ({
    code: typeof standard?.code === "string" ? standard.code : "",
    description: findDatasetStandardDescription(standard?.code),
    source: String(standard?.source ?? "detected") as StandardRecord["source"],
    confidence: standard?.confidence as StandardRecord["confidence"],
  }));
}

export function getCanonicalTraceSummaryLines(pkg: LessonPackage): string[] {
  const materials = Array.isArray(pkg.materials) ? pkg.materials : [];
  const standards = Array.isArray(pkg.standards) ? pkg.standards : [];
  const warnings = materials.flatMap((material) => material.warnings ?? []);
  const blueprintInfluenceCount = materials.filter((material) => material.influencedBlueprint).length;
  const generationInfluenceCount = materials.filter((material) => material.influencedGeneration).length;
  const manualStandards = standards.filter((standard) => standard.source === "manual").length;
  const detectedStandards = standards.filter(
    (standard) => standard.source === "detected" || standard.source === "curriculum-derived",
  ).length;
  const unresolvedConflicts = Array.isArray(pkg.trace?.unresolvedConflicts)
    ? pkg.trace.unresolvedConflicts.length
    : 0;
  const manualOverrides = Array.isArray(pkg.trace?.manualOverrides)
    ? pkg.trace.manualOverrides.length
    : 0;
  const standardsSourceText = summarizeStandardsSource(pkg.trace?.standardsSource);

  return [
    `${materials.length} material(s) captured; ${blueprintInfluenceCount} influenced blueprint planning and ${generationInfluenceCount} influenced generation output.`,
    `${standards.length} standard(s) surfaced in the canonical package; ${manualStandards} manual and ${detectedStandards} detected or curriculum-derived.`,
    `Standards source trace: ${standardsSourceText}.`,
    `Slides: ${pkg.slides.length}; lesson blocks: ${pkg.lessonPlan.blocks.length}.`,
    `Export readiness - PPTX: ${pkg.exports.pptxReady ? "ready" : "not ready"}, DOCX: ${pkg.exports.docxReady ? "ready" : "not ready"}, ZIP: ${pkg.exports.zipReady ? "ready" : "not ready"}.`,
    unresolvedConflicts > 0
      ? `${unresolvedConflicts} unresolved trace conflict(s) still need review.`
      : "No unresolved trace conflicts are recorded.",
    manualOverrides > 0
      ? `${manualOverrides} manual override(s) are recorded in canonical trace metadata.`
      : "No manual overrides are recorded in canonical trace metadata.",
    warnings.length > 0
      ? `${warnings.length} extraction warning(s) were preserved on source materials.`
      : "No extraction warnings were preserved on source materials.",
  ].filter(Boolean);
}

