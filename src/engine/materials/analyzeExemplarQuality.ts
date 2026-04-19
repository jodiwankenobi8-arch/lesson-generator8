import type { MaterialAnalysis } from "../types"

export interface ExemplarQualityScore {
  overall: number
  components: {
    hasSlideFlow: boolean
    hasPacing: boolean
    hasTeacherMoves: boolean
    hasPrompts: boolean
  }
  reasoning: string
}

export function analyzeExemplarQuality(
  materials: MaterialAnalysis[]
): ExemplarQualityScore {
  const exemplarMaterials = materials.filter(
    (material) => material.sourceRole === "exemplar" || Boolean(material.exemplar)
  )

  if (exemplarMaterials.length === 0) {
    return {
      overall: 0,
      components: {
        hasSlideFlow: false,
        hasPacing: false,
        hasTeacherMoves: false,
        hasPrompts: false,
      },
      reasoning: "No exemplar materials provided",
    }
  }

  const corpus = buildExemplarCorpus(exemplarMaterials)

  const components = {
    hasSlideFlow: detectSlideFlow(exemplarMaterials, corpus),
    hasPacing: detectPacing(exemplarMaterials, corpus),
    hasTeacherMoves: detectTeacherMoves(exemplarMaterials, corpus),
    hasPrompts: detectPrompts(exemplarMaterials, corpus),
  }

  const componentCount = Object.values(components).filter(Boolean).length

  return {
    overall: componentCount / 4,
    components,
    reasoning: buildExemplarReasoning(componentCount),
  }
}

function buildExemplarCorpus(materials: MaterialAnalysis[]): string {
  return materials
    .flatMap((material) => {
      const exemplar = material.exemplar
      const detectedFeatures = exemplar?.detectedFeatures?.items ?? []

      return [
        material.summary,
        ...(material.extractedText ?? []),
        ...(material.tags ?? []),
        ...(exemplar?.slideFlow ?? []),
        ...(exemplar?.pacing ?? []),
        ...(exemplar?.teacherMoves ?? []),
        ...(exemplar?.promptStyle ?? []),
        ...(exemplar?.layoutCues ?? []),
        ...(exemplar?.tone ?? []),
        ...(exemplar?.reusableStructure ?? []),
        ...detectedFeatures.flatMap((feature) => [
          feature.label,
          feature.description,
          ...(feature.evidence ?? []),
        ]),
      ]
    })
    .join(" ")
    .toLowerCase()
}

function detectSlideFlow(materials: MaterialAnalysis[], corpus: string): boolean {
  const hasSlideFlowField = materials.some(
    (material) =>
      Boolean(material.exemplar?.slideFlow?.length) ||
      Boolean(material.exemplar?.reusableStructure?.length)
  )

  return hasSlideFlowField || /\b(opening|agenda|teach|guided practice|independent practice|closure|slide flow|sequence)\b/i.test(corpus)
}

function detectPacing(materials: MaterialAnalysis[], corpus: string): boolean {
  const hasPacingField = materials.some(
    (material) => Boolean(material.exemplar?.pacing?.length)
  )

  return hasPacingField || /\b(\d+\s*(?:min|mins|minutes|seconds)|time[:\s]*\d+|duration|pacing|timer)\b/i.test(corpus)
}

function detectTeacherMoves(materials: MaterialAnalysis[], corpus: string): boolean {
  const hasTeacherMovesField = materials.some(
    (material) => Boolean(material.exemplar?.teacherMoves?.length)
  )

  return hasTeacherMovesField || /\b(teacher\s+(?:says|asks|models|demonstrates|points|shows|explains|prompts)|i\s+(?:say|ask|model|demonstrate|show)|model|demonstrate|think[- ]aloud|turn and talk)\b/i.test(corpus)
}

function detectPrompts(materials: MaterialAnalysis[], corpus: string): boolean {
  const hasPromptsField = materials.some(
    (material) => Boolean(material.exemplar?.promptStyle?.length)
  )

  const hasScriptedLanguage = materials.some((material) => {
    const text = (material.extractedText ?? []).join(" ")
    return /["'].*?["']/.test(text) || /:\s*["']/.test(text)
  })

  const hasDetectedPromptFeature = materials.some((material) =>
    (material.exemplar?.detectedFeatures?.items ?? []).some((feature) =>
      feature.key === "teacher_prompt_blocks" ||
      feature.key === "teacher_scripts" ||
      feature.key === "call_and_response" ||
      feature.key === "turn_and_talk"
    )
  )

  return hasPromptsField || hasScriptedLanguage || hasDetectedPromptFeature || /\b(script|prompt|say|ask students|question|response)\b/i.test(corpus)
}

function buildExemplarReasoning(componentCount: number): string {
  if (componentCount === 4) {
    return "Complete exemplar with clear structure, pacing, and instructional guidance"
  }

  if (componentCount === 3) {
    return "Strong exemplar with most structural elements present"
  }

  if (componentCount === 2) {
    return "Partial exemplar structure available"
  }

  if (componentCount === 1) {
    return "Minimal exemplar guidance detected"
  }

  return "No clear exemplar structure identified"
}
