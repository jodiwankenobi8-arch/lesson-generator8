import type { CSSProperties } from "react"
import brickRibbon from "../assets/visual/ribbon-labels/brick-floral-stitched-ribbon-label.png"

type OrchardRibbonProps = {
  text: string
}

// Display size for the brick ribbon (source: 852×293).
// Scale to ~356px wide to fit the page header. Height follows aspect ratio.
const DISPLAY_W = 356
const DISPLAY_H = Math.round(293 * (DISPLAY_W / 852)) // ~122px

const wrapStyle: CSSProperties = {
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  alignSelf: "start",
  width: DISPLAY_W,
  height: DISPLAY_H,
  marginBottom: 8,
  // Drop shadow on the ribbon image via the img layer
}

const imgStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "fill",
  filter: "drop-shadow(0 6px 14px rgba(63, 90, 64, 0.16))",
  pointerEvents: "none",
  userSelect: "none",
}

const textStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  // Keep text within the center band of the ribbon (tails are ~15% each side)
  paddingInline: "15%",
  paddingBottom: "6%",
  color: "#FDF8EE",
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
  fontSize: 15,
  fontWeight: 700,
  lineHeight: 1.2,
  textAlign: "center",
  textShadow: "0 1px 1px rgba(55, 71, 45, 0.20)",
  userSelect: "none",
  // Prevent the text from ever spilling outside the ribbon
  maxWidth: "100%",
  overflowWrap: "break-word",
}

export function OrchardRibbon({ text }: OrchardRibbonProps) {
  return (
    <div style={wrapStyle}>
      <img
        src={brickRibbon}
        alt=""
        aria-hidden="true"
        style={imgStyle}
      />
      <span style={textStyle}>{text}</span>
    </div>
  )
}
