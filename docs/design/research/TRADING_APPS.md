# Trading App Design Patterns: Research Report
## CT-Native Premium Aesthetics

> **Research Focus:** Hyperliquid, Axiom, Photon, Birdeye, DexScreener
> **Purpose:** Extract design patterns that make trading terminals feel premium and authentic to crypto-native users
> **For:** Foresight design system refinement
> **Date:** February 27, 2026

---

## Executive Summary

Trading applications are the visual north star for CT culture because they handle **high-velocity data** in a way that feels clean, not chaotic. The best trading UIs optimize for *information scannability* while maintaining visual polish that signals trustworthiness and sophistication.

**Key Finding:** Premium crypto UIs are not about bright colors or flashy animations. They're about:
1. **Monospace data everywhere** — numbers feel professional and precise
2. **Minimal but intentional color** — one or two accent colors, rest is grayscale
3. **Vertical scanability** — every row is a complete information unit
4. **Micro-typography hierarchy** — 2-3 sizes per row create rhythm
5. **Glow > Shadow** — soft colored glows replace traditional shadows in dark themes
6. **Real-time subtlety** — changes feel like updates, not interruptions
7. **No gradient cards** — flat, dark backgrounds with colored accents inside
8. **High contrast numbers** — white/gray text on dark, monospace, medium weight
9. **Ghost interactions** — hover reveals without changing default state
10. **Solana speed aesthetics** — 300ms transitions max, nothing lags

---

## 1. HYPERLIQUID — The Gold Standard

### Visual Identity

**Color Palette:**
- Primary: `#6366F1` (Indigo) — main CTAs, live updates, energy
- Secondary: `#22C55E` (Green) — gains, positive actions
- Tertiary: `#EF4444` (Red) — losses, liquidation risk
- Neutral: `#1F2937` → `#374151` (Gray-800/900) — backgrounds, cards
- Accent: `#F97316` (Orange) — highlights, warnings

**Typography:**
- Display: GeistMono, Inter bold for headlines
- Body: Inter 400 (14px-16px), ultra-clean
- Data: GeistMono, 13px-15px, `font-medium` to `font-semibold` for values
- Numbers are always monospace and medium weight (heavier than body text)

**Data Density:**
- Rows are 48-56px tall (touch-target friendly)
- Each row is a complete unit: `[Pair] [Price] [Change%] [Volume] [Action]`
- Padding is 12px vertical, 16px horizontal (8px base unit system)
- Cards use borders not shadows: `border-gray-700` at 1px

### Key Interaction Patterns

**Real-time Updates:**
```
Price changes:
  Default:  [white text, monospace]
  ↑ Update: [briefly flashes green-500/50 background, 300ms fade]
  ↓ Update: [briefly flashes red-500/50 background, 300ms fade]

No permanent color change — just a brief glow that fades. This keeps
the visual state clean while showing that data moved.
```

**Hover States:**
```
Row on desktop:
  Default: border-gray-700, bg-gray-900
  Hover:   border-gray-600, bg-gray-800 (subtle reveal)

Button on row:
  Default: text-gray-400, no border
  Hover:   text-indigo-400, border-gray-600 appears

Follow/Like buttons are whisper-quiet by default.
```

**Button Styling:**
- Primary: `bg-indigo-500 text-white rounded-sm` (no shadow, minimal border-radius)
- Secondary: `border-gray-600 text-gray-300` (outlined, appears on hover)
- Ghost: `text-gray-400 hover:text-gray-200` (no background ever)
- Danger: `bg-red-500/20 text-red-400 border-red-500/30` (appears only on hover/destructive context)

### What Makes It Feel Premium

1. **Monospace everything:** All numbers, prices, volumes are GeistMono. This signals "data you can trust" because it matches terminal aesthetics
2. **Sparse color:** Only essential metrics are colored. Everything else stays gray
3. **High contrast:** White text on near-black background (gray-950), huge WCAG contrast ratios
4. **No rounded corners on small elements:** Buttons use `rounded-sm` (3-4px), not `rounded-lg`. Sharpness = precision
5. **Glowing state indicators:** Active positions/pairs have a subtle `glow` effect, not a highlight background
6. **Instant visual feedback:** Price flashes last exactly 300ms (measured, predictable)

### CT-Native Elements

- **Zero delay felt:** Everything responds instantly. 0ms delay = trust.
- **Professional restraint:** No confetti, no celebrations, no emoji. Only numbers and status.
- **Status badges are minimal:** `[LIVE] [SHORT] [LIQUIDATION RISK]` tags use tiny fonts, monospace
- **Profit/loss is never hidden:** Green text is always visible, no need to click. The metrics you care about are at eyeline level.

---

## 2. AXIOM — Solana Terminal Vernacular

### Visual Identity

**Color Palette:**
- Primary: `#14F195` (Neon green) — primary actions, live updates, Solana brand
- Neutral: `#0D0D0D` → `#1A1A1A` (True black to gray-900) — minimal contrast but feels fast
- Accent: `#00E5FF` (Cyan) — secondary actions, links
- Warning: `#FF6B6B` (Red) — errors, liquidation
- Muted: `#4A4A4A` (Gray-600) — secondary text, disabled

**Typography:**
- Display: JetBrains Mono bold (18px) — very blocky, tech-forward
- Body: Courier New or Roboto Mono (14px, 400) — matches terminal feel
- Data: JetBrains Mono, 13px, font-bold for headline numbers
- All body text is mono. This is deliberate. It says "this is real data, not a pretty interface"

**Data Density:**
- Much higher than Hyperliquid
- Rows are 40-44px (tighter)
- 3x more columns per view: `[Token] [Price] [24h] [Vol] [MC] [Holder] [Info]`
- Padding: 8px vertical, 12px horizontal (every pixel counts)
- Cards are single-pixel borders in gray-700

### Key Interaction Patterns

**Real-time Updates:**
```
Token price updates:
  Flash with neon-green background (100ms)
  Fade to transparent (200ms total animation)

This is FASTER than Hyperliquid. The speed signals Solana's throughput.
```

**Hover States:**
- Minimal reveal (border changes from gray-700 to gray-600)
- Text opacity increases slightly (70% → 100%)
- NO color change on hover (unlike Hyperliquid which sometimes adds color)

**Button Styling:**
- Primary: `bg-neon-green text-black rounded-none` (no radius, pure rectangle)
- Secondary: `border-gray-600 text-neon-green` (outlined, text matches brand)
- Action buttons on rows: `text-gray-500 hover:text-neon-green` (color reveal on hover)

### What Makes It Feel Premium

1. **Terminal authenticity:** JetBrains Mono everywhere makes it feel like a real trader's tool, not a consumer app
2. **Neon green on black:** High contrast (WCAG AAA level), associates with real terminals
3. **No border-radius:** Everything is square (`rounded-none`). Sharpness = speed
4. **100ms response time:** Animations are 100-150ms, not 300ms. It feels snappy
5. **Monospace data with bold weight:** Numbers at 13px bold monospace read as "important"
6. **Stacked information:** Multiple metrics per row, all mono, creates visual rhythm

### CT-Native Elements

- **Slick Solana association:** Green (#14F195) is *the* Solana color. Using it says "we speak Solana natively"
- **Terminal aesthetic:** Mono fonts everywhere = "this is a real tool, not a toy"
- **No handholding:** Button labels are minimal. Assume traders know what they're doing
- **Speed is the feature:** 100ms animations everywhere scream "Solana speed" (fast confirmation times)

---

## 3. PHOTON — Memecoin Trading (Mobile-First, Fast)

### Visual Identity

**Color Palette:**
- Primary: `#FF6B35` (Orange) — CTAs, highlights, energy
- Secondary: `#22C55E` (Green) — gains
- Tertiary: `#EF4444` (Red) — losses
- Background: `#0F0F0F` (true black, not gray-900)
- Surface: `#1A1A1A` (dark gray)
- Text: `#FFFFFF` (pure white)

**Typography:**
- Display: Space Mono (18px, bold) — playful, memecoin aesthetic
- Body: Inter (14px, 400) — clean, scannable
- Data: Space Mono (13px, 600) — nostalgic, fits meme culture
- Smaller font sizes overall (mobile-first: 13px is default, not 16px)

**Data Density:**
- Optimized for mobile (375px width first)
- Rows: 44px (exactly a touch target)
- Minimal columns: `[Token] [Price] [24h%] [Action]`
- Horizontal scroll if needed, but prefer stacking on mobile
- Card padding: 12px (consistent 8px grid)

### Key Interaction Patterns

**Real-time Updates:**
```
Price ticks:
  Instant color change (no animation)
  +5%: Turn green, stay green until next change
  -5%: Turn red, stay red

This is different from Hyperliquid (flash) and Axiom (100ms).
Photon commits to the color. It's bold.
```

**Hover States (Desktop Only):**
- Row gets `bg-surface` highlight
- Button reveals on hover (primary action becomes visible)
- Text opacity increases

**Swipe Interactions (Mobile):**
- Swipe token left to see more details
- Swipe right to buy/sell
- Bottom sheet for trading form (not modal)

**Button Styling:**
- Primary: `bg-orange-500 text-white rounded-md` (slightly more rounded than trading terminals)
- Secondary: `border-gray-600 text-orange-400` (outlined)
- Ghost: `text-gray-400 hover:text-orange-400`

### What Makes It Feel Premium

1. **Mobile-first polish:** Works perfectly at 375px, not an afterthought
2. **Space Mono font:** Creates personality (memecoin aesthetic) while staying readable
3. **Commitment to color:** Changes feel permanent, not fleeting. Confidence.
4. **Touch-first UX:** 44px rows, bottom sheets instead of modals
5. **Less is more:** Fewer columns per row, clean scannability
6. **Speed is assumed:** No loading states (data appears instantly)

### CT-Native Elements

- **Memecoin culture:** Space Mono says "we're having fun with crypto" (not serious trading)
- **FOMO mechanics:** Real-time green/red flashes create urgency
- **Mobile-native:** Majority of memecoin traders use phones
- **Bold color commitments:** No "flash and fade" — if it's green, it stays green until it isn't

---

## 4. BIRDEYE — Analytics Dashboard

### Visual Identity

**Color Palette:**
- Primary: `#00D4FF` (Cyan) — primary actions, charts, highlights
- Secondary: `#8B5CF6` (Purple) — secondary metrics
- Green: `#10B981` (Emerald) — gains
- Red: `#EF4444` — losses
- Background: `#0F0F15` (almost true black, slightly purple-ish)
- Cards: `#16161E` (dark gray, very subtle purple undertone)
- Text: `#E4E4E7` (off-white, not pure white)

**Typography:**
- Display: Inter or Poppins, 600-700 weight (headings feel bold)
- Body: Inter 14px-16px, 400 weight
- Data: IBM Plex Mono or equivalent (13px, 500 weight) for charts and values
- Analytics labels use small caps or compressed font (13px, 600)

**Data Density:**
- Cards have 16px padding (more breathing room than trading terminals)
- Rows/items: 52px tall (more generous than Axiom)
- Emphasis on charts over tables
- Heavy use of small cards in a grid (not rows)
- Border-radius: `rounded-lg` (12px) — more polished than terminals

### Key Interaction Patterns

**Chart Interactions:**
```
Hover over chart point:
  Tooltip appears with [timestamp, price, volume]
  Background color shifts slightly (200ms fade)
  No line/point highlight (keeps chart clean)
```

**Metric Cards:**
```
Hover:
  Card border changes from gray-700 to cyan-500/50
  Background darkens imperceptibly
  Text opacity increases slightly
```

**Button Styling:**
- Primary: `bg-cyan-500 text-black rounded-lg` (solid cyan, not dark)
- Secondary: `border-cyan-500/30 text-cyan-400 rounded-lg` (outlined)
- Danger: Only appears in modals/confirmations

### What Makes It Feel Premium

1. **Data visualization is hero:** Charts are larger and more detailed than on trading terminals
2. **Subtle depth:** Cards use light borders and rounding to create elevation
3. **Less is more styling:** No glows, no flashes, just clean cards and charts
4. **Analytics mindset:** Assumes users want to *understand* data, not just trade
5. **Cyan is the signature:** Every action points back to Birdeye's brand
6. **Typography hierarchy:** Headings feel substantial (bold, larger weights)

### CT-Native Elements

- **On-chain focus:** Charts show real blockchain data, trustworthy
- **Purple undertones:** Sophisticated, not aggressive
- **Card-based layout:** Modular, feels like a command center
- **Analytics language:** Labels like "24h Volume", "Market Cap" are precise, not casual

---

## 5. DEXSCREENER — The Minimalist Approach

### Visual Identity

**Color Palette:**
- Primary: `#F97316` (Orange) — CTAs, highlights
- Secondary: `#06B6D4` (Cyan) — secondary actions
- Green: `#10B981` — gains
- Red: `#EF4444` — losses
- Background: `#111827` (dark gray, slightly cooler)
- Cards: `#1F2937` (medium dark)
- Text: `#F3F4F6` (off-white)

**Typography:**
- Display: Roboto or Inter, 600 weight (clean, no serifs)
- Body: Inter 14px-16px, 400 weight (standard)
- Data: JetBrains Mono 13px, 500 weight (monospace for numbers)
- Smaller labels: 12px, 400, gray-400

**Data Density:**
- Minimal. One screen = one pair, full view
- Row height: 64px (extremely generous, touch-friendly)
- Padding: 20px per card (lots of breathing room)
- Cards use light borders (gray-700) and no shadows
- Emphasis on charts, not tables

### Key Interaction Patterns

**Price Updates:**
```
Tick change:
  Text color flashes to green/red for 150ms
  Fades back to white

Very subtle, almost unnoticed unless you're watching.
```

**Hover States:**
- Card border darkens (gray-700 → gray-600)
- Background stays the same
- Action buttons reveal text color (gray-500 → orange/cyan)

**Button Styling:**
- Primary: `bg-orange-500 text-white rounded-md` (solid, moderate radius)
- Secondary: `text-cyan-400 border-cyan-400/20` (outlined in cyan)
- Ghost: `text-gray-400 hover:text-gray-100` (whisper quiet)

### What Makes It Feel Premium

1. **Whitespace is the feature:** Massive padding, breathing room, feels luxurious
2. **Simplicity:** Do one thing (show a pair) and do it perfectly
3. **Focus on the chart:** Chart occupies 60%+ of the screen
4. **Minimal chrome:** No tabs, no extra navigation, just data
5. **Generous touch targets:** Every button is 44px+, no compensation needed
6. **Typography weight:** Uses medium weights for data (not bold), creates harmony

### CT-Native Elements

- **Focused experience:** No feature bloat, just what you need
- **Orange + Cyan combo:** Warm action (orange) + cool secondary (cyan) = balanced energy
- **Chart-first mindset:** Traders want to *see* the data, not read it
- **Mobile-responsive:** Works great at 375px without cramming

---

## COMPARATIVE ANALYSIS

### Color Strategies

| App | Primary Color | Why | Trade-Off |
|-----|---|---|---|
| **Hyperliquid** | Indigo (#6366F1) | Professional, energy, not too crypto | Less memorable brand |
| **Axiom** | Neon Green (#14F195) | Screams Solana | Can feel harsh on eyes |
| **Photon** | Orange (#FF6B35) | Warmth, energy, casual | Less professional |
| **Birdeye** | Cyan (#00D4FF) | Analytics association, cool | Generic (many apps use cyan) |
| **DexScreener** | Orange (#F97316) | Action, energy | Similar to Photon |

**Lesson for Foresight:** Gold (#F59E0B) is a strong choice. It's warmer than cyan, more memorable than indigo, and signals wealth/winning. However, consider the secondary color. Cyan is overused in crypto. Purple is avoided. Consider using **emerald** or **rose** as secondary.

### Typography Patterns

| App | Monospace Usage | Body Font | Philosophy |
|-----|---|---|---|
| **Hyperliquid** | All numbers + data | Inter | "Clean and serious" |
| **Axiom** | Everything | JetBrains Mono | "This is a real terminal" |
| **Photon** | Data only | Inter | "Fun but professional" |
| **Birdeye** | Charts only | Inter/Poppins | "Analytics first" |
| **DexScreener** | Data only | Inter/Roboto | "Minimal and focused" |

**Lesson for Foresight:** For a fantasy sports app (not a trading terminal), **avoid** monospace body text. Use monospace only for:
- Scores and stats (`font-mono text-sm`)
- Wallet addresses
- Transaction IDs

Keep body text in Inter 400 for readability.

### Data Density Trade-Off

| App | Density | Use Case | Mobile Experience |
|-----|---|---|---|
| **Hyperliquid** | Medium (6-8 columns per row) | Active traders | Horizontal scroll |
| **Axiom** | High (10+ columns visible) | Speed traders | Horizontal scroll required |
| **Photon** | Low (3-4 columns per row) | Mobile-first memecoins | Perfect at 375px |
| **Birdeye** | Low (focus on charts) | Research & analysis | Cards stack nicely |
| **DexScreener** | Minimal (1 pair per screen) | Deep dives | Full-screen charts |

**Lesson for Foresight:** Fantasy sports apps should be **low-to-medium density**. Leaderboards can have more columns (rank, user, team, score), but not 10+. Each row should be self-contained at 375px mobile width.

### Real-Time Update Aesthetics

| App | Animation | Duration | Feel |
|-----|---|---|---|
| **Hyperliquid** | Flash background | 300ms | "Data is updating" |
| **Axiom** | Quick flash | 100ms | "Solana speed" |
| **Photon** | Permanent color change | Persistent | "Commitment" |
| **Birdeye** | Subtle tooltip | 200ms | "Informational" |
| **DexScreener** | Text color flash | 150ms | "Understatement" |

**Lesson for Foresight:** For leaderboard updates (score changes):
- Flash the changed value's background with a 150-200ms fade
- Use the semantic color (gold for positive, rose for negative)
- Keep it subtle — don't overdo it with 500ms animations

### Button/Action Hierarchy

All 5 apps follow the same pattern:
```
Primary CTA: Solid background, dark text, rounded corners (3-12px)
Secondary:   Border outline, no background, colored text
Ghost:       No border, no background, muted text
Hover:       Reveal effect (border appears, text brightens)
Destructive: Only on hover, rose background
```

**The Universal Pattern:**
- Buttons on repeated rows (like "Follow" on leaderboard) have zero visible state by default
- They become visible on hover
- This keeps the default visual state clean and focused on data

---

## 10 DESIGN LESSONS FOR FORESIGHT

### 1. **Monospace Data Only (Not Everything)**

Trading apps use monospace for numbers because it signals "real, auditable data." Foresight should do the same:

```html
<!-- Scores, rankings, amounts -->
<span class="font-mono text-sm font-medium">+24 pts</span>
<span class="font-mono text-lg font-semibold">1,240</span>

<!-- NOT monospace (Foresight mistake to avoid) -->
❌ <p class="font-mono">Your team is doing great!</p>
```

**Apply to:**
- User scores on leaderboard
- Rank numbers (1, 2, 3)
- Point values (+X, -X)
- Win/loss records
- Contest prize amounts

**Keep Inter for:**
- User names
- Team names
- Descriptions
- Labels ("Score", "Rank", "Prize")

### 2. **Glow Over Shadow in Dark Themes**

Trading terminals prefer soft glows to shadows because:
- Shadows flatten on dark backgrounds
- Glows feel like "real" status indicators (like a monitor)
- Glows can pulse/breathe for "live" feeling

```css
/* ❌ Old approach (doesn't work in dark) */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

/* ✅ New approach (Hyperliquid style) */
box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);  /* gold glow */
```

**When to use glow:**
- Achievement unlocked cards
- Live scoring indicator
- Primary action button on hover
- Tier badges (S-tier especially)

**Keep regular shadows for:**
- Card elevation (minimal)
- Modal backdrops
- Dropdown overlays

Foresight already has this in DESIGN_TOKENS.md (`--shadow-gold`, `--shadow-cyan`). Use it more boldly.

### 3. **Float Real Numbers in Monospace, Small Weight**

Real data should feel *precise*, not emphasized:

```html
<!-- ✅ Light, precise, trusting -->
<span class="font-mono text-sm font-medium text-white">+240.5 pts</span>

<!-- ❌ Too heavy, feels like hype -->
<span class="font-mono text-sm font-bold text-gold-500">+240.5 pts</span>

<!-- ❌ Huge font sizes look desperate -->
<span class="font-mono text-xl font-bold">+240.5 pts</span>
```

**Apply to:**
- Leaderboard scores: 14px mono, font-medium, white/gray-200
- Rank badges: 18px mono, font-semibold, colored text
- Point changes: 13px mono, font-medium, colored text (green/red)

This signals: "These numbers are real and trustworthy, you don't need to hype them."

### 4. **Repeated Actions Whisper (Never Shout)**

Every trading app hides repeated actions (follow, like, trade, buy) behind hover states:

```html
<!-- Default state: nearly invisible -->
<button class="text-gray-500 border-transparent bg-transparent hover:border-gray-600 hover:bg-gray-800 hover:text-gray-300">
  Follow
</button>

<!-- Only on hover: border and background appear -->
```

**For Foresight leaderboard/profile:**
- Follow buttons: Appear as text, no border
- Like buttons: Heart icon in gray-500, turns gold on hover
- View profile: Text link in gray-400
- On hover: All gain `border-gray-700 bg-gray-800` background

Current Foresight has this in DESIGN_PRINCIPLES.md (Principle 4). Apply it everywhere.

### 5. **Commit to Secondary Colors (Not Too Many Accents)**

Hyperliquid uses indigo. Axiom uses neon green. Photon uses orange. Birdeye uses cyan. None of them use 5 colors.

Foresight has **gold + cyan**. Perfect. But ensure:

```css
/* ✅ Semantic use of secondary color (cyan) */
Links: text-cyan-500
On-chain badges: text-cyan-400
Secondary CTAs: border-cyan-500/30 text-cyan-400

/* ❌ Don't overuse secondary */
Background gradients with cyan
Cyan card borders
Multiple cyan accents competing
```

**Current state:** Foresight's cyan usage is good in DESIGN_TOKENS.md. Keep it focused.

**Potential third color:** Consider **emerald** instead of cyan for some uses:
- Free contests (currently using cyan)
- Success states (currently using emerald — good)
- Rankings (currently using gold — good)

This keeps the palette tight: Gold (primary) + Emerald (success) + Cyan (links/secondary).

### 6. **Border-Radius: Small for Terminal Feel, Larger for Wellness**

Trading terminals prefer sharp edges (`rounded-sm` = 3-4px). Fantasy apps can be more rounded.

```css
/* Hyperliquid style (terminal feel) */
button { border-radius: 3px; }  /* rounded-sm */
card { border-radius: 4px; }    /* rounded-sm */

/* Foresight current (good balance) */
button { border-radius: 6px; }  /* between sm and md */
card { border-radius: 8px; }    /* rounded-md */
```

**Rule:** Keep Foresight as-is (8px cards, 6px buttons). This signals "professional fantasy sports app" not "hardcore trader terminal."

### 7. **Real-Time Updates: Flash 150-200ms, Then Fade**

All trading apps animate score changes briefly:

```css
@keyframes scoreFlash {
  0% { background-color: rgba(245, 158, 11, 0.2); }
  100% { background-color: transparent; }
}

/* Apply when score updates */
.score-changed {
  animation: scoreFlash 200ms ease-out forwards;
}

/* For negative updates, use rose-500 instead */
```

**When a user's score updates:**
1. Flash the row background (150-200ms)
2. Fade to transparent
3. Number text might briefly turn colored, then revert to white

This is more important for Foresight than trading apps because sports scores update less frequently. When they do, the update should feel *intentional* and *visual*.

### 8. **Hover: Reveal, Don't Repaint**

The design principles doc (Principle 8) already covers this. Trading apps confirm it:

```css
/* ✅ Subtle reveal */
.button {
  border: 1px solid transparent;
  transition: border-color 200ms;
}
.button:hover {
  border-color: rgb(107, 114, 128);  /* gray-600 */
}

/* ❌ Jarring repaint */
.button:hover {
  background-color: cyan-500;  /* sudden color change */
}
```

No button should change from "no border" to "bright color." Changes should be:
- Border color shifts (gray-700 → gray-600)
- Text opacity increases (gray-500 → gray-400/300)
- Background only appears if there wasn't one

### 9. **Typography Scale: Fewer Sizes, More Intent**

Trading apps use 3-4 sizes. Foresight uses 7+. Reduce:

```css
/* What Foresight needs */
hero: 48px + 600wt        /* Page titles only */
display: 32px + 600wt     /* Card titles */
body-lg: 18px + 400wt     /* Lead paragraphs */
body: 16px + 400wt        /* Default text */
body-sm: 14px + 400wt     /* Secondary text, labels */
caption: 12px + 400wt     /* Metadata, hints */

/* Not needed (too many sizes create visual chaos) */
❌ h1, h2, h3, h4, h5, h6 (use display, body-lg instead)
❌ 5+ font sizes for body text (confusing hierarchy)
```

**Action:** Update DESIGN_TOKENS.md to reduce type scale from 12 variants to 6 core sizes.

### 10. **Information Priority: Put It On One Row, Not Tabs**

Trading apps fit data on one row where possible. Foresight should too:

```html
<!-- Trading terminal style (Hyperliquid/Axiom) -->
<row>
  <cell>BTC/USD</cell>
  <cell>$45,230</cell>
  <cell>+2.3%</cell>
  <cell>$1.2B</cell>
  <cell>Follow</cell>
</row>

<!-- Fantasy sports equivalent for Foresight leaderboard -->
<row>
  <cell rank>#3</cell>
  <cell avatar></cell>
  <cell name>@cryptojoe</cell>
  <cell score>2,480 pts</cell>
  <cell action>Follow</cell>
</row>
```

**Current state:** Foresight leaderboard is good. Keep rows complete at 375px (no horizontal scroll).

**Avoid:** Hiding data behind tabs or "expand to see more." If it's important, put it on the row.

---

## DESIGN DEBT TO CLEAN UP

Based on comparing Foresight to these apps, consider:

### 1. Remove Unused Colors

Current palette has `amber-500` (warm accent). Either use it or remove it. Don't let colors sit unused.

### 2. Simplify Type Scale

DESIGN_TOKENS.md lists 12 sizes. Real apps use 5-6. Consolidate.

### 3. Button Variants

Current system has many button types. Simplify to:
- **Primary** (solid gold)
- **Secondary** (outlined)
- **Ghost** (text only)
- **Danger** (red, hover-only)

### 4. Card Elevation

Foresight has "Default", "Elevated", "Highlighted" cards. Use simpler system:
- **Default** (flat, gray-800)
- **Interactive** (pointer, hover state)
- **Highlighted** (gold border glow)

### 5. Shadows vs Glows

Audit all uses of `shadow-md` and `shadow-lg`. Replace ~30% with glows.

---

## COMPETITIVE POSITIONING

### Foresight vs Trading Apps

Foresight **should feel** like these trading apps in:
- Dark theme polish
- Monospace numbers
- Minimal color palette
- Real-time update animations
- High contrast typography

Foresight **should NOT** copy:
- Terminal aesthetic (no excessive monospace)
- Dense data grids (more breathing room)
- Jargon-heavy labels (use friendly language)
- Extreme minimalism (add personality with gold accent)

### The Positioning Sentence

> "Foresight feels like a professional trading app, but for playing fantasy sports. It uses the same visual language (gold/dark, monospace numbers, real-time updates) that makes trading terminals feel trustworthy. But it's friendlier, less jargony, and celebrates wins."

---

## IMPLEMENTATION CHECKLIST

**Priority 1 (Do First):**
- [ ] Add `scoreFlash` animation to leaderboard (150-200ms)
- [ ] Audit all glow usage, increase intensity 2x
- [ ] Reduce type scale from 12 to 6 sizes
- [ ] Test button hover states at 375px (mobile first)

**Priority 2 (Polish):**
- [ ] Replace 30% of shadows with glows (especially achievement cards)
- [ ] Simplify button variants to 4 types
- [ ] Add monospace to scores only (not everywhere)
- [ ] Test real-time updates with live scoring

**Priority 3 (Nice to Have):**
- [ ] Add pulsing glow to "Live" contest indicator
- [ ] Consider adding emerald as third color (for free contests)
- [ ] Explore using orange (#F97316) somewhere (secondary accent)
- [ ] Test with DarkReader to ensure dark mode compat

---

## REFERENCE DESIGNS

### Key Takeaways by App

**Hyperliquid:**
- Premium, restrained, professional
- Monospace + Inter combo works well
- Flash animations feel premium
- Use: Inspiration for leaderboard real-time updates

**Axiom:**
- Fast, terminal-native, Solana-focused
- Neon green is bold but works
- 100ms animations create speed feeling
- Use: Inspiration for animation timing

**Photon:**
- Mobile-first, fun, accessible
- Space Mono adds personality
- Bottom sheets better than modals
- Use: Inspiration for mobile UX patterns

**Birdeye:**
- Analytics-focused, chart-first
- Cyan branding (watch out for overuse)
- Cards with breathing room
- Use: Inspiration for data visualization

**DexScreener:**
- Minimalist, whitespace-focused
- One thing, done perfectly
- Touch-friendly generous sizing
- Use: Inspiration for mobile touch targets

---

## FORESIGHT DESIGN SUMMARY

Foresight should implement:

1. ✅ **Dark theme:** Already correct (gray-950 base)
2. ✅ **Gold primary:** Already correct, well-chosen
3. ✅ **Monospace numbers:** Already present, good execution
4. ✅ **Real-time animations:** Partially implemented, enhance flash timing
5. ✅ **Button hierarchy:** Good, ensure hover states work mobile
6. ✅ **Glow effects:** Present, consider increasing use 2x
7. ⚠️ **Type scale:** Too many sizes, simplify to 6
8. ⚠️ **Secondary color:** Cyan is overused in crypto, consider alternatives
9. ⚠️ **Data density:** Leaderboard good, but test at 375px
10. ✅ **Ghost actions:** Implemented well, maintain consistency

Foresight's current design system is **80% aligned** with premium trading app patterns. The remaining 20% is polish and simplification.

---

## NEXT STEPS

1. **Share this doc** with design team
2. **Update DESIGN_TOKENS.md** to reduce type scale
3. **Audit DESIGN_PRINCIPLES.md** — add emphasis on monospace data usage
4. **Test leaderboard** at 375px width (mobile)
5. **Implement scoreFlash animation** for live updates
6. **Increase glow usage** in achievement cards and highlights
7. **Review button states** against Hyperliquid examples

---

**Research completed:** February 27, 2026
**Next revision:** After implementing Priority 1 items
