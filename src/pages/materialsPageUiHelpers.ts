import React from "react"
import type { MaterialRole, MaterialStatus } from "../engine/types"
import {
  orchardButtonStyle,
  orchardNoticeStyle,
  orchardSoftCardStyle,
  orchardStatusBadgeStyle,
  orchardTagStyle,
} from "./orchardUi"

export function formatRoleLabel(role: MaterialRole): string {
  return role === "curriculum" ? "Curriculum" : "Exemplar"
}

export function formatStatus(status: MaterialStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function miniTagStyle(role: MaterialRole): React.CSSProperties {
  return orchardTagStyle(role === "curriculum" ? "moss" : "cranberry")
}

export function roleBadgeStyle(role: MaterialRole): React.CSSProperties {
  return orchardTagStyle(role === "curriculum" ? "moss" : "cranberry")
}

export function statusBadgeStyle(status: MaterialStatus): React.CSSProperties {
  if (status === "ready") return orchardStatusBadgeStyle("moss")
  if (status === "error") return orchardStatusBadgeStyle("cranberry")
  return orchardStatusBadgeStyle("honey")
}

export function uploadCardStyle(role: MaterialRole, dragging: boolean): React.CSSProperties {
  return {
    ...orchardSoftCardStyle,
    background:
      role === "curriculum"
        ? "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,246,233,0.82))"
        : "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,214,208,0.18))",
    border: dragging
      ? "1px solid var(--orchard-green)"
      : "1px solid rgba(231, 226, 218, 0.96)",
    boxShadow: dragging ? "0 0 0 3px rgba(110, 139, 107, 0.12)" : orchardSoftCardStyle.boxShadow,
  }
}

export function dropZoneStyle(dragging: boolean): React.CSSProperties {
  return {
    display: "grid",
    gap: 12,
    justifyItems: "center",
    padding: "18px 16px",
    borderRadius: "var(--radius-md)",
    border: dragging
      ? "2px dashed var(--orchard-green)"
      : "2px dashed rgba(110, 139, 107, 0.28)",
    background: dragging ? "rgba(110, 139, 107, 0.08)" : "rgba(255, 255, 255, 0.76)",
  }
}

export function primaryButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    ...orchardButtonStyle({ active: !disabled }),
    opacity: disabled ? 0.7 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    boxShadow: disabled ? "none" : "var(--shadow-soft)",
    border: disabled ? "1px solid var(--border-soft)" : "1px solid var(--orchard-green)",
    background: disabled ? "var(--warm-gray)" : "var(--orchard-green)",
    color: disabled ? "var(--text-secondary)" : "var(--paper-white)",
  }
}

export function buttonStyle(): React.CSSProperties {
  return {
    ...orchardButtonStyle({ subtle: true }),
    cursor: "pointer",
    fontWeight: 700,
  }
}

export function secondaryButtonStyle(): React.CSSProperties {
  return {
    ...orchardButtonStyle({ subtle: true }),
    padding: "8px 10px",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
  }
}

export function noticeStyle(mode: "idle" | "processing" | "ready"): React.CSSProperties {
  if (mode === "ready") {
    return {
      ...orchardNoticeStyle,
      background: "rgba(110, 139, 107, 0.14)",
      border: "1px solid var(--border-moss)",
      color: "var(--deep-orchard)",
    }
  }

  if (mode === "processing") {
    return {
      ...orchardNoticeStyle,
      background: "rgba(242, 192, 120, 0.20)",
      border: "1px solid var(--border-honey)",
      color: "var(--warm-brown)",
    }
  }

  return {
    ...orchardNoticeStyle,
  }
}
