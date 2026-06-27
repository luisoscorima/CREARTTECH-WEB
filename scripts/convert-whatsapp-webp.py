#!/usr/bin/env python3
"""Convierte imágenes WhatsApp a WebP y actualiza portfolio-whatsapp-api.html e index.html."""
from __future__ import annotations

import re
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMG_DIRS = [
    ROOT / "assets" / "img" / "masonry-portfolio" / "Whatsapp-API-img",
]
EXTRA_FILES = [
    ROOT / "assets" / "img" / "masonry-portfolio" / "Whatsapp-API.png",
]

WEBP_QUALITY = 82
SUFFIXES = {".png", ".jpg", ".jpeg"}


def convert_to_webp(src: Path) -> Path | None:
    if src.suffix.lower() not in SUFFIXES:
        return None
    dst = src.with_suffix(".webp")
    with Image.open(src) as img:
        if img.mode in ("RGBA", "LA"):
            img.save(dst, "WEBP", quality=WEBP_QUALITY, method=6, lossless=False)
        else:
            rgb = img.convert("RGB")
            rgb.save(dst, "WEBP", quality=WEBP_QUALITY, method=6)
    return dst


def format_kb(path: Path) -> float:
    return path.stat().st_size / 1024


def wrap_img_with_picture(html: str) -> str:
    """Envuelve <img ... src="...Whatsapp-API..."> con <picture> si aún no lo está."""

    def webp_src(original: str) -> str:
        return re.sub(r"\.(png|jpe?g)$", ".webp", original, flags=re.I)

    img_pattern = re.compile(
        r"<img\b([^>]*?)\bsrc=(\"|\')([^\"\']+)(\"|\')([^>]*)>",
        re.I | re.S,
    )

    def replacer(match: re.Match[str]) -> str:
        full = match.group(0)
        if "Whatsapp-API" not in full:
            return full
        if full.strip().startswith("<picture>"):
            return full
        # Evitar re-envolver si ya está justo después de <picture>
        before, q1, src, q2, after = match.groups()
        if ".webp" in src:
            return full
        return (
            f'<picture><source srcset="{webp_src(src)}" type="image/webp">'
            f'<img{before}src={q1}{src}{q2}{after}></picture>'
        )

    # No tocar imgs que ya están dentro de picture
    parts = re.split(r"(<picture>.*?</picture>)", html, flags=re.S)
    out = []
    for i, part in enumerate(parts):
        if part.startswith("<picture>"):
            out.append(part)
        else:
            out.append(img_pattern.sub(replacer, part))
    return "".join(out)


def main() -> None:
    sources: list[Path] = []
    for d in IMG_DIRS:
        sources.extend(sorted(d.iterdir()))
    sources.extend(EXTRA_FILES)

    total_before = 0.0
    total_after = 0.0
    converted = 0

    for src in sources:
        if not src.is_file() or src.suffix.lower() not in SUFFIXES:
            continue
        dst = src.with_suffix(".webp")
        if dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime:
            before = format_kb(src)
            after = format_kb(dst)
            total_before += before
            total_after += after
            converted += 1
            print(f"  (ok) {src.name} -> {dst.name} ({after:.1f} KB)")
            continue
        before = format_kb(src)
        dst = convert_to_webp(src)
        if not dst:
            continue
        after = format_kb(dst)
        total_before += before
        total_after += after
        converted += 1
        pct = (1 - after / before) * 100 if before else 0
        print(f"  {src.name}: {before:.1f} KB -> {dst.name}: {after:.1f} KB ({pct:.0f}% menos)")

    print(f"\nConvertidas: {converted} | Total: {total_before:.1f} KB -> {total_after:.1f} KB")

    html_files = [
        ROOT / "portfolio" / "portfolio-whatsapp-api.html",
        ROOT / "index.html",
    ]
    for html_path in html_files:
        if not html_path.exists():
            continue
        text = html_path.read_text(encoding="utf-8")
        updated = wrap_img_with_picture(text)
        if updated != text:
            html_path.write_text(updated, encoding="utf-8")
            print(f"Actualizado: {html_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
