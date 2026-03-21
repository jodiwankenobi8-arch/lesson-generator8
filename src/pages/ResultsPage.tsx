import React, { useState } from "react"
import { Link } from "react-router-dom"
import { getAxisDecision, getReliabilityScore, hasRelevantRoleAnalysis, sortByAxisPriority } from "../engine/blueprint/materialSelection"
import {
  ExportArtifact,
  LessonBlueprint,
  LessonPackage,
  LessonPipelineTrace,
  LessonPlanIdea,
  LessonPlanSectionIdeas,
  LessonPlanningIdeas,
  MissingAreaDecisionChoice,
  PlanningComponentKey,
  SlidePlan,
  MaterialFile,
} from "../engine/types"
import { useLessonStore } from "../state/useLessonStore"

const pageStyle: React.CSSProperties = {
  maxWidth: 980,
  margin: "0 auto",
}

const sectionStyle: React.CSSProperties = {
  border: "1px solid var(--border-soft)",
  borderRadius: "var(--radius-lg)",
  padding: "var(--space-lg)",
  background: "var(--paper-white)",
  boxShadow: "var(--shadow-card)",
}

const subCardStyle: React.CSSProperties = {
  border: "1px solid var(--border-soft)",
  borderRadius: "var(--radius-md)",
  padding: 12,
  background: "#fcfbf8",
}

const heroGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "var(--space-sm)",
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

export default function ResultsPage() {
  const blueprint = useLessonStore((state) => state.blueprint)
  const planningIdeas = useLessonStore((state) => state.planningIdeas)
  const lessonSpec = useLessonStore((state) => state.lessonSpec)
  const lessonPackage = useLessonStore((state) => state.lessonPackage)
  const lessonTrace = useLessonStore((state) => state.lessonTrace)
  const selectedLessonMode = useLessonStore((state) => state.selectedLessonMode)
  const missingAreaDecisions = useLessonStore((state) => state.missingAreaDecisions)
  const setMissingAreaDecision = useLessonStore((state) => state.setMissingAreaDecision)
  const generateLesson = useLessonStore((state) => state.generateLesson)
  const hasRequiredInputs = useLessonStore((state) => state.hasRequiredInputs)()
  const hasUsableMaterialsForGeneration = useLessonStore((state) => state.hasUsableMaterialsForGeneration)()
  const hasProcessingMaterials = useLessonStore((state) => state.hasProcessingMaterials)()
  const counts = useLessonStore((state) => state.getMaterialCounts)()
  const materials = useLessonStore((state) => state.materials)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [regenerationError, setRegenerationError] = useState<string | null>(null)
  const [lastDecisionSummary, setLastDecisionSummary] = useState<string | null>(null)

  async function handleMissingAreaDecision(
    component: PlanningComponentKey,
    choice: MissingAreaDecisionChoice
  ) {
    const decisionSummary = `${formatPlanningComponentLabel(component)} set to ${formatDecisionChoice(choice)}.`

    setMissingAreaDecision(component, choice)
    setLastDecisionSummary(decisionSummary)
    setRegenerationError(null)
    setIsRegenerating(true)

    try {
      await generateLesson()
    } catch (error) {
      setRegenerationError(
        error instanceof Error
          ? error.message
          : "The lesson could not be regenerated after updating the teacher decision."
      )
    } finally {
      setIsRegenerating(false)
    }
  }

  if (hasProcessingMaterials) {
    return (
      <BlockedResultsState
        title="Results"
        message="Results are blocked while materials are still processing."
        details={`Currently processing: ${counts.uploaded + counts.extracting + counts.analyzing}. Ready files: ${counts.ready}. Errors: ${counts.error}.`}
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
        details="Complete grade, subject, skill focus, lesson topic, and duration before generating results. Standard is optional here; if left blank, the app will use standards detected from ready curriculum materials when available."
        linkTo="/inputs"
        linkLabel="Go to Inputs"
      />
    )
  }

  if (!hasUsableMaterialsForGeneration) {
    return (
      <BlockedResultsState
        title="Results"
        message="Results are blocked until at least one curriculum or exemplar material is usable for grounded generation."
        details="Add curriculum or exemplar materials and wait for analysis to complete. Results unlock when at least one file is usable for grounded generation."
        linkTo="/materials"
        linkLabel="Go to Materials"
      />
    )
  }

  if (!blueprint || !lessonSpec || !lessonPackage || !planningIdeas) {
    return (
      <BlockedResultsState
        title="Results"
        message="Inputs are complete and at least one material is usable, but no generated lesson is currently loaded."
        details="Return to the generation flow to create a blueprint, planning ideas, lesson spec, and lesson package."
        linkTo="/inputs"
        linkLabel="Go to Inputs"
      />
    )
  }

  return (
    <div style={pageStyle}>
      <div style={sectionLabelStyle}>Generated Lesson</div>
      <h2
        style={{
          marginTop: 0,
          marginBottom: "var(--space-sm)",
          fontFamily: "var(--font-heading)",
          fontSize: 32,
          color: "var(--orchard-green)",
        }}
      >
        Results
      </h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-lg)", fontSize: 16 }}>
        Teacher-facing lesson package first. Review the generated package, confirm the standards and source support, open the planning details when needed, and export only the pieces you want to use.
      </p>

      {(isRegenerating || regenerationError || lastDecisionSummary) && (
        <div style={{ marginBottom: "var(--space-md)", display: "grid", gap: 8 }}>
          {isRegenerating && (
            <div style={noticeStyle}>
              {lastDecisionSummary
                ? `${lastDecisionSummary} Regenerating the lesson package now.`
                : "Updating the lesson package to reflect the latest teacher decision."}
            </div>
          )}

          {!isRegenerating && !regenerationError && lastDecisionSummary && (
            <div
              style={{
                ...noticeStyle,
                background: "#ecfdf5",
                borderColor: "#a7f3d0",
                color: "#065f46",
              }}
            >
              {lastDecisionSummary} The package has been refreshed with your latest teacher decision.
            </div>
          )}

          {regenerationError && (
            <div style={warningStyle}>
              {regenerationError}
            </div>
          )}
        </div>
      )}

      <div style={{ display: "grid", gap: "var(--space-md)" }}>
        <PackageSummarySection
          blueprint={blueprint}
          lessonPackage={lessonPackage}
          selectedLessonMode={selectedLessonMode}
        />

        <PackageOutputsSection lessonPackage={lessonPackage} />

        <CoverageDecisionsSection
          planningIdeas={planningIdeas}
          decisions={missingAreaDecisions}
          onSetDecision={handleMissingAreaDecision}
          isRegenerating={isRegenerating}
        />

        <SecondaryEvidenceSection
          blueprint={blueprint}
          lessonPackage={lessonPackage}
          materials={materials}
          planningIdeas={planningIdeas}
          lessonTrace={lessonTrace}
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
      <h3 style={sectionHeadingStyle}>Teacher Package Summary</h3>
      <div style={heroGridStyle}>
        <SummaryCard label="Slides" value={lessonPackage.slides.length.toString()} />
        <SummaryCard label="Intervention Support" value={lessonPackage.interventions.length.toString()} />
        <SummaryCard label="Student Centers" value={lessonPackage.centers.length.toString()} />
      </div>

      <div style={{ marginTop: "var(--space-md)", display: "grid", gap: 8, color: "var(--text-secondary)" }}>
        <div><strong>Primary Target:</strong> {blueprint.content.target.primary}</div>
        <div><strong>Secondary Target:</strong> {blueprint.content.target.secondary || "None"}</div>
        <div><strong>Mixed Target:</strong> {blueprint.content.target.isMixedTarget ? "Yes" : "No"}</div>
        <div><strong>Selected Mode:</strong> {selectedLessonMode}</div>
        <div><strong>Standards:</strong> {blueprint.content.standards.join(", ")}</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Standards snapshot: use this to confirm the primary detected alignment before reviewing traceability or exporting.
          </div>
      </div>
    </div>
  )
}

function SecondaryEvidenceSection({
  blueprint,
  lessonPackage,
  materials,
  planningIdeas,
  lessonTrace,
}: {
  blueprint: LessonBlueprint
  lessonPackage: LessonPackage
  materials: MaterialFile[]
  planningIdeas: LessonPlanningIdeas
  lessonTrace: LessonPipelineTrace | null
}) {
  return (
    <details style={sectionStyle}>
      <summary style={summaryStyle}>Lesson Evidence and Planning Details</summary>
      <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
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

        <TraceabilitySection blueprint={blueprint} lessonPackage={lessonPackage} materials={materials} />

        <PlanningDetailsSection
          slidePlans={planningIdeas.slidePlans}
          lessonPlanSections={planningIdeas.lessonPlanSections}
        />

        <BlueprintDetailsSection blueprint={blueprint} />

        {lessonTrace && <PipelineTraceSection trace={lessonTrace} />}
      </div>
    </details>
  )
}

export function TraceabilitySection({
  blueprint,
  lessonPackage,
  materials,
}: {
  blueprint: LessonBlueprint
  lessonPackage: LessonPackage
  materials: MaterialFile[]
}) {
  const contentSourceLabel =
    blueprint.sourceReadiness.curriculumSupport === "strong"
      ? blueprint.sourceReadiness.selectedCurriculumMaterialIds.length > 1
        ? "Curriculum materials strongly influenced the lesson content. The strongest curriculum source led content grounding, with secondary curriculum support threaded in where useful."
        : "A curriculum material strongly influenced the lesson content."
      : "Curriculum support is limited, so some content may rely on fallback lesson logic."

  const structureSourceLabel =
    blueprint.sourceReadiness.exemplarSupport === "strong"
      ? "Exemplar materials strongly influenced pacing, flow, and teacher-facing structure."
      : "Exemplar support is limited, so structure may rely on fallback lesson organization."

  const packageConfidenceLabel =
    lessonPackage.readiness.contentFit === "grounded"
      ? "The package appears grounded in the available source materials."
      : "The package appears partially grounded and may rely on more fallback logic."

  const fallbackUsageLabel = getFallbackUsageLabel(blueprint, lessonPackage)
  const combinedWarnings = [...blueprint.sourceReadiness.warnings, ...lessonPackage.readiness.warnings]
  const selectedContentSourceNames = getSelectedMaterialNames(
    materials,
    blueprint.sourceReadiness.selectedCurriculumMaterialIds
  )
  const selectedStructureSourceNames = getSelectedMaterialNames(
    materials,
    blueprint.sourceReadiness.selectedExemplarMaterialIds
  )
  const contentMaterials = buildReliabilityDecisions(
    materials,
    "curriculum",
    "content",
    blueprint.sourceReadiness.selectedCurriculumMaterialIds
  )
  const structureMaterials = buildReliabilityDecisions(
    materials,
    "exemplar",
    "structure",
    blueprint.sourceReadiness.selectedExemplarMaterialIds
  )
  const cautionOrBlockedSummary = Array.from(
    new Set(
      [...contentMaterials, ...structureMaterials]
        .filter((item) => item.outcome === "blocked" || item.decision === "caution")
        .map((item) => `${item.name} (${item.outcome === "blocked" ? "blocked" : "caution"})`)
    )
  )

  return (
    <details style={sectionStyle}>
      <summary style={summaryStyle}>Source Authority and Lesson Grounding</summary>
      <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Authority at a Glance</div>
          <div style={{ display: "grid", gap: 6 }}>
            <div><strong>Content authority:</strong> {joinOrFallback(selectedContentSourceNames, "No selected curriculum source")}</div>
            <div><strong>Presentation authority:</strong> {joinOrFallback(selectedStructureSourceNames, "No selected exemplar source")}</div>
            <div><strong>Package grounding:</strong> {packageConfidenceLabel}</div>
            <div><strong>Fallback usage:</strong> {fallbackUsageLabel}</div>
            <div><strong>Used with caution or blocked:</strong> {joinOrFallback(cautionOrBlockedSummary, "None")}</div>
          </div>
          <div style={{ color: "var(--text-secondary)", marginTop: 8 }}>
            This is the shortest teacher-facing summary of what grounded the lesson and where the engine had to be more careful.
          </div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Content Authority</div>
          <div style={{ color: "var(--text-secondary)", marginBottom: 8 }}>{contentSourceLabel}</div>
          <div style={{ display: "grid", gap: 6 }}>
            <div><strong>Curriculum Support:</strong> {blueprint.sourceReadiness.curriculumSupport}</div>
            <div><strong>Selected Curriculum Source(s):</strong> {joinOrFallback(selectedContentSourceNames, "No selected curriculum source")}</div>
            <div><strong>Standards Source:</strong> {joinOrFallback(blueprint.content.standards, "Teacher-selected standard")}</div>
            <div><strong>Vocabulary Source:</strong> {joinOrFallback(blueprint.content.vocabulary, "Key vocabulary")}</div>
            <div><strong>Text/Topic Source:</strong> {joinOrFallback(blueprint.content.texts, "Teacher-provided lesson text")}</div>
            <div><strong>Practice Source:</strong> {joinOrFallback(blueprint.content.practiceIdeas, "Curriculum-aligned practice task")}</div>
          </div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Presentation Authority</div>
          <div style={{ color: "var(--text-secondary)", marginBottom: 8 }}>{structureSourceLabel}</div>
          <div style={{ display: "grid", gap: 6 }}>
            <div><strong>Exemplar Support:</strong> {blueprint.sourceReadiness.exemplarSupport}</div>
            <div><strong>Selected Exemplar Source:</strong> {joinOrFallback(selectedStructureSourceNames, "No selected exemplar source")}</div>
            <div><strong>Lesson Flow:</strong> {joinOrFallback(blueprint.structure.lessonSegments, "Default lesson flow")}</div>
            <div><strong>Pacing:</strong> {joinOrFallback(blueprint.structure.timing, "Default pacing")}</div>
            <div><strong>Teacher Moves:</strong> {joinOrFallback(blueprint.structure.teacherMoves, "Teacher model and guided support")}</div>
            <div><strong>Prompt Style:</strong> {joinOrFallback(blueprint.structure.promptStyle, "Teacher prompt")}</div>
          </div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Package Confidence</div>
          <div style={{ color: "var(--text-secondary)", marginBottom: 8 }}>{packageConfidenceLabel}</div>
          <div style={{ display: "grid", gap: 6 }}>
            <div><strong>Source Balance:</strong> {blueprint.sourceReadiness.overall}</div>
            <div><strong>Coverage Support:</strong> {blueprint.sourceReadiness.coverageSupport}</div>
            <div><strong>Content Fit:</strong> {lessonPackage.readiness.contentFit}</div>
            <div><strong>Lesson Shape:</strong> {lessonPackage.readiness.lessonShape}</div>
            <div><strong>Package Density:</strong> {lessonPackage.readiness.density}</div>
            <div><strong>Fallback Usage:</strong> {fallbackUsageLabel}</div>
          </div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Material Reliability Decisions</div>
          <div style={{ color: "var(--text-secondary)", marginBottom: 8 }}>
            These notes show which analyzed materials were used, down-ranked, blocked, or ignored for each authority axis.
          </div>

          <AuthorityDecisionList
            title="Content materials"
            items={contentMaterials}
            emptyText="No analyzed curriculum materials were available to explain."
          />

          <div style={{ height: 12 }} />

          <AuthorityDecisionList
            title="Presentation materials"
            items={structureMaterials}
            emptyText="No analyzed exemplar materials were available to explain."
          />
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Warnings and Fallback Notes</div>
          {combinedWarnings.length > 0 ? (
            <div style={{ display: "grid", gap: 8 }}>
              {combinedWarnings.map((warning) => (
                <div key={warning} style={warningStyle}>
                  {warning}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "var(--text-secondary)" }}>
              No major blueprint or package warnings were triggered for this lesson.
            </div>
          )}
        </div>
      </div>
    </details>
  )
}

function formatPlanningComponentLabel(component: PlanningComponentKey): string {
  return component
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

type ReliabilityAxis = "content" | "structure"
type ReliabilityOutcome = "used" | "down-ranked" | "blocked" | "ignored"

type ReliabilityUiItem = {
  key: string
  name: string
  outcome: ReliabilityOutcome
  decision: string
  score: number
  note: string
  reasons: string[]
}

function AuthorityDecisionList({
  title,
  items,
  emptyText,
}: {
  title: string
  items: ReliabilityUiItem[]
  emptyText: string
}) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ fontWeight: 700 }}>{title}</div>

      {items.length > 0 ? (
        <div style={{ display: "grid", gap: 8 }}>
          {items.map((item) => (
            <div
              key={item.key}
              style={{
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--radius-sm)",
                padding: "10px 12px",
                background: "rgba(255,255,255,0.82)",
                display: "grid",
                gap: 6,
              }}
            >
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                <strong>{item.name}</strong>
                <span style={decisionBadgeStyle(item.outcome)}>{formatReliabilityOutcome(item.outcome)}</span>
                <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>
                  {formatReliabilityDecision(item.decision)} - score {item.score}
                </span>
              </div>

              <div style={{ color: "var(--text-secondary)" }}>{item.note}</div>

              {item.reasons.length > 0 ? (
                <div style={{ display: "grid", gap: 4 }}>
                  {item.reasons.slice(0, 3).map((reason) => (
                    <div key={reason} style={warningStyle}>
                      {reason}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color: "var(--text-secondary)" }}>{emptyText}</div>
      )}
    </div>
  )
}

function buildReliabilityDecisions(
  materials: MaterialFile[],
  role: "curriculum" | "exemplar",
  axis: ReliabilityAxis,
  selectedMaterialIds: string[]
): ReliabilityUiItem[] {
  const relevant = materials
    .filter((material) => material.status === "ready" && hasRelevantRoleAnalysis(material, role))
    .sort((a, b) => sortByAxisPriority(a, b, axis))

  const selectedIdSet = new Set(selectedMaterialIds)

  return relevant.map((material) => {
    const decision = getAxisDecision(material, axis)
    let outcome: ReliabilityOutcome = "ignored"

    if (decision === "block") {
      outcome = "blocked"
    } else if (selectedIdSet.has(material.id)) {
      outcome = "used"
    } else if (decision === "allow" || decision === "caution") {
      outcome = "down-ranked"
    }

    return {
      key: material.id + "-" + axis,
      name: material.name,
      outcome,
      decision,
      score: getReliabilityScore(material),
      note: buildReliabilityNote(material, axis, outcome, selectedMaterialIds.indexOf(material.id)),
      reasons: collectReliabilityReasons(material),
    }
  })
}

function getSelectedMaterialNames(materials: MaterialFile[], selectedIds: string[]): string[] {
  const selectedIdSet = new Set(selectedIds)

  return materials
    .filter((material) => selectedIdSet.has(material.id))
    .map((material) => material.name)
}

function buildReliabilityNote(
  material: MaterialFile,
  axis: ReliabilityAxis,
  outcome: ReliabilityOutcome,
  selectedIndex: number
): string {
  if (outcome === "used") {
    if (axis === "content") {
      return selectedIndex === 0
        ? "Used as the primary curriculum grounding source because it ranked strongest for content on this axis."
        : "Used as a secondary curriculum support source because it added additional eligible content signals."
    }

    return "Used to shape pacing, flow, and teacher-facing structure because it was the strongest eligible exemplar source."
  }

  if (outcome === "down-ranked") {
    const decision = getAxisDecision(material, axis)
    return decision === "caution"
      ? "Stayed eligible with caution, but a cleaner or stronger source won this axis."
      : "Remained eligible, but another source ranked higher for this axis."
  }

  if (outcome === "blocked") {
    return axis === "content"
      ? "Blocked from steering content because the reliability layer marked it unsafe for curriculum grounding."
      : "Blocked from steering presentation because the reliability layer marked it unsafe for exemplar structure."
  }

  return axis === "content"
    ? "Ignored because it did not provide relevant usable content signals for this axis."
    : "Ignored because it did not provide relevant usable presentation signals for this axis."
}

function collectReliabilityReasons(material: MaterialFile): string[] {
  const reliability = material.analysis?.reliability

  if (!reliability) {
    return []
  }

  const reasons = Array.isArray(reliability.reasons) ? reliability.reasons : []
  const warnings = Array.isArray(reliability.warnings) ? reliability.warnings : []

  return Array.from(new Set([...reasons, ...warnings]))
}

function formatReliabilityOutcome(outcome: ReliabilityOutcome): string {
  if (outcome === "used") return "Used"
  if (outcome === "down-ranked") return "Down-ranked"
  if (outcome === "blocked") return "Blocked"
  return "Ignored"
}

function formatReliabilityDecision(decision: string): string {
  if (!decision) {
    return "Allow"
  }

  return decision.charAt(0).toUpperCase() + decision.slice(1)
}

function decisionBadgeStyle(outcome: ReliabilityOutcome): React.CSSProperties {
  const palette =
    outcome === "used"
      ? { background: "#ecfdf5", color: "#065f46" }
      : outcome === "down-ranked"
        ? { background: "#fff7ed", color: "#9a3412" }
        : outcome === "blocked"
          ? { background: "#fef2f2", color: "#991b1b" }
          : { background: "#f3f4f6", color: "#374151" }

  return {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    background: palette.background,
    color: palette.color,
  }
}

export function PipelineTraceSection({ trace }: { trace: LessonPipelineTrace }) {
  return (
    <details style={sectionStyle}>
      <summary style={summaryStyle}>Pipeline Trace</summary>
      <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Mode and Material Counts</div>
          <div style={{ display: "grid", gap: 6 }}>
            <div><strong>Selected Mode:</strong> {trace.selectedMode}</div>
            <div><strong>Total Materials:</strong> {trace.materialCounts.total}</div>
            <div><strong>Curriculum Materials:</strong> {trace.materialCounts.curriculum}</div>
            <div><strong>Exemplar Materials:</strong> {trace.materialCounts.exemplar}</div>
          </div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Selected Source IDs</div>
          <div style={{ display: "grid", gap: 6 }}>
            <div>
              <strong>Curriculum:</strong>{" "}
              {joinOrFallback(trace.selectedSources.curriculumMaterialIds, "None selected")}
            </div>
            <div>
              <strong>Exemplar:</strong>{" "}
              {joinOrFallback(trace.selectedSources.exemplarMaterialIds, "None selected")}
            </div>
          </div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Target Resolution</div>
          <div style={{ display: "grid", gap: 6 }}>
            <div><strong>Primary Target:</strong> {trace.target.primary}</div>
            <div><strong>Secondary Target:</strong> {trace.target.secondary ?? "None"}</div>
            <div><strong>Mixed Target:</strong> {trace.target.isMixedTarget ? "Yes" : "No"}</div>
            <div><strong>Recommended Mode:</strong> {trace.target.recommendedMode}</div>
          </div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Package Summary</div>
          <div style={{ display: "grid", gap: 6 }}>
            <div><strong>Density:</strong> {trace.package.density}</div>
            <div><strong>Lesson Shape:</strong> {trace.package.lessonShape}</div>
            <div><strong>Content Fit:</strong> {trace.package.contentFit}</div>
            <div><strong>Package Warning Count:</strong> {trace.package.warningCount}</div>
          </div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Warnings and Missing-Area Prompts</div>
          <div style={{ display: "grid", gap: 6, marginBottom: 8 }}>
            <div>
              <strong>Missing-Area Prompt Components:</strong>{" "}
              {joinOrFallback(trace.missingAreaPromptComponents, "None")}
            </div>
          </div>

          {trace.blueprintWarnings.length > 0 ? (
            <div style={{ display: "grid", gap: 8 }}>
              {trace.blueprintWarnings.map((warning) => (
                <div key={warning} style={warningStyle}>
                  {warning}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "var(--text-secondary)" }}>
              No blueprint warnings were recorded in the pipeline trace.
            </div>
          )}
        </div>
      </div>
    </details>
  )
}
export function CoverageDecisionsSection({
  planningIdeas,
  decisions,
  onSetDecision,
  isRegenerating,
}: {
  planningIdeas: LessonPlanningIdeas
  decisions: Partial<Record<PlanningComponentKey, MissingAreaDecisionChoice>>
  onSetDecision: (component: PlanningComponentKey, choice: MissingAreaDecisionChoice) => Promise<void>
  isRegenerating: boolean
}) {
  const componentCoverage = planningIdeas.componentCoverage ?? []
  const missingAreaPrompts = planningIdeas.missingAreaPrompts ?? []
  const coverageByComponent = new Map(
    componentCoverage.map((entry) => [entry.component, entry] as const)
  )

  return (
    <div style={sectionStyle}>
      <h3 style={sectionHeadingStyle}>Teacher Decisions for Missing Lesson Parts</h3>

      <div style={{ display: "grid", gap: 12 }}>
        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Major Component Coverage</div>
          {componentCoverage.length > 0 ? (
            <div style={{ display: "grid", gap: 8 }}>
              {componentCoverage.map((entry) => {
                const hasEvidenceDetails =
                  entry.evidence.length > 0 || Boolean(entry.sourceCoverage) || Boolean(entry.generatedCoverage)

                return (
                  <div key={entry.component} style={signalCardStyle(mapCoverageTone(entry.status))}>
                    <div style={{ fontWeight: 700, textTransform: "capitalize" }}>
                      {entry.component.replace(/_/g, " ")}: {entry.status}
                    </div>

                    <div style={{ marginTop: 4 }}>{entry.rationale}</div>

                    {hasEvidenceDetails ? (
                      <details style={{ marginTop: 8 }}>
                        <summary style={minorSummaryStyle}>Evidence details</summary>
                        <div style={{ marginTop: 8, display: "grid", gap: 6, fontSize: 13 }}>
                          {entry.evidence.length > 0 ? (
                            <div>
                              <strong>Combined evidence:</strong> {entry.evidence.join(", ")}
                            </div>
                          ) : null}

                          {entry.sourceCoverage ? (
                            <div>
                              <strong>Source coverage:</strong> {entry.sourceCoverage.status}
                              {entry.sourceCoverage.evidence.length > 0
                                ? ` | ${entry.sourceCoverage.evidence.join(", ")}`
                                : ""}
                            </div>
                          ) : null}

                          {entry.generatedCoverage ? (
                            <div>
                              <strong>Generated support:</strong> {entry.generatedCoverage.status}
                              {entry.generatedCoverage.evidence.length > 0
                                ? ` | ${entry.generatedCoverage.evidence.join(", ")}`
                                : ""}
                            </div>
                          ) : null}
                        </div>
                      </details>
                    ) : null}
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ color: "var(--text-secondary)" }}>
              No component coverage summary is available for this lesson yet.
            </div>
          )}
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Teacher Decision Prompts</div>
          {missingAreaPrompts.length > 0 ? (
            <div style={{ display: "grid", gap: 12 }}>
              {missingAreaPrompts.map((prompt, index) => {
                const currentChoice = decisions[prompt.component] ?? "undecided"
                const coverage = coverageByComponent.get(prompt.component)
                const sourceStatus =
                  coverage?.sourceCoverage?.status ?? coverage?.status ?? "missing"
                const generatedStatus =
                  coverage?.generatedCoverage?.status ?? "missing"
                const hasEvidenceDetails =
                  (coverage?.sourceCoverage?.evidence?.length ?? 0) > 0 ||
                  (coverage?.generatedCoverage?.evidence?.length ?? 0) > 0

                return (
                  <div
                    key={`${prompt.component}-${index}`}
                    style={signalCardStyle(prompt.importance === "high" ? "warn" : "neutral")}
                  >
                    <div style={{ fontWeight: 700, textTransform: "capitalize" }}>
                      {prompt.component.replace(/_/g, " ")} ({prompt.importance})
                    </div>

                    <div style={{ marginTop: 4 }}>{prompt.prompt}</div>

                    <div style={{ marginTop: 4, fontSize: 13 }}>
                      <strong>Why:</strong> {prompt.rationale}
                    </div>

                    <div style={{ marginTop: 6, fontSize: 13 }}>
                      <strong>Source coverage:</strong> {sourceStatus}
                    </div>

                    <div style={{ marginTop: 4, fontSize: 13 }}>
                      <strong>Generated support:</strong> {generatedStatus}
                    </div>

                    {hasEvidenceDetails ? (
                      <details style={{ marginTop: 8 }}>
                        <summary style={minorSummaryStyle}>Evidence details</summary>
                        <div style={{ marginTop: 8, display: "grid", gap: 6, fontSize: 13 }}>
                          {coverage?.sourceCoverage?.evidence && coverage.sourceCoverage.evidence.length > 0 ? (
                            <div>
                              <strong>Source evidence:</strong> {coverage.sourceCoverage.evidence.join(", ")}
                            </div>
                          ) : null}

                          {coverage?.generatedCoverage?.evidence && coverage.generatedCoverage.evidence.length > 0 ? (
                            <div>
                              <strong>Generated evidence:</strong> {coverage.generatedCoverage.evidence.join(", ")}
                            </div>
                          ) : null}
                        </div>
                      </details>
                    ) : null}

                    {sourceStatus === "missing" && generatedStatus !== "missing" ? (
                      <div style={{ marginTop: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                        The engine can generate support here, but the source materials did not clearly cover it.
                        Choose whether to keep that generated support or leave it out.
                      </div>
                    ) : null}

                    <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <DecisionButton
                        label="Add it"
                        active={currentChoice === "add"}
                        disabled={isRegenerating}
                        onClick={() => onSetDecision(prompt.component, "add")}
                      />
                      <DecisionButton
                        label="Leave it out"
                        active={currentChoice === "leave_out"}
                        disabled={isRegenerating}
                        onClick={() => onSetDecision(prompt.component, "leave_out")}
                      />
                      <DecisionButton
                        label="Decide later"
                        active={currentChoice === "undecided"}
                        disabled={isRegenerating}
                        onClick={() => onSetDecision(prompt.component, "undecided")}
                      />
                    </div>

                    <div style={{ marginTop: 8, fontSize: 13 }}>
                      <strong>Current decision:</strong> {formatDecisionChoice(currentChoice)}
                    </div>

                    <div style={{ marginTop: 4, fontSize: 13, color: "var(--text-secondary)" }}>
                      This teacher decision is applied to the current package and will remain active until you change it.
                    </div>

                    {isRegenerating ? (
                      <div style={{ marginTop: 4, fontSize: 13, color: "var(--text-secondary)" }}>
                        Refreshing the lesson package with the latest decision...
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{ color: "var(--text-secondary)" }}>
              No major missing-area prompts were triggered for this lesson.
            </div>
          )}
        </div>
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
      <h3 style={sectionHeadingStyle}>{title}</h3>
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

function hasVisibleText(content: string): boolean {
  return content.trim().length > 0
}

function sanitizeListItems(items: string[]): string[] {
  return items
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

function PackageOutputsSection({ lessonPackage }: { lessonPackage: LessonPackage }) {
  const lessonPlan = lessonPackage.lessonPlan.trim()
  const slides = sanitizeListItems(lessonPackage.slides)
  const interventions = sanitizeListItems(lessonPackage.interventions)
  const centers = sanitizeListItems(lessonPackage.centers)
  const rotationPlan = lessonPackage.rotationPlan.trim()
  const exports = lessonPackage.exports ?? []

  const hasVisibleOutputs =
    lessonPlan.length > 0 ||
    slides.length > 0 ||
    interventions.length > 0 ||
    centers.length > 0 ||
    rotationPlan.length > 0 ||
    exports.length > 0

  return (
    <>
      {lessonPlan.length > 0 ? <PreSection title="Lesson Plan" content={lessonPlan} /> : null}
      {slides.length > 0 ? <SimpleListSection title="Slides" items={slides} /> : null}
      {interventions.length > 0 ? <SimpleListSection title="Intervention Support" items={interventions} /> : null}
      {centers.length > 0 ? <SimpleListSection title="Student Centers" items={centers} /> : null}
      {rotationPlan.length > 0 ? <PreSection title="Student Centers Rotation Plan" content={rotationPlan} /> : null}
      {exports.length > 0 ? <ExportArtifactsSection exports={exports} /> : null}

      {!hasVisibleOutputs ? (
        <div style={sectionStyle}>
          <h3 style={sectionHeadingStyle}>Package Outputs</h3>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>
            No teacher-facing outputs are included in the current package yet. Request the outputs you want or add
            stronger source support, then regenerate if you need more materials.
          </p>
        </div>
      ) : null}
    </>
  )
}

function BlueprintDetailsSection({ blueprint }: { blueprint: LessonBlueprint }) {
  return (
    <>
      <details style={sectionStyle}>
        <summary style={summaryStyle}>Blueprint Content</summary>
        <div style={{ marginTop: 12, color: "var(--text-secondary)" }}>
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
        <div style={{ marginTop: 12, color: "var(--text-secondary)" }}>
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
              <h3 style={{ marginTop: 0, color: "var(--orchard-green)" }}>{section.title}</h3>
              <IdeaList ideas={section.ideas} />
            </div>
          ))}
        </div>
      </details>
    </>
  )
}

function SimpleListSection({
  title,
  items,
}: {
  title: string
  items: string[]
}) {
  return (
    <div style={sectionStyle}>
      <h3 style={sectionHeadingStyle}>{title}</h3>
      <ul style={listStyle}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

export async function downloadExportArtifact(artifact: ExportArtifact) {
  if (!artifact.content) return

  let blob: Blob

  if (artifact.mimeType === DOCX_MIME) {
    const { exportLessonPlanDocx } = await import("../engine/exports/exportLessonPlanDocx")
    blob = await exportLessonPlanDocx(artifact.label, artifact.content)
  } else {
    blob = new Blob([artifact.content], {
      type: artifact.mimeType ?? "text/plain;charset=utf-8",
    })
  }

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = artifact.fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

function ExportArtifactsSection({ exports }: { exports: ExportArtifact[] }) {
  return (
    <div style={sectionStyle}>
      <h3 style={sectionHeadingStyle}>Exports</h3>
      <p style={{ color: "var(--text-secondary)", margin: "0 0 var(--space-sm) 0" }}>
        Export only what you need, or download the full lesson package once the artifacts are ready.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        {exports.map((artifact) => (
          <div
            key={`${artifact.kind}-${artifact.fileName}`}
            style={signalCardStyle("neutral")}
          >
            <div style={{ fontWeight: 700 }}>{artifact.label}</div>
            <div style={{ marginTop: 4, fontSize: 13 }}>
              <strong>Format:</strong> {artifact.mimeType === DOCX_MIME ? "DOCX" : "Plain text"}
            </div>
            <div style={{ marginTop: 4, fontSize: 13 }}>
              <strong>Filename:</strong> {artifact.fileName}
            </div>
            <div style={{ marginTop: 4, fontSize: 13, color: "var(--text-secondary)" }}>
              {artifact.mimeType === DOCX_MIME
                ? "This export is generated from the current lesson package and downloads as a DOCX lesson plan."
                : "This export is generated from the current lesson package and downloads as plain text."}
            </div>

            {artifact.content ? (
              <button
                type="button"
                onClick={() => void downloadExportArtifact(artifact)}
                style={{
                  marginTop: 10,
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  color: "var(--text-primary)",
                  padding: "8px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Download
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

function PreSection({ title, content }: { title: string; content: string }) {
  return (
    <div style={sectionStyle}>
      <h3 style={sectionHeadingStyle}>{title}</h3>
      <pre style={preStyle}>{content}</pre>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        border: "1px solid #f3efe6",
        borderRadius: "var(--radius-md)",
        padding: 12,
        background: "#fcfbf8",
      }}
    >
      <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "var(--orchard-green)" }}>{value}</div>
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
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>
            <strong>Why:</strong> {idea.rationale}
          </p>
        </div>
      ))}
    </div>
  )
}

function DecisionButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string
  active: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "8px 10px",
        borderRadius: "var(--radius-sm)",
        border: active ? "1px solid var(--orchard-green)" : "1px solid var(--border-soft)",
        background: active ? "var(--orchard-green)" : "var(--paper-white)",
        color: active ? "var(--paper-white)" : "var(--text-primary)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        fontSize: 12,
        fontWeight: 700,
        boxShadow: active ? "var(--shadow-soft)" : "none",
      }}
    >
      {label}
    </button>
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
    <div style={pageStyle}>
      <div style={sectionLabelStyle}>Generated Lesson</div>
      <h2
        style={{
          marginTop: 0,
          marginBottom: "var(--space-sm)",
          fontFamily: "var(--font-heading)",
          fontSize: 32,
          color: "var(--orchard-green)",
        }}
      >
        {title}
      </h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-md)" }}>{message}</p>
      <div style={noticeStyle}>{details}</div>
      <div style={actionsStyle}>
        <Link to={linkTo} style={linkStyle}>
          {linkLabel}
        </Link>
      </div>
    </div>
  )
}

function joinOrFallback(items: string[], fallback: string): string {
  return items.length > 0 ? items.join(", ") : fallback
}

function getFallbackUsageLabel(
  blueprint: LessonBlueprint,
  lessonPackage: LessonPackage,
): string {
  const hasLimitedCurriculum = blueprint.sourceReadiness.curriculumSupport === "limited"
  const hasLimitedExemplar = blueprint.sourceReadiness.exemplarSupport === "limited"
  const hasLimitedContentFit = lessonPackage.readiness.contentFit === "limited"

  if (hasLimitedContentFit && hasLimitedCurriculum && hasLimitedExemplar) {
    return "Heavy fallback usage likely."
  }

  if (hasLimitedContentFit || hasLimitedCurriculum || hasLimitedExemplar) {
    return "Partial fallback usage likely."
  }

  return "Minimal fallback usage likely."
}

function formatDecisionChoice(choice: MissingAreaDecisionChoice): string {
  if (choice === "add") {
    return "Add it"
  }

  if (choice === "leave_out") {
    return "Leave it out"
  }

  return "Decide later"
}

function mapCoverageTone(status: "covered" | "partial" | "missing"): "good" | "warn" | "neutral" {
  if (status === "covered") {
    return "good"
  }

  if (status === "missing") {
    return "warn"
  }

  return "neutral"
}

function signalCardStyle(tone: "good" | "warn" | "neutral"): React.CSSProperties {
  const palette =
    tone === "good"
      ? { background: "#ecfdf5", border: "#a7f3d0", color: "#065f46" }
      : tone === "warn"
        ? { background: "#fff7ed", border: "#fed7aa", color: "#9a3412" }
        : { background: "#fcfbf8", border: "var(--border-soft)", color: "var(--text-secondary)" }

  return {
    border: `1px solid ${palette.border}`,
    background: palette.background,
    color: palette.color,
    borderRadius: "var(--radius-md)",
    padding: 12,
  }
}

const warningStyle: React.CSSProperties = {
  border: "1px solid #fed7aa",
  background: "#fff7ed",
  color: "#9a3412",
  borderRadius: "var(--radius-md)",
  padding: 12,
  fontSize: 14,
}

const noticeStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border-soft)",
  background: "#fcfbf8",
  color: "var(--text-secondary)",
}

const actionsStyle: React.CSSProperties = {
  marginTop: "var(--space-md)",
  display: "flex",
  gap: 12,
}

const listStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: 20,
  color: "var(--text-secondary)",
}

const preStyle: React.CSSProperties = {
  margin: 0,
  whiteSpace: "pre-wrap",
  fontFamily: "inherit",
  color: "var(--text-secondary)",
}

const linkStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 14px",
  borderRadius: "var(--radius-md)",
  textDecoration: "none",
  border: "1px solid var(--moss-green)",
  color: "var(--orchard-green)",
  background: "#fcfbf8",
  fontWeight: 700,
  boxShadow: "var(--shadow-soft)",
}

const summaryStyle: React.CSSProperties = {
  cursor: "pointer",
  fontWeight: 700,
  color: "var(--orchard-green)",
}

const minorSummaryStyle: React.CSSProperties = {
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 13,
  color: "var(--text-primary)",
}

const sectionHeadingStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "var(--space-md)",
  color: "var(--orchard-green)",
}

const subHeadingStyle: React.CSSProperties = {
  fontWeight: 700,
  marginBottom: 6,
  color: "var(--orchard-green)",
}

