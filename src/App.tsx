import React, { Suspense } from "react"
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom"
import { useLessonStore } from "./state/useLessonStore"

const InputsPage = React.lazy(() => import("./pages/InputsPage"))
const MaterialsPage = React.lazy(() => import("./pages/MaterialsPage"))`r`nconst ResultsPage = React.lazy(() => import("./pages/ResultsPage"))

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
    padding: "10px 16px",
    borderRadius: "999px",
    textDecoration: "none",
    border: `1px solid ${disabled ? "var(--border-soft)" : "var(--moss-green)"}`,
    background: location.pathname === path ? "var(--orchard-green)" : "var(--paper-white)",
    color: disabled
      ? "var(--text-secondary)"
      : location.pathname === path
        ? "var(--paper-white)"
        : "var(--orchard-green)",
    fontWeight: 600,
    pointerEvents: disabled ? "none" : "auto",
    opacity: disabled ? 0.65 : 1,
    boxShadow: "var(--shadow-soft)",
    transition: "all 0.15s ease",
  })

  return (
    <div style={{ marginBottom: "var(--space-xl)" }}>
      <nav
        style={{
          display: "flex",
          gap: "var(--space-sm)",
          flexWrap: "wrap",
          marginBottom: resultsBlockedReason ? "var(--space-sm)" : 0,
        }}
      >
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
            padding: "12px 14px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-soft)",
            background: "var(--paper-white)",
            color: "var(--text-secondary)",
            fontSize: 14,
            boxShadow: "var(--shadow-soft)",
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
        padding: "32px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            marginBottom: "var(--space-lg)",
            padding: "var(--space-lg)",
            borderRadius: "var(--radius-lg)",
            background: "linear-gradient(135deg, var(--paper-white), #fdfaf3)",
            border: "1px solid var(--border-soft)",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "6px 12px",
              marginBottom: "var(--space-sm)",
              borderRadius: "999px",
              background: "rgba(230, 201, 143, 0.28)",
              color: "var(--warm-brown)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.3,
              textTransform: "uppercase",
            }}
          >
            Teacher Planning Studio
          </div>

          <h1
            style={{
              marginTop: 0,
              marginBottom: "var(--space-xs)",
              fontFamily: "var(--font-heading)",
              fontSize: 40,
              lineHeight: 1.1,
              color: "var(--orchard-green)",
            }}
          >
            Lesson Generator 8
          </h1>

          <p
            style={{
              marginTop: 0,
              marginBottom: 0,
              color: "var(--text-secondary)",
              fontSize: 16,
              maxWidth: 720,
            }}
          >
            Build teacher-friendly lesson packages from lesson inputs, curriculum materials, and exemplar materials with clear traceability.
          </p>
        </div>

        <div
          style={{
            background: "var(--paper-white)",
            border: "1px solid var(--border-soft)",
            borderRadius: 24,
            boxShadow: "var(--shadow-card)",
            padding: "var(--space-xl)",
          }}
        >
          <StepNav />

          <Suspense
            fallback={
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-soft)",
                  background: "var(--paper-white)",
                  color: "var(--text-secondary)",
                  fontSize: 14,
                }}
              >
                Loading page...
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Navigate to="/inputs" replace />} />
              <Route path="/inputs" element={<InputsPage />} />
              <Route path="/materials" element={<MaterialsPage />} />
              <Route path="/results" element={<ResultsPage />} />
            </Routes>
          </Suspense>
        </div>
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
