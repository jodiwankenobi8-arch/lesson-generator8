import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { buildBlueprint } from "../engine/blueprint/buildBlueprint";
import type { UploadedTextFile, SourceRole } from "../engine/blueprint/types";
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
import { OrchardBlossomCorner, OrchardGinghamCorner, OrchardMushroomCluster } from "./orchardDecor";

const ACCEPT_ATTR = ".txt,.md,.doc,.docx,.pdf,.ppt,.pptx,.jpg,.jpeg,.png,.webp";

function plannerSheetStyle(background: string = "#FFFDF9"): React.CSSProperties {
  return {
    ...orchardSoftCardStyle(background),
    border: `1px solid ${COLORS.border}`,
    padding: 18,
    boxShadow: "0 10px 22px rgba(47,47,47,0.05)",
    overflow: "hidden",
  };
}

function plannerTabStyle(background: string, color: string, border: string = COLORS.borderStrong): React.CSSProperties {
  return {
    display: "inline-block",
    padding: "7px 12px",
    borderRadius: "15px 16px 16px 12px",
    background,
    color,
    fontWeight: 900,
    fontSize: 11,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    border: `1px solid ${border}`,
    boxShadow: "0 4px 10px rgba(47,47,47,0.04)",
  };
}

function plannerRailCardStyle(background: string = "#FFFDF9"): React.CSSProperties {
  return {
    ...orchardSoftCardStyle(background),
    border: `1px solid ${COLORS.borderStrong}`,
    padding: 18,
    boxShadow: "0 12px 24px rgba(47,47,47,0.045)",
    alignSelf: "stretch",
  };
}

function inferRoleForSource(item: { name: string; text?: string }, pack: "curriculum" | "exemplar"): SourceRole {
  const joined = `${item.name} ${item.text ?? ""}`.toLowerCase();

  if (pack === "curriculum") {
    if (/\b(tool|game|interactive|practice site|resource)\b/.test(joined)) return "teachingTool";
    return "curriculum";
  }

  if (/\b(starfall|pbs kids|abcya|boom cards|youtube|video|game|interactive)\b/.test(joined)) {
    return "teachingTool";
  }

  if (/\b(model|exemplar|template|lesson flow|teacher guide|routine|slide deck|presentation|framework)\b/.test(joined)) {
    return "exemplar";
  }

  if (/\b(decodable|phonics|cvc|story|text|passage|student practice|worksheet|resource)\b/.test(joined)) {
    return "mixed";
  }

  return pack === "exemplar" ? "mixed" : "curriculum";
}

function roleLabel(role?: SourceRole) {
  if (role === "curriculum") return "Curriculum";
  if (role === "teachingTool") return "Teaching Tool";
  if (role === "mixed") return "Mixed / Unsure";
  return "Exemplar";
}

function makeUrlItems(raw: string, label: "curriculum" | "exemplar"): UploadedTextFile[] {
  return String(raw || "")
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((url, index) => {
      const base = {
        name: `${label}-link-${index + 1}: ${url}`,
        kind: "url" as any,
        text: `SOURCE URL: ${url}`,
      };
      return {
        ...base,
        sourceRole: inferRoleForSource(base, label),
      };
    });
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
    notes.push("You added exemplars but no curriculum sources. The generator may mirror structure well, but the actual content may stay broad unless curriculum materials are added.");
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

function describeInfluence(items: UploadedTextFile[]) {
  if (!items.length) return "none";
  const realTextCount = items.filter((item) => item.text && !hasFallbackOnlyText(item)).length;
  if (realTextCount >= 3) return "strong";
  if (realTextCount >= 1 || items.length >= 2) return "moderate";
  return "light";
}

function buildInfluenceSummary(curriculumItems: UploadedTextFile[], exemplarItems: UploadedTextFile[]) {
  const curriculumReal = curriculumItems.filter((item) => item.text && !hasFallbackOnlyText(item)).length;
  const exemplarReal = exemplarItems.filter((item) => item.text && !hasFallbackOnlyText(item)).length;
  const curriculumFallback = curriculumItems.filter((item) => !item.text || hasFallbackOnlyText(item)).length;
  const exemplarFallback = exemplarItems.filter((item) => !item.text || hasFallbackOnlyText(item)).length;
  const trueExemplarCount = exemplarItems.filter((item) => item.sourceRole === "exemplar").length;

  return {
    curriculumInfluence: describeInfluence(curriculumItems),
    exemplarInfluence: describeInfluence(exemplarItems),
    curriculumReal,
    exemplarReal,
    curriculumFallback,
    exemplarFallback,
    trueExemplarCount,
    overallMessage:
      trueExemplarCount > 0
        ? "A true exemplar is present, so the generator may use some structural inspiration from it."
        : "No strong exemplar was detected, so the generator should lean more on curriculum and the default teacher-led framework.",
  };
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
        borderRadius: 18,
        background: "#FFFDF9",
        padding: 12,
        boxShadow: "0 4px 10px rgba(47,47,47,0.03)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontWeight: 800,
              color: COLORS.heading,
              marginBottom: 4,
              wordBreak: "break-word",
            }}
          >
            {item.name}
          </div>

          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              fontSize: 11,
              fontWeight: 800,
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "5px 8px",
                borderRadius: 999,
                background: "#FFF7F2",
                border: `1px solid ${COLORS.border}`,
                color: COLORS.heading,
              }}
            >
              {itemTypeLabel(item)}
            </span>
            <span
              style={{
                display: "inline-block",
                padding: "5px 8px",
                borderRadius: 999,
                background: "#F3F8F1",
                border: `1px solid ${COLORS.successBorder}`,
                color: COLORS.heading,
              }}
            >
              {roleLabel(item.sourceRole)}
            </span>
            <span
              style={{
                display: "inline-block",
                padding: "5px 8px",
                borderRadius: 999,
                background: fallbackOnly ? "#FFF6E8" : "#FFFDF9",
                border: `1px solid ${fallbackOnly ? COLORS.warnBorder : COLORS.border}`,
                color: COLORS.muted,
              }}
            >
              {fallbackOnly ? "Fallback note only" : "Text available"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          style={{
            border: `1px solid ${COLORS.border}`,
            background: "#FFF6F4",
            color: COLORS.heading,
            borderRadius: 14,
            padding: "7px 10px",
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
          lineHeight: 1.55,
          background: "#FFFCF7",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
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
        ...plannerSheetStyle(dragActive ? "#F7FBF5" : "#FFFDF9"),
        border: `1px solid ${dragActive ? COLORS.successBorder : COLORS.border}`,
        minHeight: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={plannerTabStyle(
              title.includes("Curriculum")
                ? "linear-gradient(180deg, #F2C078 0%, #D9A85F 100%)"
                : "linear-gradient(180deg, #F7D6D0 0%, #EFC5BE 100%)",
              title.includes("Curriculum") ? "#3F3120" : COLORS.cranberry,
              title.includes("Curriculum") ? COLORS.warnBorder : COLORS.borderStrong
            )}
          >
            {title}
          </div>
          <div
            style={{
              fontWeight: 900,
              color: COLORS.heading,
              fontSize: 22,
              marginTop: 10,
              marginBottom: 6,
            }}
          >
            Add files + links to this stack
          </div>
          <div style={orchardHelpTextStyle()}>{subtitle}</div>
        </div>

        <div
          style={{
            display: "inline-block",
            padding: "6px 10px",
            borderRadius: 999,
            border: `1px solid ${COLORS.border}`,
            background: "#FFF7F2",
            color: COLORS.heading,
            fontWeight: 800,
            fontSize: 12,
          }}
        >
          {files.length} {files.length === 1 ? "item" : "items"}
        </div>
      </div>

      <div
        style={{
          position: "relative",
          border: `2px dashed ${dragActive ? COLORS.accent : COLORS.borderStrong}`,
          borderRadius: 20,
          padding: 18,
          background: dragActive ? "#F3F8F1" : "linear-gradient(180deg, #FFFDFC 0%, #FBF6EF 100%)",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            width: 16,
            height: 16,
            borderRadius: 999,
            background: "#D9C7B5",
            boxShadow: "inset 0 2px 3px rgba(47,47,47,0.15)",
          }}
        />

        <div style={{ fontWeight: 900, color: COLORS.heading, fontSize: 18, marginBottom: 6 }}>
          Drop a stack here or browse manually
        </div>
        <div style={{ ...orchardHelpTextStyle(), marginBottom: 12 }}>
          Supported now: DOC, DOCX, PDF, PPT, PPTX, JPG, JPEG, PNG, WEBP, TXT, and MD.
        </div>

        <input
          type="file"
          multiple
          accept={ACCEPT_ATTR}
          onChange={(e) => onFilesChosen(e.target.files)}
          style={{ marginBottom: 10 }}
        />

        <div
          style={{
            fontSize: 12,
            color: COLORS.muted,
            lineHeight: 1.55,
          }}
        >
          Dragging files here should feel like dropping papers into a resource tray, not a generic upload panel.
        </div>
      </div>

      <label style={{ display: "block", marginBottom: 14 }}>
        <div style={orchardLabelTitleStyle()}>Website links / online sources (optional)</div>
        <textarea
          value={linksValue}
          onChange={(e) => onLinksChange(e.target.value)}
          style={orchardTextareaStyle(88)}
          placeholder="Paste one or more links here, separated by commas or new lines"
        />
      </label>

      {files.length > 0 ? (
        <div
          style={{
            display: "grid",
            gap: 10,
          }}
        >
          {files.map((item, index) => (
            <UploadItemCard
              key={`${item.name}-${index}`}
              item={item}
              onRemove={() => onRemoveItem(index)}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            ...orchardSoftCardStyle("#FFFDF9"),
            border: `1px solid ${COLORS.border}`,
            padding: 14,
            color: COLORS.muted,
            fontSize: 13,
          }}
        >
          No files or links added yet.
        </div>
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
    setMaterialsPack((current) => [
      ...current,
      ...uploaded.map((item) => ({ ...item, sourceRole: inferRoleForSource(item, "curriculum") })),
    ]);
  }

  async function onPickExemplar(files: FileList | null) {
    const uploaded = await filesToUploaded(files);
    setExemplarPack((current) => [
      ...current,
      ...uploaded.map((item) => ({ ...item, sourceRole: inferRoleForSource(item, "exemplar") })),
    ]);
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

  const influenceSummary = useMemo(
    () => buildInfluenceSummary(finalCurriculumItems, finalExemplarItems),
    [finalCurriculumItems, finalExemplarItems]
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
          grade: input.grade ?? "",
          subject: input.subject ?? "",
          textOrTopic: input.textOrTopic ?? "",
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
          <div style={{ position: "absolute", top: 12, right: 14, pointerEvents: "none", opacity: 0.92 }}>
            <OrchardBlossomCorner size={116} flip />
          </div>
          <div style={{ position: "absolute", bottom: 8, left: 12, pointerEvents: "none", opacity: 0.8 }}>
            <OrchardGinghamCorner size={70} flip />
          </div>
          <div style={{ position: "absolute", bottom: 18, right: 18, pointerEvents: "none", opacity: 0.84 }}>
            <OrchardMushroomCluster size={88} />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.55fr) minmax(270px, 0.88fr)",
              gap: 18,
              alignItems: "start",
            }}
          >
            <div style={plannerSheetStyle("#FFFDF9")}>
              <div style={orchardRibbonHeaderStyle()}>Materials + Exemplars</div>
              <div style={orchardStitchDividerStyle()} />
              <h1 style={orchardHeroTitleStyle()}>Lay out the lesson sources on the desk</h1>
              <div style={{ ...orchardHelpTextStyle(), fontSize: 15, marginBottom: 18 }}>
                Upload curriculum files, exemplar files, and links. These materials can change the lesson structure,
                wording, pacing cues, and output style before the package is generated.
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: 12,
                }}
              >
                <div style={plannerSheetStyle("#FFF9F2")}>
                  <div style={plannerTabStyle("linear-gradient(180deg, #F2C078 0%, #D9A85F 100%)", "#3F3120", COLORS.warnBorder)}>
                    Content pull
                  </div>
                  <div style={{ fontWeight: 900, color: COLORS.heading, fontSize: 18, margin: "10px 0 6px" }}>
                    Curriculum drives what gets taught
                  </div>
                  <div style={orchardHelpTextStyle()}>
                    Use this stack for texts, teacher resources, slides, printables, and source content.
                  </div>
                </div>

                <div style={plannerSheetStyle("#FFFDF9")}>
                  <div style={plannerTabStyle("linear-gradient(180deg, #EEF5EA 0%, #E4F0DE 100%)", COLORS.heading, COLORS.successBorder)}>
                    Structure pull
                  </div>
                  <div style={{ fontWeight: 900, color: COLORS.heading, fontSize: 18, margin: "10px 0 6px" }}>
                    Exemplars guide pacing and flow
                  </div>
                  <div style={orchardHelpTextStyle()}>
                    Model decks, routines, and lesson patterns should influence the shape of the package.
                  </div>
                </div>

                <div style={plannerSheetStyle("#FFF7F4")}>
                  <div style={plannerTabStyle("linear-gradient(180deg, #F7D6D0 0%, #EFC5BE 100%)", COLORS.cranberry, COLORS.borderStrong)}>
                    Clarify first
                  </div>
                  <div style={{ fontWeight: 900, color: COLORS.heading, fontSize: 18, margin: "10px 0 6px" }}>
                    Surface conflicts instead of guessing
                  </div>
                  <div style={orchardHelpTextStyle()}>
                    If sources disagree on level, pacing, or purpose, the page should show the tension before generate.
                  </div>
                </div>
              </div>
            </div>

            <div style={plannerRailCardStyle("#FFF8EE")}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  background: "#D9C7B5",
                  boxShadow: "inset 0 2px 3px rgba(47,47,47,0.15)",
                  marginBottom: 10,
                }}
              />
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 900,
                  color: COLORS.cranberry,
                  marginBottom: 6,
                }}
              >
                Current lesson
              </div>
              <div
                style={{
                  color: COLORS.heading,
                  fontWeight: 900,
                  fontSize: 22,
                  marginBottom: 10,
                }}
              >
                Snapshot before build
              </div>

              <div style={{ fontSize: 14, lineHeight: 1.8, color: COLORS.text, marginBottom: 12 }}>
                <div><b>Title:</b> {input.lessonTitle || "Not set yet"}</div>
                <div><b>Objective:</b> {input.objective || "Not set yet"}</div>
                <div><b>Grade:</b> {input.grade || "Not set yet"}</div>
                <div><b>Subject:</b> {input.subject || "Not set yet"}</div>
              </div>

              <div
                style={{
                  display: "inline-block",
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: `1px solid ${missingBasics ? COLORS.warnBorder : COLORS.successBorder}`,
                  background: missingBasics ? "#FFF6E8" : "#F3F8F1",
                  color: COLORS.heading,
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                {missingBasics ? "Inputs still need core fields" : "Inputs look ready to build"}
              </div>
            </div>
          </div>
        </div>

        {missingBasics && (
          <div
            style={{
              ...plannerRailCardStyle("#FFF8EE"),
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: 12,
              background: "#FFF8EE",
              border: `1px solid ${COLORS.warnBorder}`,
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 900,
                color: COLORS.cranberry,
                marginBottom: 6,
              }}
            >
              Heads up
            </div>
            <div style={{ fontWeight: 900, color: COLORS.heading, fontSize: 22, marginBottom: 8 }}>
              Inputs is still missing required fields
            </div>
            <div style={orchardHelpTextStyle()}>
              Lesson Title, Objective, and Text / Topic are still needed for the strongest build.
            </div>
            <div style={{ marginTop: 10 }}>
              <Link to="/" style={orchardLinkStyle()}>
                Go back to Inputs
              </Link>
            </div>
          </div>
        )}

        <div style={orchardCardStyle("#FFF8F1")}>
          <div style={{ position: "absolute", top: 12, right: 14, pointerEvents: "none", opacity: 0.8 }}>
            <OrchardGinghamCorner size={70} />
          </div>
          <div style={{ position: "absolute", bottom: 12, left: 14, pointerEvents: "none", opacity: 0.9 }}>
            <OrchardMushroomCluster size={92} />
          </div>

          <div style={{ ...orchardSectionTitleStyle(), marginBottom: 6 }}>Sorting Desk</div>
          <div style={{ ...orchardHelpTextStyle(), marginBottom: 16 }}>
            Arrange the two main stacks like planner materials on a desk: curriculum for content, exemplars for structure and pacing.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
              gap: 16,
            }}
          >
            <UploadDropZone
              title="Curriculum Stack"
              subtitle="Use this for lesson materials, teacher resources, texts, decodables, slides, PDFs, images, or website links."
              files={finalCurriculumItems}
              onFilesChosen={onPickMaterials}
              onRemoveItem={removeCurriculumItem}
              linksValue={curriculumLinks}
              onLinksChange={setCurriculumLinks}
            />

            <UploadDropZone
              title="Exemplar Stack"
              subtitle="Use this for model lessons, example decks, teaching flow references, pacing cues, and structure examples."
              files={finalExemplarItems}
              onFilesChosen={onPickExemplar}
              onRemoveItem={removeExemplarItem}
              linksValue={exemplarLinks}
              onLinksChange={setExemplarLinks}
            />
          </div>
        </div>

        <div style={orchardCardStyle("#FFFDF9")}>
          <div style={{ ...orchardSectionTitleStyle(), marginBottom: 6 }}>Generator Readout</div>
          <div style={{ ...orchardHelpTextStyle(), marginBottom: 16 }}>
            This is the pre-build gut check: what the sources seem to influence, whether anything conflicts, and any notes you want the blueprint to keep in view.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.35fr) minmax(260px, 0.82fr)",
              gap: 16,
              alignItems: "start",
            }}
          >
            <div
              style={{
                display: "grid",
                gap: 16,
              }}
            >
              <div style={plannerSheetStyle("#F8FBF7")}>
                <div style={plannerTabStyle("linear-gradient(180deg, #EEF5EA 0%, #E4F0DE 100%)", COLORS.heading, COLORS.successBorder)}>
                  Source Influence Preview
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 12,
                    marginTop: 14,
                    marginBottom: 12,
                  }}
                >
                  <div style={plannerSheetStyle("#FFFDF9")}>
                    <div style={{ fontWeight: 800, color: COLORS.heading, marginBottom: 6 }}>Content pull</div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: COLORS.heading, marginBottom: 4 }}>
                      {influenceSummary.curriculumInfluence}
                    </div>
                    <div style={orchardHelpTextStyle()}>
                      {influenceSummary.curriculumReal} text-rich item(s), {influenceSummary.curriculumFallback} fallback-only item(s)
                    </div>
                  </div>

                  <div style={plannerSheetStyle("#FFFDF9")}>
                    <div style={{ fontWeight: 800, color: COLORS.heading, marginBottom: 6 }}>Structure pull</div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: COLORS.heading, marginBottom: 4 }}>
                      {influenceSummary.exemplarInfluence}
                    </div>
                    <div style={orchardHelpTextStyle()}>
                      {influenceSummary.exemplarReal} text-rich item(s), {influenceSummary.exemplarFallback} fallback-only item(s)
                    </div>
                  </div>
                </div>

                <div style={orchardHelpTextStyle()}>{influenceSummary.overallMessage}</div>
              </div>

              <div
                style={{
                  ...plannerSheetStyle(clarificationNotes.length ? "#FFF8EE" : "#F8FBF7"),
                  border: `1px solid ${clarificationNotes.length ? COLORS.warnBorder : COLORS.border}`,
                }}
              >
                <div
                  style={plannerTabStyle(
                    clarificationNotes.length
                      ? "linear-gradient(180deg, #F2C078 0%, #D9A85F 100%)"
                      : "linear-gradient(180deg, #EEF5EA 0%, #E4F0DE 100%)",
                    clarificationNotes.length ? "#3F3120" : COLORS.heading,
                    clarificationNotes.length ? COLORS.warnBorder : COLORS.successBorder
                  )}
                >
                  Clarification Check
                </div>

                {clarificationNotes.length ? (
                  <>
                    <div style={{ ...orchardHelpTextStyle(), marginTop: 12, marginBottom: 10, color: COLORS.heading }}>
                      The generator can still continue, but these signals may be pulling the lesson in different directions:
                    </div>
                    <ul style={{ margin: "0 0 12px 18px", padding: 0, lineHeight: 1.7, color: COLORS.text }}>
                      {clarificationNotes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                    <div style={{ ...orchardHelpTextStyle(), fontSize: 13 }}>
                      Add a note on the right if you want to explicitly tell the generator which source should lead.
                    </div>
                  </>
                ) : (
                  <div style={{ ...orchardHelpTextStyle(), marginTop: 12 }}>
                    No obvious conflicts detected yet. Curriculum and exemplar signals look reasonably aligned based on the current filenames, extracted text, and notes.
                  </div>
                )}
              </div>
            </div>

            <div style={plannerRailCardStyle("#FFF8EE")}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 999,
                  background: "#D9C7B5",
                  boxShadow: "inset 0 2px 3px rgba(47,47,47,0.15)",
                  marginBottom: 10,
                }}
              />
              <div style={plannerTabStyle("linear-gradient(180deg, #F7D6D0 0%, #EFC5BE 100%)", COLORS.cranberry, COLORS.borderStrong)}>
                Lesson Notes
              </div>
              <div style={{ ...orchardHelpTextStyle(), marginTop: 12, marginBottom: 12 }}>
                Add pacing notes, routines, constraints, or anything the blueprint should remember while generating.
              </div>

              <label style={{ display: "block" }}>
                <div style={orchardLabelTitleStyle()}>Notes</div>
                <textarea
                  value={lessonNotes}
                  onChange={(e) => setLessonNotes(e.target.value)}
                  style={orchardTextareaStyle(220)}
                  placeholder="Pacing, special routines, constraints, or anything the blueprint should remember"
                />
              </label>
            </div>
          </div>
        </div>

        {(msg || errorMessage) && (
          <div
            style={{
              ...orchardCardStyle("#FFF2F1"),
              border: "1px solid #E6B8B4",
            }}
          >
            <b>{msg ? "Message:" : "Error:"}</b> {String(msg || errorMessage)}
          </div>
        )}

        <div style={orchardCardStyle("#FFF9F2")}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.25fr) auto",
              gap: 16,
              alignItems: "center",
            }}
          >
            <div>
              <div style={orchardSectionTitleStyle()}>Build the package</div>
              <div style={orchardHelpTextStyle()}>
                Status: <b>{status}</b> | Curriculum items: <b>{finalCurriculumItems.length}</b> | Exemplar items: <b>{finalExemplarItems.length}</b>
              </div>
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
    </div>
  );
}


