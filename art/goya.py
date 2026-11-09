"""Slice the GOYA character sheet into transparent sprites.
Usage: python art/goya.py <sheet.png> <expressions.png> <out_dir> [name=outfit.png ...]
Outfit args are single full-body images saved as goya-<name>.png (e.g. workout=3.png).
Crop boxes are for the v1 sheet (1024x1536); expressions come from a 4x3 grid sheet (1536x1024). Each crop is trimmed to its opaque bounds.
"""
import sys
from PIL import Image

SHEET = {
    'goya-full':    (0, 0, 470, 1215),       # hero pose
    'goya-closeup': (462, 0, 1024, 545),
    'goya-front':   (478, 580, 640, 1075),
    'goya-side':    (640, 580, 790, 1075),
    'goya-back':    (792, 580, 935, 1075),
}
# face crop (on the raw outfit image) used as that outfit's small avatar
FACE_CROPS = {'workout': (300, 0, 740, 360), 'rest': (360, 0, 800, 360)}

# 4 columns x 3 rows, reading order
EXPR = ['neutral', 'smug', 'content', 'think',
        'laugh', 'talk', 'surprise', 'shy',
        'angry', 'flirt', 'proud', 'sigh']


def despeckle(im, min_area):
    """Drop tiny opaque islands (bleed from neighbouring panels on the sheet)."""
    a = im.getchannel('A'); w, h = im.size; px = a.load()
    seen = set(); kill = []
    for y in range(h):
        for x in range(w):
            if px[x, y] > 8 and (x, y) not in seen:
                comp, stack = [], [(x, y)]; seen.add((x, y))
                while stack:
                    cx, cy = stack.pop(); comp.append((cx, cy))
                    for nx, ny in ((cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)):
                        if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in seen and px[nx, ny] > 8:
                            seen.add((nx, ny)); stack.append((nx, ny))
                xs = [c[0] for c in comp]
                edge_sliver = (min(xs) == 0 or max(xs) == w - 1) and (max(xs) - min(xs)) < 24
                if len(comp) < min_area or edge_sliver:
                    kill += comp
    out = im.copy(); o = out.load()
    for x, y in kill:
        o[x, y] = (0, 0, 0, 0)
    return out


def knockout(im, lo=225, chroma=14):
    """Outfits exported without alpha have a fake white/grey checker 'transparent' background.
    Flood-fill inwards from the border over near-white, low-chroma pixels and make them transparent
    (dark outlines stop the fill, so white clothing inside the figure survives)."""
    im = im.convert('RGBA'); w, h = im.size; px = im.load()
    bg = lambda p: min(p[:3]) >= lo and max(p[:3]) - min(p[:3]) <= chroma
    stack = [(x, y) for x in range(w) for y in (0, h - 1)] + [(x, y) for y in range(h) for x in (0, w - 1)]
    seen = set(stack)
    while stack:
        x, y = stack.pop()
        if not bg(px[x, y]):
            continue
        px[x, y] = (0, 0, 0, 0)
        for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in seen:
                seen.add((nx, ny)); stack.append((nx, ny))
    return im


def trim(im):
    box = im.getchannel('A').point(lambda v: 255 if v > 8 else 0).getbbox()
    return im.crop(box) if box else im


def main(src, expr_src, out, *outfits):
    im = Image.open(src).convert('RGBA')
    jobs = {k: im.crop(b) for k, b in SHEET.items()}
    ex = Image.open(expr_src).convert('RGBA')
    cw, ch = ex.width // 4, ex.height // 3
    for i, name in enumerate(EXPR):
        x0, y0 = (i % 4) * cw, (i // 4) * ch
        jobs[f'goya-{name}'] = ex.crop((x0, y0, x0 + cw, y0 + ch))
    done = {}
    for k, v in jobs.items():
        done[k] = trim(despeckle(v, 60))
        done[k].save(f'{out}/{k}.png')
        print(k, done[k].size)
    # names the app already references
    for alias in ('goya-home', 'goya-splash', 'goya-victory'):
        done['goya-full'].save(f'{out}/{alias}.png')
    done['goya-neutral'].save(f'{out}/goya-avatar.png')
    for spec in outfits:
        name, path = spec.split('=', 1)
        raw = Image.open(path)
        raw = raw.convert('RGBA') if 'A' in raw.getbands() else knockout(raw)
        o = trim(despeckle(raw, 60))
        if name in FACE_CROPS:
            f = trim(despeckle(raw.crop(FACE_CROPS[name]), 60))
            f.save(f'{out}/goya-{name}-avatar.png')
            print(f'goya-{name}-avatar', f.size)
        o.save(f'{out}/goya-{name}.png')
        print(f'goya-{name}', o.size)


if __name__ == '__main__':
    main(*sys.argv[1:])
