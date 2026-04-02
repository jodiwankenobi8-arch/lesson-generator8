import React, { useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  SUPPORTED_SOURCE_UPLOAD_ACCEPT,
  SUPPORTED_SOURCE_UPLOAD_FORMATS_TEXT,
} from "../engine/materials/sourceIntakeContract"
import {
  ExemplarStyleAspect,
  ExemplarStyleSettings,
  MaterialRole,
  MaterialStatus,
} from "../engine/types"
import {
  orchardButtonStyle,
  orchardCardStyle,
  orchardNoticeStyle,
  orchardPageShellStyle,
  orchardSoftCardStyle,
  orchardStatusBadgeStyle,
  orchardTagStyle,
} from "./orchardUi"
import { OrchardPageHeader } from "./OrchardPageHeader"
import {
  buildUploadSourceMetadata,
  getTeacherVisibleMaterialNote,
  inferMimeTypeFromName,
  isSupportedUploadFile,
} from "./materialsPageUploadHelpers"

export {
  buildUploadSourceMetadata,
  getTeacherVisibleMaterialNote,
  inferMimeTypeFromName,
  isSupportedUploadFile,
}
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

const uploadGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "var(--space-md)",
  marginBottom: "var(--space-lg)",
}

const summaryGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "var(--space-sm)",
  marginBottom: "var(--space-md)",
}

const hiddenInputStyle: React.CSSProperties = {
  display: "none",
}

const listStyle: React.CSSProperties = {
  display: "grid",
  gap: 12,
}

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "var(--space-md)",
  padding: "14px 0",
  borderTop: "1px solid var(--border-paper)",
}

const laneMetaStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  flexWrap: "wrap",
  marginBottom: "var(--space-sm)",
}

const laneTitleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "var(--space-xs)",
  color: "var(--orchard-green)",
}

const laneBodyStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  marginTop: 0,
  marginBottom: "var(--space-md)",
  lineHeight: 1.6,
}

const laneSupportTextStyle: React.CSSProperties = {
  marginTop: "var(--space-sm)",
  color: "var(--text-secondary)",
  fontSize: 13,
  lineHeight: 1.5,
}

const dragPromptStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
  textAlign: "center",
}

const dragPromptTitleStyle: React.CSSProperties = {
  fontWeight: 700,
  color: "var(--deep-orchard)",
}

const dragPromptBodyStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: 13,
}

const materialMetaStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 6,
}

const materialStatusTextStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: 13,
  lineHeight: 1.5,
  textAlign: "right",
}

const helperTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: "var(--text-secondary)",
}

const errorTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: "var(--cranberry)",
}

const exemplarControlCardStyle: React.CSSProperties = {
  marginTop: 10,
  padding: 12,
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border-paper)",
  background: "rgba(255,255,255,0.78)",
  display: "grid",
  gap: 10,
  justifyItems: "stretch",
}

const exemplarOptionListStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
}

const exemplarCheckboxGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 8,
}

const exemplarLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  color: "var(--text-primary)",
  fontSize: 13,
  lineHeight: 1.4,
}

const exemplarSubtleTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "var(--text-secondary)",
  lineHeight: 1.5,
}

const exemplarTextareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 72,
  resize: "vertical",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-paper)",
  padding: "10px 12px",
  font: "inherit",
  color: "var(--text-primary)",
  background: "rgba(255,255,255,0.94)",
  boxSizing: "border-box",
}

const EXEMPLAR_ASPECT_OPTIONS: Array<{ value: ExemplarStyleAspect; label: string }> = [
  { value: "structure", label: "Structure" },
  { value: "slide_flow", label: "Slide flow" },
  { value: "teacher_prompts", label: "Teacher prompts" },
  { value: "pacing", label: "Pacing" },
  { value: "visual_layout", label: "Visual layout" },
  { value: "wording_tone", label: "Wording / tone" },
]

export default function MaterialsPage() {
  const navigate = useNavigate()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [draggingRole, setDraggingRole] = useState<MaterialRole | null>(null)

  const materials = useLessonStore((state) => state.materials)
  const addMaterial = useLessonStore((state) => state.addMaterial)
  const setMaterialSource = useLessonStore((state) => state.setMaterialSource)
  const removeMaterial = useLessonStore((state) => state.removeMaterial)
  const processMaterial = useLessonStore((state) => state.processMaterial)
  const setMaterialStyleSettings = useLessonStore((state) => state.setMaterialStyleSettings)
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

  const laneCounts = useMemo(
    () => ({
      curriculum: materials.filter((material) => material.role === "curriculum").length,
      exemplar: materials.filter((material) => material.role === "exemplar").length,
    }),
    [materials]
  )

  async function handleFilesAdded(role: MaterialRole, files: File[]) {
    setGenerationError(null)

    for (const file of files) {
      if (!isSupportedUploadFile(file)) {
        setGenerationError(
          `\"${file.name}\" is not supported here. Materials currently accepts ${SUPPORTED_SOURCE_UPLOAD_FORMATS_TEXT}.`
        )
        continue
      }

      const normalizedName = file.name.trim().toLowerCase()
      const duplicateExists = materials.some(
        (material) =>
          material.role === role && material.name.trim().toLowerCase() === normalizedName
      )

      if (duplicateExists) {
        setGenerationError(`\"${file.name}\" is already added in ${role} materials.`)
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
        const message = error instanceof Error ? error.message : "Unable to read uploaded file"
        store.setMaterialError(id, message)
      }
    }
  }

  function handleFilesSelected(role: MaterialRole, event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    void handleFilesAdded(role, files)
    event.target.value = ""
  }

  function handleDrop(role: MaterialRole, event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDraggingRole(null)
    const files = Array.from(event.dataTransfer.files ?? [])
    if (files.length === 0) return
    void handleFilesAdded(role, files)
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

  const processingCount = counts.uploaded + counts.extracting + counts.analyzing

  return (
    <div style={pageStyle}>
      <OrchardPageHeader label="Source Workbench" title="Materials" introMaxWidth={760}>
        <p style={introStyle}>
          Add the curriculum and exemplar materials you want this lesson to follow. Drag files in or browse from your device, then generate once at least one material is ready to use.
        </p>
        <p style={introStyle}>
          Curriculum shapes lesson content. Exemplar shapes pacing, prompts, and structure.
          Supported uploads: {SUPPORTED_SOURCE_UPLOAD_FORMATS_TEXT}.
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
        <UploadLaneCard
          role="curriculum"
          title="Curriculum"
          authorityLabel="Content authority"
          description="Add the standards, texts, examples, and practice materials the lesson should follow."
          count={laneCounts.curriculum}
          dragging={draggingRole === "curriculum"}
          onBrowse={() => curriculumInputRef.current?.click()}
          onDragStateChange={(active) => setDraggingRole(active ? "curriculum" : null)}
          onDrop={(event) => handleDrop("curriculum", event)}
        />

        <UploadLaneCard
          role="exemplar"
          title="Exemplar"
          authorityLabel="Presentation authority"
          description="Add the slide decks, pacing models, and sample lessons that should shape structure and delivery."
          count={laneCounts.exemplar}
          dragging={draggingRole === "exemplar"}
          onBrowse={() => exemplarInputRef.current?.click()}
          onDragStateChange={(active) => setDraggingRole(active ? "exemplar" : null)}
          onDrop={(event) => handleDrop("exemplar", event)}
        />
      </div>

      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, marginBottom: "var(--space-md)", color: "var(--orchard-green)" }}>
          Generation Status
        </h3>

        <div style={summaryGridStyle}>
          <SummaryCard label="Total" value={counts.total} />
          <SummaryCard label="Ready" value={counts.ready} />
          <SummaryCard label="Processing" value={processingCount} />
          <SummaryCard label="Needs attention" value={counts.error} />
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
            ? "Wait for the current uploads to finish before generating."
            : hasUsableMaterialsForGeneration
              ? "You can generate now. At least one material is ready to use."
              : "Add materials until at least one curriculum or exemplar file is ready to use."}
        </div>

        <div style={{ marginTop: "var(--space-md)", display: "grid", gap: 10 }}>
          <button
            type="button"
            onClick={handleGenerateLesson}
            disabled={!canGenerate || isGenerating}
            style={primaryButtonStyle(!canGenerate || isGenerating)}
          >
            {isGenerating ? "Generating Lesson..." : "Generate Lesson"}
          </button>

          <div style={helperTextStyle}>
            {!hasRequiredInputs
              ? "Complete the required lesson inputs before generating."
              : hasProcessingMaterials
                ? "Wait until the current uploads finish."
                : !hasUsableMaterialsForGeneration
                  ? "At least one curriculum or exemplar material needs to finish ready to use."
                  : "Inputs are complete and you can generate now."}
          </div>

          {generationError ? <div style={errorTextStyle}>{generationError}</div> : null}
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: "var(--space-md)" }}>
        <h3 style={{ marginTop: 0, marginBottom: "var(--space-sm)", color: "var(--orchard-green)" }}>
          Uploaded Materials
        </h3>
        <p style={{ ...helperTextStyle, marginTop: 0, marginBottom: "var(--space-md)" }}>
          Each file shows whether it is being prepared, ready to use, or needs attention.
        </p>

        {materials.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", marginBottom: 0 }}>
            No materials added yet.
          </p>
        ) : (
          <div style={listStyle}>
            {materials.map((material) => (
              <div key={material.id} style={rowStyle}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)", wordBreak: "break-word" }}>
                    {material.name}
                  </div>

                  <div style={materialMetaStyle}>
                    <span style={roleBadgeStyle(material.role)}>{formatRoleLabel(material.role)}</span>
                    <span style={statusBadgeStyle(material.status)}>{formatStatus(material.status)}</span>
                  </div>
                </div>

                <div style={{ minWidth: 220, display: "grid", gap: 8, justifyItems: "end" }}>
                  <div style={materialStatusTextStyle}>{getTeacherVisibleMaterialNote(material)}</div>
                  {material.errorMessage && material.status !== "error" ? (
                    <div style={{ ...materialStatusTextStyle, color: "var(--cranberry)" }}>
                      {material.errorMessage}
                    </div>
                  ) : null}

                  {material.role === "exemplar" ? (
                    <div style={exemplarControlCardStyle}>
                      <div style={{ fontWeight: 700, color: "var(--deep-orchard)", fontSize: 13 }}>
                        Exemplar Influence
                      </div>

                      <div style={exemplarOptionListStyle}>
                        {[
                          {
                            value: "inspiration",
                            label: "Use as inspiration",
                            help: "Borrow broad feel and direction without trying to mirror the source closely.",
                          },
                          {
                            value: "copy_closely",
                            label: "Copy closely",
                            help: "Preserve as much structure, pacing, and teacher-facing style as possible.",
                          },
                          {
                            value: "selected_aspects",
                            label: "Choose specific aspects",
                            help: "Apply only the exemplar features you explicitly select below.",
                          },
                          {
                            value: "custom",
                            label: "Custom instructions",
                            help: "Write a teacher-facing note about how this exemplar should influence the lesson.",
                          },
                        ].map((option) => {
                          const settings = material.styleSettings ?? {
                            mode: "inspiration",
                            aspects: [],
                            customInstructions: "",
                          }

                          return (
                            <label key={option.value} style={exemplarLabelStyle}>
                              <input
                                type="radio"
                                name={`exemplar-style-${material.id}`}
                                checked={settings.mode === option.value}
                                onChange={() =>
                                  setMaterialStyleSettings(material.id, {
                                    ...settings,
                                    mode: option.value as ExemplarStyleSettings["mode"],
                                  })
                                }
                              />
                              <span>
                                <strong>{option.label}</strong>
                                <div style={exemplarSubtleTextStyle}>{option.help}</div>
                              </span>
                            </label>
                          )
                        })}
                      </div>

                      {(material.styleSettings?.mode ?? "inspiration") === "selected_aspects" ? (
                        <div style={{ display: "grid", gap: 8 }}>
                          <div style={exemplarSubtleTextStyle}>
                            Select the exemplar aspects this lesson should preserve.
                          </div>
                          <div style={exemplarCheckboxGridStyle}>
                            {EXEMPLAR_ASPECT_OPTIONS.map((aspect) => {
                              const settings = material.styleSettings ?? {
                                mode: "inspiration",
                                aspects: [],
                                customInstructions: "",
                              }
                              const checked = settings.aspects.includes(aspect.value)

                              return (
                                <label key={aspect.value} style={exemplarLabelStyle}>
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() =>
                                      setMaterialStyleSettings(material.id, {
                                        ...settings,
                                        aspects: checked
                                          ? settings.aspects.filter((value) => value !== aspect.value)
                                          : [...settings.aspects, aspect.value],
                                      })
                                    }
                                  />
                                  <span>{aspect.label}</span>
                                </label>
                              )
                            })}
                          </div>
                        </div>
                      ) : null}

                      {(material.styleSettings?.mode ?? "inspiration") === "custom" ? (
                        <div style={{ display: "grid", gap: 8 }}>
                          <div style={exemplarSubtleTextStyle}>
                            Describe how this exemplar should influence the lesson package.
                          </div>
                          <textarea
                            value={material.styleSettings?.customInstructions ?? ""}
                            onChange={(event) => {
                              const settings = material.styleSettings ?? {
                                mode: "custom",
                                aspects: [],
                                customInstructions: "",
                              }

                              setMaterialStyleSettings(material.id, {
                                ...settings,
                                customInstructions: event.target.value,
                              })
                            }}
                            placeholder="Example: Keep the I do / We do / You do flow and concise slide titles, but do not copy wording."
                            style={exemplarTextareaStyle}
                          />
                        </div>
                      ) : null}
                    </div>
                  ) : null}

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

function UploadLaneCard({
  role,
  title,
  authorityLabel,
  description,
  count,
  dragging,
  onBrowse,
  onDragStateChange,
  onDrop,
}: {
  role: MaterialRole
  title: string
  authorityLabel: string
  description: string
  count: number
  dragging: boolean
  onBrowse: () => void
  onDragStateChange: (active: boolean) => void
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void
}) {
  return (
    <div
      style={uploadCardStyle(role, dragging)}
      onDragEnter={(event) => {
        event.preventDefault()
        onDragStateChange(true)
      }}
      onDragOver={(event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = "copy"
        onDragStateChange(true)
      }}
      onDragLeave={() => onDragStateChange(false)}
      onDrop={onDrop}
    >
      <div style={laneMetaStyle}>
        <span style={miniTagStyle(role)}>{authorityLabel}</span>
        <span style={orchardTagStyle("neutral")}>{count} added</span>
      </div>

      <h3 style={laneTitleStyle}>{title}</h3>
      <p style={laneBodyStyle}>{description}</p>

      <div style={dropZoneStyle(dragging)}>
        <div style={dragPromptStyle}>
          <div style={dragPromptTitleStyle}>
            {dragging ? "Drop files to add them" : "Drag and drop files here"}
          </div>
          <div style={dragPromptBodyStyle}>You can also browse and choose more than one file.</div>
        </div>

        <button type="button" style={buttonStyle()} onClick={onBrowse}>
          {role === "curriculum" ? "Browse curriculum materials" : "Browse exemplar materials"}
        </button>
      </div>

      <div style={laneSupportTextStyle}>Supports {SUPPORTED_SOURCE_UPLOAD_FORMATS_TEXT}.</div>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div style={summaryCardStyle}>
      <div style={summaryLabelStyle}>{label}</div>
      <div style={summaryValueStyle}>{value}</div>
    </div>
  )
}

function shouldCapturePlainText(fileName: string): boolean {
  const normalized = fileName.toLowerCase()
  return normalized.endsWith(".txt") || normalized.endsWith(".html") || normalized.endsWith(".htm")
}

function formatRoleLabel(role: MaterialRole): string {
  return role === "curriculum" ? "Curriculum" : "Exemplar"
}

function formatStatus(status: MaterialStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function miniTagStyle(role: MaterialRole): React.CSSProperties {
  return orchardTagStyle(role === "curriculum" ? "moss" : "cranberry")
}

function roleBadgeStyle(role: MaterialRole): React.CSSProperties {
  return orchardTagStyle(role === "curriculum" ? "moss" : "cranberry")
}

function statusBadgeStyle(status: MaterialStatus): React.CSSProperties {
  if (status === "ready") return orchardStatusBadgeStyle("moss")
  if (status === "error") return orchardStatusBadgeStyle("cranberry")
  return orchardStatusBadgeStyle("honey")
}

function uploadCardStyle(role: MaterialRole, dragging: boolean): React.CSSProperties {
  return {
    ...orchardSoftCardStyle,
    background:
      role === "curriculum"
        ? "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,246,233,0.82))"
        : "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,214,208,0.18))",
    border: dragging
      ? "1px solid var(--orchard-green)"
      : "1px solid rgba(231, 226, 218, 0.96)",
    boxShadow: dragging ? "0 0 0 3px rgba(110, 139, 107, 0.12)" : orchardSoftCardStyle.boxShadow,
  }
}

function dropZoneStyle(dragging: boolean): React.CSSProperties {
  return {
    display: "grid",
    gap: 12,
    justifyItems: "center",
    padding: "18px 16px",
    borderRadius: "var(--radius-md)",
    border: dragging
      ? "2px dashed var(--orchard-green)"
      : "2px dashed rgba(110, 139, 107, 0.28)",
    background: dragging ? "rgba(110, 139, 107, 0.08)" : "rgba(255, 255, 255, 0.76)",
  }
}

function primaryButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    ...orchardButtonStyle({ active: !disabled }),
    opacity: disabled ? 0.7 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : "var(--shadow-soft)",
    border: disabled ? "1px solid var(--border-soft)" : "1px solid var(--orchard-green)",
    background: disabled ? "var(--warm-gray)" : "var(--orchard-green)",
    color: disabled ? "var(--text-secondary)" : "var(--paper-white)",
  }
}

function buttonStyle(): React.CSSProperties {
  return {
    ...orchardButtonStyle({ subtle: true }),
    cursor: "pointer",
    fontWeight: 700,
  }
}

function secondaryButtonStyle(): React.CSSProperties {
  return {
    ...orchardButtonStyle({ subtle: true }),
    padding: "8px 10px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
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

const summaryCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: 14,
}

const summaryLabelStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: 0.4,
  marginBottom: 6,
}

const summaryValueStyle: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: 30,
  color: "var(--orchard-green)",
}






