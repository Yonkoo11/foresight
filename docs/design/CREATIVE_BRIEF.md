# CREATIVE BRIEF: Foresight Design Identity

**Version:** 1.0
**Date:** February 27, 2026
**Audience:** Product team, engineers, designers, judges
**Status:** DEFINITIVE DIRECTION FOR ALL FUTURE WORK

---

## 1. THE VISION

Foresight is the premium fantasy sports app for Crypto Twitter. Not a gambling gimmick. Not another Web3 experiment. A **competence engine for crypto natives**—where skill, timing, and community outweigh wallet size. The design reflects this positioning: *ruthlessly honest, visually sophisticated, and built for people who understand real value*. Dark theme, gold accents, monospace data, and micro-interactions that feel responsive but never manipulative. Foresight should feel like the dashboard of a professional trader who happens to be competing on influencer engagement. Clean. Sharp. Intent-driven. No fluff.

---

## 2. THE USER

**Who is this for?**

- **Primary:** Crypto Twitter power users (traders, degens, influencers). Age 18-35. High income crypto natives. Hyperliquid, Phantom, Jupiter every day.
- **Secondary:** Casual crypto enthusiasts curious about the CT community. Moderate income. Fantasy sports fans who crossed into crypto.
- **Tertiary:** Influencers themselves (the "heroes"). Want to see their engagement matter. Money-motivated but community-conscious.

**What do they value?**

1. **Efficiency** — Can I draft a team and enter a contest in <2 minutes?
2. **Transparency** — Is the scoring fair? Can I understand the algorithm?
3. **Status** — Can I compare myself to others and see my progress?
4. **Community** — Are other smart people playing? Can I follow them?
5. **Authenticity** — This feels like it was built for me, not for money.

**What kills engagement?**

- Opaque algorithms (Fantasy Top's fatal flaw)
- $1,200 entry barriers (whale-only feels exclusive in the bad way)
- Slow UI updates (feels dead when leaderboard is stale)
- Manipulative design patterns (confetti, forced sharing, dark patterns)
- Mobile friction (if it's hard on phone, crypto natives leave)

---

## 3. DESIGN PERSONALITY

Five adjectives that define Foresight's visual character:

1. **Precise** — Numbers are monospace, layouts align to 4px grids, spacing is intentional. Not a pixel out of place.
2. **Dark** — Base background is #09090B, cards are #111111. Not gray. Not #1a1a1a. Deep black with subtle elevation.
3. **Restrained** — One gold CTA per screen section. Repeated actions are ghost-styled (nearly invisible by default). Color is used sparingly.
4. **Responsive** — Animations are snappy (200-300ms), not smooth (500ms). Real-time scoring updates every 30 seconds. System feels alive without feeling frenetic.
5. **Accessible** — WCAG AA contrast minimum. Clear hierarchy via typography, not color. Works on mobile at 375px without compromise.

---

## 4. WHAT WE ARE / WHAT WE ARE NOT

### What We Are

1. **Premium dark SaaS** — Linear, Vercel, Raycast level of visual sophistication
2. **Crypto-native** — Assumes users understand wallets, gas, verification, on-chain data
3. **Real-time focused** — Leaderboard updates every 30 seconds; scores flash on change
4. **Mobile-first** — Designed for portrait 375px first, scales up to desktop
5. **Transparent** — Scoring algorithm is public; audit trail visible on every score update

### What We Are NOT

1. **Gamified hype machine** — No confetti, parades, or "congratulations" spam
2. **Whale-only exclusive** — Free tier with accessible entry budget (150 points, not $1,200)
3. **Web2 fantasy sports** — Not DraftKings, not FanDuel. CT-specific mechanics (influencer tiers, captain multiplier)
4. **NFT trading platform** — No marketplace, no "asset" language. Teams are lineups, not collectibles
5. **Colorful playground** — No purple, violet, or rainbow gradients. Gold #F59E0B on dark #09090B. That's it.

---

## 5. TONE OF VOICE

How the product talks to users:

**Copy Style:**
- **Clarity over cleverness** — "Draft your team" not "Assemble your squad"
- **Numbers speak** — Show the math. "Top 12%" not "Elite tier" (well, use both, but percentile first)
- **Action-oriented** — "Join contest" not "Browse available contests" (reduce options, increase velocity)
- **No manipulation** — No FOMO copy. No "Only 3 spots left!" No false urgency. Contests run weekly; there's always a next one
- **Respect intelligence** — Users understand crypto. Don't over-explain wallets, verification, blockchain
- **Celebrate wins, not loudly** — "Nice finish! You're in the Top 15%" not "🎉🎉🎉 YOU CRUSHED IT!"

**Example Messaging:**

| Context | Bad | Good |
|---------|-----|------|
| Empty leaderboard | "Nothing here yet! 🎉" | "No active contests right now. Next contest starts Monday 12:00 UTC." |
| Score update notification | "Your score went up! 🚀" | "Team gained 150 pts from @Vitalik engagement" |
| Contest entry | "You're in! Get ready to dominate!" | "Team locked. Live leaderboard updates every 30s." |
| New user (first draft) | "Welcome to Foresight!" | "Draft in 2 minutes. Choose 5 influencers, set a captain (1.5x)." |
| Win notification | "🏆 LEGEND! You're in the Elite tier!" | "You finished in the Top 8%. Next contest starts Monday." |

---

## 6. CORE VISUAL LANGUAGE

### Color Palette

**The 60-30-10 Rule:** 60% neutral, 30% secondary accents, 10% primary accent (gold only).

```
BACKGROUNDS (60% - Neutral)
--bg-primary: #09090B   (main bg, nearly black)
--bg-elevated: #111111  (cards, slightly lighter than primary)
--bg-hover: #1A1A1F     (hover state, very subtle)

TEXT & BORDERS (30% - Secondary)
--text-primary: #FAFAFA     (white, body text)
--text-secondary: #A1A1AA   (gray-400, labels)
--text-muted: #71717A       (gray-600, hints)
--border-color: #27272A     (all borders are this gray, never bright)

ACCENTS (10% - Gold Only)
--accent-primary: #F59E0B   (gold, CTAs only)
--accent-hover: #FBBF24     (gold lighter, hover state)
--accent-muted: #D97706     (gold darker, disabled state)

STATUS COLORS (Semantic, Use Sparingly)
--success: #10B981   (emerald, success only)
--error: #EF4444     (red, errors only)
--pending: #71717A   (gray, not blue—avoid blue for pending)
```

**Rule:** If more than ONE gold element is visible on a screen section, audit that screen. Everything else is gray-on-gray, with hierarchy driven by typography and spacing, not color.

### Typography

**6 Sizes. Not 8, not 12. Six.**

| Name | Font | Size | Weight | Usage |
|------|------|------|--------|-------|
| **Display** | Plus Jakarta Sans | 32px | 700 | Page titles (rare), KPI cards |
| **H2** | Inter | 24px | 600 | Section headers, contest titles |
| **H3** | Inter | 18px | 600 | Card titles, form labels |
| **Body** | Inter | 16px | 400 | Paragraph text, leaderboard rows |
| **Body-sm** | Inter | 14px | 400 | Secondary text, timestamps |
| **Caption** | Inter | 12px | 500 | Metadata, hints, small labels |
| **Mono** | JetBrains Mono | 13px | 400 | Scores, IDs, wallet addresses |

**Rule:** Hierarchy is created via size, weight, and color—not multiple font families. Use 3 fonts max: Plus Jakarta Sans (display), Inter (body/heads), JetBrains Mono (data).

### Spacing

**4px-based scale. Never use arbitrary gaps.**

```
4px   - Tiny (icon + label)
8px   - Small (related elements)
12px  - Medium (section padding)
16px  - Standard (card padding, default gap)
20px  - Large (spacing between sections)
24px  - Extra-large (between major sections)
32px  - Huge (rarely used)
```

### Border Radius

```
Buttons:   6-8px     (rounded-sm to rounded-md)
Cards:     8px       (rounded-md, consistent)
Modals:    12px      (rounded-lg, stands out slightly)
Avatars:   9999px    (rounded-full, always circle)
```

### Shadows vs Glows

**Trading apps use glows, not harsh shadows, in dark theme.**

```css
/* Subtle elevation (cards at rest) */
shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.5);

/* Raised elevation (cards on hover, popovers) */
shadow-md: 0 4px 12px 0 rgba(0, 0, 0, 0.6);

/* Strong elevation (dropdowns, modals) */
shadow-lg: 0 20px 40px 0 rgba(0, 0, 0, 0.8);

/* Glow for achievements (gold) */
glow-gold: 0 0 20px rgba(245, 158, 11, 0.2);

/* Glow for secondary accents (cyan, rare) */
glow-cyan: 0 0 20px rgba(6, 182, 212, 0.2);
```

### Animations

**200-300ms for micro-interactions, 300-500ms for page transitions. NO animations over 500ms.**

```css
/* Standard easing (snappy, not sluggish) */
ease-out: cubic-bezier(0.4, 0, 0.2, 1);   /* Entry animations */
ease-in: cubic-bezier(0.4, 0, 0.6, 1);    /* Exit animations */

/* Score flash animation (30-second cadence leaderboard updates) */
@keyframes scoreFlash {
  0% { background-color: rgba(245, 158, 11, 0.2); }
  100% { background-color: transparent; }
}
.animate-score-flash {
  animation: scoreFlash 150ms ease-out forwards;
}

/* Button hover (reveal, don't repaint) */
transition: all 150ms ease-out;

/* Page fade-in (new content entering) */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
.content-enter {
  animation: fadeInUp 300ms ease-out forwards;
}
```

---

## 7. THE 10 NON-NEGOTIABLE DESIGN RULES

These are not guidelines. These are rules. If you're about to break one, stop and rethink.

### Rule 1: Monospace All Data
Every score, rank, point value, ID, and wallet address uses JetBrains Mono or equivalent. Body text never uses monospace. This signals "trustworthy data" and makes numbers scannable.

### Rule 2: One Gold CTA Per Screen Section
If you see two gold buttons on the same page section, one of them is wrong. Everything else is secondary (gray) or ghost (nearly invisible). Gold must mean "primary action here."

### Rule 3: Repeated Actions Are Ghost Buttons
Follow buttons, like buttons, view profile links—anything that appears on every row—must be nearly invisible by default. They reveal on hover/tap with subtle border and background. This reduces visual noise and highlights the content.

### Rule 4: No Bright Borders on Cards
Card borders are ALWAYS `border-gray-800` (#27272A) or lighter. Never bright gold, never cyan. If a card needs emphasis, use shadow lift (elevation) or glow, not a bright border.

### Rule 5: Hover States Lift, Don't Repaint
When you hover a button or card, the primary visual change should be a subtle background shift (1-2 shades lighter) or a shadow lift, NOT a jarring color change. The element should feel like it's rising, not changing color.

### Rule 6: Mobile is Not Responsive; Mobile is Primary
Design for 375px first (iPhone SE width). Test every interaction on real mobile hardware. Then add desktop optimizations (wider layouts, 3-column grids). Never design desktop-first and shrink.

### Rule 7: No Animations Over 300ms
Micro-interactions (button hover, state change) are 150-200ms. Page transitions are 300-500ms. Nothing else. Slower animations feel sluggish on mobile; faster feel twitchy.

### Rule 8: Show the Algorithm
Every score update should show the calculation. "Team gained 150 pts from 3 tweets by @vitalik (verified via Twitter API v2)." This kills any claim that the game is rigged (Fantasy Top's undoing).

### Rule 9: Percentile Over Rank
"Top 15% of players" is displayed larger and more prominently than "Rank 145 of 1,234." Percentile is psychologically safe; raw rank is demoralizing.

### Rule 10: Touch Targets Are 44px Minimum
Every interactive element (button, link, checkbox) must be at least 44px tall and 44px wide on mobile. This isn't an accessibility nice-to-have; it's a UX requirement. If an element is smaller, resize it or hide it.

---

## 8. PAGE-BY-PAGE DESIGN DIRECTION

### Home / Dashboard

**Current State:** Landing page with formation card. Dark theme, gold CTA. Mostly good.

**Changes Required:**

1. **Formation Card Prominence (40% of page):** Make it the hero. Large formation visual (Captain 1.5x, 4 tier slots). Show current team with player avatars. Tap to swap. This is your differentiator vs. Fantasy Top.

2. **Active Contest Banner (top, sticky):** "Next contest: Monday 12:00 UTC" in a subtle gray card (no gold). Clear countdown timer. One button: "View Contests" (secondary button).

3. **Activity Feed Card (30% of page):** Show last 10 activities: "Sarah drafted team for Elite Tournament," "John finished Top 12%." Auto-refresh every 30s. Gray text on dark background. Subtle. No emojis.

4. **Stats Section (bottom):** Your current points, leaderboard rank (percentile), tier badge, and "Join next contest" button (gold CTA).

5. **Remove:** Any section that says "Create a team" or "Browse teams"—these are one-click actions from the bottom nav, not hero content.

### Draft Page

**Current State:** Two-column layout—influencer grid left, team sidebar right. Tier sections (S/A/B/C).

**Changes Required:**

1. **Influencer Card Price in Monospace:** Every card should show its point cost in `font-mono text-sm font-medium`. Example: "15 pts" in gray-400. Not "Budget" color coding.

2. **Budget Tracker Hero:** Top of sidebar, huge display. "135 / 150 pts remaining" in gold if >20 pts, amber if 5-20, red if <5. Use semantic colors.

3. **Tier Sections Collapsed by Default:** S-Tier / A-Tier / B-Tier / C-Tier as collapsible sections. Show count: "S-Tier (4 available)." Users expand to browse.

4. **Captain Selector (Visual Emphasis):** When you tap an influencer to make them captain, show a large checkmark and "1.5x multiplier applied" banner. Make it feel intentional.

5. **Formation Preview:** Right sidebar shows your current 5-person team as a small formation card. Tap each slot to swap players. This is the draft experience, not a text list.

6. **Mobile:** Full-height scrollable influencer list on top half, sticky formation card below. No two-column layout on mobile.

### Leaderboard / Compete Page

**Current State:** Contest cards with LIVE badge, SOL amounts, gold CTA. Leaderboard with GOLD/SILVER/BRONZE badges, scores in monospace.

**Changes Required:**

1. **Contest Cards:**
   - Status badge (LIVE/UPCOMING/COMPLETED) in top-left. LIVE uses pulsing glow-gold (subtle pulse, 2s cycle).
   - Prize pool (large, gold text, monospace): "1.5 ETH"
   - Entries visible: "1,234 teams entered"
   - Your entry status: "You're in (Rank #145, Top 12%)"
   - CTA: "View Leaderboard" (secondary button, never gold on card)

2. **Leaderboard Table:**
   - Columns: Rank | Name | Score | Your Percentile (if applicable) | Action
   - Rank is gold #F59E0B, 24px, monospace, bold
   - Name is white, 16px, semibold, with avatar
   - Score is monospace, 16px, medium weight
   - Percentile: "Top 12%" in gray-400, 14px
   - Action: "Follow" or "View Profile" ghost button (hidden until hover)

3. **Real-Time Updates:** Leaderboard polls `/api/contest/:id/scores` every 30 seconds. On score change, flash the row with gold glow for 150ms then fade.

4. **Mobile:** Sticky header (rank, name, score), swipeable to see additional columns. No horizontal scroll needed.

### Contest Detail Page

**Current State:** Stats grid (prize pool, entries, team size). "You're In!" green banner. Formation/Grid toggle.

**Changes Required:**

1. **Hero Section:**
   - Large prize pool display (gold text, monospace, 32px): "1.5 ETH"
   - Subheading: "Prize pool distributed to Top 100"
   - Status: "LIVE - Updates every 30s" (with live indicator dot pulsing green)

2. **Tabs or Sections:**
   - **Leaderboard** (default): Show top 50, then "Your Rank" section showing your position
   - **Rules** (collapsible): Scoring formula (transparent, show the math), prize distribution, entry requirements
   - **Your Team** (formation view): Click to swap players or adjust captain

3. **Live Scoring Updates:** If contest is ongoing, show a banner: "Last updated 15 seconds ago - next update in 15 seconds." This keeps users aware the system is alive.

4. **Your Team Formation:** Always visible as a side-by-side comparison (your team | top team). Use formation card design.

### CT Feed / Intel Page

**Current State:** Tweet cards in 3-column grid. Tier badges (A/B/C). Scout buttons are CYAN (big problem).

**Changes Required:**

1. **Scout Button Color Fix:** Scout buttons should be **ghost buttons** (text-gray-500, border-transparent by default, reveal on hover). NOT cyan. Cyan is only for secondary CTAs on rare occasions.

2. **Tweet Card Design:**
   - Header: Avatar + @handle + timestamp (gray-400)
   - Tweet text: 16px, white, normal weight (not bold)
   - Engagement: "1.2K likes, 340 retweets" (monospace, gray-400, 14px)
   - Tier badge: S/A/B/C in top-right, color-coded (gold for S, cyan for A, emerald for B, gray for C)
   - Scout button (bottom-right, hidden until hover): Ghost button "Scout" or small icon

3. **Engagement Numbers in Monospace:** All numbers (likes, retweets, replies) use `font-mono text-sm`. This makes them scannable.

4. **Grid Responsiveness:** 1 column at 375px, 2 at 640px, 3 at 1024px. Cards never feel cramped.

### Profile Page

**Current State:** Header with username, wallet, level badge. Tabs: Overview/Teams/History/Watchlist/Stats. Tapestry "Not connected" warning (visually jarring). Score card with progress bar.

**Changes Required:**

1. **Header Card (Premium Elevation):**
   - Avatar (large, 80px)
   - Username + @handle
   - Tier badge (S/A/B/C) with glow-gold if elite
   - Wallet address (monospace, 14px, truncated with copy button)
   - Current Foresight Score: "534 FS" (gold, display size, monospace)

2. **Tapestry Connection:**
   - Move below header as a subtle gray card: "Tapestry profile linked (data stored immutably)."
   - Replace jarring warning with neutral status: `badge-pending` if not connected, `badge-success` if connected
   - No red warning; no urgency messaging. Users connect when they're ready.

3. **Score Progress Card:**
   - Current score: 534 FS (gold, 32px)
   - Next tier milestone: "545 FS to reach GOLD tier" (gray-400, 14px)
   - Progress bar: gray background, gold fill (use glow-gold on the filled portion)
   - Percentage: "92% of the way to GOLD" (gray-400)

4. **Tab Navigation:**
   - Overview: Current stats, recent contests, achievements
   - Teams: All teams drafted (show as formation cards, not list)
   - History: Past contest results (table format, scores in monospace)
   - Watchlist: Influencers you follow (card grid)
   - Settings: Notifications, privacy, export data

5. **Mobile:** All tabs scroll vertically. Formation cards stack 1 per row.

### Progress / Stats Page

**Current State:** Score hero with 534, BRONZE badge, progress bar, quest cards.

**Changes Required:**

1. **Hero Score Section:**
   - Score (large, gold, monospace, 48px): "534 FS"
   - Tier badge (BRONZE, cyan, emerald, or gold depending on tier)
   - Percentile: "Top 8% globally" (gray-400, 16px)
   - Next milestone: "11 FS to SILVER tier" (gray-400, 14px)

2. **Achievement Badges Grid:**
   - Show badges earned: "5 Wins in a Row," "First Contest," "Top 1,000 Finish"
   - Each badge uses glow-gold (subtle glow around each)
   - Badge has icon, name, and unlock condition (e.g., "Unlocked: Feb 15, 2026")
   - Locked badges show as gray/translucent: "Top 1% Finish (Not yet unlocked)"

3. **Weekly/Seasonal Progress:**
   - Current season standings: "Season 1: Rank 145, Top 12%"
   - Weekly contests completed: "8 of 52 contests completed"
   - Progress bar for season (gray bar, gold fill)

4. **Statistics Table:**
   - Contests entered, avg finish, best finish, win rate, total points earned
   - All numbers in monospace
   - Columns hidden/shown based on mobile width

---

## 9. COMPONENT DECISIONS

Key components and their visual specifications:

### LeaderboardRow

```
Layout: [Rank Avatar Name Score Action]

Rank:
  - Gold (#F59E0B), 24px, monospace, bold
  - Formatted as "#1", "#2", etc.
  - If rank > 100, show percentile instead: "Top 12%"

Avatar:
  - 40px circle, rounded-full
  - Border: 1px gray-700
  - Slight shadow-sm

Name:
  - White, 16px, semibold
  - Below avatar (on mobile), next to avatar (desktop)
  - @handle in gray-400, 14px, below name

Score:
  - Monospace, 16px, medium weight
  - Right-aligned
  - Color: white (or gold if it's your own row and you finished top 10%)

Action Button (Follow/View):
  - Ghost button (text-gray-500, border-transparent)
  - Hidden until row hover
  - On hover: border-gray-700, bg-gray-800, text-gray-300
  - 44px minimum height on mobile

State: Flash Animation
  - When score updates: 150ms gold glow, fade to transparent
  - Only triggered on this row, not global
```

### ContestCard

```
Layout:
[Status Badge | Title | Prize Pool | Entries | Your Status | CTA]

Background:
  - bg-gray-950, border-gray-800, rounded-lg
  - On hover: subtle shadow lift (shadow-md)
  - Never change border color on hover

Status Badge (top-left):
  - LIVE: emerald-500/20, text-emerald-400, "LIVE" with pulsing dot
  - UPCOMING: gray-700, text-gray-400, "STARTS IN 2d 4h"
  - COMPLETED: gray-700, text-gray-400, "FINAL"

Title:
  - 18px, semibold, white
  - "Elite Monday 12:00 UTC" or custom contest name

Prize Pool (large, hero):
  - Monospace, 28px, gold, bold
  - "1.5 ETH" or "10,000 FS points"

Entries:
  - Monospace, 14px, gray-400
  - "1,234 teams entered"

Your Status:
  - Gray-400, 14px
  - "You're in - Rank #145, Top 12%"
  - Or "Not entered - 3 spots available"

CTA:
  - If not entered: "Join Contest" (primary gold button)
  - If entered: "View Leaderboard" (secondary gray button)

Mobile:
  - Stack vertically, prize pool moves to top (hero position)
  - One button takes full width
```

### InfluencerCard (Draft Page)

```
Layout:
[Tier Badge | Avatar | Name | Handle | Cost | Captain Toggle]

Avatar:
  - 56px circle, rounded-full
  - Border: 1px gray-700

Name + Handle:
  - Name: 16px, white, semibold
  - Handle: 14px, gray-400, "@username"

Cost (monospace):
  - Top-right: "15 pts" (14px, gray-400)
  - Turn gold if user has selected this player

Tier Badge:
  - Top-left corner, small badge
  - S-Tier: gold, emerald, cyan, or gray-500 depending on tier
  - Show letter: "S", "A", "B", "C"

Captain Toggle:
  - Right side, checkbox-like toggle
  - Unchecked: border-gray-700, gray-500
  - Checked: bg-amber-500/20, border-amber-400, text-amber-400, "1.5x"

State:
  - On hover (desktop): shadow lift, border lifts to gray-600
  - On tap (mobile): show captain toggle, highlight card
  - On select: card gets gold glow-gold, cost turns gold

Mobile:
  - Horizontal scroll list (not grid)
  - Cards have minimum 120px width
  - Tap to select/swap
```

### TweetCard (CT Feed)

```
Layout:
[Tier Badge | Header | Tweet Text | Engagement | Scout Button]

Header:
  - Avatar (32px) + @handle (14px, white) + timestamp (12px, gray-400)
  - No "Verified" or icons; just clean header

Tweet Text:
  - 16px, white, normal weight
  - Multi-line, no truncation
  - Links are not underlined (avoid visual noise)

Tier Badge (top-right):
  - S-Tier: gold bg, white text
  - A-Tier: cyan bg, dark text
  - B-Tier: emerald bg, dark text
  - C-Tier: gray-700 bg, gray-400 text
  - Positioned in corner, 24px size

Engagement:
  - Monospace, 13px, gray-400
  - "1.2K ❤️ | 340 🔄 | 85 💬" (icons, not numbers)
  - Or: "1.2K likes, 340 retweets" (no icons, monospace)

Scout Button (bottom-right):
  - Ghost button (hidden until hover)
  - "Scout" or small icon (magnifying glass)
  - On hover: reveal, text-gray-300, border-gray-700

Background:
  - bg-gray-950, border-gray-800, rounded-lg
  - On hover: shadow-md lift

Mobile:
  - Full-width cards, 1 per column
  - Scout button visible on tap (not hover)
```

### ProfileHeader

```
Layout:
[Avatar | Username + Handle + Wallet | Tier Badge | Score | Stats Row]

Avatar:
  - 80px circle, rounded-full
  - Border: 2px gold if elite (S-Tier), 1px gray-700 otherwise
  - Shadow-md

Username:
  - 24px, white, semibold
  - Below avatar (mobile) or next to avatar (desktop)

Handle:
  - 14px, gray-400
  - Below username

Wallet Address:
  - Monospace, 12px, gray-400
  - Truncated: "0x1234...5678" with copy button (ghost)
  - Copy button: hidden until hover

Tier Badge:
  - 28px, positioned below username
  - S-Tier (gold), A-Tier (cyan), B-Tier (emerald), C-Tier (gray)
  - Include glow-gold if elite

Foresight Score (hero):
  - Monospace, 32px, gold, bold
  - "534 FS"
  - Below tier badge

Stats Row:
  - Small metrics: "145 contests | 8 wins | 92% completion"
  - 12px, gray-400, monospace
  - Space-separated, not comma-separated

Mobile:
  - Avatar on top, 64px size
  - Username centered
  - Wallet and score stacked below
```

### StatNumber

**This is the "trustworthy data" treatment.** Every important number uses this:

```
Component: <StatNumber value={2480} label="Points" />

Output:
  [Label (12px, gray-400, uppercase)]
  2,480 (monospace, 24px, medium weight, white)

Or inline:
  "2,480 pts" (monospace, 14px, gray-400)

Or hero:
  534 FS (monospace, 48px, bold, gold)

Rules:
  - Always monospace (JetBrains Mono)
  - Always medium weight (500) or semibold (600)
  - Color is white by default, gold for hero stats
  - Never use commas on mobile (<14px sizes)
  - Use tabular-nums CSS (ensures alignment)
```

### TierBadge

```
Component: <TierBadge tier="S" />

Layout: [Letter | Optional Label]

S-Tier:
  - bg-amber-500/20, border-amber-500/50, text-amber-400
  - Glow-gold on hover

A-Tier:
  - bg-cyan-500/20, border-cyan-500/50, text-cyan-400

B-Tier:
  - bg-emerald-500/20, border-emerald-500/50, text-emerald-400

C-Tier:
  - bg-gray-700/50, border-gray-700, text-gray-400

Size Variants:
  - Small (12px, for inline): Just letter "S"
  - Medium (16px, for cards): Letter + label "S-Tier"
  - Large (24px, for profile): Large letter + "GOLD TIER"

Mobile:
  - Always compact (just letter or letter+label), never take full width
```

### StatusBadge

```
Component: <StatusBadge status="LIVE" />

LIVE:
  - bg-emerald-500/10, text-emerald-400, badge-success style
  - Optional: animated pulse dot (·)

ENTERED:
  - bg-amber-500/10, text-amber-400

COMPLETED:
  - bg-gray-700/50, text-gray-400

UPCOMING:
  - bg-gray-700/50, text-gray-400

FREE:
  - bg-emerald-500/10, text-emerald-400

PAID:
  - bg-amber-500/10, text-amber-400, "$5 entry"

Rules:
  - Padding: 4px 8px
  - Font: 12px, medium weight
  - Border: 1px semantic color at 20% opacity
  - No animations except LIVE (pulse)
```

### Button Variants

**Four variants. No more. No "tertiary" or custom colors.**

```
PRIMARY (Gold CTA - Use Once Per Screen Section)
  Default: bg-amber-500, text-black, font-semibold
  Hover: bg-amber-600, shadow-md
  Active: bg-amber-700
  Disabled: opacity-50, cursor-not-allowed
  Size: px-4 py-2, 44px minimum height on mobile

SECONDARY (Gray Support Actions)
  Default: bg-gray-900, border-gray-700, text-white
  Hover: bg-gray-800, border-gray-600
  Active: bg-gray-700
  Disabled: opacity-50
  Size: px-4 py-2, 44px minimum height on mobile

GHOST (Repeated Actions - Nearly Invisible)
  Default: bg-transparent, text-gray-500, border-transparent
  Hover: bg-gray-800, border-gray-700, text-gray-300
  Active: bg-gray-700
  Disabled: opacity-50
  Size: px-3 py-2 (can be smaller, but minimum 44px touch target)

DESTRUCTIVE (Delete, Only on Confirmation)
  Default: bg-red-600, text-white (HIDDEN in normal flow)
  Hover: bg-red-700
  Active: bg-red-800
  Only shown when user initiates delete action
  Size: px-4 py-2

Transitions:
  All buttons use transition-colors 150ms ease-out
  (not ease-in-out, which feels sluggish)

Mobile:
  All buttons are at least 44px tall
  Tap targets don't overlap (minimum 8px gap)
  :active state is required (not just :hover)
```

### Navigation

**5 items. Not 6, not 4. Five. Always thumb-reachable.**

```
Bottom Tab Navigation (Mobile - Sticky):
  [Home] [Arena] [Compete] [Feed] [Profile]

  Each tab:
    - Icon (Phosphor Icons)
    - Label (11px, gray-400 by default, gold if active)
    - Tap target: Full 56px height

Desktop (Top/Side Navigation):
  Horizontal bar or vertical sidebar, same 5 items
  Active tab: text-amber-400 + underline or background

Rules:
  - Exactly 5 items (not 4, not 6)
  - Icons from Phosphor (no custom icons)
  - Labels visible on mobile (not icon-only)
  - Active state uses gold (#F59E0B), not cyan
  - Never hide navigation tabs; always visible
```

---

## 10. INSPIRATION SOURCES

For each challenge, reference these products:

| Page/Feature | Reference App | What to Study |
|--------------|---------------|---------------|
| Leaderboard | Hyperliquid | Monospace scores, real-time updates, percentile ranking |
| Contest Cards | Axiom / Photon | Card hierarchy, status badges, clear CTAs |
| Draft Page | DraftKings | Budget tracking (hero stat), tier filters, player search |
| Real-Time Scoring | DexScreener | Live updates every 30s, flash animation on change |
| Formation Card | Sorare | Visual hierarchy, card rarity, collection feel |
| Profile Page | Linear | Header design, stat cards, tab navigation |
| Empty States | Vercel | Simple icon, clear headline, single CTA |
| Dark Theme | Raycast | Elevation via shadows (not borders), minimal color |
| Typography | Inter (Google Fonts) | Clean, modern, 6-size hierarchy |
| Motion | Linear App | 200-300ms transitions, ease-out timing |

---

## 11. FINAL AUDIT CHECKLIST

Before marking any UI work complete, verify:

- [ ] All numbers are monospace (scores, ranks, amounts, IDs)
- [ ] Button hovers work on mobile (tap, not just hover)
- [ ] Real-time updates flash (150-200ms gold, not jarring)
- [ ] Achievements have glow-gold (visible but subtle)
- [ ] Only 1 gold CTA per screen section
- [ ] Type scale uses exactly 6 sizes
- [ ] Repeated actions (follow, like) are ghost-styled
- [ ] Destructive actions only appear on hover/after confirmation
- [ ] All text meets WCAG AA contrast (4.5:1)
- [ ] Borders are always gray (#27272A), never bright
- [ ] Shadows lift on hover (don't change color)
- [ ] Mobile layout works at 375px without horizontal scroll
- [ ] Animation duration: 150-300ms (no >300ms except page nav)
- [ ] Glows use rgba(245, 158, 11, 0.2) or equivalent
- [ ] Empty states have icon, headline, description, single CTA

---

## SUMMARY: THE FORESIGHT FEEL

When someone sees Foresight for the first time, they should think:

**"This feels like professional-grade trading software, built for crypto natives, by people who understand real value. Not flashy. Not manipulative. Not trying to trick me. Just clean, responsive, honest."**

That's the bar. Not "polished." Not "modern." Not "slick."

**Honest. Responsive. Intent-driven.**

Everything follows from that.

---

**Version:** 1.0
**Last Updated:** February 27, 2026
**Owner:** Creative Director (Claude)
**Status:** READY FOR IMPLEMENTATION
**Approval:** Use as definitive direction for all frontend work
