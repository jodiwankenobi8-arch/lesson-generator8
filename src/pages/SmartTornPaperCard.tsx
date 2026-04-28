import type { CSSProperties, ReactNode } from "react"
import tornTopLeft from "../assets/visual/smart-components/torn-paper-card/torn-card-tl.png"
import tornTop from "../assets/visual/smart-components/torn-paper-card/torn-card-t.png"
import tornTopRight from "../assets/visual/smart-components/torn-paper-card/torn-card-tr.png"
import tornLeft from "../assets/visual/smart-components/torn-paper-card/torn-card-l.png"
import tornCenter from "../assets/visual/smart-components/torn-paper-card/torn-card-center.png"
import tornRight from "../assets/visual/smart-components/torn-paper-card/torn-card-r.png"
import tornBottomLeft from "../assets/visual/smart-components/torn-paper-card/torn-card-bl.png"
import tornBottom from "../assets/visual/smart-components/torn-paper-card/torn-card-b.png"
import tornBottomRight from "../assets/visual/smart-components/torn-paper-card/torn-card-br.png"

type SmartTornPaperCardProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  minWidth?: number | string
  maxWidth?: number | string
  paddingInline?: number
  paddingBlock?: number
}

function toUnit(value: number | string | undefined): number | string | undefined {
  if (value === undefined) {
    return undefined
  }

  return typeof value === "number" ? `${value}px` : value
}

export function SmartTornPaperCard({
  children,
  className,
  style,
  minWidth = 320,
  maxWidth = "100%",
  paddingInline = 28,
  paddingBlock = 22,
}: SmartTornPaperCardProps) {
  const topHeight = 42
  const bottomHeight = 42
  const leftWidth = 34
  const rightWidth = 30

  const rootStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: `${leftWidth}px minmax(0, 1fr) ${rightWidth}px`,
    gridTemplateRows: `${topHeight}px auto ${bottomHeight}px`,
    width: "100%",
    minWidth: toUnit(minWidth),
    maxWidth: toUnit(maxWidth),
    filter: "drop-shadow(0 6px 14px rgba(65, 50, 35, 0.16))",
    ...style,
  }

  const decorativeStyle: CSSProperties = {
    pointerEvents: "none",
    userSelect: "none",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
  }

  const repeatXStyle: CSSProperties = {
    ...decorativeStyle,
    backgroundRepeat: "repeat-x",
    backgroundSize: "auto 100%",
  }

  const repeatYStyle: CSSProperties = {
    ...decorativeStyle,
    backgroundRepeat: "repeat-y",
    backgroundSize: "100% auto",
  }

  const centerCellStyle: CSSProperties = {
    position: "relative",
    minHeight: 120,
    backgroundImage: `url(${tornCenter})`,
    backgroundRepeat: "repeat",
    backgroundSize: "180px auto",
    backgroundPosition: "center",
  }

  const contentStyle: CSSProperties = {
    position: "relative",
    zIndex: 1,
    boxSizing: "border-box",
    minHeight: "100%",
    width: "100%",
    padding: `${paddingBlock}px ${paddingInline}px`,
    color: "#4e3f30",
    lineHeight: 1.45,
  }

  return (
    <section className={className} style={rootStyle}>
      <div aria-hidden="true" style={{ ...decorativeStyle, backgroundImage: `url(${tornTopLeft})` }} />
      <div aria-hidden="true" style={{ ...repeatXStyle, backgroundImage: `url(${tornTop})` }} />
      <div aria-hidden="true" style={{ ...decorativeStyle, backgroundImage: `url(${tornTopRight})` }} />

      <div aria-hidden="true" style={{ ...repeatYStyle, backgroundImage: `url(${tornLeft})` }} />
      <div style={centerCellStyle}>
        <div style={contentStyle}>{children}</div>
      </div>
      <div aria-hidden="true" style={{ ...repeatYStyle, backgroundImage: `url(${tornRight})` }} />

      <div aria-hidden="true" style={{ ...decorativeStyle, backgroundImage: `url(${tornBottomLeft})` }} />
      <div aria-hidden="true" style={{ ...repeatXStyle, backgroundImage: `url(${tornBottom})` }} />
      <div aria-hidden="true" style={{ ...decorativeStyle, backgroundImage: `url(${tornBottomRight})` }} />
    </section>
  )
}
