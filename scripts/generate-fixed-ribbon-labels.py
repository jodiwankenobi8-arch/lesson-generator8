"""
generate-fixed-ribbon-labels.py
================================
Generates 16 fixed baked-text ribbon label PNGs from the existing
green-floral-stitched-ribbon-label.png source asset.

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
SOURCE_PNG = REPO_ROOT / "src/assets/visual/ribbon-labels/green-floral-stitched-ribbon-label.png"
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
# Text rendering helpers
# ---------------------------------------------------------------------------
CREAM = (253, 248, 238, 255)         # #FDF8EE fully opaque
SHADOW_DARK = (40, 55, 25, 180)      # warm dark green-brown, semi-transparent

def render_text_layer(width: int, height: int, text: str, font) -> Image.Image:
    """
    Render text onto a transparent layer with a two-pass shadow + main text.
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

    # --- Shadow pass (offset down-right by 1.5% of width, blurred) ---
    shadow_offset = max(2, int(width * 0.015))
    shadow_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow_layer)
    sdraw.text((tx + shadow_offset, ty + shadow_offset), text, font=font, fill=SHADOW_DARK)
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(radius=max(1, shadow_offset * 0.6)))

    # --- Main text pass ---
    main_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    mdraw = ImageDraw.Draw(main_layer)
    mdraw.text((tx, ty), text, font=font, fill=CREAM)

    # Very slight softening on the main text to reduce "crisp browser" feel
    main_layer = main_layer.filter(ImageFilter.GaussianBlur(radius=0.5))

    # Composite: shadow first, then main text
    layer = Image.alpha_composite(layer, shadow_layer)
    layer = Image.alpha_composite(layer, main_layer)

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
