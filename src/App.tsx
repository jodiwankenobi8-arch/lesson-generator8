import React from "react"
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom"
import InputsPage from "./pages/InputsPage"
import MaterialsPage from "./pages/MaterialsPage"
import ResultsPage from "./pages/ResultsPage"

function StepNav() {
  const location = useLocation()

  const linkStyle = (path: string) => ({
    padding: "10px 14px",
    borderRadius: "999px",
    textDecoration: "none",
    border: "1px solid #d1d5db",
    background: location.pathname === path ? "#111827" : "#ffffff",
    color: location.pathname === path ? "#ffffff" : "#111827",
    fontWeight: 600 as const,
  })

  return (
    <nav style={{ display: "flex", gap: 12, marginBottom: 24 }}>
      <Link to="/inputs" style={linkStyle("/inputs")}>Inputs</Link>
      <Link to="/materials" style={linkStyle("/materials")}>Materials</Link>
      <Link to="/results" style={linkStyle("/results")}>Results</Link>
    </nav>
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
