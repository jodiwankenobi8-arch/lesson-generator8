import React from "react"
import type { MaterialFile } from "../../../engine/types"
import { orchardCardStyle, orchardTagStyle } from "../../orchardUi"
import { MaterialRow } from "./MaterialRow"

const filesSectionStyle: React.CSSProperties = {
  ...orchardCardStyle,
  marginTop: "var(--space-md)",
  padding: 0,
  overflow: "hidden",
}

const filesDetailsStyle: React.CSSProperties = {
  display: "grid",
  gap: 0,
}

const filesSummaryStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
  padding: "16px 18px",
  cursor: "pointer",
  userSelect: "none",
}

const filesBodyStyle: React.CSSProperties = {
  display: "grid",
  gap: 12,
  padding: "0 18px 18px",
}

const listStyle: React.CSSProperties = {
  display: "grid",
  gap: 12,
}

type UploadedMaterialsSectionProps = {
  materials: MaterialFile[]
  readyCount: number
  processingCount: number
  errorCount: number
  onRemoveMaterial: (materialId: string) => void
  renderMaterialDetails: (material: MaterialFile) => React.ReactNode
}

export function UploadedMaterialsSection({
  materials,
  readyCount,
  processingCount,
  errorCount,
  onRemoveMaterial,
  renderMaterialDetails,
}: UploadedMaterialsSectionProps) {
  return (
    <div style={filesSectionStyle}>
      {materials.length === 0 ? (
        <div style={{ padding: "18px" }}>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>
            No files added yet. Upload curriculum or exemplar files above.
          </p>
        </div>
      ) : (
        <details style={filesDetailsStyle}>
          <summary style={filesSummaryStyle}>
            <span style={{ fontWeight: 700, color: "var(--orchard-green)" }}>Files in this lesson</span>
            <span style={orchardTagStyle("neutral")}>
              {readyCount} ready
              {processingCount > 0 ? ` · ${processingCount} processing` : ""}
              {errorCount > 0 ? ` · ${errorCount} needs attention` : ""}
            </span>
          </summary>

          <div style={filesBodyStyle}>
            <div style={listStyle}>
              {materials.map((material) => (
                <MaterialRow key={material.id} material={material} onRemove={onRemoveMaterial}>
                  {renderMaterialDetails(material)}
                </MaterialRow>
              ))}
            </div>
          </div>
        </details>
      )}
    </div>
  )
}
