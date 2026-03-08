import React, { useMemo } from "react";
import type { LessonPackage as CanonicalLessonPackage } from "../types/lesson-package";
import * as resultsTraceSummaryModule from "../utils/results-trace-summary";
import {
  orchardCardStyle,
  orchardHelpTextStyle,
  orchardPillStyle,
  orchardSectionTitleStyle,
} from "../pages/orchardUi";

type ResultsTraceSummaryCardProps = {
  canonicalPackage: CanonicalLessonPackage | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function pushString(bucket: string[], value: unknown) {
  if (typeof value !== "string") return;
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return;
  if (!bucket.includes(normalized)) bucket.push(normalized);
}

function collectStrings(value: unknown, bucket: string[], seen = new Set<unknown>()) {
  if (value == null || seen.has(value)) return;
  seen.add(value);

  if (typeof value === "string") {
    pushString(bucket, value);
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, bucket, seen);
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
      if (key in value) collectStrings(value[key], bucket, seen);
    }

    for (const key of Object.keys(value)) {
      if (!preferredKeys.includes(key)) collectStrings(value[key], bucket, seen);
    }
  }
}

function coerceSummaryLines(value: unknown): string[] {
  const bucket: string[] = [];
  collectStrings(value, bucket);
  return bucket.slice(0, 8);
}

function getModuleSummaryLines(pkg: CanonicalLessonPackage): string[] {
  const mod = resultsTraceSummaryModule as Record<string, unknown>;
  const candidateNames = [
    "buildResultsTraceSummary",
    "getResultsTraceSummary",
    "summarizeResultsTrace",
    "createResultsTraceSummary",
    "makeResultsTraceSummary",
  ];

  for (const name of candidateNames) {
    const candidate = mod[name];
    if (typeof candidate !== "function") continue;

    try {
      const result = (candidate as (pkg: CanonicalLessonPackage) => unknown)(pkg);
      const lines = coerceSummaryLines(result);
      if (lines.length > 0) return lines;
    } catch {
      // fall through to next candidate
    }
  }

  return [];
}

function extractStandardsSourceLabels(value: unknown, bucket: string[]) {
  if (typeof value === "string") {
    const normalized = value.trim();
    if (normalized && !bucket.includes(normalized)) bucket.push(normalized);
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) extractStandardsSourceLabels(item, bucket);
    return;
  }

  if (isRecord(value)) {
    const preferred = [value.sourceName, value.sourceKind, value.note, value.confidence];
    for (const item of preferred) {
      if (typeof item === "string") {
        const normalized = item.trim();
        if (normalized && !bucket.includes(normalized)) bucket.push(normalized);
      }
    }
  }
}

function summarizeStandardsSource(value: unknown): string {
  const labels: string[] = [];
  extractStandardsSourceLabels(value, labels);

  if (labels.length === 0) return "unknown";
  if (labels.length <= 3) return labels.join(" • ");
  return `${labels.slice(0, 3).join(" • ")} +${labels.length - 3} more`;
}

function getFallbackSummaryLines(pkg: CanonicalLessonPackage): string[] {
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

export function ResultsTraceSummaryCard({
  canonicalPackage,
}: ResultsTraceSummaryCardProps) {
  const summaryLines = useMemo(() => {
    if (!canonicalPackage) return [];
    const moduleLines = getModuleSummaryLines(canonicalPackage);
    return moduleLines.length > 0 ? moduleLines : getFallbackSummaryLines(canonicalPackage);
  }, [canonicalPackage]);

  const warningMessages = useMemo(() => {
    if (!canonicalPackage) return [];
    return canonicalPackage.materials
      .flatMap((material) => material.warnings ?? [])
      .map((warning) => warning.message)
      .filter((message, index, all) => Boolean(message) && all.indexOf(message) === index)
      .slice(0, 6);
  }, [canonicalPackage]);

  const standardsSourceText = useMemo(() => {
    if (!canonicalPackage) return "unknown";
    return summarizeStandardsSource(canonicalPackage.trace?.standardsSource);
  }, [canonicalPackage]);

  if (!canonicalPackage) return null;

  return (
    <section style={{ ...orchardCardStyle, display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 6 }}>
          <h2 style={orchardSectionTitleStyle()}>Traceable Results</h2>
          <p style={orchardHelpTextStyle()}>
            This panel reads from the canonical LessonPackage so materials influence, standards
            influence, and trace metadata stay visible without replacing the live engine package
            already used elsewhere on this page.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-start" }}>
          <span style={orchardPillStyle("#F6F1E8", "#E7E2DA")}>canonical package</span>
          <span style={orchardPillStyle("#F6F1E8", "#E7E2DA")}>
            materials: {canonicalPackage.materials.length}
          </span>
          <span style={orchardPillStyle("#F6F1E8", "#E7E2DA")}>
            standards: {canonicalPackage.standards.length}
          </span>
          <span style={orchardPillStyle("#F6F1E8", "#E7E2DA")}>
            source: {standardsSourceText}
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {summaryLines.map((line, index) => (
          <div
            key={`${index}-${line}`}
            style={{
              border: "1px solid #E7E2DA",
              borderRadius: 14,
              background: "#FFFFFF",
              padding: "12px 14px",
              color: "#2F2F2F",
              lineHeight: 1.5,
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {warningMessages.length > 0 ? (
        <div
          style={{
            border: "1px solid #E7E2DA",
            borderRadius: 14,
            background: "#FFF9F4",
            padding: "12px 14px",
            display: "grid",
            gap: 8,
          }}
        >
          <div style={{ fontWeight: 700, color: "#3F5A40" }}>Captured extraction warnings</div>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#2F2F2F", lineHeight: 1.5 }}>
            {warningMessages.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
