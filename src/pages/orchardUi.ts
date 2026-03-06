import React from "react";

export const ORCHARD_COLORS = {
  page: "#F7F1E8",
  pageGradientTop: "#FBF7F1",
  panel: "#FFFDF9",
  panelAlt: "#F9F4EC",
  panelWarm: "#FFF8EF",
  border: "#D8CBB8",
  borderSoft: "#E8DDD0",
  borderStrong: "#CBB89D",
  text: "#2F2A24",
  muted: "#6F655B",
  heading: "#314B3A",
  accent: "#6E8B5E",
  accentDark: "#4E6542",
  accentSoft: "#EEF5EA",
  blush: "#D9A58F",
  honey: "#E8C47A",
  info: "#EAF2FB",
  infoBorder: "#BDD0E6",
  success: "#EEF5EA",
  successBorder: "#C9DABD",
  warn: "#FFF6E8",
  warnBorder: "#E9D3A5",
  danger: "#FFF2F1",
  dangerBorder: "#E6B8B4",
  shadow: "rgba(73, 52, 33, 0.08)",
  shadowSoft: "rgba(73, 52, 33, 0.05)",
};

export function orchardShellStyle(): React.CSSProperties {
  return {
    minHeight: "100vh",
    background: `linear-gradient(180deg, ${ORCHARD_COLORS.pageGradientTop} 0%, ${ORCHARD_COLORS.page} 220px)`,
    color: ORCHARD_COLORS.text,
  };
}

export function orchardWrapStyle(): React.CSSProperties {
  return {
    maxWidth: 1080,
    margin: "0 auto",
    padding: 24,
  };
}

export function orchardCardStyle(): React.CSSProperties {
  return {
    background: ORCHARD_COLORS.panel,
    border: `1px solid ${ORCHARD_COLORS.border}`,
    borderRadius: 22,
    padding: 20,
    boxShadow: `0 10px 28px ${ORCHARD_COLORS.shadow}`,
    marginBottom: 18,
  };
}

export function orchardHeroCardStyle(): React.CSSProperties {
  return {
    ...orchardCardStyle(),
    background: `linear-gradient(135deg, ${ORCHARD_COLORS.panelWarm} 0%, ${ORCHARD_COLORS.page} 100%)`,
    overflow: "hidden",
  };
}

export function orchardSoftCardStyle(background = ORCHARD_COLORS.panelAlt): React.CSSProperties {
  return {
    background,
    border: `1px solid ${ORCHARD_COLORS.borderSoft}`,
    borderRadius: 18,
    padding: 14,
    boxShadow: `0 3px 10px ${ORCHARD_COLORS.shadowSoft}`,
  };
}

export function orchardSectionTitleStyle(): React.CSSProperties {
  return {
    fontWeight: 900,
    fontSize: 20,
    color: ORCHARD_COLORS.heading,
    marginBottom: 14,
  };
}

export function orchardLabelTitleStyle(): React.CSSProperties {
  return {
    fontWeight: 800,
    color: ORCHARD_COLORS.heading,
    marginBottom: 6,
  };
}

export function orchardHelpTextStyle(): React.CSSProperties {
  return {
    color: ORCHARD_COLORS.muted,
    lineHeight: 1.55,
  };
}

export function orchardInputStyle(): React.CSSProperties {
  return {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: `1px solid ${ORCHARD_COLORS.border}`,
    background: "#FFFDFC",
    color: ORCHARD_COLORS.text,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 120ms ease, box-shadow 120ms ease, background 120ms ease",
  };
}

export function orchardTextareaStyle(minHeight = 90): React.CSSProperties {
  return {
    ...orchardInputStyle(),
    minHeight,
    resize: "vertical",
  };
}

export function orchardPrimaryButtonStyle(disabled = false): React.CSSProperties {
  return {
    padding: "12px 16px",
    borderRadius: 14,
    border: `1px solid ${disabled ? ORCHARD_COLORS.border : ORCHARD_COLORS.accent}`,
    background: disabled ? "#E9E1D5" : ORCHARD_COLORS.accent,
    color: disabled ? ORCHARD_COLORS.muted : "#fff",
    fontWeight: 800,
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : `0 6px 16px ${ORCHARD_COLORS.shadowSoft}`,
  };
}

export function orchardSecondaryButtonStyle(disabled = false): React.CSSProperties {
  return {
    padding: "12px 16px",
    borderRadius: 14,
    border: `1px solid ${ORCHARD_COLORS.border}`,
    background: disabled ? "#F2ECE4" : ORCHARD_COLORS.panelAlt,
    color: ORCHARD_COLORS.text,
    fontWeight: 800,
    cursor: disabled ? "not-allowed" : "pointer",
  };
}

export function orchardLinkStyle(): React.CSSProperties {
  return {
    color: ORCHARD_COLORS.accentDark,
    fontWeight: 700,
    textDecoration: "none",
  };
}

export function orchardPillStyle(background: string, border: string): React.CSSProperties {
  return {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    background,
    border: `1px solid ${border}`,
    fontSize: 12,
    fontWeight: 700,
    color: ORCHARD_COLORS.text,
    marginRight: 8,
    marginBottom: 8,
  };
}
