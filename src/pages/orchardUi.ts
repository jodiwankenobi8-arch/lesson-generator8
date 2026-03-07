import React from "react";

export const ORCHARD_COLORS = {
  page: "#FFF6E9",
  panel: "#FFFFFF",
  panelAlt: "#FFFDF9",
  panelWarm: "#FFF9F2",
  text: "#2F2F2F",
  heading: "#3F5A40",
  muted: "#6F6A63",
  mutedSoft: "#8B847B",
  border: "#E7E2DA",
  borderSoft: "#EEE7DE",
  borderStrong: "#D8CEC0",
  accent: "#6E8B6B",
  accentDark: "#3F5A40",
  blush: "#F7D6D0",
  honey: "#F2C078",
  cranberry: "#B8545A",
  stitch: "#D8CFC4",
  shadow: "rgba(63,90,64,0.10)",
  warnBorder: "#D7B27A",
  success: "#EEF5EA",
  successBorder: "#BFD6B8",
  successStrong: "#5F7D59",
};

export function orchardShellStyle(): React.CSSProperties {
  return {
    minHeight: "100vh",
    background: "transparent",
    color: ORCHARD_COLORS.text,
    padding: "32px 18px 72px",
    fontFamily: '"Inter", "Source Sans 3", system-ui, sans-serif',
  };
}

export function orchardWrapStyle(): React.CSSProperties {
  return {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    display: "grid",
    gap: 20,
  };
}

export function orchardCardStyle(background = ORCHARD_COLORS.panel): React.CSSProperties {
  return {
    background,
    backgroundImage:
      "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,252,247,0.98) 100%), radial-gradient(circle at 12% 18%, rgba(255,255,255,0.55) 0, rgba(255,255,255,0) 24%), radial-gradient(circle at 82% 10%, rgba(242,192,120,0.08) 0, rgba(242,192,120,0) 18%)",
    border: `1px solid ${ORCHARD_COLORS.border}`,
    borderRadius: 24,
    padding: 22,
    boxShadow: "0 10px 26px rgba(47,47,47,0.05)",
    position: "relative",
    overflow: "hidden",
  };
}

export function orchardHeroCardStyle(): React.CSSProperties {
  return {
    ...orchardCardStyle("#FFF9F2"),
    padding: 26,
    backgroundImage:
      "linear-gradient(180deg, rgba(255,255,255,0.46) 0%, rgba(255,248,239,0.94) 100%), radial-gradient(circle at 14% 22%, rgba(255,255,255,0.78) 0, rgba(255,255,255,0) 26%), radial-gradient(circle at 86% 18%, rgba(247,214,208,0.28) 0, rgba(247,214,208,0) 22%), radial-gradient(circle at 72% 78%, rgba(242,192,120,0.18) 0, rgba(242,192,120,0) 18%)",
    boxShadow: "0 14px 34px rgba(47,47,47,0.06)",
  };
}

export function orchardSoftCardStyle(background = ORCHARD_COLORS.panelAlt): React.CSSProperties {
  return {
    background,
    backgroundImage:
      "linear-gradient(180deg, rgba(255,255,255,0.86) 0%, rgba(255,252,248,0.96) 100%), radial-gradient(circle at 18% 16%, rgba(255,255,255,0.42) 0, rgba(255,255,255,0) 24%)",
    border: `1px solid ${ORCHARD_COLORS.borderSoft}`,
    borderRadius: 20,
    padding: 16,
    boxShadow: "0 6px 14px rgba(47,47,47,0.03)",
  };
}

export function orchardSectionTitleStyle(): React.CSSProperties {
  return {
    fontWeight: 900,
    fontSize: 22,
    lineHeight: 1.2,
    color: ORCHARD_COLORS.heading,
    marginBottom: 16,
    fontFamily: '"Playfair Display", "Libre Baskerville", Georgia, serif',
    letterSpacing: "0.01em",
  };
}

export function orchardLabelTitleStyle(): React.CSSProperties {
  return {
    fontWeight: 800,
    color: ORCHARD_COLORS.heading,
    marginBottom: 8,
  };
}

export function orchardHelpTextStyle(): React.CSSProperties {
  return {
    color: ORCHARD_COLORS.muted,
    lineHeight: 1.6,
  };
}

export function orchardInputStyle(): React.CSSProperties {
  return {
    width: "100%",
    padding: 12,
    borderRadius: 16,
    border: `1px solid ${ORCHARD_COLORS.border}`,
    background: "#FFFDFB",
    color: ORCHARD_COLORS.text,
    outline: "none",
    boxSizing: "border-box",
    boxShadow: "inset 0 1px 2px rgba(47,47,47,0.03)",
    transition: "border-color 140ms ease, box-shadow 140ms ease, transform 140ms ease",
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
    borderRadius: 18,
    border: `1px solid ${disabled ? ORCHARD_COLORS.border : ORCHARD_COLORS.accentDark}`,
    background: disabled
      ? "#F1ECE5"
      : "linear-gradient(180deg, #6E8B6B 0%, #587053 100%)",
    color: disabled ? ORCHARD_COLORS.muted : "#FFFFFF",
    fontWeight: 800,
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : `0 8px 18px ${ORCHARD_COLORS.shadow}`,
  };
}

export function orchardSecondaryButtonStyle(disabled = false): React.CSSProperties {
  return {
    padding: "12px 16px",
    borderRadius: 18,
    border: `1px solid ${ORCHARD_COLORS.border}`,
    background: disabled
      ? "#F6F1EA"
      : "linear-gradient(180deg, #FFF8EE 0%, #F9F1E6 100%)",
    color: ORCHARD_COLORS.text,
    fontWeight: 800,
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : "0 4px 10px rgba(47,47,47,0.03)",
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
    boxShadow: "0 2px 6px rgba(47,47,47,0.03)",
  };
}

export function orchardRibbonHeaderStyle(): React.CSSProperties {
  return {
    display: "inline-block",
    background: `linear-gradient(180deg, ${ORCHARD_COLORS.accent} 0%, ${ORCHARD_COLORS.accentDark} 100%)`,
    color: "#FFFFFF",
    fontWeight: 800,
    fontSize: 12,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    padding: "7px 14px",
    borderRadius: "14px 18px 18px 14px",
    boxShadow: `0 6px 14px ${ORCHARD_COLORS.shadow}`,
    border: `1px solid ${ORCHARD_COLORS.accentDark}`,
    marginBottom: 6,
  };
}

export function orchardHeroTitleStyle(): React.CSSProperties {
  return {
    margin: "0 0 10px 0",
    color: ORCHARD_COLORS.heading,
    fontSize: 38,
    lineHeight: 1.08,
    fontFamily: '"Playfair Display", "Libre Baskerville", Georgia, serif',
    letterSpacing: "-0.01em",
  };
}

export function orchardStitchDividerStyle(): React.CSSProperties {
  return {
    height: 0,
    borderTop: `2px dashed ${ORCHARD_COLORS.stitch}`,
    opacity: 0.95,
    marginTop: 10,
    marginBottom: 6,
  };
}
