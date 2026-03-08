import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLessonStore } from "../state/useLessonStore";
import { buildBlueprint } from "../engine/blueprint/buildBlueprint";
import type { UploadedTextFile } from "../engine/blueprint/types";
import { extractFilesToUploaded } from "../utils/extractLessonMaterialSources";

const COLORS = {
  orchardCream: "#FFF6E9",
  paper: "#FFFFFF",
  warmGray: "#E7E2DA",
  charcoal: "#2F2F2F",
  moss: "#6E8B6B",
  deepOrchard: "#3F5A40",
  appleBlush: "#F7D6D0",
  warmHoney: "#F2C078",
  cranberry: "#B8545A",
};

type UploadKind = "curriculum" | "exemplar";

function PackSummary({
  title,
  accent,
  files,
  emptyText,
}: {
  title: string;
  accent: string;
  files: UploadedTextFile[];
  emptyText: string;
}) {
  return (
    <div
      style={{
        background: COLORS.paper,
        border: `1px solid ${COLORS.warmGray}`,
        borderTop: `4px solid ${accent}`,
        borderRadius: 18,
        padding: 16,
        boxShadow: "0 10px 30px rgba(63, 90, 64, 0.08)",
      }}
    >
      <div
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 20,
          color: COLORS.deepOrchard,
          marginBottom: 10,
        }}
      >
        {title}
      </div>

      {files.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {files.map((file) => (
            <span
              key={`${title}-${file.name}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 10px",
                borderRadius: 999,
                background: COLORS.orchardCream,
                border: `1px solid ${COLORS.warmGray}`,
                color: COLORS.charcoal,
                fontSize: 13,
              }}
            >
              {file.name}
            </span>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: 13, color: "rgba(47,47,47,0.72)" }}>{emptyText}</div>
      )}
    </div>
  );
}

function UploadZone({
  kind,
  title,
  subtitle,
  accent,
  inputId,
  dragging,
  onPick,
  onDragState,
}: {
  kind: UploadKind;
  title: string;
  subtitle: string;
  accent: string;
  inputId: string;
  dragging: boolean;
  onPick: (kind: UploadKind, files: FileList | null) => Promise<void>;
  onDragState: (kind: UploadKind | null) => void;
}) {
  return (
    <div
      style={{
        background: COLORS.paper,
        border: `1px solid ${COLORS.warmGray}`,
        borderRadius: 18,
        padding: 16,
      }}
    >
      <div
        style={{
          fontFamily: '"Playfair Display", serif',
          fontSize: 22,
          color: COLORS.deepOrchard,
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div style={{ fontSize: 13, color: "rgba(47,47,47,0.72)", marginBottom: 12 }}>
        {subtitle}
      </div>

      <input
        id={inputId}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={(e) => onPick(kind, e.target.files)}
      />

      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          onDragState(kind);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          onDragState(kind);
        }}
        onDragLeave={() => onDragState(null)}
        onDrop={async (e) => {
          e.preventDefault();
          onDragState(null);
          await onPick(kind, e.dataTransfer.files);
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          minHeight: 150,
          width: "100%",
          borderRadius: 18,
          border: `2px dashed ${dragging ? accent : COLORS.warmGray}`,
          background: dragging ? `${accent}18` : COLORS.orchardCream,
          cursor: "pointer",
          textAlign: "center",
          padding: 18,
          boxSizing: "border-box",
          transition: "all 120ms ease",
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: COLORS.deepOrchard,
            background: COLORS.paper,
            border: `1px solid ${COLORS.warmGray}`,
            borderRadius: 999,
            padding: "8px 14px",
          }}
        >
          Choose {kind === "curriculum" ? "curriculum" : "exemplar"} files
        </div>

        <div style={{ fontSize: 14, color: COLORS.charcoal, lineHeight: 1.5 }}>
          Drag and drop files here
          <br />
          <span style={{ color: "rgba(47,47,47,0.72)" }}>
            Supports TXT, MD, DOCX, PDF, PPTX, and common classroom file types
          </span>
        </div>
      </label>
    </div>
  );
}

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
  const [loadingPack, setLoadingPack] = useState<UploadKind | null>(null);
  const [draggingKind, setDraggingKind] = useState<UploadKind | null>(null);

  const lessonTitle = String(input.lessonTitle ?? "").trim();
  const objective = String(input.objective ?? "").trim();

  const missingFields = [
    !lessonTitle ? "Lesson Title" : null,
    !objective ? "Objective" : null,
  ].filter(Boolean) as string[];

  const canGenerate = missingFields.length === 0 && status !== "generating" && !loadingPack;

  const sourceSummary = useMemo(() => {
    if (!curriculumPack.length && !exemplarPack.length) {
      return "No files added yet. This pass will generate from your typed lesson inputs only.";
    }

    const curriculumLabel = `${curriculumPack.length} curriculum file${curriculumPack.length === 1 ? "" : "s"}`;
    const exemplarLabel = `${exemplarPack.length} exemplar file${exemplarPack.length === 1 ? "" : "s"}`;
    return `${curriculumLabel} • ${exemplarLabel}`;
  }, [curriculumPack.length, exemplarPack.length]);

  async function onPickPack(kind: UploadKind, files: FileList | null) {
    setLoadingPack(kind);
    setMsg("");

    try {
      const uploaded = await extractFilesToUploaded(files);
      if (kind === "curriculum") {
        setCurriculumPack(uploaded);
      } else {
        setExemplarPack(uploaded);
      }
    } catch (e: any) {
      setMsg(e?.message ?? `Unable to read ${kind} files.`);
    } finally {
      setLoadingPack(null);
    }
  }

  function buildAndSaveBlueprint() {
    if (!lessonTitle || !objective) {
      throw new Error("Missing Lesson Title or Objective. Go back and fill them in.");
    }

    const blueprint = buildBlueprint({
      plan: {
        lessonTitle,
        objective,
        notes: bpNotes,
        grade: input.grade,
        subject: input.subject,
        textOrTopic: input.textOrTopic,
      },
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

      setMsg("Generating lesson package...");
      await generate(blueprint);

      navigate("/results");
    } catch (e: any) {
      setMsg(String(e?.message ?? e));
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.orchardCream,
        color: COLORS.charcoal,
        padding: "28px 20px 40px",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div
          style={{
            background: COLORS.paper,
            border: `1px solid ${COLORS.warmGray}`,
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 20px 50px rgba(63, 90, 64, 0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div style={{ maxWidth: 720 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "6px 10px",
                  borderRadius: 999,
                  background: COLORS.appleBlush,
                  color: COLORS.deepOrchard,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: 0.4,
                  textTransform: "uppercase",
                  marginBottom: 12,
                }}
              >
                Blueprint Review
              </div>

              <h1
                style={{
                  margin: 0,
                  fontFamily: '"Playfair Display", serif',
                  fontSize: 34,
                  lineHeight: 1.1,
                  color: COLORS.deepOrchard,
                }}
              >
                Shape the lesson package before generation
              </h1>

              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "rgba(47,47,47,0.78)",
                }}
              >
                This step turns your lesson inputs and uploaded materials into the Blueprint that controls structure,
                pacing, and teacher-facing direction.
              </p>
            </div>

            <div
              style={{
                minWidth: 240,
                background: COLORS.orchardCream,
                border: `1px solid ${COLORS.warmGray}`,
                borderRadius: 18,
                padding: 14,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: COLORS.deepOrchard, marginBottom: 8 }}>
                CURRENT PLAN
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6 }}>
                <div><strong>Title:</strong> {lessonTitle || "Missing lesson title"}</div>
                <div><strong>Objective:</strong> {objective || "Missing objective"}</div>
                <div><strong>Grade / Subject:</strong> {input.grade} • {input.subject}</div>
                <div><strong>Text / Topic:</strong> {String(input.textOrTopic ?? "").trim() || "Not added yet"}</div>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 22,
              background: "linear-gradient(180deg, rgba(242,192,120,0.18) 0%, rgba(247,214,208,0.18) 100%)",
              border: `1px solid ${COLORS.warmGray}`,
              borderRadius: 20,
              padding: 18,
            }}
          >
            <div
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: 22,
                color: COLORS.deepOrchard,
                marginBottom: 8,
              }}
            >
              Teacher notes for the Blueprint
            </div>

            <div style={{ fontSize: 13, color: "rgba(47,47,47,0.72)", marginBottom: 10 }}>
              Add pacing reminders, classroom routines, or any always-include guidance you want carried into generation.
            </div>

            <textarea
              value={bpNotes}
              onChange={(e) => setBpNotes(e.target.value)}
              placeholder="Example: keep the mini lesson short, add clear transition language, and build in a fast exit check."
              style={{
                width: "100%",
                minHeight: 110,
                borderRadius: 16,
                border: `1px solid ${COLORS.warmGray}`,
                background: COLORS.paper,
                padding: 14,
                fontSize: 14,
                lineHeight: 1.5,
                color: COLORS.charcoal,
                resize: "vertical",
                outline: "none",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
              marginTop: 22,
            }}
          >
            <UploadZone
              kind="curriculum"
              title="Curriculum Pack"
              subtitle="Upload the materials that define what must be taught."
              accent={COLORS.moss}
              inputId="blueprint-curriculum-upload"
              dragging={draggingKind === "curriculum"}
              onPick={onPickPack}
              onDragState={setDraggingKind}
            />

            <UploadZone
              kind="exemplar"
              title="Exemplar Pack"
              subtitle="Upload model slides, pacing decks, or other structure examples."
              accent={COLORS.warmHoney}
              inputId="blueprint-exemplar-upload"
              dragging={draggingKind === "exemplar"}
              onPick={onPickPack}
              onDragState={setDraggingKind}
            />
          </div>

          <div
            style={{
              marginTop: 18,
              padding: "12px 14px",
              borderRadius: 16,
              background: COLORS.orchardCream,
              border: `1px solid ${COLORS.warmGray}`,
              fontSize: 13,
              color: "rgba(47,47,47,0.78)",
            }}
          >
            {loadingPack ? `Reading ${loadingPack} files...` : sourceSummary}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 16,
              marginTop: 18,
            }}
          >
            <PackSummary
              title="Curriculum Files"
              accent={COLORS.moss}
              files={curriculumPack}
              emptyText="No curriculum files added yet."
            />

            <PackSummary
              title="Exemplar Files"
              accent={COLORS.warmHoney}
              files={exemplarPack}
              emptyText="No exemplar files added yet."
            />
          </div>

          {(errorMessage || msg) && (
            <div
              style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 16,
                border: `1px solid ${errorMessage ? COLORS.cranberry : COLORS.warmGray}`,
                background: errorMessage ? "rgba(184,84,90,0.08)" : COLORS.orchardCream,
                color: errorMessage ? COLORS.cranberry : COLORS.charcoal,
                whiteSpace: "pre-wrap",
                lineHeight: 1.5,
              }}
            >
              {errorMessage || msg}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
              marginTop: 22,
            }}
          >
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "12px 16px",
                borderRadius: 14,
                border: `1px solid ${COLORS.warmGray}`,
                background: COLORS.paper,
                color: COLORS.charcoal,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Back to Lesson Inputs
            </button>

            <button
              onClick={onGenerate}
              disabled={!canGenerate}
              style={{
                padding: "12px 18px",
                borderRadius: 14,
                border: "none",
                background: canGenerate ? COLORS.deepOrchard : COLORS.warmGray,
                color: COLORS.paper,
                fontWeight: 800,
                cursor: canGenerate ? "pointer" : "not-allowed",
                boxShadow: canGenerate ? "0 12px 24px rgba(63, 90, 64, 0.18)" : "none",
              }}
            >
              {status === "generating" ? "Generating Lesson Package..." : "Generate Lesson"}
            </button>

            {!canGenerate && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 14px",
                  borderRadius: 14,
                  background: "rgba(184,84,90,0.08)",
                  border: "1px solid #F1C5C8",
                  color: "#B8545A",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {loadingPack
                  ? `Please wait while ${loadingPack} files finish loading.`
                  : `Generate is locked until these are filled in on Lesson Inputs: ${missingFields.join(", ")}.`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
