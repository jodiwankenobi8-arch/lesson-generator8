import React from "react"
import { Link } from "react-router-dom"
import {
  LessonPlanIdea,
  SlidePlan,
} from "../engine/types"
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
        Final lesson package first, with planning details below.
      </p>

      <div style={{ display: "grid", gap: 16 }}>
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

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Slides</h3>
          <ul style={listStyle}>
            {lessonPackage.slides.map((slide) => (
              <li key={slide}>{slide}</li>
            ))}
          </ul>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Lesson Plan</h3>
          <pre style={preStyle}>{lessonPackage.lessonPlan}</pre>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Centers</h3>
          <ul style={listStyle}>
            {lessonPackage.centers.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Rotation Plan</h3>
          <pre style={preStyle}>{lessonPackage.rotationPlan}</pre>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Interventions</h3>
          <ul style={listStyle}>
            {lessonPackage.interventions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Exports</h3>
          <ul style={listStyle}>
            {lessonPackage.exports.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Blueprint Content</h3>
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

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Blueprint Structure</h3>
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

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Slide Planning</h3>
          <SlidePlanList slides={planningIdeas.slidePlans} />
        </div>

        {planningIdeas.lessonPlanSections.map((section) => (
          <div key={section.section} style={sectionStyle}>
            <h3 style={{ marginTop: 0 }}>{section.title}</h3>
            <IdeaList ideas={section.ideas} />
          </div>
        ))}
      </div>
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
