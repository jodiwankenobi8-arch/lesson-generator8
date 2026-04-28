import type { CSSProperties, ReactNode } from "react"
import woodLeftCap from "../assets/visual/smart-components/wood-label/wood-label-left-cap.png"
import woodCenterTile from "../assets/visual/smart-components/wood-label/wood-label-center-tile.png"
import woodRightCap from "../assets/visual/smart-components/wood-label/wood-label-right-cap.png"

type SmartWoodLabelVariant = "default" | "large"

type SmartWoodLabelProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  minWidth?: number | string
  maxWidth?: number | string
  paddingInline?: number
  allowWrap?: boolean
  variant?: SmartWoodLabelVariant
}

const variantHeights: Record<SmartWoodLabelVariant, number> = {
  default: 64,
  large: 78,
}

const variantFontSizes: Record<SmartWoodLabelVariant, number> = {
  default: 16,
  large: 19,
}

function toUnit(value: number | string | undefined): number | string | undefined {
  if (value === undefined) {
    return undefined
  }

  return typeof value === "number" ? `${value}px` : value
}

export function SmartWoodLabel({
  children,
  className,
  style,
  minWidth = 240,
  maxWidth = "100%",
  paddingInline = 24,
  allowWrap = true,
  variant = "default",
}: SmartWoodLabelProps) {
  const height = variantHeights[variant]
  const leftCapWidth = Math.round(height * (246 / 272))
  const rightCapWidth = Math.round(height * (220 / 272))

  const rootStyle: CSSProperties = {
    display: "inline-grid",
    gridTemplateColumns: `${leftCapWidth}px minmax(0, 1fr) ${rightCapWidth}px`,
    alignItems: "stretch",
    width: "fit-content",
    minWidth: toUnit(minWidth),
    maxWidth: toUnit(maxWidth),
    filter: "drop-shadow(0 5px 10px rgba(53, 40, 24, 0.24))",
    ...style,
  }

  const decorativeCapStyle: CSSProperties = {
    height,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    pointerEvents: "none",
    userSelect: "none",
  }

  const centerWrapStyle: CSSProperties = {
    minHeight: height,
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  }

  const centerArtStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${woodCenterTile})`,
    backgroundRepeat: "repeat-x",
    backgroundSize: "auto 100%",
    backgroundPosition: "left center",
    pointerEvents: "none",
    userSelect: "none",
  }

  const textStyle: CSSProperties = {
    position: "relative",
    zIndex: 1,
    display: "inline-block",
    width: "100%",
    boxSizing: "border-box",
    padding: `0 ${paddingInline}px`,
    color: "#fdf4e7",
    fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
    fontWeight: 700,
    fontSize: variantFontSizes[variant],
    letterSpacing: 0.1,
    lineHeight: 1.2,
    textAlign: "center",
    textShadow: "0 1px 2px rgba(22, 17, 10, 0.4)",
    whiteSpace: allowWrap ? "normal" : "nowrap",
    overflowWrap: allowWrap ? "break-word" : "normal",
    wordBreak: "normal",
  }

  return (
    <div className={className} style={rootStyle}>
      <div
        aria-hidden="true"
        style={{
          ...decorativeCapStyle,
          backgroundImage: `url(${woodLeftCap})`,
        }}
      />
      <span style={centerWrapStyle}>
        <span aria-hidden="true" style={centerArtStyle} />
        <span style={textStyle}>{children}</span>
      </span>
      <div
        aria-hidden="true"
        style={{
          ...decorativeCapStyle,
          backgroundImage: `url(${woodRightCap})`,
        }}
      />
    </div>
  )
}
