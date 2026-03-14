import React from "react"
import { useNavigate } from "react-router-dom"
import { LessonMode } from "../engine/types"
import { useLessonStore } from "../state/useLessonStore"

const pageStyle: React.CSSProperties = {
  maxWidth: 920,
  margin: "0 auto",
}

const introStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  marginBottom: "var(--space-lg)",
  fontSize: 16,
  maxWidth: 720,
}

const cardStyle: React.CSSProperties = {
  border: "1px solid var(--border-soft)",
  borderRadius: "var(--radius-lg)",
  padding: "var(--space-xl)",
  background: "var(--paper-white)",
  boxShadow: "var(--shadow-card)",
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "var(--space-md)",
}

const fullWidthStyle: React.CSSProperties = {
  gridColumn: "1 / -1",
}

const sectionLabelStyle: React.CSSProperties = {
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
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 700,
  marginBottom: 6,
  color: "var(--orchard-green)",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border-soft)",
  fontSize: 14,
  boxSizing: "border-box",
  background: "#fffdfa",
  color: "var(--text-primary)",
}

const helpStyle: React.CSSProperties = {
  marginTop: 4,
  fontSize: 12,
  color: "var(--text-secondary)",
  fontWeight: 400,
}

const buttonRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "var(--space-xl)",
  gap: "var(--space-md)",
  flexWrap: "wrap",
}

const buttonStyle: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--orchard-green)",
  background: "var(--orchard-green)",
  color: "var(--paper-white)",
  cursor: "pointer",
  fontWeight: 700,
  boxShadow: "var(--shadow-soft)",
}

const disabledButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  border: "1px solid var(--border-soft)",
  background: "#e5e7eb",
  color: "var(--text-secondary)",
  cursor: "not-allowed",
  boxShadow: "none",
}

const noticeStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border-soft)",
  background: "#fcfbf8",
  color: "var(--text-secondary)",
  fontSize: 14,
}

const modeCardStyle: React.CSSProperties = {
  border: "1px solid var(--border-soft)",
  borderRadius: "var(--radius-lg)",
  padding: "var(--space-lg)",
  background: "#fcfbf8",
}

const modeOptionStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  padding: "12px 0",
  borderTop: "1px solid #ece7df",
}

export default function InputsPage() {
  const navigate = useNavigate()

  const inputs = useLessonStore((state) => state.inputs)
  const setInputs = useLessonStore((state) => state.setInputs)
  const selectedLessonMode = useLessonStore((state) => state.selectedLessonMode)
  const setSelectedLessonMode = useLessonStore((state) => state.setSelectedLessonMode)
  const hasRequiredInputs = useLessonStore((state) => state.hasRequiredInputs)()
  const targetPreview = useLessonStore((state) => state.getTargetPreview)()
  const [showLessonShapeOverride, setShowLessonShapeOverride] = React.useState(
    selectedLessonMode !== "single"
  )

  const updateInput =
    (field: keyof typeof inputs) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setInputs({ [field]: event.target.value })
    }

  return (
    <div style={pageStyle}>
      <div style={sectionLabelStyle}>Lesson Setup</div>
      <h2
        style={{
          marginTop: 0,
          marginBottom: "var(--space-sm)",
          fontFamily: "var(--font-heading)",
          fontSize: 32,
          color: "var(--orchard-green)",
        }}
      >
        Inputs
      </h2>
      <p style={introStyle}>
        Define the lesson intent before adding curriculum and exemplar materials.
      </p>

      <div style={cardStyle}>
        <div style={gridStyle}>
          <div>
            <label style={labelStyle} htmlFor="grade">
              Grade
            </label>
            <input
              id="grade"
              value={inputs.grade}
              onChange={updateInput("grade")}
              placeholder="Kindergarten"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="subject">
              Subject
            </label>
            <input
              id="subject"
              value={inputs.subject}
              onChange={updateInput("subject")}
              placeholder="ELA"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="standard">
              Standard
            </label>
            <input
              id="standard"
              value={inputs.standard}
              onChange={updateInput("standard")}
              placeholder="RF.K.3"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle} htmlFor="duration">
              Duration
            </label>
            <input
              id="duration"
              value={inputs.duration}
              onChange={updateInput("duration")}
              placeholder="25 minutes"
              style={inputStyle}
            />
            <div style={helpStyle}>Keep this as text for now to match the current engine types.</div>
          </div>

          <div style={fullWidthStyle}>
            <label style={labelStyle} htmlFor="skill">
              Skill Focus
            </label>
            <input
              id="skill"
              value={inputs.skill}
              onChange={updateInput("skill")}
              placeholder="Long A phonics"
              style={inputStyle}
            />
          </div>

          <div style={fullWidthStyle}>
            <label style={labelStyle} htmlFor="topic">
              Lesson Topic
            </label>
            <textarea
              id="topic"
              value={inputs.topic}
              onChange={updateInput("topic")}
              placeholder="Reading long A words in connected text"
              style={{ ...inputStyle, minHeight: 120, resize: "vertical" }}
            />
          </div>
        </div>

        <div style={{ marginTop: "var(--space-xl)" }}>
          <div style={modeCardStyle}>
            <div style={{ fontWeight: 700, marginBottom: 6, color: "var(--orchard-green)" }}>
              Lesson shape
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 8 }}>
              The system recommends a lesson shape from your inputs behind the scenes. Change it manually only if you need to override the recommendation.
            </div>

            <div
              style={{
                ...noticeStyle,
                marginBottom: 12,
                background: targetPreview.isMixedTarget ? "#fff7ed" : "#fcfbf8",
                borderColor: targetPreview.isMixedTarget ? "#fed7aa" : "var(--border-soft)",
                color: targetPreview.isMixedTarget ? "#9a3412" : "var(--text-secondary)",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 4 }}>
                Recommended shape: {formatLessonModeLabel(targetPreview.recommendedMode)}
              </div>
              <div>{targetPreview.message}</div>
              {selectedLessonMode !== "single" && (
                <div style={{ marginTop: 6, fontSize: 13 }}>
                  Manual override active: {formatLessonModeLabel(selectedLessonMode)}
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: showLessonShapeOverride ? 12 : 0,
              }}
            >
              <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                {showLessonShapeOverride
                  ? "Manual lesson shape options are visible below."
                  : "Using automatic recommendation by default."}
              </div>

              <button
                type="button"
                onClick={() => setShowLessonShapeOverride((value) => !value)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid var(--border-soft)",
                  background: "#ffffff",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {showLessonShapeOverride ? "Hide manual lesson shape options" : "Change lesson shape manually"}
              </button>
            </div>

            {showLessonShapeOverride && (
              <>
                <LessonModeOption
                  mode="single"
                  selected={selectedLessonMode === "single"}
                  title="Automatic recommendation"
                  description="Let the system resolve the lesson shape from your inputs."
                  onSelect={setSelectedLessonMode}
                  isFirst
                />

                <LessonModeOption
                  mode="full"
                  selected={selectedLessonMode === "full"}
                  title="Full mixed lesson"
                  description="Use this when you want both parts preserved, such as phonics plus comprehension."
                  onSelect={setSelectedLessonMode}
                />

                <LessonModeOption
                  mode="phonics_only"
                  selected={selectedLessonMode === "phonics_only"}
                  title="Phonics only"
                  description="Generate only the phonics portion when the input includes extra reading/comprehension context."
                  onSelect={setSelectedLessonMode}
                />

                <LessonModeOption
                  mode="comprehension_only"
                  selected={selectedLessonMode === "comprehension_only"}
                  title="Comprehension only"
                  description="Generate only the comprehension/text-thinking portion."
                  onSelect={setSelectedLessonMode}
                />
              </>
            )}
          </div>
        </div>

        <div style={{ marginTop: "var(--space-lg)" }}>
          <div style={noticeStyle}>
            Required before Results can generate: grade, subject, standard, skill focus, lesson topic, and duration.
          </div>
        </div>

        <div style={buttonRowStyle}>
          <div
            style={{
              color: hasRequiredInputs ? "#047857" : "var(--text-secondary)",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {hasRequiredInputs ? "Inputs complete" : "Complete all required lesson fields"}
          </div>

          <button
            type="button"
            onClick={() => navigate("/materials")}
            style={hasRequiredInputs ? buttonStyle : disabledButtonStyle}
            disabled={!hasRequiredInputs}
          >
            Continue to Materials
          </button>
        </div>
      </div>
    </div>
  )
}

function formatLessonModeLabel(mode: LessonMode): string {
  if (mode === "full") return "Full mixed lesson"
  if (mode === "phonics_only") return "Phonics only"
  if (mode === "comprehension_only") return "Comprehension only"
  return "Automatic recommendation"
}

function LessonModeOption({
  mode,
  selected,
  title,
  description,
  onSelect,
  isFirst = false,
}: {
  mode: LessonMode
  selected: boolean
  title: string
  description: string
  onSelect: (mode: LessonMode) => void
  isFirst?: boolean
}) {
  return (
    <label
      style={{
        ...modeOptionStyle,
        borderTop: isFirst ? "none" : modeOptionStyle.borderTop,
        cursor: "pointer",
      }}
    >
      <input
        type="radio"
        name="lesson-mode"
        checked={selected}
        onChange={() => onSelect(mode)}
        style={{ marginTop: 3 }}
      />
      <div>
        <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{title}</div>
        <div style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 2 }}>{description}</div>
      </div>
    </label>
  )
}
