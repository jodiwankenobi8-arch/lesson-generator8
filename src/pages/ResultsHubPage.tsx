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

const COLORS = {
  page: "#F7F1E8",
  panel: "#FFFDF9",
  panelAlt: "#F9F4EC",
  border: "#D8CBB8",
  borderSoft: "#E8DDD0",
  text: "#2F2A24",
  muted: "#6F655B",
  heading: "#314B3A",
  accent: "#6E8B5E",
  accentDark: "#4E6542",
  blush: "#D9A58F",
  honey: "#E8C47A",
  info: "#EAF2FB",
  infoBorder: "#BDD0E6",
  success: "#EEF5EA",
  successBorder: "#C9DABD",
  warn: "#FFF6E8",
  warnBorder: "#E9D3A5",
  shadow: "rgba(73, 52, 33, 0.08)",
};

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

function pageShellStyle(): React.CSSProperties {
  return {
    minHeight: "100vh",
    background: COLORS.page,
    color: COLORS.text,
  };
}

function contentWrapStyle(): React.CSSProperties {
  return {
    maxWidth: 1080,
    margin: "0 auto",
    padding: 24,
  };
}

function sectionCardStyle(): React.CSSProperties {
  return {
    background: COLORS.panel,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 22,
    padding: 18,
    boxShadow: `0 8px 24px ${COLORS.shadow}`,
    marginBottom: 18,
  };
}

function softCardStyle(background = COLORS.panelAlt): React.CSSProperties {
  return {
    background,
    border: `1px solid ${COLORS.borderSoft}`,
    borderRadius: 18,
    padding: 14,
  };
}

function pillStyle(background: string, border: string): React.CSSProperties {
  return {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    background,
    border: `1px solid ${border}`,
    fontSize: 12,
    fontWeight: 700,
    color: COLORS.text,
    marginRight: 8,
    marginBottom: 8,
  };
}

function Section({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={!!defaultOpen} style={sectionCardStyle()}>
      <summary
        style={{
          cursor: "pointer",
          fontWeight: 900,
          fontSize: 20,
          color: COLORS.heading,
          listStyle: "none",
        }}
      >
        {title}
      </summary>
      <div style={{ paddingTop: 14 }}>{children}</div>
    </details>
  );
}

function BlueprintInsights() {
  const bp = useMemo(() => readBlueprint(), []);
  if (!bp) {
    return <div style={{ opacity: 0.8, color: COLORS.muted }}>No saved Blueprint found for this package yet.</div>;
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
      <div
        style={{
          ...softCardStyle(),
          marginBottom: 14,
          background: "linear-gradient(135deg, #FFF8EF 0%, #F8F1E6 100%)",
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 18, color: COLORS.heading, marginBottom: 8 }}>
          Blueprint Influence Summary
        </div>
        <div style={{ color: COLORS.muted, lineHeight: 1.5 }}>
          This explains what the system used from your lesson plan, uploaded curriculum, and exemplar cues to shape the lesson package.
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <span style={pillStyle(COLORS.info, COLORS.infoBorder)}>Applied framework: {frameworkApplied}</span>
        <span style={pillStyle(COLORS.success, COLORS.successBorder)}>Curriculum items: {curriculumItems.length}</span>
        <span style={pillStyle(COLORS.warn, COLORS.warnBorder)}>Presenter cues: {cueItems.length}</span>
        <span style={pillStyle("#F4EDF8", "#D7C6E4")}>Planned slides: {plannedSlides.length}</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div style={{ ...softCardStyle(COLORS.info), border: `1px solid ${COLORS.infoBorder}` }}>
          <div style={{ fontWeight: 800, marginBottom: 6, color: COLORS.heading }}>Framework</div>
          <div style={{ fontSize: 14, marginBottom: 4 }}><b>Applied:</b> {frameworkApplied}</div>
          <div style={{ fontSize: 14 }}>
            <b>Detected exemplar pattern:</b> {detectedFramework} ({detectedConfidence}%)
          </div>
        </div>

        <div style={{ ...softCardStyle(COLORS.success), border: `1px solid ${COLORS.successBorder}` }}>
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

        <div style={{ ...softCardStyle(COLORS.warn), border: `1px solid ${COLORS.warnBorder}` }}>
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

      <div style={{ ...softCardStyle(), marginBottom: 14 }}>
        <div style={{ fontWeight: 800, marginBottom: 8, color: COLORS.heading }}>Why this lesson changed</div>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.55 }}>
          <li style={{ marginBottom: 6 }}>
            {frameworkApplied === "clickableHub"
              ? "The Results Hub is using a clickable-hub structure because an exemplar was present and the blueprint applied that framework."
              : frameworkApplied === "guidepost"
                ? "The Results Hub is using a guidepost-style structure because the blueprint detected and applied that framework."
                : "The Results Hub is using the default linear structure because no non-linear framework was applied."}
          </li>
          <li style={{ marginBottom: 6 }}>
            {curriculumItems.length
              ? "Curriculum titles are being used to shape teacher plan language, slide bullets, and center directions."
              : "No curriculum checklist items were available, so wording falls back to default lesson language."}
          </li>
          <li>
            {cueItems.length
              ? "Presenter cues from the exemplar are being used to influence notes, transitions, and rotation wording."
              : "No exemplar presenter cues were available, so teacher cueing stays generic."}
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
        <div style={softCardStyle()}>
          <div style={{ fontWeight: 800, marginBottom: 6, color: COLORS.heading }}>Source Files</div>
          <div style={{ fontSize: 14, marginBottom: 6 }}>
            <b>Curriculum files:</b> {curriculumFiles.join(", ") || "none"}
          </div>
          <div style={{ fontSize: 14 }}>
            <b>Exemplar files:</b> {exemplarFiles.join(", ") || "none"}
          </div>
        </div>

        <div style={softCardStyle()}>
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
        <div style={softCardStyle()}>
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

export default function ResultsHubPage() {
  const pkg = useLessonStore((s) => s.package);

  const [busy, setBusy] = useState<null | "pptx" | "docx" | "zip">(null);
  const [err, setErr] = useState<string | null>(null);

  if (!pkg) {
    return (
      <div style={pageShellStyle()}>
        <div style={contentWrapStyle()}>
          <div style={sectionCardStyle()}>
            <h1 style={{ marginTop: 0, marginBottom: 10, color: COLORS.heading }}>Results Hub</h1>
            <p style={{ opacity: 0.9, color: COLORS.muted }}>
              No generated lesson found yet. Go back and run the flow again.
            </p>
            <Link to="/" style={{ color: COLORS.accentDark, fontWeight: 700 }}>
              Back to Inputs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const rawStandards = useMemo(() => getStandards(pkg as any), [pkg]);
  const standards = useMemo(
    () =>
      (rawStandards || []).map((s: any) => ({
        ...s,
        label: findLabelByCode(s?.code),
      })),
    [rawStandards]
  );

  const primary = standards[0];
  const supporting = standards.slice(1, 4);

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
    <div style={pageShellStyle()}>
      <div style={contentWrapStyle()}>
        <div
          style={{
            ...sectionCardStyle(),
            background: "linear-gradient(135deg, #FFF8EF 0%, #F7F1E8 100%)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: "#EEF5EA",
                  border: `1px solid ${COLORS.successBorder}`,
                  fontSize: 12,
                  fontWeight: 800,
                  color: COLORS.accentDark,
                  marginBottom: 10,
                }}
              >
                Results Hub
              </div>
              <h1
                style={{
                  margin: "0 0 8px 0",
                  color: COLORS.heading,
                  fontSize: 34,
                  lineHeight: 1.1,
                }}
              >
                {(pkg as any)?.input?.lessonTitle ?? "Generated Lesson"}
              </h1>
              <div style={{ color: COLORS.muted, fontSize: 15, lineHeight: 1.5 }}>
                {(pkg as any)?.input?.date ?? ""} | Grade {(pkg as any)?.input?.grade ?? ""} | {(pkg as any)?.input?.subject ?? ""}
              </div>
            </div>

            <div style={{ ...softCardStyle("#FFFDF9"), minWidth: 260 }}>
              <div style={{ fontWeight: 800, color: COLORS.heading, marginBottom: 6 }}>Lesson Snapshot</div>
              <div style={{ color: COLORS.text, fontSize: 14, lineHeight: 1.6 }}>
                <div><b>Slides:</b> {slides.length}</div>
                <div><b>Centers:</b> {centers.length}</div>
                <div><b>Lesson plan sections:</b> {lessonPlan.length}</div>
                <div><b>Rotation items:</b> {rotationPlan.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={sectionCardStyle()}>
          <div style={{ fontWeight: 900, marginBottom: 12, color: COLORS.heading, fontSize: 18 }}>Exports</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={() => runExport("pptx")}
              disabled={busy !== null}
              style={{
                padding: "11px 15px",
                borderRadius: 14,
                border: `1px solid ${COLORS.accent}`,
                background: COLORS.accent,
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {busy === "pptx" ? "Exporting PPTX..." : "Export PPTX"}
            </button>

            <button
              onClick={() => runExport("docx")}
              disabled={busy !== null}
              style={{
                padding: "11px 15px",
                borderRadius: 14,
                border: `1px solid ${COLORS.border}`,
                background: COLORS.panelAlt,
                color: COLORS.text,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {busy === "docx" ? "Exporting DOCX..." : "Export DOCX"}
            </button>

            <button
              onClick={() => runExport("zip")}
              disabled={busy !== null}
              style={{
                padding: "11px 15px",
                borderRadius: 14,
                border: `1px solid ${COLORS.border}`,
                background: "#FFF7EC",
                color: COLORS.text,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {busy === "zip" ? "Exporting ZIP..." : "Full Export (ZIP)"}
            </button>

            <Link to="/" style={{ color: COLORS.accentDark, fontWeight: 700, marginLeft: 4 }}>
              Back to Inputs
            </Link>
          </div>

          {err && (
            <div
              style={{
                background: "#FFF2F1",
                border: "1px solid #E6B8B4",
                padding: 10,
                borderRadius: 12,
                marginTop: 12,
              }}
            >
              <b>Export error:</b> {err}
            </div>
          )}
        </div>

        <div style={sectionCardStyle()}>
          {standards.length === 0 ? (
            <div style={{ fontWeight: 800 }}>Standards: (none detected yet — check inputs or add an override)</div>
          ) : (
            <>
              <div style={{ fontWeight: 900, marginBottom: 8, color: COLORS.heading, fontSize: 18 }}>
                Primary: {primary?.code ?? ""}{" "}
                <span style={{ opacity: 0.8, color: COLORS.muted }}>
                  {primary?.confidence != null ? `(${percent(primary.confidence)})` : ""}
                </span>
              </div>
              <div style={{ opacity: 0.95, marginBottom: 12, lineHeight: 1.55 }}>{short(primary?.label)}</div>

              {supporting.length > 0 && (
                <div style={{ ...softCardStyle(), marginBottom: 10 }}>
                  <div style={{ fontWeight: 900, marginBottom: 8, color: COLORS.heading }}>Supporting</div>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {supporting.map((s: any, i: number) => (
                      <li key={(s.code ?? "") + i} style={{ marginBottom: 10 }}>
                        <div>
                          <b>{s.code}</b>{" "}
                          <span style={{ opacity: 0.8, color: COLORS.muted }}>
                            {s?.confidence != null ? `(${percent(s.confidence)})` : ""}
                          </span>
                        </div>
                        <div style={{ opacity: 0.92, lineHeight: 1.45 }}>{short(s.label)}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ opacity: 0.85, color: COLORS.muted }}>
                <b>All codes:</b> {standards.map((s: any) => s.code).join(", ")}
              </div>
            </>
          )}
        </div>

        <Section title="Blueprint Influence" defaultOpen>
          <BlueprintInsights />
        </Section>

        <Section title="Teacher Lesson Plan" defaultOpen>
          {lessonPlan.length === 0 ? (
            <div style={{ opacity: 0.8, color: COLORS.muted }}>No lesson plan sections found in package.</div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {lessonPlan.map((sec: any, i: number) => (
                <div key={i} style={softCardStyle()}>
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

        <Section title={`Slides (Student-facing) — ${slides.length}`}>
          {slides.length === 0 ? (
            <div style={{ opacity: 0.8, color: COLORS.muted }}>No slides found in package.</div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 12,
              }}
            >
              {slides.map((s: any, i: number) => (
                <div key={i} style={softCardStyle()}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.blush, marginBottom: 6 }}>
                    Slide {i + 1}
                  </div>
                  <div style={{ fontWeight: 800, color: COLORS.heading, marginBottom: 8 }}>
                    {s?.title ?? s?.heading ?? `Slide ${i + 1}`}
                  </div>
                  {Array.isArray(s?.bullets) && s.bullets.length > 0 && (
                    <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.5 }}>
                      {s.bullets.map((b: any, idx: number) => (
                        <li key={idx} style={{ marginBottom: 4 }}>{String(b)}</li>
                      ))}
                    </ul>
                  )}
                  {s?.text && <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{String(s.text)}</div>}
                  {s?.body && <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{String(s.body)}</div>}
                </div>
              ))}
            </div>
          )}
        </Section>

        <Section title={`Centers — ${centers.length}`}>
          {centers.length === 0 ? (
            <div style={{ opacity: 0.8, color: COLORS.muted }}>No centers generated.</div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {centers.map((c: any, i: number) => (
                <div key={i} style={softCardStyle()}>
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
                      <b>Objective:</b> {String(c.focusSkill)}
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

        <Section title="Rotation Plan">
          {rotationPlan.length === 0 ? (
            <div style={{ opacity: 0.8, color: COLORS.muted }}>No rotation plan generated.</div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {rotationPlan.map((r: any, i: number) => (
                <div key={i} style={softCardStyle()}>
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

        <Section title="Interventions">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <div style={softCardStyle()}>
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

            <div style={softCardStyle()}>
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

            <div style={softCardStyle()}>
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
