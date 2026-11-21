"""Generate HolyTouch Roofing logo options as self-contained SVGs (text converted to paths)."""
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import os

OUT = os.path.join(os.path.dirname(__file__), "logos")
os.makedirs(OUT, exist_ok=True)

SLATE = "#1E2A38"
METAL = "#8C96A3"
ORANGE = "#E0702A"
WHITE = "#FFFFFF"
FONTS = {
    "xb": "/usr/share/fonts/opentype/inter/InterDisplay-ExtraBold.otf",
    "sb": "/usr/share/fonts/opentype/inter/InterDisplay-SemiBold.otf",
    "md": "/usr/share/fonts/opentype/inter/Inter-Medium.otf",
}
_cache = {}


def font(key):
    if key not in _cache:
        f = TTFont(FONTS[key])
        _cache[key] = (f, f.getGlyphSet(), f.getBestCmap(), f["hmtx"], f["head"].unitsPerEm)
    return _cache[key]


def text_path(txt, key, size, x, y, tracking=0.0):
    """Return (svg path d, width) for txt with baseline at y."""
    f, gs, cmap, hmtx, upm = font(key)
    s = size / upm
    pen = SVGPathPen(gs)
    cx = 0.0
    for ch in txt:
        gname = cmap.get(ord(ch))
        if gname is None:
            continue
        tp = TransformPen(pen, (s, 0, 0, -s, x + cx, y))
        gs[gname].draw(tp)
        cx += hmtx[gname][0] * s + tracking * size
    width = cx - tracking * size
    return pen.getCommands(), width


def svg(w, h, body, bg=None):
    rect = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">{rect}{body}</svg>'


# ---------- Marks (64x64 grid) ----------
def mark_a(stem=SLATE, ridge=ORANGE):
    # "Ridge H": the H's crossbar is a roof ridge
    return (
        f'<rect x="9" y="12" width="11" height="44" rx="1.5" fill="{stem}"/>'
        f'<rect x="44" y="12" width="11" height="44" rx="1.5" fill="{stem}"/>'
        f'<polyline points="14.5,44 32,29 49.5,44" fill="none" stroke="{ridge}" stroke-width="8" '
        f'stroke-linejoin="miter" stroke-linecap="butt"/>'
    )


def mark_b(tile=SLATE, roof=ORANGE, lines="#C7CDD4"):
    # "Roof sheet badge": roof over long-span corrugation lines
    ribs = "".join(
        f'<rect x="{x}" y="33" width="3.2" height="19" rx="1" fill="{lines}"/>' for x in (18, 25.6, 33.2, 40.8)
    )
    return (
        f'<rect x="2" y="2" width="60" height="60" rx="13" fill="{tile}"/>'
        f'<polyline points="11,31 32,14 53,31" fill="none" stroke="{roof}" stroke-width="7" '
        f'stroke-linejoin="round" stroke-linecap="round"/>'
        + ribs
    )


def mark_c(roof=SLATE, dot=ORANGE):
    # "Touch": a broad roof with a point of contact at the ridge
    return (
        f'<polyline points="6,48 32,24 58,48" fill="none" stroke="{roof}" stroke-width="9" '
        f'stroke-linejoin="round" stroke-linecap="round"/>'
        f'<circle cx="32" cy="10" r="6" fill="{dot}"/>'
    )


def g(content, x, y, scale):
    return f'<g transform="translate({x} {y}) scale({scale})">{content}</g>'


# ---------- Option A: horizontal wordmark ----------
def option_a(dark=False):
    main = WHITE if dark else SLATE
    sub = "#AEB6C0" if dark else METAL
    m = mark_a(stem=main)
    d1, w1 = text_path("HOLYTOUCH", "xb", 46, 92, 52, tracking=0.01)
    d2, w2 = text_path("ROOFING", "sb", 15.5, 94, 76, tracking=0.32)
    w = int(max(92 + w1, 94 + w2) + 12)
    body = g(m, 4, 8, 1.25) + f'<path d="{d1}" fill="{main}"/><path d="{d2}" fill="{sub}"/>'
    return svg(w, 96, body)


# ---------- Option B: badge + stacked wordmark ----------
def option_b(dark=False):
    main = WHITE if dark else SLATE
    m = mark_b(tile=ORANGE if dark else SLATE, roof=WHITE if dark else ORANGE)
    d1, w1 = text_path("HolyTouch", "xb", 44, 98, 48)
    d2, w2 = text_path("Roofing", "md", 22, 99, 78, tracking=0.02)
    w = int(max(98 + w1, 99 + w2) + 12)
    body = g(m, 4, 6, 1.32) + f'<path d="{d1}" fill="{main}"/><path d="{d2}" fill="{ORANGE if not dark else "#F3A26E"}"/>'
    return svg(w, 96, body)


# ---------- Option C: lowercase, minimal ----------
def option_c(dark=False):
    main = WHITE if dark else SLATE
    m = mark_c(roof=main)
    d1, w1 = text_path("holytouch", "xb", 48, 96, 58, tracking=-0.01)
    d2, w2 = text_path("roofing", "xb", 48, 96 + w1 + 10, 58, tracking=-0.01)
    w = int(96 + w1 + 10 + w2 + 12)
    body = g(m, 6, 12, 1.2) + f'<path d="{d1}" fill="{main}"/><path d="{d2}" fill="{ORANGE}"/>'
    return svg(w, 96, body)


files = {
    "option-a.svg": option_a(), "option-a-dark.svg": option_a(True),
    "option-b.svg": option_b(), "option-b-dark.svg": option_b(True),
    "option-c.svg": option_c(), "option-c-dark.svg": option_c(True),
    "mark-a.svg": svg(64, 64, mark_a()),
    "mark-b.svg": svg(64, 64, mark_b()),
    "mark-c.svg": svg(64, 64, mark_c()),
}
for name, content in files.items():
    with open(os.path.join(OUT, name), "w") as fh:
        fh.write(content)
print("wrote", len(files), "files to", OUT)
