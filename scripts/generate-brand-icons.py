"""
Generates the full favicon / PWA icon suite from public/salon-logo-2026.jpg.

Usage (from the ken/ directory):

    python scripts/generate-brand-icons.py

Outputs (all overwritten in place):
  public/favicon.ico                                  16+32+48 multi-size ICO
  public/favicon-for-app/favicon.ico                  48x48 ICO
  public/favicon-for-app/favicon-96x96.png
  public/favicon-for-app/icon1.png                    96x96 (legacy duplicate)
  public/favicon-for-app/apple-touch-icon.png         180x180
  public/favicon-for-app/apple-icon.png               180x180 (kept in sync)
  public/favicon-for-app/web-app-manifest-192x192.png
  public/favicon-for-app/web-app-manifest-512x512.png
  public/favicon-for-app/favicon.svg                  SVG wrapper embedding 512 PNG
  public/favicon-for-app/icon0.svg                    same (legacy duplicate)

After replacing icons, bump in src/config/constants.js:
  FAVICON_REVISION, APPLE_TOUCH_ICON_REVISION, WEB_APP_MANIFEST_REVISION
  and the matching ?v= on site.webmanifest / manifest.json icon src paths.
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
    save_ico(APP_DIR / "favicon.ico", [48])
    save_png(APP_DIR / "favicon-96x96.png", 96)
    save_png(APP_DIR / "icon1.png", 96)
    save_png(APP_DIR / "apple-touch-icon.png", 180)
    save_png(APP_DIR / "apple-icon.png", 180)
    save_png(APP_DIR / "web-app-manifest-192x192.png", 192)
    save_png(APP_DIR / "web-app-manifest-512x512.png", 512)
    save_svg_wrapper(APP_DIR / "favicon.svg")
    save_svg_wrapper(APP_DIR / "icon0.svg")

    print("done")


if __name__ == "__main__":
    main()
