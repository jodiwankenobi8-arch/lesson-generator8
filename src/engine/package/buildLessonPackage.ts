import {
  LessonBlueprint,
  LessonInputs,
  LessonPackage,
  LessonSpec,
} from "../types"

export function buildLessonPackage(
  inputs: LessonInputs,
  blueprint: LessonBlueprint,
  spec: LessonSpec
): LessonPackage {
  const target = blueprint.content.target
  const primary = target.primary.toLowerCase()
  const isFullMixed = target.isMixedTarget && target.recommendedMode === "full"

  const targetLabel = formatTargetLabel(target.primary, target.secondary)
  const standards = take(blueprint.content.standards, 3, ["TBD"])
  const vocabulary = take(blueprint.content.vocabulary, 5, ["key vocabulary"])
  const texts = take(blueprint.content.texts, 3, ["teacher-provided text"])
  const wordLists = take(blueprint.content.wordLists, 6, ["teacher-selected examples"])
  const timing = take(blueprint.structure.timing, 6, ["Mini-lesson", "Practice", "Closure"])
  const lessonSegments = take(blueprint.structure.lessonSegments, 8, ["Teach", "Practice", "Closure"])
  const teacherMoves = take(blueprint.structure.teacherMoves, 5, ["teacher model", "guided support"])
  const promptStyle = take(blueprint.structure.promptStyle, 5, ["teacher prompt"])
  const tone = take(blueprint.structure.tone, 3, ["clear instructional tone"])

  return {
    slides: buildSlides(targetLabel, blueprint, spec, standards, vocabulary, teacherMoves, promptStyle, tone),
    lessonPlan: buildLessonPlan(
      inputs,
      blueprint,
      spec,
      targetLabel,
      lessonSegments,
      timing,
      teacherMoves,
      promptStyle,
      tone
    ),
    centers: spec.centers.steps,
    rotationPlan: buildRotationPlan(lessonSegments, timing),
    interventions: buildInterventions(primary, isFullMixed, vocabulary, wordLists, texts),
    exports: buildExports(primary, isFullMixed),
  }
}

function buildSlides(
  targetLabel: string,
  blueprint: LessonBlueprint,
  spec: LessonSpec,
  standards: string[],
  vocabulary: string[],
  teacherMoves: string[],
  promptStyle: string[],
  tone: string[]
): string[] {
  const lessonSegments = take(blueprint.structure.lessonSegments, 8, ["Teach", "Practice", "Closure"])
  const timing = take(blueprint.structure.timing, 8, ["Flexible timing"])
  const segmentSlides = lessonSegments.map((segment, index) => {
    const normalized = normalizeSegmentKey(segment)
    const section = getSectionForSegment(normalized, spec)
    const timeBlock = timing[index] ?? "Flexible timing"
    const move = teacherMoves[index % teacherMoves.length] ?? "teacher guidance"
    const prompt = promptStyle[index % promptStyle.length] ?? "teacher prompt"

    return `Slide ${index + 2}: ${segment} | Timing: ${timeBlock} | Teacher Move: ${move} | Prompt Style: ${prompt} | ${section.steps.join(" | ")}`
  })

  return [
    `Slide 1: Objective | Target: ${targetLabel} | Standards: ${standards.join(", ")} | Tone: ${tone.join(", ")}`,
    ...segmentSlides,
    `Slide ${segmentSlides.length + 2}: Teaching Notes | Vocabulary: ${vocabulary.join(", ")} | Teacher Moves: ${teacherMoves.join(", ")} | Prompts: ${promptStyle.join(", ")}`,
  ]
}

function buildLessonPlan(
  inputs: LessonInputs,
  blueprint: LessonBlueprint,
  spec: LessonSpec,
  targetLabel: string,
  lessonSegments: string[],
  timing: string[],
  teacherMoves: string[],
  promptStyle: string[],
  tone: string[]
): string {
  const sections = [
    "LESSON OVERVIEW",
    `Grade: ${inputs.grade || "TBD"}`,
    `Subject: ${inputs.subject || "TBD"}`,
    `Standard(s): ${blueprint.content.standards.join(", ") || "TBD"}`,
    `Skill: ${inputs.skill || "TBD"}`,
    `Topic: ${inputs.topic || "TBD"}`,
    `Duration: ${inputs.duration || "TBD"}`,
    "",
    "TARGET SUMMARY",
    `Primary Target: ${blueprint.content.target.primary}`,
    `Secondary Target: ${blueprint.content.target.secondary || "None"}`,
    `Mixed Target: ${blueprint.content.target.isMixedTarget ? "Yes" : "No"}`,
    `Selected Mode: ${blueprint.content.target.recommendedMode}`,
    `Combined Target Label: ${targetLabel}`,
    "",
    "CONTENT RESOURCES",
    `Vocabulary: ${blueprint.content.vocabulary.join(", ") || "None"}`,
    `Word / Practice Items: ${blueprint.content.wordLists.join(", ") || "None"}`,
    `Texts: ${blueprint.content.texts.join(", ") || "None"}`,
    `Practice Ideas: ${blueprint.content.practiceIdeas.join(", ") || "None"}`,
    "",
    "EXEMPLAR PRESENTATION CUES",
    `Lesson Flow: ${lessonSegments.join(" -> ")}`,
    `Timing: ${timing.join(" | ")}`,
    `Teacher Moves: ${teacherMoves.join(", ")}`,
    `Prompt Style: ${promptStyle.join(", ")}`,
    `Tone: ${tone.join(", ")}`,
    "",
    formatSection("TEACH", spec.teach.steps),
    "",
    formatSection("GUIDED PRACTICE", spec.guidedPractice.steps),
    "",
    formatSection("INDEPENDENT PRACTICE", spec.independentPractice.steps),
    "",
    formatSection("CENTERS", spec.centers.steps),
    "",
    formatSection("CLOSURE", spec.closure.steps),
  ]

  return sections.join("`n")
}

function buildRotationPlan(lessonSegments: string[], timing: string[]): string {
  if (lessonSegments.length === 0) {
    return "Opening -> Practice -> Closure"
  }

  return lessonSegments
    .map((segment, index) => {
      const timeBlock = timing[index] ?? "Flexible timing"
      return `${segment} (${timeBlock})`
    })
    .join(" -> ")
}

function buildInterventions(
  primary: string,
  isFullMixed: boolean,
  vocabulary: string[],
  wordLists: string[],
  texts: string[]
): string[] {
  if (isFullMixed) {
    return [
      "Reteach the foundational skill in a small group before returning to the full task.",
      `Use a reduced word set and guided text support: ${wordLists.slice(0, 3).join(", ")} / ${texts.slice(0, 1).join(", ")}.`,
      `Preteach critical vocabulary before independent work: ${vocabulary.slice(0, 3).join(", ")}.`,
    ]
  }

  if (primary === "phonics") {
    return [
      "Provide additional teacher modeling with a smaller set of target words.",
      `Use repeated decoding and sorting with: ${wordLists.slice(0, 4).join(", ")}.`,
      `Review the key language of the pattern or sound: ${vocabulary.slice(0, 3).join(", ")}.`,
    ]
  }

  if (primary === "comprehension") {
    return [
      "Provide guided rereading and teacher prompting before independent response.",
      `Use a shortened text chunk or supported passage: ${texts.slice(0, 2).join(", ")}.`,
      `Preteach and revisit comprehension vocabulary: ${vocabulary.slice(0, 3).join(", ")}.`,
    ]
  }

  return [
    "Provide reteach with teacher modeling.",
    "Reduce task complexity and increase guided support.",
    `Support key vocabulary during practice: ${vocabulary.slice(0, 2).join(", ")}.`,
  ]
}

function buildExports(primary: string, isFullMixed: boolean): string[] {
  if (isFullMixed) {
    return [
      "Slides PDF",
      "Two-part lesson plan",
      "Center directions",
      "Reteach support sheet",
    ]
  }

  if (primary === "phonics") {
    return [
      "Slides PDF",
      "Printable lesson plan",
      "Word work directions",
      "Phonics practice sheet",
    ]
  }

  if (primary === "comprehension") {
    return [
      "Slides PDF",
      "Printable lesson plan",
      "Response directions",
      "Comprehension task sheet",
    ]
  }

  return ["Slides PDF", "Printable lesson plan", "Center directions"]
}

function getSectionForSegment(segment: string, spec: LessonSpec) {
  if (segment === "teach" || segment === "opening") {
    return spec.teach
  }

  if (segment === "guided_practice") {
    return spec.guidedPractice
  }

  if (segment === "independent_practice") {
    return spec.independentPractice
  }

  if (segment === "centers") {
    return spec.centers
  }

  if (segment === "closure") {
    return spec.closure
  }

  return spec.guidedPractice
}

function normalizeSegmentKey(segment: string): string {
  const lower = segment.toLowerCase()

  if (lower.includes("opening")) return "opening"
  if (lower.includes("teach")) return "teach"
  if (lower.includes("guided")) return "guided_practice"
  if (lower.includes("independent")) return "independent_practice"
  if (lower.includes("center")) return "centers"
  if (lower.includes("closure") || lower.includes("close")) return "closure"

  return "guided_practice"
}

function formatTargetLabel(primary: string, secondary: string | null): string {
  return secondary ? `${primary} + ${secondary}` : primary
}

function formatSection(title: string, steps: string[]): string {
  return [title, ...steps.map((step, index) => `${index + 1}. ${step}`)].join("`n")
}

function take(items: string[], count: number, fallback: string[]): string[] {
  const cleaned = Array.from(
    new Set(items.map((item) => item.trim()).filter((item) => item.length > 0))
  ).slice(0, count)

  return cleaned.length ? cleaned : fallback
}
