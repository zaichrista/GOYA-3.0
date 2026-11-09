"""Procedural pixel scene: Courthouse Steps (World 1 / Home backdrop).

Draws on a tiny canvas with a fixed palette, then scales up with nearest-neighbour
so every "pixel" stays crisp. Re-run after tweaking any constant:

    python art/courthouse.py <out_dir>
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw

W, H = 130, 110          # base resolution (scaled x3 -> 390x330)
HORIZON = 72             # where wall meets floor
SCALE = 3

def hx(s):
    s = s.lstrip('#')
    return tuple(int(s[i:i + 2], 16) for i in (0, 2, 4))

# palette: the 6 brand colours + a few shades so lighting reads
BG = hx('#1A0D20'); PLUM = hx('#680F3D'); PINK = hx('#FF3F8E'); CREAM = hx('#FDE8D9')
GOLD = hx('#FFC63D'); LILAC = hx('#D6B4E0')
WALL_A = hx('#6A2A48'); WALL_B = hx('#7D3B54'); WAIN = hx('#4A1A38'); WAIN_HI = hx('#5E2646')
MARBLE = [hx('#FDE8D9'), hx('#EBCDB6'), hx('#C99E98'), hx('#8F5F70')]  # light -> shadow
FLOOR_A = hx('#F6D3C3'); FLOOR_B = hx('#B9628A')
SKY = [hx('#4B1B5E'), hx('#9A2A7A'), hx('#FF3F8E'), hx('#FF8A5C'), hx('#FFC63D')]  # top -> horizon
DARK_GOLD = hx('#B8872A')

BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]
def bayer(x, y):
    return (BAYER[y % 4][x % 4] + 0.5) / 16

def mix_dither(x, y, a, b, t):
    """Ordered-dither between colours a and b; t in 0..1."""
    return b if bayer(x, y) < t else a

def gradient(x, y, stops, t):
    """Dithered multi-stop gradient, t in 0..1."""
    t = min(max(t, 0), 0.9999) * (len(stops) - 1)
    i = int(t)
    return mix_dither(x, y, stops[i], stops[i + 1], t - i)

img = Image.new('RGB', (W, H), BG)
px = img.load()
d = ImageDraw.Draw(img)

# ---------- wall ----------
for y in range(0, HORIZON):
    for x in range(W):
        px[x, y] = mix_dither(x, y, WALL_A, WALL_B, 0.35 + 0.4 * (y / HORIZON))

# crown molding
d.rectangle([0, 0, W, 2], fill=DARK_GOLD)
d.rectangle([0, 3, W, 3], fill=GOLD)
d.rectangle([0, 4, W, 5], fill=PLUM)

# wainscot: dark panelled band with gold rail
WAIN_TOP = 58
d.rectangle([0, WAIN_TOP, W, HORIZON], fill=WAIN)
d.rectangle([0, WAIN_TOP, W, WAIN_TOP], fill=GOLD)
d.rectangle([0, WAIN_TOP + 1, W, WAIN_TOP + 1], fill=DARK_GOLD)
for x in range(8, W, 14):
    d.rectangle([x, WAIN_TOP + 4, x + 9, HORIZON - 3], outline=WAIN_HI)
    d.point((x + 1, WAIN_TOP + 5), fill=PLUM)

# ---------- windows with sunset sky ----------
def window(cx, top, bottom, half):
    left, right = cx - half, cx + half
    arch_r = half
    cy = top + arch_r
    for y in range(top, bottom):
        for x in range(left, right + 1):
            if y < cy:  # arch cap
                if (x - cx) ** 2 + (y - cy) ** 2 > arch_r ** 2:
                    continue
            t = (y - top) / (bottom - top)
            px[x, y] = gradient(x, y, SKY, t ** 0.9)
    # sun + clouds + skyline silhouette
    sun_y = bottom - 9
    d.ellipse([cx - 3, sun_y - 3, cx + 3, sun_y + 3], fill=hx('#FFE07A'))
    for (dx, dy, w) in [(-5, -14, 6), (4, -20, 5), (-3, -26, 4)]:
        yy = sun_y + dy
        if top + 2 < yy < bottom - 4:
            d.rectangle([cx + dx, yy, cx + dx + w, yy], fill=hx('#FFB3C9'))
            d.rectangle([cx + dx + 1, yy - 1, cx + dx + w - 1, yy - 1], fill=hx('#FFD6E0'))
    for x in range(left, right + 1):
        h = 3 + ((x * 7) % 5)
        for y in range(bottom - h, bottom):
            px[x, y] = PLUM if (x // 3) % 2 else hx('#4B1B5E')
    # frame
    for y in range(top, bottom):
        for x in range(left - 1, right + 2):
            inside = left <= x <= right and (y >= cy or (x - cx) ** 2 + (y - cy) ** 2 <= arch_r ** 2)
            edge = (not inside) and any(
                0 <= x + ox < W and left <= x + ox <= right and (y >= cy or (x + ox - cx) ** 2 + (y - cy) ** 2 <= arch_r ** 2)
                for ox in (-1, 1))
            if edge:
                px[x, y] = DARK_GOLD
    for x in range(left, right + 1):  # arch outline
        for y in range(top - 1, cy):
            if arch_r ** 2 < (x - cx) ** 2 + (y - cy) ** 2 <= (arch_r + 1.4) ** 2 and y < cy:
                px[x, y] = DARK_GOLD
    d.rectangle([cx, top + 2, cx, bottom - 1], fill=DARK_GOLD)           # mullion
    d.rectangle([left, cy + 8, right, cy + 8], fill=DARK_GOLD)           # transom
    d.rectangle([left - 2, bottom, right + 2, bottom + 1], fill=GOLD)    # sill
    d.rectangle([left - 2, bottom + 2, right + 2, bottom + 2], fill=PLUM)

WIN_TOP, WIN_BOT = 12, 52
for cx in (36, 65, 94):
    window(cx, WIN_TOP, WIN_BOT, 10)

# banners between windows
def banner(cx):
    for y in range(8, 38):
        taper = max(0, y - 32)  # pointed bottom
        for x in range(cx - 4 + taper, cx + 5 - taper):
            px[x, y] = PLUM if (x not in (cx - 4 + taper, cx + 4 - taper)) else GOLD
    d.rectangle([cx - 5, 7, cx + 5, 8], fill=GOLD)
    for (dx, dy) in [(0, 18), (-1, 19), (1, 19), (0, 20), (0, 17)]:  # little gold star/cross
        d.point((cx + dx, dy), fill=GOLD)
    d.point((cx, 18), fill=CREAM)
banner(50); banner(80)

# ---------- floor: perspective checker, sunbeams, shadows ----------
CX = W / 2
def beam_x(wcx, y):
    # sunlight parallelogram falling from window towards viewer, drifting right
    t = y - HORIZON
    return wcx - 7 + t * 0.55, wcx + 7 + t * 0.55 + t * 0.15

for y in range(HORIZON, H):
    t = y - HORIZON + 1
    z = 60 / t
    for x in range(W):
        u = (x - CX) * z / 40
        v = z * 1.5
        base = FLOOR_A if (int(u + 1000) + int(v + 1000)) % 2 == 0 else FLOOR_B
        if t < 16:  # fade tiny distant tiles into one blended tone to avoid moire
            base = mix_dither(x, y, hx('#D79BB0'), base, (t / 16) ** 1.5)
        c = base
        # sunbeams
        for wcx in (36, 65, 94):
            bx0, bx1 = beam_x(wcx, y)
            if bx0 <= x <= bx1 and bayer(x, y) < 0.4:
                c = tuple(min(255, int(ch * 1.12 + 12)) for ch in c)
        # darker toward bottom corners (vignette) + column shadows
        edge = abs(x - CX) / CX
        if bayer(x, y) < edge ** 2.2 * 0.6:
            c = tuple(int(ch * 0.72) for ch in c)
        px[x, y] = c

# floor/wall seam: baseboard
d.rectangle([0, HORIZON, W, HORIZON], fill=DARK_GOLD)

# ---------- foreground marble columns ----------
def column(x0, w):
    top, bot = 0, 84
    # shaft
    for y in range(top, bot):
        for i in range(w):
            x = x0 + i
            f = i / (w - 1)
            if f < 0.12: c = MARBLE[3]
            elif f < 0.28: c = MARBLE[2]
            elif f < 0.5: c = MARBLE[0]
            elif f < 0.72: c = MARBLE[1]
            elif f < 0.9: c = MARBLE[2]
            else: c = MARBLE[3]
            # fluting
            if i in (w // 3, 2 * w // 3) and bayer(x, y) < 0.6:
                c = MARBLE[2] if c == MARBLE[0] else MARBLE[3]
            px[x, y] = c
    # veins
    for (vx, vy0, vl) in [(x0 + 4, 14, 9), (x0 + 8, 30, 12), (x0 + 3, 50, 8), (x0 + 9, 64, 7)]:
        for k in range(vl):
            px[vx + (k // 4) % 2, vy0 + k] = MARBLE[2]
    # capital
    d.rectangle([x0 - 3, 0, x0 + w + 2, 6], fill=MARBLE[1])
    d.rectangle([x0 - 3, 0, x0 + w + 2, 1], fill=MARBLE[0])
    d.rectangle([x0 - 3, 6, x0 + w + 2, 7], fill=MARBLE[3])
    d.rectangle([x0 - 2, 8, x0 + w + 1, 9], fill=GOLD)
    d.rectangle([x0 - 2, 10, x0 + w + 1, 10], fill=DARK_GOLD)
    # base
    d.rectangle([x0 - 2, bot, x0 + w + 1, bot + 1], fill=GOLD)
    d.rectangle([x0 - 4, bot + 2, x0 + w + 3, bot + 6], fill=MARBLE[1])
    d.rectangle([x0 - 4, bot + 2, x0 + w + 3, bot + 2], fill=MARBLE[0])
    d.rectangle([x0 - 4, bot + 6, x0 + w + 3, bot + 7], fill=MARBLE[3])
    # cast shadow on floor
    for y in range(bot + 8, H):
        for x in range(x0 - 4, x0 + w + 10):
            if 0 <= x < W and bayer(x, y) < 0.5:
                px[x, y] = tuple(int(ch * 0.7) for ch in px[x, y])
column(5, 12)
column(W - 17, 12)

# ---------- floating dust motes in the light ----------
for (mx, my) in [(40, 60), (45, 66), (70, 58), (72, 64), (92, 62), (98, 68), (62, 76), (88, 80)]:
    px[mx, my] = hx('#FFF2C9')

if __name__ == '__main__':
    out = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
    out.mkdir(parents=True, exist_ok=True)
    img.save(out / 'courthouse@1x.png')
    img.resize((W * SCALE, H * SCALE), Image.NEAREST).save(out / 'courthouse.png')
    print('saved', out / 'courthouse.png', (W * SCALE, H * SCALE))
