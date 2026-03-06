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
  if (/title|welcome|opening/.test(text)) return "title";
  if (/objective|i can|target/.test(text)) return "objective";
  if (/question|talk|discussion|turn and talk|hook/.test(text)) return "discussion";
  if (/teach|direct instruction|mini lesson|read aloud|phonics/.test(text)) return "mini-lesson";
  if (/model|think aloud/.test(text)) return "modeling";
  if (/guided|we do/.test(text)) return "guided";
  if (/practice|independent|center/.test(text)) return "practice";
  if (/exit|assessment|ticket|check for understanding/.test(text)) return "exit-ticket";
  return null;
}

function formatCue(cue: PresenterCue): string {
  const label = cue.type === "timer" && cue.timeSeconds ? `Timer cue: ${cue.timeSeconds}s` : `${cue.type} cue`;
  return `${label} - ${cue.rawText}`;
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

  const slideOrder = Array.from(new Set([...ordered, ...DEFAULT_ORDER]));
  const teacherNoteAdditions: Partial<Record<SlideType, string[]>> = {};

  (blueprint.exemplar?.presenterCues || []).slice(0, 8).forEach((cue, index) => {
    const target: SlideType = cue.type === "timer"
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

  const sectionNames = (blueprint.synthesis?.slides || [])
    .map((slide) => slide.purpose || slide.title)
    .filter(Boolean)
    .slice(0, 6);

  return {
    frameworkApplied: blueprint.synthesis?.frameworkApplied || "linear",
    slideOrder,
    teacherNoteAdditions,
    sectionNames: sectionNames.length ? sectionNames : ["Launch", "Teach", "Practice", "Assessment"],
  };
}
