# CREATIVE DIRECTOR BRIEF: Foresight's Visual Identity & Strategy

> **Role:** Creative Director for Foresight
> **Audience:** Product team, designers, engineers, judges
> **Version:** 1.0 — Definitive Positioning
> **Date:** February 27, 2026
> **Status:** THIS IS LAW. No hedging. No alternatives.

---

## EXECUTIVE SUMMARY

Foresight is not a gambling app. Not a memecoin casino. Not Web3 experiment #47.

**Foresight is a competence engine for crypto natives.**

The design reflects this singular truth: we are building the dashboard where crypto Twitter skill-measures itself. Every visual decision answers one question: *Would this appear on Hyperliquid's dashboard or Linear's design system?*

If the answer is "no," we delete it.

---

## THE 7 DEFINITIVE ANSWERS

### 1. WHAT IS FORESIGHT'S VISUAL METAPHOR?

**ANSWER: The Trading Terminal Dashboard (Not the Sports Arena)**

This is the most important decision in our entire design system.

**Why NOT Sports Arena:**
- DraftKings, FanDuel, ESPN all use sports metaphors (stadium imagery, player cards like baseball cards, celebration animations)
- Crypto Twitter doesn't care about sports. They care about *data, precision, and speed*
- Sports metaphors attract casual users. We want serious competitors
- Sports imagery is inherently cheerful. Foresight is serious

**Why Trading Terminal:**
- Hyperliquid, Axiom, Bybit, Tradingview are the reference aesthetic for CT users
- Trading dashboards have **density, monospace data, real-time updates, dark theme, minimal decoration**
- They signal: "This is where professionals work"
- They create psychological permission to win/lose money (appropriate for our positioning)
- They scale from mobile to 5-monitor desk setup (DraftKings can't)

**The Metaphor Applied:**

A Foresight page isn't a "contest" — it's a **position**. You don't "draft a team," you **open a position**. Scores aren't "points," they're **P&L on your position**. Leaderboard isn't "rankings," it's a **price discovery mechanism** showing who's winning the game. The UI shows:

- **Monospace numbers** (all stats use JetBrains Mono)
- **Real-time updates** with brief flash animations (not confetti)
- **No decorative imagery** (avatars are functional, not illustrative)
- **Density of information** (15+ data points visible at once on leaderboard)
- **High-contrast dark backgrounds** (black #09090B, not dark gray)
- **Minimal chrome** (borders, buttons, icons are restrained; data is hero)
- **Terminal typography** (header reads like a stock quote: `@username  [S] [1,250 pts] [Rank #43]`)

**Design Implication:** If it looks like Hyperliquid + Linear had a baby, we're correct. If it looks like DraftKings, we failed.

---

### 2. WHAT MAKES FORESIGHT UNIQUE VISUALLY (ONLY FORESIGHT)?

**ANSWER: The Formation Grid + Live Team Visualization**

This is what differentiates us from trading apps (and sports apps).

**The Unique Element:**

The **formation grid** is Foresight's visual signature. Only Foresight has this.

```
Formation Grid (Only Foresight)
─────────────────────────────────
            [CAPTAIN]
      [S-Tier] [S-Tier]
   [A-Tier] [A-Tier] [A-Tier]
 [B-Tier] [B-Tier] [B-Tier]

vs.

Leaderboard Row (Every App Has This)
────────────────────────────────────
#1  @username  [S][A][A][B][B]  1,500 pts
```

The formation grid is:
- **Spatially unique** — No other fantasy app uses a grid-based formation view
- **Intuitively clear** — A child understands "this person is the captain, these are the players"
- **Tactile on mobile** — Feels good to build a team by dragging into positions
- **Memorable** — CT users screenshot their formations and share them (proof of skill)

**Where Formation Appears (Brand Touchpoints):**

1. **Draft page** (primary) — Large, central, drag-and-drop enabled
2. **Team card** (shareable) — Smaller version for X/Discord shares
3. **Profile page** — Compact version showing your current team(s)
4. **Contest detail** — Shows your locked formation with final scores
5. **Leaderboard** (hover state) — Quick preview of top player's formation

**Visual Treatment of Formation:**

- **Tier badges** are colored: S=gold, A=cyan, B=emerald, C=gray
- **Captain slot** is 1.5x scale, highlighted with gold glow
- **Empty slots** are subtle (light gray outline), not prominent
- **Avatar images** appear inside each slot (no names visible until hover)
- **Background is flat dark** (not gradient, not illustration)
- **On hover, position highlights** (gold border pulse, not background change)

**Why This Matters:**

Formation grid is the visual anchor that makes Foresight feel *different* from Hyperliquid (all numbers) and from DraftKings (all lists). It's the one thing only Foresight can claim as visual identity.

**DO NOT:**
- Make the formation flashy with animations
- Add decorative background to formation grid
- Use the formation as a "hero animation" on landing page
- Treat formation as secondary to leaderboard

**DO:**
- Keep formation as the primary affordance on Draft page
- Make formation the feature in every "how it works" explanation
- Use formation in all marketing materials (it's our differentiator)
- Ensure formation works perfectly at mobile 375px (small grid, stacked on smaller screens)

---

### 3. THE COLOR SYSTEM (Gold + Dark + What Replaces Neon Glow)

**ANSWER: 60-30-10 Rule. Gold Primary. Cyan Secondary. Emerald Tertiary. NO Neon Glow.**

**The System:**

```
60% — Neutral Backgrounds (Dark)
  #09090B (main background, nearly black)
  #111111 (cards, slightly lighter)
  #1A1A1F (hover state, very subtle)
  #27272A (all borders)

30% — Secondary Text & Accents
  #FAFAFA (primary text, off-white)
  #A1A1AA (secondary text, gray-400)
  #71717A (muted text, gray-600)

10% — Primary Accent (Gold Only on Page)
  #F59E0B (gold, primary CTA only)
  #FBBF24 (gold-400, hover state)
  #D97706 (gold-600, disabled state)
```

**Accent Colors (Use These Semantically):**

| Color | Meaning | Where |
|-------|---------|-------|
| **Gold #F59E0B** | #1 / Winner / Primary action | Captain slot, "Join Contest" button, rank #1 medal |
| **Cyan #06B6D4** | #2 / On-chain / Secondary | Rank #2 medal, Tapestry verification dot |
| **Emerald #10B981** | #3 / Success / Free contests | Rank #3 medal, "Free entry" badge, positive confirmation |
| **Rose #F43F5E** | Error / Danger | Only on hover for destructive actions (unfollow, delete) |

**What Replaces the "Neon Glow":**

Old approach: Neon glows (`0 0 20px rgba(16, 249, 129, 0.6)`) signaled "real-time" updates.

**New approach: Subtle gold glow + flash animation** (200ms, not pulsing)

```css
/* Score Update Animation (Leaderboard Refresh) */
@keyframes scoreFlash {
  0% { background-color: transparent; }
  50% { background-color: rgba(245, 158, 11, 0.15); }  /* Soft gold highlight */
  100% { background-color: transparent; }
}

.score-updated {
  animation: scoreFlash 200ms ease-out;
}
```

**Why this works:**
- Gold is already our primary brand color, so it reads as "something happened, it's important"
- 200ms flash is snappy (like trading terminals), not smooth (like meditation apps)
- Subtle glow (0.15 opacity) informs without screaming
- No pulsing or looping — flash occurs once per score update

**Live Indicator (The Exception to "One Gold CTA"):**

Real-time states need a visual signal. Use this pattern:

```jsx
<span className="inline-flex items-center gap-1">
  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
  <span className="text-gray-400">Live</span>
</span>
```

- **Dot color:** Emerald (success/alive)
- **Animation:** Pulse (0.5s), not glow
- **Label:** Gray text "Live", not neon
- **Used sparingly:** Only on active contests/leaderboards, not everywhere

**DO NOT:**
- Add a 5th accent color because "it would look cool"
- Use gradient backgrounds on cards (gradients live in small icons only)
- Mix gold + cyan on the same CTA (one color per button)
- Use purple or violet anywhere (it reads as "AI slop")
- Make the glow intense — subtlety is the goal

---

### 4. TYPOGRAPHY: Authority + Data-Density for CT Users

**ANSWER: 3 Fonts. 6 Sizes. Monospace Everything Numeric.**

**Font Stack (Non-negotiable):**

```css
--font-display: 'Plus Jakarta Sans', system-ui;  /* Bold headers only */
--font-body: 'Inter', system-ui;                 /* All UI text */
--font-mono: 'JetBrains Mono', monospace;        /* All numbers, IDs, addresses */
```

**Why These 3:**
- **Plus Jakarta Sans** — Modern sans-serif with personality. Bold weight (700) for headers makes them stand out without being decorative. Used sparingly (page titles, stat labels only)
- **Inter** — The standard for modern UI. Neutral, readable, proven at every size. Used for 95% of text
- **JetBrains Mono** — The trader's font. Uniform character width makes numbers align properly. Creates the "terminal" feel

**The 6 Sizes (REDUCE FROM CURRENT 12):**

| Name | Font | Size | Weight | Usage | Example |
|------|------|------|--------|-------|---------|
| **Display** | Plus Jakarta Sans | 32px | 700 | Page titles, hero numbers | "Top 50 Competitors" |
| **H2** | Inter | 24px | 600 | Section headers | "This Week's Contests" |
| **H3** | Inter | 18px | 600 | Card headers, form labels | "Choose Your Captain" |
| **Body** | Inter | 16px | 400 | Paragraph text, leaderboard rows | "Join 2,500 other players" |
| **Body-sm** | Inter | 14px | 400 | Secondary info, timestamps | "Starts in 2 days" |
| **Caption** | Inter | 12px | 500 | Metadata, hints, microcopy | "Top 12% of players" |
| **Mono** | JetBrains Mono | 13px | 400 | All scores, ranks, IDs, wallet addresses | `1,250  |  #43  |  0x7a...` |

**Monospace Rule (Non-negotiable):**

Every number in the app must be in monospace. This includes:
- Scores and points
- Rank numbers (#1, #2, #43)
- Dollar amounts ($0.50, $1,200)
- Percentages (12%, 0.5%)
- Wallet addresses (0x7a...)
- Timestamps (2h 30m remaining)
- Team budget remaining (45/150)

**Why:** Monospace makes numbers scannable and professional. It's how traders read data. Non-monospace numbers look soft and casual.

**Hierarchy (How CT Users Scan):**

Crypto Twitter users scan like traders:
1. **Look at the number first** (score, rank, change)
2. **Then the name** (who is this?)
3. **Then metadata** (tier, badges, timestamp)

Structure every row/card to reflect this:

```
LEADERBOARD ROW (Correct Order)
┌─────────────────────────────────────┐
│ 43   @username    1,250   ↑50    S  │
│      (name)       (score) (change) (tier) │
│ [Follow]                    [Info]   │
└─────────────────────────────────────┘

WRONG ORDER (Don't Do This)
┌─────────────────────────────────────┐
│ 👤 @username (S-Tier)               │
│ Rank: 43 | Score: 1,250 | +50 pts   │
│ [Follow] [Share] [Info]             │
└─────────────────────────────────────┘
```

**DO NOT:**
- Use more than 6 sizes (no `text-xs`, `text-2xl`, `text-4xl` classes — use fixed sizes)
- Mix fonts within a single line (one font per component)
- Use anything smaller than 12px caption (accessibility fail)
- Use anything larger than 32px for body content (use 32px only for page titles)

---

### 5. THE ONE DESIGN PRINCIPLE (The Law)

**ANSWER: "Color in Content, Not Chrome"**

This single principle governs every decision.

**Definition:**

UI chrome (card borders, backgrounds, buttons, dividers) should be **dark and quiet**. Color belongs on **things that mean something** — scores, rank medals, tier badges, status indicators.

This creates natural hierarchy: your eye goes to color, so color only marks what matters.

**The Principle in Action:**

```
WRONG (Color in Chrome)
┌─────────────────────────────────────┐
│ [Gold Border] ← Color here is noise  │
│ ┌───────────────────────────────┐   │
│ │ @username                     │   │
│ │ Score: 1,250 [Cyan Button]    │   │
│ │ [Gold Button] [Cyan Button]   │   │
│ └───────────────────────────────┘   │
└─────────────────────────────────────┘

CORRECT (Color in Content)
┌─────────────────────────────────────┐
│ 43  @username  [Gold 1,250]  [S-tier] │
│                (color marks score)    │
│ [Gray Border] (chrome is quiet)       │
│ [Follow] [Info]  (ghost buttons)      │
└─────────────────────────────────────┘
```

**The 4 Sub-Rules:**

1. **Chrome is always gray (#27272A borders, #111111 backgrounds)**
   - Card borders: gray-700 or gray-800, never colored
   - Card backgrounds: #111111 (slightly elevated), never gradient
   - Dividers: gray-700, never bright

2. **Color appears only on semantic elements**
   - Badges (tier: S=gold, A=cyan, B=emerald, C=gray)
   - Icons that mean something (crown for #1, medal for #2-3)
   - One primary CTA per screen section (gold button)
   - Status indicators (live dot in emerald, error in rose)

3. **Repeated actions are ghost-styled (no border, no background by default)**
   - If an action appears on every row (follow, like, more menu), it must be borderless gray text
   - Only show border/background on hover
   - Exception: Primary CTA appears once per page section in gold

4. **Destructive actions are hidden until hover**
   - "Unfollow" doesn't appear on the button by default
   - Shows as gray text, becomes rose/red on hover only
   - Ambient UI state is always positive and encouraging

**Before Every Design Decision, Ask:**

- *Is this chrome or content?* (Chrome=gray, Content=can be gold)
- *Does every row in a list have this element?* (Yes=ghost style, No=can be stronger)
- *Could a user understand this without color?* (No=fix it with typography or icon)
- *Is this the only colored element on the screen?* (No=audit the page, too many colors)

**Breaking This Principle = Automatic Reject**

If code review finds:
- Gold borders on card chrome ❌
- Cyan background on buttons that repeat ❌
- Gradient backgrounds on content cards ❌
- More than 2 colored CTAs visible on one screen section ❌

...the PR doesn't ship.

---

### 6. WHAT TO REMOVE IMMEDIATELY (AI Slop Patterns)

**ANSWER: Delete these 7 patterns today**

Current design has acquired some generic SaaS debt. These patterns are killing the "Foresight-ness" and need to disappear:

**PATTERN 1: Excessive Glow Effects**

Status: **Remove 80% of glows**

Problem: Current design uses neon green glows (`shadow-glow-neon`) on too many elements. This feels like a 2018 gaming site, not a 2026 trading terminal.

What to delete:
- `shadow-glow-neon-intense` class — never use
- Pulsing neon animations on leaderboard scores
- Green glow on "live" indicators (use emerald dot + pulse instead)
- Cyan glows on secondary buttons

Keep only:
- Gold glow on primary CTA (single button on page/section)
- Gold glow on captain slot in formation
- Gold glow on achievements (very subtle, 0.2 opacity max)

**PATTERN 2: Gradient Backgrounds on Cards**

Status: **Remove all**

Problem: Cards have gradient backgrounds (`bg-gradient-to-br`, `from-emerald-900/30`). This is decorative noise.

What to delete:
- Contest cards with gradient left-borders
- ContestDetail header with gradient background
- Any card with `from-*` or `to-*` gradients

Replace with:
- Flat `bg-gray-800` or `bg-gray-900/50`
- Gray borders only
- If card needs visual emphasis, use `border-gold-500/30` (not gradient)

**PATTERN 3: Neon Green as Primary Signal**

Status: **Demote neon green**

Problem: `#10F981` neon green is used for "real-time" indicators, but it's too bright and conflicts with our primary color system.

What to delete:
- `neon` color class (replace with `emerald`)
- Neon green animations for score updates
- Neon green "Live" pulsing text

Replace with:
- Emerald green `#10B981` for success/alive states
- Gold flash animation for score updates (not green pulse)
- Gray text "Live" with emerald dot (not neon text)

**PATTERN 4: Long Rounded Buttons**

Status: **Use standard width buttons**

Problem: Current buttons stretch full-width or are extra-wide (`px-6 py-3`), creating visual noise on every row.

What to delete:
- Full-width buttons on leaderboard rows (follow, info, etc.)
- Extra-tall padding on repeated action buttons (`py-3`)
- Buttons that wrap text onto multiple lines

Replace with:
- Icon-only buttons for leaderboard actions (follow icon, info icon)
- If text button required: `px-3 py-1.5` (small, compact)
- Flexible width based on content, not stretched

**PATTERN 5: Multiple Colored CTA Buttons on One Screen**

Status: **Enforce one gold CTA per context**

Problem: Some pages have 2-3 gold buttons visible at once, diluting the primary action.

What to delete:
- More than one `btn-primary` (gold background) visible on a page section
- Multiple gold buttons competing for attention
- Cyan buttons (`btn-cyan`) next to gold buttons (pick one!)

Example fix:
```
WRONG:
[Gold "Join Contest"] [Gold "Create Team"] [Cyan "Learn More"]
     ↑ Three CTAs fighting

CORRECT:
[Gold "Join Contest"]
[Gray Secondary button]
[Ghost tertiary link]
```

**PATTERN 6: Hover-Only Information**

Status: **Eliminate all hover-only states on mobile**

Problem: Some content only appears on hover (works on desktop, breaks on mobile).

What to delete:
- Follow button text that appears only on hover
- Formation grid labels only visible on hover
- Any affordance that requires hover to discover

Replace with:
- All necessary info visible by default
- Hover adds secondary info (stats, details)
- Mobile tap shows popover/bottom sheet instead

**PATTERN 7: Confetti, Toast Spam, and Celebration Animations**

Status: **Delete entirely**

Problem: Any gamified celebration patterns (confetti animations, "You won!" toasts, celebration sounds) violate our positioning.

What to delete:
- Confetti on contest win
- Automatic toast notifications for every score change
- Celebration animations on achievement unlock
- Any "🎉🎉🎉" energy

Replace with:
- Quiet toast: "You finished in Top 8%"
- Simple stat update (score flashes, then steady)
- Respectful notification copy (no manipulation)

**Summary of What to Remove:**

| Pattern | Current State | New State | Rationale |
|---------|---------------|-----------|-----------|
| Glow effects | Excessive (20+ uses) | Minimal (3-5 uses) | Professional ≠ flashy |
| Gradient cards | Several uses | Zero (use flat + border) | Gradient = decorative |
| Neon green | Primary signal | Demoted to emerald | Conflicts with gold system |
| Button size | Wide, tall (py-3) | Compact (py-1.5) | Reduce visual noise |
| CTAs per screen | 2-3 gold buttons | 1 gold CTA max | Clear hierarchy |
| Hover-only content | Several elements | None on mobile | Must work with tap |
| Celebration patterns | Confetti, toast spam | Respectful notifications | Positions app as serious |

---

### 7. THREE REFERENCE PRODUCTS (NOT CRYPTO)

**ANSWER: Hyperliquid (Precision). Linear (Polish). Axiom (Speed).**

**Why not other crypto apps?** Because every crypto app copies DraftKings' "make it colorful" approach. We need to look outside crypto to find restraint.

---

#### REFERENCE 1: HYPERLIQUID

**Focus:** Precision, monospace data, real-time updates
**Why this one?** Hyperliquid is what CT traders use 8 hours a day. It sets the standard for "what professional looks like" in crypto.

**What to study:**

1. **Data density**
   - Leaderboard shows 20+ rows at once (no pagination)
   - Every row fits: Rank | Username | Position | Leverage | P&L | Open | Recent
   - Numbers are monospace (JetBrains Mono equivalent)
   - Information density: 15 data points visible, none are decorative

2. **Dark theme execution**
   - Background: Deep dark, almost black (#0f0f0f equivalent)
   - Cards: Slightly elevated (#1a1a1a)
   - Borders: Gray only, never bright
   - Text: Off-white (#fafafa), secondary gray (#a0a0a0)
   - Accent: Indigo/blue for interactive, not gold (but principle is same: one color max)

3. **Real-time update animations**
   - Score change shows brief flash (150-200ms)
   - No pulsing or looping
   - Flash color matches the semantic meaning (green for +, red for -)
   - Animation fades quickly, doesn't linger

4. **No decoration**
   - Zero gradients on cards
   - Zero illustrations or decorative icons
   - Zero emoji or playful language
   - Everything is utilitarian

5. **Typography**
   - Headers are bold but not oversized
   - Body text is 14px, readable without strain
   - Monospace for all numbers (no exceptions)
   - 4-5 type sizes max

**How Foresight applies this:**
- Copy Hyperliquid's monospace approach for scores/ranks
- Use Hyperliquid's real-time update flash (brief, not looping)
- Match Hyperliquid's dark theme severity (not friendly, not corporate)
- Adopt Hyperliquid's data density (leaderboard = 20 rows, contest rules = one screen)

**Design artifact to study:**
- Hyperliquid leaderboard page (screenshot and annotate)
- Hyperliquid trade history page (note the table format, spacing)
- Hyperliquid funding rates page (example of data tables done right)

---

#### REFERENCE 2: LINEAR

**Focus:** Polish, consistency, micro-interactions
**Why this one?** Linear is the design standard for "serious SaaS built for power users." Zero AI slop, zero corporate feel, maximum craft.

**What to study:**

1. **Component consistency**
   - Every button, input, card follows the same pattern
   - Padding, spacing, border radius are always 8px or 4px (never 7px, never 3px)
   - Typography scale is minimal (6-8 sizes max)
   - Icons are from one system (Phosphor, not 5 different icon packs)

2. **Dark theme taste**
   - Background: #09090b (pure near-black, not gray)
   - Card elevation: #111111 (minimal difference from bg)
   - Borders: #27272a (true gray, not colored)
   - Accent: Single color (gold/amber for Linear), used sparingly

3. **Micro-interactions**
   - Hover states reveal information (button border appears, background shifts)
   - No animations over 300ms (Linear's interaction feel is snappy)
   - Click feedback is tactile (scale 0.98 for button press)
   - Focus states are clear but minimal (ring only, no bright glow)

4. **Copy and tone**
   - No exclamation points
   - No emoji
   - Action-oriented verbs ("Archive", "Create", "Delete")
   - Respectful of user intelligence (no over-explanation)

5. **Density with breathing room**
   - Linear packs information densely (sidebar + main + details)
   - But doesn't feel cramped because of intentional spacing
   - Uses 8px, 16px, 24px gaps (never random)
   - Whitespace is a feature, not filler

**How Foresight applies this:**
- Copy Linear's component consistency (every button looks like every other button)
- Match Linear's micro-interaction polish (hover reveals, not repaints)
- Use Linear's color discipline (one accent color, used sparingly)
- Adopt Linear's copy tone (no emoji, respectful, action-oriented)

**Design artifact to study:**
- Linear's page list (components: search, filter buttons, item rows)
- Linear's modal (component: title, description, action buttons)
- Linear's button states (default, hover, active, disabled)

---

#### REFERENCE 3: AXIOM

**Focus:** Speed, terminal aesthetic, neon signaling
**Why this one?** Axiom is Solana's fastest, most Solana-native dex. It uses the "terminal" aesthetic harder than anyone. Also, CT-native (vs. Linear which is general SaaS).

**What to study:**

1. **Terminal aesthetic**
   - Everything is monospace (data, labels, even some UI text)
   - Layout reads like a command line (left sidebar = inputs, right = outputs)
   - No curves (everything is sharp, 90-degree angles)
   - Color is signal-only (neon green = live, red = error, white = neutral)

2. **Animation discipline**
   - Animations are 100ms (faster than Hyperliquid's 150ms)
   - Creates feeling of "snappiness" and "speed"
   - Only animate on user input (no auto-playing animations)
   - Easing is sharp (cubic-bezier 0.4 0 0.2 1, no ease-in-out)

3. **Color usage**
   - Neon green (#00ff00 or close) for "live/active" states
   - White for text and primary actions
   - Red for errors
   - Everything else is black or dark gray
   - Never more than 3 colors on screen

4. **Typography**
   - Monospace is dominant (Courier New, or modern equivalent like Inconsolata)
   - Headers are bold monospace (not different font)
   - All numbers are monospace (obviously)
   - Text is dense, no large whitespace

5. **No decoration**
   - Zero gradients
   - Zero shadows (use borders for elevation instead)
   - Zero rounded corners (edges are sharp)
   - Zero emoji or playful language

**How Foresight applies this:**
- Use 100-150ms animation timing (faster than most apps)
- Commit to monospace for all numbers and important data
- Use sharp easing curves (not smooth, ease-out-heavy)
- Limit color palette to 3-4 colors max (gold, cyan, emerald, gray)

**Design artifact to study:**
- Axiom's swap interface (layout, monospace typography, neon signals)
- Axiom's positions page (real-time updates, animation timing)
- Axiom's order history (table format, data density)

---

## SYNTHESIS: How These 3 References Inform Foresight

| Principle | Hyperliquid | Linear | Axiom | Foresight Should |
|-----------|-------------|--------|-------|------------------|
| **Data density** | 20+ rows visible | Medium density | High density | Follow Hyperliquid (20 rows on leaderboard) |
| **Theme** | Deep dark | Deep dark | Deep dark | Deep dark (#09090B) |
| **Animation speed** | 150-200ms | 200-300ms | 100ms | 150-200ms (between Hyperliquid and Axiom) |
| **Accent color** | Indigo | Amber | Neon green | Gold (our choice, not copying) |
| **Monospace usage** | All numbers | Sparingly | Everything | All numbers + stats |
| **Decoration** | Zero | Zero | Zero | Zero |
| **Polish** | High (mature) | Highest (craft) | High (speed-focused) | Highest (Linear-level polish + Hyperliquid data density) |
| **Tone** | Professional | Respectful | Urgent | Professional + Respectful |

**The Ideal:** Hyperliquid's data handling + Linear's polish + Axiom's animation speed + Foresight's formation grid = Unbeatable

---

## FINAL WORD: WHAT SUCCESS LOOKS LIKE

**Success metrics for visual design:**

1. **CT users look at Foresight and say:** "This was built by people who understand trading terminals"
2. **A designer sees Foresight and says:** "This is the most restrained version of gold-on-dark I've ever seen"
3. **A user opens Foresight and says:** "I can understand what I'm seeing instantly"
4. **A competitor sees Foresight and says:** "Damn, they didn't add a single unnecessary color"

**Failure metrics (turn back if you see these):**

- More than 4 colors visible on any page section
- Any animation longer than 300ms
- Any button with gradient background
- Any card with decorative background pattern
- Any element that's only visible on hover (on mobile)
- Neon green glowing on multiple elements
- Text that's smaller than 12px or larger than 32px for body content
- Any emoji in UI text (Phosphor icons only)
- Whitespace that makes data feel sparse

---

## IMPLEMENTATION CHECKLIST (For Designers & Engineers)

Before shipping ANY page/feature:

- [ ] Formation grid visible and testable (if applicable)
- [ ] All numbers are monospace (JetBrains Mono)
- [ ] Only ONE gold CTA visible per screen section
- [ ] No gradient backgrounds on cards
- [ ] Dark backgrounds verified on real phone in dark room
- [ ] Mobile layout works at 375px without overflow
- [ ] All animations are 200ms or less
- [ ] Repeated action buttons are ghost-styled (no border by default)
- [ ] No hover-only information on mobile
- [ ] No neon green glows (use emerald dot + pulse or gold flash)
- [ ] No emoji in copy (use Phosphor icons)
- [ ] Compared visually to Hyperliquid (data density check)
- [ ] Compared visually to Linear (polish check)
- [ ] Compared visually to Axiom (speed check)

---

## CLOSING

Foresight is the product for people who understand that **skill matters more than luck, transparency matters more than hype, and professional design matters more than flashy design**.

Every visual decision should answer one question: *Would this appear on a professional trading dashboard?*

If the answer is "no," delete it.

That's the law.

---

**Last Updated:** February 27, 2026
**Status:** Approved & Shipped
**Next Review:** After Phase 1 implementation (March 15, 2026)
