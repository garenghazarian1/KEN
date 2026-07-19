"""
Generates the full favicon / PWA icon suite from public/salon-logo-2026.jpg.

Usage (from the ken/ directory):

    python scripts/generate-brand-icons.py

Outputs (all overwritten in place):
  public/favicon.ico                                       16+32+48 multi-size ICO
  public/favicon-for-app/favicon-v3.ico                    48x48 ICO
  public/favicon-for-app/favicon-96x96-v3.png
  public/favicon-for-app/icon1-v3.png                      96x96 (legacy duplicate)
  public/favicon-for-app/apple-touch-icon-v3.png           180x180
  public/favicon-for-app/apple-icon-v3.png                 180x180 (kept in sync)
  public/favicon-for-app/web-app-manifest-192x192-v3.png
  public/favicon-for-app/web-app-manifest-512x512-v3.png
  public/favicon-for-app/favicon-v3.svg                    SVG wrapper embedding 512 PNG
  public/favicon-for-app/icon0-v3.svg                      same (legacy duplicate)

After replacing icons, bump in src/config/constants.js:
  FAVICON_REVISION, APPLE_TOUCH_ICON_REVISION, WEB_APP_MANIFEST_REVISION
  and the matching ?v= / *-vN filenames on site-v3.webmanifest / manifest-v3.json.
  When Google Search still shows a stale favicon, rename files to a new *-vN stem
  (not only bump ?v=) so crawlers fetch a brand-new URL.
"""

import base64
import io
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
APP_DIR = PUBLIC / "favicon-for-app"
SOURCE = PUBLIC / "salon-logo-2026.jpg"

# Fraction of the canvas left as padding on each side. Keeps the tall "k"
# stem of the wordmark from touching the icon edges at small sizes.
PADDING = 0.08


def build_square(size: int) -> Image.Image:
    src = Image.open(SOURCE).convert("RGB")
    canvas = Image.new("RGB", (size, size), (255, 255, 255))
    inner = round(size * (1 - 2 * PADDING))
    logo = src.resize((inner, inner), Image.LANCZOS)
    offset = (size - inner) // 2
    canvas.paste(logo, (offset, offset))
    return canvas


def save_png(path: Path, size: int) -> None:
    build_square(size).save(path, format="PNG", optimize=True)
    print(f"wrote {path.relative_to(ROOT)} ({size}x{size})")


def save_ico(path: Path, sizes: list[int]) -> None:
    largest = build_square(max(sizes))
    largest.save(path, format="ICO", sizes=[(s, s) for s in sizes])
    print(f"wrote {path.relative_to(ROOT)} (sizes: {sizes})")


def save_svg_wrapper(path: Path, size: int = 512) -> None:
    buf = io.BytesIO()
    build_square(size).save(buf, format="PNG", optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" '
        f'viewBox="0 0 {size} {size}">'
        f'<image width="{size}" height="{size}" '
        f'href="data:image/png;base64,{b64}"/></svg>'
    )
    path.write_text(svg, encoding="utf-8")
    print(f"wrote {path.relative_to(ROOT)} (SVG wrapper, {size}x{size})")


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"source image not found: {SOURCE}")
    APP_DIR.mkdir(parents=True, exist_ok=True)

    save_ico(PUBLIC / "favicon.ico", [16, 32, 48])
    save_ico(APP_DIR / "favicon-v3.ico", [48])
    save_png(APP_DIR / "favicon-96x96-v3.png", 96)
    save_png(APP_DIR / "icon1-v3.png", 96)
    save_png(APP_DIR / "apple-touch-icon-v3.png", 180)
    save_png(APP_DIR / "apple-icon-v3.png", 180)
    save_png(APP_DIR / "web-app-manifest-192x192-v3.png", 192)
    save_png(APP_DIR / "web-app-manifest-512x512-v3.png", 512)
    save_svg_wrapper(APP_DIR / "favicon-v3.svg")
    save_svg_wrapper(APP_DIR / "icon0-v3.svg")

    print("done")


if __name__ == "__main__":
    main()
