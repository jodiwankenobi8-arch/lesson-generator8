import React from "react"
import { beforeEach, describe, expect, it } from "vitest"
import { StaticRouter } from "react-router-dom/server"
import { renderToStaticMarkup } from "react-dom/server"
import App from "./App"
import { useLessonStore } from "./state/useLessonStore"
import type { LessonInputs, MaterialAnalysis, MaterialFile, MaterialRole } from "./engine/types"

function makeInputs(overrides: Partial<LessonInputs> = {}): LessonInputs {
  return {
    grade: "1",
    subject: "ELA",
    standard: "RF.1.3",
    skill: "Short a CVC words",
    topic: "Blend and read short a CVC words",
    duration: "30 minutes",
    notes: "",
    ...overrides,
  }
}

function makeMaterial(args: {
  id: string
  name: string
  role: MaterialRole
  status?: MaterialFile["status"]
  analysis?: MaterialAnalysis | null
  errorMessage?: string | null
}): MaterialFile {
  return {
    id: args.id,
    name: args.name,
    role: args.role,
    status: args.status ?? "ready",
    analysis: args.analysis ?? null,
    errorMessage: args.errorMessage ?? null,
    styleSettings: null,
    fileBuffer: null,
    fileContent: null,
  }
}

function seedState(overrides: {
  inputs?: Partial<LessonInputs>
  materials?: MaterialFile[]
} = {}) {
  useLessonStore.setState((state) => ({
    ...state,
    inputs: makeInputs(overrides.inputs),
    selectedLessonMode: "single",
    materials: overrides.materials ?? [],
    blueprint: null,
    planningIdeas: null,
    lessonSpec: null,
    lessonPackage: null,
    lessonTrace: null,
    missingAreaDecisions: {},
  }))
}

function renderAppAt(path: string): string {
  return renderToStaticMarkup(
    <StaticRouter location={path}>
      <App />
    </StaticRouter>
  )
}

describe("App route integration: results gating", () => {
  beforeEach(() => {
    seedState({
      inputs: { grade: "", subject: "", skill: "" },
      materials: [],
    })
  })

  it("shows the missing-input block reason on the Results route", () => {
    const markup = renderAppAt("/results")

    expect(markup).toContain("Results")
    expect(markup).toContain("Results stay locked until all required lesson inputs are completed.")
  })

  it("shows the processing block reason with the current processing count", () => {
    seedState({
      materials: [
        makeMaterial({
          id: "curriculum-processing",
          name: "curriculum-processing.pdf",
          role: "curriculum",
          status: "analyzing",
          analysis: null,
        }),
      ],
    })

    const markup = renderAppAt("/results")

    expect(markup).toContain("Results stay locked until material processing finishes. Currently processing: 1.")
  })

  it("does not block Results navigation when inputs are complete and no materials are uploaded", () => {
    seedState({
      materials: [],
    })

    const markup = renderAppAt("/results")

    expect(markup).toContain("Results")
    expect(markup).not.toContain("Results stay locked until")
  })

  it("shows the usable-material block reason when inputs are complete but added materials are not usable", () => {
    seedState({
      materials: [
        makeMaterial({
          id: "curriculum-blocked",
          name: "curriculum-blocked.pdf",
          role: "curriculum",
          status: "ready",
          analysis: {
            reliability: {
              usableForContent: false,
              usableForStructure: false,
            },
          } as MaterialAnalysis,
        }),
      ],
    })

    const markup = renderAppAt("/results")

    expect(markup).toContain(
      "Results stay locked until added materials are usable for grounded generation. Remove unusable files to generate from teacher inputs only."
    )
  })

  it("removes the results block reason when inputs are complete and one material is usable", () => {
    seedState({
      materials: [
        makeMaterial({
          id: "curriculum-ready",
          name: "curriculum-ready.pdf",
          role: "curriculum",
          status: "ready",
          analysis: {
            reliability: {
              usableForContent: true,
              usableForStructure: false,
            },
          } as MaterialAnalysis,
        }),
      ],
    })

    const markup = renderAppAt("/results")

    expect(markup).toContain("Results")
    expect(markup).not.toContain("Results stay locked until")
  })
})
