import type { LessonInput } from "./types";
import type { LessonBlueprint, FrameworkType } from "./blueprint/types";

export interface LessonContext {
  framework: FrameworkType;
  teacherLed: boolean;
  allowStudentNavigation: boolean;
  curriculumTitles: string[];
  cueText: string[];
  essentialQuestion?: string;
}

export function resolveFramework(blueprint?: LessonBlueprint | null): FrameworkType {
  return blueprint?.synthesis?.frameworkApplied || "linear";
}

export function isTeacherLedEarlyElementary(
  input: Pick<LessonInput, "grade"> & { lessonTitle?: string; objective?: string; essentialQuestion?: string; textOrTopic?: string; notes?: string },
  blueprint?: LessonBlueprint | null
): boolean {
  const grade = String(input.grade || blueprint?.plan?.input?.grade || "").trim().toLowerCase();
  if (/^(k|kg|kindergarten|grade k|grade kindergarten|1|1st|first|grade 1|grade first)$/.test(grade)) {
    return true;
  }

  const text = [
    input.lessonTitle,
    input.objective,
    input.essentialQuestion,
    input.notes,
    input.textOrTopic,
    blueprint?.plan?.input?.lessonTitle,
    blueprint?.plan?.input?.objective,
    blueprint?.plan?.input?.essentialQuestion,
    blueprint?.plan?.input?.notes,
    blueprint?.plan?.input?.textOrTopic,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return /\bkindergarten\b|\bgrade k\b|\bfirst grade\b|\bgrade 1\b|\b1st\b/.test(text);
}

export function getCurriculumTitles(blueprint?: LessonBlueprint | null): string[] {
  return (blueprint?.curriculum?.coverageChecklist || [])
    .map((item) => item.title)
    .filter(Boolean)
    .slice(0, 3);
}

export function getCueText(blueprint?: LessonBlueprint | null): string[] {
  return (blueprint?.exemplar?.presenterCues || [])
    .map((cue) => cue.rawText)
    .filter(Boolean)
    .slice(0, 4);
}

export function resolveLessonContext(input: LessonInput, blueprint?: LessonBlueprint | null): LessonContext {
  const framework = resolveFramework(blueprint);
  const teacherLed = isTeacherLedEarlyElementary(input, blueprint);

  return {
    framework,
    teacherLed,
    allowStudentNavigation: framework === "clickableHub" && !teacherLed,
    curriculumTitles: getCurriculumTitles(blueprint),
    cueText: getCueText(blueprint),
    essentialQuestion: input.essentialQuestion || blueprint?.plan?.input?.essentialQuestion,
  };
}