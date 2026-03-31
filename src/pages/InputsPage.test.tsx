import React from "react"
import { beforeEach, describe, expect, it } from "vitest"
import { MemoryRouter } from "react-router-dom"
import { renderToStaticMarkup } from "react-dom/server"
import InputsPage from "./InputsPage"
import { useLessonStore } from "../state/useLessonStore"
import type { LessonInputs } from "../engine/types"

function makeInputs(overrides: Partial<LessonInputs> = {}): LessonInputs {
  return {
    grade: "",
    subject: "",
    standard: "",
    skill: "",
    topic: "",
    duration: "",
    notes: "",
    ...overrides,
  }
}

function seedInputs(inputs: Partial<LessonInputs>) {
  useLessonStore.setState((state) => ({
    ...state,
    inputs: makeInputs(inputs),
  }))
}

function renderInputsPage(): string {
  return renderToStaticMarkup(
    <MemoryRouter>
      <InputsPage />
    </MemoryRouter>
  )
}

describe("Inputs page gating smoke tests", () => {
  beforeEach(() => {
    seedInputs({})
  })

  it("keeps the continue action blocked until the required fields are present", () => {
    const markup = renderInputsPage()

    expect(markup).toContain("Inputs")
    expect(markup).toContain("Complete the required lesson details")
    expect(markup).toContain("Continue to Materials")
    expect(markup).toContain('disabled=""')
  })

  it("shows the ready state once grade, subject, and skill are filled", () => {
    seedInputs({
      grade: "1",
      subject: "ELA",
      skill: "Short a CVC words",
    })

    const markup = renderInputsPage()

    expect(markup).toContain("Ready for Materials")
    expect(markup).toContain("Continue to Materials")
    expect(markup).not.toContain('disabled=""')
  })
})
