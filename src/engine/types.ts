export type Grade = "K" | "1" | "2" | "3" | "4" | "5";
export type Subject = "ELA" | "Math" | "Science" | "SS";

export interface LessonInput {
  grade: Grade;
  subject: Subject;
  date: string;

  lessonTitle: string;
  objective: string;
  essentialQuestion?: string;

  textOrTopic: string;

  durationMinutes: number;

  groupNotes?: {
    tier3?: string;
    tier2?: string;
    onLevel?: string;
    enrichment?: string;
  };

  materials?: string;
  manualStandardOverride?: string[];
}

export interface DetectedStandard {
  code: string;
  description: string;
  confidence: number; // 0–1
  overridden?: boolean;
}

export type SlideType =
  | "title"
  | "objective"
  | "mini-lesson"
  | "modeling"
  | "guided"
  | "practice"
  | "discussion"
  | "exit-ticket";

export interface Slide {
  id: string;
  type: SlideType;
  title: string;

  // Some generators use bullets; others use text/body.
  bullets?: string[];
  text?: string;
  body?: string;

  teacherNotes?: string; // lesson plan only
}

export interface LessonPlanSection {
  heading: string;
  slides: number[]; // 1-based
  description: string;
  differentiation?: {
    tier3?: string;
    tier2?: string;
    enrichment?: string;
  };
}

/**
 * Centers evolved over builds — support both old + new fields
 * so UI/exporters don't break.
 */
export interface Center {
  // old
  name?: string;
  focusSkill?: string;
  instructions?: string;
  differentiation?: string;

  // newer
  title?: string;
  objective?: string;
  direction?: string;
  materials?: string;
  printables?: string;
}

export type InterventionItem = string | { description?: string; text?: string };

export interface InterventionSet {
  tier3: InterventionItem[];
  tier2: InterventionItem[];
  enrichment: InterventionItem[];
}

/**
 * Rotation plan evolved too — sometimes string, sometimes list of blocks.
 */
export type RotationPlanItem = string | { title?: string; description?: string; text?: string };
export type RotationPlan = string | RotationPlanItem[];

export interface LessonPackage {
  meta: {
    generatedAt: string;
    version: string;
  };

  input: LessonInput;

  /**
   * Back-compat:
   * - older code/exporters use `standards`
   * - newer generation uses `standardsDetected`
   */
  standards: DetectedStandard[];
  standardsDetected?: DetectedStandard[];

  slides: Slide[];
  lessonPlan: LessonPlanSection[];

  centers: Center[];
  rotationPlan: RotationPlan;

  interventions: InterventionSet;
}
