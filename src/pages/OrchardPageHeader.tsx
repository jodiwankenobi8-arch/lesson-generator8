import type { CSSProperties, ReactNode } from "react"
import {
  orchardPageHeaderCardStyle,
  orchardSectionTitleStyle,
} from "./orchardUi"
import { OrchardRibbon } from "./OrchardRibbon"
import orchardHeaderAccent from "../assets/visual/extra-orchard-elements/apple-stickers-01-single-apple-moss.png"

const headerStyle: CSSProperties = {
  position: "relative",
  display: "grid",
  gap: 12,
  marginBottom: 8,
}

const accentStyle: CSSProperties = {
  position: "absolute",
  top: -6,
  right: 8,
  width: "clamp(44px, 7vw, 74px)",
  height: "auto",
  opacity: 0.78,
  pointerEvents: "none",
  userSelect: "none",
  zIndex: 1,
}

const titleStyle: CSSProperties = {
  ...orchardSectionTitleStyle,
  fontSize: 32,
  margin: 0,
  maxWidth: "18ch",
}

const introContentStyle: CSSProperties = {
  display: "grid",
  gap: 12,
}

type OrchardPageHeaderProps = {
  label: string
  title: string
  children: ReactNode
  titleId?: string
  introMaxWidth?: CSSProperties["maxWidth"]
}

export function OrchardPageHeader({
  label,
  title,
  children,
  titleId,
  introMaxWidth = 920,
}: OrchardPageHeaderProps) {
  const introCardStyle: CSSProperties = {
    ...orchardPageHeaderCardStyle,
    maxWidth: introMaxWidth,
  }

  return (
    <header style={headerStyle}>
      <img src={orchardHeaderAccent} alt="" aria-hidden="true" style={accentStyle} />
      <OrchardRibbon text={label} />
      <h2 id={titleId} style={titleStyle}>
        {title}
      </h2>
      <div style={introCardStyle}>
        <div style={introContentStyle}>{children}</div>
      </div>
    </header>
  )
}
