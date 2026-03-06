import React from "react";

export const ORCHARD_COLORS = {
  page: "#FFF6E9",
  pageTint: "#FDF1E3",
  panel: "#FFFFFF",
  panelAlt: "#FCF6EE",
  border: "#E7E2DA",
  borderSoft: "#EFE7DC",
  borderStrong: "#DCCFBE",
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
  stitch: "#F7FBF4",
  shadow: "rgba(63, 90, 64, 0.12)",
  shadowSoft: "rgba(47, 47, 47, 0.07)",
};

export function orchardShellStyle(): React.CSSProperties {
  return {
    minHeight: "100vh",
    backgroundColor: ORCHARD_COLORS.page,
    backgroundImage: [
      "radial-gradient(circle at 12% 10%, rgba(247, 214, 208, 0.32), transparent 0 18%)",
      "radial-gradient(circle at 86% 14%, rgba(242, 192, 120, 0.18), transparent 0 16%)",
      "radial-gradient(circle at 18% 82%, rgba(110, 139, 107, 0.08), transparent 0 20%)",
      "linear-gradient(rgba(255,255,255,0.18), rgba(255,255,255,0.18))",
      "repeating-linear-gradient(0deg, rgba(255,255,255,0.00) 0px, rgba(255,255,255,0.00) 27px, rgba(63,90,64,0.018) 28px)"
    ].join(", "),
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
    background: "linear-gradient(180deg, #FFFDFC 0%, #FFF9F3 100%)",
    border: `1px solid ${ORCHARD_COLORS.border}`,
    borderRadius: 26,
    padding: 20,
    boxShadow: `0 12px 30px ${ORCHARD_COLORS.shadowSoft}`,
    marginBottom: 18,
    position: "relative",
  };
}

export function orchardHeroCardStyle(): React.CSSProperties {
  return {
    ...orchardCardStyle(),
    background: [
      "linear-gradient(180deg, rgba(255,255,255,0.70), rgba(255,255,255,0.40))",
      "linear-gradient(135deg, #FFF9F0 0%, #FFF6E9 52%, #FCEEDB 100%)"
    ].join(", "),
    border: `1px solid ${ORCHARD_COLORS.borderStrong}`,
    boxShadow: `0 18px 38px ${ORCHARD_COLORS.shadow}`,
  };
}

export function orchardSoftCardStyle(background = ORCHARD_COLORS.panelAlt): React.CSSProperties {
  return {
    background,
    border: `1px solid ${ORCHARD_COLORS.borderSoft}`,
    borderRadius: 20,
    padding: 14,
    boxShadow: `0 6px 14px rgba(47,47,47,0.03)`,
  };
}

export function orchardSectionTitleStyle(): React.CSSProperties {
  return {
    fontWeight: 900,
    fontSize: 20,
    color: ORCHARD_COLORS.heading,
    marginBottom: 14,
    fontFamily: '"Libre Baskerville", "Playfair Display", Georgia, serif',
    letterSpacing: "0.01em",
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
    background: "#FFFDFB",
    color: ORCHARD_COLORS.text,
    outline: "none",
    boxSizing: "border-box",
    boxShadow: "inset 0 1px 2px rgba(47,47,47,0.03)",
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
    letterSpacing: "0.03em",
    padding: "7px 14px 7px 14px",
    borderRadius: "14px 18px 18px 14px",
    boxShadow: `0 6px 14px ${ORCHARD_COLORS.shadow}`,
    border: `1px solid ${ORCHARD_COLORS.accentDark}`,
  };
}

export function orchardHeroTitleStyle(): React.CSSProperties {
  return {
    margin: "0 0 8px 0",
    color: ORCHARD_COLORS.heading,
    fontSize: 36,
    lineHeight: 1.08,
    fontFamily: '"Libre Baskerville", "Playfair Display", Georgia, serif',
    letterSpacing: "-0.01em",
  };
}

export function orchardStitchDividerStyle(): React.CSSProperties {
  return {
    height: 0,
    borderTop: `2px dashed ${ORCHARD_COLORS.stitch}`,
    opacity: 0.95,
    marginTop: 8,
    marginBottom: 2,
  };
}
