# COMPONENT SPEC V2: Detailed Design & Implementation

**Version:** 2.0
**Date:** February 27, 2026
**Status:** DEFINITIVE - Use for component implementation
**Scope:** 10 key components with exact specs, states, and Tailwind classes

---

## 1. LEADERBOARD ROW

**Purpose:** Display a player's rank, score, and actions on the leaderboard.

**Anatomy:**
```
[Rank] [Avatar + Name/Handle] [Score] [Percentile] [Action]
```

### Visual Design

```
┌─────────────────────────────────────────────────────────┐
│ #1   [A]  Alice Chen        2,480 pts  Top 12%  Follow │
│      @alice                                              │
└─────────────────────────────────────────────────────────┐
```

### Desktop Layout (640px+)

```tailwind
<tr className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
  {/* Rank */}
  <td className="px-4 py-4 text-amber-500 font-mono font-bold text-2xl w-12">
    #1
  </td>

  {/* Avatar + Name */}
  <td className="px-4 py-4 flex items-center gap-3">
    <img className="w-10 h-10 rounded-full border border-gray-700" src={avatar} />
    <div>
      <div className="text-white font-semibold text-base">Alice Chen</div>
      <div className="text-gray-400 text-sm">@alice</div>
    </div>
  </td>

  {/* Score */}
  <td className="px-4 py-4 text-right font-mono text-base font-medium text-white">
    2,480
  </td>

  {/* Percentile */}
  <td className="px-4 py-4 text-right text-gray-400 text-sm">
    Top 12%
  </td>

  {/* Action */}
  <td className="px-4 py-4 text-right">
    <button className="text-gray-500 border-transparent hover:border-gray-700 hover:bg-gray-800 hover:text-gray-300 px-3 py-1 rounded-md transition-colors">
      Follow
    </button>
  </td>
</tr>
```

### Mobile Layout (375px)

```tailwind
<tr className="border-b border-gray-800 hover:bg-gray-900">
  <td colSpan="4" className="px-3 py-4">
    <div className="flex items-start justify-between gap-2">
      {/* Rank + Avatar + Name */}
      <div className="flex items-center gap-2 flex-1">
        <div className="text-amber-500 font-mono font-bold text-lg w-8">#1</div>
        <img className="w-10 h-10 rounded-full border border-gray-700" src={avatar} />
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold text-sm truncate">Alice Chen</div>
          <div className="text-gray-500 text-xs">Top 12%</div>
        </div>
      </div>

      {/* Score + Action */}
      <div className="flex items-center gap-2">
        <div className="text-right">
          <div className="font-mono text-white font-medium">2,480</div>
          <div className="text-gray-500 text-xs">pts</div>
        </div>
        <button className="text-gray-500 hover:text-gray-300 hover:bg-gray-800 p-2 rounded-md">
          ⭐
        </button>
      </div>
    </div>
  </td>
</tr>
```

### States

```
REST:
  - bg: transparent
  - border: gray-800
  - rank color: amber-500 (gold)
  - text: white / gray-400

HOVER (Desktop):
  - bg: gray-900 (slight lift)
  - border: gray-800 (no change)
  - shadow: shadow-sm (subtle lift)
  - action button: reveal (border-gray-700, bg-gray-800)

ACTIVE/YOUR ROW:
  - If user is top 10%: rank text-amber-500, bold
  - If user is below top 10%: normal color, percentile emphasized

FLASH ANIMATION (Score Update):
  - bg: rgba(245, 158, 11, 0.2) → transparent (150ms)
  - Triggered only on this row, not global
```

### Current Issues & Fixes

| Issue | Current | Fix |
|-------|---------|-----|
| **Percentile Display** | Not visible/too small | Make percentile large, bold, right-aligned |
| **Mobile Rank** | May be cut off | Ensure rank is always visible, even if small |
| **Action Button** | Always visible on mobile | Hide until tap, or show as icon |
| **Score Color** | White always | Gold for top 10% finishers (optional) |
| **Hover on Mobile** | N/A | Add active/tap state instead |

---

## 2. CONTEST CARD

**Purpose:** Display a contest with entry info, prizes, and CTA.

**Anatomy:**
```
[Status | Title | Prize Pool | Entries | Your Status | CTA]
```

### Visual Design

```
┌────────────────────────────────────────┐
│ LIVE                                   │
│ Elite Monday 12:00 UTC                 │
│                                        │
│ 1.5 ETH                                │
│ Prize pool distributed to Top 100      │
│                                        │
│ 1,234 teams entered                    │
│ You're in - Rank #145 (Top 12%)        │
│                                        │
│ [View Leaderboard]                     │
└────────────────────────────────────────┘
```

### Desktop/Tablet Layout (640px+)

```tailwind
<div className="bg-gray-950 border border-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md hover:bg-gray-925 transition-all cursor-pointer group">
  {/* Status Badge */}
  <div className="inline-block mb-4">
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      LIVE
    </span>
  </div>

  {/* Title */}
  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-amber-400 transition-colors">
    Elite Monday 12:00 UTC
  </h3>

  {/* Prize Pool (Hero) */}
  <div className="mb-6">
    <div className="text-amber-500 font-mono font-bold text-3xl">1.5 ETH</div>
    <div className="text-gray-400 text-sm mt-1">Prize pool distributed to Top 100</div>
  </div>

  {/* Entries + Your Status */}
  <div className="border-t border-gray-800 pt-4 mb-4">
    <div className="text-gray-400 text-sm font-mono mb-2">1,234 teams entered</div>
    <div className="text-gray-400 text-sm">
      You're in · Rank #145 · <span className="text-amber-400">Top 12%</span>
    </div>
  </div>

  {/* CTA */}
  <button className="w-full bg-gray-900 border border-gray-700 text-white font-semibold py-2 rounded-md hover:bg-gray-800 transition-colors">
    View Leaderboard
  </button>
</div>
```

### Mobile Layout (375px)

```tailwind
<div className="bg-gray-950 border border-gray-800 rounded-lg p-4 shadow-sm">
  {/* Status Badge */}
  <div className="inline-block mb-3">
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
      LIVE
    </span>
  </div>

  {/* Title */}
  <h3 className="text-lg font-semibold text-white mb-3">
    Elite Monday 12:00 UTC
  </h3>

  {/* Prize Pool (Hero) */}
  <div className="mb-4">
    <div className="text-amber-500 font-mono font-bold text-2xl">1.5 ETH</div>
    <div className="text-gray-400 text-xs mt-1">Prize pool to Top 100</div>
  </div>

  {/* Entry Info */}
  <div className="space-y-2 mb-4 text-sm">
    <div className="text-gray-400 font-mono">1,234 teams</div>
    <div className="text-gray-400">
      You're in · <span className="text-amber-400">Top 12%</span>
    </div>
  </div>

  {/* CTA */}
  <button className="w-full bg-amber-500 text-black font-semibold py-2 rounded-md hover:bg-amber-600 transition-colors">
    View Leaderboard
  </button>
</div>
```

### States

```
REST:
  - bg: gray-950
  - border: gray-800
  - shadow: shadow-sm
  - CTA: Secondary (gray) if entered, Primary (gold) if not

HOVER (Desktop):
  - bg: gray-925 (lift)
  - shadow: shadow-md (more lift)
  - title: text-amber-400 (optional color change on title hover)

LIVE INDICATOR:
  - Pulsing green dot (animate-pulse, 2s cycle)
  - Only on LIVE contests
  - Not on UPCOMING or COMPLETED

NOT ENTERED:
  - Your status: "Not entered - 3 spots available"
  - CTA: Primary gold "Join Contest"

ENTERED:
  - Your status: "You're in - Rank #145 - Top 12%"
  - CTA: Secondary "View Leaderboard"

UPCOMING:
  - Status: "STARTS IN 2d 4h" (countdown)
  - CTA: "Set Reminder"

COMPLETED:
  - Status: "FINAL"
  - CTA: "View Results"
```

### Current Issues & Fixes

| Issue | Current | Fix |
|-------|---------|-----|
| **Prize Display** | May be small or unclear | Make 3xl, gold, monospace, hero position |
| **Status Badge** | May be hard to see | Use full-width background on mobile, pulsing dot for LIVE |
| **CTA Color** | Always secondary | Use primary (gold) if not entered, secondary if entered |
| **Entries Count** | Not prominent | Move to main body, use monospace |

---

## 3. INFLUENCER CARD (Draft Page)

**Purpose:** Display an influencer in the draft selection grid.

**Anatomy:**
```
[Tier Badge | Avatar | Name | Handle | Cost | Captain Toggle]
```

### Visual Design

```
┌──────────────────┐
│ S  [Avatar]      │
│                  │
│ Vitalik Buterin  │
│ @vbuterin        │
│                  │
│ 20 pts  [1.5x?]  │
└──────────────────┘
```

### Desktop Layout (Grid)

```tailwind
<div className="bg-gray-950 border border-gray-800 rounded-lg p-4 hover:border-gray-700 hover:shadow-md transition-all cursor-pointer group">
  {/* Tier Badge (top-left corner) */}
  <div className="absolute top-2 left-2">
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 text-xs font-bold">
      S
    </span>
  </div>

  {/* Avatar (center) */}
  <div className="flex justify-center mb-4">
    <img className="w-16 h-16 rounded-full border-2 border-gray-700 group-hover:border-amber-400 transition-colors" src={avatar} />
  </div>

  {/* Name */}
  <h4 className="text-center font-semibold text-white mb-1">Vitalik Buterin</h4>

  {/* Handle */}
  <p className="text-center text-gray-400 text-sm mb-4">@vbuterin</p>

  {/* Cost + Captain Toggle */}
  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
    <span className="font-mono text-sm font-medium text-gray-400">20 pts</span>
    <button className="px-2 py-1 rounded-md border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-amber-400 transition-colors">
      1.5x?
    </button>
  </div>
</div>
```

### Mobile Layout (Horizontal Scroll)

```tailwind
<div className="flex-shrink-0 w-32 bg-gray-950 border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-colors">
  {/* Avatar (larger proportion on mobile) */}
  <img className="w-full h-20 rounded-md mb-2 border border-gray-700" src={avatar} />

  {/* Tier Badge */}
  <span className="inline-block text-xs font-bold px-1 py-0.5 rounded bg-amber-500/20 text-amber-400 mb-2">S</span>

  {/* Name (truncated) */}
  <h4 className="text-xs font-semibold text-white truncate mb-1">Vitalik</h4>

  {/* Cost */}
  <span className="text-xs font-mono text-gray-400">20 pts</span>
</div>
```

### States

```
REST:
  - bg: gray-950
  - border: gray-800
  - avatar border: gray-700
  - cost color: gray-400
  - captain button: border-gray-700, text-gray-400

HOVER (Desktop):
  - bg: gray-950 (no change)
  - border: gray-700 (lifted)
  - avatar border: amber-400 (lifted)
  - shadow: shadow-md
  - captain button: bg-gray-800, text-amber-400 (revealed)

SELECTED (Active):
  - border: amber-500 (solid gold)
  - bg: amber-500/5 (faint gold tint)
  - shadow: glow-gold (subtle glow)
  - cost color: amber-400 (gold)

CAPTAIN SELECTED:
  - captain button: bg-amber-500/20, border-amber-400, text-amber-400
  - badge shows: "1.5x" instead of "1.5x?"

UNAVAILABLE (Budget exceeded):
  - opacity: 0.5
  - cursor: not-allowed
  - cost color: red-500 (red for exceeds budget)
```

### Current Issues & Fixes

| Issue | Current | Fix |
|-------|---------|-----|
| **Price Display** | May not be monospace | Ensure font-mono, medium weight, consistent sizing |
| **Captain Toggle** | May be unclear what it does | Show "1.5x?" at rest, "1.5x ✓" when selected |
| **Tier Badge** | May be hard to see | Use colored background at 20% opacity |
| **Selection Feedback** | May not be clear when selected | Add gold border, glow, and background tint |

---

## 4. TWEET CARD (CT Feed / Intelligence)

**Purpose:** Display a single tweet from a hero influencer.

**Anatomy:**
```
[Tier Badge | Header (Avatar + @handle + timestamp) | Tweet Text | Engagement | Scout Button]
```

### Visual Design

```
┌──────────────────────────────────────────┐
│ S                                        │
│ [A] @vitalik   · 2h ago                  │
│                                          │
│ Bitcoin's dominance hitting new lows...  │
│ Bullish for altseason starting soon      │
│                                          │
│ 1.2K ❤️  | 340 🔄  | 85 💬               │
│                                [Scout]   │
└──────────────────────────────────────────┘
```

### Desktop/Tablet Layout (640px+)

```tailwind
<div className="bg-gray-950 border border-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-gray-700 transition-all group">
  {/* Tier Badge (top-right corner) */}
  <div className="absolute top-3 right-3">
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 text-xs font-bold">
      S
    </span>
  </div>

  {/* Header: Avatar + Handle + Timestamp */}
  <div className="flex items-center gap-3 mb-3">
    <img className="w-8 h-8 rounded-full border border-gray-700" src={avatar} />
    <div className="flex-1 min-w-0">
      <div className="text-white font-semibold text-sm">@vitalik</div>
      <div className="text-gray-500 text-xs">2 hours ago</div>
    </div>
  </div>

  {/* Tweet Text */}
  <p className="text-white text-sm mb-3 leading-relaxed">
    Bitcoin's dominance hitting new lows...
    <br />
    Bullish for altseason starting soon
  </p>

  {/* Engagement Stats */}
  <div className="flex gap-4 mb-3 text-xs text-gray-400 font-mono border-t border-gray-800 pt-3">
    <span>1.2K ❤️</span>
    <span>340 🔄</span>
    <span>85 💬</span>
  </div>

  {/* Scout Button (hidden until hover on desktop) */}
  <button className="invisible group-hover:visible text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors">
    Scout
  </button>
</div>
```

### Mobile Layout (375px)

```tailwind
<div className="bg-gray-950 border border-gray-800 rounded-lg p-3 shadow-sm">
  {/* Tier Badge + Header */}
  <div className="flex items-start justify-between mb-2">
    <div className="flex items-center gap-2 flex-1">
      <img className="w-8 h-8 rounded-full border border-gray-700" src={avatar} />
      <div className="flex-1 min-w-0">
        <div className="text-white font-semibold text-sm">@vitalik</div>
        <div className="text-gray-500 text-xs">2h ago</div>
      </div>
    </div>
    {/* Tier Badge */}
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 text-xs font-bold">
      S
    </span>
  </div>

  {/* Tweet Text */}
  <p className="text-white text-sm mb-2">
    Bitcoin's dominance hitting new lows. Bullish for altseason.
  </p>

  {/* Engagement */}
  <div className="flex gap-3 mb-2 text-xs text-gray-400 font-mono">
    <span>1.2K</span>
    <span>340</span>
    <span>85</span>
  </div>

  {/* Scout Button (always visible on mobile, tappable) */}
  <button className="text-gray-500 active:text-gray-300 active:bg-gray-900 px-3 py-1 rounded-md text-sm font-medium transition-colors">
    Scout
  </button>
</div>
```

### States

```
REST:
  - bg: gray-950
  - border: gray-800
  - shadow: shadow-sm
  - scout button: hidden (desktop) / visible (mobile)

HOVER (Desktop):
  - bg: gray-950 (no change)
  - border: gray-700 (lifted)
  - shadow: shadow-md
  - scout button: visible, text-gray-500

HOVER/ACTIVE (Mobile):
  - scout button: visible, text-gray-300, bg-gray-900

TIER BADGE COLOR:
  - S-Tier: bg-amber-500/20, border-amber-500/50, text-amber-400
  - A-Tier: bg-cyan-500/20, border-cyan-500/50, text-cyan-400
  - B-Tier: bg-emerald-500/20, border-emerald-500/50, text-emerald-400
  - C-Tier: bg-gray-700/50, border-gray-700, text-gray-400
```

### Current Issues & Fixes

| Issue | Current | Fix |
|-------|---------|-----|
| **Scout Button Color** | May be cyan (wrong) | Use ghost button (gray-500, reveal on hover) |
| **Engagement Numbers** | May not be monospace | Use font-mono, medium weight |
| **Tier Badge** | May be hard to locate | Place in top-right, use colored background at 20% opacity |
| **Mobile Scout** | Hidden on tap | Make tappable, show as visible button on mobile |

---

## 5. PROFILE HEADER

**Purpose:** Display user's profile info, tier, and main stats.

**Anatomy:**
```
[Avatar | Username + Handle + Wallet | Tier Badge | Foresight Score | Stats Row]
```

### Visual Design

```
      [Avatar 80px]
      Alice Chen
      @alice
      0x1234...5678

      [S-TIER BADGE]

      534 FS

      145 contests | 8 wins | 92% completion
```

### Desktop/Tablet Layout

```tailwind
<div className="bg-gray-950 border border-gray-800 rounded-lg p-8">
  {/* Avatar + Info */}
  <div className="flex items-start gap-6 mb-8">
    <img className="w-20 h-20 rounded-full border-2 border-amber-500 shadow-lg" src={avatar} />

    <div>
      <h1 className="text-3xl font-bold text-white mb-1">Alice Chen</h1>
      <p className="text-gray-400 text-lg mb-3">@alice</p>
      <p className="text-gray-500 text-sm font-mono flex items-center gap-2">
        0x1234...5678
        <button className="text-gray-400 hover:text-white">📋</button>
      </p>
    </div>
  </div>

  {/* Tier Badge */}
  <div className="mb-6">
    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/50 text-amber-400 font-bold">
      <span className="w-3 h-3 rounded-full bg-amber-500 shadow-gold"></span>
      GOLD TIER
    </span>
  </div>

  {/* Foresight Score (Hero) */}
  <div className="mb-8">
    <div className="text-amber-500 font-mono font-bold text-5xl">534 FS</div>
    <div className="text-gray-400 text-sm mt-2">11 points to SILVER tier</div>
    {/* Progress bar */}
    <div className="w-full bg-gray-900 rounded-full h-2 mt-3">
      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '92%' }}></div>
    </div>
    <div className="text-gray-500 text-xs mt-2">92% to next tier</div>
  </div>

  {/* Stats Row */}
  <div className="flex gap-6 text-sm border-t border-gray-800 pt-6">
    <div>
      <div className="text-gray-400">Contests</div>
      <div className="text-white font-mono font-semibold">145</div>
    </div>
    <div>
      <div className="text-gray-400">Wins</div>
      <div className="text-white font-mono font-semibold">8</div>
    </div>
    <div>
      <div className="text-gray-400">Completion</div>
      <div className="text-white font-mono font-semibold">92%</div>
    </div>
  </div>
</div>
```

### Mobile Layout (375px)

```tailwind
<div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
  {/* Avatar + Info (stacked) */}
  <div className="text-center mb-4">
    <img className="w-16 h-16 rounded-full border-2 border-amber-500 mx-auto mb-3 shadow-lg" src={avatar} />

    <h1 className="text-2xl font-bold text-white mb-1">Alice Chen</h1>
    <p className="text-gray-400 text-sm mb-2">@alice</p>
    <p className="text-gray-500 text-xs font-mono mb-3">
      0x1234...5678
      <button className="ml-2 text-gray-400">📋</button>
    </p>
  </div>

  {/* Tier Badge (centered) */}
  <div className="text-center mb-4">
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/50 text-amber-400 font-bold text-sm">
      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
      GOLD
    </span>
  </div>

  {/* Foresight Score (Hero) */}
  <div className="text-center mb-4 py-4 border-y border-gray-800">
    <div className="text-amber-500 font-mono font-bold text-4xl">534 FS</div>
    <div className="text-gray-500 text-xs mt-2">92% to Silver tier</div>
  </div>

  {/* Stats Row (stacked on mobile) */}
  <div className="grid grid-cols-3 gap-2 text-xs">
    <div className="text-center">
      <div className="text-gray-400">Contests</div>
      <div className="text-white font-mono font-semibold">145</div>
    </div>
    <div className="text-center">
      <div className="text-gray-400">Wins</div>
      <div className="text-white font-mono font-semibold">8</div>
    </div>
    <div className="text-center">
      <div className="text-gray-400">Completion</div>
      <div className="text-white font-mono font-semibold">92%</div>
    </div>
  </div>
</div>
```

### States

```
TIER BADGE:
  - S-Tier: bg-amber-500/10, border-amber-500/50, text-amber-400 (with gold glow)
  - A-Tier: bg-cyan-500/10, border-cyan-500/50, text-cyan-400
  - B-Tier: bg-emerald-500/10, border-emerald-500/50, text-emerald-400
  - C-Tier: bg-gray-700/50, border-gray-700, text-gray-400

AVATAR BORDER:
  - Top 10%: border-amber-500 (gold), shadow-gold
  - Below top 10%: border-gray-700 (gray)

PROGRESS BAR:
  - Background: bg-gray-900
  - Fill: bg-amber-500 with width = (current / next_milestone) * 100%
  - Optional: glow-gold on fill for premium feel

WALLET ADDRESS:
  - Font-mono, text-gray-500, truncated
  - Copy button (ghost style) appears on hover
```

### Current Issues & Fixes

| Issue | Current | Fix |
|-------|---------|-----|
| **Tapestry Warning** | Jarring red/warning banner | Move below header, use neutral badge with "Linked" status |
| **Score Display** | May be too small | Increase to display size (32-48px), use gold color |
| **Avatar Border** | May be gray always | Use gold for elite (top 10%), gray for others |
| **Stats** | May not be aligned | Use monospace, right-align, add labels above |

---

## 6. STAT NUMBER

**Purpose:** Display a single important number (score, rank, percentage).

**Anatomy:**
```
[Label (optional)]
[Number in Monospace]
```

### Variants

```
/* Hero size (display) */
<div>
  <div className="text-amber-500 font-mono font-bold text-5xl">534</div>
  <div className="text-gray-400 text-sm">Foresight Score</div>
</div>

/* Card size (body) */
<div>
  <div className="text-gray-400 text-xs uppercase font-semibold mb-1">Contests</div>
  <div className="text-white font-mono font-semibold text-2xl">145</div>
</div>

/* Inline size (body-sm) */
<span className="text-white font-mono font-medium">2,480 pts</span>

/* Label + number (table) */
<td className="text-right">
  <div className="text-gray-400 text-xs mb-1">Score</div>
  <div className="text-white font-mono font-semibold">2,480</div>
</td>
```

### Rules

```
✅ ALWAYS use font-mono for numbers
✅ ALWAYS use medium (500) or semibold (600) weight
✅ ALWAYS use font-variant-numeric: tabular-nums (for alignment)
✅ ALWAYS use comma separators for numbers > 999 (2,480)
✅ On mobile, don't use commas for numbers < 100px width
✅ Label should be gray-400, smaller than number
✅ Color: white by default, gold for hero stats, red for error states

❌ NEVER use monospace for body text
❌ NEVER use font weight 400 for numbers
❌ NEVER use without label (except very obvious context)
```

### CSS Implementation

```css
.stat-number {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  font-variant-numeric: tabular-nums;  /* Ensures digit alignment */
  letter-spacing: 0.02em;              /* Slight spacing for readability */
}

.stat-number-hero {
  @apply text-5xl font-bold text-amber-500;
  @apply font-mono font-variant-numeric: tabular-nums;
}

.stat-number-card {
  @apply text-2xl font-semibold text-white;
  @apply font-mono font-variant-numeric: tabular-nums;
}

.stat-number-inline {
  @apply text-base font-medium text-white;
  @apply font-mono font-variant-numeric: tabular-nums;
}

.stat-label {
  @apply text-gray-400 text-xs uppercase font-semibold;
}
```

---

## 7. TIER BADGE

**Purpose:** Show influencer/player tier (S/A/B/C).

**Anatomy:**
```
[Colored Background] [Letter] [Optional Label]
```

### Variants

```
/* Inline (small) */
<span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 font-bold text-xs">
  S
</span>

/* Card (medium) */
<span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/20 border border-amber-500/50 text-amber-400 font-bold text-sm">
  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
  S-Tier
</span>

/* Profile (large) */
<span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/50 text-amber-400 font-bold text-base">
  <span className="w-3 h-3 rounded-full bg-amber-500 shadow-gold"></span>
  GOLD TIER
</span>
```

### Tier Colors

```
S-Tier:
  - Background: bg-amber-500/20 or bg-amber-500/10
  - Border: border-amber-500/50 or border-amber-500/30
  - Text: text-amber-400
  - Glow: shadow-gold (optional, for premium feel)

A-Tier:
  - Background: bg-cyan-500/20
  - Border: border-cyan-500/50
  - Text: text-cyan-400

B-Tier:
  - Background: bg-emerald-500/20
  - Border: border-emerald-500/50
  - Text: text-emerald-400

C-Tier:
  - Background: bg-gray-700/50
  - Border: border-gray-700
  - Text: text-gray-400
```

### States

```
REST:
  - Border at 50% opacity
  - Text colored
  - No shadow

HOVER (Desktop):
  - S-Tier only: add shadow-gold
  - Other tiers: no change

SELECTED:
  - S-Tier: opacity 100%, shadow-gold visible
  - Others: no change
```

---

## 8. STATUS BADGE

**Purpose:** Show status (LIVE, ENTERED, COMPLETED, FREE, PAID, etc.).

**Anatomy:**
```
[Icon/Dot] [Label] [Optional Value]
```

### Variants

```
/* Live (with pulse dot) */
<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
  LIVE
</span>

/* Entered */
<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium">
  ✓ ENTERED
</span>

/* Completed */
<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-700/50 text-gray-400 text-xs font-medium">
  ✓ COMPLETED
</span>

/* Free */
<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
  FREE
</span>

/* Paid */
<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium">
  $5 ENTRY
</span>

/* Error */
<span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium">
  ⚠ ERROR
</span>
```

### Status Color Mapping

| Status | Background | Text | Dot/Icon |
|--------|-----------|------|----------|
| **LIVE** | emerald-500/10 | emerald-400 | ● (pulsing) |
| **ENTERED** | amber-500/10 | amber-400 | ✓ |
| **COMPLETED** | gray-700/50 | gray-400 | ✓ |
| **FREE** | emerald-500/10 | emerald-400 | None |
| **PAID** | amber-500/10 | amber-400 | $ |
| **ERROR** | red-500/10 | red-400 | ⚠ |
| **PENDING** | gray-700/50 | gray-400 | ⏳ |

---

## 9. BUTTON VARIANTS

**Purpose:** Four button variants for all actions.

### PRIMARY (Gold CTA)

**Use:** One per screen section. Main action.

```tailwind
<button className="
  bg-amber-500 hover:bg-amber-600 active:bg-amber-700
  text-black font-semibold
  px-4 py-2 rounded-md
  transition-colors duration-150
  disabled:opacity-50 disabled:cursor-not-allowed
  min-h-[44px]  /* Mobile touch target */
">
  Join Contest
</button>
```

### SECONDARY (Gray)

**Use:** Support actions, less important CTAs.

```tailwind
<button className="
  bg-gray-900 hover:bg-gray-800 active:bg-gray-700
  border border-gray-700
  text-white font-semibold
  px-4 py-2 rounded-md
  transition-colors duration-150
  disabled:opacity-50
  min-h-[44px]
">
  View Details
</button>
```

### GHOST (Invisible by Default)

**Use:** Repeated actions (follow, like, view profile). Appears on hover/tap.

```tailwind
<button className="
  bg-transparent
  text-gray-500 hover:text-gray-300
  border-transparent hover:border-gray-700 hover:bg-gray-800
  px-3 py-1 rounded-md
  transition-all duration-150
  active:bg-gray-700  /* For mobile tap */
  min-h-[44px]
">
  Follow
</button>
```

### DESTRUCTIVE (Red, Hidden)

**Use:** Delete actions. Only shown on confirmation.

```tailwind
<button className="
  bg-red-600 hover:bg-red-700 active:bg-red-800
  text-white font-semibold
  px-4 py-2 rounded-md
  transition-colors duration-150
  disabled:opacity-50
  min-h-[44px]
">
  Delete Team
</button>
```

### Icon Button

**Use:** Standalone icons (close, menu, etc.).

```tailwind
<button className="
  w-8 h-8 flex items-center justify-center
  text-gray-400 hover:text-white
  hover:bg-gray-800 active:bg-gray-700
  rounded-md transition-all duration-150
">
  ✕
</button>
```

### Button States

```
All buttons have these states:
  REST: Default appearance
  HOVER (Desktop): Subtle change (color or shadow)
  ACTIVE (Mobile): Same as hover (no :hover on touch)
  FOCUS: Gold ring outline (for keyboard navigation)
  DISABLED: opacity-50, cursor-not-allowed
  LOADING: Show spinner, disabled=true

Transitions: all 150ms ease-out (not ease-in-out)
```

---

## 10. NAVIGATION

**Purpose:** Bottom tab navigation (mobile) or top nav (desktop).

### Mobile Bottom Navigation (Sticky)

```tailwind
<nav className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 z-50">
  <div className="flex items-stretch">
    {/* Home */}
    <NavItem label="Home" icon={HomeIcon} href="/" active={true} />

    {/* Arena (Draft) */}
    <NavItem label="Arena" icon={DraftIcon} href="/draft" />

    {/* Compete (Leaderboard) */}
    <NavItem label="Compete" icon={TrophyIcon} href="/compete" />

    {/* Feed */}
    <NavItem label="Feed" icon={FeedIcon} href="/feed" />

    {/* Profile */}
    <NavItem label="Profile" icon={ProfileIcon} href="/profile" />
  </div>
</nav>

function NavItem({ label, icon: Icon, href, active }) {
  return (
    <a
      href={href}
      className={`
        flex-1 flex flex-col items-center justify-center
        py-3 px-2 min-h-[56px]
        transition-colors duration-200
        ${active
          ? 'text-amber-400 border-t-2 border-amber-400'
          : 'text-gray-400 hover:text-gray-300'
        }
      `}
    >
      <Icon className="w-6 h-6 mb-1" />
      <span className="text-xs font-medium">{label}</span>
    </a>
  );
}
```

### Desktop Top Navigation (Horizontal)

```tailwind
<nav className="bg-gray-950 border-b border-gray-800">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-8">
    {/* Logo */}
    <div className="w-8 h-8 bg-amber-500 rounded-md flex-shrink-0"></div>

    {/* Nav Items */}
    <div className="flex items-center gap-6 flex-1">
      <NavItem label="Home" href="/" active={true} />
      <NavItem label="Arena" href="/draft" />
      <NavItem label="Compete" href="/compete" />
      <NavItem label="Feed" href="/feed" />
      <NavItem label="Profile" href="/profile" />
    </div>

    {/* User Menu */}
    <button className="text-gray-400 hover:text-white">
      ⚙️ Settings
    </button>
  </div>
</nav>

function NavItem({ label, href, active }) {
  return (
    <a
      href={href}
      className={`
        text-sm font-medium
        transition-colors duration-200
        ${active
          ? 'text-amber-400 border-b-2 border-amber-400 pb-2'
          : 'text-gray-400 hover:text-white'
        }
      `}
    >
      {label}
    </a>
  );
}
```

### Navigation Rules

```
✅ Exactly 5 items (Home, Arena, Compete, Feed, Profile)
✅ Icons from Phosphor Icons
✅ Labels visible (not icon-only on mobile)
✅ Active item: text-amber-400 + underline/border
✅ Inactive: text-gray-400
✅ Touch target: 56px minimum on mobile
✅ Never hide tabs (always visible)

❌ No 6th item (scope creep)
❌ No icon-only layout (unclear to new users)
❌ No cyan for active (use gold)
```

---

## IMPLEMENTATION CHECKLIST

Before implementing any component:

- [ ] Read this spec fully
- [ ] Study all states (REST, HOVER, ACTIVE, DISABLED)
- [ ] Test on mobile at 375px width
- [ ] Verify all text uses correct type scale
- [ ] Verify all numbers use monospace
- [ ] Verify all colors are from DESIGN_TOKENS_V2.md
- [ ] Test accessibility (WCAG AA contrast, keyboard nav)
- [ ] Test animations (should be 150-300ms)
- [ ] Screenshot and compare to reference apps

---

**Version:** 2.0
**Last Updated:** February 27, 2026
**Status:** READY FOR IMPLEMENTATION
**Owner:** Frontend team
