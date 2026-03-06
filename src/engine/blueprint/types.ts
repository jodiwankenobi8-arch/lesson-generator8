export type SourceTag = "plan" | "curriculum" | "exemplar" | "ai";
export type UploadPack = "curriculum" | "exemplar";
export type FrameworkType = "linear" | "clickableHub" | "guidepost" | "unknown";
export type SourceRole = "curriculum" | "teachingTool" | "exemplar" | "mixed";

export type PresenterCueType = "timer" | "clicker" | "instruction" | "transition" | "script";
export type PresenterCue = {
  type: PresenterCueType;
  rawText: string;
  timeSeconds?: number;
  confidence?: number;
  sourceFile?: string;
  locationHint?: string;
};

export type FrameworkDetection = {
  framework: FrameworkType;
  confidence: number; // 0..1
  evidence: string[];
};

export type PlanInput = {
  lessonTitle?: string;
  objective?: string;
  notes?: string;
};

export type UploadedTextFile = {
  name: string;
  kind: string; // mime or extension
  text?: string;
  sourceRole?: SourceRole;
};

export type SlidePlan = {
  index: number;
  title: string;
  purpose?: string;
  source: SourceTag;
  uses?: { source: SourceTag; ref: string; note?: string }[];
  presenterCues?: PresenterCue[];
};

export type LessonBlueprint = {
  createdAtISO: string;

  plan: {
    input: PlanInput;
  };

  curriculum: {
    files: { name: string; kind: string; sourceRole?: SourceRole }[];
    coverageChecklist: { id: string; title: string; required: boolean; placed: boolean }[];
  };

  exemplar: {
    files: { name: string; kind: string; sourceRole?: SourceRole }[];
    frameworkDetection: FrameworkDetection;
    presenterCues: PresenterCue[];
  };

  synthesis: {
    frameworkApplied: FrameworkType;
    slides: SlidePlan[];
    notes?: string;
  };
};
