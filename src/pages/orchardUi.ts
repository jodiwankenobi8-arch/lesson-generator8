import React from "react";
import { ORCHARD_COLORS, orchardTokens } from "../design/orchardTokens";

export { ORCHARD_COLORS };

export function orchardShellStyle(): React.CSSProperties {
  return {
    minHeight: "100vh",
    background: "transparent",
    color: ORCHARD_COLORS.text,
    padding: "34px 18px 72px",
    fontFamily: orchardTokens.typography.bodyStack,
  };
}

export function orchardWrapStyle(): React.CSSProperties {
  return {
    width: "100%",
    maxWidth: 1180,
    margin: "0 auto",
    display: "grid",
    gap: 20,
  };
}

export function orchardCardStyle(background: string = ORCHARD_COLORS.panel): React.CSSProperties {
  return {
    background,
    backgroundImage:
      "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,251,246,0.97) 100%), radial-gradient(circle at 12% 18%, rgba(255,255,255,0.58) 0, rgba(255,255,255,0) 24%), radial-gradient(circle at 86% 12%, rgba(247,214,208,0.15) 0, rgba(247,214,208,0) 18%)",
    border: `1px solid ${ORCHARD_COLORS.border}`,
    borderRadius: 28,
    padding: 24,
    boxShadow: "0 14px 30px rgba(47,47,47,0.05)",
    position: "relative",
    overflow: "hidden",
    outline: "1px solid rgba(255,255,255,0.46)",
    outlineOffset: "-9px",
  };
}

export function orchardBoardStyle(background: string = ORCHARD_COLORS.panelWarm): React.CSSProperties {
  return {
    ...orchardCardStyle(background),
    padding: 26,
    borderRadius: 30,
    boxShadow: "0 18px 38px rgba(47,47,47,0.06)",
    outlineOffset: "-11px",
  };
}

export function orchardHeroCardStyle(): React.CSSProperties {
  return {
    ...orchardBoardStyle(ORCHARD_COLORS.panelWarm),
    backgroundImage:
      "linear-gradient(180deg, rgba(255,255,255,0.44) 0%, rgba(255,248,239,0.95) 100%), radial-gradient(circle at 14% 22%, rgba(255,255,255,0.74) 0, rgba(255,255,255,0) 26%), radial-gradient(circle at 86% 18%, rgba(247,214,208,0.26) 0, rgba(247,214,208,0) 22%), radial-gradient(circle at 72% 78%, rgba(242,192,120,0.14) 0, rgba(242,192,120,0) 18%)",
    boxShadow: "0 18px 40px rgba(47,47,47,0.06)",
  };
}

export function orchardSoftCardStyle(background: string = ORCHARD_COLORS.panelAlt): React.CSSProperties {
  return {
    background,
    backgroundImage:
      "linear-gradient(180deg, rgba(255,255,255,0.86) 0%, rgba(255,252,248,0.97) 100%), radial-gradient(circle at 18% 16%, rgba(255,255,255,0.42) 0, rgba(255,255,255,0) 24%)",
    border: `1px solid ${ORCHARD_COLORS.borderSoft}`,
    borderRadius: 22,
    padding: 16,
    boxShadow: "0 8px 16px rgba(47,47,47,0.03)",
    position: "relative",
  };
}

export function orchardPaperLayerStyle(background: string = ORCHARD_COLORS.panelAlt): React.CSSProperties {
  return {
    background,
    backgroundImage:
      "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(255,252,248,0.98) 100%), radial-gradient(circle at 16% 12%, rgba(255,255,255,0.48) 0, rgba(255,255,255,0) 22%)",
    border: `1px solid ${ORCHARD_COLORS.border}`,
    borderRadius: 24,
    padding: 20,
    boxShadow: "0 10px 22px rgba(47,47,47,0.04)",
    position: "relative",
    overflow: "hidden",
  };
}

export function orchardPinnedNoteStyle(
  background: string = ORCHARD_COLORS.panelBlush,
  rotateDeg = -1.2
): React.CSSProperties {
  return {
    background,
    backgroundImage:
      "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,247,243,0.96) 100%), radial-gradient(circle at 18% 20%, rgba(255,255,255,0.42) 0, rgba(255,255,255,0) 24%)",
    border: `1px solid ${ORCHARD_COLORS.borderStrong}`,
    borderRadius: 24,
    padding: 18,
    boxShadow: "0 14px 24px rgba(47,47,47,0.05)",
    position: "relative",
    transform: `rotate(${rotateDeg}deg)`,
    transformOrigin: "top center",
  };
}

export function orchardSectionTitleStyle(): React.CSSProperties {
  return {
    fontWeight: 900,
    fontSize: 22,
    lineHeight: 1.2,
    color: ORCHARD_COLORS.heading,
    marginBottom: 14,
    fontFamily: orchardTokens.typography.headingStack,
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
    padding: "13px 14px",
    borderRadius: 18,
    border: `1px solid ${ORCHARD_COLORS.border}`,
    background: "linear-gradient(180deg, rgba(255,253,251,1) 0%, rgba(255,249,243,1) 100%)",
    color: ORCHARD_COLORS.text,
    outline: "none",
    boxSizing: "border-box",
    boxShadow: "inset 0 1px 2px rgba(47,47,47,0.03), inset 0 0 0 1px rgba(255,255,255,0.42)",
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
    padding: "12px 18px",
    borderRadius: "16px 18px 18px 14px",
    border: `1px solid ${disabled ? ORCHARD_COLORS.border : ORCHARD_COLORS.accentDark}`,
    background: disabled
      ? "#F1ECE5"
      : "linear-gradient(180deg, #6E8B6B 0%, #587053 100%)",
    color: disabled ? ORCHARD_COLORS.muted : "#FFFFFF",
    fontWeight: 800,
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : `0 8px 18px ${ORCHARD_COLORS.shadow}`,
    letterSpacing: "0.01em",
  };
}

export function orchardSecondaryButtonStyle(disabled = false): React.CSSProperties {
  return {
    padding: "12px 18px",
    borderRadius: "16px 18px 18px 14px",
    border: `1px solid ${ORCHARD_COLORS.border}`,
    background: disabled
      ? "#F6F1EA"
      : "linear-gradient(180deg, #FFF8EE 0%, #F9F1E6 100%)",
    color: ORCHARD_COLORS.text,
    fontWeight: 800,
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : "0 5px 12px rgba(47,47,47,0.03)",
    letterSpacing: "0.01em",
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
    padding: "8px 16px",
    borderRadius: "16px 18px 18px 14px",
    boxShadow: `0 6px 14px ${ORCHARD_COLORS.shadow}`,
    border: `1px solid ${ORCHARD_COLORS.accentDark}`,
    marginBottom: 8,
  };
}

export function orchardHeroTitleStyle(): React.CSSProperties {
  return {
    margin: "0 0 10px 0",
    color: ORCHARD_COLORS.heading,
    fontSize: 40,
    lineHeight: 1.08,
    fontFamily: orchardTokens.typography.headingStack,
    letterSpacing: "-0.01em",
  };
}

export function orchardStitchDividerStyle(): React.CSSProperties {
  return {
    height: 0,
    borderTop: `2px dashed ${ORCHARD_COLORS.stitch}`,
    opacity: 0.95,
    marginTop: 10,
    marginBottom: 10,
  };
}
