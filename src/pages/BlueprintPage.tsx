import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLessonStore } from "../state/useLessonStore";
import { buildBlueprint } from "../engine/blueprint/buildBlueprint";
import type { UploadedTextFile } from "../engine/blueprint/types";
import { filesToUploaded } from "../utils/readUploadedText";

export default function BlueprintPage() {
  const navigate = useNavigate();
  const input = useLessonStore((s) => s.input);
  const status = useLessonStore((s) => s.status);
  const errorMessage = useLessonStore((s) => s.errorMessage);
  const generate = useLessonStore((s) => s.generate);

  const [bpNotes, setBpNotes] = useState("");
  const [curriculumPack, setCurriculumPack] = useState<UploadedTextFile[]>([]);
  const [exemplarPack, setExemplarPack] = useState<UploadedTextFile[]>([]);
  const [msg, setMsg] = useState("");

  async function onPickCurriculum(files: FileList | null) {
    setCurriculumPack(await filesToUploaded(files));
  }

  async function onPickExemplar(files: FileList | null) {
    setExemplarPack(await filesToUploaded(files));
  }

  function buildAndSaveBlueprint() {
    const lessonTitle = String(input.lessonTitle ?? "").trim();
    const objective = String(input.objective ?? "").trim();
    if (!lessonTitle || !objective) {
      throw new Error("Missing Lesson Title or Objective. Go back and fill them in.");
    }

    const blueprint = buildBlueprint({
      plan: { lessonTitle, objective, notes: bpNotes },
      curriculumFiles: curriculumPack,
      exemplarFiles: exemplarPack,
    });

    localStorage.setItem("lessonBlueprintV1", JSON.stringify(blueprint, null, 2));
    return blueprint;
  }

  async function onGenerate() {
    try {
      setMsg("Building blueprint...");
      const blueprint = buildAndSaveBlueprint();
      setMsg("Generating lesson...");
      await generate(blueprint);
      navigate("/results");
    } catch (e: any) {
      setMsg(String(e?.message ?? e));
    }
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 20 }}>
      <h1 style={{ marginTop: 0 }}>Blueprint - Curriculum + Exemplars</h1>

      <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, marginTop: 12 }}>
        <div style={{ fontSize: 12, opacity: 0.85 }}>
          <b>PLAN (from Lesson Inputs)</b><br />
          Title: {String(input.lessonTitle ?? "").trim() || "-"}<br />
          Objective: {String(input.objective ?? "").trim() || "-"}
        </div>

        <label style={{ display: "block", fontSize: 12, opacity: 0.85, marginTop: 12 }}>Notes (optional)</label>
        <textarea
          value={bpNotes}
          onChange={(e) => setBpNotes(e.target.value)}
          style={{ width: "100%", padding: 10, minHeight: 80 }}
          placeholder="Pacing, routines, presenter cues, or things you always want included"
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          <div style={{ border: "1px solid #d8f5d8", borderRadius: 10, padding: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>CURRICULUM PACK</div>
            <input type="file" multiple onChange={(e) => onPickCurriculum(e.target.files)} />
            <div style={{ fontSize: 12, marginTop: 8, opacity: 0.85 }}>Files: {curriculumPack.length ? curriculumPack.map((f) => f.name).join(", ") : "none"}</div>
          </div>

          <div style={{ border: "1px solid #cfeeea", borderRadius: 10, padding: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>EXEMPLAR PACK</div>
            <input type="file" multiple onChange={(e) => onPickExemplar(e.target.files)} />
            <div style={{ fontSize: 12, marginTop: 8, opacity: 0.85 }}>Files: {exemplarPack.length ? exemplarPack.map((f) => f.name).join(", ") : "none"}</div>
          </div>
        </div>

        {errorMessage && (
          <div style={{ marginTop: 12, padding: 10, border: "1px solid #ffcccc", background: "#fff2f2", borderRadius: 10 }}>
            <b>Error:</b> {String(errorMessage)}
          </div>
        )}

        {msg && <div style={{ marginTop: 10, fontSize: 12, opacity: 0.85 }}>{msg}</div>}

        <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <button onClick={() => navigate("/")} style={{ padding: "10px 14px" }}>Back to Lesson Inputs</button>
          <button onClick={onGenerate} disabled={status === "generating"} style={{ padding: "10px 14px" }}>
            {status === "generating" ? "Generating..." : "Generate Lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}
