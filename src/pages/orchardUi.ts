import type { CSSProperties } from "react"

export const ORCHARD_COLORS = {
  orchardCream: "#FFF6E9",
  appleBlush: "#F7D6D0",
  cranberry: "#B8545A",
  moss: "#6E8B6B",
  deepOrchard: "#3F5A40",
  honey: "#F2C078",
  paperWhite: "#FFFFFF",
  warmGray: "#E7E2DA",
  charcoal: "#2F2F2F",
  muted: "#746B63",
} as const

export type OrchardTone = "neutral" | "moss" | "honey" | "cranberry"

type OrchardToneStyle = {
  background: string
  color: string
  borderColor: string
}

const ORCHARD_TONE_STYLES: Record<OrchardTone, OrchardToneStyle> = {
  neutral: {
    background: "rgba(255, 255, 255, 0.92)",
    color: "var(--charcoal)",
    borderColor: "var(--border-paper)",
  },
  moss: {
    background: "rgba(110, 139, 107, 0.16)",
    color: "var(--deep-orchard)",
    borderColor: "var(--border-moss)",
  },
  honey: {
    background: "rgba(242, 192, 120, 0.22)",
    color: "#7A5B1B",
    borderColor: "var(--border-honey)",
  },
  cranberry: {
    background: "rgba(184, 84, 90, 0.14)",
    color: "var(--cranberry)",
    borderColor: "var(--border-cranberry)",
  },
}

function getToneStyle(tone: OrchardTone): OrchardToneStyle {
  return ORCHARD_TONE_STYLES[tone]
}

export const orchardPageShellStyle: CSSProperties = {
  minHeight: "100vh",
  padding: "32px 20px",
  background: "var(--surface-canvas)",
  backgroundColor: "var(--orchard-cream)",
}

export const orchardWrapStyle: CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto",
}

export const orchardHeroCardStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  marginBottom: "var(--space-lg)",
  padding: "var(--space-lg)",
  borderRadius: "var(--radius-lg)",
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(255, 246, 233, 0.92))",
  border: "1px solid rgba(231, 226, 218, 0.98)",
  boxShadow: "0 10px 28px rgba(184, 84, 90, 0.08)",
}

export const orchardHeroRibbonStyle: CSSProperties = {
  display: "inline-block",
  padding: "6px 12px",
  marginBottom: "var(--space-sm)",
  borderRadius: "999px",
  background: "rgba(242, 192, 120, 0.24)",
  border: "1px solid rgba(242, 192, 120, 0.36)",
  color: "#7A5B1B",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.4,
  textTransform: "uppercase",
}

export const orchardHeroTitleStyle: CSSProperties = {
  marginTop: 0,
  marginBottom: "var(--space-xs)",
  fontFamily: "var(--font-heading)",
  fontSize: 40,
  lineHeight: 1.1,
  color: "var(--orchard-green)",
}

export const orchardHeroBodyStyle: CSSProperties = {
  marginTop: 0,
  marginBottom: 0,
  maxWidth: 720,
  color: "var(--text-secondary)",
  fontSize: 16,
  lineHeight: 1.6,
}

export const orchardPanelStyle: CSSProperties = {
  background: "rgba(255, 255, 255, 0.96)",
  border: "1px solid rgba(231, 226, 218, 0.98)",
  borderRadius: 24,
  boxShadow: "0 10px 26px rgba(184, 84, 90, 0.08)",
  padding: "var(--space-xl)",
}

export const orchardCardStyle: CSSProperties = {
  background: "var(--surface-paper)",
  border: "1px solid var(--border-paper)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-card)",
  padding: "var(--space-lg)",
}

export const orchardSoftCardStyle: CSSProperties = {
  background: "var(--surface-paper-soft)",
  border: "1px solid var(--border-paper)",
  borderRadius: "var(--radius-lg)",
  boxShadow: "var(--shadow-soft)",
  padding: "var(--space-lg)",
}

export const orchardSectionHeaderRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "var(--space-md)",
  flexWrap: "wrap",
  marginBottom: "var(--space-md)",
}

export const orchardSectionLabelStyle: CSSProperties = {
  display: "inline-block",
  padding: "5px 10px",
  borderRadius: "999px",
  background: "rgba(247, 214, 208, 0.36)",
  border: "1px solid rgba(184, 84, 90, 0.18)",
  color: ORCHARD_COLORS.cranberry,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 0.35,
  textTransform: "uppercase",
}

export const orchardSectionTitleStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-heading)",
  fontSize: 28,
  lineHeight: 1.2,
  color: ORCHARD_COLORS.cranberry,
}

export const orchardSectionBodyStyle: CSSProperties = {
  marginTop: "var(--space-xs)",
  marginBottom: 0,
  color: "var(--text-secondary)",
  lineHeight: 1.6,
}

export const orchardStitchedDividerStyle: CSSProperties = {
  height: 0,
  borderTop: "2px dashed rgba(110, 139, 107, 0.28)",
  marginTop: "var(--space-md)",
  marginBottom: "var(--space-md)",
}

export const orchardNoticeStyle: CSSProperties = {
  padding: "12px 14px",
  borderRadius: "var(--radius-md)",
  border: "1px solid rgba(231, 226, 218, 0.98)",
  background: "rgba(255, 255, 255, 0.96)",
  color: "var(--text-secondary)",
  fontSize: 14,
  boxShadow: "0 4px 12px rgba(184, 84, 90, 0.05)",
}

export function orchardStepLinkStyle(active: boolean, disabled = false): CSSProperties {
  return {
    padding: "10px 16px",
    borderRadius: "999px",
    textDecoration: "none",
    border: `1px solid ${disabled ? "var(--border-soft)" : ORCHARD_COLORS.cranberry}`,
    background: active ? ORCHARD_COLORS.cranberry : "var(--paper-white)",
    color: disabled ? "var(--text-secondary)" : active ? "var(--paper-white)" : ORCHARD_COLORS.cranberry,
    fontWeight: 600,
    pointerEvents: disabled ? "none" : "auto",
    opacity: disabled ? 0.65 : 1,
    boxShadow: "var(--shadow-soft)",
    transition: "all 0.15s ease",
  }
}

export function orchardStatusBadgeStyle(tone: OrchardTone = "neutral"): CSSProperties {
  const toneStyle = getToneStyle(tone)

  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 0.2,
    background: toneStyle.background,
    color: toneStyle.color,
    border: `1px solid ${toneStyle.borderColor}`,
    boxShadow: "var(--shadow-soft)",
  }
}

export function orchardTagStyle(tone: OrchardTone = "neutral"): CSSProperties {
  const toneStyle = getToneStyle(tone)

  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 9px",
    borderRadius: "999px",
    fontSize: 12,
    fontWeight: 600,
    background: toneStyle.background,
    color: toneStyle.color,
    border: `1px solid ${toneStyle.borderColor}`,
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.42)",
  }
}

export function orchardButtonStyle(options?: {
  active?: boolean
  subtle?: boolean
}): CSSProperties {
  const active = options?.active ?? false
  const subtle = options?.subtle ?? false

  if (active) {
    return {
      padding: "10px 16px",
      borderRadius: "999px",
      border: "1px solid var(--cranberry)",
      background: "linear-gradient(180deg, rgba(184, 84, 90, 0.96), rgba(158, 39, 68, 0.94))",
      color: "var(--paper-white)",
      fontWeight: 600,
      boxShadow: "var(--shadow-soft)",
      transition: "all 0.15s ease",
    }
  }

  if (subtle) {
    return {
      padding: "10px 16px",
      borderRadius: "999px",
      border: "1px solid var(--border-paper)",
      background: "var(--surface-paper-soft)",
      color: "var(--cranberry)",
      fontWeight: 600,
      boxShadow: "var(--shadow-soft)",
      transition: "all 0.15s ease",
    }
  }

  return {
    padding: "10px 16px",
    borderRadius: "999px",
    border: "1px solid var(--border-moss)",
    background: "var(--paper-white)",
    color: "var(--deep-orchard)",
    fontWeight: 600,
    boxShadow: "var(--shadow-soft)",
    transition: "all 0.15s ease",
  }
}

export const orchardInputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "var(--radius-md)",
  border: "1px solid rgba(231, 226, 218, 0.98)",
  background: "rgba(255, 255, 255, 0.98)",
  color: "var(--text-primary)",
  boxSizing: "border-box",
  boxShadow: "inset 0 1px 2px rgba(184, 84, 90, 0.04)",
}

export const orchardStackGapStyle: CSSProperties = {
  display: "grid",
  gap: "var(--space-lg)",
}

export const orchardMetaRowStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--space-sm)",
  alignItems: "center",
}

export const orchardStatGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "var(--space-sm)",
}

export const orchardPageIntroBlockStyle: CSSProperties = {
  display: "grid",
  gap: "var(--space-sm)",
  marginBottom: "var(--space-lg)",
}
export const orchardPageHeaderCardStyle: CSSProperties = {
  ...orchardHeroCardStyle,
  ...orchardPageIntroBlockStyle,
  maxWidth: 920,
}
