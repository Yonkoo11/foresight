# War Room Design — Visual Reference Guide

> **Visual specifications and before/after comparisons**
> **For:** Designers building the War Room direction

---

## Color Reference

### Color Swatches

```
PRIMARY - GOLD #F59E0B
██████████████████ Used for: CTAs, rank #1, achievements, S-tier badges
⚡ Authority / Winning / Premium

SECONDARY - CYAN #06B6D4
██████████████████ Used for: Links, rank #2, A-tier badges, secondary actions
⚡ Secondary / Energy / On-chain

NEW ACCENT - NEON GREEN #10F981
██████████████████ Used for: Real-time updates, wins, alerts, momentum
⚡ Action / Alive / Urgent

ERROR - ROSE #F43F5E
██████████████████ Used for: Negative momentum, destructive actions, errors
⚡ Warning / Danger / Loss

SUCCESS - EMERALD #10B981
██████████████████ Used for: Free contests, success toasts, #3 rank
⚡ Success / Positive / Free

NEUTRAL - GRAY #27272A (card bg) / #09090B (main bg)
██████████████████ Used for: Cards, containers, chrome, disabled states
⚡ Neutral / Quiet / Chrome
```

### Color Usage Rules

**DO:**
- Use gold for primary CTAs (one per section max)
- Use neon green ONLY for updates, wins, alerts (not ambient)
- Use gray for card backgrounds and borders
- Use cyan for secondary actions and links
- Use rose for destructive actions (appear on hover)

**DON'T:**
- Use neon green everywhere (kills the impact)
- Use multiple colors for decoration
- Use gold + colored borders together
- Rely on color alone for information (use icons/text)
- Make neon green the background (it's an accent)

---

## Typography Reference

### Font Family Rules

```
NUMBER/STATISTIC          HEADING              BODY TEXT
┌─────────────────┐      ┌──────────────┐    ┌──────────────┐
│ JetBrains Mono  │      │ Plus Jakarta │    │    Inter     │
│                 │      │    Sans      │    │              │
│   4,821 FS      │      │ Hunt Alpha   │    │ Track your   │
│   ↑ +342 week   │      │              │    │ performance  │
│   #1            │      │              │    │              │
│   0.5 SOL       │      │              │    │              │
└─────────────────┘      └──────────────┘    └──────────────┘
 Data. Precise.          Authority. Bold.   Professional. Clean.
 Terminal. Clear.        Big statements.    Easy to read.
```

### Size & Weight Reference

```
HERO (64px bold mono)              → Scores, main numbers
DISPLAY (48px bold display font)   → Page titles
H1 (36px semibold display font)    → Section headers
H2 (28px semibold display font)    → Card titles
H3 (22px semibold display font)    → Subsection headers
H4/Label (18px semibold)           → Labels, stat names
Body (16px regular)                → Default text
Body-sm (14px regular)             → Secondary text
Caption (12px regular)             → Captions, metadata
Micro (10px semibold mono)         → Tiny labels, badges
```

### Examples by Component

**Leaderboard Row:**
```
#2 │ 🟡 CZ Binance         │ ⬆ +42 │ 4,821 FS │ A-Tier │ Follow >
│   │  │                    │       │          │        │
│   │  │ Inter 600 16px     │ Mono  │ Mono 700 │ Inter  │ Inter ghost
│   │  │                    │ 500   │ 18px     │ 600    │ 400
│   │  │ username           │ 14px  │ score    │ 12px   │ 14px
│   │  │                    │       │          │        │
│   │  └─ Plus Jakarta      │       │          │        │
│   │     500 user icon     │       │          │        │
│   │                       │       │          │        │
│   └─────────────────────────────────────────────────────
│      JetBrains Mono 700
│      16px (gold-400)
│      rank
```

**Score Display:**
```
YOUR FORESIGHT SCORE
┌─────────────────────┐
│      4,821 FS       │  ← JetBrains Mono 700 64px
│  ⬆ +127 this week   │  ← Mono 500 18px (neon green)
│ Top 8% of players   │  ← Inter 400 14px gray-400
└─────────────────────┘

Label (top):           Inter 600 12px gray-400
Main number:           JetBrains Mono 700 64px white
Momentum:              JetBrains Mono 500 18px neon-green-500
Percentile context:    Inter 400 14px gray-400
```

---

## Component Specifications

### Leaderboard Row — Detailed Spec

```
┌─────────────────────────────────────────────────────────────────────┐
│ STATES:                                                             │
│                                                                     │
│ DEFAULT STATE:                                                      │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ #2 │ 🟡 │ CZ Binance    │ ⬆ +42 │ 4,821 FS │ A-Tier │ ─ │  │
│ └─────────────────────────────────────────────────────────────┘  │
│   • bg-gray-800                                                    │
│   • border-gray-700                                                │
│   • no shadow                                                      │
│   • Follow button: text-gray-500 (no bg, no border)               │
│                                                                     │
│ HOVER STATE:                                                        │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ #2 │ 🟡 │ CZ Binance    │ ⬆ +42 │ 4,821 FS │ A-Tier │ > │  │
│ └─────────────────────────────────────────────────────────────┘  │
│   • bg-gray-700                                                    │
│   • border-gray-600                                                │
│   • shadow-md                                                      │
│   • Follow button: text-cyan-400, bg-gray-800, border-gray-700   │
│                                                                     │
│ YOUR TEAM WINNING STATE:                                            │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ #2 │ 🟡 │ CZ Binance    │ ⬆ +42 │ 4,821 FS │ A-Tier │ ✓ │  │
│ └─────────────────────────────────────────────────────────────┘  │
│   • bg-gray-800                                                    │
│   • border-neon-green-400/50 (left or full)                       │
│   • shadow-glow-green                                              │
│   • Score color: neon-green-400 (pulsing)                         │
│   • Momentum: bold neon-green-500                                  │
│                                                                     │
│ UPDATE ANIMATION STATE:                                             │
│ ┌─────────────────────────────────────────────────────────────┐  │
│ │ #2 │ 🟡 │ CZ Binance    │ ⬆ +42 │ ▶4,821 FS◀ │ A-Tier │ ─ │  │
│ └─────────────────────────────────────────────────────────────┘  │
│   • Number color: gray-100 → neon-green-400 → gray-100            │
│   • Number scale: 1.0 → 1.05 → 1.0 (200ms)                        │
│   • Shadow: none → glow-green → none (800ms fade)                 │
│   • Duration: 1.1 seconds total                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

SPACING DETAILS:
• Rank: 24px wide, centered
• Tier icon: 32px square, centered
• Username: flex grow (variable width)
• Momentum: 80px width
• Score: 120px width, right-aligned
• Tier badge: 80px width
• Follow button: 60px width
• Vertical padding: py-2 (8px top/bottom)
• Horizontal padding: px-3 (12px left/right)
• Gap between items: gap-2 (8px)
```

### Score Display — Detailed Spec

```
┌──────────────────────────────────┐
│  YOUR FORESIGHT SCORE            │  Label
│                                  │  Inter 600 12px
│        4,821 FS                  │  gray-400
│                                  │  padding-b: 12px
│     ⬆ +127 this week             │
│      Top 8% of all players        │  Stat: "4,821 FS"
│                                  │  JetBrains Mono 700 64px
│  [░░░░░░░░░░░░░░░░░░░]          │  white text
│   Weekly momentum                 │
│                                  │  Momentum: "⬆ +127 this week"
└──────────────────────────────────┘  JetBrains Mono 500 18px
                                      neon-green-500

                                      Percentile: "Top 8%..."
                                      Inter 400 14px gray-400

ANIMATION ON UPDATE:
Step 1: Number color turns neon-green
        Text-color: white → neon-green-500 (instant)

Step 2: Number scales up
        Transform: scale(1.0) → scale(1.05) (150ms ease-out)

Step 3: Shadow appears
        Box-shadow: none → glow-green (instant)

Step 4: Number scales back
        Transform: scale(1.05) → scale(1.0) (150ms ease-out)

Step 5: Fade back to normal
        Color: neon-green → white (800ms ease-out)
        Shadow: glow-green → none (800ms ease-out)

Total duration: 1.1s

CARD STYLING:
• Background: bg-gray-800/50 (semi-transparent)
• Border: border-gray-700
• Padding: p-6 (24px)
• Border radius: rounded-lg (12px)
• Shadow: shadow-md
• Animation while updating: shadow-glow-green

RESPONSIVE:
• Mobile (375px): 90% width, center aligned
• Tablet (768px): 60% width or full width in grid
• Desktop (1024px): 40% width in grid
```

### Contest Card — Detailed Spec

```
┌────────────────────────────────────────┐
│ CZ's Champions League                  │  Title
│ SIGNATURE ◆ Live Now (48 min)          │  Inter 600 16px
│                                        │  w/ neon green "Live Now"
│ Entry: FREE       Prize: $4.25         │
│ Players: 42       Time: 2d 5h          │  Stats (monospace)
│                                        │  JetBrains Mono 400 14px
│ ┌────────────────────────────────────┐ │
│ │  Join CZ's Champions League       │ │  CTA Button
│ │                                  │ │  bg-gold-500 text-gray-950
│ └────────────────────────────────────┘ │  py-3 rounded-lg
└────────────────────────────────────────┘

BADGE STYLING - "Live Now":
• Background: bg-neon-green-500/20
• Text: text-neon-green-500
• Border: border-neon-green-500/30
• Padding: px-2 py-1 rounded text-xs
• Font: Inter 600
• Animation: animate-pulse (1.5s cycle)
• Shadow: shadow-glow-green (subtle)

STATS STYLING:
• Label: "Entry: " (gray-400 normal text)
• Value: "FREE" (neon-green-400 monospace bold)
• Label: "Prize: " (gray-400)
• Value: "$4.25" (white monospace bold)
• All other stats same pattern

RESPONSIVE:
• Mobile (375px): Full width, stacked layout
• Tablet (768px): 2-column grid
• Desktop (1024px): 3-4 column grid
```

---

## Before/After Layout Comparison

### Leaderboard at Different Breakpoints

#### BEFORE — Mobile (375px)

```
┌──────────────────────────────────────────────┐
│ ≡ Home │ Compete │ Feed │ Profile            │
├──────────────────────────────────────────────┤
│ LEADERBOARD                                  │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ 2. CZ Binance              4821    Follow │ │
│ │    A-Tier    ↑ +42 this week             │ │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ 3. Raydium                 3102    Follow │ │
│ │    B-Tier    ↑ +21 this week             │ │
│ └──────────────────────────────────────────┘ │
│ [... more rows ...]                          │
│                                              │
└──────────────────────────────────────────────┘
```

**Issues:**
- Lots of whitespace
- Hard to scan numbers
- Follow button on every row creates noise

#### AFTER — Mobile (375px)

```
┌──────────────────────────────────────────────┐
│ ≡ Home │ Compete │ Feed │ Profile            │
├──────────────────────────────────────────────┤
│ LEADERBOARD                                  │
│                                              │
│ ┌──────────────────────────────────────────┐ │
│ │ #2│ 🟡 │ CZ Binance │ 4.8K │ Follow >   │ │
│ │     ↑ +42                                │ │
│ └──────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────┐ │
│ │ #3│ 🟢 │ Raydium    │ 3.1K │ Follow >   │ │
│ │     ↑ +21                                │ │
│ └──────────────────────────────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘
```

**Improvements:**
- Monospace numbers easier to scan
- Compressed row height
- Numbers stand out (hero status)
- Follow button ghost-style (less noise)

#### AFTER — Desktop (1024px)

```
┌────────────────────────────────────────────────────────────────────┐
│ ≡ Home │ Compete │ Feed │ Profile                                   │
├────────────────────────────────────────────────────────────────────┤
│ LEADERBOARD • RANKINGS • WEEKLY • FREE                              │
│                                                                    │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ #2│ 🟡 │ CZ Binance │ ⬆ +42 │ 4,821 FS │ A-Tier │ Follow > │ │
│ └──────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ #3│ 🟢 │ Raydium    │ ⬆ +21 │ 3,102 FS │ B-Tier │ Follow > │ │
│ └──────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ #4│ 🔵 │ Lido       │ ↓ -15 │ 2,847 FS │ B-Tier │ Follow > │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Features visible:**
- All stats inline (monospace numbers)
- Momentum arrow with color (green = up, red = down)
- Tier badges colorful
- All data scannable in one glance

---

## Share Card — Before & After

### BEFORE (Current Parchment)

```
┌─────────────────────────────────────┐
│                                     │
│  ≈ ═══════════════════════════ ≈   │
│                                     │
│         CZ'S CHAMPIONS              │
│                                     │
│     [🟡] [🟡]                      │
│  [🟡]        [🟡]                  │
│     [🟡] [🟡]                      │
│                                     │
│   Position #42 • A-Tier            │
│   Score: 4821 FS                   │
│                                     │
│   Built on Foresight               │
│   ◆ Fantasy League                 │
│                                     │
│  ≈ ═══════════════════════════ ≈   │
│                                     │
└─────────────────────────────────────┘
Parchment/cream background
Ornate borders
Medieval aesthetic
```

**Problem:** Completely disconnected from app aesthetic. Doesn't feel like same product.

### AFTER (War Room)

```
┌──────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░ CZ's Champions League               ░│
│░ SIGNATURE · Week 8                  ░│
│░                                     ░│
│░        🟡    🟡    🟡               ░│
│░      🟡            🟡               ░│
│░                                     ░│
│░ SCORE:      4,821 FS  [green]      ░│
│░ RANK:       #42       [gold]       ░│
│░ TIER:       A-Tier    [cyan]       ░│
│░ MOMENTUM:   +342      [green]      ░│
│░                                     ░│
│░ Built on Foresight                 ░│
│░ ◆ Powered by Tapestry Protocol     ░│
│░                                     ░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└──────────────────────────────────────┘
Dark gradient background (gray-950 → gray-900)
Neon green + gold glow edges
Monospace numbers
Professional but energetic
Matches app aesthetic
```

**Improvements:**
- Consistent with app visual language
- Professional + energetic vibe
- Shareable on Twitter/Discord
- Monospace numbers stand out
- Neon green signals "real data"

---

## Animation Timing Reference

### Score Update Animation Timeline

```
0ms           150ms         300ms                 1100ms
│              │              │                      │
│ Number       │ Scale up     │ Scale back           │ Done
│ color change │ 1.0→1.05     │ 1.05→1.0             │
│ to green     │              │                      │
│              │              │ Color fade           │
│ Glow         │              │ green→white (800ms)  │
│ appears      │              │                      │
│              │              │ Shadow fade          │
│              │              │ glow→none (800ms)    │
│                                                    │
└──────────────────────────────────────────────────┘
Total: 1.1 seconds
Easing: ease-out (snappy feel)

Visual result: Number briefly glows neon, scales, fades back
to normal. User feels the update happened.
```

### Hover State Animation Timeline

```
0ms              150ms        Done
│                 │            │
Button hidden    Button        Button
no background    appears       visible
gray-500 text    bg-gray-800   border-gray-700
border-0         border        bg-gray-800
                 gray-700      text-cyan-400

Duration: 150ms ease-out
Easing: ease-out (snappy, not sluggish)
Result: Buttons feel responsive to interaction
```

### Contest "Live" Badge Pulse

```
0s         0.75s        1.5s        repeat
│          │            │
Shadow:    Shadow max   Shadow:
min        glow         min
opacity    intense      opacity
70%        100%         70%

Duration: 1.5s ease-in-out (infinite)
Result: Badge subtly pulses, signals "something is happening now"
Creates urgency/FOMO without being aggressive
```

---

## Accessibility Reference

### Contrast Ratios (WCAG AA Compliance)

```
PASS ✅:
Neon Green (#10F981) on gray-950 (#09090B)     8.2:1 (exceeds 4.5:1)
Gold (#F59E0B) on gray-950                      6.1:1 (exceeds 4.5:1)
Cyan (#06B6D4) on gray-950                      5.8:1 (exceeds 4.5:1)
White (#FAFAFA) on gray-950                     17.4:1 (exceeds 4.5:1)
Gray-400 on gray-950 (secondary text)           4.8:1 (exceeds 4.5:1)

FAIL ❌:
Gray-600 on gray-950 (too subtle for body text) 2.1:1 (below 4.5:1)
  Use only for borders/dividers, not text
```

### Touch Target Sizes

```
REQUIRED MINIMUMS:

Desktop:     Recommended     Mobile:
────────────────────────────────────
32px+        44px            44px+ REQUIRED

Examples:
• Buttons:      44px minimum height         ✅
• Links:        44×44px minimum tap area    ✅
• Form inputs:  44px minimum height         ✅
• Icons:        24px icon in 44px container ✅

Leaderboard row: 56px height
  • Tap target: 44px+ minimum met

Follow button:  40px wide × 40px tall
  • Minimum met
```

### Motion Preferences

```
FOR USERS WITH prefers-reduced-motion:
  • Disable all animations
  • Show final state instantly
  • Keep all information visible
  • No flashing, flickering, or rapid motion

Implementation:
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## Implementation Priority Flowchart

```
START
  │
  ├─→ Tailwind Config Setup (30 min)
  │
  ├─→ LeaderboardRow (1.5 hr)
  │
  ├─→ ScoreDisplay (1 hr)
  │
  ├─→ ContestCard (1 hr)
  │
  ├─→ Button + Badge (1 hr)
  │
  ├─→ Page Integration (1.5 hr)
  │
  └─→ Testing & Validation
       │
       ├─→ Mobile responsive ✓
       ├─→ Animation smooth ✓
       ├─→ Accessibility passed ✓
       ├─→ Visual comparison ✓
       │
       └─→ DONE! War Room Design Complete
```

---

## Quick Visual Checklist

Before marking component done, verify:

- [ ] **Numbers are monospace** (JetBrains Mono)
- [ ] **Gold used sparingly** (CTAs only, not ambient)
- [ ] **Neon green only on updates/wins** (not background)
- [ ] **Spacing is tight** (not overly spacious)
- [ ] **Animations are snappy** (100-150ms, not slow)
- [ ] **Glow effects present** (on updates, not everywhere)
- [ ] **Colors have semantic meaning** (not decorative)
- [ ] **Mobile responsive** (works at 375px)
- [ ] **Contrast adequate** (4.5:1+ for text)
- [ ] **Touch targets 44px+** (mobile-friendly)

---

*This visual reference is your guide during implementation. Use it to match the War Room aesthetic exactly.*
