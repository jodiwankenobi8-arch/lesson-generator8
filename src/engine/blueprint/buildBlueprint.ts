import { LessonBlueprint, PlanInput, UploadedTextFile } from "./types";
import { detectFramework, extractPresenterCues } from "./exemplarAnalysis";
import { extractCoverageFromCurriculum } from "../curriculum/extractCoverageFromCurriculum";

function mkId(prefix: string) {
  return prefix + "_" + Math.random().toString(36).slice(2, 10);
}

export function buildBlueprint(args: {
  plan: PlanInput;
  curriculumFiles: UploadedTextFile[];
  exemplarFiles: UploadedTextFile[];
}): LessonBlueprint {
  const createdAtISO = new Date().toISOString();

  const extracted = extractCoverageFromCurriculum(args.curriculumFiles);
  const curriculumChecklist = (extracted.items ?? []).map(i => ({
    id: i.id,
    title: i.title,
    required: i.required,
    placed: false,
  }));
const exemplarTextAll = (args.exemplarFiles ?? []).map(f => f.text ?? "").join("\n\n");
  const frameworkDetection = detectFramework(exemplarTextAll);
  const presenterCues = args.exemplarFiles.flatMap(f => extractPresenterCues(f.text ?? "", f.name));

  const frameworkApplied =
    args.exemplarFiles.length && frameworkDetection.confidence >= 0.7
      ? frameworkDetection.framework
      : "linear";

  // MVP slide skeleton (next step: map curriculum items into specific sections/slots)
  const slides = [
    { index: 1, title: args.plan.lessonTitle || "Lesson", purpose: "Title", source: "ai" as const, uses: [{ source: "plan" as const, ref: "lessonTitle" }] },
    { index: 2, title: "I Can", purpose: "Objective", source: "ai" as const, uses: [{ source: "plan" as const, ref: "objective" }] },
    { index: 3, title: "Teach", purpose: "Direct instruction", source: "ai" as const, uses: curriculumChecklist[0] ? [{ source: "curriculum" as const, ref: curriculumChecklist[0].id, note: "First curriculum item (MVP placement)" }] : [] },
    { index: 4, title: "Model", purpose: "Teacher model", source: "ai" as const },
    { index: 5, title: "Practice", purpose: "Guided/Independent", source: "ai" as const, presenterCues: presenterCues.slice(0, 3) },
    { index: 6, title: "Exit Ticket", purpose: "Check for understanding", source: "ai" as const },
  ];

  if (curriculumChecklist[0]) curriculumChecklist[0].placed = true;

  return {
    createdAtISO,
    plan: { input: args.plan },
    curriculum: {
      files: (args.curriculumFiles ?? []).map(f => ({ name: f.name, kind: f.kind })),
      coverageChecklist: curriculumChecklist,
    },
    exemplar: {
      files: (args.exemplarFiles ?? []).map(f => ({ name: f.name, kind: f.kind })),
      frameworkDetection,
      presenterCues,
    },
    synthesis: {
      frameworkApplied,
      slides,
      notes: "Blueprint MVP:  Separation is locked. Next: curriculum item extraction + mapping into sections + hub framework builder. | " + extracted.summary,
    },
  };
}



