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
  orchardPrimaryButtonStyle,
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

function normalizeText(value: string) {
  return String(value || "").toLowerCase();
}

function collectSignals(items: UploadedTextFile[]) {
  const joined = items
    .map((item) => `${item.name} ${item.text || ""}`)
    .join(" | ")
    .toLowerCase();

  return {
    intervention: /\b(intervention|tier 2|tier 3|remediation|reteach|below level|support)\b/.test(joined),
    enrichment: /\b(enrichment|extension|above level|challenge|advanced)\b/.test(joined),
    phonics: /\b(phonics|cvc|decodable|letter sound|segment|blend)\b/.test(joined),
    comprehension: /\b(comprehension|close read|main idea|retell|story|infer)\b/.test(joined),
    slides: /\b(slides|deck|powerpoint|ppt|pptx)\b/.test(joined),
    worksheet: /\b(worksheet|printable|handout|practice page)\b/.test(joined),
  };
}

function buildClarificationNotes(curriculumItems: UploadedTextFile[], exemplarItems: UploadedTextFile[], lessonNotes: string) {
  const notes: string[] = [];
  const curriculumSignals = collectSignals(curriculumItems);
  const exemplarSignals = collectSignals(exemplarItems);
  const teacherNotes = normalizeText(lessonNotes);

  if (curriculumItems.length > 0 && exemplarItems.length === 0) {
    notes.push("You added curriculum sources but no exemplars. The lesson can still generate, but pacing and structure will rely more heavily on the default framework.");
  }

  if (exemplarItems.length > 0 && curriculumItems.length === 0) {
    notes.push("You added exemplars but no curriculum sources. The generator may mirror structure well, but the actual content may stay generic unless curriculum materials are added.");
  }

  if (curriculumSignals.intervention && exemplarSignals.enrichment) {
    notes.push("Your curriculum looks intervention-oriented while your exemplars look enrichment-oriented. That may pull the lesson in two different directions.");
  }

  if (curriculumSignals.enrichment && exemplarSignals.intervention) {
    notes.push("Your curriculum looks enrichment-oriented while your exemplars look intervention-oriented. That may create a mismatch in level and pacing.");
  }

  if (curriculumSignals.phonics && exemplarSignals.comprehension) {
    notes.push("Your curriculum appears phonics-focused while your exemplars appear comprehension-focused. Clarify which should drive the main lesson goal.");
  }

  if (curriculumSignals.comprehension && exemplarSignals.phonics) {
    notes.push("Your curriculum appears comprehension-focused while your exemplars appear phonics-focused. Clarify whether the generator should prioritize meaning work or skill/decoding work.");
  }

  if (curriculumSignals.worksheet && exemplarSignals.slides) {
    notes.push("Your curriculum looks worksheet/handout-heavy while your exemplars look slide/deck-heavy. That could affect how interactive the final lesson feels.");
  }

  if (teacherNotes.includes("keep it simple") && exemplarSignals.enrichment) {
    notes.push("Your lesson notes ask for a simpler lesson, but the exemplars may be pushing toward a more advanced structure.");
  }

  if ((teacherNotes.includes("intervention") || teacherNotes.includes("reteach")) && exemplarSignals.enrichment) {
    notes.push("Your notes suggest intervention or reteach support, but the exemplars may be modeling a more advanced or extension-style lesson.");
  }

  if ((teacherNotes.includes("extension") || teacherNotes.includes("enrichment")) && curriculumSignals.intervention) {
    notes.push("Your notes suggest enrichment, but the curriculum materials may be signaling intervention-level support.");
  }

  return notes;
}

function itemTypeLabel(item: UploadedTextFile) {
  const kind = String(item.kind || "").toLowerCase();
  const name = String(item.name || "").toLowerCase();

  if (kind === "url" || name.includes("http://") || name.includes("https://")) return "Link";
  if (name.endsWith(".pdf") || kind.includes("pdf")) return "PDF";
  if (name.endsWith(".ppt") || name.endsWith(".pptx") || kind.includes("presentation")) return "Slides";
  if (name.endsWith(".docx") || name.endsWith(".doc")) return "Document";
  if (name.endsWith(".txt") || name.endsWith(".md") || kind.startsWith("text/")) return "Text";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png") || name.endsWith(".webp") || kind.startsWith("image/")) return "Image";
  return "File";
}

function hasFallbackOnlyText(item: UploadedTextFile) {
  const text = String(item.text || "");
  return /uploaded:/i.test(text) || /extraction is not available yet/i.test(text);
}

function UploadItemCard({
  item,
  onRemove,
}: {
  item: UploadedTextFile;
  onRemove: () => void;
}) {
  const fallbackOnly = hasFallbackOnlyText(item);

  return (
    <div
      style={{
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        background: "#FFFDF9",
        padding: 12,
        boxShadow: "0 3px 8px rgba(47,47,47,0.03)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 800, color: COLORS.heading, marginBottom: 4, wordBreak: "break-word" }}>
            {item.name}
          </div>
          <div style={{ fontSize: 12, color: COLORS.muted }}>
            {itemTypeLabel(item)} · {fallbackOnly ? "Fallback note only" : "Text available"}
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          style={{
            border: `1px solid ${COLORS.border}`,
            background: "#FFF6F4",
            color: COLORS.heading,
            borderRadius: 12,
            padding: "6px 10px",
            fontWeight: 700,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          Remove
        </button>
      </div>

      <div
        style={{
          fontSize: 12,
          color: COLORS.muted,
          lineHeight: 1.5,
          background: "#FFFCF7",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: 10,
        }}
      >
        {String(item.text || "").slice(0, 180) || "No text extracted."}
        {String(item.text || "").length > 180 ? "..." : ""}
      </div>
    </div>
  );
}

function UploadDropZone({
  title,
  subtitle,
  files,
  onFilesChosen,
  onRemoveItem,
  linksValue,
  onLinksChange,
}: {
  title: string;
  subtitle: string;
  files: UploadedTextFile[];
  onFilesChosen: (files: FileList | null) => Promise<void>;
  onRemoveItem: (index: number) => void;
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

      <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.55, marginBottom: 10 }}>
        <b>Attached items:</b> {files.length}
      </div>

      {files.length > 0 ? (
        <div style={{ display: "grid", gap: 10 }}>
          {files.map((item, index) => (
            <UploadItemCard
              key={`${item.name}-${index}`}
              item={item}
              onRemove={() => onRemoveItem(index)}
            />
          ))}
        </div>
      ) : (
        <div style={{ fontSize: 12, color: COLORS.muted }}>No files or links added yet.</div>
      )}
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
    setMaterialsPack((current) => [...current, ...uploaded]);
  }

  async function onPickExemplar(files: FileList | null) {
    const uploaded = await filesToUploaded(files);
    setExemplarPack((current) => [...current, ...uploaded]);
  }

  function removeCurriculumItem(index: number) {
    const fileCount = materialsPack.length;
    if (index < fileCount) {
      setMaterialsPack((current) => current.filter((_, i) => i !== index));
      return;
    }

    const linkIndex = index - fileCount;
    const links = String(curriculumLinks || "")
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((_, i) => i !== linkIndex);

    setCurriculumLinks(links.join("\n"));
  }

  function removeExemplarItem(index: number) {
    const fileCount = exemplarPack.length;
    if (index < fileCount) {
      setExemplarPack((current) => current.filter((_, i) => i !== index));
      return;
    }

    const links = String(exemplarLinks || "")
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((_, i) => i !== index - fileCount);

    setExemplarLinks(links.join("\n"));
  }

  const finalCurriculumItems = useMemo(
    () => [...materialsPack, ...makeUrlItems(curriculumLinks, "curriculum")],
    [materialsPack, curriculumLinks]
  );

  const finalExemplarItems = useMemo(
    () => [...exemplarPack, ...makeUrlItems(exemplarLinks, "exemplar")],
    [exemplarPack, exemplarLinks]
  );

  const clarificationNotes = useMemo(
    () => buildClarificationNotes(finalCurriculumItems, finalExemplarItems, lessonNotes),
    [finalCurriculumItems, finalExemplarItems, lessonNotes]
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
              onRemoveItem={removeCurriculumItem}
              linksValue={curriculumLinks}
              onLinksChange={setCurriculumLinks}
            />

            <UploadDropZone
              title="Exemplar Sources"
              subtitle="Use this for model lessons, example decks, teaching flow references, pacing cues, and structure examples."
              files={finalExemplarItems}
              onFilesChosen={onPickExemplar}
              onRemoveItem={removeExemplarItem}
              linksValue={exemplarLinks}
              onLinksChange={setExemplarLinks}
            />
          </div>
        </div>

        <div
          style={{
            ...orchardCardStyle(),
            background: clarificationNotes.length ? "#FFF8EE" : "#F8FBF7",
            border: `1px solid ${clarificationNotes.length ? COLORS.warnBorder : COLORS.border}`,
          }}
        >
          <div style={{ ...orchardSectionTitleStyle(), marginBottom: 8 }}>
            Clarification Check
          </div>

          {clarificationNotes.length ? (
            <>
              <div style={{ ...orchardHelpTextStyle(), marginBottom: 10, color: COLORS.heading }}>
                The generator can still continue, but these signals may be pulling the lesson in different directions:
              </div>
              <ul style={{ margin: "0 0 12px 18px", padding: 0, lineHeight: 1.7, color: COLORS.text }}>
                {clarificationNotes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
              <div style={{ ...orchardHelpTextStyle(), fontSize: 13 }}>
                Add a note below if you want to explicitly tell the generator which source should lead.
              </div>
            </>
          ) : (
            <div style={orchardHelpTextStyle()}>
              No obvious conflicts detected yet. Curriculum and exemplar signals look reasonably aligned based on the current filenames, extracted text, and notes.
            </div>
          )}
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
