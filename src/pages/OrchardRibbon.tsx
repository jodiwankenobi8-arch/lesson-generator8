import type { CSSProperties } from "react"
import ribbonSrc from "../assets/visual/ribbon-labels/green-floral-stitched-ribbon-label.png"

type OrchardRibbonProps = {
  text: string
}

const wrapStyle: CSSProperties = {
  position: "relative",
  display: "inline-flex",
  alignSelf: "start",
  alignItems: "center",
  justifyContent: "center",
  width: "min(430px, 100%)",
  minWidth: 260,
  aspectRatio: "703 / 145",
  marginBottom: 8,
  overflow: "visible",
  filter: "drop-shadow(0 7px 14px rgba(63, 90, 64, 0.18))",
}

const artStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage: `url(${ribbonSrc})`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundSize: "contain",
  pointerEvents: "none",
}

const textFrameStyle: CSSProperties = {
  position: "relative",
  zIndex: 1,
  width: "100%",
  minHeight: 58,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxSizing: "border-box",
  padding: "0 72px 0 92px",
  pointerEvents: "none",
}

const textStyle: CSSProperties = {
  color: "#FFF9EF",
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
  fontSize: 15,
  fontWeight: 800,
  letterSpacing: 0.1,
  lineHeight: 1.1,
  textAlign: "center",
  whiteSpace: "nowrap",
  textShadow: "0 1px 2px rgba(44, 60, 34, 0.34)",
  userSelect: "none",
  transform: "translateY(-1px)",
}

export function OrchardRibbon({ text }: OrchardRibbonProps) {
  return (
    <div style={wrapStyle}>
      <div style={artStyle} aria-hidden="true" />
      <span style={textFrameStyle}>
        <span style={textStyle}>{text}</span>
      </span>
    </div>
  )
}