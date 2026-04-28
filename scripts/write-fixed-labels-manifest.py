"""Write fixed-page-labels-manifest.json"""
import json, sys
from pathlib import Path

repo = Path(__file__).parent.parent
out_dir = repo / "src/assets/visual/ribbon-labels/fixed-page-labels"

LABELS = [
    ("inputs", "Planning Notebook", "Inputs page header (/inputs)"),
    ("materials", "Source Workbench", "Materials page header (/materials)"),
    ("results", "Planning Binder", "Results page header (/results)"),
    ("teacher-planning-studio", "Teacher Planning Studio", "App-level header (reserved, not yet wired)"),
]
VARIANTS = {
    "small":  (642, 259),
    "medium": (856, 345),
    "large":  (1284, 517),
    "xlarge": (1712, 690),
}

items = []
for slug, text, use in LABELS:
    for variant, (w, h) in VARIANTS.items():
        fname = f"ribbon-{slug}-{variant}.png"
        fpath = out_dir / fname
        kb = fpath.stat().st_size // 1024 if fpath.exists() else 0
        items.append({
            "file": fname,
            "bakedText": text,
            "variant": variant,
            "dimensions": f"{w}x{h}",
            "sizeKB": kb,
            "sourceAsset": "green-floral-stitched-ribbon-label.png",
            "intendedUse": use,
            "accessibilityNote": 'img must have alt="" aria-hidden="true"; wrapper must supply aria-label matching bakedText',
            "status": "needs-visual-review",
            "generator": "scripts/generate-fixed-ribbon-labels.py",
        })

manifest = {
    "pack": "lesson-generator8-fixed-page-label-ribbons",
    "generatedBy": "scripts/generate-fixed-ribbon-labels.py",
    "sourceAsset": "../green-floral-stitched-ribbon-label.png",
    "tool": "Python 3.14 / Pillow 12.2.0 / Georgia Bold font",
    "accessibilityContract": 'Each image has baked visible text. In React: wrapper div must have role="img" and aria-label matching bakedText. The img element must have alt="" and aria-hidden="true".',
    "scopeConstraint": "These labels are STATIC stable page labels only. All dynamic, user-generated, or variable text must remain real HTML. Do not substitute for interactive controls or variable data.",
    "wireStatus": "NOT WIRED -- status=needs-visual-review. Do not wire into OrchardRibbon until visual review approved.",
    "items": items,
}

out_path = out_dir / "fixed-page-labels-manifest.json"
out_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
print(f"Wrote {out_path.relative_to(repo)} ({len(items)} items)")
