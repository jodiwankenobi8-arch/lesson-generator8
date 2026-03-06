import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { buildBlueprint } from "../engine/blueprint/buildBlueprint";
import type { UploadedTextFile } from "../engine/blueprint/types";
import { useLessonStore } from "../state/useLessonStore";
import { filesToUploaded } from "../utils/readUploadedText";
import {
  ORCHARD_COLORS as COLORS,
  orchardShellStyle,
  orchardWrapStyle,
  orchardCardStyle,
  orchardHeroCardStyle,
  orchardSoftCardStyle,
  orchardLabelTitleStyle,
  orchardSectionTitleStyle,
  orchardHelpTextStyle,
  orchardTextareaStyle,
  orchardInputStyle,
  orchardPrimaryButtonStyle,
  orchardSecondaryButtonStyle,
  orchardLinkStyle,
  orchardRibbonHeaderStyle,
  orchardHeroTitleStyle,
  orchardStitchDividerStyle,
} from "./orchardUi";
import { WizardProgress } from "./WizardProgress";

const ACCEPT_ATTR = ".txt,.md,.doc,.docx,.pdf,.ppt,.pptx,.jpg,.jpeg,.png,.webp";

function makeUrlItems(raw: string, label: "curriculum" | "exemplar"): UploadedTextFile[] {
  return String(raw || "")
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((url, index) => ({
      name: `${label}-link-${index + 1}: ${url}`,
      kind: "url" as any,
      text: `SOURCE URL: ${url}`,
    }));
}

function fileListSummary(items: UploadedTextFile[]) {
  if (!items.length) return "none";
  return items.map((f) => f.name).join(", ");
}

function UploadDropZone({
  title,
  subtitle,
  files,
  onFilesChosen,
  linksValue,
  onLinksChange,
}: {
  title: string;
  subtitle: string;
  files: UploadedTextFile[];
  onFilesChosen: (files: FileList | null) => Promise<void>;
  linksValue: string;
  onLinksChange: (value: string) => void;
}) {
  const [dragActive, setDragActive] = useState(false);

  async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    await onFilesChosen(e.dataTransfer.files);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragEnter={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragActive(false);
      }}
      onDrop={handleDrop}
      style={{
        ...orchardSoftCardStyle(dragActive ? "#F7FBF5" : "#FFFDF9"),
        border: `2px dashed ${dragActive ? COLORS.accent : COLORS.borderStrong}`,
        background: dragActive ? "#F7FBF5" : "#FFFDF9",
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 900, color: COLORS.heading, fontSize: 16, marginBottom: 6 }}>
          {title}
        </div>
        <div style={orchardHelpTextStyle()}>{subtitle}</div>
      </div>

      <div
        style={{
          border: `1px solid ${COLORS.border}`,
          borderRadius: 18,
          padding: 18,
          background: "linear-gradient(180deg, #FFFDFC 0%, #FBF6EF 100%)",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        <div style={{ fontWeight: 800, color: COLORS.heading, marginBottom: 6 }}>
          Drag and drop files here
        </div>
        <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 10 }}>
          or choose files manually
        </div>

        <input
          type="file"
          multiple
          accept={ACCEPT_ATTR}
          onChange={(e) => onFilesChosen(e.target.files)}
          style={{ marginBottom: 8 }}
        />

        <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.5 }}>
          Accepted now: DOC, DOCX, PDF, PPT, PPTX, JPG, JPEG, PNG, WEBP, TXT, MD
        </div>
      </div>

      <label style={{ display: "block", marginBottom: 12 }}>
        <div style={orchardLabelTitleStyle()}>Website links / online sources (optional)</div>
        <textarea
          value={linksValue}
          onChange={(e) => onLinksChange(e.target.value)}
          style={orchardTextareaStyle(84)}
          placeholder="Paste one or more links here, separated by commas or new lines"
        />
      </label>

      <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.55 }}>
        <b>Attached items:</b> {fileListSummary(files)}
      </div>
    </div>
  );
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
  const [curriculumLinks, setCurriculumLinks] = useState("");
  const [exemplarLinks, setExemplarLinks] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function onPickMaterials(files: FileList | null) {
    const uploaded = await filesToUploaded(files);
    setMaterialsPack(uploaded);
  }

  async function onPickExemplar(files: FileList | null) {
    const uploaded = await filesToUploaded(files);
    setExemplarPack(uploaded);
  }

  const finalCurriculumItems = useMemo(
    () => [...materialsPack, ...makeUrlItems(curriculumLinks, "curriculum")],
    [materialsPack, curriculumLinks]
  );

  const finalExemplarItems = useMemo(
    () => [...exemplarPack, ...makeUrlItems(exemplarLinks, "exemplar")],
    [exemplarPack, exemplarLinks]
  );

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
        curriculumFiles: finalCurriculumItems,
        exemplarFiles: finalExemplarItems,
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
    <div style={orchardShellStyle()}>
      <div style={orchardWrapStyle()}>
        <WizardProgress current="materials" />

        <div style={orchardHeroCardStyle()}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <div style={{ maxWidth: 720 }}>
              <div style={orchardRibbonHeaderStyle()}>Materials + Exemplars</div>
              <div style={orchardStitchDividerStyle()} />
              <h1 style={orchardHeroTitleStyle()}>Add the lesson sources the generator should use</h1>
              <div style={{ ...orchardHelpTextStyle(), fontSize: 15 }}>
                Upload curriculum files, exemplar files, and links. These materials can change the lesson structure,
                wording, pacing cues, and output style.
              </div>
            </div>

            <div style={{ ...orchardSoftCardStyle("#FFFDF9"), minWidth: 260 }}>
              <div style={{ fontWeight: 800, color: COLORS.heading, marginBottom: 8 }}>
                Current lesson
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                <div><b>Title:</b> {input.lessonTitle || "—"}</div>
                <div><b>Objective:</b> {input.objective || "—"}</div>
                <div><b>Grade:</b> {input.grade || "—"}</div>
                <div><b>Subject:</b> {input.subject || "—"}</div>
              </div>
            </div>
          </div>
        </div>

        {missingBasics && (
          <div
            style={{
              ...orchardCardStyle(),
              background: "#FFF6E8",
              border: `1px solid ${COLORS.warnBorder}`,
            }}
          >
            <b>Heads up:</b> the Inputs page is missing required fields: Lesson Title, Objective, and Text / Topic.
            <div style={{ marginTop: 8 }}>
              <Link to="/" style={orchardLinkStyle()}>
                Go back to Inputs
              </Link>
            </div>
          </div>
        )}

        <div style={orchardCardStyle()}>
          <div style={orchardSectionTitleStyle()}>Upload Workspace</div>
          <div style={{ ...orchardHelpTextStyle(), marginBottom: 14 }}>
            Curriculum sources shape the lesson content. Exemplars shape pacing, structure, cues, and model style.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 14,
            }}
          >
            <UploadDropZone
              title="Curriculum Sources"
              subtitle="Use this for lesson materials, teacher resources, texts, decodables, slides, PDFs, images, or website links."
              files={finalCurriculumItems}
              onFilesChosen={onPickMaterials}
              linksValue={curriculumLinks}
              onLinksChange={setCurriculumLinks}
            />

            <UploadDropZone
              title="Exemplar Sources"
              subtitle="Use this for model lessons, example decks, teaching flow references, pacing cues, and structure examples."
              files={finalExemplarItems}
              onFilesChosen={onPickExemplar}
              linksValue={exemplarLinks}
              onLinksChange={setExemplarLinks}
            />
          </div>
        </div>

        <div style={orchardCardStyle()}>
          <div style={{ ...orchardSectionTitleStyle(), marginBottom: 6 }}>Lesson Notes (optional)</div>
          <div style={{ ...orchardHelpTextStyle(), marginBottom: 12 }}>
            Add pacing notes, routines, constraints, or anything the Blueprint should keep in mind while generating.
          </div>

          <label style={{ display: "block" }}>
            <div style={orchardLabelTitleStyle()}>Notes</div>
            <textarea
              value={lessonNotes}
              onChange={(e) => setLessonNotes(e.target.value)}
              style={orchardTextareaStyle(90)}
              placeholder="Pacing, special routines, constraints, or anything the blueprint should remember"
            />
          </label>
        </div>

        {(msg || errorMessage) && (
          <div
            style={{
              ...orchardCardStyle(),
              background: "#FFF2F1",
              border: "1px solid #E6B8B4",
            }}
          >
            <b>{msg ? "Message:" : "Error:"}</b> {String(msg || errorMessage)}
          </div>
        )}

        <div
          style={{
            ...orchardCardStyle(),
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={orchardHelpTextStyle()}>
            Status: <b>{status}</b> | Curriculum items: <b>{finalCurriculumItems.length}</b> | Exemplar items: <b>{finalExemplarItems.length}</b>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={onBuildAndGenerate}
              disabled={busy || status === "generating" || missingBasics}
              style={orchardPrimaryButtonStyle(busy || status === "generating" || missingBasics)}
            >
              {busy || status === "generating"
                ? "Building + Generating..."
                : "Build Blueprint + Generate Lesson + Open Results ->"}
            </button>

            <Link to="/" style={orchardLinkStyle()}>
              Back to Inputs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
