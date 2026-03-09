import { test, expect } from "@playwright/test";

const WORKSPACE_KEY = "lesson_generator__workspace_v3";
const LEGACY_ENGINE_KEY = "lesson_generator__engine_package_v1";

function makeEnginePackage(overrides: Record<string, any> = {}) {
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
      manualStandardOverride: [],
    },
    standards: [
      { code: "ELA.K.F.1.2", description: "Demo", confidence: 1 },
      { code: "ELA.K.F.1.3", description: "Demo", confidence: 1 },
      { code: "ELA.K.F.1.4", description: "Demo", confidence: 1 },
    ],
    standardsDetected: [
      { code: "ELA.K.F.1.2", description: "Demo", confidence: 1 },
      { code: "ELA.K.F.1.3", description: "Demo", confidence: 1 },
      { code: "ELA.K.F.1.4", description: "Demo", confidence: 1 },
    ],
    slides: [
      { id: "s1", type: "title", title: "Welcome", bullets: ["ELA | Grade K"], teacherNotes: "Open the lesson." },
      { id: "s2", type: "objective", title: "I Can", bullets: ["Blend and read CVC words"], teacherNotes: "State the goal." },
      { id: "s3", type: "discussion", title: "What Are We Learning?", bullets: ["How do we blend sounds to read words?"], teacherNotes: "Turn and talk." },
      { id: "s4", type: "mini-lesson", title: "Teach", bullets: ["Focus skill: Blend and read CVC words"], teacherNotes: "Model the skill." },
      { id: "s5", type: "practice", title: "Let's Practice", bullets: ["Let's practice together."], teacherNotes: "Practice together." },
      { id: "s6", type: "exit-ticket", title: "Show What You Know", bullets: ["Let's show what we learned."], teacherNotes: "Close the lesson." },
    ],
    lessonPlan: [
      { heading: "Launch and Objective", slides: [1, 2, 3], description: "Default start", differentiation: { tier3: "", tier2: "", enrichment: "" } },
      { heading: "Teach and Model", slides: [4], description: "Default teach", differentiation: { tier3: "", tier2: "", enrichment: "" } },
      { heading: "Guided and Independent Practice", slides: [5], description: "Default practice", differentiation: { tier3: "", tier2: "", enrichment: "" } },
      { heading: "Assessment and Next Steps", slides: [6], description: "Default close", differentiation: { tier3: "", tier2: "", enrichment: "" } },
    ],
    centers: [
      { title: "Skill Builder Center", objective: "Blend and read CVC words", direction: "Complete 2-3 reps." },
      { title: "Apply It Center", objective: "Apply in context", direction: "Use the decodable text." },
      { title: "Spiral Review Center", objective: "Review prior skill", direction: "Short review task." },
    ],
    rotationPlan: [
      { title: "Rotation 1", description: "Teacher table first." },
      { title: "Rotation 2", description: "Guided support next." },
      { title: "Rotation 3", description: "Close with exit ticket." },
    ],
    interventions: { tier3: [], tier2: [], enrichment: [] },
    ...overrides,
  };
}

async function seedWorkspace(page: any, pkg: any) {
  const workspace = {
    version: 3,
    input: pkg.input,
    package: pkg,
  };

  await page.addInitScript(([workspaceKey, legacyKey, workspaceValue, enginePkg]) => {
    window.localStorage.setItem(workspaceKey, JSON.stringify(workspaceValue));
    window.localStorage.setItem(legacyKey, JSON.stringify(enginePkg));
  }, [WORKSPACE_KEY, LEGACY_ENGINE_KEY, workspace, pkg]);
}

test("inputs page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toContainText(/Grade/i);
  await expect(page.locator("body")).toContainText(/Objective/i);
});

test("materials page loads", async ({ page }) => {
  await page.goto("/materials");
  await expect(page.locator("body")).toContainText(/Materials/i);
});

test("results page opens with seeded package", async ({ page }) => {
  const pkg = makeEnginePackage();
  await seedWorkspace(page, pkg);
  await page.goto("/results");

  await expect(page.locator("body")).toContainText(/Finished Lesson Package|Results Hub/i);
  await expect(page.locator("body")).toContainText(/Take It With You/i);
  await expect(page.locator("body")).toContainText(/Teaching Deck Preview/i);
  await expect(page.locator("body")).toContainText(/Teacher Lesson Plan/i);
});

test("default seeded package renders expected lesson plan structure", async ({ page }) => {
  const pkg = makeEnginePackage();
  await seedWorkspace(page, pkg);
  await page.goto("/results");

  await expect(page.locator("body")).toContainText(/Launch and Objective/i);
  await expect(page.locator("body")).toContainText(/Assessment and Next Steps/i);
  await expect(page.locator("body")).toContainText(/Centers/i);
});

test("kindergarten package renders teacher-led labels", async ({ page }) => {
  const pkg = makeEnginePackage({
    input: { ...makeEnginePackage().input, grade: "K" },
    slides: [
      { id: "s1", type: "title", title: "Welcome", bullets: ["ELA | Grade K"] },
      { id: "s2", type: "objective", title: "I Can", bullets: ["Blend and read CVC words"] },
      { id: "s3", type: "discussion", title: "What Are We Learning?", bullets: ["How do we blend sounds to read words?"] },
      { id: "s4", type: "practice", title: "Let's Practice", bullets: ["Let's practice together."] },
      { id: "s5", type: "exit-ticket", title: "Show What You Know", bullets: ["Let's show what we learned."] },
    ],
  });

  await seedWorkspace(page, pkg);
  await page.goto("/results");

  await expect(page.locator("body")).toContainText(/I Can/i);
  await expect(page.locator("body")).toContainText(/Let's Practice/i);
  await expect(page.locator("body")).toContainText(/Show What You Know/i);
});

test("grade 2 hub package renders hub lesson structure", async ({ page }) => {
  const base = makeEnginePackage();
  const pkg = makeEnginePackage({
    input: {
      ...base.input,
      grade: "2",
      lessonTitle: "Story Elements",
      objective: "Identify character, setting, and events",
      essentialQuestion: "How do story elements help us understand a text?",
      textOrTopic: "narrative text",
    },
    slides: [
      { id: "s1", type: "title", title: "Welcome", bullets: ["ELA | Grade 2"] },
      { id: "s2", type: "discussion", title: "Lesson Hub", bullets: ["Choose the lesson path together."] },
      { id: "s3", type: "objective", title: "Objective", bullets: ["Identify character, setting, and events"] },
      { id: "s4", type: "mini-lesson", title: "Mini Lesson", bullets: ["Anchor task: Story map"] },
      { id: "s5", type: "practice", title: "Center Rotation", bullets: ["Rotate through the practice path you were assigned."] },
      { id: "s6", type: "exit-ticket", title: "Exit Ticket", bullets: ["Show evidence of this goal."] },
    ],
    lessonPlan: [
      { heading: "Launch and Navigation", slides: [1, 2, 3], description: "Hub start", differentiation: { tier3: "", tier2: "", enrichment: "" } },
      { heading: "Mini Lesson and Model", slides: [4], description: "Hub teach", differentiation: { tier3: "", tier2: "", enrichment: "" } },
      { heading: "Guided Rotation and Practice", slides: [5], description: "Hub practice", differentiation: { tier3: "", tier2: "", enrichment: "" } },
      { heading: "Check and Close", slides: [6], description: "Hub close", differentiation: { tier3: "", tier2: "", enrichment: "" } },
    ],
    centers: [{}, {}, {}, {}],
  });

  await seedWorkspace(page, pkg);
  await page.goto("/results");

  await expect(page.locator("body")).toContainText(/Lesson Hub/i);
  await expect(page.locator("body")).toContainText(/Launch and Navigation/i);
  await expect(page.locator("body")).toContainText(/Check and Close/i);
});

test("guidepost package renders bridge behavior", async ({ page }) => {
  const base = makeEnginePackage();
  const pkg = makeEnginePackage({
    input: {
      ...base.input,
      grade: "3",
      lessonTitle: "Compare Characters",
      objective: "Compare characters across scenes",
      essentialQuestion: "How do characters change across a story?",
      textOrTopic: "narrative scenes",
    },
    slides: [
      { id: "s1", type: "title", title: "Welcome", bullets: ["ELA | Grade 3"] },
      { id: "s2", type: "objective", title: "Objective", bullets: ["Compare characters across scenes"] },
      { id: "s3", type: "discussion", title: "Bridge", bullets: ["Connect prior learning to today.", "How do characters change across a story?"] },
      { id: "s4", type: "mini-lesson", title: "Teach", bullets: ["Teach the compare-and-contrast move."] },
      { id: "s5", type: "exit-ticket", title: "Reflection", bullets: ["Show how you met this goal."] },
    ],
  });

  await seedWorkspace(page, pkg);
  await page.goto("/results");

  await expect(page.locator("body")).toContainText(/Bridge/i);
  await expect(page.locator("body")).toContainText(/How do characters change across a story/i);
});

test("curriculum influence appears in plan and centers", async ({ page }) => {
  const pkg = makeEnginePackage({
    lessonPlan: [
      { heading: "Teach and Model", slides: [1], description: "Teach the skill using decodables and model it with Curriculum Story Map.", differentiation: { tier3: "", tier2: "", enrichment: "" } },
    ],
    centers: [
      { title: "Skill Builder Center", objective: "Blend and read CVC words", direction: "Repeat the exact skill with this material: Curriculum Story Map. Complete 2-3 reps." },
      { title: "Apply It Center", objective: "Apply in context", direction: "Use Decodable Practice Page to apply the skill and explain your thinking." },
    ],
  });

  await seedWorkspace(page, pkg);
  await page.goto("/results");

  await expect(page.locator("body")).toContainText(/Curriculum Story Map/i);
  await expect(page.locator("body")).toContainText(/Decodable Practice Page/i);
});

test("exemplar cue influence appears in teacher-facing wording", async ({ page }) => {
  const pkg = makeEnginePackage({
    slides: [
      { id: "s1", type: "discussion", title: "What Are We Learning?", bullets: ["How do we blend sounds to read words?"], teacherNotes: "Use a clear transition cue: clap twice and turn." },
      { id: "s2", type: "practice", title: "Let's Practice", bullets: ["Let's practice together."], teacherNotes: "Advance slides deliberately during instruction: pause after each blend." },
    ],
    rotationPlan: [
      { title: "Rotation 1", description: "Rotate students through tasks using this transition cue: clap twice and turn." },
    ],
  });

  await seedWorkspace(page, pkg);
  await page.goto("/results");

  await expect(page.locator("body")).toContainText(/clap twice and turn/i);
  await expect(page.locator("body")).toContainText(/pause after each blend/i);
});

test("results page handles sparse package safely", async ({ page }) => {
  const base = makeEnginePackage();
  const pkg = makeEnginePackage({
    input: { ...base.input, lessonTitle: "Sparse Lesson" },
    standards: [],
    standardsDetected: [],
    slides: [{ id: "s1", type: "title", title: "Sparse Lesson", bullets: [] }],
    lessonPlan: [],
    centers: [],
    rotationPlan: [],
    interventions: { tier3: [], tier2: [], enrichment: [] },
  });

  await seedWorkspace(page, pkg);
  await page.goto("/results");

  await expect(page.locator("body")).toContainText(/Sparse Lesson/i);
  await expect(page.locator("body")).toContainText(/Finished Lesson Package|Results Hub/i);
});

test("pptx export triggers a download", async ({ page }) => {
  const pkg = makeEnginePackage();
  await seedWorkspace(page, pkg);
  await page.goto("/results");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Export PPTX/i }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toContain("CVC_Words_2026-03-06");
  expect(download.suggestedFilename().toLowerCase().endsWith(".pptx")).toBeTruthy();
});

test("docx export triggers a download", async ({ page }) => {
  const pkg = makeEnginePackage();
  await seedWorkspace(page, pkg);
  await page.goto("/results");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Export DOCX/i }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toContain("CVC_Words_2026-03-06");
  expect(download.suggestedFilename().toLowerCase().endsWith(".docx")).toBeTruthy();
});

test("zip export triggers a download", async ({ page }) => {
  const pkg = makeEnginePackage();
  await seedWorkspace(page, pkg);
  await page.goto("/results");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Full Export \(ZIP\)|ZIP/i }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename().toLowerCase().endsWith(".zip")).toBeTruthy();
});