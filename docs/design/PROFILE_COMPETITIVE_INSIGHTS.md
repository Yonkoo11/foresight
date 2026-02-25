# Competitive Profile Analysis — Specific Insights by App

> **Detailed teardown of how each competitive app structures their profile pages**
> **Apply these patterns to Foresight**

---

## DRAFTKINGS: "The Metric-First Model"

### Profile Structure
```
┌────────────────────────────────────────┐
│ [Avatar] Username                      │
│                                        │
│                        Total: 8,950 pts│ ← HERO: gold, right-aligned, large
│                                        │
│ Experienced Badge ⭐  |  Rank #124    │ ← Status badges
│ VIP Gold Status      |  This Season    │
│                                        │
│ [Loyalty Rewards] [My Stat Sheet]      │ ← Secondary CTAs
└────────────────────────────────────────┘

Tabs: Overview | Contests | Leaderboards | Settings
├─ This Week: +245 pts
├─ Win Rate: 58%
├─ Best Rank: #47
└─ Total Contests: 147
```

### Key Design Decisions

| Element | Implementation | Why It Works |
|---------|-----------------|---|
| **Primary Metric** | Total points (8,950) — positioned right, bold, large | Creates identity: "I am an 8,950 point player" |
| **Secondary Metric** | Rank (#124) — cyan/branded color, smaller | Provides context for competitive standing |
| **Status Badges** | Experienced ⭐, VIP Gold — visual icons | Instant credibility signals |
| **Color** | Gold for points, branded color for rank | Semantic: gold = winning/primary |
| **CTA Buttons** | Secondary actions (Rewards, Stat Sheet) | Don't compete with profile info |
| **Layout** | Avatar left, metric right | Balanced, professional |

### What To Apply to Foresight

```
✅ DO THIS:
├─ Make score (1,135) the visual hero
├─ Place it right side, gold color, large
├─ Add rank (#8) next to it in secondary color
├─ Use visual badges for status (Founder, Verified)
└─ Secondary buttons don't compete with metrics

❌ DON'T DO THIS:
├─ Make all elements equal size (they're not equal importance)
├─ Use multiple primary colors (one gold, one cyan)
└─ Bury the score in tabs
```

---

## FANDUEL: "The Status-Tier Model"

### Profile Structure
```
┌────────────────────────────────────────┐
│ [Avatar] @username                     │
│                                        │
│ Status: MVP Gold  |  Experience: ⭐⭐⭐ │ ← Tier system
│                                        │
│ This Month: +1,245 FDP                 │ ← Currency metric
│ Tier Threshold: 25,000 FDP Needed      │ ← Progress toward goal
│ [████████░░░] 60% to Platinum          │
│                                        │
│ Points Balance: 3,420 | Rewards: $124  │ ← Value metrics
│                                        │
│ Recent Contests: 12 | Wins: 5          │ ← Context
└────────────────────────────────────────┘
```

### Key Design Decisions

| Element | Implementation | Why It Works |
|---------|-----------------|---|
| **Tier System** | MVP Gold → status | Monthly reset creates recurring engagement |
| **Progress Bar** | "60% to next tier" visible | Shows clear path to improvement (motivation) |
| **Currency Metric** | FDP (points earned per $1) | Makes value tangible |
| **Star Badges** | ⭐⭐⭐ (experience level) | Visual, easy to scan |
| **Value Signals** | Rewards dollar amount shown | Motivates continued play |

### What To Apply to Foresight

```
✅ DO THIS:
├─ Show clear progression (XP to next level)
├─ Add tier badges (Silver, Gold, Platinum)
├─ Show value tied to status (perks, rewards)
└─ Use visual stars or badges for experience

❌ DON'T DO THIS:
├─ Hide progression (make it visible)
├─ Use confusing tier names
└─ Make rewards unclear
```

---

## SORARE: "The Credential + Scarcity Model"

### Profile Structure
```
PLAYER CARD (Physical Metaphor):
┌────────────────────────────────────────┐
│  ┌────────────────────────────────────┐│
│  │                                    ││
│  │    [Player Photo]                  ││ ← Rarity frame color
│  │    Cristiano Ronaldo               ││
│  │    Position: Forward               ││
│  │    Team: Al Nassr                  ││
│  │                                    ││
│  ├────────────────────────────────────┤│
│  │ Limited (1,000): 8 cards owned      ││ ← Ownership proof
│  │ Rare (100):      2 cards owned      ││
│  │ Super Rare (10): 0 cards owned      ││
│  │ Unique (1):      0 cards owned      ││
│  │                                    ││
│  │ Seasons: 2021, 2022, 2023, 2024    ││
│  │ Total Points: 3,847                ││
│  │ Best Season: 2023 (+2,104 pts)     ││
│  │                                    ││
│  │ Contract: 0x1d97...5e2c           ││ ← On-chain proof
│  │ Market Value: 0.87 ETH             ││
│  │ Last Sale: 0.92 ETH (2 weeks ago) ││
│  │                                    ││
│  │ [Edit Team] [View Teams] [Trade]   ││
│  └────────────────────────────────────┘│
└────────────────────────────────────────┘
```

### Key Design Decisions

| Element | Implementation | Why It Works |
|---------|-----------------|---|
| **Card Design** | Physical card metaphor | Feels like a collectible, precious |
| **Rarity Frame** | Colored border indicates scarcity | Visual scarcity signals value |
| **Ownership Count** | "8 Limited, 2 Rare, 0 Super Rare" | Proves active ownership |
| **Season Data** | Historical performance across seasons | Shows consistency and trajectory |
| **On-Chain Address** | Contract ID visible | Immutable proof of legitimacy |
| **Market Value** | ETH price + recent sales | Shows real economic value |

### What To Apply to Foresight

```
✅ DO THIS:
├─ Show teams as on-chain proof (Tapestry contracts)
├─ Display credential badges (Founder #18 of X)
├─ Show historical performance (past contests, streaks)
├─ Add market/social value metrics (followers, likes)
└─ Use badges for scarcity/exclusivity

❌ DON'T DO THIS:
├─ Hide on-chain data (make it visible)
├─ Treat profiles as generic (they're credentials)
└─ Bury founder/exclusive status
```

---

## REDDIT/DISCORD: "The Karma + Badge Model"

### Profile Structure
```
┌────────────────────────────────────────┐
│ [Avatar] username                      │
│                                        │
│ Karma: 1,247,342  |  Member Since 2015 │ ← Primary metric + context
│                                        │
│ Badges:                                │ ← Visual credentials
│ [🏆 Top Contributor] [💎 Premium]     │
│ [🎂 Cake Day 2015] [🌟 Award Winner]   │
│                                        │
│ Top Communities:                       │ ← Context
│ r/investing (234K), r/python (156K)    │
│                                        │
│ [Follow] [Message] [...] (actions)    │
└────────────────────────────────────────┘
```

### Key Design Decisions

| Element | Implementation | Why It Works |
|---------|-----------------|---|
| **Karma Metric** | Huge number (1,247,342) | Primary identity marker |
| **Visual Badges** | Trophy, diamond, cake, star icons | Instant credibility signals |
| **Time Context** | "Member since 2015" | Shows longevity = trust |
| **Community Ranking** | Top subreddits listed | Proves expertise in specific areas |
| **Social Actions** | Follow, Message, ...more | Easy to build relationships |

### What To Apply to Foresight

```
✅ DO THIS:
├─ Make score/rank the primary metric (like karma)
├─ Add visual badges (Founder, Verified)
├─ Show time context (early player advantage)
├─ Display top contests/teams
└─ Make follow action prominent

❌ DON'T DO THIS:
├─ Bury the primary metric
├─ Use text-only credentials
└─ Hide follower/social actions
```

---

## STEPN: "The NFT Ownership + Rarity Model"

### Profile Structure
```
┌────────────────────────────────────────┐
│ [Avatar] @username                     │
│                                        │
│ Lifetime Earnings: 1,247 SOL            │ ← Primary value metric
│ Lifetime Distance: 847 miles            │
│ Average Pace: 8:42 min/mi               │
│                                        │
│ NFT Shoes Owned: 3                      │ ← Ownership proof
│ ├─ Rare Jogger (Level 23, Power: 42)   │ ← Individual shoe stats
│ ├─ Uncommon Trainer (Level 19, Power: 38)
│ └─ Common Runner (Level 12, Power: 28)  │
│                                        │
│ Leaderboard Rank:                       │ ← Competitive standing
│ This Week: #1,247 (+45 from last week) │
│ This Month: #892                        │
│                                        │
│ [Claim Rewards] [Mint New Shoe]         │ ← Primary CTAs
└────────────────────────────────────────┘
```

### Key Design Decisions

| Element | Implementation | Why It Works |
|---------|-----------------|---|
| **Earnings Metric** | SOL earned (blockchain currency) | Tangible proof of value generation |
| **NFT Collection** | Visual display of owned shoes | Ownership = investment proof |
| **Individual Stats** | Level + power for each NFT | Granular rarity signals |
| **Leaderboard Position** | Rank + change | Competitive standing visible |
| **Mint CTA** | "Mint New Shoe" prominent | Drives continued engagement/spending |

### What To Apply to Foresight

```
✅ DO THIS:
├─ Show tangible earnings (prizes won)
├─ Display teams as on-chain proof (like NFTs)
├─ Show rarity metrics (tier, founder status)
├─ Display leaderboard position clearly
└─ Make primary CTAs prominent

❌ DON'T DO THIS:
├─ Hide on-chain assets (teams)
├─ Make rarity unclear
└─ Bury earnings/value metrics
```

---

## SYNTHESIS: The Winning Pattern (For Foresight)

### Combining Best Practices

| App | Element | How Foresight Uses It |
|-----|---------|-----|
| **DraftKings** | Metric-first design | Score (1,135) is gold, large, hero |
| **FanDuel** | Tier system | Level + progression bar |
| **Sorare** | Rarity + scarcity | Founder #18 of X, Unique status |
| **Reddit** | Badges as credentials | Founder badge, Tapestry verified |
| **StepN** | NFT ownership display | Teams shown as on-chain assets |

### Your Ideal Profile Architecture

```
LAYER 1 (Hero — Identity):
├─ Score: 1,135 pts (gold, 4xl)
└─ Rank: #8 All-Time (cyan, 2xl)

LAYER 2 (Credibility — Why Trust):
├─ Founder #18 of X (exclusive access badge)
├─ ✓ Verified on Tapestry (on-chain badge)
└─ 2 Teams on-chain (ownership proof)

LAYER 3 (Performance — Proof of Skill):
├─ Win Rate: 40% (2W, 3L)
├─ Streak: 4 weeks
└─ Contests Entered: 5

LAYER 4 (Social — Community Standing):
├─ 👥 2 Followers (credibility signal)
├─ 👁️ 3 Following (engaged player)
└─ [FOLLOW Button] (easy to socialize)

LAYER 5 (Details — Deep Dives):
├─ Tabs: Overview | Teams | History | Watchlist
└─ Historical data, XP progress, etc.
```

---

## THE PSYCHOLOGY DECODED

### Why Each Element Matters

```
Score (1,135)
└─ Psychology: Identity + endowment effect
   └─ "I have earned this, it's mine"
   └─ Decision: Make it gold, huge, first thing seen

Rank (#8)
└─ Psychology: Social comparison + status
   └─ "Top 1%, I'm better than most"
   └─ Decision: Make it cyan, next to score

Founder Status
└─ Psychology: Scarcity + exclusivity
   └─ "I got in early, only 18 of us"
   └─ Decision: Badge with gold background

Tapestry Verified
└─ Psychology: Legitimacy + blockchain trust
   └─ "This is immutable, no faking it"
   └─ Decision: Checkmark badge with cyan color

Followers Count
└─ Psychology: Social proof + credibility
   └─ "Other people trust/follow me"
   └─ Decision: Visible but not primary

Win Rate (40%)
└─ Psychology: Consistency + reliability
   └─ "I win 40% of contests, not luck"
   └─ Decision: Tertiary metric, gray text
```

### When Judges See This

```
Traditional Dashboard Profile:
→ "Okay, this is a profile" (neutral)

Trophy Card Profile:
→ "WHOA. #8 ranked, founder, verified?" (impressed)
→ "Other people follow this person" (credible)
→ "This is a real winner" (convinced)
```

---

## IMPLEMENTATION PRIORITY (By Impact)

| Priority | Element | Time | Impact | Do First |
|----------|---------|------|--------|----------|
| **CRITICAL** | Score hero (1,135, gold, large) | 30m | HIGHEST | YES |
| **CRITICAL** | Rank secondary (#8, cyan) | 30m | HIGHEST | YES |
| **HIGH** | Founder badge | 45m | HIGH | YES (Phase 1) |
| **HIGH** | Tapestry verified badge | 45m | HIGH | YES (Phase 1) |
| **MEDIUM** | Win rate visible | 30m | MEDIUM | Phase 2 |
| **MEDIUM** | Followers count | 30m | MEDIUM | Phase 2 |
| **LOW** | Remove action tiles | 30m | LOW | Phase 2 |
| **LOW** | Move Today's Actions | 30m | LOW | Phase 3 |

---

## QUICK IMPLEMENTATION CHECKLIST

After researching competitive apps, here's what to implement:

```
PHASE 1 (Hero Section — 2-3 hours):
├─ [ ] Score in gold, 48px, right-aligned
├─ [ ] Rank in cyan, 24px, next to score
├─ [ ] Founder badge (gold bg, text)
├─ [ ] Tapestry verified badge (cyan checkmark)
├─ [ ] Social counts (followers, following)
├─ [ ] Follow button (cyan solid)
└─ [ ] Mobile responsive (portrait layout)

PHASE 2 (Tab Reorganization — 2 hours):
├─ [ ] Move W/L record to Overview top
├─ [ ] Show win rate prominently
├─ [ ] Move XP to secondary position
├─ [ ] Show streak counter
└─ [ ] Teams tab displays likes/shares

PHASE 3 (Cleanup — 1 hour):
├─ [ ] Delete "Today's Actions" section
├─ [ ] Remove action tiles
├─ [ ] Verify all colors are semantic
└─ [ ] Test on mobile (375px)
```

---

## FINAL DECISION GUIDE

**Should you implement this redesign?**

| Factor | Current | After Redesign |
|--------|---------|--------|
| Judge Impression | "Okay profile" | "Impressive trophy card" |
| Time Investment | Baseline | +5-6 hours |
| Risk | Low | Very low (styling + reorg, no new features) |
| Competitive Advantage | Baseline | High (better than competitor profiles) |
| User Confidence | Moderate | High (feels like a winner) |

**Recommendation: YES, implement Phase 1 immediately** (2-3 hours, highest ROI)

---

**Created:** February 25, 2026
**Type:** Competitive Analysis + Implementation Guide
**Next Step:** Approve Phase 1, start hero section redesign
