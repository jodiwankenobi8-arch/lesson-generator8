import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLessonStore } from "../state/useLessonStore";
import {
  getStandards,
  getSlides,
  getLessonPlan,
  getCenters,
  getRotationPlanItems,
  getInterventions,
} from "../engine/packageCompat";
import { K_ELA_BEST_DATASET } from "../engine/standards/data/k_ela_best_dataset";
import {
  ORCHARD_COLORS as COLORS,
  orchardShellStyle,
  orchardWrapStyle,
  orchardCardStyle,
  orchardHeroCardStyle,
  orchardSoftCardStyle,
  orchardPillStyle,
  orchardSectionTitleStyle,
  orchardHelpTextStyle,
  orchardPrimaryButtonStyle,
  orchardSecondaryButtonStyle,
  orchardLinkStyle,
  orchardRibbonHeaderStyle,
  orchardHeroTitleStyle,
  orchardStitchDividerStyle,
} from "./orchardUi";
import { WizardProgress } from "./WizardProgress";
import { ResultsTraceSummaryCard } from "../components/ResultsTraceSummaryCard";
import type { LessonPackage as CanonicalLessonPackage } from "../types/lesson-package";
import {
  getCanonicalMaterialInfluenceRows,
  getCanonicalStandardVisibilityRows,
  summarizeStandardsSource,
} from "../utils/canonical-trace-selectors";

function percent(conf: any) {
  const n = Number(conf);
  if (!Number.isFinite(n)) return "";
  return `${Math.round(n <= 1 ? n * 100 : n)}%`;
}

function short(text: any, max = 220) {
  const t = String(text ?? "").replace(/\s+/g, " ").trim();
  if (!t) return "(Summary not available)";
  return t.length > max ? t.slice(0, max - 3) + "..." : t;
}

function normCode(v: any) {
  return String(v ?? "").trim().toUpperCase();
}

function findLabelByCode(codeRaw: any) {
  const code = normCode(codeRaw);
  if (!code) return "";
  const found = (K_ELA_BEST_DATASET as any[]).find((s) => normCode(s?.code) === code);
  return String(found?.label ?? found?.description ?? "");
}

function readBlueprint() {
  try {
    const raw = localStorage.getItem("lessonBlueprintV1");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function Section({
  title,
  subtitle,
  defaultOpen,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={!!defaultOpen} style={orchardCardStyle()}>
      <summary style={{ cursor: "pointer", listStyle: "none" }}>
        <div style={orchardRibbonHeaderStyle()}>{title}</div>
        <div style={orchardStitchDividerStyle()} />
        {subtitle && (
          <div style={{ ...orchardHelpTextStyle(), marginTop: 6, marginBottom: 2 }}>
            {subtitle}
          </div>
        )}
      </summary>
      <div style={{ paddingTop: 14 }}>{children}</div>
    </details>
  );
}

function SnapshotChip({
  label,
  value,
  background,
  border,
}: {
  label: string;
  value: string | number;
  background: string;
  border: string;
}) {
  return (
    <div style={orchardPillStyle(background, border)}>
      {label}: {value}
    </div>
  );
}

function CanonicalInfluenceSnapshot({
  canonicalPackage,
  canonicalMaterialRows,
  canonicalBlueprintInfluenceCount,
  canonicalGenerationInfluenceCount,
  canonicalWarningCount,
  canonicalStandardsSource,
}: {
  canonicalPackage: CanonicalLessonPackage | null;
  canonicalMaterialRows: Array<{
    id: string;
    name: string;
    sourceKind: string;
    confidence: unknown;
    influencedBlueprint: boolean;
    influencedGeneration: boolean;
    warningCount: number;
  }>;
  canonicalBlueprintInfluenceCount: number;
  canonicalGenerationInfluenceCount: number;
  canonicalWarningCount: number;
  canonicalStandardsSource: string;
}) {
  if (!canonicalPackage) return null;

  return (
    <div
      style={{
        ...orchardSoftCardStyle(),
        marginBottom: 14,
        background: "linear-gradient(135deg, #F8FBF7 0%, #F2F8FF 100%)",
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 18, color: COLORS.heading, marginBottom: 8 }}>
        Canonical Influence Snapshot
      </div>
      <div style={{ ...orchardHelpTextStyle() }}>
        Shared canonical material and trace selectors are now feeding the Results Hub visibility path.
      </div>

      <div style={{ marginTop: 12 }}>
        <SnapshotChip label="Canonical materials" value={canonicalMaterialRows.length} background="#EEF5EA" border="#BFD6B8" />
        <SnapshotChip label="Blueprint influence" value={canonicalBlueprintInfluenceCount} background="#F2F8FF" border="#C9DAEE" />
        <SnapshotChip label="Generation influence" value={canonicalGenerationInfluenceCount} background="#FFF6E8" border={COLORS.warnBorder} />
        <SnapshotChip label="Standards source" value={canonicalStandardsSource} background="#F4EDF8" border="#D7C6E4" />
      </div>

      {canonicalWarningCount > 0 && (
        <div style={{ ...orchardHelpTextStyle(), marginTop: 10 }}>
          Captured extraction warnings across canonical materials: {canonicalWarningCount}
        </div>
      )}
    </div>
  );
}

function BlueprintInsights({
  canonicalPackage,
}: {
  canonicalPackage: CanonicalLessonPackage | null;
}) {
  const bp = useMemo(() => readBlueprint(), []);
  const canonicalMaterialRows = useMemo(
    () => (canonicalPackage ? getCanonicalMaterialInfluenceRows(canonicalPackage) : []),
    [canonicalPackage]
  );
  const canonicalStandardsSource = useMemo(
    () => (canonicalPackage ? summarizeStandardsSource(canonicalPackage.trace?.standardsSource) : "unknown"),
    [canonicalPackage]
  );
  const canonicalBlueprintInfluenceCount = canonicalMaterialRows.filter((row) => row.influencedBlueprint).length;
  const canonicalGenerationInfluenceCount = canonicalMaterialRows.filter((row) => row.influencedGeneration).length;
  const canonicalWarningCount = canonicalMaterialRows.reduce((sum, row) => sum + row.warningCount, 0);
  if (!bp) {
    return (
      <div style={{ display: "grid", gap: 14 }}>
        <CanonicalInfluenceSnapshot
          canonicalPackage={canonicalPackage}
          canonicalMaterialRows={canonicalMaterialRows}
          canonicalBlueprintInfluenceCount={canonicalBlueprintInfluenceCount}
          canonicalGenerationInfluenceCount={canonicalGenerationInfluenceCount}
          canonicalWarningCount={canonicalWarningCount}
          canonicalStandardsSource={canonicalStandardsSource}
        />

        <div style={{ opacity: 0.8, color: COLORS.muted }}>
          No saved Blueprint found for this package yet.
        </div>
      </div>
    );
  }

  const frameworkApplied = bp?.synthesis?.frameworkApplied || "linear";
  const detectedFramework = bp?.exemplar?.frameworkDetection?.framework || "unknown";
  const detectedConfidence = Math.round((bp?.exemplar?.frameworkDetection?.confidence || 0) * 100);
  const curriculumFiles = (bp?.curriculum?.files || []).map((f: any) => f?.name).filter(Boolean);
  const exemplarFiles = (bp?.exemplar?.files || []).map((f: any) => f?.name).filter(Boolean);
  const curriculumItems = (bp?.curriculum?.coverageChecklist || []).map((item: any) => item?.title).filter(Boolean).slice(0, 5);
  const cueItems = (bp?.exemplar?.presenterCues || []).map((cue: any) => cue?.rawText).filter(Boolean).slice(0, 5);
  const plannedSlides = (bp?.synthesis?.slides || []).map((slide: any) => slide?.title).filter(Boolean).slice(0, 9);
  const synthesisNotes = String(bp?.synthesis?.notes || "").trim();

  return (
    <div>
      <CanonicalInfluenceSnapshot
        canonicalPackage={canonicalPackage}
        canonicalMaterialRows={canonicalMaterialRows}
        canonicalBlueprintInfluenceCount={canonicalBlueprintInfluenceCount}
        canonicalGenerationInfluenceCount={canonicalGenerationInfluenceCount}
        canonicalWarningCount={canonicalWarningCount}
        canonicalStandardsSource={canonicalStandardsSource}
      />

      <div
        style={{
          ...orchardSoftCardStyle(),
          marginBottom: 14,
          background: "linear-gradient(135deg, #FFF8EF 0%, #F8F1E6 100%)",
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 18, color: COLORS.heading, marginBottom: 8 }}>
          Blueprint Influence Summary
        </div>
        <div style={{ ...orchardHelpTextStyle() }}>
          This explains what the system used from your lesson plan, uploaded curriculum, and exemplar cues to shape the lesson package.
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <SnapshotChip label="Applied framework" value={frameworkApplied} background="#EEF5EA" border="#BFD6B8" />
        <SnapshotChip label="Curriculum items" value={curriculumItems.length} background="#F2F8FF" border="#C9DAEE" />
        <SnapshotChip label="Presenter cues" value={cueItems.length} background="#FFF6E8" border={COLORS.warnBorder} />
        <SnapshotChip label="Planned slides" value={plannedSlides.length} background="#F4EDF8" border="#D7C6E4" />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div style={{ ...orchardSoftCardStyle("#F2F8FF"), border: "1px solid #C9DAEE" }}>
          <div style={{ fontWeight: 800, marginBottom: 6, color: COLORS.heading }}>Framework</div>
          <div style={{ fontSize: 14, marginBottom: 4 }}><b>Applied:</b> {frameworkApplied}</div>
          <div style={{ fontSize: 14 }}>
            <b>Detected exemplar pattern:</b> {detectedFramework} ({detectedConfidence}%)
          </div>
        </div>

        <div style={{ ...orchardSoftCardStyle("#EEF5EA"), border: "1px solid #BFD6B8" }}>
          <div style={{ fontWeight: 800, marginBottom: 6, color: COLORS.heading }}>Curriculum Used</div>
          {curriculumItems.length ? (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {curriculumItems.map((item: string, i: number) => (
                <li key={item + i} style={{ marginBottom: 4 }}>{item}</li>
              ))}
            </ul>
          ) : (
            <div style={{ opacity: 0.8, color: COLORS.muted }}>No curriculum checklist items found.</div>
          )}
        </div>

        <div style={{ ...orchardSoftCardStyle("#FFF6E8"), border: `1px solid ${COLORS.warnBorder}` }}>
          <div style={{ fontWeight: 800, marginBottom: 6, color: COLORS.heading }}>Exemplar Cues Used</div>
          {cueItems.length ? (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {cueItems.map((item: string, i: number) => (
                <li key={item + i} style={{ marginBottom: 4 }}>{short(item, 90)}</li>
              ))}
            </ul>
          ) : (
            <div style={{ opacity: 0.8, color: COLORS.muted }}>No presenter cues found.</div>
          )}
        </div>
      </div>

      <div style={{ ...orchardSoftCardStyle(), marginBottom: 14 }}>
        <div style={{ fontWeight: 800, marginBottom: 8, color: COLORS.heading }}>Why this lesson changed</div>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.55 }}>
          <li style={{ marginBottom: 6 }}>
            {frameworkApplied === "clickableHub"
              ? "The package is using a clickable-hub structure because an exemplar was present and the blueprint applied that framework."
              : frameworkApplied === "guidepost"
                ? "The package is using a guidepost-style structure because the blueprint detected and applied that framework."
                : "The package is using the default linear structure because no non-linear framework was applied."}
          </li>
          <li style={{ marginBottom: 6 }}>
            {curriculumItems.length
              ? "Curriculum titles are shaping teacher plan language, slide bullets, and center directions."
              : "No curriculum checklist items were available, so wording falls back to default lesson language."}
          </li>
          <li>
            {cueItems.length
              ? "Presenter cues from the exemplar are influencing notes, transitions, and rotation wording."
              : "No exemplar presenter cues were available, so teacher cueing stays simple."}
          </li>
        </ul>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div style={orchardSoftCardStyle()}>
          <div style={{ fontWeight: 800, marginBottom: 6, color: COLORS.heading }}>Source Files</div>
          <div style={{ fontSize: 14, marginBottom: 6 }}>
            <b>Curriculum files:</b> {curriculumFiles.join(", ") || "none"}
          </div>
          <div style={{ fontSize: 14 }}>
            <b>Exemplar files:</b> {exemplarFiles.join(", ") || "none"}
          </div>
        </div>

        <div style={orchardSoftCardStyle()}>
          <div style={{ fontWeight: 800, marginBottom: 6, color: COLORS.heading }}>Planned Slide Skeleton</div>
          {plannedSlides.length ? (
            <ol style={{ margin: 0, paddingLeft: 18 }}>
              {plannedSlides.map((title: string, i: number) => (
                <li key={title + i} style={{ marginBottom: 4 }}>{title}</li>
              ))}
            </ol>
          ) : (
            <div style={{ opacity: 0.8, color: COLORS.muted }}>No planned slides found in the blueprint.</div>
          )}
        </div>
      </div>

      {synthesisNotes && (
        <div style={orchardSoftCardStyle()}>
          <div style={{ fontWeight: 800, marginBottom: 6, color: COLORS.heading }}>Blueprint Notes</div>
          <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{synthesisNotes}</div>
        </div>
      )}

      <details style={{ marginTop: 14 }}>
        <summary style={{ cursor: "pointer", color: COLORS.accentDark, fontWeight: 700 }}>
          View raw Blueprint JSON
        </summary>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontSize: 12,
            background: "#FBF8F2",
            border: `1px solid ${COLORS.borderSoft}`,
            padding: 12,
            borderRadius: 14,
            overflow: "auto",
            marginTop: 10,
          }}
        >
          {JSON.stringify(bp, null, 2)}
        </pre>
      </details>
    </div>
  );
}

function SlidePreviewCard({
  slide,
  index,
  compact,
}: {
  slide: any;
  index: number;
  compact: boolean;
}) {
  const bullets = Array.isArray(slide?.bullets) ? slide.bullets.filter(Boolean) : [];
  const bodyText = slide?.text || slide?.body || "";
  const visibleBullets = compact ? bullets.slice(0, 3) : bullets;
  const hasTrimmedBullets = compact && bullets.length > 3;

  return (
    <div
      style={{
        background: "#FFFDF9",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 8px 18px rgba(73, 52, 33, 0.06)",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #6E8B5E 0%, #4E6542 100%)",
          color: "#fff",
          padding: compact ? "10px 12px" : "12px 14px",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 800, opacity: 0.9, marginBottom: 4 }}>
          Slide {index + 1}
        </div>
        <div style={{ fontSize: compact ? 16 : 18, fontWeight: 800, lineHeight: 1.2 }}>
          {slide?.title ?? slide?.heading ?? `Slide ${index + 1}`}
        </div>
      </div>

      <div style={{ padding: compact ? 12 : 16 }}>
        {visibleBullets.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: compact ? 1.45 : 1.6 }}>
            {visibleBullets.map((b: any, idx: number) => (
              <li key={idx} style={{ marginBottom: compact ? 4 : 6 }}>
                {String(b)}
              </li>
            ))}
          </ul>
        ) : bodyText ? (
          <div style={{ whiteSpace: "pre-wrap", lineHeight: compact ? 1.45 : 1.6 }}>
            {compact ? short(bodyText, 180) : String(bodyText)}
          </div>
        ) : (
          <div style={{ color: COLORS.muted, fontStyle: "italic" }}>
            No preview text on this slide yet.
          </div>
        )}

        {hasTrimmedBullets && (
          <div style={{ marginTop: 8, fontSize: 12, color: COLORS.muted }}>
            + {bullets.length - 3} more bullets
          </div>
        )}

        {slide?.teacherNotes && (
          <div
            style={{
              marginTop: 14,
              paddingTop: 12,
              borderTop: `1px solid ${COLORS.borderSoft}`,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: COLORS.accentDark,
                marginBottom: 4,
              }}
            >
              Teacher note
            </div>
            <div style={{ color: COLORS.muted, lineHeight: 1.5, fontSize: 14 }}>
              {compact ? short(String(slide.teacherNotes), 120) : String(slide.teacherNotes)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultsHubPage() {
  const canonicalPackage = useLessonStore((state) => state.canonicalPackage);
  const pkg = useLessonStore((s) => s.package);

  const [busy, setBusy] = useState<null | "pptx" | "docx" | "zip">(null);
  const [err, setErr] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<"teaching" | "compact">("teaching");

  if (!pkg) {
    return (
      <div style={orchardShellStyle()}>
        <div style={orchardWrapStyle()}>
          <WizardProgress current="results" />
          <div style={orchardCardStyle()}>
            <h1 style={{ marginTop: 0, marginBottom: 10, color: COLORS.heading }}>Results Hub</h1>
            <p style={{ opacity: 0.9, color: COLORS.muted }}>
              No generated lesson found yet. Go back and run the flow again.
            </p>
            <Link to="/" style={orchardLinkStyle()}>
              Back to Inputs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const lessonTitle = (pkg as any)?.input?.lessonTitle ?? "Generated Lesson";
  const rawStandards = useMemo(() => getStandards(pkg as any), [pkg]);
  const canonicalStandardRows = useMemo(
    () => (canonicalPackage ? getCanonicalStandardVisibilityRows(canonicalPackage) : []),
    [canonicalPackage]
  );
  const fallbackStandards = useMemo(
    () =>
      (rawStandards || []).map((s: any) => ({
        code: s?.code ?? "",
        description: findLabelByCode(s?.code),
        source: String(s?.source ?? "detected"),
        confidence: s?.confidence,
      })),
    [rawStandards]
  );
  const visibleStandards = canonicalStandardRows.length > 0 ? canonicalStandardRows : fallbackStandards;
  const standardsSourceText = canonicalPackage
    ? summarizeStandardsSource(canonicalPackage.trace?.standardsSource)
    : visibleStandards.length > 0
      ? "engine package fallback"
      : "unknown";

  const primaryStandard = visibleStandards[0];
  const supportingStandards = visibleStandards.slice(1, 4);

  const slides = useMemo(() => getSlides(pkg as any), [pkg]);
  const lessonPlan = useMemo(() => getLessonPlan(pkg as any), [pkg]);
  const centers = useMemo(() => getCenters(pkg as any), [pkg]);
  const rotationPlan = useMemo(() => getRotationPlanItems(pkg as any), [pkg]);
  const { tier3, tier2, enrichment } = useMemo(() => getInterventions(pkg as any), [pkg]);

  async function runExport(which: "pptx" | "docx" | "zip") {
    try {
      setErr(null);
      setBusy(which);

      if (which === "pptx") {
        const mod = await import("../engine/exports/exportSlidesPptx");
        await mod.exportSlidesPptx(pkg as any);
      } else if (which === "docx") {
        const mod = await import("../engine/exports/exportLessonPlanDocx");
        await mod.exportLessonPlanDocx(pkg as any);
      } else {
        const mod = await import("../engine/exports/exportFullZip");
        await mod.exportFullZip(pkg as any);
      }
    } catch (e: any) {
      console.error(e);
      setErr(e?.message ?? String(e));
      alert("EXPORT ERROR: " + (e?.message ?? String(e)));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div style={orchardShellStyle()}>
      <div style={orchardWrapStyle()}>
        <WizardProgress current="results" />

        <div style={orchardHeroCardStyle()}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.6fr) minmax(260px, 0.9fr)",
              gap: 18,
              alignItems: "start",
            }}
          >
            <div>
              <div style={orchardRibbonHeaderStyle()}>Results Hub</div>
              <div style={orchardStitchDividerStyle()} />
              <h1 style={orchardHeroTitleStyle()}>{lessonTitle}</h1>
              <div style={{ ...orchardHelpTextStyle(), fontSize: 15, maxWidth: 760 }}>
                Review the generated package, scan the standards and blueprint influence, preview the teaching slides,
                and export the pieces you want to use.
              </div>

              <div style={{ marginTop: 12 }}>
                <SnapshotChip label="Date" value={(pkg as any)?.input?.date ?? "-"} background="#FFF6E8" border={COLORS.warnBorder} />
                <SnapshotChip label="Grade" value={(pkg as any)?.input?.grade ?? "-"} background="#EEF5EA" border={COLORS.successBorder} />
                <SnapshotChip label="Subject" value={(pkg as any)?.input?.subject ?? "-"} background="#F4EDF8" border="#D7C6E4" />
                <SnapshotChip label="Standards" value={visibleStandards.length} background="#F2F8FF" border="#C9DAEE" />
              </div>
            </div>

            <div style={{ ...orchardSoftCardStyle("#FFFDF9"), minWidth: 270 }}>
              <div style={{ fontWeight: 800, color: COLORS.heading, marginBottom: 10 }}>Lesson Snapshot</div>
              <div style={{ display: "grid", gap: 8, fontSize: 14, lineHeight: 1.55 }}>
                <div><b>Slides:</b> {slides.length}</div>
                <div><b>Centers:</b> {centers.length}</div>
                <div><b>Lesson plan sections:</b> {lessonPlan.length}</div>
                <div><b>Rotation items:</b> {rotationPlan.length}</div>
                <div><b>Tier 3 / Tier 2 / Enrichment:</b> {tier3.length} / {tier2.length} / {enrichment.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={orchardCardStyle()}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) auto",
              gap: 16,
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ ...orchardSectionTitleStyle(), marginBottom: 6 }}>Exports</div>
              <div style={{ ...orchardHelpTextStyle(), marginBottom: 0 }}>
                Export only what you need, or download the full lesson package at once.
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", justifyContent: "flex-end" }}>
              <button
                onClick={() => runExport("pptx")}
                disabled={busy !== null}
                style={orchardPrimaryButtonStyle(busy !== null)}
              >
                {busy === "pptx" ? "Exporting PPTX..." : "Export PPTX"}
              </button>

              <button
                onClick={() => runExport("docx")}
                disabled={busy !== null}
                style={orchardSecondaryButtonStyle(busy !== null)}
              >
                {busy === "docx" ? "Exporting DOCX..." : "Export DOCX"}
              </button>

              <button
                onClick={() => runExport("zip")}
                disabled={busy !== null}
                style={orchardSecondaryButtonStyle(busy !== null)}
              >
                {busy === "zip" ? "Exporting ZIP..." : "Full Export (ZIP)"}
              </button>

              <Link to="/" style={{ ...orchardLinkStyle(), marginLeft: 4 }}>
                Back to Inputs
              </Link>
            </div>
          </div>

          {err && (
            <div
              style={{
                background: "#FFF2F1",
                border: "1px solid #E6B8B4",
                padding: 10,
                borderRadius: 12,
                marginTop: 14,
              }}
            >
              <b>Export error:</b> {err}
            </div>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)",
            gap: 18,
          }}
        >
          <div style={orchardCardStyle()}>
            <div style={{ ...orchardSectionTitleStyle(), marginBottom: 6 }}>Standards Snapshot</div>
            <div style={{ ...orchardHelpTextStyle(), marginBottom: 8 }}>
              This now reads from shared canonical standards visibility when available, while keeping
              the live engine standards path as a compatibility fallback.
            </div>

            <div style={{ marginBottom: 12 }}>
              <SnapshotChip
                label="Standards source"
                value={standardsSourceText}
                background="#F6F1E8"
                border="#E7E2DA"
              />
            </div>

            {visibleStandards.length === 0 ? (
              <div style={{ fontWeight: 800 }}>
                Standards: (none surfaced yet - check inputs, trace, or add an override)
              </div>
            ) : (
              <>
                <div
                  style={{
                    ...orchardSoftCardStyle("#F8FBF7"),
                    border: `1px solid ${COLORS.successBorder}`,
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 900,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: COLORS.accentDark,
                      marginBottom: 6,
                    }}
                  >
                    Primary Standard
                  </div>
                  <div style={{ fontWeight: 900, marginBottom: 8, color: COLORS.heading, fontSize: 20 }}>
                    {primaryStandard?.code ?? ""}{" "}
                    <span style={{ opacity: 0.8, color: COLORS.muted }}>
                      {primaryStandard?.confidence != null ? `(${percent(primaryStandard.confidence)})` : ""}
                    </span>
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <span style={orchardPillStyle("#F6F1E8", "#E7E2DA")}>
                      source: {primaryStandard?.source ?? "unknown"}
                    </span>
                  </div>
                  <div style={{ opacity: 0.95, lineHeight: 1.55 }}>
                    {short(primaryStandard?.description)}
                  </div>
                </div>

                {supportingStandards.length > 0 && (
                  <div style={{ ...orchardSoftCardStyle(), marginBottom: 10 }}>
                    <div style={{ fontWeight: 900, marginBottom: 8, color: COLORS.heading }}>Supporting</div>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {supportingStandards.map((s, i) => (
                        <li key={(s.code ?? "") + i} style={{ marginBottom: 10 }}>
                          <div>
                            <b>{s.code}</b>{" "}
                            <span style={{ opacity: 0.8, color: COLORS.muted }}>
                              {s?.confidence != null ? `(${percent(s.confidence)})` : ""}
                            </span>
                          </div>
                          <div style={{ marginTop: 4, marginBottom: 4 }}>
                            <span style={orchardPillStyle("#F6F1E8", "#E7E2DA")}>
                              source: {s.source}
                            </span>
                          </div>
                          <div style={{ opacity: 0.92, lineHeight: 1.45 }}>
                            {short(s.description)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={{ opacity: 0.85, color: COLORS.muted }}>
                  <b>All codes:</b> {visibleStandards.map((s) => s.code).join(", ")}
                </div>
              </>
            )}
          </div>

          <div style={orchardCardStyle()}>
            <div style={{ ...orchardSectionTitleStyle(), marginBottom: 6 }}>Package Overview</div>
            <div style={{ ...orchardHelpTextStyle(), marginBottom: 12 }}>
              A quick scan of the completed lesson pieces.
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <div style={orchardSoftCardStyle()}><b>Slides</b><div style={{ color: COLORS.muted, marginTop: 4 }}>{slides.length} ready to preview or export.</div></div>
              <div style={orchardSoftCardStyle()}><b>Teacher plan</b><div style={{ color: COLORS.muted, marginTop: 4 }}>{lessonPlan.length} sections generated.</div></div>
              <div style={orchardSoftCardStyle()}><b>Centers + rotation</b><div style={{ color: COLORS.muted, marginTop: 4 }}>{centers.length} centers and {rotationPlan.length} rotation items.</div></div>
              <div style={orchardSoftCardStyle()}><b>Interventions</b><div style={{ color: COLORS.muted, marginTop: 4 }}>{tier3.length + tier2.length + enrichment.length} support entries across groups.</div></div>
            </div>
          </div>
        </div>

        <Section
          title="Blueprint Influence"
          subtitle="See how curriculum, exemplar framework, and teacher-facing cues shaped the final package."
          defaultOpen
        >
          <BlueprintInsights canonicalPackage={canonicalPackage} />

      <ResultsTraceSummaryCard canonicalPackage={canonicalPackage} />
        </Section>

        <Section
          title="Slide Preview Deck"
          subtitle="This preview is designed to feel closer to the actual teaching deck instead of a plain text list."
          defaultOpen
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <div style={{ ...orchardHelpTextStyle(), maxWidth: 680 }}>
              Choose the view that feels best for scanning the deck before exporting or teaching.
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={() => setPreviewMode("teaching")}
                style={previewMode === "teaching" ? orchardPrimaryButtonStyle(false) : orchardSecondaryButtonStyle(false)}
              >
                Teaching View
              </button>
              <button
                onClick={() => setPreviewMode("compact")}
                style={previewMode === "compact" ? orchardPrimaryButtonStyle(false) : orchardSecondaryButtonStyle(false)}
              >
                Compact View
              </button>
            </div>
          </div>

          {slides.length === 0 ? (
            <div style={{ opacity: 0.8, color: COLORS.muted }}>No slides found in package.</div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  previewMode === "compact"
                    ? "repeat(auto-fit, minmax(240px, 1fr))"
                    : "repeat(auto-fit, minmax(280px, 1fr))",
                gap: previewMode === "compact" ? 12 : 14,
              }}
            >
              {slides.map((slide: any, index: number) => (
                <SlidePreviewCard
                  key={slide?.id ?? index}
                  slide={slide}
                  index={index}
                  compact={previewMode === "compact"}
                />
              ))}
            </div>
          )}
        </Section>

        <Section
          title="Teacher Lesson Plan"
          subtitle="A readable preview of the generated instructional flow and slide-aligned sections."
          defaultOpen
        >
          {lessonPlan.length === 0 ? (
            <div style={{ opacity: 0.8, color: COLORS.muted }}>No lesson plan sections found in package.</div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {lessonPlan.map((sec: any, i: number) => (
                <div key={i} style={orchardSoftCardStyle()}>
                  <div style={{ fontWeight: 900, color: COLORS.heading, fontSize: 17 }}>
                    {sec?.heading ?? `Section ${i + 1}`}
                  </div>
                  {Array.isArray(sec?.slides) && (
                    <div style={{ opacity: 0.8, marginTop: 4, color: COLORS.muted }}>
                      Slides: {sec.slides.length ? sec.slides.join(", ") : "-"}
                    </div>
                  )}
                  <div style={{ whiteSpace: "pre-wrap", marginTop: 8, lineHeight: 1.55 }}>
                    {String(sec?.description ?? "")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 18,
          }}
        >
          <Section
            title={`Centers - ${centers.length}`}
            subtitle="Center activities grouped into warm paper cards for quick scanning."
          >
            {centers.length === 0 ? (
              <div style={{ opacity: 0.8, color: COLORS.muted }}>No centers generated.</div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {centers.map((c: any, i: number) => (
                  <div key={i} style={orchardSoftCardStyle()}>
                    <div style={{ fontWeight: 900, color: COLORS.heading }}>
                      {c?.title ?? c?.name ?? `Center ${i + 1}`}
                    </div>
                    {c?.objective && (
                      <div style={{ marginTop: 6, color: COLORS.muted }}>
                        <b>Objective:</b> {String(c.objective)}
                      </div>
                    )}
                    {c?.focusSkill && (
                      <div style={{ marginTop: 6, color: COLORS.muted }}>
                        <b>Focus skill:</b> {String(c.focusSkill)}
                      </div>
                    )}
                    {(c?.direction || c?.instructions) && (
                      <div style={{ whiteSpace: "pre-wrap", marginTop: 8, lineHeight: 1.55 }}>
                        {String(c?.direction ?? c?.instructions ?? "")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section
            title="Rotation Plan"
            subtitle="A quick view of how students move through support and practice."
          >
            {rotationPlan.length === 0 ? (
              <div style={{ opacity: 0.8, color: COLORS.muted }}>No rotation plan generated.</div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {rotationPlan.map((r: any, i: number) => (
                  <div key={i} style={orchardSoftCardStyle()}>
                    <div style={{ fontWeight: 800, color: COLORS.heading }}>
                      {r?.title ?? `Rotation ${i + 1}`}
                    </div>
                    <div style={{ whiteSpace: "pre-wrap", marginTop: 6, lineHeight: 1.55 }}>
                      {String(r?.description ?? r?.text ?? r ?? "")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>

        <Section
          title="Interventions"
          subtitle="Small-group and enrichment supports laid out by learner need."
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <div style={{ ...orchardSoftCardStyle("#FFF7F6"), border: "1px solid #EBC8C4" }}>
              <h3 style={{ marginTop: 0, color: COLORS.heading }}>Tier 3</h3>
              {tier3.length ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {tier3.map((x: any, i: number) => (
                    <li key={i} style={{ whiteSpace: "pre-wrap", marginBottom: 6, lineHeight: 1.5 }}>
                      {String(x?.description ?? x?.text ?? x ?? "")}
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ opacity: 0.8, color: COLORS.muted }}>None</div>
              )}
            </div>

            <div style={{ ...orchardSoftCardStyle("#FFF9ED"), border: `1px solid ${COLORS.warnBorder}` }}>
              <h3 style={{ marginTop: 0, color: COLORS.heading }}>Tier 2</h3>
              {tier2.length ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {tier2.map((x: any, i: number) => (
                    <li key={i} style={{ whiteSpace: "pre-wrap", marginBottom: 6, lineHeight: 1.5 }}>
                      {String(x?.description ?? x?.text ?? x ?? "")}
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ opacity: 0.8, color: COLORS.muted }}>None</div>
              )}
            </div>

            <div style={{ ...orchardSoftCardStyle("#F4FAF2"), border: `1px solid ${COLORS.successBorder}` }}>
              <h3 style={{ marginTop: 0, color: COLORS.heading }}>Enrichment</h3>
              {enrichment.length ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {enrichment.map((x: any, i: number) => (
                    <li key={i} style={{ whiteSpace: "pre-wrap", marginBottom: 6, lineHeight: 1.5 }}>
                      {String(x?.description ?? x?.text ?? x ?? "")}
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ opacity: 0.8, color: COLORS.muted }}>None</div>
              )}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}





