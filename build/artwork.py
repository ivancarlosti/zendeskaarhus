#!/usr/bin/env python3
"""Generates the Aarhus theme artwork.

The theme references these files from `style.css` and `manifest.json`, so the
file names and the pixel sizes below are part of the theme contract: changing
a size requires updating the manifest and the stylesheet.

Usage:
    python3 build/artwork.py

Requires Pillow (`python3 -m pip install Pillow`). The script writes:

    settings/logo.png                        470 x 470  RGBA
    settings/favicon.png                     128 x 128  RGBA
    settings/homepage_background_image.jpg  2000 x 419  RGB
    settings/community_background_image.jpg 2000 x 417  RGB
    settings/community_image.jpg            1162 x 302  RGB
    settings/service_catalog_hero_image.jpg 3162 x 640  RGB
    thumbnail.png                            768 x 630  RGBA
"""

from __future__ import annotations

import pathlib

from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parent.parent

# CopenLight palette — every value mirrors a `manifest.json` default:
# BRAND is `brand_color`, INK `hover_link_color`, ACCENT `link_color`,
# HIGHLIGHT `visited_link_color` and SURFACE the neutral panel tone used by
# `sample/style.css.example`. Change both files together.
BRAND = (23, 73, 77)  # #17494D
INK = (15, 53, 84)  # #0F3554
ACCENT = (31, 115, 183)  # #1F73B7
HIGHLIGHT = (147, 88, 176)  # #9358B0
SURFACE = (241, 245, 249)  # #F1F5F9
WHITE = (255, 255, 255)

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def mix(a, b, ratio: float):
    return tuple(round(x + (y - x) * ratio) for x, y in zip(a, b))


def horizontal_gradient(size: tuple[int, int], start, end) -> Image.Image:
    """Returns a left-to-right gradient image."""
    base = Image.new("RGB", (2, 1))
    base.putpixel((0, 0), start)
    base.putpixel((1, 0), end)
    return base.resize(size, Image.BILINEAR)


def diagonal_gradient(size: tuple[int, int], start, end) -> Image.Image:
    """Returns a top-left to bottom-right gradient image."""
    base = Image.new("RGB", (2, 2))
    base.putpixel((0, 0), start)
    base.putpixel((1, 0), mix(start, end, 0.5))
    base.putpixel((0, 1), mix(start, end, 0.5))
    base.putpixel((1, 1), end)
    return base.resize(size, Image.BICUBIC)


def centered_text(
    canvas: Image.Image,
    text: str,
    text_font: ImageFont.FreeTypeFont,
    fill,
    y: int,
    letter_spacing: int = 0,
) -> None:
    """Draws `text` centred horizontally, with optional tracking."""
    draw = ImageDraw.Draw(canvas)
    widths = [draw.textlength(char, font=text_font) for char in text]
    total = sum(widths) + letter_spacing * (len(text) - 1)
    x = (canvas.width - total) / 2
    box = text_font.getbbox("Ag")
    height = box[3] - box[1]

    for char, width in zip(text, widths):
        draw.text(
            (x, y - height / 2), char, font=text_font, fill=fill, anchor="lm"
        )
        x += width + letter_spacing


def skyline(draw: ImageDraw.ImageDraw, size: tuple[int, int], colour) -> None:
    """Draws an abstract skyline along the bottom edge."""
    width, height = size
    blocks = [
        (0.02, 0.34, 0.55),
        (0.09, 0.26, 0.42),
        (0.15, 0.30, 0.70),
        (0.21, 0.12, 0.36),
        (0.25, 0.22, 0.60),
        (0.33, 0.10, 0.30),
        (0.45, 0.16, 0.48),
        (0.52, 0.09, 0.34),
        (0.58, 0.20, 0.58),
        (0.66, 0.12, 0.40),
        (0.72, 0.24, 0.66),
        (0.80, 0.14, 0.44),
        (0.87, 0.18, 0.52),
        (0.93, 0.10, 0.38),
    ]
    for x_ratio, width_ratio, height_ratio in blocks:
        left = int(width * x_ratio)
        right = left + int(width * width_ratio)
        top = int(height * (1 - height_ratio))
        draw.rectangle([left, top, right, height], fill=colour)


def waves(
    draw: ImageDraw.ImageDraw, size: tuple[int, int], colour, count: int
) -> None:
    """Draws horizontal wave bands."""
    width, height = size
    step = max(2, width // 240)
    for index in range(count):
        y = int(height * (0.15 + index * 0.11))
        amplitude = height * 0.02
        points = []
        for x in range(0, width + 1, step):
            direction = 1 if (x // int(width / 12)) % 2 == 0 else -1
            points.append(
                (x, y + amplitude * direction * (1 - index / (count * 2)))
            )
        draw.line(points, fill=colour, width=max(2, height // 90))

def monogram_mark(
    size: int, background: tuple, glyph_colour, padding: float
) -> Image.Image:
    """Square logo mark: rounded brand tile with an "a" monogram."""
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)

    inset = int(size * padding)
    radius = int(size * 0.16)
    draw.rounded_rectangle(
        [inset, inset, size - inset, size - inset],
        radius=radius,
        fill=background,
    )

    # Wave bands under the monogram.
    band_top = int(size * 0.68)
    for index in range(3):
        y = band_top + index * int(size * 0.07)
        draw.line(
            [inset + size * 0.16, y, size - inset - size * 0.16, y],
            fill=mix(background, WHITE, 0.35),
            width=max(2, int(size * 0.014)),
        )

    glyph_font = font(FONT_BOLD, int(size * 0.42))
    draw.text(
        (size / 2, size * 0.44),
        "a",
        font=glyph_font,
        fill=glyph_colour,
        anchor="mm",
    )

    return canvas


def build_logo() -> None:
    monogram_mark(470, BRAND, WHITE, padding=0.06).save(
        ROOT / "settings" / "logo.png"
    )


def build_favicon() -> None:
    monogram_mark(128, BRAND, WHITE, padding=0.02).save(
        ROOT / "settings" / "favicon.png"
    )


def build_homepage_background() -> None:
    size = (2000, 419)
    canvas = horizontal_gradient(size, BRAND, ACCENT)
    draw = ImageDraw.Draw(canvas)
    skyline(draw, size, mix(INK, BRAND, 0.35))
    waves(draw, size, mix(ACCENT, WHITE, 0.35), count=3)
    canvas.save(ROOT / "settings" / "homepage_background_image.jpg", quality=88)


def build_community_background() -> None:
    size = (2000, 417)
    canvas = horizontal_gradient(size, INK, BRAND)
    draw = ImageDraw.Draw(canvas)
    waves(draw, size, mix(BRAND, ACCENT, 0.6), count=4)
    canvas.save(ROOT / "settings" / "community_background_image.jpg", quality=88)


def build_community_image() -> None:
    size = (1162, 302)
    canvas = Image.new("RGB", size, SURFACE)
    draw = ImageDraw.Draw(canvas)

    # Brick accent bar keeps the banner from reading as a flat block.
    draw.rectangle([0, size[1] - 14, size[0], size[1]], fill=HIGHLIGHT)
    draw.rounded_rectangle([64, 58, 214, 208], radius=28, fill=BRAND)
    draw.text(
        (139, 133),
        "a",
        font=font(FONT_BOLD, 92),
        fill=WHITE,
        anchor="mm",
    )
    draw.text(
        (256, 110), "aarhus", font=font(FONT_BOLD, 68), fill=BRAND, anchor="lm"
    )
    draw.text(
        (258, 178),
        "Help Center theme",
        font=font(FONT_REGULAR, 34),
        fill=mix(BRAND, SURFACE, 0.35),
        anchor="lm",
    )
    canvas.save(ROOT / "settings" / "community_image.jpg", quality=90)


def build_service_catalog_hero() -> None:
    size = (3162, 640)
    canvas = diagonal_gradient(size, INK, ACCENT)
    draw = ImageDraw.Draw(canvas)
    waves(draw, size, mix(ACCENT, WHITE, 0.25), count=5)
    draw.ellipse(
        [size[0] * 0.62, -size[1] * 0.55, size[0] * 1.02, size[1] * 0.75],
        fill=mix(ACCENT, SURFACE, 0.18),
    )
    canvas.save(
        ROOT / "settings" / "service_catalog_hero_image.jpg", quality=86
    )


def build_thumbnail() -> None:
    size = (768, 630)
    canvas = diagonal_gradient(size, BRAND, INK).convert("RGBA")
    draw = ImageDraw.Draw(canvas)

    waves(draw, size, mix(BRAND, WHITE, 0.16), count=4)
    centered_text(
        canvas, "aarhus", font(FONT_BOLD, 148), WHITE, 236, letter_spacing=6
    )
    centered_text(
        canvas,
        "HELP CENTER THEME",
        font(FONT_REGULAR, 26),
        mix(WHITE, BRAND, 0.35),
        336,
        letter_spacing=10,
    )

    swatches = [BRAND, ACCENT, HIGHLIGHT, SURFACE]
    swatch_size = 54
    gap = 18
    total = len(swatches) * swatch_size + (len(swatches) - 1) * gap
    x = (size[0] - total) / 2
    for colour in swatches:
        draw.rounded_rectangle(
            [x, 428, x + swatch_size, 428 + swatch_size],
            radius=12,
            fill=colour,
            outline=mix(WHITE, BRAND, 0.55),
            width=2,
        )
        x += swatch_size + gap

    canvas.save(ROOT / "thumbnail.png")


def main() -> None:
    build_logo()
    build_favicon()
    build_homepage_background()
    build_community_background()
    build_community_image()
    build_service_catalog_hero()
    build_thumbnail()
    print("Aarhus artwork written.")


if __name__ == "__main__":
    main()

