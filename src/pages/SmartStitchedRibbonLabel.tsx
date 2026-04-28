import type { CSSProperties, ReactNode } from "react"

type SmartStitchedRibbonLabelVariant = "default" | "large"

type SmartStitchedRibbonLabelProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  minWidth?: number | string
  maxWidth?: number | string
  paddingInline?: number
  allowWrap?: boolean
  variant?: SmartStitchedRibbonLabelVariant
}

const variantConfig: Record<
  SmartStitchedRibbonLabelVariant,
  { minHeight: number; fontSize: number; tailSize: number; radius: number }
> = {
  default: { minHeight: 42, fontSize: 34 / 2.2, tailSize: 14, radius: 10 },
  large: { minHeight: 50, fontSize: 18, tailSize: 16, radius: 12 },
}

function toUnit(value: number | string | undefined): number | string | undefined {
  if (value === undefined) {
    return undefined
  }

  return typeof value === "number" ? `${value}px` : value
}

export function SmartStitchedRibbonLabel({
  children,
  className,
  style,
  minWidth = 220,
  maxWidth = "100%",
  paddingInline = 24,
  allowWrap = false,
  variant = "default",
}: SmartStitchedRibbonLabelProps) {
  const config = variantConfig[variant]

  const rootStyle: CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: toUnit(minWidth),
    maxWidth: toUnit(maxWidth),
    width: "fit-content",
    minHeight: config.minHeight,
    borderRadius: config.radius,
    padding: `0 ${paddingInline}px`,
    boxSizing: "border-box",
    color: "#fff7eb",
    background:
      "linear-gradient(180deg, #d95f44 0%, #c84f37 35%, #b94632 70%, #a73c2c 100%)",
    border: "1px solid rgba(131, 42, 32, 0.58)",
    boxShadow: "0 3px 7px rgba(99, 46, 31, 0.26), inset 0 1px 0 rgba(255, 230, 206, 0.38)",
    filter: "drop-shadow(0 6px 10px rgba(66, 33, 25, 0.2))",
    ...style,
  }

  const tailBaseStyle: CSSProperties = {
    position: "absolute",
    top: "50%",
    width: config.tailSize,
    height: config.tailSize,
    transform: "translateY(-50%) rotate(45deg)",
    background: "linear-gradient(180deg, #c84f37 0%, #9f3a2b 100%)",
    border: "1px solid rgba(120, 40, 30, 0.6)",
    pointerEvents: "none",
  }

  const stitchTopStyle: CSSProperties = {
    position: "absolute",
    left: 10,
    right: 10,
    top: 6,
    height: 3,
    borderRadius: 2,
    backgroundImage:
      "repeating-linear-gradient(90deg, rgba(248, 232, 213, 0.78) 0 4px, rgba(248, 232, 213, 0.18) 4px 8px)",
    pointerEvents: "none",
  }

  const stitchBottomStyle: CSSProperties = {
    ...stitchTopStyle,
    top: "auto",
    bottom: 6,
  }

  const textStyle: CSSProperties = {
    position: "relative",
    zIndex: 1,
    display: "inline-block",
    width: "100%",
    textAlign: "center",
    color: "inherit",
    fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
    fontWeight: 800,
    fontSize: config.fontSize,
    letterSpacing: 0.12,
    lineHeight: 1.15,
    textShadow: "0 1px 1px rgba(73, 28, 20, 0.45)",
    whiteSpace: allowWrap ? "normal" : "nowrap",
    overflowWrap: allowWrap ? "break-word" : "normal",
    wordBreak: "normal",
  }

  return (
    <div className={className} style={rootStyle}>
      <span aria-hidden="true" style={{ ...tailBaseStyle, left: -8 }} />
      <span aria-hidden="true" style={{ ...tailBaseStyle, right: -8 }} />
      <span aria-hidden="true" style={stitchTopStyle} />
      <span aria-hidden="true" style={stitchBottomStyle} />
      <span style={textStyle}>{children}</span>
    </div>
  )
}
