import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import {
  buildMaterialAnalysisReviewDraft,
  buildUploadSourceMetadata,
  getTeacherVisibleMaterialSummary,
  getTeacherVisibleMaterialNote,
  inferMimeTypeFromName,
  isSupportedUploadFile,
  normalizeAutoDraftValue,
  parseReviewList,
  serializeReviewList,
  shouldIgnoreAutoDraftValue,
  buildSuggestedStandards,
  serializeStandardsText as serializeConfirmedStandardsText,
  standardTextIncludes,
  toggleStandardInText,
  shouldShowStandardsConfirmationCard,
  getStandardsConfirmationHelperText,
} from "./MaterialsPage"
import { EXEMPLAR_INFLUENCE_MODE_OPTIONS, EXEMPLAR_TARGET_OPTIONS } from "./materialsPageExemplarHelpers"
import { dropZoneStyle, uploadCardStyle } from "./materialsPageUiHelpers"

describe("buildUploadSourceMetadata", () => {
  it("classifies image uploads as bounded OCR recovery sources with traceable metadata", () => {
    const metadata = buildUploadSourceMetadata({
      name: "worksheet-photo.png",
      type: "image/png",
    })

    expect(metadata).toEqual({
      sourceKind: "image_upload",
      sourceLabel: "worksheet-photo.png",
      sourceMimeType: "image/png",
    })
  })

  it("keeps supported MIME-only screenshots in the OCR recovery lane", () => {
    const metadata = buildUploadSourceMetadata({
      name: "Camera Upload",
      type: "image/png",
    })

    expect(metadata).toEqual({
      sourceKind: "image_upload",
      sourceLabel: "Camera Upload",
      sourceMimeType: "image/png",
    })
  })

  it("does not silently route unsupported image MIME uploads into the OCR recovery lane yet", () => {
    const metadata = buildUploadSourceMetadata({
      name: "district-scan.bmp",
      type: "image/bmp",
    })

    expect(metadata).toEqual({
      sourceKind: "file_upload",
      sourceLabel: "district-scan.bmp",
      sourceMimeType: "image/bmp",
    })
  })

  it("falls back to file-name inference when the browser omits a MIME type", () => {
    const metadata = buildUploadSourceMetadata({
      name: "lesson-outline.docx",
      type: "",
    })

    expect(metadata).toEqual({
      sourceKind: "file_upload",
      sourceLabel: "lesson-outline.docx",
      sourceMimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    })
  })

  it("keeps image uploads in the OCR recovery lane when the browser omits a MIME type", () => {
    const metadata = buildUploadSourceMetadata({
      name: "screenshot-note.webp",
      type: "",
    })

    expect(metadata).toEqual({
      sourceKind: "image_upload",
      sourceLabel: "screenshot-note.webp",
      sourceMimeType: "image/webp",
    })
  })
})

describe("isSupportedUploadFile", () => {
  it("accepts supported document uploads for drag and drop", () => {
    expect(
      isSupportedUploadFile({
        name: "lesson-outline.docx",
        type: "",
      })
    ).toBe(true)
  })

  it("keeps MIME-only screenshots compatible with drag and drop", () => {
    expect(
      isSupportedUploadFile({
        name: "Camera Upload",
        type: "image/png",
      })
    ).toBe(true)
  })

  it("rejects unsupported dropped files before they reach the workbench", () => {
    expect(
      isSupportedUploadFile({
        name: "district-scan.bmp",
        type: "image/bmp",
      })
    ).toBe(false)
  })
})

describe("getTeacherVisibleMaterialNote", () => {
  it("returns a simple ready status for usable materials", () => {
    expect(
      getTeacherVisibleMaterialNote({
        status: "ready",
        errorMessage: null,
        analysis: {
          reliability: {
            usableForContent: true,
            usableForStructure: false,
          },
        },
      } as never)
    ).toBe("Ready to use.")
  })

  it("keeps blocked ready materials teacher-readable", () => {
    expect(
      getTeacherVisibleMaterialNote({
        status: "ready",
        errorMessage: null,
        analysis: {
          reliability: {
            usableForContent: false,
            usableForStructure: false,
          },
        },
      } as never)
    ).toBe("Ready, but it still needs teacher review.")
  })

  it("uses the error message directly when a file needs attention", () => {
    expect(
      getTeacherVisibleMaterialNote({
        status: "error",
        errorMessage: "Unsupported file content",
        analysis: null,
      } as never)
    ).toBe("Unsupported file content")
  })
})

describe("getTeacherVisibleMaterialSummary", () => {
  it("surfaces curriculum signals with teacher-facing summary lines", () => {
    const summary = getTeacherVisibleMaterialSummary({
      role: "curriculum",
      status: "ready",
      errorMessage: null,
      analysis: {
        extractionMetadata: {
          method: "parser",
          quality: "high",
          confidence: 0.93,
          notes: [],
          ocrCandidate: false,
          ocrReason: null,
        },
        reliability: {
          level: "high",
          score: 92,
          usableForContent: true,
          usableForStructure: false,
          contentDecision: "allow",
          structureDecision: "block",
          reasons: [],
          warnings: [],
        },
        curriculum: {
          standards: ["ELA.K.F.1.3"],
          instructionalTargets: ["long a", "CVCe words"],
          vocabulary: ["silent e"],
          wordLists: ["cake", "game", "lake"],
          examples: ["same"],
          practiceTasks: ["blend and read", "sort long a words"],
          texts: [],
        },
      },
    } as never)

    expect(summary).toBeTruthy()
    expect(summary?.statusLabel).toBe("Strong signal")
    expect(summary?.summaryLines.join(" ")).toContain("Standards detected: ELA.K.F.1.3")
    expect(summary?.summaryLines.join(" ")).toContain("Skill/content: long a, CVCe words")
    expect(summary?.summaryLines.join(" ")).toContain("Word list/examples:")
    expect(summary?.summaryLines.join(" ")).toContain("Practice ideas:")
  })

  it("surfaces exemplar structure, pacing, and style signals", () => {
    const summary = getTeacherVisibleMaterialSummary({
      role: "exemplar",
      status: "ready",
      errorMessage: null,
      analysis: {
        extractionMetadata: {
          method: "parser",
          quality: "high",
          confidence: 0.88,
          notes: [],
          ocrCandidate: false,
          ocrReason: null,
        },
        reliability: {
          level: "high",
          score: 90,
          usableForContent: false,
          usableForStructure: true,
          contentDecision: "block",
          structureDecision: "allow",
          reasons: [],
          warnings: [],
        },
        exemplar: {
          slideFlow: ["Opening", "Model", "Guided Practice", "Closure"],
          pacing: ["5 min launch", "10 min model"],
          reusableStructure: ["large word cards", "partner read"],
          layoutCues: [],
          promptStyle: [],
          teacherMoves: [],
          tone: [],
        },
      },
    } as never)

    expect(summary).toBeTruthy()
    expect(summary?.summaryLines.join(" ")).toContain("Structure detected: Opening -> Model -> Guided Practice -> Closure")
    expect(summary?.summaryLines.join(" ")).toContain("Pacing: 5 min launch, 10 min model")
    expect(summary?.summaryLines.join(" ")).toContain("Reusable style: large word cards, partner read")
  })

  it("uses plain-language caution wording for weak or fallback extraction", () => {
    const summary = getTeacherVisibleMaterialSummary({
      role: "curriculum",
      status: "ready",
      errorMessage: null,
      analysis: {
        extractionMetadata: {
          method: "fallback_notice",
          quality: "low",
          confidence: 0.2,
          notes: [],
          ocrCandidate: true,
          ocrReason: "parser failed",
        },
        reliability: {
          level: "low",
          score: 22,
          usableForContent: true,
          usableForStructure: false,
          contentDecision: "caution",
          structureDecision: "block",
          reasons: [],
          warnings: [],
        },
        curriculum: {
          standards: [],
          instructionalTargets: [],
          vocabulary: [],
          wordLists: [],
          examples: [],
          practiceTasks: [],
          texts: [],
        },
      },
    } as never)

    expect(summary?.statusLabel).toBe("Use with caution")
    expect(summary?.summaryLines.join(" ")).toContain("Very little usable text was found.")
    expect(summary?.nextStep).toContain("used with caution")
  })

  it("does not show a final summary while files are still processing", () => {
    const summary = getTeacherVisibleMaterialSummary({
      role: "curriculum",
      status: "extracting",
      errorMessage: null,
      analysis: null,
    } as never)

    expect(summary).toBeNull()
  })

  it("shows useful next-step wording for failed materials", () => {
    const summary = getTeacherVisibleMaterialSummary({
      role: "curriculum",
      status: "error",
      errorMessage: "Unsupported file content",
      analysis: null,
    } as never)

    expect(summary?.statusLabel).toBe("Needs attention")
    expect(summary?.summaryLines.join(" ")).toContain("could not be prepared")
    expect(summary?.nextStep).toContain("Unsupported file content")
  })
})

describe("inferMimeTypeFromName", () => {
  it("returns null for unknown extensions so upload provenance stays honest", () => {
    expect(inferMimeTypeFromName("notes.custom")).toBeNull()
  })
})

describe("getTeacherVisibleMaterialNote progress wording", () => {
  it("keeps upload and processing notes teacher-readable", () => {
    expect(
      getTeacherVisibleMaterialNote({
        status: "uploaded",
        errorMessage: null,
        analysis: null,
      } as never)
    ).toBe("Uploaded. Getting it ready now.")

    expect(
      getTeacherVisibleMaterialNote({
        status: "extracting",
        errorMessage: null,
        analysis: null,
      } as never)
    ).toBe("Reading this material now.")

    expect(
      getTeacherVisibleMaterialNote({
        status: "analyzing",
        errorMessage: null,
        analysis: null,
      } as never)
    ).toBe("Checking what this material can support.")
  })
})

describe("exemplar restyle and routing copy", () => {
  it("keeps the custom exemplar option focused on preserving structure while restyling details", () => {
    const customOption = EXEMPLAR_INFLUENCE_MODE_OPTIONS.find((option) => option.value === "custom")

    expect(customOption).toBeDefined()
    expect(customOption?.label).toBe("Keep structure, restyle details")
    expect(customOption?.help).toContain("layout, structure, and pacing")
    expect(customOption?.help).toContain("colors, theme, or wording")
  })

  it("offers routing targets so different exemplars can drive different outputs", () => {
    expect(EXEMPLAR_TARGET_OPTIONS.map((option) => option.value)).toEqual(
      expect.arrayContaining([
        "shared",
        "lesson_slides",
        "lesson_plan",
        "centers",
        "small_group",
        "intervention",
        "printables",
      ])
    )

    const printablesTarget = EXEMPLAR_TARGET_OPTIONS.find((option) => option.value === "printables")
    expect(printablesTarget).toBeDefined()
    expect(printablesTarget?.label).toBe("Printables / student pages")
    expect(printablesTarget?.help).toContain("different structure or feel")
  })
})

describe("analysis review helpers", () => {
  it("seeds curriculum review fields from meaningful analyzed curriculum content and humanizes the summary", () => {
    const review = buildMaterialAnalysisReviewDraft({
      id: "curr-1",
      name: "curriculum.txt",
      role: "curriculum",
      status: "ready",
      analysis: {
        sourceRole: "curriculum",
        summary: "Curriculum source summary",
        extractedText: ["RF.1.3"],
        tags: ["curriculum"],
        curriculum: {
          standards: ["RF.1.3"],
          vocabulary: ["short a"],
          wordLists: ["cat, map, sat, ram"],
          texts: ["A short decodable text."],
          practiceTasks: ["Blend cat, map, sat, ram."],
          instructionalTargets: ["Blend and read short a CVC words."],
          examples: ["cat"],
        },
      },
      errorMessage: null,
      fileBuffer: null,
      fileContent: null,
    } as never)

    expect(review).toEqual({
      standards: ["RF.1.3"],
      vocabulary: ["short a"],
      wordLists: ["cat, map, sat, ram", "cat"],
      instructionalTargets: ["Blend and read short a CVC words."],
      texts: ["A short decodable text."],
      practiceIdeas: ["Blend cat, map, sat, ram."],
      exemplarStructure: [],
      teacherSummary: "",
    })
  })

  it("strips placeholder and extraction-failure junk from weak curriculum drafts", () => {
    const review = buildMaterialAnalysisReviewDraft({
      id: "curr-2",
      name: "weak-curriculum.pdf",
      role: "curriculum",
      status: "ready",
      analysis: {
        sourceRole: "curriculum",
        summary: "Analyzer summary",
        extractedText: [
          "PDF extraction produced no readable text for weak-curriculum.pdf.",
          "The PDF may be image-based, password-protected, or use unsupported embedded text encoding.",
        ],
        tags: ["curriculum"],
        curriculum: {
          standards: ["teacher-selected standard"],
          vocabulary: ["key vocabulary"],
          wordLists: [],
          texts: [
            "PDF extraction produced no readable text for weak-curriculum.pdf.",
            "The PDF may be image-based, password-protected, or use unsupported embedded text encoding.",
          ],
          practiceTasks: ["curriculum-aligned practice task"],
          instructionalTargets: ["lesson target"],
          examples: [],
        },
      },
      errorMessage: null,
      fileBuffer: null,
      fileContent: null,
    } as never)

    expect(review).toEqual({
      standards: [],
      vocabulary: [],
      wordLists: [],
      instructionalTargets: [],
      texts: [],
      practiceIdeas: [],
      exemplarStructure: [],
      teacherSummary: "",
    })
  })

  it("dedupes exemplar review fields case-insensitively and humanizes the summary", () => {
    const review = buildMaterialAnalysisReviewDraft({
      id: "ex-1",
      name: "exemplar.txt",
      role: "exemplar",
      status: "ready",
      analysis: {
        sourceRole: "exemplar",
        summary: "Exemplar source summary",
        extractedText: ["Opening", "Teach"],
        tags: ["exemplar"],
        exemplar: {
          slideFlow: ["Opening", "Teach"],
          pacing: ["5 min launch"],
          teacherMoves: ["Model blending"],
          promptStyle: ["Turn and talk"],
          layoutCues: ["Large word display"],
          tone: ["supportive"],
          reusableStructure: ["center", "CENTER", "I do, we do, you do"],
        },
      },
      errorMessage: null,
      fileBuffer: null,
      fileContent: null,
    } as never)

    expect(review).toEqual({
      standards: [],
      vocabulary: [],
      wordLists: [],
      instructionalTargets: [],
      texts: [],
      practiceIdeas: [],
      exemplarStructure: ["center", "I do, we do, you do"],
      teacherSummary: "",
    })
  })

  it("parses newline and semicolon review edits into clean unique lists", () => {
    expect(parseReviewList("RF.1.3\nRF.1.3; Vocabulary cue ; • Vocabulary cue")).toEqual([
      "RF.1.3",
      "Vocabulary cue",
    ])

    expect(serializeReviewList(["One", "Two"])).toBe("One\nTwo")
  })

  it("exposes the normalization and ignore rules used for auto-seeded review values", () => {
    expect(normalizeAutoDraftValue("  • Teacher-selected standard  ")).toBe("Teacher-selected standard")
    expect(shouldIgnoreAutoDraftValue("teacher-selected standard")).toBe(true)
    expect(shouldIgnoreAutoDraftValue("PDF extraction produced no readable text for file.pdf.")).toBe(true)
    expect(shouldIgnoreAutoDraftValue("RF.1.3")).toBe(false)
  })
})

describe("Materials page teacher-facing copy", () => {
  it("keeps the visible workbench language simple and classroom-facing", () => {
    const source = readFileSync("src/pages/MaterialsPage.tsx", "utf8")
    const materialRowSource = readFileSync("src/pages/components/materials/MaterialRow.tsx", "utf8")

    expect(source).toContain(
      "Upload your curriculum and exemplar files. The lesson draft fills in once they're ready."
    )
    expect(source).toContain("Upload files, review the lesson draft, then generate.")
    expect(source).toContain("Review this draft, make any quick changes, and generate when it looks right.")
    expect(source).toContain(
      "No files added yet. Upload curriculum or exemplar files above."
    )
    expect(source).toContain("Exemplar setup")
    expect(source).toContain(
      "The app auto-detects what kind of exemplar each one most likely is, and you can change it only when the guess is wrong."
    )
    expect(source).toContain("Review the standards you want in this lesson package.")
    expect(source).toContain("Lesson draft")
    expect(source).toContain("Ready to generate")
    expect(source).toContain("Add vocabulary or word examples")
    expect(source).toContain("Confirm details to continue")
    expect(source).toContain("Still preparing files")
    expect(source).toContain("Technical details")
    expect(source).toContain("Files in this lesson")
    expect(source).toContain("Open file details")
    expect(materialRowSource).toContain("What we found")
    expect(source).toContain("Words")
    expect(source).toContain("Upload curriculum files that provide the lesson content.")
    expect(source).toContain("Upload exemplar files that provide structure and presentation.")
    expect(source).toContain("Browse curriculum files")
    expect(source).toContain("Browse exemplar files")
    expect(source).toContain("File notes")
    expect(source).toContain("Quick summary")
    expect(source).toContain("Use these lesson details")
    expect(source).toContain("Reset file notes")
    expect(source).toContain("Notes here help shape the lesson draft and final materials.")
    expect(source).toContain("Extraction status")
    expect(source).toContain("This shows whether readable text came from the parser, OCR, both, or only a fallback notice.")
    expect(source).toContain("OCR status")
    expect(source).toContain("Usable for content")
    expect(materialRowSource).toContain("formatRoleLabel(material.role)")
    expect(materialRowSource).toContain("formatStatus(material.status)")
    expect(materialRowSource).toContain("getExtractionMethodLabel(material)")

    expect(source).not.toContain(
      "Lesson generation stays paused until uploads finish processing."
    )
    expect(source).not.toContain(
      "At least one material is ready to use in grounded lesson generation."
    )
    expect(source).not.toContain(
      "Status stays visible while each file moves through upload, extraction, analysis, and ready."
    )
  })
})

describe("upload lane layout helpers", () => {
  it("keeps both upload cards on a matched-height grid layout", () => {
    expect(uploadCardStyle("curriculum", false)).toMatchObject({
      display: "grid",
      gridTemplateRows: "auto auto 1fr auto",
      height: "100%",
      boxSizing: "border-box",
    })

    expect(uploadCardStyle("exemplar", false)).toMatchObject({
      display: "grid",
      gridTemplateRows: "auto auto 1fr auto",
      height: "100%",
      boxSizing: "border-box",
    })
  })

  it("keeps both drop zones at the same visual height with aligned button placement", () => {
    expect(dropZoneStyle(false)).toMatchObject({
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      minHeight: 172,
      boxSizing: "border-box",
    })
  })
})




describe("standards confirmation helpers", () => {
  it("builds clean code-based standard suggestions and drops junk chips", () => {
    const suggestions = buildSuggestedStandards(
      [
        {
          role: "curriculum",
          status: "ready",
          analysis: {
            curriculum: {
              standards: [
                "e ELA.K.F.1.3: Demonstrate phonological awareness",
                "® ELA.K.F.1.4: Read high-frequency words",
              ],
            },
            extractedText: [
              "~ phonics) Edition)",
              "ELA.K.R.2.1: Identify the main topic and key details in a text",
            ],
          },
          analysisReview: {
            standards: [],
          },
        },
      ] as never,
      {
        grade: "K",
        subject: "ELA",
        standard: "",
        skill: "Long A phonics",
        topic: "",
        duration: "",
        notes: "",
      }
    )

    expect(suggestions).toEqual([
      "ELA.K.F.1.3: Demonstrate phonological awareness",
      "ELA.K.F.1.4: Read high-frequency words",
    ])
    expect(suggestions.join(" | ")).not.toContain("Edition")
  })

  it("toggles clicked standards into and out of the confirmed standards box", () => {
    const empty = ""
    const once = toggleStandardInText(
      empty,
      "e ELA.K.F.1.3: Demonstrate phonological awareness"
    )
    expect(once).toBe("ELA.K.F.1.3: Demonstrate phonological awareness")
    expect(standardTextIncludes(once, "ELA.K.F.1.3: Demonstrate phonological awareness")).toBe(true)

    const twice = toggleStandardInText(
      once,
      "ELA.K.F.1.4: Read high-frequency words"
    )
    expect(twice).toBe(
      serializeConfirmedStandardsText([
        "ELA.K.F.1.3: Demonstrate phonological awareness",
        "ELA.K.F.1.4: Read high-frequency words",
      ])
    )

    const removed = toggleStandardInText(
      twice,
      "ELA.K.F.1.3: Demonstrate phonological awareness"
    )
    expect(removed).toBe("ELA.K.F.1.4: Read high-frequency words")
  })

  it("keeps the standards picker visible after the first standard is selected so teachers can keep adding more", () => {
    expect(
      shouldShowStandardsConfirmationCard(
        2,
        [
          "ELA.K.F.1.3: Demonstrate phonological awareness",
          "ELA.K.F.1.4: Read high-frequency words",
        ],
        "ELA.K.F.1.3: Demonstrate phonological awareness"
      )
    ).toBe(true)

    expect(
      getStandardsConfirmationHelperText(
        "ELA.K.F.1.3: Demonstrate phonological awareness; ELA.K.F.1.4: Read high-frequency words"
      )
    ).toContain("2 standards selected")
  })
})
