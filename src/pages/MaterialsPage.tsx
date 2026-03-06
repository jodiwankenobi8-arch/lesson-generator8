import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { buildBlueprint } from "../engine/blueprint/buildBlueprint";
import type { UploadedTextFile } from "../engine/blueprint/types";
import { useLessonStore } from "../state/useLessonStore";
import { filesToUploaded } from "../utils/readUploadedText";

export default function MaterialsPage() {
  const navigate = useNavigate();
  const input = useLessonStore((s) => s.input);
  const status = useLessonStore((s) => s.status);
  const errorMessage = useLessonStore((s) => s.errorMessage);
  const generate = useLessonStore((s) => s.generate);

  const [lessonNotes, setLessonNotes] = useState("");
  const [materialsPack, setMaterialsPack] = useState<UploadedTextFile[]>([]);
  const [exemplarPack, setExemplarPack] = useState<UploadedTextFile[]>([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function onPickMaterials(files: FileList | null) {
    setMaterialsPack(await filesToUploaded(files));
  }

  async function onPickExemplar(files: FileList | null) {
    setExemplarPack(await filesToUploaded(files));
  }

  async function onBuildAndGenerate() {
    setMsg("");
    setBusy(true);
    try {
      const blueprint = buildBlueprint({
        plan: {
          lessonTitle: input.lessonTitle ?? "",
          objective: input.objective ?? "",
          notes: lessonNotes ?? "",
        },
        curriculumFiles: materialsPack,
        exemplarFiles: exemplarPack,
      });

      localStorage.setItem("lessonBlueprintV1", JSON.stringify(blueprint, null, 2));
      await generate(blueprint);
      navigate("/results");
    } catch (e: any) {
      setMsg("Build/Generate failed: " + (e?.message ?? String(e)));
    } finally {
      setBusy(false);
    }
  }

  const missingBasics = !(input.lessonTitle ?? "").trim() || !(input.objective ?? "").trim() || !(input.textOrTopic ?? "").trim();

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 20 }}>
      <h1 style={{ marginTop: 0 }}>Materials Upload</h1>

      <div style={{ opacity: 0.85, marginBottom: 12 }}>
        <b>{input.date ?? ""}</b> | <b>{input.lessonTitle ?? ""}</b> | Grade <b>{input.grade ?? ""}</b> | <b>{input.subject ?? ""}</b>
      </div>

      {missingBasics && (
        <div style={{ background: "#fff6d6", border: "1px solid #f4d27a", padding: 12, borderRadius: 10, marginBottom: 14 }}>
          <b>Heads up:</b> the Inputs page is missing required fields (Lesson Title, Objective, and Text/Topic).
          <div style={{ marginTop: 6 }}><Link to="/">Go back to Inputs</Link></div>
        </div>
      )}

      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>New Lesson Materials + Exemplars</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ border: "1px solid #d8f5d8", borderRadius: 10, padding: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>NEW LESSON MATERIALS</div>
            <input type="file" multiple onChange={(e) => onPickMaterials(e.target.files)} />
            <div style={{ fontSize: 12, marginTop: 8, opacity: 0.85 }}>Files: {materialsPack.length ? materialsPack.map((f) => f.name).join(", ") : "none"}</div>
            <div style={{ fontSize: 12, marginTop: 6, opacity: 0.7 }}>(Text, Markdown, and DOCX text are read now. PDFs/PPTX/images are still stored as filenames only.)</div>
          </div>

          <div style={{ border: "1px solid #cfeeea", borderRadius: 10, padding: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>EXEMPLAR PACK</div>
            <input type="file" multiple onChange={(e) => onPickExemplar(e.target.files)} />
            <div style={{ fontSize: 12, marginTop: 8, opacity: 0.85 }}>Files: {exemplarPack.length ? exemplarPack.map((f) => f.name).join(", ") : "none"}</div>
            <div style={{ fontSize: 12, marginTop: 6, opacity: 0.7 }}>(Used for pacing, timers, clicker cues, and structure detection.)</div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Notes (optional)</div>
          <textarea
            value={lessonNotes}
            onChange={(e) => setLessonNotes(e.target.value)}
            style={{ width: "100%", padding: 10, minHeight: 70 }}
            placeholder="Pacing, special routines, constraints, or anything the blueprint should remember"
          />
        </div>

        {(msg || errorMessage) && (
          <div style={{ marginTop: 14, padding: 10, border: "1px solid #ffcccc", background: "#fff2f2", borderRadius: 10 }}>
            <b>{msg ? "Message:" : "Error:"}</b> {String(msg || errorMessage)}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap", alignItems: "center" }}>
          <button
            onClick={onBuildAndGenerate}
            disabled={busy || status === "generating" || missingBasics}
            style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid #111" }}
          >
            {busy || status === "generating" ? "Building + Generating..." : "Build Blueprint + Generate Lesson + Open Results ->"}
          </button>
          <Link to="/" style={{ opacity: 0.9 }}>Back to Inputs</Link>
        </div>

        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.85 }}>
          Status: <b>{status}</b> | Materials files: <b>{materialsPack.length}</b> | Exemplar files: <b>{exemplarPack.length}</b>
        </div>
      </div>
    </div>
  );
}
