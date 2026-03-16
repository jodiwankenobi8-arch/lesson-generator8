import React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

vi.mock("../engine/exports/exportLessonPlanDocx", () => ({
  exportLessonPlanDocx: vi.fn(),
}))

import { exportLessonPlanDocx } from "../engine/exports/exportLessonPlanDocx"
import { CoverageDecisionsSection, PipelineTraceSection, TraceabilitySection, downloadExportArtifact } from "./ResultsPage"
import { useLessonStore } from "../state/useLessonStore"
import type { ExportArtifact, LessonInputs, MaterialAnalysis, MaterialFile, MaterialRole, MissingAreaDecisionChoice, PlanningComponentKey } from "../engine/types"

function makeInputs(overrides: Partial<LessonInputs> = {}): LessonInputs {
  return {
    grade: "1",
    subject: "ELA",
    standard: "RF.1.3",
    skill: "Short a CVC words",
    topic: "Blend and read short a CVC words",
    duration: "30 minutes",
    ...overrides,
  }
}

function makeMaterial(args: {
  id: string
  name: string
  role: MaterialRole
  analysis: MaterialAnalysis
}): MaterialFile {
  return {
    id: args.id,
    name: args.name,
    role: args.role,
    status: "ready",
    analysis: args.analysis,
    errorMessage: null,
    styleSettings: null,
    fileBuffer: null,
    fileContent: null,
  }
}

function makeCurriculumMaterial(): MaterialFile {
  return makeMaterial({
    id: "curriculum-1",
    name: "curriculum.txt",
    role: "curriculum",
    analysis: {
      sourceRole: "curriculum",
      summary: "Curriculum material with clear phonics content support.",
      extractedText: ["RF.1.3", "Objective", "Vocabulary", "Word list"],
      tags: ["curriculum", "phonics", "short a"],
      curriculum: {
        standards: ["RF.1.3"],
        vocabulary: ["short a"],
        wordLists: ["cat, map, sat, ram"],
        texts: ["Decodable passage about a cat and a map."],
        practiceTasks: ["Blend cat, map, sat, ram."],
        instructionalTargets: ["Students will blend and read short a CVC words."],
        examples: ["cat"],
      },
    },
  })
}

function makeExemplarMaterial(): MaterialFile {
  return makeMaterial({
    id: "exemplar-1",
    name: "exemplar.txt",
    role: "exemplar",
    analysis: {
      sourceRole: "exemplar",
      summary: "Exemplar material with lesson structure support.",
      extractedText: ["Opening", "Teach", "Guided Practice", "Closure"],
      tags: ["exemplar", "structure", "slides"],
      exemplar: {
        slideFlow: ["Opening", "Teach", "Guided Practice", "Closure"],
        pacing: ["5 min launch", "10 min model", "10 min practice"],
        teacherMoves: ["Model blending", "Guide student response"],
        promptStyle: ["What do you notice?", "Turn and talk"],
        layoutCues: ["Large word display"],
        tone: ["explicit", "supportive"],
        reusableStructure: ["I do, we do, you do", "Center rotation"],
      },
    },
  })
}

function seedAndGenerate() {
  useLessonStore.setState((state) => ({
    ...state,
    inputs: makeInputs(),
    selectedLessonMode: "single",
    materials: [makeCurriculumMaterial(), makeExemplarMaterial()],
    blueprint: null,
    planningIdeas: null,
    lessonSpec: null,
    lessonPackage: null,
    lessonTrace: null,
    missingAreaDecisions: {},
  }))

  return useLessonStore.getState().generateLesson()
}

function renderCoverageSection(
  decisions: Partial<Record<PlanningComponentKey, MissingAreaDecisionChoice>> = {},
  isRegenerating = false
): string {
  const state = useLessonStore.getState()

  return renderToStaticMarkup(
    <CoverageDecisionsSection
      planningIdeas={state.planningIdeas!}
      decisions={decisions}
      onSetDecision={async () => {}}
      isRegenerating={isRegenerating}
    />
  )
}

describe("Results explainability rendering contracts", () => {
  beforeEach(async () => {
    await seedAndGenerate()
  })

  it("renders selected curriculum/exemplar names and IDs from generated state with blueprint/trace alignment", () => {
    const state = useLessonStore.getState()
    const blueprint = state.blueprint!
    const lessonPackage = state.lessonPackage!
    const lessonTrace = state.lessonTrace!

    expect(lessonTrace.selectedSources.curriculumMaterialIds).toEqual(
      blueprint.sourceReadiness.selectedCurriculumMaterialIds
    )
    expect(lessonTrace.selectedSources.exemplarMaterialIds).toEqual(
      blueprint.sourceReadiness.selectedExemplarMaterialIds
    )

    const traceabilityMarkup = renderToStaticMarkup(
      <TraceabilitySection
        blueprint={blueprint}
        lessonPackage={lessonPackage}
        materials={state.materials}
      />
    )
    const traceMarkup = renderToStaticMarkup(<PipelineTraceSection trace={lessonTrace} />)

    blueprint.sourceReadiness.selectedCurriculumMaterialIds.forEach((id) => {
      const material = state.materials.find((item) => item.id === id)
      expect(material).toBeTruthy()
      expect(traceabilityMarkup).toContain(material!.name)
      expect(traceMarkup).toContain(id)
    })

    blueprint.sourceReadiness.selectedExemplarMaterialIds.forEach((id) => {
      const material = state.materials.find((item) => item.id === id)
      expect(material).toBeTruthy()
      expect(traceabilityMarkup).toContain(material!.name)
      expect(traceMarkup).toContain(id)
    })
  })

  it("keeps support-vs-generated gap messaging visible in coverage rendering", () => {
    const coverageMarkup = renderCoverageSection()

    expect(coverageMarkup).toContain("Coverage and Missing-Area Decisions")
    expect(coverageMarkup).toContain("Source coverage:")
    expect(coverageMarkup).toContain("Generated support:")
  })

  it("keeps explainability rendering synchronized after regeneration decisions", async () => {
    useLessonStore.getState().setMissingAreaDecision("centers", "leave_out")
    await useLessonStore.getState().generateLesson()

    const state = useLessonStore.getState()
    const blueprint = state.blueprint!
    const lessonPackage = state.lessonPackage!
    const lessonTrace = state.lessonTrace!

    expect(lessonTrace.selectedSources.curriculumMaterialIds).toEqual(
      blueprint.sourceReadiness.selectedCurriculumMaterialIds
    )
    expect(lessonTrace.selectedSources.exemplarMaterialIds).toEqual(
      blueprint.sourceReadiness.selectedExemplarMaterialIds
    )

    const traceabilityMarkup = renderToStaticMarkup(
      <TraceabilitySection
        blueprint={blueprint}
        lessonPackage={lessonPackage}
        materials={state.materials}
      />
    )
    const traceMarkup = renderToStaticMarkup(<PipelineTraceSection trace={lessonTrace} />)

    lessonTrace.selectedSources.curriculumMaterialIds.forEach((id) => {
      const material = state.materials.find((item) => item.id === id)
      expect(material).toBeTruthy()
      expect(traceabilityMarkup).toContain(material!.name)
      expect(traceMarkup).toContain(id)
    })

    lessonTrace.selectedSources.exemplarMaterialIds.forEach((id) => {
      const material = state.materials.find((item) => item.id === id)
      expect(material).toBeTruthy()
      expect(traceabilityMarkup).toContain(material!.name)
      expect(traceMarkup).toContain(id)
    })

    const coverageMarkup = renderCoverageSection(state.missingAreaDecisions)
    expect(coverageMarkup).toContain("Source coverage:")
    expect(coverageMarkup).toContain("Generated support:")
  })
})
const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

function makeExportArtifact(
  overrides: Partial<ExportArtifact> = {}
): ExportArtifact {
  return {
    kind: "lesson_plan",
    label: "Lesson Plan Export",
    fileName: "ELA-lesson-plan-export.docx",
    status: "ready",
    mimeType: DOCX_MIME,
    content: "Blueprint Readiness`nTeach",
    ...overrides,
  }
}

function installDownloadDomHarness(objectUrlValue: string) {
  const createdLinks: Array<{
    href: string
    download: string
    click: ReturnType<typeof vi.fn>
  }> = []

  let createdObjectUrlArg: unknown

  const body = {
    appendChild: vi.fn((node: unknown) => node),
    removeChild: vi.fn((node: unknown) => node),
  }

  const documentStub = {
    body,
    createElement: vi.fn((tag: string) => {
      if (tag !== "a") {
        throw new Error(`Unexpected element request: ${tag}`)
      }

      const link = {
        href: "",
        download: "",
        click: vi.fn(),
      }

      createdLinks.push(link)
      return link
    }),
  }

  const urlStub = {
    createObjectURL: vi.fn((value: unknown) => {
      createdObjectUrlArg = value
      return objectUrlValue
    }),
    revokeObjectURL: vi.fn(),
  }

  const previousWindow = (globalThis as Record<string, unknown>).window
  const previousDocument = (globalThis as Record<string, unknown>).document

  ;(globalThis as Record<string, unknown>).window = { URL: urlStub }
  ;(globalThis as Record<string, unknown>).document = documentStub

  return {
    createdLinks,
    body,
    documentStub,
    urlStub,
    getCreatedObjectUrlArg() {
      return createdObjectUrlArg
    },
    restore() {
      if (typeof previousWindow === "undefined") {
        delete (globalThis as Record<string, unknown>).window
      } else {
        ;(globalThis as Record<string, unknown>).window = previousWindow
      }

      if (typeof previousDocument === "undefined") {
        delete (globalThis as Record<string, unknown>).document
      } else {
        ;(globalThis as Record<string, unknown>).document = previousDocument
      }
    },
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe("Results export download contract", () => {
  it("routes DOCX lesson-plan artifacts through exportLessonPlanDocx before download", async () => {
    const docxBlob = new Blob(["docx-binary"], { type: DOCX_MIME })
    vi.mocked(exportLessonPlanDocx).mockResolvedValue(docxBlob)

    const harness = installDownloadDomHarness("blob:docx")

    try {
      const artifact = makeExportArtifact()

      await downloadExportArtifact(artifact)

      expect(exportLessonPlanDocx).toHaveBeenCalledWith(artifact.label, artifact.content)
      expect(harness.urlStub.createObjectURL).toHaveBeenCalledTimes(1)

      const blobArg = harness.getCreatedObjectUrlArg()
      expect(blobArg).toBeTruthy()
      expect(blobArg).toBe(docxBlob)

      expect(harness.createdLinks).toHaveLength(1)
      const appendedLink = harness.createdLinks[0]!

      expect(appendedLink.download).toBe(artifact.fileName)
      expect(appendedLink.href).toBe("blob:docx")
      expect(appendedLink.click).toHaveBeenCalledTimes(1)
      expect(harness.body.appendChild).toHaveBeenCalledWith(appendedLink)
      expect(harness.body.removeChild).toHaveBeenCalledWith(appendedLink)
      expect(harness.urlStub.revokeObjectURL).toHaveBeenCalledWith("blob:docx")
    } finally {
      harness.restore()
    }
  })

  it("downloads plain-text exports directly without DOCX conversion", async () => {
    vi.mocked(exportLessonPlanDocx).mockReset()

    const harness = installDownloadDomHarness("blob:text")

    try {
      const artifact = makeExportArtifact({
        kind: "slides",
        label: "Slides Export",
        fileName: "ELA-slides-export.txt",
        mimeType: "text/plain;charset=utf-8",
        content: "Slides Export`n1. Opening",
      })

      await downloadExportArtifact(artifact)

      expect(exportLessonPlanDocx).not.toHaveBeenCalled()
      expect(harness.urlStub.createObjectURL).toHaveBeenCalledTimes(1)

      const blobArg = harness.getCreatedObjectUrlArg()
      expect(blobArg).toBeTruthy()
      expect(blobArg).toBeInstanceOf(Blob)
      expect((blobArg as Blob).type).toBe("text/plain;charset=utf-8")

      expect(harness.createdLinks).toHaveLength(1)
      const appendedLink = harness.createdLinks[0]!

      expect(appendedLink.download).toBe(artifact.fileName)
      expect(appendedLink.href).toBe("blob:text")
      expect(appendedLink.click).toHaveBeenCalledTimes(1)
      expect(harness.body.appendChild).toHaveBeenCalledWith(appendedLink)
      expect(harness.body.removeChild).toHaveBeenCalledWith(appendedLink)
      expect(harness.urlStub.revokeObjectURL).toHaveBeenCalledWith("blob:text")
    } finally {
      harness.restore()
    }
  })
})




