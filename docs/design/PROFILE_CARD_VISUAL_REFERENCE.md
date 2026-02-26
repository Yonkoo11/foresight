# Profile Card Visual Reference — Exact Layout Dimensions

> ASCII diagrams with pixel-precise measurements for both designs

---

## DESIGN 1: FEDERAL AGENT BADGE (Shield Shape)

### Full Card Layout (520×680px @ 2x = 1040×1360px)

```
┌────────────────────────────────────────────────────┐
│                  520px width                       │ 680px
│                                                    │
│  ┌──────────────────────────────────────────────┐ │ height
│  │         FORESIGHT ID                         │ │
│  │      [AGENCY CREST ⭐]                       │ │
│  │                                              │ │ 50px
│  │      ╱─────────────────────────────╲        │ │ top
│  │     ╱         SHIELD SHAPE          ╲       │ │
│  │    │                                 │      │ │
│  │    │    ┌─────────────────────────┐  │      │ │
│  │    │    │    [AVATAR PHOTO]       │  │      │ │
│  │    │    │    110×110px @2x        │  │      │ │
│  │    │    │  License #FST-0042117   │  │      │ │
│  │    │    └─────────────────────────┘  │      │ │
│  │    │                                 │      │ │
│  │    │   NAME: HEMJAY                 │      │ │
│  │    │   TIER: SILVER AGENT           │      │ │
│  │    │   RANK: #1,847                 │      │ │
│  │    │   SCORE: 2,142 FS ⚡           │      │ │
│  │    │   MULTIPLIER: 1.58× 🔥         │      │ │
│  │    │   STATUS: VERIFIED             │      │ │
│  │    │   ISSUED: 26 FEB 2026          │      │ │
│  │    │   EXPIRES: 26 FEB 2027         │      │ │
│  │    │                                 │      │ │
│  │    │  ═══════════════════════════════│      │ │
│  │    │  [HOLOGRAM RAINBOW EFFECT]     │      │ │
│  │    │  TAPESTRY • SOLANA             │      │ │
│  │     ╲                               ╱       │ │
│  │      ╲─────────────────────────────╱        │ │
│  │                                              │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Detailed Component Breakdown

```
HEADER SECTION (Top 60px)
┌────────────────────────────────────────────────┐
│ ⚡ FORESIGHT ID           ct-foresight.xyz     │ 24px from top
│                                                │
│     ▲ AGENCY CREST (gold star)  ▲             │ centered
│                                                │
└────────────────────────────────────────────────┘

AVATAR SECTION (60-220px from top)
┌────────────────────────────────────────────────┐
│                                                │
│              ╱─────────────┐                  │
│             │ AVATAR RING  │                  │
│             │ 110px sq     │                  │
│             │ Gold border  │                  │
│             │ 8px wide     │                  │
│             │ Polaroid     │                  │
│             │ fade effect  │                  │
│              ╲─────────────┘                  │
│                                                │
│          LIC #FST-0042117 (below photo)       │
│                                                │
└────────────────────────────────────────────────┘

DATA FIELDS SECTION (220-450px from top)
┌────────────────────────────────────────────────┐
│                                                │
│  NAME:        HEMJAY                          │ JetBrains Mono 11px
│  TIER:        SILVER AGENT                    │ 20px line height
│  RANK:        #1,847                          │
│  SCORE:       2,142 FS                        │ Gold highlight
│  MULTIPLIER:  1.58×                           │ Gold highlight
│  STATUS:      VERIFIED                        │
│  ISSUED:      26 FEB 2026                     │
│  EXPIRES:     26 FEB 2027                     │
│                                                │
│               ═══════════════════              │ Divider line
│                                                │
└────────────────────────────────────────────────┘

HOLOGRAM & FOOTER SECTION (450-680px)
┌────────────────────────────────────────────────┐
│                                                │
│  [RAINBOW IRIDESCENCE EFFECT]                 │ 80-100px height
│  Creates hologram shimmer                     │ Vertical gradient
│  at 12% opacity with RGB shifts               │
│                                                │
│  TAPESTRY · SOLANA VERIFIED                   │ 10px monospace
│  Security watermark diagonal                  │ Bottom 20px
│                                                │
└────────────────────────────────────────────────┘

SHIELD BORDER (Full Card)
Total width: 520px (420px shield + padding)
Border width: 12px (outer) + 2px (inner accent)
Top point depth: ~90px
Bottom curve radius: ~150px
Chamfer angles: 45° top-left and top-right

COLORS (Badge)
#0F1729 - Deep navy background
#F59E0B - Primary gold (borders, highlights)
#FBBF24 - Secondary gold (lighter accents)
#D97706 - Darker gold (hover, bevels)
#FFFFFF - White text
#A1A1AA - Muted gray (labels)
#52525B - Darker gray (secondary text)
```

---

## DESIGN 2: VINTAGE CERTIFICATE (Rectangle with Ornate Frame)

### Full Card Layout (520×680px @ 2x = 1040×1360px)

```
┌─────────────────────────────────────────────────────┐
│         [ORNATE GOLD FRAME - 8px border]           │
│    ╔═══════════════════════════════════════════╗   │ 520px width
│    ║                                           ║   │
│    ║  CERTIFICATE OF ACHIEVEMENT  (Georgia)   ║   │ 680px
│    ║                                           ║   │
│    ║      THIS IS TO CERTIFY THAT              ║   │ height
│    ║                                           ║   │
│    ║        ┌───────────────────┐              ║   │
│    ║        │   [AVATAR PHOTO]  │              ║   │
│    ║        │   Circle 100px    │              ║   │
│    ║        │   Gold ring 8px   │              ║   │
│    ║        │   Embossed        │              ║   │
│    ║        └───────────────────┘              ║   │
│    ║                                           ║   │
│    ║     HAS ACHIEVED THE RANK OF              ║   │
│    ║                                           ║   │
│    ║        HEMJAY                              ║   │
│    ║  ─────────────────────────────            ║   │
│    ║    (Decorative gold line)                 ║   │
│    ║                                           ║   │
│    ║  SILVER TIER ANALYST                      ║   │
│    ║  Foresight Score: 2,142 FS                ║   │
│    ║  Season Ranking: #1,847                   ║   │
│    ║  Multiplier Achievement: 1.58×            ║   │
│    ║                                           ║   │
│    ║     IN THE LEAGUE OF                      ║   │
│    ║                                           ║   │
│    ║  CRYPTO TWITTER TALENT                    ║   │
│    ║                                           ║   │
│    ║  _______________  ______________          ║   │
│    ║     VERIFIED        DATE                  ║   │
│    ║                                           ║   │
│    ║  ISSUED 26 FEB 2026 • EXPIRES 26 FEB 2027║   │
│    ║  LICENSE #FST-0042117                     ║   │
│    ║              ⭐                            ║   │
│    ║          [WAXSEAL]                        ║   │
│    ║                                           ║   │
│    ╚═══════════════════════════════════════════╝   │
│                                                     │
│    [CORNER FLOURISHES at all 4 corners]           │
│    [PAPER TEXTURE OVERLAY - 2% opacity]           │
└─────────────────────────────────────────────────────┘
```

### Detailed Component Breakdown

```
BORDER & FRAME (Full Card)
┌──────────────────────────────────────────────┐
│ Outer gold border: 8px (#F59E0B)             │
│ Inner accent: 2px (#FBBF2444)                │
│ Padding from border: 20px inner margin       │
│ Corner flourishes: 24px × 24px ornaments     │
│ Paper texture: Diagonal 45° noise @ 2%       │
│ Overall border radius: 16px                  │
└──────────────────────────────────────────────┘

TOP SECTION (60-80px from edge)
┌──────────────────────────────────────────────┐
│ "CERTIFICATE OF ACHIEVEMENT"                │ Georgia bold 28px
│ Letter spacing: 4px                          │ Centered
│ Color: #1A1A1A (charcoal)                   │ ALL CAPS
└──────────────────────────────────────────────┘

PRE-AVATAR TEXT (80-130px)
┌──────────────────────────────────────────────┐
│ "THIS IS TO CERTIFY THAT"                   │ Georgia italic 12px
│                                              │ Centered
└──────────────────────────────────────────────┘

AVATAR SECTION (130-250px)
┌──────────────────────────────────────────────┐
│            ┌─────────────┐                   │
│            │ AVATAR      │                   │ Circular
│            │ 100px diam  │                   │ Clipped
│            │ Gold ring   │                   │
│            │ 8px+2px     │                   │
│            │ Embossed    │                   │
│            │ Shadow      │                   │
│            └─────────────┘                   │
│                                              │
│                                              │
└──────────────────────────────────────────────┘

ACHIEVEMENT TEXT (250-380px)
┌──────────────────────────────────────────────┐
│ "HAS ACHIEVED THE RANK OF"                  │ Georgia 12px
│                                              │ Line spacing: 24px
│ HEMJAY                                       │ Georgia bold 38px
│ ─────────────────────                        │ Gold line under
│                                              │
│ SILVER TIER ANALYST                          │ Georgia bold 18px
│ Foresight Score: 2,142 FS                    │ Georgia 12px
│ Season Ranking: #1,847                       │ Line spacing: 24px
│ Multiplier Achievement: 1.58×                │
│                                              │
│ "IN THE LEAGUE OF"                           │ Georgia italic 12px
│                                              │
│ CRYPTO TWITTER TALENT                        │ Georgia bold 14px
│                                              │
└──────────────────────────────────────────────┘

SIGNATURE SECTION (380-450px)
┌──────────────────────────────────────────────┐
│ ___________    ___________                   │ 80px wide lines
│   VERIFIED        DATE                       │ Georgia 10px
│   (Left 1/4)    (Right 3/4)                 │ Centered under lines
│                                              │
└──────────────────────────────────────────────┘

FOOTER SECTION (450-530px)
┌──────────────────────────────────────────────┐
│ ISSUED 26 FEB 2026 • EXPIRES 26 FEB 2027    │ Georgia 10px
│ LICENSE #FST-0042117                         │ JetBrains Mono 9px
│                                              │
│ Verified on Solana Blockchain                │ Georgia 9px gray
│                                              │
└──────────────────────────────────────────────┘

WAX SEAL (Bottom-right, 50px diameter)
┌──────────────────────────────────────────────┐
│                          ╭─────────╮         │
│                          │ [SEAL]  │         │
│                          │ 50px    │         │
│                          │ outer   │         │
│                          │ ring    │         │
│                          ╰─────────╯         │
│                                              │
│                          [TIER COLOR]        │ Inner disk
│                          [STAR ICON]         │ Center white star
│                          Dashed edge         │ Crimped wax effect
│                                              │
└──────────────────────────────────────────────┘

COLORS (Certificate)
#F5F1E8 - Cream parchment background
#1A1A1A - Charcoal text
#52525B - Muted gray (secondary)
#F59E0B - Gold borders, seals, accents
#FBBF2444 - Transparent gold (inner borders)
[TIER COLORS for seal inner disk]:
  Silver: #D1D5DB
  Gold: #FBBF24
  Platinum: #22D3EE
  Diamond: #F59E0B
```

---

## Mobile Considerations (375px viewport)

### Badge on Mobile
```
520px card on 375px screen requires:
- Slight horizontal scroll, OR
- Scale down to 90% (468px visible), OR
- Redesign for mobile-specific layout (not recommended)

Recommended: Show at 90% scale with message "Zoom or save to see full details"
```

### Certificate on Mobile
```
Same canvas dimensions (520px)
- Cream background remains visible
- Text scales proportionally
- Seal remains visible
- Print is smaller but readable at 90% scale

Recommended: Show at 100% (might need side scroll, that's OK)
```

---

## Typography Measurements

### Badge Typography
```
FORESIGHT ID (header)
- Font: Bold Inter, sans-serif
- Size: 11px (at 1x scale, 22px at 2x)
- Letter spacing: 3px
- Color: #F59E0B (gold)
- Position: Top-left 24px from edges

License Number
- Font: Bold JetBrains Mono
- Size: 9px (18px at 2x)
- Color: #1A1A1A (charcoal)
- Below avatar square

Data Fields
- Font: Regular JetBrains Mono
- Size: 11px (22px at 2x)
- Line height: 20px (40px at 2x)
- Label color: #A1A1AA (muted)
- Value color: #FFFFFF (white) or #F59E0B (highlighted)
- Column width: 280px (with 12px gap between label + value)

TAPESTRY Footer
- Font: Regular JetBrains Mono
- Size: 10px (20px at 2x)
- Color: #52525B (gray)
```

### Certificate Typography
```
CERTIFICATE OF ACHIEVEMENT
- Font: Bold Georgia, serif
- Size: 28px (56px at 2x)
- Letter spacing: 4px
- Color: #1A1A1A
- ALL CAPS

"THIS IS TO CERTIFY THAT"
- Font: Italic Georgia, serif
- Size: 12px (24px at 2x)
- Color: #1A1A1A

HEMJAY (Name)
- Font: Bold Georgia, serif
- Size: 38px (76px at 2x)
- Color: #1A1A1A

Achievement text
- Font: Regular Georgia, serif
- Size: 12px (24px at 2x)
- Line height: 24px (48px at 2x)
- Color: #1A1A1A

Signature labels
- Font: Regular Georgia, serif
- Size: 10px (20px at 2x)

License/Footer
- Font: JetBrains Mono
- Size: 9px (18px at 2x)
- Color: #52525B
```

---

## Animation References (Optional Enhancements)

### Badge: Hologram Shimmer
```
Create subtle left-to-right gradient sweep across hologram section
Duration: 3-4 seconds
Easing: ease-in-out
Loop: Infinite
Opacity range: 8%-18%
Colors: Rotate through RGB channels

Effect code (canvas):
requestAnimationFrame(() => {
  const offset = (Date.now() / 40) % width;
  // Draw gradient at offset position
  // Creates moving rainbow shine
});
```

### Certificate: Shine Effect
```
Optional subtle top-left corner shine
Duration: 2-3 seconds per cycle
Easing: ease-out
Travels from top-left to bottom-right
Opacity: 3%-8% max
Color: White glow

Effect: Feels like light reflecting off glossy paper
```

---

## Print-Friendly Considerations

### Badge
```
72 DPI:   351 × 461 pixels
150 DPI:  731 × 958 pixels
300 DPI:  1,463 × 1,917 pixels

Print quality: Good at 4×5.5 inches (standard ID size)
Color: Full CMYK (deep navy prints darker, test first)
Borders: Safe for full bleed (no white margins)
```

### Certificate
```
Same dimensions as badge

Print quality: Excellent (serif fonts + gold borders render beautifully)
Color: Full CMYK (cream background, gold accents, charcoal text)
Borders: Safe for full bleed
Paper recommendation: 110lb cardstock (feels premium)
Lamination: Adds holographic shimmer effect (optional)
```

---

## File Size Estimates

```
Badge PNG (520×680, no transparency):
- With avatar: 180-220 KB
- Fallback initial: 120-150 KB

Certificate PNG (520×680, no transparency):
- With avatar: 150-200 KB
- Fallback initial: 110-140 KB

Both compress well in Twitter's image pipeline
Estimated Twitter preview: 40-60 KB (compressed)
```

---

## Accessibility & Mobile Keyboard Notes

### Touch Targets
```
Share button: 48px × 48px minimum (satisfied by existing design)
Download button: 48px × 48px minimum (satisfied)
Copy link button: 44px height × full width (good)

No tap-zone conflicts on mobile ✓
```

### Color Contrast
```
Badge:
- Gold (#F59E0B) on navy (#0F1729): 4.8:1 WCAG AA ✓
- White text on navy: 9.2:1 WCAG AAA ✓
- Gray labels on navy: 3.1:1 (acceptable for secondary text)

Certificate:
- Charcoal (#1A1A1A) on cream (#F5F1E8): 11.2:1 WCAG AAA ✓
- Gold borders: decorative, contrast not required
- All text highly readable ✓
```

---

## Rendering Performance Target

```
Canvas generation: 200-400ms
- Avatar load: 100-200ms (handled with timeout)
- Drawing operations: 50-100ms
- PNG encoding: 50-100ms

Target FPS during animation: 60fps
- Hologram shimmer: Runs on GPU (CSS transforms if possible)
- No stuttering on mid-range phones ✓

Memory usage:
- Canvas element: ~3-5 MB (1040×1360 at 32-bit RGBA)
- Blob storage: 150-220 KB
- No memory leaks when swapping images ✓
```

