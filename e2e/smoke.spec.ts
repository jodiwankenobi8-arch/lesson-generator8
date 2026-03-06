import { test, expect } from "@playwright/test";

function makeDefaultPackage() {
  return {
    meta: { generatedAt: new Date().toISOString(), version: "test" },
    input: {
      grade: "K",
      subject: "ELA",
      date: "2026-03-06",
      lessonTitle: "CVC Words",
      objective: "Blend and read CVC words",
      essentialQuestion: "How do we blend sounds to read words?",
      textOrTopic: "decodables -at word family",
      durationMinutes: 60,
      groupNotes: { tier3: "", tier2: "", onLevel: "", enrichment: "" },
      materials: "",
      manualStandardOverride: []
    },
    standards: [
      { code: "ELA.K.F.1.2", description: "Demo", confidence: 1 },
      { code: "ELA.K.F.1.3", description: "Demo", confidence: 1 },
      { code: "ELA.K.F.1.4", description: "Demo", confidence: 1 }
    ],
    standardsDetected: [
      { code: "ELA.K.F.1.2", description: "Demo", confidence: 1 },
      { code: "ELA.K.F.1.3", description: "Demo", confidence: 1 },
      { code: "ELA.K.F.1.4", description: "Demo", confidence: 1 }
    ],
    slides: Array.from({ length: 6 }).map((_, i) => ({
      id: `s${i + 1}`,
      type: i === 0 ? "title" : i === 1 ? "objective" : i === 2 ? "discussion" : i === 3 ? "mini-lesson" : i === 4 ? "practice" : "exit-ticket",
      title: `Slide ${i + 1}`,
      bullets: [`Bullet ${i + 1}`],
      teacherNotes: `Teacher note ${i + 1}`
    })),
    lessonPlan: [
      { heading: "Launch and Objective", slides: [1, 2, 3], description: "Default start", differentiation: { tier3: "", tier2: "", enrichment: "" } },
      { heading: "Teach and Model", slides: [4], description: "Default teach", differentiation: { tier3: "", tier2: "", enrichment: "" } },
      { heading: "Guided and Independent Practice", slides: [5], description: "Default practice", differentiation: { tier3: "", tier2: "", enrichment: "" } },
      { heading: "Assessment and Next Steps", slides: [6], description: "Default close", differentiation: { tier3: "", tier2: "", enrichment: "" } }
    ],
    centers: [
      { title: "Skill Builder Center", objective: "Blend and read CVC words", direction: "Complete 2-3 reps." },
      { title: "Apply It Center", objective: "Apply in context", direction: "Use the decodable text." },
      { title: "Spiral Review Center", objective: "Review prior skill", direction: "Short review task." }
    ],
    rotationPlan: [
      { title: "Rotation 1", description: "Teacher table first." },
      { title: "Rotation 2", description: "Guided support next." },
      { title: "Rotation 3", description: "Close with exit ticket." }
    ],
    interventions: { tier3: [], tier2: [], enrichment: [] }
  };
}

test("wizard app loads inputs page", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/");
  await expect(page.locator("body")).toContainText("Grade");
  await expect(page.locator("body")).toContainText("Objective");
});

test("materials page opens directly", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/materials");
  await expect(page.locator("body")).toContainText("Materials Upload");
});

test("results page opens without crashing", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/results");
  await expect(page.locator("body")).toContainText("Results Hub");
});

test("default results show default structure when package is seeded", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/");
  await page.evaluate((pkg) => {
    localStorage.setItem("lesson_generator__package_v2", JSON.stringify(pkg));
  }, makeDefaultPackage());
  await page.goto("http://127.0.0.1:4173/results");
  await expect(page.locator("body")).toContainText("Slide Preview Deck");
  await expect(page.locator("body")).toContainText("Centers");
  await expect(page.locator("body")).toContainText("Launch and Objective");
  await expect(page.locator("body")).toContainText("Assessment and Next Steps");
});

test("results page renders hub-style structure when seeded", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/");
  await page.evaluate(() => {
    const pkg = {
      meta: { generatedAt: new Date().toISOString(), version: "test" },
      input: {
        grade: "K",
        subject: "ELA",
        date: "2026-03-06",
        lessonTitle: "CVC Words",
        objective: "Blend and read CVC words",
        essentialQuestion: "How do we blend sounds to read words?",
        textOrTopic: "decodables -at word family",
        durationMinutes: 60,
        groupNotes: { tier3: "", tier2: "", onLevel: "", enrichment: "" },
        materials: "",
        manualStandardOverride: []
      },
      standards: [
        { code: "ELA.K.F.1.2", description: "Demo", confidence: 1 },
        { code: "ELA.K.F.1.3", description: "Demo", confidence: 1 },
        { code: "ELA.K.F.1.4", description: "Demo", confidence: 1 }
      ],
      standardsDetected: [
        { code: "ELA.K.F.1.2", description: "Demo", confidence: 1 },
        { code: "ELA.K.F.1.3", description: "Demo", confidence: 1 },
        { code: "ELA.K.F.1.4", description: "Demo", confidence: 1 }
      ],
      slides: Array.from({ length: 8 }).map((_, i) => ({
        id: `s${i + 1}`,
        type: "title",
        title: `Slide ${i + 1}`,
        bullets: []
      })),
      lessonPlan: [
        { heading: "Launch and Navigation", slides: [1, 3, 2], description: "Hub start", differentiation: { tier3: "", tier2: "", enrichment: "" } },
        { heading: "Mini Lesson and Model", slides: [4, 5], description: "Hub teach", differentiation: { tier3: "", tier2: "", enrichment: "" } },
        { heading: "Guided Rotation and Practice", slides: [6, 7], description: "Hub practice", differentiation: { tier3: "", tier2: "", enrichment: "" } },
        { heading: "Check and Close", slides: [8], description: "Hub close", differentiation: { tier3: "", tier2: "", enrichment: "" } }
      ],
      centers: [{}, {}, {}, {}],
      rotationPlan: [],
      interventions: { tier3: [], tier2: [], enrichment: [] }
    };
    localStorage.setItem("lesson_generator__package_v2", JSON.stringify(pkg));
  });
  await page.goto("http://127.0.0.1:4173/results");
  await expect(page.locator("body")).toContainText("Slide Preview Deck");
  await expect(page.locator("body")).toContainText("Centers");
  await expect(page.locator("body")).toContainText("Launch and Navigation");
  await expect(page.locator("body")).toContainText("Check and Close");
});

test("pptx export triggers a download", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/");
  await page.evaluate((pkg) => {
    localStorage.setItem("lesson_generator__package_v2", JSON.stringify(pkg));
  }, makeDefaultPackage());
  await page.goto("http://127.0.0.1:4173/results");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export PPTX" }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toContain("CVC_Words_2026-03-06");
  expect(download.suggestedFilename().toLowerCase().endsWith(".pptx")).toBeTruthy();
});

test("docx export triggers a download", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/");
  await page.evaluate((pkg) => {
    localStorage.setItem("lesson_generator__package_v2", JSON.stringify(pkg));
  }, makeDefaultPackage());
  await page.goto("http://127.0.0.1:4173/results");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export DOCX" }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toContain("CVC_Words_2026-03-06");
  expect(download.suggestedFilename().toLowerCase().endsWith(".docx")).toBeTruthy();
});


