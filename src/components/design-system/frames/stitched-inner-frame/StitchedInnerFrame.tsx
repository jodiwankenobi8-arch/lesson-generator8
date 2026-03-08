import React from "react";
import "./stitched-inner-frame.css";

export const STITCHED_INNER_FRAME = {
  stroke: "#BA9C7E",
  highlight: "rgba(248, 240, 232, 0.55)",
  strokeWidth: 5,
  radius: 36,
  dashLength: 10,
  dashGap: 14,
  inset: 70,
} as const;

export const stitchedInnerFrameStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
  borderRadius: `${STITCHED_INNER_FRAME.radius}px`,
  pointerEvents: "none",
};

type StitchedInnerFrameProps = {
  className?: string;
  style?: React.CSSProperties;
  inset?: number;
  radius?: number;
  "aria-hidden"?: boolean;
};

export function StitchedInnerFrame({
  className = "",
  style,
  inset = STITCHED_INNER_FRAME.inset,
  radius = STITCHED_INNER_FRAME.radius,
  "aria-hidden": ariaHidden = true,
}: StitchedInnerFrameProps) {
  return (
    <div
      aria-hidden={ariaHidden}
      className={`ao-stitched-inner-frame ${className}`.trim()}
      style={
        {
          ...stitchedInnerFrameStyle,
          ...style,
          ["--ao-stitched-inner-frame-inset" as string]: `${inset}px`,
          ["--ao-stitched-inner-frame-radius" as string]: `${radius}px`,
        } as React.CSSProperties
      }
    />
  );
}

export default StitchedInnerFrame;
