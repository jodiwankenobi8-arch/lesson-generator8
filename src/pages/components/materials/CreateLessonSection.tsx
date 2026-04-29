import React from "react"
import { orchardCardStyle, orchardSoftCardStyle, orchardTagStyle } from "../../orchardUi"
import { secondaryButtonStyle, primaryButtonStyle } from "../../materialsPageUiHelpers"
import { MaterialsGenerationStatusSection } from "./MaterialsGenerationStatusSection"

const cardStyle: React.CSSProperties = {
  ...orchardCardStyle,
}

const helperTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: "var(--text-secondary)",
}

const errorTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: "var(--cranberry)",
}

const exemplarSubtleTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "var(--text-secondary)",
  lineHeight: 1.5,
}

const quickDraftCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: 18,
  display: "grid",
  gap: 14,
  border: "1px solid var(--border-moss)",
  background: "rgba(110, 139, 107, 0.08)",
}

const draftSummaryGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 10,
}

const draftSummaryCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: 12,
  display: "grid",
  gap: 6,
  background: "rgba(255,255,255,0.88)",
  border: "1px solid var(--border-paper)",
}

const draftSupportRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
}

const draftFooterStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  paddingTop: 4,
}

type LessonDraftSummary = {
  summaryText: string
  materialName: string
  additionalReadyCount: number
}

type CreateLessonSectionProps = {
  showGenerationStatus: boolean
  generationStatusMode: "idle" | "processing" | "ready"
  generationStatusMessage: string
  hasLessonDraft: boolean
  lessonDraftStatusText: string
  compactEditMode: boolean
  onToggleCompactEditMode: (nextValue: boolean) => void
  draftReadinessLabel: string
  draftReadinessTagColor: "moss" | "neutral" | "honey" | "cranberry"
  curriculumSummary: LessonDraftSummary | null
  exemplarSummary: LessonDraftSummary | null
  compactDraftFields: React.ReactNode
  editDraftFields: React.ReactNode
  standardsDetails: React.ReactNode
  generationHelperText: string
  onGenerateLesson: () => void
  generateBlocked: boolean
  isGenerating: boolean
  generationError: string | null
}

export function CreateLessonSection({
  showGenerationStatus,
  generationStatusMode,
  generationStatusMessage,
  hasLessonDraft,
  lessonDraftStatusText,
  compactEditMode,
  onToggleCompactEditMode,
  draftReadinessLabel,
  draftReadinessTagColor,
  curriculumSummary,
  exemplarSummary,
  compactDraftFields,
  editDraftFields,
  standardsDetails,
  generationHelperText,
  onGenerateLesson,
  generateBlocked,
  isGenerating,
  generationError,
}: CreateLessonSectionProps) {
  return (
    <div style={{ ...cardStyle, marginTop: "var(--space-md)" }}>
      <MaterialsGenerationStatusSection
        visible={showGenerationStatus}
        mode={generationStatusMode}
        message={generationStatusMessage}
      />

      <div style={{ display: "grid", gap: 10, marginTop: showGenerationStatus ? "var(--space-sm)" : 0 }}>
        {hasLessonDraft ? (
          <div style={quickDraftCardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ fontWeight: 700, color: "var(--deep-orchard)", fontSize: 14 }}>
                  Lesson draft
                </div>
                <div style={exemplarSubtleTextStyle}>{lessonDraftStatusText}</div>
              </div>
              {!compactEditMode ? (
                <button
                  type="button"
                  onClick={() => onToggleCompactEditMode(true)}
                  style={secondaryButtonStyle()}
                >
                  Edit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onToggleCompactEditMode(false)}
                  style={secondaryButtonStyle()}
                >
                  Done editing
                </button>
              )}
            </div>

            <div style={draftSupportRowStyle}>
              <span style={orchardTagStyle(draftReadinessTagColor)}>{draftReadinessLabel}</span>
            </div>

            {curriculumSummary || exemplarSummary ? (
              <div style={draftSummaryGridStyle}>
                {curriculumSummary ? (
                  <div style={draftSummaryCardStyle}>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 13 }}>Content</div>
                    <div style={exemplarSubtleTextStyle}>{curriculumSummary.summaryText}</div>
                    <div style={exemplarSubtleTextStyle}>
                      From {curriculumSummary.materialName}{curriculumSummary.additionalReadyCount > 0 ? ` (+${curriculumSummary.additionalReadyCount} more ready)` : ""}
                    </div>
                  </div>
                ) : null}
                {exemplarSummary ? (
                  <div style={draftSummaryCardStyle}>
                    <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 13 }}>Structure</div>
                    <div style={exemplarSubtleTextStyle}>{exemplarSummary.summaryText}</div>
                    <div style={exemplarSubtleTextStyle}>
                      From {exemplarSummary.materialName}{exemplarSummary.additionalReadyCount > 0 ? ` (+${exemplarSummary.additionalReadyCount} more ready)` : ""}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {!compactEditMode ? compactDraftFields : editDraftFields}

            {standardsDetails}

            <div style={draftFooterStyle}>
              <div style={helperTextStyle}>{generationHelperText}</div>
              <button
                type="button"
                onClick={onGenerateLesson}
                disabled={generateBlocked}
                style={primaryButtonStyle(generateBlocked)}
              >
                {isGenerating ? "Generating..." : "Generate Lesson"}
              </button>
            </div>

            {generationError ? <div style={errorTextStyle}>{generationError}</div> : null}
          </div>
        ) : null}

        {!hasLessonDraft ? standardsDetails : null}

        {!hasLessonDraft ? (
          <div style={draftFooterStyle}>
            <div style={helperTextStyle}>{generationHelperText}</div>
            <button
              type="button"
              onClick={onGenerateLesson}
              disabled={generateBlocked}
              style={primaryButtonStyle(generateBlocked)}
            >
              {isGenerating ? "Generating..." : "Generate Lesson"}
            </button>
          </div>
        ) : null}

        {!hasLessonDraft && generationError ? <div style={errorTextStyle}>{generationError}</div> : null}
      </div>
    </div>
  )
}
