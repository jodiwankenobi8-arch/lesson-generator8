import React from "react";
import { ORCHARD_COLORS, orchardSoftCardStyle } from "./orchardUi";

export type WizardStepKey = "inputs" | "materials" | "results";

const STEP_ORDER: WizardStepKey[] = ["inputs", "materials", "results"];

const STEP_META: Record<WizardStepKey, { label: string; helper: string; chapter: string }> = {
  inputs: {
    label: "Inputs",
    helper: "Set the lesson foundation",
    chapter: "Chapter One",
  },
  materials: {
    label: "Materials",
    helper: "Lay out curriculum and exemplars",
    chapter: "Chapter Two",
  },
  results: {
    label: "Results",
    helper: "Review, export, and teach",
    chapter: "Final Chapter",
  },
};

export function WizardProgress({
  current,
}: {
  current: WizardStepKey;
}) {
  const currentIndex = STEP_ORDER.indexOf(current);

  return (
    <div
      style={{
        ...orchardSoftCardStyle("#FFFDF9"),
        marginBottom: 18,
        border: `1px solid ${ORCHARD_COLORS.border}`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              fontWeight: 900,
              color: ORCHARD_COLORS.heading,
              marginBottom: 4,
              fontSize: 15,
            }}
          >
            Lesson Storyboard
          </div>
          <div
            style={{
              color: ORCHARD_COLORS.muted,
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            Move from planning, to source materials, to a finished lesson package.
          </div>
        </div>

        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: ORCHARD_COLORS.accentDark,
            background: "#F5EFE4",
            border: `1px solid ${ORCHARD_COLORS.border}`,
            borderRadius: 999,
            padding: "6px 10px",
          }}
        >
          {STEP_META[current].chapter}
        </div>
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
            ? "linear-gradient(180deg, #EEF5EA 0%, #F9FCF7 100%)"
            : isComplete
              ? "linear-gradient(180deg, #F6F3EC 0%, #FFFDF9 100%)"
              : "linear-gradient(180deg, #FFFDF9 0%, #FFFCF7 100%)";

          const border = isCurrent
            ? ORCHARD_COLORS.successBorder
            : isComplete
              ? ORCHARD_COLORS.borderStrong
              : ORCHARD_COLORS.borderSoft;

          return (
            <div
              key={step}
              style={{
                border: `1px solid ${border}`,
                background,
                borderRadius: 18,
                padding: 12,
                minWidth: 0,
                boxShadow: isCurrent ? "0 6px 14px rgba(63,90,64,0.08)" : "0 2px 6px rgba(47,47,47,0.02)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12,
                    fontWeight: 900,
                    color: isCurrent ? "#FFFFFF" : ORCHARD_COLORS.accentDark,
                    background: isCurrent
                      ? `linear-gradient(180deg, ${ORCHARD_COLORS.accent} 0%, ${ORCHARD_COLORS.accentDark} 100%)`
                      : isComplete
                        ? "#F0EADF"
                        : "#FBF7F0",
                    border: `1px solid ${isCurrent ? ORCHARD_COLORS.accentDark : ORCHARD_COLORS.border}`,
                  }}
                >
                  {index + 1}
                </div>

                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: isCurrent ? ORCHARD_COLORS.accentDark : ORCHARD_COLORS.muted,
                  }}
                >
                  {isComplete ? "Complete" : isCurrent ? "Current" : STEP_META[step].chapter}
                </div>
              </div>

              <div
                style={{
                  fontWeight: 900,
                  color: ORCHARD_COLORS.heading,
                  marginBottom: 4,
                }}
              >
                {STEP_META[step].label}
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: ORCHARD_COLORS.muted,
                  lineHeight: 1.45,
                }}
              >
                {STEP_META[step].helper}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
