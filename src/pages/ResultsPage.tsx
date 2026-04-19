import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  buildReliabilityDecisions,
  formatReliabilityDecision,
  formatReliabilityOutcome,
  getSelectedMaterialNames,
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
  summarizeContentAuthorityLead,
  summarizeContentGrounding,
  summarizeResolvedContentSource,
  summarizeSelectedExemplarInfluence,
  summarizeSelectedExemplarTargets,
  summarizeStructureImpact,
} from "./resultsPageTraceabilityHelpers"
import { getNormalizedBlueprintValues } from "../engine/shared/teacherFacingContent"
import {
  formatBlueprintCurriculumLaneLabel,
  getUnresolvedBlueprintCurriculumLanes,
} from "../engine/shared/curriculumReviewStatus"

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
}

const subCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: 14,
}

const primaryLayoutStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.55fr) minmax(300px, 0.95fr)",
  gap: "var(--space-md)",
  alignItems: "start",
}

const mainColumnStyle: React.CSSProperties = {
  display: "grid",
  gap: "var(--space-md)",
  minWidth: 0,
}

const sideColumnStyle: React.CSSProperties = {
  display: "grid",
  gap: "var(--space-md)",
  minWidth: 0,
  alignSelf: "start",
  position: "sticky",
  top: 16,
}

const sidebarCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: 14,
  display: "grid",
  gap: 10,
}

const heroGridStyle: React.CSSProperties = {
  ...orchardStatGridStyle,
  marginBottom: 12,
}

const heroCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: 14,
  display: "grid",
  gap: 8,
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
  border: "1px solid var(--border-moss)",
  background: "rgba(110, 139, 107, 0.08)",
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
  border: "1px solid var(--border-moss)",
  background: "rgba(110, 139, 107, 0.08)",
}

const exportBundleNoteStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: 14,
  lineHeight: 1.5,
}

const exportArtifactGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 10,
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
  marginBottom: 12,
}

const binderSnapshotCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: 14,
  display: "grid",
  gap: 8,
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
  marginTop: 12,
  display: "grid",
  gap: 12,
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

const signalCardBaseStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: 12,
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
        message="Results are blocked until at least one curriculum or exemplar material is usable for grounded generation."
        details="Add curriculum or exemplar materials and wait for analysis to complete. Results unlock when at least one material is ready to use."
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

  const unresolvedCurriculumLanes = getUnresolvedBlueprintCurriculumLanes(blueprint)

  return (
    <div style={pageStyle}>
      <OrchardPageHeader label="Planning Binder" title="Results">
        <p style={introStyle}>
          Teacher-facing lesson package first. Review the generated package, confirm the lesson details, and download only the files you want to use.
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
            reviewNeededLanes={unresolvedCurriculumLanes}
          />
          {unresolvedCurriculumLanes.length > 0 ? (
            <CurriculumReviewNeededSection unresolvedLanes={unresolvedCurriculumLanes} />
          ) : null}
          <PackageOutputsSection lessonPackage={lessonPackage} reviewNeededLanes={unresolvedCurriculumLanes} />
        </div>

        <div style={sideColumnStyle}>
          <ReviewFlowCard lessonPackage={lessonPackage} reviewNeededLanes={unresolvedCurriculumLanes} />
          <CoverageDecisionsSection
            planningIdeas={planningIdeas}
            decisions={missingAreaDecisions}
            onSetDecision={handleMissingAreaDecision}
            isRegenerating={isRegenerating}
          />
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

function CurriculumReviewNeededSection({
  unresolvedLanes,
}: {
  unresolvedLanes: Array<"vocabulary" | "wordLists" | "texts" | "practiceIdeas">
}) {
  return (
    <div style={sectionStyle}>
      <h3 style={sectionHeadingStyle}>Curriculum review still needed</h3>
      <p style={sectionLeadStyle}>
        The package is not export-ready yet. Confirm these lesson details on Materials before treating the outputs as classroom-ready.
      </p>
      <ul style={previewListStyle}>
        {unresolvedLanes.map((lane) => (
          <li key={lane}>{formatBlueprintCurriculumLaneLabel(lane)}</li>
        ))}
      </ul>
      <div style={smallNoteStyle}>
        Exports stay blocked until these curriculum lanes are confirmed or corrected on Materials.
      </div>
    </div>
  )
}

function ReviewFlowCard({
  lessonPackage,
  reviewNeededLanes = [],
}: {
  lessonPackage: LessonPackage
  reviewNeededLanes?: Array<"vocabulary" | "wordLists" | "texts" | "practiceIdeas">
}) {
  const visibleSections = buildVisiblePackageSectionItems(lessonPackage)
  const exports = lessonPackage.exports ?? []

  return (
    <div style={sidebarCardStyle}>
      <div style={subHeadingStyle}>Use this order</div>
      <ul style={reviewSequenceListStyle}>
        <li>Scan the package overview and grounding snapshot.</li>
        <li>Review the teacher package before downloading anything.</li>
        <li>Handle only the teacher decisions still missing from the source materials.</li>
        <li>Use exports after the package reads coherently.</li>
      </ul>
      <div style={smallNoteStyle}>
        {reviewNeededLanes.length > 0
          ? `Current package surface is held while curriculum review is still needed. Exports ready: 0.`
          : `Current package surface: ${visibleSections.length} teacher-facing section${visibleSections.length === 1 ? "" : "s"}. Exports ready: ${exports.length}.`}
      </div>
    </div>
  )
}

export function PackageSummarySection({
  blueprint,
  lessonPackage,
  selectedLessonMode,
  materials,
  reviewNeededLanes = [],
}: {
  blueprint: LessonBlueprint
  lessonPackage: LessonPackage
  selectedLessonMode: string
  materials: MaterialFile[]
  reviewNeededLanes?: Array<"vocabulary" | "wordLists" | "texts" | "practiceIdeas">
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
  const summaryStatusTone = reviewNeededLanes.length > 0 ? "honey" : getBinderReadinessTone(lessonPackage)
  const summaryStatusLabel = reviewNeededLanes.length > 0 ? "Needs teacher review" : getBinderReadinessLabel(lessonPackage)

  return (
    <div style={sectionStyle}>
      <div style={orchardSectionHeaderRowStyle}>
        <div>
          <h3 style={sectionHeadingStyle}>Teacher Package Overview</h3>
          <p style={sectionLeadStyle}>
            Confirm the lesson focus, package shape, and source authority in one scan before you move into the full package review.
          </p>
        </div>
        <span style={orchardStatusBadgeStyle(summaryStatusTone)}>
          {summaryStatusLabel}
        </span>
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
            <div><strong>Multi-area lesson:</strong> {blueprint.content.target.isMixedTarget ? "Yes" : "No"}</div>
            <div><strong>Lesson coverage:</strong> {selectedLessonMode === "full" ? "Multiple lesson areas" : "Single lesson area"}</div>
            <div><strong>Standards:</strong> {joinOrFallback(getNormalizedBlueprintValues(blueprint, "standard"), "No grounded standard identified yet")}</div>
          </div>
          <div style={smallNoteStyle}>Use this snapshot to confirm the lesson focus and standards before exporting.</div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Grounding Snapshot</div>
          <div style={denseKeyValueStyle}>
            <div><strong>Content source:</strong> {resolvedContentSourceSummary}</div>
            <div><strong>Structure source:</strong> {joinOrFallback(selectedStructureSourceNames, "No selected exemplar source")}</div>
            <div><strong>Exemplar style choice:</strong> {selectedExemplarInfluenceSummary}</div>
            <div><strong>Where exemplars apply:</strong> {joinOrFallback(selectedExemplarTargetSummary, "Whole package structure")}</div>
            <div><strong>Current lesson content uses:</strong> {contentGroundingSummary}</div>
            <div><strong>Structure came from:</strong> {structureImpactSummary}</div>
            <div><strong>Fallback use:</strong> {fallbackUsageLabel}</div>
          </div>
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

function TeacherBinderSnapshotSection({
  lessonPackage,
  reviewNeededLanes = [],
}: {
  lessonPackage: LessonPackage
  reviewNeededLanes?: Array<"vocabulary" | "wordLists" | "texts" | "practiceIdeas">
}) {
  const outputsHeld = reviewNeededLanes.length > 0
  const visiblePackageSections = outputsHeld ? [] : buildVisiblePackageSectionItems(lessonPackage)
  const exports = outputsHeld ? [] : lessonPackage.exports ?? []
  const bundledArtifactLabels = getBundledArtifactLabels(exports)
  const hasFullPackageZip = exports.some((artifact) => artifact.kind === "full_package")
  const warningCount = outputsHeld
    ? Math.max(lessonPackage.readiness.warnings.length, reviewNeededLanes.length)
    : lessonPackage.readiness.warnings.length
  const binderStatusTone = outputsHeld ? "honey" : getBinderReadinessTone(lessonPackage)
  const binderStatusLabel = outputsHeld ? "Needs teacher review" : getBinderReadinessLabel(lessonPackage)

  return (
    <div style={sectionStyle}>
      <div style={orchardSectionHeaderRowStyle}>
        <div style={{ display: "grid", gap: 8 }}>
          <h3 style={sectionHeadingStyle}>Teacher Binder Snapshot</h3>
          <p style={sectionLeadStyle}>{getTeacherBinderLeadText()}</p>
        </div>
        <span style={orchardStatusBadgeStyle(binderStatusTone)}>
          {binderStatusLabel}
        </span>
      </div>

      <div style={binderSnapshotGridStyle}>
        <div style={binderSnapshotCardStyle}>
          <div style={binderSnapshotStatLabelStyle}>Package sections</div>
          <div style={binderSnapshotStatValueStyle}>{visiblePackageSections.length}</div>
          <div style={smallNoteStyle}>{outputsHeld ? "Teacher-facing sections stay held until curriculum review is complete." : "Teacher-facing sections currently included in this package."}</div>
        </div>

        <div style={binderSnapshotCardStyle}>
          <div style={binderSnapshotStatLabelStyle}>Exports ready</div>
          <div style={binderSnapshotStatValueStyle}>{exports.length}</div>
          <div style={smallNoteStyle}>{outputsHeld ? "Exports stay blocked until Materials confirms the missing curriculum lanes." : "Package ZIP plus individual downloads when available."}</div>
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
          {outputsHeld
            ? "Exports are intentionally held while Materials review is still needed."
            : hasFullPackageZip
              ? "Use the package ZIP when you want the whole generated binder together, or use the individual downloads when you only need one file."
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
          <h3 style={sectionHeadingStyle}>AI Construction Review</h3>
          <p style={sectionLeadStyle}>
            Review what the AI grounded, what it inferred, and what still needs teacher confirmation before export.
          </p>
        </div>
        <span style={orchardStatusBadgeStyle(hasReviewNeeds ? "honey" : "moss")}>
          {`AI confidence ${confidencePercent}`}
        </span>
      </div>

      <div style={detailsSectionGridStyle}>
        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Grounded vs inferred content</div>
          <div style={smallNoteStyle}>
            Grounded items came from stronger source support. Inferred items were generated and should be reviewed more carefully.
          </div>

          <div style={{ marginTop: 10 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Grounded</div>
            {aiTrace.groundedContentLabels.length > 0 ? (
              <div style={tagRowStyle}>
                {aiTrace.groundedContentLabels.map((label) => (
                  <span key={`grounded-${label}`} style={orchardTagStyle("moss")}>
                    {label}
                  </span>
                ))}
              </div>
            ) : (
              <div style={smallNoteStyle}>No grounded AI-added content was recorded.</div>
            )}
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Inferred</div>
            {aiTrace.inferredContentLabels.length > 0 ? (
              <div style={tagRowStyle}>
                {aiTrace.inferredContentLabels.map((label) => (
                  <span key={`inferred-${label}`} style={orchardTagStyle("honey")}>
                    {label}
                  </span>
                ))}
              </div>
            ) : (
              <div style={smallNoteStyle}>No inferred AI-added content was recorded.</div>
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
            <div style={smallNoteStyle}>No AI standards suggestions were recorded.</div>
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
            <div style={smallNoteStyle}>No extra teacher review items were recorded by the AI layer.</div>
          )}
        </div>

        {aiTrace.warnings.length > 0 ? (
          <div style={subCardStyle}>
            <div style={subHeadingStyle}>AI warnings</div>
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
export function PackageOutputsSection({
  lessonPackage,
  reviewNeededLanes = [],
}: {
  lessonPackage: LessonPackage
  reviewNeededLanes?: Array<"vocabulary" | "wordLists" | "texts" | "practiceIdeas">
}) {
  const lessonPlan = lessonPackage.lessonPlan.trim()
  const slides = sanitizeListItems(lessonPackage.slides)
  const interventions = sanitizeListItems(lessonPackage.interventions)
  const centers = sanitizeListItems(lessonPackage.centers)
  const rotationPlan = lessonPackage.rotationPlan.trim()
  const teacherLedSupportLines = extractTeacherLedSupportLines(rotationPlan)
  const rotationOnly = extractRotationOnlyText(rotationPlan)
  const exports = lessonPackage.exports ?? []

  const hasVisibleOutputs =
    lessonPlan.length > 0 ||
    slides.length > 0 ||
    teacherLedSupportLines.length > 0 ||
    interventions.length > 0 ||
    centers.length > 0 ||
    rotationOnly.length > 0 ||
    exports.length > 0

  if (reviewNeededLanes.length > 0) {
    return (
      <>
        <TeacherBinderSnapshotSection lessonPackage={lessonPackage} reviewNeededLanes={reviewNeededLanes} />
        <div style={sectionStyle}>
          <h3 style={sectionHeadingStyle}>Package Outputs</h3>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>
            Teacher-facing outputs are held until Materials confirms the missing curriculum lanes. Use the review block on Materials to confirm vocabulary, word list or examples, text or topic, and practice ideas.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      {hasVisibleOutputs ? <TeacherBinderSnapshotSection lessonPackage={lessonPackage} reviewNeededLanes={reviewNeededLanes} /> : null}

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
  const visible = items.slice(0, 4)
  const hidden = items.slice(4)
  const openByDefault = title === "Slides" || title === "Teacher-Led Support"

  return (
    <div style={sectionStyle}>
      <details open={openByDefault}>
        <summary style={summaryStyle}>{title}</summary>
        <div style={detailsSectionGridStyle}>
          <div style={previewHeaderStyle}>
            <div style={subHeadingStyle}>{title}</div>
            <span style={orchardTagStyle("neutral")}>{items.length}</span>
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
      <summary style={summaryStyle}>Lesson Evidence and Planning Details</summary>
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
      <div style={detailsSectionGridStyle}>
        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Authority at a Glance</div>
          <div style={denseKeyValueStyle}>
            <div><strong>Content source:</strong> {joinOrFallback(selectedContentSourceNames, "No selected curriculum source")}</div>
            <div><strong>Structure source:</strong> {joinOrFallback(selectedStructureSourceNames, "No selected exemplar source")}</div>
            <div><strong>Lesson grounding:</strong> {packageConfidenceLabel}</div>
            <div><strong>Fallback use:</strong> {fallbackUsageLabel}</div>
            <div><strong>Materials used carefully or not used:</strong> {joinOrFallback(cautionOrBlockedSummary, "None")}</div>
          </div>
          <div style={{ color: "var(--text-secondary)", marginTop: 8 }}>
            This is the quickest summary of what shaped the lesson and where extra review may help.
          </div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Content Authority</div>
          <div style={{ color: "var(--text-secondary)", marginBottom: 8 }}>{contentSourceLabel}</div>
          <div style={denseKeyValueStyle}>
            <div><strong>Curriculum support strength:</strong> {blueprint.sourceReadiness.curriculumSupport}</div>
            <div><strong>Curriculum sources used:</strong> {joinOrFallback(selectedContentSourceNames, "No selected curriculum source")}</div>
            <div><strong>Standards used:</strong> {joinOrFallback(getNormalizedBlueprintValues(blueprint, "standard"), "No grounded standard identified yet")}</div>
            <div><strong>Vocabulary used:</strong> {joinOrFallback(getNormalizedBlueprintValues(blueprint, "vocabulary"), "Review needed on Materials")}</div>
            <div><strong>Word list or examples used:</strong> {joinOrFallback(getNormalizedBlueprintValues(blueprint, "wordList"), "Review needed on Materials")}</div>
            <div><strong>Text or topic used:</strong> {joinOrFallback(getNormalizedBlueprintValues(blueprint, "text"), "Review needed on Materials")}</div>
            <div><strong>Practice used:</strong> {joinOrFallback(getNormalizedBlueprintValues(blueprint, "practice"), "Review needed on Materials")}</div>
          </div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Presentation Authority</div>
          <div style={{ color: "var(--text-secondary)", marginBottom: 8 }}>{structureSourceLabel}</div>
          <div style={denseKeyValueStyle}>
            <div><strong>Exemplar support strength:</strong> {blueprint.sourceReadiness.exemplarSupport}</div>
            <div><strong>Exemplar sources used:</strong> {joinOrFallback(selectedStructureSourceNames, "No selected exemplar source")}</div>
            <div><strong>Exemplar style choice:</strong> {selectedExemplarInfluenceSummary}</div>
            <div><strong>Where exemplars apply:</strong> {joinOrFallback(selectedExemplarTargetSummary, "Whole package structure")}</div>
            <div><strong>Lesson flow:</strong> {joinOrFallback(blueprint.structure.lessonSegments, "Default lesson flow")}</div>
            <div><strong>Pacing:</strong> {joinOrFallback(blueprint.structure.timing, "Default pacing")}</div>
            <div><strong>Teacher moves:</strong> {joinOrFallback(blueprint.structure.teacherMoves, "Teacher model and guided support")}</div>
            <div><strong>Prompt style:</strong> {joinOrFallback(blueprint.structure.promptStyle, "Teacher prompt")}</div>
            <div><strong>Content came from:</strong> {contentGroundingSummary}</div>
            <div><strong>Structure came from:</strong> {structureImpactSummary}</div>
          </div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Package Confidence</div>
          <div style={{ color: "var(--text-secondary)", marginBottom: 8 }}>{packageConfidenceLabel}</div>
          <div style={denseKeyValueStyle}>
            <div><strong>Source balance:</strong> {blueprint.sourceReadiness.overall}</div>
            <div><strong>Coverage support:</strong> {blueprint.sourceReadiness.coverageSupport}</div>
            <div><strong>Content fit:</strong> {lessonPackage.readiness.contentFit}</div>
            <div><strong>Lesson shape:</strong> {lessonPackage.readiness.lessonShape === "mixed" ? "Multiple lesson areas" : "Single lesson area"}</div>
            <div><strong>Package density:</strong> {lessonPackage.readiness.density}</div>
            <div><strong>Fallback use:</strong> {fallbackUsageLabel}</div>
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
              {combinedWarnings.map((warning) => <div key={warning} style={warningStyle}>{warning}</div>)}
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
        <summary style={summaryStyle}>Blueprint Content</summary>
        <div style={{ marginTop: 12, color: "var(--text-secondary)" }}>
          <p style={{ marginBottom: 8 }}><strong>Vocabulary:</strong> {joinOrFallback(getNormalizedBlueprintValues(blueprint, "vocabulary"), "None")}</p>
          <p style={{ marginBottom: 8 }}><strong>Texts:</strong> {joinOrFallback(getNormalizedBlueprintValues(blueprint, "text"), "None")}</p>
          <p style={{ margin: 0 }}><strong>Practice Ideas:</strong> {joinOrFallback(getNormalizedBlueprintValues(blueprint, "practice"), "None")}</p>
        </div>
      </details>

      <details style={sectionStyle}>
        <summary style={summaryStyle}>Blueprint Structure</summary>
        <div style={{ marginTop: 12, color: "var(--text-secondary)" }}>
          <p style={{ marginBottom: 8 }}><strong>Timing:</strong> {blueprint.structure.timing.join(" | ")}</p>
          <p style={{ marginBottom: 8 }}><strong>Segments:</strong> {blueprint.structure.lessonSegments.join(" -> ")}</p>
          <p style={{ marginBottom: 8 }}><strong>Teacher Moves:</strong> {blueprint.structure.teacherMoves.join(", ")}</p>
          <p style={{ marginBottom: 8 }}><strong>Prompt Style:</strong> {blueprint.structure.promptStyle.join(", ")}</p>
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
          <p style={{ margin: "0 0 6px 0" }}><strong>{slide.shellLabel}</strong></p>
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
      <summary style={summaryStyle}>Pipeline Trace</summary>
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
          <div style={subHeadingStyle}>Selected Source IDs</div>
          <div style={denseKeyValueStyle}>
            <div><strong>Curriculum:</strong> {joinOrFallback(trace.selectedSources.curriculumMaterialIds, "None selected")}</div>
            <div><strong>Exemplar:</strong> {joinOrFallback(trace.selectedSources.exemplarMaterialIds, "None selected")}</div>
          </div>
        </div>

        <div style={subCardStyle}>
          <div style={subHeadingStyle}>Target Resolution</div>
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
          <div style={subHeadingStyle}>Warnings and Missing-Area Prompts</div>
          <div style={{ display: "grid", gap: 6, marginBottom: 8 }}>
            <div><strong>Missing-Area Prompt Components:</strong> {joinOrFallback(trace.missingAreaPromptComponents, "None")}</div>
          </div>
          {trace.blueprintWarnings.length > 0 ? (
            <div style={{ display: "grid", gap: 8 }}>
              {trace.blueprintWarnings.map((warning) => <div key={warning} style={warningStyle}>{warning}</div>)}
            </div>
          ) : (
            <div style={{ color: "var(--text-secondary)" }}>No blueprint warnings were recorded in the pipeline trace.</div>
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
      <OrchardPageHeader label="Planning Binder" title={title}>
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
    return "Heavy fallback usage likely."
  }

  if (hasLimitedContentFit || hasLimitedCurriculum || hasLimitedExemplar) {
    return "Partial fallback usage likely."
  }

  return "Minimal fallback usage likely."
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
