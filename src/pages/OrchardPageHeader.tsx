import type { CSSProperties, ReactNode } from "react"
import {
  orchardHeroCardStyle,
  orchardPageIntroBlockStyle,
  orchardSectionLabelStyle,
  orchardSectionTitleStyle,
} from "./orchardUi"

const titleStyle: CSSProperties = {
  ...orchardSectionTitleStyle,
  fontSize: 32,
}

type OrchardPageHeaderProps = {
  label: string
  title: string
  children: ReactNode
}

export function OrchardPageHeader({ label, title, children }: OrchardPageHeaderProps) {
  return (
    <>
      <div style={orchardSectionLabelStyle}>{label}</div>
      <h2 style={titleStyle}>{title}</h2>
      <div style={{ ...orchardHeroCardStyle, ...orchardPageIntroBlockStyle }}>{children}</div>
    </>
  )
}