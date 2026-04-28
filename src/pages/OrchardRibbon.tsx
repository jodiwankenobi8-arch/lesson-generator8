import type { CSSProperties } from "react"
import { SmartWoodLabel } from "./SmartWoodLabel"

type OrchardRibbonProps = {
  text: string
}

const ribbonStyle: CSSProperties = {
  alignSelf: "start",
  marginBottom: 8,
  maxWidth: "min(430px, 100%)",
  filter: "drop-shadow(0 7px 14px rgba(63, 90, 64, 0.18))",
}

export function OrchardRibbon({ text }: OrchardRibbonProps) {
  return (
    <SmartWoodLabel
      minWidth={260}
      maxWidth="min(430px, 100%)"
      paddingInline={10}
      allowWrap={true}
      variant="default"
      style={ribbonStyle}
    >
      {text}
    </SmartWoodLabel>
  )
}