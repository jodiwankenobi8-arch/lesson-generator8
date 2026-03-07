import { LessonBlueprint, PlanInput, UploadedTextFile } from "./types";
import { detectFramework, extractPresenterCues } from "./exemplarAnalysis";
import { extractCoverageFromCurriculum } from "../curriculum/extractCoverageFromCurriculum";

function isTeacherLedEarlyElementary(plan: PlanInput) {
  const grade = String(plan.grade || "").trim().toUpperCase();
  if (grade === "K" || grade === "1") return true;

  const text = `${plan.lessonTitle || ""} ${plan.objective || ""} ${plan.notes || ""} ${plan.textOrTopic || ""}`.toLowerCase();
  return /\bkindergarten\b|\bgrade k\b|\bfirst grade\b|\bgrade 1\b|\b1st\b/.test(text);
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

  const trueExemplarFiles = (args.exemplarFiles ?? []).filter(
    f => (f.sourceRole ?? "exemplar") === "exemplar"
  );
  const mixedExemplarFiles = (args.exemplarFiles ?? []).filter(
    f => (f.sourceRole ?? "exemplar") === "mixed"
  );

  const exemplarTextAll = trueExemplarFiles.map(f => f.text ?? "").join("\n\n");
  const frameworkDetection = detectFramework(exemplarTextAll);

  const presenterCueFiles = [...trueExemplarFiles, ...mixedExemplarFiles];
  const presenterCues = presenterCueFiles.flatMap(f => extractPresenterCues(f.text ?? "", f.name));

  const hasTrueExemplar = trueExemplarFiles.length > 0;
  const hasCurriculum = curriculumChecklist.length > 0;
  const teacherLedEarlyElementary = isTeacherLedEarlyElementary(args.plan);

  const frameworkApplied =
    teacherLedEarlyElementary
      ? "linear"
      : hasTrueExemplar
        ? (frameworkDetection.framework !== "linear" ? frameworkDetection.framework : "clickableHub")
        : "linear";

  const defaultSlides = [
    { index: 1, title: args.plan.lessonTitle || "Lesson", purpose: "Title", source: "ai" as const, uses: [{ source: "plan" as const, ref: "lessonTitle" }] },
    { index: 2, title: "I Can", purpose: "Objective", source: "ai" as const, uses: [{ source: "plan" as const, ref: "objective" }] },
    { index: 3, title: "Essential Question", purpose: "Discussion", source: "ai" as const, uses: [{ source: "plan" as const, ref: "essentialQuestion" }] },
    { index: 4, title: "Teach", purpose: "Direct instruction", source: "ai" as const, uses: curriculumChecklist[0] ? [{ source: "curriculum" as const, ref: curriculumChecklist[0].id, note: "Primary curriculum item" }] : [] },
    ...(hasCurriculum ? [{ index: 5, title: "Guided Practice", purpose: "Guided practice", source: "ai" as const }] : []),
    { index: hasCurriculum ? 6 : 5, title: "Practice", purpose: "Independent practice", source: "ai" as const, presenterCues: presenterCues.slice(0, 2) },
    { index: hasCurriculum ? 7 : 6, title: "Exit Ticket", purpose: "Check for understanding", source: "ai" as const },
  ];

  const clickableHubSlides = [
    { index: 1, title: args.plan.lessonTitle || "Lesson Hub", purpose: "Welcome", source: "ai" as const, uses: [{ source: "plan" as const, ref: "lessonTitle" }] },
    { index: 2, title: "Lesson Hub", purpose: "Navigation menu", source: "ai" as const, presenterCues: presenterCues.slice(0, 3) },
    { index: 3, title: "I Can", purpose: "Objective", source: "ai" as const, uses: [{ source: "plan" as const, ref: "objective" }] },
    { index: 4, title: "Hook", purpose: "Discussion", source: "ai" as const, uses: [{ source: "plan" as const, ref: "essentialQuestion" }] },
    { index: 5, title: "Teach", purpose: "Mini lesson", source: "ai" as const, uses: curriculumChecklist[0] ? [{ source: "curriculum" as const, ref: curriculumChecklist[0].id, note: "Primary curriculum item" }] : [] },
    { index: 6, title: "Model", purpose: "Think aloud", source: "ai" as const },
    { index: 7, title: "Guided Practice", purpose: "We do", source: "ai" as const, presenterCues: presenterCues.slice(3, 5) },
    { index: 8, title: "Center Rotation", purpose: "Independent practice", source: "ai" as const },
    { index: 9, title: "Exit Ticket", purpose: "Check for understanding", source: "ai" as const },
  ];

  const guidepostSlides = [
    { index: 1, title: args.plan.lessonTitle || "Lesson", purpose: "Launch", source: "ai" as const, uses: [{ source: "plan" as const, ref: "lessonTitle" }] },
    { index: 2, title: "I Can", purpose: "Objective", source: "ai" as const, uses: [{ source: "plan" as const, ref: "objective" }] },
    { index: 3, title: "Bridge", purpose: "Connection and discussion", source: "ai" as const },
    { index: 4, title: "Teach", purpose: "Direct instruction", source: "ai" as const, uses: curriculumChecklist[0] ? [{ source: "curriculum" as const, ref: curriculumChecklist[0].id, note: "Primary curriculum item" }] : [] },
    { index: 5, title: "Model", purpose: "Think aloud", source: "ai" as const },
    { index: 6, title: "Guided Practice", purpose: "Guided practice", source: "ai" as const },
    { index: 7, title: "Independent Practice", purpose: "Independent practice", source: "ai" as const, presenterCues: presenterCues.slice(0, 2) },
    { index: 8, title: "Reflection", purpose: "Closure and exit ticket", source: "ai" as const },
  ];

  const slides =
    frameworkApplied === "clickableHub"
      ? clickableHubSlides
      : frameworkApplied === "guidepost"
        ? guidepostSlides
        : defaultSlides;

  if (curriculumChecklist[0]) curriculumChecklist[0].placed = true;

  const noteParts = [
    "Blueprint uses framework-aware slide skeletons.",
    extracted.summary,
    teacherLedEarlyElementary ? "Teacher-led early elementary override applied: linear framework enforced." : "",
  ].filter(Boolean);

  return {
    createdAtISO,
    plan: { input: args.plan },
    curriculum: {
      files: (args.curriculumFiles ?? []).map(f => ({ name: f.name, kind: f.kind, sourceRole: f.sourceRole })),
      coverageChecklist: curriculumChecklist,
    },
    exemplar: {
      files: (args.exemplarFiles ?? []).map(f => ({ name: f.name, kind: f.kind, sourceRole: f.sourceRole })),
      frameworkDetection,
      presenterCues,
    },
    synthesis: {
      frameworkApplied,
      slides,
      notes: noteParts.join(" "),
    },
  };
}
