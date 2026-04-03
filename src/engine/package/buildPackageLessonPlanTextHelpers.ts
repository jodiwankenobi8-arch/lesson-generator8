import type { LessonBlueprint, LessonInputs } from "../types"

export function buildLessonHeader(inputs: LessonInputs): string {
  const lines = [
    `Grade: ${inputs.grade}`,
    `Subject: ${inputs.subject}`,
    inputs.standard.trim() ? `Standard(s): ${inputs.standard}` : "",
    `Skill / Focus: ${inputs.skill}`,
    inputs.topic.trim() ? `Topic / Text / Unit: ${inputs.topic}` : "",
    inputs.duration.trim() ? `Duration: ${inputs.duration}` : "",
    inputs.notes?.trim() ? `Anything I should know?: ${inputs.notes}` : "",
  ]

  return lines.filter(Boolean).join("\n")
}


export function buildStandardsSummary(
  inputs: LessonInputs,
  blueprint: LessonBlueprint
): string {
  const standards = [inputs.standard, ...blueprint.content.standards]
    .map((item) => item.trim())
    .filter(Boolean)

  return joinOrFallback(Array.from(new Set(standards)).slice(0, 4), "No standards surfaced yet.")
}


export function buildObjectiveSummary(
  inputs: LessonInputs,
  blueprint: LessonBlueprint
): string {
  const skill = inputs.skill.trim() || "the lesson focus"
  const explicitTopic = inputs.topic.trim()

  if (explicitTopic.length > 0) {
    return `Students will work on ${skill} through ${explicitTopic}.`
  }

  return `Students will work on ${skill} using the selected lesson materials.`
}


export function buildLessonPortionsBlock(blueprint: LessonBlueprint): string {
  const areaKeys = getOrderedPackageAreaKeys(blueprint)

  if (areaKeys.length <= 1) {
    return ""
  }

  return buildSectionNarrativeBlock(
    "Lesson Portions",
    [
      `Portion Order: ${areaKeys.map(formatPackageAreaLabel).join(" -> ")}`,
      "Keep each resolved area in its own practical lesson portion instead of one vague combined catch-all block.",
    ],
    areaKeys.map((areaKey, index) => buildLessonPortionLine(blueprint, areaKey, index))
  )
}


function buildLessonPortionLine(
  blueprint: LessonBlueprint,
  areaKey: string,
  index: number
): string {
  const label = formatPackageAreaLabel(areaKey)

  if (areaKey === "foundational") {
    return `Lesson Portion ${index + 1} (${label}): Opening - warm up with ${joinOrFallback(blueprint.content.wordLists.slice(0, 3), "target examples")}. Teach - model the skill clearly. Guided Practice - support students with ${joinOrFallback(blueprint.content.practiceIdeas.slice(0, 2), "guided skill practice")}. Independent Practice - give students their own transfer task with the same pattern. Closure / Check - quickly revisit the strongest examples.`
  }

  if (areaKey === "comprehension") {
    return `Lesson Portion ${index + 1} (${label}): Opening - connect students to ${joinOrFallback(blueprint.content.texts.slice(0, 1), "the lesson text")}. Teach - model the key thinking. Guided Practice - support discussion and evidence work. Independent Practice - move students into an individual response tied to ${joinOrFallback(blueprint.content.practiceIdeas.slice(0, 2), "the text task")}. Closure / Check - reconnect the text takeaway.`
  }

  if (areaKey === "vocabulary_oral_language") {
    return `Lesson Portion ${index + 1} (${label}): Opening - surface the target words or language. Teach - model meaning and oral use. Guided Practice - rehearse the language together. Independent Practice - have students use the language on their own. Closure / Check - listen for accurate language use.`
  }

  if (areaKey === "fluency") {
    return `Lesson Portion ${index + 1} (${label}): Opening - set the fluency focus with ${joinOrFallback(blueprint.content.texts.slice(0, 1), "the lesson text")}. Teach - model phrasing, accuracy, and pace. Guided Practice - use echo, choral, or partner reading. Independent Practice - students reread independently. Closure / Check - finish with a brief fluency check.`
  }

  if (areaKey === "writing") {
    return `Lesson Portion ${index + 1} (${label}): Opening - frame the writing task or prompt. Teach - model the writing move. Guided Practice - support planning or shared writing. Independent Practice - students write on their own. Closure / Check - share, revise, or reflect on the writing.`
  }

  if (areaKey === "grammar_language_conventions") {
    return `Lesson Portion ${index + 1} (${label}): Opening - introduce the sentence or language example. Teach - model the convention. Guided Practice - work through supported sentence practice. Independent Practice - students apply the convention independently. Closure / Check - review whether the convention transferred.`
  }

  return `Lesson Portion ${index + 1} (${label}): Opening - orient students to the focus. Teach - model the key move. Guided Practice - support the work together. Independent Practice - give students their own application task. Closure / Check - end with a quick review.`
}


function getOrderedPackageAreaKeys(blueprint: LessonBlueprint): string[] {
  const profileKeys = (
    blueprint as LessonBlueprint & {
      content?: { profile?: { dominantAreaKeys?: string[] | null } | null }
    }
  ).content?.profile?.dominantAreaKeys ?? []

  const raw = profileKeys.length > 0
    ? profileKeys.flatMap((key) => normalizePackageAreaAlias(key))
    : [
        ...normalizePackageAreaAlias(blueprint.content.target.primary),
        ...normalizePackageAreaAlias(blueprint.content.target.secondary ?? undefined),
      ]

  return Array.from(new Set(raw.filter((key) => key !== "general"))).sort(
    (a, b) => getPackageAreaRank(a) - getPackageAreaRank(b)
  )
}


function normalizePackageAreaAlias(value?: string | null): string[] {
  const normalized = (value ?? "").trim().toLowerCase()

  switch (normalized) {
    case "":
    case "mixed":
    case "general":
      return []
    case "phonological_awareness":
    case "phonemic_awareness":
    case "phonics":
    case "decoding":
    case "encoding":
    case "spelling":
    case "spelling_encoding":
    case "word_recognition":
    case "high_frequency_words":
    case "letter_identification":
    case "word_building":
    case "decodable_reading":
    case "foundational_skills":
    case "foundational":
      return ["foundational"]
    case "language_comprehension":
    case "comprehension":
    case "reading_response":
      return ["comprehension"]
    case "vocabulary":
    case "vocabulary_oral_language":
    case "oral_language":
    case "speaking_listening":
      return ["vocabulary_oral_language"]
    case "fluency":
      return ["fluency"]
    case "writing_about_reading":
    case "writing_sentence_work":
    case "writing":
      return ["writing"]
    case "grammar_language_conventions":
    case "grammar":
      return ["grammar_language_conventions"]
    case "knowledge_building":
      return ["knowledge_building"]
    default:
      return [normalized]
  }
}


function getPackageAreaRank(areaKey: string): number {
  switch (areaKey) {
    case "foundational":
      return 0
    case "vocabulary_oral_language":
      return 1
    case "fluency":
      return 2
    case "comprehension":
      return 3
    case "grammar_language_conventions":
      return 4
    case "writing":
      return 5
    case "knowledge_building":
      return 6
    default:
      return 7
  }
}


function formatPackageAreaLabel(areaKey: string): string {
  switch (areaKey) {
    case "foundational":
      return "foundational skill"
    case "vocabulary_oral_language":
      return "vocabulary / oral language"
    case "grammar_language_conventions":
      return "grammar / language conventions"
    default:
      return areaKey.replace(/_/g, " ")
  }
}



function buildSectionNarrativeBlock(
  title: string,
  contextLines: string[],
  steps: string[]
): string {
  const details = contextLines.map((line) => `- ${line}`)
  const body = steps.map((step) => `- ${step}`)

  return [title, ...details, ...body].join("\n")
}

function joinOrFallback(items: string[], fallback: string): string {
  const cleaned = Array.from(
    new Set((items ?? []).map((item) => item.trim()).filter((item) => item.length > 0))
  )

  return cleaned.length > 0 ? cleaned.join(", ") : fallback
}
