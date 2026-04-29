import React from "react"
import { noticeStyle } from "../../materialsPageUiHelpers"

type MaterialsGenerationStatusSectionProps = {
  visible: boolean
  mode: "idle" | "processing" | "ready"
  message: string
}

export function MaterialsGenerationStatusSection({
  visible,
  mode,
  message,
}: MaterialsGenerationStatusSectionProps) {
  if (!visible) {
    return null
  }

  return <div style={noticeStyle(mode)}>{message}</div>
}
