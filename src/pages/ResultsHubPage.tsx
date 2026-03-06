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

// ---------- Blueprint Preview (read-only) ----------
function BlueprintPreviewOnce() {
  try {
    const raw = localStorage.getItem("lessonBlueprintV1");
    if (!raw) return null;

    const bp = JSON.parse(raw);

    return (
      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>Blueprint Preview (PLAN / NEW LESSON MATERIALS / EXEMPLAR / AI)</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div style={{ border: "1px solid #cfe8ff", borderRadius: 10, padding: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Plan</div>
            <div style={{ fontSize: 12 }}><b>Title:</b> {bp?.plan?.input?.lessonTitle || "(blank)"}</div>
            <div style={{ fontSize: 12 }}><b>Objective:</b> {bp?.plan?.input?.objective || "(blank)"}</div>
          </div>

          <div style={{ border: "1px solid #d8f5d8", borderRadius: 10, padding: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>New Lesson Materials</div>
            <div style={{ fontSize: 12 }}><b>Files:</b> {(bp?.curriculum?.files || []).map((f: any) => f.name).join(", ") || "none"}</div>
            <div style={{ fontSize: 12 }}><b>Checklist:</b> {(bp?.curriculum?.coverageChecklist || []).length}</div>
          </div>

          <div style={{ border: "1px solid #cfeeea", borderRadius: 10, padding: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Exemplar</div>
            <div style={{ fontSize: 12 }}><b>Files:</b> {(bp?.exemplar?.files || []).map((f: any) => f.name).join(", ") || "none"}</div>
            <div style={{ fontSize: 12 }}>
              <b>Framework:</b> {bp?.exemplar?.frameworkDetection?.framework || "unknown"} (
              {Math.round((bp?.exemplar?.frameworkDetection?.confidence || 0) * 100)}%)
            </div>
            <div style={{ fontSize: 12 }}><b>Presenter cues:</b> {(bp?.exemplar?.presenterCues || []).length}</div>
          </div>
        </div>

        <div style={{ marginTop: 12, border: "1px solid #eee", borderRadius: 10, padding: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Synthesis</div>
          <div style={{ fontSize: 12 }}><b>Slides planned:</b> {(bp?.synthesis?.slides || []).length}</div>

          <details style={{ marginTop: 10 }}>
            <summary style={{ cursor: "pointer" }}>View raw Blueprint JSON</summary>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, background: "#fafafa", padding: 12, borderRadius: 10, overflow: "auto" }}>
              {raw}
            </pre>
          </details>
        </div>
      </div>
    );
  } catch (e: any) {
    return (
      <div style={{ border: "1px solid #f5c2c7", borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <b>Blueprint Preview Error:</b> {e?.message ?? String(e)}
      </div>
    );
  }
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
    <details open={!!defaultOpen} style={{ marginBottom: 14 }}>
      <summary style={{ cursor: "pointer", fontWeight: 900, fontSize: 18, padding: "6px 0" }}>
        {title}
      </summary>
      <div style={{ paddingTop: 10 }}>{children}</div>
    </details>
  );
}

export default function ResultsHubPage() {
  const pkg = useLessonStore((s) => s.package);

  const [busy, setBusy] = useState<null | "pptx" | "docx" | "zip">(null);
  const [err, setErr] = useState<string | null>(null);

  if (!pkg) {
    return (
      <div style={{ maxWidth: 980, margin: "0 auto", padding: 20 }}>
        <h1 style={{ marginTop: 0 }}>Results Hub</h1>
        <p style={{ opacity: 0.85 }}>
          No generated lesson found yet. Go back and run the flow again.
        </p>
        <Link to="/">Back to Inputs</Link>
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
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 20 }}>
      <h1 style={{ marginTop: 0 }}>Results Hub</h1>

      <div style={{ opacity: 0.85, marginBottom: 12 }}>
        {(pkg as any)?.input?.date ?? ""} | {(pkg as any)?.input?.lessonTitle ?? ""} | Grade{" "}
        {(pkg as any)?.input?.grade ?? ""} | {(pkg as any)?.input?.subject ?? ""}
      </div>

      <div style={{ border: "2px solid #111", borderRadius: 14, padding: 14, marginBottom: 16 }}>
        <div style={{ fontWeight: 900, marginBottom: 10 }}>Exports</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button onClick={() => runExport("pptx")} disabled={busy !== null} style={{ padding: "10px 14px", borderRadius: 10 }}>
            {busy === "pptx" ? "Exporting PPTX..." : "Export PPTX"}
          </button>

          <button onClick={() => runExport("docx")} disabled={busy !== null} style={{ padding: "10px 14px", borderRadius: 10 }}>
            {busy === "docx" ? "Exporting DOCX..." : "Export DOCX"}
          </button>

          <button onClick={() => runExport("zip")} disabled={busy !== null} style={{ padding: "10px 14px", borderRadius: 10 }}>
            {busy === "zip" ? "Exporting ZIP..." : "Full Export (ZIP)"}
          </button>

          <Link to="/" style={{ alignSelf: "center", marginLeft: 6 }}>
            Back to Inputs
          </Link>
        </div>

        {err && (
          <div style={{ background: "#fff2f2", border: "1px solid #ffcccc", padding: 10, borderRadius: 10, marginTop: 12 }}>
            <b>Export error:</b> {err}
          </div>
        )}
      </div>

      <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12, marginBottom: 18 }}>
        {standards.length === 0 ? (
          <div style={{ fontWeight: 800 }}>Standards: (none detected yet — check inputs or add an override)</div>
        ) : (
          <>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>
              Primary: {primary?.code ?? ""}{" "}
              <span style={{ opacity: 0.8 }}>{primary?.confidence != null ? `(${percent(primary.confidence)})` : ""}</span>
            </div>
            <div style={{ opacity: 0.92, marginBottom: 10 }}>{short(primary?.label)}</div>

            {supporting.length > 0 && (
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 900, marginBottom: 6 }}>Supporting</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {supporting.map((s: any, i: number) => (
                    <li key={(s.code ?? "") + i} style={{ marginBottom: 10 }}>
                      <div>
                        <b>{s.code}</b>{" "}
                        <span style={{ opacity: 0.8 }}>{s?.confidence != null ? `(${percent(s.confidence)})` : ""}</span>
                      </div>
                      <div style={{ opacity: 0.92 }}>{short(s.label)}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div style={{ opacity: 0.85 }}>
              <b>All codes:</b> {standards.map((s: any) => s.code).join(", ")}
            </div>
          </>
        )}
      </div>

      <Section title="Teacher Lesson Plan" defaultOpen>
        {lessonPlan.length === 0 ? (
          <div style={{ opacity: 0.8 }}>No lesson plan sections found in package.</div>
        ) : (
          lessonPlan.map((sec: any, i: number) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 900 }}>{sec?.heading ?? `Section ${i + 1}`}</div>
              {Array.isArray(sec?.slides) && (
                <div style={{ opacity: 0.8, marginTop: 2 }}>
                  Slides: {sec.slides.length ? sec.slides.join(", ") : "-"}
                </div>
              )}
              <div style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>{String(sec?.description ?? "")}</div>
            </div>
          ))
        )}
      </Section>

      <Section title={`Slides (Student-facing) — ${slides.length}`}>
        {slides.length === 0 ? (
          <div style={{ opacity: 0.8 }}>No slides found in package.</div>
        ) : (
          <ol>
            {slides.map((s: any, i: number) => (
              <li key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 700 }}>{s?.title ?? s?.heading ?? `Slide ${i + 1}`}</div>
                {s?.text && <div style={{ whiteSpace: "pre-wrap" }}>{String(s.text)}</div>}
                {s?.body && <div style={{ whiteSpace: "pre-wrap" }}>{String(s.body)}</div>}
              </li>
            ))}
          </ol>
        )}
      </Section>

      <Section title={`Centers — ${centers.length}`}>
        {centers.length === 0 ? (
          <div style={{ opacity: 0.8 }}>No centers generated.</div>
        ) : (
          centers.map((c: any, i: number) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 900 }}>{c?.title ?? c?.name ?? `Center ${i + 1}`}</div>
              {c?.direction && <div style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>{String(c.direction)}</div>}
            </div>
          ))
        )}
      </Section>

      <Section title="Rotation Plan">
        {rotationPlan.length === 0 ? (
          <div style={{ opacity: 0.8 }}>No rotation plan generated.</div>
        ) : (
          <ol>
            {rotationPlan.map((r: any, i: number) => (
              <li key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 700 }}>{r?.title ?? `Rotation ${i + 1}`}</div>
                <div style={{ whiteSpace: "pre-wrap" }}>{String(r?.description ?? r?.text ?? r ?? "")}</div>
              </li>
            ))}
          </ol>
        )}
      </Section>

      <Section title="Interventions">
        <h3>Tier 3</h3>
        {tier3.length ? (
          <ul>
            {tier3.map((x: any, i: number) => (
              <li key={i} style={{ whiteSpace: "pre-wrap", marginBottom: 6 }}>
                {String(x?.description ?? x?.text ?? x ?? "")}
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ opacity: 0.8 }}>None</div>
        )}

        <h3>Tier 2</h3>
        {tier2.length ? (
          <ul>
            {tier2.map((x: any, i: number) => (
              <li key={i} style={{ whiteSpace: "pre-wrap", marginBottom: 6 }}>
                {String(x?.description ?? x?.text ?? x ?? "")}
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ opacity: 0.8 }}>None</div>
        )}

        <h3>Enrichment</h3>
        {enrichment.length ? (
          <ul>
            {enrichment.map((x: any, i: number) => (
              <li key={i} style={{ whiteSpace: "pre-wrap", marginBottom: 6 }}>
                {String(x?.description ?? x?.text ?? x ?? "")}
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ opacity: 0.8 }}>None</div>
        )}
      </Section>

      {/* Put Blueprint Preview at the very bottom */}
      <Section title="Blueprint Preview (Auto)" defaultOpen={false}>
        <BlueprintPreviewOnce />
      </Section>
    </div>
  );
}
