import React from "react"
import { useNavigate } from "react-router-dom"
import { useLessonStore } from "../state/useLessonStore"

const pageStyle: React.CSSProperties = {
  maxWidth: 900,
  margin: "0 auto",
}

const introStyle: React.CSSProperties = {
  color: "#4b5563",
  marginBottom: 24,
}

const cardStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 20,
  background: "#ffffff",
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 16,
}

const fullWidthStyle: React.CSSProperties = {
  gridColumn: "1 / -1",
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 600,
  marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  fontSize: 14,
  boxSizing: "border-box",
}

const helpStyle: React.CSSProperties = {
  marginTop: 4,
  fontSize: 12,
  color: "#6b7280",
  fontWeight: 400,
}

const buttonRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 24,
  gap: 12,
  flexWrap: "wrap",
}

const buttonStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #111827",
  background: "#111827",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: 600,
}

const disabledButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  border: "1px solid #d1d5db",
  background: "#e5e7eb",
  color: "#6b7280",
  cursor: "not-allowed",
}

const noticeStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  color: "#4b5563",
  fontSize: 14,
}

export default function InputsPage() {
  const navigate = useNavigate()

  const inputs = useLessonStore((state) => state.inputs)
  const setInputs = useLessonStore((state) => state.setInputs)
  const hasRequiredInputs = useLessonStore((state) => state.hasRequiredInputs)()

  const updateInput =
    (field: keyof typeof inputs) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setInputs({ [field]: event.target.value })
    }

  return (
    <div style={pageStyle}>
      <h2 style={{ marginTop: 0 }}>Inputs</h2>
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
              style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
            />
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={noticeStyle}>
            Required before Results can generate: grade, subject, standard, skill focus, lesson topic, and duration.
          </div>
        </div>

        <div style={buttonRowStyle}>
          <div style={{ color: hasRequiredInputs ? "#047857" : "#6b7280", fontSize: 14, fontWeight: 600 }}>
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
