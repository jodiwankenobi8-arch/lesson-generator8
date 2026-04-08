import "dotenv/config"
import express from "express"
import cors from "cors"
import OpenAI from "openai"

const app = express()
app.use(cors())
app.use(express.json({ limit: "10mb" }))

const port = Number(process.env.AI_ANALYSIS_PORT || 8787)
const apiKey = process.env.OPENAI_API_KEY
const materialModel = process.env.OPENAI_MATERIAL_ANALYSIS_MODEL || "gpt-4.1"
const lessonModel = process.env.OPENAI_LESSON_CONSTRUCTION_MODEL || materialModel

if (!apiKey) {
  console.error("OPENAI_API_KEY is missing.")
}

const client = new OpenAI({ apiKey })

const stringList = (maxItems = 8) => ({
  type: "array",
  items: { type: "string" },
  maxItems,
})

const MATERIAL_ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    enabled: { type: "boolean" },
    role: { type: "string", enum: ["curriculum", "exemplar"] },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    summary: { type: "string" },
    warnings: stringList(8),
    ignoredLines: stringList(20),
    curriculum: {
      type: "object",
      additionalProperties: false,
      properties: {
        standards: stringList(),
        vocabulary: stringList(),
        wordLists: stringList(),
        texts: stringList(),
        practiceTasks: stringList(),
        instructionalTargets: stringList(),
        examples: stringList(),
        coverage: {
          type: "object",
          additionalProperties: false,
          properties: {
            foundationalSkills: stringList(),
            sightWords: stringList(),
            lessonSegments: stringList(),
          },
          required: ["foundationalSkills", "sightWords", "lessonSegments"],
        },
      },
      required: [
        "standards",
        "vocabulary",
        "wordLists",
        "texts",
        "practiceTasks",
        "instructionalTargets",
        "examples",
        "coverage",
      ],
    },
    exemplar: {
      type: "object",
      additionalProperties: false,
      properties: {
        slideFlow: stringList(),
        pacing: stringList(),
        teacherMoves: stringList(),
        promptStyle: stringList(),
        layoutCues: stringList(),
        tone: stringList(),
        reusableStructure: stringList(),
      },
      required: [
        "slideFlow",
        "pacing",
        "teacherMoves",
        "promptStyle",
        "layoutCues",
        "tone",
        "reusableStructure",
      ],
    },
  },
  required: [
    "enabled",
    "role",
    "confidence",
    "summary",
    "warnings",
    "ignoredLines",
    "curriculum",
    "exemplar",
  ],
}

const LESSON_CONSTRUCTION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    enabled: { type: "boolean" },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    warnings: stringList(8),
    derivedStandards: stringList(4),
    vocabulary: stringList(8),
    wordLists: stringList(10),
    texts: stringList(4),
    practiceIdeas: stringList(10),
    lessonPlanText: { type: "string" },
    slides: {
      type: "array",
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          title: { type: "string" },
          kind: { type: "string" },
          action: { type: "string" },
          purpose: { type: "string" },
          timing: { type: "string" },
          teacherMove: { type: "string" },
          promptStyle: { type: "string" },
          tone: { type: "string" },
          body: stringList(8),
        },
        required: [
          "title",
          "kind",
          "action",
          "purpose",
          "timing",
          "teacherMove",
          "promptStyle",
          "tone",
          "body",
        ],
      },
    },
    centers: stringList(8),
    rotationPlanLines: stringList(12),
    interventions: stringList(8),
  },
  required: [
    "enabled",
    "confidence",
    "warnings",
    "derivedStandards",
    "vocabulary",
    "wordLists",
    "texts",
    "practiceIdeas",
    "lessonPlanText",
    "slides",
    "centers",
    "rotationPlanLines",
    "interventions",
  ],
}

const MATERIAL_ANALYSIS_SYSTEM_PROMPT = `
You normalize extracted lesson-material text into structured JSON.

Rules:
- Curriculum is the content authority.
- Exemplar is the presentation authority.
- Do not invent lesson content not supported by extracted text.
- Remove admin labels, OCR debris, URLs, resource-only lines, schedule headers, malformed fragments, and obvious cross-topic contamination.
- Prefer short clean phrases that a teacher could actually use.
- If uncertain, leave arrays empty instead of guessing.
- For curriculum role, fill curriculum fields and keep exemplar arrays empty.
- For exemplar role, fill exemplar fields and keep curriculum arrays empty.
- Confidence should reflect trust in the normalized output after cleaning.
`

const LESSON_CONSTRUCTION_SYSTEM_PROMPT = `
You are building a teacher-usable lesson package from grounded lesson inputs.

Product rules:
- Curriculum is the content authority.
- Exemplar is the presentation / slide / pacing authority.
- If curriculum is thin, use teacher input, grade level, likely Florida ELA coverage, exemplar structure, and the deterministic draft to build specific usable lesson content.
- Do not return placeholders such as "teacher-selected standard", "Teacher-provided practice items", or "Teacher-provided lesson text".
- Do not return vague summaries, outlines, or filler.
- The lesson must feel ready for a teacher to teach.
- If subject is ELA, derive 1-3 plausible Florida B.E.S.T. ELA benchmark codes and concise labels that match the grounded lesson focus.
- Requested outputs and selected lesson-plan parts matter. Generate only the outputs the request calls for.
- Preserve centers as student-independent work and small-group / intervention as teacher-led support.
- Preserve exemplar slide flow, pacing, prompts, and layout rhythm as strongly as the evidence allows.
- Return compact but specific lines. Avoid fluff.
`

function buildMaterialPayload(body) {
  const extractedText = Array.isArray(body?.extractedText)
    ? body.extractedText
        .map((line) => String(line ?? "").replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .slice(0, 220)
    : []

  return {
    materialId: String(body?.materialId ?? ""),
    name: String(body?.name ?? ""),
    role: body?.role === "exemplar" ? "exemplar" : "curriculum",
    extractedText,
    extractionMetadata: body?.extractionMetadata ?? null,
  }
}

function buildLessonPayload(body) {
  return {
    inputs: body?.inputs ?? {},
    requestedOutputs: body?.requestedOutputs ?? {},
    missingAreaDecisions: body?.missingAreaDecisions ?? {},
    blueprint: body?.blueprint ?? {},
    planningIdeas: body?.planningIdeas ?? {},
    deterministicDraft: body?.deterministicDraft ?? {},
    materials: Array.isArray(body?.materials) ? body.materials.slice(0, 6) : [],
  }
}

async function requestStructuredJson({ model, systemPrompt, schemaName, schema, payload, maxOutputTokens }) {
  const response = await client.responses.create({
    model,
    temperature: 0.2,
    max_output_tokens: maxOutputTokens,
    input: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: JSON.stringify(payload, null, 2),
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: schemaName,
        schema,
        strict: true,
      },
    },
  })

  if (!response.output_text) {
    throw new Error("OpenAI returned no structured output text.")
  }

  return JSON.parse(response.output_text)
}

app.post("/api/material-analysis", async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(500).send("OPENAI_API_KEY is missing.")
    }

    const payload = buildMaterialPayload(req.body)

    if (!payload.name) {
      return res.status(400).send("name is required.")
    }

    if (!payload.extractedText.length) {
      return res.status(400).send("extractedText must contain at least one line.")
    }

    const parsed = await requestStructuredJson({
      model: materialModel,
      systemPrompt: MATERIAL_ANALYSIS_SYSTEM_PROMPT,
      schemaName: "material_analysis",
      schema: MATERIAL_ANALYSIS_SCHEMA,
      payload,
      maxOutputTokens: 2200,
    })

    return res.json(parsed)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown AI material analysis server error"

    console.error("AI material analysis error:", message)
    return res.status(500).send(message)
  }
})

app.post("/api/lesson-construction", async (req, res) => {
  try {
    if (!apiKey) {
      return res.status(500).send("OPENAI_API_KEY is missing.")
    }

    const payload = buildLessonPayload(req.body)

    if (!payload?.inputs?.grade || !payload?.inputs?.subject || !payload?.inputs?.skill) {
      return res.status(400).send("inputs.grade, inputs.subject, and inputs.skill are required.")
    }

    const parsed = await requestStructuredJson({
      model: lessonModel,
      systemPrompt: LESSON_CONSTRUCTION_SYSTEM_PROMPT,
      schemaName: "lesson_construction",
      schema: LESSON_CONSTRUCTION_SCHEMA,
      payload,
      maxOutputTokens: 5200,
    })

    return res.json(parsed)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown AI lesson construction server error"

    console.error("AI lesson construction error:", message)
    return res.status(500).send(message)
  }
})

app.listen(port, () => {
  console.log("[AI] server listening on port", port)
  console.log("AI lesson server running on http://localhost:" + port)
})
