import type {
  LessonInput,
  LessonPackage,
  DetectedStandard,
} from "./types";
import type { LessonBlueprint } from "./blueprint/types";
import { detectKelaBest } from "./standards/detectKelaBest";
import { buildSlides } from "./generation/slides";
import { buildLessonPlan } from "./generation/lessonPlan";
import { buildCenters } from "./generation/centers";
import { buildRotationPlan } from "./generation/rotationPlan";
import { buildInterventions } from "./generation/interventions";

const APP_VERSION = "1.4.0";

function computeDetectedStandards(input: LessonInput): DetectedStandard[] {
  if (Array.isArray(input.manualStandardOverride) && input.manualStandardOverride.length > 0) {
    return input.manualStandardOverride.map((code: string) => ({
      code,
      description: "(manual override)",
      confidence: 1,
      overridden: true,
    }));
  }

  if (input.grade === "K" && input.subject === "ELA") {
    return detectKelaBest(
      {
        lessonTitle: input.lessonTitle,
        objective: input.objective,
        essentialQuestion: input.essentialQuestion,
        textOrTopic: input.textOrTopic,
        materials: input.materials,
      },
      { max: 3 },
    ).map((item: any) => ({
      code: item.code,
      description: item.description || item.label || "",
      confidence: typeof item.confidence === "number" ? item.confidence : 0,
    }));
  }

  return [];
}

function adjustStandardsByIntent(standards: DetectedStandard[], input: LessonInput): DetectedStandard[] {
  const corpus = [
    input.lessonTitle,
    input.objective,
    input.essentialQuestion,
    input.textOrTopic,
    input.materials,
  ].filter(Boolean).join(" ").toLowerCase();

  const comprehensionIntent = /(comprehens|retell|story|characters?|setting|important\s+events?|beginning|middle|end|who|where|when|plot|sequence|main\s+character|key\s+details)/i.test(corpus);
  const vocabExplicit = /(vocab|vocabulary|word\s+sort|sort\s+words|categories|category|classify\s+words|word\s+relationships|context\s+clues|synonym|antonym)/i.test(corpus);

  const adjusted = standards.map((standard) => {
    let score = standard.confidence;
    if (comprehensionIntent && /^ELA\.K\.R\./.test(standard.code)) score += 0.2;
    if (comprehensionIntent && !vocabExplicit && /^ELA\.K\.V\./.test(standard.code)) score -= 0.15;
    return { ...standard, confidence: Math.max(0, Math.min(1, score)) };
  });

  adjusted.sort((a, b) => b.confidence - a.confidence || a.code.localeCompare(b.code));
  return adjusted;
}

export function generateLesson(input: LessonInput, blueprint?: LessonBlueprint | null): LessonPackage {
  const detected = adjustStandardsByIntent(computeDetectedStandards(input), input);
  const primaryStandard = detected[0];
  const slides = buildSlides(input, blueprint);
  const lessonPlan = buildLessonPlan(input, slides, primaryStandard?.code, blueprint);
  const centers = buildCenters(input, blueprint);
  const rotationPlan = buildRotationPlan(input, blueprint);
  const interventions = buildInterventions(input);

  return {
    meta: { generatedAt: new Date().toISOString(), version: APP_VERSION },
    input,
    standards: detected,
    standardsDetected: detected,
    slides,
    lessonPlan,
    centers,
    rotationPlan,
    interventions,
  };
}