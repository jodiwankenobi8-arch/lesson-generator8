import React, { useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  inferSupportedSourceMimeType,
  isSupportedImageExtension,
  isSupportedImageMimeType,
  CURRENT_MATERIALS_PAGE_SOURCE_INTRO_TEXT,
  SUPPORTED_SOURCE_UPLOAD_ACCEPT,
} from "../engine/materials/sourceIntakeContract"
import { MaterialFile, MaterialRole, MaterialSourceKind, MaterialStatus } from "../engine/types"
import {
  orchardButtonStyle,
  orchardCardStyle,
  orchardInputStyle,
  orchardMetaRowStyle,
  orchardNoticeStyle,
  orchardPageShellStyle,
  orchardSoftCardStyle,
  orchardStatusBadgeStyle,
  orchardTagStyle,
} from "./orchardUi"
import { OrchardPageHeader } from "./OrchardPageHeader"
import { useLessonStore } from "../state/useLessonStore"


const pageStyle: React.CSSProperties = {
  ...orchardPageShellStyle,
  maxWidth: 980,
  margin: "0 auto",
}

const introStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: 16,
  maxWidth: 760,
  margin: 0,
  lineHeight: 1.6,
}


const cardStyle: React.CSSProperties = {
  ...orchardCardStyle,
}

const uploadCardStyle = (role: MaterialRole): React.CSSProperties => ({
  ...orchardSoftCardStyle,
  background:
    role === "curriculum"
      ? "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,246,233,0.82))"
      : "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,214,208,0.18))",
})

const buttonStyle: React.CSSProperties = {
  ...orchardButtonStyle(),
}

const primaryButtonStyle = (disabled: boolean): React.CSSProperties => ({
  ...orchardButtonStyle({ active: !disabled }),
  opacity: disabled ? 0.7 : 1,
  cursor: disabled ? "not-allowed" : "pointer",
  boxShadow: disabled ? "none" : "var(--shadow-soft)",
  border: disabled ? "1px solid var(--border-soft)" : "1px solid var(--orchard-green)",
  background: disabled ? "var(--warm-gray)" : "var(--orchard-green)",
  color: disabled ? "var(--text-secondary)" : "var(--paper-white)",
})

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: "14px 0",
  borderTop: "1px solid var(--border-paper)",
  gap: "var(--space-md)",
}

const progressTrackStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 8,
  marginTop: 10,
}

function progressStepStyle(
  state: "complete" | "current" | "upcoming" | "error"
): React.CSSProperties {
  const palette =
    state === "complete"
      ? { background: "#ecfdf5", border: "#a7f3d0", color: "#065f46" }
      : state === "current"
        ? { background: "#fff7ed", border: "#fed7aa", color: "#9a3412" }
        : state === "error"
          ? { background: "#fef2f2", border: "#fecaca", color: "#b91c1c" }
          : { background: "#fcfbf8", border: "var(--border-soft)", color: "var(--text-secondary)" }

  return {
    border: `1px solid ${palette.border}`,
    background: palette.background,
    color: palette.color,
    borderRadius: "var(--radius-sm)",
    padding: "8px 10px",
    fontSize: 12,
    fontWeight: 700,
    textAlign: "center",
  }
}

const summaryGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "var(--space-sm)",
  marginBottom: "var(--space-lg)",
}

const uploadGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "var(--space-md)",
  marginBottom: "var(--space-lg)",
}

const hiddenInputStyle: React.CSSProperties = {
  display: "none",
}

type UploadSourceMetadata = {
  sourceKind: MaterialSourceKind
  sourceLabel: string
  sourceMimeType: string | null
}

export function buildUploadSourceMetadata(file: Pick<File, "name" | "type">): UploadSourceMetadata {
  const sourceKind: MaterialSourceKind =
    isSupportedImageMimeType(file.type) || isSupportedImageExtension(file.name)
      ? "image_upload"
      : "file_upload"
  const sourceMimeType = file.type.trim() || inferMimeTypeFromName(file.name)

  return {
    sourceKind,
    sourceLabel: file.name,
    sourceMimeType,
  }
}

export function inferMimeTypeFromName(fileName: string): string | null {
  return inferSupportedSourceMimeType(fileName)
}

export default function MaterialsPage() {
  const navigate = useNavigate()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)

  const materials = useLessonStore((state) => state.materials)
  const addMaterial = useLessonStore((state) => state.addMaterial)
  const setMaterialSource = useLessonStore((state) => state.setMaterialSource)
  const removeMaterial = useLessonStore((state) => state.removeMaterial)
  const processMaterial = useLessonStore((state) => state.processMaterial)
  const generateLesson = useLessonStore((state) => state.generateLesson)
  const counts = useLessonStore((state) => state.getMaterialCounts)()
  const hasProcessingMaterials = useLessonStore((state) => state.hasProcessingMaterials)()
  const hasUsableMaterialsForGeneration = useLessonStore(
    (state) => state.hasUsableMaterialsForGeneration
  )()
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
      const normalizedName = file.name.trim().toLowerCase()
      const duplicateExists = materials.some(
        (material) =>
          material.role === role && material.name.trim().toLowerCase() === normalizedName
      )

      if (duplicateExists) {
        setGenerationError(`"${file.name}" is already uploaded in ${role} materials.`)
        continue
      }

      const sourceMetadata = buildUploadSourceMetadata(file)
      const id = addMaterial(role, file.name, sourceMetadata)

      try {
        const fileBuffer = await file.arrayBuffer()
        const fileContent = shouldCapturePlainText(file.name) ? await file.text() : null

        setMaterialSource(id, {
          fileBuffer,
          fileContent,
          ...sourceMetadata,
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
    <div style={pageStyle}>
      <OrchardPageHeader label="Source Workbench" title="Materials" introMaxWidth={760}>
        <p style={introStyle}>
          Add curriculum and exemplar materials to the workbench. Uploaded materials stay visible while they move through upload, extraction, analysis, and readiness states.
        </p>
        <p style={introStyle}>
          Curriculum remains the content authority. Exemplar remains the presentation and structure authority.
        </p>
        <p style={introStyle}>
          {CURRENT_MATERIALS_PAGE_SOURCE_INTRO_TEXT}
        </p>
      </OrchardPageHeader>

      <input
        ref={curriculumInputRef}
        type="file"
        multiple
        accept={SUPPORTED_SOURCE_UPLOAD_ACCEPT}
        onChange={(event) => handleFilesSelected("curriculum", event)}
        style={hiddenInputStyle}
      />

      <input
        ref={exemplarInputRef}
        type="file"
        multiple
        accept={SUPPORTED_SOURCE_UPLOAD_ACCEPT}
        onChange={(event) => handleFilesSelected("exemplar", event)}
        style={hiddenInputStyle}
      />

      <div style={uploadGridStyle}>
        <div style={uploadCardStyle("curriculum")}>
          <div style={miniTagStyle("curriculum")}>Content Authority</div>
          <h3 style={{ marginTop: 0, marginBottom: "var(--space-xs)", color: "var(--orchard-green)" }}>
            Curriculum
          </h3>
          <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
Content authority for standards, word lists, texts, examples, and practice activities across one or more source materials.
          </p>
          <button
            type="button"
            style={buttonStyle}
            onClick={() => curriculumInputRef.current?.click()}
          >
            Add Curriculum Materials
          </button>
        </div>

        <div style={uploadCardStyle("exemplar")}>
          <div style={miniTagStyle("exemplar")}>Presentation Authority</div>
          <h3 style={{ marginTop: 0, marginBottom: "var(--space-xs)", color: "var(--orchard-green)" }}>
            Exemplar
          </h3>
          <p style={{ color: "var(--text-secondary)", marginTop: 0 }}>
Presentation authority for slide order, pacing, prompts, layout, and timing across one or more source materials.
          </p>
          <button
            type="button"
            style={buttonStyle}
            onClick={() => exemplarInputRef.current?.click()}
          >
            Add Exemplar Materials
          </button>
        </div>
      </div>

      <div style={{ ...cardStyle, marginBottom: "var(--space-md)" }}>
        <h3 style={{ marginTop: 0, marginBottom: "var(--space-md)", color: "var(--orchard-green)" }}>
          Materials Trust
        </h3>

        <div style={summaryGridStyle}>
          <SummaryCard label="Usable content sources" value={supportSummary.usableCurriculum} />
          <SummaryCard label="Usable structure sources" value={supportSummary.usableExemplar} />
          <SummaryCard label="Caution sources" value={supportSummary.cautionCount} />
          <SummaryCard label="Blocked sources" value={supportSummary.blockedCount} />
        </div>

        <div style={supportNoticeStyle(supportSummary.overall)}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>
            {formatSupportHeading(supportSummary.overall)}
          </div>
          <div>{supportSummary.message}</div>
        </div>

        {supportSummary.guidance.length > 0 && (
          <div style={{ marginTop: "var(--space-sm)", display: "grid", gap: 8 }}>
            {supportSummary.guidance.map((item) => (
              <div key={item} style={guidanceStyle}>
                {item}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, marginBottom: "var(--space-md)", color: "var(--orchard-green)" }}>
          Generation Readiness
        </h3>

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
            hasProcessingMaterials
              ? "processing"
              : hasUsableMaterialsForGeneration
                ? "ready"
                : "idle"
          )}
        >
          {hasProcessingMaterials
            ? "Lesson generation stays blocked until all uploaded materials finish processing."
            : hasUsableMaterialsForGeneration
              ? "At least one curriculum or exemplar material is usable for grounded lesson generation."
              : "Add or replace curriculum or exemplar materials until at least one material is usable for grounded lesson generation."}
        </div>

        <div style={{ marginTop: "var(--space-md)", display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            type="button"
            onClick={handleGenerateLesson}
            disabled={!canGenerate || isGenerating}
            style={primaryButtonStyle(!canGenerate || isGenerating)}
          >
            {isGenerating ? "Generating Lesson..." : "Generate Lesson"}
          </button>

          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            {!hasRequiredInputs
              ? "Complete all lesson inputs before generating."
              : hasProcessingMaterials
                ? "Wait until uploaded materials finish processing."
                : !hasUsableMaterialsForGeneration
                  ? "At least one curriculum or exemplar material must be usable for grounded lesson generation."
                  : "Inputs are complete and at least one material is usable for grounded lesson generation."}
          </div>

          {generationError && (
            <div style={{ fontSize: 13, color: "#b91c1c" }}>{generationError}</div>
          )}
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: "var(--space-md)" }}>
        <h3 style={{ marginTop: 0, marginBottom: "var(--space-md)", color: "var(--orchard-green)" }}>
          Source Processing Status
        </h3>
        <p
          style={{
            marginTop: 0,
            marginBottom: "var(--space-sm)",
            color: "var(--text-secondary)",
            fontSize: 13,
          }}
        >
          Store status remains authoritative. The labels below explain where each file is in
          intake, extraction, analysis, and readiness.
        </p>

        {materials.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", marginBottom: 0 }}>No materials added yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {materials.map((material) => (
              <div key={material.id} style={rowStyle}>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{material.name}</div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                    <span style={roleBadgeStyle(material.role)}>{material.role}</span>
                    <span style={statusBadgeStyle(material.status)}>
                      {formatStatus(material.status)}
                    </span>
                    {material.analysis?.extractionMetadata && (
                      <>
                        <span style={methodBadgeStyle(material.analysis.extractionMetadata.method)}>
                          {formatExtractionMethod(material.analysis.extractionMetadata.method)}
                        </span>
                        <span style={qualityBadgeStyle(material.analysis.extractionMetadata.quality)}>
                          {formatExtractionQuality(material.analysis.extractionMetadata.quality)}
                        </span>
                        {material.analysis.extractionMetadata.ocrCandidate && (
                          <span style={ocrCandidateBadgeStyle}>OCR candidate</span>
                        )}
                      </>
                    )}
                  </div>

                  <div style={progressTrackStyle}>
                    <div style={progressStepStyle(getProgressStepState(material.status, "uploaded"))}>
                      Uploaded
                    </div>
                    <div style={progressStepStyle(getProgressStepState(material.status, "extracting"))}>
                      Extracting
                    </div>
                    <div style={progressStepStyle(getProgressStepState(material.status, "analyzing"))}>
                      Analyzing
                    </div>
                    <div style={progressStepStyle(getProgressStepState(material.status, "ready"))}>
                      Ready
                    </div>
                  </div>

                                    <div style={{ marginTop: 8, display: "grid", gap: 4, fontSize: 13, color: "var(--text-secondary)" }}>
                    <div>
                      <strong>Upload:</strong> {buildMaterialStageDetails(material).upload}
                    </div>
                    <div>
                      <strong>Evaluation:</strong> {buildMaterialStageDetails(material).evaluation}
                    </div>
                    <div>
                      <strong>Pipeline:</strong> {buildMaterialStageDetails(material).pipeline}
                    </div>
                    <div>
                      <strong>Influence:</strong> {formatInfluenceLabel(material)}
                    </div>
                    <div>
                      <strong>Use status:</strong> {formatUseStatusLabel(material)}
                    </div>
                  </div>

                  {material.analysis?.extractionMetadata && (
                    <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
                      <div style={metadataPanelStyle}>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>Extraction Trace</div>
                        <div style={{ fontSize: 13 }}>
                          <strong>Confidence:</strong> {formatExtractionConfidence(material.analysis.extractionMetadata.confidence)}
                        </div>
                        {material.analysis.extractionMetadata.ocrReason && (
                          <div style={{ marginTop: 4, fontSize: 13 }}>
                            <strong>OCR reason:</strong> {material.analysis.extractionMetadata.ocrReason}
                          </div>
                        )}
                        {material.analysis.extractionMetadata.notes.length > 0 && (
                          <div style={{ marginTop: 4, fontSize: 13 }}>
                            <strong>Notes:</strong> {material.analysis.extractionMetadata.notes.join(" ")}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {material.analysis && (
                    <div style={{ marginTop: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                      {material.analysis.summary}
                    </div>
                  )}

                  {buildMaterialPreviewLines(material).length > 0 && (
                    <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
                      <div style={metadataPanelStyle}>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>Preview</div>
                        {buildMaterialPreviewLines(material).map((line, index) => (
                          <div
                            key={`${material.id}-preview-${index}`}
                            style={{ fontSize: 13, marginTop: index === 0 ? 0 : 4 }}
                          >
                            {line}
                          </div>
                        ))}
                      </div>
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
                  <div style={{ textAlign: "right", color: "var(--text-secondary)", fontSize: 13 }}>
                    {getStatusExplanation(material.status)}

<div style={{ marginTop: 6, fontSize: 12, color: "var(--text-secondary)" }}>
  {renderProcessingPipeline(material.status)}
</div>
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
  usableCurriculum: number
  usableExemplar: number
  cautionCount: number
  blockedCount: number
  contentSignalCount: number
  structureSignalCount: number
  overall: "balanced" | "content_heavy" | "structure_heavy" | "limited"
  message: string
  guidance: string[]
}

function buildMaterialSupportSummary(materials: MaterialFile[]): MaterialSupportSummary {
  const usableCurriculum = materials.filter(
    (material) =>
      material.role === "curriculum" &&
      material.status === "ready" &&
      material.analysis?.curriculum &&
      (!material.analysis.reliability || material.analysis.reliability.usableForContent)
  )

  const usableExemplar = materials.filter(
    (material) =>
      material.role === "exemplar" &&
      material.status === "ready" &&
      material.analysis?.exemplar &&
      (!material.analysis.reliability || material.analysis.reliability.usableForStructure)
  )

  const cautionCount = materials.filter((material) => {
    const reliability = material.analysis?.reliability
    if (material.status !== "ready" || !reliability) return false

    return (
      (reliability.usableForContent && reliability.contentDecision === "caution") ||
      (reliability.usableForStructure && reliability.structureDecision === "caution")
    )
  }).length

  const blockedCount = materials.filter((material) => {
    const reliability = material.analysis?.reliability
    if (material.status !== "ready" || !reliability) return false

    return !reliability.usableForContent && !reliability.usableForStructure
  }).length

  const contentSignalCount = usableCurriculum.reduce((total, material) => {
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

  const structureSignalCount = usableExemplar.reduce((total, material) => {
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

  const hasCurriculumSupport = usableCurriculum.length > 0 && contentSignalCount > 0
  const hasExemplarSupport = usableExemplar.length > 0 && structureSignalCount > 0

  const overall =
    hasCurriculumSupport && hasExemplarSupport
      ? "balanced"
      : hasCurriculumSupport
        ? "content_heavy"
        : hasExemplarSupport
          ? "structure_heavy"
          : "limited"

  const guidance: string[] = []

  if (blockedCount > 0) {
    guidance.push("Some sources finished processing but are blocked from grounding generation because their extracted text is too weak or unreliable.")
  }

  if (cautionCount > 0) {
    guidance.push("Some sources are usable only with caution. Review extraction trace notes before relying on them heavily.")
  }

  if (!hasCurriculumSupport) {
    guidance.push("Add at least one usable curriculum source so lesson content is grounded in actual standards, texts, word lists, and tasks.")
  }

  if (!hasExemplarSupport) {
    guidance.push("Add at least one usable exemplar source so pacing, slide flow, prompts, and structure are grounded in a real model.")
  }

  const message =
    overall === "balanced"
      ? "You currently have usable curriculum and exemplar support. This is the best starting lane for grounded content and presentation structure, but thin source signals can still limit trust."
      : overall === "content_heavy"
        ? "You currently have more usable curriculum support than exemplar support. Content should be more grounded than structure."
        : overall === "structure_heavy"
          ? "You currently have more usable exemplar support than curriculum support. Structure should be stronger than content grounding."
          : "Current usable source support is limited. The lesson may rely more on fallback logic until stronger sources are added."

  return {
    usableCurriculum: usableCurriculum.length,
    usableExemplar: usableExemplar.length,
    cautionCount,
    blockedCount,
    contentSignalCount,
    structureSignalCount,
    overall,
    message,
    guidance,
  }
}

function formatSupportHeading(overall: MaterialSupportSummary["overall"]): string {
  if (overall === "balanced") return "Balanced teacher support"
  if (overall === "content_heavy") return "Content-led support"
  if (overall === "structure_heavy") return "Structure-led support"
  return "Limited support"
}

function formatInfluenceLabel(material: MaterialFile): string {
  const curriculumSignals =
    (material.analysis?.curriculum?.standards.length ?? 0) +
    (material.analysis?.curriculum?.vocabulary.length ?? 0) +
    (material.analysis?.curriculum?.wordLists.length ?? 0) +
    (material.analysis?.curriculum?.texts.length ?? 0) +
    (material.analysis?.curriculum?.practiceTasks.length ?? 0) +
    (material.analysis?.curriculum?.instructionalTargets.length ?? 0)

  const exemplarSignals =
    (material.analysis?.exemplar?.slideFlow.length ?? 0) +
    (material.analysis?.exemplar?.pacing.length ?? 0) +
    (material.analysis?.exemplar?.teacherMoves.length ?? 0) +
    (material.analysis?.exemplar?.promptStyle.length ?? 0) +
    (material.analysis?.exemplar?.layoutCues.length ?? 0) +
    (material.analysis?.exemplar?.reusableStructure.length ?? 0)

  if (curriculumSignals > 0 && exemplarSignals > 0) return "Mixed support"
  if (curriculumSignals > 0) return "Content authority"
  if (exemplarSignals > 0) return "Structure authority"
  return "Limited support"
}

function formatUseStatusLabel(material: MaterialFile): string {
  if (material.status === "error") return "Needs attention"
  if (material.status !== "ready") return "Partial support"

  const reliability = material.analysis?.reliability

  if (!reliability) {
    return "Analysis complete, trust not scored"
  }

  if (!reliability.usableForContent && !reliability.usableForStructure) {
    return "Blocked for lesson generation"
  }

  if (
    (reliability.usableForContent && reliability.contentDecision === "caution") ||
    (reliability.usableForStructure && reliability.structureDecision === "caution")
  ) {
    return "Usable with caution"
  }

  const usableForContent = reliability.usableForContent
  const usableForStructure = reliability.usableForStructure

  if (usableForContent && usableForStructure) return "Usable for grounded generation"
  if (usableForContent) return "Usable for content grounding"
  if (usableForStructure) return "Usable for structure guidance"

  return "Needs attention"
}

type MaterialStageDetails = {
  upload: string
  evaluation: string
  pipeline: string
}

function buildMaterialStageDetails(material: MaterialFile): MaterialStageDetails {
  if (material.status === "uploaded") {
    return {
      upload: "File captured and waiting in the intake queue.",
      evaluation: "Extraction has not started yet.",
      pipeline: "Queued for extraction.",
    }
  }

  if (material.status === "extracting") {
    return {
      upload: "File source is attached to the store.",
      evaluation: "Extracting readable text from the file.",
      pipeline: "Waiting for analysis to begin.",
    }
  }

  if (material.status === "analyzing") {
    return {
      upload: "File source is attached to the store.",
      evaluation: "Building curriculum or exemplar lesson signals.",
      pipeline: "Waiting for analysis to finish.",
    }
  }

  if (material.status === "ready") {
    const extraction = material.analysis?.extractionMetadata
    const extractionSummary = extraction
      ? `${formatExtractionMethod(extraction.method)} / ${formatExtractionQuality(extraction.quality)}`
      : "analysis completed"

    return {
      upload: "File source is attached to the store.",
      evaluation: `Analysis complete (${extractionSummary}).`,
      pipeline: "Analysis complete. Check Use status for grounded-generation support.",
    }
  }

  return {
    upload: "File source needs attention.",
    evaluation: "Processing stopped before analysis completed.",
    pipeline: "Review the error before generating Results.",
  }
}

function buildMaterialPreviewLines(material: MaterialFile): string[] {
  const extractedLines = (material.analysis?.extractedText ?? [])
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length >= 20)

  const noteLines = (material.analysis?.extractionMetadata?.notes ?? [])
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length >= 20)

  return Array.from(new Set([...extractedLines, ...noteLines])).slice(0, 5)
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        border: "1px solid var(--border-paper)",
        borderRadius: "var(--radius-md)",
        padding: 12,
        background: "var(--surface-paper-soft)",
      }}
    >
      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "var(--orchard-green)" }}>{value}</div>
    </div>
  )
}

function shouldCapturePlainText(fileName: string): boolean {
  const normalized = fileName.toLowerCase()
  return normalized.endsWith(".txt") || normalized.endsWith(".html") || normalized.endsWith(".htm")
}


function renderProcessingPipeline(status: MaterialStatus) {
  if (status === "error") {
    return [
      "[x] Uploaded",
      "[x] Extracting",
      "[x] Analyzing",
      "[!] Needs attention",
    ].join(" -> ")
  }

  const order: Array<"uploaded" | "extracting" | "analyzing" | "ready"> = [
    "uploaded",
    "extracting",
    "analyzing",
    "ready",
  ]

  return order
    .map((step) => {
      const state = getProgressStepState(status, step)
      const label = step.charAt(0).toUpperCase() + step.slice(1)
      const marker = getPipelineMarker(state, step)

      return `${marker} ${label}`
    })
    .join(" -> ")
}

function getPipelineMarker(
  state: "complete" | "current" | "upcoming" | "error",
  step: "uploaded" | "extracting" | "analyzing" | "ready"
): string {
  if (state === "complete") return "[x]"
  if (state === "error") return "[!]"
  if (state === "current") return step === "ready" ? "[x]" : "[>]"
  return "[ ]"
}

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function getStatusExplanation(status: MaterialStatus): string {
  if (status === "uploaded") return "Waiting in intake queue"
  if (status === "extracting") return "Extracting readable text"
  if (status === "analyzing") return "Building lesson signals"
  if (status === "ready") return "Analysis complete"
  return "Processing stopped"
}

function getProgressStepState(
  status: MaterialStatus,
  step: "uploaded" | "extracting" | "analyzing" | "ready"
): "complete" | "current" | "upcoming" | "error" {
  if (status === "error") {
    return step === "ready" ? "error" : "complete"
  }

  const order: Array<"uploaded" | "extracting" | "analyzing" | "ready"> = [
    "uploaded",
    "extracting",
    "analyzing",
    "ready",
  ]

  const currentIndex = order.indexOf(status)
  const stepIndex = order.indexOf(step)

  if (stepIndex < currentIndex) {
    return "complete"
  }

  if (stepIndex === currentIndex) {
    return "current"
  }

  return "upcoming"
}

function miniTagStyle(role: MaterialRole): React.CSSProperties {
  return orchardTagStyle(role === "curriculum" ? "moss" : "cranberry")
}

function roleBadgeStyle(role: string): React.CSSProperties {
  return orchardTagStyle(role === "curriculum" ? "moss" : "cranberry")
}

function statusBadgeStyle(status: MaterialStatus): React.CSSProperties {
  if (status === "ready") return orchardStatusBadgeStyle("moss")
  if (status === "error") return orchardStatusBadgeStyle("cranberry")
  return orchardStatusBadgeStyle("honey")
}

function methodBadgeStyle(method: "parser" | "ocr" | "mixed" | "fallback_notice"): React.CSSProperties {
  if (method === "parser") return orchardTagStyle("moss")
  if (method === "ocr") return orchardTagStyle("cranberry")
  if (method === "mixed") return orchardTagStyle("honey")
  return orchardTagStyle("honey")
}

function qualityBadgeStyle(quality: "high" | "medium" | "low"): React.CSSProperties {
  if (quality === "high") return orchardTagStyle("moss")
  if (quality === "medium") return orchardTagStyle("honey")
  return orchardTagStyle("cranberry")
}

const ocrCandidateBadgeStyle: React.CSSProperties = orchardTagStyle("honey")

function formatExtractionMethod(method: "parser" | "ocr" | "mixed" | "fallback_notice"): string {
  if (method === "parser") return "Parser"
  if (method === "ocr") return "OCR"
  if (method === "mixed") return "Mixed"
  return "Fallback notice"
}

function formatExtractionQuality(quality: "high" | "medium" | "low"): string {
  return `${quality.charAt(0).toUpperCase()}${quality.slice(1)} quality`
}

function formatExtractionConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`
}

function secondaryButtonStyle(): React.CSSProperties {
  return {
    ...orchardButtonStyle({ subtle: true }),
    padding: "8px 10px",
    fontSize: 12,
    fontWeight: 700,
  }
}

function noticeStyle(mode: "idle" | "processing" | "ready"): React.CSSProperties {
  if (mode === "ready") {
    return {
      ...orchardNoticeStyle,
      background: "rgba(110, 139, 107, 0.14)",
      border: "1px solid var(--border-moss)",
      color: "var(--deep-orchard)",
    }
  }

  if (mode === "processing") {
    return {
      ...orchardNoticeStyle,
      background: "rgba(242, 192, 120, 0.20)",
      border: "1px solid var(--border-honey)",
      color: "var(--warm-brown)",
    }
  }

  return {
    ...orchardNoticeStyle,
  }
}

function supportNoticeStyle(mode: MaterialSupportSummary["overall"]): React.CSSProperties {
  if (mode === "balanced") {
    return {
      ...orchardNoticeStyle,
      background: "rgba(110, 139, 107, 0.14)",
      border: "1px solid var(--border-moss)",
      color: "var(--deep-orchard)",
    }
  }

  if (mode === "limited") {
    return {
      ...orchardNoticeStyle,
      background: "rgba(242, 192, 120, 0.20)",
      border: "1px solid var(--border-honey)",
      color: "var(--warm-brown)",
    }
  }

  return {
    ...orchardNoticeStyle,
  }
}

const guidanceStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  color: "var(--text-secondary)",
  padding: 12,
  fontSize: 14,
}

const metadataPanelStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  color: "var(--text-secondary)",
  padding: 10,
  fontSize: 13,
}








