import React from "react";
import "./lesson-title-ribbon.css";

export const LESSON_TITLE_RIBBON = {
  id: "asset-05-lesson-title-ribbon",
  name: "Asset 05: lesson-title-ribbon",
  category: "ribbon",
  version: "2.0.0"
} as const;

export type LessonTitleRibbonProps = {
  className?: string;
  title?: string;
  showOverlayTitle?: boolean;
  responsive?: boolean;
  ariaLabel?: string;
};

export function LessonTitleRibbon({
  className = "",
  title = "Lesson Title",
  showOverlayTitle = false,
  responsive = true,
  ariaLabel = "Lesson title ribbon"
}: LessonTitleRibbonProps) {
  const classes = [
    "lesson-title-ribbon",
    responsive ? "lesson-title-ribbon--responsive" : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <div
      className={classes}
      data-asset-id={LESSON_TITLE_RIBBON.id}
      aria-label={ariaLabel}
      role="img"
    >
      {showOverlayTitle ? (
        <span className="lesson-title-ribbon__overlayTitle">{title}</span>
      ) : null}
    </div>
  );
}

export default LessonTitleRibbon;
