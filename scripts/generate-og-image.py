#!/usr/bin/env python3
"""
Generate premium OG image (1200×630) with real influencer avatars.
Outputs: frontend/public/og-image.png

Usage: python3 scripts/generate-og-image.py
"""

import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import requests
from io import BytesIO

# ─── Config ──────────────────────────────────────────────────────
W, H = 1200, 630
BG       = (0x09, 0x09, 0x0B)
SURFACE  = (0x10, 0x10, 0x18)
GOLD     = (0xF5, 0x9E, 0x0B)
GOLD_DIM = (0xD9, 0x77, 0x06)
WHITE    = (0xFA, 0xFA, 0xFA)
MUTED    = (0xA1, 0xA1, 0xAA)
DIM      = (0x71, 0x71, 0x7A)
BORDER   = (0x27, 0x27, 0x2A)

TIER_COLORS = {
    'S': (0xF5, 0x9E, 0x0B),
    'A': (0x06, 0xB6, 0xD4),
    'B': (0x10, 0xB9, 0x81),
    'C': (0x71, 0x71, 0x7A),
}

AVATARS = [
    {'handle': 'saylor',          'name': 'Saylor',   'tier': 'S', 'role': 'Captain'},
    {'handle': 'blknoiz06',       'name': 'Ansem',    'tier': 'A', 'role': None},
    {'handle': 'VitalikButerin',  'name': 'Vitalik',  'tier': 'A', 'role': None},
    {'handle': 'zachxbt',         'name': 'ZachXBT',  'tier': 'B', 'role': None},
    {'handle': 'cz_binance',      'name': 'CZ',       'tier': 'C', 'role': None},
]

# ── Card & formation layout ──────────────────────────────────────
CARD_X, CARD_Y = 610, 30
CARD_W, CARD_H = 560, 570
CARD_CX = CARD_X + CARD_W // 2   # 890

# Bigger avatars, more spread
AVATAR_R = {0: 54, 1: 44, 2: 44, 3: 40, 4: 40}
RING_W   = {0: 4, 1: 3, 2: 3, 3: 2.5, 4: 2.5}

FORMATION = {
    0: (CARD_CX, CARD_Y + 150),          # Captain — top center
    1: (CARD_CX - 135, CARD_Y + 300),    # A-tier left
    2: (CARD_CX + 135, CARD_Y + 300),    # A-tier right
    3: (CARD_CX - 135, CARD_Y + 435),    # B-tier
    4: (CARD_CX + 135, CARD_Y + 435),    # C-tier
}

# ─── Fonts ───────────────────────────────────────────────────────
FONT_DIR = '/System/Library/Fonts/Supplemental/'

def get_font(size, bold=False):
    if bold:
        for name in ['Arial Bold.ttf', 'Helvetica Bold.ttf']:
            p = os.path.join(FONT_DIR, name)
            if os.path.exists(p):
                return ImageFont.truetype(p, size)
    for name in ['Arial.ttf', 'Helvetica.ttf']:
        p = os.path.join(FONT_DIR, name)
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()

# ─── Avatar helpers ──────────────────────────────────────────────

def fetch_avatar(handle, size=300):
    url = f'https://unavatar.io/twitter/{handle}?size={size}'
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        return Image.open(BytesIO(resp.content)).convert('RGBA').resize((size, size), Image.LANCZOS)
    except Exception as e:
        print(f'  Warning: Could not fetch @{handle}: {e}')
        return None

def make_circular(img, size):
    big = size * 4
    img_big = img.resize((big, big), Image.LANCZOS)
    mask = Image.new('L', (big, big), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, big-1, big-1], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(radius=2))
    out = Image.new('RGBA', (big, big), (0, 0, 0, 0))
    out.paste(img_big, (0, 0), mask)
    return out.resize((size, size), Image.LANCZOS)

# ─── Main ────────────────────────────────────────────────────────

def generate():
    print('Generating OG image...')
    img = Image.new('RGBA', (W, H), BG)
    draw = ImageDraw.Draw(img)

    # ── Background glows ─────────────────────────────────────────
    for gcx, gcy, radius, intensity in [
        (CARD_CX, H//2, 380, 10),   # formation glow
        (280, H//2, 280, 6),         # branding glow
    ]:
        g = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        gd = ImageDraw.Draw(g)
        for r in range(radius, 0, -2):
            a = int(intensity * (1 - r / radius))
            gd.ellipse([gcx-r, gcy-r, gcx+r, gcy+r], fill=(*GOLD, a))
        g = g.filter(ImageFilter.GaussianBlur(radius=50))
        img = Image.alpha_composite(img, g)
    draw = ImageDraw.Draw(img)

    # ── Chrome: gold rules + corner brackets ─────────────────────
    draw.rectangle([0, 0, W, 3], fill=GOLD)
    draw.rectangle([0, H-3, W, H], fill=(*GOLD_DIM, 100))

    bc = (*GOLD, 120)
    bl = 28  # bracket length
    # Top-left
    draw.rectangle([40, 40, 40+bl, 42], fill=bc)
    draw.rectangle([40, 40, 42, 40+bl], fill=bc)
    # Bottom-left
    draw.rectangle([40, H-42, 40+bl, H-40], fill=bc)
    draw.rectangle([40, H-40-bl, 42, H-40], fill=bc)
    # Top-right
    draw.rectangle([W-40-bl, 40, W-40, 42], fill=bc)
    draw.rectangle([W-42, 40, W-40, 40+bl], fill=bc)
    # Bottom-right
    draw.rectangle([W-40-bl, H-42, W-40, H-40], fill=bc)
    draw.rectangle([W-42, H-40-bl, W-40, H-40], fill=bc)

    # ── LEFT SIDE: Branding ──────────────────────────────────────
    lcx = 280

    # Logo — load the real 1024×1024 PNG
    logo_path = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', 'logo.png')
    try:
        logo_raw = Image.open(logo_path).convert('RGBA')
        # Crop out transparent padding (find bounding box of non-transparent pixels)
        bbox = logo_raw.getbbox()
        if bbox:
            logo_raw = logo_raw.crop(bbox)
        logo_sz = 240
        # Maintain aspect ratio
        w, h = logo_raw.size
        if w > h:
            new_w = logo_sz
            new_h = int(logo_sz * h / w)
        else:
            new_h = logo_sz
            new_w = int(logo_sz * w / h)
        logo_resized = logo_raw.resize((new_w, new_h), Image.LANCZOS)
        img.paste(logo_resized, (lcx - new_w//2, 75), logo_resized)
        draw = ImageDraw.Draw(img)
    except Exception as e:
        print(f'  Warning: Could not load logo: {e}')

    # "FORESIGHT" wordmark
    font_title = get_font(62, bold=True)
    draw.text((lcx, 260), 'FORESIGHT', fill=WHITE, font=font_title, anchor='mt')

    # Gold underline
    ul_w = 360
    for x in range(lcx - ul_w//2, lcx + ul_w//2):
        d = abs(x - lcx) / (ul_w//2)
        draw.rectangle([x, 326, x+1, 329], fill=(*GOLD, int(255 * max(0, 1 - d*d))))

    # Tagline
    draw.text((lcx, 350), 'BACK CT CALLS. GET PAID.',
              fill=MUTED, font=get_font(18, bold=True), anchor='mt')

    # CTA button
    bw, bh = 280, 50
    bx, by = lcx - bw//2, 400
    draw.rounded_rectangle([bx, by, bx+bw, by+bh], radius=25, outline=GOLD, width=2)
    draw.text((lcx, by + bh//2), 'DRAFT YOUR TEAM',
              fill=GOLD, font=get_font(17, bold=True), anchor='mm')

    # Prize info
    draw.text((lcx, 478), 'FREE ENTRY  ·  WIN SOL PRIZES',
              fill=DIM, font=get_font(14, bold=True), anchor='mt')

    # URL
    draw.text((lcx, 560), 'ct-foresight.xyz',
              fill=(*DIM, 160), font=get_font(14), anchor='mt')

    # ── RIGHT SIDE: Formation card ───────────────────────────────
    draw.rounded_rectangle(
        [CARD_X, CARD_Y, CARD_X+CARD_W, CARD_Y+CARD_H],
        radius=18, fill=SURFACE, outline=BORDER, width=1)

    # "CT DRAFT" header
    draw.text((CARD_CX, CARD_Y + 35), 'CT DRAFT',
              fill=GOLD, font=get_font(18, bold=True), anchor='mt')
    hu = 170
    draw.line([CARD_CX-hu//2, CARD_Y+62, CARD_CX+hu//2, CARD_Y+62],
              fill=(*GOLD, 80), width=1)

    # Formation lines (subtle gold, drawn before avatars)
    lc = (*GOLD, 30)
    for parent, child in [(0,1), (0,2), (1,3), (2,4)]:
        px, py = FORMATION[parent]
        cx_, cy_ = FORMATION[child]
        pr = AVATAR_R[parent]
        cr = AVATAR_R[child]
        draw.line([px, py+pr+4, cx_, cy_-cr-4], fill=lc, width=1)

    # ── Fetch & place avatars ────────────────────────────────────
    print('Fetching avatars...')
    for idx, info in enumerate(AVATARS):
        cx, cy = FORMATION[idx]
        r = AVATAR_R[idx]
        rw = RING_W[idx]
        tc = TIER_COLORS[info['tier']]

        print(f'  Fetching @{info["handle"]}...')
        avatar_raw = fetch_avatar(info['handle'], size=r*6)

        # Glow
        gl = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(gl).ellipse([cx-r-16, cy-r-16, cx+r+16, cy+r+16],
                                    fill=(*tc, 30))
        gl = gl.filter(ImageFilter.GaussianBlur(radius=10))
        img = Image.alpha_composite(img, gl)
        draw = ImageDraw.Draw(img)

        # Outer ring
        orr = r + int(rw) + 3
        draw.ellipse([cx-orr, cy-orr, cx+orr, cy+orr],
                      outline=tc, width=int(rw*2))

        # Dark fill
        draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=(0x1A, 0x1A, 0x24))

        # Avatar photo
        if avatar_raw:
            circ = make_circular(avatar_raw, r*2)
            img.paste(circ, (cx-r, cy-r), circ)
            draw = ImageDraw.Draw(img)

        # Tier badge
        br = 12 if idx == 0 else 10
        bx_ = cx + int(r * 0.72)
        by_ = cy + int(r * 0.50)
        draw.ellipse([bx_-br, by_-br, bx_+br, by_+br], fill=tc)
        draw.ellipse([bx_-br, by_-br, bx_+br, by_+br], outline=SURFACE, width=2)
        draw.text((bx_, by_), info['tier'], fill=BG,
                  font=get_font(12, bold=True), anchor='mm')

        # Crown for captain
        if info['role'] == 'Captain':
            cwy = cy - r - 20
            cw = 30
            draw.polygon([
                (cx-cw//2, cwy+14), (cx-cw//4, cwy+4), (cx-cw//8, cwy+10),
                (cx, cwy), (cx+cw//8, cwy+10), (cx+cw//4, cwy+4), (cx+cw//2, cwy+14),
            ], fill=GOLD)
            draw.rectangle([cx-cw//2, cwy+13, cx+cw//2, cwy+18], fill=GOLD)

        # Name
        ny = cy + r + 12
        draw.text((cx, ny), info['name'],
                  fill=WHITE if idx == 0 else MUTED,
                  font=get_font(13 if idx == 0 else 12, bold=idx==0), anchor='mt')

        # Captain role label
        if info['role']:
            draw.text((cx, ny + 17), '2× Multiplier', fill=DIM,
                      font=get_font(10), anchor='mt')

    # Card footer
    draw.text((CARD_CX, CARD_Y + CARD_H - 20),
              'POWERED BY TAPESTRY PROTOCOL',
              fill=(*DIM, 140), font=get_font(10), anchor='mm')

    # ── Save ─────────────────────────────────────────────────────
    out_path = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', 'og-image.png')
    final = Image.new('RGB', (W, H), BG)
    final.paste(img, (0, 0), img)
    final.save(out_path, 'PNG', optimize=True)
    print(f'\nSaved: {out_path}')
    print(f'Size: {os.path.getsize(out_path) / 1024:.0f} KB')

if __name__ == '__main__':
    generate()
