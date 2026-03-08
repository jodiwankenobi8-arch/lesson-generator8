import React from "react";
import "./main-cream-paper-panel.css";

export const MAIN_CREAM_PAPER_PANEL = {
  id: "main-cream-paper-panel",
  assetNumber: "Asset 02",
  name: "Main Cream Paper Panel",
  version: "1.0.0",
} as const;

export type MainCreamPaperPanelProps = {
  children?: React.ReactNode;
  className?: string;
  showInnerStitch?: boolean;
  minHeight?: number | string;
};

export function MainCreamPaperPanel({
  children,
  className = "",
  showInnerStitch = true,
  minHeight = 480,
}: MainCreamPaperPanelProps) {
  return (
    <section
      className={`asset-02-main-cream-paper-panel ${className}`.trim()}
      data-asset-id={MAIN_CREAM_PAPER_PANEL.id}
      aria-label="Main cream paper panel"
    >
      <div
        className="asset-02-main-cream-paper-panel__inner"
        style={{ minHeight }}
      >
        {showInnerStitch ? (
          <div
            className="asset-02-main-cream-paper-panel__stitch"
            aria-hidden="true"
          />
        ) : null}
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      </div>
    </section>
  );
}

export default MainCreamPaperPanel;