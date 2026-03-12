import React from "react"
import { Link } from "react-router-dom"
import { LessonPlanIdea, SlidePlan } from "../engine/types"
import { useLessonStore } from "../state/useLessonStore"

const sectionStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 16,
  background: "#ffffff",
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
        Generated lesson pipeline outputs.
      </p>

      <div style={{ display: "grid", gap: 16 }}>
        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Target Analysis</h3>
          <p style={{ marginBottom: 8 }}>
            <strong>Primary:</strong> {blueprint.content.target.primary}
          </p>
          <p style={{ margin: "0 0 8px 0" }}>
            <strong>Secondary:</strong> {blueprint.content.target.secondary || "None"}
          </p>
          <p style={{ margin: "0 0 8px 0" }}>
            <strong>Mixed Target:</strong> {blueprint.content.target.isMixedTarget ? "Yes" : "No"}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Selected Mode:</strong> {selectedLessonMode}
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Blueprint Content</h3>
          <p style={{ marginBottom: 8 }}>
            <strong>Standards:</strong> {blueprint.content.standards.join(", ")}
          </p>
          <p style={{ margin: "0 0 8px 0" }}>
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
          <h3 style={{ marginTop: 0 }}>Template Shell</h3>
          <p style={{ marginBottom: 8 }}>
            <strong>Segment Order:</strong> {blueprint.structure.templateShell.segmentOrder.join(" -> ")}
          </p>
          <p style={{ marginBottom: 8 }}>
            <strong>Slide Shell:</strong> {blueprint.structure.templateShell.slideShell.join(" -> ")}
          </p>
          <p style={{ marginBottom: 8 }}>
            <strong>Timing Shell:</strong> {blueprint.structure.templateShell.timingShell.join(" | ")}
          </p>
          <p style={{ marginBottom: 8 }}>
            <strong>Teacher Move Shell:</strong> {blueprint.structure.templateShell.teacherMoveShell.join(", ")}
          </p>
          <p style={{ marginBottom: 8 }}>
            <strong>Prompt Shell:</strong> {blueprint.structure.templateShell.promptShell.join(", ")}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Tone Shell:</strong> {blueprint.structure.templateShell.toneShell.join(", ")}
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Slide Planning</h3>
          <SlidePlanList slides={planningIdeas.slidePlans} />
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Formative Assessment Ideas</h3>
          <IdeaList ideas={planningIdeas.formativeAssessmentIdeas} />
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Center Ideas</h3>
          <IdeaList ideas={planningIdeas.centerIdeas} />
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Small Group Ideas</h3>
          <IdeaList ideas={planningIdeas.smallGroupIdeas} />
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Intervention Ideas</h3>
          <IdeaList ideas={planningIdeas.interventionIdeas} />
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>{lessonSpec.teach.title}</h3>
          <ul style={listStyle}>
            {lessonSpec.teach.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>{lessonSpec.guidedPractice.title}</h3>
          <ul style={listStyle}>
            {lessonSpec.guidedPractice.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>{lessonSpec.independentPractice.title}</h3>
          <ul style={listStyle}>
            {lessonSpec.independentPractice.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>{lessonSpec.centers.title}</h3>
          <ul style={listStyle}>
            {lessonSpec.centers.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>{lessonSpec.closure.title}</h3>
          <ul style={listStyle}>
            {lessonSpec.closure.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
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
          <p style={{ marginBottom: 0 }}>{lessonPackage.rotationPlan}</p>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Intervention</h3>
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
      </div>
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
