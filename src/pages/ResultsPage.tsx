import React, { useState } from "react"
import { Link } from "react-router-dom"
import { generateLesson } from "../engine/generateLesson"
import {
  ExportArtifact,
  LessonPlanIdea,
  LessonPlanSectionIdeas,
  LessonPackage,
  LessonBlueprint,
  LessonPipelineTrace,
  SlidePlan,
  LessonPlanningIdeas,
  MissingAreaDecisionChoice,
  PlanningComponentKey,
  MaterialFile
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
  const hasRequiredInputs = useLessonStore((state) => state.hasRequiredInputs)()
  const hasReadyMaterials = useLessonStore((state) => state.hasReadyMaterials)()
  const hasProcessingMaterials = useLessonStore((state) => state.hasProcessingMaterials)()
  const counts = useLessonStore((state) => state.getMaterialCounts)()
  const materials = useLessonStore((state) => state.materials)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [regenerationError, setRegenerationError] = useState<string | null>(null)

  async function handleMissingAreaDecision(
    component: PlanningComponentKey,
    choice: MissingAreaDecisionChoice
  ) {
    setMissingAreaDecision(component, choice)
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
        Teacher-facing lesson package first. Supporting planning details are available below.
      </p>

      {(isRegenerating || regenerationError) && (
        <div style={{ marginBottom: "var(--space-md)", display: "grid", gap: 8 }}>
          {isRegenerating && (
            <div style={noticeStyle}>
              Updating the lesson package to reflect the latest teacher decision.
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

        <TraceabilitySection blueprint={blueprint} lessonPackage={lessonPackage} materials={materials} />

        {lessonTrace && <PipelineTraceSection trace={lessonTrace} />}

        <CoverageDecisionsSection
          planningIdeas={planningIdeas}
          decisions={missingAreaDecisions}
          onSetDecision={handleMissingAreaDecision}
          isRegenerating={isRegenerating}
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
      <h3 style={sectionHeadingStyle}>Package Summary</h3>
      <div style={heroGridStyle}>
        <SummaryCard label="Slides" value={lessonPackage.slides.length.toString()} />
        <SummaryCard label="Centers" value={lessonPackage.centers.length.toString()} />
        <SummaryCard label="Interventions" value={lessonPackage.interventions.length.toString()} />
      </div>

      <div style={{ marginTop: "var(--space-md)", display: "grid", gap: 8, color: "var(--text-secondary)" }}>
        <div><strong>Primary Target:</strong> {blueprint.content.target.primary}</div>
        <div><strong>Secondary Target:</strong> {blueprint.content.target.secondary || "None"}</div>
        <div><strong>Mixed Target:</strong> {blueprint.content.target.isMixedTarget ? "Yes" : "No"}</div>
        <div><strong>Selected Mode:</strong> {selectedLessonMode}</div>
        <div><strong>Standards:</strong> {blueprint.content.standards.join(", ")}</div>
      </div>
    </div>
  )
}

function TraceabilitySection({
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
      ? "Curriculum materials strongly influenced the lesson content."
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
  const contentMaterials = buildReliabilityDecisions(materials, "curriculum", "content")
  const structureMaterials = buildReliabilityDecisions(materials, "exemplar", "structure")

  return (
    <div style={sectionStyle}>
      <h3 style={sectionHeadingStyle}>Why This Lesson Was Generated This Way</h3>
      <div style={{ display: "grid", gap: 12 }}>
        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Content Authority</div>
          <div style={{ color: "var(--text-secondary)", marginBottom: 8 }}>{contentSourceLabel}</div>
          <div style={{ display: "grid", gap: 6 }}>
            <div><strong>Curriculum Support:</strong> {blueprint.sourceReadiness.curriculumSupport}</div>
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
    </div>
  )
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
                  {formatReliabilityDecision(item.decision)} · score {item.score}
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
  axis: ReliabilityAxis
): ReliabilityUiItem[] {
  const relevant = materials
    .filter((material) => material.status === "ready" && hasRelevantRoleAnalysis(material, role))
    .sort((a, b) => sortByReliabilityAndStrength(a, b))

  const usedMaterial = relevant.find((material) => isUsableForAxis(material, axis))
  const usedId = usedMaterial?.id ?? null

  return relevant.map((material) => {
    const decision = getAxisDecision(material, axis)
    let outcome: ReliabilityOutcome = "ignored"

    if (decision === "block") {
      outcome = "blocked"
    } else if (material.id === usedId) {
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
      note: buildReliabilityNote(material, axis, outcome),
      reasons: collectReliabilityReasons(material),
    }
  })
}

function hasRelevantRoleAnalysis(material: MaterialFile, role: "curriculum" | "exemplar"): boolean {
  if (role === "curriculum") {
    return material.role === "curriculum" && Boolean(material.analysis?.curriculum)
  }

  return material.role === "exemplar" && Boolean(material.analysis?.exemplar)
}

function sortByReliabilityAndStrength(a: MaterialFile, b: MaterialFile): number {
  const reliabilityDelta = getReliabilityScore(b) - getReliabilityScore(a)
  if (reliabilityDelta !== 0) {
    return reliabilityDelta
  }

  return getSignalStrength(b) - getSignalStrength(a)
}

function getReliabilityScore(material: MaterialFile): number {
  const score = material.analysis?.reliability?.score
  return typeof score === "number" ? score : 100
}

function getSignalStrength(material: MaterialFile): number {
  const tags = Array.isArray(material.analysis?.tags) ? material.analysis.tags : []
  const tag = tags.find((value) => value.startsWith("signal-strength:"))

  if (!tag) {
    return 0
  }

  const parsed = parseInt(String(tag).split(":")[1] ?? "0", 10)
  return Number.isFinite(parsed) ? parsed : 0
}

function getAxisDecision(material: MaterialFile, axis: ReliabilityAxis): string {
  const reliability = material.analysis?.reliability

  if (!reliability) {
    return "allow"
  }

  return axis === "content"
    ? reliability.contentDecision ?? "allow"
    : reliability.structureDecision ?? "allow"
}

function isUsableForAxis(material: MaterialFile, axis: ReliabilityAxis): boolean {
  const reliability = material.analysis?.reliability

  if (!reliability) {
    return true
  }

  return axis === "content"
    ? Boolean(reliability.usableForContent)
    : Boolean(reliability.usableForStructure)
}

function buildReliabilityNote(
  material: MaterialFile,
  axis: ReliabilityAxis,
  outcome: ReliabilityOutcome
): string {
  if (outcome === "used") {
    return axis === "content"
      ? "Used to ground lesson content because it was the strongest eligible curriculum source."
      : "Used to shape pacing, flow, and teacher-facing structure because it was the strongest eligible exemplar source."
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

function PipelineTraceSection({ trace }: { trace: LessonPipelineTrace }) {
  return (
    <div style={sectionStyle}>
      <h3 style={sectionHeadingStyle}>Pipeline Trace</h3>
      <div style={{ display: "grid", gap: 12 }}>
        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Generation Setup</div>
          <div style={{ display: "grid", gap: 6, color: "var(--text-secondary)" }}>
            <div><strong>Selected Mode:</strong> {trace.selectedMode}</div>
            <div><strong>Total Materials:</strong> {trace.materialCounts.total}</div>
            <div><strong>Curriculum Materials:</strong> {trace.materialCounts.curriculum}</div>
            <div><strong>Exemplar Materials:</strong> {trace.materialCounts.exemplar}</div>
          </div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Resolved Target</div>
          <div style={{ display: "grid", gap: 6, color: "var(--text-secondary)" }}>
            <div><strong>Primary:</strong> {trace.target.primary}</div>
            <div><strong>Secondary:</strong> {trace.target.secondary || "None"}</div>
            <div><strong>Mixed Target:</strong> {trace.target.isMixedTarget ? "Yes" : "No"}</div>
            <div><strong>Recommended Mode:</strong> {trace.target.recommendedMode}</div>
          </div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Planning and Package Signals</div>
          <div style={{ display: "grid", gap: 6, color: "var(--text-secondary)" }}>
            <div><strong>Missing-Area Prompt Components:</strong> {trace.missingAreaPromptComponents.length > 0 ? trace.missingAreaPromptComponents.join(", ") : "None"}</div>
            <div><strong>Blueprint Warning Count:</strong> {trace.blueprintWarnings.length}</div>
            <div><strong>Package Density:</strong> {trace.package.density}</div>
            <div><strong>Lesson Shape:</strong> {trace.package.lessonShape}</div>
            <div><strong>Content Fit:</strong> {trace.package.contentFit}</div>
            <div><strong>Package Warning Count:</strong> {trace.package.warningCount}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CoverageDecisionsSection({
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

  return (
    <div style={sectionStyle}>
      <h3 style={sectionHeadingStyle}>Coverage and Missing-Area Decisions</h3>

      <div style={{ display: "grid", gap: 12 }}>
        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Major Component Coverage</div>
          {componentCoverage.length > 0 ? (
            <div style={{ display: "grid", gap: 8 }}>
              {componentCoverage.map((entry) => (
                <div key={entry.component} style={signalCardStyle(mapCoverageTone(entry.status))}>
                  <div style={{ fontWeight: 700, textTransform: "capitalize" }}>
                    {entry.component.replace(/_/g, " ")}: {entry.status}
                  </div>
                  <div style={{ marginTop: 4 }}>{entry.rationale}</div>
                  {entry.evidence.length > 0 && (
                    <div style={{ marginTop: 4, fontSize: 13 }}>
                      <strong>Evidence:</strong> {entry.evidence.join(", ")}
                    </div>
                  )}
                </div>
              ))}
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
  items: Array<string | ExportArtifact>
}) {
  return (
    <div style={sectionStyle}>
      <h3 style={sectionHeadingStyle}>{title}</h3>
      <ul style={listStyle}>
        {items.map((item) => {
          const key = typeof item === "string" ? item : `${item.kind}-${item.fileName}`
          const label =
            typeof item === "string" ? item : `${item.label} (${item.fileName})`

          return <li key={key}>{label}</li>
        })}
      </ul>
    </div>
  )
}

function ExportArtifactsSection({ exports }: { exports: ExportArtifact[] }) {
  return (
    <div style={sectionStyle}>
      <h3 style={sectionHeadingStyle}>Exports</h3>
      <div style={{ display: "grid", gap: 10 }}>
        {exports.map((artifact) => (
          <div
            key={`${artifact.kind}-${artifact.fileName}`}
            style={signalCardStyle("neutral")}
          >
            <div style={{ fontWeight: 700 }}>{artifact.label}</div>
            <div style={{ marginTop: 4, fontSize: 13 }}>
              <strong>Status:</strong> {artifact.status === "placeholder" ? "Placeholder" : artifact.status}
            </div>
            <div style={{ marginTop: 4, fontSize: 13, color: "var(--text-secondary)" }}>
              Export generation is not fully implemented yet for this artifact.
            </div>
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


