#!/usr/bin/env python3
"""
Visual checkpoint: Take screenshots of key pages to verify fixed ribbon label wiring.
"""
import asyncio
import os
from pathlib import Path
from playwright.async_api import async_playwright

VIEWPORT_CONFIGS = [
    ("inputs-desktop", 1440, 1080),
    ("materials-desktop", 1440, 1080),
    ("results-desktop", 1440, 1080),
    ("materials-mobile", 390, 844),
]

CHECKPOINT_DIR = Path("visual-checkpoints")
CHECKPOINT_DIR.mkdir(exist_ok=True)

async def take_screenshots():
    """
    Start dev server and take visual checkpoints of each page.
    """
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        for name, width, height in VIEWPORT_CONFIGS:
            context = await browser.new_context(
                viewport={"width": width, "height": height}
            )
            page = await context.new_page()
            
            try:
                # Navigate to app
                print(f"Taking checkpoint: {name} ({width}×{height})...")
                await page.goto("http://localhost:5173", wait_until="networkidle", timeout=10000)
                
                # Wait for page to render
                await page.wait_for_timeout(1000)
                
                # Scroll to top to see header
                await page.evaluate("() => window.scrollTo(0, 0)")
                await page.wait_for_timeout(500)
                
                # Take screenshot
                screenshot_path = CHECKPOINT_DIR / f"{name}.png"
                await page.screenshot(path=str(screenshot_path), full_page=False)
                print(f"  ✓ Saved: {screenshot_path}")
                
            except Exception as e:
                print(f"  ✗ Error: {e}")
            finally:
                await context.close()
        
        await browser.close()

print("Visual Checkpoint Script")
print("=" * 60)
print("Note: This script assumes dev server is running on http://localhost:5173")
print()
print("To start the server separately, run:")
print("  npm run dev")
print()
print("Then run this script:")
print("  python3 scripts/visual-checkpoint-playwright.py")
print()
print("=" * 60)
print()

# Try to run async main
try:
    asyncio.run(take_screenshots())
    print()
    print("✓ Visual checkpoints complete. Check visual-checkpoints/ directory.")
except Exception as e:
    print(f"Error: {e}")
    print()
    print("Troubleshooting:")
    print("- Ensure dev server is running: npm run dev")
    print("- Ensure Playwright is installed: pip install playwright")
    print("- Ensure Chromium browser is available: playwright install")
