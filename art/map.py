"""Heroic overworld map. Usage: python art/map.py <png_out_dir> <json_out_path>

Climb from the town steps (bottom) to the Supreme Court on its sunlit peak (top).
Writes map.png (x3) and a JSON file with normalised node/region coordinates so the
app can place level buttons exactly on the road.
"""
import json
import math
import sys
from lib import *

W = 130
REG_H = 170
TOP = 90                      # sky + temple space above region 4
BOTTOM = 40                   # gate/plaza space below region 0
H = TOP + REG_H * 5 + BOTTOM  # 980
NAMES = ['Courthouse Steps', 'Gym Gauntlet', 'Evidence Room', 'High Court Heights', 'Supreme Court']


def region_bottom(r):  # y of the bottom edge of region r (0 = bottom of map)
    return H - BOTTOM - r * REG_H


def region_of(y):
    r = int((H - BOTTOM - y) // REG_H)
    return max(0, min(4, r))


def road_x(y):
    return 65 + 27 * math.sin(y * 0.052 + 0.6)


def node_pos(r, i):
    y = region_bottom(r) - 24 - i * 28
    return round(road_x(y)), y


c = Canvas(W, H)

# ---------- sky ----------
HORIZON = TOP + 4
c.vgrad(0, 0, W - 1, HORIZON, SKY)
stars(c, 70, 40, seed=11)
for y in range(0, HORIZON):
    for x in range(W):
        ang = math.atan2(y - 62, x - 65)
        if int((ang + math.pi) / (2 * math.pi) * 22) % 2 and bayer(x, y) < .22 + (y / HORIZON) * .15:
            c.px[x, y] = shade(c.px[x, y], 1.35)
c.circle(65, 62, 13, hx('#FFF2C9')); c.circle(65, 62, 10, hx('#FFE07A'))
for (cx_, cy_, cw) in [(10, 30, 20), (96, 22, 24), (40, 50, 14), (104, 56, 18), (4, 66, 14)]:
    cloud(c, cx_, cy_, cw)

# ---------- ground: one palette pair per region, dithered blends between ----------
GROUND = [
    (hx('#C79AA0'), hx('#B07C8C')),  # 0 plaza cobble
    (GREEN, GREEN_D),                # 1 arena grass
    (hx('#8F6B90'), hx('#6F5078')),  # 2 archive slate
    (hx('#A08AB0'), hx('#7A6490')),  # 3 mountain rock
    (hx('#FFE3EC'), hx('#F0B6CF')),  # 4 cloud-top marble
]
for y in range(HORIZON, H):
    r = region_of(y)
    t = ((H - BOTTOM - y) % REG_H) / REG_H
    nxt = min(4, r + 1)
    for x in range(W):
        a, b = GROUND[r]
        n = (((x // 3) * 73856093) ^ ((y // 2) * 19349663)) % 100 / 100
        col = a if n > .3 else b
        if ((x * 7919 + y * 104729) % 53) == 0:
            col = shade(a, 1.12)
        if t > .88 and nxt != r:  # blend into the next region up
            na, nb = GROUND[nxt]
            col = mix_dither(x, y, col, na if n > .3 else nb, (t - .88) / .12)
        c.px[x, y] = col
# hazy mountain ridge between sky and ground
for x in range(W):
    h = 6 + int(abs(math.sin(x / 9.0)) * 10) + ((x * 7) % 3)
    for y in range(HORIZON - h, HORIZON + 2):
        c.pt(x, y, hx('#6A2A7A') if (x // 4) % 2 else hx('#5A2468'))


# ---------- props ----------
def pine(x, y, h=14):
    for k in range(3):
        w = 3 + k * 2
        top = y - h + k * (h // 3)
        c.poly([(x - w, top + h // 2), (x + w, top + h // 2), (x, top)], GREEN_D if k % 2 == 0 else GREEN)
    c.rect(x, y - 2, x, y, WOOD_D)


def rock(x, y, w=7, h=5, col=None):
    col = col or STONE
    c.poly([(x - w, y), (x - w + 2, y - h), (x + w - 3, y - h + 1), (x + w, y)], col[1])
    c.poly([(x - w + 2, y - h), (x + w - 3, y - h + 1), (x, y - h + 3)], col[0])
    c.rect(x - w, y, x + w, y, col[3])


def torch(x, y):
    c.rect(x, y - 8, x, y, WOOD_D); c.rect(x - 1, y - 9, x + 1, y - 9, GOLD_D)
    c.pt(x, y - 12, PINK); c.rect(x, y - 11, x, y - 10, GOLD); c.pt(x - 1, y - 10, PINK); c.pt(x + 1, y - 10, PINK)


def lamppost(x, y):
    c.rect(x, y - 12, x, y, STONE[3]); c.rect(x - 2, y - 15, x + 2, y - 13, GOLD_D); c.rect(x - 1, y - 14, x + 1, y - 14, hx('#FFE9A8'))


def bannerpole(x, y, h=18, col=PINK):
    c.rect(x, y - h, x, y, GOLD_D); c.circle(x, y - h - 1, 1, GOLD)
    for dy in range(7):
        for dx in range(7 - dy // 2):
            c.pt(x + 1 + dx, y - h + dy, col if dy % 6 else shade(col, 1.25))


def cliff(x0, x1, ytop, ybot, left=True):
    for y in range(ytop, ybot):
        edge = (x1 if left else x0) + int(math.sin(y / 5.0) * 3) * (1 if left else -1)
        lo, hi = (x0, edge) if left else (edge, x1)
        for x in range(lo, hi + 1):
            f = (x - lo) / max(1, hi - lo)
            col = STONE[2] if (f < .3 or (x + y // 3) % 7 == 0) else STONE[1] if f < .7 else STONE[0]
            if bayer(x, y) < .1:
                col = STONE[3]
            c.pt(x, y, col)
        c.pt(edge if left else edge, y, STONE[3])


def facade(x0, x1, ytop, ybot, doors=2):
    c.rect(x0, ytop, x1, ybot, STONE[1]); c.rect(x0, ytop, x1, ytop + 2, STONE[0])
    c.rect(x0 - 1, ytop - 3, x1 + 1, ytop - 1, STONE[2])
    for i in range(doors):
        dx = x0 + 4 + i * ((x1 - x0 - 8) // max(1, doors))
        c.rect(dx, ybot - 14, dx + 8, ybot, hx('#2B0F2E'))
        c.circle(dx + 4, ybot - 14, 4, hx('#2B0F2E'))
        c.rect(dx + 3, ybot - 7, dx + 5, ybot, hx('#FFE9A8'))
        c.circle(dx + 4, ybot - 9, 1, hx('#FFE9A8'))
    for x in range(x0 + 2, x1, 9):
        c.rect(x, ytop + 4, x + 2, ytop + 9, hx('#FFE9A8'))


def scatter(fn, r, count, seed=1, margin=15, y0=8, y1=REG_H - 8, **kw):
    rt = region_bottom(r) - REG_H
    sd = seed
    placed = 0
    tries = 0
    while placed < count and tries < count * 20:
        tries += 1
        sd = (sd * 1103515245 + 12345) & 0x7fffffff
        x = 4 + sd % (W - 8)
        y = rt + y0 + ((sd >> 9) % (y1 - y0))
        if abs(x - road_x(y)) > margin:
            fn(x, y, **kw); placed += 1


# ---------- region 4: Supreme Court (the peak) ----------
base = TOP + 4
for i in range(9):  # grand staircase
    half = 28 + i * 3
    c.rect(65 - half, base + i * 3, 65 + half, base + i * 3 + 2, MARBLE[i % 2])
    c.rect(65 - half, base + i * 3 + 2, 65 + half, base + i * 3 + 2, MARBLE[3])
tb = base - 2
c.circle(65, tb - 40, 12, GOLD); c.circle(65, tb - 40, 9, hx('#FFE07A'))  # golden dome
c.rect(65, tb - 56, 65, tb - 51, GOLD_D); c.circle(65, tb - 57, 1, PINK)
c.rect(30, tb - 30, 100, tb, MARBLE[1]); c.rect(30, tb - 30, 100, tb - 29, MARBLE[0])
c.poly([(24, tb - 30), (65, tb - 50), (106, tb - 30)], MARBLE[0])
c.poly([(32, tb - 31), (65, tb - 47), (98, tb - 31)], MARBLE[2])
scales_emblem(c, 65, tb - 38, GOLD_D)
for x in range(34, 98, 11):
    column(c, x, 6, tb - 27, tb - 3, cap=False)
c.rect(58, tb - 24, 72, tb, hx('#2B0F2E')); c.circle(65, tb - 24, 7, hx('#2B0F2E'))  # grand door
c.rect(64, tb - 12, 66, tb, hx('#FFE9A8'))
bannerpole(18, tb + 4, 28, PINK); bannerpole(112, tb + 4, 28, PINK)
bannerpole(8, tb + 8, 20, GOLD); bannerpole(122, tb + 8, 20, GOLD)
r4t = region_bottom(4) - REG_H
for y in range(base + 30, region_bottom(4) - 6):          # marble paving grid
    for x in range(W):
        if (x % 13 == 0 or y % 11 == 0) and bayer(x, y) < .5 and abs(x - road_x(y)) > 6:
            c.pt(x, y, hx('#E3A9C6'))
def brazier(x, y):
    c.rect(x - 2, y - 4, x + 2, y - 4, GOLD_D); c.rect(x - 1, y - 3, x + 1, y, STONE[2]); c.rect(x - 2, y, x + 2, y, STONE[3])
    c.rect(x, y - 7, x, y - 5, GOLD); c.pt(x - 1, y - 5, PINK); c.pt(x + 1, y - 5, PINK); c.pt(x, y - 8, PINK)
for y in range(base + 40, region_bottom(4) - 14, 22):
    rx = road_x(y)
    brazier(int(rx - 12), y); brazier(int(rx + 12), y)
scatter(lambda x, y: cloud(c, x - 8, y, 14 + (x % 3) * 4), 4, 9, seed=5, margin=16)
bannerpole(22, base + 60, 24, GOLD); bannerpole(108, base + 70, 24, PINK)

# ---------- region 3: High Court Heights ----------
r3t, r3b = region_bottom(3) - REG_H, region_bottom(3)
for k in range(7):                                          # carved terraces
    ty = r3t + 10 + k * 17
    for x in range(26, 104):
        yy = ty + int(math.sin(x / 7.0 + k) * 2)
        if abs(x - road_x(yy)) > 6:
            c.pt(x, yy, hx('#5A4470')); c.pt(x, yy + 1, hx('#B8A4C8'))
scatter(lambda x, y: rock(x, y, 5 + x % 3, 3 + x % 3), 3, 8, seed=9, margin=14)
cliff(0, 24, r3t + 4, r3b, left=True); cliff(106, 129, r3t + 10, r3b, left=False)
bannerpole(18, r3t + 30, 22, PINK); bannerpole(112, r3t + 36, 22, GOLD)
rock(40, r3t + 60, 6, 4); rock(92, r3t + 96, 7, 5); rock(30, r3t + 108, 5, 4)
torch(30, r3t + 82); torch(100, r3t + 44)
for (cx_, cy_, cw) in [(30, r3t + 14, 16), (96, r3t + 70, 18)]:
    cloud(c, cx_, cy_, cw)

# ---------- region 2: Evidence Room ----------
r2t, r2b = region_bottom(2) - REG_H, region_bottom(2)
facade(2, 36, r2t + 28, r2t + 74, 2)
facade(96, 128, r2t + 78, r2t + 118, 2)
for (x, y) in [(46, r2t + 96), (108, r2t + 36), (22, r2t + 100)]:
    c.rect(x, y - 6, x + 8, y, WOOD); c.outline(x, y - 6, x + 8, y, WOOD_D); c.rect(x + 3, y - 6, x + 5, y, WOOD_D)
lamppost(44, r2t + 60); lamppost(90, r2t + 20); lamppost(88, r2t + 110)
scatter(lambda x, y: rock(x, y, 4 + x % 3, 3), 2, 6, seed=21, margin=15)

# ---------- region 1: Gym Gauntlet ----------
r1t, r1b = region_bottom(1) - REG_H, region_bottom(1)
for k in range(2):  # colosseum arcs on the left
    yy = r1t + 22 + k * 40
    c.rect(2, yy, 34, yy + 30, STONE[1]); c.rect(2, yy, 34, yy + 2, STONE[0]); c.rect(2, yy + 30, 34, yy + 30, STONE[3])
    for x in range(6, 32, 9):
        c.rect(x, yy + 10, x + 5, yy + 30, hx('#2B0F2E')); c.circle(x + 2, yy + 10, 3, hx('#2B0F2E'))
    flag(c, 18, yy - 8, yy, PINK)
scatter(lambda x, y: pine(x, y, 11 + x % 6), 1, 22, seed=3, margin=15, y0=6)
torch(44, r1t + 14); torch(88, r1t + 60); torch(46, r1t + 112)
for (x, y) in [(112, r1t + 20)]:  # training dummy
    c.rect(x, y - 10, x, y, WOOD_D); c.rect(x - 4, y - 8, x + 4, y - 7, WOOD_L); c.circle(x, y - 12, 3, hx('#E8C79C'))

# ---------- region 0: Courthouse Steps (town plaza + gate) ----------
r0t, r0b = region_bottom(0) - REG_H, region_bottom(0)
for (x, y) in [(10, r0t + 24), (118, r0t + 60), (14, r0t + 100)]:
    lamppost(x, y)
c.circle(104, r0t + 28, 10, hx('#8F6B80')); c.circle(104, r0t + 28, 8, hx('#6FA8C8')); c.circle(104, r0t + 28, 3, MARBLE[0])  # fountain
c.rect(103, r0t + 20, 105, r0t + 26, MARBLE[0])
facade(2, 30, r0t + 46, r0t + 92, 2)
scatter(lambda x, y: rock(x, y, 4, 3, STONE), 0, 5, seed=2, margin=16)
bannerpole(8, r0t + 114, 22, PINK); bannerpole(122, r0t + 118, 22, GOLD)
# gate with two columns at the very bottom
column(c, 18, 9, H - 52, H - 8); column(c, 103, 9, H - 52, H - 8)
c.rect(14, H - 58, 120, H - 54, MARBLE[1]); c.rect(14, H - 58, 120, H - 58, MARBLE[0]); c.rect(14, H - 54, 120, H - 54, MARBLE[3])
c.rect(14, H - 53, 120, H - 52, GOLD)
scales_emblem(c, 65, H - 64, GOLD)

# ---------- the road ----------
ROAD_W = 4
prev = road_x(H - 6)
for y in range(H - 6, TOP + 30, -1):
    x = road_x(y)
    lo, hi = int(min(prev, x)) - ROAD_W, int(max(prev, x)) + ROAD_W
    r = region_of(y)
    for xx in range(lo, hi + 1):
        edge = xx in (lo, hi)
        if edge:
            col = STONE[3]
        elif r in (0, 3):                           # stairs: alternating bands
            col = MARBLE[0] if (y // 3) % 2 == 0 else MARBLE[1]
        elif r == 4:
            col = MARBLE[0] if (xx + y) % 9 else GOLD
        else:
            col = hx('#F0DCC8') if (xx + y // 2) % 11 else hx('#E0C4AC')
        c.pt(xx, y, col)
    prev = x

# node pads
nodes = []
for r in range(5):
    row = []
    for i in range(5):
        x, y = node_pos(r, i)
        boss = i == 4
        pr = 9 if boss else 6
        for dy in range(-pr // 2, pr // 2 + 1):
            for dx in range(-pr, pr + 1):
                if (dx / pr) ** 2 + (dy / (pr / 2)) ** 2 <= 1:
                    c.pt(x + dx, y + dy + 3, STONE[3] if dy == pr // 2 else (GOLD if boss and dy == -pr // 2 else MARBLE[1]))
        row.append({'x': round(x / W, 4), 'y': round(y / H, 4)})
    nodes.append(row)

c.vignette(0.35)

if __name__ == '__main__':
    png_dir = sys.argv[1] if len(sys.argv) > 1 else '.'
    json_path = sys.argv[2] if len(sys.argv) > 2 else 'map-nodes.json'
    c.save(png_dir, 'map')
    regions = []
    for r in range(5):
        regions.append({
            'name': NAMES[r],
            'top': round((region_bottom(r) - REG_H) / H, 4),
            'bottom': round(region_bottom(r) / H, 4),
        })
    Path(json_path).write_text(json.dumps({'aspect': round(H / W, 5), 'nodes': nodes, 'regions': regions}, indent=1))
    print('saved map', (W * 3, H * 3), '->', json_path)
