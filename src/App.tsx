import React, { Suspense } from "react"
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom"
import {
  orchardHeroBodyStyle,
  orchardHeroCardStyle,
  orchardHeroRibbonStyle,
  orchardHeroTitleStyle,
  orchardMetaRowStyle,
  orchardNoticeStyle,
  orchardPageShellStyle,
  orchardPanelStyle,
  orchardStepLinkStyle,
  orchardWrapStyle,
} from "./pages/orchardUi"
import { useLessonStore } from "./state/useLessonStore"

const InputsPage = React.lazy(() => import("./pages/InputsPage"))
const MaterialsPage = React.lazy(() => import("./pages/MaterialsPage"))
const ResultsPage = React.lazy(() => import("./pages/ResultsPage"))

function StepNav() {
  const location = useLocation()
  const hasRequiredInputs = useLessonStore((state) => state.hasRequiredInputs)()
  const hasUsableMaterialsForGeneration = useLessonStore((state) => state.hasUsableMaterialsForGeneration)()
  const hasProcessingMaterials = useLessonStore((state) => state.hasProcessingMaterials)()
  const counts = useLessonStore((state) => state.getMaterialCounts)()

  const resultsBlockedReason = getResultsBlockedReason({
    hasRequiredInputs,
    hasUsableMaterialsForGeneration,
    hasProcessingMaterials,
    processingCount: counts.uploaded + counts.extracting + counts.analyzing,
  })

  const navStyle: React.CSSProperties = {
    ...orchardMetaRowStyle,
    marginBottom: resultsBlockedReason ? "var(--space-sm)" : 0,
  }

  const panelFallbackStyle: React.CSSProperties = {
    ...orchardNoticeStyle,
  }

  return (
    <div style={{ marginBottom: "var(--space-xl)" }}>
      <nav style={navStyle}>
        <Link to="/inputs" style={orchardStepLinkStyle(location.pathname === "/inputs")}>
          Inputs
        </Link>
        <Link to="/materials" style={orchardStepLinkStyle(location.pathname === "/materials")}>
          Materials
        </Link>
        <Link
          to="/results"
          style={orchardStepLinkStyle(location.pathname === "/results", Boolean(resultsBlockedReason))}
        >
          Results
        </Link>
      </nav>

      {resultsBlockedReason && <div style={panelFallbackStyle}>{resultsBlockedReason}</div>}
    </div>
  )
}

export default function App() {
  const loadingNoticeStyle: React.CSSProperties = {
    ...orchardNoticeStyle,
  }

  return (
    <div style={orchardPageShellStyle}>
      <div style={orchardWrapStyle}>
        <div style={orchardHeroCardStyle}>
          <div style={orchardHeroRibbonStyle}>Teacher Planning Studio</div>

          <h1 style={orchardHeroTitleStyle}>Lesson Generator 8</h1>

          <p style={orchardHeroBodyStyle}>
            Build teacher-friendly lesson packages from lesson inputs, curriculum materials, and exemplar materials with
            clear traceability.
          </p>
        </div>

        <div style={orchardPanelStyle}>
          <StepNav />

          <Suspense fallback={<div style={loadingNoticeStyle}>Loading page...</div>}>
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
  hasUsableMaterialsForGeneration,
  hasProcessingMaterials,
  processingCount,
}: {
  hasRequiredInputs: boolean
  hasUsableMaterialsForGeneration: boolean
  hasProcessingMaterials: boolean
  processingCount: number
}): string | null {
  if (!hasRequiredInputs) {
    return "Results stay locked until all required lesson inputs are completed."
  }

  if (hasProcessingMaterials) {
    return `Results stay locked until material processing finishes. Currently processing: ${processingCount}.`
  }

  if (!hasUsableMaterialsForGeneration) {
    return "Results stay locked until at least one curriculum or exemplar material is usable for grounded generation."
  }

  return null
}
