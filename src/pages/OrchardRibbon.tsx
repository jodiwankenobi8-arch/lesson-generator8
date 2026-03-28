import type { CSSProperties } from "react"
import ribbonSrc from "../assets/orchard/ribbon-header.png"

type OrchardRibbonProps = {
  text: string
}

const wrapStyle: CSSProperties = {
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  alignSelf: "start",
  width: 356,
  height: 72,
  marginBottom: 8,
  overflow: "hidden",
}

const artStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundImage: `url(${ribbonSrc})`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundSize: "100% auto",
  filter: "drop-shadow(0 4px 10px rgba(63,90,64,0.16))",
}

const textFrameStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingLeft: 56,
  paddingRight: 56,
  paddingTop: 0,
  boxSizing: "border-box",
  pointerEvents: "none",
}

const textStyle: CSSProperties = {
  color: "#FDF8EE",
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
  fontSize: 15,
  fontWeight: 700,
  letterSpacing: 0,
  lineHeight: 1,
  textTransform: "none",
  textAlign: "center",
  whiteSpace: "nowrap",
  textShadow: "0 1px 1px rgba(55, 71, 45, 0.20)",
  userSelect: "none",
  transform: "translateY(-11px)",
}

export function OrchardRibbon({ text }: OrchardRibbonProps) {
  return (
    <div style={wrapStyle} aria-hidden="true">
      <div style={artStyle} />
      <div style={textFrameStyle}>
        <span style={textStyle}>{text}</span>
      </div>
    </div>
  )
}

