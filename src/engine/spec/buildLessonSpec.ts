import type { LessonInput, SlideType } from "../types";
import type { LessonBlueprint, PresenterCue } from "../blueprint/types";

export interface LessonSpec {
  frameworkApplied: "linear" | "clickableHub" | "guidepost" | "unknown";
  slideOrder: SlideType[];
  teacherNoteAdditions: Partial<Record<SlideType, string[]>>;
  sectionNames: string[];
}

const DEFAULT_ORDER: SlideType[] = [
  "title",
  "objective",
  "discussion",
  "mini-lesson",
  "modeling",
  "guided",
  "practice",
  "exit-ticket",
];

function isTeacherLedEarlyElementary(input: LessonInput, blueprint?: LessonBlueprint | null) {
  const grade = String(input.grade || blueprint?.plan?.input?.grade || "").trim().toLowerCase();
  return /^(k|kg|kindergarten|grade k|grade kindergarten|1|1st|first|grade 1|grade first)$/.test(grade);
}

function normalizeSlideType(value?: string | null): SlideType | null {
  const normalized = String(value || "").trim().toLowerCase();

  switch (normalized) {
    case "title":
    case "welcome":
    case "launch":
      return "title";
    case "objective":
    case "objectives":
    case "i can":
      return "objective";
    case "discussion":
    case "essential question":
    case "bridge":
    case "connection and discussion":
    case "hook":
    case "navigation menu":
      return "discussion";
    case "mini-lesson":
    case "mini lesson":
    case "teach":
    case "direct instruction":
      return "mini-lesson";
    case "modeling":
    case "model":
    case "think aloud":
      return "modeling";
    case "guided":
    case "guided practice":
    case "we do":
      return "guided";
    case "practice":
    case "independent practice":
    case "center rotation":
      return "practice";
    case "exit-ticket":
    case "exit ticket":
    case "reflection":
    case "closure and exit ticket":
    case "check for understanding":
      return "exit-ticket";
    default:
      return null;
  }
}

function inferSlideType(title?: string, purpose?: string): SlideType | null {
  const text = `${title || ""} ${purpose || ""}`.toLowerCase();
  if (!text.trim()) return null;
  if (/title|welcome|opening|launch|lesson hub/.test(text)) return "title";
  if (/objective|i can|target/.test(text)) return "objective";
  if (/question|talk|discussion|bridge|connection|navigation|hook/.test(text)) return "discussion";
  if (/teach|direct instruction|mini lesson|read aloud|phonics/.test(text)) return "mini-lesson";
  if (/model|think aloud/.test(text)) return "modeling";
  if (/guided|we do/.test(text)) return "guided";
  if (/practice|independent|center|rotation/.test(text)) return "practice";
  if (/exit|assessment|ticket|closure|reflection|check for understanding/.test(text)) return "exit-ticket";
  return null;
}

function cleanCueText(raw: string) {
  return String(raw || "")
    .replace(/[\u2022•]+/g, " ")
    .replace(/[?]+/g, "")
    .replace(/\s+/g, " ")
    .replace(/^[-\s]+/, "")
    .replace(/\b(clicker|timer|script|transition)\s*:\s*/gi, "")
    .trim();
}

function formatCue(cue: PresenterCue): string {
  const cleaned = cleanCueText(cue.rawText);
  if (!cleaned) return "";

  if (cue.type === "timer" && cue.timeSeconds) {
    return `Keep the practice brisk. Suggested timing: about ${cue.timeSeconds} seconds.`;
  }

  if (cue.type === "clicker") {
    return `Advance slides deliberately during instruction: ${cleaned}`;
  }

  if (cue.type === "transition") {
    return `Use a clear transition cue: ${cleaned}`;
  }

  if (cue.type === "script") {
    return `Teacher wording idea: ${cleaned}`;
  }

  return cleaned;
}

function orderedUnique<T>(items: T[]): T[] {
  const seen = new Set<T>();
  const result: T[] = [];

  for (const item of items) {
    if (seen.has(item)) continue;
    seen.add(item);
    result.push(item);
  }

  return result;
}

function insertAfterFirstAvailable(list: SlideType[], slideType: SlideType, anchors: SlideType[]) {
  if (list.includes(slideType)) return list;

  const next = [...list];
  const anchor = anchors.find((item) => next.includes(item));

  if (!anchor) {
    next.push(slideType);
    return next;
  }

  const anchorIndex = next.indexOf(anchor);
  next.splice(anchorIndex + 1, 0, slideType);
  return next;
}

function ensureRequiredSlides(
  order: SlideType[],
  frameworkApplied: LessonSpec["frameworkApplied"],
  teacherLed: boolean,
): SlideType[] {
  if (teacherLed) {
    return DEFAULT_ORDER;
  }

  if (!order.length) {
    if (frameworkApplied === "clickableHub") {
      return ["title", "discussion", "objective", "mini-lesson", "modeling", "guided", "practice", "exit-ticket"];
    }

    if (frameworkApplied === "guidepost") {
      return ["title", "objective", "discussion", "mini-lesson", "guided", "practice", "exit-ticket"];
    }

    return DEFAULT_ORDER;
  }

  let next = orderedUnique(order);

  if (!next.includes("title")) {
    next.unshift("title");
  }

  next = insertAfterFirstAvailable(next, "objective", ["title"]);
  next = insertAfterFirstAvailable(next, "discussion", ["objective", "title"]);
  next = insertAfterFirstAvailable(next, "mini-lesson", ["discussion", "objective"]);
  next = insertAfterFirstAvailable(next, "modeling", ["mini-lesson"]);
  next = insertAfterFirstAvailable(next, "guided", ["modeling", "mini-lesson", "discussion"]);
  next = insertAfterFirstAvailable(next, "practice", ["guided", "modeling", "mini-lesson"]);

  if (!next.includes("exit-ticket")) {
    next.push("exit-ticket");
  }

  return orderedUnique(next);
}

export function buildLessonSpec(input: LessonInput, blueprint?: LessonBlueprint | null): LessonSpec {
  if (!blueprint) {
    return {
      frameworkApplied: "linear",
      slideOrder: DEFAULT_ORDER,
      teacherNoteAdditions: {},
      sectionNames: ["Launch", "Teach", "Practice", "Assessment"],
    };
  }

  const teacherLed = isTeacherLedEarlyElementary(input, blueprint);
  const originalFramework = blueprint.synthesis?.frameworkApplied || "linear";
  const frameworkApplied = teacherLed && originalFramework === "clickableHub" ? "linear" : originalFramework;

  const ordered = (blueprint.synthesis?.slides || [])
    .map((slide: any) => normalizeSlideType(slide.slideType || slide.sectionKey || slide.purpose) || inferSlideType(slide.title, slide.purpose))
    .filter((value): value is SlideType => Boolean(value));

  const slideOrder = ensureRequiredSlides(ordered, frameworkApplied, teacherLed);

  const teacherNoteAdditions: Partial<Record<SlideType, string[]>> = {};
  const cues = (blueprint.exemplar?.presenterCues || []).slice(0, teacherLed ? 4 : 10);

  cues.forEach((cue, index) => {
    const formatted = formatCue(cue);
    if (!formatted) return;

    const target: SlideType =
      cue.type === "timer"
        ? "guided"
        : cue.type === "transition"
          ? "practice"
          : cue.type === "script"
            ? "mini-lesson"
            : index < 2
              ? "discussion"
              : "practice";

    teacherNoteAdditions[target] = teacherNoteAdditions[target] || [];
    teacherNoteAdditions[target]!.push(formatted);
  });

  if (frameworkApplied === "clickableHub" && !teacherLed) {
    teacherNoteAdditions.title = [
      ...(teacherNoteAdditions.title || []),
      "Use the hub slide to preview lesson pathways before direct instruction.",
    ];
    teacherNoteAdditions.practice = [
      ...(teacherNoteAdditions.practice || []),
      "Send students through center or station choices before closing.",
    ];
  }

  if (frameworkApplied === "guidepost" && !teacherLed) {
    teacherNoteAdditions.discussion = [
      ...(teacherNoteAdditions.discussion || []),
      "Use a bridge or connection moment before direct teaching.",
    ];
    teacherNoteAdditions["exit-ticket"] = [
      ...(teacherNoteAdditions["exit-ticket"] || []),
      "Close with reflection tied to the guidepost structure.",
    ];
  }

  const sectionNames = (blueprint.synthesis?.slides || [])
    .map((slide: any) => String(slide.sectionKey || slide.purpose || slide.title || "").trim())
    .filter(Boolean)
    .slice(0, 8);

  return {
    frameworkApplied,
    slideOrder,
    teacherNoteAdditions,
    sectionNames: sectionNames.length ? sectionNames : ["Launch", "Teach", "Practice", "Assessment"],
  };
}
