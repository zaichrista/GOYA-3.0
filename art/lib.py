"""Shared pixel-art toolkit: palette, dithering, canvas and reusable props."""
import math
from pathlib import Path
from PIL import Image, ImageDraw


def hx(s):
    s = s.lstrip('#')
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))


def shade(c, f):
    return tuple(max(0, min(255, int(v * f))) for v in c)


# brand colours
BG = hx('#1A0D20'); PLUM = hx('#680F3D'); PINK = hx('#FF3F8E'); CREAM = hx('#FDE8D9')
GOLD = hx('#FFC63D'); LILAC = hx('#D6B4E0')
# supporting shades
GOLD_D = hx('#B8872A'); WALL_A = hx('#6A2A48'); WALL_B = hx('#7D3B54')
WAIN = hx('#4A1A38'); WAIN_HI = hx('#5E2646')
MARBLE = [hx('#FDE8D9'), hx('#EBCDB6'), hx('#C99E98'), hx('#8F5F70')]  # light -> shadow
WOOD = hx('#8A5A3A'); WOOD_D = hx('#5A3520'); WOOD_L = hx('#C9955A')
GREEN = hx('#4C8A62'); GREEN_D = hx('#2A4F3E'); GREEN_L = hx('#7FB88A')
STONE = [hx('#E5CFC4'), hx('#C4A5A5'), hx('#8F6B80'), hx('#5E4060')]
SKY = [hx('#4B1B5E'), hx('#9A2A7A'), hx('#FF3F8E'), hx('#FF8A5C'), hx('#FFC63D')]  # top -> horizon
SKY_DAY = [hx('#6C3E9A'), hx('#C04C9C'), hx('#FF7BA9'), hx('#FFB38A'), hx('#FFE29A')]

BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]


def bayer(x, y):
    return (BAYER[y % 4][x % 4] + 0.5) / 16


def mix_dither(x, y, a, b, t):
    return b if bayer(x, y) < t else a


def gradient(x, y, stops, t):
    t = min(max(t, 0), 0.9999) * (len(stops) - 1)
    i = int(t)
    return mix_dither(x, y, stops[i], stops[i + 1], t - i)


class Canvas:
    def __init__(self, w, h, fill=BG):
        self.w, self.h = w, h
        self.img = Image.new('RGB', (w, h), fill)
        self.px = self.img.load()
        self.d = ImageDraw.Draw(self.img)

    # --- primitives (all bounds-safe) ---
    def pt(self, x, y, c):
        x, y = int(x), int(y)
        if 0 <= x < self.w and 0 <= y < self.h:
            self.px[x, y] = c

    def get(self, x, y):
        return self.px[int(x), int(y)]

    def rect(self, x0, y0, x1, y1, c):
        self.d.rectangle([x0, y0, x1, y1], fill=c)

    def outline(self, x0, y0, x1, y1, c):
        self.d.rectangle([x0, y0, x1, y1], outline=c)

    def circle(self, cx, cy, r, c):
        for y in range(int(cy - r), int(cy + r) + 1):
            for x in range(int(cx - r), int(cx + r) + 1):
                if (x - cx) ** 2 + (y - cy) ** 2 <= r * r:
                    self.pt(x, y, c)

    def poly(self, pts, c):
        self.d.polygon(pts, fill=c)

    def line(self, x0, y0, x1, y1, c):
        self.d.line([x0, y0, x1, y1], fill=c)

    def vgrad(self, x0, y0, x1, y1, stops):
        for y in range(y0, y1 + 1):
            t = (y - y0) / max(1, (y1 - y0))
            for x in range(x0, x1 + 1):
                self.pt(x, y, gradient(x, y, stops, t))

    def wall(self, y0, y1, a=WALL_A, b=WALL_B):
        for y in range(y0, y1 + 1):
            for x in range(self.w):
                self.px[x, y] = mix_dither(x, y, a, b, 0.3 + 0.4 * ((y - y0) / max(1, y1 - y0)))

    def vignette(self, strength=0.5):
        for y in range(self.h):
            for x in range(self.w):
                e = max(abs(x - self.w / 2) / (self.w / 2), abs(y - self.h / 2) / (self.h / 2))
                if bayer(x, y) < (e ** 3) * strength:
                    self.px[x, y] = shade(self.px[x, y], 0.7)

    def save(self, out, name, scale=3):
        out = Path(out); out.mkdir(parents=True, exist_ok=True)
        self.img.resize((self.w * scale, self.h * scale), Image.NEAREST).save(out / f'{name}.png')
        return self.img


# ---------- props ----------
def molding(c, y=0):
    c.rect(0, y, c.w, y + 2, GOLD_D); c.rect(0, y + 3, c.w, y + 3, GOLD); c.rect(0, y + 4, c.w, y + 5, PLUM)


def wainscot(c, top, bottom):
    c.rect(0, top, c.w, bottom, WAIN)
    c.rect(0, top, c.w, top, GOLD); c.rect(0, top + 1, c.w, top + 1, GOLD_D)
    for x in range(6, c.w, 14):
        c.outline(x, top + 4, x + 9, bottom - 3, WAIN_HI)


def column(c, x0, w, top, bot, cap=True):
    for y in range(top, bot):
        for i in range(w):
            f = i / max(1, (w - 1))
            col = (MARBLE[3] if f < .12 else MARBLE[2] if f < .28 else MARBLE[0] if f < .5
                   else MARBLE[1] if f < .72 else MARBLE[2] if f < .9 else MARBLE[3])
            if i in (w // 3, 2 * w // 3) and bayer(x0 + i, y) < .6:
                col = MARBLE[2] if col == MARBLE[0] else MARBLE[3]
            c.pt(x0 + i, y, col)
    if cap:
        c.rect(x0 - 2, top, x0 + w + 1, top + 4, MARBLE[1]); c.rect(x0 - 2, top, x0 + w + 1, top + 1, MARBLE[0])
        c.rect(x0 - 2, top + 5, x0 + w + 1, top + 5, GOLD)
        c.rect(x0 - 3, bot, x0 + w + 2, bot + 3, MARBLE[1]); c.rect(x0 - 3, bot, x0 + w + 2, bot, MARBLE[0])
        c.rect(x0 - 3, bot + 3, x0 + w + 2, bot + 3, MARBLE[3])


def arch_window(c, cx, top, bottom, half, sky=SKY, sun=True):
    left, right = cx - half, cx + half
    cy = top + half
    inside = lambda x, y: left <= x <= right and (y >= cy or (x - cx) ** 2 + (y - cy) ** 2 <= half ** 2)
    for y in range(top, bottom):
        for x in range(left, right + 1):
            if inside(x, y):
                c.pt(x, y, gradient(x, y, sky, ((y - top) / (bottom - top)) ** .9))
    if sun:
        c.circle(cx, bottom - 8, 3, hx('#FFE07A'))
    for x in range(left, right + 1):
        h = 3 + ((x * 7) % 5)
        for y in range(bottom - h, bottom):
            if inside(x, y):
                c.pt(x, y, PLUM if (x // 3) % 2 else hx('#4B1B5E'))
    for y in range(top - 2, bottom):
        for x in range(left - 2, right + 3):
            if not inside(x, y) and any(inside(x + ox, y + oy) for ox in (-1, 0, 1) for oy in (-1, 0, 1)):
                c.pt(x, y, GOLD_D)
    c.rect(cx, top + 2, cx, bottom - 1, GOLD_D)
    c.rect(left - 2, bottom, right + 2, bottom + 1, GOLD)


def perspective_floor(c, horizon, ca=hx('#F6D3C3'), cb=hx('#B9628A'), cx=None, k=1.5, tile=40):
    cx = c.w / 2 if cx is None else cx
    far = hx('#D79BB0')
    for y in range(horizon, c.h):
        t = y - horizon + 1
        z = 60 / t
        for x in range(c.w):
            u, v = (x - cx) * z / tile, z * k
            base = ca if (int(u + 1000) + int(v + 1000)) % 2 == 0 else cb
            if t < 16:
                base = mix_dither(x, y, far, base, (t / 16) ** 1.5)
            e = abs(x - cx) / (c.w / 2)
            if bayer(x, y) < e ** 2.2 * .5:
                base = shade(base, .72)
            c.px[x, y] = base
    c.rect(0, horizon, c.w, horizon, GOLD_D)


def books(c, x0, x1, y_bottom, h, seed=0):
    cols = [PINK, PLUM, GOLD, LILAC, hx('#9A2A7A'), CREAM, hx('#C04C9C'), GREEN, hx('#4B1B5E')]
    x, i = x0, seed
    while x < x1:
        w = 2 + (i * 5) % 3
        bh = h - ((i * 7) % 4)
        col = cols[(i * 3) % len(cols)]
        c.rect(x, y_bottom - bh, min(x + w - 1, x1), y_bottom, col)
        c.pt(x, y_bottom - bh, shade(col, 1.25))
        if i % 4 == 0:
            c.rect(x, y_bottom - bh + 2, x + w - 1, y_bottom - bh + 2, GOLD)
        x += w + (1 if i % 5 == 0 else 0)
        i += 1


def bookcase(c, x0, x1, top, bottom, rows=3):
    c.rect(x0, top, x1, bottom, WOOD_D)
    rh = (bottom - top) // rows
    for r in range(rows):
        yb = top + (r + 1) * rh - 1
        c.rect(x0 + 1, top + r * rh + 1, x1 - 1, yb, shade(WOOD_D, .55))
        books(c, x0 + 2, x1 - 2, yb, rh - 3, seed=r * 7 + x0)
        c.rect(x0, yb + 1, x1, yb + 1, WOOD)


def sunburst(c, cx, cy, n, ca, cb, fade=True):
    for y in range(c.h):
        for x in range(c.w):
            ang = math.atan2(y - cy, x - cx)
            band = int((ang + math.pi) / (2 * math.pi) * n) % 2
            col = ca if band == 0 else cb
            if fade:
                dist = math.hypot(x - cx, y - cy) / (math.hypot(c.w, c.h) * .6)
                col = mix_dither(x, y, col, PLUM, min(.55, dist * .55))
            c.px[x, y] = col


def focus_lines(c, cx, cy, n=60, inner=18):
    """Manga-style speed lines radiating from a point."""
    c.rect(0, 0, c.w, c.h, hx('#2B0F2E'))
    for y in range(c.h):
        for x in range(c.w):
            ang = math.atan2(y - cy, x - cx)
            r = math.hypot(x - cx, y - cy)
            idx = int((ang + math.pi) / (2 * math.pi) * n)
            wob = (idx * 2654435761) % 100 / 100
            if r > inner + wob * 14 and (idx % 2 == 0 or wob > .6):
                c.px[x, y] = PINK if wob < .35 else LILAC if wob < .7 else CREAM
            elif r > inner and bayer(x, y) < .25:
                c.px[x, y] = PLUM


def cloud(c, x, y, w=14, col=hx('#FFD6E0'), hi=hx('#FFF1F5')):
    c.rect(x + 2, y, x + w - 2, y + 2, col); c.rect(x, y + 2, x + w, y + 4, col)
    c.rect(x + 3, y - 1, x + w // 2, y - 1, hi); c.rect(x + 3, y, x + w // 2 + 2, y, hi)


def stars(c, n, ymax, seed=3):
    s = seed
    for _ in range(n):
        s = (s * 1103515245 + 12345) & 0x7fffffff
        x, y = s % c.w, (s >> 8) % ymax
        c.pt(x, y, CREAM)
        if s % 5 == 0:
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                c.pt(x + dx, y + dy, LILAC)


def banner(c, cx, top, bot, w=4, col=PLUM):
    for y in range(top, bot):
        taper = max(0, y - (bot - 6))
        for x in range(cx - w + taper, cx + w + 1 - taper):
            c.pt(x, y, GOLD if x in (cx - w + taper, cx + w - taper) else col)
    c.rect(cx - w - 1, top - 1, cx + w + 1, top, GOLD)
    c.pt(cx, top + (bot - top) // 2, GOLD)
    c.pt(cx, top + (bot - top) // 2 - 1, CREAM)


def flag(c, x, top, bot, col=PINK):
    c.rect(x, top, x, bot, GOLD_D)
    c.circle(x, top - 1, 1, GOLD)
    for dy in range(6):
        for dx in range(10 - dy // 2):
            c.pt(x + 1 + dx, top + dy + int(math.sin(dx / 2) * 1), col if dy % 5 else shade(col, 1.2))


def desk(c, y, h=6, x0=0, x1=None):
    x1 = c.w if x1 is None else x1
    c.rect(x0, y, x1, y + h, WOOD); c.rect(x0, y, x1, y, WOOD_L)
    c.rect(x0, y + h - 1, x1, y + h, WOOD_D)


def lamp(c, x, y, col=GOLD):
    c.rect(x, y, x, y + 6, GOLD_D); c.rect(x - 2, y + 6, x + 2, y + 6, GOLD_D)
    c.poly([(x - 4, y), (x + 4, y), (x + 2, y - 4), (x - 2, y - 4)], col)
    for dy in range(1, 10):
        for dx in range(-dy, dy + 1):
            if bayer(x + dx, y + 2 + dy) < .12:
                c.pt(x + dx, y + 1 + dy, hx('#FFE9A8'))


def frame(c, x0, y0, x1, y1, fill=CREAM):
    c.rect(x0, y0, x1, y1, GOLD); c.rect(x0 + 1, y0 + 1, x1 - 1, y1 - 1, GOLD_D)
    c.rect(x0 + 2, y0 + 2, x1 - 2, y1 - 2, fill)


def scales_emblem(c, cx, cy, col=GOLD):
    c.rect(cx, cy - 4, cx, cy + 3, col)
    c.rect(cx - 5, cy - 3, cx + 5, cy - 3, col)
    for sx in (-5, 5):
        c.line(cx + sx, cy - 3, cx + sx - 2, cy + 1, col); c.line(cx + sx, cy - 3, cx + sx + 2, cy + 1, col)
        c.rect(cx + sx - 2, cy + 1, cx + sx + 2, cy + 1, col)
    c.rect(cx - 2, cy + 3, cx + 2, cy + 4, col)
