import type { CSSProperties, ReactNode } from "react"
import {
  orchardPageHeaderCardStyle,
  orchardSectionTitleStyle,
} from "./orchardUi"
import { OrchardRibbon } from "./OrchardRibbon"

const headerStyle: CSSProperties = {
  display: "grid",
  gap: 12,
  marginBottom: 8,
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
