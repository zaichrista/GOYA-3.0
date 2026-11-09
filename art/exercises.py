"""Slice the exercise pose sheet into per-exercise two-frame sprites.
Usage: python art/exercises.py <sheet.png> <out_dir>

The sheet holds 32 poses in reading order, 2 frames per exercise, in the same order as EXERCISES in
app/src/data.ts. The sheet's background is near-transparent haze (alpha ~10) so we cut on alpha, find the
poses as connected blobs (each pose is one blob thanks to its outline), and pad every frame onto one shared canvas (feet on the floor line, centred) so
sprites keep the same scale and the 2-frame animation doesn't jitter.
"""
import sys
from array import array
from PIL import Image

IDS = ['jacks', 'squats', 'pushups', 'climbers', 'burpees', 'plank', 'highknees', 'lunges',
       'crunches', 'bridges', 'boxing', 'wallsit', 'skaters', 'twists', 'legraise', 'stretch']


def blobs(im, thr=110, step=1):
    w, h = im.size
    a = im.getchannel('A').load()
    seen = array('H', bytes(2 * w * h))  # 0 = unseen, else blob id
    out = []
    for y0 in range(0, h, step):
        for x0 in range(0, w, step):
            if a[x0, y0] >= thr and not seen[y0 * w + x0]:
                bid = len(out) + 1
                stack = [(x0, y0)]; seen[y0 * w + x0] = bid
                x1 = x2 = x0; y1 = y2 = y0; n = 0
                while stack:
                    x, y = stack.pop(); n += 1
                    x1, x2, y1, y2 = min(x1, x), max(x2, x), min(y1, y), max(y2, y)
                    for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1)):
                        if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] and a[nx, ny] >= thr:
                            seen[ny * w + nx] = bid; stack.append((nx, ny))
                out.append([x1, y1, x2, y2, n, bid])
    return out, seen


def poses(bs, min_area=3000):
    """Poses are the big blobs; specks of haze are dropped."""
    return [b for b in bs if b[4] >= min_area]


def order(bs, rows=4):
    bs = sorted(bs, key=lambda b: (b[1] + b[3]) / 2)
    per = len(bs) // rows
    res = []
    for r in range(rows):
        row = sorted(bs[r * per:(r + 1) * per], key=lambda b: b[0])
        res += row
    return res


def cut(im, labels, b):
    """Crop a pose, keeping only its own pixels (bboxes of neighbouring poses overlap)."""
    w = im.width
    c = im.crop((b[0], b[1], b[2] + 1, b[3] + 1))
    px = c.load()
    for y in range(c.height):
        row = (b[1] + y) * w + b[0]
        for x in range(c.width):
            if labels[row + x] != b[5]:
                px[x, y] = (0, 0, 0, 0)
    return c


def icon(c, size=128, pad=6):
    """Square icon: the pose trimmed to its bounds and scaled to fit (smooth downscale, shown small in lists)."""
    c = c.crop(c.getchannel('A').getbbox())
    k = (size - 2 * pad) / max(c.size)
    c = c.resize((max(1, round(c.width * k)), max(1, round(c.height * k))), Image.LANCZOS)
    cv = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    cv.paste(c, ((size - c.width) // 2, (size - c.height) // 2), c)
    return cv


def main(src, out):
    im = Image.open(src).convert('RGBA')
    # hard alpha: haze -> 0, pose -> 255
    a = im.getchannel('A').point(lambda v: 255 if v >= 110 else 0)
    im.putalpha(a)
    found, labels = blobs(im)
    bs = order(poses(found))
    print(len(bs), 'poses')
    if len(bs) != 32:
        for b in bs:
            print(b)
        raise SystemExit('expected 32 poses')
    crops = [cut(im, labels, b) for b in bs]
    W = max(c.width for c in crops); H = max(c.height for c in crops)
    pad = 6
    W += pad * 2; H += pad * 2
    print('canvas', W, H)
    for i, ex in enumerate(IDS):
        for k in range(2):
            c = crops[i * 2 + k]
            cv = Image.new('RGBA', (W, H), (0, 0, 0, 0))
            cv.paste(c, ((W - c.width) // 2, H - pad - c.height), c)
            cv.save(f'{out}/{ex}-{k + 1}.png')
        icon(crops[i * 2]).save(f'{out}/{ex}-icon.png')


if __name__ == '__main__':
    main(*sys.argv[1:3])
