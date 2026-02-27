# War Room Design Direction — Quick Reference

> **One-page decision guide for the design team**
> **Status:** Ready to implement
> **Timeline:** 10-12 hours to complete War Room redesign

---

## The Direction (In 15 Seconds)

**War Room:** Design Foresight as a command center for CT influence intelligence. Dark, data-dense, informative. Uses neon green + monospace numbers to echo Axiom/Hyperliquid trading UIs. Makes every stat feel real and urgent.

---

## Key Changes

### 1. Add Neon Green Accent Color
```css
--neon-green: #10F981  /* New primary accent */
```

**Where it's used:**
- Real-time score updates (glow effect)
- Win/achievement badges
- Contest "Live Now" badges
- Positive momentum indicators (↑)
- Winning leaderboard rows

### 2. Monospace Numbers (JetBrains Mono)
All numeric data uses monospace. This is the signature visual change.

```
❌ Before: "Score: 4,821"    (normal font)
✅ After:  "Score: 4,821"    (monospace)
```

Applies to:
- Ranks: `#1`, `#42`, `#999`
- Scores: `4,821 FS`
- Prize amounts: `0.5 SOL`
- Player counts: `842 players`
- Time left: `2d 5h`
- Momentum: `+127 this week`

### 3. Compress Cards / Increase Data Density
Tighten vertical spacing on cards. Information should feel valuable, not diluted by whitespace.

```
❌ Before: 20px padding, lots of breathing room
✅ After:  16px padding, compact but readable
```

### 4. Snappy Animations (100-150ms)
Micro-interactions feel electric, not smooth.

```
❌ Smooth: 300ms ease-out (feels slow)
✅ Snappy: 150ms ease-out (feels urgent)
```

### 5. Glow Effects on Updates
When numbers change, they glow neon-green briefly.

```
score update → color green → glow appears → scale 1.05 → fade back
duration: 1.1s total
```

---

## Component Checklist

### Tier 1 (Do First — 4-5 hours)
- [ ] **Leaderboard Row**
  - Add monospace numbers
  - Compress spacing
  - Add neon green on update
  - Add hover button reveal

- [ ] **Score Display**
  - Make larger (48-64px)
  - Use monospace
  - Add glow animation on update

- [ ] **Contest Card**
  - Add "Live Now" badge (neon green)
  - Compress layout
  - Use monospace for amounts

### Tier 2 (Polish — 3-4 hours)
- [ ] **Button Styling** — Snappier hover states
- [ ] **Share Card** — Redesign from parchment to trading terminal
- [ ] **Real-time Glow** — Add pulse animations

### Tier 3 (Nice-to-Have — 2-3 hours)
- [ ] **Micro-charts** — Sparkline on each leaderboard row
- [ ] **Achievement Celebration** — Confetti + intense glow
- [ ] **Copy Audit** — Update CTAs (Hunt Influence, Track Signals, etc.)

---

## Color Palette — War Room Edition

```css
/* Keep these unchanged */
--gold-500: #F59E0B          /* Primary CTA, #1 rank, S-tier, winning */
--cyan-500: #06B6D4          /* Secondary, links, A-tier, #2 rank */
--gray-950: #09090B          /* Background */
--gray-800: #27272A          /* Cards */
--emerald-500: #10B981       /* Success, free contests, #3 rank */
--rose-500: #F43F5E          /* Error, danger, negative */

/* NEW */
--neon-green: #10F981        /* Real-time updates, wins, alerts */
```

**Quick Reference:**
- Gold = Authority / Winning / #1
- Green = Action / Real-time / Alive
- Cyan = Secondary / #2 / Links
- Gray = Neutral / Chrome / Disabled
- Rose = Warning / Destructive / Negative

---

## Typography Rule

**Simple rule:** If it's a number, make it monospace.

```javascript
// Numbers always use mono
<span className="font-mono font-bold text-gold-400">4,821</span>

// Names/titles use normal font
<span className="font-sans font-semibold text-white">CZ Binance</span>

// Labels use normal font
<span className="font-sans text-sm text-gray-400">Foresight Score</span>
```

---

## Animation Timings

```css
/* Replace all 200ms with 150ms */
transition-all duration-150 ease-out  /* Snappy */

/* Score update glow: 800ms fade */
animation: pulseGreen 0.5s ease-in-out 2;
box-shadow: 0 0 20px rgba(16, 249, 129, 0.6);
transition: box-shadow 800ms ease-out;  /* Fade */

/* Achievement: 1s intense pulse */
animation: intensePulse 1s ease-in-out;
```

---

## Before/After Examples

### Leaderboard Row

**Before:**
```
┌─────────────────────────────────────────────┐
│ 2.  🟡 CZ Binance    Score: 4821  Follow    │
│     A-Tier           ↑ +42 this week        │
└─────────────────────────────────────────────┘
```

**After:**
```
┌─────────────────────────────────────────────┐
│ #2 │ 🟡 │ CZ Binance │ ⬆ +42 │ 4,821 FS │ A-Tier │ Follow >
└─────────────────────────────────────────────┘
     ↑    ↑   ↑           ↑      ↑         ↑
     │    │   │           │      │         └─ Tier badge
     │    │   │           │      └──────────── Score (mono, neon on update)
     │    │   │           └─────────────────── Momentum (green)
     │    │   └─────────────────────────────── Username (normal)
     │    └─────────────────────────────────── Tier icon
     └────────────────────────────────────── Rank (mono, gold)
```

**Key changes:**
- Numbers are now monospace (rank, score)
- Momentum uses green arrow
- Tighter spacing
- Score is the visual hero
- Follow button is ghost-style (appears on hover)

### Score Display

**Before:**
```
┌──────────────────────────┐
│ Foresight Score: 4,821   │
│ Rank: #42                │
│ Momentum: Up 127         │
└──────────────────────────┘
```

**After:**
```
┌──────────────────────────┐
│  YOUR FORESIGHT SCORE    │  (label)
│                          │
│       4,821 FS           │  (JetBrains Mono 700 64px)
│    ⬆ +127 this week      │  (green, mono 18px)
│     Top 8% of all players │  (gray, normal 14px)
│  [sparkline chart ░░░░]  │  (data viz)
└──────────────────────────┘
```

**Key changes:**
- Number is much larger (hero status)
- Uses monospace
- Momentum shows in neon green with arrow
- Adds percentile context
- Animates on update (glow + scale)

---

## Copy Changes (Optional But Recommended)

Current → War Room

| Current | War Room |
|---------|----------|
| "Compete" | "Hunt Influence" |
| "View Feed" | "Track Signals" |
| "Your Team" | "Your Position" |
| "Join Contest" | "Enter" |
| "Win Prize" | "Claim Rewards" |
| "Leaderboard" | "Rankings" |
| "View Profile" | "Analyze" |

---

## Mobile Breakpoints

### At 375px (Mobile)
```
┌──────────────────────────────┐
│ #2 │ 🟡 │ CZ │ 4.8K │ Follow > │
│       ↑ +42 ⬆              │
└──────────────────────────────┘
```
- Compressed: Rank | Tier | Name (abbrev) | Score | Action
- Momentum below
- Touch target: 44px+ height ✓

### At 768px (Tablet)
```
┌───────────────────────────────────────┐
│ #2 │ 🟡 │ CZ Binance │ ↑ +42 │ 4.8K │ Follow >
└───────────────────────────────────────┘
```
- Add momentum inline
- Number visible

### At 1024px+ (Desktop)
```
┌────────────────────────────────────────────────────┐
│ #2 │ 🟡 │ CZ Binance │ ↑ +42 │ 4,821 FS │ A-Tier │ Follow >
└────────────────────────────────────────────────────┘
```
- All data visible
- Hover states work
- Follow button has full affordance

---

## Implementation Priority

**If you have 5 hours:**
1. Leaderboard rows (monospace + spacing) — 2 hours
2. Score display (larger + monospace) — 1.5 hours
3. Contest cards (neon green badge) — 1 hour
4. Test mobile — 0.5 hours

**If you have 10 hours:**
1. All Tier 1 components — 5 hours
2. Share card redesign — 2 hours
3. Animations (glow, pulse) — 2 hours
4. Polish & QA — 1 hour

**If you have 15+ hours:**
1. All of the above — 10 hours
2. Sparkline micro-charts — 2 hours
3. Copy audit & language shift — 1 hour
4. Full page redesign & testing — 2 hours

---

## Common Gotchas

### ❌ Don't: Use neon green everywhere
Only use on updates, wins, alerts, badges. Rest of UI stays gray/gold.

### ❌ Don't: Make numbers too large
Max 64px for hero numbers. 18-24px for supporting stats.

### ❌ Don't: Break monospace readability
Ensure min 12px size. Numbers should still be legible.

### ❌ Don't: Over-animate
Animations should be 150-300ms max. Anything longer feels slow.

### ❌ Don't: Sacrifice contrast
Neon green on dark gray still needs 6:1+ ratio. Check with a contrast checker.

### ✅ DO: Test on actual mobile phones
Not just DevTools. Tap the buttons. Feel the interactions.

### ✅ DO: Screenshot before and after
Visual comparison drives validation.

### ✅ DO: Get feedback from a CT user
One DeFi trader's feedback > 100 design reviews.

---

## File Structure Changes

No new files. Only changes to existing components:

```
frontend/src/components/
├── ui/
│   ├── LeaderboardRow.tsx      (modified — spacing, monospace, glow)
│   ├── ScoreDisplay.tsx        (modified — larger, monospace, animation)
│   ├── ContestCard.tsx         (modified — neon badge, compression)
│   ├── Button.tsx              (modified — 150ms transitions)
│   └── Badge.tsx               (modified — add green variant)
├── pages/
│   ├── Leaderboard.tsx         (modified — uses updated components)
│   ├── Dashboard.tsx           (modified — uses updated components)
│   ├── ContestDetail.tsx       (modified — uses updated components)
└── utils/
    └── shareCard.ts            (modified — new War Room design)

frontend/tailwind.config.js      (modified — add neon-green, animations)
frontend/src/index.css           (modified — add glow effect rules)
```

---

## Validation Checklist

Before calling it done:

- [ ] **Visual Distinctiveness** — Can recognize Foresight from 1 screenshot
- [ ] **Monospace Adoption** — All numbers use JetBrains Mono
- [ ] **Neon Green Sparingly Used** — Only on updates, wins, alerts (not everywhere)
- [ ] **Mobile Responsive** — Works at 375px, 768px, 1024px+
- [ ] **Animations < 300ms** — Everything feels snappy
- [ ] **Accessibility** — Contrast ≥ 4.5:1, touch targets ≥ 44px
- [ ] **Share Card Redesigned** — From parchment to trading terminal
- [ ] **Copy Audit** — CTAs updated to War Room language
- [ ] **Screenshot Before/After** — Visual proof of improvement
- [ ] **CT User Feedback** — One degen approves the direction

---

## Decision: Ready to Build?

**Yes, this is the direction for Foresight.**

- ✅ Differentiated (no competitor has this aesthetic)
- ✅ CT authentic (echoes Axiom, Hyperliquid, terminal trading)
- ✅ Implementable (10-12 hours, CSS + component tweaks)
- ✅ Hackathon-worthy (memorable, intentional, polished)
- ✅ Aligned with product (data-driven, real-time, precision)

**Next step:** Start with Tier 1 components. You'll see 60% improvement immediately.

---

*For detailed specs, see `UI_DIRECTION_CT_CULTURE.md`. For component changes, see individual component files. Questions? See FAQ section of main document.*
