import React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { readFileSync } from "node:fs"

vi.mock("../engine/exports/exportLessonPlanDocx", () => ({
  exportLessonPlanDocx: vi.fn(),
}))

vi.mock("../engine/exports/exportPrintablesPdf", () => ({
  exportPrintablesPdf: vi.fn(),
}))

vi.mock("../engine/exports/exportSlidesPptx", () => ({
  exportSlidesPptx: vi.fn(),
}))

vi.mock("../engine/exports/exportFullPackageZip", () => ({
  exportFullPackageZip: vi.fn(),
}))

import { exportLessonPlanDocx } from "../engine/exports/exportLessonPlanDocx"
import { exportPrintablesPdf } from "../engine/exports/exportPrintablesPdf"
import { exportSlidesPptx } from "../engine/exports/exportSlidesPptx"
import { exportFullPackageZip } from "../engine/exports/exportFullPackageZip"
import { CoverageDecisionsSection, PipelineTraceSection, TraceabilitySection, downloadExportArtifact, getArtifactButtonLabel, getArtifactDescription } from "./ResultsPage"
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
    expect(traceabilityMarkup).toContain("Authority at a Glance")
    expect(traceabilityMarkup).toContain("Content authority:")
    expect(traceabilityMarkup).toContain("Presentation authority:")
    expect(traceabilityMarkup).toContain("Used with caution or blocked:")
    expect(traceabilityMarkup).toContain("Fallback usage:")

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

  it("keeps the teacher-facing results package labels and order aligned", () => {
    const source = readFileSync("src/pages/ResultsPage.tsx", "utf8")

    const packageSummaryCallIndex = source.indexOf('<PackageSummarySection')
    const packageOutputsCallIndex = source.indexOf('<PackageOutputsSection lessonPackage={lessonPackage} />')
    const coverageDecisionsCallIndex = source.indexOf('<CoverageDecisionsSection')
    const traceabilityCallIndex = source.indexOf('<TraceabilitySection blueprint={blueprint} lessonPackage={lessonPackage} materials={materials} />')
    const planningDetailsCallIndex = source.indexOf('<PlanningDetailsSection')
    const blueprintDetailsCallIndex = source.indexOf('<BlueprintDetailsSection blueprint={blueprint} />')
    const pipelineTraceCallIndex = source.indexOf('{lessonTrace && <PipelineTraceSection trace={lessonTrace} />}')

    const packageSummaryHeadingIndex = source.indexOf('Teacher-facing lesson package first.')
    const lessonPlanIndex = source.indexOf('PreSection title="Lesson Plan"')
    const slidesIndex = source.indexOf('SimpleListSection title="Slides"')
    const teacherLedSupportIndex = source.indexOf('SimpleListSection title="Teacher-Led Support"')
    const studentCentersIndex = source.indexOf('SimpleListSection title="Centers / Independent Work"')
    const centerRotationIndex = source.indexOf('PreSection title="Centers / Independent Work Rotation"')

    expect(packageSummaryCallIndex).toBeGreaterThanOrEqual(0)
    expect(packageOutputsCallIndex).toBeGreaterThan(packageSummaryCallIndex)
    expect(coverageDecisionsCallIndex).toBeGreaterThan(packageOutputsCallIndex)
    expect(traceabilityCallIndex).toBeGreaterThan(coverageDecisionsCallIndex)
    expect(planningDetailsCallIndex).toBeGreaterThan(traceabilityCallIndex)
    expect(blueprintDetailsCallIndex).toBeGreaterThan(planningDetailsCallIndex)
    expect(pipelineTraceCallIndex).toBeGreaterThan(blueprintDetailsCallIndex)

    expect(packageSummaryHeadingIndex).toBeGreaterThanOrEqual(0)
    expect(lessonPlanIndex).toBeGreaterThanOrEqual(0)
    expect(slidesIndex).toBeGreaterThan(lessonPlanIndex)
    expect(teacherLedSupportIndex).toBeGreaterThan(slidesIndex)
    expect(studentCentersIndex).toBeGreaterThan(teacherLedSupportIndex)
    expect(centerRotationIndex).toBeGreaterThan(studentCentersIndex)

    expect(source).toContain('Teacher-facing lesson package first.')
    expect(source).toContain('Lesson Evidence and Planning Details')
    expect(source).toContain('<summary style={summaryStyle}>Lesson Evidence and Planning Details</summary>')
    expect(source).toContain('<SecondaryEvidenceSection')
    expect(source).toContain('Source Authority and Lesson Grounding')
    expect(source).toContain('Teacher Decisions for Missing Lesson Parts')
    expect(source).toContain('<summary style={summaryStyle}>Source Authority and Lesson Grounding</summary>')
    expect(source).toContain('<summary style={summaryStyle}>Pipeline Trace</summary>')
    expect(source).toContain('<summary style={minorSummaryStyle}>Evidence details</summary>')
    expect(source).not.toContain('SimpleListSection title="Interventions"')
    expect(source).not.toContain('PreSection title="Rotation Plan"')
  })

  it("uses usable-material trust language for results gating", () => {
    const source = readFileSync("src/pages/ResultsPage.tsx", "utf8")

    expect(source).toContain('const hasUsableMaterialsForGeneration = useLessonStore((state) => state.hasUsableMaterialsForGeneration)()')
    expect(source).not.toContain('const hasReadyMaterials = useLessonStore((state) => state.hasReadyMaterials)()')

    expect(source).toContain('Results are blocked until at least one curriculum or exemplar material is usable for grounded generation.')
    expect(source).toContain('Inputs are complete and at least one material is usable, but no generated lesson is currently loaded.')
    expect(source).toContain('Ready files:')

    expect(source).not.toContain('Results are blocked until at least one material is analyzed and ready.')
    expect(source).not.toContain('Inputs and materials are ready, but no generated lesson is currently loaded.')
  })

  it("keeps support-vs-generated gap messaging visible in coverage rendering", () => {
    const coverageMarkup = renderCoverageSection()

    expect(coverageMarkup).toContain("Teacher Decisions for Missing Lesson Parts")
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
    expect(traceabilityMarkup).toContain("Authority at a Glance")
    expect(traceabilityMarkup).toContain("Content authority:")
    expect(traceabilityMarkup).toContain("Presentation authority:")
    expect(traceabilityMarkup).toContain("Used with caution or blocked:")
    expect(traceabilityMarkup).toContain("Fallback usage:")

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

function makeExportArtifact(overrides: Partial<ExportArtifact> = {}): ExportArtifact {
  return {
    kind: "lesson_plan",
    format: "docx",
    label: "Lesson Plan Export",
    fileName: "lesson-plan-export.docx",
    mimeType: DOCX_MIME,
    content: "Lesson plan body",
    ...overrides,
  } as ExportArtifact
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
  it("uses the generated lesson-plan export artifact and downloads the generated DOCX artifact", async () => {
    await seedAndGenerate()

    const state = useLessonStore.getState()
    const artifact = state.lessonPackage?.exports?.find(
      (item) => item.kind === "lesson_plan" && item.mimeType === DOCX_MIME && Boolean(item.content?.trim())
    )

    expect(artifact).toBeTruthy()

    expect(state.blueprint).toBeTruthy()
    expect(state.planningIdeas).toBeTruthy()
    expect(state.lessonPackage).toBeTruthy()
    expect(artifact!.kind).toBe("lesson_plan")
    expect(artifact!.mimeType).toBe(DOCX_MIME)
    expect(artifact!.label).toContain("Lesson Plan")
    expect(artifact!.fileName.endsWith(".docx")).toBe(true)

    const docxBlob = new Blob(["docx-binary"], { type: DOCX_MIME })
    vi.mocked(exportLessonPlanDocx).mockResolvedValue(docxBlob)

    const harness = installDownloadDomHarness("blob:generated-docx")

    try {
      await downloadExportArtifact(artifact!)

      expect(exportLessonPlanDocx).toHaveBeenCalledWith(artifact!.label, artifact!.content)
      expect(harness.urlStub.createObjectURL).toHaveBeenCalledTimes(1)
      expect(harness.createdLinks).toHaveLength(1)

      const appendedLink = harness.createdLinks[0]!
      expect(appendedLink.download).toBe(artifact!.fileName)
      expect(appendedLink.href).toBe("blob:generated-docx")
      expect(appendedLink.click).toHaveBeenCalledTimes(1)
    } finally {
      harness.restore()
    }
  })

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

  it("routes PPTX exports through exportSlidesPptx before download", async () => {
    vi.mocked(exportLessonPlanDocx).mockReset()
    vi.mocked(exportSlidesPptx).mockResolvedValue(
      new Blob(["pptx-binary"], { type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" })
    )

    const harness = installDownloadDomHarness("blob:text")

    try {
      const artifact = makeExportArtifact({
        kind: "slides",
        format: "pptx",
        label: "Slides Export",
        fileName: "ELA-slides-export.pptx",
        mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        content: "Slides Export`n1. Opening",
      })

      await downloadExportArtifact(artifact)

      expect(exportLessonPlanDocx).not.toHaveBeenCalled()
      expect(exportSlidesPptx).toHaveBeenCalledTimes(1)
      expect(harness.urlStub.createObjectURL).toHaveBeenCalledTimes(1)

      const appendedLink = harness.createdLinks[0]!
      expect(appendedLink.download).toBe(artifact.fileName)
      expect(appendedLink.href).toBe("blob:text")
      expect(appendedLink.click).toHaveBeenCalledTimes(1)
    } finally {
      harness.restore()
    }
  })
})


describe("Results export routing - PDF and ZIP", () => {
  it("routes PDF printables exports through exportPrintablesPdf before download", async () => {
    vi.mocked(exportPrintablesPdf).mockResolvedValue(new Blob(["pdf-binary"], { type: "application/pdf" }))
    const harness = installDownloadDomHarness("blob:pdf")

    try {
      const artifact = {
        kind: "printables",
        format: "pdf",
        label: "Printables Export",
        fileName: "ELA-printables-export.pdf",
        mimeType: "application/pdf",
        content: "Centers`nRotation Plan",
      } as const

      await downloadExportArtifact(artifact)

      expect(exportPrintablesPdf).toHaveBeenCalledWith(artifact.label, artifact.content)
      expect(harness.urlStub.createObjectURL).toHaveBeenCalledTimes(1)
      expect(harness.createdLinks).toHaveLength(1)
      expect(harness.createdLinks[0]!.download).toBe(artifact.fileName)
      expect(harness.createdLinks[0]!.href).toBe("blob:pdf")
    } finally {
      harness.restore()
    }
  })

  it("routes ZIP bundle exports through exportFullPackageZip before download", async () => {
    vi.mocked(exportFullPackageZip).mockResolvedValue(new Blob(["zip-binary"], { type: "application/zip" }))
    const harness = installDownloadDomHarness("blob:zip")

    try {
      const artifact = {
        kind: "full_package",
        format: "zip",
        label: "Full Lesson Package",
        fileName: "ELA-full-lesson-package.zip",
        mimeType: "application/zip",
        content: "bundle marker",
      } as const

      await downloadExportArtifact(artifact, [artifact])

      expect(exportFullPackageZip).toHaveBeenCalledWith(artifact.label, [artifact])
      expect(harness.urlStub.createObjectURL).toHaveBeenCalledTimes(1)
      expect(harness.createdLinks).toHaveLength(1)
      expect(harness.createdLinks[0]!.download).toBe(artifact.fileName)
      expect(harness.createdLinks[0]!.href).toBe("blob:zip")
    } finally {
      harness.restore()
    }
  })
})
describe("Results export format labels", () => {
  it("maps ZIP, DOCX, PDF, and PPTX exports to the correct teacher-facing labels and descriptions", () => {
    const zipArtifact = makeExportArtifact({
      kind: "full_package",
      format: "zip",
      label: "Full Lesson Package",
      fileName: "ELA-full-lesson-package.zip",
      mimeType: "application/zip",
      content: "bundle marker",
    })

    const docxArtifact = makeExportArtifact({
      kind: "lesson_plan",
      format: "docx",
      label: "Lesson Plan Export",
      fileName: "ELA-lesson-plan-export.docx",
      mimeType: DOCX_MIME,
      content: "Lesson plan body",
    })

    const pdfArtifact = makeExportArtifact({
      kind: "printables",
      format: "pdf",
      label: "Printables Export",
      fileName: "ELA-printables-export.pdf",
      mimeType: "application/pdf",
      content: "Centers`nRotation Plan",
    })

    const pptxArtifact = makeExportArtifact({
      kind: "slides",
      format: "pptx",
      label: "Slides Export",
      fileName: "ELA-slides-export.pptx",
      mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      content: "Slides Export`n1. Opening",
    })

    expect(getArtifactButtonLabel(zipArtifact)).toBe("Download ZIP")
    expect(getArtifactDescription(zipArtifact)).toContain("ZIP file")

    expect(getArtifactButtonLabel(docxArtifact)).toBe("Download DOCX")
    expect(getArtifactDescription(docxArtifact)).toContain("DOCX lesson plan")

    expect(getArtifactButtonLabel(pdfArtifact)).toBe("Download PDF")
    expect(getArtifactDescription(pdfArtifact)).toContain("PDF handout")

    expect(getArtifactButtonLabel(pptxArtifact)).toBe("Download PPTX")
    expect(getArtifactDescription(pptxArtifact)).toContain("PPTX slide deck")
  })
})
