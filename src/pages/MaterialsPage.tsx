import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { buildBlueprint } from "../engine/blueprint/buildBlueprint";
import type { UploadedTextFile } from "../engine/blueprint/types";
import { useLessonStore } from "../state/useLessonStore";
import { filesToUploaded } from "../utils/readUploadedText";

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

function shellStyle(): React.CSSProperties {
  return {
    minHeight: "100vh",
    background: COLORS.page,
    color: COLORS.text,
  };
}

function wrapStyle(): React.CSSProperties {
  return {
    maxWidth: 1080,
    margin: "0 auto",
    padding: 24,
  };
}

function cardStyle(): React.CSSProperties {
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

function labelTitleStyle(): React.CSSProperties {
  return {
    fontWeight: 800,
    color: COLORS.heading,
    marginBottom: 6,
  };
}

function textareaStyle(minHeight = 90): React.CSSProperties {
  return {
    width: "100%",
    padding: 12,
    minHeight,
    resize: "vertical",
    borderRadius: 14,
    border: `1px solid ${COLORS.border}`,
    background: "#FFFDFC",
    color: COLORS.text,
    boxSizing: "border-box",
    outline: "none",
  };
}

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

  const missingBasics =
    !(input.lessonTitle ?? "").trim() ||
    !(input.objective ?? "").trim() ||
    !(input.textOrTopic ?? "").trim();

  return (
    <div style={shellStyle()}>
      <div style={wrapStyle()}>
        <div
          style={{
            ...cardStyle(),
            background: "linear-gradient(135deg, #FFF8EF 0%, #F7F1E8 100%)",
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
            <div style={{ maxWidth: 700 }}>
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
                Materials Upload
              </div>

              <h1
                style={{
                  margin: "0 0 8px 0",
                  color: COLORS.heading,
                  fontSize: 34,
                  lineHeight: 1.1,
                }}
              >
                Add curriculum and exemplar materials
              </h1>

              <div style={{ color: COLORS.muted, fontSize: 15, lineHeight: 1.55 }}>
                Upload the materials that should shape the lesson structure, wording, pacing, and teacher cues.
              </div>

              <div style={{ color: COLORS.muted, fontSize: 14, lineHeight: 1.5, marginTop: 10 }}>
                <b>{input.date ?? ""}</b> | <b>{input.lessonTitle ?? ""}</b> | Grade <b>{input.grade ?? ""}</b> | <b>{input.subject ?? ""}</b>
              </div>
            </div>

            <div style={{ ...softCardStyle("#FFFDF9"), minWidth: 260 }}>
              <div style={{ fontWeight: 800, color: COLORS.heading, marginBottom: 8 }}>
                What this step does
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                <div>1. Reads lesson materials</div>
                <div>2. Detects exemplar cues and structure</div>
                <div>3. Builds the Blueprint</div>
                <div>4. Generates the lesson package</div>
              </div>
            </div>
          </div>
        </div>

        {missingBasics && (
          <div
            style={{
              ...cardStyle(),
              background: "#FFF8E7",
              border: `1px solid ${COLORS.warnBorder}`,
            }}
          >
            <div style={{ fontWeight: 800, color: COLORS.heading, marginBottom: 6 }}>
              Heads up
            </div>
            <div style={{ lineHeight: 1.55 }}>
              The Inputs page is missing required fields: <b>Lesson Title</b>, <b>Objective</b>, and <b>Text / Topic</b>.
            </div>
            <div style={{ marginTop: 10 }}>
              <Link to="/" style={{ color: COLORS.accentDark, fontWeight: 700 }}>
                Go back to Inputs
              </Link>
            </div>
          </div>
        )}

        <div style={cardStyle()}>
          <div style={{ fontWeight: 900, fontSize: 20, color: COLORS.heading, marginBottom: 14 }}>
            New Lesson Materials + Exemplars
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 14,
            }}
          >
            <div
              style={{
                ...softCardStyle(COLORS.success),
                border: `1px solid ${COLORS.successBorder}`,
              }}
            >
              <div style={{ fontWeight: 900, color: COLORS.heading, marginBottom: 8 }}>
                NEW LESSON MATERIALS
              </div>
              <input type="file" multiple onChange={(e) => onPickMaterials(e.target.files)} />
              <div style={{ fontSize: 12, marginTop: 10, color: COLORS.muted, lineHeight: 1.5 }}>
                <b>Files:</b> {materialsPack.length ? materialsPack.map((f) => f.name).join(", ") : "none"}
              </div>
              <div style={{ fontSize: 12, marginTop: 8, color: COLORS.muted, lineHeight: 1.5 }}>
                Text, Markdown, and DOCX text are read now. PDFs, PPTX, and images are currently stored as filenames only.
              </div>
            </div>

            <div
              style={{
                ...softCardStyle(COLORS.info),
                border: `1px solid ${COLORS.infoBorder}`,
              }}
            >
              <div style={{ fontWeight: 900, color: COLORS.heading, marginBottom: 8 }}>
                EXEMPLAR PACK
              </div>
              <input type="file" multiple onChange={(e) => onPickExemplar(e.target.files)} />
              <div style={{ fontSize: 12, marginTop: 10, color: COLORS.muted, lineHeight: 1.5 }}>
                <b>Files:</b> {exemplarPack.length ? exemplarPack.map((f) => f.name).join(", ") : "none"}
              </div>
              <div style={{ fontSize: 12, marginTop: 8, color: COLORS.muted, lineHeight: 1.5 }}>
                Used for pacing, timers, clicker cues, and structure detection.
              </div>
            </div>
          </div>
        </div>

        <div style={cardStyle()}>
          <div style={{ fontWeight: 900, fontSize: 20, color: COLORS.heading, marginBottom: 6 }}>
            Lesson Notes (optional)
          </div>
          <div style={{ color: COLORS.muted, marginBottom: 12, lineHeight: 1.5 }}>
            Add pacing notes, routines, constraints, or anything the Blueprint should keep in mind while generating.
          </div>

          <label style={{ display: "block" }}>
            <div style={labelTitleStyle()}>Notes</div>
            <textarea
              value={lessonNotes}
              onChange={(e) => setLessonNotes(e.target.value)}
              style={textareaStyle(90)}
              placeholder="Pacing, special routines, constraints, or anything the blueprint should remember"
            />
          </label>
        </div>

        {(msg || errorMessage) && (
          <div
            style={{
              ...cardStyle(),
              background: "#FFF2F1",
              border: "1px solid #E6B8B4",
            }}
          >
            <b>{msg ? "Message:" : "Error:"}</b> {String(msg || errorMessage)}
          </div>
        )}

        <div
          style={{
            ...cardStyle(),
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ color: COLORS.muted, lineHeight: 1.55 }}>
            Status: <b>{status}</b> | Materials files: <b>{materialsPack.length}</b> | Exemplar files: <b>{exemplarPack.length}</b>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={onBuildAndGenerate}
              disabled={busy || status === "generating" || missingBasics}
              style={{
                padding: "12px 16px",
                borderRadius: 14,
                border: `1px solid ${COLORS.accent}`,
                background: COLORS.accent,
                color: "#fff",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {busy || status === "generating"
                ? "Building + Generating..."
                : "Build Blueprint + Generate Lesson + Open Results ?"}
            </button>

            <Link to="/" style={{ color: COLORS.accentDark, fontWeight: 700 }}>
              Back to Inputs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
