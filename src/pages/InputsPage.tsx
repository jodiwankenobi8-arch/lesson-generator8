import React from "react"
import { useNavigate } from "react-router-dom"
import {
  AssessmentOutputTypeKey,
  GroupOutputKindKey,
  LessonMode,
  LessonPlanContentPartKey,
  countSelectedOutputSections,
} from "../engine/types"
import {
  orchardButtonStyle,
  orchardCardStyle,
  orchardHeroCardStyle,
  orchardInputStyle,
  orchardNoticeStyle,
  orchardPageIntroBlockStyle,
  orchardPageShellStyle,
  orchardSectionLabelStyle,
  orchardSectionTitleStyle,
  orchardSoftCardStyle,
  orchardTagStyle,
} from "./orchardUi"
import { useLessonStore } from "../state/useLessonStore"

type LessonPlanPartOption = {
  key: LessonPlanContentPartKey
  title: string
  description: string
}

type AssessmentOption = {
  key: AssessmentOutputTypeKey
  title: string
  description: string
}

type GroupOption = {
  key: GroupOutputKindKey
  title: string
  description: string
}

const lessonPlanPartOptions: LessonPlanPartOption[] = [
  {
    key: "teach",
    title: "Teach / mini-lesson",
    description: "Direct instruction or modeled teaching in the teacher lesson plan.",
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
    description: "A wrap-up, recap, or end-of-lesson reflection in the lesson plan.",
  },
]

const assessmentOptions: AssessmentOption[] = [
  {
    key: "formative_assessment",
    title: "Formative assessment / exit check",
    description:
      "Add a quick check for understanding or exit-check support inside the lesson package.",
  },
]

const t1GroupOptions: GroupOption[] = [
  {
    key: "centers",
    title: "Student-independent groups / centers",
    description:
      "Printable or rotation-ready support for student-independent centers or station work.",
  },
]

const t2GroupOptions: GroupOption[] = [
  {
    key: "small_group",
    title: "Teacher-led support group",
    description:
      "Teacher-facing support for a guided small-group or teacher-table follow-through.",
  },
]

const t3GroupOptions: GroupOption[] = [
  {
    key: "intervention",
    title: "Teacher-led intervention",
    description:
      "Targeted reteach or intervention support when students need extra help.",
  },
]

const otherOutputOptions = [
  {
    key: "printables" as const,
    title: "Printables pack",
    description:
      "A broader printable packet when you want extra printable artifacts beyond the core lesson package.",
  },
]

const pageStyle: React.CSSProperties = {
  ...orchardPageShellStyle,
  maxWidth: 920,
  margin: "0 auto",
}

const pageIntroStyle: React.CSSProperties = {
  ...orchardHeroCardStyle,
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

const outputSectionCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: "var(--space-lg)",
  display: "grid",
  gap: "var(--space-sm)",
}

const tierCardStyle: React.CSSProperties = {
  border: "1px solid var(--border-paper)",
  borderRadius: "var(--radius-md)",
  padding: "12px 14px",
  background: "rgba(255, 255, 255, 0.78)",
}

export default function InputsPage() {
  const navigate = useNavigate()

  const inputs = useLessonStore((state) => state.inputs)
  const setInputs = useLessonStore((state) => state.setInputs)
  const selectedLessonMode = useLessonStore((state) => state.selectedLessonMode)
  const setSelectedLessonMode = useLessonStore((state) => state.setSelectedLessonMode)
  const outputContents = useLessonStore((state) => state.outputContents)
  const toggleLessonPlanPart = useLessonStore((state) => state.toggleLessonPlanPart)
  const toggleAssessmentType = useLessonStore((state) => state.toggleAssessmentType)
  const toggleGroupOutput = useLessonStore((state) => state.toggleGroupOutput)
  const toggleOtherOutput = useLessonStore((state) => state.toggleOtherOutput)
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

  const selectedOutputSections = countSelectedOutputSections(outputContents)
  const selectedLessonPlanParts = lessonPlanPartOptions.filter(
    (option) => outputContents.lessonPlan.parts[option.key]
  ).length
  const selectedAssessmentTypes = assessmentOptions.filter(
    (option) => outputContents.assessments.types[option.key]
  ).length
  const selectedGroupKinds = [
    outputContents.groups.byTier.T1.centers,
    outputContents.groups.byTier.T2.small_group,
    outputContents.groups.byTier.T3.intervention,
  ].filter(Boolean).length

  return (
    <div style={pageStyle}>
      <div style={sectionLabelStyle}>Planning Notebook</div>
      <h2 style={sectionTitleStyle}>Inputs</h2>

      <div style={pageIntroStyle}>
        <p style={introStyle}>
          Define the lesson intent before adding curriculum and exemplar materials.
        </p>
        <p style={introStyle}>
          The next step is upload-file intake only. Materials accepts .txt, .pdf,
          .docx, .pptx, .html, and .htm source files. Curriculum grounds content.
          Exemplar grounds presentation and structure.
        </p>
        <p style={introStyle}>
          Use Output Contents below as the single place to decide what belongs in
          the package. Core lesson plan and slides stay included. Optional
          assessments, groups, and printables stay out unless you select them here.
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
              Output Contents
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              This is the only Inputs-page place where output inclusion is decided.
              Choose lesson-plan sections, optional assessments, group supports,
              and extra printables here.
            </div>

            <div style={{ ...noticeStyle, marginTop: 12 }}>
              {selectedOutputSections} output section(s) currently included. Lesson
              plan sections selected: {selectedLessonPlanParts}. Assessment types:
              {" "}
              {selectedAssessmentTypes}. Group kinds: {selectedGroupKinds}. Printables:
              {outputContents.other.printables ? " selected" : " not selected"}.
            </div>

            <div style={{ display: "grid", gap: "var(--space-md)", marginTop: "var(--space-md)" }}>
              <OutputSectionCard
                title="Lesson Plan"
                description="Core teacher lesson-plan output. Turn sections on or off to control what appears in the lesson plan document."
                statusLabel="Included"
                active
              >
                <div style={requestGridStyle}>
                  {lessonPlanPartOptions.map((option) => (
                    <RequestToggleCard
                      key={option.key}
                      checked={outputContents.lessonPlan.parts[option.key]}
                      title={option.title}
                      description={option.description}
                      onToggle={() => toggleLessonPlanPart(option.key)}
                    />
                  ))}
                </div>
              </OutputSectionCard>

              <OutputSectionCard
                title="Lesson Slides"
                description="Core slide-deck output. Slides stay included and continue to follow exemplar-grounded structure and presentation."
                statusLabel="Included"
                active
              >
                <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                  Slides are part of the default package in this build. Their
                  structure comes from the selected exemplar materials.
                </div>
              </OutputSectionCard>

              <OutputSectionCard
                title="Assessments"
                description="Optional assessment support inside the lesson package. Select only the types you want included."
                statusLabel={outputContents.assessments.selected ? "Selected" : "Optional"}
                active={outputContents.assessments.selected}
              >
                <div style={requestGridStyle}>
                  {assessmentOptions.map((option) => (
                    <RequestToggleCard
                      key={option.key}
                      checked={outputContents.assessments.types[option.key]}
                      title={option.title}
                      description={option.description}
                      onToggle={() => toggleAssessmentType(option.key)}
                    />
                  ))}
                </div>
              </OutputSectionCard>

              <OutputSectionCard
                title="Groups"
                description="Optional group-related supports. Choose the kinds you want, organized by tier so the teacher-facing contract stays clear."
                statusLabel={outputContents.groups.selected ? "Selected" : "Optional"}
                active={outputContents.groups.selected}
              >
                <TierSection
                  tier="T1"
                  title="Student-independent groups / centers"
                  description="Student-facing or rotation-ready support for independent work."
                  options={t1GroupOptions}
                  isSelected={(key) => {
                    if (key === "centers") return outputContents.groups.byTier.T1.centers
                    return false
                  }}
                  onToggle={toggleGroupOutput}
                />

                <TierSection
                  tier="T2"
                  title="Teacher-led support"
                  description="Teacher-facing small-group follow-through and guided support."
                  options={t2GroupOptions}
                  isSelected={(key) => {
                    if (key === "small_group") return outputContents.groups.byTier.T2.small_group
                    return false
                  }}
                  onToggle={toggleGroupOutput}
                />

                <TierSection
                  tier="T3"
                  title="Teacher-led intervention"
                  description="More targeted reteach or intervention support."
                  options={t3GroupOptions}
                  isSelected={(key) => {
                    if (key === "intervention") return outputContents.groups.byTier.T3.intervention
                    return false
                  }}
                  onToggle={toggleGroupOutput}
                />

                <div style={tierCardStyle}>
                  <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                    Extension
                  </div>
                  <div style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
                    No separate extension-specific group output is currently supported
                    in the uploaded code. Extension remains a planning concept rather
                    than a standalone packaged group artifact in this build.
                  </div>
                </div>
              </OutputSectionCard>

              <OutputSectionCard
                title="Other Support Materials"
                description="Additional support artifacts that still belong to the same output contract."
                statusLabel={outputContents.other.printables ? "Selected" : "Optional"}
                active={outputContents.other.printables}
              >
                <div style={requestGridStyle}>
                  {otherOutputOptions.map((option) => (
                    <RequestToggleCard
                      key={option.key}
                      checked={outputContents.other[option.key]}
                      title={option.title}
                      description={option.description}
                      onToggle={() => toggleOtherOutput(option.key)}
                    />
                  ))}
                </div>
              </OutputSectionCard>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "var(--space-lg)" }}>
          <div style={noticeStyle}>
            Required before Results can generate: grade, subject, skill focus,
            lesson topic, and duration. Standard is optional here. Source files are
            added on Materials, where upload intake currently accepts .txt, .pdf,
            .docx, .pptx, .html, and .htm files.
          </div>
        </div>

        <div style={buttonRowStyle}>
          <div
            style={{
              ...orchardTagStyle(hasRequiredInputs ? "moss" : "honey"),
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
        <div style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 2 }}>
          {description}
        </div>
      </div>
    </label>
  )
}

function OutputSectionCard({
  title,
  description,
  statusLabel,
  active,
  children,
}: {
  title: string
  description: string
  statusLabel: string
  active: boolean
  children: React.ReactNode
}) {
  return (
    <div style={outputSectionCardStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{title}</div>
          <div style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 2 }}>
            {description}
          </div>
        </div>
        <span style={{ ...orchardTagStyle(active ? "moss" : "honey"), fontWeight: 700 }}>
          {statusLabel}
        </span>
      </div>
      {children}
    </div>
  )
}

function TierSection({
  tier,
  title,
  description,
  options,
  isSelected,
  onToggle,
}: {
  tier: "T1" | "T2" | "T3"
  title: string
  description: string
  options: GroupOption[]
  isSelected: (key: GroupOutputKindKey) => boolean
  onToggle: (key: GroupOutputKindKey) => void
}) {
  return (
    <div style={tierCardStyle}>
      <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
        {tier} · {title}
      </div>
      <div style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
        {description}
      </div>
      <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
        {options.map((option) => (
          <RequestToggleCard
            key={option.key}
            checked={isSelected(option.key)}
            title={option.title}
            description={option.description}
            onToggle={() => onToggle(option.key)}
          />
        ))}
      </div>
    </div>
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
