import React from "react";
import {
  ORCHARD_COLORS,
  orchardCardStyle,
  orchardHelpTextStyle,
  orchardRibbonHeaderStyle,
  orchardSoftCardStyle,
  orchardStitchDividerStyle,
} from "./orchardUi";

export type WizardStepKey = "inputs" | "materials" | "results";

const STEP_ORDER: WizardStepKey[] = ["inputs", "materials", "results"];

const STEP_META: Record<
  WizardStepKey,
  {
    label: string;
    helper: string;
    chapter: string;
    summary: string;
  }
> = {
  inputs: {
    label: "Inputs",
    helper: "Set the lesson foundation",
    chapter: "Chapter One",
    summary: "Lesson details, teaching goal, standards, and group notes",
  },
  materials: {
    label: "Materials",
    helper: "Lay out curriculum and exemplars",
    chapter: "Chapter Two",
    summary: "Source files, model lessons, links, and influence checks",
  },
  results: {
    label: "Results",
    helper: "Review, export, and teach",
    chapter: "Final Chapter",
    summary: "Slides, teacher plan, centers, interventions, and exports",
  },
};

function chapterTone(step: WizardStepKey, isCurrent: boolean, isComplete: boolean) {
  if (isCurrent) {
    return {
      mat: "#EEF5EA",
      inner: "#F9FCF7",
      border: ORCHARD_COLORS.successBorder,
      tabBg: "linear-gradient(180deg, #6E8B6B 0%, #3F5A40 100%)",
      tabColor: "#FFFFFF",
      chipBg: "#F3F8F1",
      chipBorder: ORCHARD_COLORS.successBorder,
      chipText: ORCHARD_COLORS.heading,
    };
  }

  if (isComplete) {
    return {
      mat: "#FFF7EF",
      inner: "#FFFDF9",
      border: ORCHARD_COLORS.borderStrong,
      tabBg: "linear-gradient(180deg, #F2C078 0%, #D9A85F 100%)",
      tabColor: "#3F3120",
      chipBg: "#FFF6E8",
      chipBorder: ORCHARD_COLORS.warnBorder,
      chipText: ORCHARD_COLORS.heading,
    };
  }

  return {
    mat: "#FFFDFC",
    inner: "#FFFDF9",
    border: ORCHARD_COLORS.borderSoft,
    tabBg: "linear-gradient(180deg, #F7D6D0 0%, #EFC5BE 100%)",
    tabColor: ORCHARD_COLORS.cranberry,
    chipBg: "#FFF7F4",
    chipBorder: ORCHARD_COLORS.border,
    chipText: ORCHARD_COLORS.muted,
  };
}

function statusLabel(isCurrent: boolean, isComplete: boolean) {
  if (isCurrent) return "Open now";
  if (isComplete) return "Pressed + ready";
  return "Waiting in the stack";
}

export function WizardProgress({
  current,
}: {
  current: WizardStepKey;
}) {
  const currentIndex = STEP_ORDER.indexOf(current);

  return (
    <div
      style={{
        ...orchardCardStyle("#FFF8F1"),
        padding: 24,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.6fr) minmax(250px, 0.84fr)",
          gap: 16,
          alignItems: "start",
          marginBottom: 18,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={orchardRibbonHeaderStyle()}>Lesson Storyboard</div>
          <div style={orchardStitchDividerStyle()} />
          <div
            style={{
              fontFamily: '"Libre Baskerville", "Playfair Display", Georgia, serif',
              color: ORCHARD_COLORS.heading,
              fontWeight: 700,
              fontSize: 30,
              lineHeight: 1.08,
              marginBottom: 10,
            }}
          >
            Move from planner pages to a teach-ready lesson package
          </div>
          <div style={{ ...orchardHelpTextStyle(), fontSize: 14 }}>
            Keep the full lesson arc visible: first set the foundation, then sort the materials, then open the finished
            package for review and export.
          </div>
        </div>

        <div
          style={{
            ...orchardSoftCardStyle("#FFFDF9"),
            border: `1px solid ${ORCHARD_COLORS.borderStrong}`,
            padding: 18,
            boxShadow: "0 10px 22px rgba(47,47,47,0.05)",
            transform: "rotate(-1deg)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 900,
              color: ORCHARD_COLORS.cranberry,
              marginBottom: 6,
            }}
          >
            Now open
          </div>
          <div
            style={{
              color: ORCHARD_COLORS.heading,
              fontWeight: 900,
              fontSize: 22,
              marginBottom: 6,
            }}
          >
            {STEP_META[current].chapter}
          </div>
          <div style={{ ...orchardHelpTextStyle(), fontSize: 13, marginBottom: 10 }}>
            {STEP_META[current].summary}
          </div>
          <div
            style={{
              display: "inline-block",
              padding: "6px 10px",
              borderRadius: 999,
              border: `1px solid ${ORCHARD_COLORS.border}`,
              background: "#FFF7F2",
              color: ORCHARD_COLORS.heading,
              fontWeight: 800,
              fontSize: 12,
            }}
          >
            {currentIndex + 1} of {STEP_ORDER.length}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {STEP_ORDER.map((step, index) => {
          const isCurrent = step === current;
          const isComplete = index < currentIndex;
          const tone = chapterTone(step, isCurrent, isComplete);

          return (
            <div
              key={step}
              style={{
                background: tone.mat,
                border: `1px solid ${tone.border}`,
                borderRadius: 28,
                padding: 8,
                boxShadow: isCurrent ? "0 12px 24px rgba(63,90,64,0.08)" : "0 6px 14px rgba(47,47,47,0.03)",
              }}
            >
              <div
                style={{
                  background: tone.inner,
                  border: `1px solid ${tone.border}`,
                  borderRadius: 22,
                  padding: 16,
                  minHeight: 200,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      padding: "7px 12px",
                      borderRadius: "15px 16px 16px 12px",
                      background: tone.tabBg,
                      color: tone.tabColor,
                      fontWeight: 900,
                      fontSize: 11,
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      border: `1px solid ${isCurrent ? ORCHARD_COLORS.accentDark : tone.border}`,
                      boxShadow: "0 5px 12px rgba(47,47,47,0.05)",
                    }}
                  >
                    {STEP_META[step].chapter}
                  </div>

                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 999,
                      display: "grid",
                      placeItems: "center",
                      background: isCurrent ? ORCHARD_COLORS.accentDark : "#FFF8EE",
                      color: isCurrent ? "#FFFFFF" : ORCHARD_COLORS.heading,
                      fontWeight: 900,
                      border: `1px solid ${isCurrent ? ORCHARD_COLORS.accentDark : ORCHARD_COLORS.borderStrong}`,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      color: ORCHARD_COLORS.heading,
                      fontWeight: 900,
                      fontSize: 22,
                      marginBottom: 6,
                    }}
                  >
                    {STEP_META[step].label}
                  </div>
                  <div style={{ ...orchardHelpTextStyle(), fontSize: 14, marginBottom: 8 }}>{STEP_META[step].helper}</div>
                  <div
                    style={{
                      fontSize: 13,
                      lineHeight: 1.55,
                      color: ORCHARD_COLORS.muted,
                    }}
                  >
                    {STEP_META[step].summary}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      padding: "6px 10px",
                      borderRadius: 999,
                      background: tone.chipBg,
                      border: `1px solid ${tone.chipBorder}`,
                      color: tone.chipText,
                      fontWeight: 800,
                      fontSize: 12,
                    }}
                  >
                    {statusLabel(isCurrent, isComplete)}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: ORCHARD_COLORS.muted,
                    }}
                  >
                    {isComplete ? "Storyboard pressed" : isCurrent ? "Open chapter" : "Next stack"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
