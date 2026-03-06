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

function inferSlideType(title?: string, purpose?: string): SlideType | null {
  const text = `${title || ""} ${purpose || ""}`.toLowerCase();
  if (!text.trim()) return null;
  if (/title|welcome|opening|launch|lesson hub/.test(text)) return "title";
  if (/objective|i can|target/.test(text)) return "objective";
  if (/question|talk|discussion|bridge|connection|navigation/.test(text)) return "discussion";
  if (/teach|direct instruction|mini lesson|read aloud|phonics/.test(text)) return "mini-lesson";
  if (/model|think aloud/.test(text)) return "modeling";
  if (/guided|we do/.test(text)) return "guided";
  if (/practice|independent|center|rotation/.test(text)) return "practice";
  if (/exit|assessment|ticket|closure|reflection|check for understanding/.test(text)) return "exit-ticket";
  return null;
}

function formatCue(cue: PresenterCue): string {
  const label = cue.type === "timer" && cue.timeSeconds ? `Timer cue: ${cue.timeSeconds}s` : `${cue.type} cue`;
  return `${label} - ${cue.rawText}`;
}

function uniq<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

export function buildLessonSpec(input: LessonInput, blueprint?: LessonBlueprint | null): LessonSpec {
  void input;

  if (!blueprint) {
    return {
      frameworkApplied: "linear",
      slideOrder: DEFAULT_ORDER,
      teacherNoteAdditions: {},
      sectionNames: ["Launch", "Teach", "Practice", "Assessment"],
    };
  }

  const ordered = (blueprint.synthesis?.slides || [])
    .map((slide) => inferSlideType(slide.title, slide.purpose))
    .filter((value): value is SlideType => Boolean(value));

  const frameworkApplied = blueprint.synthesis?.frameworkApplied || "linear";

  let slideOrder: SlideType[];
  if (ordered.length >= 4) {
    slideOrder = uniq(ordered);
    if (!slideOrder.includes("exit-ticket")) slideOrder.push("exit-ticket");
  } else if (frameworkApplied === "clickableHub") {
    slideOrder = ["title", "discussion", "objective", "mini-lesson", "modeling", "guided", "practice", "exit-ticket"];
  } else if (frameworkApplied === "guidepost") {
    slideOrder = ["title", "objective", "discussion", "mini-lesson", "guided", "practice", "exit-ticket"];
  } else {
    slideOrder = DEFAULT_ORDER;
  }

  const teacherNoteAdditions: Partial<Record<SlideType, string[]>> = {};

  (blueprint.exemplar?.presenterCues || []).slice(0, 10).forEach((cue, index) => {
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
    teacherNoteAdditions[target]!.push(formatCue(cue));
  });

  if (frameworkApplied === "clickableHub") {
    teacherNoteAdditions.title = [...(teacherNoteAdditions.title || []), "Use the hub slide to preview lesson pathways before direct instruction."];
    teacherNoteAdditions.practice = [...(teacherNoteAdditions.practice || []), "Send students through center or station choices before closing."];
  }

  if (frameworkApplied === "guidepost") {
    teacherNoteAdditions.discussion = [...(teacherNoteAdditions.discussion || []), "Use a bridge or connection moment before direct teaching."];
    teacherNoteAdditions.exit-ticket = [...(teacherNoteAdditions["exit-ticket"] || []), "Close with reflection tied to the guidepost structure."];
  }

  const sectionNames = (blueprint.synthesis?.slides || [])
    .map((slide) => slide.purpose || slide.title)
    .filter(Boolean)
    .slice(0, 8);

  return {
    frameworkApplied,
    slideOrder,
    teacherNoteAdditions,
    sectionNames: sectionNames.length ? sectionNames : ["Launch", "Teach", "Practice", "Assessment"],
  };
}
