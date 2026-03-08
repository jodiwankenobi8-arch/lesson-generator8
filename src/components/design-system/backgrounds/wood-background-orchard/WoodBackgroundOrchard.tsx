import React from "react";
import "./wood-background-orchard.css";

export const WOOD_BACKGROUND_ORCHARD = {
  id: "asset-01-wood-background-orchard",
  name: "Asset 01: wood-background-orchard",
  category: "background",
  version: "1.0.0"
} as const;

export type WoodBackgroundOrchardProps = {
  children?: React.ReactNode;
  className?: string;
  minHeight?: string | number;
};

export function WoodBackgroundOrchard({
  children,
  className = "",
  minHeight = "100vh"
}: WoodBackgroundOrchardProps) {
  return (
    <div
      className={["wood-background-orchard", className].filter(Boolean).join(" ")}
      style={{ minHeight }}
      data-asset-id={WOOD_BACKGROUND_ORCHARD.id}
    >
      {children}
    </div>
  );
}

export default WoodBackgroundOrchard;
