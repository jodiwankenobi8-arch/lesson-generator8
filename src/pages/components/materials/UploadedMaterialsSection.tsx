import React from "react"
import type { MaterialFile } from "../../../engine/types"
import { orchardCardStyle, orchardTagStyle } from "../../orchardUi"
import { MaterialRow } from "./MaterialRow"
import emptyStateAppleAccent from "../../../assets/visual/extra-orchard-elements/apple-stickers-01-single-apple-moss.png"

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

const emptyStateContainerStyle: React.CSSProperties = {
  position: "relative",
  padding: "18px",
}

const emptyStateTextStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  margin: 0,
  maxWidth: "calc(100% - clamp(56px, 15vw, 92px))",
}

const emptyStateAccentStyle: React.CSSProperties = {
  position: "absolute",
  top: 10,
  right: 10,
  width: "clamp(34px, 9vw, 52px)",
  height: "auto",
  opacity: 0.9,
  pointerEvents: "none",
  userSelect: "none",
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
        <div style={emptyStateContainerStyle}>
          <img src={emptyStateAppleAccent} alt="" aria-hidden="true" style={emptyStateAccentStyle} />
          <p style={emptyStateTextStyle}>
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
