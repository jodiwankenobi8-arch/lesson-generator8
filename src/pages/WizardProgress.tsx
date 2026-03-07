import React from "react";
import { ORCHARD_COLORS, orchardSoftCardStyle } from "./orchardUi";

export type WizardStepKey = "inputs" | "materials" | "results";

const STEP_ORDER: WizardStepKey[] = ["inputs", "materials", "results"];

const STEP_META: Record<WizardStepKey, { label: string; helper: string }> = {
  inputs: {
    label: "Inputs",
    helper: "Set the lesson foundation",
  },
  materials: {
    label: "Materials",
    helper: "Add curriculum and exemplars",
  },
  results: {
    label: "Results",
    helper: "Review, export, and teach",
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
        Lesson workflow
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

          return (
            <div
              key={step}
              style={{
                border: `1px solid ${border}`,
                background,
                borderRadius: 16,
                padding: 12,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: ORCHARD_COLORS.accentDark,
                  marginBottom: 4,
                }}
              >
                {isComplete ? "Done" : isCurrent ? "Current" : `Step ${index + 1}`}
              </div>

              <div
                style={{
                  fontWeight: 800,
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
