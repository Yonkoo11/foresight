# Profile Share Card Design Analysis
## From "UI Widget" to "Covetable Artifact"

> **Status:** Design Research + Strategic Recommendations
> **Date:** February 26, 2026
> **Context:** Foresight profile cards lack "human touch" and aren't genuinely shareable in CT culture

---

## Executive Summary

The current profile card has a **critical design weakness from a crypto-native perspective**: it looks like a **player card** when it should feel like a **trophy**. In CT culture, sharing isn't about broadcast—it's about *proof of status*. The card must make the viewer *feel FOMO*, not just inform them of a score.

**Key insight:** Sorare, Gods Unchained, and Axie don't just display stats. They create **desire objects**. The rarest card in your collection isn't something you *use*—it's something you *display*.

**What's missing:** Rarity signaling, edge case celebrations, on-chain proof, authenticity markers that CT culture trusts.

---

## What Makes Crypto-Native Cards Covetable

### 1. Rarity Creates FOMO
Sorare's card system works because **not all cards look the same**. Common cards are clean and simple. Rare cards are visually *more beautiful*—they use metallics, foils, layered borders, and animation that standard cards don't. When you scroll past someone's DIAMOND card next to a BRONZE, you *feel* the difference.

**Current problem:** All tiers (SILVER, GOLD, PLATINUM) use the same card template. A DIAMOND tier card looks 95% identical to BRONZE. There's no visual *separation* between tiers that creates status signaling.

### 2. Edge Cases Are Celebration Moments
Gods Unchained's rarest cards (mythics, legendaries) have completely different layouts. Parallel and Illuvium do the same—your Tier S card should feel categorically different from Tier C.

**Current problem:** The card is template-driven. Same layout, different colors. No visual hierarchy based on rarity.

### 3. On-Chain Proof Is Authenticity
Blur shows Solana chain confirmation. Phantom displays "verified" badges. Magic Eden shows "floor price" for rarity context. These aren't just UI—they're **trust signals** that prove the claim is real.

**Current problem:** "Tapestry · Solana verified" is a text footnote in `#2A2A30` (barely visible). It's not visually prominent or integrated into the identity of the card.

### 4. CT Culture Values Transparency + Authenticity
CT users are skeptical. They want to see:
- **Proof of play:** When did this team get drafted? How many contests?
- **Consistency over time:** All-time rank, not just season rank (proves it's not a fluke)
- **Chain-backed data:** Signed by Tapestry, not just a database claim
- **Earned status:** Multiplier badges should show WHY (founding member? early adoption? consistent performance?)

**Current problem:** Card shows stats but no *context* for earning them. Founding Member #18 is cool, but what percentage of users are founders? Should be: "Founding Member #18 / 500 (Top 3.6%)" to create status signal.

### 5. Trading Card Games Use Rarity Borders + Frames
Sorare uses **beveled borders** and **metallic frames** for rare cards. Gods Unchained uses **glowing borders** and **specialty backgrounds**. Axie has **gradient borders** and **shimmer effects**.

**Current problem:** Dark border on all tiers. No rarity framing.

---

## The Crypto-Native Card Hierarchy

Here's how rarity systems *should* feel:

```
BRONZE (Common):
  Layout:   Simple, clean, text-based
  Border:   Single gray line
  Avatar:   Subtle glow
  Feel:     "Getting started"

SILVER (Uncommon):
  Layout:   Same, but with subtle gradient background
  Border:   Dual-tone border
  Avatar:   Slightly larger glow
  Feel:     "I'm in the game"

GOLD (Rare):
  Layout:   Still same, but accent bar gains visual weight
  Border:   Metallic-look border (darker gold with highlight)
  Avatar:   Prominent colored glow
  Feel:     "I'm winning"

PLATINUM (Epic):
  Layout:   DIFFERENT — top accent becomes full header bar
  Border:   Dual-color border (cyan + darker shadow)
  Avatar:   Larger, more dramatic glow
  Stats:    Slightly larger, more prominent
  Feel:     "I'm elite"

DIAMOND (Legendary):
  Layout:   COMPLETELY DIFFERENT — centered composition, larger avatar
  Border:   Multi-layer frame (inner gold, outer dark, beveled effect)
  Avatar:   HUGE (120px+), multi-ring glow
  Stats:    Prominent hero display, gold shine effect
  Extra:    "Crown" or "Legendary" badge
  Feel:     "I'm the 1%"
```

The key: **Tiers C/B/A are variations. Tier S (DIAMOND) is a *different card type entirely*.**

---

## The Core Problem: Player Card vs. Trophy

**PLAYER CARD** (Current design):
- Shows stats
- Displays tier
- Proves participation
- "Here's what I earned"
- Works for internal dashboards

**TROPHY** (What CT needs):
- Creates desire
- Displays rarity explicitly
- Proves rarity/status
- "You can't have this, I earned it"
- Works for Twitter/X sharing

Currently, Foresight's card is a **player card**. We need to shift it toward a **trophy**.

---

# 3 Design Directions

## Direction 1: "LUXURY COLLECTIBLE" — The Gods Unchained Approach

### Visual Concept
A **metallurgic trading card** that feels like something from a premium CCG. The card uses layered borders, a metallic frame, and jewelry-like design elements. Avatar sits in a spotlight with a beveled border. The tier system creates *visual separation*.

### Rarity Expression
- **BRONZE/SILVER:** Flat borders, simple aesthetic
- **GOLD:** Subtle gradient, warm metallic feel
- **PLATINUM:** Dual-color border (cyan), larger avatar zone
- **DIAMOND:** Full transformation — gold beveled frame, multi-ring avatar border, "LEGENDARY" badge, larger hero stats with a small crown accent

### "Earned, Not Given"
The card includes:
- **"Founding Member #18 of 500"** — shows rarity context
- **"Joined: Feb 12, 2026"** — proof of early adoption
- **"72-day streak"** — consistency signal
- **Multiplier reason:** "Founding Member Bonus 1.58x" (explains the achievement)

### On-Chain Integration
- **Tapestry Protocol logo** becomes a **verified badge** (40×40px, cyan ring, positioned top-right)
- Adds small chain icon + transaction hash (last 6 chars) — `0xA3F2B1...`
- Footer reads: "Sealed on Solana | ID: FST-000018"

### CSS/Canvas Details
```
DIAMOND tier:
- Outer border: 4px, gradient gold (#F59E0B → #FBBF24 → #D97706)
- Beveled effect: inset shadow on top-left, dark shadow bottom-right
- Inner padding: 2px dark background
- Avatar: 130px circle with triple ring (gold outer, dark middle, gold inner)
- Avatar glow: 3 concentric glows (gold, yellow, fading)
- Stats background: gradient from gold-500/5 to transparent
- "LEGENDARY" badge: gold background, dark text, positioned above avatar
- Overall feel: "You pulled the rare card"
```

### Why This Works for CT
- **Signals wealth** (the card itself is valuable)
- **Shows consistency** (join date + streak prove it's not luck)
- **Creates status** (explicit percentile ranking)
- **Feels earned** (multiplier justification)
- **Looks premium** (jewelry-like framing)

### Risk
- Over-designed for lower tiers (BRONZE looks cheap)
- Complex rendering → longer load times
- Might feel "too gamer-y" for CT's sophistication

---

## Direction 2: "FINANCE STATEMENT" — The Phantom Wallet Approach

### Visual Concept
A **verified financial certificate** that looks like a Phantom/Rainbow wallet collectible. Minimalist, clean, with heavy on-chain branding and verification marks. The design emphasizes authenticity over flashiness—like a bank statement that proves you own something valuable.

### Rarity Expression
- **All tiers same layout**, but rarity expressed through:
  - **Color of the verification seal** (bronze, silver, gold, cyan, diamond)
  - **Tier badge size and prominence** (bigger as rarity increases)
  - **Multiplier display** (only appears for GOLD+)
  - **Achievement badges** (tiny icons for "Founding Member", "Early Adopter", etc.)

### "Earned, Not Given"
The card includes:
- **"Verified Holder"** — prominent badge top-right
- **"Member Since: Feb 12, 2026"** — proof of early adoption
- **"Score Stability: +12% vs. peers"** — contextual achievement
- **Breakdown:** Shows score composition (Activity: 450, Engagement: 1,200, Growth: 800, Viral: 125 = 2,575 total)

### On-Chain Integration
- **Central Tapestry verified badge** (60×60px) — glowing cyan ring, Solana logo inside
- **Blockchain row:** "Tapestry ID: 0xA3F2B1C9D8E7... | Sealed: Feb 25, 2026 14:32 UTC"
- QR code (corner) links to on-chain proof
- "View on-chain" link in footer

### CSS/Canvas Details
```
Universal template with tier-based accents:
- Base: Dark background with single gray border
- Top: Horizontal verification bar (tier color, 100% width, 2px height)
- Header: Branding row with Tapestry logo + "FORESIGHT VERIFICATION"
- Avatar: 80px, no glow, clean tier-colored ring
- Stats: Two-column grid with clear labels
- Verification row: Tier symbol + "Verified" + checkmark
- Footer: "Tapestry Protocol" + transaction ID + timestamp
- Hover effect: Subtle blue glow on Tapestry badge
```

### Why This Works for CT
- **Looks official** (like a certificate)
- **Emphasizes transparency** (breakdown of score, on-chain ID)
- **Doesn't scream "gaming"** (appeals to CT's pseudo-sophistication)
- **Minimal, sophisticated** (fits crypto culture's "less is more" aesthetic)
- **Proof is the hero** (not the stats)

### Risk
- Might feel too boring/corporate
- Less celebratory (good for consistency, bad for excitement)
- Breakdown of score might expose flaws in the system

---

## Direction 3: "STAT SHOWCASE" — The FTX Trading Card Approach

### Visual Concept
A **performance artifact** designed like a FTX/Blur trading card—bold typography, stat-forward layout, and a striking visual hierarchy. The card is a **leaderboard extract**: instead of showing one person's stats, it shows comparative metrics that prove dominance.

### Rarity Expression
- **BRONZE/SILVER:** Simple rank display
- **GOLD:** Adds percentile badge ("Top 8%")
- **PLATINUM:** Adds comparative metrics ("vs. average player: +340% score")
- **DIAMOND:** Full transformation — adds:
  - Detailed breakdown (Activity, Engagement, Growth, Viral)
  - Season-over-season trend (arrow + % change)
  - "Leaderboard position" visual (horizontal bar showing rank range)
  - Top achievement highlight

### "Earned, Not Given"
The card includes:
- **"#47 / 1,250 Season Leaders"** — explicit competitive ranking
- **"Win Rate: 67% (9W, 4L)"** — proof of skill, not luck
- **"Peak Rank: #12"** — consistency across contests
- **"Score Volatility: STEADY"** — proves it's not a fluke

### On-Chain Integration
- **Tapestry badge becomes "On-Chain Stats"** row
- Shows: "Score stored on Solana | Last update: 2m ago"
- Includes live poll indicator ("Updates every 30 seconds from Tapestry")
- "View full history" link to on-chain dashboard

### CSS/Canvas Details
```
Three-tier layout:
- Top third: Avatar + name + rank (bold, aggressive typography)
- Middle third: Score breakdown (4 columns: Activity | Engagement | Growth | Viral)
  - Each shows current + trend (arrow + %)
- Bottom third: Leaderboard context
  - Horizontal bar showing rank position visually
  - "47 of 1,250" with percentile
  - "Season leader: 1st place | +2,890 pts"

Color scheme:
- Score columns use tier color (gold for primary, muted for secondary)
- Trend arrows: green up, red down (but muted, not bright)
- Leaderboard bar: gradient from tier color to dark

Typography:
- Rank: Extra large, bold (54px)
- Score: Large, gold (#F59E0B, bold)
- Breakdown: Medium, clean (18px per stat)
- Trend: Small, muted (12px)
```

### Why This Works for CT
- **Shows dominance** (leaderboard context is competitive proof)
- **Transparent metrics** (breakdown shows how score was earned)
- **Trend-focused** (proves consistency, not flukes)
- **Live feeling** (on-chain updates every 30 seconds)
- **Actionable** (viewer can see their own position vs. this card holder)

### Risk
- Might intimidate lower-ranked players (negative share vibes)
- Requires live data (backend dependency)
- Stat breakdowns could be confusing to new users

---

## Comparison Matrix

| Dimension | Direction 1 (Luxury) | Direction 2 (Finance) | Direction 3 (Stat) |
|-----------|-----|-----|-----|
| **Rarity Signal** | Visual hierarchy (layout changes) | Color + badge size | Leaderboard rank |
| **Covetability** | HIGH (looks valuable) | MEDIUM (looks trustworthy) | HIGH (shows dominance) |
| **CT Appeal** | Gamer aesthetic (maybe too much) | Professional/boring | Competitive/flex |
| **Shareability** | "Look at my rare card!" | "I'm verified" | "I'm top ranked!" |
| **Rendering Complexity** | HIGH (bevels, glows, multi-layer) | MEDIUM (mostly text) | MEDIUM (bars + trends) |
| **Mobile-Friendly** | MEDIUM (tight spacing) | HIGH (clean, scalable) | MEDIUM (columns compress) |
| **On-Chain Integration** | Minimal (just badge) | Central (certificate feel) | Live (real-time updates) |
| **Celebrating Failure** | Poor (rare cards only) | Neutral (all feel same) | Honest (shows rank context) |

---

## The Single Most Important Thing Missing

**The current card lacks a clear reason to feel proud about sharing it.**

It shows stats, but not *context*. A player with 2,575 points might be:
- The 47th best player (top 4%) — **FLEX WORTHY**
- The 1,200th best player (bottom 10%) — **NOT FLEX WORTHY**

**The card doesn't signal rarity explicitly.** When your friend shares a card, you don't immediately know if they're elite or average.

**Solution:** All three directions solve this by making rarity visual and contextual. Direction 1 through layout transformation, Direction 2 through verification design, Direction 3 through leaderboard placement.

---

## PLAYER vs. TROPHY: The Fundamental Shift

### Current (PLAYER CARD)
```
"My Stats"
Score: 2,575
Tier: SILVER
Season Rank: #473

→ Message: "Here's what I earned"
→ Reaction: "Cool, you play too"
→ Share Vibe: Informational
```

### Desired (TROPHY)
```
"My Achievement"
#47 of 1,250 Players (Top 4%)
Score: 2,575 (↑12% vs. peers)
Verified on Solana

→ Message: "You can't have this, I'm in the top tier"
→ Reaction: "Wow, you're crushing it"
→ Share Vibe: Status signal
```

**The shift:** From "look what I have" to "look what I achieved" to "look what I can't have."

---

## Recommendation: Direction 2 + Direction 3 Hybrid

For launch, I recommend **Direction 2 (Finance Statement) with Direction 3 (Stat Showcase) elements:**

1. **Keep the clean, professional layout** (Direction 2) — doesn't feel "gamery"
2. **Add percentile badge** (Direction 3) — "Top 4%" makes rarity clear immediately
3. **Add score breakdown** (Direction 3) — shows transparency
4. **Emphasize Tapestry verification** (Direction 2) — central badge, not footnote
5. **Include one achievement badge** (either Direction 1 or 2) — "Founding Member" or "Early Adopter"

This creates a card that CT culture would actually share:
- Professional enough for a finance person
- Competitive enough for a gamer
- Transparent enough for a builder
- Proven enough for a skeptic

### Implementation Priority
**Tier 1 (MVP):**
- Add percentile ("Top 4%") to the card
- Make Tapestry badge 3x larger and central
- Add "Founding Member #18 of 500" context

**Tier 2 (Polish):**
- Add score breakdown row
- Add join date
- Add achievement badge

**Tier 3 (Premium):**
- Implement DIAMOND tier visual transformation
- Add on-chain ID display
- Add trend indicators

---

## Next Steps

1. **Get user feedback** on which direction resonates
2. **Create visual mockups** for the top 2 directions
3. **Test with 5 CT users** — which card would you actually share?
4. **Implement MVP** (Direction 2 + Direction 3 hybrid, Tier 1 features)
5. **Screenshot and compare** before/after shareability

