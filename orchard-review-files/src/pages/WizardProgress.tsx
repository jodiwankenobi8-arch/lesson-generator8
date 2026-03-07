import React from "react";
import {
  ORCHARD_COLORS,
  orchardBoardStyle,
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

function chapterTone(isCurrent: boolean, isComplete: boolean) {
  if (isCurrent) {
    return {
      outer: "#EEF5EA",
      inner: "#F9FCF7",
      border: ORCHARD_COLORS.successBorder,
      ribbon: "linear-gradient(180deg, #6E8B6B 0%, #3F5A40 100%)",
      ribbonText: "#FFFFFF",
      chipBg: "#F3F8F1",
      chipBorder: ORCHARD_COLORS.successBorder,
      chipText: ORCHARD_COLORS.heading,
      dot: ORCHARD_COLORS.accentDark,
      shadow: "0 14px 28px rgba(63,90,64,0.10)",
    };
  }

  if (isComplete) {
    return {
      outer: "#FFF7EF",
      inner: "#FFFDF9",
      border: ORCHARD_COLORS.borderStrong,
      ribbon: "linear-gradient(180deg, #F2C078 0%, #D9A85F 100%)",
      ribbonText: "#3F3120",
      chipBg: "#FFF6E8",
      chipBorder: ORCHARD_COLORS.warnBorder,
      chipText: ORCHARD_COLORS.heading,
      dot: "#C59849",
      shadow: "0 10px 20px rgba(47,47,47,0.05)",
    };
  }

  return {
    outer: "#FFFDFC",
    inner: "#FFFDF9",
    border: ORCHARD_COLORS.borderSoft,
    ribbon: "linear-gradient(180deg, #F7D6D0 0%, #EFC5BE 100%)",
    ribbonText: ORCHARD_COLORS.cranberry,
    chipBg: "#FFF7F4",
    chipBorder: ORCHARD_COLORS.border,
    chipText: ORCHARD_COLORS.muted,
    dot: "#D7CFC5",
    shadow: "0 8px 16px rgba(47,47,47,0.03)",
  };
}

function statusLabel(isCurrent: boolean, isComplete: boolean) {
  if (isCurrent) return "Open chapter";
  if (isComplete) return "Ready";
  return "Coming next";
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
        ...orchardBoardStyle("#FFF8F1"),
        padding: 24,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(260px, 0.9fr)",
          gap: 18,
          alignItems: "start",
          marginBottom: 22,
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
          <div style={{ ...orchardHelpTextStyle(), fontSize: 14, maxWidth: 760 }}>
            Keep the lesson arc visible in one place: first set the foundation, then sort the source materials, then
            open the finished package for review, export, and teaching.
          </div>
        </div>

        <div
          style={{
            ...orchardSoftCardStyle("#FFFDF9"),
            border: `1px solid ${ORCHARD_COLORS.borderStrong}`,
            padding: 18,
            boxShadow: "0 12px 22px rgba(47,47,47,0.05)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 900,
              color: ORCHARD_COLORS.cranberry,
              marginBottom: 8,
            }}
          >
            Current chapter
          </div>
          <div
            style={{
              color: ORCHARD_COLORS.heading,
              fontWeight: 900,
              fontSize: 24,
              marginBottom: 4,
            }}
          >
            {STEP_META[current].chapter}
          </div>
          <div
            style={{
              color: ORCHARD_COLORS.heading,
              fontWeight: 800,
              fontSize: 16,
              marginBottom: 8,
            }}
          >
            {STEP_META[current].label}
          </div>
          <div style={{ ...orchardHelpTextStyle(), fontSize: 13, marginBottom: 12 }}>
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

      <div style={{ position: "relative", paddingTop: 10 }}>
        <div
          style={{
            position: "absolute",
            top: 30,
            left: 22,
            right: 22,
            height: 4,
            borderRadius: 999,
            background: "linear-gradient(180deg, #EEE7DE 0%, #E7E2DA 100%)",
            opacity: 0.95,
          }}
        />

        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 14,
          }}
        >
          {STEP_ORDER.map((step, index) => {
            const isCurrent = step === current;
            const isComplete = index < currentIndex;
            const tone = chapterTone(isCurrent, isComplete);

            return (
              <div key={step} style={{ position: "relative", paddingTop: 18 }}>
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    background: tone.dot,
                    border: "4px solid #FFF8F1",
                    boxShadow: "0 0 0 1px rgba(47,47,47,0.06)",
                    zIndex: 2,
                  }}
                />

                <div
                  style={{
                    background: tone.outer,
                    border: `1px solid ${tone.border}`,
                    borderRadius: 28,
                    padding: 8,
                    boxShadow: tone.shadow,
                    minHeight: 232,
                  }}
                >
                  <div
                    style={{
                      background: tone.inner,
                      border: `1px solid ${tone.border}`,
                      borderRadius: 22,
                      padding: 16,
                      minHeight: 214,
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
                          background: tone.ribbon,
                          color: tone.ribbonText,
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
                          width: 36,
                          height: 36,
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
                      <div style={{ ...orchardHelpTextStyle(), fontSize: 14, marginBottom: 8 }}>
                        {STEP_META[step].helper}
                      </div>
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
                        {isComplete ? "Finished spread" : isCurrent ? "Open spread" : "Waiting in sequence"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
