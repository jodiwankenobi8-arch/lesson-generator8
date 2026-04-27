import React, { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  SUPPORTED_SOURCE_UPLOAD_ACCEPT,
  SUPPORTED_SOURCE_UPLOAD_FORMATS_TEXT,
} from "../engine/materials/sourceIntakeContract"
import {
  ExemplarInfluenceTarget,
  ExemplarStyleSettings,
  LessonInputs,
  MaterialAnalysisReview,
  MaterialFile,
  MaterialRole,
  MaterialStatus,
} from "../engine/types"
import {
  orchardButtonStyle,
  orchardCardStyle,
  orchardNoticeStyle,
  orchardPageShellStyle,
  orchardSoftCardStyle,
  orchardStatusBadgeStyle,
  orchardTagStyle,
} from "./orchardUi"
import { OrchardPageHeader } from "./OrchardPageHeader"
import {
  buildUploadSourceMetadata,
  getTeacherVisibleMaterialNote,
  inferMimeTypeFromName,
  isSupportedUploadFile,
} from "./materialsPageUploadHelpers"
import {
  buttonStyle,
  dropZoneStyle,
  formatRoleLabel,
  formatStatus,
  miniTagStyle,
  noticeStyle,
  primaryButtonStyle,
  roleBadgeStyle,
  secondaryButtonStyle,
  statusBadgeStyle,
  uploadCardStyle,
} from "./materialsPageUiHelpers"
import { getDefaultExemplarStyleSettings } from "./materialsPageExemplarHelpers"
import {
  normalizeAndDedupeStandards,
  normalizeStandardValue,
  serializeStandardsText,
  standardTextIncludes,
  toggleStandardInText,
} from "../engine/shared/standards"
import { filterStandardsForPrimaryTarget } from "../engine/shared/teacherFacingContent"
import { buildCompactInferredMaterialReview } from "../engine/materials/buildCompactInferredMaterialReview"

export {
  buildUploadSourceMetadata,
  getTeacherVisibleMaterialNote,
  inferMimeTypeFromName,
  isSupportedUploadFile,
}
import { useLessonStore } from "../state/useLessonStore"

const pageStyle: React.CSSProperties = {
  ...orchardPageShellStyle,
  maxWidth: 980,
  margin: "0 auto",
}

const introStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: 16,
  maxWidth: 760,
  margin: 0,
  lineHeight: 1.6,
}

const cardStyle: React.CSSProperties = {
  ...orchardCardStyle,
}

const uploadGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  alignItems: "stretch",
  gap: "var(--space-md)",
  marginBottom: "var(--space-lg)",
}

const summaryGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: "var(--space-sm)",
  marginBottom: "var(--space-md)",
}

const hiddenInputStyle: React.CSSProperties = {
  display: "none",
}

const listStyle: React.CSSProperties = {
  display: "grid",
  gap: 12,
}

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "var(--space-md)",
  padding: "14px 0",
  borderTop: "1px solid var(--border-paper)",
}

const laneMetaStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  flexWrap: "nowrap",
  minHeight: 28,
}

const laneHeaderStyle: React.CSSProperties = {
  display: "grid",
  alignContent: "start",
  gap: 6,
  minHeight: 76,
}

const laneTitleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 0,
  color: "var(--orchard-green)",
}

const laneBodyStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  marginTop: 0,
  marginBottom: 0,
  lineHeight: 1.5,
}

const laneSupportTextStyle: React.CSSProperties = {
  marginTop: 0,
  color: "var(--text-secondary)",
  fontSize: 13,
  lineHeight: 1.5,
}

const dragPromptStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
  textAlign: "center",
}

const dragPromptTitleStyle: React.CSSProperties = {
  fontWeight: 700,
  color: "var(--deep-orchard)",
}

const dragPromptBodyStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: 13,
}

const materialMetaStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 6,
}

const materialStatusTextStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: 13,
  lineHeight: 1.5,
  textAlign: "right",
}

const helperTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: "var(--text-secondary)",
}

const errorTextStyle: React.CSSProperties = {
  fontSize: 13,
  color: "var(--cranberry)",
}

const exemplarControlCardStyle: React.CSSProperties = {
  marginTop: 10,
  padding: 12,
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border-paper)",
  background: "rgba(255,255,255,0.78)",
  display: "grid",
  gap: 10,
  justifyItems: "stretch",
}

const exemplarOptionListStyle: React.CSSProperties = {
  display: "grid",
  gap: 8,
}

const exemplarCheckboxGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 8,
}

const exemplarLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 8,
  color: "var(--text-primary)",
  fontSize: 13,
  lineHeight: 1.4,
}

const exemplarSubtleTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "var(--text-secondary)",
  lineHeight: 1.5,
}

const exemplarTextareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 72,
  resize: "vertical",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-paper)",
  padding: "10px 12px",
  font: "inherit",
  color: "var(--text-primary)",
  background: "rgba(255,255,255,0.94)",
  boxSizing: "border-box",
}

const reviewCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: 14,
  marginLeft: 0,
  display: "grid",
  gap: 12,
  border: "1px solid var(--border-honey)",
  background: "rgba(242, 192, 120, 0.12)",
}

const reviewHeaderRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
  flexWrap: "wrap",
}

const reviewFieldGridStyle: React.CSSProperties = {
  display: "grid",
  gap: 10,
}

const reviewFieldLabelStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
  fontSize: 12,
  color: "var(--text-secondary)",
}

const reviewActionRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
}

const extractionDebugCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: 14,
  marginLeft: 0,
  display: "grid",
  gap: 10,
  border: "1px solid var(--border-paper)",
  background: "rgba(255,255,255,0.82)",
}

const extractionDebugGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 10,
}

const extractionDebugLabelStyle: React.CSSProperties = {
  fontSize: 12,
  color: "var(--text-secondary)",
  display: "grid",
  gap: 4,
}

const extractionDebugValueStyle: React.CSSProperties = {
  fontSize: 14,
  color: "var(--text-primary)",
  fontWeight: 600,
}

const extractionDebugListStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: 18,
  display: "grid",
  gap: 6,
  color: "var(--text-secondary)",
  fontSize: 13,
  lineHeight: 1.45,
}

const standardsCardStyle: React.CSSProperties = {
  marginTop: 12,
  padding: 14,
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--border-honey)",
  background: "rgba(242, 192, 120, 0.16)",
  display: "grid",
  gap: 10,
}

const standardsTagRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
}

const standardsInputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 82,
  resize: "vertical",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-paper)",
  padding: "10px 12px",
  font: "inherit",
  color: "var(--text-primary)",
  background: "rgba(255,255,255,0.96)",
  boxSizing: "border-box",
}

const standardsLabelStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
  fontSize: 12,
  color: "var(--text-secondary)",
}

const quickDraftCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: 18,
  display: "grid",
  gap: 14,
  border: "1px solid var(--border-moss)",
  background: "rgba(110, 139, 107, 0.08)",
}

const draftSummaryGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 10,
}

const draftSummaryCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: 12,
  display: "grid",
  gap: 6,
  background: "rgba(255,255,255,0.88)",
  border: "1px solid var(--border-paper)",
}

const draftSupportRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  alignItems: "center",
}

const draftFooterStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  paddingTop: 4,
}

const quietDetailsSummaryStyle: React.CSSProperties = {
  cursor: "pointer",
  fontSize: 13,
  color: "var(--text-secondary)",
  userSelect: "none",
}

const filesSectionStyle: React.CSSProperties = {
  ...cardStyle,
  marginTop: "var(--space-md)",
  padding: 0,
  overflow: "hidden",
}

const filesDetailsStyle: React.CSSProperties = {
  display: "grid",
  gap: 0,
}

const filesSummaryStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
  padding: "16px 18px",
  cursor: "pointer",
  userSelect: "none",
}

const filesBodyStyle: React.CSSProperties = {
  display: "grid",
  gap: 12,
  padding: "0 18px 18px",
}

type ReviewListKey = Exclude<keyof MaterialAnalysisReview, "teacherSummary">

type ReviewFieldConfig = {
  key: ReviewListKey
  label: string
  help: string
  placeholder: string
}

const CURRICULUM_REVIEW_FIELDS: ReviewFieldConfig[] = [
  {
    key: "standards",
    label: "Standards",
    help: "One per line. Confirm or correct the standards this curriculum material should contribute.",
    placeholder: "Example:\nELA.K.F.1.3: Demonstrate phonological awareness\nELA.K.F.1.4: Read high-frequency words",
  },
  {
    key: "instructionalTargets",
    label: "Instructional targets",
    help: "One per line. Keep the clearest lesson targets this curriculum source should drive.",
    placeholder: "Example:\nRead CVCe words with long A\nBlend and read target words accurately",
  },
  {
    key: "vocabulary",
    label: "Vocabulary",
    help: "One per line. Keep the student-facing or academic vocabulary worth carrying into the lesson.",
    placeholder: "Example:\nlong a\nsilent e\nvowel pattern",
  },
  {
    key: "wordLists",
    label: "Word list / examples",
    help: "One per line. Keep the words, examples, or item sets this lesson should actually use.",
    placeholder: "Example:\ncake\ngame\nlake\nname",
  },
  {
    key: "texts",
    label: "Texts / topic",
    help: "One per line. Use this for decodable passages, read-aloud texts, topics, or unit text references.",
    placeholder: "Example:\nDecodable text with long A words\nTarget topic or read-aloud",
  },
  {
    key: "practiceIdeas",
    label: "Practice ideas",
    help: "One per line. Keep the practice tasks this material should shape.",
    placeholder: "Example:\nBlend and sort long A words\nGuided word reading with teacher support",
  },
]

const EXEMPLAR_REVIEW_FIELDS: ReviewFieldConfig[] = [
  {
    key: "exemplarStructure",
    label: "Reusable structure",
    help: "One per line. Keep the routines, pacing moves, or shell structure that should carry forward.",
    placeholder: "Example:\nOpening\nModel / Teach\nGuided Practice\nClosure / Check",
  },
]

export function parseReviewList(value: string): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  value
    .split(/[\n;]+/)
    .map((item) =>
      item
        .replace(/^[\s*•\-–—]+/, "")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter(Boolean)
    .forEach((item) => {
      const key = item.toLowerCase()
      if (seen.has(key)) return
      seen.add(key)
      result.push(item)
    })

  return result
}

export function serializeReviewList(values: string[] = []): string {
  return values.join("\n")
}

export function normalizeAutoDraftValue(value: string): string {
  return String(value ?? "")
    .replace(/^[\s*•\-–—]+/, "")
    .replace(/\s+/g, " ")
    .trim()
}

export function shouldIgnoreAutoDraftValue(value: string): boolean {
  const normalized = normalizeAutoDraftValue(value).toLowerCase()
  if (!normalized) {
    return true
  }

  const ignoredExactValues = new Set([
    "teacher-selected standard",
    "lesson target",
    "key vocabulary",
    "curriculum-aligned practice task",
    "teacher prompt",
    "clear instructional tone",
    "no grounded standard identified yet",
  ])

  if (ignoredExactValues.has(normalized)) {
    return true
  }

  return (
    normalized.startsWith("pdf extraction produced no readable text") ||
    normalized.startsWith("docx extraction produced no readable text") ||
    normalized.startsWith("pptx extraction produced no readable text") ||
    normalized.includes("may be image-based") ||
    normalized.includes("password-protected") ||
    normalized.includes("unsupported embedded text encoding")
  )
}

function sanitizeAutoDraftValues(values: string[] = []): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  values
    .map(normalizeAutoDraftValue)
    .filter(Boolean)
    .forEach((value) => {
      const key = value.toLowerCase()
      if (seen.has(key) || shouldIgnoreAutoDraftValue(value)) {
        return
      }

      seen.add(key)
      result.push(value)
    })

  return result
}

function formatSummaryParts(parts: string[]): string {
  if (parts.length <= 1) {
    return parts[0] ?? ""
  }

  if (parts.length === 2) {
    return `${parts[0]} and ${parts[1]}`
  }

  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`
}

function buildTeacherFacingDraftSummary(
  material: MaterialFile,
  draft: MaterialAnalysisReview
): string {
  if (material.role === "curriculum") {
    const parts: string[] = []

    if (draft.standards.length > 0 || draft.instructionalTargets.length > 0) {
      parts.push("lesson focus")
    }
    if (draft.vocabulary.length > 0) {
      parts.push("vocabulary")
    }
    if (draft.texts.length > 0) {
      parts.push("texts or topics")
    }
    if (draft.practiceIdeas.length > 0) {
      parts.push("practice tasks")
    }

    if (parts.length === 0) {
      return "This curriculum material is still processing. Review it before generating."
    }

    return `Ready to use for content: ${formatSummaryParts(parts)}.`
  }

  if (draft.exemplarStructure.length === 0) {
    return "Review and confirm the structure this exemplar provides."
  }

  const preview = draft.exemplarStructure.slice(0, 2)
  if (preview.length === 1) {
    return `Ready to use for structure: ${preview[0]}.`
  }

  return `Ready to use for structure: ${preview[0]}, ${preview[1]}.`
}

export function buildMaterialAnalysisReviewDraft(
  material: MaterialFile
): MaterialAnalysisReview | null {
  if (!material.analysis) {
    return null
  }

  const curriculum = material.analysis.curriculum
  const exemplar = material.analysis.exemplar

  const draft = {
    standards: sanitizeAutoDraftValues(curriculum?.standards ?? []),
    vocabulary: sanitizeAutoDraftValues(curriculum?.vocabulary ?? []),
    wordLists: sanitizeAutoDraftValues([...(curriculum?.wordLists ?? []), ...(curriculum?.examples ?? [])]),
    instructionalTargets: sanitizeAutoDraftValues(curriculum?.instructionalTargets ?? []),
    texts: sanitizeAutoDraftValues(curriculum?.texts ?? []),
    practiceIdeas: sanitizeAutoDraftValues(curriculum?.practiceTasks ?? []),
    exemplarStructure: sanitizeAutoDraftValues(exemplar?.reusableStructure ?? []),
    teacherSummary: "",
  }

  return draft
}

export default function MaterialsPage() {
  const navigate = useNavigate()
  const [isNarrowViewport, setIsNarrowViewport] = useState(() => {
    if (typeof window === "undefined") {
      return false
    }

    return window.matchMedia("(max-width: 900px)").matches
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [draggingRole, setDraggingRole] = useState<MaterialRole | null>(null)
  const [compactEditMode, setCompactEditMode] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const mediaQuery = window.matchMedia("(max-width: 900px)")
    const handleViewportChange = () => setIsNarrowViewport(mediaQuery.matches)

    handleViewportChange()

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleViewportChange)
      return () => mediaQuery.removeEventListener("change", handleViewportChange)
    }

    mediaQuery.addListener(handleViewportChange)
    return () => mediaQuery.removeListener(handleViewportChange)
  }, [])

  const inputs = useLessonStore((state) => state.inputs)
  const setInputs = useLessonStore((state) => state.setInputs)
  const materials = useLessonStore((state) => state.materials)
  const addMaterial = useLessonStore((state) => state.addMaterial)
  const setMaterialSource = useLessonStore((state) => state.setMaterialSource)
  const setMaterialAnalysisReview = useLessonStore(
    (state) => state.setMaterialAnalysisReview
  )
  const removeMaterial = useLessonStore((state) => state.removeMaterial)
  const processMaterial = useLessonStore((state) => state.processMaterial)
  const setMaterialStyleSettings = useLessonStore((state) => state.setMaterialStyleSettings)
  const generateLesson = useLessonStore((state) => state.generateLesson)
  const counts = useLessonStore((state) => state.getMaterialCounts)()
  const hasProcessingMaterials = useLessonStore((state) => state.hasProcessingMaterials)()
  const hasUsableMaterialsForGeneration = useLessonStore(
    (state) => state.hasUsableMaterialsForGeneration
  )()
  const generationReadinessMessage = useLessonStore(
    (state) => state.getGenerationReadinessMessage
  )()
  const hasRequiredInputs = useLessonStore((state) => state.hasRequiredInputs)()
  const canGenerate = useLessonStore((state) => state.canGenerate)()
  const suggestedStandards = useMemo(
    () => buildSuggestedStandards(materials, inputs),
    [materials, inputs]
  )
  const confirmedStandards = useMemo(() => normalizeAndDedupeStandards([inputs.standard]), [inputs.standard])
  const needsStandardsConfirmation = confirmedStandards.length === 0
  const confirmedStandardsCount = confirmedStandards.length
  const showStandardsConfirmationCard = useMemo(
    () => shouldShowStandardsConfirmationCard(materials.length, suggestedStandards, inputs.standard),
    [materials.length, suggestedStandards, inputs.standard]
  )
  const hasCurriculumReadinessBlocker = Boolean(generationReadinessMessage)
  const generateBlocked =
    !canGenerate || isGenerating || needsStandardsConfirmation || hasCurriculumReadinessBlocker

  const primaryCurriculumMaterial = useMemo(
    () =>
      materials.find(
        (material) =>
          material.role === "curriculum" && material.status === "ready" && Boolean(material.analysis)
      ) ?? null,
    [materials]
  )
  const primaryExemplarMaterial = useMemo(
    () =>
      materials.find(
        (material) =>
          material.role === "exemplar" && material.status === "ready" && Boolean(material.analysis)
      ) ?? null,
    [materials]
  )

  const primaryCurriculumReview = useMemo(() => {
    if (!primaryCurriculumMaterial) {
      return null
    }

    return primaryCurriculumMaterial.analysisReview ?? buildCompactInferredMaterialReview(primaryCurriculumMaterial, inputs)
  }, [primaryCurriculumMaterial, inputs])

  const primaryExemplarReview = useMemo(() => {
    if (!primaryExemplarMaterial) {
      return null
    }

    return primaryExemplarMaterial.analysisReview ?? buildCompactInferredMaterialReview(primaryExemplarMaterial, inputs)
  }, [primaryExemplarMaterial, inputs])

  const additionalReadyCurriculumCount = useMemo(
    () =>
      materials.filter(
        (material) =>
          material.role === "curriculum" && material.status === "ready" && Boolean(material.analysis)
      ).length - (primaryCurriculumMaterial ? 1 : 0),
    [materials, primaryCurriculumMaterial]
  )

  const additionalReadyExemplarCount = useMemo(
    () =>
      materials.filter(
        (material) =>
          material.role === "exemplar" && material.status === "ready" && Boolean(material.analysis)
      ).length - (primaryExemplarMaterial ? 1 : 0),
    [materials, primaryExemplarMaterial]
  )

  const updatePrimaryCurriculumReviewField = (key: ReviewListKey, value: string) => {
    if (!primaryCurriculumMaterial || !primaryCurriculumReview) {
      return
    }

    setMaterialAnalysisReview(primaryCurriculumMaterial.id, {
      ...primaryCurriculumReview,
      [key]: parseReviewList(value),
    })
  }

  const updatePrimaryExemplarReviewField = (key: ReviewListKey, value: string) => {
    if (!primaryExemplarMaterial || !primaryExemplarReview) {
      return
    }

    setMaterialAnalysisReview(primaryExemplarMaterial.id, {
      ...primaryExemplarReview,
      [key]: parseReviewList(value),
    })
  }

  const curriculumInputRef = useRef<HTMLInputElement | null>(null)
  const exemplarInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    materials.forEach((material) => {
      if (material.role !== "exemplar" || material.status !== "ready" || !material.analysis) {
        return
      }

      const detectedTarget = inferExemplarTarget(material)
      const settings = getDefaultExemplarStyleSettings(material.styleSettings)
      const currentTarget = settings.targets[0] ?? "shared"
      const shouldAutoRoute =
        !material.styleSettings ||
        settings.targets.length === 0 ||
        currentTarget === "shared"

      if (shouldAutoRoute && (settings.targets.length !== 1 || currentTarget !== detectedTarget)) {
        setMaterialStyleSettings(material.id, {
          ...settings,
          targets: [detectedTarget],
        })
      }
    })
  }, [materials, setMaterialStyleSettings])

  const laneCounts = useMemo(
    () => ({
      curriculum: materials.filter((material) => material.role === "curriculum").length,
      exemplar: materials.filter((material) => material.role === "exemplar").length,
    }),
    [materials]
  )

  async function handleFilesAdded(role: MaterialRole, files: File[]) {
    setGenerationError(null)

    const existingNames = new Set(
      useLessonStore
        .getState()
        .materials.filter((material) => material.role === role)
        .map((material) => material.name.trim().toLowerCase())
    )
    const acceptedUploads: Array<{
      file: File
      id: string
      sourceMetadata: ReturnType<typeof buildUploadSourceMetadata>
    }> = []

    for (const file of files) {
      if (!isSupportedUploadFile(file)) {
        setGenerationError(
          `"${file.name}" is not supported here. Materials currently accepts ${SUPPORTED_SOURCE_UPLOAD_FORMATS_TEXT}.`
        )
        continue
      }

      const normalizedName = file.name.trim().toLowerCase()

      if (existingNames.has(normalizedName)) {
        setGenerationError(`"${file.name}" is already added in ${role} materials.`)
        continue
      }

      existingNames.add(normalizedName)

      const sourceMetadata = buildUploadSourceMetadata(file)
      const id = addMaterial(role, file.name, sourceMetadata)

      acceptedUploads.push({
        file,
        id,
        sourceMetadata,
      })
    }

    await Promise.all(
      acceptedUploads.map(async ({ file, id, sourceMetadata }) => {
        try {
          const fileBuffer = await file.arrayBuffer()
          const fileContent = shouldCapturePlainText(file.name) ? await file.text() : null

          setMaterialSource(id, {
            fileBuffer,
            fileContent,
            ...sourceMetadata,
          })

          void processMaterial(id)
        } catch (error) {
          const store = useLessonStore.getState()
          const message = error instanceof Error ? error.message : "Unable to read uploaded file"
          store.setMaterialError(id, message)
        }
      })
    )
  }

  function handleFilesSelected(role: MaterialRole, event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    void handleFilesAdded(role, files)
    event.target.value = ""
  }

  function handleDrop(role: MaterialRole, event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDraggingRole(null)
    const files = Array.from(event.dataTransfer.files ?? [])
    if (files.length === 0) return
    void handleFilesAdded(role, files)
  }

  async function handleGenerateLesson() {
    if (isGenerating) {
      return
    }

    if (needsStandardsConfirmation) {
      setGenerationError("Confirm at least one standard before generating.")
      return
    }

    if (generationReadinessMessage) {
      setGenerationError(generationReadinessMessage)
      return
    }

    if (!canGenerate) {
      return
    }

    try {
      setIsGenerating(true)
      setGenerationError(null)
      await generateLesson()
      navigate("/results")
    } catch (error) {
      setGenerationError(
        error instanceof Error ? error.message : "Unknown lesson generation error"
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const processingCount = counts.uploaded + counts.extracting + counts.analyzing
  const contentAnchorBlocker =
    hasCurriculumReadinessBlocker &&
    Boolean(generationReadinessMessage?.includes("concrete word examples"))
  const lessonDraftStatusText =
    primaryCurriculumReview || primaryExemplarReview
      ? "Review this draft, make any quick changes, and generate when it looks right."
      : "Add a ready curriculum file to fill the lesson draft."
  const generationHelperText = !hasRequiredInputs
    ? "Finish the lesson basics on Inputs first."
    : hasProcessingMaterials
      ? `Wait for ${processingCount} file${processingCount === 1 ? "" : "s"} to finish.`
      : needsStandardsConfirmation
        ? "Check at least one standard before generating."
        : contentAnchorBlocker
          ? "Add vocabulary or word examples to the lesson draft, then generate."
          : generationReadinessMessage
            ? generationReadinessMessage
            : !hasUsableMaterialsForGeneration
              ? "Add at least one ready file before generating."
              : "Ready to generate."
  const standardsSummaryLabel = needsStandardsConfirmation
    ? "Standards to confirm"
    : `Standards (${confirmedStandardsCount} selected)`

  const draftReadinessState: "ready" | "needs_standards" | "needs_review" | "processing" | "idle" =
    hasProcessingMaterials
      ? "processing"
      : !primaryCurriculumReview && !primaryExemplarReview
        ? "idle"
        : hasCurriculumReadinessBlocker
          ? "needs_review"
          : needsStandardsConfirmation
            ? "needs_standards"
            : "ready"

  const draftReadinessLabel =
    draftReadinessState === "ready"
      ? "Ready to generate"
      : draftReadinessState === "needs_standards"
        ? "Confirm standards to continue"
        : draftReadinessState === "needs_review"
          ? contentAnchorBlocker
            ? "Add vocabulary or word examples"
            : "Confirm details to continue"
          : draftReadinessState === "processing"
            ? "Still preparing files"
            : "Upload a file to get started"

  const draftReadinessTagColor: Parameters<typeof orchardTagStyle>[0] =
    draftReadinessState === "ready" ? "moss" : draftReadinessState === "processing" ? "neutral" : "honey"

  return (
    <div style={pageStyle}>
      <OrchardPageHeader label="Source Workbench" title="Materials" introMaxWidth={760}>
        <p style={introStyle}>
          Upload your curriculum and exemplar files. The lesson draft fills in once they're ready.
          Supports {SUPPORTED_SOURCE_UPLOAD_FORMATS_TEXT}.
        </p>
      </OrchardPageHeader>

      <input
        ref={curriculumInputRef}
        type="file"
        multiple
        accept={SUPPORTED_SOURCE_UPLOAD_ACCEPT}
        onChange={(event) => handleFilesSelected("curriculum", event)}
        style={hiddenInputStyle}
      />

      <input
        ref={exemplarInputRef}
        type="file"
        multiple
        accept={SUPPORTED_SOURCE_UPLOAD_ACCEPT}
        onChange={(event) => handleFilesSelected("exemplar", event)}
        style={hiddenInputStyle}
      />

      <div
        style={{
          ...uploadGridStyle,
          gridTemplateColumns: isNarrowViewport ? "minmax(0, 1fr)" : uploadGridStyle.gridTemplateColumns,
          gap: isNarrowViewport ? "var(--space-lg)" : uploadGridStyle.gap,
        }}
      >
        <UploadLaneCard
          role="curriculum"
          title="Curriculum"
          authorityLabel="Content authority"
          description="Upload curriculum files that provide the lesson content."
          count={laneCounts.curriculum}
          dragging={draggingRole === "curriculum"}
          onBrowse={() => curriculumInputRef.current?.click()}
          onDragStateChange={(active) => setDraggingRole(active ? "curriculum" : null)}
          onDrop={(event) => handleDrop("curriculum", event)}
        />

        <UploadLaneCard
          role="exemplar"
          title="Exemplar"
          authorityLabel="Presentation authority"
          description="Upload exemplar files that provide structure and presentation."
          count={laneCounts.exemplar}
          dragging={draggingRole === "exemplar"}
          onBrowse={() => exemplarInputRef.current?.click()}
          onDragStateChange={(active) => setDraggingRole(active ? "exemplar" : null)}
          onDrop={(event) => handleDrop("exemplar", event)}
        />
      </div>

      <div style={{ ...cardStyle, marginTop: "var(--space-md)" }}>
        {(hasProcessingMaterials || (!primaryCurriculumReview && !primaryExemplarReview)) ? (
          <div
            style={noticeStyle(
              hasProcessingMaterials
                ? "processing"
                : hasUsableMaterialsForGeneration
                  ? "ready"
                  : "idle"
            )}
          >
            {hasProcessingMaterials
              ? `Processing ${processingCount} file${processingCount === 1 ? "" : "s"}.`
              : "Upload files, review the lesson draft, then generate."}
          </div>
        ) : null}

        <div style={{ display: "grid", gap: 10, marginTop: hasProcessingMaterials || (!primaryCurriculumReview && !primaryExemplarReview) ? "var(--space-sm)" : 0 }}>
          {primaryCurriculumReview || primaryExemplarReview ? (
            <div style={quickDraftCardStyle}>
              <div style={reviewHeaderRowStyle}>
                <div style={{ display: "grid", gap: 6 }}>
                  <div style={{ fontWeight: 700, color: "var(--deep-orchard)", fontSize: 14 }}>
                    Lesson draft
                  </div>
                  <div style={exemplarSubtleTextStyle}>{lessonDraftStatusText}</div>
                </div>
                {!compactEditMode ? (
                  <button
                    type="button"
                    onClick={() => setCompactEditMode(true)}
                    style={secondaryButtonStyle()}
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCompactEditMode(false)}
                    style={secondaryButtonStyle()}
                  >
                    Done editing
                  </button>
                )}
              </div>

              <div style={draftSupportRowStyle}>
                <span style={orchardTagStyle(draftReadinessTagColor)}>{draftReadinessLabel}</span>
              </div>

              {primaryCurriculumMaterial || primaryExemplarMaterial ? (
                <div style={draftSummaryGridStyle}>
                  {primaryCurriculumMaterial && primaryCurriculumReview ? (
                    <div style={draftSummaryCardStyle}>
                      <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 13 }}>Content</div>
                      <div style={exemplarSubtleTextStyle}>
                        {buildTeacherFacingDraftSummary(primaryCurriculumMaterial, primaryCurriculumReview)}
                      </div>
                      <div style={exemplarSubtleTextStyle}>
                        From {primaryCurriculumMaterial.name}{additionalReadyCurriculumCount > 0 ? ` (+${additionalReadyCurriculumCount} more ready)` : ""}
                      </div>
                    </div>
                  ) : null}
                  {primaryExemplarMaterial && primaryExemplarReview ? (
                    <div style={draftSummaryCardStyle}>
                      <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 13 }}>Structure</div>
                      <div style={exemplarSubtleTextStyle}>
                        {buildTeacherFacingDraftSummary(primaryExemplarMaterial, primaryExemplarReview)}
                      </div>
                      <div style={exemplarSubtleTextStyle}>
                        From {primaryExemplarMaterial.name}{additionalReadyExemplarCount > 0 ? ` (+${additionalReadyExemplarCount} more ready)` : ""}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {!compactEditMode ? (
                <div style={{ display: "grid", gap: 10 }}>
                  {primaryCurriculumReview ? (
                    <>
                      <CompactFieldDisplay label="Vocabulary" items={primaryCurriculumReview.vocabulary ?? []} />
                      <CompactFieldDisplay label="Words" items={primaryCurriculumReview.wordLists ?? []} />
                      <CompactFieldDisplay label="Texts / topic" items={primaryCurriculumReview.texts ?? []} />
                      <CompactFieldDisplay label="Practice" items={primaryCurriculumReview.practiceIdeas ?? []} />
                    </>
                  ) : null}
                  {primaryExemplarReview && (primaryExemplarReview.exemplarStructure ?? []).length > 0 ? (
                    <CompactFieldDisplay label="Structure" items={primaryExemplarReview.exemplarStructure} />
                  ) : null}
                  {!primaryCurriculumReview && !((primaryExemplarReview?.exemplarStructure ?? []).length > 0) ? (
                    <div style={exemplarSubtleTextStyle}>No lesson draft available yet. Upload a curriculum file to get started.</div>
                  ) : null}
                </div>
              ) : (
                <div style={{ display: "grid", gap: 10 }}>
                  {primaryCurriculumReview ? (
                    <>
                      <ReviewTextAreaField
                        label="Vocabulary"
                        help="One per line."
                        value={serializeReviewList(primaryCurriculumReview.vocabulary ?? [])}
                        onChange={(value) => updatePrimaryCurriculumReviewField("vocabulary", value)}
                        placeholder="long a&#10;silent e&#10;blend"
                      />
                      <ReviewTextAreaField
                        label="Words"
                        help="One per line."
                        value={serializeReviewList(primaryCurriculumReview.wordLists ?? [])}
                        onChange={(value) => updatePrimaryCurriculumReviewField("wordLists", value)}
                        placeholder="cake&#10;game&#10;lake"
                      />
                      <ReviewTextAreaField
                        label="Texts / topic"
                        help="One per line."
                        value={serializeReviewList(primaryCurriculumReview.texts ?? [])}
                        onChange={(value) => updatePrimaryCurriculumReviewField("texts", value)}
                        placeholder="Decodable passage for long A"
                      />
                      <ReviewTextAreaField
                        label="Practice"
                        help="One per line."
                        value={serializeReviewList(primaryCurriculumReview.practiceIdeas ?? [])}
                        onChange={(value) => updatePrimaryCurriculumReviewField("practiceIdeas", value)}
                        placeholder="Blend and sort long a words"
                      />
                    </>
                  ) : null}
                  {primaryExemplarReview ? (
                    <ReviewTextAreaField
                      label="Structure"
                      help="One per line."
                      value={serializeReviewList(primaryExemplarReview.exemplarStructure ?? [])}
                      onChange={(value) => updatePrimaryExemplarReviewField("exemplarStructure", value)}
                      placeholder="Opening&#10;Model&#10;Guided practice&#10;Closure"
                    />
                  ) : null}
                </div>
              )}

              {showStandardsConfirmationCard ? (
                <details>
                  <summary style={quietDetailsSummaryStyle}>
                    {standardsSummaryLabel}
                  </summary>
                  <div style={{ marginTop: 8 }}>
                    <StandardsConfirmationCard
                      suggestedStandards={suggestedStandards}
                      confirmedStandards={inputs.standard}
                      required={needsStandardsConfirmation}
                      onApplySuggestions={() => setInputs({ standard: serializeStandardsText(suggestedStandards) })}
                      onChange={(value) => setInputs({ standard: value })}
                      onToggleStandard={(value) =>
                        setInputs({ standard: toggleStandardInText(inputs.standard, value) })
                      }
                    />
                  </div>
                </details>
              ) : null}

              <div style={draftFooterStyle}>
                <div style={helperTextStyle}>{generationHelperText}</div>
                <button
                  type="button"
                  onClick={handleGenerateLesson}
                  disabled={generateBlocked}
                  style={primaryButtonStyle(generateBlocked)}
                >
                  {isGenerating ? "Generating..." : "Generate Lesson"}
                </button>
              </div>

              {generationError ? <div style={errorTextStyle}>{generationError}</div> : null}
            </div>
          ) : null}

          {!primaryCurriculumReview && !primaryExemplarReview && showStandardsConfirmationCard ? (
            <details>
              <summary style={quietDetailsSummaryStyle}>
                {standardsSummaryLabel}
              </summary>
              <div style={{ marginTop: 8 }}>
                <StandardsConfirmationCard
                  suggestedStandards={suggestedStandards}
                  confirmedStandards={inputs.standard}
                  required={needsStandardsConfirmation}
                  onApplySuggestions={() => setInputs({ standard: serializeStandardsText(suggestedStandards) })}
                  onChange={(value) => setInputs({ standard: value })}
                  onToggleStandard={(value) =>
                    setInputs({ standard: toggleStandardInText(inputs.standard, value) })
                  }
                />
              </div>
            </details>
          ) : null}

          {!primaryCurriculumReview && !primaryExemplarReview ? (
            <div style={draftFooterStyle}>
              <div style={helperTextStyle}>{generationHelperText}</div>
              <button
                type="button"
                onClick={handleGenerateLesson}
                disabled={generateBlocked}
                style={primaryButtonStyle(generateBlocked)}
              >
                {isGenerating ? "Generating..." : "Generate Lesson"}
              </button>
            </div>
          ) : null}

          {!primaryCurriculumReview && !primaryExemplarReview && generationError ? <div style={errorTextStyle}>{generationError}</div> : null}
        </div>
      </div>

      <div style={filesSectionStyle}>
        {materials.length === 0 ? (
          <div style={{ padding: "18px" }}>
            <p style={{ color: "var(--text-secondary)", margin: 0 }}>
              No files added yet. Upload curriculum or exemplar files above.
            </p>
          </div>
        ) : (
          <details style={filesDetailsStyle}>
            <summary style={filesSummaryStyle}>
              <span style={{ fontWeight: 700, color: "var(--orchard-green)" }}>Files in this lesson</span>
              <span style={orchardTagStyle("neutral")}>
                {counts.ready} ready
                {processingCount > 0 ? ` · ${processingCount} processing` : ""}
                {counts.error > 0 ? ` · ${counts.error} needs attention` : ""}
              </span>
            </summary>

            <div style={filesBodyStyle}>
              <div style={listStyle}>
                {materials.map((material) => (
                  <div key={material.id} style={{ display: "grid", gap: 10 }}>
                    <div style={rowStyle}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: "var(--text-primary)", wordBreak: "break-word" }}>
                          {material.name}
                        </div>

                        <div style={materialMetaStyle}>
                          <span style={roleBadgeStyle(material.role)}>{formatRoleLabel(material.role)}</span>
                          <span style={statusBadgeStyle(material.status)}>{formatStatus(material.status)}</span>
                        </div>
                      </div>

                      <div style={{ minWidth: 220, display: "grid", gap: 8, justifyItems: "end" }}>
                        <div style={materialStatusTextStyle}>{getTeacherVisibleMaterialNote(material)}</div>
                        {material.errorMessage && material.status !== "error" ? (
                          <div style={{ ...materialStatusTextStyle, color: "var(--cranberry)" }}>
                            {material.errorMessage}
                          </div>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => removeMaterial(material.id)}
                          style={secondaryButtonStyle()}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {material.role === "exemplar" || (material.status === "ready" && material.analysis) ? (
                      <details>
                        <summary style={quietDetailsSummaryStyle}>
                          Open file details
                        </summary>
                        <div style={{ display: "grid", gap: 10, marginTop: 8 }}>
                          {material.role === "exemplar" ? (
                            <SimplifiedExemplarControls
                              material={material}
                              onChange={(settings) => setMaterialStyleSettings(material.id, settings)}
                            />
                          ) : null}
                          {material.status === "ready" && material.analysis ? (
                            <>
                              <MaterialReviewEditor
                                material={material}
                                onChange={(review) => setMaterialAnalysisReview(material.id, review)}
                                onReset={() => setMaterialAnalysisReview(material.id, null)}
                              />
                              <details>
                                <summary style={quietDetailsSummaryStyle}>Technical details</summary>
                                <div style={{ marginTop: 8 }}>
                                  <MaterialExtractionStatusCard material={material} />
                                </div>
                              </details>
                            </>
                          ) : null}
                        </div>
                      </details>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </details>
        )}
      </div>

      {!isNarrowViewport ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed",
            right: 20,
            bottom: 20,
            zIndex: 20,
            border: "1px solid var(--border-honey)",
            borderRadius: "999px",
            padding: "10px 14px",
            background: "var(--paper)",
            color: "var(--deep-orchard)",
            boxShadow: "0 8px 18px rgba(36, 53, 44, 0.12)",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Return to top
        </button>
      ) : null}
    </div>
  )
}

export {
  normalizeAndDedupeStandards,
  normalizeStandardValue,
  serializeStandardsText,
  standardTextIncludes,
  toggleStandardInText,
  shouldShowStandardsConfirmationCard,
  getStandardsConfirmationHelperText,
}

function isKindergartenEla(inputs: LessonInputs): boolean {
  return inputs.grade.trim().toUpperCase() === "K" &&
    /^(ELA|reading|language arts|literacy)$/i.test(inputs.subject.trim())
}

function inferSuggestedStandardsFromInputs(inputs: LessonInputs): string[] {
  if (!isKindergartenEla(inputs)) {
    return []
  }

  const combined = `${inputs.skill} ${inputs.topic} ${inputs.notes}`.toLowerCase()
  const suggestions: string[] = []

  if (/(phonics|decode|encoding|long [aeiou]|short [aeiou]|silent e|magic e|cvce|cvc|digraph|blend|segment|vowel)/i.test(combined)) {
    suggestions.push(
      "ELA.K.F.1.3: Demonstrate phonological awareness",
      "ELA.K.F.1.4: Read high-frequency words"
    )
  }

  if (/(high frequency|sight words?|automaticity)/i.test(combined)) {
    suggestions.push(
      "ELA.K.F.1.4: Read high-frequency words"
    )
  }

  if (/(retell|character|setting|important events|story)/i.test(combined)) {
    suggestions.push(
      "ELA.K.R.3.2: Retell a text orally"
    )
  }

  if (/(informational|topic|details|main idea|key details)/i.test(combined)) {
    suggestions.push(
      "ELA.K.R.2.2: Identify the topic and details in a text"
    )
  }

  if (/(descriptive words|adjective|describe)/i.test(combined)) {
    suggestions.push(
      "ELA.K.R.3.1: Identify and explain descriptive words in text"
    )
  }

  if (/(vocabulary|categories|sort words|unfamiliar words|word meaning)/i.test(combined)) {
    suggestions.push(
      "ELA.K.V.1.2: Ask and answer questions about unfamiliar words",
      "ELA.K.V.1.3: Sort common words into categories"
    )
  }

  return normalizeAndDedupeStandards(suggestions, { requireCode: true }).slice(0, 6)
}

export function buildSuggestedStandards(materials: MaterialFile[], inputs: LessonInputs): string[] {
  const curriculumMaterials = materials.filter(
    (material) => material.role === "curriculum" && material.status === "ready" && Boolean(material.analysis)
  )

  const reviewed = sanitizeAutoDraftValues(
    curriculumMaterials.flatMap((material) => material.analysisReview?.standards ?? [])
  )
  const analyzed = sanitizeAutoDraftValues(
    curriculumMaterials.flatMap((material) => material.analysis?.curriculum?.standards ?? [])
  )
  const extracted = sanitizeAutoDraftValues(
    curriculumMaterials.flatMap((material) => material.analysis?.extractedText ?? [])
  )

  const candidates = normalizeAndDedupeStandards(
    [...reviewed, ...analyzed, ...extracted].filter(
      (value) => !shouldIgnoreAutoDraftValue(value)
    ),
    { requireCode: true }
  )
  const inferredTarget = inferRequestedStandardsTarget(inputs)
  const filteredCandidates =
    inferredTarget
      ? filterStandardsForPrimaryTarget(candidates, inferredTarget)
      : candidates

  if (filteredCandidates.length > 0) {
    return filteredCandidates.slice(0, 6)
  }

  if (candidates.length > 0) {
    return candidates.slice(0, 6)
  }

  return inferSuggestedStandardsFromInputs(inputs)
}

function inferRequestedStandardsTarget(inputs: LessonInputs): string | null {
  const combined = `${inputs.skill} ${inputs.topic} ${inputs.notes}`.toLowerCase()

  const mentionsFoundational = /(phonics|decode|encoding|long [aeiou]|short [aeiou]|silent e|magic e|cvce|cvc|digraph|blend|segment|vowel)/i.test(combined)
  const mentionsComprehension = /(retell|character|setting|important events|story|informational|topic|details|main idea|key details|author'?s purpose|comprehension)/i.test(combined)
  const mentionsVocabularyOrConversation = /(vocabulary|categories|sort words|unfamiliar words|word meaning|collaborative conversation|discussion|speaking|listening|oral language)/i.test(combined)

  if (mentionsFoundational && !mentionsComprehension && !mentionsVocabularyOrConversation) {
    return "phonics"
  }

  if (mentionsComprehension && !mentionsFoundational) {
    return "comprehension"
  }

  if (mentionsVocabularyOrConversation && !mentionsFoundational && !mentionsComprehension) {
    return "vocabulary"
  }

  return null
}

function shouldShowStandardsConfirmationCard(
  materialCount: number,
  suggestedStandards: string[],
  confirmedStandardsText: string
): boolean {
  return (
    materialCount > 0 ||
    suggestedStandards.length > 0 ||
    normalizeAndDedupeStandards([confirmedStandardsText]).length > 0
  )
}

function getStandardsConfirmationHelperText(confirmedStandardsText: string): string {
  const count = normalizeAndDedupeStandards([confirmedStandardsText]).length
  if (count === 0) {
    return "Choose at least one standard before generating. Click any standard you want to include, or type your own."
  }

  return `${count} standard${count === 1 ? "" : "s"} selected. Keep clicking standards to add or remove more, or edit the box directly.`
}

function StandardsConfirmationCard({
  suggestedStandards,
  confirmedStandards,
  required,
  onApplySuggestions,
  onChange,
  onToggleStandard,
}: {
  suggestedStandards: string[]
  confirmedStandards: string
  required: boolean
  onApplySuggestions: () => void
  onChange: (value: string) => void
  onToggleStandard: (value: string) => void
}) {
  const confirmedList = normalizeAndDedupeStandards([confirmedStandards])
  const helperText = getStandardsConfirmationHelperText(confirmedStandards)

  return (
    <div style={standardsCardStyle}>
      <div style={{ fontWeight: 700, color: "var(--deep-orchard)", fontSize: 14 }}>
        {required ? "Standards confirmation needed" : "Confirmed standards"}
      </div>
      <div style={exemplarSubtleTextStyle}>
        Review the standards you want in this lesson package. Suggested chips stay available so you can confirm more than one standard before generating.
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 13 }}>
          Suggested standards
        </div>
        {suggestedStandards.length > 0 ? (
          <div style={standardsTagRowStyle}>
            {suggestedStandards.map((standard) => {
              const selected = standardTextIncludes(confirmedStandards, standard)
              return (
                <button
                  key={standard}
                  type="button"
                  onClick={() => onToggleStandard(standard)}
                  style={{
                    ...orchardTagStyle(selected ? "moss" : "honey"),
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                  aria-pressed={selected}
                >
                  {standard}
                </button>
              )
            })}
          </div>
        ) : (
          <div style={exemplarSubtleTextStyle}>
            No reliable suggestions are available yet. Type the standard you want to use.
          </div>
        )}
      </div>

      <label style={standardsLabelStyle}>
        <span>Confirmed standards</span>
        <textarea
          value={confirmedStandards}
          onChange={(event) => onChange(event.target.value)}
          placeholder={serializeStandardsText(suggestedStandards)}
          style={standardsInputStyle}
        />
      </label>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <button
          type="button"
          onClick={onApplySuggestions}
          disabled={suggestedStandards.length === 0}
          style={secondaryButtonStyle()}
        >
          Use all suggested standards
        </button>
        {confirmedList.length > 0 ? (
          <button
            type="button"
            onClick={() => onChange("")}
            style={secondaryButtonStyle()}
          >
            Clear confirmed standards
          </button>
        ) : null}
      </div>

      <div style={exemplarSubtleTextStyle}>
        {helperText}
      </div>
    </div>
  )
}

function formatExtractionMethodLabel(value?: string): string {
  switch (value) {
    case "parser":
      return "Parser"
    case "ocr":
      return "OCR"
    case "mixed":
      return "Parser + OCR"
    case "fallback_notice":
      return "Fallback notice"
    default:
      return "Unknown"
  }
}

function formatOcrDispositionLabel(value?: string): string {
  switch (value) {
    case "not_needed":
      return "Not needed"
    case "applied":
      return "Applied"
    case "suggested":
      return "Suggested"
    case "unavailable":
      return "Unavailable"
    default:
      return "Unknown"
  }
}

function formatConfidencePercent(value?: number): string {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Unknown"
  }

  return `${Math.round(value * 100)}%`
}

function MaterialExtractionStatusCard({
  material,
}: {
  material: MaterialFile
}) {
  const metadata = material.analysis?.extractionMetadata
  const reliability = material.analysis?.reliability

  if (!metadata) {
    return null
  }

  const visibleNotes = [
    ...(metadata.notes ?? []),
    ...(reliability?.warnings ?? []),
  ]
    .map((note) => note.trim())
    .filter(Boolean)
    .filter((note, index, items) => items.findIndex((item) => item.toLowerCase() === note.toLowerCase()) === index)
    .slice(0, 5)

  return (
    <div style={extractionDebugCardStyle}>
      <div style={reviewHeaderRowStyle}>
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ fontWeight: 700, color: "var(--deep-orchard)", fontSize: 14 }}>
            Extraction status
          </div>
          <div style={exemplarSubtleTextStyle}>
            This shows whether readable text came from the parser, OCR, both, or only a fallback notice.
          </div>
        </div>
        <span style={orchardTagStyle(
          metadata.method === "ocr" || metadata.method === "mixed"
            ? "moss"
            : metadata.method === "fallback_notice"
              ? "cranberry"
              : "neutral"
        )}>
          {formatExtractionMethodLabel(metadata.method)}
        </span>
      </div>

      <div style={extractionDebugGridStyle}>
        <div style={extractionDebugLabelStyle}>
          <span>OCR status</span>
          <span style={extractionDebugValueStyle}>{formatOcrDispositionLabel(metadata.ocrDisposition)}</span>
        </div>
        <div style={extractionDebugLabelStyle}>
          <span>Extraction quality</span>
          <span style={extractionDebugValueStyle}>{metadata.quality ?? "Unknown"}</span>
        </div>
        <div style={extractionDebugLabelStyle}>
          <span>Confidence</span>
          <span style={extractionDebugValueStyle}>{formatConfidencePercent(metadata.confidence)}</span>
        </div>
        <div style={extractionDebugLabelStyle}>
          <span>Usable for content</span>
          <span style={extractionDebugValueStyle}>
            {reliability?.usableForContent ? "Yes" : "No"}
          </span>
        </div>
      </div>

      {metadata.ocrReason ? (
        <div style={exemplarSubtleTextStyle}>
          <strong>OCR reason:</strong> {metadata.ocrReason}
        </div>
      ) : null}

      {metadata.fallbackBehavior ? (
        <div style={exemplarSubtleTextStyle}>
          <strong>Fallback behavior:</strong> {metadata.fallbackBehavior}
        </div>
      ) : null}

      {visibleNotes.length > 0 ? (
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 13 }}>
            Extraction notes
          </div>
          <ul style={extractionDebugListStyle}>
            {visibleNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

const SIMPLIFIED_EXEMPLAR_TYPE_OPTIONS: Array<{
  value: ExemplarInfluenceTarget
  label: string
  help: string
}> = [
  {
    value: "lesson_slides",
    label: "Slides exemplar",
    help: "Best when this file is mainly shaping student-facing slide structure and pacing.",
  },
  {
    value: "lesson_plan",
    label: "Lesson plan exemplar",
    help: "Best when this file is mainly shaping the teacher-facing lesson plan structure.",
  },
  {
    value: "printables",
    label: "Printables exemplar",
    help: "Best when this file is mainly shaping printable pages or handouts.",
  },
  {
    value: "centers",
    label: "Centers exemplar",
    help: "Best when this file is mainly shaping centers or student-independent work.",
  },
  {
    value: "small_group",
    label: "Teacher support exemplar",
    help: "Best when this file is mainly shaping teacher-led support or small-group structure.",
  },
  {
    value: "intervention",
    label: "Intervention exemplar",
    help: "Best when this file is mainly shaping intervention support.",
  },
  {
    value: "shared",
    label: "Shared exemplar",
    help: "Use this when one exemplar should influence more than one output generally.",
  },
]

const SIMPLIFIED_EXEMPLAR_MODE_OPTIONS: Array<{
  value: "copy_closely" | "inspiration" | "custom"
  label: string
  help: string
}> = [
  {
    value: "copy_closely",
    label: "Follow this structure closely",
    help: "Stay very close to the exemplar's sequence, pacing, and shell structure.",
  },
  {
    value: "inspiration",
    label: "Follow this structure generally",
    help: "Use the exemplar as a guide without copying it step by step.",
  },
  {
    value: "custom",
    label: "Follow this structure, but use a different style",
    help: "Keep the structure while changing the visual style or wording.",
  },
]

function formatExemplarTargetLabel(value: ExemplarInfluenceTarget): string {
  return (
    SIMPLIFIED_EXEMPLAR_TYPE_OPTIONS.find((option) => option.value === value)?.label ??
    "Shared exemplar"
  )
}

function inferExemplarTarget(material: MaterialFile): ExemplarInfluenceTarget {
  const source = `${material.name} ${material.sourceLabel ?? ""} ${material.analysis?.summary ?? ""}`.toLowerCase()
  const mime = `${material.sourceMimeType ?? ""}`.toLowerCase()

  if (mime.includes("presentation") || /\b(ppt|pptx|slides|slide deck|deck)\b/.test(source)) {
    return "lesson_slides"
  }

  if (/\b(lesson plan|plan|scope|sequence)\b/.test(source)) {
    return "lesson_plan"
  }

  if (/\b(printable|worksheet|handout|practice page|cut and paste)\b/.test(source)) {
    return "printables"
  }

  if (/\b(center|centers)\b/.test(source)) {
    return "centers"
  }

  if (/\b(small group|teacher-led|reteach group|support)\b/.test(source)) {
    return "small_group"
  }

  if (/\b(intervention|intervene)\b/.test(source)) {
    return "intervention"
  }

  if (mime.includes("wordprocessingml") || mime.includes("msword")) {
    return "lesson_plan"
  }

  return "shared"
}

function getSimplifiedExemplarMode(
  settings: ExemplarStyleSettings | null | undefined
): "copy_closely" | "inspiration" | "custom" {
  const mode = settings?.mode ?? "inspiration"
  if (mode === "copy_closely" || mode === "custom") {
    return mode
  }
  return "inspiration"
}

function buildMaterialUseSummary(material: MaterialFile): string {
  if (material.role === "curriculum") {
    return "Used as the content authority for lesson focus, standards, vocabulary, word lists or examples, texts or topics, and practice."
  }

  const settings = getDefaultExemplarStyleSettings(material.styleSettings)
  const target = settings.targets[0] ?? inferExemplarTarget(material)
  return `Used primarily as the ${formatExemplarTargetLabel(target).toLowerCase()} for structure and delivery.`
}

function summarizeMaterialPreview(values: string[] = [], limit = 3): string {
  const preview = values.map((value) => value.trim()).filter(Boolean).slice(0, limit)
  if (preview.length === 0) {
    return ""
  }

  return preview.join(", ") + (values.length > limit ? ", and more" : "")
}

function buildMaterialContentSummary(
  material: MaterialFile,
  draft: MaterialAnalysisReview
): string {
  if (material.role === "curriculum") {
    const parts: string[] = []

    if (draft.standards.length > 0) {
      parts.push(`Likely standards: ${summarizeMaterialPreview(draft.standards, 2)}.`)
    }
    if (draft.instructionalTargets.length > 0) {
      parts.push(`Main lesson targets: ${summarizeMaterialPreview(draft.instructionalTargets, 2)}.`)
    }
    if (draft.vocabulary.length > 0) {
      parts.push(`Key vocabulary: ${summarizeMaterialPreview(draft.vocabulary, 3)}.`)
    }
    if ((draft.wordLists ?? []).length > 0) {
      parts.push(`Word list or examples: ${summarizeMaterialPreview(draft.wordLists ?? [], 4)}.`)
    }
    if (draft.texts.length > 0) {
      parts.push(`Texts or topics: ${summarizeMaterialPreview(draft.texts, 2)}.`)
    }
    if (draft.practiceIdeas.length > 0) {
      parts.push(`Practice it appears to use: ${summarizeMaterialPreview(draft.practiceIdeas, 2)}.`)
    }

    if (parts.length > 0) {
      return parts.join(" ")
    }

    return material.analysis?.summary?.trim() || "No clear curriculum content summary is available yet."
  }

  const exemplar = material.analysis?.exemplar
  const parts: string[] = []

  if (draft.exemplarStructure.length > 0) {
    parts.push(`Likely structure: ${summarizeMaterialPreview(draft.exemplarStructure, 4)}.`)
  }
  if (exemplar?.teacherMoves?.length) {
    parts.push(`Teacher moves: ${summarizeMaterialPreview(exemplar.teacherMoves, 2)}.`)
  }
  if (exemplar?.promptStyle?.length) {
    parts.push(`Prompt style: ${summarizeMaterialPreview(exemplar.promptStyle, 2)}.`)
  }
  if (exemplar?.pacing?.length) {
    parts.push(`Pacing cues: ${summarizeMaterialPreview(exemplar.pacing, 2)}.`)
  }

  if (parts.length > 0) {
    return parts.join(" ")
  }

  return material.analysis?.summary?.trim() || "No clear exemplar structure summary is available yet."
}

function SimplifiedExemplarControls({
  material,
  onChange,
}: {
  material: MaterialFile
  onChange: (settings: ExemplarStyleSettings) => void
}) {
  const settings = getDefaultExemplarStyleSettings(material.styleSettings)
  const detectedTarget = inferExemplarTarget(material)
  const selectedTarget = settings.targets[0] ?? detectedTarget
  const selectedMode = getSimplifiedExemplarMode(settings)

  const compactSelectStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border-paper)",
    padding: "10px 12px",
    font: "inherit",
    color: "var(--text-primary)",
    background: "rgba(255,255,255,0.96)",
    boxSizing: "border-box",
  }

  return (
    <div style={exemplarControlCardStyle}>
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ fontWeight: 700, color: "var(--deep-orchard)", fontSize: 13 }}>
          Exemplar setup
        </div>
        <div style={exemplarSubtleTextStyle}>
          You can upload multiple exemplars. The app auto-detects what kind of exemplar each one most likely is, and you can change it only when the guess is wrong.
        </div>
      </div>

      <label style={reviewFieldLabelStyle}>
        <span>Detected exemplar type</span>
        <select
          value={selectedTarget}
          onChange={(event) =>
            onChange({
              ...settings,
              targets: [event.target.value as ExemplarInfluenceTarget],
            })
          }
          style={compactSelectStyle}
        >
          {SIMPLIFIED_EXEMPLAR_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span>
          {SIMPLIFIED_EXEMPLAR_TYPE_OPTIONS.find((option) => option.value === selectedTarget)?.help}
        </span>
      </label>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 13 }}>
          Structure preference
        </div>
        <div style={exemplarOptionListStyle}>
          {SIMPLIFIED_EXEMPLAR_MODE_OPTIONS.map((option) => (
            <label key={option.value} style={exemplarLabelStyle}>
              <input
                type="radio"
                name={`simplified-exemplar-mode-${material.id}`}
                checked={selectedMode === option.value}
                onChange={() =>
                  onChange({
                    ...settings,
                    mode: option.value,
                  })
                }
              />
              <span>
                <strong>{option.label}</strong>
                <div style={exemplarSubtleTextStyle}>{option.help}</div>
              </span>
            </label>
          ))}
        </div>
      </div>

      {selectedMode === "custom" ? (
        <label style={reviewFieldLabelStyle}>
          <span>Style changes</span>
          <textarea
            value={settings.customInstructions}
            onChange={(event) =>
              onChange({
                ...settings,
                mode: "custom",
                customInstructions: event.target.value,
              })
            }
            placeholder="Example: Keep the structure and pacing, but use a calmer visual style and plainer wording."
            style={standardsInputStyle}
          />
          <span>Only describe style changes here. The structure still comes from the exemplar.</span>
        </label>
      ) : null}
    </div>
  )
}

function MaterialReviewEditor({
  material,
  onChange,
  onReset,
}: {
  material: MaterialFile
  onChange: (review: MaterialAnalysisReview) => void
  onReset: () => void
}) {
  const baseReview = buildMaterialAnalysisReviewDraft(material)
  const activeReview = material.analysisReview ?? baseReview

  if (!baseReview || !activeReview) {
    return null
  }

  const fieldConfigs =
    material.role === "curriculum"
      ? CURRICULUM_REVIEW_FIELDS
      : EXEMPLAR_REVIEW_FIELDS

  const summaryText = buildMaterialContentSummary(material, baseReview)

  const notesLabel =
    material.role === "curriculum"
      ? "Notes or change requests"
      : "Anything else to keep in mind?"
  const notesPlaceholder =
    material.role === "curriculum"
      ? "Example: Only use the phonics portion. Ignore comprehension and story-slide content."
      : "Example: Keep the pacing and shell structure, but use simpler wording."

  const updateListField = (key: ReviewListKey, value: string) => {
    onChange({
      ...activeReview,
      [key]: parseReviewList(value),
    })
  }

  const updateSummary = (value: string) => {
    onChange({
      ...activeReview,
      teacherSummary: value,
    })
  }

  return (
    <div style={reviewCardStyle}>
      <div style={reviewHeaderRowStyle}>
        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ fontWeight: 700, color: "var(--deep-orchard)", fontSize: 14 }}>
              File notes
          </div>
          <div style={exemplarSubtleTextStyle}>
              Start with the summary and notes. Open advanced options only if something needs a direct fix.
          </div>
        </div>
        <span style={orchardTagStyle(material.analysisReview ? "moss" : "neutral")}>
          {material.analysisReview ? "Teacher-edited" : "Using detected analysis"}
        </span>
      </div>

      <div
        style={{
          ...orchardSoftCardStyle,
          padding: 12,
          marginLeft: 0,
          display: "grid",
          gap: 8,
          background: "rgba(255,255,255,0.82)",
        }}
      >
        <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 13 }}>
          Quick summary
        </div>
        <div style={exemplarSubtleTextStyle}>
          {summaryText || "No readable summary is available yet."}
        </div>
        <div style={exemplarSubtleTextStyle}>
          <strong>How this will be used:</strong> {buildMaterialUseSummary(material)}
        </div>
      </div>

      <ReviewTextAreaField
        label={notesLabel}
        help="Optional. Add quick notes here if you want generation to ignore, emphasize, or adjust something."
        value={activeReview.teacherSummary}
        onChange={updateSummary}
        placeholder={notesPlaceholder}
      />

      {material.role === "curriculum" ? (
        <div
          style={{
            ...orchardSoftCardStyle,
            padding: 12,
            marginLeft: 0,
            display: "grid",
            gap: 10,
            background: "rgba(255,255,255,0.82)",
          }}
        >
          <div style={{ fontWeight: 700, color: "var(--deep-orchard)" }}>
            Use these lesson details
          </div>
          <div style={reviewFieldGridStyle}>
            {CURRICULUM_REVIEW_FIELDS.filter((field) =>
              ["vocabulary", "wordLists", "texts", "practiceIdeas"].includes(field.key)
            ).map((field) => (
              <ReviewTextAreaField
                key={field.key}
                label={field.label}
                help={field.help}
                value={serializeReviewList((activeReview[field.key] as string[]) ?? [])}
                onChange={(value) => updateListField(field.key, value)}
                placeholder={field.placeholder}
              />
            ))}
          </div>
        </div>
      ) : null}

      <details
        style={{
          ...orchardSoftCardStyle,
          padding: 12,
          marginLeft: 0,
          display: "grid",
          gap: 10,
          background: "rgba(255,255,255,0.82)",
        }}
      >
        <summary style={{ cursor: "pointer", fontWeight: 700, color: "var(--deep-orchard)" }}>
          Advanced options
        </summary>
        <div style={exemplarSubtleTextStyle}>
          Use these only when the summary and notes are not enough.
        </div>
        <div style={reviewFieldGridStyle}>
          {(material.role === "curriculum"
            ? fieldConfigs.filter((field) => !["vocabulary", "wordLists", "texts", "practiceIdeas"].includes(field.key))
            : fieldConfigs
          ).map((field) => (
            <ReviewTextAreaField
              key={field.key}
              label={field.label}
              help={field.help}
              value={serializeReviewList(activeReview[field.key] as string[])}
              onChange={(value) => updateListField(field.key, value)}
              placeholder={field.placeholder}
            />
          ))}
        </div>
      </details>

      <div style={reviewActionRowStyle}>
        <button
          type="button"
          onClick={onReset}
          disabled={!material.analysisReview}
          style={secondaryButtonStyle()}
        >
          Reset file notes
        </button>
        <div style={exemplarSubtleTextStyle}>
          Notes here help shape the lesson draft and final materials.
        </div>
      </div>
    </div>
  )
}

function ReviewTextAreaField({
  label,
  help,
  value,
  onChange,
  placeholder,
}: {
  label: string
  help: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <label style={reviewFieldLabelStyle}>
      <span>{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        style={standardsInputStyle}
      />
      <span>{help}</span>
    </label>
  )
}

function CompactFieldDisplay({ label, items }: { label: string; items: string[] }) {
  if (items.length === 0) return null
  return (
    <div style={{ display: "grid", gap: 4 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "0.02em" }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {items.map((item) => (
          <span key={item} style={{ ...orchardTagStyle("neutral"), fontSize: 13 }}>{item}</span>
        ))}
      </div>
    </div>
  )
}

function UploadLaneCard({
  role,
  title,
  authorityLabel,
  description,
  count,
  dragging,
  onBrowse,
  onDragStateChange,
  onDrop,
}: {
  role: MaterialRole
  title: string
  authorityLabel: string
  description: string
  count: number
  dragging: boolean
  onBrowse: () => void
  onDragStateChange: (active: boolean) => void
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void
}) {
  return (
    <div
      style={uploadCardStyle(role, dragging)}
      onDragEnter={(event) => {
        event.preventDefault()
        onDragStateChange(true)
      }}
      onDragOver={(event) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = "copy"
        onDragStateChange(true)
      }}
      onDragLeave={() => onDragStateChange(false)}
      onDrop={onDrop}
    >
      <div style={laneMetaStyle}>
        <span style={miniTagStyle(role)}>{authorityLabel}</span>
        <span style={orchardTagStyle("neutral")}>{count} added</span>
      </div>

      <div style={laneHeaderStyle}>
        <h3 style={laneTitleStyle}>{title}</h3>
        <p style={laneBodyStyle}>{description}</p>
      </div>

      <div style={dropZoneStyle(dragging)}>
        <div style={dragPromptStyle}>
          <div style={dragPromptTitleStyle}>
            {dragging ? "Drop files to add them" : "Drag and drop files here"}
          </div>
          <div style={dragPromptBodyStyle}>You can also browse and choose more than one file.</div>
        </div>

        <button type="button" style={buttonStyle()} onClick={onBrowse}>
          {role === "curriculum" ? "Browse curriculum files" : "Browse exemplar files"}
        </button>
      </div>

      <div style={laneSupportTextStyle}>Supports {SUPPORTED_SOURCE_UPLOAD_FORMATS_TEXT}.</div>
    </div>
  )
}

function SummaryCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div style={summaryCardStyle}>
      <div style={summaryLabelStyle}>{label}</div>
      <div style={summaryValueStyle}>{value}</div>
    </div>
  )
}

function shouldCapturePlainText(fileName: string): boolean {
  const normalized = fileName.toLowerCase()
  return normalized.endsWith(".txt") || normalized.endsWith(".html") || normalized.endsWith(".htm")
}

const summaryCardStyle: React.CSSProperties = {
  ...orchardSoftCardStyle,
  padding: 14,
}

const summaryLabelStyle: React.CSSProperties = {
  color: "var(--text-secondary)",
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: 0.4,
  marginBottom: 6,
}

const summaryValueStyle: React.CSSProperties = {
  fontFamily: "var(--font-heading)",
  fontSize: 30,
  color: "var(--orchard-green)",
}
