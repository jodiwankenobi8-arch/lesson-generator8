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
  essentialQuestion?: string;
  notes?: string;
  grade?: string;
  subject?: string;
  textOrTopic?: string;
};

export type UploadedFileTraceMetadata = {
  extension?: string;
  mimeType?: string;
  extractionMethod?: "text" | "docx" | "pdf" | "pptx" | "fallback";
};

export type UploadedTextFile = {
  name: string;
  kind: string; // mime or extension
  text?: string;
  sourceRole?: SourceRole;
  confidence?: number;
  warnings?: string[];
  metadata?: UploadedFileTraceMetadata;
};

export type BlueprintSourceFile = {
  name: string;
  kind: string;
  text?: string;
  sourceRole?: SourceRole;
  confidence?: number;
  warnings?: string[];
  metadata?: UploadedFileTraceMetadata;
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
    files: BlueprintSourceFile[];
    coverageChecklist: { id: string; title: string; required: boolean; placed: boolean }[];
  };

  exemplar: {
    files: BlueprintSourceFile[];
    frameworkDetection: FrameworkDetection;
    presenterCues: PresenterCue[];
  };

  synthesis: {
    frameworkApplied: FrameworkType;
    slides: SlidePlan[];
    notes?: string;
  };
};
