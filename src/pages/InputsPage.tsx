import React from "react"
import { useNavigate } from "react-router-dom"
import { SUPPORTED_SOURCE_UPLOAD_FORMATS_TEXT } from "../engine/materials/sourceIntakeContract"
import {
  AssessmentOutputTypeKey,
  CenterFocusKey,
  CenterOutputOptionKey,
  LessonPlanContentPartKey,
  SmallGroupTierKey,
  countSelectedOutputSections,
} from "../engine/types"
import {
  orchardButtonStyle,
  orchardCardStyle,
  orchardInputStyle,
  orchardNoticeStyle,
  orchardPageShellStyle,
  orchardSectionLabelStyle,
  orchardSectionTitleStyle,
  orchardSoftCardStyle,
  orchardTagStyle,
} from "./orchardUi"
import { useLessonStore } from "../state/useLessonStore"
import { OrchardPageHeader } from "./OrchardPageHeader"

type LessonPartOption = {
  key: LessonPlanContentPartKey
  title: string
  description: string
}

type AssessmentOption = {
  key: AssessmentOutputTypeKey
  title: string
  description: string
}

type CenterOption = {
  key: CenterOutputOptionKey
  title: string
  description: string
}

type CenterFocusOption = {
  key: CenterFocusKey
  title: string
  description: string
}

type SmallGroupTierOption = {
  key: SmallGroupTierKey
  title: string
  description: string
}

const lessonPartOptions: LessonPartOption[] = [
  {
    key: "standards",
    title: "Standards",
    description: "Show the target standard(s) or curriculum-grounded standards in the lesson plan.",
  },
  {
    key: "objective",
    title: "Objective",
    description: "Include a clear teacher-facing objective tied to the lesson focus.",
  },
  {
    key: "opening",
    title: "Opening",
    description: "Launch the lesson with an opening, warm start, or context-setting move.",
  },
  {
    key: "direct_instruction_modeling",
    title: "Direct instruction / modeling",
    description: "Teacher modeling, explanation, think-aloud, or demonstration.",
  },
  {
    key: "guided_practice",
    title: "Guided practice",
    description: "Supported practice with prompts, shared work, or guided follow-through.",
  },
  {
    key: "independent_practice",
    title: "Independent practice",
    description: "Student application that can stand on its own after teaching.",
  },
  {
    key: "closure",
    title: "Closure",
    description: "Wrap-up, reflection, recap, or end-of-lesson close.",
  },
  {
    key: "differentiation",
    title: "Differentiation",
    description: "Teacher-facing notes for support, reteach, extension, or pacing differences.",
  },
  {
    key: "vocabulary",
    title: "Vocabulary",
    description: "Story vocabulary and academic vocabulary connected to the lesson.",
  },
  {
    key: "materials_prep_list",
    title: "Materials / prep list",
    description: "Supplies, source materials, and setup notes the teacher should have ready.",
  },
  {
    key: "assessment_connection",
    title: "Assessment connection",
    description: "How the requested assessments connect to the lesson and what they are checking.",
  },
]

const formativeAssessmentOptions: AssessmentOption[] = [
  {
    key: "observation_checklist",
    title: "Observation checklist",
    description: "A quick look-for list the teacher can use while students work.",
  },
  {
    key: "exit_ticket",
    title: "Exit ticket",
    description: "A short end-of-lesson check to see what students can do independently.",
  },
  {
    key: "running_record_conference_notes",
    title: "Running record / conference notes",
    description: "Teacher note-capture for conferring, quick records, or guided checkpoints.",
  },
  {
    key: "quick_oral_check",
    title: "Quick oral check",
    description: "A spoken check for understanding during or right after instruction.",
  },
]

const summativeAssessmentOptions: AssessmentOption[] = [
  {
    key: "end_of_lesson_task",
    title: "End-of-lesson task",
    description: "A short task that asks students to show the lesson target independently.",
  },
  {
    key: "skill_check",
    title: "Skill check",
    description: "A focused check on the requested skill or standard.",
  },
  {
    key: "response_sheet",
    title: "Response sheet",
    description: "A simple written response page tied to the requested lesson output.",
  },
  {
    key: "brief_performance_task",
    title: "Brief performance task",
    description: "A short application task when students need to show the skill in context.",
  },
]

const centerOptions: CenterOption[] = [
  {
    key: "use_what_you_have",
    title: "Ready-to-Use Center Ideas",
    description: "Suggested center ideas using materials and resources already available in your classroom.",
  },
  {
    key: "create_new_center_activities",
    title: "Lesson-Aligned Center Printables",
    description: "New printable center materials created to match the lesson.",
  },
]

const centerFocusOptions: CenterFocusOption[] = [
  {
    key: "letter_identification",
    title: "Letter Identification",
    description: "Letter recognition, matching, naming, and sorting work.",
  },
  {
    key: "phonological_awareness",
    title: "Phonological Awareness",
    description: "Listening for rhyme, syllables, onset-rime, and larger sound units.",
  },
  {
    key: "phonemic_awareness",
    title: "Phonemic Awareness",
    description: "Hearing, isolating, blending, segmenting, and manipulating phonemes.",
  },
  {
    key: "phonics",
    title: "Phonics",
    description: "Sound-spelling practice with target letters, patterns, and decoding work.",
  },
  {
    key: "high_frequency_words",
    title: "High-Frequency Words",
    description: "Recognition and practice with high-frequency or heart words.",
  },
  {
    key: "word_building",
    title: "Word Building",
    description: "Building, changing, and reading words with letters or word parts.",
  },
  {
    key: "vocabulary_oral_language",
    title: "Vocabulary & Oral Language",
    description: "Student-friendly vocabulary practice, speaking, and language development.",
  },
  {
    key: "handwriting_fine_motor",
    title: "Handwriting / Fine Motor",
    description: "Letter formation, tracing, grip, and other fine-motor tasks.",
  },
  {
    key: "decodable_reading",
    title: "Decodable Reading",
    description: "Reading connected text or controlled text that matches the target skill.",
  },
  {
    key: "fluency",
    title: "Fluency",
    description: "Accuracy, pacing, repeated reading, and smooth oral reading practice.",
  },
  {
    key: "reading_response",
    title: "Reading Response",
    description: "Drawing, discussing, or writing to respond to text.",
  },
  {
    key: "comprehension",
    title: "Comprehension",
    description: "Meaning-making, retell, questions, and understanding checks.",
  },
  {
    key: "writing_sentence_work",
    title: "Writing / Sentence Work",
    description: "Sentence-level writing, dictation, labeling, and written response work.",
  },
]

const smallGroupTierOptions: SmallGroupTierOption[] = [
  {
    key: "T1",
    title: "Tier 1",
    description: "Teacher-led support for on-track students who still benefit from a guided check-in.",
  },
  {
    key: "T2",
    title: "Tier 2",
    description: "Teacher-led small-group support for students who need targeted follow-through.",
  },
  {
    key: "T3",
    title: "Tier 3",
    description: "Teacher-led intervention or reteach for students who need the most support.",
  },
  {
    key: "Extension",
    title: "Extension",
    description: "Teacher-led extension or enrichment for students ready to stretch the same lesson focus.",
  },
]

const pageStyle: React.CSSProperties = {
  ...orchardPageShellStyle,
  maxWidth: 920,
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
  padding: "var(--space-xl)",
}

const infoGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "var(--space-md)",
}

const requestGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "var(--space-md)",
  marginTop: "var(--space-md)",
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

const fieldLabelStyle: React.CSSProperties = {
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
  marginTop: 6,
  fontSize: 12,
  color: "var(--text-secondary)",
  fontWeight: 400,
  lineHeight: 1.5,
}

const noticeStyle: React.CSSProperties = {
  ...orchardNoticeStyle,
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

const outputSectionCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: "var(--space-lg)",
  display: "grid",
  gap: "var(--space-sm)",
}

const subgroupBlockStyle: React.CSSProperties = {
  border: "1px solid var(--border-paper)",
  borderRadius: "var(--radius-md)",
  padding: "14px 16px",
  background: "rgba(255, 255, 255, 0.82)",
}

const cranberryStyle: React.CSSProperties = {
  color: "var(--cranberry, #B8545A)",
  marginLeft: 4,
}

export default function InputsPage() {
  const navigate = useNavigate()

  const inputs = useLessonStore((state) => state.inputs)
  const setInputs = useLessonStore((state) => state.setInputs)
  const outputContents = useLessonStore((state) => state.outputContents)
  const toggleLessonPlanOutput = useLessonStore((state) => state.toggleLessonPlanOutput)
  const toggleLessonSlidesOutput = useLessonStore((state) => state.toggleLessonSlidesOutput)
  const toggleLessonPlanPart = useLessonStore((state) => state.toggleLessonPlanPart)
  const toggleAssessmentType = useLessonStore((state) => state.toggleAssessmentType)
  const toggleCenterOption = useLessonStore((state) => state.toggleCenterOption)
  const toggleCenterFocus = useLessonStore((state) => state.toggleCenterFocus)
  const toggleSmallGroupTier = useLessonStore((state) => state.toggleSmallGroupTier)
  const hasRequiredInputs = useLessonStore((state) => state.hasRequiredInputs)()

  const updateInput =
    (field: keyof typeof inputs) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setInputs({ [field]: event.target.value })
    }

  const selectedOutputSections = countSelectedOutputSections(outputContents)
  const selectedRequestedParts = lessonPartOptions.filter((option) => {
    return outputContents.lessonPlan.parts[option.key]
  }).length
  const selectedAssessmentCount = [
    ...formativeAssessmentOptions,
    ...summativeAssessmentOptions,
  ].filter((option) => outputContents.assessment.types[option.key]).length
  const selectedCenterFormats = centerOptions.filter((option) => {
    return outputContents.centers.options[option.key]
  }).length
  const selectedCenterFocuses = centerFocusOptions.filter((option) => {
    return outputContents.centers.focuses[option.key]
  }).length
  const selectedSmallGroupTiers = smallGroupTierOptions.filter((option) => {
    return outputContents.smallGroup.tiers[option.key]
  }).length

  return (
    <div style={pageStyle}>
      <OrchardPageHeader label="Planning Notebook" title="Inputs" introMaxWidth={760}>
        <p style={introStyle}>
          Start with the lesson basics, then choose what you want included in the lesson and exports.
        </p>
        <p style={introStyle}>
          Only the truly required fields are marked. Standards can come from teacher input now or from curriculum materials later.
        </p>
        <p style={introStyle}>
          You will add curriculum and exemplar materials on the next step. Drag and drop or browse from your device there. Supported uploads: {SUPPORTED_SOURCE_UPLOAD_FORMATS_TEXT}.
        </p>
      </OrchardPageHeader>

      <div style={cardStyle}>
        <div style={sectionLabelStyle}>1. Lesson Information</div>
        <div style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>
          Cranberry stars mark the fields required to move forward.
        </div>

        <div style={{ ...infoGridStyle, marginTop: "var(--space-md)" }}>
          <InputField
            id="grade"
            label="Grade"
            value={inputs.grade}
            required
            placeholder="K, 1st, 3rd"
            onChange={updateInput("grade")}
          />
          <InputField
            id="subject"
            label="Subject"
            value={inputs.subject}
            required
            placeholder="ELA, Math, Science"
            onChange={updateInput("subject")}
          />
          <InputField
            id="standard"
            label="Standard(s)"
            value={inputs.standard}
            placeholder="RF.K.3, 1.OA.1, RI.3.2"
            onChange={updateInput("standard")}
            help="Optional. The app can also use standards detected from usable curriculum materials later."
          />
          <InputField
            id="duration"
            label="Duration"
            value={inputs.duration}
            placeholder="20 minutes, 45 minutes, 2 days"
            onChange={updateInput("duration")}
          />
          <InputField
            id="skill"
            label="Skill / Focus"
            value={inputs.skill}
            required
            placeholder="Long a patterns, comparing fractions, main idea"
            onChange={updateInput("skill")}
            fullWidth
          />
          <TextAreaField
            id="topic"
            label="Topic / Text / Unit"
            value={inputs.topic}
            placeholder="Frog and Toad chapter 2, weather tools, plant life cycles"
            onChange={updateInput("topic")}
            fullWidth
          />
          <TextAreaField
            id="notes"
            label="Anything I should know?"
            value={inputs.notes ?? ""}
            placeholder="ELL newcomers, use decodable only, needs partner talk"
            onChange={updateInput("notes")}
            help="Use this for constraints, context, grouping notes, story context, academic vocabulary, or anything else the teacher wants the plan to respect."
            fullWidth
          />
        </div>

        <div style={{ marginTop: "var(--space-xl)" }}>
          <div style={sectionLabelStyle}>2. Lesson Plan Parts</div>
          <div style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>
            Choose the lesson parts you want included in this lesson plan.
          </div>
          <div style={requestGridStyle}>
            {lessonPartOptions.map((option) => (
              <RequestToggleCard
                key={option.key}
                checked={outputContents.lessonPlan.parts[option.key]}
                title={option.title}
                description={option.description}
                onToggle={() => toggleLessonPlanPart(option.key)}
              />
            ))}
          </div>
        </div>

        <div style={{ marginTop: "var(--space-xl)" }}>
          <div style={sectionLabelStyle}>3. Lesson Outputs</div>
          <div style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>
            Choose the outputs you want for this lesson. Centers stay separate from teacher-led support.
          </div>

          <div style={{ ...noticeStyle, marginTop: 12 }}>
            Selected now: {selectedOutputSections} output section(s). Lesson plan parts: {selectedRequestedParts}. Assessment choices: {selectedAssessmentCount}. Center formats: {selectedCenterFormats}. Center focuses: {selectedCenterFocuses}. Small-group tiers: {selectedSmallGroupTiers}.
          </div>

          <div style={{ display: "grid", gap: "var(--space-md)", marginTop: "var(--space-md)" }}>
            <OutputSectionCard
              title="Lesson Plan"
              description="Core teacher plan. The lesson plan parts above decide what is included here later."
              statusLabel={outputContents.lessonPlan.selected ? "Selected" : "Not selected"}
              active={outputContents.lessonPlan.selected}
            >
              <RequestToggleCard
                checked={outputContents.lessonPlan.selected}
                title="Include lesson plan"
                description="Keep the core lesson plan in the requested output package."
                onToggle={toggleLessonPlanOutput}
              />
            </OutputSectionCard>

            <OutputSectionCard
              title="Centers"
              description="Student-independent activities. Choose the center format and focus you want without turning centers into teacher-led support."
              statusLabel={outputContents.centers.selected ? "Selected" : "Optional"}
              active={outputContents.centers.selected}
            >
              <div style={subgroupBlockStyle}>
                <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                  Choose center format
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 6, marginBottom: 10 }}>
                  Select the center format you want for this lesson.
                </div>
                <div style={{ display: "grid", gap: 12 }}>
                  {centerOptions.map((option) => (
                    <RequestToggleCard
                      key={option.key}
                      checked={outputContents.centers.options[option.key]}
                      title={option.title}
                      description={option.description}
                      onToggle={() => toggleCenterOption(option.key)}
                    />
                  ))}
                </div>
              </div>

              <div style={subgroupBlockStyle}>
                <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                  Choose center focus
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 6, marginBottom: 10 }}>
                  Select all that apply.
                </div>
                <div style={{ display: "grid", gap: 12 }}>
                  {centerFocusOptions.map((option) => (
                    <RequestToggleCard
                      key={option.key}
                      checked={outputContents.centers.focuses[option.key]}
                      title={option.title}
                      description={option.description}
                      onToggle={() => toggleCenterFocus(option.key)}
                    />
                  ))}
                </div>
              </div>
            </OutputSectionCard>

            <OutputSectionCard
              title="Teacher-Led Support"
              description="Teacher-led support. Keep this separate from centers; both can happen in the same lesson block."
              statusLabel={outputContents.smallGroup.selected ? "Selected" : "Optional"}
              active={outputContents.smallGroup.selected}
            >
              <div style={subgroupBlockStyle}>
                <div style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 10 }}>
                  Choose the teacher-led groups you want.
                </div>
                <div style={{ display: "grid", gap: 12 }}>
                  {smallGroupTierOptions.map((option) => (
                    <RequestToggleCard
                      key={option.key}
                      checked={outputContents.smallGroup.tiers[option.key]}
                      title={option.title}
                      description={option.description}
                      onToggle={() => toggleSmallGroupTier(option.key)}
                    />
                  ))}
                </div>
              </div>
            </OutputSectionCard>

            <OutputSectionCard
              title="Assessment"
              description="Choose the assessment pieces you want for this lesson. Answer keys generate automatically where applicable."
              statusLabel={outputContents.assessment.selected ? "Selected" : "Optional"}
              active={outputContents.assessment.selected}
            >
              <div style={subgroupBlockStyle}>
                <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>Formative</div>
                <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                  {formativeAssessmentOptions.map((option) => (
                    <RequestToggleCard
                      key={option.key}
                      checked={outputContents.assessment.types[option.key]}
                      title={option.title}
                      description={option.description}
                      onToggle={() => toggleAssessmentType(option.key)}
                    />
                  ))}
                </div>
              </div>

              <div style={subgroupBlockStyle}>
                <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>Summative</div>
                <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                  {summativeAssessmentOptions.map((option) => (
                    <RequestToggleCard
                      key={option.key}
                      checked={outputContents.assessment.types[option.key]}
                      title={option.title}
                      description={option.description}
                      onToggle={() => toggleAssessmentType(option.key)}
                    />
                  ))}
                </div>
                <div style={helpStyle}>Answer keys generate automatically where applicable.</div>
              </div>
            </OutputSectionCard>

            <OutputSectionCard
              title="Lesson Slides"
              description="Student-facing slide deck that follows the lesson plan and exemplar-supported structure."
              statusLabel={outputContents.lessonSlides.selected ? "Selected" : "Optional"}
              active={outputContents.lessonSlides.selected}
            >
              <RequestToggleCard
                checked={outputContents.lessonSlides.selected}
                title="Include student-facing lesson slides"
                description="Include student-facing lesson slides when you want a matching slide deck."
                onToggle={toggleLessonSlidesOutput}
              />
            </OutputSectionCard>
          </div>
        </div>

        <div style={{ marginTop: "var(--space-lg)" }}>
          <div style={noticeStyle}>
            You can continue once grade, subject, and skill / focus are filled in. Standards, topic / text / unit, duration, and extra notes stay optional here.
          </div>
        </div>

        <div style={buttonRowStyle}>
          <div
            style={{
              ...orchardTagStyle(hasRequiredInputs ? "moss" : "honey"),
              fontWeight: 700,
            }}
          >
            {hasRequiredInputs ? "Ready for Materials" : "Complete the required lesson details"}
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

function RequiredMark() {
  return <span style={cranberryStyle}>*</span>
}

function InputField({
  id,
  label,
  value,
  placeholder,
  onChange,
  help,
  required = false,
  fullWidth = false,
}: {
  id: string
  label: string
  value: string
  placeholder: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
  help?: string
  required?: boolean
  fullWidth?: boolean
}) {
  return (
    <div style={fullWidth ? fullWidthStyle : undefined}>
      <label style={fieldLabelStyle} htmlFor={id}>
        {label}
        {required ? <RequiredMark /> : null}
      </label>
      <input id={id} value={value} onChange={onChange} placeholder={placeholder} style={inputStyle} />
      {help ? <div style={helpStyle}>{help}</div> : null}
    </div>
  )
}

function TextAreaField({
  id,
  label,
  value,
  placeholder,
  onChange,
  help,
  fullWidth = false,
}: {
  id: string
  label: string
  value: string
  placeholder: string
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>
  help?: string
  fullWidth?: boolean
}) {
  return (
    <div style={fullWidth ? fullWidthStyle : undefined}>
      <label style={fieldLabelStyle} htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...inputStyle, minHeight: 110, resize: "vertical" }}
      />
      {help ? <div style={helpStyle}>{help}</div> : null}
    </div>
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
      <input type="checkbox" checked={checked} onChange={onToggle} style={{ marginTop: 3 }} />
      <div>
        <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>{title}</div>
        <div style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 2 }}>
          {description}
        </div>
      </div>
    </label>
  )
}

