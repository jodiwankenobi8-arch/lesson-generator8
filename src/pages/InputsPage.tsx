import React from "react"
import { useNavigate } from "react-router-dom"
import { LessonMode } from "../engine/types"
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

const modeCardStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 14,
  background: "#fafaf9",
}

const modeOptionStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  padding: "10px 0",
  borderTop: "1px solid #ece7df",
}

export default function InputsPage() {
  const navigate = useNavigate()

  const inputs = useLessonStore((state) => state.inputs)
  const setInputs = useLessonStore((state) => state.setInputs)
  const selectedLessonMode = useLessonStore((state) => state.selectedLessonMode)
  const setSelectedLessonMode = useLessonStore((state) => state.setSelectedLessonMode)
  const hasRequiredInputs = useLessonStore((state) => state.hasRequiredInputs)()

  const updateInput =
    (field: keyof typeof inputs) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setInputs({ [field]: event.target.value })
    }

  const mixedSignal = detectMixedSignal(inputs.skill, inputs.topic)

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
          <div style={modeCardStyle}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Lesson shape</div>
            <div style={{ color: "#4b5563", fontSize: 14, marginBottom: 8 }}>
              Choose whether to generate one lesson focus or a fuller mixed lesson.
            </div>

            <div
              style={{
                ...noticeStyle,
                marginBottom: 12,
                background: mixedSignal.isMixed ? "#fff7ed" : "#f9fafb",
                borderColor: mixedSignal.isMixed ? "#fed7aa" : "#e5e7eb",
                color: mixedSignal.isMixed ? "#9a3412" : "#4b5563",
              }}
            >
              {mixedSignal.message}
            </div>

            <LessonModeOption
              mode="single"
              selected={selectedLessonMode === "single"}
              title="Single target auto mode"
              description="Let the system resolve a single main lesson focus from your inputs."
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
        <div style={{ fontWeight: 600, color: "#111827" }}>{title}</div>
        <div style={{ color: "#4b5563", fontSize: 14, marginTop: 2 }}>{description}</div>
      </div>
    </label>
  )
}

function detectMixedSignal(skill: string, topic: string): { isMixed: boolean; message: string } {
  const combined = `${skill} ${topic}`.toLowerCase()

  const phonicsTerms = [
    "phonics",
    "long a",
    "short a",
    "cvc",
    "cvce",
    "blend",
    "digraph",
    "decoding",
    "encoding",
    "word study",
    "word work",
    "spelling",
    "syllable",
  ]

  const comprehensionTerms = [
    "comprehension",
    "main idea",
    "theme",
    "character",
    "retell",
    "infer",
    "inference",
    "evidence",
    "text",
    "passage",
    "story",
    "article",
    "reading response",
  ]

  const hasPhonics = phonicsTerms.some((term) => combined.includes(term))
  const hasComprehension = comprehensionTerms.some((term) => combined.includes(term))

  if (hasPhonics && hasComprehension) {
    return {
      isMixed: true,
      message:
        "Your inputs look mixed. Choose Full mixed lesson to keep both parts, or choose just the portion you want generated.",
    }
  }

  if (hasPhonics) {
    return {
      isMixed: false,
      message:
        "Your inputs currently read mostly as phonics-focused. Stay in Single target auto mode unless you want to force a different output shape.",
    }
  }

  if (hasComprehension) {
    return {
      isMixed: false,
      message:
        "Your inputs currently read mostly as comprehension-focused. Stay in Single target auto mode unless you want to force a different output shape.",
    }
  }

  return {
    isMixed: false,
    message:
      "Choose a lesson shape now if you already know what should be generated. Otherwise leave it on Single target auto mode.",
  }
}
