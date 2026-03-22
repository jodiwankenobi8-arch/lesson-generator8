import React from "react"
import { useNavigate } from "react-router-dom"
import {
  LessonMode,
  RequestedLessonPartKey,
  RequestedOutputKey,
} from "../engine/types"
import {
  orchardButtonStyle,
  orchardCardStyle,
  orchardInputStyle,
  orchardNoticeStyle,
  orchardPageIntroBlockStyle,
  orchardSectionLabelStyle,
  orchardSectionTitleStyle,
  orchardSoftCardStyle,
  orchardTagStyle,
} from "./orchardUi"
import { useLessonStore } from "../state/useLessonStore"

type RequestOption<T extends string> = {
  key: T
  title: string
  description: string
}

const requestedLessonPartOptions: RequestOption<RequestedLessonPartKey>[] = [
  {
    key: "teach",
    title: "Teach / mini-lesson",
    description: "Direct instruction or modeled teaching you want included on purpose.",
  },
  {
    key: "guided_practice",
    title: "Guided practice",
    description: "Supported practice with teacher prompts or shared work.",
  },
  {
    key: "independent_practice",
    title: "Independent practice",
    description: "Student practice that can stand on its own after teaching.",
  },
  {
    key: "closure",
    title: "Closure",
    description: "A wrap-up, synthesis, or end-of-lesson reflection.",
  },
  {
    key: "formative_assessment",
    title: "Formative assessment",
    description: "A quick check for understanding, exit check, or mastery signal.",
  },
  {
    key: "centers",
    title: "Centers",
    description: "Include centers or station work as part of the lesson design.",
  },
  {
    key: "small_group",
    title: "Small group",
    description: "Include a teacher-led small-group plan as part of the lesson design.",
  },
  {
    key: "intervention",
    title: "Intervention",
    description: "Include targeted reteach or intervention time as part of the lesson design.",
  },
]

const requestedOutputOptions: RequestOption<RequestedOutputKey>[] = [
  {
    key: "printables",
    title: "Printables pack",
    description: "A broader printable packet when you want more than one printable artifact.",
  },
  {
    key: "assessment",
    title: "Assessment support",
    description: "Add assessment or exit-check support inside the lesson package when you want a clearer check-for-understanding plan.",
  },
  {
    key: "centers",
    title: "Centers printables",
    description: "Generate student-facing center materials when you want printable support for independent centers work.",
  },
  {
    key: "small_group",
    title: "Small-group support",
    description: "Generate teacher-facing small-group supports when you want materials for a teacher-led support plan.",
  },
  {
    key: "intervention",
    title: "Intervention support",
    description: "Generate teacher-facing intervention supports when you want materials for a teacher-led support plan.",
  },
]

const pageStyle: React.CSSProperties = {
  maxWidth: 920,
  margin: "0 auto",
}

const pageIntroStyle: React.CSSProperties = {
  ...orchardPageIntroBlockStyle,
}

const introStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: 16,
  maxWidth: 720,
  margin: 0,
  lineHeight: 1.6,
}

const cardStyle: React.CSSProperties = {
  ...orchardCardStyle,
  padding: "var(--space-xl)",
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
  ...orchardSectionLabelStyle,
}

const sectionTitleStyle: React.CSSProperties = {
  ...orchardSectionTitleStyle,
  fontSize: 32,
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 700,
  marginBottom: 6,
  color: "var(--orchard-green)",
}

const inputStyle: React.CSSProperties = {
  ...orchardInputStyle,
  fontSize: 14,
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
  ...orchardButtonStyle({ active: true }),
  cursor: "pointer",
}

const disabledButtonStyle: React.CSSProperties = {
  ...orchardButtonStyle({ subtle: true }),
  border: "1px solid var(--border-soft)",
  background: "var(--warm-gray)",
  color: "var(--text-secondary)",
  cursor: "not-allowed",
  boxShadow: "none",
  opacity: 0.8,
}

const noticeStyle: React.CSSProperties = {
  ...orchardNoticeStyle,
}

const modeCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: "var(--space-lg)",
}

const modeOptionStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  padding: "12px 0",
  borderTop: "1px solid var(--border-paper)",
}

const requestGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "var(--space-md)",
  marginTop: "var(--space-md)",
}

export default function InputsPage() {
  const navigate = useNavigate()

  const inputs = useLessonStore((state) => state.inputs)
  const setInputs = useLessonStore((state) => state.setInputs)
  const selectedLessonMode = useLessonStore((state) => state.selectedLessonMode)
  const setSelectedLessonMode = useLessonStore((state) => state.setSelectedLessonMode)
  const lessonRequest = useLessonStore((state) => state.lessonRequest)
  const toggleRequestedLessonPart = useLessonStore(
    (state) => state.toggleRequestedLessonPart
  )
  const toggleRequestedOutput = useLessonStore((state) => state.toggleRequestedOutput)
  const hasRequiredInputs = useLessonStore((state) => state.hasRequiredInputs)()
  const targetPreview = useLessonStore((state) => state.getTargetPreview)()
  const [showLessonShapeOverride, setShowLessonShapeOverride] = React.useState(
    selectedLessonMode !== "single"
  )

  const updateInput =
    (field: keyof typeof inputs) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setInputs({ [field]: event.target.value })
    }

  const targetNoticeStyle: React.CSSProperties = targetPreview.isMixedTarget
    ? {
        ...orchardNoticeStyle,
        background: "rgba(242, 192, 120, 0.20)",
        border: "1px solid var(--border-honey)",
        color: "var(--warm-brown)",
      }
    : {
        ...orchardNoticeStyle,
      }
  const optionalRequestedOutputs = lessonRequest.requestedOutputs.filter(
    (key) => key !== "slides" && key !== "lesson_plan",
  )

  return (
    <div style={pageStyle}>
      <div style={sectionLabelStyle}>Planning Notebook</div>
      <h2 style={sectionTitleStyle}>Inputs</h2>

      <div style={pageIntroStyle}>
        <p style={introStyle}>
          Define the lesson intent before adding curriculum and exemplar materials.
        </p>
        <p style={introStyle}>
          Lesson slides and the teacher lesson plan are always included. Optional support materials stay optional unless you request them on purpose.
        </p>
      </div>

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
            <div style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 6 }}>
              Optional. Enter a standard if you know it. Otherwise the app will use
              standards detected from usable curriculum materials when available.
            </div>
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
            <div style={helpStyle}>
              Keep this as text for now to match the current engine types.
            </div>
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
              The system recommends a lesson shape from your inputs behind the
              scenes. Change it manually only if you need to override the
              recommendation.
            </div>

            <div style={{ ...targetNoticeStyle, marginBottom: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>
                Recommended shape:{" "}
                {formatLessonModeLabel(targetPreview.recommendedMode)}
              </div>
              <div>{targetPreview.message}</div>
              {selectedLessonMode !== "single" && (
                <div style={{ marginTop: 6, fontSize: 13 }}>
                  Manual override active:{" "}
                  {formatLessonModeLabel(selectedLessonMode)}
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
                  ...orchardButtonStyle({ subtle: true }),
                  cursor: "pointer",
                }}
              >
                {showLessonShapeOverride
                  ? "Hide manual lesson shape options"
                  : "Change lesson shape manually"}
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

        <div style={{ marginTop: "var(--space-xl)" }}>
          <div style={modeCardStyle}>
            <div style={{ fontWeight: 700, marginBottom: 6, color: "var(--orchard-green)" }}>
              Requested lesson parts
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              Use this when you want the system to explicitly add or prioritize
              lesson parts beyond what your source materials already ground.
              Leave items off unless you want them requested on purpose.
            </div>

            <div style={{ ...noticeStyle, marginTop: 12 }}>
              {lessonRequest.requestedLessonParts.length > 0
                ? `${lessonRequest.requestedLessonParts.length} requested lesson part(s) selected. These should be treated as explicit teacher requests, not assumed defaults.`
                : "No extra lesson parts requested yet. The system should rely on your inputs and source materials unless you ask for more."}
            </div>

            <div style={requestGridStyle}>
              {requestedLessonPartOptions.map((option) => (
                <RequestToggleCard
                  key={option.key}
                  checked={lessonRequest.requestedLessonParts.includes(option.key)}
                  title={option.title}
                  description={option.description}
                  onToggle={() => toggleRequestedLessonPart(option.key)}
                />
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "var(--space-xl)" }}>
          <div style={modeCardStyle}>
            <div style={{ fontWeight: 700, marginBottom: 6, color: "var(--orchard-green)" }}>
              Optional support materials
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              Lesson slides and the teacher lesson plan are always included. Add printables or assessment support only when you want extra support materials. Lesson parts above still shape the lesson itself.
            </div>

            <div style={{ ...noticeStyle, marginTop: 12 }}>
              {optionalRequestedOutputs.length > 0
                ? optionalRequestedOutputs.length + " optional support material(s) selected. Lesson slides and the teacher lesson plan are already included."
                : "No optional support materials requested yet. Lesson slides and the teacher lesson plan will still be included."}
            </div>

            <div style={requestGridStyle}>
              {requestedOutputOptions.map((option) => (
                <RequestToggleCard
                  key={option.key}
                  checked={lessonRequest.requestedOutputs.includes(option.key)}
                  title={option.title}
                  description={option.description}
                  onToggle={() => toggleRequestedOutput(option.key)}
                />
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "var(--space-lg)" }}>
          <div style={noticeStyle}>
            Required before Results can generate: grade, subject, skill focus,
            lesson topic, and duration. Standard is optional here; if left blank,
            the app will use standards detected from usable curriculum materials
            when available.
          </div>
        </div>

        <div style={buttonRowStyle}>
          <div
            style={{
              ...orchardTagStyle(hasRequiredInputs ? "moss" : "honey"),
              fontWeight: 700,
            }}
          >
            {hasRequiredInputs
              ? "Inputs complete"
              : "Complete all required lesson fields"}
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
        <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
          {title}
        </div>
        <div style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 2 }}>
          {description}
        </div>
      </div>
    </label>
  )
}

function RequestToggleCard({
  checked,
  title,
  description,
  onToggle,
}: {
  checked: boolean
  title: string
  description: string
  onToggle: () => void
}) {
  const activeStyle: React.CSSProperties = checked
    ? {
        background: "rgba(110, 139, 107, 0.12)",
        border: "1px solid var(--border-moss)",
      }
    : {
        background: "rgba(255, 255, 255, 0.98)",
        border: "1px solid var(--border-paper)",
      }

  return (
    <label
      style={{
        ...orchardSoftCardStyle,
        ...activeStyle,
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "14px 14px",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        style={{ marginTop: 3 }}
      />
      <div>
        <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{title}</div>
        <div style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 2 }}>
          {description}
        </div>
      </div>
    </label>
  )
}
