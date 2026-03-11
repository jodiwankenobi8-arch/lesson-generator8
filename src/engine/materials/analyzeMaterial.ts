import {
  CurriculumAnalysis,
  ExemplarAnalysis,
  MaterialAnalysis,
  MaterialFile,
  MaterialRole,
} from "../types"

export type AnalyzeMaterialInput = {
  materialId: string
  role: MaterialRole
  name: string
  extractedText: string[]
}

export type AnalyzeMaterialResult = {
  materialId: string
  analysis: MaterialAnalysis
}

export async function analyzeMaterial(
  input: AnalyzeMaterialInput
): Promise<AnalyzeMaterialResult> {
  const cleanedText = sanitizeExtractedText(input.extractedText)

  const analysis: MaterialAnalysis =
    input.role === "curriculum"
      ? {
          summary: buildCurriculumSummary(input.name, cleanedText),
          extractedText: cleanedText,
          tags: deriveCurriculumTags(cleanedText),
          sourceRole: "curriculum",
          curriculum: buildCurriculumAnalysis(cleanedText),
        }
      : {
          summary: buildExemplarSummary(input.name, cleanedText),
          extractedText: cleanedText,
          tags: deriveExemplarTags(cleanedText),
          sourceRole: "exemplar",
          exemplar: buildExemplarAnalysis(cleanedText),
        }

  return {
    materialId: input.materialId,
    analysis,
  }
}

function sanitizeExtractedText(lines: string[]): string[] {
  return Array.from(
    new Set(
      lines
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
    )
  ).slice(0, 200)
}

function buildCurriculumSummary(name: string, lines: string[]): string {
  if (!lines.length) {
    return `Curriculum material ${name} was analyzed, but little usable text was extracted.`
  }

  return `Curriculum material ${name} analyzed with ${lines.length} extracted content lines.`
}

function buildExemplarSummary(name: string, lines: string[]): string {
  if (!lines.length) {
    return `Exemplar material ${name} was analyzed, but little usable text was extracted.`
  }

  return `Exemplar material ${name} analyzed with ${lines.length} extracted style/structure lines.`
}

function buildCurriculumAnalysis(lines: string[]): CurriculumAnalysis {
  const standards = takeMatching(lines, [
    "rf.",
    "rl.",
    "ri.",
    "w.",
    "l.",
    "standard",
  ], 6)

  const vocabulary = takeMatching(lines, [
    "vocabulary",
    "term",
    "define",
    "meaning",
    "academic word",
    "target vocabulary",
  ], 8)

  const wordLists = takeMatching(lines, [
    "word list",
    "target words",
    "decode",
    "blend",
    "sort",
    "phonics",
    "pattern",
    "syllable",
    "long a",
    "short a",
    "cvc",
    "cvce",
  ], 8)

  const texts = takeMatching(lines, [
    "passage",
    "story",
    "text",
    "article",
    "selection",
    "read aloud",
    "decodable",
  ], 6)

  const practiceTasks = takeMatching(lines, [
    "practice",
    "task",
    "sort",
    "read",
    "write",
    "respond",
    "question",
    "discussion",
    "partner",
    "routine",
    "activity",
  ], 8)

  const instructionalTargets = takeMatching(lines, [
    "objective",
    "target",
    "goal",
    "students will",
    "skill",
    "focus",
  ], 6)

  const examples = takeMatching(lines, [
    "example",
    "for example",
    "model",
    "sample",
    "teacher example",
  ], 6)

  return {
    standards: standards.length ? standards : ["teacher-selected standard"],
    vocabulary: vocabulary.length ? vocabulary : ["key vocabulary"],
    wordLists: wordLists.length ? wordLists : ["teacher-selected word list"],
    texts: texts.length ? texts : ["teacher-provided lesson text"],
    practiceTasks: practiceTasks.length ? practiceTasks : ["curriculum-aligned practice task"],
    instructionalTargets: instructionalTargets.length ? instructionalTargets : ["lesson target"],
    examples: examples.length ? examples : ["modeled example"],
  }
}

function buildExemplarAnalysis(lines: string[]): ExemplarAnalysis {
  const slideFlow = takeMatching(lines, [
    "slide",
    "opening",
    "objective",
    "teach",
    "guided practice",
    "independent practice",
    "closure",
  ], 10)

  const pacing = takeMatching(lines, [
    "minute",
    "minutes",
    "timing",
    "pace",
    "transition",
  ], 8)

  const teacherMoves = takeMatching(lines, [
    "teacher says",
    "teacher prompt",
    "model",
    "ask",
    "say",
    "guide",
    "prompt",
    "turn and talk",
  ], 8)

  const promptStyle = takeMatching(lines, [
    "prompt",
    "question stem",
    "sentence stem",
    "turn and talk",
    "discuss",
  ], 8)

  const layoutCues = takeMatching(lines, [
    "layout",
    "visual",
    "template",
    "header",
    "bullet",
    "image",
    "color",
  ], 8)

  const tone = takeMatching(lines, [
    "encourage",
    "celebrate",
    "scholar",
    "friendly",
    "direct",
    "clear",
  ], 6)

  const reusableStructure = takeMatching(lines, [
    "i do",
    "we do",
    "you do",
    "opening",
    "mini-lesson",
    "closure",
    "center",
    "rotation",
  ], 8)

  return {
    slideFlow: slideFlow.length ? slideFlow : ["opening", "teach", "guided practice", "closure"],
    pacing: pacing.length ? pacing : ["teacher-directed pacing"],
    teacherMoves: teacherMoves.length ? teacherMoves : ["teacher model", "guided support"],
    promptStyle: promptStyle.length ? promptStyle : ["teacher prompt"],
    layoutCues: layoutCues.length ? layoutCues : ["presentation structure cue"],
    tone: tone.length ? tone : ["clear instructional tone"],
    reusableStructure: reusableStructure.length ? reusableStructure : ["opening", "teach", "practice", "closure"],
  }
}

function deriveCurriculumTags(lines: string[]): string[] {
  return deriveTags(lines, [
    "curriculum",
    "standards",
    "vocabulary",
    "word work",
    "text",
    "practice",
    "instruction",
  ])
}

function deriveExemplarTags(lines: string[]): string[] {
  return deriveTags(lines, [
    "exemplar",
    "structure",
    "pacing",
    "teacher prompts",
    "layout",
    "slide flow",
  ])
}

function deriveTags(lines: string[], fallbacks: string[]): string[] {
  const tags = lines
    .filter((line) => line.split(" ").length <= 5)
    .slice(0, 8)

  return Array.from(new Set(tags.length ? tags : fallbacks))
}

function takeMatching(lines: string[], terms: string[], limit: number): string[] {
  return lines.filter((line) => containsAny(line, terms)).slice(0, limit)
}

function containsAny(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase()
  return terms.some((term) => lower.includes(term))
}
