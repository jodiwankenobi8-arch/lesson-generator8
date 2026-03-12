import {
  CurriculumAnalysis,
  ExemplarAnalysis,
  MaterialAnalysis,
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

const MAX_LINES = 220
const MAX_FIELD_ITEMS = 8

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

  return `Exemplar material ${name} analyzed with ${lines.length} usable lines, ${flow} slide-flow signals, ${pacing} pacing signals, ${moves} teacher-move signals, and ${structure} reusable structure signals.`
}

function buildCurriculumAnalysis(lines: string[]): CurriculumAnalysis {
  const standards = findStandards(lines)
  const instructionalTargets = selectInstructionalTargets(lines)
  const vocabulary = selectVocabulary(lines)
  const wordLists = selectWordLists(lines)
  const texts = selectTexts(lines)
  const practiceTasks = selectPracticeTasks(lines)
  const examples = selectExamples(lines)

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
  const slideFlow = selectSlideFlow(lines)
  const pacing = selectPacing(lines)
  const teacherMoves = selectTeacherMoves(lines)
  const promptStyle = selectPromptStyle(lines)
  const layoutCues = selectLayoutCues(lines)
  const tone = selectTone(lines)
  const reusableStructure = selectReusableStructure(lines)

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
  const tags = unique([
    ...tagIfAny(findStandards(lines), "standards"),
    ...tagIfAny(selectVocabulary(lines), "vocabulary"),
    ...tagIfAny(selectWordLists(lines), "word work"),
    ...tagIfAny(selectTexts(lines), "text"),
    ...tagIfAny(selectPracticeTasks(lines), "practice"),
    ...tagIfAny(selectInstructionalTargets(lines), "instruction"),
    ...inferPhonicsTags(lines),
    ...inferComprehensionTags(lines),
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
      "details",
      "character",
      "theme",
      "retell",
      "passage",
      "story",
      "article",
      "text evidence",
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


