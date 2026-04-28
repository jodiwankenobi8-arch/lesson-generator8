import type { CSSProperties } from "react"
import ribbonInputsMedium from "../assets/visual/ribbon-labels/fixed-page-labels/ribbon-inputs-medium.png"
import ribbonMaterialsMedium from "../assets/visual/ribbon-labels/fixed-page-labels/ribbon-materials-medium.png"
import ribbonResultsMedium from "../assets/visual/ribbon-labels/fixed-page-labels/ribbon-results-medium.png"

type OrchardRibbonProps = {
  text: string
}

// Mapping from label text to baked-text ribbon asset
// Using "medium" variant for standard page headers (356-400px display width)
const LABEL_TO_ASSET: Record<string, string> = {
  "Planning Notebook": ribbonInputsMedium,
  "Source Workbench": ribbonMaterialsMedium,
  "Planning Binder": ribbonResultsMedium,
}

// Display dimensions for medium variant ribbons
// Source: 856×345, scaled to responsive width
const DISPLAY_W = 356 // ~356px for desktop, responsive on mobile
const DISPLAY_H = Math.round(345 * (DISPLAY_W / 856)) // ~143px

const wrapStyle: CSSProperties = {
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  alignSelf: "start",
  // Responsive width: use max 356px on desktop, scale down on narrow screens
  width: "min(100%, 356px)",
  height: "auto",
  aspectRatio: "856 / 345",
  marginBottom: 8,
  // Role and aria-label provided dynamically
}

const imgStyle: CSSProperties = {
  position: "relative",
  display: "block",
  width: "100%",
  height: "auto",
  filter: "drop-shadow(0 6px 14px rgba(63, 90, 64, 0.16))",
  pointerEvents: "none",
  userSelect: "none",
}

export function OrchardRibbon({ text }: OrchardRibbonProps) {
  // Get the appropriate baked-text ribbon asset for this label
  const ribbonAsset = LABEL_TO_ASSET[text] || ribbonInputsMedium

  return (
    <div
      style={wrapStyle}
      role="img"
      aria-label={text}
    >
      <img
        src={ribbonAsset}
        alt=""
        aria-hidden="true"
        style={imgStyle}
      />
    </div>
  )
}
