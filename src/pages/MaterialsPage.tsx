import React, { useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { generateLesson } from "../engine/generateLesson"
import { processMaterial } from "../engine/workflow/processMaterial"
import { MaterialFile, MaterialRole, MaterialStatus } from "../engine/types"
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

const primaryButtonStyle = (disabled: boolean): React.CSSProperties => ({
  padding: "12px 16px",
  borderRadius: 12,
  border: "1px solid #111827",
  background: disabled ? "#9ca3af" : "#111827",
  color: "#ffffff",
  cursor: disabled ? "not-allowed" : "pointer",
  fontWeight: 700,
  opacity: disabled ? 0.7 : 1,
})

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

const hiddenInputStyle: React.CSSProperties = {
  display: "none",
}

export default function MaterialsPage() {
  const navigate = useNavigate()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)

  const materials = useLessonStore((state) => state.materials)
  const addMaterial = useLessonStore((state) => state.addMaterial)
  const setMaterialSource = useLessonStore((state) => state.setMaterialSource)
  const removeMaterial = useLessonStore((state) => state.removeMaterial)
  const counts = useLessonStore((state) => state.getMaterialCounts)()
  const hasProcessingMaterials = useLessonStore((state) => state.hasProcessingMaterials)()
  const hasReadyMaterials = useLessonStore((state) => state.hasReadyMaterials)()
  const hasRequiredInputs = useLessonStore((state) => state.hasRequiredInputs)()
  const canGenerate = useLessonStore((state) => state.canGenerate)()

  const curriculumInputRef = useRef<HTMLInputElement | null>(null)
  const exemplarInputRef = useRef<HTMLInputElement | null>(null)

  const supportSummary = useMemo(() => buildMaterialSupportSummary(materials), [materials])

  async function handleFilesSelected(
    role: MaterialRole,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files ?? [])
    setGenerationError(null)

    for (const file of files) {
      const id = addMaterial(role, file.name)

      try {
        const fileBuffer = await file.arrayBuffer()
        const fileContent = shouldCapturePlainText(file.name) ? await file.text() : null

        setMaterialSource(id, {
          fileBuffer,
          fileContent,
        })

        void processMaterial(id)
      } catch (error) {
        const store = useLessonStore.getState()
        const message =
          error instanceof Error ? error.message : "Unable to read uploaded file"

        store.setMaterialError(id, message)
      }
    }

    event.target.value = ""
  }

  async function handleGenerateLesson() {
    if (!canGenerate || isGenerating) {
      return
    }

    try {
      setIsGenerating(true)
      setGenerationError(null)
      await generateLesson()
      navigate("/results")
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : "Unknown lesson generation error"
      )
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Materials</h2>
      <p style={{ color: "#4b5563", marginBottom: 24 }}>
        Upload curriculum and exemplar files. Materials appear immediately and stay
        visible while they move through upload, extraction, analysis, and ready states.
      </p>

      <input
        ref={curriculumInputRef}
        type="file"
        multiple
        onChange={(event) => handleFilesSelected("curriculum", event)}
        style={hiddenInputStyle}
      />

      <input
        ref={exemplarInputRef}
        type="file"
        multiple
        onChange={(event) => handleFilesSelected("exemplar", event)}
        style={hiddenInputStyle}
      />

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
          <button
            type="button"
            style={buttonStyle}
            onClick={() => curriculumInputRef.current?.click()}
          >
            Upload Curriculum Files
          </button>
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Exemplar</h3>
          <p style={{ color: "#6b7280" }}>
            Presentation authority: slide order, pacing, prompts, layout, and timing.
          </p>
          <button
            type="button"
            style={buttonStyle}
            onClick={() => exemplarInputRef.current?.click()}
          >
            Upload Exemplar Files
          </button>
        </div>
      </div>

      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Support Summary</h3>

        <div style={summaryGridStyle}>
          <SummaryCard label="Ready Curriculum" value={supportSummary.readyCurriculum} />
          <SummaryCard label="Ready Exemplar" value={supportSummary.readyExemplar} />
          <SummaryCard label="Content Signals" value={supportSummary.contentSignalCount} />
          <SummaryCard label="Structure Signals" value={supportSummary.structureSignalCount} />
        </div>

        <div style={supportNoticeStyle(supportSummary.overall)}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>
            {formatSupportHeading(supportSummary.overall)}
          </div>
          <div>{supportSummary.message}</div>
        </div>

        {supportSummary.guidance.length > 0 && (
          <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
            {supportSummary.guidance.map((item) => (
              <div key={item} style={guidanceStyle}>
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Status Overview</h3>

        <div style={summaryGridStyle}>
          <SummaryCard label="Total" value={counts.total} />
          <SummaryCard label="Ready" value={counts.ready} />
          <SummaryCard
            label="Processing"
            value={counts.uploaded + counts.extracting + counts.analyzing}
          />
          <SummaryCard label="Errors" value={counts.error} />
        </div>

        <div
          style={noticeStyle(
            hasProcessingMaterials ? "processing" : hasReadyMaterials ? "ready" : "idle"
          )}
        >
          {hasProcessingMaterials
            ? "Results stay blocked until all uploaded materials finish processing."
            : hasReadyMaterials
              ? "At least one material is ready. You can continue once your inputs are complete."
              : "Add curriculum or exemplar files to begin analysis."}
        </div>

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            type="button"
            onClick={handleGenerateLesson}
            disabled={!canGenerate || isGenerating}
            style={primaryButtonStyle(!canGenerate || isGenerating)}
          >
            {isGenerating ? "Generating Lesson..." : "Generate Lesson"}
          </button>

          <div style={{ fontSize: 13, color: "#6b7280" }}>
            {!hasRequiredInputs
              ? "Complete all lesson inputs before generating."
              : hasProcessingMaterials
                ? "Wait until uploaded materials finish processing."
                : !hasReadyMaterials
                  ? "At least one curriculum or exemplar material must be ready."
                  : "Inputs and materials are ready for lesson generation."}
          </div>

          {generationError && (
            <div style={{ fontSize: 13, color: "#b91c1c" }}>{generationError}</div>
          )}
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: 16 }}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Processing Status</h3>

        {materials.length === 0 ? (
          <p style={{ color: "#6b7280", marginBottom: 0 }}>No materials added yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {materials.map((material) => (
              <div key={material.id} style={rowStyle}>
                <div>
                  <div style={{ fontWeight: 600 }}>{material.name}</div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                    <span style={roleBadgeStyle(material.role)}>{material.role}</span>
                    <span style={statusBadgeStyle(material.status)}>
                      {formatStatus(material.status)}
                    </span>
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

                <div
                  style={{
                    minWidth: 180,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 10,
                  }}
                >
                  <div style={{ textAlign: "right", color: "#6b7280", fontSize: 13 }}>
                    {getStatusExplanation(material.status)}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeMaterial(material.id)}
                    style={secondaryButtonStyle()}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

type MaterialSupportSummary = {
  readyCurriculum: number
  readyExemplar: number
  contentSignalCount: number
  structureSignalCount: number
  overall: "balanced" | "content_heavy" | "structure_heavy" | "limited"
  message: string
  guidance: string[]
}

function buildMaterialSupportSummary(materials: MaterialFile[]): MaterialSupportSummary {
  const readyCurriculum = materials.filter(
    (material) => material.role === "curriculum" && material.status === "ready" && material.analysis?.curriculum
  )

  const readyExemplar = materials.filter(
    (material) => material.role === "exemplar" && material.status === "ready" && material.analysis?.exemplar
  )

  const contentSignalCount = readyCurriculum.reduce((total, material) => {
    const curriculum = material.analysis?.curriculum
    if (!curriculum) return total

    return (
      total +
      curriculum.standards.length +
      curriculum.vocabulary.length +
      curriculum.wordLists.length +
      curriculum.texts.length +
      curriculum.practiceTasks.length +
      curriculum.instructionalTargets.length
    )
  }, 0)

  const structureSignalCount = readyExemplar.reduce((total, material) => {
    const exemplar = material.analysis?.exemplar
    if (!exemplar) return total

    return (
      total +
      exemplar.slideFlow.length +
      exemplar.pacing.length +
      exemplar.teacherMoves.length +
      exemplar.promptStyle.length +
      exemplar.layoutCues.length +
      exemplar.reusableStructure.length
    )
  }, 0)

  const hasCurriculumSupport = readyCurriculum.length > 0 && contentSignalCount > 0
  const hasExemplarSupport = readyExemplar.length > 0 && structureSignalCount > 0

  const overall =
    hasCurriculumSupport && hasExemplarSupport
      ? "balanced"
      : hasCurriculumSupport
        ? "content_heavy"
        : hasExemplarSupport
          ? "structure_heavy"
          : "limited"

  const guidance: string[] = []

  if (!hasCurriculumSupport) {
    guidance.push("Add at least one strong curriculum file so lesson content is grounded in actual standards, texts, word lists, and tasks.")
  }

  if (!hasExemplarSupport) {
    guidance.push("Add at least one strong exemplar file so pacing, slide flow, prompts, and structure are grounded in a real model.")
  }

  const message =
    overall === "balanced"
      ? "You currently have both curriculum and exemplar support. This is the strongest setup for grounded content and strong presentation structure."
      : overall === "content_heavy"
        ? "You currently have stronger curriculum support than exemplar support. Content should be more grounded than structure."
        : overall === "structure_heavy"
          ? "You currently have stronger exemplar support than curriculum support. Structure should be stronger than content grounding."
          : "Current material support is limited. The lesson may rely more on fallback logic until stronger files are added."

  return {
    readyCurriculum: readyCurriculum.length,
    readyExemplar: readyExemplar.length,
    contentSignalCount,
    structureSignalCount,
    overall,
    message,
    guidance,
  }
}

function formatSupportHeading(overall: MaterialSupportSummary["overall"]): string {
  if (overall === "balanced") return "Balanced support"
  if (overall === "content_heavy") return "Content-heavy support"
  if (overall === "structure_heavy") return "Structure-heavy support"
  return "Limited support"
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

function shouldCapturePlainText(fileName: string): boolean {
  const normalized = fileName.toLowerCase()
  return normalized.endsWith(".txt") || normalized.endsWith(".html") || normalized.endsWith(".htm")
}

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function getStatusExplanation(status: MaterialStatus): string {
  if (status === "uploaded") return "Queued for extraction"
  if (status === "extracting") return "Extracting file contents"
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

function statusBadgeStyle(status: MaterialStatus): React.CSSProperties {
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

function secondaryButtonStyle(): React.CSSProperties {
  return {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
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

function supportNoticeStyle(mode: MaterialSupportSummary["overall"]): React.CSSProperties {
  const palette =
    mode === "balanced"
      ? { background: "#ecfdf5", border: "#a7f3d0", color: "#065f46" }
      : mode === "limited"
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

const guidanceStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  color: "#4b5563",
  borderRadius: 12,
  padding: 12,
  fontSize: 14,
}
