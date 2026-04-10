import React, { useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  SUPPORTED_SOURCE_UPLOAD_ACCEPT,
  SUPPORTED_SOURCE_UPLOAD_FORMATS_TEXT,
} from "../engine/materials/sourceIntakeContract"
import {
  ExemplarStyleAspect,
  ExemplarStyleSettings,
  LessonInputs,
  MaterialFile,
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
import {
  buttonStyle,
  dropZoneStyle,
  formatRoleLabel,
  formatStatus,
  miniTagStyle,
  noticeStyle,
  primaryButtonStyle,
  roleBadgeStyle,
  secondaryButtonStyle,
  statusBadgeStyle,
  uploadCardStyle,
} from "./materialsPageUiHelpers"
import {
  EXEMPLAR_ASPECT_OPTIONS,
  EXEMPLAR_INFLUENCE_MODE_OPTIONS,
  EXEMPLAR_TARGET_OPTIONS,
  getDefaultExemplarStyleSettings,
} from "./materialsPageExemplarHelpers"

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


const standardsCardStyle: React.CSSProperties = {
  marginTop: 12,
  padding: 14,
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border-honey)",
  background: "rgba(242, 192, 120, 0.16)",
  display: "grid",
  gap: 10,
}

const standardsTagRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
}

const standardsInputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 82,
  resize: "vertical",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-paper)",
  padding: "10px 12px",
  font: "inherit",
  color: "var(--text-primary)",
  background: "rgba(255,255,255,0.96)",
  boxSizing: "border-box",
}

const standardsLabelStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
  fontSize: 12,
  color: "var(--text-secondary)",
}
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

    const existingNames = new Set(
      useLessonStore
        .getState()
        .materials.filter((material) => material.role === role)
        .map((material) => material.name.trim().toLowerCase())
    )
    const acceptedUploads: Array<{
      file: File
      id: string
      sourceMetadata: ReturnType<typeof buildUploadSourceMetadata>
    }> = []

    for (const file of files) {
      if (!isSupportedUploadFile(file)) {
        setGenerationError(
          `\"${file.name}\" is not supported here. Materials currently accepts ${SUPPORTED_SOURCE_UPLOAD_FORMATS_TEXT}.`
        )
        continue
      }

      const normalizedName = file.name.trim().toLowerCase()

      if (existingNames.has(normalizedName)) {
        setGenerationError(`\"${file.name}\" is already added in ${role} materials.`)
        continue
      }

      existingNames.add(normalizedName)

      const sourceMetadata = buildUploadSourceMetadata(file)
      const id = addMaterial(role, file.name, sourceMetadata)

      acceptedUploads.push({
        file,
        id,
        sourceMetadata,
      })
    }

    await Promise.all(
      acceptedUploads.map(async ({ file, id, sourceMetadata }) => {
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
      })
    )
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

                      <div style={{ display: "grid", gap: 8 }}>
                        <div style={exemplarSubtleTextStyle}>
                          Choose where this exemplar should apply. You can keep one exemplar for slides, another for the lesson plan, another for centers or teacher-led support, and another for printables.
                        </div>
                        <div style={exemplarCheckboxGridStyle}>
                          {EXEMPLAR_TARGET_OPTIONS.map((targetOption) => {
                            const settings = getDefaultExemplarStyleSettings(material.styleSettings)
                            const checked = settings.targets.includes(targetOption.value)

                            return (
                              <label key={targetOption.value} style={exemplarLabelStyle}>
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => {
                                    const nextTargets = checked
                                      ? settings.targets.filter((value) => value !== targetOption.value)
                                      : [...settings.targets, targetOption.value]

                                    setMaterialStyleSettings(material.id, {
                                      ...settings,
                                      targets: nextTargets.length > 0 ? nextTargets : ["shared"],
                                    })
                                  }}
                                />
                                <span>
                                  <strong>{targetOption.label}</strong>
                                  <div style={exemplarSubtleTextStyle}>{targetOption.help}</div>
                                </span>
                              </label>
                            )
                          })}
                        </div>
                      </div>

                      <div style={exemplarOptionListStyle}>
                        {EXEMPLAR_INFLUENCE_MODE_OPTIONS.map((option) => {
                          const settings = getDefaultExemplarStyleSettings(material.styleSettings)

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
                              const settings = getDefaultExemplarStyleSettings(material.styleSettings)
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
                            Describe the style changes you want while keeping the exemplar structure that is already working.
                          </div>
                          <textarea
                            value={material.styleSettings?.customInstructions ?? ""}
                            onChange={(event) => {
                              const settings = getDefaultExemplarStyleSettings(material.styleSettings)

                              setMaterialStyleSettings(material.id, {
                                ...settings,
                                customInstructions: event.target.value,
                              })
                            }}
                            placeholder="Example: Keep the layout, lesson flow, and timing, but change the colors/theme and use plainer wording."
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


function normalizeStandardCandidate(value: string): string {
  return String(value ?? "")
    .replace(/^[\s*Ã¢â‚¬Â¢\-Ã¢â‚¬â€œÃ¢â‚¬â€]+/, "")
    .replace(/\s+/g, " ")
    .trim()
}

function uniqueStandardCandidates(values: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  values
    .map(normalizeStandardCandidate)
    .filter(Boolean)
    .filter((value) => value.length <= 180)
    .forEach((value) => {
      const key = value.toLowerCase()
      if (seen.has(key)) return
      seen.add(key)
      result.push(value)
    })

  return result
}

function looksLikeStandardCandidate(value: string): boolean {
  const normalized = normalizeStandardCandidate(value)
  const lower = normalized.toLowerCase()

  return (
    /[a-z]+\.[a-z0-9]+\.[a-z0-9]+/i.test(normalized) ||
    lower.includes("standard") ||
    lower.includes("decode") ||
    lower.includes("phonics") ||
    lower.includes("comprehension") ||
    lower.includes("main idea") ||
    lower.includes("key details")
  )
}

function buildSuggestedStandards(materials: MaterialFile[], inputs: LessonInputs): string[] {
  const curriculumMaterials = materials.filter(
    (material) => material.role === "curriculum" && material.status === "ready" && Boolean(material.analysis)
  )

  const reviewed = curriculumMaterials.flatMap((material) => material.analysisReview?.standards ?? [])
  const analyzed = curriculumMaterials.flatMap((material) => material.analysis?.curriculum?.standards ?? [])
  const extracted = curriculumMaterials
    .flatMap((material) => material.analysis?.extractedText ?? [])
    .filter(looksLikeStandardCandidate)

  const candidates = uniqueStandardCandidates([...reviewed, ...analyzed, ...extracted])
  if (candidates.length > 0) {
    return candidates.slice(0, 6)
  }

  const focus = [inputs.skill.trim(), inputs.topic.trim()].filter(Boolean).join(" / ")
  if (!focus) {
    return []
  }

  const subject = inputs.subject.trim() || "lesson"
  const grade = inputs.grade.trim() ? `Grade ${inputs.grade.trim()} ` : ""

  return [`${grade}${subject} inferred standard focus: ${focus}`]
}

function StandardsConfirmationCard({
  suggestedStandards,
  confirmedStandards,
  onApplySuggestions,
  onChange,
}: {
  suggestedStandards: string[]
  confirmedStandards: string
  onApplySuggestions: () => void
  onChange: (value: string) => void
}) {
  return (
    <div style={standardsCardStyle}>
      <div style={{ fontWeight: 700, color: "var(--deep-orchard)", fontSize: 14 }}>
        Standards confirmation needed
      </div>
      <div style={exemplarSubtleTextStyle}>
        Standards were left blank on Inputs. Review these suggestions, then accept or edit them before generating.
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 13 }}>
          Suggested standards
        </div>
        {suggestedStandards.length > 0 ? (
          <div style={standardsTagRowStyle}>
            {suggestedStandards.map((standard) => (
              <span key={standard} style={orchardTagStyle("honey")}>
                {standard}
              </span>
            ))}
          </div>
        ) : (
          <div style={exemplarSubtleTextStyle}>No suggestions are available yet.</div>
        )}
      </div>

      <label style={standardsLabelStyle}>
        <span>Confirmed standards</span>
        <textarea
          value={confirmedStandards}
          onChange={(event) => onChange(event.target.value)}
          placeholder={suggestedStandards.join("; ")}
          style={standardsInputStyle}
        />
      </label>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={onApplySuggestions}
          style={secondaryButtonStyle()}
        >
          Use suggested standards
        </button>
      </div>

      <div style={exemplarSubtleTextStyle}>
        Generation unlocks once this field is filled in. You can edit the suggestions directly before continuing.
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






