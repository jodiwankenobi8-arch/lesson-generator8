import React, { useMemo } from "react";
import type { LessonPackage as CanonicalLessonPackage } from "../types/lesson-package";
import * as resultsTraceSummaryModule from "../utils/results-trace-summary";
import {
  coerceSummaryLines,
  getCanonicalMaterialInfluenceRows,
  getCanonicalStandardVisibilityRows,
  getCanonicalTraceSummaryLines,
  summarizeStandardsSource,
} from "../utils/canonical-trace-selectors";
import {
  orchardCardStyle,
  orchardHelpTextStyle,
  orchardPillStyle,
  orchardSectionTitleStyle,
} from "../pages/orchardUi";

type ResultsTraceSummaryCardProps = {
  canonicalPackage: CanonicalLessonPackage | null;
};

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

export function ResultsTraceSummaryCard({
  canonicalPackage,
}: ResultsTraceSummaryCardProps) {
  const summaryLines = useMemo(() => {
    if (!canonicalPackage) return [];
    const moduleLines = getModuleSummaryLines(canonicalPackage);
    return moduleLines.length > 0 ? moduleLines : getCanonicalTraceSummaryLines(canonicalPackage);
  }, [canonicalPackage]);

  const warningMessages = useMemo(() => {
    if (!canonicalPackage) return [];
    return canonicalPackage.materials
      .flatMap((material) => material.warnings ?? [])
      .map((warning) => warning.message)
      .filter((message, index, all) => Boolean(message) && all.indexOf(message) === index)
      .slice(0, 6);
  }, [canonicalPackage]);

  const materialRows = useMemo(() => {
    if (!canonicalPackage) return [];
    return getCanonicalMaterialInfluenceRows(canonicalPackage).slice(0, 6);
  }, [canonicalPackage]);

  const standardRows = useMemo(() => {
    if (!canonicalPackage) return [];
    return getCanonicalStandardVisibilityRows(canonicalPackage).slice(0, 6);
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

      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <h3 style={orchardSectionTitleStyle()}>Materials influence visibility</h3>
          <p style={orchardHelpTextStyle()}>
            Canonical materials that influenced blueprint planning or generation output.
          </p>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {materialRows.length > 0 ? (
            materialRows.map((row) => (
              <div
                key={row.id}
                style={{
                  border: "1px solid #E7E2DA",
                  borderRadius: 14,
                  background: "#FFFFFF",
                  padding: "12px 14px",
                  display: "grid",
                  gap: 8,
                }}
              >
                <div style={{ fontWeight: 700, color: "#2F2F2F" }}>{row.name}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={orchardPillStyle("#F6F1E8", "#E7E2DA")}>{row.sourceKind}</span>
                  <span style={orchardPillStyle("#F6F1E8", "#E7E2DA")}>
                    confidence: {row.confidence}
                  </span>
                  <span style={orchardPillStyle("#F6F1E8", "#E7E2DA")}>
                    blueprint: {row.influencedBlueprint ? "yes" : "no"}
                  </span>
                  <span style={orchardPillStyle("#F6F1E8", "#E7E2DA")}>
                    generation: {row.influencedGeneration ? "yes" : "no"}
                  </span>
                  <span style={orchardPillStyle("#F6F1E8", "#E7E2DA")}>
                    warnings: {row.warningCount}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                border: "1px solid #E7E2DA",
                borderRadius: 14,
                background: "#FFFFFF",
                padding: "12px 14px",
                color: "#2F2F2F",
              }}
            >
              No canonical materials are recorded yet.
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <h3 style={orchardSectionTitleStyle()}>Standards visibility</h3>
          <p style={orchardHelpTextStyle()}>
            Canonical standards currently surfaced by the package and their provenance.
          </p>
        </div>

        <div style={{ display: "grid", gap: 10 }}>
          {standardRows.length > 0 ? (
            standardRows.map((row) => (
              <div
                key={`${row.code}-${row.source}`}
                style={{
                  border: "1px solid #E7E2DA",
                  borderRadius: 14,
                  background: "#FFFFFF",
                  padding: "12px 14px",
                  display: "grid",
                  gap: 8,
                }}
              >
                <div style={{ fontWeight: 700, color: "#2F2F2F" }}>{row.code}</div>
                <div style={{ color: "#2F2F2F", lineHeight: 1.5 }}>
                  {row.description || "(Description not available)"}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={orchardPillStyle("#F6F1E8", "#E7E2DA")}>source: {row.source}</span>
                  <span style={orchardPillStyle("#F6F1E8", "#E7E2DA")}>
                    confidence: {row.confidence}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                border: "1px solid #E7E2DA",
                borderRadius: 14,
                background: "#FFFFFF",
                padding: "12px 14px",
                color: "#2F2F2F",
              }}
            >
              No canonical standards are recorded yet.
            </div>
          )}
        </div>
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
