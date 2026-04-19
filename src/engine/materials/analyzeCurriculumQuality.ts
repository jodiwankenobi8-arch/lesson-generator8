import type { MaterialAnalysis } from "../types"

export interface CurriculumQualityScore {
  overall: number
  components: {
    hasStandards: boolean
    hasVocabulary: boolean
    hasPracticeIdeas: boolean
    hasTexts: boolean
    hasOpening: boolean
    hasClosure: boolean
    hasAssessment: boolean
  }
  reasoning: string
}

export function analyzeCurriculumQuality(
  materials: MaterialAnalysis[]
): CurriculumQualityScore {
  const curriculumMaterials = materials.filter(
    (material) => material.sourceRole === "curriculum" || Boolean(material.curriculum)
  )

  if (curriculumMaterials.length === 0) {
    return {
      overall: 0,
      components: {
        hasStandards: false,
        hasVocabulary: false,
        hasPracticeIdeas: false,
        hasTexts: false,
        hasOpening: false,
        hasClosure: false,
        hasAssessment: false,
      },
      reasoning: "No curriculum materials provided",
    }
  }

  const corpus = buildCurriculumCorpus(curriculumMaterials)

  const components = {
    hasStandards: detectStandards(curriculumMaterials, corpus),
    hasVocabulary: detectVocabulary(curriculumMaterials, corpus),
    hasPracticeIdeas: detectPracticeIdeas(curriculumMaterials, corpus),
    hasTexts: detectTexts(curriculumMaterials, corpus),
    hasOpening: detectOpening(curriculumMaterials, corpus),
    hasClosure: detectClosure(curriculumMaterials, corpus),
    hasAssessment: detectAssessment(curriculumMaterials, corpus),
  }

  const componentCount = Object.values(components).filter(Boolean).length

  return {
    overall: componentCount / 7,
    components,
    reasoning: buildCurriculumReasoning(componentCount),
  }
}

function buildCurriculumCorpus(materials: MaterialAnalysis[]): string {
  return materials
    .flatMap((material) => {
      const curriculum = material.curriculum
      const coverage = curriculum?.coverage

      return [
        material.summary,
        ...(material.extractedText ?? []),
        ...(material.tags ?? []),
        ...(curriculum?.standards ?? []),
        ...(curriculum?.vocabulary ?? []),
        ...(curriculum?.wordLists ?? []),
        ...(curriculum?.texts ?? []),
        ...(curriculum?.practiceTasks ?? []),
        ...(curriculum?.instructionalTargets ?? []),
        ...(curriculum?.examples ?? []),
        ...(coverage?.standards ?? []),
        ...(coverage?.instructionalTargets ?? []),
        ...(coverage?.foundationalSkills ?? []),
        ...(coverage?.sightWords ?? []),
        ...(coverage?.vocabulary ?? []),
        ...(coverage?.wordLists ?? []),
        ...(coverage?.texts ?? []),
        ...(coverage?.practiceTasks ?? []),
        ...(coverage?.lessonSegments ?? []),
      ]
    })
    .join(" ")
    .toLowerCase()
}

function detectStandards(materials: MaterialAnalysis[], corpus: string): boolean {
  const hasStandardsField = materials.some(
    (material) =>
      Boolean(material.curriculum?.standards?.length) ||
      Boolean(material.curriculum?.coverage?.standards?.length)
  )

  const hasStandardCodes = /\b(?:[a-z]{2,4}\.)?[a-z0-9]+\.[a-z0-9]+(?:\.[a-z0-9]+)+\b/i.test(
    corpus
  )

  return hasStandardsField || hasStandardCodes
}

function detectVocabulary(materials: MaterialAnalysis[], corpus: string): boolean {
  const hasVocabularyField = materials.some(
    (material) =>
      Boolean(material.curriculum?.vocabulary?.length) ||
      Boolean(material.curriculum?.coverage?.vocabulary?.length)
  )

  return hasVocabularyField || /\b(vocabulary|key words|target words|academic language)\b/i.test(corpus)
}

function detectPracticeIdeas(materials: MaterialAnalysis[], corpus: string): boolean {
  const hasPracticeField = materials.some(
    (material) =>
      Boolean(material.curriculum?.practiceTasks?.length) ||
      Boolean(material.curriculum?.coverage?.practiceTasks?.length)
  )

  return hasPracticeField || /\b(practice|activity|task|exercise|worksheet|word work|sort|dictation)\b/i.test(corpus)
}

function detectTexts(materials: MaterialAnalysis[], corpus: string): boolean {
  const hasTextsField = materials.some(
    (material) =>
      Boolean(material.curriculum?.texts?.length) ||
      Boolean(material.curriculum?.coverage?.texts?.length)
  )

  return hasTextsField || /\b(passage|text|story|article|read-aloud|reading|book|excerpt|decodable)\b/i.test(corpus)
}

function detectOpening(materials: MaterialAnalysis[], corpus: string): boolean {
  const hasOpeningSegment = materials.some((material) =>
    (material.curriculum?.coverage?.lessonSegments ?? []).some((segment) =>
      /\b(opening|warm[- ]?up|launch|hook|introduction|review)\b/i.test(segment)
    )
  )

  return hasOpeningSegment || /\b(opening|warm[- ]?up|launch|hook|introduction|review)\b/i.test(corpus)
}

function detectClosure(materials: MaterialAnalysis[], corpus: string): boolean {
  const hasClosureSegment = materials.some((material) =>
    (material.curriculum?.coverage?.lessonSegments ?? []).some((segment) =>
      /\b(closure|closing|wrap[- ]?up|summary|exit ticket)\b/i.test(segment)
    )
  )

  return hasClosureSegment || /\b(closure|closing|wrap[- ]?up|summary|exit ticket)\b/i.test(corpus)
}

function detectAssessment(materials: MaterialAnalysis[], corpus: string): boolean {
  const hasAssessmentTag = materials.some((material) =>
    (material.tags ?? []).some((tag) => /assessment/i.test(tag))
  )

  return hasAssessmentTag || /\b(assessment|check for understanding|quick check|quiz|formative|summative|evaluate|monitor)\b/i.test(corpus)
}

function buildCurriculumReasoning(componentCount: number): string {
  if (componentCount >= 6) {
    return "Comprehensive curriculum with most key components present"
  }

  if (componentCount >= 4) {
    return "Solid curriculum foundation with several key components"
  }

  if (componentCount >= 2) {
    return "Partial curriculum information available"
  }

  if (componentCount >= 1) {
    return "Minimal curriculum guidance detected"
  }

  return "No clear curriculum structure identified"
}
