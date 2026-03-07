import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const InputsPage = React.lazy(() => import("../pages/InputsPage"));
const MaterialsPage = React.lazy(() => import("../pages/MaterialsPage"));
const BlueprintPage = React.lazy(() => import("../pages/BlueprintPage"));
const ResultsHubPage = React.lazy(() => import("../pages/ResultsHubPage"));

function RouterLoadingFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background:
          "radial-gradient(circle at 16% 14%, rgba(255,255,255,0.74) 0, rgba(255,255,255,0) 22%), radial-gradient(circle at 84% 12%, rgba(247,214,208,0.2) 0, rgba(247,214,208,0) 18%), linear-gradient(180deg, #FFF6E9 0%, #FFF3E4 100%)",
      }}
    >
      <div
        role="status"
        aria-live="polite"
        style={{
          width: "min(420px, 100%)",
          borderRadius: 28,
          padding: 24,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,249,243,1) 100%)",
          border: "1px solid #E7E2DA",
          boxShadow: "0 18px 38px rgba(47,47,47,0.06)",
          color: "#2F2F2F",
          fontFamily: '"Inter", "Source Sans 3", system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "8px 14px",
            borderRadius: 999,
            background: "linear-gradient(180deg, #EEF5EA 0%, #E4F0DE 100%)",
            border: "1px solid #B8CDAF",
            color: "#3F5A40",
            fontWeight: 800,
            fontSize: 12,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          Loading
        </div>

        <div
          style={{
            fontFamily: '"Libre Baskerville", "Playfair Display", Georgia, serif',
            fontWeight: 700,
            fontSize: 28,
            lineHeight: 1.15,
            color: "#3F5A40",
            marginBottom: 10,
          }}
        >
          Opening the lesson studio…
        </div>

        <div style={{ color: "#6F6A63", lineHeight: 1.6 }}>
          Route bundles now load on demand so the app starts faster and keeps the initial footprint smaller.
        </div>
      </div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouterLoadingFallback />}>
        <Routes>
          <Route path="/" element={<InputsPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/results" element={<ResultsHubPage />} />
          <Route path="/blueprint" element={<BlueprintPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
