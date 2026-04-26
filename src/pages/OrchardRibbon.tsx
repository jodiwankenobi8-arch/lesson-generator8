import type { CSSProperties } from "react"

type OrchardRibbonProps = {
  text: string
}

const wrapStyle: CSSProperties = {
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  alignSelf: "start",
  width: 356,
  height: 72,
  marginBottom: 8,
  overflow: "visible",
}

const svgStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  filter: "drop-shadow(0 6px 14px rgba(63, 90, 64, 0.14)) drop-shadow(0 2px 3px rgba(90, 54, 58, 0.14))",
}

const textFrameStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  paddingLeft: 56,
  paddingRight: 56,
  boxSizing: "border-box",
  pointerEvents: "none",
}

const textStyle: CSSProperties = {
  color: "#FDF8EE",
  fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
  fontSize: 15,
  fontWeight: 700,
  letterSpacing: 0,
  lineHeight: 1,
  textTransform: "none",
  textAlign: "center",
  whiteSpace: "nowrap",
  textShadow: "0 1px 1px rgba(55, 71, 45, 0.24)",
  userSelect: "none",
  transform: "translateY(-6px)",
}

export function OrchardRibbon({ text }: OrchardRibbonProps) {
  return (
    <div style={wrapStyle} aria-hidden="true">
      <svg viewBox="0 0 356 72" role="presentation" focusable="false" style={svgStyle}>
        <defs>
          <linearGradient id="orchard-ribbon-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B7C978" />
            <stop offset="44%" stopColor="#9DB567" />
            <stop offset="72%" stopColor="#8DA45D" />
            <stop offset="100%" stopColor="#7A8F48" />
          </linearGradient>
          <linearGradient id="orchard-ribbon-tail" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9DB667" />
            <stop offset="100%" stopColor="#627438" />
          </linearGradient>
          <radialGradient id="orchard-ribbon-highlight" cx="50%" cy="0%" r="90%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
            <stop offset="52%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <linearGradient id="orchard-ribbon-cranberry-wash" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(172, 87, 95, 0.14)" />
            <stop offset="50%" stopColor="rgba(172, 87, 95, 0.06)" />
            <stop offset="100%" stopColor="rgba(172, 87, 95, 0.14)" />
          </linearGradient>
          <linearGradient id="orchard-ribbon-fold-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(67, 83, 41, 0.08)" />
            <stop offset="100%" stopColor="rgba(67, 83, 41, 0.28)" />
          </linearGradient>
          <linearGradient id="orchard-ribbon-vcut-shadow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6D8140" />
            <stop offset="100%" stopColor="#4F612B" />
          </linearGradient>
        </defs>

        <path
          d="M14 18 L42 12 L36 58 L10 54 C16 42 16 30 14 18 Z"
          fill="url(#orchard-ribbon-tail)"
          stroke="#617333"
          strokeWidth="1.25"
        />
        <path
          d="M342 18 L314 12 L320 58 L346 54 C340 42 340 30 342 18 Z"
          fill="url(#orchard-ribbon-tail)"
          stroke="#617333"
          strokeWidth="1.25"
        />
        <path d="M36 44 L56 52 L36 62 Z" fill="url(#orchard-ribbon-vcut-shadow)" opacity="0.94" />
        <path d="M320 44 L300 52 L320 62 Z" fill="url(#orchard-ribbon-vcut-shadow)" opacity="0.94" />
        <path d="M13 20 L40 15 L36 54 L12 51" fill="none" stroke="#B9CC83" strokeWidth="1" opacity="0.26" />
        <path d="M343 20 L316 15 L320 54 L344 51" fill="none" stroke="#B9CC83" strokeWidth="1" opacity="0.26" />

        <path
          d="M46 11 H310 C319 11 327 18 327 27 V42 C327 51 319 58 310 58 H46 C37 58 29 51 29 42 V27 C29 18 37 11 46 11 Z"
          fill="url(#orchard-ribbon-fill)"
          stroke="#6A7F3C"
          strokeWidth="1.5"
        />
        <path
          d="M46 11 H310 C319 11 327 18 327 27 V42 C327 51 319 58 310 58 H46 C37 58 29 51 29 42 V27 C29 18 37 11 46 11 Z"
          fill="url(#orchard-ribbon-cranberry-wash)"
          opacity="0.85"
        />
        <path
          d="M46 11 H310 C319 11 327 18 327 27 V42 C327 51 319 58 310 58 H46 C37 58 29 51 29 42 V27 C29 18 37 11 46 11 Z"
          fill="url(#orchard-ribbon-highlight)"
          opacity="0.82"
        />
        <path
          d="M46 58 H310 C319 58 327 51 327 42 V39 H29 V42 C29 51 37 58 46 58 Z"
          fill="url(#orchard-ribbon-fold-shadow)"
          opacity="0.42"
        />
        <path
          d="M52 17 H304 C311 17 316 20 319 25"
          fill="none"
          stroke="rgba(248, 242, 220, 0.9)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        <path
          d="M52 19 H304 C312 19 318 23 320 29"
          fill="none"
          stroke="#F5ECCA"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="6 9"
        />
        <path
          d="M52 49 H304 C312 49 318 45 320 39"
          fill="none"
          stroke="#F5ECCA"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="6 9"
        />

        <path d="M29 27 C34 31 39 34 46 36" fill="none" stroke="#667A3A" strokeWidth="1.15" opacity="0.62" />
        <path d="M327 27 C322 31 317 34 310 36" fill="none" stroke="#667A3A" strokeWidth="1.15" opacity="0.62" />
      </svg>

      <div style={textFrameStyle}>
        <span style={textStyle}>{text}</span>
      </div>
    </div>
  )
}