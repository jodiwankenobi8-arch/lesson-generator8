import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  buildMaterialGroundingCounts,
  buildReliabilityDecisions,
  formatReliabilityDecision,
  formatReliabilityOutcome,
  getSelectedMaterialNames,
  type MaterialGroundingCounts,
  type ReliabilityOutcome,
  type ReliabilityUiItem,
} from "./resultsPageReliabilityHelpers"
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
import {
  orchardButtonStyle,
  orchardCardStyle,
  orchardMetaRowStyle,
  orchardNoticeStyle,
  orchardPageShellStyle,
  orchardSectionHeaderRowStyle,
  orchardSoftCardStyle,
  orchardStatGridStyle,
  orchardStatusBadgeStyle,
  orchardTagStyle,
} from "./orchardUi"
import { useLessonStore } from "../state/useLessonStore"
import { OrchardPageHeader } from "./OrchardPageHeader"
import {
  downloadExportArtifact,
  getArtifactButtonLabel,
  getArtifactDescription,
  getArtifactFormatLabel,
  getArtifactKindLabel,
  getBundledArtifactLabels,
} from "./resultsPageExportHelpers"
import {
  buildVisiblePackageSectionItems,
  countTeacherLedSupportLines,
  extractRotationOnlyText,
  extractTeacherLedSupportLines,
  getBinderReadinessLabel,
  getBinderReadinessTone,
  getPackageWarningsMessage,
  getResultsHeaderStatusText,
  getTeacherBinderLeadText,
  getVisiblePackageSectionLabels,
  sanitizeListItems,
  shouldShowSecondaryEvidencePanel,
} from "./resultsPagePackageHelpers"
import {
  summarizeExemplarPayoff,
  summarizeContentAuthorityLead,
  summarizeContentGrounding,
  summarizeResolvedContentSource,
  summarizeSelectedExemplarInfluence,
  summarizeSelectedExemplarTargets,
  summarizeStructureImpact,
} from "./resultsPageTraceabilityHelpers"
import { getNormalizedBlueprintValues } from "../engine/shared/teacherFacingContent"

export {
  downloadExportArtifact,
  getArtifactButtonLabel,
  getArtifactDescription,
  getArtifactFormatLabel,
  getBundledArtifactLabels,
  getPackageWarningsMessage,
  getResultsHeaderStatusText,
  getTeacherBinderLeadText,
  getVisiblePackageSectionLabels,
  shouldShowSecondaryEvidencePanel,
}

const pageStyle: React.CSSProperties = {
  ...orchardPageShellStyle,
  maxWidth: 1180,
  margin: "0 auto",
}

const introStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: 16,
  lineHeight: 1.6,
  margin: 0,
}

const feedbackStackStyle: React.CSSProperties = {
  marginBottom: "var(--space-md)",
  display: "grid",
  gap: 8,
}

const successNoticeStyle: React.CSSProperties = {
  ...orchardNoticeStyle,
  background: "rgba(110, 139, 107, 0.14)",
  border: "1px solid var(--border-moss)",
  color: "var(--deep-orchard)",
}

const warningStyle: React.CSSProperties = {
  ...orchardNoticeStyle,
  border: "1px solid var(--border-cranberry)",
  background: "rgba(184, 84, 90, 0.12)",
  color: "var(--cranberry)",
  fontSize: 14,
}

const noticeStyle: React.CSSProperties = {
  ...orchardNoticeStyle,
}

const sectionStyle: React.CSSProperties = {
  ...orchardCardStyle,
  background:
    "linear-gradient(180deg, rgba(255, 252, 246, 0.98) 0%, rgba(250, 245, 236, 0.94) 100%)",
  border: "1px solid rgba(151, 127, 87, 0.22)",
  boxShadow: "0 16px 34px rgba(60, 43, 24, 0.07), inset 0 1px 0 rgba(255, 255, 255, 0.78)",
}

const subCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: 14,
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(251, 246, 238, 0.88) 100%)",
  border: "1px solid rgba(151, 127, 87, 0.16)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.72), 0 8px 18px rgba(72, 54, 30, 0.05)",
}

const primaryLayoutStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: "var(--space-lg)",
  alignItems: "start",
}

const mainColumnStyle: React.CSSProperties = {
  display: "grid",
  gap: "var(--space-lg)",
  minWidth: 0,
  width: "100%",
  maxWidth: "100%",
  alignContent: "start",
}

const sideColumnStyle: React.CSSProperties = {
  display: "grid",
  gap: "var(--space-lg)",
  minWidth: 0,
  width: "100%",
  maxWidth: "100%",
  alignSelf: "start",
  position: "sticky",
  top: 20,
}

const sidebarCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: 14,
  display: "grid",
  gap: 10,
  minWidth: 0,
  width: "100%",
  maxWidth: "100%",
  background:
    "linear-gradient(180deg, rgba(245, 239, 228, 0.96) 0%, rgba(237, 230, 218, 0.92) 100%)",
  border: "1px solid rgba(151, 127, 87, 0.24)",
  boxShadow: "0 14px 28px rgba(66, 47, 24, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.62)",
}

const heroGridStyle: React.CSSProperties = {
  ...orchardStatGridStyle,
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: 14,
  marginBottom: 16,
}

const heroCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: 14,
  display: "grid",
  gap: 8,
  minHeight: "100%",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(249, 244, 235, 0.9) 100%)",
  border: "1px solid rgba(151, 127, 87, 0.18)",
  boxShadow: "0 10px 22px rgba(72, 54, 30, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
}

const heroLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.3,
  textTransform: "uppercase",
  color: "var(--text-secondary)",
}

const heroValueStyle: React.CSSProperties = {
  fontSize: 30,
  fontWeight: 700,
  color: "var(--orchard-green)",
  lineHeight: 1,
}

const heroNoteStyle: React.CSSProperties = {
  fontSize: 13,
  lineHeight: 1.5,
  color: "var(--text-secondary)",
}

const sectionHeadingStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 0,
  color: "var(--orchard-green)",
  fontFamily: "var(--font-heading)",
}

const subHeadingStyle: React.CSSProperties = {
  fontWeight: 700,
  color: "var(--text-primary)",
}

const sectionLeadStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  margin: "8px 0 0 0",
  lineHeight: 1.55,
}

const denseKeyValueStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
  color: "var(--text-secondary)",
  lineHeight: 1.5,
}

const tagRowStyle: React.CSSProperties = {
  ...orchardMetaRowStyle,
  marginTop: 6,
}

const reviewStripStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: 14,
  display: "grid",
  gap: 8,
  border: "1px solid rgba(151, 127, 87, 0.22)",
  borderLeft: "6px solid var(--border-moss)",
  background:
    "linear-gradient(90deg, rgba(110, 139, 107, 0.12) 0%, rgba(250, 246, 238, 0.95) 20%, rgba(250, 246, 238, 0.95) 100%)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.72)",
}

const reviewSequenceListStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: 18,
  color: "var(--text-secondary)",
  display: "grid",
  gap: 6,
  lineHeight: 1.5,
}

const exportBundleCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  marginBottom: 14,
  display: "grid",
  gap: 10,
  padding: 16,
  border: "1px solid rgba(151, 127, 87, 0.22)",
  borderTop: "4px solid var(--border-moss)",
  background:
    "linear-gradient(180deg, rgba(248, 243, 234, 0.98) 0%, rgba(239, 247, 239, 0.78) 100%)",
  boxShadow: "0 10px 22px rgba(72, 54, 30, 0.05)",
}

const exportBundleNoteStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: 14,
  lineHeight: 1.5,
}

const exportArtifactGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 14,
}

const exportArtifactCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: 14,
  display: "grid",
  gap: 10,
}

const exportMetaListStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
  color: "var(--text-secondary)",
  fontSize: 13,
  lineHeight: 1.5,
}

const exportButtonRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
}

const binderSnapshotGridStyle: React.CSSProperties = {
  ...orchardStatGridStyle,
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: 14,
  marginBottom: 16,
}

const binderSnapshotCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: 14,
  display: "grid",
  gap: 8,
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 244, 235, 0.88) 100%)",
  border: "1px solid rgba(151, 127, 87, 0.16)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.78), 0 8px 18px rgba(72, 54, 30, 0.05)",
}

const binderSnapshotStatLabelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.3,
  textTransform: "uppercase",
  color: "var(--text-secondary)",
}

const binderSnapshotStatValueStyle: React.CSSProperties = {
  fontSize: 28,
  fontWeight: 700,
  color: "var(--orchard-green)",
}

const detailsSectionGridStyle: React.CSSProperties = {
  marginTop: 14,
  display: "grid",
  gap: 14,
}

const previewHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
}

const preStyle: React.CSSProperties = {
  margin: 0,
  whiteSpace: "pre-wrap",
  fontFamily: "inherit",
  color: "var(--text-secondary)",
  lineHeight: 1.6,
}

const previewListStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: 18,
  color: "var(--text-secondary)",
  display: "grid",
  gap: 8,
  lineHeight: 1.55,
}

const summaryStyle: React.CSSProperties = {
  cursor: "pointer",
  fontWeight: 700,
  color: "var(--orchard-green)",
}

const smallNoteStyle: React.CSSProperties = {
  fontSize: 13,
  color: "var(--text-secondary)",
  lineHeight: 1.5,
}

const groundingBarStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  marginBottom: 12,
  padding: "10px 12px",
  border: "1px solid rgba(151, 127, 87, 0.18)",
  borderRadius: "var(--radius-sm)",
  background: "rgba(248, 242, 231, 0.78)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.7)",
}

const signalCardBaseStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: 12,
  border: "1px solid rgba(151, 127, 87, 0.16)",
  borderLeft: "4px solid rgba(151, 127, 87, 0.35)",
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(249, 244, 235, 0.86) 100%)",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.74), 0 8px 18px rgba(72, 54, 30, 0.05)",
}

const actionsStyle: React.CSSProperties = {
  marginTop: "var(--space-md)",
  display: "flex",
  gap: 12,
}

const linkStyle: React.CSSProperties = {
  ...orchardButtonStyle({ subtle: true }),
  display: "inline-flex",
  textDecoration: "none",
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
        details="Complete grade, subject, and skill / focus before generating results. Standard, topic / text / unit, duration, and extra notes stay optional here."
        linkTo="/inputs"
        linkLabel="Go to Inputs"
      />
    )
  }

  if (!hasUsableMaterialsForGeneration) {
    return (
      <BlockedResultsState
        title="Results"
        message="Results are blocked because the added materials are not usable for grounded generation."
        details="Review, remove, or replace unusable materials. If you want an input-only lesson, remove the unusable files and generate from teacher inputs on Materials."
        linkTo="/materials"
        linkLabel="Go to Materials"
      />
    )
  }

  if (!blueprint || !lessonSpec || !lessonPackage || !planningIdeas) {
    return (
      <BlockedResultsState
        title="Results"
        message="Inputs are complete, but no generated lesson is currently loaded."
        details="Return to Materials to generate the lesson package. If no files are added, the package will use teacher inputs and default artifact shells."
        linkTo="/materials"
        linkLabel="Go to Materials"
      />
    )
  }

  const hasSelectedCurriculumSources = blueprint.sourceReadiness.selectedCurriculumMaterialIds.length > 0
  const hasSelectedExemplarSources = blueprint.sourceReadiness.selectedExemplarMaterialIds.length > 0

  return (
    <div style={pageStyle}>
      <OrchardPageHeader label="Lesson Package" title="Results">
        <p style={introStyle}>
          {getResultsIntroText(hasSelectedCurriculumSources, hasSelectedExemplarSources)}
        </p>
        <p style={introStyle}>{getResultsHeaderStatusText()}</p>
      </OrchardPageHeader>

      {(isRegenerating || regenerationError || lastDecisionSummary) ? (
        <div style={feedbackStackStyle}>
          {isRegenerating ? (
            <div style={noticeStyle}>
              {lastDecisionSummary
                ? `${lastDecisionSummary} Regenerating the lesson package now.`
                : "Updating the lesson package to reflect the latest teacher decision."}
            </div>
          ) : null}
          {!isRegenerating && !regenerationError && lastDecisionSummary ? (
            <div style={successNoticeStyle}>
              {lastDecisionSummary} The package has been refreshed with your latest teacher decision.
            </div>
          ) : null}
          {regenerationError ? <div style={warningStyle}>{regenerationError}</div> : null}
        </div>
      ) : null}

      <div style={primaryLayoutStyle}>
        <div style={mainColumnStyle}>
          <PackageSummarySection
            blueprint={blueprint}
            lessonPackage={lessonPackage}
            selectedLessonMode={selectedLessonMode}
            materials={materials}
            lessonTrace={lessonTrace}
            planningIdeas={planningIdeas}
            decisions={missingAreaDecisions}
          />
          <PackageOutputsSection lessonPackage={lessonPackage} />
        </div>

        <div style={sideColumnStyle}>
          <ReviewFlowCard lessonPackage={lessonPackage} />
          <details style={sidebarCardStyle}>
            <summary style={summaryStyle}>Optional planning decisions</summary>
            <div style={{ marginTop: 10 }}>
              <CoverageDecisionsSection
                planningIdeas={planningIdeas}
                decisions={missingAreaDecisions}
                onSetDecision={handleMissingAreaDecision}
                isRegenerating={isRegenerating}
              />
            </div>
          </details>
        </div>
      </div>

      {shouldShowSecondaryEvidencePanel() ? (
        <SecondaryEvidenceSection
          blueprint={blueprint}
          lessonPackage={lessonPackage}
          materials={materials}
          planningIdeas={planningIdeas}
          lessonTrace={lessonTrace}
        />
      ) : null}
    </div>
  )
}

function getResultsIntroText(
  hasSelectedCurriculumSources: boolean,
  hasSelectedExemplarSources: boolean
): string {
  if (hasSelectedCurriculumSources && hasSelectedExemplarSources) {
    return "Review the lesson package below. Content comes from your curriculum materials. Structure comes from your exemplar materials. Missing pieces are generated to complete the lesson."
  }

  if (hasSelectedCurriculumSources) {
    return "Review the lesson package below. Content comes from your curriculum materials. Structure uses a default classroom-ready shell because no exemplar source was selected."
  }

  if (hasSelectedExemplarSources) {
    return "Review the lesson package below. Content comes from teacher inputs and generated gap-filling. Structure comes from your exemplar materials; no curriculum source was used."
  }

  return "Review the lesson package below. This input-only run used teacher inputs, generated gap-filling, and default classroom-ready artifact shells; no curriculum or exemplar source was used."
}

function ReviewFlowCard({ lessonPackage }: { lessonPackage: LessonPackage }) {
  const visibleSections = buildVisiblePackageSectionItems(lessonPackage)
  const exports = lessonPackage.exports ?? []

  return (
    <div style={sidebarCardStyle}>
      <div style={subHeadingStyle}>Use this order</div>
      <ul style={reviewSequenceListStyle}>
        <li>Review what came from your materials and what was generated.</li>
        <li>Review the teacher package before downloading anything.</li>
        <li>Handle only the teacher decisions still missing from the source materials.</li>
        <li>Use exports after the package reads coherently.</li>
      </ul>
      <div style={smallNoteStyle}>
        Current package surface: {visibleSections.length} teacher-facing section{visibleSections.length === 1 ? "" : "s"}. Exports ready: {exports.length}.
      </div>
    </div>
  )
}

function buildPendingDecisionsCount(
  planningIdeas: LessonPlanningIdeas,
  decisions: Partial<Record<PlanningComponentKey, MissingAreaDecisionChoice>>
): number {
  const prompts = planningIdeas.missingAreaPrompts ?? []
  return prompts.filter((prompt) => (decisions[prompt.component] ?? "undecided") === "undecided").length
}

export function PackageSummarySection({
  blueprint,
  lessonPackage,
  selectedLessonMode,
  materials,
  lessonTrace,
  planningIdeas = null,
  decisions = {},
}: {
  blueprint: LessonBlueprint
  lessonPackage: LessonPackage
  selectedLessonMode: string
  materials: MaterialFile[]
  lessonTrace: LessonPipelineTrace | null
  planningIdeas?: LessonPlanningIdeas | null
  decisions?: Partial<Record<PlanningComponentKey, MissingAreaDecisionChoice>>
}) {
  const teacherLedSupportCount = countTeacherLedSupportLines(lessonPackage.rotationPlan)
  const selectedContentSourceNames = getSelectedMaterialNames(
    materials,
    blueprint.sourceReadiness.selectedCurriculumMaterialIds
  )
  const resolvedContentSourceSummary = summarizeResolvedContentSource(
    selectedContentSourceNames,
    blueprint
  )
  const selectedStructureSourceNames = getSelectedMaterialNames(
    materials,
    blueprint.sourceReadiness.selectedExemplarMaterialIds
  )
  const selectedExemplarInfluenceSummary = summarizeSelectedExemplarInfluence(
    materials,
    blueprint.sourceReadiness.selectedExemplarMaterialIds
  )
  const selectedExemplarTargetSummary = summarizeSelectedExemplarTargets(
    materials,
    blueprint.sourceReadiness.selectedExemplarMaterialIds
  )
  const contentGroundingSummary = summarizeContentGrounding(blueprint)
  const structureImpactSummary = summarizeStructureImpact(blueprint)
  const fallbackUsageLabel = getFallbackUsageLabel(blueprint, lessonPackage)
  const addedLessonSummary = getAddedLessonSummary(lessonTrace, fallbackUsageLabel)
  const addedLessonReviewLabel = getAddedLessonReviewLabel(lessonTrace)
  const groundingCounts = buildMaterialGroundingCounts(
    materials,
    blueprint.sourceReadiness.selectedCurriculumMaterialIds,
    blueprint.sourceReadiness.selectedExemplarMaterialIds
  )
  const pendingDecisionsCount = planningIdeas
    ? buildPendingDecisionsCount(planningIdeas, decisions)
    : 0

  return (
    <div style={sectionStyle}>
      <div style={orchardSectionHeaderRowStyle}>
        <div>
          <h3 style={sectionHeadingStyle}>Teacher Package Overview</h3>
          <p style={sectionLeadStyle}>
            Start with a quick package scan, then move into the completed lesson package review.
          </p>
        </div>
        <span style={orchardStatusBadgeStyle(getBinderReadinessTone(lessonPackage))}>
          {getBinderReadinessLabel(lessonPackage)}
        </span>

            <div style={groundingBarStyle} data-testid="grounding-bar">
              <span style={orchardTagStyle("moss")}>{groundingCounts.used} used</span>
              {groundingCounts.needsReview > 0 ? (
                <span style={orchardTagStyle("honey")}>{groundingCounts.needsReview} needs review</span>
              ) : null}
              {groundingCounts.blocked > 0 ? (
                <span style={orchardTagStyle("cranberry")}>{groundingCounts.blocked} blocked</span>
              ) : null}
              {pendingDecisionsCount > 0 ? (
                <span style={orchardTagStyle("honey")}>
                  {pendingDecisionsCount} decision{pendingDecisionsCount === 1 ? "" : "s"} {pendingDecisionsCount === 1 ? "needs" : "need"} review
                </span>
              ) : null}
            </div>
      </div>

      <div style={heroGridStyle}>
        <SummaryCard
          label="Slides"
          value={lessonPackage.slides.length.toString()}
          note="Student-facing slides currently included in the package."
        />
        <SummaryCard
          label="Teacher-Led Support"
          value={teacherLedSupportCount.toString()}
          note="Teacher-led support stays separate from centers and independent work."
        />
        <SummaryCard
          label="Centers / Independent Work"
          value={lessonPackage.centers.length.toString()}
          note="Student-independent work only."
        />
      </div>

      <div style={detailsSectionGridStyle}>
        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Lesson snapshot</div>
          <div style={denseKeyValueStyle}>
            <div><strong>Primary focus:</strong> {blueprint.content.target.primary}</div>
            <div><strong>Additional focus:</strong> {blueprint.content.target.secondary || "None"}</div>
            <div><strong>Integrated focus:</strong> {blueprint.content.target.isMixedTarget ? "Yes" : "No"}</div>
            <div><strong>Lesson coverage:</strong> {selectedLessonMode === "full" ? "Integrated focus" : "Single focus"}</div>
            <div><strong>Standards:</strong> {joinOrFallback(getNormalizedBlueprintValues(blueprint, "standard"), "No grounded standard identified yet")}</div>
          </div>
          <div style={smallNoteStyle}>Use this snapshot to confirm the lesson focus and standards before exporting.</div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>How materials shaped this lesson</div>
          <div style={denseKeyValueStyle}>
            <div><strong>Content from curriculum:</strong> {resolvedContentSourceSummary}</div>
            <div><strong>Structure from exemplars:</strong> {joinOrFallback(selectedStructureSourceNames, "No selected exemplar source")}</div>
            <div><strong>Added where materials were limited:</strong> {addedLessonSummary}</div>
          </div>
          <details style={{ marginTop: 10 }}>
            <summary style={{ cursor: "pointer", color: "var(--text-secondary)", fontSize: 13 }}>Review source details</summary>
            <div style={{ ...denseKeyValueStyle, marginTop: 8 }}>
              <div><strong>What came from curriculum materials:</strong> {contentGroundingSummary}</div>
              <div><strong>What came from exemplar materials:</strong> {structureImpactSummary}</div>
              <div><strong>Where exemplars apply:</strong> {joinOrFallback(selectedExemplarTargetSummary, "Whole package structure")}</div>
              <div><strong>Exemplar style choice:</strong> {selectedExemplarInfluenceSummary}</div>
              <div><strong>Review these added details before teaching:</strong> {addedLessonReviewLabel}</div>
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  note,
}: {
  label: string
  value: string
  note: string
}) {
  return (
    <div style={heroCardStyle}>
      <div style={heroLabelStyle}>{label}</div>
      <div style={heroValueStyle}>{value}</div>
      <div style={heroNoteStyle}>{note}</div>
    </div>
  )
}

function TeacherBinderSnapshotSection({ lessonPackage }: { lessonPackage: LessonPackage }) {
  const visiblePackageSections = buildVisiblePackageSectionItems(lessonPackage)
  const exports = lessonPackage.exports ?? []
  const bundledArtifactLabels = getBundledArtifactLabels(exports)
  const hasFullPackageZip = exports.some((artifact) => artifact.kind === "full_package")
  const warningCount = lessonPackage.readiness.warnings.length

  return (
    <div style={sectionStyle}>
      <div style={orchardSectionHeaderRowStyle}>
        <div style={{ display: "grid", gap: 8 }}>
          <h3 style={sectionHeadingStyle}>Package Snapshot</h3>
          <p style={sectionLeadStyle}>Review what is included, then download only the files you need.</p>
        </div>
        <span style={orchardStatusBadgeStyle(getBinderReadinessTone(lessonPackage))}>
          {getBinderReadinessLabel(lessonPackage)}
        </span>
      </div>

      <div style={binderSnapshotGridStyle}>
        <div style={binderSnapshotCardStyle}>
          <div style={binderSnapshotStatLabelStyle}>Package sections</div>
          <div style={binderSnapshotStatValueStyle}>{visiblePackageSections.length}</div>
          <div style={smallNoteStyle}>Teacher-facing sections currently included in this package.</div>
        </div>

        <div style={binderSnapshotCardStyle}>
          <div style={binderSnapshotStatLabelStyle}>Exports ready</div>
          <div style={binderSnapshotStatValueStyle}>{exports.length}</div>
          <div style={smallNoteStyle}>Package ZIP plus individual downloads when available.</div>
        </div>

        <div style={binderSnapshotCardStyle}>
          <div style={binderSnapshotStatLabelStyle}>Needs review</div>
          <div style={binderSnapshotStatValueStyle}>{warningCount}</div>
          <div style={smallNoteStyle}>{getPackageWarningsMessage(warningCount)}</div>
        </div>
      </div>

      <div style={binderSnapshotCardStyle}>
        <div style={subHeadingStyle}>Included in this teacher package</div>
        {visiblePackageSections.length > 0 ? (
          <div style={tagRowStyle}>
            {visiblePackageSections.map((item) => (
              <span key={item.label} style={orchardTagStyle(item.tone)}>
                {item.label}
              </span>
            ))}
          </div>
        ) : (
          <div style={smallNoteStyle}>No teacher-facing sections are currently included in this package.</div>
        )}
      </div>

      <div style={{ ...binderSnapshotCardStyle, marginTop: 12 }}>
        <div style={subHeadingStyle}>Available exports</div>
        <div style={smallNoteStyle}>
          {hasFullPackageZip
            ? "Use the package ZIP when you want the whole generated lesson package together, or use the individual downloads when you only need one file."
            : "Only individual downloads are available in this package right now."}
        </div>
        {(hasFullPackageZip || bundledArtifactLabels.length > 0) ? (
          <div style={tagRowStyle}>
            {hasFullPackageZip ? <span style={orchardTagStyle("moss")}>Package ZIP</span> : null}
            {bundledArtifactLabels.map((label) => (
              <span key={label} style={orchardTagStyle("neutral")}>{label}</span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}


function AiConstructionSection({ lessonTrace }: { lessonTrace: LessonPipelineTrace | null }) {
  const aiTrace = lessonTrace?.aiConstruction
  if (!aiTrace?.applied) {
    return null
  }

  const confidencePercent = `${Math.round((aiTrace.confidence ?? 0) * 100)}%`
  const hasReviewNeeds =
    aiTrace.inferredContentLabels.length > 0 ||
    aiTrace.requestedButMissing.length > 0 ||
    aiTrace.teacherReviewItems.length > 0

  return (
    <div style={sectionStyle}>
      <div style={orchardSectionHeaderRowStyle}>
        <div>
          <h3 style={sectionHeadingStyle}>What was added to complete the lesson</h3>
          <p style={sectionLeadStyle}>
            Use this review to confirm what was added beyond your materials and what still needs teacher confirmation before export.
          </p>
        </div>
        <span style={orchardStatusBadgeStyle(hasReviewNeeds ? "honey" : "moss")}>
          {`Lesson readiness ${confidencePercent}`}
        </span>
      </div>

      <div style={detailsSectionGridStyle}>
        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Content from materials and completed details</div>
          <div style={smallNoteStyle}>
            Content from materials came from stronger source support. Added details were completed where the lesson needed more support and should be reviewed more carefully.
          </div>

          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>From materials</div>
            {aiTrace.groundedContentLabels.length > 0 ? (
              <div style={tagRowStyle}>
                {aiTrace.groundedContentLabels.map((label) => (
                  <span key={`grounded-${label}`} style={orchardTagStyle("moss")}>
                    {label}
                  </span>
                ))}
              </div>
            ) : (
              <div style={smallNoteStyle}>No added lesson details grounded in source materials were recorded.</div>
            )}
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Added to complete the lesson</div>
            {aiTrace.inferredContentLabels.length > 0 ? (
              <div style={tagRowStyle}>
                {aiTrace.inferredContentLabels.map((label) => (
                  <span key={`inferred-${label}`} style={orchardTagStyle("honey")}>
                    {label}
                  </span>
                ))}
              </div>
            ) : (
              <div style={smallNoteStyle}>No extra completed lesson details were recorded.</div>
            )}
          </div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Requested but still missing</div>
          {aiTrace.requestedButMissing.length > 0 ? (
            <ul style={previewListStyle}>
              {aiTrace.requestedButMissing.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <div style={smallNoteStyle}>No requested outputs were flagged as missing.</div>
          )}
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Standards suggestions</div>
          {aiTrace.standardsSuggestions.length > 0 ? (
            <div style={{ display: "grid", gap: 10 }}>
              {aiTrace.standardsSuggestions.map((suggestion) => (
                <div
                  key={suggestion.value}
                  style={{
                    border: "1px solid var(--border-soft)",
                    borderRadius: "var(--radius-sm)",
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.82)",
                    display: "grid",
                    gap: 6,
                  }}
                >
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <strong>{suggestion.value}</strong>
                    <span style={orchardTagStyle(suggestion.origin === "grounded" ? "moss" : "honey")}>
                      {suggestion.origin === "grounded" ? "Grounded" : "Inferred"}
                    </span>
                  </div>
                  <div style={smallNoteStyle}>
                    <strong>Source types:</strong> {suggestion.sourceTypes.length > 0 ? suggestion.sourceTypes.join(", ") : "Not specified"}
                  </div>
                  <div style={smallNoteStyle}>
                    <strong>Evidence:</strong> {suggestion.evidence.length > 0 ? suggestion.evidence.join(", ") : "No explicit evidence recorded"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={smallNoteStyle}>No standards suggestions were recorded.</div>
          )}
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Teacher review needed</div>
          {aiTrace.teacherReviewItems.length > 0 ? (
            <div style={{ display: "grid", gap: 10 }}>
              {aiTrace.teacherReviewItems.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  style={{
                    border: "1px solid var(--border-soft)",
                    borderRadius: "var(--radius-sm)",
                    padding: "10px 12px",
                    background: "rgba(255,255,255,0.82)",
                    display: "grid",
                    gap: 6,
                  }}
                >
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <strong>{item.label}</strong>
                    <span style={orchardTagStyle("honey")}>Review needed</span>
                  </div>
                  <div style={smallNoteStyle}>
                    <strong>Reason:</strong> {item.reason}
                  </div>
                  <div style={smallNoteStyle}>{item.note}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={smallNoteStyle}>No extra teacher review items were recorded.</div>
          )}
        </div>

        {aiTrace.warnings.length > 0 ? (
          <div style={subCardStyle}>
            <div style={subHeadingStyle}>Items to review</div>
            <div style={{ display: "grid", gap: 8 }}>
              {aiTrace.warnings.map((warning) => (
                <div key={warning} style={warningStyle}>{warning}</div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
export function PackageOutputsSection({ lessonPackage }: { lessonPackage: LessonPackage }) {
  const lessonPlan = lessonPackage.lessonPlan.trim()
  const slides = sanitizeListItems(lessonPackage.slides)
  const interventions = sanitizeListItems(lessonPackage.interventions)
  const centers = sanitizeListItems(lessonPackage.centers)
  const rotationPlan = lessonPackage.rotationPlan.trim()
  const teacherLedSupportLines = extractTeacherLedSupportLines(rotationPlan)
  const rotationOnly = extractRotationOnlyText(rotationPlan)
  const exports = lessonPackage.exports ?? []
  const exportBlockedForReview = exports.length === 0 && lessonPackage.readiness.warnings.length > 0

  const hasVisibleOutputs =
    lessonPlan.length > 0 ||
    slides.length > 0 ||
    teacherLedSupportLines.length > 0 ||
    interventions.length > 0 ||
    centers.length > 0 ||
    rotationOnly.length > 0 ||
    exports.length > 0 ||
    exportBlockedForReview

  return (
    <>
      {hasVisibleOutputs ? <TeacherBinderSnapshotSection lessonPackage={lessonPackage} /> : null}

      {hasVisibleOutputs ? (
        <div style={reviewStripStyle}>
          <div style={subHeadingStyle}>Review the package</div>
          <div style={smallNoteStyle}>
            Read the package in teacher order. Lesson plan and slides stay first, then teacher-led support, intervention, student-independent work, rotation, and exports.
          </div>
        </div>
      ) : null}

      {lessonPlan.length > 0 ? <PreSection title="Lesson Plan" content={lessonPlan} /> : null}
      {slides.length > 0 ? <SimpleListSection title="Slides" items={slides} /> : null}
      {teacherLedSupportLines.length > 0 ? <SimpleListSection title="Teacher-Led Support" items={teacherLedSupportLines} /> : null}
      {interventions.length > 0 ? <SimpleListSection title="Intervention Support" items={interventions} /> : null}
      {centers.length > 0 ? <SimpleListSection title="Centers / Independent Work" items={centers} /> : null}
      {rotationOnly.length > 0 ? <PreSection title="Centers / Independent Work Rotation" content={rotationOnly} /> : null}
      {exports.length > 0 ? <ExportArtifactsSection exports={exports} /> : null}
      {exportBlockedForReview ? (
        <div style={sectionStyle}>
          <h3 style={sectionHeadingStyle}>Exports</h3>
          <p style={sectionLeadStyle}>
            Exports stay blocked until you review Materials and confirm the missing lesson content.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link to="/materials" style={{ ...orchardButtonStyle(), textDecoration: "none", fontWeight: 700 }}>
              Return to Materials
            </Link>
          </div>
        </div>
      ) : null}

      {!hasVisibleOutputs ? (
        <div style={sectionStyle}>
          <h3 style={sectionHeadingStyle}>Package Outputs</h3>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>
            No teacher-facing outputs are included in the current package yet. Request the outputs you want or add stronger source support, then regenerate if you need more materials.
          </p>
        </div>
      ) : null}
    </>
  )
}

function buildPreviewText(content: string, lineLimit: number): { preview: string; hidden: boolean } {
  const lines = content.split(/\r?\n/)
  if (lines.length <= lineLimit) {
    return { preview: content, hidden: false }
  }
  return {
    preview: lines.slice(0, lineLimit).join("\n"),
    hidden: true,
  }
}

function PreSection({ title, content }: { title: string; content: string }) {
  const preview = buildPreviewText(content, title === "Lesson Plan" ? 16 : 6)
  const openByDefault = title === "Lesson Plan"

  return (
    <div style={sectionStyle}>
      <details open={openByDefault}>
        <summary style={summaryStyle}>{title}</summary>
        <div style={detailsSectionGridStyle}>
          <div style={previewHeaderStyle}>
            <div style={subHeadingStyle}>{title}</div>
            <span style={orchardTagStyle("neutral")}>
              {countNonEmptyLines(content)} line{countNonEmptyLines(content) === 1 ? "" : "s"}
            </span>
          </div>
          <pre style={preStyle}>{preview.preview}</pre>
          {preview.hidden ? <div style={smallNoteStyle}>Open this section to review the full content.</div> : null}
          {preview.hidden ? <pre style={preStyle}>{content}</pre> : null}
        </div>
      </details>
    </div>
  )
}

function SimpleListSection({ title, items }: { title: string; items: string[] }) {
  const previewItems = title === "Slides"
    ? items.map((item) => formatSlidePreviewItem(item))
    : items
  const visible = previewItems.slice(0, 4)
  const hidden = previewItems.slice(4)
  const openByDefault = title === "Slides" || title === "Teacher-Led Support"

  return (
    <div style={sectionStyle}>
      <details open={openByDefault}>
        <summary style={summaryStyle}>{title}</summary>
        <div style={detailsSectionGridStyle}>
          <div style={previewHeaderStyle}>
            <div style={subHeadingStyle}>{title}</div>
            <span style={orchardTagStyle("neutral")}>{previewItems.length}</span>
          </div>
          <ul style={previewListStyle}>
            {visible.map((item) => <li key={item}>{item}</li>)}
          </ul>
          {hidden.length > 0 ? <div style={smallNoteStyle}>Open this section to review {hidden.length} more item{hidden.length === 1 ? "" : "s"}.</div> : null}
          {hidden.length > 0 ? (
            <ul style={previewListStyle}>
              {hidden.map((item) => <li key={item}>{item}</li>)}
            </ul>
          ) : null}
        </div>
      </details>
    </div>
  )
}

export function formatSlidePreviewItem(item: string): string {
  const normalized = item.replace(/\s+/g, " ").trim()
  if (normalized.length === 0) {
    return ""
  }

  const lines = item
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length > 1) {
    const titleLine = lines[0] ?? ""
    const titleMatch = titleLine.match(/^(Slide \d+):\s*(.+)$/)
    const slideNum = titleMatch?.[1] ?? ""
    let slideTitle = titleMatch?.[2] ?? titleLine

    const practiceTypeMatch = slideTitle.match(/^(Guided Practice|Independent Practice):\s*(.+)$/)
    const extraParts: string[] = []
    if (practiceTypeMatch) {
      slideTitle = practiceTypeMatch[1]
      const remainder = practiceTypeMatch[2]
      const lastColon = remainder.lastIndexOf(":")
      if (lastColon > 0) {
        const practiceContent = remainder.substring(0, lastColon).trim()
        const wordsContent = remainder.substring(lastColon + 1).trim()
        if (practiceContent) extraParts.push(`Practice: ${practiceContent}`)
        if (wordsContent) extraParts.push(`Words: ${wordsContent}`)
      } else if (remainder) {
        extraParts.push(`Practice: ${remainder}`)
      }
    }

    const contentLines = lines
      .slice(1)
      .filter((line) => !line.startsWith("Teacher note:"))
      .slice(0, 2)
    const teacherNote = lines.find((line) => line.startsWith("Teacher note:"))

    const summaryParts = [
      slideNum && slideTitle ? `${slideNum}: ${slideTitle}` : titleLine,
      ...extraParts,
      ...contentLines,
      teacherNote,
    ].filter(Boolean)

    return summaryParts.join(" — ")
  }

  // Single-line case: title itself encodes Guided/Independent Practice with embedded body
  const singleLinePracticeMatch = normalized.match(
    /^(Slide \d+):\s*(Guided Practice|Independent Practice):\s*(.+)$/i
  )
  if (singleLinePracticeMatch) {
    const slideNum = singleLinePracticeMatch[1]
    const practiceType = singleLinePracticeMatch[2]
    const remainder = singleLinePracticeMatch[3]
    const lastColon = remainder.lastIndexOf(":")
    const summaryParts = [slideNum + ": " + practiceType]
    if (lastColon > 0) {
      summaryParts.push("Practice: " + remainder.substring(0, lastColon).trim())
      summaryParts.push("Words: " + remainder.substring(lastColon + 1).trim())
    } else if (remainder) {
      summaryParts.push("Practice: " + remainder)
    }
    return summaryParts.join(" \u2014 ")
  }

  if (!normalized.includes("|")) {
    return normalized
  }

  const parts = normalized.split("|").map((part) => part.trim()).filter(Boolean)
  const title = parts.find((part) => /^Slide\s+\d+:/i.test(part)) ?? "Slide"
  const teacherMove = readLegacySlideField(parts, "Teacher Move")
  const content = readLegacySlideField(parts, "Content")
  const purpose = readLegacySlideField(parts, "Purpose")

  const summaryParts = [
    title,
    purpose,
    teacherMove ? `Teacher move: ${teacherMove}` : "",
    content ? `Student content: ${content}` : "",
  ].filter(Boolean)

  return summaryParts.join(". ")
}

function readLegacySlideField(parts: string[], label: string): string {
  const lowerLabel = `${label.toLowerCase()}:`
  const match = parts.find((part) => part.toLowerCase().startsWith(lowerLabel))
  if (!match) {
    return ""
  }
  return match.slice(label.length + 1).trim()
}

export function ExportArtifactsSection({ exports }: { exports: ExportArtifact[] }) {
  const fullPackageArtifact = exports.find((artifact) => artifact.kind === "full_package")
  const sectionArtifacts = exports.filter((artifact) => artifact.kind !== "full_package")
  const bundledArtifactLabels = getBundledArtifactLabels(exports)
  const bundleSummary = bundledArtifactLabels.length > 0
    ? `Current package ZIP includes: ${bundledArtifactLabels.join(", ")}.`
    : "Current package ZIP includes the current generated files."

  return (
    <div style={sectionStyle}>
      <h3 style={sectionHeadingStyle}>Exports</h3>
      <p style={sectionLeadStyle}>
        Download the current generated artifacts as one ZIP bundle, or download each artifact in its classroom-ready format.
      </p>

      {fullPackageArtifact ? (
        <div style={exportBundleCardStyle}>
          <div style={orchardSectionHeaderRowStyle}>
            <div style={{ fontWeight: 700, color: "var(--deep-orchard)" }}>Full Lesson Package ZIP</div>
            {bundledArtifactLabels.length > 0 ? (
              <span style={orchardTagStyle("moss")}>
                {bundledArtifactLabels.length} bundled download{bundledArtifactLabels.length === 1 ? "" : "s"}
              </span>
            ) : null}
          </div>
          <div style={exportBundleNoteStyle}>{bundleSummary}</div>
          {bundledArtifactLabels.length > 0 ? (
            <div style={tagRowStyle}>
              {bundledArtifactLabels.map((label) => (
                <span key={label} style={orchardTagStyle("neutral")}>{label}</span>
              ))}
            </div>
          ) : null}
          <div style={exportButtonRowStyle}>
            <button
              type="button"
              onClick={() => void downloadExportArtifact(fullPackageArtifact, exports)}
              style={{ ...orchardButtonStyle(), cursor: "pointer", fontWeight: 700 }}
            >
              Download Package ZIP
            </button>
          </div>
        </div>
      ) : null}

      <div style={exportArtifactGridStyle}>
        {sectionArtifacts.map((artifact) => (
          <div key={`${artifact.kind}-${artifact.fileName}`} style={exportArtifactCardStyle}>
            <div style={orchardMetaRowStyle}>
              <span style={orchardTagStyle("neutral")}>{getArtifactFormatLabel(artifact)}</span>
              <span style={orchardTagStyle("honey")}>{getArtifactKindLabel(artifact)}</span>
            </div>
            <div style={{ fontWeight: 700 }}>{artifact.label}</div>
            <div style={exportMetaListStyle}>
              <div><strong>Filename:</strong> {artifact.fileName}</div>
              <div>{getArtifactDescription(artifact)}</div>
            </div>
            {artifact.content ? (
              <div style={exportButtonRowStyle}>
                <button
                  type="button"
                  onClick={() => void downloadExportArtifact(artifact, exports)}
                  style={{ ...orchardButtonStyle({ subtle: true }), cursor: "pointer", fontWeight: 600 }}
                >
                  {getArtifactButtonLabel(artifact)}
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
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
  const missingAreaPrompts = planningIdeas.missingAreaPrompts ?? []
  const componentCoverage = planningIdeas.componentCoverage ?? []

  return (
    <div style={sectionStyle}>
      <h3 style={sectionHeadingStyle}>Teacher Decisions</h3>
      <p style={sectionLeadStyle}>Only the lesson parts that still need a teacher choice are shown here.</p>

      {missingAreaPrompts.length > 0 ? (
        <div style={{ display: "grid", gap: 12 }}>
          {missingAreaPrompts.map((prompt, index) => {
            const currentChoice = decisions[prompt.component] ?? "undecided"
            const coverage = componentCoverage.find((entry) => entry.component === prompt.component)
            const sourceStatus = coverage?.sourceCoverage?.status ?? coverage?.status ?? "missing"
            const generatedStatus = coverage?.generatedCoverage?.status ?? "missing"

            return (
              <div key={`${prompt.component}-${index}`} style={signalCardStyle(prompt.importance === "high" ? "warn" : "neutral")}>
                <div style={{ fontWeight: 700, textTransform: "capitalize" }}>
                  {prompt.component.replace(/_/g, " ")}
                </div>
                <div style={{ marginTop: 4 }}>{prompt.prompt}</div>
                <div style={{ marginTop: 8, fontSize: 13, color: "var(--text-secondary)" }}>
                  <strong>Current source coverage:</strong> {sourceStatus}
                </div>
                {generatedStatus !== "missing" ? (
                  <div style={{ marginTop: 4, fontSize: 13, color: "var(--text-secondary)" }}>
                    <strong>Package can generate if added:</strong> {generatedStatus}
                  </div>
                ) : null}
                <div style={{ marginTop: 4, fontSize: 13, color: "var(--text-secondary)" }}>{prompt.rationale}</div>
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
                <div style={{ marginTop: 8, fontSize: 13 }}><strong>Current decision:</strong> {formatDecisionChoice(currentChoice)}</div>
                <div style={{ marginTop: 4, fontSize: 13, color: "var(--text-secondary)" }}>
                  This teacher decision stays in the package until you change it.
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ color: "var(--text-secondary)" }}>No extra teacher decisions are needed for this lesson.</div>
      )}
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
    <details style={{ ...sectionStyle, marginTop: "var(--space-md)" }}>
      <summary style={summaryStyle}>Lesson Sources and Planning Notes</summary>
      <div style={detailsSectionGridStyle}>
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
        <AiConstructionSection lessonTrace={lessonTrace} />
        <TraceabilitySection blueprint={blueprint} lessonPackage={lessonPackage} materials={materials} lessonTrace={lessonTrace} />
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
  lessonTrace,
}: {
  blueprint: LessonBlueprint
  lessonPackage: LessonPackage
  materials: MaterialFile[]
  lessonTrace: LessonPipelineTrace | null
}) {
  const contentSourceLabel =
    blueprint.sourceReadiness.curriculumSupport === "strong"
      ? blueprint.sourceReadiness.selectedCurriculumMaterialIds.length > 1
        ? "Curriculum materials strongly influenced the lesson content. The strongest curriculum source led content grounding, with secondary curriculum support threaded in where useful."
        : "A curriculum material strongly influenced the lesson content."
      : "Curriculum support is limited, so some content may have been completed from teacher directions."

  const structureSourceLabel =
    blueprint.sourceReadiness.exemplarSupport === "strong"
      ? "Exemplar materials strongly influenced pacing, flow, and teacher-facing structure."
      : "Exemplar support is limited, so structure may rely on added lesson organization."

  const packageConfidenceLabel =
    lessonPackage.readiness.contentFit === "grounded"
      ? "The package appears grounded in the available source materials."
      : "The package appears partially grounded and may include more added lesson details."

  const fallbackUsageLabel = getFallbackUsageLabel(blueprint, lessonPackage)
  const combinedWarnings = [...blueprint.sourceReadiness.warnings, ...lessonPackage.readiness.warnings]
  const selectedContentSourceNames = getSelectedMaterialNames(
    materials,
    blueprint.sourceReadiness.selectedCurriculumMaterialIds
  )
  const resolvedContentSourceSummary = summarizeResolvedContentSource(
    selectedContentSourceNames,
    blueprint
  )
  const selectedStructureSourceNames = getSelectedMaterialNames(
    materials,
    blueprint.sourceReadiness.selectedExemplarMaterialIds
  )
  const selectedExemplarInfluenceSummary = summarizeSelectedExemplarInfluence(
    materials,
    blueprint.sourceReadiness.selectedExemplarMaterialIds
  )
  const selectedExemplarTargetSummary = summarizeSelectedExemplarTargets(
    materials,
    blueprint.sourceReadiness.selectedExemplarMaterialIds
  )
  const exemplarPayoffSummary = summarizeExemplarPayoff(blueprint)
  const contentGroundingSummary = summarizeContentGrounding(blueprint)
  const structureImpactSummary = summarizeStructureImpact(blueprint)
  const addedLessonSummary = getAddedLessonSummary(lessonTrace, fallbackUsageLabel)
  const addedLessonReviewLabel = getAddedLessonReviewLabel(lessonTrace)
  const requestedButMissingLabel = joinOrFallback(
    lessonTrace?.aiConstruction?.requestedButMissing ?? [],
    "No lesson parts are currently flagged as missing."
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
      <summary style={summaryStyle}>How materials shaped this lesson</summary>
      <div style={detailsSectionGridStyle}>
        <div style={subCardStyle}>
          <div style={subHeadingStyle}>What came from curriculum materials</div>
          <div style={{ color: "var(--text-secondary)", marginBottom: 8 }}>{contentSourceLabel}</div>
          <div style={denseKeyValueStyle}>
            <div><strong>Content from curriculum:</strong> {resolvedContentSourceSummary}</div>
            <div><strong>Standards used:</strong> {joinOrFallback(getNormalizedBlueprintValues(blueprint, "standard"), "No grounded standard identified yet")}</div>
            <div><strong>Vocabulary used:</strong> {joinOrFallback(getNormalizedBlueprintValues(blueprint, "vocabulary"), "No grounded vocabulary surfaced yet")}</div>
            <div><strong>Text or topic used:</strong> {joinOrFallback(getNormalizedBlueprintValues(blueprint, "text"), "No grounded text or topic surfaced yet")}</div>
            <div><strong>Practice used:</strong> {joinOrFallback(getNormalizedBlueprintValues(blueprint, "practice"), "No grounded practice task surfaced yet")}</div>
            <div><strong>What came from curriculum materials:</strong> {contentGroundingSummary}</div>
            <div><strong>Materials used carefully or not used:</strong> {joinOrFallback(cautionOrBlockedSummary, "None")}</div>
          </div>
          <div style={{ color: "var(--text-secondary)", marginTop: 8 }}>
            This shows the lesson content the package pulled forward from curriculum materials.
          </div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>What came from exemplar materials</div>
          <div style={{ color: "var(--text-secondary)", marginBottom: 8 }}>{structureSourceLabel}</div>
          <div style={denseKeyValueStyle}>
            <div><strong>Structure from exemplars:</strong> {joinOrFallback(selectedStructureSourceNames, "No selected exemplar source")}</div>
            <div><strong>Exemplar style choice:</strong> {selectedExemplarInfluenceSummary}</div>
            <div><strong>Where exemplars apply:</strong> {joinOrFallback(selectedExemplarTargetSummary, "Whole package structure")}</div>
            <div><strong>Lesson flow:</strong> {joinOrFallback(blueprint.structure.lessonSegments, "Default lesson flow")}</div>
            <div><strong>Pacing:</strong> {joinOrFallback(blueprint.structure.timing, "Default pacing")}</div>
            <div><strong>Teacher moves:</strong> {joinOrFallback(blueprint.structure.teacherMoves, "Teacher model and guided support")}</div>
            <div><strong>Lesson direction:</strong> {joinOrFallback(blueprint.structure.promptStyle, "Teacher direction")}</div>
            <div><strong>What came from exemplar materials:</strong> {structureImpactSummary}</div>
          </div>
          {exemplarPayoffSummary ? (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{exemplarPayoffSummary.title}</div>
              <div style={denseKeyValueStyle}>
                {exemplarPayoffSummary.lines.map((line) => (
                  <div key={line.label}><strong>{line.label}:</strong> {line.value}</div>
                ))}
              </div>
              {exemplarPayoffSummary.note ? (
                <div style={{ color: "var(--text-secondary)", marginTop: 6 }}>{exemplarPayoffSummary.note}</div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>What was added to complete the lesson</div>
          <div style={{ color: "var(--text-secondary)", marginBottom: 8 }}>{packageConfidenceLabel}</div>
          <div style={denseKeyValueStyle}>
            <div><strong>Added where materials were limited:</strong> {addedLessonSummary}</div>
            <div><strong>Review these added details before teaching:</strong> {addedLessonReviewLabel}</div>
            <div><strong>Still missing:</strong> {requestedButMissingLabel}</div>
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
          <div style={subHeadingStyle}>Review notes and added details</div>
          {combinedWarnings.length > 0 ? (
            <div style={{ display: "grid", gap: 8 }}>
              {combinedWarnings.map((warning) => <div key={warning} style={warningStyle}>{warning}</div>)}
            </div>
          ) : (
            <div style={{ color: "var(--text-secondary)" }}>
              No major lesson or package warnings were triggered for this lesson.
            </div>
          )}
        </div>
      </div>
    </details>
  )
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
                  {item.reasons.slice(0, 3).map((reason) => <div key={reason} style={warningStyle}>{reason}</div>)}
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

function decisionBadgeStyle(outcome: ReliabilityOutcome): React.CSSProperties {
  if (outcome === "used") return orchardStatusBadgeStyle("moss")
  if (outcome === "down-ranked") return orchardStatusBadgeStyle("honey")
  if (outcome === "blocked") return orchardStatusBadgeStyle("cranberry")
  return orchardStatusBadgeStyle("neutral")
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
      {warnings.length > 0 ? (
        <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
          {warnings.map((warning) => <div key={warning} style={warningStyle}>{warning}</div>)}
        </div>
      ) : null}
    </div>
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

function BlueprintDetailsSection({ blueprint }: { blueprint: LessonBlueprint }) {
  return (
    <>
      <details style={sectionStyle}>
        <summary style={summaryStyle}>Lesson Content</summary>
        <div style={{ marginTop: 12, color: "var(--text-secondary)" }}>
          <p style={{ marginBottom: 8 }}><strong>Vocabulary:</strong> {joinOrFallback(getNormalizedBlueprintValues(blueprint, "vocabulary"), "None")}</p>
          <p style={{ marginBottom: 8 }}><strong>Texts:</strong> {joinOrFallback(getNormalizedBlueprintValues(blueprint, "text"), "None")}</p>
          <p style={{ margin: 0 }}><strong>Practice Ideas:</strong> {joinOrFallback(getNormalizedBlueprintValues(blueprint, "practice"), "None")}</p>
        </div>
      </details>

      <details style={sectionStyle}>
        <summary style={summaryStyle}>Lesson Structure</summary>
        <div style={{ marginTop: 12, color: "var(--text-secondary)" }}>
          <p style={{ marginBottom: 8 }}><strong>Timing:</strong> {blueprint.structure.timing.join(" | ")}</p>
          <p style={{ marginBottom: 8 }}><strong>Segments:</strong> {blueprint.structure.lessonSegments.join(" -> ")}</p>
          <p style={{ marginBottom: 8 }}><strong>Teacher Moves:</strong> {blueprint.structure.teacherMoves.join(", ")}</p>
          <p style={{ marginBottom: 8 }}><strong>Lesson Direction:</strong> {blueprint.structure.promptStyle.join(", ")}</p>
          <p style={{ margin: 0 }}><strong>Tone:</strong> {blueprint.structure.tone.join(", ")}</p>
        </div>
      </details>
    </>
  )
}

function SlidePlanList({ slides }: { slides: SlidePlan[] }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {slides.map((slide, index) => (
        <div key={`${slide.shellLabel}-${index}`} style={subCardStyle}>
          <p style={{ margin: "0 0 6px 0" }}>
            <strong>{formatSlidePreviewItem(slide.shellLabel)}</strong>
          </p>
          <p style={{ margin: "0 0 6px 0" }}><strong>Action:</strong> {slide.action}</p>
          <p style={{ margin: "0 0 6px 0" }}><strong>Purpose:</strong> {slide.purpose}</p>
          <p style={{ margin: 0 }}><strong>Notes:</strong> {slide.notes}</p>
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
          <p style={{ margin: "0 0 6px 0" }}><strong>{idea.title}</strong></p>
          <p style={{ margin: "0 0 6px 0" }}>{idea.description}</p>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}><strong>Why:</strong> {idea.rationale}</p>
        </div>
      ))}
    </div>
  )
}

export function PipelineTraceSection({ trace }: { trace: LessonPipelineTrace }) {
  return (
    <details style={sectionStyle}>
      <summary style={summaryStyle}>How this lesson was assembled</summary>
      <div style={detailsSectionGridStyle}>
        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Mode and Material Counts</div>
          <div style={denseKeyValueStyle}>
            <div><strong>Lesson Area Mode:</strong> {trace.selectedMode === "full" ? "Multiple lesson areas" : "Single lesson area"}</div>
            <div><strong>Total Materials:</strong> {trace.materialCounts.total}</div>
            <div><strong>Curriculum Materials:</strong> {trace.materialCounts.curriculum}</div>
            <div><strong>Exemplar Materials:</strong> {trace.materialCounts.exemplar}</div>
          </div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Selected lesson sources</div>
          <div style={denseKeyValueStyle}>
            <div><strong>Curriculum:</strong> {joinOrFallback(trace.selectedSources.curriculumMaterialIds, "None selected")}</div>
            <div><strong>Exemplar:</strong> {joinOrFallback(trace.selectedSources.exemplarMaterialIds, "None selected")}</div>
          </div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Lesson focus summary</div>
          <div style={denseKeyValueStyle}>
            <div><strong>Primary Lesson Area:</strong> {trace.target.primary}</div>
            <div><strong>Additional Lesson Area:</strong> {trace.target.secondary ?? "None"}</div>
            <div><strong>Multiple Lesson Areas:</strong> {trace.target.isMixedTarget ? "Yes" : "No"}</div>
            <div><strong>Recommended Area Mode:</strong> {trace.target.recommendedMode === "full" ? "Multiple lesson areas" : "Single lesson area"}</div>
          </div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Package Summary</div>
          <div style={denseKeyValueStyle}>
            <div><strong>Density:</strong> {trace.package.density}</div>
            <div><strong>Lesson Area Shape:</strong> {trace.package.lessonShape === "mixed" ? "Multiple lesson areas" : "Single lesson area"}</div>
            <div><strong>Content Fit:</strong> {trace.package.contentFit}</div>
            <div><strong>Package Warning Count:</strong> {trace.package.warningCount}</div>
          </div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Warnings and missing lesson parts</div>
          <div style={{ display: "grid", gap: 6, marginBottom: 8 }}>
            <div><strong>Missing lesson parts flagged:</strong> {joinOrFallback(trace.missingAreaPromptComponents, "None")}</div>
          </div>
          {trace.blueprintWarnings.length > 0 ? (
            <div style={{ display: "grid", gap: 8 }}>
              {trace.blueprintWarnings.map((warning) => <div key={warning} style={warningStyle}>{warning}</div>)}
            </div>
          ) : (
            <div style={{ color: "var(--text-secondary)" }}>No lesson assembly warnings were recorded.</div>
          )}
        </div>
      </div>
    </details>
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
        ...(active ? orchardButtonStyle({ active: true }) : orchardButtonStyle({ subtle: true })),
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        fontSize: 12,
        fontWeight: 700,
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
      <OrchardPageHeader label="Lesson Package" title={title}>
        <p style={introStyle}>{message}</p>
        <div style={{ ...noticeStyle, marginTop: "var(--space-sm)" }}>{details}</div>
      </OrchardPageHeader>
      <div style={actionsStyle}>
        <Link to={linkTo} style={linkStyle}>{linkLabel}</Link>
      </div>
    </div>
  )
}

function signalCardStyle(tone: "good" | "warn" | "neutral"): React.CSSProperties {
  if (tone === "good") {
    return {
      ...signalCardBaseStyle,
      background: "rgba(110, 139, 107, 0.14)",
      border: "1px solid var(--border-moss)",
      color: "var(--deep-orchard)",
    }
  }

  if (tone === "warn") {
    return {
      ...signalCardBaseStyle,
      background: "rgba(242, 192, 120, 0.20)",
      border: "1px solid var(--border-honey)",
      color: "var(--warm-brown)",
    }
  }

  return {
    ...signalCardBaseStyle,
    color: "var(--text-secondary)",
  }
}

function formatPlanningComponentLabel(component: PlanningComponentKey): string {
  return component
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function formatDecisionChoice(choice: MissingAreaDecisionChoice): string {
  if (choice === "add") return "Add it"
  if (choice === "leave_out") return "Leave it out"
  return "Decide later"
}

function getFallbackUsageLabel(blueprint: LessonBlueprint, lessonPackage: LessonPackage): string {
  const hasLimitedCurriculum = blueprint.sourceReadiness.curriculumSupport === "limited"
  const hasLimitedExemplar = blueprint.sourceReadiness.exemplarSupport === "limited"
  const hasLimitedContentFit = lessonPackage.readiness.contentFit === "limited"

  if (hasLimitedContentFit && hasLimitedCurriculum && hasLimitedExemplar) {
    return "Much of this lesson was completed where materials were limited."
  }

  if (hasLimitedContentFit || hasLimitedCurriculum || hasLimitedExemplar) {
    return "Some lesson details were completed where materials were limited."
  }

  return "Very little had to be added beyond your materials."
}

function getAddedLessonSummary(
  lessonTrace: LessonPipelineTrace | null,
  fallbackUsageLabel: string
): string {
  const aiTrace = lessonTrace?.aiConstruction

  if (!aiTrace?.applied) {
    return fallbackUsageLabel
  }

  if (aiTrace.inferredContentLabels.length > 0) {
    return aiTrace.inferredContentLabels.join(", ")
  }

  return fallbackUsageLabel
}

function getAddedLessonReviewLabel(lessonTrace: LessonPipelineTrace | null): string {
  const aiTrace = lessonTrace?.aiConstruction

  if (!aiTrace?.applied) {
    return "No extra review is flagged right now."
  }

  const reviewCount =
    aiTrace.teacherReviewItems.length +
    aiTrace.requestedButMissing.length +
    aiTrace.warnings.length

  if (reviewCount === 0) {
    return "No extra review is flagged right now."
  }

  return `${reviewCount} item${reviewCount === 1 ? "" : "s"} still need review.`
}

function joinOrFallback(items: string[], fallback: string): string {
  return items.length > 0 ? items.join(", ") : fallback
}

function countNonEmptyLines(content: string): number {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean).length
}


