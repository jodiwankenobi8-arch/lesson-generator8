import React from "react"
import type { MaterialFile } from "../../../engine/types"
import { orchardTagStyle } from "../../orchardUi"
import {
  formatRoleLabel,
  formatStatus,
  roleBadgeStyle,
  secondaryButtonStyle,
  statusBadgeStyle,
} from "../../materialsPageUiHelpers"
import {
  getExtractionMethodLabel,
  getTeacherVisibleMaterialNote,
  getTeacherVisibleMaterialSummary,
} from "../../materialsPageUploadHelpers"

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "var(--space-md)",
  padding: "14px 0",
  borderTop: "1px solid var(--border-paper)",
}

const materialMetaStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 6,
}

const materialSummaryStripBaseStyle: React.CSSProperties = {
  border: "1px solid var(--border-paper)",
  borderRadius: "var(--radius-sm)",
  padding: "8px 10px",
  marginTop: 8,
  display: "grid",
  gap: 6,
  background: "rgba(255,255,255,0.85)",
}

const materialSummaryHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 8,
  flexWrap: "wrap",
}

const materialSummaryListStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: 16,
  display: "grid",
  gap: 4,
  color: "var(--text-secondary)",
  fontSize: 12,
  lineHeight: 1.45,
}

const materialSummaryNextStepStyle: React.CSSProperties = {
  fontSize: 12,
  color: "var(--text-secondary)",
  lineHeight: 1.45,
}

const materialStatusTextStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: 13,
  lineHeight: 1.5,
  textAlign: "right",
}

type MaterialRowProps = {
  material: MaterialFile
  onRemove: (materialId: string) => void
  children?: React.ReactNode
}

export function MaterialRow({ material, onRemove, children }: MaterialRowProps) {
  const summary = getTeacherVisibleMaterialSummary(material)

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={rowStyle}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: "var(--text-primary)", wordBreak: "break-word" }}>
            {material.name}
          </div>

          <div style={materialMetaStyle}>
            <span style={roleBadgeStyle(material.role)}>{formatRoleLabel(material.role)}</span>
            <span style={statusBadgeStyle(material.status)}>{formatStatus(material.status)}</span>
            {getExtractionMethodLabel(material) ? (
              <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>
                {getExtractionMethodLabel(material)}
              </span>
            ) : null}
          </div>

          {summary ? (
            <div
              style={{
                ...materialSummaryStripBaseStyle,
                ...(summary.tone === "strong"
                  ? {
                      border: "1px solid var(--border-moss)",
                      background: "rgba(110, 139, 107, 0.10)",
                    }
                  : summary.tone === "blocked"
                    ? {
                        border: "1px solid var(--border-cranberry)",
                        background: "rgba(184, 84, 90, 0.10)",
                      }
                    : {
                        border: "1px solid var(--border-honey)",
                        background: "rgba(242, 192, 120, 0.14)",
                      }),
              }}
            >
              <div style={materialSummaryHeaderStyle}>
                <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 12 }}>
                  What we found
                </div>
                <span
                  style={orchardTagStyle(
                    summary.tone === "strong"
                      ? "moss"
                      : summary.tone === "blocked"
                        ? "cranberry"
                        : "honey"
                  )}
                >
                  {summary.statusLabel}
                </span>
              </div>
              <ul style={materialSummaryListStyle}>
                {summary.summaryLines.map((line) => (
                  <li key={`${material.id}-${line}`}>{line}</li>
                ))}
              </ul>
              {summary.nextStep ? (
                <div style={materialSummaryNextStepStyle}>{summary.nextStep}</div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div style={{ minWidth: 220, display: "grid", gap: 8, justifyItems: "end" }}>
          <div style={materialStatusTextStyle}>{getTeacherVisibleMaterialNote(material)}</div>
          {material.errorMessage && material.status !== "error" ? (
            <div style={{ ...materialStatusTextStyle, color: "var(--cranberry)" }}>
              {material.errorMessage}
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => onRemove(material.id)}
            style={secondaryButtonStyle()}
          >
            Remove
          </button>
        </div>
      </div>

      {children}
    </div>
  )
}
