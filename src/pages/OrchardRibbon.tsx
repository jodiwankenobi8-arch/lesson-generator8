import type { CSSProperties } from "react"

type OrchardRibbonProps = {
  text: string
}

const wrapStyle: CSSProperties = {
  position: "relative",
  display: "inline-block",
  alignSelf: "start",
  filter: "drop-shadow(0 4px 10px rgba(63,90,64,0.16))",
}

const bodyStyle: CSSProperties = {
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 42,
  padding: "0 28px",
  borderRadius: 16,
  background:
    "linear-gradient(180deg, #9DB874 0%, #89A860 38%, #6E8B6B 70%, #5E775B 100%)",
  border: "1px solid rgba(63,90,64,0.24)",
  color: "#FFFDF8",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 0.6,
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  boxSizing: "border-box",
}

const tailCommonStyle: CSSProperties = {
  position: "absolute",
  top: "50%",
  width: 22,
  height: 24,
  transform: "translateY(-50%)",
  background:
    "linear-gradient(180deg, #8FA86B 0%, #769263 55%, #5E775B 100%)",
  border: "1px solid rgba(63,90,64,0.22)",
  zIndex: -1,
}

const leftTailStyle: CSSProperties = {
  ...tailCommonStyle,
  left: -12,
  borderRadius: "8px 0 0 8px",
  clipPath: "polygon(100% 0, 100% 100%, 0 86%, 12% 50%, 0 14%)",
}

const rightTailStyle: CSSProperties = {
  ...tailCommonStyle,
  right: -12,
  borderRadius: "0 8px 8px 0",
  clipPath: "polygon(0 0, 100% 14%, 88% 50%, 100% 86%, 0 100%)",
}

const stitchTopStyle: CSSProperties = {
  position: "absolute",
  left: 12,
  right: 12,
  top: 7,
  borderTop: "2px dashed rgba(255,251,244,0.9)",
  opacity: 0.95,
  pointerEvents: "none",
}

const stitchBottomStyle: CSSProperties = {
  position: "absolute",
  left: 12,
  right: 12,
  bottom: 7,
  borderTop: "2px dashed rgba(255,251,244,0.9)",
  opacity: 0.92,
  pointerEvents: "none",
}

export function OrchardRibbon({ text }: OrchardRibbonProps) {
  return (
    <div style={wrapStyle} aria-hidden="true">
      <span style={leftTailStyle} />
      <span style={rightTailStyle} />
      <div style={bodyStyle}>
        <span style={stitchTopStyle} />
        <span style={stitchBottomStyle} />
        <span>{text}</span>
      </div>
    </div>
  )
}