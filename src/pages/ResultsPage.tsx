import React from "react"
import { Link } from "react-router-dom"
import { LessonPlanIdea, LessonPlanSectionIdeas, LessonPackage, LessonBlueprint, SlidePlan } from "../engine/types"
import { useLessonStore } from "../state/useLessonStore"

const sectionStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 16,
  background: "#ffffff",
}

const heroGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: 12,
}

export default function ResultsPage() {
  const blueprint = useLessonStore((state) => state.blueprint)
  const planningIdeas = useLessonStore((state) => state.planningIdeas)
  const lessonSpec = useLessonStore((state) => state.lessonSpec)
  const lessonPackage = useLessonStore((state) => state.lessonPackage)
  const selectedLessonMode = useLessonStore((state) => state.selectedLessonMode)
  const hasRequiredInputs = useLessonStore((state) => state.hasRequiredInputs)()
  const hasReadyMaterials = useLessonStore((state) => state.hasReadyMaterials)()
  const hasProcessingMaterials = useLessonStore((state) => state.hasProcessingMaterials)()
  const counts = useLessonStore((state) => state.getMaterialCounts)()

  if (hasProcessingMaterials) {
    return (
      <BlockedResultsState
        title="Results"
        message="Results are blocked while materials are still processing."
        details={`Currently processing: ${counts.uploaded + counts.extracting + counts.analyzing}. Ready: ${counts.ready}. Errors: ${counts.error}.`}
        linkTo="/materials"
        linkLabel="Go to Materials"
      />
    )
  }

  if (!hasRequiredInputs) {
    return (
      <BlockedResultsState
        title="Results"
        message="Results are blocked until all required lesson inputs are completed."
        details="Complete grade, subject, standard, skill focus, lesson topic, and duration before generating results."
        linkTo="/inputs"
        linkLabel="Go to Inputs"
      />
    )
  }

  if (!hasReadyMaterials) {
    return (
      <BlockedResultsState
        title="Results"
        message="Results are blocked until at least one material is analyzed and ready."
        details="Add curriculum or exemplar materials and wait for analysis to complete before generating results."
        linkTo="/materials"
        linkLabel="Go to Materials"
      />
    )
  }

  if (!blueprint || !lessonSpec || !lessonPackage || !planningIdeas) {
    return (
      <BlockedResultsState
        title="Results"
        message="Inputs and materials are ready, but no generated lesson is currently loaded."
        details="Return to the generation flow to create a blueprint, planning ideas, lesson spec, and lesson package."
        linkTo="/inputs"
        linkLabel="Go to Inputs"
      />
    )
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Results</h2>
      <p style={{ color: "#4b5563", marginBottom: 24 }}>
        Teacher-facing lesson package first. Supporting planning details are available below.
      </p>

      <div style={{ display: "grid", gap: 16 }}>
        <PackageSummarySection
          blueprint={blueprint}
          lessonPackage={lessonPackage}
          selectedLessonMode={selectedLessonMode}
        />

        <SignalSection
          title="Source Support Signals"
          signals={blueprint.sourceReadiness.signals}
          warnings={blueprint.sourceReadiness.warnings}
        />

        <SignalSection
          title="Package Quality Signals"
          signals={lessonPackage.readiness.signals}
          warnings={lessonPackage.readiness.warnings}
        />

        <PackageOutputsSection lessonPackage={lessonPackage} />

        <BlueprintDetailsSection blueprint={blueprint} />

        <PlanningDetailsSection
          slidePlans={planningIdeas.slidePlans}
          lessonPlanSections={planningIdeas.lessonPlanSections}
        />
      </div>
    </div>
  )
}

function PackageSummarySection({
  blueprint,
  lessonPackage,
  selectedLessonMode,
}: {
  blueprint: LessonBlueprint
  lessonPackage: LessonPackage
  selectedLessonMode: string
}) {
  return (
    <div style={sectionStyle}>
      <h3 style={{ marginTop: 0 }}>Package Summary</h3>
      <div style={heroGridStyle}>
        <SummaryCard label="Slides" value={lessonPackage.slides.length.toString()} />
        <SummaryCard label="Centers" value={lessonPackage.centers.length.toString()} />
        <SummaryCard label="Interventions" value={lessonPackage.interventions.length.toString()} />
      </div>

      <div style={{ marginTop: 16, display: "grid", gap: 8, color: "#4b5563" }}>
        <div><strong>Primary Target:</strong> {blueprint.content.target.primary}</div>
        <div><strong>Secondary Target:</strong> {blueprint.content.target.secondary || "None"}</div>
        <div><strong>Mixed Target:</strong> {blueprint.content.target.isMixedTarget ? "Yes" : "No"}</div>
        <div><strong>Selected Mode:</strong> {selectedLessonMode}</div>
        <div><strong>Standards:</strong> {blueprint.content.standards.join(", ")}</div>
      </div>
    </div>
  )
}

function SignalSection({
  title,
  signals,
  warnings,
}: {
  title: string
  signals: Array<{ label: string; value: string; note: string; tone: "good" | "warn" | "neutral" }>
  warnings: string[]
}) {
  return (
    <div style={sectionStyle}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {signals.map((signal) => (
          <div key={signal.label} style={signalCardStyle(signal.tone)}>
            <div style={{ fontWeight: 700 }}>{signal.label}</div>
            <div style={{ marginTop: 4 }}>{signal.value}</div>
            <div style={{ marginTop: 4, fontSize: 13 }}>{signal.note}</div>
          </div>
        ))}
      </div>

      {warnings.length > 0 && (
        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
          {warnings.map((warning) => (
            <div key={warning} style={warningStyle}>
              {warning}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PackageOutputsSection({ lessonPackage }: { lessonPackage: LessonPackage }) {
  return (
    <>
      <SimpleListSection title="Slides" items={lessonPackage.slides} />
      <PreSection title="Lesson Plan" content={lessonPackage.lessonPlan} />
      <SimpleListSection title="Centers" items={lessonPackage.centers} />
      <PreSection title="Rotation Plan" content={lessonPackage.rotationPlan} />
      <SimpleListSection title="Interventions" items={lessonPackage.interventions} />
      <SimpleListSection title="Exports" items={lessonPackage.exports} />
    </>
  )
}

function BlueprintDetailsSection({ blueprint }: { blueprint: LessonBlueprint }) {
  return (
    <>
      <details style={sectionStyle}>
        <summary style={summaryStyle}>Blueprint Content</summary>
        <div style={{ marginTop: 12 }}>
          <p style={{ marginBottom: 8 }}>
            <strong>Vocabulary:</strong> {blueprint.content.vocabulary.join(", ")}
          </p>
          <p style={{ marginBottom: 8 }}>
            <strong>Texts:</strong> {blueprint.content.texts.join(", ")}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Practice Ideas:</strong> {blueprint.content.practiceIdeas.join(", ")}
          </p>
        </div>
      </details>

      <details style={sectionStyle}>
        <summary style={summaryStyle}>Blueprint Structure</summary>
        <div style={{ marginTop: 12 }}>
          <p style={{ marginBottom: 8 }}>
            <strong>Timing:</strong> {blueprint.structure.timing.join(" | ")}
          </p>
          <p style={{ marginBottom: 8 }}>
            <strong>Segments:</strong> {blueprint.structure.lessonSegments.join(" -> ")}
          </p>
          <p style={{ marginBottom: 8 }}>
            <strong>Teacher Moves:</strong> {blueprint.structure.teacherMoves.join(", ")}
          </p>
          <p style={{ marginBottom: 8 }}>
            <strong>Prompt Style:</strong> {blueprint.structure.promptStyle.join(", ")}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Tone:</strong> {blueprint.structure.tone.join(", ")}
          </p>
        </div>
      </details>
    </>
  )
}

function PlanningDetailsSection({
  slidePlans,
  lessonPlanSections,
}: {
  slidePlans: SlidePlan[]
  lessonPlanSections: LessonPlanSectionIdeas[]
}) {
  return (
    <>
      <details style={sectionStyle}>
        <summary style={summaryStyle}>Slide Planning</summary>
        <div style={{ marginTop: 12 }}>
          <SlidePlanList slides={slidePlans} />
        </div>
      </details>

      <details style={sectionStyle}>
        <summary style={summaryStyle}>Lesson Planning Ideas</summary>
        <div style={{ marginTop: 12, display: "grid", gap: 16 }}>
          {lessonPlanSections.map((section) => (
            <div key={section.section}>
              <h3 style={{ marginTop: 0 }}>{section.title}</h3>
              <IdeaList ideas={section.ideas} />
            </div>
          ))}
        </div>
      </details>
    </>
  )
}

function SimpleListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={sectionStyle}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <ul style={listStyle}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function PreSection({ title, content }: { title: string; content: string }) {
  return (
    <div style={sectionStyle}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <pre style={preStyle}>{content}</pre>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        border: "1px solid #f3f4f6",
        borderRadius: 12,
        padding: 12,
        background: "#fafafa",
      }}
    >
      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
    </div>
  )
}

function SlidePlanList({ slides }: { slides: SlidePlan[] }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {slides.map((slide, index) => (
        <div key={`${slide.shellLabel}-${index}`} style={subCardStyle}>
          <p style={{ margin: "0 0 6px 0" }}>
            <strong>{slide.shellLabel}</strong>
          </p>
          <p style={{ margin: "0 0 6px 0" }}>
            <strong>Action:</strong> {slide.action}
          </p>
          <p style={{ margin: "0 0 6px 0" }}>
            <strong>Purpose:</strong> {slide.purpose}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Notes:</strong> {slide.notes}
          </p>
        </div>
      ))}
    </div>
  )
}

function IdeaList({ ideas }: { ideas: LessonPlanIdea[] }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {ideas.map((idea, index) => (
        <div key={`${idea.title}-${index}`} style={subCardStyle}>
          <p style={{ margin: "0 0 6px 0" }}>
            <strong>{idea.title}</strong>
          </p>
          <p style={{ margin: "0 0 6px 0" }}>{idea.description}</p>
          <p style={{ margin: 0, color: "#4b5563" }}>
            <strong>Why:</strong> {idea.rationale}
          </p>
        </div>
      ))}
    </div>
  )
}

function BlockedResultsState({
  title,
  message,
  details,
  linkTo,
  linkLabel,
}: {
  title: string
  message: string
  details: string
  linkTo: string
  linkLabel: string
}) {
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <p style={{ color: "#4b5563", marginBottom: 16 }}>{message}</p>
      <div style={noticeStyle}>{details}</div>
      <div style={actionsStyle}>
        <Link to={linkTo} style={linkStyle}>
          {linkLabel}
        </Link>
      </div>
    </div>
  )
}

function signalCardStyle(tone: "good" | "warn" | "neutral"): React.CSSProperties {
  const palette =
    tone === "good"
      ? { background: "#ecfdf5", border: "#a7f3d0", color: "#065f46" }
      : tone === "warn"
        ? { background: "#fff7ed", border: "#fed7aa", color: "#9a3412" }
        : { background: "#f9fafb", border: "#e5e7eb", color: "#4b5563" }

  return {
    border: `1px solid ${palette.border}`,
    background: palette.background,
    color: palette.color,
    borderRadius: 12,
    padding: 12,
  }
}

const warningStyle: React.CSSProperties = {
  border: "1px solid #fed7aa",
  background: "#fff7ed",
  color: "#9a3412",
  borderRadius: 12,
  padding: 12,
  fontSize: 14,
}

const noticeStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  color: "#4b5563",
}

const actionsStyle: React.CSSProperties = {
  marginTop: 16,
  display: "flex",
  gap: 12,
}

const listStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: 20,
}

const preStyle: React.CSSProperties = {
  margin: 0,
  whiteSpace: "pre-wrap",
  fontFamily: "inherit",
}

const subCardStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  background: "#f9fafb",
}

const linkStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: 12,
  textDecoration: "none",
  border: "1px solid #d1d5db",
  color: "#111827",
}

const summaryStyle: React.CSSProperties = {
  cursor: "pointer",
  fontWeight: 700,
}
