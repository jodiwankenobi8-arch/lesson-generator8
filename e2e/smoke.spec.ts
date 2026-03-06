import { test, expect } from "@playwright/test";

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

test("default results show default structure", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/results");
  await expect(page.locator("body")).toContainText("Slides (Student-facing) — 6");
  await expect(page.locator("body")).toContainText("Centers — 3");
  await expect(page.locator("body")).toContainText("Launch and Objective");
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
  await expect(page.locator("body")).toContainText("Slides (Student-facing) — 8");
  await expect(page.locator("body")).toContainText("Centers — 4");
  await expect(page.locator("body")).toContainText("Launch and Navigation");
});
