import React from "react";

export const ORCHARD_COLORS = {
  page: "#FFF6E9",
  panel: "#FFFFFF",
  panelAlt: "#FBF6EF",
  border: "#E7E2DA",
  borderSoft: "#EFE8DE",
  borderStrong: "#D8CEC0",
  text: "#2F2F2F",
  muted: "#6C6258",
  heading: "#3F5A40",
  accent: "#6E8B6B",
  accentDark: "#3F5A40",
  accentSoft: "#EEF4EC",
  blush: "#F7D6D0",
  honey: "#F2C078",
  cranberry: "#B8545A",
  info: "#EEF5FB",
  infoBorder: "#C9D9E6",
  success: "#EEF6EE",
  successBorder: "#C9DBC8",
  warn: "#FFF6E8",
  warnBorder: "#E7D2A6",
  shadow: "rgba(63, 90, 64, 0.10)",
  shadowSoft: "rgba(47, 47, 47, 0.06)",
};

export function orchardShellStyle(): React.CSSProperties {
  return {
    minHeight: "100vh",
    background: `
      radial-gradient(circle at top left, rgba(247, 214, 208, 0.20), transparent 20%),
      radial-gradient(circle at top right, rgba(242, 192, 120, 0.14), transparent 18%),
      ${ORCHARD_COLORS.page}
    `,
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
    borderRadius: 24,
    padding: 18,
    boxShadow: `0 10px 28px ${ORCHARD_COLORS.shadowSoft}`,
    marginBottom: 18,
  };
}

export function orchardHeroCardStyle(): React.CSSProperties {
  return {
    ...orchardCardStyle(),
    background: "linear-gradient(135deg, #FFF9F1 0%, #FFF6E9 58%, #FBF3E6 100%)",
    border: `1px solid ${ORCHARD_COLORS.borderStrong}`,
    boxShadow: `0 14px 32px ${ORCHARD_COLORS.shadow}`,
  };
}

export function orchardSoftCardStyle(background = ORCHARD_COLORS.panelAlt): React.CSSProperties {
  return {
    background,
    border: `1px solid ${ORCHARD_COLORS.borderSoft}`,
    borderRadius: 20,
    padding: 14,
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
    borderRadius: 16,
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

export function orchardPrimaryButtonStyle(disabled = false): React.CSSProperties {
  return {
    padding: "12px 16px",
    borderRadius: 16,
    border: `1px solid ${disabled ? ORCHARD_COLORS.border : ORCHARD_COLORS.accent}`,
    background: disabled ? "#F2EEE8" : ORCHARD_COLORS.accent,
    color: disabled ? ORCHARD_COLORS.muted : "#FFFFFF",
    fontWeight: 800,
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : `0 6px 14px ${ORCHARD_COLORS.shadowSoft}`,
  };
}

export function orchardSecondaryButtonStyle(disabled = false): React.CSSProperties {
  return {
    padding: "12px 16px",
    borderRadius: 16,
    border: `1px solid ${ORCHARD_COLORS.border}`,
    background: disabled ? "#F5F1EA" : ORCHARD_COLORS.panelAlt,
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
