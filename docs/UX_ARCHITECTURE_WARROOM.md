# FORESIGHT UX ARCHITECTURE - WAR ROOM BRIEF

> **Date:** February 21, 2026
> **Purpose:** Hackathon-focused UX strategy (Solana Graveyard, Feb 12-27, Theme: SocialFi resurrection)
> **Audience:** Product, Engineering, Design, Growth leads
> **Philosophy:** Every pixel is intentional. One primary action per page. Users should feel like they understand the product in 30 seconds.

---

## EXECUTIVE SUMMARY

**The Insight:** SocialFi failed not because the idea was bad, but because crypto required 5+ steps before users could feel value (wallet → buy token → deposit → learn mechanics → first trade = 90% churn). We have a **unique advantage** via Privy auth + embedded wallets: signup → connect → draft first team → feel value in 90 seconds.

**The Opportunity:** Hackathon judges weight UX at 10-15%, but it's the FIRST thing they see in the demo video. A **slick, intuitive experience** will separate us from technical-but-confusing entries.

**The Mandate:** Ship a **mobile-first, frictionless MVP** that makes judges say: "This feels like a real product, not a hackathon project."

---

# ANSWER TO 10 CRITICAL QUESTIONS

## 1. What is Foresight in one sentence?

**For new users (on landing page):**
> "Draft 5 Crypto Twitter influencers. Earn points from their engagement. Climb the leaderboard."

**Why this works:**
- Opens with action verb ("Draft") — immediately clear
- Specific number (5) — removes ambiguity
- Familiar domain (influencers, engagement) — no crypto jargon
- Outcome (leaderboard) — competitive, gamified

**For engaged users (after draft):**
> "Your predictive skill on CT, ranked and rewarded."

---

## 2. Who is our primary user and what is their #1 motivation?

### Primary User Profile
**Demographic:**
- Age: 22-35
- Platform: Primarily mobile (90%+ access on phones)
- Timezone: UTC-8 to UTC+1 (global CT audience, US-heavy)
- Crypto experience: Medium (owns SOL, understands tokens, has Phantom wallet)

**Psychographic:**
- Status-conscious (cares about leaderboard rank, profile visibility)
- Competitive (wants to "win" and prove their predictions)
- Social (follows 100+ accounts, tweets daily or weekly)
- FOMO-driven (fears missing alpha, wants early access signals)

### #1 Motivation: CREDIBILITY & STATUS
Not money (though they want it). **They want proof they understand Crypto Twitter better than everyone else.**

- DraftKings = "I pick winning sports players"
- Foresight = "I predict Twitter influence better than you"

**Evidence:**
- Influencer verification market = $1.3B fraud problem with zero crypto-native solutions
- Kaito's airdrop (CS points) was 200K+ signups in months
- Crypto Twitter is obsessed with credibility scores (followers, engagement, KOL status)

**What they're looking at on their phone right NOW:**
1. Their Foresight Score (new) and how it ranks vs peers
2. Today's leaderboard standings (did I move up/down?)
3. Active team performance (is my draft winning today?)
4. Which influencers are trending (did I pick well?)
5. Friends' teams (social comparison)

---

## 3. What is the core game loop? (from a UX perspective)

The core loop is a **daily decision → score check → competitive ranking cycle**, compressed from "season" (sports fantasy) into "day" (prediction markets).

### The 4-Step Daily Loop (What Users See & Do)

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: DASHBOARD (30 sec) - "What's my status today?"          │
│─────────────────────────────────────────────────────────────────│
│                                                                 │
│ User opens app → sees:                                          │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ "Your Foresight Score"                              +4 pts  │ │
│ │ Rank: #47 (↑ from #52 yesterday)            [gold highlight] │ │
│ │                                                            │ │
│ │ "Active Team Performance"                                 │ │
│ │ [Formation visual showing: 47pts / 150 possible pts]       │ │
│ │                                                            │ │
│ │ [Primary CTA: "Check Live Scores" ↑ blinking indicator]   │ │
│ │ [Secondary: "Draft New Team" or "Vote Next Match"]        │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ → Primary Action: Check live scores & leaderboard               │
│ → User feels: Excitement (rank moved?) or urgency (falling?)   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: LIVE SCORING (2-3 min) - "How are my picks doing?"      │
│─────────────────────────────────────────────────────────────────│
│                                                                 │
│ User clicks "Check Live Scores" → sees:                         │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ [LEADERBOARD TAB - focused on peer comparison]             │ │
│ │                                                            │ │
│ │ 1. @alex_trader     [YOUR RANK: 47] → 245 pts             │ │
│ │ 2. @defi_whale                      → 238 pts             │ │
│ │ ...                                                        │ │
│ │ 47. [YOU] @your_name                → 189 pts [gold glow] │ │
│ │ ...                                                        │ │
│ │ 50. @newbie123                      → 185 pts             │ │
│ │                                                            │ │
│ │ [Secondary info: Your active team]                        │ │
│ │ Captain: @vitalik (+35 pts this week)                     │ │
│ │ Tier-1:  @raydium (+18 pts this week)                     │ │
│ │          @punk_3882 (+22 pts this week)                   │ │
│ │ Tier-2:  @defiwral (+12 pts this week)                    │ │
│ │          @modular (+8 pts this week)                      │ │
│ │                                                            │ │
│ │ [Updated in real-time via SSE]                            │ │
│ │ [Bottom CTA: "View Full Team Stats" or "Draft New Team"]  │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ → Primary Action: Check how many points you earned              │
│ → User feels: Competitive drive (need to climb) or satisfaction │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: COMPETITIVE ACTION (1-5 min) - "What's next?"          │
│─────────────────────────────────────────────────────────────────│
│                                                                 │
│ Based on user state:                                            │
│                                                                 │
│ IF team has active contest:                                    │
│  → "Check Score" (already in step 2)                            │
│  → "Vote on Trending" (next influencer predictions)             │
│  → "Draft new team for next contest"                            │
│                                                                 │
│ IF no active team:                                              │
│  → "Draft Your First Team" [gold button, clear CTA]             │
│  → Use guided drafting (auto-recommendations)                   │
│                                                                 │
│ IF team is locked for this week:                                │
│  → "View Upcoming Contests" [browse next week]                  │
│                                                                 │
│ [Also available: "Browse CT Feed" link - for engagement]        │
│ [Also available: "View Friends' Teams" - social feature]        │
│ └────────────────────────────────────────────────────────────────┘
│                                                                 │
│ → Primary Action: Draft or vote (depending on state)             │
│ → User feels: Agency (I control my destiny)                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: CELEBRATION (social signal) - "Share my dominance"      │
│─────────────────────────────────────────────────────────────────│
│                                                                 │
│ When user climbs rank OR scores big points:                    │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ 🏆 You moved up 5 ranks!                                  │ │
│ │                                                            │ │
│ │ [Formation card showing your team & points]                │ │
│ │                                                            │ │
│ │ [Buttons:                                                 │ │
│ │  "Share on X/Twitter" [fills X with: "Just ranked #42 on  │ │
│ │                        Foresight with my CT dream team"]   │ │
│ │  "Copy team code" [referral link to invite friends]        │ │
│ │  "Close" [back to dashboard]                              │ │
│ │ ]                                                          │ │
│ │                                                            │ │
│ │ [Tooltip: "Share your team = compete with friends"]       │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ → Primary Action: Share (social virality)                       │
│ → User feels: Pride (I'm winning!) + Community (compare friends)│
└─────────────────────────────────────────────────────────────────┘
```

### Why This Loop Works

1. **Low friction on entry** - Dashboard shows value immediately (no need to navigate)
2. **Real-time feedback** - SSE updates give instant gratification (score changes = dopamine)
3. **Clear next action** - Users always know what to do (draft, vote, check scores)
4. **Social loop** - Sharing creates network effects (friends join, everyone plays)
5. **Daily cadence** - Competes for attention vs. sports (daily engagement, not weekly)

### Loop Timing
- **Check scores:** 2-3 min (addictive, obsessive)
- **Vote/Draft:** 5-10 min (decision fatigue increases time)
- **Share:** 30 sec (if they won)
- **Daily frequency:** 2-5x per day (sports fans check leaderboards constantly)

---

## 4. What are the must-have MVP features? (max 6, ranked by UX impact)

### Ranking: By User Experience Impact (Not Technical Complexity)

#### 1. **Live Scoring Dashboard (Impact: CRITICAL - This is the hook)**
   - **What:** Real-time leaderboard + user's current score
   - **Why:** This is what brings users back daily. Static scoring = no engagement. Live updates = addiction.
   - **MVP scope:**
     - User's score in real-time (via SSE)
     - Top 50 leaderboard (who's winning?)
     - User's rank position
     - Simple point breakdown (captain +35, tier1 +18, etc.)
   - **Non-MVP:** Advanced stats, historical charts, skill analytics
   - **Timeline:** MUST be working before launch

#### 2. **Formation-Based Draft UI (Impact: HIGH - This is the differentiator)**
   - **What:** Visual team builder showing 5 influencers in soccer formation (captain at top, then 2, then 2)
   - **Why:** Single clearest product differentiator. Users "see" their team instantly. Creates emotional ownership.
   - **MVP scope:**
     - Formation view with 5 slots (captain + 2 + 2)
     - Tier colors (gold, cyan, emerald, gray)
     - Budget tracking (spent / 150 SOL)
     - Auto-populate from top influencers (no research needed)
     - "Lock & Submit" CTA
   - **Non-MVP:** Advanced filters, search, historical performance, tier recommendations
   - **Timeline:** MUST be working and beautiful

#### 3. **Influencer Selection (Impact: HIGH - This is the action)**
   - **What:** Scrollable list of 50-100 CT influencers grouped by tier + price
   - **Why:** Users need to pick 5. Simple list prevents decision paralysis.
   - **MVP scope:**
     - Grid by tier (S/A/B/C)
     - Click to add to team
     - Price shown
     - Follower count + engagement rate
     - "Popular picks" section (shows % of users who picked them)
   - **Non-MVP:** Search, filters, trends, price history
   - **Timeline:** Easy - just list from DB

#### 4. **Multi-Contest Support (Impact: MEDIUM - Enables repeat plays)**
   - **What:** Users can draft teams for different contests (free, paid, themed)
   - **Why:** Repeatable engagement. One draft = boring. Multiple contests = keep coming back.
   - **MVP scope:**
     - 3-5 contests running (free only for MVP, paid is post-launch)
     - Contest details: entry fee, prize pool, lock time, end time
     - "Active" vs "Upcoming" contests
     - Teams locked after start time (can't change mid-scoring)
   - **Non-MVP:** Custom contests, pay-to-play, team transfers
   - **Timeline:** Backend exists, just wire up to frontend

#### 5. **Social Proof / Leaderboard Ranking (Impact: MEDIUM - Drives competitive FOMO)**
   - **What:** Show how you rank vs. all players + friends
   - **Why:** Fantasy sports = competitive. Leaderboards = addiction.
   - **MVP scope:**
     - Global leaderboard (top 100)
     - Friends leaderboard (if you follow them)
     - Your rank highlighted
     - Points breakdown per person
   - **Non-MVP:** Streaks, achievements, historical rankings, tier progression
   - **Timeline:** Query exists, just add UI

#### 6. **CT Feed Integration (Impact: MEDIUM - Provides context & virality)**
   - **What:** Curated Twitter feed of top influencers you're drafting
   - **Why:** Shows why you picked them. Creates investment in picks. Viral potential.
   - **MVP scope:**
     - Last 10 tweets from your active team
     - Engagement counts (likes, retweets)
     - Filter by tier
     - Click tweet → open in X
   - **Non-MVP:** Trending topics, sentiment analysis, alerts
   - **Timeline:** Backend exists, needs UI integration

---

## 5. What features should we EXPLICITLY CUT for MVP?

**Rationale for cutting:** Anything that adds UI complexity without proportional user value.

### KILL THESE:
1. **User Settings/Customization Page** ❌
   - Why: Non-essential for core loop. Users don't need theme toggle or notification preferences day 1.
   - Save time: 4-6 hours
   - When to add: Post-launch if users ask

2. **In-app Chat/Comments** ❌
   - Why: Adds moderation burden + UI complexity. Social features should happen on X/Twitter instead.
   - Save time: 8-10 hours
   - Alternative: "Share team on X" link instead

3. **Advanced Analytics (Win Rate, Skill Score, etc.)** ❌
   - Why: Cool but not necessary. Users just want: rank + points + team performance.
   - Save time: 6-8 hours
   - Implement: Post-launch as "Career Stats" section

4. **User Referral System** ❌
   - Why: Great for growth, but adds DB tables + logic complexity. Social sharing is enough.
   - Save time: 3-4 hours
   - When to add: Month 2 (post-launch)

5. **Achievement/Badge System** ❌
   - Why: Gamification is nice, but not core loop. Leaderboard rank IS the achievement.
   - Save time: 3-4 hours
   - Implement: Later as novelty feature

6. **Paid Contests** ❌ (for MVP)
   - Why: Free contests get you to 1K users. Paid adds wallet/payment complexity.
   - Save time: 8-12 hours
   - When to ship: Week 2 (post-launch, with proper contract audits)

7. **Mobile App** ❌
   - Why: Hackathon requires shipping fast. Mobile web (Responsive React) = 90% of value with 10% effort.
   - Ship: Progressive Web App (PWA) pinnable to home screen
   - Native app: Month 2-3 if successful

8. **Quests/Quests Progress Page** ❌
   - Why: Adds a whole feature branch. Daily login bonuses > complex quest system.
   - Save time: 4-5 hours
   - Implement: Post-launch

9. **Email Notifications** ❌
   - Why: Complex integrations (Sendgrid, email templates). In-app toast + X mentions are enough.
   - Save time: 3-4 hours
   - When to add: Once you have 500+ users who want notifications

10. **Wallet Management UI** ❌
    - Why: Privy handles this. Don't reinvent. Just show balance in header.
    - Save time: 2-3 hours
    - Alternative: Link to Privy dashboard if user wants to manage

### KEEP THESE (CORE):
- Live Scoring ✅
- Draft UI ✅
- Leaderboard ✅
- CT Feed ✅
- Multi-contest support ✅
- Social sharing ✅
- Auth (Privy) ✅

**Total time saved by cutting: 42-58 hours** → Use for polish, testing, and demo preparation.

---

## 6. How should scoring work? (from a DISPLAY perspective)

Users need to understand **why they earned points**, in real-time, without opening a 50-page documentation.

### The Philosophy
**Score should feel like watching a live sports game:**
- Start: 0 points
- Player does something → +X points (displayed immediately)
- Captain gets bonus → ×1.5x (highlighted)
- Leaderboard updates → Your rank changes (animated)
- Game over → Final score (celebrated)

### What Users SEE (at different touchpoints)

#### **1. During Draft (Before Submission)**
```
┌──────────────────────────────────────┐
│ DRAFT BUDGET                         │
│ Spent: 95 / 150 SOL                  │
│                                      │
│ [Captain] @vitalik (S-tier)  60 SOL │
│  Captain Bonus: ×1.5x points        │
│  Est. weekly points: 40-60           │
│                                      │
│ [Tier 1] @raydium (A-tier)   20 SOL │
│  Expected points: 20-30               │
│                                      │
│ [Tier 1] @punk_3882 (A-tier)  20 SOL│
│  Expected points: 18-28               │
│                                      │
│ [Tier 2] @defiwral (B-tier)    15 SOL│
│  Expected points: 12-18               │
│                                      │
│ [Tier 2] @modular (B-tier)     10 SOL│
│  Expected points: 8-15                │
│                                      │
│ TEAM TOTAL (optimistic):      ~95 pts│
│ ──────────────────────────────────── │
│ [Lock & Submit] [Clear team]         │
└──────────────────────────────────────┘

Why this matters:
- Shows expected value (not shocking surprises)
- Captain bonus is VISIBLE (×1.5 is compelling)
- Budget constraint creates scarcity (SOL = real constraint)
```

#### **2. During Week (Live Scoring)**

```
LIVE SCORING (Updates in real-time, every 30 seconds)

Week 47: Jan 20-26, 2026

┌──────────────────────────────────────────────────────┐
│ YOUR TEAM PERFORMANCE                               │
│ Last Updated: Jan 26, 2:47 PM UTC                   │
│                                                     │
│ CAPTAIN: @vitalik                   TOTAL: +42 pts │
│  ├─ Activity (tweets): +18 pts                      │
│  │  (10 tweets × 1.5pt + 3.5 bonus)                 │
│  ├─ Engagement (likes/retweets): +24 pts            │
│  │  (Quality: 45 avg engagement × 1.5 = 67, volume │
│  │   adjusted = 24 pts)                             │
│  ├─ Viral bonus: +10 pts                            │
│  │  (1 tweet hit 120K engagement, +10 bonus)        │
│  ├─ Follower growth: +2 pts                         │
│  │  (Gained 4K followers = +2 pts)                  │
│  └─ CAPTAIN MULTIPLIER: ×1.5 = +42 pts (HIGHLIGHTED)
│                                                     │
│ TIER 1: @raydium                     TOTAL: +18 pts│
│  ├─ Activity: +9 pts                                │
│  ├─ Engagement: +8 pts                              │
│  ├─ Growth: +1 pt                                   │
│                                                     │
│ TIER 1: @punk_3882                   TOTAL: +22 pts│
│  ├─ Activity: +10 pts                               │
│  ├─ Engagement: +10 pts                             │
│  ├─ Viral: +2 pts                                   │
│                                                     │
│ TIER 2: @defiwral                     TOTAL: +12 pts│
│ TIER 2: @modular                       TOTAL: +8 pts│
│                                                     │
│ ═════════════════════════════════════════════════════│
│ YOUR WEEKLY TOTAL:                   102 pts ✓      │
│ (vs. team average: 84 pts)                          │
│ (vs. leader: 245 pts)                               │
│                                                     │
│ [Expand Team Stats] [Draft Again] [Back to Leaderb]│
└──────────────────────────────────────────────────────┘

Why this works:
- Granular breakdown (users understand where points come from)
- Real numbers, real rationale (not magic black box)
- Captain bonus is obvious (1.5x highlight)
- Contextual framing (vs. average, vs. leader)
- Real-time updates feel like watching a game
```

#### **3. On Leaderboard**

```
GLOBAL LEADERBOARD (Real-time)

Rank | Player           | This Week | Total  | Team (hover for stats)
────┼──────────────────┼───────────┼────────┼──────────────────────
  1  | @alex_trader     |   +245    | 8,950  | [tooltip: 5-player formation]
  2  | @defi_whale      |   +238    | 8,821  |
 ..  | ...              |   ...     |  ...   |
 47  | YOU @your_name   |   +102    | 4,320  | [gold highlight, ↑5 from yesterday]
 48  | @newbie123       |   +98     | 4,100  |
────┴──────────────────┴───────────┴────────┴──────────────────────

Rank changed animation:
- User opens leaderboard
- If rank improved: Green arrow ↑ animates
- If rank declined: Red arrow ↓ animates
- Satisfying visual feedback (matches sports UI)
```

#### **4. Scoring Breakdown Popup (On Demand)**

When user clicks "Show Scoring Details":

```
HOW SCORING WORKS (Simple Guide)

┌────────────────────────────────────┐
│ Your pick gets points from:        │
│                                    │
│ 1. ACTIVITY (up to 35 pts)         │
│    More tweets = more points       │
│    Max 23 pts (15 tweets)          │
│                                    │
│ 2. ENGAGEMENT (up to 60 pts)       │
│    Quality of likes/retweets       │
│    Based on avg engagement         │
│                                    │
│ 3. GROWTH (up to 40 pts)           │
│    Followers gained this week      │
│    Growth percentage vs. baseline  │
│                                    │
│ 4. VIRAL (up to 25 pts)            │
│    Tweets that hit 10K+ engagement │
│    Rare, high-reward moments       │
│                                    │
│ 5. CAPTAIN (×1.5 multiplier)       │
│    Your captain pick counts 1.5x   │
│    Pick wisely!                    │
│                                    │
│ 6. SPOTLIGHT (bonus flat points)   │
│    Top performers get bonus        │
│    1st: +12  2nd: +8  3rd: +4     │
│                                    │
│ [Close] [Read Full Rules]          │
└────────────────────────────────────┘
```

### Key Design Principles for Display

1. **Make the Captain Bonus OBVIOUS** - It's the defining mechanic, should be visually distinct (gold glow, ×1.5 label)
2. **Show breakdowns inline** - Don't hide scoring details behind clicks. Hover tooltips work.
3. **Real-time updates** - SSE updates every 30 seconds. Leaderboard rank changes animate.
4. **Context matters** - Always show "vs. average" and "vs. leader" not just absolute points
5. **Simplify for first-time viewers** - New users see summary. Advanced users can expand for breakdown.
6. **Use formation view as score summary** - Show: Captain + 4 tiers with points beneath each

---

## 7. What should the economic model be? (how to present money/SOL to users)

### The Core Principle
**Crypto is a feature, not the focus.** Users don't think in SOL. They think in ranks and prizes.

### Messaging Strategy

#### **For MVP (Free to Play + Social)**
```
┌──────────────────────────────────────────────────┐
│ CONTEST CARD                                     │
│                                                  │
│ "Free Fantasy League"                            │
│ Entry: FREE                                      │
│ Prize Pool: 50 SOL (~$7,500 at $150/SOL)         │
│ Players: 2,847 competing                         │
│ Spots Left: 143                                  │
│                                                  │
│ [Draft Now] [View Details]                       │
└──────────────────────────────────────────────────┘
```

**Why this works:**
- "Entry: FREE" is the headline (no friction)
- Prize pool in SOL BUT converted to USD (relatable)
- Player count = social proof (FOMO)
- Spots left = scarcity (urgency)

#### **Pricing for Post-MVP (Paid Contests)**
*(Don't ship in MVP, but have strategy ready)*

```
CONTEST TYPES (Launch later, not week 1):

1. FREE CONTESTS (to build habit)
   Entry: Free
   Prize pool: Shared from platform fees
   Target: 1K-5K players

2. PAID CONTESTS ($5 entry)
   Entry: 0.03 SOL (~$5 at $150/SOL)
   Prize pool: 80% of entries (0.024 SOL per person)
   Target: 100-500 players per contest
   Foresight rake: 20% (0.006 SOL per entry)

3. PREMIUM CONTESTS ($25 entry)
   Entry: 0.15 SOL (~$25)
   Prize pool: 85% of entries
   Target: 50-200 players
   Foresight rake: 15%

4. SEASONAL PASS ($9.99/month)
   Unlimited free contest entries
   Early access to contests
   Premium customer support
   NFT badge
```

**Don't mention economics to new users.** Just say:
- "Free to start"
- "Win real SOL"
- "No credit card required"

### How to Display Prices

**Bad:**
```
Entry Fee: 0.033 SOL
Prize Pool: 150 SOL total
```
(Too crypto-native, scares off casual users)

**Good:**
```
Entry: ~$5 (0.033 SOL)
Prize Pool: ~$22,500
100 players × $225 average payout
```
(Framed in USD, but shows SOL for transparency)

### Wallet Integration (Privy)

**For MVP:**
- Don't show wallet balance on every page
- Only show in header on hover: "Balance: 2.5 SOL" [linked to Privy]
- When user tries to enter paid contest: "You have 0.5 SOL. Need 0.03 SOL. [Deposit] [Cancel]"
- Privy handles deposit - we just trigger it

**Copy for wallet flows:**
- "Not enough SOL? [Deposit to your Foresight wallet]" ← links to Privy
- "First time on Solana? [Learn about wallets]" ← educational link
- Never: "Approve transaction" or "Sign message" in UI - Privy handles modals

### Revenue Model (For context, don't market to users)

**Year 1 (Hackathon → Month 6):**
- Free contests only (building user base)
- Revenue: $0 (sustainability mode)

**Month 6-12:**
- 10% rake on paid contests
- 1K active users × $50 monthly spend = $50K MRR gross
- 10% rake = $5K MRR
- Enough to run infrastructure

**Year 2+:**
- Premium subscription ($4.99/mo)
- Influencer partnerships (they get 0.5% of rake on their markets)
- Premium analytics API for funds
- Goal: $100K MRR

**Don't tell users any of this.** They care about: "Can I win?" and "Is this fun?"

---

## 8. What pages/screens should the app have? (DETAILED spec with layouts)

### App Structure (Information Architecture)

```
/               Home/Dashboard (dual-state: landing + dashboard)
/league         Draft page (form team)
/compete        Leaderboards + contests (tabs: rankings, contests)
/intel          CT Feed (curated tweets)
/profile        User hub (tabs: stats, settings, referrals)
/contest/:id    Contest detail view
/draft-legacy   [Optional legacy draft interface - don't delete]
```

### Pages Spec

---

#### **PAGE 1: HOME (`/`)**

**Purpose:** Landing for non-connected users. Dashboard for connected users.

**Non-Connected State (Landing Page)**
```
┌─────────────────────────────────────────────────────┐
│ FORESIGHT LOGO + HEADER                             │
│ ⚡ Foresight   [Connect Wallet] [Twitter Link]      │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ HERO SECTION (Full width, 60% of fold)              │
│                                                     │
│ Left side (copy):                                   │
│ • Live badge (pulsing dot + "Live on Base")         │
│ • Headline: "Fantasy league for Crypto Twitter"     │
│ • Subheadline: "Draft 5 influencers..."             │
│ • Trust signals: "Free to play" + "Win real SOL"... │
│ • CTA: [Start Playing] (primary, gold)              │
│                                                     │
│ Right side (visual):                                │
│ • Formation preview (5 influencer cards in          │
│   soccer formation shape)                           │
│ • Gold glow around captain slot                     │
│ • Subtle animation (cards fade in, hover shows...)  │
│                                                     │
│ Background: Gradient from gold to dark              │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ "HOW IT WORKS" SECTION (Condensed, 3 steps)         │
│                                                     │
│ Step 1: Draft    Step 2: Earn    Step 3: Win       │
│ (icon)           (icon)         (icon)              │
│ "Pick 5 CT       "Score points  "Climb the         │
│  influencers"    from engagement" leaderboard"      │
│                                                     │
│ [Each step is clickable for more detail]            │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ FEATURED CONTEST (Social proof)                     │
│                                                     │
│ "Join 2,847 players"                                │
│ [Big contest card: free, 50 SOL pool, live stats]  │
│ [Secondary CTA: Browse All Contests]                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ FINAL CTA (Repeat)                                  │
│ Headline: "Ready to prove you understand CT?"       │
│ [Start Playing] button (large, gold)                │
└─────────────────────────────────────────────────────┘
```

**Connected State (Dashboard)**
```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
│ ⚡ Foresight   [Foresight Score: 1,240]  @username  │
│                [↑ 12 from yesterday]     [Profile]  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ HERO CARD (Contextual to user state)                │
│                                                     │
│ IF active team exists:                              │
│  • "Your Score This Week: 102 pts"                  │
│  • "Rank: #47 (↑5 from yesterday)"                  │
│  • Formation preview (show team)                    │
│  • [Check Live Scores] [Draft New Team]             │
│                                                     │
│ IF no active team:                                  │
│  • "No Active Team"                                 │
│  • Formation preview (empty slots)                  │
│  • [Draft Your First Team] (primary CTA)            │
│  • [Browse Upcoming Contests]                       │
│                                                     │
│ IF multiple contests active:                        │
│  • Show tabs: "Contest 1" | "Contest 2" | ...       │
│  • Switch between teams                             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ "TODAY'S ACTIONS" (Optional, for engaged users)     │
│ [Vote on next trending] [Check friend's scores]     │
│ [Browse new contests]                               │
│ [See what's trending]                               │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ STATS ROW (at a glance)                             │
│ Foresight Score: 1,240 pts  |  Rank: #47           │
│ Weekly Gain: +102 pts       |  Total Contests: 8    │
│ Win Rate: 58%               |  Current Streak: 4w   │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ "YOUR LEAGUE" (Friends leaderboard)                 │
│ 1. @buddy1  (shared team: +145 pts this week)       │
│ 2. YOU @you (single team: +102 pts this week)       │
│ 3. @buddy2  (+78 pts)                               │
│ [Invite Friends] [View All Friends]                 │
└─────────────────────────────────────────────────────┘
```

**Mobile Layout (Stack vertically, same order)**

---

#### **PAGE 2: LEAGUE (`/league`)**

**Purpose:** Draft new team for a contest.

```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
│ [← Back] Draft New Team [Help ?]                    │
│                                                     │
│ Contest: "Free Weekly Championship"                 │
│ Ends: Saturday 11:59 PM UTC                         │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ FORMATION VIEW (Left side, sticky on desktop)       │
│                                                     │
│ Budget: 95 / 150 SOL  [Show calculations]           │
│                                                     │
│           [Captain Slot - EMPTY]  ← Drag here      │
│           [gold border, "Pick S-tier"]              │
│                                                     │
│       [Slot 2]  ×  [Slot 3]                         │
│       [EMPTY]       [EMPTY]                         │
│       "Pick A-tier" "Pick A-tier"                   │
│                                                     │
│     [Slot 4]        [Slot 5]                        │
│     [EMPTY]         [EMPTY]                         │
│     "Pick B/C-tier" "Pick B/C-tier"                 │
│                                                     │
│ Team Value: $0 (once filled, shows $7K-$25K)       │
│ Captain Bonus: ×1.5x points                         │
│ Est. Weekly Score: 0 pts → ~100 pts (filled)       │
│                                                     │
│ [Lock & Submit] [Clear Team] [Auto-Draft]          │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ INFLUENCER SELECTION (Right side, scrollable)       │
│                                                     │
│ Search / Filter: [Tier: All] [Price: All]           │
│                                                     │
│ S-TIER (25 SOL+)                                    │
│ ┌──────────────────────────────────────┐            │
│ │ @vitalik              60 SOL  S-tier │ [Pick]   │
│ │ 1.2M followers, 8.5% engagement     │            │
│ │ Selected by: 47% of users            │            │
│ │ Avg points: 35-45 per week           │            │
│ └──────────────────────────────────────┘            │
│                                                     │
│ ┌──────────────────────────────────────┐            │
│ │ @raydium              55 SOL  S-tier │ [Pick]   │
│ │ 850K followers, 12% engagement      │            │
│ │ Selected by: 62% of users            │            │
│ │ Avg points: 38-48 per week           │            │
│ └──────────────────────────────────────┘            │
│                                                     │
│ A-TIER (15-24 SOL)                                  │
│ ┌──────────────────────────────────────┐            │
│ │ @punk_3882            20 SOL  A-tier │ [Pick]   │
│ │ 400K followers, 15% engagement      │            │
│ │ Selected by: 34% of users            │            │
│ │ Avg points: 20-30 per week           │            │
│ └──────────────────────────────────────┘            │
│                                                     │
│ [Load more...] or paginated tabs                    │
│                                                     │
└─────────────────────────────────────────────────────┘

Mobile layout:
- Formation at top (small)
- Influencer list full-width below
- Selection happens via modal overlay
```

**Key UX Details:**
- Drag-and-drop influencer to slot (or click slot → select)
- Budget updates in real-time
- "Popular picks" shows % of users who selected them (anchors decision)
- Auto-draft suggests 5 players based on tier + availability
- Captain slot is visually distinct (gold border, larger)

---

#### **PAGE 3: COMPETE (`/compete`)**

**Purpose:** View leaderboards and upcoming contests.

```
┌─────────────────────────────────────────────────────┐
│ HEADER TABS                                         │
│ [Leaderboards] [Contests]                           │
└─────────────────────────────────────────────────────┘

─── TAB 1: LEADERBOARDS ───

┌─────────────────────────────────────────────────────┐
│ FILTERS                                             │
│ [Time: This Week ▼] [Friends Only: OFF ▼]           │
│ [Search player...]                                  │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ LEADERBOARD                                         │
│                                                     │
│ Rank | Player      | Weekly | Total | Team Preview │
│ ─────┼─────────────┼────────┼───────┼──────────────│
│  1   | @alex_tr... | +245   | 8,950 | [icon grid]  │
│  2   | @defi_wh... | +238   | 8,821 | [icon grid]  │
│  ...                                                │
│ 47   | YOU @you    | +102   | 4,320 | [gold band]  │
│ 48   | @newbie... | +98    | 4,100 | [icon grid]  │
│  ...                                                │
│ 100  | @small_... | +8     | 250   | [icon grid]  │
│                                                     │
│ [Load more] or infinite scroll                      │
│                                                     │
│ Click on row → See player's team + full breakdown  │
└─────────────────────────────────────────────────────┘

─── TAB 2: CONTESTS ───

┌─────────────────────────────────────────────────────┐
│ CONTEST CARDS (Filterable by status, type, prize)   │
│                                                     │
│ FREE CONTESTS (Active)                              │
│                                                     │
│ ┌──────────────────────────────────────┐            │
│ │ "Free Weekly Championship"            │            │
│ │ Status: OPEN                          │            │
│ │ Entry: FREE                           │            │
│ │ Ends: Saturday 11:59 PM UTC           │            │
│ │ Players: 2,847 / Unlimited            │            │
│ │ Prize Pool: 50 SOL (~$7,500)          │            │
│ │                                       │            │
│ │ [Draft Now] [View Details]            │            │
│ └──────────────────────────────────────┘            │
│                                                     │
│ ┌──────────────────────────────────────┐            │
│ │ "Tuesday Speed Run"                   │            │
│ │ Status: OPEN                          │            │
│ │ Entry: FREE                           │            │
│ │ Ends: Tuesday 11:59 PM UTC            │            │
│ │ Prize Pool: 25 SOL                    │            │
│ │ [Draft Now] [View Details]            │            │
│ └──────────────────────────────────────┘            │
│                                                     │
│ UPCOMING (Locked until deposits available)         │
│                                                     │
│ ┌──────────────────────────────────────┐            │
│ │ "Paid Pro League" [COMING MONTH 2]    │            │
│ │ Entry: ~$5 (0.03 SOL)                 │            │
│ │ Prize Pool: 500 SOL (~$75K)           │            │
│ │ Coming February 28                    │            │
│ │ [Notify Me]                           │            │
│ └──────────────────────────────────────┘            │
│                                                     │
│ [Show Past Contests] [Archive]                      │
└─────────────────────────────────────────────────────┘
```

**Contest Detail (`/contest/:id`)** - Separate page or modal:
```
┌──────────────────────────────────────┐
│ Free Weekly Championship              │
├──────────────────────────────────────┤
│ Status: OPEN (Ends Saturday 11:59PM) │
│ Entry Fee: FREE                       │
│ Prize Pool: 50 SOL distributed to:   │
│  • 1st: 20 SOL ($3,000)               │
│  • 2nd: 15 SOL ($2,250)               │
│  • 3rd: 10 SOL ($1,500)               │
│  • 4-10: Shared 5 SOL                 │
│                                      │
│ Players: 2,847 of Unlimited spots    │
│ Average team score: 84 pts            │
│                                      │
│ Rules:                               │
│ • 5-player team (1 captain, 4 others)│
│ • Captain score × 1.5                │
│ • Scores lock when contest starts    │
│ • Points calculated weekly           │
│ • Payouts via SOL wallet             │
│                                      │
│ [You're Already In] [View Your Team] │
│ [View Leaderboard] [Back]            │
└──────────────────────────────────────┘
```

---

#### **PAGE 4: INTEL (`/intel`)**

**Purpose:** CT Feed - curated tweets from influencers you draft.

```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
│ 🐦 CT Feed   [Filters: All ▼]   [Settings]         │
│              [Trending Now] [Your Team]             │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ HIGHLIGHTS (Top row, scrollable horizontally)       │
│                                                     │
│ Viral Tweets (50K+ engagement this hour)           │
│ ┌────────────┐  ┌────────────┐  ┌────────────┐    │
│ │ @vitalik   │  │ @raydium   │  │ @defiwral  │    │
│ │ Tweet... + │  │ Tweet... + │  │ Tweet... + │    │
│ │ 145K likes │  │ 89K likes  │  │ 56K likes  │    │
│ └────────────┘  └────────────┘  └────────────┘    │
│ [← scroll →]                                       │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ MAIN FEED (Infinite scroll)                         │
│                                                     │
│ RISING STARS (New high-engagement influencers)     │
│ ┌──────────────────────────────────────┐            │
│ │ @newinfluencer (48 hours to break 1M │            │
│ │ followers, 12K posts this week)      │            │
│ │ "Just launched..." [Tweet text]      │            │
│ │ 32K ↑ 8.5K ↓ 2.1K 💬                │            │
│ │ 2 hours ago                          │            │
│ │ [Reply] [Quote] [Like] [Share]       │            │
│ └──────────────────────────────────────┘            │
│                                                     │
│ YOUR TEAM'S TWEETS (Sorted by engagement)          │
│ ┌──────────────────────────────────────┐            │
│ │ @vitalik                   [Your team]│            │
│ │ "The future of crypto is..." [tweet] │            │
│ │ 145K ↑  32K ↓  8K 💬                │            │
│ │ THIS TWEET IS SCORING +12 PTS         │            │
│ │ 4 hours ago                          │            │
│ │ [Reply] [Quote] [Like] [Share]       │            │
│ └──────────────────────────────────────┘            │
│                                                     │
│ ┌──────────────────────────────────────┐            │
│ │ @raydium                   [Your team]│            │
│ │ "Liquidity pools are..." [tweet]     │            │
│ │ 12K ↑  2K ↓  450 💬                 │            │
│ │ THIS TWEET IS SCORING +2 PTS          │            │
│ │ 6 hours ago                          │            │
│ └──────────────────────────────────────┘            │
│                                                     │
│ [Load more tweets...]                               │
└─────────────────────────────────────────────────────┘

Filtering:
- [Your Team] ← tweets from people in your active team
- [Trending] ← highest engagement right now
- [Rising Stars] ← influencers with fast growth
- [All] ← everything
```

**Why this page matters:**
- Gives context to scores ("I see why @vitalik got +12 pts")
- Shows you what you're predicting
- Real-time engagement updates feel like watching a game

---

#### **PAGE 5: PROFILE (`/profile`)**

**Purpose:** User hub - stats, settings, referrals.

```
┌─────────────────────────────────────────────────────┐
│ PROFILE HEADER                                      │
│                                                     │
│ [Avatar] @username                    [Settings]   │
│ Foresight Score: 1,240 pts                          │
│ Rank: #47 globally, #3 among friends                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ STATS TABS: [Stats] [Quests] [Settings]             │
└─────────────────────────────────────────────────────┘

─── TAB 1: STATS ───

┌─────────────────────────────────────────────────────┐
│ QUICK STATS (Cards)                                 │
│                                                     │
│ ┌──────────────┬──────────────┬──────────────┐     │
│ │ Total Points │ Win Rate     │ Contests     │     │
│ │ 4,320 pts    │ 58%          │ 8 entered    │     │
│ └──────────────┴──────────────┴──────────────┘     │
│ ┌──────────────┬──────────────┬──────────────┐     │
│ │ This Week    │ Best Pick    │ Streak       │     │
│ │ +102 pts     │ @vitalik     │ 4 weeks      │     │
│ └──────────────┴──────────────┴──────────────┘     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ CHART: Points over time (line chart, 8 weeks)       │
│                                                     │
│  400 ┤        /\                                    │
│  300 ┤   /\  /  \                                   │
│  200 ┤  /  \/    \                                  │
│  100 ┤ /          \__                               │
│    0 └─────────────────────────────────────        │
│      W1 W2 W3 W4 W5 W6 W7 W8                        │
│                                                     │
│ [Download as PNG] [Share scorecard]                 │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ CONTEST HISTORY                                     │
│                                                     │
│ Week 8: Free Weekly Champ → 2nd place → 15 SOL ✓   │
│ Week 7: Free Weekly Champ → 5th place → 2 SOL ✓    │
│ Week 6: Free Weekly Champ → 12th place → Nothing   │
│ [View all 8 contests]                               │
└─────────────────────────────────────────────────────┘

─── TAB 2: QUESTS (Optional for MVP, remove if time-pressed) ───

```
│ DAILY QUESTS                                        │
│                                                     │
│ [✓] Check leaderboard  (Complete)      +10 XP      │
│ [✓] Vote once           (Complete)      +10 XP      │
│ [ ] Win a contest       (0 of 1)         +50 XP     │
│                                                     │
│ Weekly Challenge:                                   │
│ [ ] Place in top 100    (0 of 1)        +100 XP    │
│                                                     │
│ Current Level: 5 (850/1000 XP to Level 6)          │
│ Progress: ████████░░ 85%                            │
└─────────────────────────────────────────────────────┘

─── TAB 3: SETTINGS ───

┌─────────────────────────────────────────────────────┐
│ NOTIFICATION SETTINGS                               │
│ [ ] Email on rank change                            │
│ [ ] Push when team scores big                       │
│ [ ] Digest (weekly summary)                         │
│                                                     │
│ PRIVACY                                             │
│ [✓] Profile public                                  │
│ [✓] Show in leaderboard                             │
│ [ ] Hide team composition                           │
│                                                     │
│ ACCOUNT                                             │
│ Email: mujeeb@example.com                           │
│ Wallet: 0xabc123...                                 │
│ [Export my data] [Delete account]                   │
│                                                     │
│ Referral code: FRIEND4K (10 signups = bonus points) │
│ [Share referral link] [Copy code]                   │
│                                                     │
│ Version: 1.0.0 (Beta)                               │
│ [Report bug] [Documentation] [Terms] [Privacy]      │
│                                                     │
│ [Disconnect wallet] [Logout]                        │
└─────────────────────────────────────────────────────┘
```

---

### Summary: Page Count & Scope

| Page | URL | Lines of Code | Component | Status |
|------|-----|---------------|-----------|--------|
| Home | `/` | ~400 | `Home.tsx` | Dual-state ✓ |
| Draft/League | `/league` | ~600 | `Draft.tsx` | Formation-based ✓ |
| Compete | `/compete` | ~500 | `Compete.tsx` | Leaderboards ✓ |
| Intel | `/intel` | ~300 | `Intel.tsx` (was Feed) | CT Feed ✓ |
| Profile | `/profile` | ~400 | `Profile.tsx` | Tabbed hub ✓ |
| Contest Detail | `/contest/:id` | ~200 | `ContestDetail.tsx` | View only ✓ |
| **Total** | - | ~2,400 | 6 pages | **MVP Complete** |

**Mobile:** All pages are responsive. No separate mobile app for MVP. PWA installable to home screen.

---

## 9. What's our "why now" story for judges? (how do we SHOW this in the demo)

### The Problem Statement (15 seconds on video)

**On screen:**
```
═══════════════════════════════════════════════════════
PROBLEM: SocialFi is Dead
═══════════════════════════════════════════════════════

Kaito's "Yaps" Shut Down → 200K users with nowhere to go

Why? SocialFi had 5-step friction:
1. Install wallet
2. Buy token
3. Deposit funds
4. Learn the game
5. Make first trade

Result: 90% churn before step 3.
```

**Speaker says:** "SocialFi tried to predict influence. But they built the wrong distribution. We're doing it different."

---

### The Unique Solution (30 seconds)

**Show Demo (auto-play, no clicking):**

```
SCENE 1: Landing Page (2 sec)
- User lands on /
- Sees formation preview hero (formation visual = product clarity)
- Copy: "Fantasy league for Crypto Twitter"
- CTA: "Start Playing" button

SCENE 2: Instant Wallet (1 sec)
- Click "Start Playing"
- Privy modal pops up
- Email + Social login (not "install MetaMask")
- "Creating embedded wallet..."
- SUCCESS: "Your account is ready!"

SCENE 3: Draft (3 sec)
- User sees influencer list
- Drags @vitalik to captain slot
- Formation updates in real-time
- Budget: 95/150 SOL
- Auto-draft fills remaining 4 slots
- [Lock & Submit]
- SUCCESS: Team created!

SCENE 4: Live Scoring (2 sec)
- Dashboard shows: "Your Score: 102 pts"
- Leaderboard shows: "Rank #47 (↑5 from yesterday)"
- Real-time: @vitalik tweet gets 50K engagement
- Score updates: +3 pts (visible animation)
- Formation card updates (gold glow on captain)

SCENE 5: Leaderboard (2 sec)
- Swipe to /compete leaderboard tab
- Show global rankings
- Your rank highlighted in gold
- Click on opponent → see their team formation
- Formation preview shows why they're winning

Total video time: ~13 seconds
```

**Speaker narration over demo:**

> "We solved the friction problem. One email. You're in. You draft your 5 CT influencers in 90 seconds. Then you watch them score in real-time. Instant gratification. That's the hook."

---

### The "Why Now" Angle (15 seconds)

**On screen:**
```
WHY NOW:

1. Solana is THE chain for CT (fast, cheap, fun)
2. Privy embedded wallets kill crypto friction
3. Tapestry Protocol gives us social graph API
4. CT is obsessed with credibility scores
5. Prediction markets just hit $13B/month notional volume
```

**Speaker says:** "SocialFi was 2 years too early. Privy + Tapestry + Solana + prediction markets finally align. We're not competing with Kaito. We're building what they should have been if the infrastructure existed."

---

### The Demo Checklist (What Judges See)

- [ ] **Landing page looks professional** (gold/dark theme, formation visual, clear copy)
- [ ] **Auth is seamless** (email login, not wallet install)
- [ ] **Draft is fast** (<2 minutes from signup to team locked)
- [ ] **Formation visual is compelling** (judges instantly understand: 5 person team, tiers matter)
- [ ] **Live scoring feels real** (leaderboard updates, points animation, rank changes)
- [ ] **Leaderboard creates FOMO** (shows other users, social competition)
- [ ] **No errors/crashes** (smooth UX, responsive, no console errors)
- [ ] **Mobile looks great** (responsive design, touch-friendly)

**Most important:** Judge should be able to draft a team and see their score update **within 3 minutes of landing on the app.** If they feel value that fast, they're impressed.

---

## 10. What's the #1 thing that could make us fail, and how do we prevent it?

### The #1 Failure Mode: Authentication Friction

**The risk:**
```
User lands on homepage
Sees: "Start Playing" button
Clicks it
Sees: Privy modal
Thinks: "This is just another crypto wallet thing..."
Feels: Resistance (I've seen this a hundred times)
Action: Closes browser, never returns

Result: 0% conversion. All traffic wasted.
```

**Why this is critical:**
- We have NO feedback loop (judges don't come back with detailed critique)
- First impression is EVERYTHING in a hackathon
- Auth is the first action we ask
- If that fails, everything else is invisible

### Prevention Strategy (In Priority Order)

#### **1. Copy & Messaging (Cheapest, Most Effective)**

**Current (bad):**
```
[Privy Modal]
Email:    [input]
Password: [input]
[Sign Up]
```

**Fixed (good):**
```
[Privy Modal with custom message]

"Join 2,800+ Crypto Twitter traders"

[Google] Sign up with Google
[Twitter] Sign up with Twitter
[Email] Or use your email address
     [input]

"We create your wallet for you. It's instant."

[Sign Up]

[Already have a wallet? Connect]
```

**Changes:**
- Social proof (2,800+ users) - lowers anxiety
- Social login first (Twitter + Google) - feels familiar
- Wallet creation is explicitly mentioned and reframed as "instant" not "scary"
- Option to connect existing wallet (for crypto natives)

#### **2. Landing Page Clarity (Prevents confusion before modal)**

**Current (okay):**
```
Hero: "Fantasy league for Crypto Twitter"
Subheadline: "Draft 5 CT influencers. Earn points. Climb the leaderboard."
CTA: [Start Playing]
```

**Fixed (better, clearer intent):**
```
Hero: "Predict Crypto Twitter. Win SOL."
Subheadline: "Draft 5 influencers, watch them earn points, climb the leaderboard."

Trust signals ABOVE CTA:
✓ Free to play, no deposit required
✓ Email or social login (no wallet install)
✓ 2,847 players right now
✓ Win real SOL

CTA: [Start Playing - Takes 90 Seconds]

Live badge: "⚡ 12 players just joined"
```

**Why this works:**
- "Predict" is stronger than "fantasy league"
- "Win SOL" is concrete and motivating
- "Email or social login" explicitly removes crypto anxiety
- "(Takes 90 seconds)" sets expectation, reduces abandonment
- "12 players just joined" creates FOMO

#### **3. Rapid Onboarding (Momentum matters)**

**Prevent user thinking, encourage action.**

Flow:
1. Land on home → See formation hero (0 seconds, passive)
2. Click "Start Playing" → Privy modal (1 second, active)
3. Email login → Wallet created (3 seconds, automatic)
4. Redirect to draft → See empty formation (2 seconds, automatic)
5. Auto-recommend 5 influencers → Formation fills (1 second, automatic)
6. Click "Lock & Submit" → Team created, see score (2 seconds, active)
7. Redirect to leaderboard → See your rank (1 second, automatic)

**Total: 90 seconds max. User feels momentum. No time to reconsider.**

#### **4. Fallback: Non-Connected Preview**

**If user closes auth modal, don't send them back to landing page.**

Instead:
```
[Modal closes]

Page shows:
"Get started in 90 seconds"

[Formation preview example team]

[@vitalik S-tier Captain]
[@raydium A-tier] [@punk_3882 A-tier]
[@defiwral B-tier] [@modular B-tier]

"This team earned 102 points this week"

"Ready to draft your own?"

[Start Playing] [See Live Scores] [Learn More]
```

**Why:** Give them 2-3 other ways to re-engage. Don't force modal on them.

#### **5. Error Handling (Technical Prevention)**

**Common failure modes:**
- Privy doesn't load → Show message: "Having trouble? Try the desktop app" + email support
- Wallet creation fails → Show message: "Your account is being set up. Try refreshing" + retry button
- Database is slow → Show skeleton loader + "Loading your profile..." (no angry error)

**Rule:** Every error should have a fallback and a path to support.

---

### Secondary Risk: Live Scoring Breaks

**The risk:**
```
User drafts team
Checks leaderboard
Scores aren't updating
Refreshes page
Sees old score
Thinks: "This is broken"
Never comes back
```

**Prevention:**
- SSE (Server-Sent Events) connection shows status: "🟢 Live" in header
- Fallback: Polling every 5 seconds if SSE fails
- Show last-updated timestamp: "Updated 2 seconds ago"
- If scores are stale (>30 sec), show banner: "Live updates paused, trying to reconnect..."
- Alert on console (for debugging judges' machines): "SSE connected" / "SSE failed, using polling"

---

### Tertiary Risk: Leaderboard Shows Wrong Data

**The risk:**
```
Judge sees leaderboard
Their rank is #1 (hypothetical, after they play)
But total score shows 0
Contradiction looks buggy
"This team didn't read the code..."
```

**Prevention:**
- QA checklist before launch:
  - [ ] Create test team, verify score calculates
  - [ ] Check leaderboard shows correct rank
  - [ ] Verify captain multiplier is visible (×1.5)
  - [ ] Test mobile leaderboard
  - [ ] Verify formation totals match leaderboard
  - [ ] Check for off-by-one errors in rank
  - [ ] Test with 0 scores, negative scores, tied scores
- Add debug info on judge's profile: "Debug: Score = [calc breakdown]"

---

### The Nuclear Option: Kill Non-Critical Features Pre-Demo

**If we have any doubt:**
- Disable real-time scoring, show static scores (they update on page refresh)
- Disable CT Feed if not perfect
- Disable Friends leaderboard if buggy
- Keep: Home, Draft, Compete (leaderboard), Profile

**Never demo broken features. Judges would rather see 3 polished pages than 5 buggy ones.**

---

### Demo Prep Checklist

**2 days before:**
- [ ] Fresh database (no stale test data)
- [ ] Auth flow tested end-to-end
- [ ] Leaderboard has 50+ test users (create via backend script)
- [ ] Live scoring updating correctly
- [ ] Mobile responsive tested on iPhone 12
- [ ] No console errors
- [ ] No TypeScript warnings

**1 day before:**
- [ ] Record a backup video (in case live demo fails)
- [ ] Test on judge's internet (slow connection)
- [ ] Disable CSS animations if they're janky
- [ ] Have backup DNS (if ct-foresight.xyz is down, have backup IP)

**During demo:**
- [ ] Have backend + frontend running
- [ ] Privy keys configured correctly
- [ ] Database is synced
- [ ] Open app in incognito mode (fresh session, no cached state)
- [ ] Have judge's mobile phone handy (in case they ask "does it work on my phone?")

---

# SUMMARY TABLE: 10 Questions at a Glance

| Question | Answer | Strategic Implication |
|----------|--------|----------------------|
| 1. What is Foresight? | Draft CT influencers, earn points, climb leaderboard | Clear, jargon-free positioning |
| 2. Who's our user? | 22-35, mobile-first, status-driven, competitive | Design for obsessive engagement, social comparison |
| 3. Core game loop? | Dashboard → Check scores → Compete → Share | Daily, real-time, social feedback loop |
| 4. MVP features (6)? | Live scoring, draft, leaderboard, CT Feed, contests, profile | Everything else can wait |
| 5. What to cut? | Settings, chat, achievements, referrals, paid contests, mobile app | Save 42-58 hours for polish |
| 6. Scoring display? | Granular breakdowns, captain bonus visible, real-time updates, contextual framing | Users understand why they earned points |
| 7. Economic model? | Free to play, prizes in SOL (shown in USD), premium later | Crypto is a feature, not the focus |
| 8. Pages/screens? | 6 main pages (Home, League, Compete, Intel, Profile, Contest Detail) | Minimal navigation, single primary action per page |
| 9. Demo story? | "Friction killed SocialFi. We solved it." | Show: landing → auth → draft → score in 3 minutes |
| 10. #1 failure mode? | Auth friction (users close Privy modal, never return) | Custom copy, social proof, momentum, fallback pages |

---

# NEXT STEPS FOR DEVELOPMENT TEAM

### Immediate (Before Demo)

1. **Messaging Audit** (1-2 hours)
   - Review all CTAs and copy
   - Apply suggestions from Section 9 (Demo Story)
   - Update Privy modal messaging
   - Add social proof numbers to landing

2. **UX Polish** (4-6 hours)
   - Verify formation visual is beautiful
   - Check mobile responsiveness
   - Test auth flow
   - Ensure live scoring works

3. **QA Blitz** (3-4 hours)
   - Follow demo prep checklist (Section 10)
   - Create test database with 50 users
   - End-to-end testing (new user from signup to score)
   - Device testing (mobile, tablet, desktop)

### Post-MVP (Not for hackathon)

- Paid contests (month 1-2)
- Advanced analytics (month 2-3)
- Mobile app (month 2-3)
- Referral system (month 3)
- Achievements & badges (month 3)

---

**This document is the UX blueprint for hackathon execution. Update daily as you build, and refer back before every demo.**

