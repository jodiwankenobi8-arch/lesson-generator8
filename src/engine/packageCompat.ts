import type { LessonPackage, DetectedStandard, Slide, LessonPlanSection, Center } from "./types";

export function getStandards(pkg: LessonPackage | any): DetectedStandard[] {
  const list = (pkg?.standardsDetected ?? pkg?.standards ?? []) as any;
  return Array.isArray(list) ? list : [];
}

export function getSlides(pkg: LessonPackage | any): Slide[] {
  const list = (pkg?.slides ?? []) as any;
  return Array.isArray(list) ? list : [];
}

export function getLessonPlan(pkg: LessonPackage | any): LessonPlanSection[] {
  const list = (pkg?.lessonPlan ?? []) as any;
  return Array.isArray(list) ? list : [];
}

export function getCenters(pkg: LessonPackage | any): Center[] {
  const list = (pkg?.centers ?? []) as any;
  return Array.isArray(list) ? list : [];
}

export function getRotationPlanItems(pkg: LessonPackage | any): any[] {
  const rp = pkg?.rotationPlan;
  if (Array.isArray(rp)) return rp;
  if (typeof rp === "string" && rp.trim()) return [rp];
  return [];
}

export function getInterventions(pkg: LessonPackage | any) {
  const it = pkg?.interventions ?? {};
  return {
    tier3: Array.isArray(it?.tier3) ? it.tier3 : [],
    tier2: Array.isArray(it?.tier2) ? it.tier2 : [],
    enrichment: Array.isArray(it?.enrichment) ? it.enrichment : [],
  };
}
