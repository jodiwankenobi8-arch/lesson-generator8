/**
 * SmartAssetLabel
 *
 * Renders a real blank hand-drawn PNG ribbon/label asset as a decorative
 * background layer, with real accessible HTML text overlaid on top.
 *
 * ## Asset-variant strategy
 *
 * Labels come in multiple physical sizes so the art never needs to be
 * stretched uncomfortably.  The caller picks a variant, or lets the component
 * auto-pick based on text length.
 *
 *   small    � very short text (= 8 chars)   ? narrower asset
 *   medium   � short-to-mid text (9�18 chars) ? standard ribbon width
 *   large    � mid-length text (19�30 chars)  ? wider ribbon
 *   xlarge   � long text (31+ chars)          ? widest ribbon
 *   two-line � text that wraps or is very long ? taller asset variant
 *
 * ## Authoring constraint
 *
 * Images are BLANK backgrounds / material layers only.
 * All text that belongs in the label must be passed as children and will be
 * rendered as real HTML � never baked into the PNG.
 *
 * ## Current status: SCAFFOLD (no production wiring)
 *
 * The variant-to-asset map below will be filled in once the actual blank
 * multi-size PNG cut-outs pass visual review.  Until then, every variant
 * falls back to the single available ribbon asset.
 */

import type { CSSProperties, ReactNode } from "react"

// ---------------------------------------------------------------------------
// Asset imports
// ---------------------------------------------------------------------------
// Placeholder: one real asset available now.
// Add more imports here when the blank multi-size variant assets are ready.
import brickRibbon from "../assets/visual/ribbon-labels/brick-floral-stitched-ribbon-label.png"

// Source natural dimensions for each asset (px).
// Used to compute the display height from a desired display width.
const ASSET_NATURAL = {
  brick: { w: 936, h: 377 },
} as const

// ---------------------------------------------------------------------------
// Variant configuration
// ---------------------------------------------------------------------------

export type AssetLabelVariant = "small" | "medium" | "large" | "xlarge" | "two-line"

/**
 * Per-variant display configuration.
 * `asset` will expand to per-variant PNG imports once those assets exist.
 */
const VARIANT_CONFIG: Record<
  AssetLabelVariant,
  {
    /** Source image import to use as background layer */
    asset: string
    /** Natural dimensions of that asset */
    natural: { w: number; h: number }
    /** Display width (px) */
    displayW: number
    /** Inline padding as % of display width � keeps text inside the art bounds */
    paddingInlinePct: number
    /** Bottom offset as % of display height � accounts for ribbon shadow/tail depth */
    paddingBottomPct: number
    /** Font size (px) */
    fontSize: number
  }
> = {
  // -- When blank multi-size variants are available, replace `asset` and
  // -- `natural` per row with the correct import and natural dimensions.
  small: {
    asset: brickRibbon,   // TODO: replace with small-variant blank PNG
    natural: ASSET_NATURAL.brick,
    displayW: 220,
    paddingInlinePct: 16,
    paddingBottomPct: 6,
    fontSize: 13,
  },
  medium: {
    asset: brickRibbon,   // TODO: replace with medium-variant blank PNG
    natural: ASSET_NATURAL.brick,
    displayW: 310,
    paddingInlinePct: 15,
    paddingBottomPct: 6,
    fontSize: 14,
  },
  large: {
    asset: brickRibbon,   // TODO: replace with large-variant blank PNG
    natural: ASSET_NATURAL.brick,
    displayW: 390,
    paddingInlinePct: 14,
    paddingBottomPct: 6,
    fontSize: 14,
  },
  xlarge: {
    asset: brickRibbon,   // TODO: replace with xlarge-variant blank PNG
    natural: ASSET_NATURAL.brick,
    displayW: 460,
    paddingInlinePct: 13,
    paddingBottomPct: 6,
    fontSize: 14,
  },
  "two-line": {
    asset: brickRibbon,   // TODO: replace with tall/two-line blank PNG
    natural: ASSET_NATURAL.brick,
    displayW: 360,
    paddingInlinePct: 15,
    paddingBottomPct: 8,
    fontSize: 14,
  },
}

// ---------------------------------------------------------------------------
// Auto-pick helper
// ---------------------------------------------------------------------------

/**
 * Choose the best variant for the given text string when no explicit variant
 * is provided by the caller.
 */
export function pickVariantForText(text: string): AssetLabelVariant {
  const len = text.trim().length
  if (len <= 8) return "small"
  if (len <= 18) return "medium"
  if (len <= 30) return "large"
  return "xlarge"
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export type SmartAssetLabelProps = {
  /** Override the auto-picked size variant */
  variant?: AssetLabelVariant
  /** Additional wrapper style � layout / positioning overrides from parent */
  style?: CSSProperties
  /** The label text.  Must be real HTML � never bake text into assets. */
  children: ReactNode
  /** Accessible label when the text alone is insufficient context */
  "aria-label"?: string
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function SmartAssetLabel({
  variant,
  style,
  children,
  "aria-label": ariaLabel,
}: SmartAssetLabelProps) {
  // Determine variant � auto-pick from text length when not specified
  const resolvedVariant: AssetLabelVariant =
    variant ??
    (typeof children === "string" ? pickVariantForText(children) : "medium")

  const cfg = VARIANT_CONFIG[resolvedVariant]
  const displayH = Math.round(cfg.natural.h * (cfg.displayW / cfg.natural.w))

  const wrapStyle: CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "start",
    width: cfg.displayW,
    height: displayH,
    ...style,
  }

  const imgStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "fill",
    filter: "drop-shadow(0 6px 14px rgba(63, 90, 64, 0.16))",
    pointerEvents: "none",
    userSelect: "none",
  }

  const textStyle: CSSProperties = {
    position: "relative",
    zIndex: 1,
    paddingInline: `${cfg.paddingInlinePct}%`,
    paddingBottom: `${cfg.paddingBottomPct}%`,
    color: "#FDF8EE",
    fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
    fontSize: cfg.fontSize,
    fontWeight: 700,
    lineHeight: 1.2,
    textAlign: "center",
    textShadow: "0 1px 1px rgba(55, 71, 45, 0.20)",
    userSelect: "none",
    maxWidth: "100%",
    overflowWrap: "break-word",
  }

  return (
    <div style={wrapStyle} aria-label={ariaLabel}>
      <img
        src={cfg.asset}
        alt=""
        aria-hidden="true"
        style={imgStyle}
      />
      <span style={textStyle}>{children}</span>
    </div>
  )
}
