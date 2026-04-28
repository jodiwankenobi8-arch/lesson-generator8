import type { CSSProperties, ReactNode } from "react"
import {
  orchardPageHeaderCardStyle,
  orchardSectionTitleStyle,
} from "./orchardUi"
import { OrchardRibbon } from "./OrchardRibbon"
import orchardHeaderBacking from "../assets/visual/panel-notebook-stack.png"
import orchardHeaderBlossom from "../assets/visual/extra-orchard-elements/apple-stickers-04-apple-blossom-cluster.png"

const headerStyle: CSSProperties = {
  position: "relative",
  marginBottom: 6,
}

const clusterStyle: CSSProperties = {
  position: "relative",
  maxWidth: 920,
}

const backingStyle: CSSProperties = {
  position: "absolute",
  inset: "10px 8px -10px 4px",
  width: "calc(100% - 12px)",
  height: "calc(100% + 12px)",
  objectFit: "cover",
  opacity: 0.2,
  transform: "rotate(-0.8deg)",
  pointerEvents: "none",
  userSelect: "none",
  zIndex: 0,
}

const cardStyle: CSSProperties = {
  ...orchardPageHeaderCardStyle,
  position: "relative",
  zIndex: 1,
  marginBottom: 0,
  overflow: "visible",
  paddingTop: "clamp(94px, 12vw, 118px)",
}

const ribbonDockStyle: CSSProperties = {
  position: "absolute",
  top: "clamp(-54px, -6vw, -38px)",
  left: "clamp(8px, 2.5vw, 24px)",
  width: "min(100%, 330px)",
  zIndex: 3,
}

const blossomStyle: CSSProperties = {
  position: "absolute",
  top: "clamp(-34px, -3vw, -18px)",
  right: "clamp(12px, 3vw, 30px)",
  width: "clamp(44px, 8vw, 88px)",
  height: "auto",
  opacity: 0.9,
  pointerEvents: "none",
  userSelect: "none",
  zIndex: 2,
}

const titleStyle: CSSProperties = {
  ...orchardSectionTitleStyle,
  fontSize: 32,
  margin: 0,
  marginBottom: 4,
  maxWidth: "22ch",
}

const introContentStyle: CSSProperties = {
  display: "grid",
  gap: 8,
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
  const headerClusterStyle: CSSProperties = {
    ...clusterStyle,
    maxWidth: introMaxWidth,
  }

  return (
    <header style={headerStyle}>
      <div style={headerClusterStyle}>
        <img src={orchardHeaderBacking} alt="" aria-hidden="true" style={backingStyle} />
        <div style={cardStyle}>
          <div style={ribbonDockStyle}>
            <OrchardRibbon text={label} />
          </div>
          <img src={orchardHeaderBlossom} alt="" aria-hidden="true" style={blossomStyle} />
          <h2 id={titleId} style={titleStyle}>
            {title}
          </h2>
          <div style={introContentStyle}>{children}</div>
        </div>
      </div>
    </header>
  )
}
