import React from "react";
import { useNavigate } from "react-router-dom";
import { ORCHARD_COLORS, orchardSoftCardStyle } from "./orchardUi";

export type WizardStepKey = "inputs" | "materials" | "results";

const STEP_ORDER: WizardStepKey[] = ["inputs", "materials", "results"];

const STEP_META: Record<
  WizardStepKey,
  { label: string; helper: string; path: string }
> = {
  inputs: {
    label: "Inputs",
    helper: "Set the lesson foundation",
    path: "/",
  },
  materials: {
    label: "Materials",
    helper: "Lay out curriculum and exemplars",
    path: "/materials",
  },
  results: {
    label: "Results",
    helper: "Review, export, and teach",
    path: "/results",
  },
};

export function WizardProgress({
  current,
}: {
  current: WizardStepKey;
}) {
  const navigate = useNavigate();
  const currentIndex = STEP_ORDER.indexOf(current);

  return (
    <div
      style={{
        ...orchardSoftCardStyle("#FFFDF9"),
        marginBottom: 18,
        border: `1px solid ${ORCHARD_COLORS.border}`,
      }}
    >
      <div
        style={{
          fontWeight: 800,
          color: ORCHARD_COLORS.heading,
          marginBottom: 10,
          fontSize: 14,
        }}
      >
        Lesson Storyboard
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        {STEP_ORDER.map((step, index) => {
          const isCurrent = step === current;
          const isComplete = index < currentIndex;

          const background = isCurrent
            ? ORCHARD_COLORS.success
            : isComplete
              ? "#F4F7F1"
              : ORCHARD_COLORS.panelAlt;

          const border = isCurrent
            ? ORCHARD_COLORS.successBorder
            : isComplete
              ? ORCHARD_COLORS.borderStrong
              : ORCHARD_COLORS.borderSoft;

          const topLabel = isCurrent
            ? "Current chapter"
            : isComplete
              ? "Ready"
              : `Chapter ${index + 1}`;

          const bottomLabel = isCurrent
            ? "Open chapter"
            : isComplete
              ? "Finished spread"
              : "Open spread";

          return (
            <button
              key={step}
              type="button"
              onClick={() => navigate(STEP_META[step].path)}
              style={{
                border: `1px solid ${border}`,
                background,
                borderRadius: 16,
                padding: 12,
                minWidth: 0,
                width: "100%",
                textAlign: "left",
                cursor: "pointer",
                font: "inherit",
                color: "inherit",
                boxShadow: "none",
              }}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`Go to ${STEP_META[step].label}`}
              title={`Go to ${STEP_META[step].label}`}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: ORCHARD_COLORS.accentDark,
                  marginBottom: 6,
                }}
              >
                {topLabel}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 999,
                    border: `1px solid ${border}`,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: 13,
                    background: "#fff",
                    color: ORCHARD_COLORS.heading,
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </div>

                <div
                  style={{
                    fontWeight: 800,
                    color: ORCHARD_COLORS.heading,
                    minWidth: 0,
                  }}
                >
                  {STEP_META[step].label}
                </div>
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: ORCHARD_COLORS.muted,
                  lineHeight: 1.45,
                  marginBottom: 8,
                }}
              >
                {STEP_META[step].helper}
              </div>

              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: ORCHARD_COLORS.accentDark,
                }}
              >
                {bottomLabel}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
