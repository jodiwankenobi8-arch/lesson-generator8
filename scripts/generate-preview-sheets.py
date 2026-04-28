#!/usr/bin/env python3
"""
Generate contact sheets and page-context previews for fixed ribbon labels.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json

# Paths
ASSETS_DIR = Path("src/assets/visual/ribbon-labels/fixed-page-labels")
OUTPUT_DIR = Path("src/assets/visual/ribbon-labels/fixed-page-labels/preview-sheets")

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# 1. Contact Sheet (all 16 assets in a grid)
# ---------------------------------------------------------------------------
print("Generating contact sheet...")

labels = [
    "ribbon-inputs",
    "ribbon-materials",
    "ribbon-results",
    "ribbon-teacher-planning-studio"
]
sizes = ["small", "medium", "large", "xlarge"]

# Load all 16 ribbons
ribbons = {}
for label in labels:
    ribbons[label] = {}
    for size in sizes:
        path = ASSETS_DIR / f"{label}-{size}.png"
        if path.exists():
            ribbons[label][size] = Image.open(path)
        else:
            print(f"  ⚠ Missing: {path}")

# Create contact sheet: 4 columns × 4 rows
# Each cell shows one ribbon at reduced scale
CONTACT_CELL_W = 500  # Display width for each cell
CONTACT_PADDING = 20
CONTACT_LABEL_HEIGHT = 40

cols = len(sizes)  # 4 sizes
rows = len(labels)  # 4 labels

# Calculate total size
cell_heights = []
for label in labels:
    # Use the medium ribbon to estimate height proportions
    if "medium" in ribbons[label] and ribbons[label]["medium"]:
        img = ribbons[label]["medium"]
        aspect_ratio = img.height / img.width
        h = int(CONTACT_CELL_W * aspect_ratio)
        cell_heights.append(h)
    else:
        cell_heights.append(200)

total_w = cols * (CONTACT_CELL_W + CONTACT_PADDING) + CONTACT_PADDING
total_h = (
    rows * (max(cell_heights) + CONTACT_LABEL_HEIGHT + CONTACT_PADDING)
    + CONTACT_PADDING
    + 60
)

contact_sheet = Image.new("RGB", (total_w, total_h), (245, 242, 235))  # cream bg
draw = ImageDraw.Draw(contact_sheet)

# Try to load a readable font
try:
    header_font = ImageFont.truetype("C:\\Windows\\Fonts\\georgia.ttf", 24)
    label_font = ImageFont.truetype("C:\\Windows\\Fonts\\georgia.ttf", 14)
except:
    header_font = ImageFont.load_default()
    label_font = ImageFont.load_default()

# Title
title = "Fixed Ribbon Labels – Contact Sheet (All 16 Assets)"
draw.text((20, 20), title, fill=(60, 80, 40), font=header_font)

# Draw grid
y = 80
for row_idx, label in enumerate(labels):
    x = CONTACT_PADDING
    for col_idx, size in enumerate(sizes):
        if label in ribbons and size in ribbons[label]:
            img = ribbons[label][size]
            
            # Scale to fit cell
            aspect = img.height / img.width
            display_h = int(CONTACT_CELL_W * aspect)
            scaled = img.resize((CONTACT_CELL_W, display_h), Image.Resampling.LANCZOS)
            
            # Paste onto contact sheet
            contact_sheet.paste(scaled, (x, y))
            
            # Label below image
            label_text = f"{label.replace('ribbon-', '')} – {size}"
            draw.text((x + 10, y + display_h + 5), label_text, fill=(80, 100, 60), font=label_font)
            
            x += CONTACT_CELL_W + CONTACT_PADDING
        else:
            # Placeholder for missing image
            draw.rectangle([x, y, x + CONTACT_CELL_W, y + 150], outline=(200, 100, 100), width=2)
            draw.text((x + 20, y + 60), "MISSING", fill=(200, 100, 100), font=label_font)
            x += CONTACT_CELL_W + CONTACT_PADDING
    
    y += cell_heights[row_idx] + CONTACT_LABEL_HEIGHT + CONTACT_PADDING

# Save contact sheet
contact_path = OUTPUT_DIR / "01-contact-sheet-all-16.png"
contact_sheet.save(contact_path, "PNG")
print(f"  ✓ Saved: {contact_path}")

# ---------------------------------------------------------------------------
# 2. Production Context Previews (full page mockups)
# ---------------------------------------------------------------------------
print("\nGenerating page-context previews...")

production_configs = [
    ("Planning Notebook", "ribbon-inputs-medium", 356, 1440),
    ("Source Workbench", "ribbon-materials-medium", 356, 1440),
    ("Planning Binder", "ribbon-results-medium", 356, 1440),
    ("Teacher Planning Studio", "ribbon-teacher-planning-studio-large", 500, 1440),
]

for config_name, ribbon_key, display_w, page_w in production_configs:
    # Load the ribbon
    parts = ribbon_key.rsplit("-", 1)
    base_label = parts[0]
    size_variant = parts[1]
    
    ribbon_path = ASSETS_DIR / f"{ribbon_key}.png"
    if not ribbon_path.exists():
        print(f"  ⚠ Ribbon not found: {ribbon_path}")
        continue
    
    ribbon_img = Image.open(ribbon_path)
    
    # Create a simple full-page mockup: cream background with ribbon at top
    page_h = 1080  # Standard desktop height
    mockup_page = Image.new("RGB", (page_w, page_h), (253, 248, 238))  # cream
    
    # Scale ribbon to display width
    aspect_ratio = ribbon_img.height / ribbon_img.width
    display_h = int(display_w * aspect_ratio)
    ribbon_scaled = ribbon_img.resize((display_w, display_h), Image.Resampling.LANCZOS)
    
    # Center ribbon horizontally at top
    ribbon_x = (page_w - display_w) // 2
    ribbon_y = 40
    mockup_page.paste(ribbon_scaled, (ribbon_x, ribbon_y))
    
    # Add context text below
    draw_mockup = ImageDraw.Draw(mockup_page)
    try:
        context_font = ImageFont.truetype("C:\\Windows\\Fonts\\georgia.ttf", 18)
    except:
        context_font = ImageFont.load_default()
    
    context_y = ribbon_y + display_h + 40
    context_lines = [
        config_name,
        f"Ribbon: {ribbon_key} (display width: {display_w}px)",
        f"Page viewport: {page_w}×{page_h}px",
    ]
    
    for line in context_lines:
        draw_mockup.text((60, context_y), line, fill=(100, 120, 80), font=context_font)
        context_y += 40
    
    # Save mockup
    mockup_filename = f"02-page-context-{config_name.lower().replace(' ', '-')}.png"
    mockup_path = OUTPUT_DIR / mockup_filename
    mockup_page.save(mockup_path, "PNG")
    print(f"  ✓ Saved: {mockup_path}")

# ---------------------------------------------------------------------------
# 3. Mobile Fit Check (mobile viewport previews)
# ---------------------------------------------------------------------------
print("\nGenerating mobile viewport previews...")

mobile_configs = [
    ("Planning Notebook Mobile", "ribbon-inputs-medium", 356, 390),
    ("Planning Binder Mobile", "ribbon-results-medium", 356, 390),
]

for config_name, ribbon_key, display_w, page_w in mobile_configs:
    ribbon_path = ASSETS_DIR / f"{ribbon_key}.png"
    if not ribbon_path.exists():
        print(f"  ⚠ Ribbon not found: {ribbon_path}")
        continue
    
    ribbon_img = Image.open(ribbon_path)
    
    # Mobile: narrow viewport (390px typical mobile width)
    page_h = 844  # Standard mobile height
    mockup_mobile = Image.new("RGB", (page_w, page_h), (253, 248, 238))
    
    # Scale ribbon to fit mobile width with some margin
    responsive_w = min(display_w, page_w - 20)
    aspect_ratio = ribbon_img.height / ribbon_img.width
    display_h = int(responsive_w * aspect_ratio)
    ribbon_scaled = ribbon_img.resize((responsive_w, display_h), Image.Resampling.LANCZOS)
    
    # Center ribbon
    ribbon_x = (page_w - responsive_w) // 2
    ribbon_y = 20
    mockup_mobile.paste(ribbon_scaled, (ribbon_x, ribbon_y))
    
    # Add context text
    draw_mobile = ImageDraw.Draw(mockup_mobile)
    try:
        context_font = ImageFont.truetype("C:\\Windows\\Fonts\\georgia.ttf", 14)
    except:
        context_font = ImageFont.load_default()
    
    context_y = ribbon_y + display_h + 20
    context_lines = [
        f"{config_name}",
        f"Viewport: {page_w}×{page_h}px",
        f"Responsive width: {responsive_w}px",
    ]
    
    for line in context_lines:
        draw_mobile.text((15, context_y), line, fill=(100, 120, 80), font=context_font)
        context_y += 30
    
    # Save mobile preview
    mobile_filename = f"03-mobile-{config_name.lower().replace(' ', '-')}.png"
    mobile_path = OUTPUT_DIR / mobile_filename
    mockup_mobile.save(mobile_path, "PNG")
    print(f"  ✓ Saved: {mobile_path}")

print(f"\n✓ Preview sheets generated in: {OUTPUT_DIR}")
