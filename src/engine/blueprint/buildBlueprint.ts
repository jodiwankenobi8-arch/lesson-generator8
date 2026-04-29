import {
  detectLessonTargetsFromProfile,
  resolveLessonMode,
  resolveLessonProfile,
} from "./detectLessonTargets"
import { resolveBlueprintContent } from "./resolveBlueprintContent"
import { resolveBlueprintStructure } from "./resolveBlueprintStructure"
import { buildBlueprintSourceReadiness } from "./buildBlueprintSourceReadiness"
import { selectStrongestEligibleMaterials } from "./materialSelection"
import {
  BlueprintScopedTemplateShells,
  BlueprintTemplateShell,
  CurriculumAnalysis,
  ExemplarAnalysis,
  ExemplarStyleSettings,
  LessonBlueprint,
  LessonInputs,
  LessonMode,
  MaterialFile,
} from "../types"

export function buildBlueprint(
  inputs: LessonInputs,
  materials: MaterialFile[],
  selectedMode: LessonMode
): LessonBlueprint {
  const curriculumMaterials = selectStrongestEligibleMaterials(
    materials,
    "curriculum",
    "content"
  )

  const exemplarMaterials = selectStrongestEligibleMaterials(
    materials,
    "exemplar",
    "structure"
  )

  const curriculumAnalyses = curriculumMaterials
    .slice(0, 2)
    .map((material) => material.analysis?.curriculum)
    .filter((analysis): analysis is CurriculumAnalysis => Boolean(analysis))

  const sharedExemplarMaterials = selectScopedExemplarMaterials(
    exemplarMaterials,
    "shared",
    { fallbackToAll: true }
  )

  const exemplarAnalyses = sharedExemplarMaterials
    .slice(0, 2)
    .map((material) =>
      material.analysis?.exemplar
        ? applyExemplarStyleSettings(material.analysis.exemplar, material.styleSettings)
        : null
    )
    .filter((analysis): analysis is ExemplarAnalysis => Boolean(analysis))

  const profile = resolveLessonProfile({
    inputs,
    selectedMode,
    curriculumAnalyses,
  })

  const rawTarget = detectLessonTargetsFromProfile(profile, selectedMode)
  const resolvedMode = resolveLessonMode(selectedMode, rawTarget)
  const target = buildResolvedTarget(rawTarget, resolvedMode)

  const content = resolveBlueprintContent({
    curriculumMaterials,
    curriculumAnalyses,
    inputs: {
      standard: inputs.standard,
      grade: inputs.grade,
      subject: inputs.subject,
      skill: inputs.skill,
      topic: inputs.topic,
    },
    target,
  })

  const baseStructure = resolveBlueprintStructure({
    exemplarAnalyses,
    target,
  })

  const scopedTemplateShells = buildScopedTemplateShells(
    exemplarMaterials,
    target,
    baseStructure.templateShell
  )
  const structure = {
    ...baseStructure,
    scopedTemplateShells,
  }

  const sourceReadiness = buildBlueprintSourceReadiness({
    curriculumMaterials,
    exemplarMaterials,
    coverage: content.coverage,
    standards: content.standards,
    vocabulary: content.vocabulary,
    texts: content.texts,
    practiceIdeas: content.practiceIdeas,
    lessonSegments: structure.lessonSegments,
    timing: structure.timing,
    teacherMoves: structure.teacherMoves,
    promptStyle: structure.promptStyle,
    slideShell: structure.templateShell.slideShell,
  })

  return {
    content: {
      target,
      profile,
      ...content,
    },
    structure,
    sourceReadiness,
  }
}

function applyExemplarStyleSettings(
  analysis: ExemplarAnalysis,
  styleSettings?: ExemplarStyleSettings | null
): ExemplarAnalysis {
  if (!styleSettings) {
    return analysis
  }

  if (styleSettings.mode === "copy_closely" || styleSettings.mode === "inspiration") {
    return analysis
  }

  if (styleSettings.mode === "custom" && styleSettings.aspects.length === 0) {
    return analysis
  }

  const aspects = new Set(styleSettings.aspects)

  return {
    slideFlow:
      aspects.has("slide_flow") || aspects.has("structure") ? analysis.slideFlow : [],
    pacing: aspects.has("pacing") ? analysis.pacing : [],
    teacherMoves: aspects.has("teacher_prompts") ? analysis.teacherMoves : [],
    promptStyle: aspects.has("teacher_prompts") ? analysis.promptStyle : [],
    layoutCues: aspects.has("visual_layout") ? analysis.layoutCues : [],
    tone: aspects.has("wording_tone") ? analysis.tone : [],
    reusableStructure: aspects.has("structure") ? analysis.reusableStructure : [],
    detectedFeatures: filterDetectedFeaturesForStyleSettings(analysis, aspects),
  }
}

function filterDetectedFeaturesForStyleSettings(
  analysis: ExemplarAnalysis,
  aspects: Set<ExemplarStyleSettings["aspects"][number]>
) {
  const detected = analysis.detectedFeatures

  if (!detected) {
    return detected
  }

  const items = detected.items.filter((item) => {
    if (item.category === "structure" || item.category === "instructional_flow") {
      return aspects.has("structure") || aspects.has("slide_flow")
    }

    if (item.category === "interaction") {
      return aspects.has("teacher_prompts")
    }

    if (item.category === "pacing") {
      return aspects.has("pacing")
    }

    if (item.category === "visual_layout" || item.category === "theme_style") {
      return aspects.has("visual_layout") || aspects.has("wording_tone")
    }

    if (item.category === "content_slots") {
      return aspects.has("structure") || aspects.has("slide_flow") || aspects.has("visual_layout")
    }

    return true
  })

  return {
    items,
    warnings: detected.warnings,
  }
}

function buildResolvedTarget(
  rawTarget: ReturnType<typeof detectLessonTargetsFromProfile>,
  resolvedMode: LessonMode
) {
  if (resolvedMode === "phonics_only") {
    return {
      primary: "phonics",
      secondary: null,
      isMixedTarget: false,
      recommendedMode: resolvedMode,
    }
  }

  if (resolvedMode === "comprehension_only") {
    return {
      primary: "comprehension",
      secondary: null,
      isMixedTarget: false,
      recommendedMode: resolvedMode,
    }
  }

  if (resolvedMode === "full") {
    return {
      primary: rawTarget.isMixedTarget ? "phonics" : rawTarget.primary,
      secondary: rawTarget.isMixedTarget
        ? rawTarget.secondary ?? "comprehension"
        : rawTarget.secondary,
      isMixedTarget: rawTarget.isMixedTarget,
      recommendedMode: resolvedMode,
    }
  }

  return {
    ...rawTarget,
    recommendedMode: resolvedMode,
  }
}



function buildScopedTemplateShells(
  exemplarMaterials: MaterialFile[],
  target: LessonBlueprint["content"]["target"],
  baseTemplateShell: BlueprintTemplateShell
) {
  const scopeKeys = [
    "lesson_slides",
    "lesson_plan",
    "centers",
    "small_group",
    "intervention",
    "printables",
  ] as const

  if (exemplarMaterials.length === 0) {
    return buildDefaultScopedTemplateShells(baseTemplateShell, target)
  }

  const sharedFallback = selectScopedExemplarMaterials(exemplarMaterials, "shared", {
    fallbackToAll: true,
  })

  const entries = scopeKeys.flatMap((scope) => {
    const scopedMaterials = selectScopedExemplarMaterials(exemplarMaterials, scope, {
      fallbackMaterials: sharedFallback,
    })

    const scopedAnalyses = scopedMaterials
      .slice(0, 2)
      .map((material) =>
        material.analysis?.exemplar
          ? applyExemplarStyleSettings(material.analysis.exemplar, material.styleSettings)
          : null
      )
      .filter((analysis): analysis is ExemplarAnalysis => Boolean(analysis))

    if (scopedAnalyses.length === 0) {
      return []
    }

    const scopedStructure = resolveBlueprintStructure({
      exemplarAnalyses: scopedAnalyses,
      target,
    })

    return [[scope, scopedStructure.templateShell] as const]
  })

  return entries.length > 0 ? Object.fromEntries(entries) : undefined
}

function buildDefaultScopedTemplateShells(
  baseTemplateShell: BlueprintTemplateShell,
  target: LessonBlueprint["content"]["target"]
): BlueprintScopedTemplateShells {
  const supportTone =
    target.primary.toLowerCase() === "phonics"
      ? ["explicit and supportive"]
      : ["clear and supportive"]

  return {
    lesson_plan: cloneTemplateShell(baseTemplateShell),
    lesson_slides: cloneTemplateShell(baseTemplateShell),
    centers: {
      segmentOrder: ["Rotation Launch", "Centers / Rotation", "Independent Rotation", "Share / Closure"],
      slideShell: ["Rotation Launch", "Centers / Rotation", "Independent Rotation", "Share / Closure"],
      timingShell: ["Rotation Launch", "Center Work", "Independent Rotation", "Share / Closure"],
      teacherMoveShell: ["Set up the rotation", "Monitor groups and confer"],
      promptShell: ["Review the directions", "Coach students through the rotation"],
      toneShell: ["clear and organized"],
    },
    small_group: {
      segmentOrder: ["Warm-Up Review", "Reteach / Model", "Guided Practice", "Check for Understanding"],
      slideShell: ["Warm-Up Review", "Reteach / Model", "Guided Practice", "Check for Understanding"],
      timingShell: ["Warm-Up Review", "Reteach / Model", "Guided Practice", "Check for Understanding"],
      teacherMoveShell: ["Warm up the target skill", "Model and prompt the next step"],
      promptShell: ["What do you notice?", "Try it with me."],
      toneShell: supportTone,
    },
    intervention: {
      segmentOrder: ["Re-Engage", "Targeted Reteach", "Supported Practice", "Exit Check"],
      slideShell: ["Re-Engage", "Targeted Reteach", "Supported Practice", "Exit Check"],
      timingShell: ["Re-Engage", "Targeted Reteach", "Supported Practice", "Exit Check"],
      teacherMoveShell: ["Reconnect the missed step", "Guide students through supported practice"],
      promptShell: ["Let's fix the tricky part.", "Show me the next step."],
      toneShell: ["explicit and scaffolded"],
    },
    printables: {
      segmentOrder: ["Directions", "Warm-Up", "Practice", "Exit Ticket"],
      slideShell: ["Directions", "Warm-Up", "Practice", "Exit Ticket"],
      timingShell: [],
      teacherMoveShell: ["Set students up for independent work"],
      promptShell: ["Read the directions.", "Complete the practice and exit ticket."],
      toneShell: ["student-facing and clear"],
    },
  }
}

function cloneTemplateShell(shell: BlueprintTemplateShell): BlueprintTemplateShell {
  return {
    segmentOrder: [...shell.segmentOrder],
    slideShell: [...shell.slideShell],
    timingShell: [...shell.timingShell],
    teacherMoveShell: [...shell.teacherMoveShell],
    promptShell: [...shell.promptShell],
    toneShell: [...shell.toneShell],
  }
}

function selectScopedExemplarMaterials(
  materials: MaterialFile[],
  scope: string,
  options: {
    fallbackToAll?: boolean
    fallbackMaterials?: MaterialFile[]
  } = {}
): MaterialFile[] {
  const scoped = materials.filter((material) => exemplarTargetsInclude(material.styleSettings, scope))

  if (scoped.length > 0) {
    return scoped
  }

  if (options.fallbackMaterials && options.fallbackMaterials.length > 0) {
    return options.fallbackMaterials
  }

  if (options.fallbackToAll) {
    return materials
  }

  return []
}

function exemplarTargetsInclude(
  styleSettings: ExemplarStyleSettings | null | undefined,
  scope: string
): boolean {
  const targets = styleSettings?.targets?.length ? styleSettings.targets : ["shared"]
  return targets.includes(scope as (typeof targets)[number])
}


