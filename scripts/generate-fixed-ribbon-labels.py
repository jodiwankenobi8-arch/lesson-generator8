"""
generate-fixed-ribbon-labels.py
================================
Generates 16 fixed baked-text ribbon label PNGs from the existing
brick-floral-stitched-ribbon-label.png source asset.

Output: src/assets/visual/ribbon-labels/fixed-page-labels/
Each PNG is transparent with text composited onto the ribbon surface.

Run from repo root:
  python scripts/generate-fixed-ribbon-labels.py
"""

import os
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
REPO_ROOT = Path(__file__).parent.parent
SOURCE_PNG = REPO_ROOT / "src/assets/visual/ribbon-labels/brick-floral-stitched-ribbon-label.png"
OUT_DIR = REPO_ROOT / "src/assets/visual/ribbon-labels/fixed-page-labels"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# Labels
# ---------------------------------------------------------------------------
LABELS = [
    ("inputs",                  "Planning Notebook"),
    ("materials",               "Source Workbench"),
    ("results",                 "Planning Binder"),
    ("teacher-planning-studio", "Teacher Planning Studio"),
]

# ---------------------------------------------------------------------------
# Size variants  (target display widths; height follows source aspect ratio)
# ---------------------------------------------------------------------------
VARIANTS = {
    "small":  642,
    "medium": 856,
    "large":  1284,
    "xlarge": 1712,
}

# ---------------------------------------------------------------------------
# Font search  (prefer a warm serif)
# ---------------------------------------------------------------------------
FONT_CANDIDATES = [
    r"C:\Windows\Fonts\georgiab.ttf",   # Georgia Bold
    r"C:\Windows\Fonts\georgia.ttf",    # Georgia Regular
    r"C:\Windows\Fonts\garabd.ttf",     # Garamond Bold
    r"C:\Windows\Fonts\times.ttf",      # Times New Roman
    r"C:\Windows\Fonts\timesbd.ttf",    # Times New Roman Bold
    r"C:\Windows\Fonts\palatab.ttf",    # Palatino Linotype Bold
    r"C:\Windows\Fonts\palabi.ttf",     # Palatino Linotype Bold Italic
]

def find_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for path in FONT_CANDIDATES:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                continue
    # Fallback to default bitmap font
    return ImageFont.load_default()

# ---------------------------------------------------------------------------
# Text colors
# ---------------------------------------------------------------------------
CREAM = (253, 248, 238, 255)         # #FDF8EE warm cream/ivory, fully opaque
WARM_GOLD = (243, 238, 220, 80)      # warm golden undertone for subtle inner light, very transparent
SHADOW_DARK = (40, 55, 25, 140)      # warm dark green-brown, semi-transparent; creates inset feel
SHADOW_SOFT = (80, 100, 60, 60)      # softer shadow for embossed effect

def render_text_layer(width: int, height: int, text: str, font) -> Image.Image:
    """
    Render text onto a transparent layer with multi-pass technique to create
    a printed/pressed-into-fabric appearance rather than "text on top" look.
    
    Technique:
    1. Soft shadow layer (embossed/inset feel)
    2. Dark inset shadow (depth)
    3. Main cream text with edge softening
    4. Subtle gold highlight (printed material integration)
    
    Returns an RGBA image the same size as the ribbon.
    """
    layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    # Measure text
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]

    # Center horizontally; position at ~43% height (ribbon center is slightly above mid)
    cx = width // 2
    cy = int(height * 0.43)

    tx = cx - text_w // 2 - bbox[0]
    ty = cy - text_h // 2 - bbox[1]

    shadow_offset = max(1, int(width * 0.012))
    inset_offset = 1

    # --- Layer 1: Soft embossed shadow (creates inset depth) ---
    soft_shadow_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    ssdraw = ImageDraw.Draw(soft_shadow_layer)
    ssdraw.text((tx + shadow_offset, ty + shadow_offset), text, font=font, fill=SHADOW_SOFT)
    soft_shadow_layer = soft_shadow_layer.filter(ImageFilter.GaussianBlur(radius=2.0))

    # --- Layer 2: Darker inset shadow (adds dimensionality, "pressed" feel) ---
    dark_shadow_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    dsdraw = ImageDraw.Draw(dark_shadow_layer)
    dsdraw.text((tx + inset_offset, ty + inset_offset), text, font=font, fill=SHADOW_DARK)
    dark_shadow_layer = dark_shadow_layer.filter(ImageFilter.GaussianBlur(radius=1.2))

    # --- Layer 3: Main cream text with generous softening ---
    # More blur than before to reduce digital crispness; lettering feels hand-printed
    main_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    mdraw = ImageDraw.Draw(main_layer)
    mdraw.text((tx, ty), text, font=font, fill=CREAM)
    main_layer = main_layer.filter(ImageFilter.GaussianBlur(radius=1.0))  # increased from 0.5

    # --- Layer 4: Subtle warm-gold highlight (material integration) ---
    # Optional: very subtle, helps text feel like part of the fabric surface
    gold_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    ggdraw = ImageDraw.Draw(gold_layer)
    # Slight offset up-left to create subtle highlight
    ggdraw.text((tx - shadow_offset // 2, ty - shadow_offset // 2), text, font=font, fill=WARM_GOLD)
    gold_layer = gold_layer.filter(ImageFilter.GaussianBlur(radius=1.5))

    # Composite all layers: soft shadow → dark shadow → main → gold highlight
    layer = Image.alpha_composite(layer, soft_shadow_layer)
    layer = Image.alpha_composite(layer, dark_shadow_layer)
    layer = Image.alpha_composite(layer, main_layer)
    layer = Image.alpha_composite(layer, gold_layer)

    return layer

# ---------------------------------------------------------------------------
# Font size per variant (tuned for readability vs ribbon body height)
# ---------------------------------------------------------------------------
FONT_SIZES = {
    "small":  30,
    "medium": 40,
    "large":  58,
    "xlarge": 76,
}

# ---------------------------------------------------------------------------
# Main generation loop
# ---------------------------------------------------------------------------
def generate():
    source = Image.open(SOURCE_PNG).convert("RGBA")
    src_w, src_h = source.size
    aspect = src_h / src_w

    generated = []

    for slug, text in LABELS:
        for variant, target_w in VARIANTS.items():
            target_h = int(round(target_w * aspect))
            out_name = f"ribbon-{slug}-{variant}.png"
            out_path = OUT_DIR / out_name

            # Scale ribbon
            ribbon = source.resize((target_w, target_h), Image.LANCZOS)

            # Build text layer
            font = find_font(FONT_SIZES[variant])
            text_layer = render_text_layer(target_w, target_h, text, font)

            # Composite text onto ribbon
            result = Image.alpha_composite(ribbon, text_layer)

            # Save transparent PNG
            result.save(out_path, format="PNG", optimize=False)

            file_size_kb = out_path.stat().st_size // 1024
            print(f"  ✓ {out_name}  ({target_w}×{target_h})  {file_size_kb} KB")
            generated.append({"file": out_name, "w": target_w, "h": target_h, "text": text, "variant": variant})

    print(f"\n{len(generated)} files written to {OUT_DIR.relative_to(REPO_ROOT)}")
    return generated

if __name__ == "__main__":
    print(f"Source: {SOURCE_PNG.relative_to(REPO_ROOT)}  ({Image.open(SOURCE_PNG).size})")
    print(f"Output: {OUT_DIR.relative_to(REPO_ROOT)}\n")
    generate()
    print("\nDone. Run visual review before wiring into OrchardRibbon.")
