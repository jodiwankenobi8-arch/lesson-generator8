import React from "react"
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom"
import InputsPage from "./pages/InputsPage"
import MaterialsPage from "./pages/MaterialsPage"
import ResultsPage from "./pages/ResultsPage"
import { useLessonStore } from "./state/useLessonStore"

function StepNav() {
  const location = useLocation()
  const hasRequiredInputs = useLessonStore((state) => state.hasRequiredInputs)()
  const hasReadyMaterials = useLessonStore((state) => state.hasReadyMaterials)()
  const hasProcessingMaterials = useLessonStore((state) => state.hasProcessingMaterials)()
  const counts = useLessonStore((state) => state.getMaterialCounts)()

  const resultsBlockedReason = getResultsBlockedReason({
    hasRequiredInputs,
    hasReadyMaterials,
    hasProcessingMaterials,
    processingCount: counts.uploaded + counts.extracting + counts.analyzing,
  })

  const linkStyle = (path: string, disabled = false): React.CSSProperties => ({
    padding: "10px 14px",
    borderRadius: "999px",
    textDecoration: "none",
    border: "1px solid #d1d5db",
    background: location.pathname === path ? "#111827" : "#ffffff",
    color: disabled ? "#9ca3af" : location.pathname === path ? "#ffffff" : "#111827",
    fontWeight: 600,
    pointerEvents: disabled ? "none" : "auto",
    opacity: disabled ? 0.65 : 1,
  })

  return (
    <div style={{ marginBottom: 24 }}>
      <nav style={{ display: "flex", gap: 12, marginBottom: resultsBlockedReason ? 10 : 0 }}>
        <Link to="/inputs" style={linkStyle("/inputs")}>
          Inputs
        </Link>
        <Link to="/materials" style={linkStyle("/materials")}>
          Materials
        </Link>
        <Link to="/results" style={linkStyle("/results", Boolean(resultsBlockedReason))}>
          Results
        </Link>
      </nav>

      {resultsBlockedReason && (
        <div
          style={{
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            color: "#4b5563",
            fontSize: 14,
          }}
        >
          {resultsBlockedReason}
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f5ef",
        padding: "32px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          background: "#fffdf8",
          border: "1px solid #e5e7eb",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>Lesson Generator 8</h1>
        <p style={{ marginTop: 0, marginBottom: 24, color: "#4b5563" }}>
          Teacher-facing lesson package generator
        </p>

        <StepNav />

        <Routes>
          <Route path="/" element={<Navigate to="/inputs" replace />} />
          <Route path="/inputs" element={<InputsPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </div>
  )
}

function getResultsBlockedReason({
  hasRequiredInputs,
  hasReadyMaterials,
  hasProcessingMaterials,
  processingCount,
}: {
  hasRequiredInputs: boolean
  hasReadyMaterials: boolean
  hasProcessingMaterials: boolean
  processingCount: number
}): string | null {
  if (!hasRequiredInputs) {
    return "Results stay locked until all required lesson inputs are completed."
  }

  if (hasProcessingMaterials) {
    return `Results stay locked until material processing finishes. Currently processing: ${processingCount}.`
  }

  if (!hasReadyMaterials) {
    return "Results stay locked until at least one curriculum or exemplar material is ready."
  }

  return null
}
