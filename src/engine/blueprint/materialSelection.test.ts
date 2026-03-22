import { describe, expect, it } from "vitest"
import type { MaterialAnalysis, MaterialFile, MaterialUseDecision } from "../types"
import { selectStrongestEligibleMaterials } from "./materialSelection"

function makeReliability(
  score: number,
  contentDecision: MaterialUseDecision,
  structureDecision: MaterialUseDecision
) {
  return {
    level: "high" as const,
    score,
    usableForContent: contentDecision !== "block",
    usableForStructure: structureDecision !== "block",
    contentDecision,
    structureDecision,
    reasons: [],
    warnings: [],
  }
}

function makeCurriculumMaterial(args: {
  id: string
  name: string
  score: number
  contentDecision: MaterialUseDecision
  standards?: string[]
  vocabulary?: string[]
  wordLists?: string[]
  texts?: string[]
  practiceTasks?: string[]
  instructionalTargets?: string[]
}): MaterialFile {
  const analysis: MaterialAnalysis = {
    sourceRole: "curriculum",
    summary: args.name,
    extractedText: [],
    tags: [],
    reliability: makeReliability(args.score, args.contentDecision, "block"),
    curriculum: {
      standards: args.standards ?? [],
      vocabulary: args.vocabulary ?? [],
      wordLists: args.wordLists ?? [],
      texts: args.texts ?? [],
      practiceTasks: args.practiceTasks ?? [],
      instructionalTargets: args.instructionalTargets ?? [],
      examples: [],
    },
  }

  return {
    id: args.id,
    name: args.name,
    role: "curriculum",
    status: "ready",
    analysis,
    errorMessage: null,
    styleSettings: null,
    fileBuffer: null,
    fileContent: null,
  }
}

function makeExemplarMaterial(args: {
  id: string
  name: string
  score: number
  structureDecision: MaterialUseDecision
  slideFlow?: string[]
  pacing?: string[]
  teacherMoves?: string[]
  promptStyle?: string[]
  layoutCues?: string[]
  tone?: string[]
  reusableStructure?: string[]
}): MaterialFile {
  const analysis: MaterialAnalysis = {
    sourceRole: "exemplar",
    summary: args.name,
    extractedText: [],
    tags: [],
    reliability: makeReliability(args.score, "block", args.structureDecision),
    exemplar: {
      slideFlow: args.slideFlow ?? [],
      pacing: args.pacing ?? [],
      teacherMoves: args.teacherMoves ?? [],
      promptStyle: args.promptStyle ?? [],
      layoutCues: args.layoutCues ?? [],
      tone: args.tone ?? [],
      reusableStructure: args.reusableStructure ?? [],
    },
  }

  return {
    id: args.id,
    name: args.name,
    role: "exemplar",
    status: "ready",
    analysis,
    errorMessage: null,
    styleSettings: null,
    fileBuffer: null,
    fileContent: null,
  }
}

describe("materialSelection reliability ranking", () => {
  it("prefers allow over caution for curriculum content when reliability scores tie", () => {
    const cautionCurriculum = makeCurriculumMaterial({
      id: "curriculum-caution",
      name: "caution curriculum",
      score: 90,
      contentDecision: "caution",
      standards: ["RF.1.3"],
      vocabulary: ["short a", "blend", "segment"],
      wordLists: ["cat", "map", "sat"],
      texts: ["Decodable passage"],
      practiceTasks: ["Blend and read words"],
      instructionalTargets: ["Read short a CVC words"],
    })

    const allowCurriculum = makeCurriculumMaterial({
      id: "curriculum-allow",
      name: "allow curriculum",
      score: 90,
      contentDecision: "allow",
      standards: ["RF.1.3"],
      vocabulary: ["short a"],
      wordLists: [],
      texts: [],
      practiceTasks: [],
      instructionalTargets: [],
    })

    const ranked = selectStrongestEligibleMaterials(
      [cautionCurriculum, allowCurriculum],
      "curriculum",
      "content"
    )

    expect(ranked.map((material) => material.id)).toEqual([
      "curriculum-allow",
      "curriculum-caution",
    ])
  })

  it("prefers allow over caution for exemplar structure when reliability scores tie", () => {
    const cautionExemplar = makeExemplarMaterial({
      id: "exemplar-caution",
      name: "caution exemplar",
      score: 90,
      structureDecision: "caution",
      slideFlow: ["Mini lesson", "Guided practice", "Closure"],
      pacing: ["5 min launch", "10 min guided practice"],
      teacherMoves: ["Prompt for evidence"],
      promptStyle: ["Turn and talk"],
      layoutCues: ["Two-column model"],
      tone: ["supportive"],
      reusableStructure: ["I do, we do, you do"],
    })

    const allowExemplar = makeExemplarMaterial({
      id: "exemplar-allow",
      name: "allow exemplar",
      score: 90,
      structureDecision: "allow",
      slideFlow: ["Opening"],
      pacing: [],
      teacherMoves: [],
      promptStyle: [],
      layoutCues: [],
      tone: [],
      reusableStructure: [],
    })

    const ranked = selectStrongestEligibleMaterials(
      [cautionExemplar, allowExemplar],
      "exemplar",
      "structure"
    )

    expect(ranked.map((material) => material.id)).toEqual([
      "exemplar-allow",
      "exemplar-caution",
    ])
  })
})
