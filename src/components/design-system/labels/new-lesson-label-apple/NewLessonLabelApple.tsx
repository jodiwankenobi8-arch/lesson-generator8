import React from "react";
import "./new-lesson-label-apple.css";

export const NEW_LESSON_LABEL_APPLE = {
  id: "new-lesson-label-apple",
  assetNumber: "Asset 03",
  name: "New Lesson Label Apple",
  version: "1.0.0",
} as const;

export type NewLessonLabelAppleProps = {
  text?: string;
  className?: string;
  scale?: number;
};

export function AppleIconArtwork({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 88 88" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="asset03-apple" cx="35%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#ffd2ac" />
          <stop offset="30%" stopColor="#ef9c74" />
          <stop offset="72%" stopColor="#d76a46" />
          <stop offset="100%" stopColor="#b64b32" />
        </radialGradient>
        <linearGradient id="asset03-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9bb875" />
          <stop offset="100%" stopColor="#6c8a4b" />
        </linearGradient>
      </defs>
      <path d="M46 16c2-8 8-12 16-12-1 7-6 12-15 15l-1-3z" fill="#76533d" />
      <path d="M49 13c9-2 17 2 22 10-9 1-17-1-23-9l1-1z" fill="url(#asset03-leaf)" />
      <path d="M23 33c5-8 13-12 21-12 7 0 16 4 21 12 8 1 16 9 16 22 0 18-14 32-36 32S9 73 9 55c0-14 8-21 14-22z" fill="url(#asset03-apple)" stroke="#8f3c2b" strokeWidth="2" />
      <ellipse cx="31" cy="32" rx="10" ry="6" fill="#ffe0ca" opacity="0.6" transform="rotate(-24 31 32)" />
    </svg>
  );
}

export function BlossomCluster({ className = "" }: { className?: string }) {
  const flowers = [[22, 26], [42, 20], [54, 40], [30, 48]];
  return (
    <svg viewBox="0 0 88 88" className={className} aria-hidden="true">
      {flowers.map(([cx, cy], i) => (
        <g key={i}>
          {[0, 72, 144, 216, 288].map((rot) => (
            <ellipse
              key={rot}
              cx={cx}
              cy={cy - 10}
              rx={6.5}
              ry={11}
              fill="#fff7f2"
              stroke="#e6d9d1"
              strokeWidth="1"
              transform={`rotate(${rot} ${cx} ${cy})`}
            />
          ))}
          <circle cx={cx} cy={cy} r="4" fill="#e3c176" />
        </g>
      ))}
    </svg>
  );
}

export function NewLessonLabelApple({
  text = "New Lesson",
  className = "",
  scale = 1,
}: NewLessonLabelAppleProps) {
  return (
    <div
      className={`asset-03-new-lesson-label-apple ${className}`.trim()}
      data-asset-id={NEW_LESSON_LABEL_APPLE.id}
      style={{ transform: `scale(${scale})`, transformOrigin: "left center" }}
      aria-label={text}
    >
      <div className="asset-03-new-lesson-label-apple__art">
        <AppleIconArtwork className="h-full w-full" />
        <div className="asset-03-new-lesson-label-apple__blossoms">
          <BlossomCluster className="h-full w-full" />
        </div>
      </div>
      <div className="asset-03-new-lesson-label-apple__label">{text}</div>
    </div>
  );
}

export default NewLessonLabelApple;