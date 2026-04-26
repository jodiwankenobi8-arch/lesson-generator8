import React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import { readFileSync } from "node:fs"

vi.mock("../engine/exports/exportLessonPlanDocx", () => ({
  exportLessonPlanDocx: vi.fn(),
}))

vi.mock("../engine/exports/exportPrintablesPdf", () => ({
  exportPrintablesPdf: vi.fn(),
}))

vi.mock("../engine/exports/exportSlidesPptx", () => ({
  exportSlidesPptx: vi.fn(),
  parseSlidesExportContent: vi.fn(),
}))

vi.mock("../engine/exports/exportFullPackageZip", () => ({
  exportFullPackageZip: vi.fn(),
}))

import { exportLessonPlanDocx } from "../engine/exports/exportLessonPlanDocx"
import { exportPrintablesPdf } from "../engine/exports/exportPrintablesPdf"
import { exportSlidesPptx, parseSlidesExportContent } from "../engine/exports/exportSlidesPptx"
import { exportFullPackageZip } from "../engine/exports/exportFullPackageZip"
import { CoverageDecisionsSection, PackageOutputsSection, PackageSummarySection, PipelineTraceSection, TraceabilitySection, downloadExportArtifact, getArtifactButtonLabel, getArtifactDescription, getBundledArtifactLabels, getVisiblePackageSectionLabels } from "./ResultsPage"
import { useLessonStore } from "../state/useLessonStore"
import type { ExportArtifact, LessonInputs, LessonPackage, MaterialAnalysis, MaterialFile, MaterialRole, MissingAreaDecisionChoice, PlanningComponentKey } from "../engine/types"

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
  return {
    ...makeMaterial({
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
    }),
    styleSettings: {
      mode: "selected_aspects",
      aspects: ["slide_flow", "pacing"],
      customInstructions: "",
      targets: ["lesson_slides", "lesson_plan"],
    },
  }
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

function makeLessonPackage(overrides: {
  lessonPlan?: string
  slides?: string[]
  centers?: string[]
  rotationPlan?: string
  interventions?: string[]
  exports?: ExportArtifact[]
} = {}): LessonPackage {
  return {
    slides: overrides.slides ?? ["Slide 1: Opening"],
    lessonPlan: overrides.lessonPlan ?? "Lesson plan body",
    centers: overrides.centers ?? [],
    rotationPlan: overrides.rotationPlan ?? "",
    interventions: overrides.interventions ?? [],
    exports: overrides.exports ?? [],
    readiness: {
      density: "balanced",
      lessonShape: "single-focus",
      contentFit: "grounded",
      warnings: [],
      signals: [],
    },
  }
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
        lessonTrace={lessonTrace}
      />
    )
    expect(traceabilityMarkup).toContain("What came from curriculum materials")
    expect(traceabilityMarkup).toContain("Content from curriculum:")
    expect(traceabilityMarkup).toContain("What came from exemplar materials")
    expect(traceabilityMarkup).toContain("Structure from exemplars:")
    expect(traceabilityMarkup).toContain("exemplar.txt: Choose specific aspects: slide flow, pacing")
    expect(traceabilityMarkup).toContain("Where exemplars apply:")
    expect(traceabilityMarkup).toContain("lesson plan")
    expect(traceabilityMarkup).toContain("slides")
    expect(traceabilityMarkup).toContain("Materials used carefully or not used:")
    expect(traceabilityMarkup).toContain("Added where materials were limited:")

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


  it("keeps package summary and traceability grounded in normalized teacher-facing content", () => {
    const state = useLessonStore.getState()
    const blueprint = {
      ...state.blueprint!,
      content: {
        ...state.blueprint!.content,
        target: {
          primary: "phonics",
          secondary: null,
          isMixedTarget: false,
          recommendedMode: "single",
        },
        standards: [
          "ELA.K.F.1.3: Demonstrate phonological awareness",
          "ELA.K.F.1.4: Read high-frequency words",
          "ELA.K.R.2.1: Identify the main topic and key details in a text (Author's Purpose)",
          "ELA.K.V.1.1: Identify and use new vocabulary",
        ],
        vocabulary: [
          "Ses tpe metic parses blending practice, story visuals, and, up/down, and letter-sound motions).",
          "long a",
        ],
        wordLists: [
          "phonics) Edition)",
          "Word List: made, same, late, cake",
        ],
        texts: [
          "Savvas story slides for The Best Story",
          "Decodable passage: Jake made a cake at the lake.",
        ],
        practiceIdeas: [
          "pacing, modeling, guided practice, and",
          "Read and sort long a words",
        ],
        coverage: {
          ...state.blueprint!.content.coverage,
          standards: [
            "ELA.K.F.1.3: Demonstrate phonological awareness",
            "ELA.K.F.1.4: Read high-frequency words",
            "ELA.K.R.2.1: Identify the main topic and key details in a text (Author's Purpose)",
            "ELA.K.V.1.1: Identify and use new vocabulary",
          ],
          vocabulary: ["long a"],
          wordLists: ["Word List: made, same, late, cake"],
          texts: ["Decodable passage: Jake made a cake at the lake."],
          practiceIdeas: ["Read and sort long a words"],
        },
      },
    }

    const packageMarkup = renderToStaticMarkup(
      <PackageSummarySection
        blueprint={blueprint}
        lessonPackage={state.lessonPackage!}
        selectedLessonMode="single"
        materials={state.materials}
        lessonTrace={state.lessonTrace}
      />
    )

    const traceabilityMarkup = renderToStaticMarkup(
      <TraceabilitySection
        blueprint={blueprint}
        lessonPackage={state.lessonPackage!}
        materials={state.materials}
        lessonTrace={state.lessonTrace}
      />
    )

    expect(packageMarkup).toContain("ELA.K.F.1.3: Demonstrate phonological awareness")
    expect(packageMarkup).toContain("ELA.K.F.1.4: Read high-frequency words")
    expect(packageMarkup).not.toContain("ELA.K.R.2.1")
    expect(packageMarkup).not.toContain("ELA.K.V.1.1")
    expect(packageMarkup).not.toContain("Ses tpe metic")
    expect(traceabilityMarkup).not.toContain("Ses tpe metic")
    expect(traceabilityMarkup).not.toContain("phonics) Edition)")
    expect(traceabilityMarkup).not.toContain("pacing, modeling, guided practice, and")
    expect(traceabilityMarkup).toContain("Read and sort long a words")
  })

  it("keeps the teacher-facing results package labels and order aligned", () => {
    const source = readFileSync("src/pages/ResultsPage.tsx", "utf8")

    const packageSummaryCallIndex = source.indexOf("<PackageSummarySection")
    const packageOutputsCallIndex = source.indexOf("<PackageOutputsSection lessonPackage={lessonPackage} />")
    const coverageDecisionsCallIndex = source.indexOf("<CoverageDecisionsSection")
    const aiConstructionCallIndex = source.indexOf("<AiConstructionSection lessonTrace={lessonTrace} />")
    const traceabilityCallIndex = source.indexOf("<TraceabilitySection blueprint={blueprint} lessonPackage={lessonPackage} materials={materials} lessonTrace={lessonTrace} />")
    const planningDetailsCallIndex = source.indexOf("<PlanningDetailsSection")
    const blueprintDetailsCallIndex = source.indexOf("<BlueprintDetailsSection blueprint={blueprint} />")
    const pipelineTraceCallIndex = source.indexOf("{lessonTrace && <PipelineTraceSection trace={lessonTrace} />}")
    const packageSummaryHeadingIndex = source.indexOf("Start with a quick package scan")
    const lessonPlanIndex = source.indexOf('PreSection title="Lesson Plan"')
    const slidesIndex = source.indexOf('SimpleListSection title="Slides"')
    const teacherLedSupportIndex = source.indexOf('SimpleListSection title="Teacher-Led Support"')
    const studentCentersIndex = source.indexOf('SimpleListSection title="Centers / Independent Work"')
    const centerRotationIndex = source.indexOf('PreSection title="Centers / Independent Work Rotation"')

    expect(packageSummaryCallIndex).toBeGreaterThanOrEqual(0)
    expect(packageOutputsCallIndex).toBeGreaterThan(packageSummaryCallIndex)
    expect(coverageDecisionsCallIndex).toBeGreaterThan(packageOutputsCallIndex)
    expect(aiConstructionCallIndex).toBeGreaterThan(coverageDecisionsCallIndex)
    expect(traceabilityCallIndex).toBeGreaterThan(aiConstructionCallIndex)
    expect(planningDetailsCallIndex).toBeGreaterThan(traceabilityCallIndex)
    expect(blueprintDetailsCallIndex).toBeGreaterThan(planningDetailsCallIndex)
    expect(pipelineTraceCallIndex).toBeGreaterThan(blueprintDetailsCallIndex)

    expect(packageSummaryHeadingIndex).toBeGreaterThanOrEqual(0)
    expect(lessonPlanIndex).toBeGreaterThanOrEqual(0)
    expect(slidesIndex).toBeGreaterThan(lessonPlanIndex)
    expect(teacherLedSupportIndex).toBeGreaterThan(slidesIndex)
    expect(studentCentersIndex).toBeGreaterThan(teacherLedSupportIndex)
    expect(centerRotationIndex).toBeGreaterThan(studentCentersIndex)

    expect(source).toContain("Start with a quick package scan")
    expect(source).toContain("Teacher Binder Snapshot")
    expect(source).toContain("Primary focus:")
    expect(source).toContain("Additional focus:")
    expect(source).toContain("Integrated focus:")
    expect(source).toContain("Lesson coverage:")
    expect(source).toContain("How materials shaped this lesson")
    expect(source).toContain("Content from curriculum:")
    expect(source).toContain("Structure from exemplars:")
    expect(source).toContain("What came from curriculum materials:")
    expect(source).toContain("What came from exemplar materials:")
    expect(source).toContain("What was added to complete the lesson")
    expect(source).toContain("Where exemplars apply:")
    expect(source).toContain("Materials used carefully or not used:")
    expect(source).toContain("Review these added details before teaching:")
    expect(source).toContain("Download the current generated artifacts as one ZIP bundle, or download each artifact in its classroom-ready format.")
    expect(source).toContain("Download Package ZIP")
    expect(source).not.toContain("Download Full Package ZIP")
    expect(source).toContain("Lesson Sources and Planning Notes")
    expect(source).toContain('<summary style={summaryStyle}>Lesson Sources and Planning Notes</summary>')
    expect(source).toContain("<SecondaryEvidenceSection")
    expect(source).toContain("<AiConstructionSection lessonTrace={lessonTrace} />")
    expect(source).toContain("How materials shaped this lesson")
    expect(source).toContain("Optional planning decisions")
    expect(source).toContain('<summary style={summaryStyle}>How materials shaped this lesson</summary>')
    expect(source).toContain('<summary style={summaryStyle}>How this lesson was assembled</summary>')
    expect(source).toContain("Teacher Decisions")
    expect(source).not.toContain('SimpleListSection title="Interventions"')
    expect(source).not.toContain('PreSection title="Rotation Plan"')
  })

  it("uses usable-material trust language for results gating", () => {
    const source = readFileSync("src/pages/ResultsPage.tsx", "utf8")

    expect(source).toContain('const hasUsableMaterialsForGeneration = useLessonStore((state) => state.hasUsableMaterialsForGeneration)()')
    expect(source).not.toContain('const hasReadyMaterials = useLessonStore((state) => state.hasReadyMaterials)()')

    expect(source).toContain("Results are blocked until at least one curriculum or exemplar material is usable for grounded generation.")
    expect(source).toContain("Inputs are complete and at least one material is usable, but no generated lesson is currently loaded.")
    expect(source).toContain("Ready files:")

    expect(source).not.toContain("Results are blocked until at least one material is analyzed and ready.")
    expect(source).not.toContain("Inputs and materials are ready, but no generated lesson is currently loaded.")
  })

  it("keeps support-vs-generated gap messaging visible in coverage rendering", () => {
    const coverageMarkup = renderCoverageSection()

    expect(coverageMarkup).toContain("Teacher Decisions")
    expect(coverageMarkup).toContain("No extra teacher decisions are needed for this lesson.")
    expect(coverageMarkup).toContain("No extra teacher decisions are needed for this lesson.")
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
        lessonTrace={lessonTrace}
      />
    )
    expect(traceabilityMarkup).toContain("What came from curriculum materials")
    expect(traceabilityMarkup).toContain("Content from curriculum:")
    expect(traceabilityMarkup).toContain("What came from exemplar materials")
    expect(traceabilityMarkup).toContain("Structure from exemplars:")
    expect(traceabilityMarkup).toContain("exemplar.txt: Choose specific aspects: slide flow, pacing")
    expect(traceabilityMarkup).toContain("Where exemplars apply:")
    expect(traceabilityMarkup).toContain("lesson plan")
    expect(traceabilityMarkup).toContain("slides")
    expect(traceabilityMarkup).toContain("Materials used carefully or not used:")
    expect(traceabilityMarkup).toContain("Added where materials were limited:")

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
    expect(coverageMarkup).toContain("No extra teacher decisions are needed for this lesson.")
    expect(coverageMarkup).toContain("No extra teacher decisions are needed for this lesson.")
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
    vi.mocked(parseSlidesExportContent).mockReturnValue([
      "Slide 1: Objective | Kind: objective",
      "Slide 2: Guided Practice | Kind: guided_practice",
      "Slide 3: Closure | Kind: closure",
    ])
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
        content: [
          "Slides Export",
          "",
          "Slide 1: Objective | Kind: objective",
          "Slide 2: Guided Practice | Kind: guided_practice Slide 3: Closure | Kind: closure",
        ].join("\n"),
      })

      await downloadExportArtifact(artifact)

      expect(exportLessonPlanDocx).not.toHaveBeenCalled()
      expect(parseSlidesExportContent).toHaveBeenCalledWith(artifact.content)
      expect(exportSlidesPptx).toHaveBeenCalledTimes(1)
      expect(exportSlidesPptx).toHaveBeenCalledWith(artifact.label, [
        "Slide 1: Objective | Kind: objective",
        "Slide 2: Guided Practice | Kind: guided_practice",
        "Slide 3: Closure | Kind: closure",
      ])
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

describe("Results package output section parity", () => {
  it("summarizes visible package sections and bundled artifact labels for the teacher binder snapshot", () => {
    const lessonPackage = makeLessonPackage({
      centers: ["Word Sort: Sort long a and short a words."],
      rotationPlan: [
        "Rotation 1: Word Sort: Sort long a and short a words.",
        "Teacher-Led Support Focus: Targeted Blending - Reteach blending with a reduced list.",
      ].join("\n"),
      interventions: ["Phonics Reteach: Practice decoding with teacher support."],
      exports: [
        makeExportArtifact({
          kind: "full_package",
          format: "zip",
          label: "Full Lesson Package",
          fileName: "ELA-full-lesson-package.zip",
          mimeType: "application/zip",
          content: "bundle marker",
        }),
        makeExportArtifact({
          kind: "lesson_plan",
          format: "docx",
          label: "Lesson Plan Export",
          fileName: "ELA-lesson-plan-export.docx",
          mimeType: DOCX_MIME,
          content: "Lesson plan body",
        }),
        makeExportArtifact({
          kind: "slides",
          format: "pptx",
          label: "Slides Export",
          fileName: "ELA-slides-export.pptx",
          mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          content: "Slides Export\n\n1. Opening",
        }),
        makeExportArtifact({
          kind: "printables",
          format: "pdf",
          label: "Centers & Support Printables Export",
          fileName: "ELA-printables-export.pdf",
          mimeType: "application/pdf",
          content: "Centers & Support Printables Export",
        }),
      ],
    })

    expect(getVisiblePackageSectionLabels(lessonPackage)).toEqual([
      "Lesson Plan",
      "Slides",
      "Teacher-Led Support",
      "Intervention Support",
      "Centers / Independent Work",
      "Centers / Independent Work Rotation",
    ])

    expect(getBundledArtifactLabels(lessonPackage.exports ?? [])).toEqual([
      "Lesson Plan Export",
      "Slides Export",
      "Centers & Support Printables Export",
    ])
  })

  it("keeps a teacher-led support only package separate from centers and independent rotation", () => {
    const markup = renderToStaticMarkup(
      <PackageOutputsSection
        lessonPackage={makeLessonPackage({
          rotationPlan: "Teacher-Led Support Focus: Targeted Blending - Reteach blending with a reduced list.",
          exports: [
            makeExportArtifact({
              kind: "full_package",
              format: "zip",
              label: "Full Lesson Package",
              fileName: "ELA-full-lesson-package.zip",
              mimeType: "application/zip",
              content: "bundle marker",
            }),
            makeExportArtifact({
              kind: "lesson_plan",
              format: "docx",
              label: "Lesson Plan Export",
              fileName: "ELA-lesson-plan-export.docx",
              mimeType: DOCX_MIME,
              content: "Lesson plan body",
            }),
          ],
        })}
      />
    )

    expect(markup).toContain("Teacher-Led Support")
    expect(markup).toContain("Teacher-Led Support Focus:")
    expect(markup).not.toContain("Centers / Independent Work Rotation")
    expect(markup).not.toContain("No centers defined.")
    expect(markup).not.toContain("Intervention Support")
  })

  it("keeps multi-area packages explicit about the ZIP bundle and the current generated artifacts inside it", () => {
    const markup = renderToStaticMarkup(
      <PackageOutputsSection
        lessonPackage={makeLessonPackage({
          centers: ["Word Sort: Sort long a and short a words."],
          rotationPlan: [
            "Rotation 1: Word Sort: Sort long a and short a words.",
            "Teacher-Led Support Focus: Targeted Blending - Reteach blending with a reduced list.",
          ].join("\n"),
          interventions: ["Phonics Reteach: Practice decoding with teacher support."],
          exports: [
            makeExportArtifact({
              kind: "full_package",
              format: "zip",
              label: "Full Lesson Package",
              fileName: "ELA-full-lesson-package.zip",
              mimeType: "application/zip",
              content: "bundle marker",
            }),
            makeExportArtifact({
              kind: "lesson_plan",
              format: "docx",
              label: "Lesson Plan Export",
              fileName: "ELA-lesson-plan-export.docx",
              mimeType: DOCX_MIME,
              content: "Lesson plan body",
            }),
            makeExportArtifact({
              kind: "slides",
              format: "pptx",
              label: "Slides Export",
              fileName: "ELA-slides-export.pptx",
              mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              content: "Slides Export\n\n1. Opening",
            }),
            makeExportArtifact({
              kind: "printables",
              format: "pdf",
              label: "Centers & Support Printables Export",
              fileName: "ELA-printables-export.pdf",
              mimeType: "application/pdf",
              content: "Centers & Support Printables Export",
            }),
          ],
        })}
      />
    )

    expect(markup).toContain("Teacher-Led Support")
    expect(markup).toContain("Intervention Support")
    expect(markup).toContain("Centers / Independent Work")
    expect(markup).toContain("Centers / Independent Work Rotation")
    expect(markup).toContain("Teacher Binder Snapshot")
    expect(markup).toContain("Included in this teacher package")
    expect(markup).toContain("Available exports")
    expect(markup).toContain("Package ZIP")
    expect(markup).toContain("Full Lesson Package ZIP")
    expect(markup).toContain("Current package ZIP includes:")
    expect(markup).toContain("Lesson Plan Export, Slides Export, Centers &amp; Support Printables Export")
  })

  it("renders single-line guided and independent practice slide strings in normalized preview format", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <PackageOutputsSection
          lessonPackage={makeLessonPackage({
            slides: [
              "Slide 4: Guided Practice: Blend and read long a words; Sort long a words: cake, game, lake",
              "Slide 5: Independent Practice: Blend and read long a words; Sort long a words: cake, game, lake",
            ],
            exports: [
              makeExportArtifact({
                kind: "slides",
                format: "pptx",
                label: "Slides Export",
                fileName: "ELA-slides-export.pptx",
                mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                content: "Slides Export\n\nSlide 4\nSlide 5",
              }),
            ],
          })}
        />
      </MemoryRouter>
    )

    expect(markup).toContain(
      "Slide 4: Guided Practice — Practice: Blend and read long a words; Sort long a words — Words: cake, game, lake"
    )
    expect(markup).toContain(
      "Slide 5: Independent Practice — Practice: Blend and read long a words; Sort long a words — Words: cake, game, lake"
    )
    expect(markup).not.toContain(
      "Slide 4: Guided Practice: Blend and read long a words; Sort long a words: cake, game, lake"
    )
    expect(markup).not.toContain(
      "Slide 5: Independent Practice: Blend and read long a words; Sort long a words: cake, game, lake"
    )
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
      content: [
          "Slides Export",
          "",
          "Slide 1: Objective | Kind: objective",
          "Slide 2: Guided Practice | Kind: guided_practice Slide 3: Closure | Kind: closure",
        ].join("\n"),
    })

    expect(getArtifactButtonLabel(zipArtifact)).toBe("Download ZIP")
    expect(getArtifactDescription(zipArtifact)).toContain("current generated artifacts")

    expect(getArtifactButtonLabel(docxArtifact)).toBe("Download DOCX")
    expect(getArtifactDescription(docxArtifact)).toContain("DOCX lesson plan")

    expect(getArtifactButtonLabel(pdfArtifact)).toBe("Download PDF")
    expect(getArtifactDescription(pdfArtifact)).toContain("PDF handout")

    expect(getArtifactButtonLabel(pptxArtifact)).toBe("Download PPTX")
    expect(getArtifactDescription(pptxArtifact)).toContain("PPTX slide deck")
  })


  it("shows export-blocked messaging when teacher review is still required", () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <PackageOutputsSection
          lessonPackage={{
            ...makeLessonPackage(),
            exports: [],
            readiness: {
              density: "thin",
              lessonShape: "single-focus",
              contentFit: "limited",
              warnings: ["Review Materials before export: confirm word examples and practice task."],
              signals: [],
            },
          }}
        />
      </MemoryRouter>
    )

    expect(markup).toContain("Exports stay blocked until you review Materials and confirm the missing lesson content.")
    expect(markup).toContain("Return to Materials")
  })

  it("keeps explicit source grounding labels in results traceability", () => {
    const source = readFileSync("src/pages/ResultsPage.tsx", "utf8")

    expect(source).toContain("Exemplar style choice:")
    expect(source).toContain("What came from curriculum materials:")
    expect(source).toContain("What came from exemplar materials:")
  })
})


