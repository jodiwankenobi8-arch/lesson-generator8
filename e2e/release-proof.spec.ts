import { expect, test } from "@playwright/test"
import JSZip from "jszip"
import { readFileSync } from "node:fs"

const SNAPSHOT_KEY = "lesson-generator8__workspace_v1"

function buildSeededWorkspaceSnapshot() {
  return {
    inputs: {
      grade: "K",
      subject: "ELA",
      standard: "ELA.K.F.1.3: Demonstrate phonological awareness",
      skill: "Long a CVCe words",
      topic: "Blend, read, and sort long a words",
      duration: "30 minutes",
      notes: "Use decodable examples and partner practice.",
    },
    materials: [
      {
        id: "curriculum-seeded-1",
        name: "curriculum-long-a.txt",
        role: "curriculum",
        status: "ready",
        analysis: {
          sourceRole: "curriculum",
          summary: "Curriculum source with long a phonics coverage.",
          extractedText: [
            "ELA.K.F.1.3: Demonstrate phonological awareness",
            "long a",
            "cake, game, lake, name, tape",
          ],
          tags: ["curriculum", "phonics", "long a"],
          curriculum: {
            standards: ["ELA.K.F.1.3: Demonstrate phonological awareness"],
            vocabulary: ["long a"],
            wordLists: ["cake", "game", "lake", "name", "tape"],
            texts: ["Decodable text with long a words."],
            practiceTasks: [
              "Blend and read long a words",
              "Sort long a words: cake, game, lake, name, tape",
            ],
            instructionalTargets: [
              "Blend and read long a words accurately",
            ],
            examples: ["cake", "game", "lake", "name", "tape"],
          },
        },
        analysisReview: {
          standards: ["ELA.K.F.1.3: Demonstrate phonological awareness"],
          vocabulary: ["long a"],
          wordLists: ["cake", "game", "lake", "name", "tape"],
          instructionalTargets: [
            "Blend and read long a words accurately",
          ],
          texts: ["Decodable text with long a words."],
          practiceIdeas: [
            "Blend and read long a words",
            "Sort long a words: cake, game, lake, name, tape",
          ],
          exemplarStructure: [],
          teacherSummary: "",
        },
        errorMessage: null,
        styleSettings: null,
        fileBuffer: null,
        fileContent: "",
        sourceKind: "pasted_text",
        sourceLabel: "seeded curriculum",
        sourceMimeType: "text/plain",
      },
      {
        id: "exemplar-seeded-1",
        name: "exemplar-flow.txt",
        role: "exemplar",
        status: "ready",
        analysis: {
          sourceRole: "exemplar",
          summary: "Exemplar structure for slide flow.",
          extractedText: ["Opening", "Guided Practice", "Independent Practice", "Closure"],
          tags: ["exemplar", "structure"],
          exemplar: {
            slideFlow: ["Opening", "Model / Teach", "Guided Practice", "Independent Practice", "Closure / Check"],
            pacing: ["5 min launch", "10 min model", "10 min guided", "5 min check"],
            teacherMoves: ["Model blending", "Guide partner read"],
            promptStyle: ["What do you notice?", "Read with a partner"],
            layoutCues: ["Large word cards"],
            tone: ["explicit", "supportive"],
            reusableStructure: ["Opening", "Model / Teach", "Guided Practice", "Independent Practice", "Closure / Check"],
          },
        },
        analysisReview: {
          standards: [],
          vocabulary: [],
          wordLists: [],
          instructionalTargets: [],
          texts: [],
          practiceIdeas: [],
          exemplarStructure: ["Opening", "Model / Teach", "Guided Practice", "Independent Practice", "Closure / Check"],
          teacherSummary: "",
        },
        errorMessage: null,
        styleSettings: {
          mode: "selected_aspects",
          aspects: ["slide_flow", "pacing"],
          customInstructions: "",
          targets: ["lesson_plan", "lesson_slides"],
        },
        fileBuffer: null,
        fileContent: "",
        sourceKind: "pasted_text",
        sourceLabel: "seeded exemplar",
        sourceMimeType: "text/plain",
      },
    ],
    selectedLessonMode: "single",
    blueprint: null,
    planningIdeas: null,
    lessonSpec: null,
    lessonPackage: null,
    lessonTrace: null,
    outputContents: {
      lessonPlan: {
        selected: true,
        parts: {
          standards: true,
          objective: true,
          opening: true,
          direct_instruction_modeling: true,
          teach: true,
          guided_practice: true,
          independent_practice: true,
          closure: true,
          differentiation: false,
          vocabulary: true,
          materials_prep_list: true,
          assessment_connection: true,
        },
      },
      lessonSlides: {
        selected: true,
        studentFacingOnly: true,
      },
      assessment: {
        selected: false,
        types: {
          observation_checklist: false,
          exit_ticket: false,
          running_record_conference_notes: false,
          quick_oral_check: false,
          end_of_lesson_task: false,
          skill_check: false,
          response_sheet: false,
          brief_performance_task: false,
          formative_assessment: false,
        },
        answerKeys: true,
      },
      centers: {
        selected: true,
        options: {
          use_what_you_have: true,
          create_new_center_activities: false,
        },
        focuses: {
          letter_identification: false,
          phonological_awareness: false,
          phonemic_awareness: false,
          phonics: true,
          high_frequency_words: false,
          word_building: false,
          vocabulary_oral_language: false,
          handwriting_fine_motor: false,
          decodable_reading: false,
          fluency: false,
          reading_response: false,
          comprehension: false,
          writing_sentence_work: false,
        },
      },
      smallGroup: {
        selected: true,
        tiers: {
          T1: false,
          T2: false,
          T3: true,
          Extension: false,
        },
      },
      assessments: {
        selected: false,
        types: {
          observation_checklist: false,
          exit_ticket: false,
          running_record_conference_notes: false,
          quick_oral_check: false,
          end_of_lesson_task: false,
          skill_check: false,
          response_sheet: false,
          brief_performance_task: false,
          formative_assessment: false,
        },
      },
      groups: {
        selected: true,
        byTier: {
          T1: {
            centers: true,
          },
          T2: {
            small_group: false,
          },
          T3: {
            intervention: true,
          },
          Extension: {
            small_group: false,
          },
        },
      },
      other: {
        printables: true,
      },
    },
    missingAreaDecisions: {},
  }
}

function buildCurriculumOnlyWorkspaceSnapshot() {
  const snapshot = buildSeededWorkspaceSnapshot()

  return {
    ...snapshot,
    materials: snapshot.materials.filter((material) => material.role === "curriculum"),
  }
}

function buildExemplarOnlyWorkspaceSnapshot() {
  const snapshot = buildSeededWorkspaceSnapshot()

  return {
    ...snapshot,
    materials: snapshot.materials.filter((material) => material.role === "exemplar"),
    blueprint: null,
    planningIdeas: null,
    lessonSpec: null,
    lessonPackage: null,
    lessonTrace: null,
  }
}

test("release browser and export proof for phonics flow", async ({ page }) => {
  await page.addInitScript(({ key, snapshot }) => {
    window.localStorage.setItem(key, JSON.stringify(snapshot))
  }, { key: SNAPSHOT_KEY, snapshot: buildSeededWorkspaceSnapshot() })

  await page.goto("/inputs")
  await expect(page.getByRole("heading", { name: "Inputs" })).toBeVisible()

  const lessonInfoSection = page.getByText("1. Lesson info", { exact: false })
  const requestedOutputsSection = page.getByText("2. Requested outputs", { exact: false })
  const generalNotesSection = page.getByText("3. General notes", { exact: false })
  await expect(lessonInfoSection).toBeVisible()
  await expect(requestedOutputsSection).toBeVisible()
  await expect(generalNotesSection).toBeVisible()

  const lessonInfoBox = await lessonInfoSection.boundingBox()
  const requestedOutputsBox = await requestedOutputsSection.boundingBox()
  const generalNotesBox = await generalNotesSection.boundingBox()
  expect(lessonInfoBox?.y ?? -1).toBeGreaterThan(-1)
  expect(requestedOutputsBox?.y ?? -1).toBeGreaterThan(lessonInfoBox?.y ?? -1)
  expect(generalNotesBox?.y ?? -1).toBeGreaterThan(requestedOutputsBox?.y ?? -1)

  await page.getByRole("button", { name: "Continue to Materials" }).click()
  await expect(page).toHaveURL(/\/materials$/)

  await expect(page.getByRole("heading", { name: "Materials" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Curriculum" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Exemplar" })).toBeVisible()
  const materialsText = await page.locator("body").innerText()
  expect(materialsText).toContain("Ready to generate")
  expect(materialsText).toContain("long a")
  expect(materialsText).toContain("cake")
  expect(materialsText).toContain("game")
  expect(materialsText).toContain("lake")
  expect(materialsText).toContain("name")
  expect(materialsText).toContain("tape")

  await page.getByText("Standards (1 selected)", { exact: false }).click()
  const expandedMaterialsText = await page.locator("body").innerText()
  expect(expandedMaterialsText).toContain("ELA.K.F.1.3")
  expect(expandedMaterialsText).not.toContain("ELA.K.F.1.4")

  await page.getByRole("button", { name: "Generate Lesson" }).click()
  await expect(page).toHaveURL(/\/results$/)
  await expect(page.getByRole("heading", { name: "Results" })).toBeVisible()

  await expect(page.getByText("Exports ready", { exact: true })).toBeVisible()
  await expect(page.getByText("Needs review", { exact: true })).toBeVisible()

  const resultsText = await page.locator("body").innerText()
  expect(resultsText).toMatch(/EXPORTS READY\s+4/)
  expect(resultsText).toMatch(/NEEDS REVIEW\s+0/)
  expect(resultsText).not.toContain("teacher prompt")
  expect(resultsText).not.toContain("tone tone")
  expect(resultsText).not.toContain("Source Balance")
  expect(resultsText).not.toContain("Slide 4: Guided Practice: Blend and read long a words; Sort long a words: cake, game, lake")
  expect(resultsText).not.toContain("Slide 5: Independent Practice: Blend and read long a words; Sort long a words: cake, game, lake")

  const hasCleanSlide4 = resultsText.includes("Slide 4: Guided Practice —")
  const hasCleanSlide5 = resultsText.includes("Slide 5: Independent Practice —")
  expect(hasCleanSlide4 || resultsText.includes("Slide 4: Guided Practice")).toBeTruthy()
  expect(hasCleanSlide5 || resultsText.includes("Slide 5: Independent Practice")).toBeTruthy()

  const zipButton = page.getByRole("button", { name: "Download Package ZIP" })
  const pptxButton = page.getByRole("button", { name: "Download PPTX" })
  const docxButton = page.getByRole("button", { name: "Download DOCX" })
  const pdfButton = page.getByRole("button", { name: "Download PDF" })

  await expect(zipButton).toBeVisible()
  await expect(pptxButton).toBeVisible()
  await expect(docxButton).toBeVisible()
  await expect(pdfButton).toBeVisible()

  const [zipDownload] = await Promise.all([
    page.waitForEvent("download"),
    zipButton.click(),
  ])

  const zipPath = await zipDownload.path()
  expect(zipPath).toBeTruthy()

  const zipBuffer = readFileSync(zipPath!)
  const zip = await JSZip.loadAsync(zipBuffer)
  const zipEntries = Object.keys(zip.files)

  expect(zipEntries.some((entry) => entry.toLowerCase().endsWith(".pptx"))).toBeTruthy()
  expect(zipEntries.some((entry) => entry.toLowerCase().endsWith(".docx"))).toBeTruthy()
  expect(zipEntries.some((entry) => entry.toLowerCase().endsWith(".pdf"))).toBeTruthy()
})

test("release proof covers curriculum-only default-shell flow", async ({ page }) => {
  await page.addInitScript(({ key, snapshot }) => {
    window.localStorage.setItem(key, JSON.stringify(snapshot))
  }, { key: SNAPSHOT_KEY, snapshot: buildCurriculumOnlyWorkspaceSnapshot() })

  await page.goto("/inputs")
  await expect(page.getByRole("heading", { name: "Inputs" })).toBeVisible()

  await page.getByRole("button", { name: "Continue to Materials" }).click()
  await expect(page).toHaveURL(/\/materials$/)
  await expect(page.getByRole("heading", { name: "Materials" })).toBeVisible()

  await page.getByRole("button", { name: "Generate Lesson" }).click()
  await expect(page).toHaveURL(/\/results$/)
  await expect(page.getByRole("heading", { name: "Results" })).toBeVisible()

  const resultsText = await page.locator("body").innerText()
  expect(resultsText).toContain(
    "Structure uses a default classroom-ready shell because no exemplar source was selected."
  )
  expect(resultsText).not.toContain("How the exemplar shaped this lesson")
  expect(resultsText).toMatch(/EXPORTS READY\s+4/)
  expect(resultsText).toMatch(/NEEDS REVIEW\s+0/)

  await expect(page.getByRole("button", { name: "Download Package ZIP" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Download PPTX" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Download DOCX" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Download PDF" })).toBeVisible()
})

test("release proof blocks exemplar-only generation without curriculum grounding", async ({ page }) => {
  await page.addInitScript(({ key, snapshot }) => {
    window.localStorage.setItem(key, JSON.stringify(snapshot))
  }, { key: SNAPSHOT_KEY, snapshot: buildExemplarOnlyWorkspaceSnapshot() })

  await page.goto("/inputs")
  await expect(page.getByRole("heading", { name: "Inputs" })).toBeVisible()

  await page.getByRole("button", { name: "Continue to Materials" }).click()
  await expect(page).toHaveURL(/\/materials$/)
  await expect(page.getByRole("heading", { name: "Materials" })).toBeVisible()

  const generateButton = page.getByRole("button", { name: "Generate Lesson" })
  await expect(generateButton).toBeDisabled()

  const materialsText = await page.locator("body").innerText()
  expect(materialsText).toContain(
    "Exemplar sources can shape structure, but they cannot provide curriculum grounding"
  )

  await page.goto("/results")
  await expect(page).toHaveURL(/\/results$/)
  await expect(page.getByRole("heading", { name: "Results" })).toBeVisible()

  const resultsText = await page.locator("body").innerText()
  expect(resultsText).toContain("no generated lesson is currently loaded")
  expect(resultsText).toContain("Go to Materials")
  await expect(page.getByRole("button", { name: "Download Package ZIP" })).toHaveCount(0)
  await expect(page.getByRole("button", { name: "Download PPTX" })).toHaveCount(0)
  await expect(page.getByRole("button", { name: "Download DOCX" })).toHaveCount(0)
  await expect(page.getByRole("button", { name: "Download PDF" })).toHaveCount(0)
})
