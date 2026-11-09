"""Page backdrops. Usage: python art/scenes.py <out_dir>

Banners are 130x48 (x3 = 390x144) and sit behind each screen's title.
Full-bleed scenes have their own sizes. Every scene is built from lib.py.
"""
import sys
from lib import *

B = (130, 48)


def room(w=130, h=48, wall_h=None, floor=True, a=WALL_A, b=WALL_B):
    c = Canvas(w, h)
    wall_h = wall_h or h - 8
    c.wall(0, wall_h, a, b)
    molding(c, 0)
    if floor:
        for y in range(wall_h + 1, h):
            for x in range(w):
                c.px[x, y] = hx('#F6D3C3') if ((x // 7) + (y // 4)) % 2 == 0 else hx('#B9628A')
        c.rect(0, wall_h, w, wall_h, GOLD_D)
    return c


# ---- banners ----
def goal():  # case-file office
    c = room()
    arch_window(c, 24, 8, 36, 10)
    desk(c, 36, 12)
    for i, x in enumerate((60, 74, 88, 100)):  # stacked case files
        for k in range(3 + i % 2):
            c.rect(x, 33 - k * 3, x + 11, 35 - k * 3, [CREAM, hx('#F3C6D8'), CREAM, LILAC][k % 4])
            c.rect(x + 8, 33 - k * 3, x + 11, 33 - k * 3, GOLD)
    lamp(c, 112, 24)
    c.circle(48, 32, 2, hx('#BFEFFF')); c.line(50, 34, 54, 38, GOLD_D)  # magnifier
    return c


def library():  # law library
    c = Canvas(*B)
    c.wall(0, 47, WOOD_D, shade(WOOD_D, .8))
    bookcase(c, 2, 62, 2, 47, 3)
    bookcase(c, 68, 128, 2, 47, 3)
    c.rect(63, 0, 67, 47, WOOD_D)
    lamp(c, 65, 6)
    c.line(30, 47, 38, 4, WOOD_L); c.line(34, 47, 42, 4, WOOD_L)  # ladder
    for y in range(8, 46, 5):
        c.rect(33 + (y - 8) // 8 - 1, y, 37 + (y - 8) // 8, y, WOOD_L)
    return c


def trainhall():  # programs
    c = Canvas(*B)
    c.wall(0, 38, hx('#5A2250'), hx('#7D3B54'))
    molding(c, 0)
    for x in (12, 46, 84, 118):
        column(c, x - 3, 7, 6, 36)
    for x0 in (22, 56, 94):
        c.rect(x0, 14, x0 + 20, 36, hx('#2B0F2E'))
        c.rect(x0, 12, x0 + 20, 14, GOLD_D)
    banner(c, 32, 6, 22); banner(c, 66, 6, 22, col=PINK); banner(c, 104, 6, 22)
    for y in range(39, 48):
        for x in range(130):
            c.px[x, y] = hx('#F6D3C3') if ((x // 8) + (y // 3)) % 2 == 0 else hx('#B9628A')
    c.rect(0, 38, 130, 38, GOLD_D)
    c.rect(52, 40, 78, 41, STONE[0]); c.rect(50, 39, 51, 43, STONE[2]); c.rect(79, 39, 80, 43, STONE[2])  # barbell
    return c


def courtroom():  # workout preview
    c = room(h=48)
    wainscot(c, 28, 40)
    arch_window(c, 16, 6, 28, 7); arch_window(c, 114, 6, 28, 7)
    c.rect(38, 22, 92, 40, WOOD); c.rect(38, 22, 92, 24, WOOD_L); c.rect(38, 38, 92, 40, WOOD_D)  # bench
    for x in range(42, 90, 8):
        c.outline(x, 26, x + 5, 36, WOOD_D)
    c.circle(65, 12, 7, GOLD); c.circle(65, 12, 5, WALL_A); scales_emblem(c, 65, 12, GOLD)
    flag(c, 30, 4, 22, PINK); flag(c, 100, 4, 22, GOLD)
    return c


def chambers():  # results (judge's chambers)
    c = Canvas(*B)
    c.wall(0, 47, WOOD_D, shade(WOOD_D, .75))
    for x in range(0, 130, 10):
        c.outline(x + 1, 2, x + 8, 30, shade(WOOD_D, .5))
    arch_window(c, 100, 4, 30, 9)
    frame(c, 18, 8, 38, 26, WALL_A); scales_emblem(c, 28, 17, GOLD)
    desk(c, 32, 16)
    c.rect(54, 28, 70, 31, WOOD_L); c.rect(60, 22, 62, 28, WOOD_D)  # gavel
    c.rect(56, 20, 66, 23, WOOD_L); c.rect(56, 20, 66, 20, hx('#E5C08A'))
    c.rect(74, 29, 84, 31, GOLD_D)
    lamp(c, 118, 22)
    return c


def records():  # progress (scoreboard hall)
    c = room(h=48)
    c.rect(10, 6, 120, 36, GOLD_D); c.rect(12, 8, 118, 34, hx('#2A4F3E'))
    for i, h in enumerate([8, 12, 9, 16, 14, 20, 18]):
        x = 18 + i * 14
        c.rect(x, 33 - h, x + 8, 33, PINK if i % 2 else GOLD)
        c.rect(x, 33 - h, x + 8, 33 - h, CREAM)
    for k in range(4):
        c.rect(98 + k * 3, 11, 98 + k * 3, 17, CREAM)
    c.line(97, 17, 108, 11, CREAM)
    c.rect(14, 36, 116, 37, WOOD)
    return c


def notice():  # missions (bulletin board)
    c = room(h=48)
    c.rect(8, 5, 122, 41, WOOD_D); c.rect(10, 7, 120, 39, hx('#B07A4A'))
    for y in range(7, 40):
        for x in range(10, 121):
            if bayer(x, y) < .14:
                c.pt(x, y, hx('#8A5A3A'))
    notes = [(16, 12, 22, 16, CREAM), (44, 10, 22, 14, hx('#F3C6D8')), (72, 13, 22, 18, CREAM), (98, 11, 18, 16, LILAC)]
    for (x, y, w, h, col) in notes:
        c.rect(x, y, x + w, y + h, col)
        for ly in range(y + 4, y + h - 1, 3):
            c.rect(x + 2, ly, x + w - 2, ly, shade(col, .72))
        c.circle(x + w // 2, y + 1, 1, PINK)
    c.rect(34, 30, 46, 36, CREAM); c.circle(40, 33, 2, GOLD)
    c.rect(88, 31, 100, 37, CREAM); c.circle(94, 34, 2, GOLD)
    return c


def office():  # profile
    c = room(h=48)
    arch_window(c, 100, 6, 32, 9)
    for i, x in enumerate((12, 34, 56)):
        frame(c, x, 8 + (i % 2) * 2, x + 16, 24 + (i % 2) * 2, CREAM)
        c.rect(x + 4, 13 + (i % 2) * 2, x + 12, 13 + (i % 2) * 2, shade(CREAM, .7))
        c.rect(x + 4, 16 + (i % 2) * 2, x + 12, 16 + (i % 2) * 2, shade(CREAM, .7))
        c.circle(x + 8, 20 + (i % 2) * 2, 2, PINK)
    desk(c, 34, 14)
    c.circle(78, 30, 4, GREEN_D); c.circle(76, 28, 3, GREEN); c.circle(80, 28, 3, GREEN_L)  # plant
    c.rect(76, 33, 80, 36, PLUM)
    return c


def wardrobe():  # appearance
    c = Canvas(*B)
    c.wall(0, 39, hx('#4B1B5E'), hx('#6A2A6A'))
    molding(c, 0)
    frame(c, 12, 6, 44, 40, hx('#E6D4F0'))
    for y in range(8, 39, 2):  # mirror glints
        c.line(18 + (y % 6), y, 22 + (y % 6), y, CREAM)
    c.rect(56, 10, 112, 10, GOLD_D)  # clothes rail
    for i in range(7):
        x = 60 + i * 8
        c.line(x, 10, x, 12, GOLD_D)
        c.rect(x - 2, 12, x + 2, 32, [PINK, PLUM, hx('#9A2A7A')][i % 3])
        c.rect(x - 2, 12, x + 2, 13, GOLD)
    for y in range(40, 48):
        for x in range(130):
            c.px[x, y] = shade(WOOD, 1.0 if (x // 6) % 2 else .86)
    for y in range(0, 40):  # spotlight cone
        for x in range(46 - y // 3, 54 + y // 3):
            if bayer(x, y) < .1:
                c.pt(x, y, hx('#FFF2C9'))
    return c


def clerk():  # settings
    c = room(h=48)
    c.circle(28, 18, 14, GOLD_D); c.circle(28, 18, 12, CREAM)
    for a in range(12):
        ang = a * math.pi / 6
        c.pt(28 + math.cos(ang) * 10, 18 + math.sin(ang) * 10, PLUM)
    c.line(28, 18, 28, 9, PLUM); c.line(28, 18, 34, 20, PINK)
    for (gx, gy, r) in ((70, 16, 9), (88, 26, 6), (100, 12, 5)):  # gears
        c.circle(gx, gy, r, GOLD)
        c.circle(gx, gy, r - 3, WALL_A)
        for a in range(8):
            ang = a * math.pi / 4
            c.rect(gx + math.cos(ang) * (r + 1) - 1, gy + math.sin(ang) * (r + 1) - 1, gx + math.cos(ang) * (r + 1), gy + math.sin(ang) * (r + 1), GOLD)
    desk(c, 36, 12)
    c.circle(116, 33, 3, GOLD); c.rect(113, 34, 119, 35, GOLD_D)  # desk bell
    return c


# ---- full-bleed ----
def splash():
    c = Canvas(130, 270)
    sunburst(c, 65, 150, 20, hx('#8A1650'), hx('#B2205F'))
    stars(c, 40, 120)
    # courthouse silhouette
    base = 236
    c.rect(20, base - 22, 110, base, hx('#2B0F2E'))
    c.poly([(16, base - 22), (65, base - 46), (114, base - 22)], hx('#2B0F2E'))
    for x in range(26, 106, 10):
        c.rect(x, base - 20, x + 4, base, hx('#3E1A3E'))
    for i in range(5):
        c.rect(12 - i * 3, base + i * 5 - 0, 118 + i * 3, base + 4 + i * 5, shade(hx('#2B0F2E'), 1 + i * .08))
    c.rect(0, base + 24, 130, 270, hx('#1A0D20'))
    for i in range(6):
        c.circle(20 + i * 18, 108 + (i % 2) * 14, 1, GOLD)
    scales_emblem(c, 65, base - 34, GOLD)
    return c


def onboarding():
    c = Canvas(130, 270)
    focus_lines(c, 65, 90, 70, 20)
    return c


def balcony():  # rest
    c = Canvas(130, 90)
    c.vgrad(0, 0, 129, 58, SKY_DAY)
    cloud(c, 12, 14, 16); cloud(c, 86, 8, 20); cloud(c, 50, 24, 12)
    c.circle(96, 44, 7, hx('#FFE07A'))
    for x in range(130):
        h = 8 + int(abs(math.sin(x / 7.0)) * 9) + ((x * 13) % 4)
        c.rect(x, 58 - h, x, 58, hx('#7A2A68') if (x // 5) % 2 else hx('#5E2058'))
    for x in range(0, 130, 12):
        c.rect(x, 58, x + 8, 58, hx('#3A1448'))
    c.rect(0, 58, 130, 90, hx('#C99E98')); c.rect(0, 58, 130, 59, MARBLE[0])
    c.rect(0, 62, 130, 65, MARBLE[1])
    for x in range(2, 130, 9):
        c.rect(x, 66, x + 4, 84, MARBLE[1]); c.rect(x, 66, x, 84, MARBLE[0]); c.rect(x + 4, 66, x + 4, 84, MARBLE[3])
    c.rect(0, 84, 130, 90, MARBLE[2]); c.rect(0, 84, 130, 84, MARBLE[0])
    c.circle(112, 54, 6, GREEN_D); c.circle(108, 50, 5, GREEN); c.circle(116, 50, 5, GREEN_L); c.rect(109, 56, 115, 62, PLUM)
    return c


def victory():  # case closed
    c = Canvas(130, 140)
    c.vgrad(0, 0, 129, 90, SKY_DAY)
    sunburst_c = Canvas(130, 140)
    sunburst(sunburst_c, 65, 80, 24, hx('#FFE29A'), hx('#FFC63D'), fade=False)
    for y in range(0, 90):
        for x in range(130):
            if sunburst_c.px[x, y] == hx('#FFE29A') and bayer(x, y) < .35:
                c.px[x, y] = hx('#FFF2C9')
    c.circle(65, 80, 12, hx('#FFF2C9'))
    cloud(c, 8, 20, 18); cloud(c, 98, 14, 20)
    base = 100
    c.rect(24, base - 30, 106, base, MARBLE[1])
    c.poly([(20, base - 30), (65, base - 52), (110, base - 30)], MARBLE[0])
    c.poly([(30, base - 31), (65, base - 48), (100, base - 31)], MARBLE[2])
    for x in range(30, 104, 12):
        column(c, x, 6, base - 28, base - 3, cap=False)
    scales_emblem(c, 65, base - 38, GOLD_D)
    for i in range(7):
        c.rect(14 - i * 2, base + i * 4, 116 + i * 2, base + 3 + i * 4, MARBLE[i % 2 + 1])
    for (dx, dy) in ((30, 40), (44, 30), (88, 36), (100, 48), (20, 60), (110, 70)):  # doves
        c.line(dx - 3, dy, dx, dy - 2, CREAM); c.line(dx, dy - 2, dx + 3, dy, CREAM)
    return c


def stagehall():  # active workout stage backdrop
    c = Canvas(130, 110)
    c.wall(0, 62, hx('#5A2250'), hx('#7D3B54'))
    molding(c, 0)
    for x0 in (14, 54, 94):
        c.rect(x0, 14, x0 + 22, 62, hx('#2B0F2E'))
        arch_window(c, x0 + 11, 12, 50, 8)
    for x in (4, 126 - 6):
        column(c, x, 7, 6, 60)
    banner(c, 46, 8, 34, col=PINK); banner(c, 86, 8, 34, col=PINK)
    perspective_floor(c, 62)
    return c


def wood_floor(c, horizon, cx=None, tile=22, seam=9):
    """Perspective plank floor: planks converge on the horizon, far end hazes toward the wall."""
    cx = c.w / 2 if cx is None else cx
    tones = [hx('#C58A55'), hx('#B77A4A'), hx('#D09A62'), hx('#A96E42')]
    far = hx('#7A4258')
    for y in range(horizon, c.h):
        t = y - horizon + 1
        z = 60 / t
        for x in range(c.w):
            u, v = (x - cx) * z / tile, z * 1.4
            pid = int(math.floor(u))
            base = tones[(pid * 5 + 2) % len(tones)]
            fu = u - pid
            if fu < .07:  # plank gap
                base = shade(base, .5)
            elif (v * 2 + pid * 1.3) % seam < .35:  # board seam, staggered per plank
                base = shade(base, .72)
            elif fu < .16:
                base = shade(base, 1.1)  # lit plank edge
            if t < 10:
                base = mix_dither(x, y, far, base, (t / 10) ** 1.2)
            e = abs(x - cx) / (c.w / 2)
            if bayer(x, y) < e ** 2.4 * .5:
                base = shade(base, .7)
            c.px[x, y] = base
    c.rect(0, horizon, c.w, horizon, GOLD_D)
    c.rect(0, horizon + 1, c.w, horizon + 1, WOOD_D)


def spot(c, cx, cy, rx, ry):
    """Training mat: soft pink pad with a gold ring, kept calm so the exercise sprite reads."""
    for y in range(cy - ry - 1, cy + ry + 2):
        for x in range(cx - rx - 1, cx + rx + 2):
            d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2
            if d <= .8:
                c.pt(x, y, mix_dither(x, y, hx('#B9628A'), hx('#D9779E'), .5 if d < .45 else .15))
            elif d <= 1:
                c.pt(x, y, GOLD if (x // 4) % 2 else GOLD_D)


def mirror(c, x0, top, x1, bot):
    c.rect(x0 - 2, top - 2, x1 + 2, bot + 2, GOLD_D); c.rect(x0 - 1, top - 1, x1 + 1, bot + 1, GOLD)
    for y in range(top, bot + 1):
        for x in range(x0, x1 + 1):
            c.px[x, y] = gradient(x, y, [hx('#7A5A9A'), hx('#4B2E6E'), hx('#2B0F2E')], (y - top) / (bot - top))
    for off in (0, 7):  # diagonal glare streaks
        for y in range(top, bot + 1):
            x = x0 + 3 + off + (y - top) // 2
            if x + 2 <= x1 and bayer(x, y) < .85:
                c.pt(x, y, LILAC); c.pt(x + 1, y, hx('#F2DDF5'))


def dumbbell(c, x, y):
    steel, dark, hi = hx('#C9B8D6'), hx('#5A4568'), hx('#F2E8F7')
    c.rect(x - 5, y - 3, x - 3, y, dark); c.rect(x + 3, y - 3, x + 5, y, dark)
    c.rect(x - 3, y - 2, x + 3, y - 1, steel); c.pt(x - 4, y - 3, hi); c.pt(x + 4, y - 3, hi)


def weight_rack(c, x0, x1):
    for yb in (40, 52):  # two shelves with a row of dumbbells on each
        c.rect(x0, yb, x1, yb + 1, WOOD_L); c.rect(x0, yb + 2, x1, yb + 2, WOOD_D)
        for x in range(x0 + 6, x1 - 3, 9):
            dumbbell(c, x, yb - 1)
    for x in (x0, x1 - 1):
        c.rect(x, 38, x + 1, 60, WOOD_D)


def kettlebell(c, x, y, col=PINK):
    c.circle(x, y, 3, col); c.pt(x - 1, y - 1, shade(col, 1.4))
    c.rect(x - 2, y - 5, x + 2, y - 4, hx('#2B0F2E')); c.rect(x - 2, y - 5, x - 2, y - 3, hx('#2B0F2E')); c.rect(x + 2, y - 5, x + 2, y - 3, hx('#2B0F2E'))


def gym():  # active workout stage backdrop (training hall)
    c = Canvas(130, 110)
    c.wall(0, 60, hx('#4A1A44'), hx('#6A2A52'))
    molding(c, 0)
    wainscot(c, 50, 60)
    for x0 in (30, 58, 86):  # mirror wall, centre left clear for the exercise sprite
        mirror(c, x0, 12, x0 + 14, 44)
    for x in (2, 123):
        column(c, x, 5, 6, 58)
    banner(c, 22, 8, 32, col=PINK); banner(c, 107, 8, 32, col=PINK)
    weight_rack(c, 8, 28)  # dumbbell rack, left
    for x, col in ((108, PINK), (114, GOLD), (120, LILAC)):  # kettlebells, right
        kettlebell(c, x, 56, col)
    c.rect(104, 58, 124, 59, WOOD); c.rect(104, 59, 124, 59, WOOD_D)
    wood_floor(c, 62)
    spot(c, 65, 92, 36, 9)
    c.vignette(.35)
    return c


SCENES = {
    'goal': goal, 'library': library, 'trainhall': trainhall, 'courtroom': courtroom, 'chambers': chambers,
    'records': records, 'notice': notice, 'office': office, 'wardrobe': wardrobe, 'clerk': clerk,
    'splash': splash, 'onboarding': onboarding, 'balcony': balcony, 'victory': victory, 'stagehall': stagehall, 'gym': gym,
}

if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else '.'
    from PIL import Image
    sheet_items = []
    for name, fn in SCENES.items():
        sheet_items.append((name, fn().save(out, name)))
        print('saved', name)
    # contact sheet for quick review (banners only), 2 columns
    banners = [(n, im) for n, im in sheet_items if im.size == B]
    sheet = Image.new('RGB', (130 * 2 * 2 + 12, (48 * 2 + 4) * ((len(banners) + 1) // 2)), (20, 10, 30))
    for i, (_, im) in enumerate(banners):
        sheet.paste(im.resize((260, 96), Image.NEAREST), ((i % 2) * 272, (i // 2) * 100))
    sheet.save(Path(out) / '_contact.png')
