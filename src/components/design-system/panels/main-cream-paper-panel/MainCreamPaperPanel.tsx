import React from "react";
import "./main-cream-paper-panel.css";
import panelImage from "../../../assets/ui/main-cream-paper-panel/main-cream-paper-panel.png";

export type MainCreamPaperPanelProps = {
  alt?: string;
  className?: string;
  asBackground?: boolean;
};

export default function MainCreamPaperPanel({
  alt = "Main cream paper panel",
  className = "",
  asBackground = false,
}: MainCreamPaperPanelProps) {
  if (asBackground) {
    return (
      <div
        className={["main-cream-paper-panel", className].filter(Boolean).join(" ")}
        aria-label={alt}
        role="img"
      />
    );
  }

  return (
    <img
      src={panelImage}
      alt={alt}
      className={["main-cream-paper-panel__image", className].filter(Boolean).join(" ")}
    />
  );
}
