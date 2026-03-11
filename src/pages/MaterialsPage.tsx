import React from "react"
import { useLessonStore } from "../state/useLessonStore"

const cardStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 16,
  background: "#ffffff",
}

const buttonStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #d1d5db",
  background: "#f9fafb",
  cursor: "pointer",
  fontWeight: 600,
}

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: "12px 0",
  borderTop: "1px solid #f3f4f6",
  gap: 16,
}

const summaryGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 12,
  marginBottom: 20,
}

export default function MaterialsPage() {
  const materials = useLessonStore((state) => state.materials)
  const addMaterial = useLessonStore((state) => state.addMaterial)
  const counts = useLessonStore((state) => state.getMaterialCounts)()
  const hasProcessingMaterials = useLessonStore((state) => state.hasProcessingMaterials)()
  const hasReadyMaterials = useLessonStore((state) => state.hasReadyMaterials)()

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Materials</h2>
      <p style={{ color: "#4b5563", marginBottom: 24 }}>
        Upload curriculum and exemplar files. Materials appear immediately and
        stay visible while they move through upload, scanning, analysis, and ready states.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Curriculum</h3>
          <p style={{ color: "#6b7280" }}>
            Teaching content authority: standards, word lists, texts, examples,
            and practice activities.
          </p>
          <button style={buttonStyle} onClick={() => addMaterial("curriculum")}>
            Add Curriculum File
          </button>
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Exemplar</h3>
          <p style={{ color: "#6b7280" }}>
            Presentation authority: slide order, pacing, prompts, layout, and timing.
          </p>
          <button style={buttonStyle} onClick={() => addMaterial("exemplar")}>
            Add Exemplar File
          </button>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Status Overview</h3>

        <div style={summaryGridStyle}>
          <SummaryCard label="Total" value={counts.total} />
          <SummaryCard label="Ready" value={counts.ready} />
          <SummaryCard label="Processing" value={counts.uploaded + counts.extracting + counts.analyzing} />
          <SummaryCard label="Errors" value={counts.error} />
        </div>

        <div style={noticeStyle(hasProcessingMaterials ? "processing" : hasReadyMaterials ? "ready" : "idle")}>
          {hasProcessingMaterials
            ? "Results stay blocked until all uploaded materials finish processing."
            : hasReadyMaterials
              ? "At least one material is ready. You can continue once your inputs are complete."
              : "Add curriculum or exemplar files to begin analysis."}
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: 16 }}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Processing Status</h3>

        {materials.length === 0 ? (
          <p style={{ color: "#6b7280", marginBottom: 0 }}>
            No materials added yet.
          </p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {materials.map((material) => (
              <div key={material.id} style={rowStyle}>
                <div>
                  <div style={{ fontWeight: 600 }}>{material.name}</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                    <span style={roleBadgeStyle(material.role)}>{material.role}</span>
                    <span style={statusBadgeStyle(material.status)}>{formatStatus(material.status)}</span>
                  </div>

                  {material.analysis && (
                    <div style={{ marginTop: 8, fontSize: 13, color: "#4b5563" }}>
                      {material.analysis.summary}
                    </div>
                  )}

                  {material.errorMessage && (
                    <div style={{ marginTop: 8, fontSize: 13, color: "#b91c1c" }}>
                      {material.errorMessage}
                    </div>
                  )}
                </div>

                <div style={{ minWidth: 160, textAlign: "right", color: "#6b7280", fontSize: 13 }}>
                  {getStatusExplanation(material.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        border: "1px solid #f3f4f6",
        borderRadius: 12,
        padding: 12,
        background: "#fafafa",
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
    </div>
  )
}

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function getStatusExplanation(status: string): string {
  if (status === "uploaded") return "Queued for scanning"
  if (status === "scanning") return "Extracting file contents"
  if (status === "analyzing") return "Building lesson signals"
  if (status === "ready") return "Available for lesson generation"
  return "Needs attention"
}

function roleBadgeStyle(role: string): React.CSSProperties {
  return {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    background: role === "curriculum" ? "#eff6ff" : "#f5f3ff",
    color: role === "curriculum" ? "#1d4ed8" : "#6d28d9",
    textTransform: "capitalize",
  }
}

function statusBadgeStyle(status: string): React.CSSProperties {
  const palette =
    status === "ready"
      ? { background: "#ecfdf5", color: "#047857" }
      : status === "error"
        ? { background: "#fef2f2", color: "#b91c1c" }
        : { background: "#fff7ed", color: "#c2410c" }

  return {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    background: palette.background,
    color: palette.color,
  }
}

function noticeStyle(mode: "idle" | "processing" | "ready"): React.CSSProperties {
  const palette =
    mode === "ready"
      ? { background: "#ecfdf5", border: "#a7f3d0", color: "#065f46" }
      : mode === "processing"
        ? { background: "#fff7ed", border: "#fed7aa", color: "#9a3412" }
        : { background: "#f9fafb", border: "#e5e7eb", color: "#4b5563" }

  return {
    padding: "12px 14px",
    borderRadius: 12,
    border: `1px solid ${palette.border}`,
    background: palette.background,
    color: palette.color,
  }
}

