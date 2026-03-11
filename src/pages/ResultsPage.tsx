import React from "react"
import { Link } from "react-router-dom"
import { useLessonStore } from "../state/useLessonStore"

const sectionStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 16,
  background: "#ffffff",
}

export default function ResultsPage() {
  const blueprint = useLessonStore((state) => state.blueprint)
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

  if (!blueprint || !lessonSpec || !lessonPackage) {
    return (
      <BlockedResultsState
        title="Results"
        message="Inputs and materials are ready, but no generated lesson is currently loaded."
        details="Return to the generation flow to create a blueprint, lesson spec, and lesson package."
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
          <p style={{ margin: 0 }}>
            <strong>Texts:</strong> {blueprint.content.texts.join(", ")}
          </p>
        </div>

        <div style={sectionStyle}>
          <h3 style={{ marginTop: 0 }}>Blueprint Structure</h3>
          <p style={{ marginBottom: 8 }}>
            <strong>Timing:</strong> {blueprint.structure.timing.join(" | ")}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Segments:</strong> {blueprint.structure.lessonSegments.join(" -> ")}
          </p>
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

const linkStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: 12,
  textDecoration: "none",
  border: "1px solid #d1d5db",
  color: "#111827",
}

