import React from "react";

export const ORCHARD_COLORS = {
  page: "#F7F1E8",
  panel: "#FFFDF9",
  panelAlt: "#F9F4EC",
  border: "#D8CBB8",
  borderSoft: "#E8DDD0",
  text: "#2F2A24",
  muted: "#6F655B",
  heading: "#314B3A",
  accent: "#6E8B5E",
  accentDark: "#4E6542",
  blush: "#D9A58F",
  honey: "#E8C47A",
  info: "#EAF2FB",
  infoBorder: "#BDD0E6",
  success: "#EEF5EA",
  successBorder: "#C9DABD",
  warn: "#FFF6E8",
  warnBorder: "#E9D3A5",
  shadow: "rgba(73, 52, 33, 0.08)",
};

export function orchardShellStyle(): React.CSSProperties {
  return {
    minHeight: "100vh",
    background: ORCHARD_COLORS.page,
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
    padding: 18,
    boxShadow: `0 8px 24px ${ORCHARD_COLORS.shadow}`,
    marginBottom: 18,
  };
}

export function orchardSoftCardStyle(background = ORCHARD_COLORS.panelAlt): React.CSSProperties {
  return {
    background,
    border: `1px solid ${ORCHARD_COLORS.borderSoft}`,
    borderRadius: 18,
    padding: 14,
  };
}

export function orchardLabelTitleStyle(): React.CSSProperties {
  return {
    fontWeight: 800,
    color: ORCHARD_COLORS.heading,
    marginBottom: 6,
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
  };
}

export function orchardTextareaStyle(minHeight = 90): React.CSSProperties {
  return {
    ...orchardInputStyle(),
    minHeight,
    resize: "vertical",
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
