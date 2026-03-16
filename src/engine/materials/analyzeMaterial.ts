import { extractCurriculumCoverageCandidates } from "./extractCurriculumCoverageCandidates"

import {
  CurriculumAnalysis,
  ExemplarAnalysis,
  ExemplarDetectedFeature,
  ExemplarDetectedFeatureCategory,
  ExemplarDetectedFeatureKey,
  ExtractionMetadata,
  MaterialAnalysis,
  MaterialReliability,
  MaterialRole,
  MaterialUseDecision,
} from "../types"

export type AnalyzeMaterialInput = {
  materialId: string
  role: MaterialRole
  name: string
  extractedText: string[]
  extractionMetadata?: ExtractionMetadata
}

export type AnalyzeMaterialResult = {
  materialId: string
  analysis: MaterialAnalysis
}

const MAX_LINES = 220
const MAX_FIELD_ITEMS = 8

export async function analyzeMaterial(
  input: AnalyzeMaterialInput
): Promise<AnalyzeMaterialResult> {
  const cleanedText = sanitizeExtractedText(input.extractedText)

  const baseAnalysis: MaterialAnalysis =
    input.role === "curriculum"
      ? buildCurriculumMaterialAnalysis(input.name, cleanedText)
      : buildExemplarMaterialAnalysis(input.name, cleanedText)

  const analysis: MaterialAnalysis = {
    ...baseAnalysis,
    extractionMetadata: input.extractionMetadata,
    reliability: buildMaterialReliability({
      role: input.role,
      lines: cleanedText,
      extractionMetadata: input.extractionMetadata,
      analysis: baseAnalysis,
    }),
  }

  return {
    materialId: input.materialId,
    analysis,
  }
}

type BuildMaterialReliabilityInput = {
  role: MaterialRole
  lines: string[]
  extractionMetadata?: ExtractionMetadata
  analysis: MaterialAnalysis
}

function buildMaterialReliability(
  input: BuildMaterialReliabilityInput
): MaterialReliability {
  let score = 100
  const reasons: string[] = []
  const warnings: string[] = []

  const metadata = input.extractionMetadata

  if (!metadata) {
    score -= 10
    warnings.push("No extraction metadata available.")
  } else {
    if (metadata.method === "ocr") {
      score -= 12
      reasons.push("OCR-only extraction reduced confidence.")
    } else if (metadata.method === "mixed") {
      score -= 8
      reasons.push("Mixed parser/OCR extraction needs caution.")
    } else if (metadata.method === "fallback_notice") {
      score -= 40
      reasons.push("Fallback extraction notice means little usable source text.")
      warnings.push("Material may not have enough extracted text to shape the blueprint safely.")
    }

    if (metadata.quality === "medium") {
      score -= 10
      reasons.push("Extraction quality is medium.")
    } else if (metadata.quality === "low") {
      score -= 25
      reasons.push("Extraction quality is low.")
    }

    if (metadata.confidence < 0.45) {
      score -= 25
      reasons.push("Extraction confidence is very low.")
    } else if (metadata.confidence < 0.7) {
      score -= 10
      reasons.push("Extraction confidence is moderate.")
    }

    if (metadata.ocrCandidate && metadata.method !== "parser") {
      score -= 8
      reasons.push("OCR fallback or OCR-heavy extraction was needed.")
    }

    warnings.push(...metadata.notes.slice(0, 2))
  }

  const lineCount = input.lines.length
  const totalChars = input.lines.reduce((sum, line) => sum + line.length, 0)
  const avgLineLength = lineCount > 0 ? totalChars / lineCount : 0
  const noisyLineCount = input.lines.filter(isReliabilityNoiseLine).length
  const noiseRatio = lineCount > 0 ? noisyLineCount / lineCount : 1

  if (lineCount < 8) {
    score -= 20
    reasons.push("Very little usable text was extracted.")
  } else if (lineCount < 20) {
    score -= 10
    reasons.push("Usable extracted text is sparse.")
  }

  if (lineCount > 0 && avgLineLength < 12) {
    score -= 10
    reasons.push("Extracted text is fragment-heavy.")
  }

  if (noiseRatio > 0.35) {
    score -= 25
    reasons.push("Extracted text appears noisy.")
  } else if (noiseRatio > 0.2) {
    score -= 12
    reasons.push("Extracted text includes noticeable noise.")
  }

  const contentGroundedness = countCurriculumGroundedness(input.analysis)
  const structureGroundedness = countExemplarGroundedness(input.analysis)

  if (input.role === "curriculum" && contentGroundedness === 0) {
    score -= 20
    warnings.push("Curriculum signals were too weak to ground content safely.")
  }

  if (input.role === "exemplar" && structureGroundedness === 0) {
    score -= 20
    warnings.push("Exemplar structure signals were too weak to ground lesson structure safely.")
  }

  score = clamp(score, 0, 100)

  const usableForContent =
    contentGroundedness > 0 &&
    score >= 45 &&
    metadata?.method !== "fallback_notice"

  const usableForStructure =
    structureGroundedness > 0 &&
    score >= 45 &&
    metadata?.method !== "fallback_notice"

  return {
    level: score >= 75 ? "high" : score >= 55 ? "medium" : "low",
    score,
    usableForContent,
    usableForStructure,
    contentDecision: resolveReliabilityDecision(score, usableForContent),
    structureDecision: resolveReliabilityDecision(score, usableForStructure),
    reasons: unique(reasons),
    warnings: unique(warnings),
  }
}

function resolveReliabilityDecision(
  score: number,
  usable: boolean
): MaterialUseDecision {
  if (!usable) {
    return "block"
  }

  return score >= 70 ? "allow" : "caution"
}

function countCurriculumGroundedness(analysis: MaterialAnalysis): number {
  const curriculum = analysis.curriculum

  if (!curriculum) {
    return 0
  }

  return (
    curriculum.standards.length +
    curriculum.vocabulary.length +
    curriculum.wordLists.length +
    curriculum.texts.length +
    curriculum.practiceTasks.length +
    curriculum.instructionalTargets.length +
    curriculum.examples.length
  )
}

function countExemplarGroundedness(analysis: MaterialAnalysis): number {
  const exemplar = analysis.exemplar

  if (!exemplar) {
    return 0
  }

  return (
    exemplar.slideFlow.length +
    exemplar.pacing.length +
    exemplar.teacherMoves.length +
    exemplar.promptStyle.length +
    exemplar.layoutCues.length +
    exemplar.tone.length +
    exemplar.reusableStructure.length +
    (exemplar.detectedFeatures?.items.length ?? 0)
  )
}

function isReliabilityNoiseLine(line: string): boolean {
  const trimmed = line.trim()
  const lower = trimmed.toLowerCase()

  if (!lower) return true
  if (lower.length < 4) return true

  const letterCount = (lower.match(/[a-z]/g) || []).length
  const symbolCount = (lower.match(/[^a-z0-9\s]/gi) || []).length

  if (letterCount === 0) return true
  if (symbolCount > letterCount * 1.2) return true

  return false
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function buildCurriculumMaterialAnalysis(
  name: string,
  lines: string[]
): MaterialAnalysis {

  const curriculum = buildCurriculumAnalysis(lines)
  const strength = computeCurriculumSignalStrength(curriculum)

  return {
    summary: buildCurriculumSummary(name, lines),
    extractedText: lines,
    tags: [...deriveCurriculumTags(lines), "signal-strength:" + strength],
    sourceRole: "curriculum",
    curriculum
  }
}

function buildExemplarMaterialAnalysis(
  name: string,
  lines: string[]
): MaterialAnalysis {

  const exemplar = buildExemplarAnalysis(lines)
  const strength = computeExemplarSignalStrength(exemplar)

  return {
    summary: buildExemplarSummary(name, lines),
    extractedText: lines,
    tags: [...deriveExemplarTags(lines), "signal-strength:" + strength],
    sourceRole: "exemplar",
    exemplar
  }
}

function sanitizeExtractedText(lines: string[]): string[] {
  return unique(
    lines
      .map(normalizeLine)
      .filter((line) => line.length > 0)
      .filter((line) => !isLikelyNoise(line))
  ).slice(0, MAX_LINES)
}

function normalizeLine(line: string): string {
  return line.replace(/\s+/g, " ").trim()
}

function isLikelyNoise(line: string): boolean {
  const lower = line.toLowerCase()

  if (!lower) return true
  if (lower.length <= 1) return true
  if (/^[\W_]+$/.test(lower)) return true
  if (/^slide \d+$/i.test(line.trim())) return true
  if (/^(http|www\.)/.test(lower)) return true

  const alphaCount = (lower.match(/[a-z]/g) || []).length
  const digitCount = (lower.match(/\d/g) || []).length
  const symbolCount = (lower.match(/[^a-z0-9\s]/gi) || []).length

  if (alphaCount === 0 && digitCount > 0) return true
  if (alphaCount > 0 && symbolCount > alphaCount * 1.5) return true

  return false
}

function buildCurriculumSummary(name: string, lines: string[]): string {
  if (!lines.length) {
    return `Curriculum material ${name} was analyzed, but little usable text was extracted.`
  }

  const standards = findStandards(lines).length
  const objectives = selectInstructionalTargets(lines).length
  const vocabulary = selectVocabulary(lines).length
  const tasks = selectPracticeTasks(lines).length

  return `Curriculum material ${name} analyzed with ${lines.length} usable lines, ${standards} standards signals, ${objectives} target signals, ${vocabulary} vocabulary signals, and ${tasks} practice signals.`
}

function buildExemplarSummary(name: string, lines: string[]): string {
  if (!lines.length) {
    return `Exemplar material ${name} was analyzed, but little usable text was extracted.`
  }

  const flow = selectSlideFlow(lines).length
  const pacing = selectPacing(lines).length
  const moves = selectTeacherMoves(lines).length
  const structure = selectReusableStructure(lines).length
  const detectedFeatureCount = detectExemplarFeatures(lines).items.length

  return `Exemplar material ${name} analyzed with ${lines.length} usable lines, ${flow} slide-flow signals, ${pacing} pacing signals, ${moves} teacher-move signals, ${structure} reusable structure signals, and ${detectedFeatureCount} detected exemplar features.`
}

function buildCurriculumAnalysis(lines: string[]): CurriculumAnalysis {
  const coverageCandidates = extractCurriculumCoverageCandidates(lines)
  const coverageLines = unique([...lines, ...coverageCandidates])

  const standards = findStandards(coverageLines)
  const instructionalTargets = selectInstructionalTargets(coverageLines)
  const vocabulary = selectVocabulary(coverageLines)
  const wordLists = selectWordLists(coverageLines)
  const texts = selectTexts(coverageLines)
  const practiceTasks = selectPracticeTasks(coverageLines)
  const examples = selectExamples(coverageLines)
  const foundationalSkills = selectFoundationalSkills(coverageLines)
  const sightWords = selectSightWords(coverageLines)
  const lessonSegments = selectCoveredLessonSegments(coverageLines)

  return {
    standards: standards.length ? standards : ["teacher-selected standard"],
    vocabulary: vocabulary.length ? vocabulary : ["key vocabulary"],
    wordLists: wordLists.length ? wordLists : ["teacher-selected word list"],
    texts: texts.length ? texts : ["teacher-provided lesson text"],
    practiceTasks: practiceTasks.length ? practiceTasks : ["curriculum-aligned practice task"],
    instructionalTargets: instructionalTargets.length ? instructionalTargets : ["lesson target"],
    examples: examples.length ? examples : ["modeled example"],
    coverage: {
      standards,
      instructionalTargets,
      foundationalSkills,
      sightWords,
      vocabulary,
      wordLists,
      texts,
      practiceTasks,
      lessonSegments,
    },
  }
}

function buildExemplarAnalysis(lines: string[]): ExemplarAnalysis {
  const slideFlow = selectSlideFlow(lines)
  const pacing = selectPacing(lines)
  const teacherMoves = selectTeacherMoves(lines)
  const promptStyle = selectPromptStyle(lines)
  const layoutCues = selectLayoutCues(lines)
  const tone = selectTone(lines)
  const reusableStructure = selectReusableStructure(lines)
  const detectedFeatures = detectExemplarFeatures(lines)

  return {
    slideFlow: slideFlow.length ? slideFlow : ["opening", "teach", "guided practice", "closure"],
    pacing: pacing.length ? pacing : ["teacher-directed pacing"],
    teacherMoves: teacherMoves.length ? teacherMoves : ["teacher model", "guided support"],
    promptStyle: promptStyle.length ? promptStyle : ["teacher prompt"],
    layoutCues: layoutCues.length ? layoutCues : ["presentation structure cue"],
    tone: tone.length ? tone : ["clear instructional tone"],
    reusableStructure: reusableStructure.length ? reusableStructure : ["opening", "teach", "practice", "closure"],
    detectedFeatures,
  }
}

function detectExemplarFeatures(lines: string[]) {
  const items: ExemplarDetectedFeature[] = []

  pushFeatureIfAny(items, {
    key: "turn_and_talk",
    label: "Turn and Talk",
    description: "Includes partner discussion prompts or turn-and-talk moments.",
    category: "interaction",
    evidence: takeBestMatches(
      lines,
      (line) => containsAny(line, ["turn and talk", "share with a partner", "talk to your partner"]),
      3
    ),
  })

  pushFeatureIfAny(items, {
    key: "teacher_prompt_blocks",
    label: "Teacher Prompt Blocks",
    description: "Contains teacher-facing prompt language or facilitation prompts.",
    category: "interaction",
    evidence: takeBestMatches(
      lines,
      (line) =>
        startsWithAny(line, ["prompt", "question stem", "sentence stem"]) ||
        containsAny(line, ["prompt students", "question stem", "sentence stem", "what do you notice"]),
      3
    ),
  })

  pushFeatureIfAny(items, {
    key: "teacher_scripts",
    label: "Teacher Scripts",
    description: "Contains explicit teacher scripting or teacher-say language.",
    category: "interaction",
    evidence: takeBestMatches(
      lines,
      (line) =>
        startsWithAny(line, ["teacher says", "teacher will", "say", "model", "explain"]) ||
        containsAny(line, ["teacher says", "teacher will", "think aloud", "show students"]),
      3
    ),
  })

  pushFeatureIfAny(items, {
    key: "objective_slide",
    label: "Objective Slide",
    description: "Includes a lesson objective or learning target slide pattern.",
    category: "instructional_flow",
    evidence: takeBestMatches(
      lines,
      (line) => containsAny(line, ["objective", "learning target", "i can", "students will"]),
      3
    ),
  })

  pushFeatureIfAny(items, {
    key: "warm_up",
    label: "Warm-Up",
    description: "Includes an opening warm-up or launch section.",
    category: "instructional_flow",
    evidence: takeBestMatches(
      lines,
      (line) => containsAny(line, ["warm up", "warm-up", "launch"]),
      3
    ),
  })

  pushFeatureIfAny(items, {
    key: "guided_practice",
    label: "Guided Practice",
    description: "Includes guided-practice structure or guided work time.",
    category: "instructional_flow",
    evidence: takeBestMatches(
      lines,
      (line) => containsAny(line, ["guided practice", "we do", "guided support"]),
      3
    ),
  })

  pushFeatureIfAny(items, {
    key: "independent_practice",
    label: "Independent Practice",
    description: "Includes independent-practice structure or independent work time.",
    category: "instructional_flow",
    evidence: takeBestMatches(
      lines,
      (line) => containsAny(line, ["independent practice", "you do", "independent work"]),
      3
    ),
  })

  pushFeatureIfAny(items, {
    key: "closure",
    label: "Closure",
    description: "Includes a closing or wrap-up lesson segment.",
    category: "instructional_flow",
    evidence: takeBestMatches(
      lines,
      (line) => containsAny(line, ["closure", "wrap up", "wrap-up"]),
      3
    ),
  })

  pushFeatureIfAny(items, {
    key: "exit_ticket",
    label: "Exit Ticket",
    description: "Includes an exit ticket or end-of-lesson check.",
    category: "instructional_flow",
    evidence: takeBestMatches(
      lines,
      (line) => containsAny(line, ["exit ticket", "final check", "before you leave"]),
      3
    ),
  })

  pushFeatureIfAny(items, {
    key: "centers",
    label: "Centers",
    description: "Includes centers or rotation-based instructional structure.",
    category: "instructional_flow",
    evidence: takeBestMatches(
      lines,
      (line) => containsAny(line, ["center", "centers", "rotation", "stations"]),
      3
    ),
  })

  pushFeatureIfAny(items, {
    key: "timers",
    label: "Timers",
    description: "Includes explicit time boxes or timer cues.",
    category: "pacing",
    evidence: takeBestMatches(
      lines,
      (line) =>
        /\b\d+\s?(minute|minutes|min)\b/i.test(line) ||
        containsAny(line, ["timer", "timing"]),
      3
    ),
  })

  pushFeatureIfAny(items, {
    key: "pacing_markers",
    label: "Pacing Markers",
    description: "Includes transition or pacing language that structures lesson flow.",
    category: "pacing",
    evidence: takeBestMatches(
      lines,
      (line) => containsAny(line, ["transition", "pace", "timing", "next", "then"]),
      3
    ),
  })

  pushFeatureIfAny(items, {
    key: "slide_numbering",
    label: "Slide Numbering",
    description: "Includes explicit slide numbering cues.",
    category: "structure",
    evidence: takeBestMatches(lines, (line) => /^slide \d+$/i.test(line.trim()), 3),
  })

  pushFeatureIfAny(items, {
    key: "image_slots",
    label: "Image Slots",
    description: "Includes image placeholders or image-based layout cues.",
    category: "visual_layout",
    evidence: takeBestMatches(
      lines,
      (line) => containsAny(line, ["image", "photo", "picture", "illustration"]),
      3
    ),
  })

  pushFeatureIfAny(items, {
    key: "table_layout",
    label: "Table Layout",
    description: "Includes table-based layout or grid structure cues.",
    category: "visual_layout",
    evidence: takeBestMatches(
      lines,
      (line) => containsAny(line, ["table", "chart", "grid"]),
      3
    ),
  })

  pushFeatureIfAny(items, {
    key: "split_layout",
    label: "Split Layout",
    description: "Includes side-by-side or split-screen layout cues.",
    category: "visual_layout",
    evidence: takeBestMatches(
      lines,
      (line) => containsAny(line, ["left side", "right side", "side by side", "two column", "split"]),
      3
    ),
  })

  pushFeatureIfAny(items, {
    key: "color_theme",
    label: "Color Theme",
    description: "Includes repeated color or theme styling cues.",
    category: "theme_style",
    evidence: takeBestMatches(
      lines,
      (line) => containsAny(line, ["color", "theme", "highlight", "shade"]),
      3
    ),
  })

  pushFeatureIfAny(items, {
    key: "visual_theme",
    label: "Visual Theme",
    description: "Includes recurring visual styling or thematic presentation cues.",
    category: "theme_style",
    evidence: takeBestMatches(
      lines,
      (line) => containsAny(line, ["visual", "style", "theme", "icon", "layout"]),
      3
    ),
  })

  pushFeatureIfAny(items, {
    key: "word_list_slots",
    label: "Word List Slots",
    description: "Includes places where word-list content appears to be slotted in.",
    category: "content_slots",
    evidence: takeBestMatches(
      lines,
      (line) => containsAny(line, ["word list", "target words", "heart words", "decodable words"]),
      3
    ),
  })

  pushFeatureIfAny(items, {
    key: "passage_slots",
    label: "Passage Slots",
    description: "Includes places where passage or text content appears to be slotted in.",
    category: "content_slots",
    evidence: takeBestMatches(
      lines,
      (line) => containsAny(line, ["passage", "story", "text", "article", "selection"]),
      3
    ),
  })

  pushFeatureIfAny(items, {
    key: "practice_task_slots",
    label: "Practice Task Slots",
    description: "Includes places where practice tasks appear to be slotted in.",
    category: "content_slots",
    evidence: takeBestMatches(
      lines,
      (line) =>
        containsAny(line, [
          "guided practice",
          "independent practice",
          "practice",
          "task",
          "activity",
          "work time",
        ]),
      3
    ),
  })

  return {
    items: items.slice(0, MAX_FIELD_ITEMS * 2),
    warnings: buildExemplarFeatureWarnings(lines, items),
  }
}

function buildExemplarFeatureWarnings(
  lines: string[],
  items: ExemplarDetectedFeature[]
): string[] {
  const warnings: string[] = []

  if (!lines.length) {
    warnings.push("Little usable exemplar text was available for feature detection.")
  }

  if (!items.length && lines.length > 0) {
    warnings.push("No strong exemplar features were confidently detected from extracted text.")
  }

  const visualCueCount = items.filter((item) =>
    item.category === "visual_layout" || item.category === "theme_style"
  ).length

  if (visualCueCount === 0 && lines.length > 0) {
    warnings.push("Visual/style features may be under-detected when extraction is mostly text-only.")
  }

  return warnings
}

function pushFeatureIfAny(
  items: ExemplarDetectedFeature[],
  input: {
    key: ExemplarDetectedFeatureKey
    label: string
    description: string
    evidence: string[]
    category: ExemplarDetectedFeatureCategory
  }
) {
  if (!input.evidence.length) {
    return
  }

  items.push({
    key: input.key,
    label: input.label,
    description: input.description,
    evidence: input.evidence,
    confidence: calculateFeatureConfidence(input.evidence),
    category: input.category,
  })
}

function calculateFeatureConfidence(evidence: string[]): number {
  if (evidence.length >= 3) return 0.9
  if (evidence.length === 2) return 0.75
  return 0.6
}

function deriveCurriculumTags(lines: string[]): string[] {
  const tags = unique([
    ...inferPhonicsTags(lines),
    ...inferComprehensionTags(lines),
    ...tagIfAny(findStandards(lines), "standards"),
    ...tagIfAny(selectVocabulary(lines), "vocabulary"),
    ...tagIfAny(selectWordLists(lines), "word work"),
    ...tagIfAny(selectPracticeTasks(lines), "practice"),
    ...tagIfAny(selectInstructionalTargets(lines), "instruction"),
    ...tagIfAny(selectSightWords(lines), "sight words"),
    ...tagIfAny(selectFoundationalSkills(lines), "foundational skills"),
    ...tagIfAny(selectTexts(lines), "text"),
  ])

  return tags.length
    ? tags.slice(0, 8)
    : ["curriculum", "standards", "vocabulary", "word work", "text", "practice", "instruction"]
}

function deriveExemplarTags(lines: string[]): string[] {
  const tags = unique([
    ...tagIfAny(selectSlideFlow(lines), "slide flow"),
    ...tagIfAny(selectPacing(lines), "pacing"),
    ...tagIfAny(selectTeacherMoves(lines), "teacher prompts"),
    ...tagIfAny(selectLayoutCues(lines), "layout"),
    ...tagIfAny(selectReusableStructure(lines), "structure"),
    ...tagIfAny(selectTone(lines), "tone"),
  ])

  return tags.length
    ? tags.slice(0, 8)
    : ["exemplar", "structure", "pacing", "teacher prompts", "layout", "slide flow"]
}

function findStandards(lines: string[]): string[] {
  const standardRegexes = [
    /\b(rf|rl|ri|w|l|sl)\.\d+(\.\d+)*\b/i,
    /\b(ccss|common core|standard|standards)\b/i,
  ]

  return takeBestMatches(
    lines,
    (line) => standardRegexes.some((regex) => regex.test(line)),
    MAX_FIELD_ITEMS
  )
}

function selectInstructionalTargets(lines: string[]): string[] {
  return takeBestMatches(
    lines,
    (line) =>
      startsWithAny(line, [
        "objective",
        "learning target",
        "target",
        "goal",
        "focus",
        "skill",
        "students will",
        "i can",
      ]) ||
      containsAny(line, [
        "objective",
        "learning target",
        "students will",
        "i can",
        "today we will",
      ]),
    6
  )
}

function selectVocabulary(lines: string[]): string[] {
  return takeBestMatches(
    lines,
    (line) =>
      containsAny(line, [
        "vocabulary",
        "define",
        "definition",
        "meaning",
        "academic word",
        "target vocabulary",
        "word meaning",
      ]) || looksLikeVocabularyLine(line),
    MAX_FIELD_ITEMS
  )
}

function selectWordLists(lines: string[]): string[] {
  return takeBestMatches(
    lines,
    (line) =>
      containsAny(line, [
        "word list",
        "target words",
        "heart words",
        "decodable words",
        "decode",
        "blending",
        "blend",
        "sort",
        "phonics",
        "pattern",
        "syllable",
        "cvce",
        "cvc",
        "digraph",
        "vowel team",
        "silent e",
        "long a",
        "short a",
      ]) || looksLikeWordList(line),
    MAX_FIELD_ITEMS
  )
}

function selectTexts(lines: string[]): string[] {
  return takeBestMatches(
    lines,
    (line) =>
      containsAny(line, [
        "passage",
        "story",
        "text",
        "article",
        "selection",
        "read aloud",
        "decodable",
        "anchor text",
      ]),
    6
  )
}

function selectPracticeTasks(lines: string[]): string[] {
  return takeBestMatches(
    lines,
    (line) =>
      startsWithAny(line, [
        "guided practice",
        "independent practice",
        "practice",
        "task",
        "activity",
      ]) ||
      containsAny(line, [
        "guided practice",
        "independent practice",
        "partner practice",
        "turn and talk",
        "work time",
        "read the word list",
        "write a sentence",
        "sort the words",
        "respond",
        "discussion",
        "partner",
      ]),
    MAX_FIELD_ITEMS
  )
}

function selectExamples(lines: string[]): string[] {
  return takeBestMatches(
    lines,
    (line) =>
      containsAny(line, [
        "example",
        "for example",
        "model",
        "sample",
        "teacher example",
        "worked example",
      ]) || startsWithAny(line, ["example", "teacher example", "model"]),
    6
  )
}

function selectFoundationalSkills(lines: string[]): string[] {
  return takeBestMatches(
    lines,
    (line) =>
      containsAny(line, [
        "phonemic awareness",
        "phoneme",
        "segment",
        "blend",
        "blending",
        "decode",
        "decodable",
        "phonics",
        "letter sound",
        "sound-spelling",
        "sound spelling",
        "word work",
        "syllable",
        "cvc",
        "cvce",
        "digraph",
        "vowel team",
        "silent e",
        "long a",
        "short a",
        "high frequency word",
        "heart word",
        "sight word",
        "fluency",
      ]),
    MAX_FIELD_ITEMS
  )
}

function selectSightWords(lines: string[]): string[] {
  return takeBestMatches(
    lines,
    (line) =>
      containsAny(line, [
        "sight word",
        "sight words",
        "high frequency word",
        "high-frequency word",
        "heart word",
        "heart words",
        "tricky word",
        "tricky words",
        "irregular word",
        "irregular words",
      ]),
    MAX_FIELD_ITEMS
  )
}

function selectCoveredLessonSegments(lines: string[]): string[] {
  return takeBestMatches(
    lines,
    (line) =>
      containsAny(line, [
        "opening",
        "warm up",
        "warm-up",
        "mini lesson",
        "teach",
        "guided practice",
        "independent practice",
        "closure",
        "exit ticket",
        "small group",
        "intervention",
        "center",
        "rotation",
        "fluency",
        "read aloud",
      ]),
    MAX_FIELD_ITEMS
  )
}

function selectSlideFlow(lines: string[]): string[] {
  return takeBestMatches(
    lines,
    (line) =>
      containsAny(line, [
        "opening",
        "objective",
        "warm up",
        "mini lesson",
        "teach",
        "guided practice",
        "independent practice",
        "closure",
        "exit ticket",
        "slide",
      ]),
    10
  )
}

function selectPacing(lines: string[]): string[] {
  return takeBestMatches(
    lines,
    (line) =>
      /\b\d+\s?(minute|minutes|min)\b/i.test(line) ||
      containsAny(line, ["timing", "pace", "transition", "timer", "launch", "warm up"]),
    8
  )
}

function selectTeacherMoves(lines: string[]): string[] {
  return takeBestMatches(
    lines,
    (line) =>
      startsWithAny(line, [
        "teacher says",
        "teacher will",
        "model",
        "guide",
        "ask",
        "say",
        "show students",
        "explain",
        "turn and talk",
      ]) ||
      containsAny(line, [
        "teacher says",
        "teacher will",
        "model",
        "think aloud",
        "guide",
        "circulate",
        "listen for",
        "turn and talk",
      ]),
    8
  )
}

function selectPromptStyle(lines: string[]): string[] {
  return takeBestMatches(
    lines,
    (line) =>
      startsWithAny(line, [
        "prompt",
        "question stem",
        "sentence stem",
        "turn and talk",
      ]) ||
      containsAny(line, [
        "prompt students",
        "question stem",
        "sentence stem",
        "turn and talk",
        "discuss",
        "share with a partner",
        "what do you notice",
      ]),
    8
  )
}

function selectLayoutCues(lines: string[]): string[] {
  return takeBestMatches(
    lines,
    (line) =>
      containsAny(line, [
        "layout",
        "template",
        "header",
        "bullet",
        "image",
        "icon",
        "visual",
        "color",
        "box",
        "table",
        "card",
      ]),
    8
  )
}

function selectTone(lines: string[]): string[] {
  return takeBestMatches(
    lines,
    (line) =>
      containsAny(line, [
        "encourage",
        "celebrate",
        "scholar",
        "friendly",
        "direct",
        "clear",
        "supportive",
      ]),
    6
  )
}

function selectReusableStructure(lines: string[]): string[] {
  return takeBestMatches(
    lines,
    (line) =>
      containsAny(line, [
        "i do",
        "we do",
        "you do",
        "opening",
        "mini lesson",
        "closure",
        "center",
        "rotation",
        "warm up",
        "teach",
        "practice",
      ]),
    8
  )
}

function takeBestMatches(
  lines: string[],
  predicate: (line: string) => boolean,
  limit: number
): string[] {
  return unique(
    lines
      .filter(predicate)
      .sort((a, b) => scoreLine(b) - scoreLine(a))
  ).slice(0, limit)
}

function scoreLine(line: string): number {
  const lower = line.toLowerCase()
  let score = 0

  if (/\b(rf|rl|ri|w|l|sl)\.\d+(\.\d+)*\b/i.test(line)) score += 5
  if (/\b\d+\s?(minute|minutes|min)\b/i.test(line)) score += 4
  if (containsAny(lower, ["objective", "learning target", "students will", "i can", "today we will"])) score += 4
  if (containsAny(lower, ["guided practice", "independent practice", "closure", "turn and talk"])) score += 3
  if (containsAny(lower, ["phonics", "syllable", "cvce", "cvc", "long a", "short a", "vowel team", "silent e", "decode"])) score += 3
  if (containsAny(lower, ["vocabulary", "define", "meaning", "example", "model"])) score += 2

  const wordCount = lower.split(/\s+/).filter(Boolean).length
  if (wordCount >= 3 && wordCount <= 18) score += 2
  if (wordCount > 30) score -= 2

  return score
}

function looksLikeVocabularyLine(line: string): boolean {
  const lower = line.toLowerCase()
  return (
    /.+\s[-:]\s.+/.test(line) &&
    !lower.includes("http") &&
    !lower.includes("www.")
  )
}

function looksLikeWordList(line: string): boolean {
  const parts = line
    .split(/[,:;•|]/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0)

  if (parts.length < 3) return false

  return parts.every((part) => part.split(/\s+/).length <= 3)
}

function inferPhonicsTags(lines: string[]): string[] {
  const joined = lines.join(" ").toLowerCase()
  const tags: string[] = []

  if (
    containsAny(joined, [
      "phonics",
      "decode",
      "decodable",
      "blending",
      "blend",
      "word list",
      "silent e",
      "vowel team",
      "cvce",
      "cvc",
      "digraph",
      "syllable",
      "long a",
      "short a",
    ])
  ) {
    tags.push("phonics")
  }

  if (joined.includes("long a")) tags.push("long a")
  if (joined.includes("short a")) tags.push("short a")
  if (joined.includes("cvce")) tags.push("cvce")
  if (joined.includes("cvc")) tags.push("cvc")
  if (joined.includes("syllable")) tags.push("syllables")

  return tags
}

function inferComprehensionTags(lines: string[]): string[] {
  const joined = lines.join(" ").toLowerCase()
  const tags: string[] = []

  if (
    containsAny(joined, [
      "comprehension",
      "main idea",
      "key details",
      "details",
      "character",
      "theme",
      "retell",
      "summarize",
      "summary",
      "text evidence",
      "infer",
      "inference",
      "ask and answer",
      "respond to text",
    ])
  ) {
    tags.push("comprehension")
  }

  return tags
}

function tagIfAny(items: string[], tag: string): string[] {
  return items.length ? [tag] : []
}

function containsAny(text: string, terms: string[]): boolean {
  const lower = text.toLowerCase()
  return terms.some((term) => lower.includes(term))
}

function startsWithAny(text: string, prefixes: string[]): boolean {
  const lower = text.toLowerCase()
  return prefixes.some((prefix) => lower.startsWith(prefix))
}

function unique(items: string[]): string[] {
  return Array.from(new Set(items))
}

function computeCurriculumSignalStrength(c: CurriculumAnalysis): number {
  let score = 0

  score += c.standards.length * 4
  score += c.instructionalTargets.length * 3
  score += c.vocabulary.length * 2
  score += c.wordLists.length * 2
  score += c.practiceTasks.length * 3
  score += c.examples.length * 2
  score += c.texts.length * 2

  return score
}

function computeExemplarSignalStrength(e: ExemplarAnalysis): number {
  let score = 0

  score += e.slideFlow.length * 3
  score += e.pacing.length * 2
  score += e.teacherMoves.length * 2
  score += e.layoutCues.length * 2
  score += e.reusableStructure.length * 3

  if (e.detectedFeatures) {
    score += e.detectedFeatures.items.length * 4
  }

  return score
}







